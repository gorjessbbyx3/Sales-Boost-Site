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
  CircleDollarSign,
  Palette,
  MapPin,
  BarChart3,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { fadeUp, staggerContainer, scaleIn } from "@/lib/animations";
import Layout from "@/components/layout";
import { Link } from "wouter";
import terminalImg from "@assets/5C321236-148C-4266-B3E6-16C4212A3FF7_1770597638678.png";
import onlineCardImg from "@assets/IMG_6310_1770676360781.jpeg";

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
      className="relative overflow-hidden"
      data-testid="section-hero"
    >
      <div className="relative w-full min-h-[520px] sm:min-h-[600px] lg:min-h-[680px]">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/images/hero-hawaii-sunset.jpg"
          className="absolute inset-0 w-full h-full object-cover"
          data-testid="video-hero-background"
        >
          <source src="/images/hero-video-v2.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/15 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-16 sm:pb-24 flex flex-col justify-center min-h-[520px] sm:min-h-[600px] lg:min-h-[680px]">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-2xl"
          >
            <motion.div variants={fadeUp}>
              <Badge className="mb-5 sm:mb-6 py-1.5 px-4 text-xs sm:text-sm bg-white/15 text-white border-white/20 backdrop-blur-sm">
                <MapPin className="w-3 h-3 mr-1.5" />
                Proudly Serving Hawai'i
              </Badge>
            </motion.div>

            <motion.h1
              className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] mb-5 sm:mb-6 text-white"
              variants={fadeUp}
              data-testid="text-hero-title"
            >
              Eliminate Credit Card Fees{" "}
              <span className="text-primary">Forever</span>
            </motion.h1>

            <motion.p
              className="text-sm sm:text-lg text-white/80 leading-relaxed mb-4 sm:mb-6 max-w-xl"
              variants={fadeUp}
              data-testid="text-hero-subtitle"
            >
              Two paths to zero fees — get a terminal for in-store payments or go online-only with a free custom website. Keep 100% of every sale.
            </motion.p>

            <motion.div
              className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm text-white/70 mb-6 sm:mb-8"
              variants={fadeUp}
            >
              <span>Cash Discount Program</span>
              <span className="text-white/30">|</span>
              <span>Free Custom Website</span>
              <span className="text-white/30">|</span>
              <span>30-Day Risk-Free Trial</span>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
              variants={fadeUp}
            >
              <Button size="lg" className="w-full sm:w-auto" asChild>
                <Link href="/contact" data-testid="link-hero-schedule-call">
                  Schedule a Call
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/25 text-white bg-white/10 backdrop-blur-sm" asChild>
                <Link href="/pricing" data-testid="link-hero-see-pricing">
                  See Pricing
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-20 pb-16 sm:pb-24">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Card className="border-primary/20 overflow-hidden" data-testid="card-hero-terminal">
            <div className="relative h-48 sm:h-56 overflow-hidden">
              <img
                src={terminalImg}
                alt="Edify payment terminal — $399 one-time purchase"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4">
                <Badge className="bg-primary text-primary-foreground border-0">
                  <CreditCard className="w-3 h-3 mr-1" />
                  In-Store Terminal
                </Badge>
              </div>
            </div>
            <CardContent className="p-5 sm:p-6">
              <h3 className="font-bold text-lg text-foreground mb-1">$399 One-Time Purchase</h3>
              <p className="text-sm text-muted-foreground mb-4">Face-to-face payments with zero processing fees. No monthly fees, ever.</p>
              <ul className="space-y-2 mb-5">
                {["Chip, tap, & swipe accepted", "Same-day setup & training", "Or try free for 30 days"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full" asChild>
                <Link href="/contact" data-testid="link-card-get-terminal">
                  Schedule a Call
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-amber-500/20 overflow-hidden" data-testid="card-hero-online">
            <div className="relative h-48 sm:h-56 overflow-hidden">
              <img
                src={onlineCardImg}
                alt="Your Free Website — Built by Edify LLC, No Cost Ever"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4">
                <Badge className="bg-amber-500 text-white border-0">
                  <Zap className="w-3 h-3 mr-1" />
                  Free Website Included
                </Badge>
              </div>
            </div>
            <CardContent className="p-5 sm:p-6">
              <h3 className="font-bold text-lg text-foreground mb-1">Online Payments + Free Website</h3>
              <p className="text-sm text-muted-foreground mb-4">Accept payments online with a custom website built for your business — at no extra cost.</p>
              <ul className="space-y-2 mb-5">
                {["Custom website designed for you", "Online payment gateway included", "Zero processing fees"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/contact" data-testid="link-card-online-payments">
                  Schedule a Call
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs sm:text-sm text-muted-foreground mt-10 sm:mt-14"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>PCI Compliant</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-primary" />
            <span>Same-Day Setup</span>
          </div>
          <div className="flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-primary" />
            <span>Zero Fees</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-primary" />
            <span>Local Hawai'i Support</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}



function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      title: "Customer Pays With Card",
      description: "Your customer swipes, taps, or inserts their card at checkout — just like any normal transaction.",
      details: [
        "Accept all major credit & debit cards",
        "Tap, swipe, or chip — all supported",
        "Fast, seamless checkout experience",
      ],
      image: "/images/step-choose-plan.png",
      icon: CreditCard,
      accent: "border-blue-500/30",
      numberColor: "text-blue-400",
      checkColor: "text-blue-400",
      iconBg: "bg-blue-500/15 border-blue-500/30",
    },
    {
      step: "02",
      title: "3-4% Fee Added to Total",
      description: "A small processing fee of 3-4% is automatically added to the customer's total — not taken from your sale.",
      details: [
        "Fee is added to customer's total at checkout",
        "Fully transparent — shown on receipt",
        "100% legal & PCI compliant",
      ],
      image: "/images/step-setup.png",
      icon: Zap,
      accent: "border-amber-500/30",
      numberColor: "text-amber-400",
      checkColor: "text-amber-400",
      iconBg: "bg-amber-500/15 border-amber-500/30",
    },
    {
      step: "03",
      title: "You Get 100% Deposited",
      description: "You keep every dollar of your sale. The full amount is deposited directly into your bank account in 1-2 business days.",
      details: [
        "100% of your sale goes to you",
        "Deposited in 1-2 business days",
        "Track everything on your dashboard",
      ],
      image: "/images/step-keep-revenue.png",
      icon: DollarSign,
      accent: "border-emerald-500/30",
      numberColor: "text-emerald-400",
      checkColor: "text-emerald-400",
      iconBg: "bg-emerald-500/15 border-emerald-500/30",
    },
  ];

  return (
    <section className="py-12 sm:py-24 relative overflow-clip bg-[#0a1628]" data-testid="section-how-it-works">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-emerald-600/8 blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-10 sm:mb-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.div variants={fadeUp}>
            <Badge variant="outline" className="mb-4 text-blue-300 border-blue-400/30 bg-blue-500/10">
              <CircleDollarSign className="w-3 h-3 mr-1.5" />
              How It Works
            </Badge>
          </motion.div>
          <motion.h2
            className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3 text-white"
            variants={fadeUp}
          >
            Three Steps to{" "}
            <span className="bg-gradient-to-r from-blue-400 via-emerald-300 to-emerald-400 bg-clip-text text-transparent">
              Zero Fees
            </span>
          </motion.h2>
          <motion.p
            className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-lg"
            variants={fadeUp}
          >
            Traditional processors take 2-4% of every sale. Our model flips that — you keep every dollar.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <Card className={`h-full bg-white/5 backdrop-blur-sm ${s.accent} overflow-visible`} data-testid={`card-step-${s.step}`}>
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-md">
                    <img
                      src={s.image}
                      alt={s.title}
                      className="w-full h-48 sm:h-56 object-cover"
                      data-testid={`img-step-${s.step}`}
                    />
                    <div className="absolute top-3 left-3">
                      <div className={`text-2xl font-black ${s.numberColor} bg-black/50 backdrop-blur-sm rounded-md px-2.5 py-1`}>
                        {s.step}
                      </div>
                    </div>
                  </div>
                  <div className="p-5 sm:p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-9 h-9 rounded-lg ${s.iconBg} border flex items-center justify-center shrink-0`}>
                        <s.icon className={`w-4 h-4 ${s.checkColor}`} />
                      </div>
                      <h3 className="text-lg font-bold text-white">{s.title}</h3>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed mb-4">
                      {s.description}
                    </p>
                    <ul className="space-y-2">
                      {s.details.map((detail) => (
                        <li key={detail} className="flex items-start gap-2 text-sm">
                          <Check className={`w-4 h-4 ${s.checkColor} shrink-0 mt-0.5`} />
                          <span className="text-slate-200">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="flex items-center justify-center gap-4 sm:gap-6 mt-10 sm:mt-12 flex-wrap"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          data-testid="banner-zero-fees-tagline"
        >
          <div className="flex items-center gap-3 px-4 sm:px-5 py-2.5 rounded-md border border-blue-400/20 bg-blue-500/10" data-testid="badge-zero-processing-fees">
            <ShieldCheck className="w-4 h-4 text-blue-300" />
            <span className="text-sm font-semibold text-blue-200">Zero Processing Fees</span>
          </div>
          <div className="w-px h-6 bg-white/20 hidden sm:block" />
          <div className="flex items-center gap-3 px-4 sm:px-5 py-2.5 rounded-md border border-emerald-400/20 bg-emerald-500/10" data-testid="badge-legally-compliantly">
            <Check className="w-4 h-4 text-emerald-300" />
            <span className="text-sm font-semibold text-emerald-200">Legally & Compliantly</span>
          </div>
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
                    <Link href="/contact" data-testid="link-cta-schedule-call">
                      Schedule a Call
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
                    <Link href="/faq" data-testid="link-cta-questions">
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

      <HowItWorksSection />

      <QuickPricingPreview />
      <CTASection />
    </Layout>
  );
}
