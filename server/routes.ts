import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { updateAiConfigSchema, insertContactLeadSchema } from "@shared/schema";
import Anthropic from "@anthropic-ai/sdk";
import { randomUUID } from "crypto";

/*
 * Anthropic integration - blueprint:javascript_anthropic
 * The newest Anthropic model is "claude-sonnet-4-20250514".
 * If the user doesn't specify a model, always prefer using "claude-sonnet-4-20250514".
 */

const ALLOWED_MODELS = [
  "claude-sonnet-4-20250514",
  "claude-3-7-sonnet-20250219",
  "claude-3-5-haiku-20241022",
];

const MAX_HISTORY_LENGTH = 20;
const MAX_ALLOWED_TOKENS = 4096;

declare module "express-session" {
  interface SessionData {
    isAdmin?: boolean;
  }
}

function requireAdminSession(req: Request, res: Response, next: NextFunction) {
  if (req.session?.isAdmin) {
    return next();
  }
  return res.status(401).json({ error: "Unauthorized" });
}

// ─── In-Memory Stores for Admin Dashboard ─────────────────────────────

interface Lead {
  id: string;
  name: string;
  business: string;
  address: string;
  phone: string;
  email: string;
  decisionMakerName: string;
  decisionMakerRole: string;
  bestContactMethod: string;
  package: string;
  status: string;
  source: string;
  vertical: string;
  currentProcessor: string;
  currentEquipment: string;
  monthlyVolume: string;
  painPoints: string;
  nextStep: string;
  nextStepDate: string;
  attachments: Array<{ name: string; url: string }>;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface Client {
  id: string;
  name: string;
  business: string;
  phone: string;
  email: string;
  package: string;
  maintenance: string;
  websiteUrl: string;
  websiteStatus: string;
  terminalId: string;
  monthlyVolume: number;
  startDate: string;
  notes: string;
}

interface RevenueEntry {
  id: string;
  date: string;
  type: string;
  description: string;
  amount: number;
  clientId: string;
  recurring: boolean;
}

interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: string;
  completed: boolean;
  linkedTo: string;
  createdAt: string;
}

interface AdminFile {
  id: string;
  name: string;
  size: number;
  type: string;
  category: string;
  uploadedAt: string;
  url: string;
}

interface SlackConfig {
  webhookUrl: string;
  channel: string;
  enabled: boolean;
  notifyNewLead: boolean;
  notifyNewClient: boolean;
  notifyRevenue: boolean;
  notifyTaskDue: boolean;
}

interface Integration {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
  config: Record<string, string>;
  lastSync: string;
}

const leads: Map<string, Lead> = new Map();
const clients: Map<string, Client> = new Map();
const revenue: Map<string, RevenueEntry> = new Map();
const tasks: Map<string, Task> = new Map();
const files: Map<string, AdminFile> = new Map();
let slackConfig: SlackConfig = {
  webhookUrl: "",
  channel: "#general",
  enabled: false,
  notifyNewLead: true,
  notifyNewClient: true,
  notifyRevenue: false,
  notifyTaskDue: true,
};
const integrations: Map<string, Integration> = new Map();
const activityLog: Array<{ id: string; action: string; details: string; timestamp: string; type: string }> = [];

// ─── Sales Playbook Stores ─────────────────────────────────────────

interface ReferralPartner {
  id: string;
  name: string;
  niche: string;
  clientTypes: string;
  referralTerms: string;
  introMethod: string;
  trackingNotes: string;
  lastCheckIn: string;
  nextCheckIn: string;
  createdAt: string;
}

interface PlaybookCheckItem {
  id: string;
  channel: string;
  label: string;
  completed: boolean;
  completedAt: string;
}

interface WeeklyKPI {
  id: string;
  weekStart: string;
  outboundCalls: number;
  outboundEmails: number;
  outboundDMs: number;
  walkIns: number;
  contactsMade: number;
  appointmentsSet: number;
  statementsRequested: number;
  statementsReceived: number;
  proposalsSent: number;
  dealsWon: number;
  volumeWon: number;
  notes: string;
}

interface PlanItem {
  id: string;
  phase: number;
  weekRange: string;
  title: string;
  description: string;
  completed: boolean;
  completedAt: string;
  order: number;
}

interface MaterialItem {
  id: string;
  category: string;
  name: string;
  description: string;
  status: string;
  fileUrl: string;
  updatedAt: string;
}

