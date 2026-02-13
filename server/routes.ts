import type { Express, Request, Response, NextFunction } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { updateAiConfigSchema, insertContactLeadSchema } from "@shared/schema";
import * as schema from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, getTableColumns } from "drizzle-orm";
import Anthropic from "@anthropic-ai/sdk";
import { randomUUID, scryptSync, randomBytes, timingSafeEqual } from "crypto";
import rateLimit from "express-rate-limit";
import { sendEmail, sendContactFormConfirmation, sendOutreachEmail, generateOutreachEmail, generateCallScript, handleInboundEmail } from "./email";

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
  let attachments: any[] = [];
  try { attachments = JSON.parse(row.attachments || "[]"); } catch {}
  return { ...row, attachments };
}

function deserializeIntegration(row: typeof schema.integrations.$inferSelect) {
  let config: Record<string, any> = {};
  try { config = JSON.parse(row.config || "{}"); } catch {}
  return { ...row, config };
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
    // 2 Presentations (named files)
    { title: "5 Powerful Icebreakers to Start Conversations with Merchants", description: "PowerPoint presentation with proven icebreaker techniques for engaging merchants in sales conversations. Essential training for new reps.", category: "classroom", type: "doc", url: "https://drive.google.com/file/d/1RauUWaVTQf_7HqYKOMhv6zkDrlqPPlrg/view", thumbnailUrl: "", order: 1, featured: true, published: true, createdAt: now, updatedAt: now },
    { title: "Understanding Your Merchant Statement", description: "PowerPoint guide to reading and analyzing merchant processing statements. Key skill for identifying savings opportunities during sales.", category: "classroom", type: "doc", url: "https://drive.google.com/file/d/1w7XMTJYzFiyDYksrzA7jamk_8GlpiYcE/view", thumbnailUrl: "", order: 2, featured: true, published: true, createdAt: now, updatedAt: now },
    // 34 Training PDFs from CashSwipe classroom
    { title: "CashSwipe Training — Module 1", description: "Training PDF from the CashSwipe Clients classroom. Open in Google Drive to view or download.", category: "classroom", type: "pdf", url: "https://drive.google.com/file/d/1Us7dWmw7CYhfMP1U2q27n0scmj0Av9Pm/view", thumbnailUrl: "", order: 3, featured: false, published: true, createdAt: now, updatedAt: now },
    { title: "CashSwipe Training — Module 2", description: "Training PDF from the CashSwipe Clients classroom. Open in Google Drive to view or download.", category: "classroom", type: "pdf", url: "https://drive.google.com/file/d/1BXTK7aTZCW9_fhOJu8KlaeVtR1IDvmUq/view", thumbnailUrl: "", order: 4, featured: false, published: true, createdAt: now, updatedAt: now },
    { title: "CashSwipe Training — Module 3", description: "Training PDF from the CashSwipe Clients classroom. Open in Google Drive to view or download.", category: "classroom", type: "pdf", url: "https://drive.google.com/file/d/1l3t7yW1_5oeit0aIZIjCskql3C94Yfa1/view", thumbnailUrl: "", order: 5, featured: false, published: true, createdAt: now, updatedAt: now },
    { title: "CashSwipe Training — Module 4", description: "Training PDF from the CashSwipe Clients classroom. Open in Google Drive to view or download.", category: "classroom", type: "pdf", url: "https://drive.google.com/file/d/1TOCLzJh0dg7c181kvo1qUU_okOu1ZfbZ/view", thumbnailUrl: "", order: 6, featured: false, published: true, createdAt: now, updatedAt: now },
    { title: "CashSwipe Training — Module 5", description: "Training PDF from the CashSwipe Clients classroom. Open in Google Drive to view or download.", category: "classroom", type: "pdf", url: "https://drive.google.com/file/d/1cGqO1QvA_vuATHvsCtJc6r_1fouwh7No/view", thumbnailUrl: "", order: 7, featured: false, published: true, createdAt: now, updatedAt: now },
    { title: "CashSwipe Training — Module 6", description: "Training PDF from the CashSwipe Clients classroom. Open in Google Drive to view or download.", category: "classroom", type: "pdf", url: "https://drive.google.com/file/d/12-PUec5esxoFjXPsL8oypOe3OuwRWO6D/view", thumbnailUrl: "", order: 8, featured: false, published: true, createdAt: now, updatedAt: now },
    { title: "CashSwipe Training — Module 7", description: "Training PDF from the CashSwipe Clients classroom. Open in Google Drive to view or download.", category: "classroom", type: "pdf", url: "https://drive.google.com/file/d/1Rzj3ZETBB6MHCHFaFQ0AjcIHURosoyhS/view", thumbnailUrl: "", order: 9, featured: false, published: true, createdAt: now, updatedAt: now },
    { title: "CashSwipe Training — Module 8", description: "Training PDF from the CashSwipe Clients classroom. Open in Google Drive to view or download.", category: "classroom", type: "pdf", url: "https://drive.google.com/file/d/1fogX8lg-UuLfFrQzUR9QEouQVif6R5mQ/view", thumbnailUrl: "", order: 10, featured: false, published: true, createdAt: now, updatedAt: now },
    { title: "CashSwipe Training — Module 9", description: "Training PDF from the CashSwipe Clients classroom. Open in Google Drive to view or download.", category: "classroom", type: "pdf", url: "https://drive.google.com/file/d/12A1fXMG8v9HQpI2r98rCHOmebrXbZRqa/view", thumbnailUrl: "", order: 11, featured: false, published: true, createdAt: now, updatedAt: now },
    { title: "CashSwipe Training — Module 10", description: "Training PDF from the CashSwipe Clients classroom. Open in Google Drive to view or download.", category: "classroom", type: "pdf", url: "https://drive.google.com/file/d/1DCNp6oxvbms0PE5PDoEHWLcHzw-IwkyF/view", thumbnailUrl: "", order: 12, featured: false, published: true, createdAt: now, updatedAt: now },
    { title: "CashSwipe Training — Module 11", description: "Training PDF from the CashSwipe Clients classroom. Open in Google Drive to view or download.", category: "classroom", type: "pdf", url: "https://drive.google.com/file/d/1q8QZC5LQ_3AieouFfvGmvqtFTk6_knGt/view", thumbnailUrl: "", order: 13, featured: false, published: true, createdAt: now, updatedAt: now },
    { title: "CashSwipe Training — Module 12", description: "Training PDF from the CashSwipe Clients classroom. Open in Google Drive to view or download.", category: "classroom", type: "pdf", url: "https://drive.google.com/file/d/1uVFKc4ClEk5tLwx74Xx0QIiqb-pgt-xj/view", thumbnailUrl: "", order: 14, featured: false, published: true, createdAt: now, updatedAt: now },
    { title: "CashSwipe Training — Module 13", description: "Training PDF from the CashSwipe Clients classroom. Open in Google Drive to view or download.", category: "classroom", type: "pdf", url: "https://drive.google.com/file/d/1rEiOFLa2HtRlqa8ndbBmPPBthhdmLs_w/view", thumbnailUrl: "", order: 15, featured: false, published: true, createdAt: now, updatedAt: now },
    { title: "CashSwipe Training — Module 14", description: "Training PDF from the CashSwipe Clients classroom. Open in Google Drive to view or download.", category: "classroom", type: "pdf", url: "https://drive.google.com/file/d/1ODZ93kA7ieOWRVX3GfQqM334lrx4olgX/view", thumbnailUrl: "", order: 16, featured: false, published: true, createdAt: now, updatedAt: now },
    { title: "CashSwipe Training — Module 15", description: "Training PDF from the CashSwipe Clients classroom. Open in Google Drive to view or download.", category: "classroom", type: "pdf", url: "https://drive.google.com/file/d/14vTjgJb9sJnQbiMM4Tlk6WF4lj0Lc8sF/view", thumbnailUrl: "", order: 17, featured: false, published: true, createdAt: now, updatedAt: now },
    { title: "CashSwipe Training — Module 16", description: "Training PDF from the CashSwipe Clients classroom. Open in Google Drive to view or download.", category: "classroom", type: "pdf", url: "https://drive.google.com/file/d/1KcfNeHvEqFGX0pGW1aT9ZLCuHtCNGjN4/view", thumbnailUrl: "", order: 18, featured: false, published: true, createdAt: now, updatedAt: now },
    { title: "CashSwipe Training — Module 17", description: "Training PDF from the CashSwipe Clients classroom. Open in Google Drive to view or download.", category: "classroom", type: "pdf", url: "https://drive.google.com/file/d/1sxkGBGDxc7wMjHgMG4vF0H8eDalngZcX/view", thumbnailUrl: "", order: 19, featured: false, published: true, createdAt: now, updatedAt: now },
    { title: "CashSwipe Training — Module 18", description: "Training PDF from the CashSwipe Clients classroom. Open in Google Drive to view or download.", category: "classroom", type: "pdf", url: "https://drive.google.com/file/d/1RXWIWZQpVIUNfgu4clvn3M9T9XVkq1-r/view", thumbnailUrl: "", order: 20, featured: true, published: true, createdAt: now, updatedAt: now },
    { title: "CashSwipe Training — Module 19", description: "Training PDF from the CashSwipe Clients classroom. Open in Google Drive to view or download.", category: "classroom", type: "pdf", url: "https://drive.google.com/file/d/1UFZ9ApuUcSJbNpq33jbNSSDwsmygWH_k/view", thumbnailUrl: "", order: 21, featured: false, published: true, createdAt: now, updatedAt: now },
    { title: "CashSwipe Training — Module 20", description: "Training PDF from the CashSwipe Clients classroom. Open in Google Drive to view or download.", category: "classroom", type: "pdf", url: "https://drive.google.com/file/d/1cYvt5iNHSRFpRa3AWurxHCD8WIsZ3-Av/view", thumbnailUrl: "", order: 22, featured: false, published: true, createdAt: now, updatedAt: now },
    { title: "CashSwipe Training — Module 21", description: "Training PDF from the CashSwipe Clients classroom. Open in Google Drive to view or download.", category: "classroom", type: "pdf", url: "https://drive.google.com/file/d/1JIKQLLnCPO2s6PYB3HpCaoCzjRqI9ty-/view", thumbnailUrl: "", order: 23, featured: false, published: true, createdAt: now, updatedAt: now },
    { title: "CashSwipe Training — Module 22", description: "Training PDF from the CashSwipe Clients classroom. Open in Google Drive to view or download.", category: "classroom", type: "pdf", url: "https://drive.google.com/file/d/131x-bp7IkvAmn6-hxqz7W9ykNAIGajxa/view", thumbnailUrl: "", order: 24, featured: false, published: true, createdAt: now, updatedAt: now },
    { title: "CashSwipe Training — Module 23", description: "Training PDF from the CashSwipe Clients classroom. Open in Google Drive to view or download.", category: "classroom", type: "pdf", url: "https://drive.google.com/file/d/1gxUzlw3WdBRgh9x5rOS_bsJHXTVabbza/view", thumbnailUrl: "", order: 25, featured: false, published: true, createdAt: now, updatedAt: now },
    { title: "CashSwipe Training — Module 24", description: "Training PDF from the CashSwipe Clients classroom. Open in Google Drive to view or download.", category: "classroom", type: "pdf", url: "https://drive.google.com/file/d/1RPI5e7V-OLV4Sh8lGPDT0fGXUS-zXzdc/view", thumbnailUrl: "", order: 26, featured: false, published: true, createdAt: now, updatedAt: now },
    { title: "CashSwipe Training — Module 25", description: "Training PDF from the CashSwipe Clients classroom. Open in Google Drive to view or download.", category: "classroom", type: "pdf", url: "https://drive.google.com/file/d/1TMRzlQ8XQYTEkeSTGTsX0JCG1pmlyukv/view", thumbnailUrl: "", order: 27, featured: false, published: true, createdAt: now, updatedAt: now },
    { title: "CashSwipe Training — Module 26", description: "Training PDF from the CashSwipe Clients classroom. Open in Google Drive to view or download.", category: "classroom", type: "pdf", url: "https://drive.google.com/file/d/1q81ISq3PVU6O1CG1NiJvdSRGLL_bjnES/view", thumbnailUrl: "", order: 28, featured: false, published: true, createdAt: now, updatedAt: now },
    { title: "CashSwipe Training — Module 27", description: "Training PDF from the CashSwipe Clients classroom. Open in Google Drive to view or download.", category: "classroom", type: "pdf", url: "https://drive.google.com/file/d/1IfCuI7DdA57VXyJhQCRYZZuWyM9wyYXo/view", thumbnailUrl: "", order: 29, featured: false, published: true, createdAt: now, updatedAt: now },
    { title: "CashSwipe Training — Module 28", description: "Training PDF from the CashSwipe Clients classroom. Open in Google Drive to view or download.", category: "classroom", type: "pdf", url: "https://drive.google.com/file/d/1Y9ynOphu3AqU1oP2A_ET8uQ3ptqWjyAG/view", thumbnailUrl: "", order: 30, featured: false, published: true, createdAt: now, updatedAt: now },
    { title: "CashSwipe Training — Module 29", description: "Training PDF from the CashSwipe Clients classroom. Open in Google Drive to view or download.", category: "classroom", type: "pdf", url: "https://drive.google.com/file/d/1uJVDvzBno4PMfuDiHRLxhi37k1pc3Vob/view", thumbnailUrl: "", order: 31, featured: false, published: true, createdAt: now, updatedAt: now },
    { title: "CashSwipe Training — Module 30", description: "Training PDF from the CashSwipe Clients classroom. Open in Google Drive to view or download.", category: "classroom", type: "pdf", url: "https://drive.google.com/file/d/1rz3r6kW_qUMmliR0YVJeDSV5Mtv6i2cI/view", thumbnailUrl: "", order: 32, featured: false, published: true, createdAt: now, updatedAt: now },
    { title: "CashSwipe Training — Module 31", description: "Training PDF from the CashSwipe Clients classroom. Open in Google Drive to view or download.", category: "classroom", type: "pdf", url: "https://drive.google.com/file/d/1i_Z2X6cDgr4WB9lxVzMHYXjNguxGj0PH/view", thumbnailUrl: "", order: 33, featured: false, published: true, createdAt: now, updatedAt: now },
    { title: "CashSwipe Training — Module 32", description: "Training PDF from the CashSwipe Clients classroom. Open in Google Drive to view or download.", category: "classroom", type: "pdf", url: "https://drive.google.com/file/d/1BXgkwLkdL0_hCBUWLaF4OFRKoBQJIUT7/view", thumbnailUrl: "", order: 34, featured: false, published: true, createdAt: now, updatedAt: now },
    { title: "CashSwipe Training — Module 33", description: "Training PDF from the CashSwipe Clients classroom. Open in Google Drive to view or download.", category: "classroom", type: "pdf", url: "https://drive.google.com/file/d/1qcBAyga_1BD7JfgGuHY-TojajCbU61X_/view", thumbnailUrl: "", order: 35, featured: false, published: true, createdAt: now, updatedAt: now },
    { title: "CashSwipe Training — Module 34", description: "Training PDF from the CashSwipe Clients classroom. Open in Google Drive to view or download.", category: "classroom", type: "pdf", url: "https://drive.google.com/file/d/1fS3MOxhZ61agT64OQUgCHe6bV7IPtm3Y/view", thumbnailUrl: "", order: 36, featured: false, published: true, createdAt: now, updatedAt: now },
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

  // ─── Rate Limiters ────────────────────────────────────────────
  const chatLimiter = rateLimit({
    windowMs: 60 * 1000,   // 1 minute
    max: 10,               // 10 requests per minute per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests. Please wait a moment." },
  });

  const publicLeadLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,                // 5 submissions per minute per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many submissions. Please try again shortly." },
  });

  // ─── Password helpers ────────────────────────────────────────────

  function hashPassword(password: string): string {
    const salt = randomBytes(16).toString("hex");
    const hash = scryptSync(password, salt, 64).toString("hex");
    return `${salt}:${hash}`;
  }

  function verifyPassword(password: string, stored: string): boolean {
    const [salt, hash] = stored.split(":");
    if (!salt || !hash) return false;
    const hashBuf = Buffer.from(hash, "hex");
    const supplied = scryptSync(password, salt, 64);
    return timingSafeEqual(hashBuf, supplied);
  }

  async function getAdminSettings() {
    const rows = await db.select().from(schema.adminSettings).limit(1);
    return rows[0] || null;
  }

  // ─── Admin Auth ─────────────────────────────────────────────────

  // Check if first-time setup is needed (no password stored yet)
  app.get("/api/admin/setup-status", async (_req: Request, res: Response) => {
    try {
      const settings = await getAdminSettings();
      const needsSetup = !settings || !settings.passwordHash;
      return res.json({ needsSetup });
    } catch {
      // Table may not exist yet — treat as needs setup
      return res.json({ needsSetup: true });
    }
  });

  // Auto-create admin_settings table if it doesn't exist
  async function ensureAdminSettingsTable() {
    await db.execute(
      `CREATE TABLE IF NOT EXISTS admin_settings (
        id TEXT PRIMARY KEY DEFAULT 'default',
        password_hash TEXT NOT NULL DEFAULT '',
        updated_at TEXT NOT NULL
      )`
    );
  }

  // First-time password setup
  app.post("/api/admin/setup", async (req: Request, res: Response) => {
    await ensureAdminSettingsTable();
    const settings = await getAdminSettings();
    if (settings && settings.passwordHash) {
      return res.status(400).json({ error: "Password already configured. Use change-password instead." });
    }
    const { password } = req.body;
    if (!password || typeof password !== "string" || password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters." });
    }
    const now = new Date().toISOString();
    const passwordHash = hashPassword(password);
    await db.insert(schema.adminSettings).values({ id: "default", passwordHash, updatedAt: now })
      .onConflictDoUpdate({ target: schema.adminSettings.id, set: { passwordHash, updatedAt: now } });
    req.session.isAdmin = true;
    logActivity("Setup", "Admin password created", "auth");
    return res.json({ success: true });
  });

  app.post("/api/admin/login", async (req: Request, res: Response) => {
    const { password } = req.body;
    const settings = await getAdminSettings();

    // If a stored password exists, verify against it
    if (settings && settings.passwordHash) {
      if (verifyPassword(password, settings.passwordHash)) {
        req.session.isAdmin = true;
        logActivity("Login", "Admin logged in", "auth");
        return res.json({ success: true });
      }
      return res.status(401).json({ error: "Invalid password." });
    }

    // Fallback to SESSION_SECRET for backwards compatibility (before first setup)
    const envPassword = process.env.SESSION_SECRET || "techsavvy-dev-secret";
    if (password === envPassword) {
      req.session.isAdmin = true;
      logActivity("Login", "Admin logged in (env fallback)", "auth");
      return res.json({ success: true });
    }
    return res.status(401).json({ error: "Invalid password." });
  });

  // Change password (requires current session)
  app.post("/api/admin/change-password", requireAdminSession, async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    if (!newPassword || typeof newPassword !== "string" || newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters." });
    }
    const settings = await getAdminSettings();

    // Verify the current password
    if (settings && settings.passwordHash) {
      if (!verifyPassword(currentPassword, settings.passwordHash)) {
        return res.status(401).json({ error: "Current password is incorrect." });
      }
    } else {
      // No stored password yet — verify against env fallback
      const envPassword = process.env.SESSION_SECRET || "techsavvy-dev-secret";
      if (currentPassword !== envPassword) {
        return res.status(401).json({ error: "Current password is incorrect." });
      }
    }

    const now = new Date().toISOString();
    const passwordHash = hashPassword(newPassword);
    await db.insert(schema.adminSettings).values({ id: "default", passwordHash, updatedAt: now })
      .onConflictDoUpdate({ target: schema.adminSettings.id, set: { passwordHash, updatedAt: now } });
    logActivity("Security", "Admin password changed", "auth");
    return res.json({ success: true });
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

  app.post("/api/chat", chatLimiter, async (req, res) => {
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
    // Send auto-confirmation email
    sendContactFormConfirmation(parsed.data.contactName, parsed.data.email, parsed.data.businessName).catch(err => console.error("Auto-confirm failed:", err));
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

  // Public lead creation from website contact form (no auth required)
  app.post("/api/leads/public", publicLeadLimiter, async (req, res) => {
    const id = randomUUID();
    const now = new Date().toISOString();
    const [lead] = await db.insert(schema.leads).values({
      id,
      name: req.body.name || "",
      business: req.body.business || "",
      phone: req.body.phone || "",
      email: req.body.email || "",
      package: req.body.package || "terminal",
      status: "new",
      source: "lead-magnet",
      notes: req.body.notes || "",
      attachments: "[]",
      createdAt: now,
      updatedAt: now,
    }).returning();
    logActivity("Website Lead", `${lead.business || lead.name} submitted contact form`, "lead");
    sendSlackNotification(`New lead from website: ${lead.business || lead.name} (${lead.email})`, "newLead");
    res.status(201).json({ success: true });
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
    const published = await db.select().from(schema.resources)
      .where(eq(schema.resources.published, true))
      .orderBy(asc(schema.resources.order));
    res.set("Cache-Control", "public, max-age=300, stale-while-revalidate=60");
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
      category: req.body.category || "classroom",
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

  // Re-seed resources (admin only) — clears table and re-inserts default Drive files
  app.post("/api/resources/reseed", requireAdminSession, async (_req, res) => {
    await db.delete(schema.resources);
    resourcesSeeded = false;
    await seedResourcesIfNeeded();
    const rows = await db.select().from(schema.resources).orderBy(asc(schema.resources.order));
    logActivity("Resources Re-seeded", `${rows.length} resources loaded`, "file");
    res.json({ success: true, count: rows.length });
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

  // ─── Team Members CRUD ───────────────────────────────────────────

  let teamSeeded = false;
  async function seedTeamIfNeeded() {
    if (teamSeeded) return;
    teamSeeded = true;
    const existing = await db.select({ id: schema.teamMembers.id }).from(schema.teamMembers).limit(1);
    if (existing.length > 0) return;
    const now = new Date().toISOString();
    await db.insert(schema.teamMembers).values([
      { id: randomUUID(), name: "Aaron", role: "Investor & Financial Backer", email: "", phone: "", status: "active", dailyInvolvement: "minimal", joinedAt: now },
      { id: randomUUID(), name: "Joey", role: "Business Operations & Legal (EIN, compliance, registration)", email: "", phone: "", status: "active", dailyInvolvement: "part-time", joinedAt: now },
      { id: randomUUID(), name: "Kepa", role: "Lead Sales & CashSwipe Point of Contact", email: "", phone: "", status: "active", dailyInvolvement: "full", joinedAt: now },
      { id: randomUUID(), name: "Jessica", role: "CRM Development, Website, & Marketing Materials", email: "", phone: "", status: "active", dailyInvolvement: "full", joinedAt: now },
    ]);
  }

  app.get("/api/team-members", requireAdminSession, async (_req, res) => {
    await seedTeamIfNeeded();
    const rows = await db.select().from(schema.teamMembers);
    res.json(rows);
  });

  app.post("/api/team-members", requireAdminSession, async (req, res) => {
    const id = randomUUID();
    const [member] = await db.insert(schema.teamMembers).values({
      id,
      name: req.body.name || "",
      role: req.body.role || "",
      email: req.body.email || "",
      phone: req.body.phone || "",
      status: req.body.status || "active",
      dailyInvolvement: req.body.dailyInvolvement || "full",
      joinedAt: new Date().toISOString(),
    }).returning();
    logActivity("Team Member Added", member.name, "client");
    res.status(201).json(member);
  });

  app.patch("/api/team-members/:id", requireAdminSession, async (req, res) => {
    const updateData = pickColumns(schema.teamMembers, req.body);
    const [updated] = await db.update(schema.teamMembers).set(updateData).where(eq(schema.teamMembers.id, req.params.id as string)).returning();
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  });

  app.delete("/api/team-members/:id", requireAdminSession, async (req, res) => {
    await db.delete(schema.teamMembers).where(eq(schema.teamMembers.id, req.params.id as string));
    res.json({ success: true });
  });

  // ─── Business Info (singleton) ──────────────────────────────────

  app.get("/api/business-info", requireAdminSession, async (_req, res) => {
    const [row] = await db.select().from(schema.businessInfo).where(eq(schema.businessInfo.id, "default"));
    if (!row) {
      return res.json({
        companyName: "", dba: "", phone: "", email: "", address: "",
        website: "", taxId: "", bankPartner: "", processorPartner: "CashSwipe",
        currentPhase: "onboarding", notes: "", updatedAt: new Date().toISOString(),
      });
    }
    const { id, ...info } = row;
    res.json(info);
  });

  app.patch("/api/business-info", requireAdminSession, async (req, res) => {
    const body = { ...req.body, updatedAt: new Date().toISOString() };
    const updateData = pickColumns(schema.businessInfo, body);
    const [existing] = await db.select().from(schema.businessInfo).where(eq(schema.businessInfo.id, "default"));
    let row;
    if (existing) {
      [row] = await db.update(schema.businessInfo).set(updateData).where(eq(schema.businessInfo.id, "default")).returning();
    } else {
      [row] = await db.insert(schema.businessInfo).values({ id: "default", ...updateData } as any).returning();
    }
    const { id, ...info } = row;
    logActivity("Business Info Updated", `Phase: ${info.currentPhase}`, "client");
    res.json(info);
  });

  // ─── Schedule Items CRUD ────────────────────────────────────────

  app.get("/api/schedule", requireAdminSession, async (_req, res) => {
    const rows = await db.select().from(schema.scheduleItems).orderBy(asc(schema.scheduleItems.date));
    res.json(rows);
  });

  app.post("/api/schedule", requireAdminSession, async (req, res) => {
    const id = randomUUID();
    const [item] = await db.insert(schema.scheduleItems).values({
      id,
      title: req.body.title || "",
      description: req.body.description || "",
      date: req.body.date || new Date().toISOString().split("T")[0],
      time: req.body.time || "",
      duration: req.body.duration || 30,
      assigneeId: req.body.assigneeId || "",
      priority: req.body.priority || "medium",
      status: req.body.status || "pending",
      isAiGenerated: req.body.isAiGenerated || false,
      category: req.body.category || "general",
      createdAt: new Date().toISOString(),
    }).returning();
    logActivity("Schedule Item Added", item.title, "task");
    res.status(201).json(item);
  });

  app.patch("/api/schedule/:id", requireAdminSession, async (req, res) => {
    const updateData = pickColumns(schema.scheduleItems, req.body);
    const [updated] = await db.update(schema.scheduleItems).set(updateData).where(eq(schema.scheduleItems.id, req.params.id as string)).returning();
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  });

  app.delete("/api/schedule/:id", requireAdminSession, async (req, res) => {
    await db.delete(schema.scheduleItems).where(eq(schema.scheduleItems.id, req.params.id as string));
    res.json({ success: true });
  });

  // ─── AI Ops Assistant (Recommendations) ─────────────────────────

  app.post("/api/ai-ops/recommend", requireAdminSession, async (_req, res) => {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "Anthropic API key not configured." });

    const [teamRows, leadRows, taskRows, scheduleRows, clientRows, businessRow] = await Promise.all([
      db.select().from(schema.teamMembers),
      db.select().from(schema.leads),
      db.select().from(schema.tasks),
      db.select().from(schema.scheduleItems),
      db.select().from(schema.clients),
      db.select().from(schema.businessInfo).where(eq(schema.businessInfo.id, "default")),
    ]);
    const biz = businessRow[0];
    const pendingTasks = taskRows.filter(t => !t.completed);
    const todayStr = new Date().toISOString().split("T")[0];
    const todaySchedule = scheduleRows.filter(s => s.date === todayStr);

    const context = `
BUSINESS CONTEXT:
- Company: ${biz?.companyName || "TechSavvy Hawaii"} (DBA: ${biz?.dba || "N/A"})
- Processor Partner: ${biz?.processorPartner || "CashSwipe"}
- Current Phase: ${biz?.currentPhase || "onboarding"} (still in CashSwipe onboarding/training via Skool)
- Today: ${todayStr}

TEAM MEMBERS:
${teamRows.map(m => `- ${m.name}: ${m.role} (involvement: ${m.dailyInvolvement})`).join("\n")}

CURRENT STATE:
- Pipeline leads: ${leadRows.length} (active: ${leadRows.filter(l => !["won","lost"].includes(l.status)).length})
- Clients: ${clientRows.length}
- Pending tasks: ${pendingTasks.length}
- Today's schedule items: ${todaySchedule.length}

PENDING TASKS:
${pendingTasks.slice(0, 10).map(t => `- [${t.priority}] ${t.title} (due: ${t.dueDate || "no date"})`).join("\n") || "None"}
`;

    try {
      const anthropic = new Anthropic({ apiKey });
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2048,
        system: `You are the AI Operations Assistant for a merchant services startup. Generate actionable daily recommendations based on the current business state. Return a JSON array of task recommendations. Each item must have: title (string), description (string), assigneeName (string - one of the team member names), priority ("high"|"medium"|"low"), category ("training"|"outreach"|"admin"|"meeting"|"follow-up"|"development"). Focus on what each team member should do TODAY given the current business phase. Be specific and practical. Return ONLY valid JSON array, no other text.`,
        messages: [{ role: "user", content: context }],
      });
      const text = response.content.filter((b): b is Anthropic.TextBlock => b.type === "text").map(b => b.text).join("");
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      const recommendations = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
      res.json({ recommendations, generatedAt: new Date().toISOString() });
    } catch (err: any) {
      console.error("AI Ops recommendation error:", err.message);
      res.status(500).json({ error: "Failed to generate recommendations." });
    }
  });

  app.post("/api/ai-ops/chat", requireAdminSession, async (req, res) => {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "Anthropic API key not configured." });

    const { message, history } = req.body;
    if (!message) return res.status(400).json({ error: "Message required." });

    const [teamRows, leadRows, taskRows, clientRows, businessRow] = await Promise.all([
      db.select().from(schema.teamMembers),
      db.select().from(schema.leads),
      db.select().from(schema.tasks),
      db.select().from(schema.clients),
      db.select().from(schema.businessInfo).where(eq(schema.businessInfo.id, "default")),
    ]);
    const biz = businessRow[0];

    const systemPrompt = `You are the AI Operations Assistant for ${biz?.companyName || "TechSavvy Hawaii"}, a merchant services startup currently in the ${biz?.currentPhase || "onboarding"} phase with CashSwipe (training via Skool platform).

TEAM: ${teamRows.map(m => `${m.name} (${m.role}, ${m.dailyInvolvement} involvement)`).join("; ")}
STATS: ${leadRows.length} leads, ${clientRows.length} clients, ${taskRows.filter(t => !t.completed).length} pending tasks

You help manage daily operations, give reminders, make recommendations, and can suggest tasks to assign to team members or to yourself (AI). Be concise, actionable, and specific. When suggesting tasks, mention which team member should handle it. If asked to "do" something, explain what you'd recommend and offer to create a task for the appropriate team member.`;

    const messages: { role: "user" | "assistant"; content: string }[] = [];
    if (Array.isArray(history)) {
      for (const h of history.slice(-10)) {
        if (h.role && h.content) messages.push({ role: h.role, content: h.content.slice(0, 2000) });
      }
    }
    messages.push({ role: "user", content: message });

    try {
      const anthropic = new Anthropic({ apiKey });
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: systemPrompt,
        messages,
      });
      const text = response.content.filter((b): b is Anthropic.TextBlock => b.type === "text").map(b => b.text).join("");
      res.json({ reply: text });
    } catch (err: any) {
      console.error("AI Ops chat error:", err.message);
      res.status(500).json({ error: "Failed to get AI response." });
    }
  });

  // ─── Pinned Pitches ─────────────────────────────────────────────

  app.get("/api/pinned-pitches", requireAdminSession, async (_req, res) => {
    const rows = await db.select().from(schema.pinnedPitches);
    res.json(rows);
  });

  app.post("/api/pinned-pitches", requireAdminSession, async (req, res) => {
    const id = randomUUID();
    const [pitch] = await db.insert(schema.pinnedPitches).values({
      id,
      scriptKey: req.body.scriptKey || "",
      customContent: req.body.customContent || "",
      pinnedAt: new Date().toISOString(),
    }).returning();
    res.status(201).json(pitch);
  });

  app.patch("/api/pinned-pitches/:id", requireAdminSession, async (req, res) => {
    const updateData = pickColumns(schema.pinnedPitches, req.body);
    const [updated] = await db.update(schema.pinnedPitches).set(updateData).where(eq(schema.pinnedPitches.id, req.params.id as string)).returning();
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  });

  app.delete("/api/pinned-pitches/:id", requireAdminSession, async (req, res) => {
    await db.delete(schema.pinnedPitches).where(eq(schema.pinnedPitches.id, req.params.id as string));
    res.json({ success: true });
  });

  // ─── Client-Team Assignment ─────────────────────────────────────

  app.patch("/api/clients/:id/assign", requireAdminSession, async (req, res) => {
    const { assigneeId } = req.body;
    const [updated] = await db.update(schema.clients).set({ notes: `[ASSIGNED:${assigneeId}] ` }).where(eq(schema.clients.id, req.params.id as string)).returning();
    if (!updated) return res.status(404).json({ error: "Client not found" });
    res.json(updated);
  });

  // ─── Resend Email Config ──────────────────────────────────────────

  app.get("/api/email/config", requireAdminSession, async (_req, res) => {
    const [row] = await db.select().from(schema.resendConfig).where(eq(schema.resendConfig.id, "default"));
    if (!row) {
      return res.json({
        enabled: false,
        fromEmail: "contact@techsavvyhawaii.com",
        fromName: "TechSavvy Hawaii",
        autoConfirmEnabled: true,
        forwardCopyTo: "",
      });
    }
    const { id, ...config } = row;
    res.json(config);
  });

  app.patch("/api/email/config", requireAdminSession, async (req, res) => {
    const updateData = { ...pickColumns(schema.resendConfig, req.body), updatedAt: new Date().toISOString() };
    const [existing] = await db.select().from(schema.resendConfig).where(eq(schema.resendConfig.id, "default"));
    let row;
    if (existing) {
      [row] = await db.update(schema.resendConfig).set(updateData).where(eq(schema.resendConfig.id, "default")).returning();
    } else {
      [row] = await db.insert(schema.resendConfig).values({ id: "default", ...updateData } as any).returning();
    }
    const { id, ...config } = row;
    logActivity("Email Config Updated", `Enabled: ${config.enabled}`, "integration");
    res.json(config);
  });

  // ─── Email Threads (Inbox) ────────────────────────────────────────

  app.get("/api/email/threads", requireAdminSession, async (_req, res) => {
    const rows = await db.select().from(schema.emailThreads).orderBy(desc(schema.emailThreads.lastMessageAt));
    res.json(rows);
  });

  app.get("/api/email/threads/:id", requireAdminSession, async (req, res) => {
    const [thread] = await db.select().from(schema.emailThreads).where(eq(schema.emailThreads.id, req.params.id as string));
    if (!thread) return res.status(404).json({ error: "Thread not found" });

    const messages = await db.select().from(schema.emailMessages)
      .where(eq(schema.emailMessages.threadId, thread.id))
      .orderBy(asc(schema.emailMessages.sentAt));

    // Mark as read
    if (thread.unread) {
      await db.update(schema.emailThreads).set({ unread: false }).where(eq(schema.emailThreads.id, thread.id));
    }

    res.json({ ...thread, messages });
  });

  app.patch("/api/email/threads/:id", requireAdminSession, async (req, res) => {
    const updateData = pickColumns(schema.emailThreads, req.body);
    const [updated] = await db.update(schema.emailThreads).set(updateData).where(eq(schema.emailThreads.id, req.params.id as string)).returning();
    if (!updated) return res.status(404).json({ error: "Thread not found" });
    res.json(updated);
  });

  app.delete("/api/email/threads/:id", requireAdminSession, async (req, res) => {
    const threadId = req.params.id as string;
    await db.delete(schema.emailMessages).where(eq(schema.emailMessages.threadId, threadId));
    await db.delete(schema.emailThreads).where(eq(schema.emailThreads.id, threadId));
    res.json({ success: true });
  });

  // ─── Send Email (Reply from Inbox) ────────────────────────────────

  app.post("/api/email/send", requireAdminSession, async (req, res) => {
    const { to, subject, html, text, threadId, leadId, contactName } = req.body;
    if (!to || !subject || !html) {
      return res.status(400).json({ error: "to, subject, and html are required" });
    }
    const result = await sendEmail({ to, subject, html, text, threadId, leadId, contactName });
    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }
    logActivity("Email Sent", `To: ${to} — ${subject}`, "email");
    res.json(result);
  });

  // ─── Outreach: Generate & Send ────────────────────────────────────

  app.post("/api/email/outreach/generate", requireAdminSession, async (req, res) => {
    const { leadId } = req.body;
    if (!leadId) return res.status(400).json({ error: "leadId required" });

    const [lead] = await db.select().from(schema.leads).where(eq(schema.leads.id, leadId));
    if (!lead) return res.status(404).json({ error: "Lead not found" });

    const emailContent = generateOutreachEmail({
      name: lead.name,
      business: lead.business,
      currentProcessor: lead.currentProcessor,
      monthlyVolume: lead.monthlyVolume,
      vertical: lead.vertical,
    });

    res.json(emailContent);
  });

  app.post("/api/email/outreach/send", requireAdminSession, async (req, res) => {
    const { leadId, subject, html, text } = req.body;
    if (!leadId) return res.status(400).json({ error: "leadId required" });

    const [lead] = await db.select().from(schema.leads).where(eq(schema.leads.id, leadId));
    if (!lead) return res.status(404).json({ error: "Lead not found" });
    if (!lead.email) return res.status(400).json({ error: "Lead has no email address" });

    // Use provided content or generate default
    const content = subject && html
      ? { subject, html, text }
      : generateOutreachEmail({
          name: lead.name,
          business: lead.business,
          currentProcessor: lead.currentProcessor,
          monthlyVolume: lead.monthlyVolume,
          vertical: lead.vertical,
        });

    const result = await sendOutreachEmail({
      lead: {
        id: lead.id,
        name: lead.name,
        email: lead.email,
        business: lead.business,
        currentProcessor: lead.currentProcessor,
        monthlyVolume: lead.monthlyVolume,
        vertical: lead.vertical,
      },
      subject: content.subject,
      html: content.html,
      text: content.text,
    });

    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    // Update lead status to contacted
    await db.update(schema.leads).set({
      status: lead.status === "new" ? "contacted" : lead.status,
      updatedAt: new Date().toISOString(),
    }).where(eq(schema.leads.id, leadId));

    logActivity("Outreach Sent", `${lead.business} (${lead.email})`, "email");
    sendSlackNotification(`Outreach email sent to ${lead.business} (${lead.email})`, "newLead");

    res.json(result);
  });

  // ─── Call Script Generation ───────────────────────────────────────

  app.post("/api/email/call-script/generate", requireAdminSession, async (req, res) => {
    const { leadId } = req.body;
    if (!leadId) return res.status(400).json({ error: "leadId required" });

    const [lead] = await db.select().from(schema.leads).where(eq(schema.leads.id, leadId));
    if (!lead) return res.status(404).json({ error: "Lead not found" });

    const result = await generateCallScript({
      id: lead.id,
      name: lead.name,
      business: lead.business,
      currentProcessor: lead.currentProcessor,
      monthlyVolume: lead.monthlyVolume,
      vertical: lead.vertical,
      painPoints: lead.painPoints,
    });

    // Fetch the created script
    const [script] = await db.select().from(schema.callScripts).where(eq(schema.callScripts.id, result.scriptId));
    res.json({
      ...script,
      talkingPoints: JSON.parse(script.talkingPoints || "[]"),
      objections: JSON.parse(script.objections || "[]"),
    });
  });

  app.get("/api/email/call-scripts/:leadId", requireAdminSession, async (req, res) => {
    const scripts = await db.select().from(schema.callScripts)
      .where(eq(schema.callScripts.leadId, req.params.leadId as string))
      .orderBy(desc(schema.callScripts.generatedAt));

    res.json(scripts.map(s => ({
      ...s,
      talkingPoints: JSON.parse(s.talkingPoints || "[]"),
      objections: JSON.parse(s.objections || "[]"),
    })));
  });

  // ─── Outreach Templates CRUD ──────────────────────────────────────

  app.get("/api/email/templates", requireAdminSession, async (_req, res) => {
    const rows = await db.select().from(schema.outreachTemplates);
    res.json(rows);
  });

  app.post("/api/email/templates", requireAdminSession, async (req, res) => {
    const id = randomUUID();
    const now = new Date().toISOString();
    const [template] = await db.insert(schema.outreachTemplates).values({
      id,
      name: req.body.name || "",
      subject: req.body.subject || "",
      body: req.body.body || "",
      category: req.body.category || "cold",
      isDefault: req.body.isDefault || false,
      createdAt: now,
      updatedAt: now,
    }).returning();
    res.status(201).json(template);
  });

  app.patch("/api/email/templates/:id", requireAdminSession, async (req, res) => {
    const body = { ...req.body, updatedAt: new Date().toISOString() };
    const updateData = pickColumns(schema.outreachTemplates, body);
    const [updated] = await db.update(schema.outreachTemplates).set(updateData).where(eq(schema.outreachTemplates.id, req.params.id as string)).returning();
    if (!updated) return res.status(404).json({ error: "Template not found" });
    res.json(updated);
  });

  app.delete("/api/email/templates/:id", requireAdminSession, async (req, res) => {
    await db.delete(schema.outreachTemplates).where(eq(schema.outreachTemplates.id, req.params.id as string));
    res.json({ success: true });
  });

  // ─── Inbound Email Webhook (Resend) ───────────────────────────────

  app.post("/api/email/inbound", async (req: Request, res: Response) => {
    // Resend sends inbound emails as JSON webhook
    try {
      const { from, to, subject, text, html } = req.body;
      if (!from) {
        return res.status(400).json({ error: "Invalid webhook payload" });
      }

      const result = await handleInboundEmail({ from, to: to || "contact@techsavvyhawaii.com", subject: subject || "(no subject)", text: text || "", html: html || "" });
      logActivity("Email Received", `From: ${from} — ${subject || "(no subject)"}`, "email");

      res.json({ success: true, threadId: result.threadId });
    } catch (err: any) {
      console.error("Inbound email webhook error:", err.message);
      res.status(500).json({ error: "Failed to process inbound email" });
    }
  });

  // ─── Email Stats for Dashboard ────────────────────────────────────

  app.get("/api/email/stats", requireAdminSession, async (_req, res) => {
    const threads = await db.select().from(schema.emailThreads);
    const unread = threads.filter(t => t.unread).length;
    const total = threads.length;
    const outreach = threads.filter(t => t.source === "outreach").length;
    const replies = threads.filter(t => t.source === "outreach-reply").length;
    const directInbound = threads.filter(t => t.source === "direct").length;
    const contactForm = threads.filter(t => t.source === "contact-form").length;

    res.json({ total, unread, outreach, replies, directInbound, contactForm });
  });

  return httpServer;
}
