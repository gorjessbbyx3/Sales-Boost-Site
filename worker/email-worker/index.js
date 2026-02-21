/**
 * Tech Savvy Hawaii — Email Worker
 * 
 * Receives inbound emails to contact@techsavvyhawaii.com and:
 * 1. Parses sender, subject, and body
 * 2. Classifies intent via AI Worker (/classify)
 * 3. Logs new leads to savvy-admin D1 database
 * 4. Sends branded auto-reply via Cloudflare send-email
 * 5. Forwards original email to personal inbox
 * 
 * Cloudflare Email Workers use the email() event handler.
 */

import PostalMime from "postal-mime";

// ─── Configuration ────────────────────────────────────────────────
const AI_WORKER_URL = "https://mojo-luna-955c.gorjessbbyx3.workers.dev";
const FORWARD_TO = "gorjessbbyx3@icloud.com"; // Change to your personal email

// ─── Email Event Handler ──────────────────────────────────────────
export default {
  async email(message, env, ctx) {
    const from = message.from;
    const to = message.to;
    const subject = message.headers.get("subject") || "(no subject)";

    console.log(`📧 Inbound email from: ${from} | Subject: ${subject}`);

    // ── Parse email body ──────────────────────────────────────
    let textBody = "";
    let htmlBody = "";
    try {
      const rawEmail = await new Response(message.raw).arrayBuffer();
      const parser = new PostalMime();
      const parsed = await parser.parse(rawEmail);
      textBody = parsed.text || "";
      htmlBody = parsed.html || "";
    } catch (err) {
      console.error("Failed to parse email body:", err);
    }

    const bodyPreview = textBody.slice(0, 2000) || htmlBody.replace(/<[^>]*>/g, "").slice(0, 2000);

    // ── Classify via AI Worker ────────────────────────────────
    let classification = {
      intent: "general_inquiry",
      priority: "normal",
      summary: subject,
      suggestedAction: "Review and respond",
      sentiment: "neutral",
    };

    try {
      const classifyRes = await fetch(`${AI_WORKER_URL}/classify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Worker-Key": env.WORKER_KEY || "",
        },
        body: JSON.stringify({
          message: `From: ${from}\nSubject: ${subject}\n\n${bodyPreview}`,
          source: "email",
        }),
      });

      if (classifyRes.ok) {
        const data = await classifyRes.json();
        if (data && data.intent) {
          classification = data;
        }
      }
    } catch (err) {
      console.error("AI classify failed (non-blocking):", err);
    }

    console.log(`🏷️ Classification: ${classification.intent} | Priority: ${classification.priority} | Sentiment: ${classification.sentiment}`);

    // ── Log to D1 (leads table) if it looks like a new lead ──
    if (env.DB && classification.intent !== "spam") {
      try {
        // Extract name from email "Name <email>" format
        const nameMatch = from.match(/^([^<]+)</);
        const senderName = nameMatch ? nameMatch[1].trim() : from.split("@")[0];
        const senderEmail = from.match(/<([^>]+)>/) ? from.match(/<([^>]+)>/)[1] : from;
        const leadId = crypto.randomUUID();
        const now = new Date().toISOString();

        await env.DB.prepare(`
          INSERT INTO leads (id, name, email, source, status, notes, best_contact_method, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          leadId,
          senderName,
          senderEmail,
          "email_inbound",
          classification.intent === "new_lead" ? "new" : "contacted",
          `[Email] Subject: ${subject}\n\n${bodyPreview.slice(0, 500)}\n\n[AI] ${classification.summary || ""} | Priority: ${classification.priority} | Sentiment: ${classification.sentiment}`,
          "email",
          now,
          now
        ).run();

        console.log(`💾 Logged to D1 leads: ${senderEmail} → ${classification.intent}`);
      } catch (err) {
        console.error("D1 insert failed (non-blocking):", err);
      }
    }

    // ── Forward to personal inbox ─────────────────────────────
    try {
      await message.forward(FORWARD_TO);
      console.log(`📨 Forwarded to ${FORWARD_TO}`);
    } catch (err) {
      console.error("Forward failed:", err);
    }

    // ── Auto-reply for new leads (via send_email binding) ─────
    if (
      env.SEND_EMAIL &&
      classification.intent === "new_lead" &&
      classification.sentiment !== "angry"
    ) {
      try {
        const senderEmail = from.match(/<([^>]+)>/) ? from.match(/<([^>]+)>/)[1] : from;
        const nameMatch = from.match(/^([^<]+)</);
        const firstName = nameMatch
          ? nameMatch[1].trim().split(" ")[0]
          : "there";

        const autoReply = new EmailMessage(
          "contact@techsavvyhawaii.com",
          senderEmail,
          buildAutoReplyRaw(firstName, subject)
        );
        await env.SEND_EMAIL.send(autoReply);
        console.log(`✅ Auto-reply sent to ${senderEmail}`);
      } catch (err) {
        console.error("Auto-reply failed (non-blocking):", err);
      }
    }
  },
};

