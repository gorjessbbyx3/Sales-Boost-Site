import type { VercelRequest, VercelResponse } from "@vercel/node";
import Anthropic from "@anthropic-ai/sdk";

// In-memory AI config (Vercel serverless is stateless per invocation,
// but config changes persist within the same warm instance)
const DEFAULT_AI_CONFIG = {
  id: "default",
  enabled: false,
  model: "claude-sonnet-4-20250514",
  systemPrompt:
    "You are a helpful assistant for Edify LLC, Hawai'i's #1 zero-fee payment processor based in Honolulu. Edify offers three ways to get started:\n\n1. In-Store Terminal — $399 one-time (best value). Includes countertop terminal (chip, swipe, NFC), full setup, training, compliance signage kit, and a FREE custom website ($997 value). Zero monthly fees, zero processing fees forever.\n\n2. 30-Day Risk-Free Trial — FREE terminal loan for 30 days with live processing. If the merchant keeps it, auto-purchase at $599. If not, return it (we cover shipping). Website add-on for $199 if they keep the terminal.\n\n3. Online Business Package — FREE. When a business switches to our Cash Discount Processing Program, we build a professional custom website completely free of charge. Includes virtual payment gateway, payment links, invoices, online ordering/booking, mobile-optimized SEO-ready design. After the build, upkeep is 100% the merchant's choice: manage it yourself for free (you own and host it), request one-off updates starting at $40, or choose a hands-off maintenance plan ($99-$399/month, cancel anytime).\n\nMaintenance Plans: Basic $99/mo (hosting, SSL, backups, basic changes, uptime monitoring), Pro $199/mo (everything in Basic + monthly content updates, blog posts, Google Business optimization, SEO tweaks, priority support), Premium $399/mo (everything in Pro + custom backend, CRM, booking system, automated emails, unlimited changes, dedicated account manager).\n\nHow it works: Customers pay a small surcharge instead of the merchant paying processing fees. Merchants keep 100% of every sale, deposited next business day. Minimum $5K-$10K monthly volume required. Only 4 trial spots per month.\n\nWe also welcome high-risk merchants (CBD, vape, firearms, nutraceuticals, and more) with the same zero-fee processing and fast approvals.\n\nContact: Phone 808-767-5460, Email edifyhawaii@gmail.com, Hours Mon-Fri 8 AM - 5 PM HST.\n\nBe friendly, professional, and concise. Always emphasize the free website offer and zero processing fees.",
  welcomeMessage:
    "Hi! I'm Edify's AI assistant. Ask me about our zero-fee payment processing, FREE custom websites, maintenance plans, or high-risk merchant accounts. How can I help your business today?",
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
