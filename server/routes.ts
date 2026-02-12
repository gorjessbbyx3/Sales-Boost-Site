import type { Express, Request, Response, NextFunction } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { updateAiConfigSchema, insertContactLeadSchema } from "@shared/schema";
import * as schema from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, getTableColumns } from "drizzle-orm";
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

// ─── DB Helpers ─────────────────────────────────────────────────────

function pickColumns(table: any, data: Record<string, any>): Record<string, any> {
  const cols = Object.keys(getTableColumns(table));
  const result: Record<string, any> = {};
  for (const key of cols) {
    if (key in data && key !== "id") {
      result[key] = data[key];
    }
  }
  return result;
}

function deserializeLead(row: typeof schema.leads.$inferSelect) {
  return { ...row, attachments: JSON.parse(row.attachments || "[]") };
}

function deserializeIntegration(row: typeof schema.integrations.$inferSelect) {
  return { ...row, config: JSON.parse(row.config || "{}") };
}

async function logActivity(action: string, details: string, type: string) {
  try {
    await db.insert(schema.activityLog).values({
      id: randomUUID(),
      action,
      details,
      timestamp: new Date().toISOString(),
      type,
    });
  } catch (err) {
    console.error("Failed to log activity:", err);
  }
}

async function sendSlackNotification(text: string, eventType?: string) {
  try {
    const [config] = await db.select().from(schema.slackConfig).where(eq(schema.slackConfig.id, "default"));
    if (!config || !config.enabled || !config.webhookUrl) return;
    if (eventType === "newLead" && !config.notifyNewLead) return;
    if (eventType === "newClient" && !config.notifyNewClient) return;
    if (eventType === "revenue" && !config.notifyRevenue) return;
    if (eventType === "taskDue" && !config.notifyTaskDue) return;

    await fetch(config.webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, channel: config.channel }),
    });
  } catch (err) {
    console.error("Slack notification failed:", err);
  }
}

// ─── Seed Functions (check DB first, insert if empty) ───────────────

