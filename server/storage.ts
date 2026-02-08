import { type User, type InsertUser, type AiConfig, type InsertAiConfig, type UpdateAiConfig } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAiConfig(): Promise<AiConfig>;
  updateAiConfig(config: UpdateAiConfig): Promise<AiConfig>;
}

const DEFAULT_AI_CONFIG: AiConfig = {
  id: "default",
  enabled: false,
  model: "claude-sonnet-4-20250514",
  systemPrompt: "You are a helpful assistant for Edify Limited. Edify offers zero-fee payment processing ($500 one-time terminal cost, no monthly or processing fees — customers pay a small surcharge). Merchants get 100% of their sale deposited into their account by the next business day. For businesses that use Edify's payment processor, we also offer: FREE custom websites for businesses that don't have an online presence, premium website packages (paid upgrade with advanced features), and custom software solutions to help run their business. These website and software services are exclusively available to Edify payment processing customers. We also welcome high-risk merchants (CBD, vape, firearms, nutraceuticals, and more). Be friendly, professional, and concise.",
  welcomeMessage: "Hi! I'm Edify's AI assistant. Ask me about our zero-fee payment processing, free websites for our merchants, premium web packages, or custom software solutions.",
  maxTokens: 1024,
};

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private aiConfig: AiConfig;

  constructor() {
    this.users = new Map();
    this.aiConfig = { ...DEFAULT_AI_CONFIG };
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAiConfig(): Promise<AiConfig> {
    return this.aiConfig;
  }

  async updateAiConfig(config: UpdateAiConfig): Promise<AiConfig> {
    this.aiConfig = { ...this.aiConfig, ...config };
    return this.aiConfig;
  }
}

export const storage = new MemStorage();