const referralPartners: Map<string, ReferralPartner> = new Map();
const playbookChecks: Map<string, PlaybookCheckItem> = new Map();
const weeklyKPIs: Map<string, WeeklyKPI> = new Map();
const planItems: Map<string, PlanItem> = new Map();
const materials: Map<string, MaterialItem> = new Map();

let planSeeded = false;
function seedPlanIfNeeded() {
  if (planSeeded) return;
  planSeeded = true;
  const items: Omit<PlanItem, "id">[] = [
    { phase: 1, weekRange: "1-2", title: "Set up CRM pipeline and configure all lead fields", description: "Pipeline stages, source tracking, required fields", completed: false, completedAt: "", order: 1 },
    { phase: 1, weekRange: "1-2", title: "Craft value proposition and 30-second elevator pitch", description: "One-pager for walk-ins, pitch for networking", completed: false, completedAt: "", order: 2 },
    { phase: 1, weekRange: "1-2", title: "Create 2 lead magnet PDFs", description: "E.g., Statement Checklist + Cash Discount Guide", completed: false, completedAt: "", order: 3 },
    { phase: 1, weekRange: "1-2", title: "Build landing page with lead capture form + QR code", description: "Opt-in form for lead magnets with thank-you page", completed: false, completedAt: "", order: 4 },
    { phase: 1, weekRange: "1-2", title: "Draft referral partner agreement", description: "Terms, commission structure, tracking method", completed: false, completedAt: "", order: 5 },
    { phase: 1, weekRange: "1-2", title: "Prepare cold call and walk-in scripts", description: "30-second openers + qualification questions", completed: false, completedAt: "", order: 6 },
    { phase: 1, weekRange: "1-2", title: "Set up email templates (cold + follow-up + confirm)", description: "Initial outreach, follow-up sequences", completed: false, completedAt: "", order: 7 },
    { phase: 2, weekRange: "3-6", title: "Schedule and complete 10 referral partner meetings", description: "Accountants, bookkeepers, consultants, POS resellers", completed: false, completedAt: "", order: 8 },
    { phase: 2, weekRange: "3-6", title: "Attend 4 networking events", description: "Chamber, BNI, industry events — bring QR codes", completed: false, completedAt: "", order: 9 },
    { phase: 2, weekRange: "3-6", title: "Launch social content calendar + daily engagement", description: "3 posts/week + 10 targeted comments/day", completed: false, completedAt: "", order: 10 },
    { phase: 2, weekRange: "3-6", title: "Complete partner onboarding for 3+ partners", description: "Agreement signed, intro method set, tracking live", completed: false, completedAt: "", order: 11 },
    { phase: 2, weekRange: "3-6", title: "Send first batch of direct outreach (25 businesses)", description: "Mix of walk-ins, calls, and personalized emails", completed: false, completedAt: "", order: 12 },
    { phase: 3, weekRange: "7-12", title: "Reach 100 business outreach milestone", description: "Combined walk-ins, calls, emails across all channels", completed: false, completedAt: "", order: 13 },
    { phase: 3, weekRange: "7-12", title: "Follow up on all pending statements and proposals", description: "48hr SLA on statements, weekly proposal follow-ups", completed: false, completedAt: "", order: 14 },
    { phase: 3, weekRange: "7-12", title: "Analyze channel metrics and double down on winners", description: "Compare conversion rates, volume, time-to-close", completed: false, completedAt: "", order: 15 },
    { phase: 3, weekRange: "7-12", title: "Quarterly check-in with all referral partners", description: "Review referrals, refresh agreement, share results", completed: false, completedAt: "", order: 16 },
    { phase: 3, weekRange: "7-12", title: "Review and refine all scripts based on results", description: "Update what's working, discard what isn't", completed: false, completedAt: "", order: 17 },
  ];
  items.forEach((item) => {
    const id = randomUUID();
    planItems.set(id, { id, ...item });
  });
}

