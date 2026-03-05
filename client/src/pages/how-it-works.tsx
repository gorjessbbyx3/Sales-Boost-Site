import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  CreditCard,
  Zap,
  DollarSign,
  ShieldCheck,
  Check,
  ArrowRight,
  Clock,
  Palette,
  MapPin,
  CircleDollarSign,
  BarChart3,
} from "lucide-react";
import { fadeUp, staggerContainer, scaleIn } from "@/lib/animations";
import Layout from "@/components/layout";
import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import stepChoosePlan from "@/assets/images/step-choose-plan.png";
import stepSetup from "@/assets/images/step-setup.png";
import stepKeepProfits from "@/assets/images/step-keep-profits.png";

function HowItWorksHero() {
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
              <CircleDollarSign className="w-3 h-3 mr-1" />
              How It Works
            </Badge>
          </motion.div>

          <motion.h1
            className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1] mb-4 sm:mb-6"
            variants={fadeUp}
          >
            Three Steps to{" "}
            <span className="bg-gradient-to-r from-primary to-emerald-300 bg-clip-text text-transparent">
              Zero Fees
            </span>
          </motion.h1>

          <motion.p
            className="text-sm sm:text-lg text-muted-foreground leading-relaxed mb-6 max-w-2xl mx-auto"
            variants={fadeUp}
          >
            Traditional processors take 2-4% of every sale. Our model flips
            that — your customer pays a small surcharge, and you keep every dollar.
          </motion.p>

          <motion.div className="mt-8 rounded-xl overflow-hidden bg-muted/30 max-w-2xl mx-auto" variants={fadeUp}>
            <img
              src="/images/how-it-works-steps.jpeg"
              alt="How TechSavvy zero-fee payment processing works — Step 1: Customer pays with card, Step 2: Small non-cash adjustment, Business keeps 100% of payment"
              className="w-full max-h-[50vh] object-contain"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function StepsSection() {
  const steps = [
    {
      step: "01",
      title: "Start Your Free Trial",
      description: "We ship you a terminal — fully programmed, ready to process. Try it for 30 days with zero fees, zero risk.",
      details: [
        "Free terminal shipped to your door",
        "Process real payments from day one",
        "Return anytime — we cover shipping",
      ],
      icon: CreditCard,
      accent: "from-primary/20 to-primary/5",
      color: "text-primary",
      border: "border-primary/20",
      image: stepChoosePlan,
      imageAlt: "Business owner choosing a payment plan",
    },
    {
      step: "02",
      title: "We Set Everything Up",
      description: "Same-day setup. We configure your terminal, connect it to your bank, train you on how to use it, and provide compliance signage.",
      details: [
        "Terminal programming & configuration",
        "Bank account connection",
        "Hands-on training (remote or on-site in Honolulu)",
        "Compliance signage provided",
      ],
      icon: Zap,
      accent: "from-chart-2/20 to-chart-2/5",
      color: "text-chart-2",
      border: "border-chart-2/20",
      image: stepSetup,
      imageAlt: "Technician setting up a payment terminal",
    },
    {
      step: "03",
      title: "Keep 100% of Every Sale",
      description: "A small surcharge is passed to card-paying customers at checkout. You keep 100% of the listed price, deposited by next business day.",
      details: [
        "Customer pays small surcharge on card transactions",
        "Cash-paying customers get the listed price (or a discount)",
        "100% of your sale deposited next business day",
        "Real-time dashboard to track all transactions",
      ],
      icon: DollarSign,
      accent: "from-chart-3/20 to-chart-3/5",
      color: "text-chart-3",
      border: "border-chart-3/20",
      image: stepKeepProfits,
      imageAlt: "Happy business owner keeping all their profits",
    },
  ];

  return (
    <section className="py-12 sm:py-24 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6 sm:space-y-10">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className={`overflow-visible relative ${s.border}`}>
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-b ${s.accent} opacity-50`} />
                <CardContent className="p-0 relative">
                  <div className={`grid grid-cols-1 md:grid-cols-2 ${i % 2 === 1 ? "md:grid-flow-dense" : ""}`}>
                    <div className={`relative overflow-hidden ${i % 2 === 1 ? "md:col-start-2" : ""} rounded-t-xl md:rounded-t-none ${i % 2 === 0 ? "md:rounded-l-xl" : "md:rounded-r-xl"}`}>
                      <img
                        src={s.image}
                        alt={s.imageAlt}
                        className="w-full h-48 md:h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/10" />
                    </div>
                    <div className="p-5 sm:p-8 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <s.icon className={`w-6 h-6 ${s.color}`} />
                        </div>
                        <div>
                          <div className={`text-xs font-bold ${s.color} uppercase tracking-[0.2em]`}>
                            Step {s.step}
                          </div>
                          <h2 className="text-lg sm:text-2xl font-bold text-foreground">
                            {s.title}
                          </h2>
                        </div>
                      </div>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                        {s.description}
                      </p>
                      <ul className="space-y-2">
                        {s.details.map((detail) => (
                          <li key={detail} className="flex items-start gap-2 text-sm">
                            <Check className={`w-4 h-4 ${s.color} shrink-0 mt-0.5`} />
                            <span className="text-foreground/80">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyTechSavvySection() {
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
      icon: Palette,
      title: "Zero Risk Trial",
      description: "Try for 30 days free. Return anytime — no fees, no contracts, no questions.",
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
              Why TechSavvy
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

function HowItWorksCTA() {
  return (
    <section className="py-12 sm:py-24 relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="overflow-visible border-primary/20">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 via-emerald-300/5 to-primary/5" />
            <CardContent className="p-8 relative text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
                Ready to Keep Every Dollar?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                See our pricing options and choose the plan that works for your business.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button size="lg" asChild>
                  <Link href="/pricing">
                    See Pricing
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/contact">
                    Contact Us
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

export default function HowItWorksPage() {
  useSEO({
    title: "How AI Payment Processing Works in Hawaii | Zero-Fee Setup | TechSavvy",
    description: "Learn how TechSavvy's AI-powered zero-fee payment processing works. Choose your plan, get same-day setup, and keep 100% of your revenue. AI-driven merchant solutions for Hawaii businesses.",
    keywords: "how AI payment processing works Hawaii, zero-fee processing explained, surcharge processing Hawaii, AI merchant setup Honolulu, same-day payment terminal, intelligent payment solutions",
    canonical: "https://techsavvyhawaii.com/how-it-works",
  });

  return (
    <Layout>
      <HowItWorksHero />
      <StepsSection />
      <WhyTechSavvySection />
      <HowItWorksCTA />
    </Layout>
  );
}
