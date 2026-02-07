import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
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
} from "lucide-react";
import { useState, useEffect } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

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
    { label: "Features", href: "#features" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-lg border-b border-border"
          : "bg-transparent"
      }`}
      data-testid="navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          <a
            href="#"
            className="font-bold text-xl tracking-tight flex items-center gap-2"
            data-testid="link-logo"
          >
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span>Edify</span>
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
        <div className="md:hidden bg-background/95 backdrop-blur-lg border-b border-border px-4 pb-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="block px-3 py-2 text-sm text-muted-foreground"
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
      className="relative overflow-hidden pt-24 pb-16 sm:pt-32 sm:pb-24"
      data-testid="section-hero"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/3" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-primary/3 blur-3xl translate-y-1/2 -translate-x-1/4" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeUp}>
            <Badge variant="secondary" className="mb-6">
              <DollarSign className="w-3 h-3 mr-1" />
              Save $3,600 - $5,400 Per Year
            </Badge>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6"
            variants={fadeUp}
            data-testid="text-hero-title"
          >
            Stop Paying{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-primary">Processing Fees</span>
              <span className="absolute bottom-1 left-0 right-0 h-3 bg-primary/15 rounded-sm -z-0" />
            </span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto"
            variants={fadeUp}
            data-testid="text-hero-subtitle"
          >
            $500 for a payment terminal. No monthly fees. No processing fees.
            Your customers cover the small surcharge — you keep{" "}
            <strong className="text-foreground">100% of every sale</strong>.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
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
            className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
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
          className="mt-16 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <Card className="overflow-visible">
            <CardContent className="p-6 sm:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-primary mb-1" data-testid="text-stat-savings">
                    $5,400+
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Saved Per Year
                  </div>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-foreground mb-1" data-testid="text-stat-fee">
                    $0
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Monthly Fees
                  </div>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-foreground mb-1" data-testid="text-stat-keep">
                    100%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Revenue Kept
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

function SocialProofBar() {
  const stats = [
    { icon: Users, value: "500+", label: "Businesses Trust Us" },
    { icon: Star, value: "4.9/5", label: "Customer Rating" },
    { icon: TrendingUp, value: "$12M+", label: "Revenue Protected" },
    { icon: Award, value: "99.9%", label: "Uptime Guaranteed" },
  ];

  return (
    <section className="py-12 border-y border-border bg-card/50" data-testid="section-social-proof">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
              <div className="text-2xl sm:text-3xl font-bold mb-1" data-testid={`text-proof-${stat.label.toLowerCase().replace(/\s/g, "-")}`}>
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
    },
    {
      step: "02",
      title: "Start Accepting Payments",
      description:
        "We set up and train you on your terminal. Accept cards in-store and online from day one.",
      icon: Zap,
    },
    {
      step: "03",
      title: "Keep 100% of Sales",
      description:
        "Your customers cover the small processing surcharge. You receive the full sale amount — no deductions.",
      icon: DollarSign,
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-20 sm:py-28"
      data-testid="section-how-it-works"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.div variants={fadeUp}>
            <Badge variant="secondary" className="mb-4">How It Works</Badge>
          </motion.div>
          <motion.h2
            className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4"
            variants={fadeUp}
            data-testid="text-hiw-title"
          >
            Three Simple Steps to Zero Fees
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
              <Card className="h-full relative overflow-visible">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                      <s.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">
                      Step {s.step}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2" data-testid={`text-step-title-${i}`}>
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
    { label: "Terminal Cost", value: "$200 - $800" },
    { label: "Monthly Fee", value: "$25 - $100/mo" },
    { label: "Processing Fee", value: "2.5% - 3.5% per sale" },
    { label: "On $10,000/mo Sales", value: "-$250 to -$350 lost", highlight: true },
    { label: "Annual Cost", value: "$3,600 - $5,400" },
  ];

  const edify = [
    { label: "Terminal Cost", value: "$500 (one-time)" },
    { label: "Monthly Fee", value: "$0" },
    { label: "Processing Fee", value: "$0 (customer pays)" },
    { label: "On $10,000/mo Sales", value: "You keep $10,000", highlight: true },
    { label: "Annual Cost", value: "$0 after terminal" },
  ];

  return (
    <section
      id="pricing"
      className="py-20 sm:py-28 bg-card/30"
      data-testid="section-pricing"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.div variants={fadeUp}>
            <Badge variant="secondary" className="mb-4">Pricing</Badge>
          </motion.div>
          <motion.h2
            className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4"
            variants={fadeUp}
            data-testid="text-pricing-title"
          >
            See the Difference
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
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="h-full overflow-visible relative">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <X className="w-5 h-5 text-destructive" />
                  <CardTitle className="text-lg" data-testid="text-traditional-title">
                    Traditional Processor
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {traditional.map((row) => (
                  <div
                    key={row.label}
                    className={`flex items-center justify-between gap-4 py-2.5 border-b border-border last:border-0 ${
                      row.highlight ? "font-semibold" : ""
                    }`}
                  >
                    <span className="text-sm text-muted-foreground">{row.label}</span>
                    <span
                      className={`text-sm text-right ${
                        row.highlight ? "text-destructive" : ""
                      }`}
                      data-testid={`text-trad-${row.label.toLowerCase().replace(/[\s/]/g, "-")}`}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="h-full overflow-visible relative border-primary/30 bg-primary/[0.03] dark:bg-primary/[0.05]">
              <div className="absolute -top-3 left-6">
                <Badge>Recommended</Badge>
              </div>
              <CardHeader className="pb-2 pt-8">
                <div className="flex items-center gap-2 flex-wrap">
                  <Check className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg" data-testid="text-edify-title">
                    Edify Payment Processing
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {edify.map((row) => (
                  <div
                    key={row.label}
                    className={`flex items-center justify-between gap-4 py-2.5 border-b border-border last:border-0 ${
                      row.highlight ? "font-semibold" : ""
                    }`}
                  >
                    <span className="text-sm text-muted-foreground">{row.label}</span>
                    <span
                      className={`text-sm text-right ${
                        row.highlight ? "text-primary font-bold" : ""
                      }`}
                      data-testid={`text-edify-${row.label.toLowerCase().replace(/[\s/]/g, "-")}`}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.p
          className="text-center text-muted-foreground text-sm mt-8 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          data-testid="text-savings-summary"
        >
          On $10,000/month in sales, you could save{" "}
          <strong className="text-foreground">$3,600 - $5,400 per year</strong>{" "}
          compared to traditional processors.
        </motion.p>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: CreditCard,
      title: "In-Store Terminal",
      description:
        "Professional countertop terminal that accepts swipe, chip, and tap payments.",
    },
    {
      icon: Globe,
      title: "Online Payments",
      description:
        "Accept payments through your website with a secure online gateway.",
    },
    {
      icon: Smartphone,
      title: "Digital Wallets",
      description:
        "Accept Apple Pay, Google Pay, and other contactless payment methods.",
    },
    {
      icon: ShieldCheck,
      title: "PCI Compliant",
      description:
        "Bank-level security protects every transaction and customer data.",
    },
    {
      icon: Banknote,
      title: "Next-Day Deposits",
      description:
        "Funds deposited to your bank account by the next business day.",
    },
    {
      icon: BarChart3,
      title: "Transaction Dashboard",
      description:
        "Real-time reporting to track sales, refunds, and daily totals.",
    },
  ];

  return (
    <section
      id="features"
      className="py-20 sm:py-28"
      data-testid="section-features"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.div variants={fadeUp}>
            <Badge variant="secondary" className="mb-4">Features</Badge>
          </motion.div>
          <motion.h2
            className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4"
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
              <Card className="h-full overflow-visible hover-elevate transition-all duration-200">
                <CardContent className="p-6">
                  <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                    <f.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-2" data-testid={`text-feature-title-${i}`}>
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
    <section className="py-20 sm:py-28 bg-card/30" data-testid="section-details">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp}>
            <Badge variant="secondary" className="mb-4">
              <CreditCard className="w-3 h-3 mr-1" />
              In-Store
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4" data-testid="text-instore-title">
              In-Store Payments
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              Your terminal handles everything at the counter — credit cards,
              debit cards, chip, swipe, and contactless tap. Quick setup and
              training included so you're accepting payments on day one.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {instoreFeatures.map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-sm" data-testid={`text-instore-${f.toLowerCase().replace(/[\s&/]/g, "-")}`}>{f}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={scaleIn}>
            <Card className="overflow-visible">
              <CardContent className="p-8 sm:p-10">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                    <CreditCard className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Accept Every Card</h3>
                  <p className="text-muted-foreground text-sm">
                    Visa, Mastercard, Amex, Discover, and all major debit cards
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
                    <Badge variant="outline">Visa</Badge>
                    <Badge variant="outline">Mastercard</Badge>
                    <Badge variant="outline">Amex</Badge>
                    <Badge variant="outline">Discover</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          <motion.div className="order-2 lg:order-1" variants={scaleIn}>
            <Card className="overflow-visible">
              <CardContent className="p-8 sm:p-10">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                    <Globe className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Sell Anywhere Online</h3>
                  <p className="text-muted-foreground text-sm">
                    E-commerce, invoices, payment links, and recurring billing
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
                    <Badge variant="outline">Shopify</Badge>
                    <Badge variant="outline">WooCommerce</Badge>
                    <Badge variant="outline">Custom</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div className="order-1 lg:order-2" variants={fadeUp}>
            <Badge variant="secondary" className="mb-4">
              <Globe className="w-3 h-3 mr-1" />
              Online
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4" data-testid="text-online-title">
              Online Payments
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              Sell online with our secure payment gateway. Whether you have an
              e-commerce store or just need to take deposits remotely, we've got
              you covered — same zero-fee model.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {onlineFeatures.map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-sm" data-testid={`text-online-${f.toLowerCase().replace(/[\s-]/g, "-")}`}>{f}</span>
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
    <section className="py-20 sm:py-28" data-testid="section-calculator">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.div variants={fadeUp}>
            <Badge variant="secondary" className="mb-4">
              <TrendingUp className="w-3 h-3 mr-1" />
              Savings Calculator
            </Badge>
          </motion.div>
          <motion.h2
            className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4"
            variants={fadeUp}
            data-testid="text-calc-title"
          >
            How Much Are You Losing?
          </motion.h2>
          <motion.p
            className="text-muted-foreground text-lg"
            variants={fadeUp}
          >
            Enter your monthly sales to see how much you could save each year.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="overflow-visible">
            <CardContent className="p-6 sm:p-8">
              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">
                  Monthly Sales Volume
                </label>
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-foreground" data-testid="text-calc-amount">
                    ${monthly.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min={2000}
                  max={100000}
                  step={1000}
                  value={monthly}
                  onChange={(e) => setMonthly(Number(e.target.value))}
                  className="w-full mt-3 accent-primary cursor-pointer"
                  data-testid="input-calc-slider"
                />
                <div className="flex items-center justify-between gap-4 text-xs text-muted-foreground mt-1">
                  <span>$2,000</span>
                  <span>$100,000</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border">
                <div className="text-center p-4 rounded-md bg-destructive/5 dark:bg-destructive/10">
                  <div className="text-sm text-muted-foreground mb-1">
                    Lost to Traditional Fees
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-destructive" data-testid="text-calc-loss">
                    -${annualLoss.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">per year</div>
                </div>

                <div className="text-center p-4 rounded-md bg-primary/5 dark:bg-primary/10">
                  <div className="text-sm text-muted-foreground mb-1">
                    You Save With Edify
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-primary" data-testid="text-calc-savings">
                    ${annualLoss.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">per year</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

function FAQSection() {
  const faqs = [
    {
      q: "How does zero-fee payment processing work?",
      a: "Instead of the merchant paying 2-4% processing fees on every sale, a small surcharge is passed to the customer at checkout. The merchant keeps 100% of the sale amount with no deductions.",
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
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      id="faq"
      className="py-20 sm:py-28 bg-card/30"
      data-testid="section-faq"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.div variants={fadeUp}>
            <Badge variant="secondary" className="mb-4">FAQ</Badge>
          </motion.div>
          <motion.h2
            className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4"
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
                className="overflow-visible cursor-pointer hover-elevate"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                data-testid={`button-faq-${i}`}
              >
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-semibold text-sm sm:text-base" data-testid={`text-faq-q-${i}`}>
                      {faq.q}
                    </h3>
                    <ChevronRight
                      className={`w-4 h-4 text-muted-foreground shrink-0 mt-0.5 transition-transform duration-200 ${
                        openIndex === i ? "rotate-90" : ""
                      }`}
                    />
                  </div>
                  {openIndex === i && (
                    <motion.p
                      className="text-muted-foreground text-sm mt-3 leading-relaxed"
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
    <section className="py-20 sm:py-28" data-testid="section-cta">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Card className="overflow-visible bg-primary text-primary-foreground border-primary-border">
            <CardContent className="p-8 sm:p-12 lg:p-16 text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4" data-testid="text-cta-title">
                Ready to Keep More of Your Money?
              </h2>
              <p className="text-primary-foreground/80 text-lg sm:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
                Get your $500 terminal and start accepting payments with zero
                ongoing fees. Setup takes minutes, not weeks.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  size="lg"
                  variant="secondary"
                  asChild
                >
                  <a href="https://edifylimited.tech/contact" data-testid="link-cta-get-terminal">
                    Get Your Terminal Today
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent text-primary-foreground border-primary-foreground/30"
                  asChild
                >
                  <a href="https://edifylimited.tech/contact" data-testid="link-cta-talk">
                    Have Questions? Let's Talk
                  </a>
                </Button>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-primary-foreground/70">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Same-Day Setup</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>PCI Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  <span>Zero Monthly Fees</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-12" data-testid="section-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="font-bold text-lg flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
              Edify Limited
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Payment processing solutions that let you keep 100% of every
              sale. No monthly fees, no processing fees, no contracts.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
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
            <h4 className="font-semibold text-sm mb-3">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
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

        <div className="border-t border-border mt-8 pt-8 text-center text-xs text-muted-foreground">
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
        <FeaturesSection />
        <DetailSections />
        <SavingsCalculator />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