let materialsSeeded = false;
function seedMaterialsIfNeeded() {
  if (materialsSeeded) return;
  materialsSeeded = true;
  const items: Omit<MaterialItem, "id">[] = [
    { category: "sales", name: "One-Page Value Prop + Statement Review Offer", description: "Benefits, pricing, QR to landing page — print + PDF", status: "not-started", fileUrl: "", updatedAt: new Date().toISOString() },
    { category: "sales", name: "Cold Call Script + Objection Handlers", description: "30-60 sec opener, qualification Qs, common objections", status: "not-started", fileUrl: "", updatedAt: new Date().toISOString() },
    { category: "sales", name: "Walk-In Script + Leave-Behind Card", description: "In-person opener with handoff material", status: "not-started", fileUrl: "", updatedAt: new Date().toISOString() },
    { category: "sales", name: "Email Templates (Cold + Follow-Up + Confirm)", description: "Initial outreach, follow-up sequences, appointment confirm", status: "not-started", fileUrl: "", updatedAt: new Date().toISOString() },
    { category: "lead-gen", name: "Lead Magnet PDF: Statement Checklist", description: "Top 10 Things to Check on Your Merchant Statement", status: "not-started", fileUrl: "", updatedAt: new Date().toISOString() },
    { category: "lead-gen", name: "Lead Magnet PDF: Cash Discount Guide", description: "Cash Discount Program Explained: Is It Right for Your Business?", status: "not-started", fileUrl: "", updatedAt: new Date().toISOString() },
    { category: "lead-gen", name: "Landing Page with Lead Capture Form", description: "Opt-in page for lead magnets with form + thank-you page", status: "not-started", fileUrl: "", updatedAt: new Date().toISOString() },
    { category: "lead-gen", name: "QR Codes for Print Materials", description: "Links to landing page, for one-pagers and business cards", status: "not-started", fileUrl: "", updatedAt: new Date().toISOString() },
    { category: "partner", name: "Referral Partner Agreement", description: "Simple 1-pager: terms, commission, tracking method", status: "not-started", fileUrl: "", updatedAt: new Date().toISOString() },
    { category: "partner", name: "Partner Intro Email Template", description: "Template for partners to introduce you to their clients", status: "not-started", fileUrl: "", updatedAt: new Date().toISOString() },
    { category: "partner", name: "CRM Partner Tracking Setup", description: "Tags, source field, quarterly check-in calendar", status: "not-started", fileUrl: "", updatedAt: new Date().toISOString() },
    { category: "tracking", name: "Weekly KPI Sheet", description: "Track outreach, contacts, appointments, closes weekly", status: "not-started", fileUrl: "", updatedAt: new Date().toISOString() },
    { category: "tracking", name: "Channel Scorecard", description: "Per-source conversion funnel + avg volume metrics", status: "not-started", fileUrl: "", updatedAt: new Date().toISOString() },
    { category: "tracking", name: "Follow-Up SLA Tracker", description: "24hr rule for lead magnets, 48hr for partner referrals", status: "not-started", fileUrl: "", updatedAt: new Date().toISOString() },
  ];
  items.forEach((item) => {
    const id = randomUUID();
    materials.set(id, { id, ...item });
  });
}

function logActivity(action: string, details: string, type: string) {
  activityLog.unshift({
    id: randomUUID(),
    action,
    details,
    timestamp: new Date().toISOString(),
    type,
  });
  if (activityLog.length > 100) activityLog.length = 100;
}

