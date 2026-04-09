import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Check, ArrowRight, DollarSign, ShieldCheck, Phone, Truck, RotateCcw,
  Gift, Flame, Clock, ChevronDown, Star,
  UtensilsCrossed, ShoppingBag, Scissors,
} from "lucide-react";
import { useState } from "react";
import { fadeUp, staggerContainer } from "@/lib/animations";
import Layout from "@/components/layout";
import { useSEO } from "@/hooks/useSEO";

const FEATURED_DEVICES = [
  {
    name: "Valor VP100",
    retail: "$195",
    img: "/images/equipment/valor-vp100.png",
    desc: "Countertop terminal with EMV chip, contactless tap, and swipe. Built-in receipt printer. Perfect for any business that just needs to accept cards.",
    best: "Food trucks, small shops, service pros",
    features: ["EMV chip + tap + swipe", "Built-in receipt printer", "Cash discount ready", "Countertop or wireless"],
  },
  {
    name: "Clover Mini",
    retail: "$750",
    img: "/images/equipment/clover-mini.jpg",
    desc: "Compact 8\" touchscreen POS with the full Clover ecosystem. Inventory, employee management, loyalty — in a small package.",
    best: "Salons, spas, cafes, boutiques",
    features: ["8\" HD touchscreen", "Full Clover App Market", "Inventory tracking", "Employee management"],
  },
  {
    name: "Clover Flex",
    retail: "$550",
    img: "/images/equipment/clover-flex.webp",
    desc: "Take payments anywhere — tableside, curbside, at events. Wireless with built-in printer, camera, and barcode scanner.",
    best: "Restaurants, food trucks, delivery",
    features: ["Wireless / LTE", "Built-in printer + camera", "Tableside payments", "Barcode scanner"],
  },
  {
    name: "Clover Station Solo",
    retail: "$1,500",
    img: "/images/equipment/clover-station-solo.png",
    desc: "Full countertop POS with 14\" HD display, receipt printer, and cash drawer. The complete system for serious businesses.",
    best: "Retail stores, restaurants, high-volume",
    features: ["14\" HD touchscreen", "Receipt printer + cash drawer", "Full inventory & reporting", "Fingerprint login"],
  },
  {
    name: "Clover Station Duo",
    retail: "$1,900",
    img: "/images/equipment/clover-station-duo.png",
    desc: "Dual-screen POS — your screen plus a customer-facing display for payments and tips. The premium restaurant and retail setup.",
    best: "Full-service restaurants, bars, retail",
    features: ["14\" merchant + 8\" customer screen", "Customer-facing payments", "Table management + tips", "Full-service restaurant ready"],
  },
  {
    name: "Pax A920",
    retail: "$320",
    img: "/images/equipment/pax-a920.webp",
    desc: "Android smart terminal with 5\" touchscreen. Versatile mid-range option with Wi-Fi and 4G for businesses that want flexibility.",
    best: "Multi-location, mobile businesses",
    features: ["5\" touchscreen", "Android OS", "Wi-Fi + 4G", "Built-in printer + camera"],
  },
];

const BUSINESS_SETUPS = [
  {
    icon: UtensilsCrossed,
    name: "Restaurant / Bar",
    color: "text-orange-500",
    bg: "bg-orange-500/10 border-orange-500/20",
    recommended: "Clover Station Duo",
    why: "Dual screen for servers and customers, table management, tip adjustments, kitchen tickets. Add a Clover Flex for tableside payments.",
    savings: "Typically saves $800–$2,000/mo in processing fees",
  },
  {
    icon: ShoppingBag,
    name: "Retail / Convenience",
    color: "text-blue-500",
    bg: "bg-blue-500/10 border-blue-500/20",
    recommended: "Clover Station Solo",
    why: "14\" screen for quick checkout, barcode scanning, full inventory management. Add a cash drawer and barcode scanner for the full setup.",
    savings: "Typically saves $500–$1,500/mo in processing fees",
  },
  {
    icon: Scissors,
    name: "Salon / Spa / Service",
    color: "text-pink-500",
    bg: "bg-pink-500/10 border-pink-500/20",
    recommended: "Clover Mini",
    why: "Small footprint fits any reception desk. Appointment tracking, customer profiles, and loyalty rewards built in.",
    savings: "Typically saves $300–$800/mo in processing fees",
  },
  {
    icon: Truck,
    name: "Food Truck / Mobile",
    color: "text-green-500",
    bg: "bg-green-500/10 border-green-500/20",
    recommended: "Valor VP100 or Clover Flex",
    why: "Wireless terminal goes anywhere. The VP100 keeps it simple with zero monthly software fees. Upgrade to Clover Flex if you need a full mobile POS.",
    savings: "Typically saves $200–$600/mo in processing fees",
  },
];

