import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  CreditCard,
  Globe,
  Check,
  ArrowRight,
  Clock,
  DollarSign,
  ShieldCheck,
  AlertTriangle,
  Code,
  MapPin,
  Gift,
  Truck,
  RotateCcw,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { fadeUp, staggerContainer } from "@/lib/animations";
import Layout from "@/components/layout";
import { useSEO } from "@/hooks/useSEO";
import { Link } from "wouter";

function PricingHero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-8 sm:pt-36 sm:pb-14">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/8 via-primary/3 to-transparent" />
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeUp}>
            <Badge variant="outline" className="mb-4 text-primary border-primary/30 bg-primary/5">
              <Gift className="w-3 h-3 mr-1" />
              Limited Spots Each Month
            </Badge>
          </motion.div>

          <motion.h1
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-5"
            variants={fadeUp}
          >
            Try It{" "}
            <span className="bg-gradient-to-r from-primary to-emerald-300 bg-clip-text text-transparent">
              Free for 30 Days.
            </span>
            <br />
            <span className="text-2xl sm:text-3xl lg:text-4xl text-muted-foreground font-bold">
              If It Doesn't Pay for Itself, Send It Back.
            </span>
          </motion.h1>

          <motion.p
            className="text-sm sm:text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto"
            variants={fadeUp}
          >
            We ship you a terminal. You process real payments for 30 days with zero fees.
            Keep the savings. If you're not convinced, return it — we cover shipping. No contract. No catch.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
            variants={fadeUp}
          >
            <Button size="lg" className="w-full sm:w-auto text-base px-8" asChild>
              <Link href="/contact">
                Start Your Free Trial
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto" asChild>
              <Link href="/statement-review">
                See What You're Overpaying First
                <ChevronRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function HowTheTrialWorks() {
  const steps = [
    {
      num: "01",
      icon: CreditCard,
      title: "We Ship You a Terminal",
      desc: "A brand-new countertop terminal arrives at your door — fully programmed, ready to process. No setup fee.",
    },
    {
      num: "02",
      icon: DollarSign,
      title: "Process Real Payments",
      desc: "Run your business for 30 days with zero processing fees. Watch the savings stack up in real time.",
    },
    {
      num: "03",
      icon: ShieldCheck,
      title: "Decide on Day 31",
      desc: "Love it? Keep the terminal for $399 (you already saved more than that). Not for you? Ship it back free.",
    },
  ];

  return (
    <section className="py-14 sm:py-24 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.div className="text-center mb-10 sm:mb-16" variants={fadeUp}>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
              How the Free Trial Works
            </h2>
            <p className="text-muted-foreground text-sm sm:text-lg max-w-xl mx-auto">
              Three steps. Zero risk. You'll know within a week.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
            {steps.map((step, i) => (
              <motion.div key={step.num} variants={fadeUp}>
                <Card className="h-full border-primary/10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/60 to-primary/20" />
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                        <step.icon className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-4xl font-extrabold text-primary/15">{step.num}</span>
                    </div>
                    <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
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

function WhatYouGet() {
  return (
    <section className="py-14 sm:py-24 relative">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-card/50 via-transparent to-card/50" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.div className="text-center mb-10 sm:mb-16" variants={fadeUp}>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
              Everything Included.{" "}
              <span className="text-primary">No Add-Ons.</span>
            </h2>
            <p className="text-muted-foreground text-sm sm:text-lg max-w-xl mx-auto">
              Other processors nickel-and-dime you. We give you the whole package upfront.
            </p>
          </motion.div>

          <motion.div variants={fadeUp}>
            <Card className="border-primary/20 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-transparent" />
              <CardContent className="p-6 sm:p-10 relative">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5">
                  {[
                    "Countertop terminal (chip, tap, swipe)",
                    "Zero processing fees — forever",
                    "Zero monthly fees — forever",
                    "Zero contracts or cancellation fees",
                    "Free custom-built website",
                    "Free statement analysis & consultation",
                    "Full setup, programming & training",
                    "Compliance signage kit included",
                    "Local Hawai'i-based support team",
                    "Online payment gateway access",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <span className="text-sm text-foreground/90">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-primary/10">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">After your free trial</div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl sm:text-4xl font-extrabold text-primary">$399</span>
                        <span className="text-sm text-muted-foreground">one-time · you own it</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        No monthly fees. No lease. No recurring charges. Ever.
                      </p>
                    </div>
                    <Button size="lg" asChild>
                      <Link href="/contact">
                        Start Free Trial
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
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

function ComparisonSection() {
  const rows = [
    { feature: "Monthly fees", them: "$30–$150/mo", us: "$0 — forever" },
    { feature: "Processing fees", them: "2.5–4.5% effective rate", us: "0% — zero fees" },
    { feature: "Contract length", them: "2–3 year lock-in", us: "None — cancel anytime" },
    { feature: "Early termination fee", them: "$300–$500+", us: "$0" },
    { feature: "Terminal cost", them: "$30–$80/mo lease", us: "$399 one-time (you own it)" },
    { feature: "Website", them: "Not included", us: "Free custom site included" },
    { feature: "Setup time", them: "2–4 weeks", us: "3–7 days" },
    { feature: "Support", them: "Overseas call center", us: "Local Hawai'i team" },
  ];

  return (
    <section className="py-14 sm:py-24 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.div className="text-center mb-10 sm:mb-14" variants={fadeUp}>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
              TechSavvy vs. Your Current Processor
            </h2>
            <p className="text-muted-foreground text-sm sm:text-lg max-w-xl mx-auto">
              Side by side, it's not even close.
            </p>
          </motion.div>

          <motion.div variants={fadeUp}>
            <Card className="overflow-hidden border-border/50">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left p-4 text-muted-foreground font-medium w-[35%]"></th>
                      <th className="text-center p-4 w-[32.5%]">
                        <div className="flex items-center justify-center gap-2 text-muted-foreground">
                          <AlertTriangle className="w-4 h-4 text-red-400" />
                          <span className="font-semibold">Typical Processor</span>
                        </div>
                      </th>
                      <th className="text-center p-4 w-[32.5%] bg-primary/5">
                        <div className="flex items-center justify-center gap-2 text-primary">
                          <Sparkles className="w-4 h-4" />
                          <span className="font-bold">TechSavvy</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => (
                      <tr key={row.feature} className={`border-b border-border/30 ${i % 2 === 0 ? "" : "bg-muted/20"}`}>
                        <td className="p-3 sm:p-4 font-medium text-foreground/80">{row.feature}</td>
                        <td className="p-3 sm:p-4 text-center text-red-400/90 text-xs sm:text-sm">{row.them}</td>
                        <td className="p-3 sm:p-4 text-center text-primary font-semibold bg-primary/5 text-xs sm:text-sm">{row.us}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function ZeroRiskSection() {
  const guarantees = [
    {
      icon: Truck,
      title: "Free shipping both ways",
      desc: "We ship the terminal to you free. If you return it, we cover return shipping too.",
    },
    {
      icon: RotateCcw,
      title: "Full refund, no questions",
      desc: "Not happy after 30 days? Send it back. No cancellation fee. No explanation needed.",
    },
    {
      icon: ShieldCheck,
      title: "No contract ever",
      desc: "Even after you buy, there's no contract. Leave whenever you want with zero penalty.",
    },
    {
      icon: Gift,
      title: "Keep the website",
      desc: "We build you a free custom website during your trial. It's yours to keep no matter what.",
    },
  ];

  return (
    <section className="py-14 sm:py-24 relative">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-card/50 to-transparent" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.div className="text-center mb-10 sm:mb-14" variants={fadeUp}>
            <Badge variant="outline" className="mb-4 text-primary border-primary/30 bg-primary/5">
              <ShieldCheck className="w-3 h-3 mr-1.5" />
              Zero-Risk Guarantee
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
              We Take All the Risk.{" "}
              <span className="text-primary">You Take None.</span>
            </h2>
            <p className="text-muted-foreground text-sm sm:text-lg max-w-xl mx-auto">
              If we can't save you money, we don't deserve your business. Simple as that.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {guarantees.map((g) => (
              <motion.div key={g.title} variants={fadeUp}>
                <Card className="h-full border-primary/10">
                  <CardContent className="p-5 sm:p-7">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <g.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-bold mb-2">{g.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{g.desc}</p>
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

function OnlineOption() {
  return (
    <section className="py-14 sm:py-24 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.div className="text-center mb-8" variants={fadeUp}>
            <Badge variant="outline" className="mb-4 text-chart-2 border-chart-2/30 bg-chart-2/5">
              <Globe className="w-3 h-3 mr-1.5" />
              Online-Only Businesses
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
              No Storefront? No Problem.
            </h2>
            <p className="text-muted-foreground text-sm sm:text-lg max-w-xl mx-auto">
              If you only take payments online, we build you a free website with a built-in payment gateway — no terminal needed.
            </p>
          </motion.div>

          <motion.div variants={fadeUp}>
            <Card className="border-chart-2/20 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-chart-2/3 to-transparent" />
              <CardContent className="p-6 sm:p-8 relative">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-3">
                    {[
                      "Free custom website — you own it",
                      "Virtual payment gateway included",
                      "Payment links, buttons & invoices",
                      "Online ordering & booking",
                      "Mobile-optimized & SEO-ready",
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-chart-2 flex-shrink-0" />
                        <span className="text-sm text-foreground/80">{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    {[
                      "Self-manage for free (it's your site)",
                      "One-off updates from $40",
                      "Maintenance plans from $50/mo",
                      "Zero processing fees",
                      "No contracts — ever",
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-chart-2 flex-shrink-0" />
                        <span className="text-sm text-foreground/80">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-chart-2/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-2xl sm:text-3xl font-extrabold text-chart-2">FREE</span>
                    <span className="text-sm text-muted-foreground ml-2">with cash discount processing</span>
                  </div>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/contact">
                      Go Online with TechSavvy
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="py-14 sm:py-24 relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="border-primary/20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-primary/3 to-transparent" />
            <CardContent className="p-8 sm:p-12 relative text-center">
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
                Still Thinking About It?
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base mb-6 max-w-lg mx-auto">
                Every month you wait is another month your processor keeps hundreds of your dollars.
                The trial is free. The return is free. The only cost is doing nothing.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button size="lg" className="w-full sm:w-auto text-base px-8" asChild>
                  <Link href="/contact">
                    Start Your Free 30-Day Trial
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Limited to 4 trial spots per month · $5K minimum monthly volume
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

export default function PricingPage() {
  useSEO({
    title: "Free 30-Day Trial | Zero-Fee Payment Processing | TechSavvy Hawaii",
    description: "Try TechSavvy Hawaii's zero-fee payment terminal free for 30 days. No contracts, no monthly fees, no risk. Keep every dollar you process. Return anytime — we cover shipping.",
    keywords: "free payment processing trial Hawaii, zero-fee terminal Honolulu, no contract payment processor, free POS trial Hawaii, TechSavvy free trial",
    canonical: "https://techsavvyhawaii.com/pricing",
    ogImage: "https://techsavvyhawaii.com/images/hero-hawaii-sunset.jpg",
  });

  return (
    <Layout>
      <PricingHero />
      <HowTheTrialWorks />
      <WhatYouGet />
      <ComparisonSection />
      <ZeroRiskSection />
      <OnlineOption />
      <FinalCTA />
    </Layout>
  );
}
