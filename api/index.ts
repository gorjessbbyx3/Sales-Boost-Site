import type { VercelRequest, VercelResponse } from "@vercel/node";
import Anthropic from "@anthropic-ai/sdk";

// In-memory AI config (Vercel serverless is stateless per invocation,
// but config changes persist within the same warm instance)
const DEFAULT_AI_CONFIG = {
  id: "default",
  enabled: false,
  model: "claude-sonnet-4-20250514",
  systemPrompt:
    "You are a helpful assistant for λechSavvy. λechSavvy offers zero-fee payment processing with two pricing options: Option 1 is an outright purchase at $399 (best value — includes terminal, full setup, compliance signage kit, and free statement analysis). Option 2 is a 30-day risk-free trial with a free terminal loan; if the merchant keeps it, it auto-bills at $599 on day 31; if not, they return it and we cover return shipping (or local pickup in Honolulu). No monthly fees and no processing fees ever — customers pay a small surcharge instead. Merchants get 100% of their sale deposited into their account by the next business day. Minimum $5K-$10K monthly processing volume required to qualify. Only 4 trial spots available per month. Retail terminals sell for $800+, so both options are significantly discounted. For businesses that use λechSavvy's payment processor, we also offer: FREE custom websites for businesses that don't have an online presence, premium website packages (paid upgrade with advanced features), and custom software solutions to help run their business. We also welcome high-risk merchants (CBD, vape, firearms, nutraceuticals, and more). Be friendly, professional, and concise.",
  welcomeMessage:
    "Hi! I'm λechSavvy's AI assistant. Ask me about our zero-fee payment processing, free websites for our merchants, premium web packages, or custom software solutions.",
  maxTokens: 1024,
};

let aiConfig = { ...DEFAULT_AI_CONFIG };

const ALLOWED_MODELS = [
  "claude-sonnet-4-20250514",
  "claude-3-7-sonnet-20250219",
  "claude-3-5-haiku-20241022",
];
const MAX_HISTORY_LENGTH = 20;
const MAX_ALLOWED_TOKENS = 4096;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const path = req.url?.replace(/\?.*$/, "") || "";

  // --- GET /api/ai-config ---
  if (path === "/api/ai-config" && req.method === "GET") {
    return res.json(aiConfig);
  }

  // --- PATCH /api/ai-config ---
  if (path === "/api/ai-config" && req.method === "PATCH") {
    const body = req.body || {};
    if (body.model && !ALLOWED_MODELS.includes(body.model)) {
      return res.status(400).json({ error: "Invalid model selection." });
    }
    if (body.maxTokens && body.maxTokens > MAX_ALLOWED_TOKENS) {
      body.maxTokens = MAX_ALLOWED_TOKENS;
    }
    aiConfig = { ...aiConfig, ...body };
    return res.json(aiConfig);
  }

  // --- POST /api/chat ---
  if (path === "/api/chat" && req.method === "POST") {
    if (!aiConfig.enabled) {
      return res.status(503).json({ error: "AI agent is currently disabled." });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Anthropic API key is not configured." });
    }

    const { message, history } = req.body || {};
    if (!message || typeof message !== "string" || message.length > 2000) {
      return res.status(400).json({ error: "Message is required and must be under 2000 characters." });
    }

    const messages: { role: "user" | "assistant"; content: string }[] = [];
    if (Array.isArray(history)) {
      const trimmedHistory = history.slice(-MAX_HISTORY_LENGTH);
      for (const h of trimmedHistory) {
        if (h.role && h.content && typeof h.content === "string") {
          messages.push({ role: h.role, content: h.content.slice(0, 2000) });
        }
      }
    }
    messages.push({ role: "user", content: message });

    const safeMaxTokens = Math.min(aiConfig.maxTokens, MAX_ALLOWED_TOKENS);

    try {
      const anthropic = new Anthropic({ apiKey });
      const response = await anthropic.messages.create({
        model: aiConfig.model,
        max_tokens: safeMaxTokens,
        system: aiConfig.systemPrompt,
        messages,
      });

      const text = response.content
        .filter((block): block is Anthropic.TextBlock => block.type === "text")
        .map((block) => block.text)
        .join("");

      return res.json({ reply: text });
    } catch (err: any) {
      console.error("Anthropic API error:", err.message);
      return res.status(500).json({ error: "Failed to get AI response. Please try again." });
    }
  }

  // --- POST /api/admin/login ---
  if (path === "/api/admin/login" && req.method === "POST") {
    const { password } = req.body || {};
    const adminPassword = process.env.SESSION_SECRET;
    if (!adminPassword) {
      return res.status(500).json({ error: "Admin access not configured." });
    }
    if (password === adminPassword) {
      return res.json({ success: true });
    }
    return res.status(401).json({ error: "Invalid password." });
  }

  // --- GET /api/admin/check ---
  if (path === "/api/admin/check" && req.method === "GET") {
    return res.json({ authenticated: false });
  }

  return res.status(404).json({ error: "Not found" });
}
