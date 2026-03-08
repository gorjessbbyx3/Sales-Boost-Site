import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  ArrowRight, Check, Phone, CreditCard, Monitor, Gift,
  ShieldCheck, MapPin, UtensilsCrossed, ShoppingBag, Scissors, Truck, Star,
} from "lucide-react";
import { fadeUp, staggerContainer } from "@/lib/animations";
import Layout from "@/components/layout";
import { useSEO } from "@/hooks/useSEO";

const FEATURED_DEVICES = [
  {
    name: "Valor VP100",
    price: "FREE",
    img: "/images/equipment/valor-vp100.jpg",
    desc: "Our standard terminal — included free with every new merchant account. EMV chip, contactless, swipe. Perfect for simple countertop setups.",
    tag: "Free for All",
    features: ["EMV chip + tap + swipe", "Built-in receipt printer", "Cash discount ready", "Countertop or wireless"],
  },
  {
    name: "Clover Mini",
    price: "$750",
    img: "/images/equipment/clover-mini.jpg",
    desc: "Compact 8\" touchscreen POS. Full Clover software in a small footprint — great for counters with limited space.",
    tag: "Free w/ $10K+",
    features: ["8\" HD touchscreen", "Full Clover App Market", "Inventory tracking", "Employee management"],
  },
  {
    name: "Clover Flex",
    price: "$550",
    img: "/images/equipment/clover-flex.webp",
    desc: "Portable wireless POS you can take tableside, curbside, or to events. Built-in printer and camera for barcode scanning.",
    features: ["Wireless / LTE", "Built-in printer + camera", "Tableside payments", "Barcode scanner"],
  },
  {
    name: "Cloverstation Solo",
    price: "$1,500",
    img: "/images/equipment/clover-station-solo.png",
    desc: "Full countertop POS with 14\" HD display. The workhorse for retail stores, restaurants, and salons that need a complete system.",
    tag: "Free w/ $10K+",
    features: ["14\" HD touchscreen", "Receipt printer + cash drawer", "Full inventory & reporting", "Fingerprint login"],
  },
  {
    name: "Clover Station Duo",
    price: "$1,900",
    img: "/images/equipment/clover-station-duo.png",
    desc: "Dual-screen POS — merchant screen + customer-facing display. Ideal for restaurants and retail with high transaction volume.",
    tag: "Free w/ $10K+",
    features: ["14\" merchant + 8\" customer screen", "Customer-facing payments", "Full-service restaurant ready", "Table management + tips"],
  },
  {
    name: "Pax A920",
    price: "$320",
    img: "/images/equipment/pax-a920.webp",
    desc: "Android-based smart terminal with touchscreen. A versatile mid-range option for businesses that want more than a basic terminal.",
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
    monthly: "$84.99/mo Clover software",
    volume: "Most restaurants qualify for free equipment at $10K+/mo",
  },
  {
    icon: ShoppingBag,
    name: "Retail / Convenience",
    color: "text-blue-500",
    bg: "bg-blue-500/10 border-blue-500/20",
    recommended: "Cloverstation Solo",
    why: "14\" screen for quick checkout, barcode scanning, full inventory management. Add a cash drawer and barcode scanner.",
    monthly: "$54.99/mo Clover software",
    volume: "High-volume stores qualify for free POS at $10K+/mo",
  },
  {
    icon: Scissors,
    name: "Salon / Spa / Service",
    color: "text-pink-500",
    bg: "bg-pink-500/10 border-pink-500/20",
    recommended: "Clover Mini",
    why: "Small footprint fits any reception desk. Appointment tracking, customer profiles, and loyalty rewards built in.",
    monthly: "$54.99/mo Clover software",
    volume: "Perfect for businesses doing $5K–$15K/mo",
  },
  {
    icon: Truck,
    name: "Food Truck / Mobile",
    color: "text-green-500",
    bg: "bg-green-500/10 border-green-500/20",
    recommended: "Valor VP100 (FREE)",
    why: "Wireless terminal goes anywhere. No monthly software fees, just plug in and accept payments. Upgrade to Clover Flex if you need a full mobile POS.",
    monthly: "No monthly fees with VP100",
    volume: "Free terminal for all merchants — no volume requirement",
  },
];

