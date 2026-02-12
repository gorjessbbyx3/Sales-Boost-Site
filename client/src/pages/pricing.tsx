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
  TrendingUp,
  AlertTriangle,
  Palette,
  Code,
  MapPin,
} from "lucide-react";
import { useState } from "react";
import { fadeUp, staggerContainer, scaleIn } from "@/lib/animations";
import Layout from "@/components/layout";
import { useSEO } from "@/hooks/useSEO";
import processingFeesImg from "@assets/IMG_6402_1770892555479.png";
import { Link } from "wouter";

function PricingHero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-10 sm:pt-36 sm:pb-16">
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
          <motion.div className="flex flex-wrap items-center justify-center gap-2" variants={fadeUp}>
            <Badge variant="outline" className="mb-3 text-primary border-primary/30 bg-primary/5">
              <DollarSign className="w-3 h-3 mr-1" />
              Pricing
            </Badge>
            <Badge variant="outline" className="mb-3 text-primary border-primary/30 bg-primary/5">
              <MapPin className="w-3 h-3 mr-1" />
              Honolulu, HI
            </Badge>
          </motion.div>

          <motion.h1
            className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1] mb-4 sm:mb-6"
            variants={fadeUp}
          >
            Three Ways to{" "}
            <span className="bg-gradient-to-r from-primary to-emerald-300 bg-clip-text text-transparent">
              Get Started
            </span>
          </motion.h1>

          <motion.p
            className="text-sm sm:text-lg text-muted-foreground leading-relaxed mb-6 max-w-2xl mx-auto"
            variants={fadeUp}
          >
            Every option includes zero processing fees and a free custom website. No contracts, cancel anytime.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

