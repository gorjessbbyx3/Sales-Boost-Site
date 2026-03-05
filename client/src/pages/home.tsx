import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, useInView } from "framer-motion";
import {
  CreditCard, Globe, ShieldCheck, Check, ArrowRight, ChevronRight, ChevronDown,
  Zap, Clock, DollarSign, TrendingUp, Star, Users, Phone, Headphones,
  MapPin, AlertTriangle, Sparkles, Calculator, Receipt,
  Monitor, Smartphone, ShoppingCart, FileText, Lock, Wallet,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { fadeUp, staggerContainer, scaleIn } from "@/lib/animations";
import Layout from "@/components/layout";
import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";

// ─── Animations ─────────────────────────────────────────────────────────────

function AnimatedCounter({ target, prefix = "", suffix = "", duration = 2 }: { target: number; prefix?: string; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView || !ref.current) return;
    let startTime: number;
    let animationId: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      if (ref.current) ref.current.textContent = `${prefix}${current.toLocaleString()}${suffix}`;
      if (progress < 1) animationId = requestAnimationFrame(step);
    };
    animationId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationId);
  }, [inView]);
  return <span ref={ref}>{prefix}0{suffix}</span>;
}

// ─── 1. Hero ────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative pt-24 pb-16 sm:pt-36 sm:pb-24 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/8 via-primary/3 to-transparent" />
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] rounded-full bg-primary/8 blur-[150px]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="max-w-4xl mx-auto text-center" variants={staggerContainer} initial="hidden" animate="visible">
          <motion.h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6" variants={fadeUp}>
            <span className="bg-gradient-to-r from-primary via-emerald-300 to-primary bg-clip-text text-transparent">Eliminate</span>{" "}
            Unnecessary Processing Fees
            <br />
            <span className="text-2xl sm:text-3xl lg:text-4xl text-muted-foreground font-bold mt-2 block">
              With <span className="text-primary">TechSavvy.</span>
            </span>
          </motion.h1>

          <motion.p className="text-base sm:text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto" variants={fadeUp}>
            TechSavvy helps local Hawaii business owners keep more of what they earn with simple, transparent payment solutions customized for small businesses.
          </motion.p>

          <motion.div variants={fadeUp}>
            <Button size="lg" className="text-base px-8 py-6" asChild>
              <a href="#contact-form">
                Discover the TechSavvy Difference
                <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── 2. Keep More / Value Prop ──────────────────────────────────────────────

