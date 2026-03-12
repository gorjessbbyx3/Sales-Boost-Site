import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Check, X, ArrowRight, Gift, Phone, Star, Shield,
  DollarSign, Clock, MapPin, TrendingDown, Award, Heart, Calendar,
} from "lucide-react";
import { useState } from "react";
import { fadeUp, staggerContainer } from "@/lib/animations";
import Layout from "@/components/layout";
import { useSEO } from "@/hooks/useSEO";
import { Link } from "wouter";

const PROCESSORS = [
  { name: "TechSavvy", highlight: true },
  { name: "Square", highlight: false },
  { name: "Toast", highlight: false },
  { name: "Stripe", highlight: false },
  { name: "Clover", highlight: false },
];

const FEATURES = [
  { feature: "Processing Rate", values: ["0%", "2.6% + 10¢", "2.99% + 15¢", "2.9% + 30¢", "2.3–3.5% + 10¢"] },
  { feature: "Monthly Fees", values: ["$0", "$0–$60/mo", "$0–$165/mo", "$0", "$14.95–$120+"] },
  { feature: "Equipment Cost", values: ["Free for qualifying merchants*", "$49–$799", "$0–$799+", "N/A (online only)", "$599–$1,799+"] },
  { feature: "Contract Length", values: ["None", "None", "2 years typical", "None", "3 years typical"] },
  { feature: "Hands-On Tech Support", values: ["Yes — in person or live remote", "No", "No", "No", "No"] },
  { feature: "Next-Day Funding", values: ["Yes — included", "Extra cost", "Next business day", "2 business days", "Extra cost"] },
  { feature: "Free Merchant Website", values: ["Yes", "Basic page only", "No", "No", "No"] },
  { feature: "Cash Discount Program", values: ["Yes — fully compliant", "No", "No", "No", "No"] },
  { feature: "In-Person Setup & Training", values: ["Yes — we handle everything", "No", "No", "No", "Sometimes — for a fee"] },
  { feature: "Cancellation Fee", values: ["$0", "$0", "Remaining contract", "$0", "$200–$500+"] },
];

