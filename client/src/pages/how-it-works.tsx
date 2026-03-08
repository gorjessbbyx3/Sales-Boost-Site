import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  CreditCard, Check, ArrowRight, Clock, DollarSign, ShieldCheck,
  Zap, Phone, FileText, BarChart3, Users, Headphones, ChevronDown, HelpCircle,
} from "lucide-react";
import { useState } from "react";
import { fadeUp, staggerContainer } from "@/lib/animations";
import Layout from "@/components/layout";
import { useSEO } from "@/hooks/useSEO";
import { Link } from "wouter";

const stepChoosePlan = "/images/step-choose-plan.png";
const stepSetup = "/images/step-setup.png";
const stepKeepProfits = "/images/step-keep-revenue.png";

function FAQAccordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-3">
      {items.map((faq, i) => (
        <Card key={i} className="border-border/50 overflow-hidden cursor-pointer" onClick={() => setOpen(open === i ? null : i)}>
          <CardContent className="p-0">
            <button className="w-full p-5 flex items-center justify-between text-left">
              <span className="font-bold text-foreground pr-4">{faq.q}</span>
              <ChevronDown className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`} />
            </button>
            {open === i && (
              <div className="px-5 pb-5 -mt-1">
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function HowItWorksPage() {
  useSEO({
    title: "How It Works & FAQ | Zero-Fee Processing | TechSavvy Hawaii",
    description: "Apply in 3 minutes, get approved in 24 hours, start saving immediately. Plus answers to every question about cash discount programs, equipment, fees, and setup.",
    keywords: "how credit card processing works Hawaii, cash discount program FAQ, eliminate credit card fees, payment processing setup Hawaii, credit card processing FAQ",
    canonical: "https://techsavvyhawaii.com/how-it-works",
    ogImage: "https://techsavvyhawaii.com/images/hero-hawaii-sunset.jpg",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "name": "How It Works & FAQ — TechSavvy Hawaii",
      "url": "https://techsavvyhawaii.com/how-it-works",
    },
  });

  const steps = [
    {
      num: "01",
      title: "Tell Us About Your Business",
      description: "Fill out a quick application or give us a call. We'll look at what you're currently paying and show you the real number — most business owners are shocked when they see how much is actually walking out the door every month.",
      details: [
        "Takes about 3 minutes online or over the phone",
        "We break down every fee your current processor is charging",
        "You get a clear savings number — no guessing, no fluff",
      ],
      icon: FileText,
      image: stepChoosePlan,
      imageAlt: "Business owner reviewing processing statement",
    },
    {
      num: "02",
      title: "We Take Care of Everything",
      description: "Once you're approved, our local Hawai'i team does all the heavy lifting. We show up, swap out your old terminal, put up the required signage, and walk your staff through how it all works. You don't have to figure out a single thing.",
      details: [
        "Free terminal or POS delivered and programmed on-site",
        "Compliant signage installed — we bring everything",
        "Hands-on training so your team is confident from day one",
      ],
      icon: Zap,
      image: stepSetup,
      imageAlt: "TechSavvy team setting up payment terminal",
    },
    {
      num: "03",
      title: "You Stop Paying Fees. Period.",
      description: "From the moment you go live, processing fees are no longer your problem. Card customers see a small surcharge at the terminal. Cash customers pay the listed price. Either way, you keep every single dollar. And if it's ever not working for you — walk away anytime. No contract. No cancellation fee.",
      details: [
        "Zero processing fees from day one — and every day after",
        "No monthly fees, no PCI fees, no hidden charges",
        "No contract — stay because you want to, not because you have to",
      ],
      icon: DollarSign,
      image: stepKeepProfits,
      imageAlt: "Business owner keeping all profits",
    },
  ];

  const features = [
    { icon: Clock, title: "3–7 Day Setup", description: "Most businesses are live and processing within a week." },
    { icon: ShieldCheck, title: "Fully Compliant", description: "Legal in all 50 states. We handle all disclosures and signage." },
    { icon: CreditCard, title: "Accept All Cards", description: "Chip, swipe, tap, Apple Pay, Google Pay — all accepted." },
    { icon: BarChart3, title: "Real-Time Dashboard", description: "Track every transaction, deposit, and refund from your phone." },
    { icon: Headphones, title: "Local Hawaii Support", description: "Real people based in Hawaii. Call, text, or email anytime." },
    { icon: Users, title: "No Contracts", description: "We earn your business every month. Leave whenever you want." },
  ];

  const generalFAQs = [
    { q: "How much can I save with TechSavvy?", a: "With our Cash Back program, you can eliminate up to 100% of processing fees. The average Hawaii business saves $800–$2,000+ per month. We'll show you your exact savings with a free statement analysis." },
    { q: "How does Cash Back work?", a: "We set up your system to offer a cash price and a card price. Card-paying customers see a small surcharge (typically 3–4%) added at the terminal before they confirm. Cash customers pay the listed price. The merchant keeps 100% of every transaction — card or cash." },
    { q: "Is Cash Back legal in Hawaii?", a: "Yes — 100% legal in Hawaii and all 50 states. The FTC and all major card networks (Visa, Mastercard, Amex, Discover) allow surcharges when properly disclosed. TechSavvy handles all required signage and compliance for you." },
    { q: "Will my customers mind the surcharge?", a: "Most don't. Card surcharges are now mainstream — gas stations, restaurants, and retailers all do it. The terminal shows the amount clearly before the customer confirms. Many customers won't even notice or will simply pay with cash." },
    { q: "What kind of businesses do you work with?", a: "We serve restaurants, retail stores, auto repair shops, salons, medical offices, service providers, food trucks, and more — anyone who processes card payments. We also work with high-risk merchants (CBD, vape, firearms, gaming, nutraceuticals)." },
  ];

  const pricingFAQs = [
    { q: "Are there any contracts or sign-up fees?", a: "No contracts, no sign-up fees, no hidden costs. Simple, transparent pricing. You can cancel anytime with zero penalties." },
    { q: "Is the equipment really free?", a: "Yes — during our Hawaii launch promotion, all equipment is free. Terminals and POS systems are provided at no cost for the life of your account. Equipment remains TechSavvy property and is returned if you ever leave the program." },
    { q: "Are there any monthly fees?", a: "TechSavvy charges zero monthly fees — no statement fees, no PCI fees, no gateway fees, no batch fees. Note: Clover POS devices have a separate monthly software fee billed by Clover ($19.99–$84.99/mo depending on plan). Our Valor terminals have zero monthly fees." },
    { q: "What about interchange fees — don't I still pay those?", a: "With Cash Back, the surcharge covers the interchange and processing costs entirely. You keep 100% of your sale amount. That's the whole point — zero fees to you." },
    { q: "What if I want to leave TechSavvy?", a: "No problem. There's no contract and no cancellation fee. Simply return the equipment and you're done. We keep merchants by delivering value, not by trapping them." },
  ];

  const setupFAQs = [
    { q: "How long does it take to get set up?", a: "Most businesses are fully operational within 3–7 days after approval. Our local team handles the entire setup — terminal programming, signage, and staff training." },
    { q: "What equipment will I get?", a: "You choose: basic countertop terminal (Valor VP100), compact POS (Clover Mini), portable wireless (Clover Flex), or full POS station (Clover Solo/Duo). All free during our launch promo." },
    { q: "Do I need to change my bank account?", a: "No. We deposit directly into your existing business bank account. Next-day funding is available for most merchants." },
    { q: "What happens if my terminal breaks?", a: "Contact our local Hawaii support team. We'll troubleshoot remotely or replace the equipment at no cost." },
    { q: "Can I accept online payments too?", a: "Yes. We offer online payment gateways, virtual terminals, invoicing, and payment links in addition to in-store terminals." },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-10 sm:pt-36 sm:pb-16">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/8 via-primary/3 to-transparent" />
          <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-primary/10 blur-[120px]" />
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div variants={fadeUp}>
              <Badge variant="outline" className="mb-4 text-primary border-primary/30 bg-primary/5">
                <Zap className="w-3 h-3 mr-1" />
                Simple 3-Step Process
              </Badge>
            </motion.div>
            <motion.h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-5" variants={fadeUp}>
              How <span className="text-primary">TechSavvy</span> Works
            </motion.h1>
            <motion.p className="text-sm sm:text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto" variants={fadeUp}>
              Three steps to eliminate your processing fees. We handle everything — you just keep making money.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 sm:py-24" id="steps">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20 sm:space-y-28">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6 }}
              >
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <step.icon className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-5xl font-extrabold text-primary/15">{step.num}</span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-4">{step.title}</h2>
                  <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-6">{step.description}</p>
                  <ul className="space-y-3">
                    {step.details.map((d) => (
                      <li key={d} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <span className="text-foreground/90">{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                  <div className="rounded-2xl overflow-hidden border border-border/30 bg-muted/10">
                    <img src={step.image} alt={step.imageAlt} className="w-full aspect-[4/3] object-cover" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 sm:py-24 relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-card/50 via-transparent to-card/50" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
            <motion.div className="text-center mb-10 sm:mb-14" variants={fadeUp}>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
                Everything You Need. <span className="text-primary">Nothing You Don't.</span>
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((f) => (
                <motion.div key={f.title} variants={fadeUp}>
                  <Card className="h-full border-border/50">
                    <CardContent className="p-6">
                      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                        <f.icon className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="font-bold mb-2">{f.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-16 sm:py-24" id="faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <motion.div className="text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Badge variant="outline" className="mb-4 text-primary border-primary/30 bg-primary/5">
              <HelpCircle className="w-3 h-3 mr-1" />
              FAQ
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Questions you're probably thinking.</h2>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h3 className="text-xl font-extrabold mb-5">General</h3>
            <FAQAccordion items={generalFAQs} />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h3 className="text-xl font-extrabold mb-5">Pricing & Equipment</h3>
            <FAQAccordion items={pricingFAQs} />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h3 className="text-xl font-extrabold mb-5">Setup & Support</h3>
            <FAQAccordion items={setupFAQs} />
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Card className="border-primary/20 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-primary/3 to-transparent" />
              <CardContent className="p-8 sm:p-12 relative">
                <div className="text-4xl mb-4">📊</div>
                <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
                  See exactly what you're losing.
                </h2>
                <p className="text-muted-foreground mb-3 max-w-lg mx-auto">
                  Upload your processing statement and our AI will analyze it in under 60 seconds — showing you every hidden fee, your true effective rate, and exactly how much you'd save with TechSavvy.
                </p>
                <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                  Free. No commitment. No one will call you unless you ask.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Button size="lg" className="px-8" asChild>
                    <Link href="/statement-review">
                      Try the Free AI Statement Analysis
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <a href="tel:8087675460">
                      <Phone className="w-4 h-4" />
                      Call (808) 767-5460
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