function KeepMoreSection() {
  return (
    <section className="py-16 sm:py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-5">
              Keep More of What You Earn
              <br />
              <span className="text-muted-foreground">with <span className="text-primary font-extrabold">Hawaii's Own</span> Payment Processor</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
              TechSavvy helps business owners keep more of what they earn with simple, transparent payment solutions. No contracts, no hidden fees. Just seamless transactions designed to maximize your bottom line with our Cash Back model and local Hawaii support.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
            <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 p-8 sm:p-12 text-center">
              <div className="text-6xl sm:text-8xl font-extrabold text-primary mb-3">$0</div>
              <div className="text-lg sm:text-xl font-semibold text-foreground mb-1">Monthly Processing Fees</div>
              <div className="text-sm text-muted-foreground">with TechSavvy's Cash Back program</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── 3. Equipment Upgrade ───────────────────────────────────────────────────

function EquipmentSection() {
  return (
    <section className="py-16 sm:py-24 relative">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-card/50 via-transparent to-card/50" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="order-2 lg:order-1">
            <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-muted/30 to-muted/10 border border-border/50 p-8 sm:p-12">
              <img src="/images/terminal-399.png" alt="TechSavvy payment terminal" className="w-full max-w-xs mx-auto object-contain" />
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="order-1 lg:order-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-5">
              Upgrade your current equipment for <span className="text-primary">no extra cost.</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-4">
              You don't have to keep using outdated tech just because switching feels like a hassle. With TechSavvy, we make it easy to upgrade your payment setup without spending a dime on the hardware.
            </p>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-6">
              If your business qualifies, we'll hook you up with state-of-the-art equipment at zero cost. Plus, our team handles the setup so you're not stuck figuring it out alone.
            </p>
            <p className="text-foreground font-bold text-lg">New tech. No cost. No headaches.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── 4. Cash Back / Put Thousands Back ───────────────────────────────────

function DualPricingSection() {
  return (
    <section className="py-16 sm:py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-5">
              Put <span className="text-primary">Thousands</span> Back Into Your Business
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-6">
              TechSavvy's Cash Back system gives your customers the choice: pay the standard price with a card or get a discount for paying with cash. It's simple, transparent, and fully compliant — so you stop giving away 2–4% of every sale.
            </p>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-8">
              Whether you run a shop, restaurant, or service biz, we'll help you keep more of your hard-earned money.
            </p>
            <ul className="space-y-3">
              {[
                "Get a terminal at no cost",
                "Eliminate processing fees with Cash Back",
                "No contracts or sign-up fees",
                "Keep more of your profits where they belong: in your pocket",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-foreground/90">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="grid grid-cols-3 gap-3 sm:gap-5">
              {[
                { value: 5400, prefix: "$", suffix: "+", label: "Avg Saved/Year", color: "text-primary" },
                { value: 0, prefix: "$", suffix: "", label: "Monthly Fees", color: "text-foreground" },
                { value: 100, prefix: "", suffix: "%", label: "Revenue Kept", color: "text-foreground" },
              ].map((stat) => (
                <Card key={stat.label} className="text-center border-primary/10">
                  <CardContent className="p-4 sm:p-6">
                    <div className={`text-2xl sm:text-4xl font-extrabold ${stat.color} mb-1`}>
                      <AnimatedCounter target={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                    </div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── 5. Savings Calculator ──────────────────────────────────────────────────

function SavingsCalculator() {
  const [volume, setVolume] = useState(50000);
  const [rate, setRate] = useState(3.3);
  const ohanaFee = 15;
  const monthlyFees = volume * (rate / 100);
  const monthlySavings = monthlyFees - ohanaFee;
  const annualSavings = monthlySavings * 12;
  const fmt = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  return (
    <section className="py-16 sm:py-24 relative" id="calculator">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
          <motion.div className="text-center mb-10 sm:mb-14" variants={fadeUp}>
            <Badge variant="outline" className="mb-4 text-primary border-primary/30 bg-primary/5">
              <Calculator className="w-3 h-3 mr-1.5" />
              Calculate Your Savings
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-3">How Much Could You Save?</h2>
            <p className="text-muted-foreground text-sm sm:text-lg max-w-xl mx-auto">
              Use our calculator to see how much your business could save annually with TechSavvy
            </p>
          </motion.div>

          <motion.div variants={fadeUp}>
            <Card className="border-primary/15 overflow-visible">
              <CardContent className="p-6 sm:p-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                  <div>
                    <h3 className="text-lg font-bold mb-6">Enter Your Business Details</h3>
                    <div className="mb-6">
                      <label className="text-sm font-medium mb-2 block">Monthly Credit Card Volume</label>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-muted-foreground">$</span>
                        <input type="text" inputMode="numeric" value={volume.toLocaleString()} onChange={(e) => { const v = parseInt(e.target.value.replace(/[^0-9]/g, "")) || 0; setVolume(Math.min(Math.max(v, 1000), 500000)); }}
                          className="flex-1 h-10 rounded-md border border-border bg-background px-3 text-lg font-bold outline-none focus:ring-1 focus:ring-primary" />
                      </div>
                      <input type="range" min="1000" max="500000" step="1000" value={volume} onChange={(e) => setVolume(parseInt(e.target.value))}
                        className="w-full h-2 rounded-full appearance-none cursor-pointer accent-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer"
                        style={{ background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${((volume - 1000) / 499000) * 100}%, hsl(var(--muted)) ${((volume - 1000) / 499000) * 100}%, hsl(var(--muted)) 100%)` }} />
                      <div className="flex justify-between mt-1 text-xs text-muted-foreground"><span>$1,000</span><span>$50,000</span><span>$100,000</span></div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Current Processing Rate</label>
                      <div className="flex items-center gap-2">
                        <input type="number" min="1" max="6" step="0.1" value={rate} onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
                          className="w-24 h-10 rounded-md border border-border bg-background px-3 text-lg font-bold outline-none focus:ring-1 focus:ring-primary" />
                        <span className="text-muted-foreground">%</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold mb-6">Your Estimated Savings</h3>
                    <Card className="border-primary/20 mb-6">
                      <CardContent className="p-6 text-center">
                        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Annual Savings with TechSavvy</div>
                        <div className="text-4xl sm:text-5xl font-extrabold text-primary">{fmt(annualSavings)}</div>
                        <div className="text-xs text-muted-foreground mt-2">Based on your monthly volume and processing rate</div>
                      </CardContent>
                    </Card>
                    <div className="space-y-3">
                      {[
                        { label: "Monthly Credit Card Volume:", value: fmt(volume) },
                        { label: "Monthly Processing Fees:", value: fmt(monthlyFees) },
                        { label: "TechSavvy Fee:", value: fmt(ohanaFee) },
                        { label: "Monthly Savings:", value: fmt(monthlySavings) },
                      ].map((row) => (
                        <div key={row.label} className="flex items-center justify-between text-sm border-b border-border/30 pb-2">
                          <span className="text-muted-foreground">{row.label}</span>
                          <span className="font-semibold text-foreground">{row.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── 6. Pricing Models ──────────────────────────────────────────────────────

function PricingModels() {
  const models = [
    {
      title: "Interchange Plus",
      desc: "Interchange Plus pricing gives you complete transparency, with separate costs for the actual transaction and a small fixed fee. It's ideal for businesses that want clear, predictable costs with no hidden fees.",
      features: ["Transparent Rates", "Easy To Understand", "Competitive Pricing", "Easy To Implement"],
      accent: "border-border/50",
    },
    {
      title: "Cash Back",
      desc: "With Cash Back, your customers choose between cash or card payments, and processing fees are automatically adjusted. It's a simple way to eliminate your processing costs without sacrificing customer satisfaction.",
      features: ["No Processing Costs", "Boosts Bottom Line", "Simple To Implement", "Most Popular"],
      accent: "border-primary/30 ring-1 ring-primary/10",
      popular: true,
    },
    {
      title: "Surcharge",
      desc: "The Surcharge program adds a small fee to credit card transactions, helping offset your processing costs while keeping your pricing competitive. It's compliant, transparent, and designed to save your business money.",
      features: ["Save 30-60%", "Fully Compliant", "Easy to Understand", "Maximizes Profitability"],
      accent: "border-border/50",
    },
  ];

  return (
    <section className="py-16 sm:py-24 relative">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-card/50 via-transparent to-card/50" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
          <motion.div className="text-center mb-10 sm:mb-14" variants={fadeUp}>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-3">
              Pricing that <span className="text-primary">grows</span> your business
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {models.map((m) => (
              <motion.div key={m.title} variants={fadeUp}>
                <Card className={`h-full relative overflow-hidden ${m.accent}`}>
                  {m.popular && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
                  )}
                  <CardContent className="p-6 sm:p-8">
                    {m.popular && <Badge className="mb-4 bg-primary/15 text-primary border-primary/30">Most Popular</Badge>}
                    <h3 className="text-xl font-bold mb-3">{m.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6">{m.desc}</p>
                    <ul className="space-y-2.5">
                      {m.features.map((f) => (
                        <li key={f} className="flex items-center gap-2.5 text-sm">
                          <Check className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className={m.popular ? "font-semibold text-foreground" : "text-foreground/80"}>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── 7. Trust / Values Section ──────────────────────────────────────────────

function TrustSection() {
  const badges = [
    "Next Day Funding", "No Cancel Fees", "24/7 Phone + Online Support",
    "No Contracts", "Accept All Cards", "Rates Locked In", "Local Hawaii Support",
  ];

  return (
    <section className="py-16 sm:py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-5">
              Honest answers. <span className="text-primary">Honest pricing.</span> No contracts.
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-8">
              In Hawaii, your word is your bond. At TechSavvy, we bring traditional island values to payment processing with straightforward pricing and honest business practices. As a locally-owned company, our reputation in the community matters. If we can't save you money or help your business, we'll tell you straight. It's why we never lock you in with a long term contract. We prefer to earn your business every month!
            </p>
            <div className="flex flex-wrap gap-3">
              {badges.map((b) => (
                <div key={b} className="flex items-center gap-2 bg-primary/5 border border-primary/15 rounded-full px-4 py-2">
                  <Check className="w-3.5 h-3.5 text-primary" />
                  <span className="text-sm font-medium text-foreground/90">{b}</span>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 p-8 sm:p-12 text-center">
              <ShieldCheck className="w-16 h-16 text-primary mx-auto mb-4" />
              <div className="text-2xl font-bold text-foreground mb-2">Trusted by Hawaii Businesses</div>
              <div className="text-muted-foreground">Local support. Zero hidden fees. Zero contracts.</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── 8. Payment Solutions Grid ──────────────────────────────────────────────

function PaymentSolutions() {
  const solutions = [
    { icon: Monitor, title: "In Store Terminals", desc: "Fast, secure terminals for smooth in-store transactions and happy customers." },
    { icon: Smartphone, title: "Mobile Terminals", desc: "Accept payments anywhere with flexible, portable, and secure mobile devices." },
    { icon: Globe, title: "Online Gateways", desc: "Simplify e-commerce with secure, seamless online payment processing solutions." },
    { icon: ShoppingCart, title: "POS Equipment", desc: "Modern point-of-sale systems that manage payments, inventory, and customers." },
    { icon: CreditCard, title: "Virtual Terminal", desc: "Accept card payments remotely through any device with no hardware required." },
    { icon: FileText, title: "Invoicing", desc: "Send professional invoices with built-in payment options to get paid faster." },
  ];

  return (
    <section className="py-16 sm:py-24 relative">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-card/50 via-transparent to-card/50" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
          <motion.div className="text-center mb-10 sm:mb-14" variants={fadeUp}>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-3">
              Complete <span className="text-primary">Payment Solutions</span> for
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-muted-foreground mb-4">Hawaii's Local Businesses</h3>
            <p className="text-muted-foreground text-sm sm:text-lg max-w-xl mx-auto">
              From beachside food trucks to luxury resorts, we have island-optimized solutions for every business type.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {solutions.map((s) => (
              <motion.div key={s.title} variants={fadeUp}>
                <Card className="h-full border-border/50 hover:border-primary/30 transition-colors">
                  <CardContent className="p-6 sm:p-8 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <s.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── 9. Support Section ─────────────────────────────────────────────────────

function SupportSection() {
  return (
    <section className="py-16 sm:py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-5">
              Real Support.
              <br />
              <span className="text-primary">Real People.</span>
              <br />
              No Runaround.
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-6">
              No phone trees. No overseas call centers. Just real humans who care about your business and answer when you call.
            </p>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-8">
              From setup to troubleshooting to growth, we're with you every step of the way. Your dedicated, local TechSavvy account specialist is just a call or text away.
            </p>
            <ul className="space-y-3">
              {[
                "24/7 U.S. and Hawaii based support",
                "Dedicated account managers who know your business",
                "Local Island reps",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-foreground/90 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 p-8 sm:p-12 text-center">
              <Headphones className="w-16 h-16 text-primary mx-auto mb-4" />
              <div className="text-2xl font-bold text-foreground mb-2">Always Here For You</div>
              <div className="text-muted-foreground mb-6">Call, text, or email — we respond fast.</div>
              <Button size="lg" variant="outline" asChild>
                <a href="tel:8087449999">
                  <Phone className="w-4 h-4" />
                  Call Us Now
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── 10. Testimonials ───────────────────────────────────────────────────────

function TestimonialSection() {
  const testimonials = [
    { name: "Local Restaurant Owner", role: "Waikiki", rating: 5, quote: "Being a small local business, we love working with and supporting other small local businesses too. TechSavvy has always provided us with great customer service and I highly recommend them." },
    { name: "Nail Salon Owner", role: "Kailua", rating: 5, quote: "We appreciate TechSavvy's excellent local customer support. When we decided to switch to a modern terminal, it was a very simple process. We also appreciate that we were able to get it at no cost." },
    { name: "Eye Care Associates", role: "Ala Moana", rating: 5, quote: "TechSavvy has consistently provided us with excellent service. Whenever we need assistance, their team is always quick to respond and incredibly helpful. We highly recommend them." },
    { name: "Spa Owner", role: "Waikiki", rating: 5, quote: "TechSavvy has always given me great service, great rates and quality equipment. I definitely recommend you give them a try." },
  ];

  return (
    <section className="py-16 sm:py-24 relative">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-card/50 via-transparent to-card/50" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
          <motion.div className="text-center mb-10 sm:mb-14" variants={fadeUp}>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-3">
              Our Clients <span className="text-primary">Love</span> The Program
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {testimonials.map((t, i) => (
              <motion.div key={i} variants={fadeUp}>
                <Card className="h-full border-border/50">
                  <CardContent className="p-5 sm:p-6">
                    <div className="flex items-center gap-0.5 mb-3">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm text-foreground/90 leading-relaxed mb-4 italic">"{t.quote}"</p>
                    <div className="font-semibold text-sm text-foreground">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── 11. FAQ ────────────────────────────────────────────────────────────────

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);
  const faqs = [
    { q: "How much can I save with TechSavvy?", a: "With our Cash Back program, you can eliminate up to 100% of processing fees, keeping more revenue in your business." },
    { q: "How does Cash Back work?", a: "We set up your system to offer a cash price and a card price — allowing your customers to cover processing costs when they pay with a card." },
    { q: "What kind of businesses do you work with?", a: "We serve restaurants, retail stores, service providers, and B2B businesses — anyone who processes payments." },
    { q: "Are there any contracts or sign up fees?", a: "Nope! No contracts, no sign-up fees, no hidden costs. Just simple, transparent pricing." },
    { q: "How do I qualify for a free terminal?", a: "If you process $5K+ per month and enroll in our Cash Back program, you qualify for a free device!" },
    { q: "How long does it take to get set up?", a: "Most businesses are fully operational within 3–7 days after approval." },
  ];

  return (
    <section className="py-16 sm:py-24 relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
          <motion.div className="text-center mb-10 sm:mb-14" variants={fadeUp}>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Frequently Asked <span className="text-primary">Questions...</span>
            </h2>
          </motion.div>
          <motion.div className="space-y-3" variants={fadeUp}>
            {faqs.map((faq, i) => (
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
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── 12. Contact Form ───────────────────────────────────────────────────────

function ContactFormSection() {
  const [formData, setFormData] = useState({ businessName: "", contactName: "", phone: "", email: "", plan: "dual-pricing", highRisk: false, monthlyProcessing: "", bestContactTime: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact-leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      if (!res.ok) { const data = await res.json(); throw new Error(data.error || "Failed to submit"); }
      setSubmitted(true);
    } catch (err: any) { setError(err.message || "Something went wrong."); } finally { setSubmitting(false); }
  };
  const set = (field: string, value: string | boolean) => setFormData((prev) => ({ ...prev, [field]: value }));

  if (submitted) {
    return (
      <section className="py-16 sm:py-24" id="contact-form">
        <div className="max-w-2xl mx-auto px-4">
          <Card className="border-primary/20">
            <CardContent className="p-8 sm:p-12 text-center">
              <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-4">
                <Check className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">Thank You!</h2>
              <p className="text-muted-foreground">We've received your information and will be in touch soon. Mahalo for choosing TechSavvy!</p>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  const inputClass = "flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary";

  return (
    <section className="py-16 sm:py-24 relative" id="contact-form">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
              Ready to learn How Much You
              <br />Could save with <span className="text-primary">TechSavvy?</span>
            </h2>
          </div>

          <Card className="border-primary/15">
            <CardContent className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Business Name *</label>
                  <input required value={formData.businessName} onChange={(e) => set("businessName", e.target.value)} placeholder="Your Business Name" className={inputClass} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Contact Name *</label>
                    <input required value={formData.contactName} onChange={(e) => set("contactName", e.target.value)} placeholder="Your Name" className={inputClass} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Phone *</label>
                    <input type="tel" required value={formData.phone} onChange={(e) => set("phone", e.target.value)} placeholder="(808) 555-1234" className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Email *</label>
                  <input type="email" required value={formData.email} onChange={(e) => set("email", e.target.value)} placeholder="you@business.com" className={inputClass} />
                </div>

                {error && <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-sm text-destructive">{error}</div>}

                <p className="text-[10px] text-muted-foreground">
                  By submitting, I agree to the Privacy Policy and Terms of Use for TechSavvy Hawaii. Standard message and data rates may apply.
                </p>

                <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                  {submitting ? "Submitting..." : "SUBMIT"}
                  {!submitting && <ArrowRight className="w-4 h-4" />}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Page Export ─────────────────────────────────────────────────────────────

export default function Home() {
  useSEO({
    title: "TechSavvy Hawaii | Eliminate Processing Fees | Hawaii's Payment Processor",
    description: "TechSavvy helps local Hawaii business owners keep more of what they earn with simple, transparent payment solutions. No contracts, no hidden fees. Cash Back, free terminals, local support.",
    keywords: "payment processing Hawaii, zero-fee processing Honolulu, Cash Back Hawaii, eliminate processing fees, merchant services Hawaii, POS terminal Hawaii, TechSavvy Hawaii",
    canonical: "https://techsavvyhawaii.com/",
    ogImage: "https://techsavvyhawaii.com/images/hero-hawaii-sunset.jpg",
  });

  return (
    <Layout>
      <HeroSection />
      <KeepMoreSection />
      <EquipmentSection />
      <DualPricingSection />
      <SavingsCalculator />
      <PricingModels />
      <TrustSection />
      <PaymentSolutions />
      <SupportSection />
      <TestimonialSection />
      <FAQSection />
      <ContactFormSection />
    </Layout>
  );
}
