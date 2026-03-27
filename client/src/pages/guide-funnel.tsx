import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Layout from "@/components/layout";
import { useSEO } from "@/hooks/useSEO";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { apiRequest } from "@/lib/queryClient";
import {
  FileSearch,
  DollarSign,
  ShieldCheck,
  BarChart3,
  Check,
  CheckCircle,
  ArrowRight,
  Loader2,
  AlertCircle,
  ChevronDown,
} from "lucide-react";

const WEBHOOK_URL = "https://n8n.realconnect.online/webhook/techsavvy-intake";

const GUIDES: Record<string, {
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  icon: React.ComponentType<{ className?: string }>;
  benefits: { headline: string; detail: string }[];
  pdfUrl?: string;
  seoKeywords: string;
  leadMagnetKey: string;
}> = {
  "cash-discount": {
    title: "Cash Discount Programs Explained",
    subtitle: "Legal in all 50 states — understand exactly how it works before making any decisions.",
    badge: "FREE GUIDE",
    badgeColor: "text-emerald-400 border-emerald-400/30 bg-emerald-400/5",
    icon: DollarSign,
    benefits: [
      { headline: "Cash discount vs. surcharge", detail: "The legal difference that could save or cost you thousands" },
      { headline: "Is it right for your business?", detail: "Industry-specific fit analysis for restaurants, retail, salons, auto" },
      { headline: "Implementation checklist", detail: "Signage, receipts, and POS setup — done right the first time" },
      { headline: "Customer FAQ scripts", detail: "What to say at the register so customers don't push back" },
    ],
    leadMagnetKey: "cash-discount-explained",
    seoKeywords: "cash discount program Hawaii, eliminate processing fees, cash discount vs surcharge Hawaii",
  },
  "rate-comparison": {
    title: "Industry Rate Comparison Guide",
    subtitle: "Know if you're overpaying — benchmarks for restaurants, retail, salons, auto, medical and more.",
    badge: "FREE GUIDE",
    badgeColor: "text-primary border-primary/30 bg-primary/5",
    icon: BarChart3,
    benefits: [
      { headline: "Rate benchmarks by industry", detail: "Good / average / high ranges for 8 business types" },
      { headline: "How to calculate your effective rate", detail: "One formula — takes 30 seconds with any statement" },
      { headline: "Red flags that mean you're overpaying", detail: "The specific line items that signal a bad deal" },
      { headline: "5 questions to ask your processor", detail: "That reveal whether you're being taken advantage of" },
    ],
    leadMagnetKey: "rate-comparison-guide",
    seoKeywords: "payment processing rates Hawaii, credit card processing fee comparison, merchant services rate benchmark Hawaii",
  },
  "security-checklist": {
    title: "Payment Security Checklist",
    subtitle: "PCI compliance, fraud prevention, and breach response — all in one checklist for small businesses.",
    badge: "FREE CHECKLIST",
    badgeColor: "text-violet-400 border-violet-400/30 bg-violet-400/5",
    icon: ShieldCheck,
    benefits: [
      { headline: "PCI compliance walkthrough", detail: "Self-assessment guide so you avoid fines up to $100K/month" },
      { headline: "Terminal and POS hardening", detail: "Physical and software steps to prevent skimming attacks" },
      { headline: "Fraud prevention tactics", detail: "For both in-person and online transactions" },
      { headline: "Breach response template", detail: "What to do in the first 24 hours if something goes wrong" },
    ],
    leadMagnetKey: "payment-security-checklist",
    seoKeywords: "PCI compliance checklist Hawaii, payment security small business, credit card fraud prevention Hawaii",
  },
  "statement-check": {
    title: "Top 10 Things to Check on Your Merchant Statement",
    subtitle: "Most business owners have never read their statement. Here's what to look for — and what to demand gets fixed.",
    badge: "FREE GUIDE",
    badgeColor: "text-amber-400 border-amber-400/30 bg-amber-400/5",
    icon: FileSearch,
    benefits: [
      { headline: "Find your true effective rate", detail: "The one number that tells you everything about your deal" },
      { headline: "Spot junk fees and fake charges", detail: "Line items that shouldn't exist — and how to dispute them" },
      { headline: "Understand your pricing model", detail: "Interchange-plus vs. tiered vs. flat rate — which is best for you" },
      { headline: "Statement audit checklist", detail: "Print it out and use it on any processor's statement" },
    ],
    leadMagnetKey: "top-10-statement-check",
    seoKeywords: "merchant statement review Hawaii, how to read processing statement, find hidden fees merchant statement",
  },
};

const BUSINESS_TYPES = [
  "Restaurant / Food Service",
  "Retail / Store",
  "Salon / Spa",
  "Auto Repair / Service",
  "Medical / Healthcare",
  "Professional Services",
  "E-Commerce",
  "Convenience Store",
  "Other",
];