let planSeeded = false;
async function seedPlanIfNeeded() {
  if (planSeeded) return;
  planSeeded = true;
  const existing = await db.select({ id: schema.planItems.id }).from(schema.planItems).limit(1);
  if (existing.length > 0) return;
  const items = [
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
  await db.insert(schema.planItems).values(
    items.map((item) => ({ id: randomUUID(), ...item }))
  );
}

let materialsSeeded = false;
async function seedMaterialsIfNeeded() {
  if (materialsSeeded) return;
  materialsSeeded = true;
  const existing = await db.select({ id: schema.materials.id }).from(schema.materials).limit(1);
  if (existing.length > 0) return;
  const now = new Date().toISOString();
  const items = [
    { category: "sales", name: "One-Page Value Prop + Statement Review Offer", description: "Benefits, pricing, QR to landing page — print + PDF", status: "not-started", fileUrl: "", updatedAt: now },
    { category: "sales", name: "Cold Call Script + Objection Handlers", description: "30-60 sec opener, qualification Qs, common objections", status: "not-started", fileUrl: "", updatedAt: now },
    { category: "sales", name: "Walk-In Script + Leave-Behind Card", description: "In-person opener with handoff material", status: "not-started", fileUrl: "", updatedAt: now },
    { category: "sales", name: "Email Templates (Cold + Follow-Up + Confirm)", description: "Initial outreach, follow-up sequences, appointment confirm", status: "not-started", fileUrl: "", updatedAt: now },
    { category: "lead-gen", name: "Lead Magnet PDF: Statement Checklist", description: "Top 10 Things to Check on Your Merchant Statement", status: "not-started", fileUrl: "", updatedAt: now },
    { category: "lead-gen", name: "Lead Magnet PDF: Cash Discount Guide", description: "Cash Discount Program Explained: Is It Right for Your Business?", status: "not-started", fileUrl: "", updatedAt: now },
    { category: "lead-gen", name: "Landing Page with Lead Capture Form", description: "Opt-in page for lead magnets with form + thank-you page", status: "not-started", fileUrl: "", updatedAt: now },
    { category: "lead-gen", name: "QR Codes for Print Materials", description: "Links to landing page, for one-pagers and business cards", status: "not-started", fileUrl: "", updatedAt: now },
    { category: "partner", name: "Referral Partner Agreement", description: "Simple 1-pager: terms, commission, tracking method", status: "not-started", fileUrl: "", updatedAt: now },
    { category: "partner", name: "Partner Intro Email Template", description: "Template for partners to introduce you to their clients", status: "not-started", fileUrl: "", updatedAt: now },
    { category: "partner", name: "CRM Partner Tracking Setup", description: "Tags, source field, quarterly check-in calendar", status: "not-started", fileUrl: "", updatedAt: now },
    { category: "tracking", name: "Weekly KPI Sheet", description: "Track outreach, contacts, appointments, closes weekly", status: "not-started", fileUrl: "", updatedAt: now },
    { category: "tracking", name: "Channel Scorecard", description: "Per-source conversion funnel + avg volume metrics", status: "not-started", fileUrl: "", updatedAt: now },
    { category: "tracking", name: "Follow-Up SLA Tracker", description: "24hr rule for lead magnets, 48hr for partner referrals", status: "not-started", fileUrl: "", updatedAt: now },
  ];
  await db.insert(schema.materials).values(
    items.map((item) => ({ id: randomUUID(), ...item }))
  );
}

let resourcesSeeded = false;
async function seedResourcesIfNeeded() {
  if (resourcesSeeded) return;
  resourcesSeeded = true;
  const existing = await db.select({ id: schema.resources.id }).from(schema.resources).limit(1);
  if (existing.length > 0) return;
  const now = new Date().toISOString();
  const items = [
    // ─── Client Sales Resources (Google Drive Folder 1) ────────────
    { title: "Cash Discount Program — Part 1", description: "Comprehensive guide to the Cash Discount Program covering compliance, implementation, and customer communication. PDF format.", category: "sales-materials", type: "pdf", url: "https://drive.google.com/file/d/1yiqqPiOkcTUizcncUYE7v0fs5ezPDMFu/view", thumbnailUrl: "", order: 1, featured: true, published: true, createdAt: now, updatedAt: now },
    { title: "Cash Discount Program — Part 2", description: "Visual companion to the Cash Discount Program guide. Print-ready infographic with program details and signage requirements.", category: "sales-materials", type: "pdf", url: "https://drive.google.com/file/d/1FYLYcqF9Wm0vi4da2WQI4aaIyCw193qs/view", thumbnailUrl: "", order: 2, featured: false, published: true, createdAt: now, updatedAt: now },
    { title: "3x4 Sticker Design", description: "Print-ready 3x4 sticker design for terminal branding and point-of-sale signage.", category: "sales-materials", type: "pdf", url: "https://drive.google.com/file/d/11Gi1iVlaQAxKA0FxkzQ_JxJBocs0N012/view", thumbnailUrl: "", order: 3, featured: false, published: true, createdAt: now, updatedAt: now },
    { title: "Sales Flyer 1", description: "Professional sales flyer for merchant outreach — highlights zero-fee processing benefits and terminal offer.", category: "sales-materials", type: "pdf", url: "https://drive.google.com/file/d/1U2JEMh6qh-c_YoYODsQePykFUXcstXti/view", thumbnailUrl: "", order: 4, featured: true, published: true, createdAt: now, updatedAt: now },
    { title: "Sales Flyer 2", description: "Alternative flyer design for different merchant verticals. Print-ready format.", category: "sales-materials", type: "pdf", url: "https://drive.google.com/file/d/18Q68EIHNAmyYD6Sc57NA9r05cP4tgCbx/view", thumbnailUrl: "", order: 5, featured: false, published: true, createdAt: now, updatedAt: now },
    { title: "Sales Flyer 3", description: "Detailed sales flyer with pricing breakdown and feature comparison. PDF format.", category: "sales-materials", type: "pdf", url: "https://drive.google.com/file/d/1Pn9QfiffkruzyuK2YAiOPlipNuexmqWc/view", thumbnailUrl: "", order: 6, featured: false, published: true, createdAt: now, updatedAt: now },
    { title: "Sales Flyer 4", description: "Walk-in leave-behind flyer designed for high-impact first impressions.", category: "sales-materials", type: "pdf", url: "https://drive.google.com/file/d/1X2zv7bIA9QxYPhbfUg9IEL74tpkElvxK/view", thumbnailUrl: "", order: 7, featured: false, published: true, createdAt: now, updatedAt: now },
    { title: "Savings Calculator — Page 1", description: "Visual savings calculator showing merchants exactly how much they save with zero-fee processing vs. traditional processors.", category: "sales-materials", type: "pdf", url: "https://drive.google.com/file/d/1_DSpS5jGL1AIe9mlzr2S19Nz-_-gIv6f/view", thumbnailUrl: "", order: 8, featured: true, published: true, createdAt: now, updatedAt: now },
    { title: "Savings Calculator — Page 2", description: "Extended savings breakdown with annual projections and comparison charts.", category: "sales-materials", type: "pdf", url: "https://drive.google.com/file/d/1Pxc9mgUKGCExnT5PEbBCJoY06EheVQYh/view", thumbnailUrl: "", order: 9, featured: false, published: true, createdAt: now, updatedAt: now },

    // ─── RPower POS Marketing Assets (Google Drive Folder 2) ───────
    { title: "Battlecard — Aloha POS", description: "Competitive battlecard: RPOWER vs. Aloha POS. Key differentiators, objection handlers, and win strategies.", category: "pos-systems", type: "pdf", url: "https://drive.google.com/file/d/1q1-eylUdUoeVKoUgntf1cGLmZ8_Pg_Yi/view", thumbnailUrl: "", order: 1, featured: true, published: true, createdAt: now, updatedAt: now },
    { title: "Battlecard — Clover", description: "Competitive battlecard: RPOWER vs. Clover. Feature comparison, pricing advantages, and sales talking points.", category: "pos-systems", type: "pdf", url: "https://drive.google.com/file/d/1Ha067oNONsNA4ZRI3NAchQq41yTrM5vT/view", thumbnailUrl: "", order: 2, featured: true, published: true, createdAt: now, updatedAt: now },
    { title: "Battlecard — SkyTab", description: "Competitive battlecard: RPOWER vs. SkyTab. Side-by-side comparison for restaurant merchants.", category: "pos-systems", type: "pdf", url: "https://drive.google.com/file/d/12lf3AEDrdpn8eU1du81bKHUIWb2pknR3/view", thumbnailUrl: "", order: 3, featured: false, published: true, createdAt: now, updatedAt: now },
    { title: "Battlecard — Toast", description: "Competitive battlecard: RPOWER vs. Toast. Counter-arguments for the most common POS competitor in restaurants.", category: "pos-systems", type: "pdf", url: "https://drive.google.com/file/d/11VtrwKmJGV0HdWK8ZwgZNH5RyeQfXWxC/view", thumbnailUrl: "", order: 4, featured: true, published: true, createdAt: now, updatedAt: now },
    { title: "RPOWER Reseller Presentation", description: "Complete reseller overview presentation covering RPOWER POS capabilities, pricing, and partnership model. PowerPoint format.", category: "pos-systems", type: "doc", url: "https://drive.google.com/file/d/1etbM1RikvCfRP-Xj7fQWcGZOUtxdcYFO/view", thumbnailUrl: "", order: 5, featured: true, published: true, createdAt: now, updatedAt: now },
    { title: "RPOWER Buyer's Guide", description: "Comprehensive buyer's guide for RPOWER POS system — features, pricing tiers, hardware options, and ROI calculator.", category: "pos-systems", type: "pdf", url: "https://drive.google.com/file/d/1I7WYWDtQNr30BQyPZ4ypIYFoAFiWZBZi/view", thumbnailUrl: "", order: 6, featured: false, published: true, createdAt: now, updatedAt: now },
    { title: "RPOWER Reference Information", description: "Quick reference sheet with RPOWER technical specs, support contacts, and implementation timeline.", category: "pos-systems", type: "doc", url: "https://drive.google.com/file/d/1RM-7N44B8mxUkB2trR2NGlLjpbOYoZBt/view", thumbnailUrl: "", order: 7, featured: false, published: true, createdAt: now, updatedAt: now },
    { title: "RPOWER mPay — Contactless Payments Brochure", description: "mPay contactless payment solution brochure — tap-to-pay, mobile wallets, NFC capabilities.", category: "pos-systems", type: "pdf", url: "https://drive.google.com/file/d/1dlQJheSIL2YlfPUTcGe_XlKksrBn-NYK/view", thumbnailUrl: "", order: 8, featured: false, published: true, createdAt: now, updatedAt: now },
    { title: "RPOWER — Accounting Integration Brochure", description: "How RPOWER integrates with accounting platforms for seamless financial reporting and reconciliation.", category: "pos-systems", type: "pdf", url: "https://drive.google.com/file/d/1FjsBCRO1ytBTklXfdDUEXzKv8kaSFd7L/view", thumbnailUrl: "", order: 9, featured: false, published: true, createdAt: now, updatedAt: now },
    { title: "RPOWER — Bar & Nightclub Brochure", description: "RPOWER POS solutions designed for bars and nightclubs — tab management, speed ordering, ID verification.", category: "pos-systems", type: "pdf", url: "https://drive.google.com/file/d/12qfP2eAU3quFOcygDCd6eTW6XUnm6e2k/view", thumbnailUrl: "", order: 10, featured: false, published: true, createdAt: now, updatedAt: now },
    { title: "RPOWER — Full POS Brochure", description: "Complete RPOWER POS system brochure covering all features, hardware, and service plans.", category: "pos-systems", type: "pdf", url: "https://drive.google.com/file/d/105yY_FGwTcoCcpGAfkHkWseIw8p6h0md/view", thumbnailUrl: "", order: 11, featured: false, published: true, createdAt: now, updatedAt: now },
    { title: "RPOWER — Counter Service Brochure", description: "POS solutions for counter-service restaurants — quick ordering, kitchen display, and customer-facing screens.", category: "pos-systems", type: "pdf", url: "https://drive.google.com/file/d/191MbqX_JPkCVxMsKfFWvGNbQvS9sROlp/view", thumbnailUrl: "", order: 12, featured: false, published: true, createdAt: now, updatedAt: now },
    { title: "RPOWER — Delivery & Pickup Brochure", description: "Online ordering, delivery dispatch, and curbside pickup capabilities with RPOWER POS.", category: "pos-systems", type: "pdf", url: "https://drive.google.com/file/d/1tmCe3OJNu298zDdKJ1V4qptlqJGj8iIr/view", thumbnailUrl: "", order: 13, featured: false, published: true, createdAt: now, updatedAt: now },
    { title: "RPOWER — Fine Dining Brochure", description: "Premium POS features for fine dining — coursing, split checks, wine list management, and tableside ordering.", category: "pos-systems", type: "pdf", url: "https://drive.google.com/file/d/1DQ2gehnSQqn6Cgh5S6OeiyPw4Adeituf/view", thumbnailUrl: "", order: 14, featured: false, published: true, createdAt: now, updatedAt: now },
    { title: "RPOWER — Gift & Loyalty Brochure", description: "Built-in gift card and loyalty program features to drive repeat business and increase ticket size.", category: "pos-systems", type: "pdf", url: "https://drive.google.com/file/d/1Y-QuyMP04A83tS7ONAgOCOioIPVf9_xC/view", thumbnailUrl: "", order: 15, featured: false, published: true, createdAt: now, updatedAt: now },
    { title: "RPOWER — Mobile POS Brochure", description: "Handheld and tablet POS solutions for tableside ordering, food trucks, and events.", category: "pos-systems", type: "pdf", url: "https://drive.google.com/file/d/1hz3ID7cvAyuStE5NTqvNJJnf-T2b5eP2/view", thumbnailUrl: "", order: 16, featured: false, published: true, createdAt: now, updatedAt: now },
    { title: "RPOWER — rPortal Reporting Brochure", description: "Cloud-based reporting portal — real-time sales data, labor costs, inventory tracking, and trend analysis.", category: "pos-systems", type: "pdf", url: "https://drive.google.com/file/d/1PieDCMCkzMXOJtTCudtEHiwYZwd2uwTh/view", thumbnailUrl: "", order: 17, featured: false, published: true, createdAt: now, updatedAt: now },

    // ─── CashSwipe Classroom Resources (Google Drive Folder 3) ─────
    { title: "CashSwipe Classroom — Resource 1", description: "Training resource from the CashSwipe Clients classroom. Open to view or download.", category: "classroom", type: "pdf", url: "https://drive.google.com/file/d/40b17cdff7c34417a62aea3ef08ea6ee021e1d59aad946a39f84685644c112b8/view", thumbnailUrl: "", order: 1, featured: false, published: true, createdAt: now, updatedAt: now },
    { title: "CashSwipe Classroom — Resource 2", description: "Training resource from the CashSwipe Clients classroom. Open to view or download.", category: "classroom", type: "pdf", url: "https://drive.google.com/file/d/43509cb0a8e74effb56b94de6c048ee83e886245aa6d4752b0a4a2f481e50ca2/view", thumbnailUrl: "", order: 2, featured: false, published: true, createdAt: now, updatedAt: now },
    { title: "CashSwipe Classroom — Resource 3", description: "Training resource from the CashSwipe Clients classroom. Open to view or download.", category: "classroom", type: "pdf", url: "https://drive.google.com/file/d/44e4254753364137b4c56a284a47670da60001a8f5d747fdba69841d6b31fc45/view", thumbnailUrl: "", order: 3, featured: false, published: true, createdAt: now, updatedAt: now },
    { title: "CashSwipe Classroom — Resource 4", description: "Training resource from the CashSwipe Clients classroom. Open to view or download.", category: "classroom", type: "pdf", url: "https://drive.google.com/file/d/6a5f297f7a18494fa7428e5989e0e0d4085cd388d7b9433db7a3eaa96eb1d2d1/view", thumbnailUrl: "", order: 4, featured: false, published: true, createdAt: now, updatedAt: now },
    { title: "CashSwipe Classroom — Resource 5", description: "Training resource from the CashSwipe Clients classroom. Open to view or download.", category: "classroom", type: "pdf", url: "https://drive.google.com/file/d/7db3d32d7890487db2eb4543eaaa0af91c439c2f9ef54672bbccf8dc3a23b838/view", thumbnailUrl: "", order: 5, featured: false, published: true, createdAt: now, updatedAt: now },
    { title: "CashSwipe Classroom — Resource 6", description: "Training resource from the CashSwipe Clients classroom. Open to view or download.", category: "classroom", type: "pdf", url: "https://drive.google.com/file/d/911a2f781ca04a089ac62a0ceb521cc5728491a7203a4d75865096504fd35748/view", thumbnailUrl: "", order: 6, featured: false, published: true, createdAt: now, updatedAt: now },
    { title: "CashSwipe Classroom — Resource 7", description: "Training resource from the CashSwipe Clients classroom. Open to view or download.", category: "classroom", type: "pdf", url: "https://drive.google.com/file/d/9f49a9a3f06746ab8689c0621ee88fd00cbd9226f49a46cb87c8c8b1f55b6f5e/view", thumbnailUrl: "", order: 7, featured: false, published: true, createdAt: now, updatedAt: now },
    { title: "CashSwipe Classroom — Resource 8", description: "Training resource from the CashSwipe Clients classroom. Open to view or download.", category: "classroom", type: "pdf", url: "https://drive.google.com/file/d/a4f414e1a8574a25a119d0cd6d473afc4a7144baa81246b881d9acfe053f48bd/view", thumbnailUrl: "", order: 8, featured: false, published: true, createdAt: now, updatedAt: now },
    { title: "CashSwipe Classroom — Resource 9", description: "Training resource from the CashSwipe Clients classroom. Open to view or download.", category: "classroom", type: "pdf", url: "https://drive.google.com/file/d/af99b60d316a4478b82ac7dcf82e9e390afafa5a28674da8954c29cde7578b92/view", thumbnailUrl: "", order: 9, featured: false, published: true, createdAt: now, updatedAt: now },
    { title: "CashSwipe Classroom — Resource 10", description: "Training resource from the CashSwipe Clients classroom. Open to view or download.", category: "classroom", type: "pdf", url: "https://drive.google.com/file/d/c7e5b4ad75174e7ba842475ec918f74af7fbdcdee49a433d8475faeb62ed3e39/view", thumbnailUrl: "", order: 10, featured: false, published: true, createdAt: now, updatedAt: now },
    { title: "CashSwipe Classroom — Resource 11", description: "Training resource from the CashSwipe Clients classroom. Open to view or download.", category: "classroom", type: "pdf", url: "https://drive.google.com/file/d/f45b9938f72e43728d17e430fefbb10b34abc190639f44e0aaf87393b1e4c9e0/view", thumbnailUrl: "", order: 11, featured: false, published: true, createdAt: now, updatedAt: now },
    { title: "CashSwipe Classroom — Resource 12", description: "Training resource from the CashSwipe Clients classroom. Open to view or download.", category: "classroom", type: "pdf", url: "https://drive.google.com/file/d/1RXWIWZQpVIUNfgu4clvn3M9T9XVkq1-r/view", thumbnailUrl: "", order: 12, featured: true, published: true, createdAt: now, updatedAt: now },
  ];
  await db.insert(schema.resources).values(
    items.map((item) => ({ id: randomUUID(), ...item }))
  );
}

// ─── Routes ────────────────────────────────────────────────────────

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // ─── Admin Auth ─────────────────────────────────────────────────

  app.post("/api/admin/login", async (req: Request, res: Response) => {
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
    sendSlackNotification(`New lead from website: ${parsed.data.businessName} (${parsed.data.contactName}) - ${parsed.data.email}`, "newLead");
    res.status(201).json(lead);
  });

  app.get("/api/contact-leads", requireAdminSession, async (_req: Request, res: Response) => {
    const contactLeadRows = await storage.getContactLeads();
    res.json(contactLeadRows);
  });

  // ─── Leads CRUD ─────────────────────────────────────────────────

  app.get("/api/leads", requireAdminSession, async (_req, res) => {
    const rows = await db.select().from(schema.leads);
    res.json(rows.map(deserializeLead));
  });

  app.post("/api/leads", requireAdminSession, async (req, res) => {
    const id = randomUUID();
    const now = new Date().toISOString();
    const [lead] = await db.insert(schema.leads).values({
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
      attachments: JSON.stringify(Array.isArray(req.body.attachments) ? req.body.attachments : []),
      notes: req.body.notes || "",
      createdAt: now,
      updatedAt: now,
    }).returning();
    logActivity("Lead Created", `${lead.business || lead.name}`, "lead");
    sendSlackNotification(`New lead added: ${lead.business || lead.name} (${lead.package})`, "newLead");
    res.status(201).json(deserializeLead(lead));
  });

  app.patch("/api/leads/:id", requireAdminSession, async (req, res) => {
    const body = { ...req.body };
    if (body.attachments) body.attachments = JSON.stringify(body.attachments);
    body.updatedAt = new Date().toISOString();
    const updateData = pickColumns(schema.leads, body);
    const [updated] = await db.update(schema.leads).set(updateData).where(eq(schema.leads.id, req.params.id as string)).returning();
    if (!updated) return res.status(404).json({ error: "Lead not found" });
    logActivity("Lead Updated", `${updated.business || updated.name} - ${updated.status}`, "lead");
    res.json(deserializeLead(updated));
  });

  app.delete("/api/leads/:id", requireAdminSession, async (req, res) => {
    const [deleted] = await db.delete(schema.leads).where(eq(schema.leads.id, req.params.id as string)).returning();
    if (deleted) logActivity("Lead Deleted", `${deleted.business || deleted.name}`, "lead");
    res.json({ success: true });
  });

  // ─── Clients CRUD ───────────────────────────────────────────────

  app.get("/api/clients", requireAdminSession, async (_req, res) => {
    const rows = await db.select().from(schema.clients);
    res.json(rows);
  });

  app.post("/api/clients", requireAdminSession, async (req, res) => {
    const id = randomUUID();
    const [client] = await db.insert(schema.clients).values({
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
    }).returning();
    logActivity("Client Added", `${client.business || client.name}`, "client");
    sendSlackNotification(`New client onboarded: ${client.business || client.name} (${client.package})`, "newClient");
    res.status(201).json(client);
  });

  app.patch("/api/clients/:id", requireAdminSession, async (req, res) => {
    const updateData = pickColumns(schema.clients, req.body);
    const [updated] = await db.update(schema.clients).set(updateData).where(eq(schema.clients.id, req.params.id as string)).returning();
    if (!updated) return res.status(404).json({ error: "Client not found" });
    logActivity("Client Updated", `${updated.business || updated.name}`, "client");
    res.json(updated);
  });

  app.delete("/api/clients/:id", requireAdminSession, async (req, res) => {
    const [deleted] = await db.delete(schema.clients).where(eq(schema.clients.id, req.params.id as string)).returning();
    if (deleted) logActivity("Client Removed", `${deleted.business || deleted.name}`, "client");
    res.json({ success: true });
  });

  // ─── Revenue CRUD ───────────────────────────────────────────────

  app.get("/api/revenue", requireAdminSession, async (_req, res) => {
    const rows = await db.select().from(schema.revenueEntries);
    res.json(rows);
  });

  app.post("/api/revenue", requireAdminSession, async (req, res) => {
    const id = randomUUID();
    const [entry] = await db.insert(schema.revenueEntries).values({
      id,
      date: req.body.date || new Date().toISOString().split("T")[0],
      type: req.body.type || "other",
      description: req.body.description || "",
      amount: req.body.amount || 0,
      clientId: req.body.clientId || "",
      recurring: req.body.recurring || false,
    }).returning();
    logActivity("Revenue Recorded", `$${entry.amount} - ${entry.type}`, "revenue");
    sendSlackNotification(`Revenue recorded: $${entry.amount} (${entry.type})`, "revenue");
    res.status(201).json(entry);
  });

  app.patch("/api/revenue/:id", requireAdminSession, async (req, res) => {
    const updateData = pickColumns(schema.revenueEntries, req.body);
    const [updated] = await db.update(schema.revenueEntries).set(updateData).where(eq(schema.revenueEntries.id, req.params.id as string)).returning();
    if (!updated) return res.status(404).json({ error: "Entry not found" });
    res.json(updated);
  });

  app.delete("/api/revenue/:id", requireAdminSession, async (req, res) => {
    await db.delete(schema.revenueEntries).where(eq(schema.revenueEntries.id, req.params.id as string));
    res.json({ success: true });
  });

  // ─── Tasks CRUD ─────────────────────────────────────────────────

  app.get("/api/tasks", requireAdminSession, async (_req, res) => {
    const rows = await db.select().from(schema.tasks);
    res.json(rows);
  });

  app.post("/api/tasks", requireAdminSession, async (req, res) => {
    const id = randomUUID();
    const [task] = await db.insert(schema.tasks).values({
      id,
      title: req.body.title || "",
      dueDate: req.body.dueDate || "",
      priority: req.body.priority || "medium",
      completed: req.body.completed || false,
      linkedTo: req.body.linkedTo || "",
      createdAt: new Date().toISOString(),
    }).returning();
    logActivity("Task Created", task.title, "task");
    res.status(201).json(task);
  });

  app.patch("/api/tasks/:id", requireAdminSession, async (req, res) => {
    const updateData = pickColumns(schema.tasks, req.body);
    const [updated] = await db.update(schema.tasks).set(updateData).where(eq(schema.tasks.id, req.params.id as string)).returning();
    if (!updated) return res.status(404).json({ error: "Task not found" });
    res.json(updated);
  });

  app.delete("/api/tasks/:id", requireAdminSession, async (req, res) => {
    await db.delete(schema.tasks).where(eq(schema.tasks.id, req.params.id as string));
    res.json({ success: true });
  });

  // ─── File Management ────────────────────────────────────────────

  app.get("/api/files", requireAdminSession, async (_req, res) => {
    const rows = await db.select().from(schema.adminFiles);
    res.json(rows);
  });

  app.post("/api/files", requireAdminSession, async (req, res) => {
    const id = randomUUID();
    const [file] = await db.insert(schema.adminFiles).values({
      id,
      name: req.body.name || "untitled",
      size: req.body.size || 0,
      type: req.body.type || "document",
      category: req.body.category || "general",
      uploadedAt: new Date().toISOString(),
      url: req.body.url || "",
    }).returning();
    logActivity("File Added", file.name, "file");
    res.status(201).json(file);
  });

  app.delete("/api/files/:id", requireAdminSession, async (req, res) => {
    const [deleted] = await db.delete(schema.adminFiles).where(eq(schema.adminFiles.id, req.params.id as string)).returning();
    if (deleted) logActivity("File Deleted", deleted.name, "file");
    res.json({ success: true });
  });

  // ─── Slack Integration ──────────────────────────────────────────

  app.get("/api/integrations/slack", requireAdminSession, async (_req, res) => {
    const [row] = await db.select().from(schema.slackConfig).where(eq(schema.slackConfig.id, "default"));
    if (!row) {
      return res.json({
        webhookUrl: "",
        channel: "#general",
        enabled: false,
        notifyNewLead: true,
        notifyNewClient: true,
        notifyRevenue: false,
        notifyTaskDue: true,
      });
    }
    const { id, ...config } = row;
    res.json(config);
  });

  app.patch("/api/integrations/slack", requireAdminSession, async (req, res) => {
    const updateData = pickColumns(schema.slackConfig, req.body);
    const [existing] = await db.select().from(schema.slackConfig).where(eq(schema.slackConfig.id, "default"));
    let row;
    if (existing) {
      [row] = await db.update(schema.slackConfig).set(updateData).where(eq(schema.slackConfig.id, "default")).returning();
    } else {
      [row] = await db.insert(schema.slackConfig).values({ id: "default", ...updateData } as any).returning();
    }
    const { id, ...config } = row;
    logActivity("Slack Config Updated", `Enabled: ${config.enabled}`, "integration");
    res.json(config);
  });

  app.post("/api/integrations/slack/test", requireAdminSession, async (_req, res) => {
    const [config] = await db.select().from(schema.slackConfig).where(eq(schema.slackConfig.id, "default"));
    if (!config || !config.webhookUrl) {
      return res.status(400).json({ error: "No webhook URL configured" });
    }
    try {
      await fetch(config.webhookUrl, {
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

  app.get("/api/integrations", requireAdminSession, async (_req, res) => {
    const rows = await db.select().from(schema.integrations);
    res.json(rows.map(deserializeIntegration));
  });

  app.post("/api/integrations", requireAdminSession, async (req, res) => {
    const id = randomUUID();
    const [integration] = await db.insert(schema.integrations).values({
      id,
      name: req.body.name || "",
      type: req.body.type || "webhook",
      enabled: req.body.enabled ?? false,
      config: JSON.stringify(req.body.config || {}),
      lastSync: new Date().toISOString(),
    }).returning();
    logActivity("Integration Added", integration.name, "integration");
    res.status(201).json(deserializeIntegration(integration));
  });

  app.patch("/api/integrations/:id", requireAdminSession, async (req, res) => {
    const body = { ...req.body };
    if (body.config) body.config = JSON.stringify(body.config);
    body.lastSync = new Date().toISOString();
    const updateData = pickColumns(schema.integrations, body);
    const [updated] = await db.update(schema.integrations).set(updateData).where(eq(schema.integrations.id, req.params.id as string)).returning();
    if (!updated) return res.status(404).json({ error: "Integration not found" });
    res.json(deserializeIntegration(updated));
  });

  app.delete("/api/integrations/:id", requireAdminSession, async (req, res) => {
    await db.delete(schema.integrations).where(eq(schema.integrations.id, req.params.id as string));
    res.json({ success: true });
  });

  // ─── Activity Log ───────────────────────────────────────────────

  app.get("/api/activity", requireAdminSession, async (_req, res) => {
    const rows = await db.select().from(schema.activityLog).orderBy(desc(schema.activityLog.timestamp)).limit(50);
    res.json(rows);
  });

  // ─── Referral Partners ─────────────────────────────────────────

  app.get("/api/referral-partners", requireAdminSession, async (_req, res) => {
    const rows = await db.select().from(schema.referralPartners);
    res.json(rows);
  });

  app.post("/api/referral-partners", requireAdminSession, async (req, res) => {
    const id = randomUUID();
    const [partner] = await db.insert(schema.referralPartners).values({
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
    }).returning();
    logActivity("Partner Added", partner.name, "lead");
    res.status(201).json(partner);
  });

  app.patch("/api/referral-partners/:id", requireAdminSession, async (req, res) => {
    const updateData = pickColumns(schema.referralPartners, req.body);
    const [updated] = await db.update(schema.referralPartners).set(updateData).where(eq(schema.referralPartners.id, req.params.id as string)).returning();
    if (!updated) return res.status(404).json({ error: "Partner not found" });
    res.json(updated);
  });

  app.delete("/api/referral-partners/:id", requireAdminSession, async (req, res) => {
    await db.delete(schema.referralPartners).where(eq(schema.referralPartners.id, req.params.id as string));
    res.json({ success: true });
  });

  // ─── Playbook Checklists ─────────────────────────────────────────

  app.get("/api/playbook-checks", requireAdminSession, async (_req, res) => {
    const rows = await db.select().from(schema.playbookChecks);
    res.json(rows);
  });

  app.post("/api/playbook-checks", requireAdminSession, async (req, res) => {
    const id = req.body.id || randomUUID();
    const [item] = await db.insert(schema.playbookChecks).values({
      id,
      channel: req.body.channel || "",
      label: req.body.label || "",
      completed: req.body.completed || false,
      completedAt: req.body.completed ? new Date().toISOString() : "",
    }).returning();
    res.status(201).json(item);
  });

  app.patch("/api/playbook-checks/:id", requireAdminSession, async (req, res) => {
    const body = { ...req.body };
    if (body.completed === true) body.completedAt = new Date().toISOString();
    if (body.completed === false) body.completedAt = "";
    const updateData = pickColumns(schema.playbookChecks, body);
    const [updated] = await db.update(schema.playbookChecks).set(updateData).where(eq(schema.playbookChecks.id, req.params.id as string)).returning();
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  });

  // ─── Weekly KPIs ─────────────────────────────────────────────────

  app.get("/api/kpis", requireAdminSession, async (_req, res) => {
    const rows = await db.select().from(schema.weeklyKpis);
    res.json(rows);
  });

  app.post("/api/kpis", requireAdminSession, async (req, res) => {
    const id = randomUUID();
    const [kpi] = await db.insert(schema.weeklyKpis).values({
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
    }).returning();
    logActivity("KPI Logged", `Week of ${kpi.weekStart}`, "task");
    res.status(201).json(kpi);
  });

  app.patch("/api/kpis/:id", requireAdminSession, async (req, res) => {
    const updateData = pickColumns(schema.weeklyKpis, req.body);
    const [updated] = await db.update(schema.weeklyKpis).set(updateData).where(eq(schema.weeklyKpis.id, req.params.id as string)).returning();
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  });

  app.delete("/api/kpis/:id", requireAdminSession, async (req, res) => {
    await db.delete(schema.weeklyKpis).where(eq(schema.weeklyKpis.id, req.params.id as string));
    res.json({ success: true });
  });

  // ─── 90-Day Plan Items ───────────────────────────────────────────

  app.get("/api/plan-items", requireAdminSession, async (_req, res) => {
    await seedPlanIfNeeded();
    const rows = await db.select().from(schema.planItems).orderBy(asc(schema.planItems.order));
    res.json(rows);
  });

  app.post("/api/plan-items", requireAdminSession, async (req, res) => {
    const id = randomUUID();
    const allItems = await db.select({ id: schema.planItems.id }).from(schema.planItems);
    const [item] = await db.insert(schema.planItems).values({
      id,
      phase: req.body.phase || 1,
      weekRange: req.body.weekRange || "1-2",
      title: req.body.title || "",
      description: req.body.description || "",
      completed: false,
      completedAt: "",
      order: req.body.order || allItems.length + 1,
    }).returning();
    res.status(201).json(item);
  });

  app.patch("/api/plan-items/:id", requireAdminSession, async (req, res) => {
    const body = { ...req.body };
    if (body.completed === true && !body.completedAt) body.completedAt = new Date().toISOString();
    if (body.completed === false) body.completedAt = "";
    const updateData = pickColumns(schema.planItems, body);
    const [updated] = await db.update(schema.planItems).set(updateData).where(eq(schema.planItems.id, req.params.id as string)).returning();
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  });

  app.delete("/api/plan-items/:id", requireAdminSession, async (req, res) => {
    await db.delete(schema.planItems).where(eq(schema.planItems.id, req.params.id as string));
    res.json({ success: true });
  });

  // ─── Materials Checklist ─────────────────────────────────────────

  app.get("/api/materials", requireAdminSession, async (_req, res) => {
    await seedMaterialsIfNeeded();
    const rows = await db.select().from(schema.materials);
    res.json(rows);
  });

  app.post("/api/materials", requireAdminSession, async (req, res) => {
    const id = randomUUID();
    const [item] = await db.insert(schema.materials).values({
      id,
      category: req.body.category || "sales",
      name: req.body.name || "",
      description: req.body.description || "",
      status: req.body.status || "not-started",
      fileUrl: req.body.fileUrl || "",
      updatedAt: new Date().toISOString(),
    }).returning();
    res.status(201).json(item);
  });

  app.patch("/api/materials/:id", requireAdminSession, async (req, res) => {
    const body = { ...req.body, updatedAt: new Date().toISOString() };
    const updateData = pickColumns(schema.materials, body);
    const [updated] = await db.update(schema.materials).set(updateData).where(eq(schema.materials.id, req.params.id as string)).returning();
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  });

  // ─── Scorecard Metrics (Computed) ────────────────────────────────

  app.get("/api/metrics/scorecard", requireAdminSession, async (_req, res) => {
    const allLeads = (await db.select().from(schema.leads)).map(deserializeLead);
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

  // ─── Resources (Public + Admin CRUD) ────────────────────────────

  app.get("/api/resources", async (_req, res) => {
    await seedResourcesIfNeeded();
    const rows = await db.select().from(schema.resources).orderBy(asc(schema.resources.order));
    const published = rows.filter((r) => r.published);
    res.json(published);
  });

  app.get("/api/resources/all", requireAdminSession, async (_req, res) => {
    await seedResourcesIfNeeded();
    const rows = await db.select().from(schema.resources).orderBy(asc(schema.resources.order));
    res.json(rows);
  });

  app.post("/api/resources", requireAdminSession, async (req, res) => {
    const id = randomUUID();
    const now = new Date().toISOString();
    const allResources = await db.select({ id: schema.resources.id }).from(schema.resources);
    const [resource] = await db.insert(schema.resources).values({
      id,
      title: req.body.title || "",
      description: req.body.description || "",
      category: req.body.category || "getting-started",
      type: req.body.type || "doc",
      url: req.body.url || "",
      thumbnailUrl: req.body.thumbnailUrl || "",
      order: req.body.order || allResources.length + 1,
      featured: req.body.featured || false,
      published: req.body.published !== false,
      createdAt: now,
      updatedAt: now,
    }).returning();
    logActivity("Resource Added", resource.title, "file");
    res.status(201).json(resource);
  });

  app.patch("/api/resources/:id", requireAdminSession, async (req, res) => {
    const body = { ...req.body, updatedAt: new Date().toISOString() };
    const updateData = pickColumns(schema.resources, body);
    const [updated] = await db.update(schema.resources).set(updateData).where(eq(schema.resources.id, req.params.id as string)).returning();
    if (!updated) return res.status(404).json({ error: "Resource not found" });
    logActivity("Resource Updated", updated.title, "file");
    res.json(updated);
  });

  app.delete("/api/resources/:id", requireAdminSession, async (req, res) => {
    const [deleted] = await db.delete(schema.resources).where(eq(schema.resources.id, req.params.id as string)).returning();
    if (deleted) logActivity("Resource Deleted", deleted.title, "file");
    res.json({ success: true });
  });

  // ─── Dashboard Stats ───────────────────────────────────────────

  app.get("/api/dashboard/stats", requireAdminSession, async (_req, res) => {
    const contactLeadRows = await storage.getContactLeads();
    const allLeads = await db.select().from(schema.leads);
    const allClients = await db.select().from(schema.clients);
    const allRevenue = await db.select().from(schema.revenueEntries);
    const allTasks = await db.select().from(schema.tasks);
    const allFiles = await db.select({ id: schema.adminFiles.id }).from(schema.adminFiles);
    const allIntegrations = await db.select({ id: schema.integrations.id }).from(schema.integrations);
    const [slackRow] = await db.select().from(schema.slackConfig).where(eq(schema.slackConfig.id, "default"));

    const now = new Date();
    const thisMonthRevenue = allRevenue
      .filter((r) => {
        const d = new Date(r.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .reduce((sum, r) => sum + r.amount, 0);

    const mrr = allClients.reduce((sum, c) => {
      const prices: Record<string, number> = { none: 0, basic: 99, pro: 199, premium: 399 };
      return sum + (prices[c.maintenance] || 0);
    }, 0);

    res.json({
      totalLeads: allLeads.length,
      activeLeads: allLeads.filter((l) => !["won", "lost"].includes(l.status)).length,
      totalClients: allClients.length,
      websitesLive: allClients.filter((c) => c.websiteStatus === "live").length,
      thisMonthRevenue,
      mrr,
      pendingTasks: allTasks.filter((t) => !t.completed).length,
      overdueTasks: allTasks.filter((t) => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()).length,
      contactFormLeads: contactLeadRows.length,
      totalFiles: allFiles.length,
      slackEnabled: slackRow?.enabled || false,
      integrationsCount: allIntegrations.length,
    });
  });

  return httpServer;
}