function PricingCardsSection() {
  const option1Features = [
    "Countertop terminal (chip, swipe, NFC)",
    "Online payment gateway access",
    "Full setup, programming & training",
    "Free compliance signage kit",
    "Zero monthly fees — forever",
    "Zero processing fees — forever",
  ];

  const option2Features = [
    "Free terminal loan for 30 days",
    "Live processing — real transactions",
    "Full setup & training included",
    "Return anytime — we cover shipping",
    "Auto-purchase on day 31 ($599)",
    "Zero processing fees — forever",
  ];

  const option3Features = [
    "Free custom website built for you",
    "Virtual payment gateway included",
    "Payment links, buttons & invoices",
    "Online ordering / booking",
    "Mobile-optimized & SEO-ready",
    "You own the site — host it yourself (free)",
    "One-off updates from $40 when you need them",
    "Optional maintenance plans from $50/mo",
  ];

  return (
    <section className="py-12 sm:py-24 relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/50 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
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
                <Badge className="shadow-lg shadow-primary/20">Best Value</Badge>
              </div>
              <CardHeader className="pb-2 pt-7 relative">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-primary/15 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base sm:text-lg">In-Store Terminal</CardTitle>
                    <p className="text-xs text-muted-foreground">Own it from day one</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative space-y-4">
                <div className="rounded-lg overflow-hidden bg-muted/30">
                  <img
                    src="/images/terminal-399.png"
                    alt="$399 one-time payment terminal"
                    className="w-full aspect-[16/10] object-contain rounded-lg"
                  />
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">One-time payment</div>
                  <div className="flex items-baseline justify-center gap-1.5">
                    <span className="text-3xl sm:text-4xl font-extrabold text-primary">$399</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    <span className="line-through text-muted-foreground/60">$800+ retail</span>
                    <span className="ml-2 text-primary font-medium">Save 50%+</span>
                  </div>
                </div>

                <ul className="space-y-2">
                  {option1Features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button className="w-full" size="lg" asChild>
                  <Link href="/contact">
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
                <Badge variant="outline" className="text-chart-4 border-chart-4/30 bg-chart-4/5 shadow-lg">No Commitment</Badge>
              </div>
              <CardHeader className="pb-2 pt-7 relative">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-chart-4/15 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-chart-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base sm:text-lg">30-Day Risk-Free Trial</CardTitle>
                    <p className="text-xs text-muted-foreground">Try before you buy</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative space-y-4">
                <div className="rounded-lg overflow-hidden bg-muted/30">
                  <img
                    src="/images/trial-chef.jpg"
                    alt="Try free for 30 days"
                    className="w-full aspect-[16/10] object-contain rounded-lg"
                  />
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">Free for 30 days, then</div>
                  <div className="flex items-baseline justify-center gap-1.5">
                    <span className="text-3xl sm:text-4xl font-extrabold text-chart-4">$599</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Only if you decide to keep it
                  </div>
                </div>

                <ul className="space-y-2">
                  {option2Features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-chart-4 shrink-0 mt-0.5" />
                      <span className="text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button className="w-full" size="lg" variant="outline" asChild>
                  <Link href="/contact">
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
                <Badge variant="outline" className="text-chart-2 border-chart-2/30 bg-chart-2/5 shadow-lg">Online-Only</Badge>
              </div>
              <CardHeader className="pb-2 pt-7 relative">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-chart-2/15 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-chart-2" />
                  </div>
                  <div>
                    <CardTitle className="text-base sm:text-lg">Online Business Package</CardTitle>
                    <p className="text-xs text-muted-foreground">Free website + payment gateway</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative space-y-4">
                <div className="rounded-lg overflow-hidden bg-muted/30">
                  <img
                    src="/images/Website_maintenance .jpeg"
                    alt="Free custom website and payment gateway for online businesses"
                    className="w-full aspect-[16/10] object-contain rounded-lg"
                  />
                </div>
                <div className="text-center py-2">
                  <div className="text-xs text-muted-foreground mb-1">Website + Gateway</div>
                  <div className="flex items-baseline justify-center gap-1.5">
                    <span className="text-3xl sm:text-4xl font-extrabold text-chart-2">FREE</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    With Cash Discount Processing
                  </div>
                </div>

                <ul className="space-y-2">
                  {option3Features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-chart-2 shrink-0 mt-0.5" />
                      <span className="text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-2 border-t border-chart-2/10 space-y-1.5">
                  <div className="flex items-center gap-2 text-sm text-chart-2 font-medium">
                    <Code className="w-4 h-4" />
                    <span>Free website — you own it</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Manage it yourself (free), pay for one-off updates ($40+), or choose a hands-off maintenance plan ($50–$399/mo).
                  </p>
                </div>

                <Button className="w-full" size="lg" variant="outline" asChild>
                  <Link href="/contact">
                    Go Online with TechSavvy
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          className="mt-6 sm:mt-10 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Card className="overflow-visible border-muted">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-9 h-9 rounded-md bg-destructive/10 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-foreground mb-1">
                    Traditional processors cost you $3,600 - $5,400/year
                  </p>
                  <p className="text-xs text-muted-foreground">
                    On $10K/month, you're losing $250-$350 every month to fees. With TechSavvy, you keep every dollar.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.p
          className="text-center text-muted-foreground text-[10px] sm:text-xs mt-4 sm:mt-6 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Minimum $5K monthly volume required. Only 4 trial spots per month. Website valued at $997.
        </motion.p>
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
    <section className="py-12 sm:py-24 relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/8 blur-[120px]" />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-8 sm:mb-14"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.div variants={fadeUp}>
            <Badge variant="outline" className="mb-4 text-primary border-primary/30 bg-primary/5">
              <TrendingUp className="w-3 h-3 mr-1.5" />
              Savings Calculator
            </Badge>
          </motion.div>
          <motion.h2
            className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3"
            variants={fadeUp}
          >
            You're{" "}
            <span className="text-destructive">Losing Money</span>{" "}
            Every Month
          </motion.h2>
          <motion.p
            className="text-muted-foreground text-sm sm:text-lg max-w-2xl mx-auto"
            variants={fadeUp}
          >
            Slide the bar to see how much your current processor is taking.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="overflow-visible border-primary/10">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-primary/5 to-transparent" />
            <CardContent className="p-5 sm:p-10 relative">
              <div className="mb-6">
                <label className="text-sm font-semibold mb-2 block text-foreground">
                  Monthly Sales Volume
                </label>
                <div className="text-3xl sm:text-5xl font-extrabold text-primary mb-3">
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
                />
                <div className="flex items-center justify-between text-[10px] sm:text-xs text-muted-foreground mt-1">
                  <span>$2K</span>
                  <span>$100K</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Card className="overflow-visible border-destructive/20">
                  <CardContent className="p-3 sm:p-5 text-center">
                    <div className="text-[10px] sm:text-sm text-muted-foreground mb-1">
                      Giving Away
                    </div>
                    <div className="text-xl sm:text-3xl font-extrabold text-destructive">
                      -${annualLoss.toLocaleString()}
                    </div>
                    <div className="text-[9px] sm:text-xs text-muted-foreground mt-1">per year</div>
                  </CardContent>
                </Card>

                <Card className="overflow-visible border-primary/20">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-primary/5 to-transparent" />
                  <CardContent className="p-3 sm:p-5 text-center relative">
                    <div className="text-[10px] sm:text-sm text-muted-foreground mb-1">
                      Keep With TechSavvy
                    </div>
                    <div className="text-xl sm:text-3xl font-extrabold text-primary">
                      +${annualLoss.toLocaleString()}
                    </div>
                    <div className="text-[9px] sm:text-xs text-muted-foreground mt-1">back in your pocket</div>
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

function PricingCTA() {
  return (
    <section className="py-12 sm:py-24 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="overflow-visible border-primary/20">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 via-emerald-300/5 to-primary/5" />
            <CardContent className="p-0 relative">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative overflow-hidden rounded-t-xl md:rounded-l-xl md:rounded-tr-none">
                  <img
                    src={processingFeesImg}
                    alt="Business owner frustrated by processing fees"
                    className="w-full h-full object-cover min-h-[200px] md:min-h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/20" />
                </div>
                <div className="p-6 sm:p-8 flex flex-col justify-center text-center md:text-left">
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
                    Don't Let Fees Eat Your Profits
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    The average business loses thousands each year to processing fees. Get a free savings analysis — see exactly how much you'd keep with zero-fee processing.
                  </p>
                  <div>
                    <Button size="lg" asChild>
                      <Link href="/contact">
                        Get Your Free Savings Analysis
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
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

export default function PricingPage() {
  useSEO({
    title: "AI Payment Processing Pricing Hawaii | Zero-Fee Terminal Plans | TechSavvy",
    description: "Compare AI-powered payment processing plans in Hawaii. $399 terminal with free website, 30-day free trial, or free online-only package. Zero monthly fees, zero processing fees. AI-optimized merchant services.",
    keywords: "AI payment processing pricing Hawaii, zero-fee terminal cost Honolulu, payment processing plans Maui, AI merchant services pricing, smart POS system Hawaii price, free payment terminal trial",
    canonical: "https://techsavvyhawaii.com/pricing",
    ogImage: "https://techsavvyhawaii.com/images/hero-hawaii-sunset.jpg",
  });

  return (
    <Layout>
      <PricingHero />
      <PricingCardsSection />
      <SavingsCalculator />
      <PricingCTA />
    </Layout>
  );
}