export default function GuideFunnel() {
  const [, params] = useRoute("/guides/:slug");
  const [, navigate] = useLocation();
  const slug = params?.slug ?? "";
  const guide = GUIDES[slug];

  const [form, setForm] = useState({ name: "", email: "", phone: "", businessName: "", businessType: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useSEO({
    title: guide ? `${guide.title} | Free | TechSavvy Hawaii` : "Free Guide | TechSavvy Hawaii",
    description: guide?.subtitle ?? "Free payment processing guide for Hawaii merchants.",
    keywords: guide?.seoKeywords ?? "",
    canonical: `https://techsavvyhawaii.com/guides/${slug}`,
  });

  if (!guide) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="text-muted-foreground">Guide not found.</p>
        </div>
      </Layout>
    );
  }

  const Icon = guide.icon;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    // Internal API — non-blocking
    try {
      await apiRequest("POST", "/api/leads/public", {
        name: form.name,
        business: form.businessName,
        email: form.email,
        phone: form.phone || "",
        package: "terminal",
        notes: `Guide Funnel: ${guide.title} | Type: ${form.businessType}`,
      });
    } catch { /* non-blocking */ }

    // n8n webhook → Airtable + automation
    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          business_name: form.businessName,
          business_type: form.businessType,
          lead_source: `guide-${slug}`,
          lead_magnet: guide.leadMagnetKey,
          submitted_at: new Date().toISOString(),
          page_url: window.location.href,
        }),
      });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <Layout>
        <section className="min-h-[75vh] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full text-center"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-extrabold mb-3">Check Your Email!</h2>
            <p className="text-muted-foreground mb-8">
              Your copy of <strong className="text-foreground">{guide.title}</strong> is on its way.
              Check spam if you don't see it within a few minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg">
                <a href="/calculator">
                  See How Much You're Overpaying
                  <ArrowRight className="w-4 h-4" />
                </a>
              </Button>
              <Button variant="outline" asChild size="lg">
                <a href="/statement-review">Upload Your Statement</a>
              </Button>
            </div>
          </motion.div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-24 sm:pt-32 pb-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div variants={fadeUp}>
              <Badge variant="outline" className={`mb-4 ${guide.badgeColor}`}>
                <Icon className="w-3 h-3 mr-1.5" />
                {guide.badge}
              </Badge>
            </motion.div>
            <motion.h1
              className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 leading-tight"
              variants={fadeUp}
            >
              {guide.title}
            </motion.h1>
            <motion.p
              className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto"
              variants={fadeUp}
            >
              {guide.subtitle}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Content + Form */}
      <section className="pb-20 sm:pb-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

            {/* Left — What's inside */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-5">
                What's inside
              </p>
              <div className="space-y-4">
                {guide.benefits.map((b, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-foreground">{b.headline}</p>
                      <p className="text-sm text-muted-foreground">{b.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social proof */}
              <div className="mt-8 p-4 rounded-xl bg-card border border-border/60">
                <p className="text-sm text-muted-foreground italic">
                  "I had no idea I was paying $800/month in fees that shouldn't even exist.
                  This guide helped me find them in under 15 minutes."
                </p>
                <p className="text-xs font-semibold text-foreground mt-2">— Local Hawaii restaurant owner</p>
              </div>
            </motion.div>

            {/* Right — Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl border border-border/60 bg-card shadow-xl overflow-hidden"
            >
              <div className="border-b border-border/50 px-6 py-5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Get the free guide</p>
                  <p className="text-xs text-muted-foreground">Sent to your email instantly</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {status === "error" && (
                  <div className="flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    Something went wrong. Please try again or call (888) 353-5532.
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold mb-1.5">
                    Full Name <span className="text-destructive">*</span>
                  </label>
                  <Input
                    required
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">
                    Email <span className="text-destructive">*</span>
                  </label>
                  <Input
                    required
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="you@business.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Phone</label>
                  <Input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="808-555-1234"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Business Name</label>
                  <Input
                    value={form.businessName}
                    onChange={e => setForm(f => ({ ...f, businessName: e.target.value }))}
                    placeholder="Aloha Grill"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Business Type</label>
                  <div className="relative">
                    <select
                      value={form.businessType}
                      onChange={e => setForm(f => ({ ...f, businessType: e.target.value }))}
                      className="w-full appearance-none px-3.5 py-2.5 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 pr-9"
                    >
                      <option value="">Select industry...</option>
                      {BUSINESS_TYPES.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={status === "loading"}>
                  {status === "loading" ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                  ) : (
                    <>Send Me the Guide <ArrowRight className="w-4 h-4" /></>
                  )}
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  🔒 No spam, ever. Unsubscribe anytime.
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-background to-emerald-500/10 border border-primary/20 p-8 text-center">
            <h3 className="text-xl font-extrabold mb-2">Want us to do it for you?</h3>
            <p className="text-muted-foreground text-sm mb-5 max-w-lg mx-auto">
              Upload your current processing statement and our AI will grade it A–F, find every hidden fee,
              and estimate exactly how much you're overpaying. Takes 30 seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild>
                <a href="/statement-review">
                  Get a Free Statement Review <ArrowRight className="w-4 h-4" />
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/calculator">Try the Savings Calculator</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
