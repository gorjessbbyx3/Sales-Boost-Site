/**
 * Tech Savvy Hawaii — Email Worker (tight-fog-5031)
 *
 * Handles:
 * 1. email() — Inbound email processing, AI classification, D1 logging, forwarding
 * 2. fetch() — API for health check, stats, and (gated) QA injection endpoints
 *
 * The persistence + R2 attachment logic lives in `persistInbound()` so it can
 * be exercised from both the live email() handler and the /test-inbound
 * endpoint used by `script/qa-email-attachments.mjs`.
 */

import PostalMime from "postal-mime";

const AI_WORKER_URL = "https://mojo-luna-955c.gorjessbbyx3.workers.dev";
const FORWARD_TO = "gorjessbbyx3@icloud.com";

// Per-attachment guardrails (size cap, count cap, executable blocklist).
// Shared by the live email path and the /test-inbound injection path.
const MAX_ATTACHMENT_BYTES = 25 * 1024 * 1024; // per attachment (~25MB)
const MAX_TOTAL_BYTES = 50 * 1024 * 1024;      // per email
const MAX_ATTACHMENT_COUNT = 20;               // per email
const BLOCKED_EXTENSIONS = new Set([
  "exe","scr","bat","com","cmd","vbs","vbe","js","jse","wsf","wsh",
  "msi","dll","ps1","cpl","jar","lnk","reg","hta","sct","msc",
]);

// Rows created via the /test-inbound endpoint use this source so the
// /test-cleanup endpoint can delete them safely without ever touching real
// inbound mail. Do NOT change without updating qa-email-attachments.mjs.
const TEST_SOURCE = "email_inbound_test";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Stage-1 finance detector. Cheap heuristics: sender domain, subject/body
// keywords, PDF-ish attachments. We require ≥2 of 3 signals to mark a
// message as a finance candidate so a single-word match (e.g. "invoice"
// in a sales email) doesn't trigger an AI extraction.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const FINANCE_KEYWORDS = /\b(invoice|receipt|statement|payment received|paid|order confirmation|tax invoice|amount due|total due|subtotal|your bill|monthly bill|payment confirmation)\b/i;
const FINANCE_DOMAINS = new Set([
  "stripe.com", "squareup.com", "square.com", "intuit.com", "quickbooks.intuit.com",
  "paypal.com", "venmo.com", "zellepay.com",
  "verizonwireless.com", "verizon.com", "att.com", "tmobile.com", "spectrum.com", "frontier.com",
  "amazon.com", "amazonpayments.com", "costco.com", "costcobusiness.com",
  "godaddy.com", "cloudflare.com", "google.com", "apple.com", "microsoft.com",
  "hawaiianelectric.com", "hawaiiantel.com",
  "fedex.com", "ups.com", "usps.com",
]);
function detectFinanceCandidate({ fromEmail, subject, body, attachments }) {
  let signals = 0;
  const local = (fromEmail.split("@")[0] || "").toLowerCase();
  const dom = (fromEmail.split("@")[1] || "").toLowerCase();
  if (FINANCE_DOMAINS.has(dom) || /(billing|receipts?|invoice|invoicing|payments?|noreply|no-reply)/i.test(local)) signals++;
  if (FINANCE_KEYWORDS.test(subject || "") || FINANCE_KEYWORDS.test(body || "")) signals++;
  const hasPdf = (attachments || []).some((a) => {
    const fn = (a.filename || "").toLowerCase();
    const ct = (a.mimeType || a.contentType || "").toLowerCase();
    return ct.includes("pdf") || /\.pdf$/.test(fn) || /(invoice|receipt|statement|bill)/i.test(fn);
  });
  if (hasPdf) signals++;
  return signals >= 2;
}

