import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  CreditCard, Check, ArrowRight, DollarSign, ShieldCheck,
  Zap, Phone, FileText, BarChart3, Users, Headphones, ChevronDown,
  Banknote, Building, ArrowDown, Smartphone,
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
    description: "See how Hawaii businesses eliminate credit card processing fees. Customer pays with card, service fee covers processing, you keep 100%. Next-day deposits.",
    keywords: "cash discount program Hawaii, how to eliminate credit card fees, surcharge program, dual pricing Hawaii",
    canonical: "https://techsavvyhawaii.com/how-it-works",
  });

  const faqs = [
    { q: "Is this actually legal?", a: "Yes — 100% legal in Hawaii and all 50 states. Visa, Mastercard, and the FTC all allow cash discount and surcharge programs when properly disclosed. We handle all compliance and signage for you." },
    { q: "What's the difference between cash discount and surcharge?", a: "Cash discount: your prices include a small service fee, and cash customers get a discount. Surcharge: your prices are the base price, and card customers pay a small surcharge. Same result — you keep 100% either way. We set up whichever model fits your business best." },
    { q: "Will my customers get mad?", a: "Most don't even notice. It's the same model gas stations have used for years. The terminal clearly shows the amount before the customer confirms. Many just pay with cash instead — which saves you even more." },
    { q: "How much will I actually save?", a: "Depends on your volume. Most Hawaii businesses save $500–$3,000+ per month. Upload your statement to our free analysis tool and we'll show you your exact number." },
    { q: "Is it hard to switch processors?", a: "Not at all. We handle everything — equipment, programming, signage, training. Most businesses are up and running in 3–7 days." },
    { q: "What if I don't like it?", a: "No contract. No cancellation fee. Leave anytime with zero penalty." },
    { q: "Do I have to buy the terminal?", a: "No — all equipment is free during our Hawaii launch promotion. We ship it, set it up, and train your team." },
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
                <Zap className="w-3 h-3 mr-1" /> Zero Processing Fees
              </Badge>
            </motion.div>
            <motion.h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-5" variants={fadeUp}>
              How You <span className="text-primary">Keep 100%</span> of Every Sale
            </motion.h1>
            <motion.p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto" variants={fadeUp}>
              Right now, every card swipe costs you 2–4%. Our cash discount program makes that someone else's problem — not yours.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* How it works — the receipt */}
      <section className="py-12 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">This is what it looks like at checkout</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Card payments include a small service fee that covers processing. Cash payments get that fee removed as a discount. Either way — you keep 100% of the sale.</p>
            </div>
            <div className="max-w-2xl mx-auto">
              <img
                src="/images/cash-discount-receipt.jpeg"
                alt="Cash discount receipt comparison — credit card payment with service fee vs cash payment with discount applied"
                className="w-full rounded-xl border border-border/30 shadow-lg"
                loading="lazy"
              />
            </div>
            <p className="text-center text-sm text-muted-foreground mt-6 max-w-lg mx-auto">
              The "Service Fee" covers card processing costs. When your customer pays with cash, that fee is removed as a discount. <span className="text-foreground font-semibold">You keep the full subtotal — every transaction.</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Two Options — Cash Discount vs Surcharge */}
      <section className="py-12 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <motion.div className="text-center mb-10" variants={fadeUp}>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">Two programs, same result: <span className="text-primary">you pay $0</span></h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">We'll help you pick the model that fits your business best.</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <motion.div variants={fadeUp}>
                <Card className="h-full border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><Banknote className="w-5 h-5 text-primary" /></div>
                      <h3 className="font-bold text-lg">Cash Discount</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">Your listed prices include a small service fee. Customers who pay cash get a discount (the fee is removed). Card customers pay the listed price.</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2"><Check className="w-4 h-4 text-primary shrink-0" />Most popular option</div>
                      <div className="flex items-center gap-2"><Check className="w-4 h-4 text-primary shrink-0" />Works for all card brands</div>
                      <div className="flex items-center gap-2"><Check className="w-4 h-4 text-primary shrink-0" />Encourages cash payments</div>
                      <div className="flex items-center gap-2"><Check className="w-4 h-4 text-primary shrink-0" />Simple signage — we provide it</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={fadeUp}>
                <Card className="h-full border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><CreditCard className="w-5 h-5 text-primary" /></div>
                      <h3 className="font-bold text-lg">Surcharge</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">Your listed prices are the base price. Card customers see a small surcharge added at the terminal. Cash customers pay the listed price as-is.</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2"><Check className="w-4 h-4 text-primary shrink-0" />Simpler pricing display</div>
                      <div className="flex items-center gap-2"><Check className="w-4 h-4 text-primary shrink-0" />Surcharge shown before confirmation</div>
                      <div className="flex items-center gap-2"><Check className="w-4 h-4 text-primary shrink-0" />FTC & card brand compliant</div>
                      <div className="flex items-center gap-2"><Check className="w-4 h-4 text-primary shrink-0" />Great for service businesses</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            <motion.p className="text-center text-xs text-muted-foreground mt-6 max-w-xl mx-auto" variants={fadeUp}>
              Both programs are 100% legal and compliant. We handle all signage, terminal programming, and disclosures. You just run your business.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Getting Started Steps */}
      <section className="py-12 sm:py-20 bg-card/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <motion.div className="text-center mb-10" variants={fadeUp}>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Getting Started Takes 3 Steps</h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { num: "01", icon: FileText, title: "Tell us about your business", desc: "Quick application or phone call. We'll review your current statement and show you what you're really paying in hidden fees." },
                { num: "02", icon: Zap, title: "We handle everything", desc: "Our local team delivers your free equipment, installs signage, and trains your staff. You don't figure out a single thing." },
                { num: "03", icon: DollarSign, title: "You stop paying fees", desc: "Processing fees are no longer your problem. 100% of your sales go into your bank account. Next business day." },
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

      {/* FAQ */}
      <section className="py-12 sm:py-20" id="faq">
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
      <section className="py-12 sm:py-20 bg-card/50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Card className="border-primary/20 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
              <CardContent className="p-8 sm:p-12 relative">
                <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">See what you're really paying.</h2>
                <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                  Upload your processing statement and we'll break down every hidden fee — interchange markups, PCI charges, batch fees, statement fees. Most merchants have no idea how much they're actually losing.
                </p>
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
