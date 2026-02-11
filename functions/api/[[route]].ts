// Cloudflare Pages Functions — single catch-all handler for /api/*
// Uses D1 for persistence, Anthropic SDK for AI chat

interface Env {
  DB: D1Database;
  SESSION_SECRET: string;
  ANTHROPIC_API_KEY: string;
}

type Ctx = EventContext<Env, string, unknown>;

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Cookie",
  "Access-Control-Allow-Credentials": "true",
};

function json(data: unknown, status = 200, extra: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS, ...extra },
  });
}

function err(message: string, status = 400) {
  return json({ error: message }, status);
}

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function now() {
  return new Date().toISOString();
}

// ─── Auth helpers ────────────────────────────────────────────────────

function getSessionToken(request: Request): string | null {
  const cookie = request.headers.get("Cookie") || "";
  const match = cookie.match(/techsavvy_session=([^;]+)/);
  return match ? match[1] : null;
}

async function isAuthenticated(db: D1Database, request: Request): Promise<boolean> {
  const token = getSessionToken(request);
  if (!token) return false;
  const row = await db.prepare("SELECT token FROM admin_sessions WHERE token = ?").bind(token).first();
  return !!row;
}

function setSessionCookie(token: string): string {
  return `techsavvy_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`;
}

function clearSessionCookie(): string {
  return "techsavvy_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0";
}

// ─── Allowed AI models ───────────────────────────────────────────────

const ALLOWED_MODELS = [
  "claude-sonnet-4-20250514",
  "claude-3-7-sonnet-20250219",
  "claude-3-5-haiku-20241022",
];
const MAX_HISTORY_LENGTH = 20;
const MAX_ALLOWED_TOKENS = 4096;

