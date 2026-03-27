import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/layout";
import { useSEO } from "@/hooks/useSEO";
import { fadeUp, staggerContainer } from "@/lib/animations";
import {
  Calculator,
  TrendingDown,
  DollarSign,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader2,
  ChevronDown,
} from "lucide-react";

const WEBHOOK_URL = "https://n8n.realconnect.online/webhook/techsavvy-intake";

interface FormState {
  name: string;
  email: string;
  phone: string;
  business_name: string;
  business_type: string;
  monthly_volume: string;
  current_processor: string;
  wants_terminal: boolean;
  wants_statement_review: boolean;
}

function fmt(n: number) {
  return "$" + Math.round(n).toLocaleString();
}

export default function CalculatorPage() {
  useSEO({
    title: "Processing Fee Calculator | See How Much You're Overpaying | TechSavvy Hawaii",
    description:
      "Find out exactly how much you're losing to processing fees every month. Free savings calculator for Hawaii merchants — get your personalized analysis in 60 seconds.",
    keywords:
      "credit card processing fee calculator Hawaii, merchant fee calculator, payment processing savings calculator, how much are processing fees Hawaii",
    canonical: "https://techsavvyhawaii.com/calculator",
  });

  const [volume, setVolume] = useState<string>("");
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    business_name: "",
    business_type: "",
    monthly_volume: "",
    current_processor: "",
    wants_terminal: false,
    wants_statement_review: false,
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const vol = parseFloat(volume.replace(/,/g, "")) || 0;
  const current = vol * 0.025;
  const optimized = vol * 0.005;
  const monthly = current - optimized;
  const annual = monthly * 12;
  const hasCalc = vol > 0;

  // Sync volume input to form dropdown
  function handleVolumeInput(val: string) {
    setVolume(val);
    const n = parseFloat(val.replace(/,/g, "")) || 0;
    let bracket = "";
    if (n > 0 && n < 10000) bracket = "under_10k";
    else if (n < 30000) bracket = "10k_30k";
    else if (n < 75000) bracket = "30k_75k";
    else if (n >= 75000) bracket = "75k_plus";
    setForm((f) => ({ ...f, monthly_volume: bracket }));
  }

  function set(field: keyof FormState, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    const payload = {
      ...form,
      wants_terminal: form.wants_terminal ? "yes" : "no",
      wants_statement_review: form.wants_statement_review ? "yes" : "no",
      lead_source: "calculator",
      submitted_at: new Date().toISOString(),
      page_url: window.location.href,
    };

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("bad response");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <Layout>
        <section className="min-h-[70vh] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full text-center"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-extrabold mb-3">You're on the list!</h2>
            <p className="text-muted-foreground mb-8">
              Your savings analysis is being put together. Expect a follow-up
              within 24 hours with real numbers for your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg">
                <a href="/apply">
                  Complete Full Application
                  <ArrowRight className="w-4 h-4" />
                </a>
              </Button>
              <Button variant="outline" asChild size="lg">
                <a href="/statement-review">Upload Statement</a>
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
              <Badge variant="outline" className="mb-4 text-primary border-primary/30 bg-primary/5">
                <Calculator className="w-3 h-3 mr-1.5" />
                Free Savings Calculator
              </Badge>
            </motion.div>
            <motion.h1
              className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4"
              variants={fadeUp}
            >
              How Much Are You{" "}
              <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
                Actually Paying
              </span>{" "}
              in Processing Fees?
            </motion.h1>
            <motion.p
              className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto"
              variants={fadeUp}
            >
              Enter your monthly volume below and see your real number — most
              Hawaii merchants are losing $12,000–$36,000 a year without knowing it.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Live Calculator Widget */}
      <section className="pb-10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-primary/20 bg-card shadow-xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-primary/5 to-emerald-500/5 border-b border-border/50 px-6 py-5">
              <p className="text-sm font-semibold mb-3 flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-primary" />
                Step 1 — Enter Your Monthly Card Volume
              </p>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-lg">$</span>
                <input
                  type="number"
                  value={volume}
                  onChange={(e) => handleVolumeInput(e.target.value)}
                  placeholder="50000"
                  className="w-full pl-8 pr-4 py-3.5 rounded-xl border-2 border-border bg-background text-xl font-bold focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div className="p-6 grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-border/60 bg-background p-4 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                  What You're Likely Paying
                </p>
                <p className="text-2xl font-extrabold text-foreground">
                  {hasCalc ? fmt(current) : "—"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">per month @ ~2.5% avg</p>
              </div>
              <div className="rounded-xl border border-border/60 bg-background p-4 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                  With Cash Discount
                </p>
                <p className="text-2xl font-extrabold text-primary">
                  {hasCalc ? fmt(optimized) : "—"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">per month @ ~0.5%</p>
              </div>
              <div className="col-span-2 rounded-xl bg-gradient-to-br from-primary/10 to-emerald-500/10 border border-primary/20 p-5 text-center">
                <p className="text-xs text-primary/70 uppercase tracking-wider font-semibold mb-1">
                  Estimated Annual Savings
                </p>
                <p className="text-4xl font-extrabold text-primary">
                  {hasCalc ? fmt(annual) + "/yr" : "Enter volume above"}
                </p>
                {hasCalc && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {fmt(monthly)} back in your pocket every month
                  </p>
                )}
              </div>
            </div>
            <p className="text-center text-xs text-muted-foreground pb-4 px-6">
              * Estimates based on industry averages. Actual savings depend on your current processor and transaction mix.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Lead Form */}
      <section className="pb-16 sm:pb-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="rounded-2xl border border-border/60 bg-card shadow-xl overflow-hidden"
          >
            <div className="border-b border-border/50 px-6 py-5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">Step 2 — Get Your Free Custom Analysis</p>
                <p className="text-xs text-muted-foreground">We'll come back with real numbers, not a range.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {status === "error" && (
                <div className="flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  Something went wrong. Please try again or call (808) 767-5460.
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5">
                    Full Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">
                    Business Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    required
                    value={form.business_name}
                    onChange={(e) => set("business_name", e.target.value)}
                    placeholder="Aloha Grill"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">
                    Email <span className="text-destructive">*</span>
                  </label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="you@business.com"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder="808-555-1234"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Business Type</label>
                  <div className="relative">
                    <select
                      value={form.business_type}
                      onChange={(e) => set("business_type", e.target.value)}
                      className="w-full appearance-none px-3.5 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors pr-9"
                    >
                      <option value="">Select industry...</option>
                      <option value="restaurant">Restaurant / Food Service</option>
                      <option value="retail">Retail</option>
                      <option value="salon">Salon / Spa</option>
                      <option value="auto">Auto Repair / Service</option>
                      <option value="medical">Medical / Healthcare</option>
                      <option value="professional">Professional Services</option>
                      <option value="ecommerce">E-Commerce</option>
                      <option value="other">Other</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">
                    Monthly Volume <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <select
                      required
                      value={form.monthly_volume}
                      onChange={(e) => set("monthly_volume", e.target.value)}
                      className="w-full appearance-none px-3.5 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors pr-9"
                    >
                      <option value="">Select range...</option>
                      <option value="under_10k">Under $10,000</option>
                      <option value="10k_30k">$10,000 – $30,000</option>
                      <option value="30k_75k">$30,000 – $75,000</option>
                      <option value="75k_plus">$75,000+</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold mb-1.5">Current Processor</label>
                  <div className="relative">
                    <select
                      value={form.current_processor}
                      onChange={(e) => set("current_processor", e.target.value)}
                      className="w-full appearance-none px-3.5 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors pr-9"
                    >
                      <option value="">Select processor...</option>
                      <option value="square">Square</option>
                      <option value="stripe">Stripe</option>
                      <option value="paypal">PayPal / Zettle</option>
                      <option value="toast">Toast</option>
                      <option value="clover">Clover</option>
                      <option value="heartland">Heartland</option>
                      <option value="first_data">First Data / Fiserv</option>
                      <option value="chase">Chase Paymentech</option>
                      <option value="worldpay">Worldpay</option>
                      <option value="other">Other / Not Sure</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-3">
                <p className="text-sm font-semibold">What do you need?</p>
                {[
                  {
                    field: "wants_terminal" as const,
                    label: "New Terminal or Equipment",
                    sub: "POS system, card reader, or countertop terminal",
                  },
                  {
                    field: "wants_statement_review" as const,
                    label: "Free Statement Audit (+priority review)",
                    sub: "I'll upload my current processing statement for a line-by-line review",
                  },
                ].map(({ field, label, sub }) => (
                  <label
                    key={field}
                    className="flex items-start gap-3 p-3.5 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-colors cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={form[field] as boolean}
                      onChange={(e) => set(field, e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-primary shrink-0"
                    />
                    <div>
                      <p className="text-sm font-semibold">{label}</p>
                      <p className="text-xs text-muted-foreground">{sub}</p>
                    </div>
                  </label>
                ))}
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Show Me My Savings Analysis
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                🔒 Your info is private. No spam, ever.
              </p>
            </form>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
