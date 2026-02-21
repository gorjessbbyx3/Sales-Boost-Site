// Cloudflare Pages Functions — single catch-all handler for /api/*
// Uses D1 for persistence, Anthropic SDK for AI chat

interface Env {
  DB: D1Database;
  FILES_BUCKET: R2Bucket;
  SESSION_SECRET: string;
  ANTHROPIC_API_KEY: string;
  RESEND_API_KEY: string;
  R2_PUBLIC_URL: string;
}

type Ctx = EventContext<Env, string, unknown>;

const ALLOWED_ORIGINS = [
  "https://techsavvyhawaii.com",
  "https://www.techsavvyhawaii.com",
  "https://tech-savvy-hawaii.replit.app",
  "http://localhost:5000",
  "http://localhost:3000",
];

function getCorsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get("Origin") || "";
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Cookie",
    "Access-Control-Allow-Credentials": "true",
  };
}

// Legacy static fallback for routes that don't have the request object
const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "https://techsavvyhawaii.com",
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

      const body: any = await request.json();
      const { message, history } = body || {};
      if (!message || typeof message !== "string" || message.length > 2000) {
        return err("Message is required and must be under 2000 characters.");
      }

      const trimmedHistory: { role: string; content: string }[] = [];
      if (Array.isArray(history)) {
        for (const h of history.slice(-10)) {
          if (h.role && h.content && typeof h.content === "string") {
            trimmedHistory.push({ role: h.role, content: h.content.slice(0, 2000) });
          }
        }
      }

      try {
        // Try Anthropic first if API key is available
        const apiKey = env.ANTHROPIC_API_KEY;
        if (apiKey) {
          const messages: { role: "user" | "assistant"; content: string }[] = [
            ...trimmedHistory.map(h => ({ role: h.role as "user" | "assistant", content: h.content })),
            { role: "user" as const, content: message },
          ];
          const safeMaxTokens = Math.min(Number(config.max_tokens) || 1024, MAX_ALLOWED_TOKENS);

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

          if (anthropicRes.ok) {
            const anthropicData: any = await anthropicRes.json();
            const text = (anthropicData.content || [])
              .filter((block: any) => block.type === "text")
              .map((block: any) => block.text)
              .join("");
            return json({ reply: text });
          }
        }

        // Fallback: proxy through AI worker (Cloudflare Workers AI — free)
        const workerRes = await fetch("https://mojo-luna-955c.gorjessbbyx3.workers.dev/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message,
            history: trimmedHistory,
            systemPrompt: config.system_prompt as string,
          }),
        });
        const data: any = await workerRes.json();
        if (data.error) return err(data.error, 500);
        return json({ reply: data.reply || "" });
      } catch (e: any) {
        console.error("Chat error:", e.message);
        return err("Failed to get AI response. Please try again.", 500);
      }
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

        // Also log to admin inbox so it shows up in Inbox tab
        try {
          const threadId = genId();
          const msgId = genId();
          const contactEmail = body.email || "unknown@contact.form";
          const contactName = body.contactName || body.businessName || "Website Visitor";
          const subject = `New Contact Form: ${body.businessName || contactName}`;
          const msgBody = `New contact form submission:\n\nBusiness: ${body.businessName || "N/A"}\nContact: ${body.contactName || "N/A"}\nEmail: ${body.email || "N/A"}\nPhone: ${body.phone || "N/A"}\nPlan: ${body.plan || "N/A"}\nMonthly Processing: ${body.monthlyProcessing || "N/A"}\nBest Time to Call: ${body.bestContactTime || "N/A"}${body.highRisk ? "\nHigh Risk: Yes" : ""}`;

          await env.DB.prepare(
            "INSERT INTO email_threads (id, subject, lead_id, contact_email, contact_name, source, status, unread, last_message_at, created_at) VALUES (?, ?, '', ?, ?, 'contact-form', 'open', 1, ?, ?)"
          ).bind(threadId, subject, contactEmail, contactName, ts, ts).run();

          await env.DB.prepare(
            "INSERT INTO email_messages (id, thread_id, direction, from_email, from_name, to_email, subject, body, html_body, resend_id, status, sent_at) VALUES (?, ?, 'inbound', ?, ?, 'contact@techsavvyhawaii.com', ?, ?, '', '', 'received', ?)"
          ).bind(msgId, threadId, contactEmail, contactName, subject, msgBody, ts).run();
        } catch (inboxErr) {
          console.error("Failed to log contact form to inbox:", inboxErr);
        }

        // Log activity
        try {
          await env.DB.prepare("INSERT INTO activity_log (id, title, description, type, timestamp) VALUES (?, ?, ?, ?, ?)").bind(
            genId(), "New Website Lead", `${body.businessName || body.contactName} submitted contact form`, "lead", ts
          ).run();
        } catch { /* non-critical */ }

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

    // POST /api/leads/public (public lead from website contact form)
    if (path === "/api/leads/public" && method === "POST") {
      const body: any = await request.json();
      const id = genId();
      const ts = now();
      await env.DB.prepare(
        "INSERT INTO leads (id, name, business, phone, email, package, status, source, notes, attachments, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, 'new', 'lead-magnet', ?, '[]', ?, ?)"
      ).bind(id, body.name || "", body.business || "", body.phone || "", body.email || "", body.package || "terminal", body.notes || "", ts, ts).run();

      // Log to admin inbox
      try {
        const threadId = genId();
        const msgId = genId();
        const contactEmail = body.email || "unknown@lead.form";
        const contactName = body.name || body.business || "Website Lead";
        const subject = `New Lead: ${body.business || contactName}`;
        const msgBody = `New lead from website:\n\nName: ${body.name || "N/A"}\nBusiness: ${body.business || "N/A"}\nEmail: ${body.email || "N/A"}\nPhone: ${body.phone || "N/A"}\nPackage: ${body.package || "N/A"}\nNotes: ${body.notes || "N/A"}`;
        await env.DB.prepare(
          "INSERT INTO email_threads (id, subject, lead_id, contact_email, contact_name, source, status, unread, last_message_at, created_at) VALUES (?, ?, ?, ?, ?, 'contact-form', 'open', 1, ?, ?)"
        ).bind(threadId, subject, id, contactEmail, contactName, ts, ts).run();
        await env.DB.prepare(
          "INSERT INTO email_messages (id, thread_id, direction, from_email, from_name, to_email, subject, body, html_body, resend_id, status, sent_at) VALUES (?, ?, 'inbound', ?, ?, 'contact@techsavvyhawaii.com', ?, ?, '', '', 'received', ?)"
        ).bind(msgId, threadId, contactEmail, contactName, subject, msgBody, ts).run();
      } catch { /* non-critical */ }

      // Log activity
      try {
        await env.DB.prepare("INSERT INTO activity_log (id, title, description, type, timestamp) VALUES (?, ?, ?, ?, ?)").bind(
          genId(), "Website Lead", `${body.business || body.name} submitted contact form`, "lead", ts
        ).run();
      } catch { /* non-critical */ }

      return json({ success: true }, 201);
    }

    // POST /api/statement-review/analyze (public — file upload for AI analysis)
    if (path === "/api/statement-review/analyze" && method === "POST") {
      try {
        const contentType = request.headers.get("Content-Type") || "";
        let fileBuffer: ArrayBuffer;
        let mimeType = "application/pdf";
        let fileName = "statement";

        if (contentType.includes("multipart/form-data")) {
          const formData = await request.formData();
          const file = formData.get("statement") as File | null;
          if (!file) return err("No file uploaded. Please attach your merchant statement.");
          fileBuffer = await file.arrayBuffer();
          mimeType = file.type || "application/pdf";
          fileName = file.name || "statement";
        } else {
          return err("Expected multipart/form-data with a 'statement' file field.");
        }

        const isPdf = mimeType.includes("pdf");
        const workerUrl = "https://mojo-luna-955c.gorjessbbyx3.workers.dev/analyze-statement";
        const workerHeaders: Record<string, string> = { "Content-Type": "application/json" };
        if (env.WORKER_KEY) workerHeaders["X-Worker-Key"] = env.WORKER_KEY;

        let requestBody: Record<string, string>;

        if (isPdf) {
          // Try to extract text from PDF binary (works for digital/text PDFs)
          const bytes = new Uint8Array(fileBuffer);
          const textContent = extractPdfText(bytes);

          if (textContent.length > 50) {
            // Got text — send to text analysis
            requestBody = { text: textContent };
          } else {
            // Scanned PDF or minimal text — send as base64 image for vision model
            const base64 = arrayBufferToBase64(fileBuffer);
            requestBody = { imageBase64: base64, imageType: "application/pdf" };
          }
        } else {
          // Image upload — send as base64
          const base64 = arrayBufferToBase64(fileBuffer);
          requestBody = { imageBase64: base64, imageType: mimeType };
        }

        const aiResp = await fetch(workerUrl, {
          method: "POST",
          headers: workerHeaders,
          body: JSON.stringify(requestBody),
        });

        if (!aiResp.ok) {
          const errData: any = await aiResp.json().catch(() => ({ error: "Worker error" }));
          throw new Error(errData.error || "Analysis service returned an error");
        }

        const analysis: any = await aiResp.json();

        // Log activity
        try {
          await env.DB.prepare("INSERT INTO activity_log (id, title, description, type, timestamp) VALUES (?, ?, ?, ?, ?)").bind(
            genId(), "Statement Review", `AI analysis completed — Grade: ${analysis.overallGrade || "?"}, Overpay: ${analysis.estimatedOverpay || "?"}`, "lead", now()
          ).run();
        } catch { /* non-critical */ }

        return json(analysis);
      } catch (e: any) {
        console.error("Statement analysis error:", e.message || e);
        const msg = e.message || "";
        return err(
          msg.includes("abort") ? "Analysis took too long. Please try a smaller file or call us."
            : "Analysis failed. Please try again or call us at (808) 767-5460 for a free manual review.",
          500
        );
      }
    }

    // POST /api/statement-review/email (public — send analysis report or DIY guides)
    if (path === "/api/statement-review/email" && method === "POST") {
      try {
        const body: any = await request.json();
        const { email, name, business, type, analysis } = body;
        if (!email || !name) return err("Name and email are required.");

        const apiKey = env.RESEND_API_KEY;
        if (!apiKey) return err("Email service not configured", 500);

        const ts = now();

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

        let emailSubject: string;
        let emailHtml: string;

        if (type === "report" && analysis) {
          const annualOverpay = analysis.estimatedOverpay
            ? `$${(parseFloat(String(analysis.estimatedOverpay).replace(/[$,]/g, "")) * 12).toLocaleString()}`
            : "N/A";
          emailSubject = `Your Statement Analysis: Grade ${analysis.overallGrade || "?"} | TechSavvy Hawaii`;
          emailHtml = buildAnalysisEmailHtml(name, business || "Your Business", analysis, annualOverpay);
        } else {
          emailSubject = "Your Free Merchant Statement Review Guides | TechSavvy Hawaii";
          emailHtml = buildGuidesEmailHtml(name);
        }

        // Send via Resend
        const resendRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
          body: JSON.stringify({ from: `${fromName} <${fromEmail}>`, to: [email], subject: emailSubject, html: emailHtml }),
        });

        if (!resendRes.ok) {
          console.error("Resend error:", await resendRes.text());
          return err("Failed to send email", 500);
        }

        // Save as lead
        try {
          const leadId = genId();
          const leadNotes = type === "report" ? `AI statement report emailed — Grade: ${analysis?.overallGrade || "?"}` : "Requested self-review guides";
          await env.DB.prepare(
            "INSERT INTO leads (id, name, business, email, status, source, notes, attachments, created_at, updated_at) VALUES (?, ?, ?, ?, 'new', 'lead-magnet', ?, '[]', ?, ?)"
          ).bind(leadId, name, business || "", email, leadNotes, ts, ts).run();
        } catch { /* lead might already exist, non-critical */ }

        // Log to inbox
        try {
          const threadId = genId();
          const msgId = genId();
          const inboxSubject = type === "report"
            ? `Statement Analysis: ${business || name} — Grade ${analysis?.overallGrade || "?"}`
            : `DIY Guides Requested: ${name}`;
          const inboxBody = type === "report"
            ? `AI Statement Report sent to ${name} (${email})\n\nBusiness: ${business || "N/A"}\nGrade: ${analysis?.overallGrade || "N/A"}\nEffective Rate: ${analysis?.effectiveRate || "N/A"}\nEst. Overpay: ${analysis?.estimatedOverpay || "N/A"}\nRed Flags: ${analysis?.redFlags?.length || 0}`
            : `Self-review guide booklets sent to ${name} (${email})\n\nBusiness: ${business || "N/A"}`;

          await env.DB.prepare(
            "INSERT INTO email_threads (id, subject, lead_id, contact_email, contact_name, source, status, unread, last_message_at, created_at) VALUES (?, ?, '', ?, ?, 'statement-review', 'open', 1, ?, ?)"
          ).bind(threadId, inboxSubject, email, name, ts, ts).run();
          await env.DB.prepare(
            "INSERT INTO email_messages (id, thread_id, direction, from_email, from_name, to_email, subject, body, html_body, resend_id, status, sent_at) VALUES (?, ?, 'outbound', ?, ?, ?, ?, ?, '', '', 'sent', ?)"
          ).bind(msgId, threadId, fromEmail, fromName, email, inboxSubject, inboxBody, ts).run();
        } catch { /* non-critical */ }

        // Log activity
        try {
          await env.DB.prepare("INSERT INTO activity_log (id, title, description, type, timestamp) VALUES (?, ?, ?, ?, ?)").bind(
            genId(), "Statement Review Email", `${type === "report" ? "AI report" : "Guide booklets"} sent to ${email}`, "lead", ts
          ).run();
        } catch { /* non-critical */ }

        return json({ success: true });
      } catch (e: any) {
        return err("Failed to send email: " + (e.message || "Unknown error"), 500);
      }
    }

    // GET /api/resources (public)
    if (path === "/api/resources" && method === "GET") {
      try {
        const { results } = await env.DB.prepare("SELECT * FROM resources WHERE published = 1 ORDER BY sort_order ASC").all();
        return json((results || []).map(mapResource));
      } catch { return json([]); }
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
        "INSERT INTO leads (id, name, business, address, phone, email, decision_maker_name, decision_maker_role, best_contact_method, package, status, source, vertical, current_processor, current_equipment, monthly_volume, pain_points, next_step, next_step_date, attachments, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
      ).bind(id, body.name || "", body.business || "", body.address || "", body.phone || "", body.email || "", body.decisionMakerName || "", body.decisionMakerRole || "", body.bestContactMethod || "phone", body.package || "terminal", body.status || "new", body.source || "direct", body.vertical || "other", body.currentProcessor || "", body.currentEquipment || "", body.monthlyVolume || "", body.painPoints || "", body.nextStep || "", body.nextStepDate || "", JSON.stringify(Array.isArray(body.attachments) ? body.attachments : []), body.notes || "", ts, ts).run();
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

      const leadFieldMap: Record<string, string> = {
        name: "name", business: "business", address: "address", phone: "phone", email: "email",
        decisionMakerName: "decision_maker_name", decisionMakerRole: "decision_maker_role",
        bestContactMethod: "best_contact_method", package: "package", status: "status",
        source: "source", vertical: "vertical", currentProcessor: "current_processor",
        currentEquipment: "current_equipment", monthlyVolume: "monthly_volume",
        painPoints: "pain_points", nextStep: "next_step", nextStepDate: "next_step_date", notes: "notes",
      };
      for (const [jsKey, dbCol] of Object.entries(leadFieldMap)) {
        if (body[jsKey] !== undefined) { updates.push(`${dbCol} = ?`); values.push(body[jsKey]); }
      }
      if (body.attachments !== undefined) { updates.push("attachments = ?"); values.push(JSON.stringify(body.attachments)); }
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

    // POST /api/leads/:id/recommend — AI next-step recommendation via Workers AI (free)
    const leadRecommendMatch = path.match(/^\/api\/leads\/([^/]+)\/recommend$/);
    if (leadRecommendMatch && method === "POST") {
      const id = leadRecommendMatch[1];
      const lead: any = await env.DB.prepare("SELECT * FROM leads WHERE id = ?").bind(id).first();
      if (!lead) return err("Lead not found", 404);
      const daysSinceUpdate = lead.updated_at ? Math.floor((Date.now() - new Date(lead.updated_at as string).getTime()) / 86400000) : 0;
      try {
        const workerRes = await fetch("https://mojo-luna-955c.gorjessbbyx3.workers.dev/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-Worker-Key": env.WORKER_KEY || "" },
          body: JSON.stringify({
            name: lead.name, business: lead.business, vertical: lead.vertical,
            status: lead.status, painPoints: lead.pain_points, notes: lead.notes,
            lastContact: lead.updated_at, monthlyVolume: lead.monthly_volume,
            currentProcessor: lead.current_processor, daysSinceUpdate,
          }),
        });
        const data: any = await workerRes.json();
        if (data.error) return err(data.error, 500);
        return json({ leadId: id, ...data });
      } catch (e: any) {
        return err("AI recommendation failed: " + e.message, 500);
      }
    }

    // POST /api/leads/bulk-recommend — AI recommendations for multiple leads
    if (path === "/api/leads/bulk-recommend" && method === "POST") {
      const body: any = await request.json();
      const ids: string[] = body.ids || [];
      if (!ids.length) return err("No lead IDs provided");
      const placeholders = ids.map(() => "?").join(",");
      const { results: leads } = await env.DB.prepare(`SELECT * FROM leads WHERE id IN (${placeholders})`).bind(...ids).all();
      const recommendations: any[] = [];
      for (const lead of (leads || [])) {
        const l: any = lead;
        const daysSinceUpdate = l.updated_at ? Math.floor((Date.now() - new Date(l.updated_at as string).getTime()) / 86400000) : 0;
        try {
          const workerRes = await fetch("https://mojo-luna-955c.gorjessbbyx3.workers.dev/recommend", {
            method: "POST",
            headers: { "Content-Type": "application/json", "X-Worker-Key": env.WORKER_KEY || "" },
            body: JSON.stringify({
              name: l.name, business: l.business, vertical: l.vertical,
              status: l.status, painPoints: l.pain_points, notes: l.notes,
              lastContact: l.updated_at, monthlyVolume: l.monthly_volume,
              currentProcessor: l.current_processor, daysSinceUpdate,
            }),
          });
          const data: any = await workerRes.json();
          recommendations.push({ leadId: l.id, ...data });
        } catch {
          recommendations.push({ leadId: l.id, error: "Failed to get recommendation" });
        }
      }
      return json({ recommendations });
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
          equipmentId: o.equipment_id || "",
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
        "INSERT INTO opportunities (id, title, lead_id, client_id, stage, value, probability, expected_close_date, actual_close_date, loss_reason, notes, assignee_id, equipment_id, created_at, updated_at, stage_changed_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, '', '', ?, ?, ?, ?, ?, ?)"
      ).bind(id, body.title || "", body.leadId || "", body.clientId || "", stage, body.value || 0, probability, body.expectedCloseDate || "", body.notes || "", body.assigneeId || "", body.equipmentId || "", ts, ts, ts).run();
      const row = await env.DB.prepare("SELECT * FROM opportunities WHERE id = ?").bind(id).first();
      return json({
        id: row!.id, title: row!.title, leadId: row!.lead_id, clientId: row!.client_id,
        stage: row!.stage, value: Number(row!.value), probability: Number(row!.probability),
        weightedValue: Number(row!.value) * (Number(row!.probability) / 100),
        expectedCloseDate: row!.expected_close_date || "", actualCloseDate: row!.actual_close_date || "",
        lossReason: row!.loss_reason || "", notes: row!.notes || "", assigneeId: row!.assignee_id || "",
        equipmentId: row!.equipment_id || "",
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
        equipmentId: "equipment_id",
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
        equipmentId: row.equipment_id || "",
        createdAt: row.created_at, updatedAt: row.updated_at, stageChangedAt: row.stage_changed_at || "",
        leadName: "", leadBusiness: "", assigneeName: "",
      });
    }

    if (oppMatch && method === "DELETE") {
      await env.DB.prepare("DELETE FROM opportunities WHERE id = ?").bind(oppMatch[1]).run();
      return json({ success: true });
    }

    // ─── REFERRAL PARTNERS CRUD ─────────────────────────────────────────

    if (path === "/api/referral-partners" && method === "GET") {
      try {
        const { results } = await env.DB.prepare("SELECT * FROM referral_partners ORDER BY created_at DESC").all();
        return json((results || []).map(mapReferralPartner));
      } catch { return json([]); }
    }

    if (path === "/api/referral-partners" && method === "POST") {
      const body: any = await request.json();
      const id = genId();
      const ts = now();
      await env.DB.prepare(
        "INSERT INTO referral_partners (id, name, niche, client_types, referral_terms, intro_method, tracking_notes, last_check_in, next_check_in, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
      ).bind(id, body.name || "", body.niche || "", body.clientTypes || "", body.referralTerms || "", body.introMethod || "", body.trackingNotes || "", body.lastCheckIn || "", body.nextCheckIn || "", ts).run();
      const row = await env.DB.prepare("SELECT * FROM referral_partners WHERE id = ?").bind(id).first();
      return json(mapReferralPartner(row!), 201);
    }

    const rpMatch = path.match(/^\/api\/referral-partners\/([^/]+)$/);
    if (rpMatch && method === "PATCH") {
      const id = rpMatch[1];
      const body: any = await request.json();
      const fieldMap: Record<string, string> = { name: "name", niche: "niche", clientTypes: "client_types", referralTerms: "referral_terms", introMethod: "intro_method", trackingNotes: "tracking_notes", lastCheckIn: "last_check_in", nextCheckIn: "next_check_in" };
      const updates: string[] = []; const values: any[] = [];
      for (const [jsKey, dbCol] of Object.entries(fieldMap)) { if (body[jsKey] !== undefined) { updates.push(`${dbCol} = ?`); values.push(body[jsKey]); } }
      if (updates.length > 0) { await env.DB.prepare(`UPDATE referral_partners SET ${updates.join(", ")} WHERE id = ?`).bind(...values, id).run(); }
      const row = await env.DB.prepare("SELECT * FROM referral_partners WHERE id = ?").bind(id).first();
      if (!row) return err("Partner not found", 404);
      return json(mapReferralPartner(row));
    }

    if (rpMatch && method === "DELETE") {
      await env.DB.prepare("DELETE FROM referral_partners WHERE id = ?").bind(rpMatch[1]).run();
      return json({ success: true });
    }

    // ─── PLAYBOOK CHECKS CRUD ───────────────────────────────────────────

    if (path === "/api/playbook-checks" && method === "GET") {
      try {
        const { results } = await env.DB.prepare("SELECT * FROM playbook_checks").all();
        return json((results || []).map(mapPlaybookCheck));
      } catch { return json([]); }
    }

    if (path === "/api/playbook-checks" && method === "POST") {
      const body: any = await request.json();
      const id = body.id || genId();
      await env.DB.prepare(
        "INSERT INTO playbook_checks (id, channel, label, completed, completed_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET completed = excluded.completed, completed_at = excluded.completed_at"
      ).bind(id, body.channel || "", body.label || "", body.completed ? 1 : 0, body.completed ? now() : "").run();
      const row = await env.DB.prepare("SELECT * FROM playbook_checks WHERE id = ?").bind(id).first();
      return json(mapPlaybookCheck(row!), 201);
    }

    const pbMatch = path.match(/^\/api\/playbook-checks\/([^/]+)$/);
    if (pbMatch && method === "PATCH") {
      const id = pbMatch[1];
      const body: any = await request.json();
      const updates: string[] = []; const values: any[] = [];
      if (body.completed !== undefined) { updates.push("completed = ?"); values.push(body.completed ? 1 : 0); updates.push("completed_at = ?"); values.push(body.completed ? now() : ""); }
      if (body.channel !== undefined) { updates.push("channel = ?"); values.push(body.channel); }
      if (body.label !== undefined) { updates.push("label = ?"); values.push(body.label); }
      if (updates.length > 0) { await env.DB.prepare(`UPDATE playbook_checks SET ${updates.join(", ")} WHERE id = ?`).bind(...values, id).run(); }
      const row = await env.DB.prepare("SELECT * FROM playbook_checks WHERE id = ?").bind(id).first();
      if (!row) return err("Not found", 404);
      return json(mapPlaybookCheck(row));
    }

    // ─── PINNED PITCHES CRUD ────────────────────────────────────────────

    if (path === "/api/pinned-pitches" && method === "GET") {
      try {
        const { results } = await env.DB.prepare("SELECT * FROM pinned_pitches").all();
        return json((results || []).map(mapPinnedPitch));
      } catch { return json([]); }
    }

    if (path === "/api/pinned-pitches" && method === "POST") {
      const body: any = await request.json();
      const id = genId();
      await env.DB.prepare(
        "INSERT INTO pinned_pitches (id, script_key, custom_content, pinned_at) VALUES (?, ?, ?, ?)"
      ).bind(id, body.scriptKey || "", body.customContent || "", now()).run();
      const row = await env.DB.prepare("SELECT * FROM pinned_pitches WHERE id = ?").bind(id).first();
      return json(mapPinnedPitch(row!), 201);
    }

    const ppMatch = path.match(/^\/api\/pinned-pitches\/([^/]+)$/);
    if (ppMatch && method === "PATCH") {
      const id = ppMatch[1];
      const body: any = await request.json();
      const updates: string[] = []; const values: any[] = [];
      if (body.scriptKey !== undefined) { updates.push("script_key = ?"); values.push(body.scriptKey); }
      if (body.customContent !== undefined) { updates.push("custom_content = ?"); values.push(body.customContent); }
      if (updates.length > 0) { await env.DB.prepare(`UPDATE pinned_pitches SET ${updates.join(", ")} WHERE id = ?`).bind(...values, id).run(); }
      const row = await env.DB.prepare("SELECT * FROM pinned_pitches WHERE id = ?").bind(id).first();
      if (!row) return err("Not found", 404);
      return json(mapPinnedPitch(row));
    }

    if (ppMatch && method === "DELETE") {
      await env.DB.prepare("DELETE FROM pinned_pitches WHERE id = ?").bind(ppMatch[1]).run();
      return json({ success: true });
    }

    // ─── WEEKLY KPIS CRUD ───────────────────────────────────────────────

    if (path === "/api/kpis" && method === "GET") {
      try {
        const { results } = await env.DB.prepare("SELECT * FROM weekly_kpis ORDER BY week_start DESC").all();
        return json((results || []).map(mapKPI));
      } catch { return json([]); }
    }

    if (path === "/api/kpis" && method === "POST") {
      const body: any = await request.json();
      const id = genId();
      await env.DB.prepare(
        "INSERT INTO weekly_kpis (id, week_start, outbound_calls, outbound_emails, outbound_dms, walk_ins, contacts_made, appointments_set, statements_requested, statements_received, proposals_sent, deals_won, volume_won, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
      ).bind(id, body.weekStart || "", body.outboundCalls || 0, body.outboundEmails || 0, body.outboundDMs || 0, body.walkIns || 0, body.contactsMade || 0, body.appointmentsSet || 0, body.statementsRequested || 0, body.statementsReceived || 0, body.proposalsSent || 0, body.dealsWon || 0, body.volumeWon || 0, body.notes || "").run();
      const row = await env.DB.prepare("SELECT * FROM weekly_kpis WHERE id = ?").bind(id).first();
      return json(mapKPI(row!), 201);
    }

    const kpiMatch = path.match(/^\/api\/kpis\/([^/]+)$/);
    if (kpiMatch && method === "PATCH") {
      const id = kpiMatch[1];
      const body: any = await request.json();
      const fieldMap: Record<string, string> = { weekStart: "week_start", outboundCalls: "outbound_calls", outboundEmails: "outbound_emails", outboundDMs: "outbound_dms", walkIns: "walk_ins", contactsMade: "contacts_made", appointmentsSet: "appointments_set", statementsRequested: "statements_requested", statementsReceived: "statements_received", proposalsSent: "proposals_sent", dealsWon: "deals_won", volumeWon: "volume_won", notes: "notes" };
      const updates: string[] = []; const values: any[] = [];
      for (const [jsKey, dbCol] of Object.entries(fieldMap)) { if (body[jsKey] !== undefined) { updates.push(`${dbCol} = ?`); values.push(body[jsKey]); } }
      if (updates.length > 0) { await env.DB.prepare(`UPDATE weekly_kpis SET ${updates.join(", ")} WHERE id = ?`).bind(...values, id).run(); }
      const row = await env.DB.prepare("SELECT * FROM weekly_kpis WHERE id = ?").bind(id).first();
      if (!row) return err("KPI not found", 404);
      return json(mapKPI(row));
    }

    if (kpiMatch && method === "DELETE") {
      await env.DB.prepare("DELETE FROM weekly_kpis WHERE id = ?").bind(kpiMatch[1]).run();
      return json({ success: true });
    }

    // ─── SCORECARD METRICS ──────────────────────────────────────────────

    if (path === "/api/metrics/scorecard" && method === "GET") {
      try {
        const { results: allLeads } = await env.DB.prepare("SELECT * FROM leads").all();
        const leads = allLeads || [];
        const sources = ["referral", "networking", "social", "direct", "lead-magnet"];
        const scorecard = sources.map(src => {
          const srcLeads = leads.filter((l: any) => l.source === src);
          const total = srcLeads.length;
          const contacted = srcLeads.filter((l: any) => l.status !== "new").length;
          const qualified = srcLeads.filter((l: any) => !["new", "contacted"].includes(l.status)).length;
          const stmtRequested = srcLeads.filter((l: any) => ["statement-requested", "statement-received", "analysis-delivered", "proposal-sent", "negotiation", "won"].includes(l.status)).length;
          const stmtReceived = srcLeads.filter((l: any) => ["statement-received", "analysis-delivered", "proposal-sent", "negotiation", "won"].includes(l.status)).length;
          const proposalSent = srcLeads.filter((l: any) => ["proposal-sent", "negotiation", "won"].includes(l.status)).length;
          const won = srcLeads.filter((l: any) => l.status === "won").length;
          const lost = srcLeads.filter((l: any) => l.status === "lost").length;
          const closed = won + lost;
          const wonLeads = srcLeads.filter((l: any) => l.status === "won");
          const avgTimeToClose = wonLeads.length > 0 ? wonLeads.reduce((sum: number, l: any) => sum + (new Date(l.updated_at).getTime() - new Date(l.created_at).getTime()), 0) / wonLeads.length / 86400000 : 0;
          const avgVolumeWon = wonLeads.length > 0 ? wonLeads.reduce((sum: number, l: any) => { const m = ((l.monthly_volume || "0") as string).match(/[\d.]+/); return sum + (m ? parseFloat(m[0]) || 0 : 0); }, 0) / wonLeads.length : 0;
          return { source: src, total, contacted, contactRate: total > 0 ? Math.round((contacted / total) * 100) : 0, qualified, appointmentRate: contacted > 0 ? Math.round((qualified / contacted) * 100) : 0, stmtRequested, stmtReceived, stmtReceivedRate: stmtRequested > 0 ? Math.round((stmtReceived / stmtRequested) * 100) : 0, proposalSent, won, lost, closeRate: closed > 0 ? Math.round((won / closed) * 100) : 0, avgTimeToClose: Math.round(avgTimeToClose), avgVolumeWon: Math.round(avgVolumeWon) };
        });
        const overall = { totalLeads: leads.length, activeLeads: leads.filter((l: any) => !["won", "lost", "nurture"].includes(l.status)).length, totalWon: leads.filter((l: any) => l.status === "won").length, totalLost: leads.filter((l: any) => l.status === "lost").length };
        return json({ scorecard, overall });
      } catch { return json({ scorecard: [], overall: { totalLeads: 0, activeLeads: 0, totalWon: 0, totalLost: 0 } }); }
    }

    // ─── PLAN ITEMS CRUD ────────────────────────────────────────────────

    if (path === "/api/plan-items" && method === "GET") {
      try {
        const { results } = await env.DB.prepare("SELECT * FROM plan_items ORDER BY sort_order ASC").all();
        return json((results || []).map(mapPlanItem));
      } catch { return json([]); }
    }

    if (path === "/api/plan-items" && method === "POST") {
      const body: any = await request.json();
      const id = genId();
      let order = body.order || 0;
      if (!order) { try { const c = await env.DB.prepare("SELECT COUNT(*) as cnt FROM plan_items").first(); order = ((c?.cnt as number) || 0) + 1; } catch { order = 1; } }
      await env.DB.prepare(
        "INSERT INTO plan_items (id, phase, week_range, title, description, completed, completed_at, sort_order) VALUES (?, ?, ?, ?, ?, 0, '', ?)"
      ).bind(id, body.phase || 1, body.weekRange || "1-2", body.title || "", body.description || "", order).run();
      const row = await env.DB.prepare("SELECT * FROM plan_items WHERE id = ?").bind(id).first();
      return json(mapPlanItem(row!), 201);
    }

    const planMatch = path.match(/^\/api\/plan-items\/([^/]+)$/);
    if (planMatch && method === "PATCH") {
      const id = planMatch[1];
      const body: any = await request.json();
      const updates: string[] = []; const values: any[] = [];
      if (body.title !== undefined) { updates.push("title = ?"); values.push(body.title); }
      if (body.description !== undefined) { updates.push("description = ?"); values.push(body.description); }
      if (body.phase !== undefined) { updates.push("phase = ?"); values.push(body.phase); }
      if (body.weekRange !== undefined) { updates.push("week_range = ?"); values.push(body.weekRange); }
      if (body.order !== undefined) { updates.push("sort_order = ?"); values.push(body.order); }
      if (body.completed !== undefined) {
        updates.push("completed = ?"); values.push(body.completed ? 1 : 0);
        if (body.completed) { updates.push("completed_at = ?"); values.push(now()); }
        else { updates.push("completed_at = ?"); values.push(""); }
      }
      if (updates.length > 0) { await env.DB.prepare(`UPDATE plan_items SET ${updates.join(", ")} WHERE id = ?`).bind(...values, id).run(); }
      const row = await env.DB.prepare("SELECT * FROM plan_items WHERE id = ?").bind(id).first();
      if (!row) return err("Plan item not found", 404);
      return json(mapPlanItem(row));
    }

    if (planMatch && method === "DELETE") {
      await env.DB.prepare("DELETE FROM plan_items WHERE id = ?").bind(planMatch[1]).run();
      return json({ success: true });
    }

    // ─── MATERIALS CRUD ─────────────────────────────────────────────────

    if (path === "/api/materials" && method === "GET") {
      try {
        const { results } = await env.DB.prepare("SELECT * FROM materials").all();
        return json((results || []).map(mapMaterial));
      } catch { return json([]); }
    }

    if (path === "/api/materials" && method === "POST") {
      const body: any = await request.json();
      const id = genId();
      await env.DB.prepare(
        "INSERT INTO materials (id, category, name, description, status, file_url, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
      ).bind(id, body.category || "sales", body.name || "", body.description || "", body.status || "not-started", body.fileUrl || "", now()).run();
      const row = await env.DB.prepare("SELECT * FROM materials WHERE id = ?").bind(id).first();
      return json(mapMaterial(row!), 201);
    }

    const matMatch = path.match(/^\/api\/materials\/([^/]+)$/);
    if (matMatch && method === "PATCH") {
      const id = matMatch[1];
      const body: any = await request.json();
      const fieldMap: Record<string, string> = { category: "category", name: "name", description: "description", status: "status", fileUrl: "file_url" };
      const updates: string[] = ["updated_at = ?"]; const values: any[] = [now()];
      for (const [jsKey, dbCol] of Object.entries(fieldMap)) { if (body[jsKey] !== undefined) { updates.push(`${dbCol} = ?`); values.push(body[jsKey]); } }
      await env.DB.prepare(`UPDATE materials SET ${updates.join(", ")} WHERE id = ?`).bind(...values, id).run();
      const row = await env.DB.prepare("SELECT * FROM materials WHERE id = ?").bind(id).first();
      if (!row) return err("Material not found", 404);
      return json(mapMaterial(row));
    }

    // ─── FILES CRUD ─────────────────────────────────────────────────────

    if (path === "/api/files" && method === "GET") {
      try {
        const { results } = await env.DB.prepare("SELECT * FROM admin_files ORDER BY uploaded_at DESC").all();
        return json((results || []).map(mapFile));
      } catch { return json([]); }
    }

    // List all folders
    if (path === "/api/files/folders" && method === "GET") {
      const defaults = ["Classroom", "Equipment", "Uploaded Statements", "Partner Agreements", "Client Resources", "Client Resources/Checklist", "Website Resources"];
      try {
        const { results } = await env.DB.prepare("SELECT DISTINCT folder FROM admin_files WHERE folder != ''").all();
        const used = (results || []).map((r: any) => r.folder as string);
        const all = Array.from(new Set([...defaults, ...used])).sort();
        return json(all);
      } catch { return json(defaults); }
    }

    // Create a new folder (marker file)
    if (path === "/api/files/folders" && method === "POST") {
      const body: any = await request.json();
      const folderName = (body.name || "").trim();
      const parent = (body.parent || "").trim();
      if (!folderName) return err("Folder name is required");
      const fullPath = parent ? `${parent}/${folderName}` : folderName;
      const id = genId();
      await env.DB.prepare(
        "INSERT INTO admin_files (id, name, size, type, category, folder, uploaded_at, url) VALUES (?, ?, 0, 'other', 'system', ?, ?, '')"
      ).bind(id, ".folder-marker", fullPath, now()).run();
      return json({ folder: fullPath }, 201);
    }

    // Create file entry (link mode)
    if (path === "/api/files" && method === "POST") {
      const body: any = await request.json();
      const id = genId();
      await env.DB.prepare(
        "INSERT INTO admin_files (id, name, size, type, category, folder, uploaded_at, url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
      ).bind(id, body.name || "untitled", body.size || 0, body.type || "document", body.category || "general", body.folder || "", now(), body.url || "").run();
      const row = await env.DB.prepare("SELECT * FROM admin_files WHERE id = ?").bind(id).first();
      return json(mapFile(row!), 201);
    }

    // Upload file to R2
    if (path === "/api/files/upload" && method === "POST") {
      try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        if (!file) return err("No file uploaded");
        const folder = (formData.get("folder") as string) || "";
        const category = (formData.get("category") as string) || "general";
        const customName = formData.get("name") as string | null;

        const ext = file.name.includes(".") ? file.name.substring(file.name.lastIndexOf(".")).toLowerCase() : "";
        const typeMap: Record<string, string> = { ".pdf": "document", ".doc": "document", ".docx": "document", ".txt": "document", ".html": "document", ".htm": "document", ".xls": "spreadsheet", ".xlsx": "spreadsheet", ".csv": "spreadsheet", ".ppt": "document", ".pptx": "document", ".png": "image", ".jpg": "image", ".jpeg": "image", ".gif": "image", ".webp": "image", ".svg": "image", ".mp4": "video", ".webm": "video", ".zip": "other" };
        const fileType = typeMap[ext] || "document";

        // Upload to R2
        const baseName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_").substring(0, 60);
        const r2Key = `${(folder || "general").toLowerCase().replace(/[^a-z0-9-]/g, "-")}/${Date.now()}-${baseName}${ext}`;
        const arrayBuf = await file.arrayBuffer();

        const mimeMap: Record<string, string> = { ".pdf": "application/pdf", ".doc": "application/msword", ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document", ".xls": "application/vnd.ms-excel", ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", ".csv": "text/csv", ".ppt": "application/vnd.ms-powerpoint", ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".gif": "image/gif", ".webp": "image/webp", ".svg": "image/svg+xml", ".mp4": "video/mp4", ".webm": "video/webm", ".zip": "application/zip", ".txt": "text/plain", ".html": "text/html" };

        await env.FILES_BUCKET.put(r2Key, arrayBuf, {
          httpMetadata: { contentType: mimeMap[ext] || "application/octet-stream" },
        });

        const publicUrl = (env.R2_PUBLIC_URL || "https://assets.techsavvyhawaii.com").replace(/\/$/, "");
        const fileUrl = `${publicUrl}/${r2Key}`;

        const displayName = customName || file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        const id = genId();
        await env.DB.prepare(
          "INSERT INTO admin_files (id, name, size, type, category, folder, uploaded_at, url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        ).bind(id, displayName, file.size, fileType, category, folder, now(), fileUrl).run();
        const row = await env.DB.prepare("SELECT * FROM admin_files WHERE id = ?").bind(id).first();
        return json(mapFile(row!), 201);
      } catch (e: any) {
        return json({ error: e.message || "Upload failed" }, 500);
      }
    }

    const fileMatch = path.match(/^\/api\/files\/([^/]+)$/);

    // PATCH file (rename / move)
    if (fileMatch && method === "PATCH") {
      const body: any = await request.json();
      const updates: string[] = [];
      const values: any[] = [];
      if (body.name !== undefined) { updates.push("name = ?"); values.push(body.name); }
      if (body.folder !== undefined) { updates.push("folder = ?"); values.push(body.folder); }
      if (body.category !== undefined) { updates.push("category = ?"); values.push(body.category); }
      if (body.starred !== undefined) { updates.push("starred = ?"); values.push(body.starred ? 1 : 0); }
      if (updates.length === 0) return err("No updates provided");
      values.push(fileMatch[1]);
      await env.DB.prepare(`UPDATE admin_files SET ${updates.join(", ")} WHERE id = ?`).bind(...values).run();
      const row = await env.DB.prepare("SELECT * FROM admin_files WHERE id = ?").bind(fileMatch[1]).first();
      if (!row) return err("File not found", 404);
      return json(mapFile(row));
    }

    // DELETE file
    if (fileMatch && method === "DELETE") {
      // Try to delete from R2 if URL looks like an R2 URL
      try {
        const row = await env.DB.prepare("SELECT url FROM admin_files WHERE id = ?").bind(fileMatch[1]).first();
        if (row?.url && env.FILES_BUCKET) {
          const publicUrl = (env.R2_PUBLIC_URL || "https://assets.techsavvyhawaii.com").replace(/\/$/, "");
          const url = row.url as string;
          if (url.startsWith(publicUrl)) {
            const key = url.slice(publicUrl.length + 1);
            await env.FILES_BUCKET.delete(key);
          }
        }
      } catch { /* best effort */ }
      await env.DB.prepare("DELETE FROM admin_files WHERE id = ?").bind(fileMatch[1]).run();
      return json({ success: true });
    }

    // ─── EQUIPMENT TRACKER ──────────────────────────────────────────────

    if (path === "/api/equipment" && method === "GET") {
      const { results } = await env.DB.prepare("SELECT * FROM equipment ORDER BY created_at DESC").all();
      return json((results || []).map(mapEquipment));
    }

    if (path === "/api/equipment" && method === "POST") {
      const body: any = await request.json();
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      await env.DB.prepare(
        `INSERT INTO equipment (id, name, type, serial_number, model, brand, firmware_version, part_number, product_code, feature_code, app_code, connectivity, manufacture_date, status, condition, client_id, client_name, deployed_date, purchase_date, purchase_cost, warranty_expiry, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        id, body.name || "", body.type || "terminal", body.serialNumber || "", body.model || "",
        body.brand || "", body.firmwareVersion || "", body.partNumber || "", body.productCode || "",
        body.featureCode || "", body.appCode || "", body.connectivity || "", body.manufactureDate || "",
        body.status || "available", body.condition || "new", body.clientId || "", body.clientName || "",
        body.deployedDate || "", body.purchaseDate || "", body.purchaseCost || 0, body.warrantyExpiry || "",
        body.notes || "", now, now
      ).run();
      const row = await env.DB.prepare("SELECT * FROM equipment WHERE id = ?").bind(id).first();
      return json(mapEquipment(row!), 201);
    }

    // Bulk assign equipment (must be before wildcard match)
    if (path === "/api/equipment/assign" && method === "POST") {
      const { equipmentIds, clientId, clientName } = await request.json() as any;
      if (!equipmentIds?.length) return err("No equipment selected");
      const now = new Date().toISOString();
      for (const eqId of equipmentIds) {
        await env.DB.prepare(
          "UPDATE equipment SET client_id = ?, client_name = ?, status = ?, deployed_date = ?, updated_at = ? WHERE id = ?"
        ).bind(clientId || "", clientName || "", clientId ? "deployed" : "available", clientId ? now.split("T")[0] : "", now, eqId).run();
      }
      return json({ success: true });
    }

    // Equipment for specific client (must be before wildcard match)
    const eqClientMatch = path.match(/^\/api\/equipment\/client\/([^/]+)$/);
    if (eqClientMatch && method === "GET") {
      const { results } = await env.DB.prepare("SELECT * FROM equipment WHERE client_id = ?").bind(eqClientMatch[1]).all();
      return json((results || []).map(mapEquipment));
    }

    const eqMatch = path.match(/^\/api\/equipment\/([^/]+)$/);

    if (eqMatch && method === "PATCH") {
      const body: any = await request.json();
      const updates: string[] = [];
      const values: any[] = [];
      const fieldMap: Record<string, string> = {
        name: "name", type: "type", serialNumber: "serial_number", model: "model",
        brand: "brand", firmwareVersion: "firmware_version", partNumber: "part_number",
        productCode: "product_code", featureCode: "feature_code", appCode: "app_code",
        connectivity: "connectivity", manufactureDate: "manufacture_date",
        status: "status", condition: "condition", clientId: "client_id", clientName: "client_name",
        deployedDate: "deployed_date", purchaseDate: "purchase_date", purchaseCost: "purchase_cost",
        warrantyExpiry: "warranty_expiry", notes: "notes",
      };
      for (const [jsKey, dbCol] of Object.entries(fieldMap)) {
        if (body[jsKey] !== undefined) { updates.push(`${dbCol} = ?`); values.push(body[jsKey]); }
      }
      updates.push("updated_at = ?"); values.push(new Date().toISOString());
      if (updates.length <= 1) return err("No updates provided");
      values.push(eqMatch[1]);
      await env.DB.prepare(`UPDATE equipment SET ${updates.join(", ")} WHERE id = ?`).bind(...values).run();
      // Auto-deploy status when assigning client
      if (body.clientId && body.clientId !== "") {
        const current = await env.DB.prepare("SELECT status FROM equipment WHERE id = ?").bind(eqMatch[1]).first();
        if (current?.status === "available") {
          await env.DB.prepare("UPDATE equipment SET status = 'deployed', deployed_date = ? WHERE id = ?").bind(new Date().toISOString().split("T")[0], eqMatch[1]).run();
        }
      }
      const row = await env.DB.prepare("SELECT * FROM equipment WHERE id = ?").bind(eqMatch[1]).first();
      if (!row) return err("Equipment not found", 404);
      return json(mapEquipment(row));
    }

    if (eqMatch && method === "DELETE") {
      await env.DB.prepare("DELETE FROM equipment WHERE id = ?").bind(eqMatch[1]).run();
      return json({ success: true });
    }

    // ─── SLACK INTEGRATION ──────────────────────────────────────────────

    if (path === "/api/integrations/slack" && method === "GET") {
      try {
        const row = await env.DB.prepare("SELECT * FROM slack_config WHERE id = 'default'").first();
        if (!row) return json({ webhookUrl: "", channel: "#general", enabled: false, notifyNewLead: true, notifyNewClient: true, notifyRevenue: false, notifyTaskDue: true });
        return json({ webhookUrl: row.webhook_url, channel: row.channel, enabled: !!row.enabled, notifyNewLead: !!row.notify_new_lead, notifyNewClient: !!row.notify_new_client, notifyRevenue: !!row.notify_revenue, notifyTaskDue: !!row.notify_task_due });
      } catch { return json({ webhookUrl: "", channel: "#general", enabled: false, notifyNewLead: true, notifyNewClient: true, notifyRevenue: false, notifyTaskDue: true }); }
    }

    if (path === "/api/integrations/slack" && method === "PATCH") {
      const body: any = await request.json();
      try {
        const existing = await env.DB.prepare("SELECT id FROM slack_config WHERE id = 'default'").first();
        if (existing) {
          const updates: string[] = []; const values: any[] = [];
          if (body.webhookUrl !== undefined) { updates.push("webhook_url = ?"); values.push(body.webhookUrl); }
          if (body.channel !== undefined) { updates.push("channel = ?"); values.push(body.channel); }
          if (body.enabled !== undefined) { updates.push("enabled = ?"); values.push(body.enabled ? 1 : 0); }
          if (body.notifyNewLead !== undefined) { updates.push("notify_new_lead = ?"); values.push(body.notifyNewLead ? 1 : 0); }
          if (body.notifyNewClient !== undefined) { updates.push("notify_new_client = ?"); values.push(body.notifyNewClient ? 1 : 0); }
          if (body.notifyRevenue !== undefined) { updates.push("notify_revenue = ?"); values.push(body.notifyRevenue ? 1 : 0); }
          if (body.notifyTaskDue !== undefined) { updates.push("notify_task_due = ?"); values.push(body.notifyTaskDue ? 1 : 0); }
          if (updates.length > 0) { await env.DB.prepare(`UPDATE slack_config SET ${updates.join(", ")} WHERE id = 'default'`).bind(...values).run(); }
        } else {
          await env.DB.prepare(
            "INSERT INTO slack_config (id, webhook_url, channel, enabled, notify_new_lead, notify_new_client, notify_revenue, notify_task_due) VALUES ('default', ?, ?, ?, ?, ?, ?, ?)"
          ).bind(body.webhookUrl || "", body.channel || "#general", body.enabled ? 1 : 0, body.notifyNewLead !== false ? 1 : 0, body.notifyNewClient !== false ? 1 : 0, body.notifyRevenue ? 1 : 0, body.notifyTaskDue !== false ? 1 : 0).run();
        }
        const row = await env.DB.prepare("SELECT * FROM slack_config WHERE id = 'default'").first();
        return json({ webhookUrl: row!.webhook_url, channel: row!.channel, enabled: !!row!.enabled, notifyNewLead: !!row!.notify_new_lead, notifyNewClient: !!row!.notify_new_client, notifyRevenue: !!row!.notify_revenue, notifyTaskDue: !!row!.notify_task_due });
      } catch (e: any) { return err(e.message || "Failed to update slack config", 500); }
    }

    if (path === "/api/integrations/slack/test" && method === "POST") {
      try {
        const config = await env.DB.prepare("SELECT * FROM slack_config WHERE id = 'default'").first();
        if (!config || !config.webhook_url) return err("No webhook URL configured", 400);
        await fetch(config.webhook_url as string, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: "TechSavvy Admin: Test notification from your dashboard!" }) });
        return json({ success: true });
      } catch (e: any) { return err("Failed to send test: " + e.message, 500); }
    }

    // ─── INVOICES CRUD ──────────────────────────────────────────────────

    if (path === "/api/invoices" && method === "GET") {
      try {
        const { results } = await env.DB.prepare("SELECT * FROM invoices ORDER BY created_at DESC").all();
        return json((results || []).map(mapInvoice));
      } catch { return json([]); }
    }

    if (path === "/api/invoices" && method === "POST") {
      const body: any = await request.json();
      const id = genId();
      const ts = now();
      await env.DB.prepare(
        "INSERT INTO invoices (id, invoice_number, client_name, amount, status, due_date, notes, file_url, file_name, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
      ).bind(id, body.invoiceNumber || "", body.clientName || "", parseInt(body.amount) || 0, body.status || "pending", body.dueDate || "", body.notes || "", body.fileUrl || "", body.fileName || "", ts, ts).run();
      const row = await env.DB.prepare("SELECT * FROM invoices WHERE id = ?").bind(id).first();
      return json(mapInvoice(row!), 201);
    }

    const invMatch = path.match(/^\/api\/invoices\/([^/]+)$/);
    if (invMatch && method === "PATCH") {
      const id = invMatch[1];
      const body: any = await request.json();
      const fieldMap: Record<string, string> = { invoiceNumber: "invoice_number", clientName: "client_name", amount: "amount", status: "status", dueDate: "due_date", paidDate: "paid_date", notes: "notes", fileUrl: "file_url", fileName: "file_name" };
      const updates: string[] = ["updated_at = ?"]; const values: any[] = [now()];
      for (const [jsKey, dbCol] of Object.entries(fieldMap)) { if (body[jsKey] !== undefined) { updates.push(`${dbCol} = ?`); values.push(body[jsKey]); } }
      await env.DB.prepare(`UPDATE invoices SET ${updates.join(", ")} WHERE id = ?`).bind(...values, id).run();
      const row = await env.DB.prepare("SELECT * FROM invoices WHERE id = ?").bind(id).first();
      if (!row) return err("Invoice not found", 404);
      return json(mapInvoice(row));
    }

    if (invMatch && method === "DELETE") {
      await env.DB.prepare("DELETE FROM invoices WHERE id = ?").bind(invMatch[1]).run();
      return json({ success: true });
    }

    // ─── RESOURCES (Admin CRUD) ─────────────────────────────────────────

    if (path === "/api/resources/all" && method === "GET") {
      try {
        const { results } = await env.DB.prepare("SELECT * FROM resources ORDER BY sort_order ASC").all();
        return json((results || []).map(mapResource));
      } catch { return json([]); }
    }

    if (path === "/api/resources" && method === "POST") {
      const body: any = await request.json();
      const id = genId();
      const ts = now();
      let order = body.order || 0;
      if (!order) { try { const c = await env.DB.prepare("SELECT COUNT(*) as cnt FROM resources").first(); order = ((c?.cnt as number) || 0) + 1; } catch { order = 1; } }
      await env.DB.prepare(
        "INSERT INTO resources (id, title, description, category, type, url, thumbnail_url, sort_order, featured, published, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
      ).bind(id, body.title || "", body.description || "", body.category || "classroom", body.type || "doc", body.url || "", body.thumbnailUrl || "", order, body.featured ? 1 : 0, body.published !== false ? 1 : 0, ts, ts).run();
      const row = await env.DB.prepare("SELECT * FROM resources WHERE id = ?").bind(id).first();
      return json(mapResource(row!), 201);
    }

    const resMatch = path.match(/^\/api\/resources\/([^/]+)$/);
    if (resMatch && resMatch[1] !== "all" && resMatch[1] !== "upload" && method === "PATCH") {
      const id = resMatch[1];
      const body: any = await request.json();
      const fieldMap: Record<string, string> = { title: "title", description: "description", category: "category", type: "type", url: "url", thumbnailUrl: "thumbnail_url", order: "sort_order" };
      const updates: string[] = ["updated_at = ?"]; const values: any[] = [now()];
      for (const [jsKey, dbCol] of Object.entries(fieldMap)) { if (body[jsKey] !== undefined) { updates.push(`${dbCol} = ?`); values.push(body[jsKey]); } }
      if (body.featured !== undefined) { updates.push("featured = ?"); values.push(body.featured ? 1 : 0); }
      if (body.published !== undefined) { updates.push("published = ?"); values.push(body.published ? 1 : 0); }
      await env.DB.prepare(`UPDATE resources SET ${updates.join(", ")} WHERE id = ?`).bind(...values, id).run();
      const row = await env.DB.prepare("SELECT * FROM resources WHERE id = ?").bind(id).first();
      if (!row) return err("Resource not found", 404);
      return json(mapResource(row));
    }

    if (resMatch && resMatch[1] !== "all" && resMatch[1] !== "upload" && method === "DELETE") {
      await env.DB.prepare("DELETE FROM resources WHERE id = ?").bind(resMatch[1]).run();
      return json({ success: true });
    }

    // ─── TEAM MEMBERS (POST/PATCH/DELETE) ───────────────────────────────

    if (path === "/api/team-members" && method === "POST") {
      const body: any = await request.json();
      const id = genId();
      await env.DB.prepare(
        "INSERT INTO team_members (id, name, role, email, phone, status, daily_involvement, joined_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
      ).bind(id, body.name || "", body.role || "", body.email || "", body.phone || "", body.status || "active", body.dailyInvolvement || "full", now()).run();
      const row = await env.DB.prepare("SELECT * FROM team_members WHERE id = ?").bind(id).first();
      return json(mapTeamMember(row!), 201);
    }

    const tmMatch = path.match(/^\/api\/team-members\/([^/]+)$/);
    if (tmMatch && method === "PATCH") {
      const id = tmMatch[1];
      const body: any = await request.json();
      const fieldMap: Record<string, string> = { name: "name", role: "role", email: "email", phone: "phone", status: "status", dailyInvolvement: "daily_involvement" };
      const updates: string[] = []; const values: any[] = [];
      for (const [jsKey, dbCol] of Object.entries(fieldMap)) { if (body[jsKey] !== undefined) { updates.push(`${dbCol} = ?`); values.push(body[jsKey]); } }
      if (updates.length > 0) { await env.DB.prepare(`UPDATE team_members SET ${updates.join(", ")} WHERE id = ?`).bind(...values, id).run(); }
      const row = await env.DB.prepare("SELECT * FROM team_members WHERE id = ?").bind(id).first();
      if (!row) return err("Team member not found", 404);
      return json(mapTeamMember(row));
    }

    if (tmMatch && method === "DELETE") {
      await env.DB.prepare("DELETE FROM team_members WHERE id = ?").bind(tmMatch[1]).run();
      return json({ success: true });
    }

    // ─── BUSINESS INFO ──────────────────────────────────────────────────

    if (path === "/api/business-info" && method === "GET") {
      try {
        const row = await env.DB.prepare("SELECT * FROM business_info WHERE id = 'default'").first();
        if (!row) return json({ companyName: "", dba: "", phone: "", email: "", address: "", website: "", taxId: "", bankPartner: "", processorPartner: "CashSwipe", currentPhase: "onboarding", notes: "", updatedAt: now() });
        return json(mapBusinessInfo(row));
      } catch { return json({ companyName: "", dba: "", phone: "", email: "", address: "", website: "", taxId: "", bankPartner: "", processorPartner: "CashSwipe", currentPhase: "onboarding", notes: "", updatedAt: now() }); }
    }

    if (path === "/api/business-info" && method === "PATCH") {
      const body: any = await request.json();
      const ts = now();
      const fieldMap: Record<string, string> = { companyName: "company_name", dba: "dba", phone: "phone", email: "email", address: "address", website: "website", taxId: "tax_id", bankPartner: "bank_partner", processorPartner: "processor_partner", currentPhase: "current_phase", notes: "notes" };
      try {
        const existing = await env.DB.prepare("SELECT id FROM business_info WHERE id = 'default'").first();
        if (existing) {
          const updates: string[] = ["updated_at = ?"]; const values: any[] = [ts];
          for (const [jsKey, dbCol] of Object.entries(fieldMap)) { if (body[jsKey] !== undefined) { updates.push(`${dbCol} = ?`); values.push(body[jsKey]); } }
          await env.DB.prepare(`UPDATE business_info SET ${updates.join(", ")} WHERE id = 'default'`).bind(...values).run();
        } else {
          await env.DB.prepare(
            "INSERT INTO business_info (id, company_name, dba, phone, email, address, website, tax_id, bank_partner, processor_partner, current_phase, notes, updated_at) VALUES ('default', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
          ).bind(body.companyName || "", body.dba || "", body.phone || "", body.email || "", body.address || "", body.website || "", body.taxId || "", body.bankPartner || "", body.processorPartner || "CashSwipe", body.currentPhase || "onboarding", body.notes || "", ts).run();
        }
        const row = await env.DB.prepare("SELECT * FROM business_info WHERE id = 'default'").first();
        return json(mapBusinessInfo(row!));
      } catch (e: any) { return err(e.message || "Failed to update business info", 500); }
    }

    // ─── SCHEDULE (POST/DELETE) ──────────────────────────────────────────

    if (path === "/api/schedule" && method === "POST") {
      const body: any = await request.json();
      const id = genId();
      await env.DB.prepare(
        "INSERT INTO schedule_items (id, title, description, date, time, duration, assignee_id, priority, status, is_ai_generated, category, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
      ).bind(id, body.title || "", body.description || "", body.date || new Date().toISOString().split("T")[0], body.time || "", body.duration || 30, body.assigneeId || "", body.priority || "medium", body.status || "pending", body.isAiGenerated ? 1 : 0, body.category || "general", now()).run();
      const row = await env.DB.prepare("SELECT * FROM schedule_items WHERE id = ?").bind(id).first();
      return json(mapSchedule(row!), 201);
    }

    if (schedMatch && method === "DELETE") {
      await env.DB.prepare("DELETE FROM schedule_items WHERE id = ?").bind(schedMatch[1]).run();
      return json({ success: true });
    }

    // ─── FORECAST ───────────────────────────────────────────────────────

    if (path === "/api/forecast" && method === "GET") {
      try {
        const { results: opps } = await env.DB.prepare("SELECT * FROM opportunities").all();
        const allOpps = opps || [];
        const nowDate = new Date();
        const active = allOpps.filter((o: any) => o.stage !== "closed-won" && o.stage !== "closed-lost");
        const closedWon = allOpps.filter((o: any) => o.stage === "closed-won");
        const closedLost = allOpps.filter((o: any) => o.stage === "closed-lost");
        const totalPipeline = active.reduce((s: number, o: any) => s + (Number(o.value) || 0), 0);
        const weightedPipeline = active.reduce((s: number, o: any) => s + (Number(o.value) || 0) * ((Number(o.probability) || 0) / 100), 0);
        const closedWonTotal = closedWon.reduce((s: number, o: any) => s + (Number(o.value) || 0), 0);
        const closedLostTotal = closedLost.reduce((s: number, o: any) => s + (Number(o.value) || 0), 0);
        const avgDealSize = closedWon.length > 0 ? closedWonTotal / closedWon.length : 0;
        const daysToClose = closedWon.map((o: any) => Math.max(1, Math.floor((new Date(o.actual_close_date || o.updated_at).getTime() - new Date(o.created_at).getTime()) / 86400000)));
        const avgDaysToClose = daysToClose.length > 0 ? Math.round(daysToClose.reduce((s: number, d: number) => s + d, 0) / daysToClose.length) : 0;
        const totalClosed = closedWon.length + closedLost.length;
        const winRate = totalClosed > 0 ? Math.round((closedWon.length / totalClosed) * 100) : 0;
        const stages = ["prospecting", "qualification", "proposal", "negotiation", "closed-won", "closed-lost"];
        const stageBreakdown = stages.map(stage => { const inStage = allOpps.filter((o: any) => o.stage === stage); return { stage, count: inStage.length, totalValue: inStage.reduce((s: number, o: any) => s + (Number(o.value) || 0), 0), weightedValue: inStage.reduce((s: number, o: any) => s + (Number(o.value) || 0) * ((Number(o.probability) || 0) / 100), 0), avgAge: inStage.length > 0 ? Math.round(inStage.reduce((s: number, o: any) => s + Math.max(1, Math.floor((nowDate.getTime() - new Date(o.stage_changed_at).getTime()) / 86400000)), 0) / inStage.length) : 0 }; });
        const monthlyForecast = [];
        for (let i = 0; i < 6; i++) { const d = new Date(nowDate.getFullYear(), nowDate.getMonth() + i, 1); const monthKey = d.toISOString().slice(0, 7); const monthLabel = d.toLocaleDateString("en-US", { month: "short", year: "numeric" }); const inMonth = active.filter((o: any) => ((o.expected_close_date || "") as string).startsWith(monthKey)); const closedInMonth = closedWon.filter((o: any) => ((o.actual_close_date || o.updated_at || "") as string).startsWith(monthKey)); monthlyForecast.push({ month: monthLabel, projected: inMonth.reduce((s: number, o: any) => s + (Number(o.value) || 0) * ((Number(o.probability) || 0) / 100), 0), closed: closedInMonth.reduce((s: number, o: any) => s + (Number(o.value) || 0), 0) }); }
        const topDeals = [...active].sort((a: any, b: any) => ((Number(b.value) || 0) * (Number(b.probability) || 0) / 100) - ((Number(a.value) || 0) * (Number(a.probability) || 0) / 100)).slice(0, 5).map((o: any) => ({ id: o.id, title: o.title, leadId: o.lead_id, stage: o.stage, value: Number(o.value) || 0, probability: Number(o.probability) || 0, weightedValue: (Number(o.value) || 0) * ((Number(o.probability) || 0) / 100), expectedCloseDate: o.expected_close_date || "", assigneeId: o.assignee_id || "", createdAt: o.created_at, updatedAt: o.updated_at, stageChangedAt: o.stage_changed_at || "" }));
        return json({ totalPipeline, weightedPipeline, closedWon: closedWonTotal, closedLost: closedLostTotal, avgDealSize, avgDaysToClose, winRate, stageBreakdown, monthlyForecast, topDeals });
      } catch { return json({ totalPipeline: 0, weightedPipeline: 0, closedWon: 0, closedLost: 0, avgDealSize: 0, avgDaysToClose: 0, winRate: 0, stageBreakdown: [], monthlyForecast: [], topDeals: [] }); }
    }

    // ─── USER ACCOUNTS CRUD ─────────────────────────────────────────────

    if (path === "/api/user-accounts" && method === "GET") {
      try {
        const { results } = await env.DB.prepare("SELECT id, email, display_name, role, team_id, avatar_url, is_active, last_login_at, created_at FROM user_accounts ORDER BY display_name ASC").all();
        return json((results || []).map((r: any) => ({ id: r.id, email: r.email, displayName: r.display_name, role: r.role, teamId: r.team_id, avatarUrl: r.avatar_url, isActive: !!r.is_active, lastLoginAt: r.last_login_at || "", createdAt: r.created_at })));
      } catch { return json([]); }
    }

    if (path === "/api/user-accounts" && method === "POST") {
      const body: any = await request.json();
      const id = genId();
      const ts = now();
      const pw = await hashPassword(body.password || "changeme");
      await env.DB.prepare(
        "INSERT INTO user_accounts (id, email, password_hash, display_name, role, team_id, avatar_url, is_active, last_login_at, created_at) VALUES (?, ?, ?, ?, ?, ?, '', 1, '', ?)"
      ).bind(id, body.email || "", pw, body.displayName || "", body.role || "sales-rep", body.teamId || "", ts).run();
      const row = await env.DB.prepare("SELECT id, email, display_name, role, team_id, avatar_url, is_active, last_login_at, created_at FROM user_accounts WHERE id = ?").bind(id).first();
      return json({ id: row!.id, email: row!.email, displayName: row!.display_name, role: row!.role, teamId: row!.team_id, avatarUrl: row!.avatar_url || "", isActive: !!row!.is_active, lastLoginAt: "", createdAt: row!.created_at }, 201);
    }

    const uaMatch = path.match(/^\/api\/user-accounts\/([^/]+)$/);
    if (uaMatch && method === "PATCH") {
      const id = uaMatch[1];
      const body: any = await request.json();
      const updates: string[] = []; const values: any[] = [];
      if (body.email !== undefined) { updates.push("email = ?"); values.push(body.email); }
      if (body.displayName !== undefined) { updates.push("display_name = ?"); values.push(body.displayName); }
      if (body.role !== undefined) { updates.push("role = ?"); values.push(body.role); }
      if (body.teamId !== undefined) { updates.push("team_id = ?"); values.push(body.teamId); }
      if (body.isActive !== undefined) { updates.push("is_active = ?"); values.push(body.isActive ? 1 : 0); }
      if (body.password) { const pw = await hashPassword(body.password); updates.push("password_hash = ?"); values.push(pw); }
      if (updates.length > 0) { await env.DB.prepare(`UPDATE user_accounts SET ${updates.join(", ")} WHERE id = ?`).bind(...values, id).run(); }
      const row = await env.DB.prepare("SELECT id, email, display_name, role, team_id, avatar_url, is_active, last_login_at, created_at FROM user_accounts WHERE id = ?").bind(id).first();
      if (!row) return err("User not found", 404);
      return json({ id: row.id, email: row.email, displayName: row.display_name, role: row.role, teamId: row.team_id, avatarUrl: row.avatar_url || "", isActive: !!row.is_active, lastLoginAt: row.last_login_at || "", createdAt: row.created_at });
    }

    if (uaMatch && method === "DELETE") {
      await env.DB.prepare("DELETE FROM user_accounts WHERE id = ?").bind(uaMatch[1]).run();
      return json({ success: true });
    }

    // ─── AUTOPILOT ──────────────────────────────────────────────────────

    if (path === "/api/autopilot/config" && method === "GET") {
      try {
        const cfg = await env.DB.prepare("SELECT * FROM autopilot_config WHERE id = 'default'").first();
        if (!cfg) return json({ id: "default", enabled: false, autoProspectEnabled: false, prospectLocations: "Honolulu, Hawaii", prospectVerticals: "restaurant,retail,salon", maxProspectsPerRun: 10, autoOutreachEnabled: false, outreachDelay: 2, maxOutreachPerDay: 15, autoFollowUpEnabled: false, followUpAfterDays: 3, maxFollowUpsPerLead: 3, autoEnrichEnabled: true, lastRunAt: "", totalProspected: 0, totalEmailed: 0, totalFollowUps: 0, updatedAt: "" });
        return json(mapAutopilotConfig(cfg));
      } catch { return json({ id: "default", enabled: false, autoProspectEnabled: false, prospectLocations: "Honolulu, Hawaii", prospectVerticals: "restaurant,retail,salon", maxProspectsPerRun: 10, autoOutreachEnabled: false, outreachDelay: 2, maxOutreachPerDay: 15, autoFollowUpEnabled: false, followUpAfterDays: 3, maxFollowUpsPerLead: 3, autoEnrichEnabled: true, lastRunAt: "", totalProspected: 0, totalEmailed: 0, totalFollowUps: 0, updatedAt: "" }); }
    }

    if (path === "/api/autopilot/config" && method === "PATCH") {
      const body: any = await request.json();
      const boolFields = ["enabled", "autoProspectEnabled", "autoOutreachEnabled", "autoFollowUpEnabled", "autoEnrichEnabled"];
      const fieldMap: Record<string, string> = { enabled: "enabled", autoProspectEnabled: "auto_prospect_enabled", prospectLocations: "prospect_locations", prospectVerticals: "prospect_verticals", maxProspectsPerRun: "max_prospects_per_run", autoOutreachEnabled: "auto_outreach_enabled", outreachDelay: "outreach_delay_hours", maxOutreachPerDay: "max_outreach_per_day", autoFollowUpEnabled: "auto_follow_up_enabled", followUpAfterDays: "follow_up_after_days", maxFollowUpsPerLead: "max_follow_ups_per_lead", autoEnrichEnabled: "auto_enrich_enabled" };
      const updates: string[] = ["updated_at = ?"]; const values: any[] = [now()];
      for (const [jsKey, dbCol] of Object.entries(fieldMap)) { if (body[jsKey] !== undefined) { updates.push(`${dbCol} = ?`); values.push(boolFields.includes(jsKey) ? (body[jsKey] ? 1 : 0) : body[jsKey]); } }
      try {
        await env.DB.prepare(`UPDATE autopilot_config SET ${updates.join(", ")} WHERE id = 'default'`).bind(...values).run();
        const row = await env.DB.prepare("SELECT * FROM autopilot_config WHERE id = 'default'").first();
        return json(mapAutopilotConfig(row!));
      } catch (e: any) { return err(e.message, 500); }
    }

    if (path === "/api/autopilot/toggle" && method === "POST") {
      try {
        const cfg = await env.DB.prepare("SELECT enabled FROM autopilot_config WHERE id = 'default'").first();
        const newEnabled = !(cfg?.enabled);
        await env.DB.prepare("UPDATE autopilot_config SET enabled = ?, updated_at = ? WHERE id = 'default'").bind(newEnabled ? 1 : 0, now()).run();
        const row = await env.DB.prepare("SELECT * FROM autopilot_config WHERE id = 'default'").first();
        return json(mapAutopilotConfig(row!));
      } catch (e: any) { return err(e.message, 500); }
    }

    if (path === "/api/autopilot/run" && method === "POST") {
      try {
        const cfg = await env.DB.prepare("SELECT * FROM autopilot_config WHERE id = 'default'").first();
        return json({ success: true, config: cfg ? mapAutopilotConfig(cfg) : null });
      } catch { return json({ success: true, config: null }); }
    }

    if (path === "/api/autopilot/queue" && method === "GET") {
      try {
        const { results: queue } = await env.DB.prepare("SELECT * FROM outreach_queue ORDER BY created_at DESC LIMIT 100").all();
        const rows = queue || [];
        let leadMap: Record<string, any> = {};
        try { const { results: leads } = await env.DB.prepare("SELECT id, name, business, email FROM leads").all(); (leads || []).forEach((l: any) => { leadMap[l.id] = l; }); } catch {}
        return json(rows.map((q: any) => ({ id: q.id, leadId: q.lead_id, type: q.type, status: q.status, subject: q.subject, body: q.body, htmlBody: q.html_body, scheduledFor: q.scheduled_for, sentAt: q.sent_at || "", error: q.error || "", createdAt: q.created_at, leadName: leadMap[q.lead_id]?.name || "", leadBusiness: leadMap[q.lead_id]?.business || "", leadEmail: leadMap[q.lead_id]?.email || "" })));
      } catch { return json([]); }
    }

    const aqMatch = path.match(/^\/api\/autopilot\/queue\/([^/]+)\/(regenerate|send|skip)$/);
    if (aqMatch && method === "POST") {
      const id = aqMatch[1]; const action = aqMatch[2];
      try {
        if (action === "skip") { await env.DB.prepare("UPDATE outreach_queue SET status = 'skipped' WHERE id = ?").bind(id).run(); return json({ success: true }); }
        if (action === "send") {
          const item = await env.DB.prepare("SELECT * FROM outreach_queue WHERE id = ?").bind(id).first();
          if (!item) return err("Not found", 404);
          if (item.status === "sent") return err("Already sent", 400);
          if (!item.subject || !item.body) return err("Email not generated yet", 400);
          const lead = await env.DB.prepare("SELECT * FROM leads WHERE id = ?").bind(item.lead_id).first();
          if (!lead?.email) return err("No email on lead", 400);
          const apiKey = env.RESEND_API_KEY;
          if (!apiKey) return err("RESEND_API_KEY not configured", 500);
          let fromEmail = "contact@techsavvyhawaii.com"; let fromName = "TechSavvy Hawaii";
          try { const cfg = await env.DB.prepare("SELECT * FROM resend_config WHERE id = 'default'").first(); if (cfg?.enabled) { fromEmail = (cfg.from_email as string) || fromEmail; fromName = (cfg.from_name as string) || fromName; } } catch {}
          const resendRes = await fetch("https://api.resend.com/emails", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` }, body: JSON.stringify({ from: `${fromName} <${fromEmail}>`, to: [lead.email as string], subject: item.subject as string, html: (item.html_body || item.body) as string, text: item.body as string }) });
          if (resendRes.ok) {
            await env.DB.prepare("UPDATE outreach_queue SET status = 'sent', sent_at = ? WHERE id = ?").bind(now(), id).run();
            if (lead.status === "new") { await env.DB.prepare("UPDATE leads SET status = 'contacted', updated_at = ? WHERE id = ?").bind(now(), lead.id).run(); }
            return json({ success: true });
          }
          return err("Send failed", 500);
        }
        if (action === "regenerate") { await env.DB.prepare("UPDATE outreach_queue SET status = 'pending' WHERE id = ?").bind(id).run(); const row = await env.DB.prepare("SELECT * FROM outreach_queue WHERE id = ?").bind(id).first(); return json(row); }
      } catch (e: any) { return err(e.message, 500); }
    }

    const aqDelMatch = path.match(/^\/api\/autopilot\/queue\/([^/]+)$/);
    if (aqDelMatch && method === "DELETE") {
      await env.DB.prepare("DELETE FROM outreach_queue WHERE id = ?").bind(aqDelMatch[1]).run();
      return json({ success: true });
    }

    // ─── AI OPS ─────────────────────────────────────────────────────────

    if (path === "/api/ai-ops/recommend" && method === "POST") {
      const apiKey = env.ANTHROPIC_API_KEY;
      if (!apiKey) return err("Anthropic API key not configured", 500);
      try {
        const [teamRes, leadRes, taskRes, schedRes, clientRes] = await Promise.all([
          env.DB.prepare("SELECT * FROM team_members").all(), env.DB.prepare("SELECT * FROM leads").all(),
          env.DB.prepare("SELECT * FROM tasks").all(), env.DB.prepare("SELECT * FROM schedule_items").all(),
          env.DB.prepare("SELECT * FROM clients").all(),
        ]);
        let biz: any = null; try { biz = await env.DB.prepare("SELECT * FROM business_info WHERE id = 'default'").first(); } catch {}
        const team = teamRes.results || []; const leads = leadRes.results || []; const tasks = taskRes.results || [];
        const schedule = schedRes.results || []; const clients = clientRes.results || [];
        const todayStr = new Date().toISOString().split("T")[0];
        const pendingTasks = tasks.filter((t: any) => !t.completed);
        const todaySchedule = schedule.filter((s: any) => s.date === todayStr);
        const context = `BUSINESS CONTEXT:\n- Company: ${biz?.company_name || "TechSavvy Hawaii"}\n- Processor Partner: ${biz?.processor_partner || "CashSwipe"}\n- Current Phase: ${biz?.current_phase || "onboarding"}\n- Today: ${todayStr}\n\nTEAM:\n${team.map((m: any) => `- ${m.name}: ${m.role} (${m.daily_involvement})`).join("\n")}\n\nSTATE: ${leads.length} leads (${leads.filter((l: any) => !["won","lost"].includes(l.status)).length} active), ${clients.length} clients, ${pendingTasks.length} pending tasks, ${todaySchedule.length} scheduled today\n\nTASKS:\n${pendingTasks.slice(0, 10).map((t: any) => `- [${t.priority}] ${t.title} (due: ${t.due_date || "none"})`).join("\n") || "None"}`;
        const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" }, body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 2048, system: `You are the AI Operations Assistant for a merchant services startup. Generate actionable daily recommendations. Return a JSON array. Each item: title, description, assigneeName (team member name), priority ("high"|"medium"|"low"), category ("training"|"outreach"|"admin"|"meeting"|"follow-up"|"development"). Return ONLY valid JSON array.`, messages: [{ role: "user", content: context }] }) });
        if (!anthropicRes.ok) return err("Failed to generate recommendations", 500);
        const data: any = await anthropicRes.json();
        const text = (data.content || []).filter((b: any) => b.type === "text").map((b: any) => b.text).join("");
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        return json({ recommendations: jsonMatch ? JSON.parse(jsonMatch[0]) : [], generatedAt: now() });
      } catch (e: any) { return err("Failed: " + e.message, 500); }
    }

    if (path === "/api/ai-ops/chat" && method === "POST") {
      const apiKey = env.ANTHROPIC_API_KEY;
      if (!apiKey) return err("Anthropic API key not configured", 500);
      const body: any = await request.json();
      if (!body.message) return err("Message required");
      try {
        const [teamRes, leadRes, taskRes, clientRes] = await Promise.all([
          env.DB.prepare("SELECT * FROM team_members").all(), env.DB.prepare("SELECT * FROM leads").all(),
          env.DB.prepare("SELECT * FROM tasks").all(), env.DB.prepare("SELECT * FROM clients").all(),
        ]);
        let biz: any = null; try { biz = await env.DB.prepare("SELECT * FROM business_info WHERE id = 'default'").first(); } catch {}
        const team = teamRes.results || []; const leads = leadRes.results || [];
        const tasks = taskRes.results || []; const clients = clientRes.results || [];
        const systemPrompt = `You are the AI Operations Assistant for ${biz?.company_name || "TechSavvy Hawaii"}, a merchant services startup in the ${biz?.current_phase || "onboarding"} phase.\nTEAM: ${team.map((m: any) => `${m.name} (${m.role})`).join("; ")}\nSTATS: ${leads.length} leads, ${clients.length} clients, ${tasks.filter((t: any) => !t.completed).length} pending tasks\nBe concise, actionable, specific.`;
        const messages: any[] = [];
        if (Array.isArray(body.history)) { for (const h of body.history.slice(-10)) { if (h.role && h.content) messages.push({ role: h.role, content: h.content.slice(0, 2000) }); } }
        messages.push({ role: "user", content: body.message });
        const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" }, body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1024, system: systemPrompt, messages }) });
        if (!anthropicRes.ok) return err("Failed to get AI response", 500);
        const data: any = await anthropicRes.json();
        const text = (data.content || []).filter((b: any) => b.type === "text").map((b: any) => b.text).join("");
        return json({ reply: text });
      } catch (e: any) { return err("Failed: " + e.message, 500); }
    }

    // ─── EMAIL OUTREACH / CALL SCRIPT ───────────────────────────────────

    if (path === "/api/email/outreach/generate" && method === "POST") {
      const body: any = await request.json();
      if (!body.leadId) return err("leadId required");
      const lead = await env.DB.prepare("SELECT * FROM leads WHERE id = ?").bind(body.leadId).first();
      if (!lead) return err("Lead not found", 404);
      const business = (lead.business as string) || (lead.name as string) || "your business";
      return json({ subject: `Eliminate Processing Fees for ${business}`, html: `<p>Hi ${lead.name || "there"},</p><p>I'm reaching out from TechSavvy Hawaii. We help businesses like ${business} eliminate credit card processing fees entirely with our zero-fee payment solution.</p><p>Would you be open to a quick chat about how we could save you money?</p><p>Best,<br>TechSavvy Team</p>`, text: `Hi ${lead.name || "there"},\n\nI'm reaching out from TechSavvy Hawaii. We help businesses like ${business} eliminate credit card processing fees entirely.\n\nWould you be open to a quick chat?\n\nBest,\nTechSavvy Team` });
    }

    if (path === "/api/email/outreach/send" && method === "POST") {
      const body: any = await request.json();
      if (!body.leadId) return err("leadId required");
      const lead = await env.DB.prepare("SELECT * FROM leads WHERE id = ?").bind(body.leadId).first();
      if (!lead) return err("Lead not found", 404);
      if (!lead.email) return err("Lead has no email address");
      const apiKey = env.RESEND_API_KEY;
      if (!apiKey) return err("RESEND_API_KEY not configured", 500);
      let fromEmail = "contact@techsavvyhawaii.com"; let fromName = "TechSavvy Hawaii";
      try { const cfg = await env.DB.prepare("SELECT * FROM resend_config WHERE id = 'default'").first(); if (cfg?.enabled) { fromEmail = (cfg.from_email as string) || fromEmail; fromName = (cfg.from_name as string) || fromName; } } catch {}
      const subject = body.subject || `Eliminate Processing Fees for ${lead.business || lead.name}`;
      const html = body.html || `<p>Hi ${lead.name},</p><p>We'd love to help ${lead.business || "your business"} eliminate processing fees.</p><p>Best,<br>TechSavvy Team</p>`;
      const resendRes = await fetch("https://api.resend.com/emails", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` }, body: JSON.stringify({ from: `${fromName} <${fromEmail}>`, to: [lead.email as string], subject, html, text: body.text || "" }) });
      if (!resendRes.ok) { const errText = await resendRes.text(); return err("Failed to send: " + errText, 500); }
      if (lead.status === "new") { await env.DB.prepare("UPDATE leads SET status = 'contacted', updated_at = ? WHERE id = ?").bind(now(), lead.id).run(); }
      const tid = genId(); const ts = now();
      await env.DB.prepare("INSERT INTO email_threads (id, subject, lead_id, contact_email, contact_name, source, status, unread, last_message_at, created_at) VALUES (?, ?, ?, ?, ?, 'outreach', 'open', 0, ?, ?)").bind(tid, subject, lead.id, lead.email, lead.name, ts, ts).run();
      return json({ success: true, threadId: tid });
    }

    if (path === "/api/email/call-script/generate" && method === "POST") {
      const body: any = await request.json();
      if (!body.leadId) return err("leadId required");
      const lead = await env.DB.prepare("SELECT * FROM leads WHERE id = ?").bind(body.leadId).first();
      if (!lead) return err("Lead not found", 404);
      const business = (lead.business as string) || "the business";
      return json({ id: genId(), leadId: lead.id, generatedAt: now(), script: `Opening: "Hi, this is [Your Name] from TechSavvy Hawaii. I'm reaching out because we help businesses like ${business} eliminate credit card processing fees entirely."\n\nValue Prop: "We offer a zero-fee processing solution — your customers pay a small surcharge, and you keep 100% of your revenue. Plus, for our processing customers, we build custom websites for free."\n\nQualifying Questions:\n1. "What payment processor are you currently using?"\n2. "About how much do you process monthly?"\n3. "How much are you paying in processing fees?"\n\nClose: "I'd love to do a free savings analysis for you. Can I get a copy of your most recent processing statement?"`, talkingPoints: ["Zero-fee processing", "Free website for merchants", "$500 one-time terminal cost", "No monthly fees"], objections: [{ objection: "We're happy with our current processor", response: "That's great! Most of our happiest clients felt the same way. Would it be worth 5 minutes to see if we could save you money?" }, { objection: "Surcharging turns off customers", response: "Studies show minimal customer pushback. Many businesses in Hawaii are already doing it successfully." }] });
    }

    // ─── AUTOMATIONS ────────────────────────────────────────────────────

    if (path === "/api/automations/onboard-client" && method === "POST") {
      const body: any = await request.json();
      if (!body.clientId) return err("Client ID required");
      const todayStr = new Date().toISOString().split("T")[0];
      const clientName = body.clientName || "New Client";
      const taskList = [
        { title: `Set up terminal for ${clientName}`, dueDate: todayStr, priority: "high" },
        { title: `Send welcome email to ${clientName}`, dueDate: todayStr, priority: "high" },
        { title: `Begin website build for ${clientName}`, dueDate: new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0], priority: "medium" },
        { title: `First check-in call with ${clientName}`, dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0], priority: "medium" },
      ];
      const created = [];
      for (const t of taskList) {
        const id = genId();
        await env.DB.prepare("INSERT INTO tasks (id, title, due_date, priority, completed, linked_to, assignee, created_at) VALUES (?, ?, ?, ?, 0, ?, '', ?)").bind(id, t.title, t.dueDate, t.priority, body.clientId, now()).run();
        created.push({ id, ...t });
      }
      return json({ created: created.length, tasks: created });
    }

    // ─── LEAD ACTIVITIES ────────────────────────────────────────────────

    const actLeadMatch = path.match(/^\/api\/activities\/([^/]+)$/);
    if (actLeadMatch && method === "GET") {
      try {
        const { results } = await env.DB.prepare("SELECT * FROM lead_activities WHERE lead_id = ? ORDER BY created_at DESC").bind(actLeadMatch[1]).all();
        return json((results || []).map((r: any) => ({ id: r.id, leadId: r.lead_id, opportunityId: r.opportunity_id || "", userId: r.user_id || "", type: r.type, title: r.title, description: r.description, metadata: r.metadata || "{}", createdAt: r.created_at })));
      } catch { return json([]); }
    }

    if (path === "/api/activities" && method === "POST") {
      const body: any = await request.json();
      const id = genId();
      const ts = now();
      await env.DB.prepare(
        "INSERT INTO lead_activities (id, lead_id, opportunity_id, user_id, type, title, description, metadata, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
      ).bind(id, body.leadId || "", body.opportunityId || "", body.userId || "", body.type || "note", body.title || "", body.description || "", body.metadata || "{}", ts).run();
      return json({ id, leadId: body.leadId || "", opportunityId: body.opportunityId || "", userId: body.userId || "", type: body.type || "note", title: body.title || "", description: body.description || "", metadata: body.metadata || "{}", createdAt: ts }, 201);
    }

    // ─── MISSING ROUTES ─────────────────────────────────────────────

    // GET /api/ai-config/full (admin settings page)
    if (path === "/api/ai-config/full" && method === "GET") {
      if (!session) return err("Unauthorized", 401);
      const config = await env.DB.prepare("SELECT * FROM ai_config WHERE id = 'default'").first();
      if (!config) return json({ id: "default", enabled: false, model: "claude-sonnet-4-20250514", systemPrompt: "", welcomeMessage: "", maxTokens: 1024 });
      return json({
        id: config.id, enabled: !!config.enabled, model: config.model,
        systemPrompt: config.system_prompt, welcomeMessage: config.welcome_message,
        maxTokens: config.max_tokens,
      });
    }

    // GET /api/health
    if (path === "/api/health" && method === "GET") {
      return json({ status: "ok", timestamp: new Date().toISOString(), env: "cloudflare-pages" });
    }

    // POST /api/ai-ops/import-prospects
    if (path === "/api/ai-ops/import-prospects" && method === "POST") {
      if (!session) return err("Unauthorized", 401);
      const body = await ctx.request.json() as Record<string, unknown>;
      const prospects = body.prospects as any[];
      const sourceLabel = (body.sourceLabel as string) || "Web scrape";
      if (!Array.isArray(prospects) || prospects.length === 0) return err("No prospects to import.");

      const now = new Date().toISOString();
      const created: any[] = [];

      for (const p of prospects) {
        const id = `lead-${crypto.randomUUID().slice(0, 8)}`;
        const socialStr = p.socialLinks ? Object.entries(p.socialLinks).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join("\n") : "";
        await env.DB.prepare(`INSERT INTO leads (id, name, business, address, phone, email, decision_maker_name, decision_maker_role, best_contact_method, package, status, source, vertical, current_processor, current_equipment, monthly_volume, pain_points, next_step, next_step_date, attachments, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, '', ?, 'terminal', 'new', 'direct', ?, ?, '', '', ?, 'Initial outreach', ?, '[]', ?, ?, ?)`)
          .bind(id, p.name || "", p.business || "", p.address || "", p.phone || "", p.email || "", p.name || "", p.phone ? "phone" : p.email ? "email" : "phone", p.vertical || "other", p.currentProcessor || "", p.currentProcessor ? `Currently using ${p.currentProcessor}` : "", now.split("T")[0], `[AI Prospector] ${sourceLabel}${p.website ? `\nWebsite: ${p.website}` : ""}${socialStr ? `\nSocial:\n${socialStr}` : ""}${p.notes ? `\n${p.notes}` : ""}`.trim(), now, now)
          .run();
        created.push({ id, name: p.name || "", business: p.business || "" });
      }
      return json({ imported: created.length, leads: created });
    }

    // POST /api/ai-ops/tech-scan (simplified tech detection)
    if (path === "/api/ai-ops/tech-scan" && method === "POST") {
      if (!session) return err("Unauthorized", 401);
      const body = await ctx.request.json() as Record<string, unknown>;
      const rawUrl = body.url;
      if (!rawUrl) return err("URL is required.");

      const urls = Array.isArray(rawUrl) ? rawUrl as string[] : [rawUrl as string];
      const results: any[] = [];

      for (const targetUrl of urls.slice(0, 20)) {
        try {
          const resp = await fetch(targetUrl, {
            headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
            signal: AbortSignal.timeout(12000),
          });
          if (!resp.ok) { results.push({ url: targetUrl, techStack: [], title: "", error: `HTTP ${resp.status}` }); continue; }
          const html = await resp.text();
          const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
          const techStack = detectTechStackSimple(html);
          results.push({ url: targetUrl, techStack, title: titleMatch?.[1]?.trim() || "" });
        } catch (e: any) {
          results.push({ url: targetUrl, techStack: [], title: "", error: e.message });
        }
      }
      return json({ results, scannedAt: new Date().toISOString() });
    }

    // POST /api/ai-ops/scrape-prospects
    if (path === "/api/ai-ops/scrape-prospects" && method === "POST") {
      if (!session) return err("Unauthorized", 401);
      const apiKey = env.ANTHROPIC_API_KEY;
      if (!apiKey) return err("Anthropic API key not configured.", 500);

      const body = await ctx.request.json() as Record<string, unknown>;
      const rawUrl = body.url;
      if (!rawUrl) return err("URL is required.");

      const urls = Array.isArray(rawUrl) ? rawUrl as string[] : [rawUrl as string];
      const allProspects: any[] = [];
      const allTechStacks: Record<string, any[]> = {};

      for (const targetUrl of urls.slice(0, 20)) {
        try {
          const resp = await fetch(targetUrl, {
            headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
            signal: AbortSignal.timeout(15000),
          });
          if (!resp.ok) continue;
          const html = await resp.text();
          const techStack = detectTechStackSimple(html);
          allTechStacks[targetUrl] = techStack;

          const cleaned = html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 50000);
          const techContext = techStack.length > 0 ? `\nTECH DETECTED: ${techStack.map((t: any) => `${t.name} (${t.category})`).join(", ")}` : "";

          const aiResp = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
            body: JSON.stringify({
              model: "claude-sonnet-4-20250514", max_tokens: 4096,
              system: `Extract ALL business listings from the page. Return ONLY a JSON array. Each item: { "business": "", "name": "", "address": "", "phone": "", "email": "", "website": "", "vertical": "restaurant|retail|salon|auto|medical|services|other", "currentProcessor": "", "notes": "" }. Return [] if none found.${techContext}`,
              messages: [{ role: "user", content: `Extract from ${targetUrl}:\n\n${cleaned}` }],
            }),
          });
          const aiData = await aiResp.json() as any;
          const text = (aiData.content || []).filter((b: any) => b.type === "text").map((b: any) => b.text).join("");
          const jsonMatch = text.match(/\[[\s\S]*\]/);
          const prospects = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
          for (const p of prospects) { p._sourceUrl = targetUrl; p._techStack = techStack; }
          allProspects.push(...prospects);
          if (urls.length > 1) await new Promise(r => setTimeout(r, 1500));
        } catch (e: any) { console.error(`Scrape error ${targetUrl}:`, e.message); }
      }
      return json({ prospects: allProspects, techStacks: allTechStacks, source: urls.length === 1 ? urls[0] : `${urls.length} URLs`, scrapedAt: new Date().toISOString() });
    }

    // POST /api/ai-ops/google-dork
    if (path === "/api/ai-ops/google-dork" && method === "POST") {
      if (!session) return err("Unauthorized", 401);
      const apiKey = env.ANTHROPIC_API_KEY;
      const body = await ctx.request.json() as Record<string, unknown>;
      const query = body.query as string;
      const location = body.location as string;
      if (!query) return err("Query is required.");

      if (!apiKey) {
        return json({ results: [], urls: [], query, searchedAt: new Date().toISOString(), noApiKey: true, message: "No Anthropic API key. Use 'Open in Google' then paste URLs into URL Scanner." });
      }

      try {
        const aiResp = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514", max_tokens: 2048,
            system: `Generate Google search queries (dorks) to find local businesses for merchant services prospecting. Return JSON: { "dorks": [{ "query": "search string", "purpose": "why" }], "urls": ["direct URLs to try"] }`,
            messages: [{ role: "user", content: `Generate dorks for: "${query}"${location ? ` in ${location}` : ""}. Focus on finding businesses without modern payment processing.` }],
          }),
        });
        const aiData = await aiResp.json() as any;
        const text = (aiData.content || []).filter((b: any) => b.type === "text").map((b: any) => b.text).join("");
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { dorks: [], urls: [] };
        return json({ results: parsed.dorks || [], urls: parsed.urls || [], query, searchedAt: new Date().toISOString() });
      } catch (e: any) {
        return json({ results: [], urls: [], query, searchedAt: new Date().toISOString(), error: e.message });
      }
    }

    // POST /api/resources/upload
    if (path === "/api/resources/upload" && method === "POST") {
      if (!session) return err("Unauthorized", 401);
      const body = await ctx.request.json() as Record<string, unknown>;
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      await env.DB.prepare(`INSERT INTO admin_resources (id, title, description, category, type, url, thumbnail_url, sort_order, featured, published, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0, 1, ?, ?)`)
        .bind(id, body.title || "", body.description || "", body.category || "guide", body.type || "link", body.url || "", body.thumbnailUrl || "", now, now).run();
      return json({ id, title: body.title, url: body.url, createdAt: now }, 201);
    }

    // ─── CATCH-ALL ──────────────────────────────────────────────────────

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
    address: row.address || "",
    phone: row.phone,
    email: row.email,
    decisionMakerName: row.decision_maker_name || "",
    decisionMakerRole: row.decision_maker_role || "",
    bestContactMethod: row.best_contact_method || "phone",
    package: row.package,
    status: row.status,
    source: row.source || "direct",
    vertical: row.vertical || "other",
    currentProcessor: row.current_processor || "",
    currentEquipment: row.current_equipment || "",
    monthlyVolume: row.monthly_volume || "",
    painPoints: row.pain_points || "",
    nextStep: row.next_step || "",
    nextStepDate: row.next_step_date || "",
    attachments: (() => { try { return JSON.parse(row.attachments as string || "[]"); } catch { return []; } })(),
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

function mapReferralPartner(row: Record<string, unknown>) {
  return { id: row.id, name: row.name, niche: row.niche, clientTypes: row.client_types, referralTerms: row.referral_terms, introMethod: row.intro_method, trackingNotes: row.tracking_notes, lastCheckIn: row.last_check_in, nextCheckIn: row.next_check_in, createdAt: row.created_at };
}

function mapPlaybookCheck(row: Record<string, unknown>) {
  return { id: row.id, channel: row.channel, label: row.label, completed: !!row.completed, completedAt: row.completed_at || "" };
}

function mapPinnedPitch(row: Record<string, unknown>) {
  return { id: row.id, scriptKey: row.script_key, customContent: row.custom_content, pinnedAt: row.pinned_at };
}

function mapKPI(row: Record<string, unknown>) {
  return { id: row.id, weekStart: row.week_start, outboundCalls: row.outbound_calls, outboundEmails: row.outbound_emails, outboundDMs: row.outbound_dms, walkIns: row.walk_ins, contactsMade: row.contacts_made, appointmentsSet: row.appointments_set, statementsRequested: row.statements_requested, statementsReceived: row.statements_received, proposalsSent: row.proposals_sent, dealsWon: row.deals_won, volumeWon: row.volume_won, notes: row.notes };
}

function mapPlanItem(row: Record<string, unknown>) {
  return { id: row.id, phase: row.phase, weekRange: row.week_range, title: row.title, description: row.description, completed: !!row.completed, completedAt: row.completed_at || "", order: row.sort_order };
}

function mapMaterial(row: Record<string, unknown>) {
  return { id: row.id, category: row.category, name: row.name, description: row.description, status: row.status, fileUrl: row.file_url, updatedAt: row.updated_at };
}

function mapFile(row: Record<string, unknown>) {
  return { id: row.id, name: row.name, size: row.size, type: row.type, category: row.category, folder: row.folder || "", starred: row.starred ? 1 : 0, uploadedAt: row.uploaded_at, url: row.url };
}

function mapEquipment(row: Record<string, unknown>) {
  return {
    id: row.id, name: row.name, type: row.type, serialNumber: row.serial_number,
    model: row.model, brand: row.brand || "", firmwareVersion: row.firmware_version || "",
    partNumber: row.part_number || "", productCode: row.product_code || "",
    featureCode: row.feature_code || "", appCode: row.app_code || "",
    connectivity: row.connectivity || "", manufactureDate: row.manufacture_date || "",
    status: row.status, condition: row.condition,
    clientId: row.client_id || "", clientName: row.client_name || "",
    deployedDate: row.deployed_date || "", purchaseDate: row.purchase_date || "",
    purchaseCost: row.purchase_cost || 0, warrantyExpiry: row.warranty_expiry || "",
    notes: row.notes || "", createdAt: row.created_at, updatedAt: row.updated_at,
  };
}

function mapInvoice(row: Record<string, unknown>) {
  return { id: row.id, invoiceNumber: row.invoice_number, clientName: row.client_name, amount: row.amount, status: row.status, dueDate: row.due_date, paidDate: row.paid_date || "", notes: row.notes, fileUrl: row.file_url, fileName: row.file_name, createdAt: row.created_at, updatedAt: row.updated_at };
}

function mapResource(row: Record<string, unknown>) {
  return { id: row.id, title: row.title, description: row.description, category: row.category, type: row.type, url: row.url, thumbnailUrl: row.thumbnail_url, order: row.sort_order, featured: !!row.featured, published: !!row.published, createdAt: row.created_at, updatedAt: row.updated_at };
}

function mapBusinessInfo(row: Record<string, unknown>) {
  return { companyName: row.company_name || "", dba: row.dba || "", phone: row.phone || "", email: row.email || "", address: row.address || "", website: row.website || "", taxId: row.tax_id || "", bankPartner: row.bank_partner || "", processorPartner: row.processor_partner || "CashSwipe", currentPhase: row.current_phase || "onboarding", notes: row.notes || "", updatedAt: row.updated_at };
}

function mapAutopilotConfig(row: Record<string, unknown>) {
  return { id: row.id, enabled: !!row.enabled, autoProspectEnabled: !!row.auto_prospect_enabled, prospectLocations: row.prospect_locations || "Honolulu, Hawaii", prospectVerticals: row.prospect_verticals || "restaurant,retail,salon", maxProspectsPerRun: row.max_prospects_per_run || 10, autoOutreachEnabled: !!row.auto_outreach_enabled, outreachDelay: row.outreach_delay_hours || 2, maxOutreachPerDay: row.max_outreach_per_day || 15, autoFollowUpEnabled: !!row.auto_follow_up_enabled, followUpAfterDays: row.follow_up_after_days || 3, maxFollowUpsPerLead: row.max_follow_ups_per_lead || 3, autoEnrichEnabled: !!row.auto_enrich_enabled, lastRunAt: row.last_run_at || "", totalProspected: row.total_prospected || 0, totalEmailed: row.total_emailed || 0, totalFollowUps: row.total_follow_ups || 0, updatedAt: row.updated_at || "" };
}

// ─── PDF text extraction (lightweight, works in Workers runtime) ──────

function extractPdfText(bytes: Uint8Array): string {
  // Convert to string for regex parsing (latin1 to preserve all bytes)
  let raw = "";
  for (let i = 0; i < bytes.length; i++) raw += String.fromCharCode(bytes[i]);

  const textParts: string[] = [];

  // Method 1: Extract text between BT/ET blocks (standard PDF text objects)
  const btEtRegex = /BT\s([\s\S]*?)ET/g;
  let match;
  while ((match = btEtRegex.exec(raw)) !== null) {
    const block = match[1];
    // Extract strings in parentheses: (text) Tj or (text) TJ
    const tjRegex = /\(([^)]*)\)/g;
    let tjMatch;
    while ((tjMatch = tjRegex.exec(block)) !== null) {
      const decoded = tjMatch[1]
        .replace(/\\n/g, "\n").replace(/\\r/g, "\r").replace(/\\t/g, "\t")
        .replace(/\\\\/g, "\\").replace(/\\([()])/g, "$1");
      if (decoded.trim()) textParts.push(decoded);
    }
    // Hex strings: <hex> Tj
    const hexRegex = /<([0-9A-Fa-f]+)>/g;
    let hexMatch;
    while ((hexMatch = hexRegex.exec(block)) !== null) {
      const hex = hexMatch[1];
      let decoded = "";
      for (let i = 0; i < hex.length; i += 2) {
        const code = parseInt(hex.substring(i, i + 2), 16);
        if (code >= 32 && code < 127) decoded += String.fromCharCode(code);
      }
      if (decoded.trim()) textParts.push(decoded);
    }
  }

  // Method 2: Look for stream content with readable text (fallback)
  if (textParts.length < 5) {
    const streamRegex = /stream\s*\n([\s\S]*?)\nendstream/g;
    while ((match = streamRegex.exec(raw)) !== null) {
      const content = match[1];
      // Only extract printable ASCII sequences of 4+ chars
      const readable = content.match(/[\x20-\x7E]{4,}/g);
      if (readable) textParts.push(...readable);
    }
  }

  return textParts.join(" ").replace(/\s+/g, " ").trim();
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function buildAnalysisEmailHtml(name: string, business: string, analysis: any, annualOverpay: string): string {
  const grade = analysis.overallGrade || "?";
  const gradeColor = grade === "A" || grade === "B" ? "#10b981" : grade === "C" ? "#f59e0b" : "#ef4444";
  const hiddenFees = Array.isArray(analysis.hiddenFees) ? analysis.hiddenFees : [];
  const redFlags = Array.isArray(analysis.redFlags) ? analysis.redFlags : [];
  const recs = Array.isArray(analysis.recommendations) ? analysis.recommendations : [];

  return `<div style="font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;max-width:640px;margin:0 auto;background:#0a0a0a;color:#e0e0e0;">
    <div style="padding:32px;background:linear-gradient(135deg,#0f172a,#1e1b4b);border-bottom:2px solid #4aeaff;">
      <h1 style="margin:0;font-size:24px;color:#4aeaff;">λechSavvy</h1>
      <p style="margin:8px 0 0;color:#94a3b8;font-size:14px;">Statement Analysis Report</p>
    </div>
    <div style="padding:32px;">
      <p style="font-size:16px;">Hi ${name},</p>
      <p style="font-size:14px;color:#aaa;">Here's your AI-powered analysis for <strong>${business}</strong>.</p>

      <div style="text-align:center;margin:24px 0;padding:24px;background:#1a1a2e;border-radius:12px;border:1px solid ${gradeColor}33;">
        <p style="margin:0;font-size:14px;color:#aaa;">Overall Grade</p>
        <p style="margin:8px 0;font-size:64px;font-weight:900;color:${gradeColor};">${grade}</p>
        <p style="margin:0;font-size:14px;color:#aaa;">Effective Rate: ${analysis.effectiveRate || "N/A"} • Volume: ${analysis.monthlyVolume || "N/A"}</p>
      </div>

      <div style="background:#1a1a2e;border:1px solid #2a2a4a;border-radius:12px;padding:20px;margin-bottom:16px;">
        <h3 style="color:#ef4444;margin:0 0 12px;">Est. Monthly Overpay: ${analysis.estimatedOverpay || "N/A"}</h3>
        <p style="color:#aaa;font-size:13px;margin:0;">That's roughly <strong>${annualOverpay}/year</strong> you could be saving.</p>
      </div>

      ${hiddenFees.length > 0 ? `<div style="background:#1a1a2e;border:1px solid #2a2a4a;border-radius:12px;padding:20px;margin-bottom:16px;">
        <h3 style="color:#f59e0b;margin:0 0 12px;">Hidden Fees Found (${hiddenFees.length})</h3>
        ${hiddenFees.map((f: any) => `<p style="color:#ddd;font-size:13px;margin:4px 0;">• <strong>${f.name}</strong>: ${f.amount || ""} — ${f.explanation || ""}</p>`).join("")}
      </div>` : ""}

      ${redFlags.length > 0 ? `<div style="background:#1a1a2e;border:1px solid #2a2a4a;border-radius:12px;padding:20px;margin-bottom:16px;">
        <h3 style="color:#ef4444;margin:0 0 12px;">🚩 Red Flags (${redFlags.length})</h3>
        ${redFlags.map((f: any) => `<p style="color:#ddd;font-size:13px;margin:4px 0;">• ${typeof f === "string" ? f : f.description || f.name || ""}</p>`).join("")}
      </div>` : ""}

      ${recs.length > 0 ? `<div style="background:#1a1a2e;border:1px solid #2a2a4a;border-radius:12px;padding:20px;margin-bottom:16px;">
        <h3 style="color:#4aeaff;margin:0 0 12px;">Recommendations</h3>
        ${recs.map((r: any) => `<p style="color:#ddd;font-size:13px;margin:4px 0;">✓ ${typeof r === "string" ? r : r.text || ""}</p>`).join("")}
      </div>` : ""}

      <div style="background:linear-gradient(135deg,#1e1b4b,#0f172a);border:1px solid #4aeaff33;border-radius:12px;padding:24px;text-align:center;margin-top:24px;">
        <h3 style="color:#4aeaff;margin:0 0 8px;">Ready to eliminate these fees?</h3>
        <p style="color:#aaa;font-size:14px;margin:0 0 16px;">Our zero-fee processing solution means you keep 100% of your revenue.</p>
        <a href="https://techsavvyhawaii.com/connect" style="display:inline-block;background:#4aeaff;color:#000;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;margin-right:8px;">Get Started</a>
        <a href="tel:+18087675460" style="display:inline-block;background:transparent;color:#4aeaff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;border:1px solid #4aeaff;">📞 (808) 767-5460</a>
      </div>

      <p style="color:#666;font-size:12px;margin-top:32px;text-align:center;">TechSavvy Hawaii • techsavvyhawaii.com • contact@techsavvyhawaii.com</p>
    </div>
  </div>`;
}

function buildGuidesEmailHtml(name: string): string {
  return `<div style="font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;max-width:640px;margin:0 auto;background:#0a0a0a;color:#e0e0e0;">
    <div style="padding:32px;background:linear-gradient(135deg,#0f172a,#1e1b4b);border-bottom:2px solid #4aeaff;">
      <h1 style="margin:0;font-size:24px;color:#4aeaff;">λechSavvy</h1>
      <p style="margin:8px 0 0;color:#94a3b8;font-size:14px;">Your Free Statement Review Guides</p>
    </div>
    <div style="padding:32px;">
      <p style="font-size:16px;margin-bottom:8px;">Hi ${name},</p>
      <p style="font-size:14px;color:#aaa;margin-bottom:24px;">Thanks for your interest! Here are your free guides to help you review your merchant processing statement.</p>
      <div style="margin-bottom:24px;">
        <div style="background:#1a1a2e;border:1px solid #2a2a4a;border-radius:12px;padding:20px;margin-bottom:12px;">
          <h3 style="color:#4aeaff;margin:0 0 4px;font-size:16px;">📋 Top 10 Statement Checklist</h3>
          <p style="color:#aaa;font-size:13px;margin:0 0 12px;">Spot hidden fees, inflated rates, and junk charges in under 10 minutes.</p>
          <a href="https://assets.techsavvyhawaii.com/website-resources/1771403190912-top-10-statement-check.pdf" style="color:#4aeaff;font-size:13px;text-decoration:none;font-weight:600;">Download Guide →</a>
        </div>
        <div style="background:#1a1a2e;border:1px solid #2a2a4a;border-radius:12px;padding:20px;margin-bottom:12px;">
          <h3 style="color:#4aeaff;margin:0 0 4px;font-size:16px;">📊 Rate Comparison Guide</h3>
          <p style="color:#aaa;font-size:13px;margin:0 0 12px;">Industry benchmarks for restaurants, retail, salons, medical & more.</p>
          <a href="https://assets.techsavvyhawaii.com/website-resources/1771403189858-rate-comparison-guide.pdf" style="color:#4aeaff;font-size:13px;text-decoration:none;font-weight:600;">Download Guide →</a>
        </div>
        <div style="background:#1a1a2e;border:1px solid #2a2a4a;border-radius:12px;padding:20px;margin-bottom:12px;">
          <h3 style="color:#4aeaff;margin:0 0 4px;font-size:16px;">🔒 Security Checklist</h3>
          <p style="color:#aaa;font-size:13px;margin:0 0 12px;">PCI compliance, fraud prevention, and breach response checklist.</p>
          <a href="https://assets.techsavvyhawaii.com/website-resources/1771403187943-payment-security-checklist.pdf" style="color:#4aeaff;font-size:13px;text-decoration:none;font-weight:600;">Download Guide →</a>
        </div>
        <div style="background:#1a1a2e;border:1px solid #2a2a4a;border-radius:12px;padding:20px;margin-bottom:12px;">
          <h3 style="color:#4aeaff;margin:0 0 4px;font-size:16px;">💰 Cash Discount Guide</h3>
          <p style="color:#aaa;font-size:13px;margin:0 0 12px;">How to eliminate processing fees entirely — legal in all 50 states.</p>
          <a href="https://assets.techsavvyhawaii.com/website-resources/1771403188928-cash-discount-explained.pdf" style="color:#4aeaff;font-size:13px;text-decoration:none;font-weight:600;">Download Guide →</a>
        </div>
      </div>
      <div style="background:linear-gradient(135deg,#1e1b4b,#0f172a);border:1px solid #4aeaff33;border-radius:12px;padding:24px;text-align:center;">
        <h3 style="color:#4aeaff;margin:0 0 8px;font-size:18px;">Want us to review it for you?</h3>
        <p style="color:#aaa;font-size:14px;margin:0 0 16px;">Upload your statement for a free AI-powered analysis, or call us for a personal review.</p>
        <a href="https://techsavvyhawaii.com/statement-review" style="display:inline-block;background:#4aeaff;color:#000;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;margin-right:8px;">AI Analysis</a>
        <a href="tel:+18087675460" style="display:inline-block;background:transparent;color:#4aeaff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;border:1px solid #4aeaff;">📞 (808) 767-5460</a>
      </div>
      <p style="color:#666;font-size:12px;margin-top:32px;text-align:center;">TechSavvy Hawaii • techsavvyhawaii.com • contact@techsavvyhawaii.com</p>
    </div>
  </div>`;
}
