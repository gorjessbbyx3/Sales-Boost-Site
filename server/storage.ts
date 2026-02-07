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
  systemPrompt: "You are a helpful assistant for Edify Limited, a company that provides zero-fee payment processing, free website creation for businesses, premium website packages, and custom software solutions. Be friendly, professional, and concise.",
  welcomeMessage: "Hi! I'm Edify's AI assistant. Ask me about our payment processing, free websites, premium web packages, or custom software solutions.",
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
