import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  ArrowRight, Check, Star, Phone, CreditCard, Monitor, Wifi,
  ShieldCheck, MapPin, Zap, Gift, TrendingUp,
} from "lucide-react";
import { fadeUp, staggerContainer } from "@/lib/animations";
import Layout from "@/components/layout";
import { useSEO } from "@/hooks/useSEO";

// ─── Equipment Data ───────────────────────────────────────────────

const CLOVER_DEVICES = [
  { name: "Cloverstation Solo", price: 1500, img: "/images/equipment/clover-station-solo.png", desc: "Full countertop POS with touchscreen", freeWith10k: true },
  { name: "Cloverstation Solo Bundle", price: 1800, img: "/images/equipment/clover-station-solo.png", desc: "Solo + printer + cash drawer", freeWith10k: true },
  { name: "Clover Station Duo 2 LTE", price: 1900, img: "/images/equipment/clover-station-duo.png", desc: "Dual-screen with customer display", freeWith10k: true },
  { name: "Clover Mini", price: 750, img: "/images/equipment/clover-mini.jpg", desc: "Compact countertop POS", freeWith10k: true },
  { name: "Clover Flex", price: 550, img: "/images/equipment/clover-flex.webp", desc: "Portable wireless terminal", freeWith10k: false },
  { name: "Clover Go Card Reader", price: 180, img: null, desc: "Mobile card reader for on-the-go", freeWith10k: false },
  { name: "Clover Kiosk", price: 3800, img: "/images/equipment/clover-kiosk.jpg", desc: "Self-service kiosk for QSR", freeWith10k: true },
];

const CLOVER_PLANS = [
  { name: "Lite Bundle", price: "19.99", cashDiscount: "19.99", extra: "15.00", desc: "Simple menu, ability to charge" },
  { name: "Retail", price: "54.99", cashDiscount: "19.99", extra: "15.00", desc: "Full Clover features, inventory" },
  { name: "Quick Service", price: "54.99", cashDiscount: "19.99", extra: "15.00", desc: "Modifiers, counter service" },
  { name: "Full-Service Restaurant", price: "84.99", cashDiscount: "19.99", extra: "15.00", desc: "Table layout, auth cards, bar" },
];

const TERMINALS = [
  { name: "Valor VP100", price: 0, img: "/images/equipment/valor-vp100.jpg", desc: "FREE with every account", highlight: true, tag: "FREE" },
  { name: "Valor VL100", price: 195, img: "/images/equipment/valor-vl300.jpg", desc: "Budget countertop" },
  { name: "Valor VL100 (BT)", price: 295, img: "/images/equipment/valor-vl300.jpg", desc: "Bluetooth-enabled" },
  { name: "Valor VP500", price: 320, img: "/images/equipment/valor-vp550.jpg", desc: "Smart touchscreen" },
  { name: "Valor VL300", price: 190, img: "/images/equipment/valor-vl300.jpg", desc: "Countertop terminal" },
  { name: "Dejavoo P1", price: 225, img: "/images/equipment/dejavoo-p1.webp", desc: "Compact terminal" },
  { name: "Dejavoo Z8", price: 215, img: "/images/equipment/dejavoo-p8.jpg", desc: "Countertop terminal" },
  { name: "Dejavoo QD4", price: 340, img: null, desc: "Smart terminal" },
  { name: "Dejavoo QD2", price: 412, img: null, desc: "Premium smart terminal" },
  { name: "FD150 Terminal", price: 330, img: null, desc: "First Data terminal" },
  { name: "Pax S920", price: 325, img: null, desc: "Portable wireless" },
  { name: "Pax S80", price: 189, img: "/images/equipment/pax-a80.jpg", desc: "Budget countertop" },
  { name: "Pax A920", price: 320, img: "/images/equipment/pax-a920.webp", desc: "Android smart terminal" },
  { name: "Pax A920 Pro", price: 360, img: "/images/equipment/pax-a920-pro.webp", desc: "Android upgraded" },
];

const PIN_PADS = [
  { name: "Dejavoo Z3 Pin Pad", price: 175 },
  { name: "Dejavoo QD5 Pin Pad", price: 279.95 },
  { name: "PAX SP30 Pin Pad", price: 205 },
  { name: "RP10 Pinpad", price: 280 },
  { name: "Valor RCKT EMV Reader", price: 132 },
];

const ACCESSORIES = [
  { name: "Clover Weight Scale", price: 465 },
  { name: "Clover Cash Drawer", price: 125 },
  { name: "Clover Label Printer (Epson)", price: 495 },
  { name: "Barcode Scanner", price: 171 },
];

const GATEWAYS = [
  { name: "Valor Gateway", activation: 49.95, monthly: 10.00 },
  { name: "Dejavoo Virtual Cart", activation: 49.95, monthly: 10.00 },
  { name: "Authorize.net", activation: 49.00, monthly: 15.00, note: "0.05 txn fee & 0.05 batch fee" },
  { name: "USAePay", activation: 49.95, monthly: 15.00, note: "0.02 txn fee after 250 txns" },
];

// ─── Components ──────────────────────────────────────────────────

