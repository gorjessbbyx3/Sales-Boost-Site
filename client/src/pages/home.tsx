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
  AlertTriangle,
  Timer,
  BadgeCheck,
  Handshake,
  FileCheck,
  HeartHandshake,
  Megaphone,
  ThumbsUp,
  MapPin,
  Code,
  Palette,
  Monitor,
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
    { label: "Web Design", href: "#web-design" },
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
              <a href="#contact" data-testid="link-nav-contact">
                Contact Us
              </a>
            </Button>
            <Button size="sm" asChild>
              <a href="#contact" data-testid="link-nav-get-terminal">
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
              <a href="#contact" data-testid="link-mobile-get-terminal">
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
              <a href="#contact" data-testid="link-hero-get-terminal">
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

function TrustAuthoritySection() {
  const trustPoints = [
    {
      icon: FileCheck,
      title: "Visa & Mastercard Compliant",
      description: "Our surcharge program follows all Visa and Mastercard rules. We handle the compliance paperwork, required signage, and receipt disclosures so you're always in the clear.",
    },
    {
      icon: Handshake,
      title: "Backed by CashSwipe's ISO Network",
      description: "Our processing is powered through CashSwipe's established ISO partner network, with years of merchant services experience and direct bank relationships.",
    },
    {
      icon: Clock,
      title: "Same-Day Setup Across Hawai'i",
      description: "Most Hawai'i merchants are processing payments within hours, not weeks. We configure your terminal, connect your bank, and train you on-site in Honolulu or remotely for neighbor islands.",
    },
    {
      icon: BadgeCheck,
      title: "Proper Signage Included",
      description: "We provide all required point-of-sale signage and receipt language to keep your surcharge program fully compliant with card brand guidelines.",
    },
  ];

  return (
    <section className="py-24 sm:py-32 relative" data-testid="section-trust">
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
            <Badge variant="outline" className="mb-5 text-chart-3 border-chart-3/30 bg-chart-3/5">
              <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
              Fully Compliant
            </Badge>
          </motion.div>
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-5"
            variants={fadeUp}
            data-testid="text-trust-title"
          >
            Trusted,{" "}
            <span className="bg-gradient-to-r from-chart-3 to-primary bg-clip-text text-transparent">
              Compliant & Proven
            </span>
          </motion.h2>
          <motion.p
            className="text-muted-foreground max-w-2xl mx-auto text-lg"
            variants={fadeUp}
          >
            We follow every rule so you don't have to worry. Backed by an established ISO with years of merchant services experience.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {trustPoints.map((point, i) => (
            <motion.div key={i} variants={scaleIn}>
              <Card className="h-full overflow-visible border-chart-3/10">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-chart-3/5 to-transparent" />
                <CardContent className="p-6 relative">
                  <div className="w-10 h-10 rounded-md bg-gradient-to-b from-chart-3/20 to-chart-3/5 flex items-center justify-center mb-4">
                    <point.icon className="w-5 h-5 text-chart-3" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2" data-testid={`text-trust-point-${i}`}>
                    {point.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {point.description}
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
                  <a href="#contact" data-testid="link-option1-cta">
                    Get Terminal + Free Website
                    <ArrowRight className="w-4 h-4" />
                  </a>
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
                  <a href="#contact" data-testid="link-option2-cta">
                    Start Free Trial
                    <ArrowRight className="w-4 h-4" />
                  </a>
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
                  <a href="#contact" data-testid="link-option3-cta">
                    Go Online with Edify
                    <ArrowRight className="w-4 h-4" />
                  </a>
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
            <a href="#contact" data-testid="link-apply-now">
              Apply Now — Check If You Qualify
              <ArrowRight className="w-4 h-4" />
            </a>
          </Button>
          <p className="text-xs text-muted-foreground mt-4 max-w-xl mx-auto" data-testid="text-promo-disclaimer">
            Minimum $5K-$10K monthly volume required. Trial spots are limited and filled on a first-come, first-served basis.
          </p>
        </motion.div>
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
                  <a href="#contact" data-testid="link-high-risk-apply">
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

function WebDesignSection() {
  const webFeatures = [
    {
      icon: Palette,
      title: "Custom Design",
      description: "Professionally designed to match your brand. No cookie-cutter templates — every site is built from scratch for your Hawai'i business.",
    },
    {
      icon: Smartphone,
      title: "Mobile-Optimized",
      description: "Looks perfect on every device. Over 60% of local searches happen on mobile — your site will be ready.",
    },
    {
      icon: Globe,
      title: "SEO-Ready",
      description: "Built with search engine optimization so customers in Honolulu, Maui, Kona, and across Hawai'i can find you online.",
    },
    {
      icon: Code,
      title: "E-Commerce & Custom Software",
      description: "Need online ordering, booking, or custom tools? Our premium packages include full e-commerce and custom software solutions.",
    },
    {
      icon: Monitor,
      title: "Hosting & Maintenance",
      description: "We handle hosting, updates, and security so you can focus on running your business.",
    },
    {
      icon: Zap,
      title: "Fast Turnaround",
      description: "Most business websites are live within 1-2 weeks. Premium and custom projects scoped individually.",
    },
  ];

  const portfolioItems = [
    {
      type: "Restaurant & Food",
      description: "Online menu, ordering, reservations & payments",
      pages: "Home, Menu, Order Online, About, Contact",
      color: "text-chart-3",
      bgColor: "bg-chart-3/15",
      borderColor: "border-chart-3/20",
    },
    {
      type: "Salon & Beauty",
      description: "Appointment booking, gallery & service pricing",
      pages: "Home, Services, Book Now, Gallery, Contact",
      color: "text-chart-4",
      bgColor: "bg-chart-4/15",
      borderColor: "border-chart-4/20",
    },
    {
      type: "Retail & E-Commerce",
      description: "Product catalog, shopping cart & secure checkout",
      pages: "Home, Shop, Cart, About, Contact",
      color: "text-chart-2",
      bgColor: "bg-chart-2/15",
      borderColor: "border-chart-2/20",
    },
    {
      type: "Services & Trades",
      description: "Quote requests, service areas & testimonials",
      pages: "Home, Services, Get a Quote, Reviews, Contact",
      color: "text-primary",
      bgColor: "bg-primary/15",
      borderColor: "border-primary/20",
    },
  ];

  const subscriptionTiers = [
    {
      name: "Basic",
      price: "$99",
      period: "/month",
      description: "Keep your site running smoothly",
      features: [
        "Hosting & SSL security",
        "Monthly backups",
        "Basic content changes (hours, prices, photos)",
        "Uptime monitoring",
        "Email support",
      ],
      color: "text-muted-foreground",
      borderColor: "border-border",
      popular: false,
    },
    {
      name: "Pro",
      price: "$199",
      period: "/month",
      description: "Grow your online presence",
      features: [
        "Everything in Basic",
        "Monthly content updates & blog posts",
        "Google Business optimization",
        "Monthly SEO tweaks",
        "Performance reporting",
        "Priority support",
      ],
      color: "text-primary",
      borderColor: "border-primary/30",
      popular: true,
    },
    {
      name: "Premium",
      price: "$399",
      period: "/month",
      description: "Full business growth partner",
      features: [
        "Everything in Pro",
        "Custom backend (inventory, CRM, booking)",
        "Automated emails & invoicing",
        "Processing data integration & reporting",
        "Unlimited content changes",
        "Dedicated account manager",
      ],
      color: "text-chart-4",
      borderColor: "border-chart-4/30",
      popular: false,
    },
  ];

  return (
    <section id="web-design" className="py-24 sm:py-32 relative" data-testid="section-web-design">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-chart-4/8 blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.div className="flex flex-wrap items-center justify-center gap-3" variants={fadeUp}>
            <Badge variant="outline" className="text-chart-4 border-chart-4/30 bg-chart-4/5">
              <Code className="w-3.5 h-3.5 mr-1.5" />
              Website Design
            </Badge>
            <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5">
              <MapPin className="w-3.5 h-3.5 mr-1.5" />
              Honolulu, HI
            </Badge>
          </motion.div>
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-5"
            variants={fadeUp}
            data-testid="text-web-design-title"
          >
            Get a{" "}
            <span className="bg-gradient-to-r from-chart-4 to-primary bg-clip-text text-transparent">
              FREE Custom Website
            </span>{" "}
            When You Switch Processing
          </motion.h2>
          <motion.p
            className="text-muted-foreground max-w-2xl mx-auto text-lg"
            variants={fadeUp}
          >
            Online orders, bookings, and more — we build it all. Every Edify merchant gets a professional website
            included. Premium upgrades available for businesses ready to grow faster.
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {webFeatures.map((f, i) => (
            <motion.div key={f.title} variants={scaleIn}>
              <Card className="h-full overflow-visible border-chart-4/10">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-chart-4/5 to-transparent" />
                <CardContent className="p-6 relative">
                  <div className="w-10 h-10 rounded-md bg-chart-4/15 flex items-center justify-center mb-4">
                    <f.icon className="w-5 h-5 text-chart-4" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2" data-testid={`text-web-feature-${i}`}>
                    {f.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {f.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Portfolio Showcase */}
        <motion.div
          className="mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          <motion.div className="text-center mb-10" variants={fadeUp}>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-3" data-testid="text-portfolio-title">
              Websites We Build for Hawai'i Businesses
            </h3>
            <p className="text-muted-foreground max-w-xl mx-auto">
              From restaurants to retail — here's what your free custom site could look like.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            variants={staggerContainer}
          >
            {portfolioItems.map((item, i) => (
              <motion.div key={item.type} variants={scaleIn}>
                <Card className={`h-full overflow-visible ${item.borderColor}`}>
                  <CardContent className="p-5">
                    <div className={`w-full h-32 rounded-md ${item.bgColor} flex items-center justify-center mb-4`}>
                      <Monitor className={`w-12 h-12 ${item.color} opacity-60`} />
                    </div>
                    <h4 className={`font-semibold ${item.color} mb-1.5`} data-testid={`text-portfolio-${i}`}>
                      {item.type}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      {item.description}
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                      {item.pages}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Subscription Tiers */}
        <motion.div
          className="mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          <motion.div className="text-center mb-10" variants={fadeUp}>
            <Badge variant="outline" className="mb-5 text-chart-4 border-chart-4/30 bg-chart-4/5">
              <TrendingUp className="w-3.5 h-3.5 mr-1.5" />
              Ongoing Growth
            </Badge>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-3" data-testid="text-subscriptions-title">
              We Handle the Tech — You Focus on Business
            </h3>
            <p className="text-muted-foreground max-w-xl mx-auto">
              After your free website is built, choose an optional maintenance plan to keep it growing. Cancel anytime.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {subscriptionTiers.map((tier, i) => (
              <motion.div key={tier.name} variants={scaleIn}>
                <Card className={`h-full overflow-visible relative ${tier.borderColor}`}>
                  {tier.popular && (
                    <>
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-primary/8 to-transparent" />
                      <div className="absolute -top-3 left-6">
                        <Badge className="shadow-lg shadow-primary/20">Most Popular</Badge>
                      </div>
                    </>
                  )}
                  <CardContent className={`p-6 relative ${tier.popular ? "pt-8" : ""}`}>
                    <h4 className={`text-lg font-bold ${tier.color} mb-1`} data-testid={`text-tier-name-${i}`}>
                      {tier.name}
                    </h4>
                    <p className="text-xs text-muted-foreground mb-4">{tier.description}</p>
                    <div className="flex items-baseline gap-1 mb-5">
                      <span className={`text-3xl font-extrabold ${tier.color}`}>{tier.price}</span>
                      <span className="text-sm text-muted-foreground">{tier.period}</span>
                    </div>
                    <ul className="space-y-2.5">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5 text-sm">
                          <Check className={`w-4 h-4 ${tier.color} shrink-0 mt-0.5`} />
                          <span className="text-foreground/80">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="overflow-visible border-chart-4/20">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-chart-4/5 via-primary/5 to-chart-4/5" />
            <CardContent className="p-8 relative text-center">
              <h3 className="text-2xl font-bold text-foreground mb-3" data-testid="text-web-design-cta-title">
                Claim Your Free Website Mockup + Processing Savings Quote
              </h3>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Tell us about your business and we'll send you a personalized website mockup showing exactly what yours could look like — plus a savings analysis on your current processing fees. No commitment.
              </p>
              <Button size="lg" asChild>
                <a href="#contact" data-testid="link-web-design-cta">
                  Get My Free Mockup + Quote
                  <ArrowRight className="w-4 h-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

function CustomerPsychologySection() {
  const points = [
    {
      icon: ThumbsUp,
      title: "It's a Cash Discount, Not a Surcharge",
      description: "Frame it positively: your cash-paying customers get a discount. Card users simply pay the standard listed price. Most businesses find customers respond better to \"cash discount\" messaging.",
      stat: null,
    },
    {
      icon: Users,
      title: "~90% of Customers Pay by Card Anyway",
      description: "Studies show roughly 90% of transactions are card-based. The vast majority of your customers won't even notice — they're already paying by card and expect the listed price.",
      stat: "~90%",
      statLabel: "pay by card",
    },
    {
      icon: Megaphone,
      title: "Signage Makes It Normal",
      description: "We provide professional point-of-sale signage that clearly communicates the program. When customers see it displayed, it feels standard — because it is. Thousands of businesses across the country do this every day.",
      stat: null,
    },
    {
      icon: HeartHandshake,
      title: "Your Customers Won't Mind",
      description: "Gas stations have done this for decades. Customers understand the value exchange — and you keep every dollar of your hard-earned revenue instead of handing it to the processor.",
      stat: null,
    },
  ];

  return (
    <section className="py-24 sm:py-32 relative" data-testid="section-psychology">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] rounded-full bg-chart-2/8 blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[100px]" />
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
              <HeartHandshake className="w-3.5 h-3.5 mr-1.5" />
              Customer-Friendly
            </Badge>
          </motion.div>
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-5"
            variants={fadeUp}
            data-testid="text-psychology-title"
          >
            Will My Customers{" "}
            <span className="bg-gradient-to-r from-chart-2 to-primary bg-clip-text text-transparent">
              Actually Accept This
            </span>?
          </motion.h2>
          <motion.p
            className="text-muted-foreground max-w-2xl mx-auto text-lg"
            variants={fadeUp}
          >
            The short answer: yes. Here's why businesses across the country are making the switch without losing a single customer.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {points.map((point, i) => (
            <motion.div key={i} variants={scaleIn}>
              <Card className="h-full overflow-visible border-chart-2/10">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-chart-2/5 to-transparent" />
                <CardContent className="p-6 relative">
                  <div className="flex items-start gap-4 flex-wrap">
                    <div className="w-10 h-10 rounded-md bg-gradient-to-b from-chart-2/20 to-chart-2/5 flex items-center justify-center shrink-0">
                      <point.icon className="w-5 h-5 text-chart-2" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap mb-2">
                        <h3 className="font-semibold text-foreground" data-testid={`text-psychology-point-${i}`}>
                          {point.title}
                        </h3>
                        {point.stat && (
                          <Badge variant="outline" className="text-chart-2 border-chart-2/30 bg-chart-2/5" data-testid={`badge-psychology-stat-${i}`}>
                            {point.stat} {point.statLabel}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {point.description}
                      </p>
                    </div>
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

function FAQSection() {
  const faqs = [
    {
      q: "How does zero-fee payment processing work?",
      a: "Instead of the merchant paying 2-4% processing fees on every sale, a small surcharge is passed to the customer at checkout. The merchant keeps 100% of the sale amount — deposited into their account by the next business day, with no deductions.",
    },
    {
      q: "What does the terminal include?",
      a: "Your terminal accepts chip, swipe, and contactless/NFC tap payments, plus online payment gateway access. Full setup, programming, training, compliance signage, and a free statement analysis are all included.",
    },
    {
      q: "What are the pricing options?",
      a: "Option 1: Purchase outright for $399 — best value, you own it immediately. Option 2: Try free for 30 days, then $599 if you keep it. Both options come with zero monthly fees and zero processing fees forever. Retail terminals sell for $800+.",
    },
    {
      q: "Are there any monthly fees or contracts?",
      a: "No. There are zero monthly fees, zero contracts, and zero commitments. Whether you purchase outright ($399) or keep after a trial ($599), your ongoing cost is $0.",
    },
    {
      q: "How long does setup take?",
      a: "Setup can be completed the same day. We configure your terminal, connect it to your bank, and train you on how to use it so you can start accepting payments immediately.",
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
      q: "Won't customers be upset about the surcharge?",
      a: "Most businesses are surprised by how smoothly it goes. About 90% of customers already pay by card and expect the listed price. Gas stations have done this for decades. We also help you frame it as a 'cash discount' — rewarding cash payers — which customers respond to positively. Professional signage we provide makes it feel standard.",
    },
    {
      q: "How does the 30-day trial work?",
      a: "We loan you a terminal for 30 days with live processing — real transactions, real deposits. If you love it (most do), your terminal auto-purchases at $599 on day 31. If not, return it — we cover return shipping or you can drop it off locally in Honolulu. Only 4 trial spots available per month.",
    },
    {
      q: "Do I need a minimum sales volume?",
      a: "Yes — we require a minimum of $5,000-$10,000 in monthly processing volume to qualify. This ensures the zero-fee model delivers meaningful savings for your business.",
    },
    {
      q: "Does Edify offer website design for Hawai'i businesses?",
      a: "Yes. Every Edify payment processing merchant gets a free custom-built business website — no templates, no extra cost. We also offer premium website packages with e-commerce integration, online ordering, booking systems, and custom software. All websites are mobile-optimized, SEO-ready, and built to help your Hawai'i business get found online.",
    },
    {
      q: "What areas in Hawai'i does Edify serve?",
      a: "We serve businesses across all Hawaiian Islands — O'ahu (Honolulu, Kailua, Pearl City), Maui (Kahului, Lahaina, Kihei), the Big Island (Kona, Hilo), Kaua'i, Moloka'i, and Lana'i. We offer same-day setup with remote training, and on-site support is available in the Honolulu area.",
    },
    {
      q: "Is the surcharge legal in Hawai'i?",
      a: "Yes. Surcharging is legal in Hawai'i and fully compliant with Visa and Mastercard rules. We handle all the compliance requirements — signage, receipt disclosures, and card brand registration — so your business is always in the clear.",
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

function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    businessType: "",
    monthlyVolume: "",
    interest: "bundle-terminal",
    hasWebsite: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-24 sm:py-32 relative" data-testid="section-contact">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-primary/8 blur-[120px]" />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-14"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.div className="flex flex-wrap items-center justify-center gap-3" variants={fadeUp}>
            <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5">
              <Zap className="w-3.5 h-3.5 mr-1.5" />
              Free — No Commitment
            </Badge>
          </motion.div>
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-5"
            variants={fadeUp}
            data-testid="text-contact-title"
          >
            Free Website Mockup +{" "}
            <span className="bg-gradient-to-r from-primary to-emerald-300 bg-clip-text text-transparent">
              Savings Quote
            </span>
          </motion.h2>
          <motion.p
            className="text-muted-foreground max-w-2xl mx-auto text-lg"
            variants={fadeUp}
          >
            Tell us about your business and we'll send you a personalized website mockup showing what yours could look like
            — plus a free savings analysis on your current processing fees. No strings attached.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="overflow-visible border-primary/10">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-primary/5 to-transparent" />
            <CardContent className="p-7 sm:p-10 relative">
              {submitted ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-5">
                    <Check className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3" data-testid="text-contact-success">
                    Your Mockup & Quote Are On the Way!
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    We're preparing your personalized website mockup and processing savings analysis. Our team will reach out within a few hours — keep an eye on your email and phone.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" data-testid="form-contact">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                        placeholder="John Doe"
                        data-testid="input-contact-name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">
                        Business Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        className="w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                        placeholder="Your Business LLC"
                        data-testid="input-contact-business"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                        placeholder="john@business.com"
                        data-testid="input-contact-email"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                        placeholder="(808) 555-1234"
                        data-testid="input-contact-phone"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">
                        Business Type *
                      </label>
                      <select
                        required
                        value={formData.businessType}
                        onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                        className="w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                        data-testid="select-contact-type"
                      >
                        <option value="">Select type...</option>
                        <option value="restaurant">Restaurant / Food Service</option>
                        <option value="retail">Retail Store</option>
                        <option value="salon">Salon / Beauty</option>
                        <option value="auto">Auto / Repair</option>
                        <option value="professional">Professional Services</option>
                        <option value="ecommerce">E-Commerce / Online-Only</option>
                        <option value="cbd-vape">CBD / Vape / High-Risk</option>
                        <option value="tourism">Tourism / Travel</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">
                        Monthly Sales Volume
                      </label>
                      <select
                        value={formData.monthlyVolume}
                        onChange={(e) => setFormData({ ...formData, monthlyVolume: e.target.value })}
                        className="w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                        data-testid="select-contact-volume"
                      >
                        <option value="">Select volume...</option>
                        <option value="under-5k">Under $5,000</option>
                        <option value="5k-10k">$5,000 - $10,000</option>
                        <option value="10k-25k">$10,000 - $25,000</option>
                        <option value="25k-50k">$25,000 - $50,000</option>
                        <option value="50k-100k">$50,000 - $100,000</option>
                        <option value="100k+">$100,000+</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">
                        I'm Interested In
                      </label>
                      <select
                        value={formData.interest}
                        onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                        className="w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                        data-testid="select-contact-interest"
                      >
                        <option value="bundle-terminal">Terminal + Free Website ($399)</option>
                        <option value="bundle-trial">Free Trial + Website ($199 add-on)</option>
                        <option value="online-only">Online-Only Package ($499)</option>
                        <option value="high-risk">High-Risk Merchant Account</option>
                        <option value="website-only">Website Design Only</option>
                        <option value="premium-web">Premium Web Package + Maintenance</option>
                        <option value="questions">Just Have Questions</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">
                        Do You Have a Website?
                      </label>
                      <select
                        value={formData.hasWebsite}
                        onChange={(e) => setFormData({ ...formData, hasWebsite: e.target.value })}
                        className="w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                        data-testid="select-contact-website"
                      >
                        <option value="">Select...</option>
                        <option value="no">No — I need one built</option>
                        <option value="outdated">Yes, but it needs a redesign</option>
                        <option value="yes-basic">Yes, but no online payments</option>
                        <option value="yes-good">Yes, and it works well</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                      Tell Us About Your Business
                    </label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                      placeholder="What does your business do? What would you want on your website? (e.g., online menu, booking calendar, product shop, contact form...)"
                      data-testid="input-contact-message"
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full" data-testid="button-contact-submit">
                    Get My Free Mockup + Savings Quote
                    <ArrowRight className="w-4 h-4" />
                  </Button>

                  <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-primary" />
                      <span>100% free — no commitment</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-primary" />
                      <span>Personalized mockup</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-primary" />
                      <span>Savings analysis included</span>
                    </div>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
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
                    <a href="#contact" data-testid="link-cta-get-terminal">
                      Get Free Mockup + Savings Quote
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <a href="#contact" data-testid="link-cta-talk">
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

function Footer() {
  return (
    <footer className="border-t border-border/50 py-14 relative" data-testid="section-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="font-bold text-lg flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                <Zap className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-foreground">Edify Limited</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mb-3">
              Hawai'i's trusted payment processing and web design company. Zero processing fees, zero monthly fees — plus free websites for every merchant.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span>Honolulu, Hawai'i</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 text-foreground">Services</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="#pricing" className="transition-colors" data-testid="link-footer-pricing">
                  Payment Processing
                </a>
              </li>
              <li>
                <a href="#web-design" className="transition-colors" data-testid="link-footer-web-design">
                  Website Design
                </a>
              </li>
              <li>
                <a href="#high-risk" className="transition-colors" data-testid="link-footer-high-risk">
                  High-Risk Merchants
                </a>
              </li>
              <li>
                <a href="#features" className="transition-colors" data-testid="link-footer-features">
                  Features
                </a>
              </li>
            </ul>
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
                <a href="#faq" className="transition-colors" data-testid="link-footer-faq">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#contact" className="transition-colors" data-testid="link-footer-contact">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors" data-testid="link-footer-top">
                  Back to Top
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 text-foreground">Serving Hawai'i</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>Honolulu & O'ahu</li>
              <li>Maui</li>
              <li>Big Island (Kona & Hilo)</li>
              <li>Kaua'i & Neighbor Islands</li>
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
        <TrustAuthoritySection />
        <HowItWorksSection />
        <PricingComparisonSection />
        <PromoSection />
        <FeaturesSection />
        <HighRiskSection />
        <WebDesignSection />
        <CustomerPsychologySection />
        <DetailSections />
        <SavingsCalculator />
        <TestimonialSection />
        <FAQSection />
        <ContactSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
