import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const aiConfig = pgTable("ai_config", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  enabled: boolean("enabled").notNull().default(false),
  model: text("model").notNull().default("claude-sonnet-4-20250514"),
  systemPrompt: text("system_prompt").notNull().default("You are a helpful assistant for Edify Limited. Edify offers zero-fee payment processing ($500 one-time terminal cost, no monthly or processing fees — customers pay a small surcharge). For businesses that use Edify's payment processor, we also offer: FREE custom websites for businesses that don't have an online presence, premium website packages (paid upgrade with advanced features), and custom software solutions to help run their business. These website and software services are exclusively available to Edify payment processing customers. Be friendly, professional, and concise."),
  welcomeMessage: text("welcome_message").notNull().default("Hi! I'm Edify's AI assistant. Ask me about our zero-fee payment processing, free websites for our merchants, premium web packages, or custom software solutions."),
  maxTokens: integer("max_tokens").notNull().default(1024),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertAiConfigSchema = createInsertSchema(aiConfig).omit({
  id: true,
});

export const updateAiConfigSchema = insertAiConfigSchema.partial();

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type AiConfig = typeof aiConfig.$inferSelect;
export type InsertAiConfig = z.infer<typeof insertAiConfigSchema>;
export type UpdateAiConfig = z.infer<typeof updateAiConfigSchema>;
