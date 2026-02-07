import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { updateAiConfigSchema } from "@shared/schema";
import Anthropic from "@anthropic-ai/sdk";

/*
 * Anthropic integration - blueprint:javascript_anthropic
 * The newest Anthropic model is "claude-sonnet-4-20250514".
 * If the user doesn't specify a model, always prefer using "claude-sonnet-4-20250514".
 */

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get("/api/ai-config", async (_req, res) => {
    const config = await storage.getAiConfig();
    res.json(config);
  });

  app.patch("/api/ai-config", async (req, res) => {
    const parsed = updateAiConfigSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.message });
    }
    const config = await storage.updateAiConfig(parsed.data);
    res.json(config);
  });

  app.post("/api/chat", async (req, res) => {
    const config = await storage.getAiConfig();

    if (!config.enabled) {
      return res.status(503).json({ error: "AI agent is currently disabled." });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Anthropic API key is not configured." });
    }

    const { message, history } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required." });
    }

    const messages: { role: "user" | "assistant"; content: string }[] = [];

    if (Array.isArray(history)) {
      for (const h of history) {
        if (h.role && h.content) {
          messages.push({ role: h.role, content: h.content });
        }
      }
    }

    messages.push({ role: "user", content: message });

    try {
      const anthropic = new Anthropic({ apiKey });

      const response = await anthropic.messages.create({
        model: config.model,
        max_tokens: config.maxTokens,
        system: config.systemPrompt,
        messages,
      });

      const text = response.content
        .filter((block): block is Anthropic.TextBlock => block.type === "text")
        .map((block) => block.text)
        .join("");

      res.json({ reply: text });
    } catch (err: any) {
      console.error("Anthropic API error:", err.message);
      res.status(500).json({ error: "Failed to get AI response. Please try again." });
    }
  });

  return httpServer;
}
