import type { PipelineStage, LeadSource, Vertical, PackageType, MaintenancePlan, RevenueEntry, DealStage, UserRole } from "./types";

// ─── Pipeline ────────────────────────────────────────────────────────

export const PIPELINE_CONFIG: Record<PipelineStage, { label: string; color: string; bg: string; short: string }> = {
  new:                  { label: "New Lead", color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20", short: "New" },
  contacted:            { label: "Contacted", color: "text-sky-400", bg: "bg-sky-400/10 border-sky-400/20", short: "Contacted" },
  qualified:            { label: "Qualified", color: "text-cyan-400", bg: "bg-cyan-400/10 border-cyan-400/20", short: "Qualified" },
  "statement-requested":{ label: "Stmt Requested", color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/20", short: "Stmt Req" },
  "statement-received": { label: "Stmt Received", color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20", short: "Stmt Recv" },
  "analysis-delivered": { label: "Analysis Sent", color: "text-orange-400", bg: "bg-orange-400/10 border-orange-400/20", short: "Analysis" },
  "proposal-sent":      { label: "Proposal Sent", color: "text-purple-400", bg: "bg-purple-400/10 border-purple-400/20", short: "Proposal" },
  negotiation:          { label: "Negotiation", color: "text-pink-400", bg: "bg-pink-400/10 border-pink-400/20", short: "Negotiation" },
  won:                  { label: "Won", color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20", short: "Won" },
  lost:                 { label: "Lost", color: "text-red-400", bg: "bg-red-400/10 border-red-400/20", short: "Lost" },
  nurture:              { label: "Nurture", color: "text-violet-400", bg: "bg-violet-400/10 border-violet-400/20", short: "Nurture" },
};

export const SOURCE_CONFIG: Record<LeadSource, { label: string; color: string; icon: string }> = {
  referral:     { label: "Referral Partner", color: "text-emerald-400", icon: "R" },
  networking:   { label: "Networking", color: "text-blue-400", icon: "N" },
  social:       { label: "Social Outreach", color: "text-pink-400", icon: "S" },
  direct:       { label: "Direct Prospecting", color: "text-orange-400", icon: "D" },
  "lead-magnet":{ label: "Lead Magnet", color: "text-purple-400", icon: "L" },
};

export const VERTICAL_CONFIG: Record<Vertical, string> = {
  restaurant: "Restaurant/Food", retail: "Retail", salon: "Salon/Beauty", auto: "Auto/Repair",
  medical: "Medical/Dental", cbd: "CBD/Hemp", vape: "Vape/Smoke", firearms: "Firearms",
  ecommerce: "E-Commerce", services: "Professional Services", other: "Other",
};

export const PACKAGE_CONFIG: Record<PackageType, { label: string; color: string }> = {
  terminal: { label: "Terminal ($399)", color: "text-primary" },
  trial: { label: "30-Day Trial", color: "text-chart-4" },
  online: { label: "Online (Free)", color: "text-chart-2" },
};

export const MAINTENANCE_CONFIG: Record<MaintenancePlan, { label: string; price: string }> = {
  none: { label: "None / Self-Hosted", price: "$0" },
  basic: { label: "Basic", price: "$50/mo" },
  pro: { label: "Pro", price: "$199/mo" },
  premium: { label: "Premium", price: "$399/mo" },
};

export const REVENUE_TYPES: Record<RevenueEntry["type"], string> = {
  "terminal-sale": "Terminal Sale", "trial-convert": "Trial Conversion",
  "maintenance": "Maintenance Plan", "one-off-update": "One-Off Update",
  "website-addon": "Website Add-On", "other": "Other",
};

export const MODELS = [
  { value: "claude-sonnet-4-20250514", label: "Claude Sonnet 4 (Latest)" },
  { value: "claude-3-7-sonnet-20250219", label: "Claude 3.7 Sonnet" },
  { value: "claude-3-5-haiku-20241022", label: "Claude 3.5 Haiku (Fast)" },
];

export const CONTACT_METHODS: Record<string, string> = {
  phone: "Phone Call", email: "Email", text: "Text/SMS", "in-person": "In-Person",
};

export const ACTIVITY_COLORS: Record<string, string> = {
  lead: "bg-blue-400", client: "bg-emerald-400", revenue: "bg-purple-400",
  task: "bg-yellow-400", file: "bg-orange-400", integration: "bg-pink-400", auth: "bg-gray-400",
  deal: "bg-indigo-400",
};

export const MATERIAL_CATEGORIES: Record<string, { label: string; icon: string }> = {
  sales: { label: "Sales & Outreach Assets", icon: "S" },
  "lead-gen": { label: "Lead Generation Assets", icon: "L" },
  partner: { label: "Partner Program Assets", icon: "P" },
  tracking: { label: "Tracking & Ops Assets", icon: "T" },
};

export const PLAYBOOK_SCRIPTS = {
  referral: {
    outreach: `I work with local businesses to lower processing costs and upgrade payment reliability. You already advise businesses on operations/financials — if you have clients complaining about fees or equipment, I can do a no-obligation statement review. If it helps, I'll pay a referral fee and track everything cleanly.`,
  },
  networking: {
    elevator: `I help local businesses stop bleeding money on hidden processing fees and outdated equipment. If you bring me a recent statement, I'll highlight what's actually being charged and what could be improved — no obligation.`,
  },
  social: {
    dm: `Appreciate you checking that post. If you want, I can do a quick statement check and tell you where the extra fees usually hide. It's a simple yes/no: either it's already solid, or there's money on the table.`,
  },
  direct: {
    coldCall: `Hi — I'm local and I help businesses reduce processing costs and fix the usual problems like hidden fees or outdated terminals. I'm not calling to sell you on the spot — I'm offering a no-obligation statement review. If you've got last month's statement, I'll show you exactly what you're paying and what can be improved.`,
    walkIn: `Hey, I'm in the area helping businesses compare statements — processing fees are all over the place right now. Who handles your merchant account? I can do a quick statement check and show you what's normal vs. what's inflated.`,
    email: `Subject: Quick question about your payment setup

Hi {Name} — I stopped by / noticed {specific observation}. I work with local {vertical} businesses to reduce processing fees and modernize checkout without disruption.

If you send a recent statement, I'll mark up what you're paying (including the sneaky line items) and give you a clear comparison — no obligation.

Best contact for a 10-minute review?`,
  },
  leadMagnet: {
    followUp24hr: `Hey {Name} — saw you grabbed the {Lead Magnet}. If you want, send a recent statement and I'll point out exactly where fees tend to stack up for {their vertical}. No pressure — you'll just know what's real.`,
  },
};

// ─── Deal Pipeline ───────────────────────────────────────────────────

export const DEAL_STAGE_CONFIG: Record<DealStage, { label: string; color: string; bg: string; probability: number }> = {
  prospecting:   { label: "Prospecting", color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20", probability: 10 },
  qualification: { label: "Qualification", color: "text-cyan-400", bg: "bg-cyan-400/10 border-cyan-400/20", probability: 25 },
  proposal:      { label: "Proposal", color: "text-purple-400", bg: "bg-purple-400/10 border-purple-400/20", probability: 50 },
  negotiation:   { label: "Negotiation", color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20", probability: 75 },
  "closed-won":  { label: "Closed Won", color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20", probability: 100 },
  "closed-lost": { label: "Closed Lost", color: "text-red-400", bg: "bg-red-400/10 border-red-400/20", probability: 0 },
};

export const DEAL_STAGES: DealStage[] = ["prospecting", "qualification", "proposal", "negotiation", "closed-won", "closed-lost"];

export const USER_ROLE_CONFIG: Record<UserRole, { label: string; color: string; permissions: string[] }> = {
  admin:      { label: "Admin", color: "text-red-400", permissions: ["all"] },
  manager:    { label: "Manager", color: "text-purple-400", permissions: ["read", "write", "assign", "reports"] },
  "sales-rep":{ label: "Sales Rep", color: "text-blue-400", permissions: ["read", "write-own"] },
  viewer:     { label: "Viewer", color: "text-gray-400", permissions: ["read"] },
};

export const GOOGLE_DORK_PRESETS = [
  { label: "Restaurants using Square", query: 'site:squareup.com/us/en/restaurant inurl:"{location}"' },
  { label: "Businesses on Yelp", query: 'site:yelp.com "{location}" "payment" OR "credit card"' },
  { label: "Clover merchants", query: 'site:clover.com "{location}" merchant' },
  { label: "Toast restaurants", query: 'site:toasttab.com "{location}"' },
  { label: "Shopify stores", query: 'site:myshopify.com "{location}" OR "Hawaii"' },
  { label: "New business filings", query: '"new business" OR "grand opening" "{location}" 2024' },
  { label: "BBB listed", query: 'site:bbb.org "{location}" "payment processing"' },
  { label: "Google Maps (restaurants)", query: 'site:google.com/maps "restaurant" "{location}"' },
  { label: "Facebook business pages", query: 'site:facebook.com "{location}" "restaurant" OR "retail" "payment"' },
  { label: "Chamber of Commerce", query: '"chamber of commerce" "{location}" "member" OR "directory"' },
  { label: "High-risk verticals", query: '"{location}" "vape shop" OR "smoke shop" OR "CBD" "credit card"' },
  { label: "Medical/Dental offices", query: '"{location}" "dental office" OR "medical clinic" "accepts credit cards"' },
];