export default function PricingPage() {
  useSEO({
    title: "Pricing & Free Equipment | Zero-Fee Processing | TechSavvy Hawaii",
    description: "TechSavvy Hawaii: $0 processing fees, free equipment, no contracts. Clover POS, Valor terminals, Pax — all free during our Hawaii launch. Save $300–$3,000/month.",
    keywords: "credit card processing pricing Hawaii, payment processing cost, cash discount program pricing, zero fee card processing, free POS terminal Hawaii, free Clover POS Hawaii, no contract credit card processing, merchant services pricing Hawaii",
    canonical: "https://techsavvyhawaii.com/pricing",
    ogImage: "https://techsavvyhawaii.com/images/hero-hawaii-sunset.jpg",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "TechSavvy Hawaii — Zero-Fee Payment Processing & Free Equipment",
      "url": "https://techsavvyhawaii.com/pricing",
      "description": "$0 processing fees and free equipment for Hawaii businesses.",
      "isPartOf": { "@id": "https://techsavvyhawaii.com/#website" },
    },
  });

  return (
    <Layout>
      <Hero />
      <QuickNav />
      <HowItWorks />
      <WhatYouGet />
      <ComparisonSection />
      <ZeroRiskSection />
      <EquipmentHero />
      <BusinessSetups />
      <EquipmentCards />
      <CloverSoftwareNote />
      <FinalCTA />
    </Layout>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-6 sm:pt-36 sm:pb-10">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/8 via-primary/3 to-transparent" />
      </div>
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          <motion.div variants={fadeUp} className="flex items-center justify-center gap-2 mb-4 flex-wrap">
            <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5">
              <DollarSign className="w-3 h-3 mr-1" />Zero Processing Fees
            </Badge>
            <Badge className="bg-red-500 text-white border-red-500 text-xs px-3 py-1">
              <Flame className="w-3 h-3 mr-1" />Free Equipment — Limited Time
            </Badge>
          </motion.div>
          <motion.h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-5" variants={fadeUp}>
            <span className="text-primary">$0</span> Fees.{" "}
            <span className="text-primary">$0</span> Equipment.{" "}
            <span className="text-primary">$0</span> Contracts.
          </motion.h1>
          <motion.p className="text-sm sm:text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto" variants={fadeUp}>
            Keep every dollar you earn. No processing fees, no monthly fees, no contracts — ever. And during our Hawaii launch, all equipment is free.
          </motion.p>
          <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-3" variants={fadeUp}>
            <Button size="lg" className="px-8" asChild>
              <a href="/statement-review">
                Free Statement Analysis <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="#equipment">
                <Gift className="w-4 h-4" />Browse Free Equipment
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="tel:8087675460">
                <Phone className="w-4 h-4" />(808) 767-5460
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function QuickNav() {
  return (
    <div className="sticky top-16 z-40 bg-background/90 backdrop-blur border-b border-border/50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-6 overflow-x-auto py-2 text-sm scrollbar-none">
          {[
            { label: "Pricing", href: "#pricing" },
            { label: "What's Included", href: "#included" },
            { label: "Comparison", href: "#comparison" },
            { label: "Free Equipment", href: "#equipment" },
            { label: "By Business Type", href: "#business-type" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors py-1"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function HowItWorks() {
  const steps = [
    { num: "1", title: "Apply online", desc: "Takes about 3 minutes. We review your business info and processing volume." },
    { num: "2", title: "Get approved", desc: "Usually within 24 hours. We confirm your savings and set a setup date." },
    { num: "3", title: "We set up everything", desc: "Free terminal, signage, and staff training. You don't lift a finger." },
    { num: "4", title: "Start saving", desc: "Accept payments with $0 processing fees from day one." },
  ];

  return (
    <section className="py-14 sm:py-20" id="pricing">
      <div className="max-w-5xl mx-auto px-4">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.div className="text-center mb-10" variants={fadeUp}>
            <h2 className="text-2xl sm:text-4xl font-extrabold mb-3">Getting started is simple.</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((s) => (
              <motion.div key={s.num} variants={fadeUp}>
                <Card className="h-full border-primary/10">
                  <CardContent className="p-5">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                      <span className="text-lg font-extrabold text-primary">{s.num}</span>
                    </div>
                    <h3 className="font-bold mb-1">{s.title}</h3>
                    <p className="text-sm text-muted-foreground">{s.desc}</p>
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
    <section className="py-14 sm:py-20 relative" id="included">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-card/50 via-transparent to-card/50" />
      <div className="max-w-5xl mx-auto px-4">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.div className="text-center mb-10" variants={fadeUp}>
            <h2 className="text-2xl sm:text-4xl font-extrabold mb-3">
              Everything included. <span className="text-primary">No add-ons.</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Other processors nickel-and-dime you. We give you everything upfront.</p>
          </motion.div>
          <motion.div variants={fadeUp}>
            <Card className="border-primary/20">
              <CardContent className="p-6 sm:p-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4">
                  {[
                    "Zero processing fees — forever",
                    "Zero monthly fees — forever",
                    "No contracts or cancellation fees",
                    "Free equipment — no volume requirement",
                    "Full setup, programming & training",
                    "Compliance signage kit included",
                    "Next-day funding",
                    "Accept all cards: chip, tap, swipe",
                    "Local Hawai'i-based support team",
                    "Apple Pay & Google Pay accepted",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <span className="text-sm text-foreground/90">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t border-primary/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Processing fees with TechSavvy</div>
                    <div className="text-4xl font-extrabold text-primary">0%<span className="text-lg text-muted-foreground font-normal"> forever</span></div>
                  </div>
                  <Button size="lg" asChild>
                    <a href="/statement-review">See Your Savings <ArrowRight className="w-4 h-4" /></a>
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

function ComparisonSection() {
  const [open, setOpen] = useState<number | null>(null);
  const fees = [
    { label: "Processing fees", typical: "$600–$3,000/mo", ts: "$0", note: "Biggest savings — you keep 100%" },
    { label: "PCI compliance fee", typical: "$10–$25/mo", ts: "$0", note: null },
    { label: "Gateway/batch fee", typical: "$10–$30/mo", ts: "$0", note: null },
    { label: "Contract length", typical: "2–3 years", ts: "None", note: "Cancel anytime, zero penalty" },
    { label: "Cancellation fee", typical: "$300–$500", ts: "$0", note: null },
    { label: "Equipment", typical: "$30–$80/mo lease", ts: "Free", note: "Free during Hawaii launch promo" },
  ];

  return (
    <section className="py-14 sm:py-20" id="comparison">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-2xl sm:text-4xl font-extrabold mb-3 text-center">
            What you're paying now vs. TechSavvy
          </h2>
          <p className="text-muted-foreground text-center mb-8 max-w-xl mx-auto">Here's where all those "small" fees add up.</p>
          <Card className="overflow-hidden border-border/50">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left p-4 font-semibold text-muted-foreground">Fee</th>
                    <th className="text-center p-4 font-semibold text-red-400">Typical Processor</th>
                    <th className="text-center p-4 font-bold text-primary bg-primary/5">TechSavvy</th>
                  </tr>
                </thead>
                <tbody>
                  {fees.map((f, i) => (
                    <tr key={f.label} className={`border-b border-border/30 ${i % 2 ? "bg-muted/10" : ""}`}>
                      <td className="p-3 sm:p-4">
                        <span className="font-medium text-foreground/80">{f.label}</span>
                        {f.note && <div className="text-[10px] text-muted-foreground mt-0.5">{f.note}</div>}
                      </td>
                      <td className="p-3 sm:p-4 text-center text-red-400">{f.typical}</td>
                      <td className="p-3 sm:p-4 text-center text-primary font-bold bg-primary/5">{f.ts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

function ZeroRiskSection() {
  const guarantees = [
    { icon: Truck, title: "Free equipment delivery", desc: "We ship the terminal to your business — fully programmed and ready to go." },
    { icon: RotateCcw, title: "No contracts ever", desc: "Leave anytime with zero cancellation fee. We earn your business every month." },
    { icon: ShieldCheck, title: "Fully compliant", desc: "100% legal in all 50 states. Visa, Mastercard, and FTC approved. We handle all signage." },
    { icon: Gift, title: "Free savings analysis", desc: "Upload your statement and our AI shows you exactly what you're losing — no obligation." },
  ];

  return (
    <section className="py-14 sm:py-20 relative">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-card/50 via-transparent to-card/50" />
      <div className="max-w-5xl mx-auto px-4">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.div className="text-center mb-10" variants={fadeUp}>
            <h2 className="text-2xl sm:text-4xl font-extrabold mb-3">Zero risk. <span className="text-primary">Zero catch.</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

function EquipmentHero() {
  return (
    <section className="relative py-14 sm:py-20 overflow-hidden bg-card/30" id="equipment">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/8 via-primary/3 to-transparent" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center max-w-3xl mx-auto">
          <motion.div className="flex items-center justify-center gap-2 mb-4" variants={fadeUp}>
            <Badge className="bg-red-500 text-white border-red-500 text-xs px-3 py-1">
              <Flame className="w-3 h-3 mr-1" /> Limited Time Launch Offer
            </Badge>
          </motion.div>
          <motion.h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.1] mb-4" variants={fadeUp}>
            All equipment is{" "}
            <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">FREE.</span>
          </motion.h2>
          <motion.p className="text-base sm:text-lg text-muted-foreground mb-3 max-w-xl mx-auto" variants={fadeUp}>
            We're launching in Hawaii and want to earn your business. Pick any terminal or POS system below —{" "}
            <span className="text-foreground font-semibold">it's on us</span>. No catch, no lease payments, no upfront cost.
          </motion.p>
          <motion.p className="text-sm text-muted-foreground/70 mb-8 max-w-md mx-auto flex items-center justify-center gap-1.5" variants={fadeUp}>
            <Clock className="w-3.5 h-3.5" /> Offer available while supplies last
          </motion.p>
          <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-3" variants={fadeUp}>
            <Button size="lg" className="text-base px-8 py-6 w-full sm:w-auto" asChild>
              <a href="/apply">Claim Your Free Equipment <ArrowRight className="w-4 h-4" /></a>
            </Button>
            <Button variant="outline" size="lg" className="text-base px-6 py-6 w-full sm:w-auto" asChild>
              <a href="tel:8087675460"><Phone className="w-4 h-4" /> (808) 767-5460</a>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function BusinessSetups() {
  return (
    <section className="py-12 sm:py-16 bg-card/50" id="business-type">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
          <motion.div className="text-center mb-10" variants={fadeUp}>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">Not sure what you need?</h2>
            <p className="text-muted-foreground">Here's what we recommend based on your business</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {BUSINESS_SETUPS.map((biz) => {
              const Icon = biz.icon;
              return (
                <motion.div key={biz.name} variants={fadeUp}>
                  <Card className="h-full border-border/50 hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-10 h-10 rounded-lg ${biz.bg} flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 ${biz.color}`} />
                        </div>
                        <div>
                          <h3 className="font-bold">{biz.name}</h3>
                          <p className="text-xs text-muted-foreground">We recommend: <span className="font-semibold text-foreground">{biz.recommended}</span></p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{biz.why}</p>
                      <div className="text-xs flex items-center gap-1.5 text-primary font-medium">
                        <Star className="w-3 h-3" />{biz.savings}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function EquipmentCards() {
  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
          <motion.div className="text-center mb-10" variants={fadeUp}>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">Pick your equipment</h2>
            <p className="text-muted-foreground">All free during our launch promotion. No upfront cost, no lease payments.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURED_DEVICES.map((device) => (
              <motion.div key={device.name} variants={fadeUp}>
                <Card className="h-full overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5 border-border/50">
                  {device.img && (
                    <div className="w-full h-44 bg-white flex items-center justify-center p-6 border-b border-border/30">
                      <img src={device.img} alt={device.name} className="max-h-full max-w-full object-contain" loading="lazy" />
                    </div>
                  )}
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-bold text-base">{device.name}</h3>
                      <Badge className="shrink-0 bg-primary text-primary-foreground">FREE</Badge>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl font-extrabold text-primary">$0</span>
                      <span className="text-sm text-muted-foreground line-through">{device.retail}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2 leading-relaxed">{device.desc}</p>
                    <p className="text-[11px] text-primary/80 font-medium mb-3">Best for: {device.best}</p>
                    <div className="space-y-1.5">
                      {device.features.map((f) => (
                        <div key={f} className="flex items-center gap-1.5 text-xs">
                          <Check className="w-3 h-3 text-primary shrink-0" />{f}
                        </div>
                      ))}
                    </div>
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

function CloverSoftwareNote() {
  return (
    <section className="py-10 sm:py-14 bg-card/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Card className="border-border/50">
            <CardContent className="p-6 sm:p-8">
              <h3 className="font-bold text-lg mb-3">Good to know: Clover monthly software</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Clover devices include a monthly software plan billed by Clover (not us). This powers the POS features like inventory, menus, and employee management. The Valor VP100 has no monthly software fees at all.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between p-3 rounded-lg bg-muted/50"><span>Lite Bundle</span><span className="font-semibold">$19.99/mo</span></div>
                <div className="flex justify-between p-3 rounded-lg bg-muted/50"><span>Retail / Quick Service</span><span className="font-semibold">$54.99/mo</span></div>
                <div className="flex justify-between p-3 rounded-lg bg-muted/50"><span>Full-Service Restaurant</span><span className="font-semibold">$84.99/mo</span></div>
                <div className="flex justify-between p-3 rounded-lg bg-muted/50"><span>Cash Discount Add-on</span><span className="font-semibold">$19.99/device</span></div>
              </div>
              <p className="text-[11px] text-muted-foreground mt-3">These are Clover's fees, not ours. We don't charge monthly fees — ever.</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="py-14 sm:py-24 relative">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.div variants={fadeUp}>
            <Badge className="bg-red-500 text-white border-red-500 text-xs px-3 py-1 mb-4">
              <Flame className="w-3 h-3 mr-1" /> Launch Promo — Limited Time
            </Badge>
          </motion.div>
          <motion.h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4" variants={fadeUp}>
            Free equipment. Zero fees. No catch.
          </motion.h2>
          <motion.p className="text-muted-foreground mb-8 max-w-lg mx-auto" variants={fadeUp}>
            Apply in 3 minutes, pick your equipment, and we'll ship it to your door. Start keeping 100% of your sales.
          </motion.p>
          <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-3" variants={fadeUp}>
            <Button size="lg" className="text-base px-8 py-6 w-full sm:w-auto" asChild>
              <a href="/apply">Claim Your Free Equipment <ArrowRight className="w-4 h-4" /></a>
            </Button>
            <Button variant="outline" size="lg" className="text-base px-6 py-6 w-full sm:w-auto" asChild>
              <a href="/statement-review">Free Statement Analysis <ArrowRight className="w-4 h-4" /></a>
            </Button>
          </motion.div>
          <motion.div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground" variants={fadeUp}>
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-primary" />No Contracts</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-primary" />No Monthly Fees</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-primary" />All Equipment Free</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
