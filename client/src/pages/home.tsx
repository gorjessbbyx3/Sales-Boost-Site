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
  BarChart3,
} from "lucide-react";
import { useEffect, useRef } from "react";
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
      className="relative overflow-hidden pt-20 pb-12 sm:pt-36 sm:pb-24"
      data-testid="section-hero"
    >
      <div className="absolute inset-0 -z-10">
        <img
          src="/images/hero-banner.jpg"
          alt="Eliminate Credit Card Fees — Edify Hawaii"
          className="w-full h-full object-cover object-center opacity-15 sm:opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="flex flex-wrap items-center justify-center gap-2" variants={fadeUp}>
            <Badge variant="outline" className="mb-3 sm:mb-4 py-1 px-3 text-xs sm:text-sm text-primary border-primary/30 bg-primary/5">
              <MapPin className="w-3 h-3 mr-1" />
              Proudly Serving Hawai'i
            </Badge>
            <Badge variant="outline" className="mb-3 sm:mb-4 py-1 px-3 text-xs sm:text-sm text-primary border-primary/30 bg-primary/5">
              <CircleDollarSign className="w-3 h-3 mr-1" />
              Save $3,600+ Per Year
            </Badge>
          </motion.div>

          <motion.h1
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-5 sm:mb-8"
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
            className="text-sm sm:text-lg text-muted-foreground leading-relaxed mb-6 sm:mb-10 max-w-2xl mx-auto"
            variants={fadeUp}
            data-testid="text-hero-subtitle"
          >
            Starting at $399 for a terminal — or go online-only with a{" "}
            <span className="text-primary font-semibold">free custom website</span>. No monthly fees. No processing fees.
            Keep{" "}
            <span className="text-primary font-semibold">100% of every sale</span>.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
            variants={fadeUp}
          >
            <Button size="lg" className="w-full sm:w-auto" asChild>
              <Link href="/contact" data-testid="link-hero-get-terminal">
                Get Your Terminal
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto" asChild>
              <Link href="/services-faq" data-testid="link-hero-learn-more">
                Learn More
                <ChevronRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            className="mt-8 sm:mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-muted-foreground"
            variants={fadeUp}
          >
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              <span>PCI Compliant</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-primary" />
              <span>Same-Day Setup</span>
            </div>
            <div className="flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-primary" />
              <span>Zero Monthly Fees</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-primary" />
              <span>Online Option</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-8 sm:mt-14 max-w-4xl mx-auto rounded-xl overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          <img
            src="/images/hero-banner.jpg"
            alt="Edify Hawaii — zero-fee payment processing and free custom websites for local businesses"
            className="w-full h-auto rounded-xl shadow-lg"
          />
        </motion.div>

        <motion.div
          className="mt-8 sm:mt-14 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
        >
          <div className="grid grid-cols-3 gap-3 sm:gap-6">
            {[
              { value: 5400, prefix: "$", suffix: "+", label: "Saved/Year", color: "text-primary" },
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

  return (
    <section className="py-12 sm:py-20 relative bg-muted/30" data-testid="section-social-proof">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              className="text-center group p-4 rounded-xl hover:bg-background transition-colors shadow-sm shadow-transparent hover:shadow-primary/5"
              variants={fadeUp}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider">
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
      description: "Pick in-store terminal for face-to-face payments, or go online-only with a free website. Zero processing fees either way.",
      details: [
        "In-Store Terminal — $399 one-time, own it immediately",
        "30-Day Trial — free to try, $599 if you keep it",
        "OR Online-Only — FREE website + payment gateway",
      ],
      icon: CreditCard,
      color: "text-primary",
      border: "border-primary/20",
      accent: "from-primary/20 to-primary/5",
    },
    {
      step: "02",
      title: "We Set Everything Up",
      description: "Same-day setup. We configure your terminal, connect it to your bank, train you, and provide compliance signage.",
      details: [
        "Terminal programming & configuration",
        "Bank account connection",
        "Hands-on training (remote or on-site)",
        "Compliance signage provided",
      ],
      icon: Zap,
      color: "text-chart-2",
      border: "border-chart-2/20",
      accent: "from-chart-2/20 to-chart-2/5",
    },
    {
      step: "03",
      title: "Keep 100% of Every Sale",
      description: "A small surcharge is passed to card-paying customers at checkout. You keep 100% of the listed price, deposited by next business day.",
      details: [
        "Customer pays small surcharge on card transactions",
        "Cash-paying customers get the listed price",
        "100% of your sale deposited next business day",
        "Real-time dashboard to track all transactions",
      ],
      icon: DollarSign,
      color: "text-chart-3",
      border: "border-chart-3/20",
      accent: "from-chart-3/20 to-chart-3/5",
    },
  ];

  return (
    <section className="py-12 sm:py-24 relative" data-testid="section-how-it-works">
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
              <CircleDollarSign className="w-3 h-3 mr-1.5" />
              How It Works
            </Badge>
          </motion.div>
          <motion.h2
            className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3"
            variants={fadeUp}
          >
            Three Steps to{" "}
            <span className="bg-gradient-to-r from-primary to-emerald-300 bg-clip-text text-transparent">
              Zero Fees
            </span>
          </motion.h2>
          <motion.p
            className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-lg"
            variants={fadeUp}
          >
            Traditional processors take 2-4% of every sale. Our model flips that — you keep every dollar.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">
          <motion.div
            className="flex items-center justify-center mx-auto max-w-[280px] sm:max-w-sm lg:max-w-none lg:sticky lg:top-24"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img
              src="/images/cash-discount-infographic.jpeg"
              alt="How Edify zero-fee payment processing works — Step 1: Customer pays with card, Step 2: Small non-cash adjustment of 3-4%, Step 3: Business keeps 100% of payment"
              className="w-full object-contain rounded-xl"
              data-testid="img-how-it-works-infographic"
            />
          </motion.div>

          <div className="space-y-4 sm:space-y-5">
            {steps.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
              >
                <Card className={`overflow-visible relative ${s.border}`}>
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-b ${s.accent} opacity-50`} />
                  <CardContent className="p-4 sm:p-6 relative">
                    <div className="flex items-center gap-3 mb-2 sm:mb-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <s.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${s.color}`} />
                      </div>
                      <div>
                        <div className={`text-[10px] sm:text-xs font-bold ${s.color} uppercase tracking-[0.2em]`}>
                          Step {s.step}
                        </div>
                        <h3 className="text-sm sm:text-xl font-bold text-foreground">
                          {s.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-2 sm:mb-3">
                      {s.description}
                    </p>
                    <ul className="space-y-1 sm:space-y-1.5">
                      {s.details.map((detail) => (
                        <li key={detail} className="flex items-start gap-1.5 sm:gap-2 text-xs sm:text-sm">
                          <Check className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${s.color} shrink-0 mt-0.5`} />
                          <span className="text-foreground/80">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyEdifySection() {
  const benefits = [
    {
      icon: DollarSign,
      title: "Zero Processing Fees",
      description: "You keep 100% of every sale. No 2-4% taken from your revenue.",
    },
    {
      icon: Clock,
      title: "Same-Day Setup",
      description: "Start accepting payments today with full training and support.",
    },
    {
      icon: Globe,
      title: "Online-Only Option",
      description: "Don't need a terminal? Get a free website and payment gateway instead.",
    },
    {
      icon: ShieldCheck,
      title: "PCI Compliant & Secure",
      description: "End-to-end encryption, tokenization, and full PCI compliance.",
    },
    {
      icon: BarChart3,
      title: "Real-Time Dashboard",
      description: "Track every transaction, deposit, and refund from your dashboard.",
    },
    {
      icon: MapPin,
      title: "Local Hawai'i Support",
      description: "Based in Honolulu with on-site support available. We know your market.",
    },
  ];

  return (
    <section className="py-12 sm:py-24 relative" data-testid="section-why-edify">
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
              Why Edify
            </Badge>
          </motion.div>
          <motion.h2
            className="text-2xl sm:text-4xl font-extrabold tracking-tight"
            variants={fadeUp}
          >
            Why Hawai'i Businesses Choose Us
          </motion.h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {benefits.map((b, i) => (
            <motion.div key={i} variants={scaleIn}>
              <Card className="h-full overflow-visible border-primary/10">
                <CardContent className="p-5 sm:p-6">
                  <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center mb-3">
                    <b.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground mb-1">{b.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{b.description}</p>
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
    <section className="py-12 sm:py-24 relative" data-testid="section-pricing-preview">
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
            Simple, Transparent Pricing
          </motion.h2>
        </motion.div>

        <motion.div
          className="max-w-5xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.div variants={fadeUp} className="mb-3">
            <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5">
              <CreditCard className="w-3 h-3 mr-1" />
              Path 1: In-Store Terminal
            </Badge>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {[
              {
                title: "In-Store Terminal",
                price: "$399",
                note: "One-time - Best Value",
                icon: CreditCard,
                color: "text-primary",
                border: "border-primary/20",
                features: ["Own it from day one", "Full setup & training", "Zero fees forever"],
              },
              {
                title: "30-Day Free Trial",
                price: "FREE",
                note: "Then $599 if you keep it",
                icon: Clock,
                color: "text-chart-4",
                border: "border-chart-4/20",
                features: ["Try before you buy", "Real transactions", "Return anytime"],
              },
            ].map((plan, i) => (
              <motion.div key={i} variants={scaleIn}>
                <Card className={`h-full w-full overflow-visible ${plan.border}`}>
                  <CardContent className="p-5 sm:p-6 text-center">
                    <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <plan.icon className={`w-5 h-5 ${plan.color}`} />
                    </div>
                    <h3 className="font-bold text-foreground mb-1">{plan.title}</h3>
                    <div className={`text-2xl sm:text-3xl font-extrabold ${plan.color} mb-1`}>{plan.price}</div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground mb-4">{plan.note}</div>
                    <ul className="space-y-2 text-left">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm">
                          <Check className={`w-3.5 h-3.5 ${plan.color} shrink-0`} />
                          <span className="text-foreground/80">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeUp} className="flex items-center gap-4 my-6 sm:my-8">
            <div className="flex-1 h-px bg-border" />
            <span className="text-base sm:text-lg font-bold text-muted-foreground tracking-widest uppercase">OR</span>
            <div className="flex-1 h-px bg-border" />
          </motion.div>

          <motion.div variants={fadeUp} className="mb-3">
            <Badge variant="outline" className="text-chart-2 border-chart-2/30 bg-chart-2/5">
              <Globe className="w-3 h-3 mr-1" />
              Path 2: Online Processing
            </Badge>
          </motion.div>
          <motion.div variants={scaleIn} className="max-w-lg mx-auto sm:mx-0">
            <Card className="overflow-visible border-chart-2/20">
              <CardContent className="p-5 sm:p-6 text-center">
                <div className="w-10 h-10 rounded-md bg-chart-2/10 flex items-center justify-center mx-auto mb-3">
                  <Globe className="w-5 h-5 text-chart-2" />
                </div>
                <h3 className="font-bold text-foreground mb-1">Online Processing + Free Website</h3>
                <div className="text-2xl sm:text-3xl font-extrabold text-chart-2 mb-1">FREE</div>
                <div className="text-[10px] sm:text-xs text-muted-foreground mb-4">Website + Payment Gateway</div>
                <ul className="space-y-2 text-left">
                  {["Free website built for you", "Payment gateway included", "You own everything"].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="w-3.5 h-3.5 text-chart-2 shrink-0" />
                      <span className="text-foreground/80">{f}</span>
                    </li>
                  ))}
                </ul>
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
          <Button size="lg" asChild>
            <Link href="/pricing" data-testid="link-compare-pricing">
              Compare All Options
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-12 sm:py-24 relative" data-testid="section-cta">
      <div className="absolute inset-0 -z-10">
        <img
          src="/images/serving-hawaii.jpg"
          alt="Proudly Serving Honolulu Businesses"
          className="w-full h-full object-cover object-center opacity-10 sm:opacity-15"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background" />
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
            <div className="relative rounded-xl bg-gradient-to-b from-card via-card to-background p-6 sm:p-12 lg:p-16 text-center">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-primary/10 to-transparent" />
              <div className="relative">
                <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mb-4 text-foreground">
                  Zero Processing Fees ={" "}
                  <span className="bg-gradient-to-r from-primary to-emerald-300 bg-clip-text text-transparent">
                    More Profit
                  </span>
                </h2>
                <p className="text-muted-foreground text-sm sm:text-lg mb-6 sm:mb-10 max-w-2xl mx-auto">
                  Get a terminal starting at $399 for in-store payments — or go online-only with a free website and payment gateway.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Button size="lg" className="w-full sm:w-auto" asChild>
                    <Link href="/contact" data-testid="link-cta-mockup">
                      Get Free Mockup + Savings Quote
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
                    <Link href="/services-faq" data-testid="link-cta-questions">
                      Have Questions? Learn More
                    </Link>
                  </Button>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mt-6 sm:mt-10 text-xs sm:text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span>Same-Day Setup</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-primary" />
                    <span>Online Option Available</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-primary" />
                    <span>Zero Fees</span>
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
      <WhyEdifySection />
      <QuickPricingPreview />
      <CTASection />
    </Layout>
  );
}
