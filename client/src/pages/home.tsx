import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import {
  CreditCard,
  Globe,
  Smartphone,
  ShieldCheck,
  Banknote,
  BarChart3,
  Check,
  ArrowRight,
  ChevronRight,
  X,
  Zap,
  Clock,
  DollarSign,
  TrendingUp,
  Star,
  Users,
  Award,
  Menu,
  XIcon,
  CircleDollarSign,
  Percent,
  Receipt,
  Tag,
  Gift,
  Sparkles,
  Copy,
  CheckCheck,
  AlertTriangle,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

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

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "Promos", href: "#promos" },
    { label: "High-Risk", href: "#high-risk" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border"
          : "bg-transparent"
      }`}
      data-testid="navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          <a
            href="#"
            className="font-bold text-xl tracking-tight flex items-center gap-2.5"
            data-testid="link-logo"
          >
            <div className="w-9 h-9 rounded-md bg-primary flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-foreground">Edify</span>
          </a>

          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="px-3 py-2 text-sm text-muted-foreground transition-colors rounded-md"
                data-testid={`link-nav-${l.label.toLowerCase().replace(/\s/g, "-")}`}
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <a href="https://edifylimited.tech/contact" data-testid="link-nav-contact">
                Contact Us
              </a>
            </Button>
            <Button size="sm" asChild>
              <a href="https://edifylimited.tech/contact" data-testid="link-nav-get-terminal">
                Get Your Terminal
                <ArrowRight className="w-3 h-3" />
              </a>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileOpen ? <XIcon /> : <Menu />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border px-4 pb-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="block px-3 py-2.5 text-sm text-muted-foreground"
              onClick={() => setMobileOpen(false)}
              data-testid={`link-mobile-${l.label.toLowerCase().replace(/\s/g, "-")}`}
            >
              {l.label}
            </a>
          ))}
          <div className="mt-3 flex flex-col gap-2">
            <Button size="sm" asChild className="w-full">
              <a href="https://edifylimited.tech/contact" data-testid="link-mobile-get-terminal">
                Get Your Terminal
              </a>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
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
            <Badge variant="outline" className="mb-8 py-1.5 px-4 text-primary border-primary/30 bg-primary/5">
              <CircleDollarSign className="w-3.5 h-3.5 mr-1.5" />
              Save $3,600 - $5,400 Per Year
            </Badge>
          </motion.div>

          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] mb-8"
            variants={fadeUp}
            data-testid="text-hero-title"
          >
            Stop Paying{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-primary via-emerald-300 to-primary bg-clip-text text-transparent">
                Processing Fees
              </span>
            </span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto"
            variants={fadeUp}
            data-testid="text-hero-subtitle"
          >
            $500 for a payment terminal. No monthly fees. No processing fees.
            Your customers cover the small surcharge — you keep{" "}
            <span className="text-primary font-semibold">100% of every sale</span>, deposited into your account by the next business day.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            variants={fadeUp}
          >
            <Button size="lg" asChild>
              <a href="https://edifylimited.tech/contact" data-testid="link-hero-get-terminal">
                Get Your Terminal
                <ArrowRight className="w-4 h-4" />
              </a>
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
    { icon: Users, value: "500+", label: "Businesses Trust Us" },
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
      title: "Pay $500 Once",
      description:
        "One-time purchase for your payment terminal. No contracts, no commitments, no monthly bills.",
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
  const traditional = [
    { label: "Terminal Cost", value: "$200 - $800", icon: CreditCard },
    { label: "Monthly Fee", value: "$25 - $100/mo", icon: Receipt },
    { label: "Processing Fee", value: "2.5% - 3.5%", icon: Percent },
    { label: "On $10K/mo Sales", value: "-$250 to -$350", highlight: true, icon: TrendingUp },
    { label: "Annual Cost", value: "$3,600 - $5,400", icon: DollarSign },
  ];

  const edify = [
    { label: "Terminal Cost", value: "$500 (one-time)", icon: CreditCard },
    { label: "Monthly Fee", value: "$0", icon: Receipt },
    { label: "Processing Fee", value: "$0", icon: Percent },
    { label: "On $10K/mo Sales", value: "Keep $10,000", highlight: true, icon: TrendingUp },
    { label: "Annual Cost", value: "$0 after terminal", icon: DollarSign },
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
          className="text-center mb-20"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.div variants={fadeUp}>
            <Badge variant="outline" className="mb-5 text-primary border-primary/30 bg-primary/5">
              Pricing
            </Badge>
          </motion.div>
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-5"
            variants={fadeUp}
            data-testid="text-pricing-title"
          >
            See the{" "}
            <span className="bg-gradient-to-r from-primary to-emerald-300 bg-clip-text text-transparent">
              Difference
            </span>
          </motion.h2>
          <motion.p
            className="text-muted-foreground max-w-2xl mx-auto text-lg"
            variants={fadeUp}
          >
            Compare what you'd pay with a traditional processor vs. our
            zero-fee solution.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="h-full overflow-visible relative border-destructive/20 bg-destructive/[0.03]">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="w-8 h-8 rounded-md bg-destructive/15 flex items-center justify-center">
                    <X className="w-4 h-4 text-destructive" />
                  </div>
                  <CardTitle className="text-lg" data-testid="text-traditional-title">
                    Traditional Processor
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-1">
                {traditional.map((row) => (
                  <div
                    key={row.label}
                    className={`flex items-center justify-between gap-4 py-3 border-b border-border/50 last:border-0 ${
                      row.highlight ? "font-semibold" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <row.icon className="w-4 h-4 text-muted-foreground/50 shrink-0" />
                      <span className="text-sm text-muted-foreground">{row.label}</span>
                    </div>
                    <span
                      className={`text-sm text-right font-medium ${
                        row.highlight ? "text-destructive font-bold" : "text-foreground/80"
                      }`}
                      data-testid={`text-trad-${row.label.toLowerCase().replace(/[\s/]/g, "-")}`}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
                <div className="pt-4">
                  <div className="rounded-md bg-destructive/10 p-3 text-center">
                    <span className="text-xs text-destructive font-medium">
                      You lose $3,600 - $5,400 every year
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="h-full overflow-visible relative border-primary/30">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-primary/8 to-transparent" />
              <div className="absolute -top-3 left-6">
                <Badge className="shadow-lg shadow-primary/20">Recommended</Badge>
              </div>
              <CardHeader className="pb-3 pt-8 relative">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="w-8 h-8 rounded-md bg-primary/15 flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <CardTitle className="text-lg" data-testid="text-edify-title">
                    Edify Payment Processing
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-1 relative">
                {edify.map((row) => (
                  <div
                    key={row.label}
                    className={`flex items-center justify-between gap-4 py-3 border-b border-border/50 last:border-0 ${
                      row.highlight ? "font-semibold" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <row.icon className="w-4 h-4 text-primary/50 shrink-0" />
                      <span className="text-sm text-muted-foreground">{row.label}</span>
                    </div>
                    <span
                      className={`text-sm text-right font-medium ${
                        row.highlight ? "text-primary font-bold text-base" : "text-foreground/80"
                      }`}
                      data-testid={`text-edify-${row.label.toLowerCase().replace(/[\s/]/g, "-")}`}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
                <div className="pt-4">
                  <div className="rounded-md bg-primary/10 p-3 text-center">
                    <span className="text-xs text-primary font-medium">
                      You keep every dollar you earn
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.p
          className="text-center text-muted-foreground text-sm mt-10 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          data-testid="text-savings-summary"
        >
          On $10,000/month in sales, you could save{" "}
          <strong className="text-primary">$3,600 - $5,400 per year</strong>{" "}
          compared to traditional processors.
        </motion.p>
      </div>
    </section>
  );
}

function PromoSection() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const promos = [
    {
      code: "FREETRIAL",
      title: "Try 1 Month Free",
      description: "Get your terminal and process payments for one full month at no cost. No commitment required.",
      icon: Gift,
      highlight: "Free Trial",
      gradient: "from-chart-4/20 to-chart-4/5",
      iconColor: "text-chart-4",
      badgeColor: "text-chart-4 border-chart-4/30 bg-chart-4/5",
      details: ["Full terminal access", "Zero upfront cost for 30 days", "Cancel anytime, no questions asked"],
    },
    {
      code: "SAVE200",
      title: "Start for Just $300",
      description: "Save $200 on your terminal today. Same zero-fee processing, lower entry price. Online exclusive.",
      icon: Tag,
      highlight: "$200 Off",
      gradient: "from-primary/20 to-primary/5",
      iconColor: "text-primary",
      badgeColor: "text-primary border-primary/30 bg-primary/5",
      details: ["$300 instead of $500", "Same zero monthly fees", "Same zero processing fees"],
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
          <motion.div variants={fadeUp}>
            <Badge variant="outline" className="mb-5 text-chart-4 border-chart-4/30 bg-chart-4/5">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Limited Time Offers
            </Badge>
          </motion.div>
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-5"
            variants={fadeUp}
            data-testid="text-promo-title"
          >
            Online{" "}
            <span className="bg-gradient-to-r from-chart-4 to-primary bg-clip-text text-transparent">
              Exclusive Deals
            </span>
          </motion.h2>
          <motion.p
            className="text-muted-foreground max-w-2xl mx-auto text-lg"
            variants={fadeUp}
          >
            Choose the offer that works best for your business. Use a promo code when you get in touch.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {promos.map((promo, i) => (
            <motion.div
              key={promo.code}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <Card className="h-full overflow-visible relative border-primary/10">
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-b ${promo.gradient}`} />
                <div className="absolute -top-3 right-6">
                  <Badge className="shadow-lg shadow-primary/20">{promo.highlight}</Badge>
                </div>
                <CardHeader className="relative pt-8 pb-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className={`w-10 h-10 rounded-md bg-gradient-to-b ${promo.gradient} flex items-center justify-center`}>
                      <promo.icon className={`w-5 h-5 ${promo.iconColor}`} />
                    </div>
                    <CardTitle className="text-lg" data-testid={`text-promo-title-${i}`}>
                      {promo.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="relative space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {promo.description}
                  </p>

                  <ul className="space-y-2">
                    {promo.details.map((detail) => (
                      <li key={detail} className="flex items-center gap-2 text-sm">
                        <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="text-foreground/80">{detail}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center gap-2 flex-wrap pt-2">
                    <div className="flex-1 rounded-md bg-muted px-3 py-2 font-mono text-sm tracking-wider text-foreground text-center" data-testid={`text-promo-code-${i}`}>
                      {promo.code}
                    </div>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleCopy(promo.code)}
                      data-testid={`button-copy-code-${i}`}
                    >
                      {copiedCode === promo.code ? (
                        <CheckCheck className="w-4 h-4 text-primary" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>

                  <Button className="w-full" asChild>
                    <a href={`https://edifylimited.tech/contact?promo=${promo.code}`} data-testid={`link-promo-claim-${i}`}>
                      Claim This Offer
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="text-center text-muted-foreground text-xs mt-8 max-w-xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          data-testid="text-promo-disclaimer"
        >
          Offers available for new customers only. Mention the promo code when you contact us. Cannot be combined with other promotions.
        </motion.p>
      </div>
    </section>
  );
}

function HighRiskSection() {
  const industries = [
    "CBD & Hemp",
    "Vape & E-Cigarette",
    "Firearms & Ammunition",
    "Nutraceuticals",
    "Travel & Tourism",
    "Debt Collection",
    "Online Gaming",
    "Adult Entertainment",
    "Subscription Services",
    "Tech Support",
    "Telemarketing",
    "E-Commerce",
  ];

  return (
    <section id="high-risk" className="py-24 sm:py-32 relative" data-testid="section-high-risk">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/30 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-14"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.div variants={fadeUp}>
            <Badge variant="outline" className="mb-5 text-chart-2 border-chart-2/30 bg-chart-2/5">
              <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
              High-Risk Merchants Welcome
            </Badge>
          </motion.div>
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-5"
            variants={fadeUp}
            data-testid="text-high-risk-title"
          >
            High-Risk{" "}
            <span className="bg-gradient-to-r from-chart-2 to-primary bg-clip-text text-transparent">
              Payment Processing
            </span>
          </motion.h2>
          <motion.p
            className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed"
            variants={fadeUp}
          >
            Turned down by other processors? We specialize in high-risk merchant accounts with the same zero-fee processing and no hidden charges.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="h-full overflow-visible border-chart-2/20">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-chart-2/5 to-transparent" />
              <CardHeader className="relative">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="w-10 h-10 rounded-md bg-chart-2/15 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-chart-2" />
                  </div>
                  <CardTitle className="text-lg">Why Merchants Choose Us</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="relative space-y-3">
                {[
                  "No application denials based on industry type",
                  "Same zero processing fees as standard merchants",
                  "No reserve requirements or fund holds",
                  "Fast approval — often same-day setup",
                  "Dedicated support for high-risk industries",
                  "Chargeback prevention tools included",
                  "PCI-compliant secure transactions",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-chart-2 shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground/80">{item}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="h-full overflow-visible border-primary/10">
              <CardHeader>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="w-10 h-10 rounded-md bg-primary/15 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Industries We Serve</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {industries.map((industry) => (
                    <Badge
                      key={industry}
                      variant="outline"
                      className="text-muted-foreground border-border/60"
                      data-testid={`badge-industry-${industry.toLowerCase().replace(/[\s&]/g, "-")}`}
                    >
                      {industry}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-5 leading-relaxed">
                  Don't see your industry? Contact us — we work with nearly every business type that other processors reject.
                </p>
                <Button className="w-full mt-5" asChild>
                  <a href="https://edifylimited.tech/contact" data-testid="link-high-risk-apply">
                    Apply for High-Risk Account
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: CreditCard,
      title: "In-Store Terminal",
      description: "Professional countertop terminal that accepts swipe, chip, and tap payments.",
      gradient: "from-primary/15 to-primary/5",
    },
    {
      icon: Globe,
      title: "Online Payments",
      description: "Accept payments through your website with a secure online gateway.",
      gradient: "from-chart-2/15 to-chart-2/5",
    },
    {
      icon: Smartphone,
      title: "Digital Wallets",
      description: "Accept Apple Pay, Google Pay, and other contactless payment methods.",
      gradient: "from-chart-4/15 to-chart-4/5",
    },
    {
      icon: ShieldCheck,
      title: "PCI Compliant",
      description: "Bank-level security protects every transaction and customer data.",
      gradient: "from-chart-3/15 to-chart-3/5",
    },
    {
      icon: Banknote,
      title: "Next-Day Deposits",
      description: "Funds deposited to your bank account by the next business day.",
      gradient: "from-primary/15 to-primary/5",
    },
    {
      icon: BarChart3,
      title: "Transaction Dashboard",
      description: "Real-time reporting to track sales, refunds, and daily totals.",
      gradient: "from-chart-2/15 to-chart-2/5",
    },
  ];

  return (
    <section
      id="features"
      className="py-24 sm:py-32 relative"
      data-testid="section-features"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-chart-4/5 blur-[100px]" />
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
              Features
            </Badge>
          </motion.div>
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-5"
            variants={fadeUp}
            data-testid="text-features-title"
          >
            Everything You Need
          </motion.h2>
          <motion.p
            className="text-muted-foreground max-w-2xl mx-auto text-lg"
            variants={fadeUp}
          >
            In-store and online payment capabilities, all included with your
            terminal.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {features.map((f, i) => (
            <motion.div key={f.title} variants={scaleIn}>
              <Card className="h-full overflow-visible hover-elevate transition-all duration-300 border-primary/10">
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${f.gradient} opacity-40`} />
                <CardContent className="p-7 relative">
                  <div className="w-12 h-12 rounded-md bg-primary/15 flex items-center justify-center mb-5">
                    <f.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-foreground" data-testid={`text-feature-title-${i}`}>
                    {f.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {f.description}
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

function DetailSections() {
  const instoreFeatures = [
    "Chip & Swipe Cards",
    "Contactless/NFC Tap",
    "Digital Receipts",
    "Tip Adjustment",
    "Quick Setup",
    "Training Included",
  ];

  const onlineFeatures = [
    "Secure Checkout",
    "Invoice Payments",
    "E-Commerce Integration",
    "Recurring Billing",
    "Payment Links",
    "Mobile Optimized",
  ];

  return (
    <section className="py-24 sm:py-32 relative" data-testid="section-details">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/30 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp}>
            <Badge variant="outline" className="mb-5 text-primary border-primary/30 bg-primary/5">
              <CreditCard className="w-3 h-3 mr-1.5" />
              In-Store
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-5" data-testid="text-instore-title">
              In-Store Payments
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Your terminal handles everything at the counter — credit cards,
              debit cards, chip, swipe, and contactless tap. Quick setup and
              training included so you're accepting payments on day one.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {instoreFeatures.map((f) => (
                <div key={f} className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-sm text-foreground/90" data-testid={`text-instore-${f.toLowerCase().replace(/[\s&/]/g, "-")}`}>{f}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={scaleIn}>
            <Card className="overflow-visible border-primary/10">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/10 to-transparent" />
              <CardContent className="p-10 sm:p-12 relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6">
                    <CreditCard className="w-12 h-12 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-foreground">Accept Every Card</h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    Visa, Mastercard, Amex, Discover, and all major debit cards
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {["Visa", "Mastercard", "Amex", "Discover"].map((card) => (
                      <Badge key={card} variant="outline" className="text-foreground/80 border-border/60">
                        {card}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          <motion.div className="order-2 lg:order-1" variants={scaleIn}>
            <Card className="overflow-visible border-chart-2/10">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-chart-2/10 to-transparent" />
              <CardContent className="p-10 sm:p-12 relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-chart-2/20 to-chart-2/5 flex items-center justify-center mb-6">
                    <Globe className="w-12 h-12 text-chart-2" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-foreground">Sell Anywhere Online</h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    E-commerce, invoices, payment links, and recurring billing
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {["Shopify", "WooCommerce", "Custom"].map((platform) => (
                      <Badge key={platform} variant="outline" className="text-foreground/80 border-border/60">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div className="order-1 lg:order-2" variants={fadeUp}>
            <Badge variant="outline" className="mb-5 text-chart-2 border-chart-2/30 bg-chart-2/5">
              <Globe className="w-3 h-3 mr-1.5" />
              Online
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-5" data-testid="text-online-title">
              Online Payments
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Sell online with our secure payment gateway. Whether you have an
              e-commerce store or just need to take deposits remotely, we've got
              you covered — same zero-fee model.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {onlineFeatures.map((f) => (
                <div key={f} className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-chart-2/15 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-chart-2" />
                  </div>
                  <span className="text-sm text-foreground/90" data-testid={`text-online-${f.toLowerCase().replace(/[\s-]/g, "-")}`}>{f}</span>
                </div>
              ))}
            </div>
          </motion.div>
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
            How Much Are You{" "}
            <span className="text-destructive">Losing</span>?
          </motion.h2>
          <motion.p
            className="text-muted-foreground text-lg"
            variants={fadeUp}
          >
            Enter your monthly sales to see how much you could save each year.
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
                      Lost to Traditional Fees
                    </div>
                    <div className="text-3xl sm:text-4xl font-extrabold text-destructive" data-testid="text-calc-loss">
                      -${annualLoss.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">per year</div>
                  </CardContent>
                </Card>

                <Card className="overflow-visible border-primary/20">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-primary/5 to-transparent" />
                  <CardContent className="p-5 text-center relative">
                    <div className="text-sm text-muted-foreground mb-2">
                      You Save With Edify
                    </div>
                    <div className="text-3xl sm:text-4xl font-extrabold text-primary" data-testid="text-calc-savings">
                      ${annualLoss.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">per year</div>
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
      quote: "Switching to Edify saved us over $4,800 last year. We wish we'd done it sooner.",
      name: "Marcus Johnson",
      role: "Owner, Johnson's Auto Repair",
      rating: 5,
    },
    {
      quote: "Zero monthly fees means we actually keep what we earn. The setup was incredibly fast.",
      name: "Sarah Chen",
      role: "Manager, Golden Lotus Restaurant",
      rating: 5,
    },
    {
      quote: "The online payment gateway is seamless. Our customers love the convenience.",
      name: "David Okafor",
      role: "Founder, Okafor Consulting",
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
            Businesses Love Edify
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

function FAQSection() {
  const faqs = [
    {
      q: "How does zero-fee payment processing work?",
      a: "Instead of the merchant paying 2-4% processing fees on every sale, a small surcharge is passed to the customer at checkout. The merchant keeps 100% of the sale amount — deposited into their account by the next business day, with no deductions.",
    },
    {
      q: "What does the $500 terminal include?",
      a: "The $500 one-time purchase includes a professional countertop payment terminal that accepts chip, swipe, and contactless/NFC tap payments, plus online payment gateway access, setup assistance, and training.",
    },
    {
      q: "Are there any monthly fees or contracts?",
      a: "No. There are zero monthly fees, zero contracts, and zero commitments. The only cost is the one-time $500 terminal purchase.",
    },
    {
      q: "How long does setup take?",
      a: "Setup can be completed the same day. We configure your terminal, connect it to your bank, and train you on how to use it so you can start accepting payments immediately.",
    },
    {
      q: "Is the surcharge legal?",
      a: "Yes. Surcharging is legal in most US states and follows card brand guidelines. We ensure your surcharge program is fully compliant with all regulations.",
    },
    {
      q: "When do I receive my funds?",
      a: "Funds are deposited to your bank account by the next business day. You can track all deposits and transactions through your real-time dashboard.",
    },
    {
      q: "Do you accept high-risk merchants?",
      a: "Yes. We specialize in high-risk merchant accounts including CBD, vape, firearms, nutraceuticals, travel, online gaming, adult entertainment, and more. Same zero-fee processing, no excessive reserves, and fast approvals.",
    },
    {
      q: "How do the promo codes work?",
      a: "Simply mention the promo code (FREETRIAL for a free first month, or SAVE200 for $200 off your terminal) when you contact us. These are online-exclusive offers for new customers and cannot be combined.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      id="faq"
      className="py-24 sm:py-32 relative"
      data-testid="section-faq"
    >
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
              FAQ
            </Badge>
          </motion.div>
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-5"
            variants={fadeUp}
            data-testid="text-faq-title"
          >
            Common Questions
          </motion.h2>
          <motion.p
            className="text-muted-foreground text-lg"
            variants={fadeUp}
          >
            Everything you need to know about our payment processing.
          </motion.p>
        </motion.div>

        <motion.div
          className="space-y-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {faqs.map((faq, i) => (
            <motion.div key={i} variants={fadeUp}>
              <Card
                className="overflow-visible cursor-pointer hover-elevate border-primary/5"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                data-testid={`button-faq-${i}`}
              >
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-semibold text-sm sm:text-base text-foreground" data-testid={`text-faq-q-${i}`}>
                      {faq.q}
                    </h3>
                    <ChevronRight
                      className={`w-4 h-4 text-primary shrink-0 mt-0.5 transition-transform duration-200 ${
                        openIndex === i ? "rotate-90" : ""
                      }`}
                    />
                  </div>
                  {openIndex === i && (
                    <motion.p
                      className="text-muted-foreground text-sm mt-4 leading-relaxed"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      data-testid={`text-faq-a-${i}`}
                    >
                      {faq.a}
                    </motion.p>
                  )}
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
                  Ready to Keep More of{" "}
                  <span className="bg-gradient-to-r from-primary to-emerald-300 bg-clip-text text-transparent">
                    Your Money
                  </span>?
                </h2>
                <p className="text-muted-foreground text-lg sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
                  Get your $500 terminal and start accepting payments with zero
                  ongoing fees. Setup takes minutes, not weeks.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button size="lg" asChild>
                    <a href="https://edifylimited.tech/contact" data-testid="link-cta-get-terminal">
                      Get Your Terminal Today
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <a href="https://edifylimited.tech/contact" data-testid="link-cta-talk">
                      Have Questions? Let's Talk
                    </a>
                  </Button>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-8 mt-10 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>Same-Day Setup</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    <span>PCI Compliant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-primary" />
                    <span>Zero Monthly Fees</span>
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

function Footer() {
  return (
    <footer className="border-t border-border/50 py-14 relative" data-testid="section-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="font-bold text-lg flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                <Zap className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-foreground">Edify Limited</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Payment processing solutions that let you keep 100% of every
              sale. No monthly fees, no processing fees, no contracts.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 text-foreground">Quick Links</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="#how-it-works" className="transition-colors" data-testid="link-footer-how">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#pricing" className="transition-colors" data-testid="link-footer-pricing">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#features" className="transition-colors" data-testid="link-footer-features">
                  Features
                </a>
              </li>
              <li>
                <a href="#faq" className="transition-colors" data-testid="link-footer-faq">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 text-foreground">Contact</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a
                  href="https://edifylimited.tech/contact"
                  className="transition-colors"
                  data-testid="link-footer-contact"
                >
                  Get In Touch
                </a>
              </li>
              <li>
                <a
                  href="https://edifylimited.tech"
                  className="transition-colors"
                  data-testid="link-footer-website"
                >
                  edifylimited.tech
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 mt-10 pt-8 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Edify Limited. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <HeroSection />
        <SocialProofBar />
        <HowItWorksSection />
        <PricingComparisonSection />
        <PromoSection />
        <FeaturesSection />
        <HighRiskSection />
        <DetailSections />
        <SavingsCalculator />
        <TestimonialSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