// ─── Auto-Reply Email Builder ─────────────────────────────────────
function buildAutoReplyRaw(firstName, originalSubject) {
  const subject = `Re: ${originalSubject}`;
  const htmlBody = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;margin-top:20px;">
    
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#0f172a,#1e3a5f);padding:32px;text-align:center;">
      <h1 style="color:#ffffff;margin:0;font-size:22px;">Tech Savvy Hawaii</h1>
      <p style="color:#94a3b8;margin:8px 0 0;font-size:14px;">Zero-Fee Payment Processing</p>
    </div>
    
    <!-- Body -->
    <div style="padding:32px;">
      <p style="font-size:16px;color:#1e293b;line-height:1.6;">
        Hey ${firstName}! 👋
      </p>
      <p style="font-size:15px;color:#475569;line-height:1.6;">
        Thanks for reaching out to Tech Savvy Hawaii. We got your message and 
        someone from our team will get back to you within a few hours during 
        business hours (Mon-Fri, 8 AM – 5 PM HST).
      </p>
      <p style="font-size:15px;color:#475569;line-height:1.6;">
        In the meantime, here's what we can do for your business:
      </p>
      <ul style="color:#475569;font-size:15px;line-height:1.8;padding-left:20px;">
        <li><strong>Zero processing fees</strong> — your customers cover a small surcharge</li>
        <li><strong>Free custom website</strong> with every processing account</li>
        <li><strong>Next-day deposits</strong> — keep 100% of every sale</li>
        <li><strong>30-day free trial</strong> — no contracts, no risk</li>
      </ul>
      <p style="font-size:15px;color:#475569;line-height:1.6;">
        Need faster help? Call us anytime:
      </p>
      
      <!-- CTA -->
      <div style="text-align:center;margin:24px 0;">
        <a href="tel:8087675460" style="display:inline-block;background:#0f172a;color:#ffffff;font-size:16px;font-weight:700;text-decoration:none;padding:14px 40px;border-radius:8px;">
          📞  Call (808) 767-5460
        </a>
      </div>
    </div>
    
    <!-- Footer -->
    <div style="padding:24px 32px;border-top:1px solid #e2e8f0;text-align:center;">
      <p style="font-size:12px;color:#94a3b8;margin:0;">
        Tech Savvy Hawaii · <a href="https://techsavvyhawaii.com" style="color:#94a3b8;">techsavvyhawaii.com</a> · (808) 767-5460
      </p>
    </div>
  </div>
</body>
</html>`;

  const textBody = `Hey ${firstName}!\n\nThanks for reaching out to Tech Savvy Hawaii. We got your message and someone from our team will get back to you within a few hours during business hours (Mon-Fri, 8 AM - 5 PM HST).\n\nNeed faster help? Call us: (808) 767-5460\n\n- Tech Savvy Hawaii\ntechsavvyhawaii.com`;

  // Build raw RFC 5322 email
  const boundary = "----=_TechSavvyBoundary_" + Date.now();
  const raw = [
    `From: Tech Savvy Hawaii <contact@techsavvyhawaii.com>`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    ``,
    `--${boundary}`,
    `Content-Type: text/plain; charset=utf-8`,
    `Content-Transfer-Encoding: quoted-printable`,
    ``,
    textBody,
    ``,
    `--${boundary}`,
    `Content-Type: text/html; charset=utf-8`,
    `Content-Transfer-Encoding: quoted-printable`,
    ``,
    htmlBody,
    ``,
    `--${boundary}--`,
  ].join("\r\n");

  return raw;
}