export default {
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // SCHEDULED Handler — runs every minute (per wrangler.toml triggers)
  // Calls the Pages site's flush-scheduled endpoint, which sends any
  // email_drafts whose scheduled_for has passed. Worker-key gated.
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  async scheduled(event, env, ctx) {
    const apiBase = env.INTERNAL_API_URL || "https://admin.techsavvyhawaii.com";
    try {
      const res = await fetch(`${apiBase}/api/email/flush-scheduled`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Worker-Key": env.WORKER_KEY || "",
        },
      });
      if (!res.ok) {
        console.error("flush-scheduled non-200:", res.status, await res.text().catch(() => ""));
      }
    } catch (e) {
      console.error("flush-scheduled call failed:", e?.message || e);
    }
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // FETCH Handler — API endpoints
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-Worker-Key",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    const json = (data, status = 200) =>
      new Response(JSON.stringify(data, null, 2), {
        status,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });

    // Health check
    if (path === "/" || path === "/health") {
      return json({
        service: "Tech Savvy Hawaii Email Worker",
        status: "online",
        forward_to: FORWARD_TO,
        ai_worker: AI_WORKER_URL,
        db_bound: !!env.DB,
        r2_bound: !!env.FILES_BUCKET,
        endpoints: [
          "GET    /              — Health check",
          "GET    /stats         — Email folder stats",
          "POST   /test-classify — Test AI classification",
          "POST   /test-inbound  — (X-Worker-Key) Inject a synthetic inbound email + attachments for QA",
          "POST   /test-cleanup  — (X-Worker-Key) Delete test threads + their R2 attachments",
        ],
      });
    }

    // Stats
    if (path === "/stats" && env.DB) {
      try {
        const folders = await env.DB.prepare(`
          SELECT folder, COUNT(*) as count, SUM(CASE WHEN unread = 1 THEN 1 ELSE 0 END) as unread_count
          FROM email_threads GROUP BY folder
        `).all();
        const total = await env.DB.prepare(`SELECT COUNT(*) as count FROM email_threads`).first();
        const starred = await env.DB.prepare(`SELECT COUNT(*) as count FROM email_threads WHERE starred = 1`).first();
        return json({ total: total?.count || 0, starred: starred?.count || 0, folders: folders?.results || [] });
      } catch (err) {
        return json({ error: err.message }, 500);
      }
    }

    // Test classify
    if (path === "/test-classify" && request.method === "POST") {
      try {
        const body = await request.json();
        const classifyRes = await fetch(`${AI_WORKER_URL}/classify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Worker-Key": env.WORKER_KEY || "",
          },
          body: JSON.stringify({
            message: body.message || "Test email from customer asking about pricing",
            source: "email",
          }),
        });
        const data = await classifyRes.json();
        return json({ classification: data, status: classifyRes.status });
      } catch (err) {
        return json({ error: err.message }, 500);
      }
    }

    // ━━ /test-inbound ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // Inject a synthetic inbound email + attachments so the rest of
    // the attachment pipeline (D1 row, R2 object, admin UI listing,
    // forward, sign) can be verified against production WITHOUT
    // having to actually send a real SMTP message through Cloudflare
    // Email Routing. Gated by WORKER_KEY (same secret used by the AI
    // worker calls). Never forwards. Never auto-replies. Always tags
    // the row with source=email_inbound_test so /test-cleanup can
    // safely remove it.
    if (path === "/test-inbound" && request.method === "POST") {
      const providedKey = request.headers.get("X-Worker-Key") || "";
      if (!env.WORKER_KEY || providedKey !== env.WORKER_KEY) {
        return json({ error: "Unauthorized" }, 401);
      }
      try {
        const body = await request.json();
        const rawAtts = Array.isArray(body.attachments) ? body.attachments : [];
        const attachments = rawAtts.map((a) => ({
          filename: a.filename || "attachment.bin",
          mimeType: a.contentType || a.mimeType || "application/octet-stream",
          content: base64ToBytes(a.base64 || ""),
        }));
        const result = await persistInbound(env, {
          from: body.from || "qa-test@example.com",
          to: body.to || "contact@techsavvyhawaii.com",
          subject: body.subject || "[QA TEST] Email attachment smoke test",
          textBody: body.text || "QA inbound email test body",
          htmlBody: body.html || "",
          attachments,
          // QA injection never sends real mail.
          forward: null,
          sendEmail: null,
          // Skip live AI classify by default so the test is deterministic
          // and doesn't burn a model call. Caller can override.
          classification: body.classification || {
            intent: "general_inquiry",
            priority: "normal",
            summary: body.subject || "QA test",
            sentiment: "neutral",
            suggestedAction: "—",
          },
          isTest: true,
        });
        return json({ success: true, ...result });
      } catch (err) {
        // Log internally but never leak stack/message back over the wire,
        // even though this endpoint is WORKER_KEY-gated.
        console.error("/test-inbound failed:", err);
        return json({ error: "test-inbound failed" }, 500);
      }
    }

    // ━━ /test-cleanup ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // Delete test rows + their R2 objects. Only touches threads where
    // source=email_inbound_test (or a specific threadId that has that
    // source) so a leaked WORKER_KEY can never destroy real inbox data.
    if (path === "/test-cleanup" && (request.method === "POST" || request.method === "DELETE")) {
      const providedKey = request.headers.get("X-Worker-Key") || "";
      if (!env.WORKER_KEY || providedKey !== env.WORKER_KEY) {
        return json({ error: "Unauthorized" }, 401);
      }
      if (!env.DB) return json({ error: "DB not bound" }, 500);
      try {
        const body = await request.json().catch(() => ({}));
        const threadId = (body && body.threadId) || null;

        // Resolve target threads (only ever those flagged as test inbound).
        const threads = threadId
          ? (await env.DB.prepare(
              "SELECT id FROM email_threads WHERE id = ? AND source = ?"
            ).bind(threadId, TEST_SOURCE).all()).results || []
          : (await env.DB.prepare(
              "SELECT id FROM email_threads WHERE source = ?"
            ).bind(TEST_SOURCE).all()).results || [];

        let deletedThreads = 0;
        let deletedMessages = 0;
        let deletedAttachments = 0;
        let deletedR2 = 0;

        for (const t of threads) {
          const tid = t.id;
          const atts = (await env.DB.prepare(
            "SELECT id, r2_key FROM email_attachments WHERE thread_id = ?"
          ).bind(tid).all()).results || [];
          for (const a of atts) {
            if (env.FILES_BUCKET && a.r2_key) {
              try {
                await env.FILES_BUCKET.delete(a.r2_key);
                deletedR2++;
              } catch (e) {
                console.error("R2 delete failed for", a.r2_key, e);
              }
            }
          }
          const ar = await env.DB.prepare(
            "DELETE FROM email_attachments WHERE thread_id = ?"
          ).bind(tid).run();
          const mr = await env.DB.prepare(
            "DELETE FROM email_messages WHERE thread_id = ?"
          ).bind(tid).run();
          const tr = await env.DB.prepare(
            "DELETE FROM email_threads WHERE id = ? AND source = ?"
          ).bind(tid, TEST_SOURCE).run();
          deletedAttachments += ar?.meta?.changes || atts.length;
          deletedMessages += mr?.meta?.changes || 0;
          deletedThreads += tr?.meta?.changes || 0;
        }

        return json({
          success: true,
          deletedThreads,
          deletedMessages,
          deletedAttachments,
          deletedR2,
        });
      } catch (err) {
        console.error("/test-cleanup failed:", err);
        return json({ error: "test-cleanup failed" }, 500);
      }
    }

    return json({ error: "Not found" }, 404);
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // EMAIL Handler — Inbound email processing
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  async email(message, env, eventCtx) {
    const from = message.from;
    const to = message.to;
    const subject = message.headers.get("subject") || "(no subject)";

    console.log(`📧 Inbound email from: ${from} | Subject: ${subject}`);

    // Parse email body + attachments
    let textBody = "";
    let htmlBody = "";
    let attachments = [];
    let cc = "";
    try {
      const rawEmail = await new Response(message.raw).arrayBuffer();
      const parser = new PostalMime();
      const parsed = await parser.parse(rawEmail);
      textBody = parsed.text || "";
      htmlBody = parsed.html || "";
      attachments = Array.isArray(parsed.attachments) ? parsed.attachments : [];
      // Capture CC list — postal-mime returns either a comma-string or [{address, name}]
      if (parsed.cc) {
        if (typeof parsed.cc === "string") cc = parsed.cc;
        else if (Array.isArray(parsed.cc)) cc = parsed.cc.map((c) => c.address || c).join(", ");
      }
    } catch (err) {
      console.error("Failed to parse email body:", err);
    }

    await persistInbound(env, {
      from,
      to,
      cc,
      subject,
      textBody,
      htmlBody,
      attachments,
      forward: (toAddr) => message.forward(toAddr),
      sendEmail: env.SEND_EMAIL ? (m) => env.SEND_EMAIL.send(m) : null,
      isTest: false,
      eventCtx,
    });
  },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Shared inbound-email persistence (used by email() AND /test-inbound)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async function persistInbound(env, opts) {
  const {
    from = "",
    to = "contact@techsavvyhawaii.com",
    cc = "",
    subject = "(no subject)",
    textBody = "",
    htmlBody = "",
    attachments = [],
    forward = null,
    sendEmail = null,
    classification: classificationOverride = null,
    isTest = false,
    eventCtx = null,
  } = opts;

  const bodyPreview =
    textBody.slice(0, 2000) || htmlBody.replace(/<[^>]*>/g, "").slice(0, 2000);

  // Extract sender info
  const nameMatch = from.match(/^([^<]+)</);
  const senderName = nameMatch
    ? nameMatch[1].trim()
    : (from.split("@")[0] || "Unknown");
  const senderEmail = (
    from.match(/<([^>]+)>/) ? from.match(/<([^>]+)>/)[1] : from
  ).toLowerCase();

  // Classify via AI Worker (skipped if caller supplied an override).
  let classification = classificationOverride || {
    intent: "general_inquiry",
    priority: "normal",
    summary: subject,
    suggestedAction: "Review and respond",
    sentiment: "neutral",
  };
  if (!classificationOverride) {
    try {
      const classifyRes = await fetch(`${AI_WORKER_URL}/classify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Worker-Key": env.WORKER_KEY || "",
        },
        body: JSON.stringify({
          message: `From: ${from}\nSubject: ${subject}\n\n${bodyPreview.slice(0, 1000)}`,
          source: "email",
        }),
      });
      if (classifyRes.ok) {
        const data = await classifyRes.json();
        if (data && data.intent) classification = data;
      }
    } catch (err) {
      console.error("AI classify failed (non-blocking):", err);
    }
  }

  console.log(`🏷️ ${classification.intent} | ${classification.priority} | ${classification.sentiment}`);

  // Determine folder
  const folder = classification.intent === "spam" ? "spam" : "inbox";

  // Determine which email account received this (always lowercase for consistency)
  const emailAccount = (to || "contact@techsavvyhawaii.com").toLowerCase();

  // Log ALL emails to D1 (including spam — goes to spam folder)
  if (!env.DB) {
    console.warn("⚠️ DB binding missing — skipping persist");
    return { skipped: "no DB binding" };
  }

  const now = new Date().toISOString();
  const threadId = crypto.randomUUID();
  const messageId = crypto.randomUUID();
  const attachmentIds = [];

  try {
    await env.DB.prepare(`
      INSERT INTO email_threads (id, subject, lead_id, contact_email, contact_name, source, status, folder, starred, ai_intent, ai_priority, ai_sentiment, unread, last_message_at, created_at, email_account)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      threadId, subject, "", senderEmail, senderName,
      isTest ? TEST_SOURCE : "email_inbound", "open",
      folder, 0,
      classification.intent || "", classification.priority || "normal", classification.sentiment || "neutral",
      1, now, now, emailAccount
    ).run();

    // Best-effort cc_emails write — column added in migration 0025.
    // Falls back to legacy insert if column doesn't yet exist on this DB.
    try {
      await env.DB.prepare(`
        INSERT INTO email_messages (id, thread_id, direction, from_email, from_name, to_email, subject, body, html_body, resend_id, status, cc_emails, bcc_emails, sent_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        messageId, threadId, "inbound", senderEmail, senderName, to, subject,
        bodyPreview.slice(0, 5000), htmlBody.slice(0, 10000), "", "received", cc || "", "", now
      ).run();
    } catch (e) {
      console.warn("cc_emails column missing, falling back:", e?.message || e);
      await env.DB.prepare(`
        INSERT INTO email_messages (id, thread_id, direction, from_email, from_name, to_email, subject, body, html_body, resend_id, status, sent_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        messageId, threadId, "inbound", senderEmail, senderName, to, subject,
        bodyPreview.slice(0, 5000), htmlBody.slice(0, 10000), "", "received", now
      ).run();
    }

    console.log(`💾 → ${folder}: thread ${threadId}`);

    // Attachments — upload each to R2 + insert email_attachments row.
    if (attachments.length > 0 && env.FILES_BUCKET) {
      const publicBase = (env.R2_PUBLIC_URL || "https://assets.techsavvyhawaii.com").replace(/\/$/, "");
      let total = 0;
      let saved = 0;
      for (const att of attachments) {
        if (saved >= MAX_ATTACHMENT_COUNT) {
          console.warn(`⚠️ skipping attachment "${att.filename}" — count cap reached`);
          continue;
        }
        try {
          const rawName = att.filename || "attachment";
          const ext = (rawName.split(".").pop() || "").toLowerCase();
          if (BLOCKED_EXTENSIONS.has(ext)) {
            console.warn(`⛔ skipping attachment "${rawName}" — blocked extension .${ext}`);
            continue;
          }
          const safeName = rawName.replace(/[^\w.\-]/g, "_").slice(0, 120);
          const buf = att.content instanceof Uint8Array ? att.content : new Uint8Array(att.content || []);
          if (buf.length === 0) {
            console.warn(`⚠️ skipping empty attachment "${rawName}"`);
            continue;
          }
          if (buf.length > MAX_ATTACHMENT_BYTES) {
            console.warn(`⛔ skipping attachment "${rawName}" — ${buf.length} bytes exceeds per-file cap`);
            continue;
          }
          if (total + buf.length > MAX_TOTAL_BYTES) {
            console.warn(`⛔ skipping attachment "${rawName}" — would exceed per-email total cap`);
            continue;
          }
          total += buf.length;

          const attId = crypto.randomUUID();
          const r2Key = `email-attachments/${threadId}/${attId}-${safeName}`;
          const contentType = att.mimeType || "application/octet-stream";
          await env.FILES_BUCKET.put(r2Key, buf, { httpMetadata: { contentType } });
          const url = `${publicBase}/${r2Key}`;
          await env.DB.prepare(`
            INSERT INTO email_attachments (id, message_id, thread_id, filename, content_type, size, r2_key, url, direction, signed_of, saved_to_files, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'inbound', '', 0, ?)
          `).bind(attId, messageId, threadId, safeName, contentType, buf.length, r2Key, url, now).run();
          attachmentIds.push(attId);
          saved++;
          console.log(`📎 Saved attachment ${safeName} (${buf.length} bytes) → ${r2Key}`);
        } catch (attErr) {
          console.error("Failed to save attachment:", att.filename, attErr);
        }
      }
    } else if (attachments.length > 0) {
      console.warn(`⚠️ ${attachments.length} attachment(s) ignored — FILES_BUCKET binding missing`);
    }

    // ━━ Stage 1: flag finance-looking emails for AI extraction ━━━━━━━━━━
    // We only flag here; the actual Anthropic call happens on the Pages
    // app (which already has ANTHROPIC_API_KEY) via a worker-key gated
    // endpoint. Fire-and-forget so inbound processing isn't blocked by AI.
    if (!isTest && detectFinanceCandidate({ fromEmail: senderEmail, subject, body: bodyPreview, attachments })) {
      try {
        await env.DB.prepare("UPDATE email_messages SET finance_candidate = 1 WHERE id = ?").bind(messageId).run();
        console.log(`💰 Finance candidate flagged: ${messageId}`);
      } catch (e) {
        console.warn("finance_candidate column missing (run migration 0027):", e?.message || e);
      }
      const apiBase = env.INTERNAL_API_URL || "https://admin.techsavvyhawaii.com";
      if (env.WORKER_KEY) {
        // Use ctx.waitUntil so the runtime keeps the request alive past the
        // email handler return — otherwise the fire-and-forget fetch can be
        // canceled mid-dispatch and we silently drop extractions.
        const extractPromise = fetch(`${apiBase}/api/finance/extract-from-message`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-Worker-Key": env.WORKER_KEY },
          body: JSON.stringify({ messageId }),
          signal: AbortSignal.timeout(75_000),
        }).then((r) => {
          if (!r.ok) console.error("finance extract non-200:", r.status);
        }).catch((e) => console.error("finance extract trigger failed:", e?.message || e));
        if (eventCtx && typeof eventCtx.waitUntil === "function") {
          eventCtx.waitUntil(extractPromise);
        } else {
          // Fallback for /test-inbound (no event ctx) — await inline so the
          // QA driver still observes the result.
          await extractPromise;
        }
      }
    }

    // Create lead if new_lead
    if (classification.intent === "new_lead") {
      const leadId = crypto.randomUUID();
      await env.DB.prepare(`
        INSERT INTO leads (id, name, email, source, status, notes, best_contact_method, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        leadId, senderName, senderEmail,
        isTest ? TEST_SOURCE : "email_inbound", "new",
        `[Email] ${subject}\n\n${bodyPreview.slice(0, 500)}\n\n[AI] ${classification.summary || ""}`,
        "email", now, now
      ).run();
      await env.DB.prepare(`UPDATE email_threads SET lead_id = ? WHERE id = ?`).bind(leadId, threadId).run();
      console.log(`🎯 Lead: ${leadId}`);
    }
  } catch (err) {
    console.error("D1 failed:", err);
  }

  // Forward (non-spam only). Skipped when forward is null (test path).
  if (folder !== "spam" && forward) {
    try {
      await forward(FORWARD_TO);
      console.log("📨 Forwarded");
    } catch (err) {
      console.error("Forward failed:", err);
    }
  }

  // Auto-reply for new leads. Skipped when sendEmail is null (test path).
  if (sendEmail && classification.intent === "new_lead" && classification.sentiment !== "angry") {
    try {
      const firstName = nameMatch ? nameMatch[1].trim().split(" ")[0] : "there";
      const autoReply = new EmailMessage("contact@techsavvyhawaii.com", senderEmail, buildAutoReplyRaw(firstName, subject));
      await sendEmail(autoReply);
      console.log(`✅ Auto-reply → ${senderEmail}`);

      try {
        const replyTs = new Date().toISOString();
        await env.DB.prepare(`
          INSERT INTO email_messages (id, thread_id, direction, from_email, from_name, to_email, subject, body, html_body, resend_id, status, sent_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(crypto.randomUUID(), threadId, "outbound", "contact@techsavvyhawaii.com", "TechSavvy Hawaii", senderEmail, `Re: ${subject}`, `Auto-reply sent to ${firstName}`, "", "", "sent", replyTs).run();
        await env.DB.prepare(`UPDATE email_threads SET last_message_at = ? WHERE id = ?`).bind(replyTs, threadId).run();
      } catch (e) {
        console.error("Auto-reply log failed:", e);
      }
    } catch (err) {
      console.error("Auto-reply failed:", err);
    }
  }

  return { threadId, messageId, attachmentIds, classification, folder };
}

// Decode standard base64 (with optional `data:...;base64,` prefix) to Uint8Array.
function base64ToBytes(b64) {
  if (!b64) return new Uint8Array();
  const clean = b64.replace(/^data:[^;,]+(?:;[^,]+)?,/, "").replace(/\s/g, "");
  const bin = atob(clean);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function buildAutoReplyRaw(firstName, originalSubject) {
  const subject = `Re: ${originalSubject}`;
  const htmlBody = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;"><div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;margin-top:20px;"><div style="background:linear-gradient(135deg,#0f172a,#1e3a5f);padding:32px;text-align:center;"><h1 style="color:#ffffff;margin:0;font-size:22px;">Tech Savvy Hawaii</h1><p style="color:#94a3b8;margin:8px 0 0;font-size:14px;">Zero-Fee Payment Processing</p></div><div style="padding:32px;"><p style="font-size:16px;color:#1e293b;line-height:1.6;">Hey ${firstName}! 👋</p><p style="font-size:15px;color:#475569;line-height:1.6;">Thanks for reaching out to Tech Savvy Hawaii. We got your message and someone from our team will get back to you within a few hours during business hours (Mon-Fri, 8 AM – 5 PM HST).</p><ul style="color:#475569;font-size:15px;line-height:1.8;padding-left:20px;"><li><strong>Zero processing fees</strong></li><li><strong>Free custom website</strong> with every account</li><li><strong>Next-day deposits</strong></li><li><strong>30-day free trial</strong> — no contracts</li></ul><div style="text-align:center;margin:24px 0;"><a href="tel:8087675460" style="display:inline-block;background:#0f172a;color:#ffffff;font-size:16px;font-weight:700;text-decoration:none;padding:14px 40px;border-radius:8px;">📞 Call (808) 767-5460</a></div></div><div style="padding:24px 32px;border-top:1px solid #e2e8f0;text-align:center;"><p style="font-size:12px;color:#94a3b8;margin:0;">Tech Savvy Hawaii · <a href="https://techsavvyhawaii.com" style="color:#94a3b8;">techsavvyhawaii.com</a></p></div></div></body></html>`;
  const textBody = `Hey ${firstName}!\n\nThanks for reaching out to Tech Savvy Hawaii. We got your message and someone from our team will get back to you within a few hours (Mon-Fri, 8 AM - 5 PM HST).\n\nCall us: (808) 767-5460\n\n- Tech Savvy Hawaii`;
  const boundary = "----=_TSH_" + Date.now();
  return [`From: Tech Savvy Hawaii <contact@techsavvyhawaii.com>`,`Subject: ${subject}`,`MIME-Version: 1.0`,`Content-Type: multipart/alternative; boundary="${boundary}"`,``,`--${boundary}`,`Content-Type: text/plain; charset=utf-8`,``,textBody,``,`--${boundary}`,`Content-Type: text/html; charset=utf-8`,``,htmlBody,``,`--${boundary}--`].join("\r\n");
}
