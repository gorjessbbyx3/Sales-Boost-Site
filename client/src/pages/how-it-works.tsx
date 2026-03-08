import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  CreditCard, Check, ArrowRight, Clock, DollarSign, ShieldCheck,
  Zap, Phone, FileText, BarChart3, Users, Headphones, ChevronDown, HelpCircle,
  Receipt, BadgeDollarSign,
} from "lucide-react";
import { useState } from "react";
import { fadeUp, staggerContainer } from "@/lib/animations";
import Layout from "@/components/layout";
import { useSEO } from "@/hooks/useSEO";
import { Link } from "wouter";

function FAQAccordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-3">
      {items.map((faq, i) => (
        <Card key={i} className="border-border/50 overflow-hidden cursor-pointer" onClick={() => setOpen(open === i ? null : i)}>
          <CardContent className="p-0">
            <button className="w-full p-5 flex items-center justify-between text-left">
              <span className="font-bold text-foreground pr-4">{faq.q}</span>
              <ChevronDown className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`} />
            </button>
            {open === i && (
              <div className="px-5 pb-5 -mt-1">
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function HowItWorksPage() {
  useSEO({
    title: "How the Cash Discount Program Works | TechSavvy Hawaii",
    description: "See how Hawaii businesses eliminate credit card processing fees with TechSavvy's cash discount program. Simple 3-step setup, free equipment, no contracts.",
    keywords: "cash discount program Hawaii, how to eliminate credit card fees, zero processing fees, dual pricing Hawaii",
    canonical: "https://techsavvyhawaii.com/how-it-works",
  });

  const faqs = [
    { q: "Is this actually legal?", a: "Yes — 100% legal in Hawaii and all 50 states. Visa, Mastercard, and the FTC all allow cash discount / dual pricing programs when properly disclosed. We handle all compliance and signage for you." },
    { q: "Will my customers get mad about the surcharge?", a: "Most don't even notice. It's the same model gas stations have used for years — cash price vs. card price. It's now standard at restaurants, salons, and retail stores across Hawaii." },
    { q: "Is it hard to switch processors?", a: "Not at all. We handle everything — equipment, programming, signage, training. Most businesses are up and running in 3–7 days. You don't cancel your old processor until you're ready." },
    { q: "How much will I actually save?", a: "That depends on your volume, but most Hawaii businesses save $500–$3,000+ per month. Upload your statement to our free analysis tool and we'll show you your exact number — no commitment required." },
    { q: "What if I don't like it?", a: "No contract. No cancellation fee. If it's not working for you, you can leave anytime with zero penalty." },
    { q: "Do I have to buy the terminal?", a: "No — all equipment is free during our Hawaii launch promotion. Pick any terminal or POS system and there's no cost to you. We ship it, set it up, and train your team." },
    { q: "What kind of businesses do you work with?", a: "Restaurants, retail stores, auto repair, salons, medical offices, food trucks — anyone who accepts card payments. We also work with high-risk merchants." },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-12 sm:pt-36 sm:pb-20">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent" />
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div variants={fadeUp}>
              <Badge variant="outline" className="mb-4 text-primary border-primary/30 bg-primary/5">
                <Zap className="w-3 h-3 mr-1" /> Cash Discount Program
              </Badge>
            </motion.div>
            <motion.h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-5" variants={fadeUp}>
              How You <span className="text-primary">Stop Paying</span> Processing Fees
            </motion.h1>
            <motion.p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto" variants={fadeUp}>
              Right now, every time a customer swipes their card, you lose 2–4% of that sale to processing fees. Our cash discount program eliminates that entirely. Here's how it works.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* How Cash Discount Works */}
      <section className="py-14 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">The Cash Discount Model</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Your prices stay the same. Customers who pay with a card see a small service fee added at checkout. Customers who pay cash get the listed price. Either way — you keep 100%.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Before */}
              <Card className="border-red-500/20 bg-red-500/5">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center"><Receipt className="w-5 h-5 text-red-400" /></div>
                    <div>
                      <p className="font-bold text-red-400">Before TechSavvy</p>
                      <p className="text-xs text-muted-foreground">Traditional processing</p>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between p-2 rounded bg-background/50"><span>Customer pays</span><span className="font-semibold">$100.00</span></div>
                    <div className="flex justify-between p-2 rounded bg-red-500/10"><span className="text-red-400">Processing fee (3.5%)</span><span className="font-semibold text-red-400">-$3.50</span></div>
                    <div className="flex justify-between p-2 rounded bg-red-500/10"><span className="text-red-400">PCI compliance fee</span><span className="font-semibold text-red-400">-$0.15</span></div>
                    <div className="flex justify-between p-2 rounded bg-red-500/10"><span className="text-red-400">Batch / statement fees</span><span className="font-semibold text-red-400">-$0.10</span></div>
                    <div className="border-t pt-2 flex justify-between font-bold"><span>You actually keep</span><span className="text-red-400">$96.25</span></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">That's $3.75 gone on a single $100 sale. Multiply by hundreds of transactions a month.</p>
                </CardContent>
              </Card>

              {/* After */}
              <Card className="border-primary/20 bg-primary/5 ring-2 ring-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><BadgeDollarSign className="w-5 h-5 text-primary" /></div>
                    <div>
                      <p className="font-bold text-primary">With TechSavvy</p>
                      <p className="text-xs text-muted-foreground">Cash discount program</p>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between p-2 rounded bg-background/50"><span>Your listed price</span><span className="font-semibold">$100.00</span></div>
                    <div className="flex justify-between p-2 rounded bg-primary/10"><span className="text-primary">Card customer pays</span><span className="font-semibold text-primary">$103.99</span></div>
                    <div className="flex justify-between p-2 rounded bg-background/50"><span>Cash customer pays</span><span className="font-semibold">$100.00</span></div>
                    <div className="flex justify-between p-2 rounded bg-primary/10"><span className="text-primary">Processing fee</span><span className="font-semibold text-primary">$0.00</span></div>
                    <div className="border-t pt-2 flex justify-between font-bold"><span>You keep</span><span className="text-primary">$100.00</span></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">The card surcharge covers the processing cost. You keep every dollar of every sale — card or cash.</p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3 Steps */}
      <section className="py-14 sm:py-20 bg-card/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <motion.div className="text-center mb-12" variants={fadeUp}>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">Getting Started Takes 3 Steps</h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { num: "01", icon: FileText, title: "Tell us about your business", desc: "Fill out a quick application or give us a call. We'll look at your current statement and show you exactly how much you're losing to hidden fees every month." },
                { num: "02", icon: Zap, title: "We handle everything", desc: "Our local Hawaii team delivers your free equipment, installs the compliant signage, and trains your staff. You don't figure out a single thing." },
                { num: "03", icon: DollarSign, title: "You stop paying fees", desc: "From day one, processing fees are no longer your problem. Card customers pay a small surcharge. Cash customers pay the listed price. You keep 100%." },
              ].map((step) => (
                <motion.div key={step.num} variants={fadeUp}>
                  <Card className="h-full border-border/50">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <step.icon className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-3xl font-extrabold text-primary/15">{step.num}</span>
                      </div>
                      <h3 className="font-bold text-base mb-2">{step.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-14 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <motion.div className="text-center mb-10" variants={fadeUp}>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">What You Get</h2>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { icon: Clock, title: "3–7 Day Setup", desc: "Most businesses are live and processing within a week." },
                { icon: ShieldCheck, title: "Fully Compliant", desc: "Legal in all 50 states. We handle all disclosures and signage." },
                { icon: CreditCard, title: "Accept All Cards", desc: "Chip, swipe, tap, Apple Pay, Google Pay — all accepted." },
                { icon: BarChart3, title: "Real-Time Dashboard", desc: "Track every transaction, deposit, and refund from your phone." },
                { icon: Headphones, title: "Local Hawaii Support", desc: "Real people based in Hawaii. Call, text, or email anytime." },
                { icon: Users, title: "No Contracts", desc: "We earn your business every month. Leave whenever you want." },
              ].map((f) => (
                <motion.div key={f.title} variants={fadeUp}>
                  <Card className="h-full border-border/50">
                    <CardContent className="p-5">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                        <f.icon className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="font-bold mb-1 text-sm">{f.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 sm:py-20 bg-card/50" id="faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <motion.div className="text-center mb-10" variants={fadeUp}>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Questions you're probably thinking.</h2>
            </motion.div>
            <motion.div variants={fadeUp}>
              <FAQAccordion items={faqs} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Card className="border-primary/20 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
              <CardContent className="p-8 sm:p-12 relative">
                <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">See exactly what you're losing.</h2>
                <p className="text-muted-foreground mb-3 max-w-lg mx-auto">
                  Upload your processing statement and we'll break down every line — interchange markups, PCI fees, batch fees, statement fees, junk charges. Most merchants are paying 8–15 hidden fees and don't even know it.
                </p>
                <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">Free. No commitment. No one will call you unless you ask.</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Button size="lg" className="px-8" asChild>
                    <Link href="/statement-review">Free Statement Analysis <ArrowRight className="w-4 h-4" /></Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <a href="tel:8087675460"><Phone className="w-4 h-4" /> Call (808) 767-5460</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
