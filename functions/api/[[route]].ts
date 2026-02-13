// Cloudflare Pages Functions — single catch-all handler for /api/*
// Uses D1 for persistence, Anthropic SDK for AI chat

interface Env {
  DB: D1Database;
  SESSION_SECRET: string;
  ANTHROPIC_API_KEY: string;
  RESEND_API_KEY: string;
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

async function ensureSessionsTable(db: D1Database) {
  await db.prepare(
    "CREATE TABLE IF NOT EXISTS admin_sessions (token TEXT PRIMARY KEY, created_at TEXT NOT NULL)"
  ).run();
}

async function ensureAdminSettingsTable(db: D1Database) {
  await db.prepare(
    "CREATE TABLE IF NOT EXISTS admin_settings (id TEXT PRIMARY KEY DEFAULT 'default', password_hash TEXT NOT NULL DEFAULT '', updated_at TEXT NOT NULL)"
  ).run();
}

async function getAdminSettings(db: D1Database) {
  try {
    return await db.prepare("SELECT * FROM admin_settings WHERE id = 'default'").first();
  } catch {
    return null;
  }
}

function getSessionToken(request: Request): string | null {
  const cookie = request.headers.get("Cookie") || "";
  const match = cookie.match(/techsavvy_session=([^;]+)/);
  return match ? match[1] : null;
}

async function isAuthenticated(db: D1Database, request: Request): Promise<boolean> {
  const token = getSessionToken(request);
  if (!token) return false;
  try {
    const row = await db.prepare("SELECT token FROM admin_sessions WHERE token = ?").bind(token).first();
    return !!row;
  } catch {
    await ensureSessionsTable(db);
    const row = await db.prepare("SELECT token FROM admin_sessions WHERE token = ?").bind(token).first();
    return !!row;
  }
}

function setSessionCookie(token: string): string {
  return `techsavvy_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`;
}

function clearSessionCookie(): string {
  return "techsavvy_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0";
}

// Web Crypto password hashing (Workers-compatible)
async function hashPassword(password: string): Promise<string> {
  const salt = genId() + genId();
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt: enc.encode(salt), iterations: 100000, hash: "SHA-256" }, keyMaterial, 256);
  const hash = Array.from(new Uint8Array(bits)).map(b => b.toString(16).padStart(2, "0")).join("");
  return `${salt}:${hash}`;
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt: enc.encode(salt), iterations: 100000, hash: "SHA-256" }, keyMaterial, 256);
  const computed = Array.from(new Uint8Array(bits)).map(b => b.toString(16).padStart(2, "0")).join("");
  return computed === hash;
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

    // GET /api/admin/setup-status
    if (path === "/api/admin/setup-status" && method === "GET") {
      const settings = await getAdminSettings(env.DB);
      const needsSetup = !settings || !settings.password_hash;
      return json({ needsSetup });
    }

    // POST /api/admin/setup (first-time password creation)
    if (path === "/api/admin/setup" && method === "POST") {
      await ensureAdminSettingsTable(env.DB);
      await ensureSessionsTable(env.DB);
      const settings = await getAdminSettings(env.DB);
      if (settings && settings.password_hash) {
        return err("Password already configured. Use change-password instead.", 400);
      }
      const body: any = await request.json();
      const { password } = body || {};
      if (!password || typeof password !== "string" || password.length < 6) {
        return err("Password must be at least 6 characters.");
      }
      const ts = now();
      const pw = await hashPassword(password);
      await env.DB.prepare(
        "INSERT INTO admin_settings (id, password_hash, updated_at) VALUES ('default', ?, ?) ON CONFLICT(id) DO UPDATE SET password_hash = ?, updated_at = ?"
      ).bind(pw, ts, pw, ts).run();
      const token = genId() + genId() + genId();
      await env.DB.prepare("INSERT INTO admin_sessions (token, created_at) VALUES (?, ?)").bind(token, ts).run();
      return json({ success: true }, 200, { "Set-Cookie": setSessionCookie(token) });
    }

    // POST /api/admin/login
    if (path === "/api/admin/login" && method === "POST") {
      await ensureSessionsTable(env.DB);
      const body: any = await request.json();
      const { password } = body || {};

      // Check stored password first
      const settings = await getAdminSettings(env.DB);
      if (settings && settings.password_hash) {
        if (await verifyPassword(password, settings.password_hash as string)) {
          const token = genId() + genId() + genId();
          await env.DB.prepare("INSERT INTO admin_sessions (token, created_at) VALUES (?, ?)").bind(token, now()).run();
          await env.DB.prepare("DELETE FROM admin_sessions WHERE created_at < datetime('now', '-1 day')").run();
          return json({ success: true }, 200, { "Set-Cookie": setSessionCookie(token) });
        }
        return err("Invalid password.", 401);
      }

      // Fallback to SESSION_SECRET env var
      const adminPassword = env.SESSION_SECRET;
      if (adminPassword && password === adminPassword) {
        const token = genId() + genId() + genId();
        await env.DB.prepare("INSERT INTO admin_sessions (token, created_at) VALUES (?, ?)").bind(token, now()).run();
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
        try { await env.DB.prepare("DELETE FROM admin_sessions WHERE token = ?").bind(token).run(); } catch {}
      }
      return json({ success: true }, 200, { "Set-Cookie": clearSessionCookie() });
    }

    // POST /api/admin/change-password (requires auth)
    if (path === "/api/admin/change-password" && method === "POST") {
      const authed = await isAuthenticated(env.DB, request);
      if (!authed) return err("Unauthorized", 401);
      const body: any = await request.json();
      const { currentPassword, newPassword } = body || {};
      if (!newPassword || typeof newPassword !== "string" || newPassword.length < 6) {
        return err("New password must be at least 6 characters.");
      }
      const settings = await getAdminSettings(env.DB);
      if (settings && settings.password_hash) {
        if (!await verifyPassword(currentPassword, settings.password_hash as string)) {
          return err("Current password is incorrect.", 401);
        }
      } else {
        const envPw = env.SESSION_SECRET;
        if (currentPassword !== envPw) return err("Current password is incorrect.", 401);
      }
      await ensureAdminSettingsTable(env.DB);
      const ts = now();
      const pw = await hashPassword(newPassword);
      await env.DB.prepare(
        "INSERT INTO admin_settings (id, password_hash, updated_at) VALUES ('default', ?, ?) ON CONFLICT(id) DO UPDATE SET password_hash = ?, updated_at = ?"
      ).bind(pw, ts, pw, ts).run();
      return json({ success: true });
    }

    // POST /api/contact-leads (public — contact form submission)
    if (path === "/api/contact-leads" && method === "POST") {
      const body: any = await request.json();
      const id = genId();
      const ts = now();
      try {
        await env.DB.prepare(
          "INSERT INTO contact_leads (id, business_name, contact_name, phone, email, plan, high_risk, monthly_processing, best_contact_time, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        ).bind(id, body.businessName || "", body.contactName || "", body.phone || "", body.email || "", body.plan || "", body.highRisk ? 1 : 0, body.monthlyProcessing || "", body.bestContactTime || "", ts).run();
        const row = await env.DB.prepare("SELECT * FROM contact_leads WHERE id = ?").bind(id).first();
        return json(mapContactLead(row!), 201);
      } catch (e: any) {
        // Table might not exist yet — create it and retry
        await env.DB.prepare(`CREATE TABLE IF NOT EXISTS contact_leads (
          id TEXT PRIMARY KEY, business_name TEXT NOT NULL DEFAULT '', contact_name TEXT NOT NULL DEFAULT '',
          phone TEXT NOT NULL DEFAULT '', email TEXT NOT NULL DEFAULT '', plan TEXT NOT NULL DEFAULT '',
          high_risk INTEGER NOT NULL DEFAULT 0, monthly_processing TEXT NOT NULL DEFAULT '',
          best_contact_time TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL
        )`).run();
        await env.DB.prepare(
          "INSERT INTO contact_leads (id, business_name, contact_name, phone, email, plan, high_risk, monthly_processing, best_contact_time, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        ).bind(id, body.businessName || "", body.contactName || "", body.phone || "", body.email || "", body.plan || "", body.highRisk ? 1 : 0, body.monthlyProcessing || "", body.bestContactTime || "", ts).run();
        const row = await env.DB.prepare("SELECT * FROM contact_leads WHERE id = ?").bind(id).first();
        return json(mapContactLead(row!), 201);
      }
    }

    // POST /api/email/inbound (public webhook — Resend sends inbound emails here)
    if (path === "/api/email/inbound" && method === "POST") {
      const body: any = await request.json();
      const { from, to, subject, text, html } = body;
      if (!from) return err("Invalid webhook payload");

      const ts = now();
      const threadId = genId();
      const msgId = genId();

      // Extract sender info
      const fromMatch = from.match(/^(.+)\s*<(.+)>$/);
      const fromName = fromMatch ? fromMatch[1].trim() : from;
      const fromEmail = fromMatch ? fromMatch[2] : from;

      // Check for existing thread by email
      const existingThread = await env.DB.prepare(
        "SELECT id FROM email_threads WHERE contact_email = ? ORDER BY last_message_at DESC LIMIT 1"
      ).bind(fromEmail).first();

      const tid = existingThread ? (existingThread.id as string) : threadId;

      if (existingThread) {
        await env.DB.prepare("UPDATE email_threads SET last_message_at = ?, unread = 1, status = 'open' WHERE id = ?").bind(ts, tid).run();
      } else {
        await env.DB.prepare(
          "INSERT INTO email_threads (id, subject, lead_id, contact_email, contact_name, source, status, unread, last_message_at, created_at) VALUES (?, ?, '', ?, ?, 'direct', 'open', 1, ?, ?)"
        ).bind(tid, subject || "(no subject)", fromEmail, fromName, ts, ts).run();
      }

      await env.DB.prepare(
        "INSERT INTO email_messages (id, thread_id, direction, from_email, from_name, to_email, subject, body, html_body, resend_id, status, sent_at) VALUES (?, ?, 'inbound', ?, ?, ?, ?, ?, ?, '', 'received', ?)"
      ).bind(msgId, tid, fromEmail, fromName, to || "contact@techsavvyhawaii.com", subject || "", text || "", html || "", ts).run();

      return json({ success: true, threadId: tid });
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
        "INSERT INTO tasks (id, title, due_date, priority, completed, linked_to, assignee, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
      ).bind(id, body.title || "", body.dueDate || "", body.priority || "medium", body.completed ? 1 : 0, body.linkedTo || "", body.assignee || "", now()).run();
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
      if (body.assignee !== undefined) { updates.push("assignee = ?"); values.push(body.assignee); }
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

    // ─── EMAIL CONFIG ──────────────────────────────────────────────────

    // GET /api/email/config
    if (path === "/api/email/config" && method === "GET") {
      try {
        const row = await env.DB.prepare("SELECT * FROM resend_config WHERE id = 'default'").first();
        if (!row) {
          return json({ enabled: false, fromEmail: "contact@techsavvyhawaii.com", fromName: "TechSavvy Hawaii", autoConfirmEnabled: true, forwardCopyTo: "" });
        }
        return json({
          enabled: !!row.enabled,
          fromEmail: row.from_email,
          fromName: row.from_name,
          autoConfirmEnabled: !!row.auto_confirm_enabled,
          forwardCopyTo: row.forward_copy_to || "",
        });
      } catch {
        return json({ enabled: false, fromEmail: "contact@techsavvyhawaii.com", fromName: "TechSavvy Hawaii", autoConfirmEnabled: true, forwardCopyTo: "" });
      }
    }

    // PATCH /api/email/config
    if (path === "/api/email/config" && method === "PATCH") {
      const body: any = await request.json();
      const ts = now();
      // Ensure table exists
      await env.DB.prepare(`CREATE TABLE IF NOT EXISTS resend_config (
        id TEXT PRIMARY KEY DEFAULT 'default',
        enabled INTEGER NOT NULL DEFAULT 0,
        from_email TEXT NOT NULL DEFAULT 'contact@techsavvyhawaii.com',
        from_name TEXT NOT NULL DEFAULT 'TechSavvy Hawaii',
        auto_confirm_enabled INTEGER NOT NULL DEFAULT 1,
        forward_copy_to TEXT NOT NULL DEFAULT '',
        updated_at TEXT NOT NULL DEFAULT ''
      )`).run();

      const existing = await env.DB.prepare("SELECT id FROM resend_config WHERE id = 'default'").first();
      if (existing) {
        const updates: string[] = [];
        const values: any[] = [];
        if (body.enabled !== undefined) { updates.push("enabled = ?"); values.push(body.enabled ? 1 : 0); }
        if (body.fromEmail !== undefined) { updates.push("from_email = ?"); values.push(body.fromEmail); }
        if (body.fromName !== undefined) { updates.push("from_name = ?"); values.push(body.fromName); }
        if (body.autoConfirmEnabled !== undefined) { updates.push("auto_confirm_enabled = ?"); values.push(body.autoConfirmEnabled ? 1 : 0); }
        if (body.forwardCopyTo !== undefined) { updates.push("forward_copy_to = ?"); values.push(body.forwardCopyTo); }
        updates.push("updated_at = ?"); values.push(ts);
        await env.DB.prepare(`UPDATE resend_config SET ${updates.join(", ")} WHERE id = 'default'`).bind(...values).run();
      } else {
        await env.DB.prepare(
          "INSERT INTO resend_config (id, enabled, from_email, from_name, auto_confirm_enabled, forward_copy_to, updated_at) VALUES ('default', ?, ?, ?, ?, ?, ?)"
        ).bind(
          body.enabled ? 1 : 0,
          body.fromEmail || "contact@techsavvyhawaii.com",
          body.fromName || "TechSavvy Hawaii",
          body.autoConfirmEnabled !== false ? 1 : 0,
          body.forwardCopyTo || "",
          ts
        ).run();
      }
      const row = await env.DB.prepare("SELECT * FROM resend_config WHERE id = 'default'").first();
      return json({
        enabled: !!row!.enabled,
        fromEmail: row!.from_email,
        fromName: row!.from_name,
        autoConfirmEnabled: !!row!.auto_confirm_enabled,
        forwardCopyTo: row!.forward_copy_to || "",
      });
    }

    // ─── EMAIL THREADS (INBOX) ──────────────────────────────────────────

    // GET /api/email/threads
    if (path === "/api/email/threads" && method === "GET") {
      try {
        const { results } = await env.DB.prepare("SELECT * FROM email_threads ORDER BY last_message_at DESC").all();
        return json(results.map(mapThread));
      } catch {
        return json([]);
      }
    }

    // GET /api/email/threads/:id
    const threadMatch = path.match(/^\/api\/email\/threads\/([^/]+)$/);
    if (threadMatch && method === "GET") {
      const id = threadMatch[1];
      const thread = await env.DB.prepare("SELECT * FROM email_threads WHERE id = ?").bind(id).first();
      if (!thread) return err("Thread not found", 404);
      const { results: messages } = await env.DB.prepare("SELECT * FROM email_messages WHERE thread_id = ? ORDER BY sent_at ASC").bind(id).all();
      // Mark as read
      if (thread.unread) {
        await env.DB.prepare("UPDATE email_threads SET unread = 0 WHERE id = ?").bind(id).run();
      }
      return json({ ...mapThread(thread), messages: messages.map(mapMessage) });
    }

    // DELETE /api/email/threads/:id
    if (threadMatch && method === "DELETE") {
      const id = threadMatch[1];
      await env.DB.prepare("DELETE FROM email_messages WHERE thread_id = ?").bind(id).run();
      await env.DB.prepare("DELETE FROM email_threads WHERE id = ?").bind(id).run();
      return json({ success: true });
    }

    // PATCH /api/email/threads/:id
    if (threadMatch && method === "PATCH") {
      const id = threadMatch[1];
      const body: any = await request.json();
      const updates: string[] = [];
      const values: any[] = [];
      if (body.unread !== undefined) { updates.push("unread = ?"); values.push(body.unread ? 1 : 0); }
      if (body.status !== undefined) { updates.push("status = ?"); values.push(body.status); }
      if (updates.length > 0) {
        await env.DB.prepare(`UPDATE email_threads SET ${updates.join(", ")} WHERE id = ?`).bind(...values, id).run();
      }
      const row = await env.DB.prepare("SELECT * FROM email_threads WHERE id = ?").bind(id).first();
      if (!row) return err("Thread not found", 404);
      return json(mapThread(row));
    }

    // GET /api/email/stats
    if (path === "/api/email/stats" && method === "GET") {
      try {
        const { results } = await env.DB.prepare("SELECT * FROM email_threads").all();
        const threads = results || [];
        return json({
          total: threads.length,
          unread: threads.filter((t: any) => t.unread).length,
          outreach: threads.filter((t: any) => t.source === "outreach").length,
          replies: threads.filter((t: any) => t.source === "outreach-reply").length,
          directInbound: threads.filter((t: any) => t.source === "direct").length,
          contactForm: threads.filter((t: any) => t.source === "contact-form").length,
        });
      } catch {
        return json({ total: 0, unread: 0, outreach: 0, replies: 0, directInbound: 0, contactForm: 0 });
      }
    }

    // POST /api/email/send
    if (path === "/api/email/send" && method === "POST") {
      const body: any = await request.json();
      const { to, subject, html, text, threadId } = body;
      if (!to || !subject || !html) return err("to, subject, and html are required");

      const apiKey = env.RESEND_API_KEY;
      if (!apiKey) return err("RESEND_API_KEY not configured", 500);

      // Get email config
      let fromEmail = "contact@techsavvyhawaii.com";
      let fromName = "TechSavvy Hawaii";
      try {
        const cfg = await env.DB.prepare("SELECT * FROM resend_config WHERE id = 'default'").first();
        if (cfg && cfg.enabled) {
          fromEmail = (cfg.from_email as string) || fromEmail;
          fromName = (cfg.from_name as string) || fromName;
        }
      } catch { /* use defaults */ }

      // Send via Resend API
      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          from: `${fromName} <${fromEmail}>`,
          to: [to],
          subject,
          html,
          text: text || undefined,
        }),
      });

      if (!resendRes.ok) {
        const errText = await resendRes.text();
        console.error("Resend API error:", errText);
        return err("Failed to send email", 500);
      }

      const resendData: any = await resendRes.json();
      const msgId = genId();
      const ts = now();

      // Create or update thread
      let tid = threadId;
      if (!tid) {
        tid = genId();
        await env.DB.prepare(
          "INSERT INTO email_threads (id, subject, lead_id, contact_email, contact_name, source, status, unread, last_message_at, created_at) VALUES (?, ?, '', ?, ?, 'direct', 'open', 0, ?, ?)"
        ).bind(tid, subject, to, to, ts, ts).run();
      } else {
        await env.DB.prepare("UPDATE email_threads SET last_message_at = ?, status = 'replied' WHERE id = ?").bind(ts, tid).run();
      }

      // Save outbound message
      await env.DB.prepare(
        "INSERT INTO email_messages (id, thread_id, direction, from_email, from_name, to_email, subject, body, html_body, resend_id, status, sent_at) VALUES (?, ?, 'outbound', ?, ?, ?, ?, ?, ?, ?, 'sent', ?)"
      ).bind(msgId, tid, fromEmail, fromName, to, subject, text || "", html, resendData.id || "", ts).run();

      return json({ success: true, threadId: tid, messageId: msgId });
    }

    // POST /api/email/inbound (webhook — no auth required, handled above auth check)

    // ─── ACTIVITY LOG ──────────────────────────────────────────────────

    if (path === "/api/activity" && method === "GET") {
      try {
        const { results } = await env.DB.prepare("SELECT * FROM activity_log ORDER BY timestamp DESC LIMIT 50").all();
        return json(results.map(mapActivity));
      } catch {
        return json([]);
      }
    }

    // ─── SCHEDULE ITEMS ─────────────────────────────────────────────────

    if (path === "/api/schedule" && method === "GET") {
      try {
        const { results } = await env.DB.prepare("SELECT * FROM schedule_items ORDER BY date ASC, time ASC").all();
        return json(results.map(mapSchedule));
      } catch {
        return json([]);
      }
    }

    const schedMatch = path.match(/^\/api\/schedule\/([^/]+)$/);
    if (schedMatch && method === "PATCH") {
      const id = schedMatch[1];
      const body: any = await request.json();
      const updates: string[] = [];
      const values: any[] = [];
      if (body.status !== undefined) { updates.push("status = ?"); values.push(body.status); }
      if (body.title !== undefined) { updates.push("title = ?"); values.push(body.title); }
      if (updates.length > 0) {
        await env.DB.prepare(`UPDATE schedule_items SET ${updates.join(", ")} WHERE id = ?`).bind(...values, id).run();
      }
      const row = await env.DB.prepare("SELECT * FROM schedule_items WHERE id = ?").bind(id).first();
      if (!row) return err("Schedule item not found", 404);
      return json(mapSchedule(row));
    }

    // ─── DASHBOARD BRIEFING ─────────────────────────────────────────────

    if (path === "/api/dashboard/briefing" && method === "GET") {
      const todayStr = new Date().toISOString().split("T")[0];
      const { results: allLeads } = await env.DB.prepare("SELECT * FROM leads").all();
      const { results: allTasks } = await env.DB.prepare("SELECT * FROM tasks").all();
      const { results: allRevenue } = await env.DB.prepare("SELECT * FROM revenue").all();
      const { results: allClients } = await env.DB.prepare("SELECT * FROM clients").all();

      let schedItems: any[] = [];
      try { const r = await env.DB.prepare("SELECT * FROM schedule_items WHERE date = ?").bind(todayStr).all(); schedItems = r.results || []; } catch { /* table may not exist */ }

      let planItems: any[] = [];
      try { const r = await env.DB.prepare("SELECT * FROM plan_items").all(); planItems = r.results || []; } catch { /* table may not exist */ }

      const leads = allLeads || [];
      const tasks = allTasks || [];
      const revenue = allRevenue || [];
      const clients = allClients || [];

      // Stale leads (no update in 7+ days, active pipeline)
      const activeStatuses = ["new", "contacted", "qualified", "statement-requested", "statement-received", "analysis-delivered", "proposal-sent", "negotiation"];
      const staleLeads = leads.filter((l: any) => {
        if (!activeStatuses.includes(l.status)) return false;
        const daysSince = Math.floor((Date.now() - new Date(l.updated_at).getTime()) / 86400000);
        return daysSince >= 7;
      }).map((l: any) => ({
        id: l.id, name: l.name, business: l.business, status: l.status,
        daysSinceUpdate: Math.floor((Date.now() - new Date(l.updated_at).getTime()) / 86400000),
        nextStep: "",
      }));

      // Follow-ups due
      const followUpsDue = leads.filter((l: any) => {
        if (!activeStatuses.includes(l.status)) return false;
        if (!l.next_follow_up) return false;
        return l.next_follow_up <= todayStr;
      }).map((l: any) => ({
        id: l.id, name: l.name, business: l.business, status: l.status,
        nextStep: l.next_follow_up || "", overdue: l.next_follow_up < todayStr,
      }));

      // Upcoming follow-ups (next 7 days)
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      const nextWeekStr = nextWeek.toISOString().split("T")[0];
      const upcomingFollowUps = leads.filter((l: any) => {
        if (!activeStatuses.includes(l.status)) return false;
        return l.next_follow_up && l.next_follow_up > todayStr && l.next_follow_up <= nextWeekStr;
      }).map((l: any) => ({
        id: l.id, name: l.name, business: l.business, status: l.status, nextStep: l.next_follow_up || "",
      }));

      // Overdue tasks
      const overdueTasks = tasks.filter((t: any) => !t.completed && t.due_date && t.due_date < todayStr).map((t: any) => ({
        id: t.id, title: t.title, dueDate: t.due_date, priority: t.priority,
      }));

      // Today's tasks
      const todayTasks = tasks.filter((t: any) => !t.completed && t.due_date === todayStr).map((t: any) => ({
        id: t.id, title: t.title, priority: t.priority,
      }));

      // Today's schedule
      const todaySchedule = schedItems.map((s: any) => ({
        id: s.id, title: s.title, time: s.time, category: s.category,
      }));

      // Revenue calculations
      const nowDate = new Date();
      const thisMonth = revenue.filter((r: any) => {
        const d = new Date(r.date as string);
        return d.getMonth() === nowDate.getMonth() && d.getFullYear() === nowDate.getFullYear();
      });
      const lastMonthDate = new Date(nowDate.getFullYear(), nowDate.getMonth() - 1, 1);
      const lastMonth = revenue.filter((r: any) => {
        const d = new Date(r.date as string);
        return d.getMonth() === lastMonthDate.getMonth() && d.getFullYear() === lastMonthDate.getFullYear();
      });
      const thisMonthTotal = thisMonth.reduce((s: number, r: any) => s + (Number(r.amount) || 0), 0);
      const lastMonthTotal = lastMonth.reduce((s: number, r: any) => s + (Number(r.amount) || 0), 0);
      const mrr = revenue.filter((r: any) => r.recurring).reduce((s: number, r: any) => s + (Number(r.amount) || 0), 0);

      // Pipeline counts
      const pipeline = {
        new: leads.filter((l: any) => l.status === "new").length,
        contacted: leads.filter((l: any) => l.status === "contacted").length,
        qualified: leads.filter((l: any) => l.status === "qualified").length,
        proposalSent: leads.filter((l: any) => l.status === "proposal-sent").length,
        negotiation: leads.filter((l: any) => l.status === "negotiation").length,
        totalActive: leads.filter((l: any) => activeStatuses.includes(l.status)).length,
        wonThisMonth: leads.filter((l: any) => {
          if (l.status !== "won") return false;
          const d = new Date(l.updated_at as string);
          return d.getMonth() === nowDate.getMonth() && d.getFullYear() === nowDate.getFullYear();
        }).length,
      };

      // Client alerts
      const clientAlerts = clients.filter((c: any) => {
        const issues: string[] = [];
        if (c.website_status === "not-started" && c.package !== "terminal") issues.push("Website not started");
        if ((Number(c.monthly_volume) || 0) < 5000) issues.push("Low volume");
        return issues.length > 0;
      }).map((c: any) => ({
        id: c.id, business: c.business,
        issues: [
          ...(c.website_status === "not-started" && c.package !== "terminal" ? ["Website not started"] : []),
          ...((Number(c.monthly_volume) || 0) < 5000 ? ["Low volume"] : []),
        ],
      })).slice(0, 5);

      // Plan progress
      const planTotal = planItems.length;
      const planCompleted = planItems.filter((p: any) => p.completed).length;
      const planPercent = planTotal > 0 ? Math.round((planCompleted / planTotal) * 100) : 0;

      return json({
        date: todayStr,
        staleLeads, followUpsDue, upcomingFollowUps,
        overdueTasks, todayTasks, todaySchedule,
        revenue: { thisMonth: thisMonthTotal, lastMonth: lastMonthTotal, mrr },
        pipeline, clientAlerts,
        planProgress: { total: planTotal, completed: planCompleted, percent: planPercent },
      });
    }

    // ─── TEAM MEMBERS ──────────────────────────────────────────────────

    if (path === "/api/team-members" && method === "GET") {
      try {
        const { results } = await env.DB.prepare("SELECT * FROM team_members ORDER BY name ASC").all();
        return json(results.map(mapTeamMember));
      } catch {
        return json([]);
      }
    }

    // ─── CONTACT LEADS ──────────────────────────────────────────────────

    if (path === "/api/contact-leads" && method === "GET") {
      try {
        const { results } = await env.DB.prepare("SELECT * FROM contact_leads ORDER BY created_at DESC").all();
        return json(results.map(mapContactLead));
      } catch {
        return json([]);
      }
    }

    // ─── OPPORTUNITIES (DEALS) ────────────────────────────────────────

    if (path === "/api/opportunities" && method === "GET") {
      try {
        const { results } = await env.DB.prepare("SELECT * FROM opportunities ORDER BY updated_at DESC").all();
        const { results: leadRows } = await env.DB.prepare("SELECT id, name, business FROM leads").all();
        const leadMap: Record<string, any> = {};
        (leadRows || []).forEach((l: any) => { leadMap[l.id] = l; });

        let teamMap: Record<string, any> = {};
        try {
          const { results: teamRows } = await env.DB.prepare("SELECT id, name FROM team_members").all();
          (teamRows || []).forEach((t: any) => { teamMap[t.id] = t; });
        } catch { /* table may not exist */ }

        return json((results || []).map((o: any) => ({
          id: o.id, title: o.title, leadId: o.lead_id || "", clientId: o.client_id || "",
          stage: o.stage, value: Number(o.value) || 0, probability: Number(o.probability) || 0,
          weightedValue: (Number(o.value) || 0) * ((Number(o.probability) || 0) / 100),
          expectedCloseDate: o.expected_close_date || "", actualCloseDate: o.actual_close_date || "",
          lossReason: o.loss_reason || "", notes: o.notes || "", assigneeId: o.assignee_id || "",
          createdAt: o.created_at, updatedAt: o.updated_at, stageChangedAt: o.stage_changed_at || "",
          leadName: leadMap[o.lead_id]?.name || "", leadBusiness: leadMap[o.lead_id]?.business || "",
          assigneeName: teamMap[o.assignee_id]?.name || "",
        })));
      } catch {
        return json([]);
      }
    }

    if (path === "/api/opportunities" && method === "POST") {
      const body: any = await request.json();
      const id = genId();
      const ts = now();
      const stageProbMap: Record<string, number> = {
        prospecting: 10, qualification: 25, proposal: 50, negotiation: 75, "closed-won": 100, "closed-lost": 0,
      };
      const stage = body.stage || "prospecting";
      const probability = body.probability ?? stageProbMap[stage] ?? 10;

      await env.DB.prepare(
        "INSERT INTO opportunities (id, title, lead_id, client_id, stage, value, probability, expected_close_date, actual_close_date, loss_reason, notes, assignee_id, created_at, updated_at, stage_changed_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, '', '', ?, ?, ?, ?, ?)"
      ).bind(id, body.title || "", body.leadId || "", body.clientId || "", stage, body.value || 0, probability, body.expectedCloseDate || "", body.notes || "", body.assigneeId || "", ts, ts, ts).run();
      const row = await env.DB.prepare("SELECT * FROM opportunities WHERE id = ?").bind(id).first();
      return json({
        id: row!.id, title: row!.title, leadId: row!.lead_id, clientId: row!.client_id,
        stage: row!.stage, value: Number(row!.value), probability: Number(row!.probability),
        weightedValue: Number(row!.value) * (Number(row!.probability) / 100),
        expectedCloseDate: row!.expected_close_date || "", actualCloseDate: row!.actual_close_date || "",
        lossReason: row!.loss_reason || "", notes: row!.notes || "", assigneeId: row!.assignee_id || "",
        createdAt: row!.created_at, updatedAt: row!.updated_at, stageChangedAt: row!.stage_changed_at || "",
        leadName: "", leadBusiness: "", assigneeName: "",
      }, 201);
    }

    const oppMatch = path.match(/^\/api\/opportunities\/([^/]+)$/);
    if (oppMatch && method === "PATCH") {
      const id = oppMatch[1];
      const body: any = await request.json();
      const fieldMap: Record<string, string> = {
        title: "title", leadId: "lead_id", clientId: "client_id", stage: "stage",
        value: "value", probability: "probability", expectedCloseDate: "expected_close_date",
        actualCloseDate: "actual_close_date", lossReason: "loss_reason", notes: "notes", assigneeId: "assignee_id",
      };
      const updates: string[] = ["updated_at = ?"];
      const values: any[] = [now()];
      for (const [jsKey, dbCol] of Object.entries(fieldMap)) {
        if (body[jsKey] !== undefined) { updates.push(`${dbCol} = ?`); values.push(body[jsKey]); }
      }
      if (body.stage !== undefined) { updates.push("stage_changed_at = ?"); values.push(now()); }
      await env.DB.prepare(`UPDATE opportunities SET ${updates.join(", ")} WHERE id = ?`).bind(...values, id).run();
      const row = await env.DB.prepare("SELECT * FROM opportunities WHERE id = ?").bind(id).first();
      if (!row) return err("Opportunity not found", 404);
      return json({
        id: row.id, title: row.title, leadId: row.lead_id, clientId: row.client_id,
        stage: row.stage, value: Number(row.value), probability: Number(row.probability),
        weightedValue: Number(row.value) * (Number(row.probability) / 100),
        expectedCloseDate: row.expected_close_date || "", actualCloseDate: row.actual_close_date || "",
        lossReason: row.loss_reason || "", notes: row.notes || "", assigneeId: row.assignee_id || "",
        createdAt: row.created_at, updatedAt: row.updated_at, stageChangedAt: row.stage_changed_at || "",
        leadName: "", leadBusiness: "", assigneeName: "",
      });
    }

    if (oppMatch && method === "DELETE") {
      await env.DB.prepare("DELETE FROM opportunities WHERE id = ?").bind(oppMatch[1]).run();
      return json({ success: true });
    }

    // ─── CATCH-ALL for routes that exist on Express but not yet here ─────

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
    assignee: row.assignee || "",
    createdAt: row.created_at,
  };
}

