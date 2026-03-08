import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  ArrowRight, Check, Phone, CreditCard, Monitor, Gift, Flame,
  ShieldCheck, MapPin, UtensilsCrossed, ShoppingBag, Scissors, Truck, Star, Clock,
} from "lucide-react";
import { fadeUp, staggerContainer } from "@/lib/animations";
import Layout from "@/components/layout";
import { useSEO } from "@/hooks/useSEO";

const FEATURED_DEVICES = [
  {
    name: "Valor VP100",
    retail: "$195",
    img: "/images/equipment/valor-vp100.jpg",
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
    name: "Cloverstation Solo",
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
    recommended: "Cloverstation Solo",
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

export default function EquipmentPage() {
  useSEO({
    title: "FREE Payment Equipment — Launch Promo | TechSavvy Hawaii",
    description: "Limited time: ALL equipment is FREE when you switch to TechSavvy Hawaii. Clover POS, Valor terminals, Pax — no cost to you. Zero processing fees, no contracts. Hawaii's best deal.",
    keywords: "free payment terminal Hawaii, free Clover POS Hawaii, free POS system, free merchant equipment Honolulu",
    canonical: "https://techsavvyhawaii.com/equipment",
  });

  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-14 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/8 via-primary/3 to-transparent" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="text-center max-w-3xl mx-auto">
            <motion.div className="flex items-center justify-center gap-2 mb-4" variants={fadeUp}>
              <Badge className="bg-red-500 text-white border-red-500 text-xs px-3 py-1">
                <Flame className="w-3 h-3 mr-1" /> Limited Time Launch Offer
              </Badge>
            </motion.div>
            <motion.h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.1] mb-4" variants={fadeUp}>
              All equipment is{" "}
              <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">FREE.</span>
            </motion.h1>
            <motion.p className="text-base sm:text-lg text-muted-foreground mb-3 max-w-xl mx-auto" variants={fadeUp}>
              We're launching in Hawaii and want to earn your business. Pick any terminal or POS system below — <span className="text-foreground font-semibold">it's on us</span>. No catch, no lease payments, no upfront cost.
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

      {/* Why TechSavvy Over the Competition */}
      <section className="py-10 sm:py-14 bg-card/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-center mb-8">
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight mb-2">Other processors say "free." Here's the fine print they won't tell you.</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="border-red-500/20 bg-red-500/5">
                <CardContent className="p-5">
                  <p className="text-xs font-bold text-red-400 mb-2">OhanaPay & Others</p>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Free equipment <span className="text-red-400 font-medium">only if you process $10K+/mo</span></p>
                    <p><span className="text-red-400 font-medium">Hidden fees</span> buried in fine print</p>
                    <p>No statement analysis tools</p>
                    <p>No referral partner income program</p>
                    <p>Limited equipment selection</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-primary/30 bg-primary/5 ring-2 ring-primary/20 sm:scale-105">
                <CardContent className="p-5">
                  <p className="text-xs font-bold text-primary mb-2">TechSavvy Hawaii</p>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-primary shrink-0" /><span><span className="font-semibold">ALL equipment free</span> — no volume requirement</span></p>
                    <p className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-primary shrink-0" /><span><span className="font-semibold">Zero processing fees</span> — keep 100% of every sale</span></p>
                    <p className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-primary shrink-0" /><span><span className="font-semibold">Statement analysis</span> exposes hidden fees you're paying</span></p>
                    <p className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-primary shrink-0" /><span><span className="font-semibold">Referral program</span> — earn 50% on every merchant you send</span></p>
                    <p className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-primary shrink-0" /><span><span className="font-semibold">Choose any device</span> — Clover, Valor, Pax</span></p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-red-500/20 bg-red-500/5">
                <CardContent className="p-5">
                  <p className="text-xs font-bold text-red-400 mb-2">Big processors (Square, Clover, etc.)</p>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p><span className="text-red-400 font-medium">2.6–3.5% processing fees</span> on every swipe</p>
                    <p><span className="text-red-400 font-medium">$14.95–$85/mo</span> software fees</p>
                    <p>Equipment costs <span className="text-red-400 font-medium">$500–$1,900</span></p>
                    <p>No local Hawaii support</p>
                    <p>Long-term contracts with some</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Recommended by Business Type */}
      <section className="py-12 sm:py-16 bg-card/50">
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
                        <div className="text-xs flex items-center gap-1.5 text-primary font-medium"><Star className="w-3 h-3" />{biz.savings}</div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Equipment Cards */}
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
                        {device.features.map(f => (
                          <div key={f} className="flex items-center gap-1.5 text-xs"><Check className="w-3 h-3 text-primary shrink-0" />{f}</div>
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

      {/* Clover Software Note */}
      <section className="py-10 sm:py-14 bg-card/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Card className="border-border/50">
              <CardContent className="p-6 sm:p-8">
                <h3 className="font-bold text-lg mb-3">Good to know: Clover monthly software</h3>
                <p className="text-sm text-muted-foreground mb-4">Clover devices include a monthly software plan billed by Clover (not us). This powers the POS features like inventory, menus, and employee management. The Valor VP100 has no monthly software fees at all.</p>
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

      {/* CTA */}
      <section className="py-16 sm:py-24 relative">
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
                <a href="tel:8087675460"><Phone className="w-4 h-4" /> (808) 767-5460</a>
              </Button>
            </motion.div>
            <motion.div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground" variants={fadeUp}>
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-primary" />No Contracts</span>
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-primary" />No Monthly Fees</span>
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-primary" />All Equipment Free</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-primary" />Honolulu, HI</span>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