function EquipmentCard({ name, price, desc, highlight, tag, freeWith10k, img }: {
  name: string; price: number; desc?: string; highlight?: boolean; tag?: string; freeWith10k?: boolean; img?: string | null;
}) {
  return (
    <Card className={`overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5 ${highlight ? "ring-2 ring-primary border-primary/30 bg-primary/5" : "border-border/50"}`}>
      {img && (
        <div className="w-full h-36 bg-white flex items-center justify-center p-4 border-b border-border/30">
          <img src={img} alt={name} className="max-h-full max-w-full object-contain" loading="lazy" />
        </div>
      )}
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="font-bold text-sm">{name}</h3>
            {desc && <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>}
          </div>
          {tag && <Badge className="shrink-0 bg-primary text-primary-foreground">{tag}</Badge>}
          {freeWith10k && !tag && <Badge variant="outline" className="shrink-0 text-primary border-primary/30 text-[10px]">Free w/ $10K+</Badge>}
        </div>
        <div className="flex items-end gap-1">
          {price === 0 ? (
            <span className="text-2xl font-extrabold text-primary">FREE</span>
          ) : (
            <>
              <span className="text-2xl font-extrabold">${price.toLocaleString()}</span>
              <span className="text-xs text-muted-foreground mb-1">one-time</span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Page ────────────────────────────────────────────────────────

export default function EquipmentPage() {
  useSEO({
    title: "Payment Equipment & POS Systems | TechSavvy Hawaii",
    description: "Free Valor VP100 terminal for all new merchants. Free POS systems for businesses processing $10K+/month. Clover, Pax, Dejavoo, Valor — full equipment catalog with zero-fee processing.",
    keywords: "free payment terminal Hawaii, Clover POS Hawaii, free POS system, payment equipment Honolulu, Valor terminal, Dejavoo terminal, merchant equipment",
    canonical: "https://techsavvyhawaii.com/equipment",
  });

  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="text-center max-w-3xl mx-auto">
            <motion.div variants={fadeUp}>
              <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5 mb-4">
                <Gift className="w-3 h-3 mr-1" /> OhanaPay Price Match
              </Badge>
            </motion.div>
            <motion.h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.1] mb-4" variants={fadeUp}>
              Free Equipment.{" "}
              <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">Zero Fees.</span>
            </motion.h1>
            <motion.p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-xl mx-auto" variants={fadeUp}>
              Every new merchant gets a <span className="text-foreground font-semibold">FREE Valor VP100 terminal</span>. Processing $10K+/month? Get a <span className="text-foreground font-semibold">free full POS system</span>.
            </motion.p>
            <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-3" variants={fadeUp}>
              <Button size="lg" className="text-base px-8 py-6 w-full sm:w-auto" asChild>
                <a href="/apply">Apply Now — Get Free Equipment <ArrowRight className="w-4 h-4" /></a>
              </Button>
              <Button variant="outline" size="lg" className="text-base px-6 py-6 w-full sm:w-auto" asChild>
                <a href="/contact">Talk to Our Team <Phone className="w-4 h-4" /></a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Offer Tiers */}
      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
            <motion.div className="text-center mb-10" variants={fadeUp}>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">Two Ways to Get Free Equipment</h2>
              <p className="text-muted-foreground">No hidden fees. No lease traps. You own it.</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <motion.div variants={fadeUp}>
                <Card className="h-full border-primary/30 bg-primary/5 ring-2 ring-primary/20">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center"><CreditCard className="w-6 h-6 text-primary" /></div>
                      <div>
                        <h3 className="font-bold text-lg">Every New Merchant</h3>
                        <p className="text-xs text-muted-foreground">No volume requirement</p>
                      </div>
                    </div>
                    <div className="text-4xl font-extrabold text-primary mb-2">FREE</div>
                    <div className="text-sm font-semibold mb-4">Valor VP100 Terminal</div>
                    <div className="space-y-2">
                      {["EMV chip + contactless + swipe", "Cash discount built-in", "Countertop or wireless", "Setup & training included", "Zero processing fees", "No contracts or monthly fees"].map(f => (
                        <div key={f} className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-primary shrink-0" />{f}</div>
                      ))}
                    </div>
                    <Button className="w-full mt-6" asChild><a href="/apply">Get Your Free Terminal <ArrowRight className="w-4 h-4" /></a></Button>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={fadeUp}>
                <Card className="h-full border-amber-500/30 bg-amber-500/5 ring-2 ring-amber-500/20">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center"><Monitor className="w-6 h-6 text-amber-500" /></div>
                      <div>
                        <h3 className="font-bold text-lg">$10K+/Month Processing</h3>
                        <p className="text-xs text-muted-foreground">Higher volume businesses</p>
                      </div>
                    </div>
                    <div className="text-4xl font-extrabold text-amber-500 mb-2">FREE</div>
                    <div className="text-sm font-semibold mb-4">Full POS System (Clover, Pax, or equivalent)</div>
                    <div className="space-y-2">
                      {["Full touchscreen POS station", "Inventory & menu management", "Employee management", "Reporting & analytics", "Customer-facing display", "Everything in basic tier +"].map(f => (
                        <div key={f} className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-amber-500 shrink-0" />{f}</div>
                      ))}
                    </div>
                    <Button className="w-full mt-6 bg-amber-500 hover:bg-amber-600" asChild><a href="/statement-review">Check If You Qualify <TrendingUp className="w-4 h-4" /></a></Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Clover POS Section */}
      <section className="py-12 sm:py-16 bg-card/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
            <motion.div className="mb-8" variants={fadeUp}>
              <h2 className="text-2xl font-extrabold tracking-tight mb-1">Clover POS Systems</h2>
              <p className="text-sm text-muted-foreground">Industry-leading POS — free for merchants processing $10K+/month</p>
            </motion.div>
            <motion.div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4" variants={fadeUp}>
              {CLOVER_DEVICES.map(d => <EquipmentCard key={d.name} {...d} />)}
            </motion.div>

            <motion.div className="mt-8" variants={fadeUp}>
              <h3 className="font-bold text-sm mb-3 flex items-center gap-2"><Zap className="w-4 h-4 text-primary" />Clover Monthly Software Plans</h3>
              <p className="text-xs text-muted-foreground mb-4">Billed directly by Clover — cannot be waived or refunded. Cash discount add-on is $19.99/device + $15.00 per additional device.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {CLOVER_PLANS.map(p => (
                  <Card key={p.name} className="border-border/50">
                    <CardContent className="p-4">
                      <h4 className="font-bold text-sm mb-1">{p.name}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{p.desc}</p>
                      <div className="text-lg font-extrabold">${p.price}<span className="text-xs font-normal text-muted-foreground">/mo</span></div>
                      <p className="text-[10px] text-muted-foreground mt-1">+ ${p.cashDiscount} cash discount / ${p.extra} add'l device</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Standalone Terminals */}
      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
            <motion.div className="mb-8" variants={fadeUp}>
              <h2 className="text-2xl font-extrabold tracking-tight mb-1">Standalone Terminals</h2>
              <p className="text-sm text-muted-foreground">One-time purchase, no monthly fees. VP100 is FREE for all merchants.</p>
            </motion.div>
            <motion.div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4" variants={fadeUp}>
              {TERMINALS.map(t => <EquipmentCard key={t.name} {...t} />)}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pin Pads & Accessories */}
      <section className="py-12 sm:py-16 bg-card/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <motion.div variants={fadeUp}>
                <h2 className="text-2xl font-extrabold tracking-tight mb-1">Pin Pads</h2>
                <p className="text-sm text-muted-foreground mb-6">Add-on pin pads for dual-device setups</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PIN_PADS.map(p => (
                    <Card key={p.name} className="border-border/50">
                      <CardContent className="p-4 flex items-center justify-between">
                        <span className="font-medium text-sm">{p.name}</span>
                        <span className="font-extrabold">${p.price}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
              <motion.div variants={fadeUp}>
                <h2 className="text-2xl font-extrabold tracking-tight mb-1">Accessories</h2>
                <p className="text-sm text-muted-foreground mb-6">Printers, drawers, scanners & more</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ACCESSORIES.map(a => (
                    <Card key={a.name} className="border-border/50">
                      <CardContent className="p-4 flex items-center justify-between">
                        <span className="font-medium text-sm">{a.name}</span>
                        <span className="font-extrabold">${a.price}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Online Gateways */}
      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
            <motion.div className="mb-8" variants={fadeUp}>
              <h2 className="text-2xl font-extrabold tracking-tight mb-1">Online Payment Gateways</h2>
              <p className="text-sm text-muted-foreground">Accept payments online with virtual terminal or e-commerce integration</p>
            </motion.div>
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" variants={fadeUp}>
              {GATEWAYS.map(g => (
                <Card key={g.name} className="border-border/50">
                  <CardContent className="p-5">
                    <h3 className="font-bold text-sm mb-2">{g.name}</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between"><span className="text-muted-foreground">Activation</span><span className="font-semibold">${g.activation.toFixed(2)}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Monthly</span><span className="font-semibold">${g.monthly.toFixed(2)}</span></div>
                    </div>
                    {g.note && <p className="text-[10px] text-muted-foreground mt-2">{g.note}</p>}
                  </CardContent>
                </Card>
              ))}
            </motion.div>
            <motion.div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl" variants={fadeUp}>
              <Card className="border-border/50">
                <CardContent className="p-4">
                  <h4 className="font-bold text-sm mb-1 flex items-center gap-2"><Wifi className="w-4 h-4 text-primary" />Wireless/LTE Fees</h4>
                  <p className="text-sm">$50.00 activation + $15.00/month</p>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-4">
                  <h4 className="font-bold text-sm mb-1 flex items-center gap-2"><Monitor className="w-4 h-4 text-primary" />Dejavoo DejayPayPro POS</h4>
                  <p className="text-sm">$120.00 first month + $75.00/mo after</p>
                  <p className="text-[10px] text-muted-foreground">$35/additional register</p>
                </CardContent>
              </Card>
            </motion.div>
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