function mapThread(row: Record<string, unknown>) {
  return {
    id: row.id,
    subject: row.subject,
    leadId: row.lead_id || "",
    contactEmail: row.contact_email,
    contactName: row.contact_name,
    source: row.source,
    status: row.status,
    unread: !!row.unread,
    lastMessageAt: row.last_message_at,
    createdAt: row.created_at,
  };
}

function mapMessage(row: Record<string, unknown>) {
  return {
    id: row.id,
    threadId: row.thread_id,
    direction: row.direction,
    fromEmail: row.from_email,
    fromName: row.from_name,
    toEmail: row.to_email,
    subject: row.subject,
    body: row.body,
    htmlBody: row.html_body,
    resendId: row.resend_id || "",
    status: row.status,
    sentAt: row.sent_at,
  };
}

function mapActivity(row: Record<string, unknown>) {
  return {
    id: row.id,
    action: row.action,
    details: row.details,
    type: row.type,
    timestamp: row.timestamp,
  };
}

function mapSchedule(row: Record<string, unknown>) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    date: row.date,
    time: row.time,
    duration: row.duration,
    assigneeId: row.assignee_id || "",
    priority: row.priority,
    status: row.status,
    isAiGenerated: !!row.is_ai_generated,
    category: row.category,
    createdAt: row.created_at,
  };
}

function mapTeamMember(row: Record<string, unknown>) {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    email: row.email,
    phone: row.phone,
    status: row.status,
    dailyInvolvement: row.daily_involvement || "",
    joinedAt: row.joined_at,
  };
}

function mapContactLead(row: Record<string, unknown>) {
  return {
    id: row.id,
    businessName: row.business_name,
    contactName: row.contact_name,
    phone: row.phone,
    email: row.email,
    plan: row.plan,
    highRisk: !!row.high_risk,
    monthlyProcessing: row.monthly_processing,
    bestContactTime: row.best_contact_time,
    createdAt: row.created_at,
  };
}