export default function ComparePage() {
  useSEO({
    title: "TechSavvy vs Square vs Toast vs Clover vs Stripe | Hawaii",
    description: "Compare TechSavvy Hawaii's zero-fee processing against Square, Toast, Clover, and Stripe. See rates, fees, equipment costs, and real savings side by side.",
    keywords: "TechSavvy vs Square, TechSavvy vs Toast, TechSavvy vs Clover, TechSavvy vs Stripe, payment processor comparison Hawaii, best credit card processor, cheapest payment processing, zero fee vs Square, Toast POS Hawaii, Clover POS Hawaii, compare merchant services Hawaii",
    canonical: "https://techsavvyhawaii.com/compare",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Payment Processor Comparison — TechSavvy Hawaii",
      url: "https://techsavvyhawaii.com/compare",
      description: "Side-by-side comparison of payment processors for Hawaii businesses.",
    },
  });

  const [volume, setVolume] = useState(25000);
  const costs = [
    { name: "TechSavvy", annual: 0, color: "text-primary" },
    { name: "Square", annual: Math.round(volume * 0.026 + volume / 30 * 0.10) * 12, color: "text-blue-400" },
    { name: "Toast", annual: Math.round(volume * 0.0299 + volume / 30 * 0.15) * 12 + 69 * 12, color: "text-orange-400" },
    { name: "Stripe", annual: Math.round(volume * 0.029 + volume / 30 * 0.30) * 12, color: "text-purple-400" },
    { name: "Clover", annual: Math.round(volume * 0.03 + volume / 30 * 0.10) * 12 + 14.95 * 12, color: "text-red-400" },
  ];
  const fmt = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-24 sm:pt-32 pb-10 sm:pb-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div variants={fadeUp}>
              <Badge variant="outline" className="mb-4 text-primary border-primary/30 bg-primary/5">
                <Award className="w-3 h-3 mr-1.5" />
                Side-by-side comparison
              </Badge>
            </motion.div>
            <motion.h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4" variants={fadeUp}>
              TechSavvy vs.{" "}
              <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">Everyone Else</span>
            </motion.h1>
            <motion.p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto" variants={fadeUp}>
              See why Hawai'i businesses are switching from Square, Stripe, and traditional bank processors to TechSavvy's zero-fee cash discount program.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="pb-16 sm:pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Card className="overflow-hidden border-primary/15">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 font-semibold text-muted-foreground w-[20%]">Feature</th>
                      {PROCESSORS.map((p) => (
                        <th key={p.name} className={`text-center p-4 w-[16%] ${p.highlight ? "bg-primary/5" : ""}`}>
                          <span className={`font-bold ${p.highlight ? "text-primary" : "text-foreground"}`}>{p.name}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {FEATURES.map((row, i) => (
                      <tr key={row.feature} className={`border-b border-border/50 ${i % 2 ? "bg-muted/20" : ""}`}>
                        <td className="p-3 sm:p-4 font-medium text-foreground/80">{row.feature}</td>
                        {row.values.map((val, j) => {
                          const isTS = j === 0;
                          const isGood = isTS || val === "None" || val === "$0" || val.startsWith("Yes");
                          return (
                            <td key={j} className={`p-3 sm:p-4 text-center text-xs sm:text-sm ${isTS ? "bg-primary/5 font-semibold text-primary" : isGood ? "text-foreground" : "text-muted-foreground"}`}>
                              <span className="inline-flex items-center gap-1">
                                {isTS && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                                {!isTS && !isGood && <X className="w-3 h-3 text-red-400/60 shrink-0" />}
                                {val}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Real Cost Calculator */}
      <section className="pb-16 sm:pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">Real Cost Comparison</h2>
              <p className="text-muted-foreground">See what you'd actually pay per year with each processor</p>
            </div>

            <Card className="border-primary/15">
              <CardContent className="p-6 sm:p-8">
                <div className="mb-6">
                  <label className="text-sm font-medium mb-2 block">Your monthly card volume</label>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-muted-foreground">$</span>
                    <input type="text" inputMode="numeric" value={volume.toLocaleString()} onChange={(e) => { const v = parseInt(e.target.value.replace(/[^0-9]/g, "")) || 0; setVolume(Math.min(Math.max(v, 1000), 500000)); }}
                      className="flex-1 h-10 rounded-md border border-border bg-background px-3 text-lg font-bold outline-none focus:ring-1 focus:ring-primary" />
                  </div>
                  <input type="range" min="5000" max="200000" step="1000" value={volume} onChange={(e) => setVolume(parseInt(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer"
                    style={{ background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${((volume - 5000) / 195000) * 100}%, hsl(var(--muted)) ${((volume - 5000) / 195000) * 100}%, hsl(var(--muted)) 100%)` }} />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {costs.map((c) => (
                    <div key={c.name} className={`text-center p-4 rounded-xl border ${c.name === "TechSavvy" ? "border-primary/30 bg-primary/5" : "border-border/50"}`}>
                      <div className="text-xs text-muted-foreground mb-1">{c.name}</div>
                      <div className={`text-xl sm:text-2xl font-extrabold ${c.color}`}>{fmt(c.annual)}</div>
                      <div className="text-[10px] text-muted-foreground">per year</div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/15 text-center">
                  <p className="text-sm font-semibold text-primary">
                    With TechSavvy, you save {fmt(Math.min(costs[1].annual, costs[2].annual, costs[3].annual, costs[4].annual))}–{fmt(Math.max(costs[1].annual, costs[2].annual, costs[3].annual, costs[4].annual))} per year compared to other processors
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Why They Switch */}
      <section className="pb-16 sm:pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">Why Businesses Switch to TechSavvy</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Gift, title: "Free equipment if you qualify", desc: "Merchants processing $5K+/month get a free terminal. $10K+/month? You could qualify for a full POS system — delivered to your door at zero cost." },
              { icon: MapPin, title: "Real tech support, not hold music", desc: "No 1-800 numbers. No paying an employee to troubleshoot. In Hawai'i, we come to you in person. Everywhere else, we connect live via Zoom, Discord, AnyDesk, or your preferred platform." },
              { icon: Heart, title: "We invest in your business", desc: "When you work with TechSavvy, we invest right back into yours — qualifying merchants get free equipment, zero fees, and all the tech support handled for them." },
            ].map((r) => (
              <motion.div key={r.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <Card className="h-full border-border/50">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <r.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-bold mb-2">{r.title}</h3>
                    <p className="text-sm text-muted-foreground">{r.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-16 sm:pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-background to-emerald-500/10 border border-primary/20 p-8 sm:p-12 text-center">
            <Gift className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">See If You Qualify</h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Qualifying merchants get free equipment, zero processing fees, and hands-on tech support — in person in Hawai'i, or live via Zoom, Discord, or AnyDesk anywhere in the country. Apply in 5 minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button size="lg" asChild>
                <Link href="/schedule">
                  <Calendar className="w-4 h-4" />
                  Book a Free Meeting
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/statement-review">
                  See How Much You're Losing
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
