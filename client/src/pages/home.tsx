import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import {
  CreditCard,
  Globe,
  ShieldCheck,
  BarChart3,
  Check,
  ArrowRight,
  ChevronRight,
  Zap,
  Clock,
  DollarSign,
  TrendingUp,
  Star,
  Users,
  Award,
  CircleDollarSign,
  AlertTriangle,
  Timer,
  FileCheck,
  HeartHandshake,
  Palette,
  Code,
  MapPin,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { fadeUp, staggerContainer, scaleIn } from "@/lib/animations";
import Layout from "@/components/layout";
import { Link } from "wouter";

function AnimatedCounter({ target, prefix = "", suffix = "", duration = 2 }: { target: number; prefix?: string; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => `${prefix}${Math.round(v).toLocaleString()}${suffix}`);

  useEffect(() => {
    if (inView) {
      animate(count, target, { duration, ease: "easeOut" });
    }
  }, [inView, target, duration, count]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

function HeroSection() {
  return (
    <section
      className="relative overflow-hidden pt-28 pb-20 sm:pt-40 sm:pb-32"
      data-testid="section-hero"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/8 via-primary/3 to-transparent" />
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-100px] right-[-200px] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute top-1/3 left-[-100px] w-[300px] h-[300px] rounded-full bg-chart-4/5 blur-[80px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeUp}>
            <Badge variant="outline" className="mb-4 py-1.5 px-4 text-primary border-primary/30 bg-primary/5">
              <MapPin className="w-3.5 h-3.5 mr-1.5" />
              Proudly Serving Hawai'i
            </Badge>
            <Badge variant="outline" className="mb-8 ml-2 py-1.5 px-4 text-primary border-primary/30 bg-primary/5">
              <CircleDollarSign className="w-3.5 h-3.5 mr-1.5" />
              Save $3,600 - $5,400 Per Year
            </Badge>
          </motion.div>

          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] mb-8"
            variants={fadeUp}
            data-testid="text-hero-title"
          >
            Hawai'i's #1{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-primary via-emerald-300 to-primary bg-clip-text text-transparent">
                Zero-Fee
              </span>
            </span>{" "}
            Payment Processor
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto"
            variants={fadeUp}
            data-testid="text-hero-subtitle"
          >
            Serving Honolulu, Maui, Kona & all Hawaiian Islands. Starting at $399 for a payment terminal — or try free for 30 days. No monthly fees. No processing fees.
            Your customers cover the small surcharge — you keep{" "}
            <span className="text-primary font-semibold">100% of every sale</span>. Plus, get a{" "}
            <span className="text-primary font-semibold">free custom website</span> when you sign up.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            variants={fadeUp}
          >
            <Button size="lg" asChild>
              <Link href="/contact" data-testid="link-hero-get-terminal">
                Get Your Terminal
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="#how-it-works" data-testid="link-hero-learn-more">
                See How It Works
                <ChevronRight className="w-4 h-4" />
              </a>
            </Button>
          </motion.div>

          <motion.div
            className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground"
            variants={fadeUp}
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span data-testid="text-trust-pci">PCI Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <span data-testid="text-trust-setup">Same-Day Setup</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary" />
              <span data-testid="text-trust-fees">Zero Monthly Fees</span>
            </div>
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-primary" />
              <span>Free Custom Website</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-20 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {[
              { value: 5400, prefix: "$", suffix: "+", label: "Saved Per Year", color: "text-primary" },
              { value: 0, prefix: "$", suffix: "", label: "Monthly Fees", color: "text-foreground" },
              { value: 100, prefix: "", suffix: "%", label: "Revenue Kept", color: "text-foreground" },
            ].map((stat, i) => (
              <Card key={stat.label} className="overflow-visible text-center border-primary/10">
                <CardContent className="p-6 sm:p-8">
                  <div className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold ${stat.color} mb-2`} data-testid={`text-stat-${i}`}>
                    <AnimatedCounter target={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function SocialProofBar() {
  const stats = [
    { icon: Users, value: "500+", label: "Hawai'i Businesses Trust Us" },
    { icon: Star, value: "4.9/5", label: "Customer Rating" },
    { icon: TrendingUp, value: "$12M+", label: "Revenue Protected" },
    { icon: Award, value: "99.9%", label: "Uptime Guaranteed" },
  ];

  return (
    <section className="py-16 relative" data-testid="section-social-proof">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              className="text-center"
              variants={fadeUp}
            >
              <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-foreground mb-1" data-testid={`text-proof-${stat.label.toLowerCase().replace(/\s/g, "-")}`}>
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      title: "Choose Your Plan",
      description:
        "Buy outright for $399 (best value) or start a 30-day risk-free trial. No contracts, no commitments.",
      icon: CreditCard,
      accent: "from-primary/20 to-primary/5",
    },
    {
      step: "02",
      title: "Start Accepting Payments",
      description:
        "We set up and train you on your terminal. Accept cards in-store and online from day one.",
      icon: Zap,
      accent: "from-chart-2/20 to-chart-2/5",
    },
    {
      step: "03",
      title: "Keep 100% of Sales",
      description:
        "Your customers cover the small processing surcharge. You get 100% of your sale deposited into your account by the next business day.",
      icon: DollarSign,
      accent: "from-chart-3/20 to-chart-3/5",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-24 sm:py-32 relative"
      data-testid="section-how-it-works"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-20"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.div variants={fadeUp}>
            <Badge variant="outline" className="mb-5 text-primary border-primary/30 bg-primary/5">
              How It Works
            </Badge>
          </motion.div>
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-5"
            variants={fadeUp}
            data-testid="text-hiw-title"
          >
            Three Steps to{" "}
            <span className="bg-gradient-to-r from-primary to-emerald-300 bg-clip-text text-transparent">
              Zero Fees
            </span>
          </motion.h2>
          <motion.p
            className="text-muted-foreground max-w-2xl mx-auto text-lg"
            variants={fadeUp}
          >
            Traditional processors take 2-4% of every sale. Our model flips
            that — your customer pays a small surcharge, and you keep every
            dollar.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {steps.map((s, i) => (
            <motion.div key={s.step} variants={scaleIn}>
              <Card className="h-full relative overflow-visible border-primary/10">
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-b ${s.accent} opacity-50`} />
                <CardContent className="p-7 sm:p-8 relative">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 rounded-md bg-primary/15 flex items-center justify-center shrink-0">
                      <s.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-xs font-bold text-primary uppercase tracking-[0.2em]">
                      Step {s.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-foreground" data-testid={`text-step-title-${i}`}>
                    {s.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {s.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function PricingComparisonSection() {
  const option1Features = [
    "Professional countertop terminal",
    "Chip, swipe & contactless/NFC payments",
    "Online payment gateway access",
    "Full setup & programming included",
    "Free compliance signage kit",
    "Free statement analysis",
    "Zero monthly fees — forever",
    "Zero processing fees — forever",
  ];

  const option2Features = [
    "Free terminal loan for 30 days",
    "Live processing — real transactions",
    "Full setup & training included",
    "Return anytime within 30 days",
    "We cover return shipping",
    "Auto-purchase on day 31 ($599)",
    "Zero monthly fees after purchase",
    "Zero processing fees — forever",
  ];

  const option3Features = [
    "Virtual payment gateway setup",
    "Payment links, buttons & invoices",
    "Custom professional website (5-10 pages)",
    "Online ordering / booking integration",
    "Mobile-optimized & SEO-ready",
    "Full setup & training included",
    "Zero processing fees — forever",
    "Perfect for e-commerce & services",
  ];

  return (
    <section
      id="pricing"
      className="py-24 sm:py-32 relative"
      data-testid="section-pricing"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/50 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.div variants={fadeUp}>
            <Badge variant="outline" className="mb-5 text-primary border-primary/30 bg-primary/5">
              <DollarSign className="w-3.5 h-3.5 mr-1.5" />
              Pricing
            </Badge>
          </motion.div>
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-5"
            variants={fadeUp}
            data-testid="text-pricing-title"
          >
            Three Ways to{" "}
            <span className="bg-gradient-to-r from-primary to-emerald-300 bg-clip-text text-transparent">
              Get Started
            </span>
          </motion.h2>
          <motion.p
            className="text-muted-foreground max-w-2xl mx-auto text-lg"
            variants={fadeUp}
          >
            In-store terminal, risk-free trial, or online-only — pick the path that fits your Hawai'i business.
            Every option includes zero processing fees and a free custom website.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Option 1: Outright Purchase */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0 }}
          >
            <Card className="h-full overflow-visible relative border-primary/30">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-primary/8 to-transparent" />
              <div className="absolute -top-3 left-6">
                <Badge className="shadow-lg shadow-primary/20" data-testid="badge-best-value">Best Value</Badge>
              </div>
              <CardHeader className="pb-3 pt-8 relative">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="w-10 h-10 rounded-md bg-primary/15 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg" data-testid="text-option1-title">
                      In-Store Terminal
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">Own it from day one</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative space-y-5">
                <div className="text-center py-4">
                  <div className="text-sm text-muted-foreground mb-1">One-time payment</div>
                  <div className="flex items-baseline justify-center gap-1.5">
                    <span className="text-4xl sm:text-5xl font-extrabold text-primary" data-testid="text-option1-price">$399</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    <span className="line-through text-muted-foreground/60">$800+ retail</span>
                    <span className="ml-2 text-primary font-medium">Save 50%+</span>
                  </div>
                </div>

                <ul className="space-y-2.5">
                  {option1Features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-2 border-t border-primary/10">
                  <div className="flex items-center gap-2 text-sm text-primary font-medium">
                    <Palette className="w-4 h-4" />
                    <span>+ FREE Custom Website ($997 value)</span>
                  </div>
                </div>

                <Button className="w-full" size="lg" asChild>
                  <Link href="/contact" data-testid="link-option1-cta">
                    Get Terminal + Free Website
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Option 2: 30-Day Trial */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="h-full overflow-visible relative border-chart-4/30">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-chart-4/8 to-transparent" />
              <div className="absolute -top-3 left-6">
                <Badge variant="outline" className="text-chart-4 border-chart-4/30 bg-chart-4/5 shadow-lg" data-testid="badge-no-commitment">No Commitment</Badge>
              </div>
              <CardHeader className="pb-3 pt-8 relative">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="w-10 h-10 rounded-md bg-chart-4/15 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-chart-4" />
                  </div>
                  <div>
                    <CardTitle className="text-lg" data-testid="text-option2-title">
                      30-Day Risk-Free Trial
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">Try before you buy</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative space-y-5">
                <div className="text-center py-4">
                  <div className="text-sm text-muted-foreground mb-1">Free for 30 days, then</div>
                  <div className="flex items-baseline justify-center gap-1.5">
                    <span className="text-4xl sm:text-5xl font-extrabold text-chart-4" data-testid="text-option2-price">$599</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Only if you decide to keep it
                  </div>
                </div>

                <ul className="space-y-2.5">
                  {option2Features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <Check className="w-4 h-4 text-chart-4 shrink-0 mt-0.5" />
                      <span className="text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-2 border-t border-chart-4/10">
                  <div className="flex items-center gap-2 text-sm text-chart-4 font-medium">
                    <Palette className="w-4 h-4" />
                    <span>+ Custom Website for $199 (when you keep)</span>
                  </div>
                </div>

                <Button className="w-full" size="lg" variant="outline" asChild>
                  <Link href="/contact" data-testid="link-option2-cta">
                    Start Free Trial
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Option 3: Online-Only */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="h-full overflow-visible relative border-chart-2/30">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-chart-2/8 to-transparent" />
              <div className="absolute -top-3 left-6">
                <Badge variant="outline" className="text-chart-2 border-chart-2/30 bg-chart-2/5 shadow-lg" data-testid="badge-online-only">Online-Only</Badge>
              </div>
              <CardHeader className="pb-3 pt-8 relative">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="w-10 h-10 rounded-md bg-chart-2/15 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-chart-2" />
                  </div>
                  <div>
                    <CardTitle className="text-lg" data-testid="text-option3-title">
                      Online Business Package
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">No physical terminal needed</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative space-y-5">
                <div className="text-center py-4">
                  <div className="text-sm text-muted-foreground mb-1">Website + Gateway</div>
                  <div className="flex items-baseline justify-center gap-1.5">
                    <span className="text-4xl sm:text-5xl font-extrabold text-chart-2" data-testid="text-option3-price">$499</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    or free with processing commitment
                  </div>
                </div>

                <ul className="space-y-2.5">
                  {option3Features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <Check className="w-4 h-4 text-chart-2 shrink-0 mt-0.5" />
                      <span className="text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-2 border-t border-chart-2/10">
                  <div className="flex items-center gap-2 text-sm text-chart-2 font-medium">
                    <Code className="w-4 h-4" />
                    <span>Custom website included in price</span>
                  </div>
                </div>

                <Button className="w-full" size="lg" variant="outline" asChild>
                  <Link href="/contact" data-testid="link-option3-cta">
                    Go Online with Edify
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          className="mt-10 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Card className="overflow-visible border-muted">
            <CardContent className="p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-10 h-10 rounded-md bg-destructive/10 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1" data-testid="text-compare-traditional">
                    Meanwhile, traditional processors cost you $3,600 - $5,400 per year
                  </p>
                  <p className="text-xs text-muted-foreground">
                    On $10K/month in sales, you're losing $250-$350 every month to processing fees, plus $25-$100/month in service charges. With Edify, you keep every dollar — and get a professional website to grow your business.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.p
          className="text-center text-muted-foreground text-xs mt-6 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          data-testid="text-pricing-disclaimer"
        >
          Minimum $5K monthly processing volume required for terminal options. Only 4 trial spots available per month.
          All plans include zero processing fees forever. Website valued at $997 — free with in-store terminal purchase.
        </motion.p>
      </div>
    </section>
  );
}

function PromoSection() {
  const safeguards = [
    {
      title: "Minimum Volume Required",
      description: "We work with businesses processing at least $5,000-$10,000 per month. This ensures the zero-fee model delivers meaningful savings for your business.",
      icon: BarChart3,
      iconColor: "text-primary",
      gradient: "from-primary/20 to-primary/5",
    },
    {
      title: "Simple 1-Page Agreement",
      description: "No 30-page contracts. Our trial agreement is a single page — clear terms, no hidden fees. If you keep the terminal, it auto-bills $599 on day 31 unless you cancel.",
      icon: FileCheck,
      iconColor: "text-chart-2",
      gradient: "from-chart-2/20 to-chart-2/5",
    },
    {
      title: "Only 4 Trial Spots Per Month",
      description: "We limit trials to 4 businesses per month so we can provide hands-on setup, training, and support. Once they're filled, the next openings are the following month.",
      icon: Users,
      iconColor: "text-chart-4",
      gradient: "from-chart-4/20 to-chart-4/5",
    },
    {
      title: "Hassle-Free Returns",
      description: "Not happy after your 30-day trial? Return the terminal — we cover return shipping, or you can drop it off locally in Honolulu. No questions asked.",
      icon: HeartHandshake,
      iconColor: "text-chart-3",
      gradient: "from-chart-3/20 to-chart-3/5",
    },
  ];

  return (
    <section id="promos" className="py-24 sm:py-32 relative" data-testid="section-promos">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-chart-4/8 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-primary/8 blur-[100px]" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-14"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.div className="flex flex-wrap items-center justify-center gap-3" variants={fadeUp}>
            <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5">
              <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
              How It Works
            </Badge>
            <Badge variant="outline" className="text-destructive border-destructive/30 bg-destructive/5" data-testid="badge-spots-limited">
              <Timer className="w-3.5 h-3.5 mr-1.5" />
              Only 4 Trial Spots / Month
            </Badge>
          </motion.div>
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-5"
            variants={fadeUp}
            data-testid="text-promo-title"
          >
            Serious Businesses{" "}
            <span className="bg-gradient-to-r from-chart-4 to-primary bg-clip-text text-transparent">
              Only
            </span>
          </motion.h2>
          <motion.p
            className="text-muted-foreground max-w-2xl mx-auto text-lg"
            variants={fadeUp}
          >
            We keep things simple and transparent. Here's what to expect when you get started.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {safeguards.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className="h-full overflow-visible">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-md bg-gradient-to-b ${item.gradient} flex items-center justify-center shrink-0`}>
                      <item.icon className={`w-5 h-5 ${item.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1.5" data-testid={`text-safeguard-title-${i}`}>
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Button size="lg" asChild>
            <Link href="/contact" data-testid="link-apply-now">
              Apply Now — Check If You Qualify
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <p className="text-xs text-muted-foreground mt-4 max-w-xl mx-auto" data-testid="text-promo-disclaimer">
            Minimum $5K-$10K monthly volume required. Trial spots are limited and filled on a first-come, first-served basis.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function SavingsCalculator() {
  const [monthly, setMonthly] = useState(10000);
  const rate = 0.03;
  const monthlyFee = 50;
  const annualLoss = Math.round((monthly * rate + monthlyFee) * 12);

  return (
    <section className="py-24 sm:py-32 relative" data-testid="section-calculator">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/8 blur-[120px]" />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-14"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.div variants={fadeUp}>
            <Badge variant="outline" className="mb-5 text-primary border-primary/30 bg-primary/5">
              <TrendingUp className="w-3 h-3 mr-1.5" />
              Savings Calculator
            </Badge>
          </motion.div>
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-5"
            variants={fadeUp}
            data-testid="text-calc-title"
          >
            You're{" "}
            <span className="text-destructive">Losing Money</span>{" "}
            Every Month
          </motion.h2>
          <motion.p
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
            variants={fadeUp}
          >
            Right now, your payment processor is taking 2-4% of every sale you make.
            Slide the bar to see exactly how much you're handing over — and why you should stop.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="overflow-visible border-primary/10">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-primary/5 to-transparent" />
            <CardContent className="p-7 sm:p-10 relative">
              <div className="mb-8">
                <label className="text-sm font-semibold mb-3 block text-foreground">
                  Monthly Sales Volume
                </label>
                <div className="text-4xl sm:text-5xl font-extrabold text-primary mb-4" data-testid="text-calc-amount">
                  ${monthly.toLocaleString()}
                </div>
                <input
                  type="range"
                  min={2000}
                  max={100000}
                  step={1000}
                  value={monthly}
                  onChange={(e) => setMonthly(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer h-2"
                  data-testid="input-calc-slider"
                />
                <div className="flex items-center justify-between gap-4 text-xs text-muted-foreground mt-2">
                  <span>$2,000</span>
                  <span>$100,000</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="overflow-visible border-destructive/20">
                  <CardContent className="p-5 text-center">
                    <div className="text-sm text-muted-foreground mb-2">
                      You're Giving Away
                    </div>
                    <div className="text-3xl sm:text-4xl font-extrabold text-destructive" data-testid="text-calc-loss">
                      -${annualLoss.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">per year — money that should be yours</div>
                  </CardContent>
                </Card>

                <Card className="overflow-visible border-primary/20">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-primary/5 to-transparent" />
                  <CardContent className="p-5 text-center relative">
                    <div className="text-sm text-muted-foreground mb-2">
                      You Keep With Edify
                    </div>
                    <div className="text-3xl sm:text-4xl font-extrabold text-primary" data-testid="text-calc-savings">
                      +${annualLoss.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">back in your pocket every year</div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

function TestimonialSection() {
  const testimonials = [
    {
      quote: "Switching to Edify saved us over $4,800 last year. The free website they built for our shop brings in new customers every week. Best decision we made for our Honolulu business.",
      name: "Marcus Kalani",
      role: "Owner, Kalani's Auto Repair — Honolulu, HI",
      rating: 5,
    },
    {
      quote: "Zero monthly fees means we actually keep what we earn. Setup was done the same day and they even built us a beautiful website. Our Maui customers love the online ordering.",
      name: "Sarah Chen",
      role: "Manager, Golden Lotus Restaurant — Kahului, Maui",
      rating: 5,
    },
    {
      quote: "As a high-risk CBD merchant on the Big Island, nobody would work with us. Edify got us approved the same day with zero fees. The website they built drives most of our online sales now.",
      name: "David Kealoha",
      role: "Founder, Island Wellness CBD — Kailua-Kona, HI",
      rating: 5,
    },
  ];

  return (
    <section className="py-24 sm:py-32 relative" data-testid="section-testimonials">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-card/30 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.div variants={fadeUp}>
            <Badge variant="outline" className="mb-5 text-chart-3 border-chart-3/30 bg-chart-3/5">
              <Star className="w-3 h-3 mr-1.5" />
              Testimonials
            </Badge>
          </motion.div>
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-5"
            variants={fadeUp}
          >
            Hawai'i Businesses Love Edify
          </motion.h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {testimonials.map((t, i) => (
            <motion.div key={i} variants={scaleIn}>
              <Card className="h-full overflow-visible border-chart-3/10">
                <CardContent className="p-7">
                  <div className="flex items-center gap-0.5 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-chart-3 text-chart-3" />
                    ))}
                  </div>
                  <p className="text-foreground/90 mb-5 leading-relaxed italic">
                    "{t.quote}"
                  </p>
                  <div>
                    <div className="font-semibold text-sm text-foreground">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-24 sm:py-32 relative" data-testid="section-cta">
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative rounded-xl overflow-visible p-[1px]">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/50 via-emerald-300/30 to-primary/50" />
            <div className="relative rounded-xl bg-gradient-to-b from-card via-card to-background p-8 sm:p-12 lg:p-16 text-center">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-primary/10 to-transparent" />
              <div className="relative">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-5 text-foreground" data-testid="text-cta-title">
                  Processing Savings + Professional Website ={" "}
                  <span className="bg-gradient-to-r from-primary to-emerald-300 bg-clip-text text-transparent">
                    More Customers & Profit
                  </span>
                </h2>
                <p className="text-muted-foreground text-lg sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
                  Stop losing money to processing fees and missing out on online customers.
                  Get your terminal starting at $399 — plus a free custom website. Or go online-only from $499.
                  Setup takes minutes, not weeks.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button size="lg" asChild>
                    <Link href="/contact" data-testid="link-cta-get-terminal">
                      Get Free Mockup + Savings Quote
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/contact" data-testid="link-cta-talk">
                      Have Questions? Let's Talk
                    </Link>
                  </Button>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-8 mt-10 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>Same-Day Setup</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-primary" />
                    <span>Free Custom Website</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-primary" />
                    <span>Zero Processing Fees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>Serving All of Hawai'i</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <Layout>
      <HeroSection />
      <SocialProofBar />
      <HowItWorksSection />
      <PricingComparisonSection />
      <PromoSection />
      <SavingsCalculator />
      <TestimonialSection />
      <CTASection />
    </Layout>
  );
}