async function sendSlackNotification(text: string) {
  if (!slackConfig.enabled || !slackConfig.webhookUrl) return;
  try {
    await fetch(slackConfig.webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, channel: slackConfig.channel }),
    });
  } catch (err) {
    console.error("Slack notification failed:", err);
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // ─── Admin Auth ─────────────────────────────────────────────────

  app.post("/api/admin/login", (req: Request, res: Response) => {
    const { password } = req.body;
    const adminPassword = process.env.SESSION_SECRET;
    if (!adminPassword) {
      return res.status(500).json({ error: "Admin access not configured." });
    }
    if (password === adminPassword) {
      req.session.isAdmin = true;
      logActivity("Login", "Admin logged in", "auth");
      return res.json({ success: true });
    }
    return res.status(401).json({ error: "Invalid password." });
  });

  app.post("/api/admin/logout", (req: Request, res: Response) => {
    req.session.isAdmin = false;
    return res.json({ success: true });
  });

  app.get("/api/admin/check", (req: Request, res: Response) => {
    const isAdmin = !!req.session?.isAdmin;
    return res.json({ authenticated: isAdmin });
  });

  // ─── AI Config ──────────────────────────────────────────────────

  app.get("/api/ai-config", async (_req, res) => {
    const config = await storage.getAiConfig();
    res.json(config);
  });

  app.patch("/api/ai-config", requireAdminSession, async (req, res) => {
    const parsed = updateAiConfigSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.message });
    }
    if (parsed.data.model && !ALLOWED_MODELS.includes(parsed.data.model)) {
      return res.status(400).json({ error: "Invalid model selection." });
    }
    if (parsed.data.maxTokens && parsed.data.maxTokens > MAX_ALLOWED_TOKENS) {
      parsed.data.maxTokens = MAX_ALLOWED_TOKENS;
    }
    const config = await storage.updateAiConfig(parsed.data);
    res.json(config);
  });

  // ─── Chat ───────────────────────────────────────────────────────

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

    const safeMaxTokens = Math.min(config.maxTokens, MAX_ALLOWED_TOKENS);

    try {
      const anthropic = new Anthropic({ apiKey });

      const response = await anthropic.messages.create({
        model: config.model,
        max_tokens: safeMaxTokens,
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

  // ─── Contact Leads (from website form) ──────────────────────────

  app.post("/api/contact-leads", async (req: Request, res: Response) => {
    const parsed = insertContactLeadSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.message });
    }
    const lead = await storage.createContactLead(parsed.data);
    logActivity("New Website Lead", `${parsed.data.businessName} submitted contact form`, "lead");
    if (slackConfig.notifyNewLead) {
      sendSlackNotification(`New lead from website: ${parsed.data.businessName} (${parsed.data.contactName}) - ${parsed.data.email}`);
    }
    res.status(201).json(lead);
  });

  app.get("/api/contact-leads", requireAdminSession, async (_req: Request, res: Response) => {
    const contactLeads = await storage.getContactLeads();
    res.json(contactLeads);
  });

  // ─── Leads CRUD ─────────────────────────────────────────────────

  app.get("/api/leads", requireAdminSession, (_req, res) => {
    res.json(Array.from(leads.values()));
  });

  app.post("/api/leads", requireAdminSession, (req, res) => {
    const id = randomUUID();
    const now = new Date().toISOString();
    const lead: Lead = {
      id,
      name: req.body.name || "",
      business: req.body.business || "",
      address: req.body.address || "",
      phone: req.body.phone || "",
      email: req.body.email || "",
      decisionMakerName: req.body.decisionMakerName || "",
      decisionMakerRole: req.body.decisionMakerRole || "",
      bestContactMethod: req.body.bestContactMethod || "phone",
      package: req.body.package || "terminal",
      status: req.body.status || "new",
      source: req.body.source || "direct",
      vertical: req.body.vertical || "other",
      currentProcessor: req.body.currentProcessor || "",
      currentEquipment: req.body.currentEquipment || "",
      monthlyVolume: req.body.monthlyVolume || "",
      painPoints: req.body.painPoints || "",
      nextStep: req.body.nextStep || "",
      nextStepDate: req.body.nextStepDate || "",
      attachments: Array.isArray(req.body.attachments) ? req.body.attachments : [],
      notes: req.body.notes || "",
      createdAt: now,
      updatedAt: now,
    };
    leads.set(id, lead);
    logActivity("Lead Created", `${lead.business || lead.name}`, "lead");
    if (slackConfig.notifyNewLead) {
      sendSlackNotification(`New lead added: ${lead.business || lead.name} (${lead.package})`);
    }
    res.status(201).json(lead);
  });

  app.patch("/api/leads/:id", requireAdminSession, (req, res) => {
    const lead = leads.get(req.params.id);
    if (!lead) return res.status(404).json({ error: "Lead not found" });
    Object.assign(lead, req.body, { updatedAt: new Date().toISOString() });
    leads.set(req.params.id, lead);
    logActivity("Lead Updated", `${lead.business || lead.name} - ${lead.status}`, "lead");
    res.json(lead);
  });

  app.delete("/api/leads/:id", requireAdminSession, (req, res) => {
    const lead = leads.get(req.params.id);
    leads.delete(req.params.id);
    if (lead) logActivity("Lead Deleted", `${lead.business || lead.name}`, "lead");
    res.json({ success: true });
  });

  // ─── Clients CRUD ───────────────────────────────────────────────

  app.get("/api/clients", requireAdminSession, (_req, res) => {
    res.json(Array.from(clients.values()));
  });

  app.post("/api/clients", requireAdminSession, (req, res) => {
    const id = randomUUID();
    const client: Client = {
      id,
      name: req.body.name || "",
      business: req.body.business || "",
      phone: req.body.phone || "",
      email: req.body.email || "",
      package: req.body.package || "terminal",
      maintenance: req.body.maintenance || "none",
      websiteUrl: req.body.websiteUrl || "",
      websiteStatus: req.body.websiteStatus || "not-started",
      terminalId: req.body.terminalId || "",
      monthlyVolume: req.body.monthlyVolume || 0,
      startDate: req.body.startDate || new Date().toISOString().split("T")[0],
      notes: req.body.notes || "",
    };
    clients.set(id, client);
    logActivity("Client Added", `${client.business || client.name}`, "client");
    if (slackConfig.notifyNewClient) {
      sendSlackNotification(`New client onboarded: ${client.business || client.name} (${client.package})`);
    }
    res.status(201).json(client);
  });

  app.patch("/api/clients/:id", requireAdminSession, (req, res) => {
    const client = clients.get(req.params.id);
    if (!client) return res.status(404).json({ error: "Client not found" });
    Object.assign(client, req.body);
    clients.set(req.params.id, client);
    logActivity("Client Updated", `${client.business || client.name}`, "client");
    res.json(client);
  });

  app.delete("/api/clients/:id", requireAdminSession, (req, res) => {
    const client = clients.get(req.params.id);
    clients.delete(req.params.id);
    if (client) logActivity("Client Removed", `${client.business || client.name}`, "client");
    res.json({ success: true });
  });

  // ─── Revenue CRUD ───────────────────────────────────────────────

  app.get("/api/revenue", requireAdminSession, (_req, res) => {
    res.json(Array.from(revenue.values()));
  });

  app.post("/api/revenue", requireAdminSession, (req, res) => {
    const id = randomUUID();
    const entry: RevenueEntry = {
      id,
      date: req.body.date || new Date().toISOString().split("T")[0],
      type: req.body.type || "other",
      description: req.body.description || "",
      amount: req.body.amount || 0,
      clientId: req.body.clientId || "",
      recurring: req.body.recurring || false,
    };
    revenue.set(id, entry);
    logActivity("Revenue Recorded", `$${entry.amount} - ${entry.type}`, "revenue");
    if (slackConfig.notifyRevenue) {
      sendSlackNotification(`Revenue recorded: $${entry.amount} (${entry.type})`);
    }
    res.status(201).json(entry);
  });

  app.patch("/api/revenue/:id", requireAdminSession, (req, res) => {
    const entry = revenue.get(req.params.id);
    if (!entry) return res.status(404).json({ error: "Entry not found" });
    Object.assign(entry, req.body);
    revenue.set(req.params.id, entry);
    res.json(entry);
  });

  app.delete("/api/revenue/:id", requireAdminSession, (req, res) => {
    revenue.delete(req.params.id);
    res.json({ success: true });
  });

  // ─── Tasks CRUD ─────────────────────────────────────────────────

  app.get("/api/tasks", requireAdminSession, (_req, res) => {
    res.json(Array.from(tasks.values()));
  });

  app.post("/api/tasks", requireAdminSession, (req, res) => {
    const id = randomUUID();
    const task: Task = {
      id,
      title: req.body.title || "",
      dueDate: req.body.dueDate || "",
      priority: req.body.priority || "medium",
      completed: req.body.completed || false,
      linkedTo: req.body.linkedTo || "",
      createdAt: new Date().toISOString(),
    };
    tasks.set(id, task);
    logActivity("Task Created", task.title, "task");
    res.status(201).json(task);
  });

  app.patch("/api/tasks/:id", requireAdminSession, (req, res) => {
    const task = tasks.get(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    Object.assign(task, req.body);
    tasks.set(req.params.id, task);
    res.json(task);
  });

  app.delete("/api/tasks/:id", requireAdminSession, (req, res) => {
    tasks.delete(req.params.id);
    res.json({ success: true });
  });

  // ─── File Management ────────────────────────────────────────────

  app.get("/api/files", requireAdminSession, (_req, res) => {
    res.json(Array.from(files.values()));
  });

  app.post("/api/files", requireAdminSession, (req, res) => {
    const id = randomUUID();
    const file: AdminFile = {
      id,
      name: req.body.name || "untitled",
      size: req.body.size || 0,
      type: req.body.type || "document",
      category: req.body.category || "general",
      uploadedAt: new Date().toISOString(),
      url: req.body.url || "",
    };
    files.set(id, file);
    logActivity("File Added", file.name, "file");
    res.status(201).json(file);
  });

  app.delete("/api/files/:id", requireAdminSession, (req, res) => {
    const file = files.get(req.params.id);
    files.delete(req.params.id);
    if (file) logActivity("File Deleted", file.name, "file");
    res.json({ success: true });
  });

  // ─── Slack Integration ──────────────────────────────────────────

  app.get("/api/integrations/slack", requireAdminSession, (_req, res) => {
    res.json(slackConfig);
  });

  app.patch("/api/integrations/slack", requireAdminSession, (req, res) => {
    Object.assign(slackConfig, req.body);
    logActivity("Slack Config Updated", `Enabled: ${slackConfig.enabled}`, "integration");
    res.json(slackConfig);
  });

  app.post("/api/integrations/slack/test", requireAdminSession, async (_req, res) => {
    if (!slackConfig.webhookUrl) {
      return res.status(400).json({ error: "No webhook URL configured" });
    }
    try {
      await fetch(slackConfig.webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "TechSavvy Admin: Test notification from your dashboard!" }),
      });
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to send test message: " + err.message });
    }
  });

  // ─── Integrations (Generic) ─────────────────────────────────────

  app.get("/api/integrations", requireAdminSession, (_req, res) => {
    res.json(Array.from(integrations.values()));
  });

  app.post("/api/integrations", requireAdminSession, (req, res) => {
    const id = randomUUID();
    const integration: Integration = {
      id,
      name: req.body.name || "",
      type: req.body.type || "webhook",
      enabled: req.body.enabled ?? false,
      config: req.body.config || {},
      lastSync: new Date().toISOString(),
    };
    integrations.set(id, integration);
    logActivity("Integration Added", integration.name, "integration");
    res.status(201).json(integration);
  });

  app.patch("/api/integrations/:id", requireAdminSession, (req, res) => {
    const integration = integrations.get(req.params.id);
    if (!integration) return res.status(404).json({ error: "Integration not found" });
    Object.assign(integration, req.body, { lastSync: new Date().toISOString() });
    integrations.set(req.params.id, integration);
    res.json(integration);
  });

  app.delete("/api/integrations/:id", requireAdminSession, (req, res) => {
    integrations.delete(req.params.id);
    res.json({ success: true });
  });

  // ─── Activity Log ───────────────────────────────────────────────

  app.get("/api/activity", requireAdminSession, (_req, res) => {
    res.json(activityLog.slice(0, 50));
  });

  // ─── Referral Partners ─────────────────────────────────────────

  app.get("/api/referral-partners", requireAdminSession, (_req, res) => {
    res.json(Array.from(referralPartners.values()));
  });

  app.post("/api/referral-partners", requireAdminSession, (req, res) => {
    const id = randomUUID();
    const partner: ReferralPartner = {
      id,
      name: req.body.name || "",
      niche: req.body.niche || "",
      clientTypes: req.body.clientTypes || "",
      referralTerms: req.body.referralTerms || "",
      introMethod: req.body.introMethod || "",
      trackingNotes: req.body.trackingNotes || "",
      lastCheckIn: req.body.lastCheckIn || "",
      nextCheckIn: req.body.nextCheckIn || "",
      createdAt: new Date().toISOString(),
    };
    referralPartners.set(id, partner);
    logActivity("Partner Added", partner.name, "lead");
    res.status(201).json(partner);
  });

  app.patch("/api/referral-partners/:id", requireAdminSession, (req, res) => {
    const partner = referralPartners.get(req.params.id);
    if (!partner) return res.status(404).json({ error: "Partner not found" });
    Object.assign(partner, req.body);
    referralPartners.set(req.params.id, partner);
    res.json(partner);
  });

  app.delete("/api/referral-partners/:id", requireAdminSession, (req, res) => {
    referralPartners.delete(req.params.id);
    res.json({ success: true });
  });

  // ─── Playbook Checklists ─────────────────────────────────────────

  app.get("/api/playbook-checks", requireAdminSession, (_req, res) => {
    res.json(Array.from(playbookChecks.values()));
  });

  app.post("/api/playbook-checks", requireAdminSession, (req, res) => {
    const id = req.body.id || randomUUID();
    const item: PlaybookCheckItem = {
      id,
      channel: req.body.channel || "",
      label: req.body.label || "",
      completed: req.body.completed || false,
      completedAt: req.body.completed ? new Date().toISOString() : "",
    };
    playbookChecks.set(id, item);
    res.status(201).json(item);
  });

  app.patch("/api/playbook-checks/:id", requireAdminSession, (req, res) => {
    const item = playbookChecks.get(req.params.id);
    if (!item) return res.status(404).json({ error: "Not found" });
    Object.assign(item, req.body);
    if (req.body.completed) item.completedAt = new Date().toISOString();
    if (req.body.completed === false) item.completedAt = "";
    playbookChecks.set(req.params.id, item);
    res.json(item);
  });

  // ─── Weekly KPIs ─────────────────────────────────────────────────

  app.get("/api/kpis", requireAdminSession, (_req, res) => {
    res.json(Array.from(weeklyKPIs.values()));
  });

  app.post("/api/kpis", requireAdminSession, (req, res) => {
    const id = randomUUID();
    const kpi: WeeklyKPI = {
      id,
      weekStart: req.body.weekStart || "",
      outboundCalls: req.body.outboundCalls || 0,
      outboundEmails: req.body.outboundEmails || 0,
      outboundDMs: req.body.outboundDMs || 0,
      walkIns: req.body.walkIns || 0,
      contactsMade: req.body.contactsMade || 0,
      appointmentsSet: req.body.appointmentsSet || 0,
      statementsRequested: req.body.statementsRequested || 0,
      statementsReceived: req.body.statementsReceived || 0,
      proposalsSent: req.body.proposalsSent || 0,
      dealsWon: req.body.dealsWon || 0,
      volumeWon: req.body.volumeWon || 0,
      notes: req.body.notes || "",
    };
    weeklyKPIs.set(id, kpi);
    logActivity("KPI Logged", `Week of ${kpi.weekStart}`, "task");
    res.status(201).json(kpi);
  });

  app.patch("/api/kpis/:id", requireAdminSession, (req, res) => {
    const kpi = weeklyKPIs.get(req.params.id);
    if (!kpi) return res.status(404).json({ error: "Not found" });
    Object.assign(kpi, req.body);
    weeklyKPIs.set(req.params.id, kpi);
    res.json(kpi);
  });

  app.delete("/api/kpis/:id", requireAdminSession, (req, res) => {
    weeklyKPIs.delete(req.params.id);
    res.json({ success: true });
  });

  // ─── 90-Day Plan Items ───────────────────────────────────────────

  app.get("/api/plan-items", requireAdminSession, (_req, res) => {
    seedPlanIfNeeded();
    res.json(Array.from(planItems.values()).sort((a, b) => a.order - b.order));
  });

  app.post("/api/plan-items", requireAdminSession, (req, res) => {
    const id = randomUUID();
    const item: PlanItem = {
      id,
      phase: req.body.phase || 1,
      weekRange: req.body.weekRange || "1-2",
      title: req.body.title || "",
      description: req.body.description || "",
      completed: false,
      completedAt: "",
      order: req.body.order || planItems.size + 1,
    };
    planItems.set(id, item);
    res.status(201).json(item);
  });

  app.patch("/api/plan-items/:id", requireAdminSession, (req, res) => {
    const item = planItems.get(req.params.id);
    if (!item) return res.status(404).json({ error: "Not found" });
    Object.assign(item, req.body);
    if (req.body.completed && !item.completedAt) item.completedAt = new Date().toISOString();
    if (req.body.completed === false) item.completedAt = "";
    planItems.set(req.params.id, item);
    res.json(item);
  });

  app.delete("/api/plan-items/:id", requireAdminSession, (req, res) => {
    planItems.delete(req.params.id);
    res.json({ success: true });
  });

  // ─── Materials Checklist ─────────────────────────────────────────

  app.get("/api/materials", requireAdminSession, (_req, res) => {
    seedMaterialsIfNeeded();
    res.json(Array.from(materials.values()));
  });

  app.post("/api/materials", requireAdminSession, (req, res) => {
    const id = randomUUID();
    const item: MaterialItem = {
      id,
      category: req.body.category || "sales",
      name: req.body.name || "",
      description: req.body.description || "",
      status: req.body.status || "not-started",
      fileUrl: req.body.fileUrl || "",
      updatedAt: new Date().toISOString(),
    };
    materials.set(id, item);
    res.status(201).json(item);
  });

  app.patch("/api/materials/:id", requireAdminSession, (req, res) => {
    const item = materials.get(req.params.id);
    if (!item) return res.status(404).json({ error: "Not found" });
    Object.assign(item, req.body, { updatedAt: new Date().toISOString() });
    materials.set(req.params.id, item);
    res.json(item);
  });

  // ─── Scorecard Metrics (Computed) ────────────────────────────────

  app.get("/api/metrics/scorecard", requireAdminSession, (_req, res) => {
    const allLeads = Array.from(leads.values());
    const sources = ["referral", "networking", "social", "direct", "lead-magnet"];

    const scorecard = sources.map((src) => {
      const srcLeads = allLeads.filter((l) => l.source === src);
      const total = srcLeads.length;
      const contacted = srcLeads.filter((l) => l.status !== "new").length;
      const qualified = srcLeads.filter((l) => !["new", "contacted"].includes(l.status)).length;
      const stmtRequested = srcLeads.filter((l) => ["statement-requested", "statement-received", "analysis-delivered", "proposal-sent", "negotiation", "won"].includes(l.status)).length;
      const stmtReceived = srcLeads.filter((l) => ["statement-received", "analysis-delivered", "proposal-sent", "negotiation", "won"].includes(l.status)).length;
      const proposalSent = srcLeads.filter((l) => ["proposal-sent", "negotiation", "won"].includes(l.status)).length;
      const won = srcLeads.filter((l) => l.status === "won").length;
      const lost = srcLeads.filter((l) => l.status === "lost").length;
      const closed = won + lost;

      const wonLeads = srcLeads.filter((l) => l.status === "won");
      const avgTimeToClose = wonLeads.length > 0
        ? wonLeads.reduce((sum, l) => sum + (new Date(l.updatedAt).getTime() - new Date(l.createdAt).getTime()), 0) / wonLeads.length / 86400000
        : 0;

      const avgVolumeWon = wonLeads.length > 0
        ? wonLeads.reduce((sum, l) => {
            const match = (l.monthlyVolume || "0").match(/[\d.]+/);
            const v = match ? parseFloat(match[0]) : 0;
            return sum + (isNaN(v) ? 0 : v);
          }, 0) / wonLeads.length
        : 0;

      return {
        source: src,
        total,
        contacted,
        contactRate: total > 0 ? Math.round((contacted / total) * 100) : 0,
        qualified,
        appointmentRate: contacted > 0 ? Math.round((qualified / contacted) * 100) : 0,
        stmtRequested,
        stmtReceived,
        stmtReceivedRate: stmtRequested > 0 ? Math.round((stmtReceived / stmtRequested) * 100) : 0,
        proposalSent,
        won,
        lost,
        closeRate: closed > 0 ? Math.round((won / closed) * 100) : 0,
        avgTimeToClose: Math.round(avgTimeToClose),
        avgVolumeWon: Math.round(avgVolumeWon),
      };
    });

    const overall = {
      totalLeads: allLeads.length,
      activeLeads: allLeads.filter((l) => !["won", "lost", "nurture"].includes(l.status)).length,
      totalWon: allLeads.filter((l) => l.status === "won").length,
      totalLost: allLeads.filter((l) => l.status === "lost").length,
    };

    res.json({ scorecard, overall });
  });

  // ─── Dashboard Stats ───────────────────────────────────────────

  app.get("/api/dashboard/stats", requireAdminSession, async (_req, res) => {
    const contactLeads = await storage.getContactLeads();
    const now = new Date();
    const thisMonthRevenue = Array.from(revenue.values())
      .filter((r) => {
        const d = new Date(r.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .reduce((sum, r) => sum + r.amount, 0);

    const mrr = Array.from(clients.values()).reduce((sum, c) => {
      const prices: Record<string, number> = { none: 0, basic: 99, pro: 199, premium: 399 };
      return sum + (prices[c.maintenance] || 0);
    }, 0);

    res.json({
      totalLeads: leads.size,
      activeLeads: Array.from(leads.values()).filter((l) => !["won", "lost"].includes(l.status)).length,
      totalClients: clients.size,
      websitesLive: Array.from(clients.values()).filter((c) => c.websiteStatus === "live").length,
      thisMonthRevenue,
      mrr,
      pendingTasks: Array.from(tasks.values()).filter((t) => !t.completed).length,
      overdueTasks: Array.from(tasks.values()).filter((t) => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()).length,
      contactFormLeads: contactLeads.length,
      totalFiles: files.size,
      slackEnabled: slackConfig.enabled,
      integrationsCount: integrations.size,
    });
  });

  return httpServer;
}