// ─── Main handler ────────────────────────────────────────────────────

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  // CORS preflight
  if (method === "OPTIONS") {
    return new Response(null, { status: 200, headers: CORS_HEADERS });
  }

  try {
    // ─── Public routes ─────────────────────────────────────────────

    // GET /api/ai-config
    if (path === "/api/ai-config" && method === "GET") {
      const config = await env.DB.prepare("SELECT * FROM ai_config WHERE id = 'default'").first();
      if (!config) return json({ id: "default", enabled: false, model: "claude-sonnet-4-20250514", systemPrompt: "", welcomeMessage: "", maxTokens: 1024 });
      return json({
        id: config.id,
        enabled: !!config.enabled,
        model: config.model,
        systemPrompt: config.system_prompt,
        welcomeMessage: config.welcome_message,
        maxTokens: config.max_tokens,
      });
    }

    // POST /api/chat
    if (path === "/api/chat" && method === "POST") {
      const config = await env.DB.prepare("SELECT * FROM ai_config WHERE id = 'default'").first();
      if (!config || !config.enabled) {
        return err("AI agent is currently disabled.", 503);
      }

      const apiKey = env.ANTHROPIC_API_KEY;
      if (!apiKey) return err("Anthropic API key is not configured.", 500);

      const body: any = await request.json();
      const { message, history } = body || {};
      if (!message || typeof message !== "string" || message.length > 2000) {
        return err("Message is required and must be under 2000 characters.");
      }

      const messages: { role: "user" | "assistant"; content: string }[] = [];
      if (Array.isArray(history)) {
        const trimmed = history.slice(-MAX_HISTORY_LENGTH);
        for (const h of trimmed) {
          if (h.role && h.content && typeof h.content === "string") {
            messages.push({ role: h.role, content: h.content.slice(0, 2000) });
          }
        }
      }
      messages.push({ role: "user", content: message });

      const safeMaxTokens = Math.min(Number(config.max_tokens) || 1024, MAX_ALLOWED_TOKENS);

      // Use fetch to call Anthropic API directly (no SDK needed in Workers)
      const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: config.model as string,
          max_tokens: safeMaxTokens,
          system: config.system_prompt as string,
          messages,
        }),
      });

      if (!anthropicRes.ok) {
        const errText = await anthropicRes.text();
        console.error("Anthropic API error:", errText);
        return err("Failed to get AI response. Please try again.", 500);
      }

      const anthropicData: any = await anthropicRes.json();
      const text = (anthropicData.content || [])
        .filter((block: any) => block.type === "text")
        .map((block: any) => block.text)
        .join("");

      return json({ reply: text });
    }

    // POST /api/admin/login
    if (path === "/api/admin/login" && method === "POST") {
      const body: any = await request.json();
      const { password } = body || {};
      const adminPassword = env.SESSION_SECRET;
      if (!adminPassword) return err("Admin access not configured.", 500);

      if (password === adminPassword) {
        const token = genId() + genId() + genId();
        await env.DB.prepare("INSERT INTO admin_sessions (token, created_at) VALUES (?, ?)").bind(token, now()).run();
        // Clean up old sessions (older than 24h)
        await env.DB.prepare("DELETE FROM admin_sessions WHERE created_at < datetime('now', '-1 day')").run();
        return json({ success: true }, 200, { "Set-Cookie": setSessionCookie(token) });
      }
      return err("Invalid password.", 401);
    }

    // GET /api/admin/check
    if (path === "/api/admin/check" && method === "GET") {
      const authed = await isAuthenticated(env.DB, request);
      return json({ authenticated: authed });
    }

    // POST /api/admin/logout
    if (path === "/api/admin/logout" && method === "POST") {
      const token = getSessionToken(request);
      if (token) {
        await env.DB.prepare("DELETE FROM admin_sessions WHERE token = ?").bind(token).run();
      }
      return json({ success: true }, 200, { "Set-Cookie": clearSessionCookie() });
    }

    // ─── Protected routes (require auth) ───────────────────────────

    const authed = await isAuthenticated(env.DB, request);
    if (!authed) return err("Unauthorized", 401);

    // PATCH /api/ai-config
    if (path === "/api/ai-config" && method === "PATCH") {
      const body: any = await request.json();
      if (body.model && !ALLOWED_MODELS.includes(body.model)) {
        return err("Invalid model selection.");
      }
      if (body.maxTokens && body.maxTokens > MAX_ALLOWED_TOKENS) {
        body.maxTokens = MAX_ALLOWED_TOKENS;
      }

      const updates: string[] = [];
      const values: any[] = [];

      if (body.enabled !== undefined) { updates.push("enabled = ?"); values.push(body.enabled ? 1 : 0); }
      if (body.model !== undefined) { updates.push("model = ?"); values.push(body.model); }
      if (body.systemPrompt !== undefined) { updates.push("system_prompt = ?"); values.push(body.systemPrompt); }
      if (body.welcomeMessage !== undefined) { updates.push("welcome_message = ?"); values.push(body.welcomeMessage); }
      if (body.maxTokens !== undefined) { updates.push("max_tokens = ?"); values.push(body.maxTokens); }

      if (updates.length > 0) {
        const sql = `UPDATE ai_config SET ${updates.join(", ")} WHERE id = 'default'`;
        await env.DB.prepare(sql).bind(...values).run();
      }

      const config = await env.DB.prepare("SELECT * FROM ai_config WHERE id = 'default'").first();
      return json({
        id: config!.id,
        enabled: !!config!.enabled,
        model: config!.model,
        systemPrompt: config!.system_prompt,
        welcomeMessage: config!.welcome_message,
        maxTokens: config!.max_tokens,
      });
    }

    // ─── LEADS CRUD ──────────────────────────────────────────────────

    // GET /api/leads
    if (path === "/api/leads" && method === "GET") {
      const { results } = await env.DB.prepare("SELECT * FROM leads ORDER BY created_at DESC").all();
      return json(results.map(mapLead));
    }

    // POST /api/leads
    if (path === "/api/leads" && method === "POST") {
      const body: any = await request.json();
      const id = genId();
      const ts = now();
      await env.DB.prepare(
        "INSERT INTO leads (id, name, business, phone, email, package, status, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
      ).bind(id, body.name || "", body.business || "", body.phone || "", body.email || "", body.package || "terminal", body.status || "new", body.notes || "", ts, ts).run();
      const row = await env.DB.prepare("SELECT * FROM leads WHERE id = ?").bind(id).first();
      return json(mapLead(row!), 201);
    }

    // PATCH /api/leads/:id
    const leadPatchMatch = path.match(/^\/api\/leads\/([^/]+)$/);
    if (leadPatchMatch && method === "PATCH") {
      const id = leadPatchMatch[1];
      const body: any = await request.json();
      const updates: string[] = [];
      const values: any[] = [];

      for (const key of ["name", "business", "phone", "email", "package", "status", "notes"]) {
        if (body[key] !== undefined) { updates.push(`${key} = ?`); values.push(body[key]); }
      }
      updates.push("updated_at = ?"); values.push(now());

      if (updates.length > 1) {
        await env.DB.prepare(`UPDATE leads SET ${updates.join(", ")} WHERE id = ?`).bind(...values, id).run();
      }
      const row = await env.DB.prepare("SELECT * FROM leads WHERE id = ?").bind(id).first();
      if (!row) return err("Lead not found", 404);
      return json(mapLead(row));
    }

    // DELETE /api/leads/:id
    if (leadPatchMatch && method === "DELETE") {
      const id = leadPatchMatch[1];
      await env.DB.prepare("DELETE FROM leads WHERE id = ?").bind(id).run();
      return json({ success: true });
    }

    // ─── CLIENTS CRUD ────────────────────────────────────────────────

    // GET /api/clients
    if (path === "/api/clients" && method === "GET") {
      const { results } = await env.DB.prepare("SELECT * FROM clients ORDER BY business ASC").all();
      return json(results.map(mapClient));
    }

    // POST /api/clients
    if (path === "/api/clients" && method === "POST") {
      const body: any = await request.json();
      const id = genId();
      await env.DB.prepare(
        "INSERT INTO clients (id, name, business, phone, email, package, maintenance, website_url, website_status, terminal_id, monthly_volume, start_date, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
      ).bind(
        id, body.name || "", body.business || "", body.phone || "", body.email || "",
        body.package || "terminal", body.maintenance || "none", body.websiteUrl || "",
        body.websiteStatus || "not-started", body.terminalId || "",
        body.monthlyVolume || 0, body.startDate || "", body.notes || ""
      ).run();
      const row = await env.DB.prepare("SELECT * FROM clients WHERE id = ?").bind(id).first();
      return json(mapClient(row!), 201);
    }

    // PATCH /api/clients/:id
    const clientPatchMatch = path.match(/^\/api\/clients\/([^/]+)$/);
    if (clientPatchMatch && method === "PATCH") {
      const id = clientPatchMatch[1];
      const body: any = await request.json();
      const fieldMap: Record<string, string> = {
        name: "name", business: "business", phone: "phone", email: "email",
        package: "package", maintenance: "maintenance", websiteUrl: "website_url",
        websiteStatus: "website_status", terminalId: "terminal_id",
        monthlyVolume: "monthly_volume", startDate: "start_date", notes: "notes",
      };
      const updates: string[] = [];
      const values: any[] = [];
      for (const [jsKey, dbCol] of Object.entries(fieldMap)) {
        if (body[jsKey] !== undefined) { updates.push(`${dbCol} = ?`); values.push(body[jsKey]); }
      }
      if (updates.length > 0) {
        await env.DB.prepare(`UPDATE clients SET ${updates.join(", ")} WHERE id = ?`).bind(...values, id).run();
      }
      const row = await env.DB.prepare("SELECT * FROM clients WHERE id = ?").bind(id).first();
      if (!row) return err("Client not found", 404);
      return json(mapClient(row));
    }

    // DELETE /api/clients/:id
    if (clientPatchMatch && method === "DELETE") {
      const id = clientPatchMatch[1];
      await env.DB.prepare("DELETE FROM clients WHERE id = ?").bind(id).run();
      return json({ success: true });
    }

    // ─── REVENUE CRUD ────────────────────────────────────────────────

    // GET /api/revenue
    if (path === "/api/revenue" && method === "GET") {
      const { results } = await env.DB.prepare("SELECT * FROM revenue ORDER BY date DESC").all();
      return json(results.map(mapRevenue));
    }

    // POST /api/revenue
    if (path === "/api/revenue" && method === "POST") {
      const body: any = await request.json();
      const id = genId();
      await env.DB.prepare(
        "INSERT INTO revenue (id, date, type, description, amount, client_id, recurring) VALUES (?, ?, ?, ?, ?, ?, ?)"
      ).bind(id, body.date || "", body.type || "other", body.description || "", body.amount || 0, body.clientId || "", body.recurring ? 1 : 0).run();
      const row = await env.DB.prepare("SELECT * FROM revenue WHERE id = ?").bind(id).first();
      return json(mapRevenue(row!), 201);
    }

    // PATCH /api/revenue/:id
    const revPatchMatch = path.match(/^\/api\/revenue\/([^/]+)$/);
    if (revPatchMatch && method === "PATCH") {
      const id = revPatchMatch[1];
      const body: any = await request.json();
      const fieldMap: Record<string, string> = {
        date: "date", type: "type", description: "description",
        amount: "amount", clientId: "client_id",
      };
      const updates: string[] = [];
      const values: any[] = [];
      for (const [jsKey, dbCol] of Object.entries(fieldMap)) {
        if (body[jsKey] !== undefined) { updates.push(`${dbCol} = ?`); values.push(body[jsKey]); }
      }
      if (body.recurring !== undefined) { updates.push("recurring = ?"); values.push(body.recurring ? 1 : 0); }
      if (updates.length > 0) {
        await env.DB.prepare(`UPDATE revenue SET ${updates.join(", ")} WHERE id = ?`).bind(...values, id).run();
      }
      const row = await env.DB.prepare("SELECT * FROM revenue WHERE id = ?").bind(id).first();
      if (!row) return err("Revenue entry not found", 404);
      return json(mapRevenue(row));
    }

    // DELETE /api/revenue/:id
    if (revPatchMatch && method === "DELETE") {
      const id = revPatchMatch[1];
      await env.DB.prepare("DELETE FROM revenue WHERE id = ?").bind(id).run();
      return json({ success: true });
    }

    // ─── TASKS CRUD ──────────────────────────────────────────────────

    // GET /api/tasks
    if (path === "/api/tasks" && method === "GET") {
      const { results } = await env.DB.prepare("SELECT * FROM tasks ORDER BY completed ASC, priority ASC, due_date ASC").all();
      return json(results.map(mapTask));
    }

    // POST /api/tasks
    if (path === "/api/tasks" && method === "POST") {
      const body: any = await request.json();
      const id = genId();
      await env.DB.prepare(
        "INSERT INTO tasks (id, title, due_date, priority, completed, linked_to, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
      ).bind(id, body.title || "", body.dueDate || "", body.priority || "medium", body.completed ? 1 : 0, body.linkedTo || "", now()).run();
      const row = await env.DB.prepare("SELECT * FROM tasks WHERE id = ?").bind(id).first();
      return json(mapTask(row!), 201);
    }

    // PATCH /api/tasks/:id
    const taskPatchMatch = path.match(/^\/api\/tasks\/([^/]+)$/);
    if (taskPatchMatch && method === "PATCH") {
      const id = taskPatchMatch[1];
      const body: any = await request.json();
      const updates: string[] = [];
      const values: any[] = [];
      if (body.title !== undefined) { updates.push("title = ?"); values.push(body.title); }
      if (body.dueDate !== undefined) { updates.push("due_date = ?"); values.push(body.dueDate); }
      if (body.priority !== undefined) { updates.push("priority = ?"); values.push(body.priority); }
      if (body.completed !== undefined) { updates.push("completed = ?"); values.push(body.completed ? 1 : 0); }
      if (body.linkedTo !== undefined) { updates.push("linked_to = ?"); values.push(body.linkedTo); }
      if (updates.length > 0) {
        await env.DB.prepare(`UPDATE tasks SET ${updates.join(", ")} WHERE id = ?`).bind(...values, id).run();
      }
      const row = await env.DB.prepare("SELECT * FROM tasks WHERE id = ?").bind(id).first();
      if (!row) return err("Task not found", 404);
      return json(mapTask(row));
    }

    // DELETE /api/tasks/:id
    if (taskPatchMatch && method === "DELETE") {
      const id = taskPatchMatch[1];
      await env.DB.prepare("DELETE FROM tasks WHERE id = ?").bind(id).run();
      return json({ success: true });
    }

    return err("Not found", 404);
  } catch (e: any) {
    console.error("API error:", e);
    return err(e.message || "Internal server error", 500);
  }
};

// ─── Row mappers (snake_case DB → camelCase API) ─────────────────────

function mapLead(row: Record<string, unknown>) {
  return {
    id: row.id,
    name: row.name,
    business: row.business,
    phone: row.phone,
    email: row.email,
    package: row.package,
    status: row.status,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapClient(row: Record<string, unknown>) {
  return {
    id: row.id,
    name: row.name,
    business: row.business,
    phone: row.phone,
    email: row.email,
    package: row.package,
    maintenance: row.maintenance,
    websiteUrl: row.website_url,
    websiteStatus: row.website_status,
    terminalId: row.terminal_id,
    monthlyVolume: row.monthly_volume,
    startDate: row.start_date,
    notes: row.notes,
  };
}

function mapRevenue(row: Record<string, unknown>) {
  return {
    id: row.id,
    date: row.date,
    type: row.type,
    description: row.description,
    amount: row.amount,
    clientId: row.client_id,
    recurring: !!row.recurring,
  };
}

function mapTask(row: Record<string, unknown>) {
  return {
    id: row.id,
    title: row.title,
    dueDate: row.due_date,
    priority: row.priority,
    completed: !!row.completed,
    linkedTo: row.linked_to,
    createdAt: row.created_at,
  };
}