export default function EquipmentPage() {
  useSEO({
    title: "Free Payment Equipment & POS Systems | TechSavvy Hawaii",
    description: "Free Valor VP100 terminal for all new merchants. Free POS systems for businesses processing $10K+/month. Find the right setup for your Hawaii business.",
    keywords: "free payment terminal Hawaii, Clover POS Hawaii, free POS system, payment equipment Honolulu",
    canonical: "https://techsavvyhawaii.com/equipment",
  });

  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="text-center max-w-3xl mx-auto">
            <motion.div variants={fadeUp}>
              <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5 mb-4">
                <Gift className="w-3 h-3 mr-1" /> Free Equipment for Every Merchant
              </Badge>
            </motion.div>
            <motion.h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.1] mb-4" variants={fadeUp}>
              The right setup for{" "}
              <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">your business.</span>
            </motion.h1>
            <motion.p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-xl mx-auto" variants={fadeUp}>
              Every new merchant gets a <span className="text-foreground font-semibold">free Valor VP100 terminal</span>. Processing $10K+ per month? Get a <span className="text-foreground font-semibold">free full POS system</span>.
            </motion.p>
            <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-3" variants={fadeUp}>
              <Button size="lg" className="text-base px-8 py-6 w-full sm:w-auto" asChild>
                <a href="/apply">Apply Now — Get Free Equipment <ArrowRight className="w-4 h-4" /></a>
              </Button>
              <Button variant="outline" size="lg" className="text-base px-6 py-6 w-full sm:w-auto" asChild>
                <a href="/statement-review">Check What You Qualify For</a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Two Free Tiers */}
      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <Card className="h-full border-primary/30 bg-primary/5 ring-2 ring-primary/20">
                <CardContent className="p-7">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center"><CreditCard className="w-6 h-6 text-primary" /></div>
                    <div>
                      <h3 className="font-bold text-lg">Every New Merchant</h3>
                      <p className="text-xs text-muted-foreground">No volume requirement</p>
                    </div>
                  </div>
                  <div className="text-4xl font-extrabold text-primary mb-1">FREE</div>
                  <div className="text-sm font-semibold mb-4">Valor VP100 Terminal</div>
                  <div className="space-y-2 text-sm">
                    {["EMV chip + contactless + swipe", "Built-in receipt printer", "Cash discount program included", "Setup & training included", "Zero processing fees", "No contracts or monthly fees"].map(f => (
                      <div key={f} className="flex items-center gap-2"><Check className="w-4 h-4 text-primary shrink-0" />{f}</div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <Card className="h-full border-amber-500/30 bg-amber-500/5 ring-2 ring-amber-500/20">
                <CardContent className="p-7">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center"><Monitor className="w-6 h-6 text-amber-500" /></div>
                    <div>
                      <h3 className="font-bold text-lg">$10K+ Monthly Processing</h3>
                      <p className="text-xs text-muted-foreground">Higher volume businesses</p>
                    </div>
                  </div>
                  <div className="text-4xl font-extrabold text-amber-500 mb-1">FREE</div>
                  <div className="text-sm font-semibold mb-4">Full POS System (Clover, Pax)</div>
                  <div className="space-y-2 text-sm">
                    {["Full touchscreen POS station", "Inventory & menu management", "Employee management & permissions", "Sales reporting & analytics", "Customer-facing display option", "Everything in the basic tier, plus more"].map(f => (
                      <div key={f} className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-500 shrink-0" />{f}</div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Recommended by Business Type */}
      <section className="py-12 sm:py-16 bg-card/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
            <motion.div className="text-center mb-10" variants={fadeUp}>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">What's right for your business?</h2>
              <p className="text-muted-foreground">Our recommendation based on your industry</p>
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
                        <div className="space-y-1.5 text-xs">
                          <div className="flex items-center gap-1.5 text-muted-foreground"><Star className="w-3 h-3 text-primary" />{biz.monthly}</div>
                          <div className="flex items-center gap-1.5 text-muted-foreground"><Gift className="w-3 h-3 text-primary" />{biz.volume}</div>
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

      {/* Featured Equipment */}
      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
            <motion.div className="text-center mb-10" variants={fadeUp}>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">Our Equipment Lineup</h2>
              <p className="text-muted-foreground">All one-time cost — you own it. No leases, no traps.</p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURED_DEVICES.map((device) => (
                <motion.div key={device.name} variants={fadeUp}>
                  <Card className={`h-full overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5 ${device.price === "FREE" ? "ring-2 ring-primary border-primary/30" : "border-border/50"}`}>
                    {device.img && (
                      <div className="w-full h-44 bg-white flex items-center justify-center p-6 border-b border-border/30">
                        <img src={device.img} alt={device.name} className="max-h-full max-w-full object-contain" loading="lazy" />
                      </div>
                    )}
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-bold text-base">{device.name}</h3>
                        {device.tag && (
                          <Badge className={`shrink-0 ${device.price === "FREE" ? "bg-primary text-primary-foreground" : "bg-amber-500/15 text-amber-600 border-amber-500/30"}`} variant={device.price === "FREE" ? "default" : "outline"}>
                            {device.tag}
                          </Badge>
                        )}
                      </div>
                      <div className={`text-2xl font-extrabold mb-2 ${device.price === "FREE" ? "text-primary" : ""}`}>
                        {device.price}
                        {device.price !== "FREE" && <span className="text-xs font-normal text-muted-foreground ml-1">one-time</span>}
                      </div>
                      <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{device.desc}</p>
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
                <h3 className="font-bold text-lg mb-3">A note about Clover monthly software</h3>
                <p className="text-sm text-muted-foreground mb-4">Clover devices require a monthly software plan billed directly by Clover. This is separate from our zero processing fees — we can't waive it, but it powers the full POS features.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex justify-between p-3 rounded-lg bg-muted/50"><span>Lite Bundle</span><span className="font-semibold">$19.99/mo</span></div>
                  <div className="flex justify-between p-3 rounded-lg bg-muted/50"><span>Retail / Quick Service</span><span className="font-semibold">$54.99/mo</span></div>
                  <div className="flex justify-between p-3 rounded-lg bg-muted/50"><span>Full-Service Restaurant</span><span className="font-semibold">$84.99/mo</span></div>
                  <div className="flex justify-between p-3 rounded-lg bg-muted/50"><span>Cash Discount Add-on</span><span className="font-semibold">$19.99/device</span></div>
                </div>
                <p className="text-[11px] text-muted-foreground mt-3">The Valor VP100 has zero monthly software fees — only Clover devices have these plans.</p>
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
            <motion.h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4" variants={fadeUp}>
              Ready to stop paying processing fees?
            </motion.h2>
            <motion.p className="text-muted-foreground mb-8 max-w-lg mx-auto" variants={fadeUp}>
              Apply in 3 minutes. Get your free terminal shipped to your door. Start saving immediately.
            </motion.p>
            <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-3" variants={fadeUp}>
              <Button size="lg" className="text-base px-8 py-6 w-full sm:w-auto" asChild>
                <a href="/apply">Apply Now <ArrowRight className="w-4 h-4" /></a>
              </Button>
              <Button variant="outline" size="lg" className="text-base px-6 py-6 w-full sm:w-auto" asChild>
                <a href="tel:8087675460"><Phone className="w-4 h-4" /> (808) 767-5460</a>
              </Button>
            </motion.div>
            <motion.div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground" variants={fadeUp}>
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-primary" />No Contracts</span>
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-primary" />No Monthly Fees</span>
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-primary" />Free Equipment</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-primary" />Honolulu, HI</span>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
