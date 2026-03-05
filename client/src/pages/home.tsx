import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import {
  CreditCard,
  Globe,
  ShieldCheck,
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
  Palette,
  MapPin,
  AlertTriangle,
  ShoppingCart,
  Sparkles,
  Calculator,
  PiggyBank,
  BadgeDollarSign,
  Receipt,
  Banknote,
  Rocket,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { fadeUp, staggerContainer, scaleIn } from "@/lib/animations";
import Layout from "@/components/layout";
import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";

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
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.play().catch(() => {});
    }
  }, []);

  return (
    <section
      className="relative"
      data-testid="section-hero"
    >
      <div className="relative w-full overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          src="/videos/hero-bg.mp4"
          className="w-full h-auto block"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <motion.div
            className="text-center"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white drop-shadow-lg"
              variants={fadeUp}
              data-testid="text-hero-title"
            >
              Your Processor Takes{" "}
              <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                $800+/Month
              </span>
              <br />
              <span className="text-2xl sm:text-4xl lg:text-5xl">
                From You.{" "}
                <span className="bg-gradient-to-r from-primary via-emerald-300 to-primary bg-clip-text text-transparent">
                  We Make It Stop.
                </span>
              </span>
            </motion.h1>
            <motion.p
              className="mt-4 sm:mt-6 text-base sm:text-xl text-white/80 max-w-2xl mx-auto"
              variants={fadeUp}
            >
              Try the terminal free for 30 days — keep every dollar you process.
              <br className="hidden sm:block" />
              {" "}If it doesn't pay for itself, send it back. No fee. No catch.
            </motion.p>
          </motion.div>
        </div>
      </div>

      <div className="py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8"
              variants={fadeUp}
            >
              <Button size="lg" className="w-full sm:w-auto text-base px-8" asChild>
                <Link href="/contact" data-testid="link-hero-get-terminal">
                  Start Your Free Trial
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto" asChild>
                <Link href="/statement-review" data-testid="link-hero-learn-more">
                  See What You're Overpaying
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </Button>
            </motion.div>

            <motion.div
              className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-muted-foreground"
              variants={fadeUp}
            >
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                <span>Zero Contracts</span>
              </div>
              <div className="flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-primary" />
                <span>Zero Monthly Fees</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span>30-Day Free Trial</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-primary" />
                <span>Return Anytime — No Questions</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="mt-8 sm:mt-14 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
          >
            <div className="grid grid-cols-3 gap-3 sm:gap-6">
              {[
                { value: 5400, prefix: "$", suffix: "+", label: "Avg Saved/Year", color: "text-primary" },
                { value: 0, prefix: "$", suffix: "", label: "Monthly Fees", color: "text-foreground" },
                { value: 100, prefix: "", suffix: "%", label: "Revenue Kept", color: "text-foreground" },
              ].map((stat) => (
                <Card key={stat.label} className="overflow-visible text-center border-primary/10">
                  <CardContent className="p-3 sm:p-6">
                    <div className={`text-xl sm:text-3xl lg:text-5xl font-extrabold ${stat.color} mb-1`}>
                      <AnimatedCounter target={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                    </div>
                    <div className="text-[10px] sm:text-sm text-muted-foreground">{stat.label}</div>
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

function SocialProofBar() {
  const stats = [
    { icon: Users, value: "500+", label: "Hawai'i Businesses" },
    { icon: Star, value: "4.9/5", label: "Customer Rating" },
    { icon: TrendingUp, value: "$12M+", label: "Revenue Protected" },
    { icon: Award, value: "99.9%", label: "Uptime" },
  ];

  return null;
}

function SavingsCalculator() {
  const [monthlyVolume, setMonthlyVolume] = useState(25000);
  const [showBreakdown, setShowBreakdown] = useState(false);

  // Typical processor costs
  const effectiveRate = 0.035; // 3.5% effective rate (industry average after all hidden fees)
  const monthlyProcessorFees = 89; // avg statement + PCI + gateway fees
  const processingCost = monthlyVolume * effectiveRate;
  const totalCurrentCost = processingCost + monthlyProcessorFees;
  const yearlyCost = totalCurrentCost * 12;

  // TechSavvy cost
  const techSavvyMonthly = 0; // zero monthly
  const techSavvyYearly = 0;

  // Savings
  const monthlySavings = totalCurrentCost;
  const yearlySavings = yearlyCost;

  const fmt = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  const sliderPct = ((monthlyVolume - 5000) / 95000) * 100;

  // Fee breakdown items
  const hiddenFees = [
    { label: "Processing fees (3.5% effective)", amount: processingCost },
    { label: "Monthly statement fee", amount: 15 },
    { label: "PCI compliance fee", amount: 12 },
    { label: "Gateway / batch fee", amount: 25 },
    { label: "Regulatory & misc fees", amount: 37 },
  ];

  return (
    <section className="py-14 sm:py-24 relative overflow-hidden" data-testid="section-savings-calculator">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-red-500/3 blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[140px]" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {/* Header */}
          <motion.div className="text-center mb-10 sm:mb-14" variants={fadeUp}>
            <Badge variant="outline" className="mb-4 text-primary border-primary/30 bg-primary/5">
              <Calculator className="w-3 h-3 mr-1.5" />
              Savings Calculator
            </Badge>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
              See What You're{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">Really Paying</span>
                <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 200 6" preserveAspectRatio="none">
                  <path d="M0,3 Q50,0 100,3 Q150,6 200,3" stroke="hsl(var(--primary))" strokeWidth="2" fill="none" opacity="0.4" />
                </svg>
              </span>
            </h2>
            <p className="text-muted-foreground text-sm sm:text-lg max-w-2xl mx-auto">
              Drag the slider. Watch the math. Then decide if your current processor deserves your money.
            </p>
          </motion.div>

          {/* Slider control */}
          <motion.div variants={fadeUp} className="mb-8">
            <Card className="border-border/50 overflow-visible">
              <CardContent className="p-5 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                  <label className="text-sm font-semibold text-foreground">
                    Your Monthly Card Sales
                  </label>
                  <div className="flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-xl px-4 py-2">
                    <DollarSign className="w-4 h-4 text-primary" />
                    <input
                      type="text"
                      inputMode="numeric"
                      value={monthlyVolume.toLocaleString()}
                      onChange={(e) => {
                        const val = parseInt(e.target.value.replace(/[^0-9]/g, "")) || 0;
                        setMonthlyVolume(Math.min(Math.max(val, 5000), 100000));
                      }}
                      className="w-28 bg-transparent text-xl font-bold text-primary outline-none text-right"
                    />
                  </div>
                </div>

                <div className="relative">
                  <input
                    type="range"
                    min="5000"
                    max="100000"
                    step="1000"
                    value={monthlyVolume}
                    onChange={(e) => setMonthlyVolume(parseInt(e.target.value))}
                    className="w-full h-3 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-primary/30 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white/20 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white/20 [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${sliderPct}%, hsl(var(--muted)) ${sliderPct}%, hsl(var(--muted)) 100%)`,
                    }}
                  />
                  <div className="flex justify-between mt-2 text-[10px] sm:text-xs text-muted-foreground">
                    <span>$5K</span>
                    <span>$25K</span>
                    <span>$50K</span>
                    <span>$75K</span>
                    <span>$100K</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Comparison cards — side by side */}
          <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mb-6">
            {/* Their processor */}
            <Card className="border-red-500/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent" />
              <CardContent className="p-5 sm:p-7 relative">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-red-500/15 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  </div>
                  <span className="text-sm font-bold text-red-400 uppercase tracking-wider">Your Current Processor</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Monthly cost</div>
                    <div className="text-3xl sm:text-4xl font-extrabold text-red-500">
                      -{fmt(totalCurrentCost)}
                    </div>
                  </div>
                  <div className="h-px bg-red-500/10" />
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Yearly cost</div>
                    <div className="text-xl sm:text-2xl font-bold text-red-400">
                      -{fmt(yearlyCost)}
                    </div>
                  </div>

                  {/* Expandable breakdown */}
                  <button
                    onClick={() => setShowBreakdown(!showBreakdown)}
                    className="flex items-center gap-1.5 text-xs text-red-400/80 hover:text-red-400 transition-colors"
                  >
                    <Receipt className="w-3 h-3" />
                    {showBreakdown ? "Hide" : "See"} fee breakdown
                    {showBreakdown
                      ? <ChevronUp className="w-3 h-3" />
                      : <ChevronDown className="w-3 h-3" />
                    }
                  </button>

                  {showBreakdown && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-2 pt-1"
                    >
                      {hiddenFees.map((fee) => (
                        <div key={fee.label} className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">{fee.label}</span>
                          <span className="text-red-400 font-semibold">-{fmt(fee.amount)}</span>
                        </div>
                      ))}
                      <div className="pt-1 border-t border-red-500/10 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground font-semibold">Plus: contract lock-in</span>
                        <span className="text-red-400">2–3 years</span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* TechSavvy */}
            <Card className="border-primary/30 relative overflow-hidden ring-1 ring-primary/10">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
              <div className="absolute top-3 right-3">
                <Badge className="bg-primary/15 text-primary border-primary/30 text-[10px]">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Recommended
                </Badge>
              </div>
              <CardContent className="p-5 sm:p-7 relative">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-bold text-primary uppercase tracking-wider">TechSavvy Hawaii</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Monthly cost</div>
                    <div className="text-3xl sm:text-4xl font-extrabold text-primary">
                      $0
                    </div>
                  </div>
                  <div className="h-px bg-primary/10" />
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Yearly cost</div>
                    <div className="text-xl sm:text-2xl font-bold text-primary">
                      $0
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    {[
                      "Zero processing fees — ever",
                      "Zero monthly fees",
                      "Zero contracts or cancellation fees",
                      "30-day free trial — return anytime",
                      "Full setup & training included",
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Bottom savings summary */}
          <motion.div variants={fadeUp}>
            <Card className="border-primary/20 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/3 to-primary/5" />
              <CardContent className="p-5 sm:p-8 relative">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                  <div className="text-center sm:text-left">
                    <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">You keep every year</div>
                    <div className="text-3xl sm:text-4xl font-extrabold text-primary">
                      +{fmt(yearlySavings)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Your first month</div>
                    <div className="text-3xl sm:text-4xl font-extrabold text-primary">
                      FREE
                    </div>
                  </div>
                  <div className="text-center sm:text-right">
                    <Button size="lg" className="w-full sm:w-auto" asChild>
                      <Link href="/contact">
                        Get Your Free Analysis
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                    <p className="text-[10px] text-muted-foreground mt-2">
                      30-day free trial · Return anytime
                    </p>
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

function HowItWorksPreview() {
  const steps = [
    {
      number: "01",
      icon: CreditCard,
      title: "We Ship You a Terminal — Free",
      description: "No upfront cost. We send you a fully programmed terminal and set up your account the same day. You're processing within hours.",
    },
    {
      number: "02",
      icon: Zap,
      title: "Run Your Business for 30 Days",
      description: "Use the terminal on real transactions. Watch the savings add up. See the difference on your next bank statement — not in a sales pitch.",
    },
    {
      number: "03",
      icon: BadgeDollarSign,
      title: "Keep It or Send It Back",
      description: "Love it? Pay for the equipment with the money you saved. Not for you? Ship it back — no fees, no penalties, no awkward phone calls.",
    },
  ];

  return (
    <section className="py-12 sm:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-10 sm:mb-14"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.div variants={fadeUp}>
            <Badge variant="outline" className="mb-4 text-chart-2 border-chart-2/30 bg-chart-2/5">
              <Zap className="w-3 h-3 mr-1.5" />
              How It Works
            </Badge>
          </motion.div>
          <motion.h2
            className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3"
            variants={fadeUp}
          >
            No Risk. No Catch. Here's the Deal.
          </motion.h2>
          <motion.p
            className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-lg"
            variants={fadeUp}
          >
            Other processors make big promises upfront — then lock you into contracts with hidden fees.
            We'd rather let our service speak for itself. Try it. If we're not the best, walk away.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {steps.map((step, i) => (
            <motion.div key={i} variants={fadeUp} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden sm:block absolute top-12 left-[60%] w-[80%] border-t-2 border-dashed border-primary/20" />
              )}
              <Card className="h-full overflow-visible border-primary/10 text-center">
                <CardContent className="p-6 sm:p-8">
                  <div className="text-4xl sm:text-5xl font-extrabold text-primary/10 mb-2">
                    {step.number}
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Button variant="outline" size="lg" asChild>
            <Link href="/how-it-works">
              See How It Works
              <ChevronRight className="w-4 h-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

function ServicesOverview() {
  const services = [
    {
      icon: CreditCard,
      title: "Payment Processing",
      description: "Try a terminal free for 30 days. If the savings don't speak for themselves, send it back. No contracts, no monthly fees, no gimmicks.",
      href: "/pricing",
      cta: "See Pricing",
      color: "text-primary",
      border: "border-primary/20",
      accent: "from-primary/10 to-transparent",
    },
    {
      icon: Zap,
      title: "How It Works",
      description: "We ship you a programmed terminal. You run your business. You see real savings on your statement. Then you decide. That's it.",
      href: "/how-it-works",
      cta: "See How It Works",
      color: "text-chart-2",
      border: "border-chart-2/20",
      accent: "from-chart-2/10 to-transparent",
    },
    {
      icon: ShieldCheck,
      title: "High-Risk Merchants",
      description: "CBD, vape, firearms, gaming — industries other processors won't touch. We get you approved fast with the same honest pricing.",
      href: "/high-risk",
      cta: "Explore High-Risk Solutions",
      color: "text-chart-4",
      border: "border-chart-4/20",
      accent: "from-chart-4/10 to-transparent",
    },
  ];

  return (
    <section className="py-12 sm:py-24 relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-10 sm:mb-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.div variants={fadeUp}>
            <Badge variant="outline" className="mb-4 text-primary border-primary/30 bg-primary/5">
              Our Services
            </Badge>
          </motion.div>
          <motion.h2
            className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3"
            variants={fadeUp}
          >
            What We Actually Do (No Buzzwords)
          </motion.h2>
          <motion.p
            className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-lg"
            variants={fadeUp}
          >
            We're a Hawai'i company that saves local businesses real money. Here's exactly what we offer.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-5xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {services.map((s, i) => (
            <motion.div key={i} variants={scaleIn}>
              <Card className={`h-full overflow-visible ${s.border}`}>
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-b ${s.accent}`} />
                <CardContent className="p-5 sm:p-7 relative">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                      <s.icon className={`w-5 h-5 ${s.color}`} />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-foreground">{s.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {s.description}
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={s.href}>
                      {s.cta}
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}


function QuickPricingPreview() {
  return (
    <section className="py-12 sm:py-24 relative">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-card/30 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-8 sm:mb-14"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.div variants={fadeUp}>
            <Badge variant="outline" className="mb-4 text-primary border-primary/30 bg-primary/5">
              <DollarSign className="w-3 h-3 mr-1.5" />
              Pricing
            </Badge>
          </motion.div>
          <motion.h2
            className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3"
            variants={fadeUp}
          >
            Honest Pricing — No Surprises
          </motion.h2>
        </motion.div>

        <motion.div
          className="max-w-xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.div variants={scaleIn}>
            <Card className="overflow-visible border-primary/20">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-primary/5 to-transparent" />
              <CardContent className="p-6 sm:p-8 text-center relative">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-1">30-Day Free Trial</h3>
                <div className="text-4xl sm:text-5xl font-extrabold text-primary mb-2">FREE</div>
                <div className="text-sm text-muted-foreground mb-6">Love it? Keep it. Don't? Send it back — no questions.</div>
                <ul className="space-y-3 text-left max-w-xs mx-auto mb-6">
                  {["Zero processing fees from day one", "Real transactions, real savings", "Zero monthly fees — forever", "No contracts or commitments", "Return anytime — we cover shipping"].map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-foreground/80">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button size="lg" className="w-full sm:w-auto px-8" asChild>
                  <Link href="/contact">
                    Start Your Free Trial
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div
          className="text-center mt-6 sm:mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Button variant="outline" size="lg" asChild>
            <Link href="/pricing">
              See Full Trial Details
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

function TestimonialSection() {
  const testimonials = [
    {
      quote: "Switching to TechSavvy saved us over $4,800 last year. The free trial made it a no-brainer — we saw the savings in the first week.",
      name: "Marcus Kalani",
      role: "Kalani's Auto Repair — Honolulu",
      rating: 5,
    },
    {
      quote: "Zero monthly fees means we keep what we earn. Setup was same day and they built us a beautiful website.",
      name: "Sarah Chen",
      role: "Golden Lotus Restaurant — Maui",
      rating: 5,
    },
    {
      quote: "As a high-risk CBD merchant, nobody would work with us. TechSavvy got us approved same day with zero fees.",
      name: "David Kealoha",
      role: "Island Wellness CBD — Kona",
      rating: 5,
    },
  ];

  return (
    <section className="py-12 sm:py-24 relative" data-testid="section-testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-8 sm:mb-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.div variants={fadeUp}>
            <Badge variant="outline" className="mb-4 text-chart-3 border-chart-3/30 bg-chart-3/5">
              <Star className="w-3 h-3 mr-1.5" />
              Testimonials
            </Badge>
          </motion.div>
          <motion.h2
            className="text-2xl sm:text-4xl font-extrabold tracking-tight"
            variants={fadeUp}
          >
            Hawai'i Businesses Love TechSavvy
          </motion.h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {testimonials.map((t, i) => (
            <motion.div key={i} variants={scaleIn}>
              <Card className="h-full overflow-visible border-chart-3/10">
                <CardContent className="p-5 sm:p-7">
                  <div className="flex items-center gap-0.5 mb-3">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-3.5 h-3.5 fill-chart-3 text-chart-3" />
                    ))}
                  </div>
                  <p className="text-sm text-foreground/90 mb-4 leading-relaxed italic">
                    "{t.quote}"
                  </p>
                  <div>
                    <div className="font-semibold text-xs sm:text-sm text-foreground">{t.name}</div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground">{t.role}</div>
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

function ApplyTeaser() {
  return (
    <section className="py-12 sm:py-20 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="overflow-visible border-primary/20">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent" />
            <CardContent className="p-6 sm:p-10 relative">
              <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
                <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center shrink-0">
                  <Rocket className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight mb-2">
                    Ready to Get Started Right Now?
                  </h2>
                  <p className="text-muted-foreground text-sm sm:text-base mb-4">
                    Skip the back-and-forth. Our quick application takes about 3 minutes —
                    no paperwork, no fax machines. Just a few questions and we'll get you set up.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <Button size="lg" asChild>
                      <Link href="/apply">
                        <FileText className="w-4 h-4" />
                        Apply Now — Takes 3 Min
                      </Link>
                    </Button>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-primary" />
                        No SSN required
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-primary" />
                        1-day response
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

function ContactFormSection() {
  const [formData, setFormData] = useState({
    businessName: "",
    contactName: "",
    phone: "",
    email: "",
    plan: "",
    highRisk: false,
    monthlyProcessing: "",
    bestContactTime: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit");
      }
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const set = (field: string, value: string | boolean) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  if (submitted) {
    return (
      <section className="py-12 sm:py-24 relative" data-testid="section-contact-form">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="overflow-visible border-primary/20">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-primary/10 to-transparent" />
            <CardContent className="p-8 sm:p-12 text-center relative">
              <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-4">
                <Check className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 text-foreground">Thank You!</h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                We've received your information and will be in touch soon. Mahalo for choosing TechSavvy!
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-24 relative" data-testid="section-contact-form">
      <div className="absolute inset-0 -z-10">
        <img
          src="/images/serving-hawaii.jpg"
          alt="Proudly Serving Honolulu Businesses"
          className="w-full h-full object-cover object-center opacity-10 sm:opacity-15"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background" />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <Badge variant="outline" className="mb-4 text-primary border-primary/30 bg-primary/5">
              <Sparkles className="w-3 h-3 mr-1.5" />
              Just Browsing?
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
              Not Ready Yet?{" "}
              <span className="bg-gradient-to-r from-primary to-emerald-300 bg-clip-text text-transparent">
                No Problem.
              </span>
            </h2>
            <p className="text-muted-foreground text-sm sm:text-lg max-w-xl mx-auto">
              Drop your info and we'll reach out when it's convenient — zero pressure, zero obligation.
            </p>
          </div>

          <Card className="overflow-visible border-primary/10">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-primary/5 to-transparent" />
            <CardContent className="p-5 sm:p-8 relative">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground" htmlFor="businessName">Business Name</label>
                    <input
                      id="businessName"
                      type="text"
                      required
                      value={formData.businessName}
                      onChange={(e) => set("businessName", e.target.value)}
                      placeholder="Your Business Name"
                      className="flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                      data-testid="input-business-name"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground" htmlFor="contactName">Contact Name</label>
                    <input
                      id="contactName"
                      type="text"
                      required
                      value={formData.contactName}
                      onChange={(e) => set("contactName", e.target.value)}
                      placeholder="Your Name"
                      className="flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                      data-testid="input-contact-name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground" htmlFor="phone">Phone</label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => set("phone", e.target.value)}
                      placeholder="(808) 555-1234"
                      className="flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                      data-testid="input-phone"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground" htmlFor="email">Email</label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => set("email", e.target.value)}
                      placeholder="you@business.com"
                      className="flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                      data-testid="input-email"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Select a Plan</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { value: "trial", label: "30-Day Free Trial", price: "FREE",
                        selectedClasses: "border-primary bg-primary/10 ring-1 ring-primary",
                        priceClass: "text-primary" },
                    ].map((plan) => (
                      <button
                        key={plan.value}
                        type="button"
                        onClick={() => set("plan", plan.value)}
                        className={`relative rounded-md border p-3 text-left transition-all ${
                          formData.plan === plan.value
                            ? plan.selectedClasses
                            : "border-border hover-elevate"
                        }`}
                        data-testid={`button-plan-${plan.value}`}
                      >
                        <div className="text-xs font-semibold text-foreground">{plan.label}</div>
                        <div className={`text-sm font-extrabold ${plan.priceClass}`}>{plan.price}</div>
                      </button>
                    ))}
                  </div>
                  {!formData.plan && (
                    <input tabIndex={-1} required value={formData.plan} onChange={() => {}} className="opacity-0 h-0 w-0 absolute" />
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground" htmlFor="monthlyProcessing">Est. Monthly Processing</label>
                    <select
                      id="monthlyProcessing"
                      required
                      value={formData.monthlyProcessing}
                      onChange={(e) => set("monthlyProcessing", e.target.value)}
                      className="flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                      data-testid="select-monthly-processing"
                    >
                      <option value="">Select range</option>
                      <option value="under-5k">Under $5,000</option>
                      <option value="5k-10k">$5,000 - $10,000</option>
                      <option value="10k-25k">$10,000 - $25,000</option>
                      <option value="25k-50k">$25,000 - $50,000</option>
                      <option value="50k-100k">$50,000 - $100,000</option>
                      <option value="100k-plus">$100,000+</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground" htmlFor="bestContactTime">Best Time to Contact</label>
                    <select
                      id="bestContactTime"
                      required
                      value={formData.bestContactTime}
                      onChange={(e) => set("bestContactTime", e.target.value)}
                      className="flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                      data-testid="select-contact-time"
                    >
                      <option value="">Select time</option>
                      <option value="morning">Morning (8am - 12pm)</option>
                      <option value="afternoon">Afternoon (12pm - 4pm)</option>
                      <option value="evening">Evening (4pm - 6pm)</option>
                      <option value="anytime">Anytime</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-md border border-border bg-muted/30">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={formData.highRisk}
                    onClick={() => set("highRisk", !formData.highRisk)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors ${
                      formData.highRisk ? "bg-primary" : "bg-muted-foreground/30"
                    }`}
                    data-testid="switch-high-risk"
                  >
                    <span className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-sm transition-transform mt-0.5 ${
                      formData.highRisk ? "translate-x-4 ml-0.5" : "translate-x-0.5"
                    }`} />
                  </button>
                  <div>
                    <div className="text-sm font-medium text-foreground">High-Risk Merchant</div>
                    <div className="text-xs text-muted-foreground">CBD, vape, firearms, gaming, nutraceuticals, etc.</div>
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <Button type="submit" size="lg" className="w-full" disabled={submitting} data-testid="button-submit-contact">
                  {submitting ? "Submitting..." : "Get Your Free Savings Quote"}
                  {!submitting && <ArrowRight className="w-4 h-4" />}
                </Button>

                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                    <span>No Obligation</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span>Same-Day Response</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-primary" />
                    <span>Zero Fees</span>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

export default function Home() {
  useSEO({
    title: "TechSavvy Hawaii | AI-Powered Zero-Fee Payment Processing & Web Design in Honolulu",
    description: "Hawaii's #1 AI-powered payment processing company. Zero processing fees, zero monthly fees. Free AI-optimized custom websites for merchants. Serving Honolulu, Maui, Kona & all Hawaiian Islands with intelligent business solutions.",
    keywords: "AI payment processing Hawaii, zero-fee payment processing Honolulu, free trial payment terminal Hawaii, smart POS system, no contract payment processor, free trial merchant services Hawaii",
    canonical: "https://techsavvyhawaii.com/",
    ogImage: "https://techsavvyhawaii.com/images/hero-hawaii-sunset.jpg",
  });

  return (
    <Layout>
      <HeroSection />
      <SavingsCalculator />
      <SocialProofBar />
      <HowItWorksPreview />
      <ServicesOverview />
      <QuickPricingPreview />
      <TestimonialSection />
      <ApplyTeaser />
      <ContactFormSection />
    </Layout>
  );
}
