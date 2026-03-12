import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Check, ArrowRight, Star, ChevronDown, MapPin, DollarSign, Clock, ShieldCheck, Phone } from "lucide-react";
import { useState } from "react";
import { fadeUp, staggerContainer } from "@/lib/animations";
import Layout from "@/components/layout";
import { useSEO } from "@/hooks/useSEO";
import { useParams } from "wouter";

const industries: Record<string, {
  slug: string; name: string; title: string; painNumber: string; painLine: string;
  description: string; problems: string[]; benefits: string[];
  faq: { q: string; a: string }[];
  seo: { title: string; description: string; keywords: string };
}> = {
  restaurants: {
    slug: "restaurants",
    name: "Restaurants & Bars",
    title: "Hawaii Restaurants Lose $14,400/Year to Processing Fees",
    painNumber: "$14,400",
    painLine: "That's what the average Hawaii restaurant loses every year to credit card processing fees.",
    description: "Between dine-in, takeout, bar tabs, and tips — restaurants process more card transactions than almost any other business. At 2-4% per swipe, those fees add up to thousands every month that should be going to your staff, your kitchen, or your bottom line.",
    problems: [
      "High card volume means high fees — $800-$2,000+/month is typical",
      "Tip adjustments add hidden costs most owners never see",
      "POS system leases lock you into expensive multi-year contracts",
      "Processors raise rates quietly and hope you don't notice",
    ],
    benefits: [
      "Eliminate 100% of processing fees with our cash discount program",
      "Free POS terminal for qualifying restaurants ($10K+/month)",
      "Works with your existing menu pricing — we handle the signage",
      "Next-day deposits so you always have cash flow for supplies",
      "No contracts — leave anytime if you're not saving money",
      "Local Hawai'i support team that understands the restaurant industry",
    ],
    faq: [
      { q: "Will my customers complain about the surcharge?", a: "Most don't. Card surcharges are now standard at restaurants across Hawaii. The terminal shows the amount clearly before they confirm. Many customers simply switch to cash or don't even notice." },
      { q: "Does this work with tips?", a: "Yes. Tips are added after the surcharge is calculated, so your staff keeps 100% of tips with zero fees taken out." },
      { q: "What about online orders and delivery?", a: "We support online payment gateways, virtual terminals, and integration with ordering platforms. The cash discount model works for in-person transactions." },
    ],
    seo: {
      title: "Restaurant Credit Card Processing Hawaii | Zero Fees | TechSavvy",
      description: "Hawaii restaurants save $14,400/year by eliminating credit card processing fees. Free POS terminal, no contracts, local support. Cash discount program for restaurants, bars, and food service.",
      keywords: "restaurant credit card processing Hawaii, restaurant payment processing, zero fee restaurant POS, restaurant credit card fees Honolulu, food service card processing Hawaii, eliminate restaurant processing fees",
    },
  },
  "auto-shops": {
    slug: "auto-shops",
    name: "Auto Repair Shops",
    title: "Hawaii Auto Shops Lose $18,000/Year to Processing Fees",
    painNumber: "$18,000",
    painLine: "That's what the average Hawaii auto repair shop loses every year to credit card processing fees.",
    description: "Auto repair invoices are large — $500, $1,000, $2,000+ per ticket. At 3-4% per transaction, you're handing your processor $15-$80 on every single job. Over a year, that's a new lift or a full set of tools walking out the door.",
    problems: [
      "Large ticket sizes mean massive per-transaction fees",
      "A single $2,000 repair costs you $60-$80 in processing fees",
      "Most shops process $30K-$60K/month — that's $900-$2,400/month in fees",
      "Processors target auto shops because they know you're too busy to check",
    ],
    benefits: [
      "Eliminate 100% of processing fees — keep every dollar of every repair",
      "Free terminal for qualifying shops ($10K+/month volume)",
      "Works perfectly with large ticket sizes — the bigger the job, the more you save",
      "No contracts — try it risk-free",
      "Next-day funding so you can order parts without waiting",
      "Local Hawai'i team that comes to your shop for setup",
    ],
    faq: [
      { q: "Do customers push back on large-ticket surcharges?", a: "Rarely. A 3-4% surcharge on a $1,500 repair is $45-$60 — most customers understand that credit card companies charge fees. Many pay cash or don't mind. And you save $45-$60 on every single job." },
      { q: "Can I still offer payment plans?", a: "Yes. The cash discount program works alongside any financing or payment plan options you already offer." },
      { q: "What if I have multiple bays or locations?", a: "We can set up multiple terminals. Each one connects to the same merchant account with unified reporting." },
    ],
    seo: {
      title: "Auto Shop Credit Card Processing Hawaii | Zero Fees | TechSavvy",
      description: "Hawaii auto repair shops save $18,000/year by eliminating credit card processing fees. Free terminal, no contracts. Built for high-ticket automotive businesses.",
      keywords: "auto repair credit card processing Hawaii, auto shop payment processing, mechanic credit card fees Hawaii, automotive card processing Honolulu, auto shop POS system Hawaii",
    },
  },
  salons: {
    slug: "salons",
    name: "Salons & Spas",
    title: "Hawaii Salons Lose $7,200/Year to Processing Fees",
    painNumber: "$7,200",
    painLine: "That's what the average Hawaii salon or spa loses every year to credit card processing fees.",
    description: "Hair, nails, facials, massage — your clients almost always pay by card. At 2-4% per transaction, those fees eat into every appointment. That's money that should be going to your stylists, your products, or your expansion.",
    problems: [
      "Nearly 100% card payments means maximum fee exposure",
      "Tip adjustments add hidden processing costs",
      "Monthly POS software fees on top of processing fees",
      "Long contracts with cancellation penalties trap you with bad rates",
    ],
    benefits: [
      "Eliminate 100% of processing fees — keep every dollar from every appointment",
      "Free terminal for qualifying salons ($10K+/month)",
      "Works perfectly with appointment-based businesses",
      "Your stylists keep 100% of tips — zero fees deducted",
      "No contracts — switch back anytime with zero penalty",
      "Quick setup — most salons are live within a week",
    ],
    faq: [
      { q: "Will my salon clients mind the surcharge?", a: "Salons across Hawaii are already using this model. Most clients don't notice or simply pay cash for smaller services. Your regulars will understand — and you'll save hundreds every month." },
      { q: "Does it work with booking software?", a: "Yes. Our terminal works independently of your booking system. Clients book as usual, then pay at the terminal with the cash discount applied automatically." },
      { q: "What about retail product sales?", a: "Same system — whether it's a haircut or a bottle of shampoo, the cash discount applies to all card transactions." },
    ],
    seo: {
      title: "Salon Credit Card Processing Hawaii | Zero Fees | TechSavvy",
      description: "Hawaii salons and spas save $7,200/year by eliminating credit card processing fees. Free terminal, no contracts, tips protected. Built for beauty and wellness businesses.",
      keywords: "salon credit card processing Hawaii, spa payment processing, beauty shop credit card fees, salon card processing Honolulu, salon POS system Hawaii, nail salon payment processing",
    },
  },
  retail: {
    slug: "retail",
    name: "Retail Stores",
    title: "Hawaii Retail Stores Lose $10,800/Year to Processing Fees",
    painNumber: "$10,800",
    painLine: "That's what the average Hawaii retail store loses every year to credit card processing fees.",
    description: "From boutiques on Kalakaua to surf shops in Hale'iwa, retail stores swipe cards all day long. At 2-4% per transaction, those fees silently drain your margins on every sale — and most retailers never realize how much they're actually losing.",
    problems: [
      "High transaction volume means fees stack up quickly — $500-$1,500+/month",
      "Seasonal spikes (holidays, tourist season) mean even bigger fee months",
      "Equipment leases lock you into overpriced contracts for years",
      "Interchange rates are confusing by design — processors profit from the complexity",
    ],
    benefits: [
      "Eliminate 100% of processing fees with our cash discount program",
      "Free POS terminal for qualifying stores ($10K+/month volume)",
      "Handles chip, tap, swipe, and Apple/Google Pay — all zero-fee",
      "Compliant signage included so customers know upfront",
      "No contracts — leave anytime if it's not working for you",
      "Local Honolulu team installs and trains your staff in person",
    ],
    faq: [
      { q: "Will this scare away customers?", a: "No. Cash discount programs are standard across Hawaii retail now. The signage is clear, the adjustment is small, and most customers either pay cash or don't mind. Your regulars won't think twice." },
      { q: "Does it work with my inventory system?", a: "Our terminals work alongside any inventory or POS software you already use. We handle the payment side — your existing systems stay exactly the same." },
      { q: "What about returns and refunds?", a: "Refunds are processed back through the terminal just like any other processor. The cash discount adjustment is automatically reversed on refunds." },
    ],
    seo: {
      title: "Retail Store Credit Card Processing Hawaii | Zero Fees | TechSavvy",
      description: "Hawaii retail stores save $10,800/year by eliminating credit card processing fees. Free terminal, no contracts, local support. Cash discount program for shops and boutiques.",
      keywords: "retail credit card processing Hawaii, store payment processing, retail POS Hawaii, boutique card processing Honolulu, shop payment terminal Hawaii, zero fee retail processing",
    },
  },
  medical: {
    slug: "medical",
    name: "Medical & Dental Offices",
    title: "Hawaii Medical Offices Lose $16,200/Year to Processing Fees",
    painNumber: "$16,200",
    painLine: "That's what the average Hawaii medical or dental office loses every year to credit card processing fees.",
    description: "Co-pays, out-of-pocket charges, elective procedures — healthcare offices process thousands in card payments every week. With average tickets of $150-$500+, those 3-4% processing fees add up to serious money that should be going back into patient care.",
    problems: [
      "Large co-pays and out-of-pocket charges mean high per-transaction fees",
      "Multiple providers in one practice multiplies the fee problem",
      "HIPAA-compliant payment systems are expensive — processors charge a premium",
      "Most offices are too busy with patients to audit their processing statements",
    ],
    benefits: [
      "Eliminate 100% of processing fees — redirect that money to patient care",
      "Free terminal for qualifying practices ($10K+/month volume)",
      "PCI-compliant terminals that meet healthcare payment standards",
      "Works for co-pays, elective procedures, and full out-of-pocket charges",
      "No contracts — zero cancellation fees, ever",
      "Local setup and training so your front desk is confident from day one",
    ],
    faq: [
      { q: "Is the cash discount program appropriate for a medical office?", a: "Absolutely. Medical offices across Hawaii use it. Patients are used to seeing service fees in healthcare. The signage is professional and clear, and the savings for your practice are significant." },
      { q: "Does it work with our practice management software?", a: "Yes. The terminal operates independently for payment processing. It works alongside any EHR or practice management system without requiring integration changes." },
      { q: "What about recurring payments and payment plans?", a: "We support recurring billing and can set up payment plans through our virtual terminal. The cash discount applies to in-person card transactions." },
    ],
    seo: {
      title: "Medical Office Credit Card Processing Hawaii | Zero Fees | TechSavvy",
      description: "Hawaii medical and dental offices save $16,200/year by eliminating credit card processing fees. PCI-compliant terminals, no contracts, local support for healthcare practices.",
      keywords: "medical credit card processing Hawaii, dental office payment processing, healthcare payment terminal Hawaii, doctor office card processing Honolulu, medical POS Hawaii",
    },
  },
  "food-trucks": {
    slug: "food-trucks",
    name: "Food Trucks & Mobile Vendors",
    title: "Hawaii Food Trucks Lose $5,400/Year to Processing Fees",
    painNumber: "$5,400",
    painLine: "That's what the average Hawaii food truck loses every year to credit card processing fees.",
    description: "Plate lunches, shave ice, poke bowls — food trucks run on tight margins. When you're paying 2.6-3.5% on every $12-$18 sale, those fees eat into profit you can't afford to lose. And mobile-friendly processors like Square charge even more than traditional ones.",
    problems: [
      "Thin margins mean every percentage point of fees hurts",
      "Square and mobile processors charge 2.6%+ on every tap and swipe",
      "High transaction volume with small ticket sizes maximizes per-transaction fees",
      "No negotiating power — mobile processors offer one rate, take it or leave it",
    ],
    benefits: [
      "Eliminate 100% of processing fees — keep every dollar from every plate",
      "Free wireless terminal that works anywhere with cell service",
      "Battery-powered — perfect for events, farmers markets, and pop-ups",
      "Faster checkout than Square — tap and go in seconds",
      "No contracts — perfect for seasonal vendors",
      "Local Honolulu team sets you up and programs your terminal on-site",
    ],
    faq: [
      { q: "Does the terminal work without Wi-Fi?", a: "Yes. Our wireless terminals use cellular data (4G/LTE) so they work anywhere with cell service — beach parks, farmers markets, festivals, wherever your truck goes." },
      { q: "Will customers at a food truck mind the cash discount?", a: "Food truck customers are used to it. Many already carry cash. The ones who pay by card see a small adjustment and almost never push back — especially when the food is good." },
      { q: "What about events and festivals with high volume?", a: "Our terminals handle high-volume days easily. Fast tap-to-pay processing keeps your line moving. And on your busiest days, you save the most in fees." },
    ],
    seo: {
      title: "Food Truck Credit Card Processing Hawaii | Zero Fees | TechSavvy",
      description: "Hawaii food trucks save $5,400/year by eliminating credit card processing fees. Free wireless terminal, no contracts. Built for mobile vendors, farmers markets, and events.",
      keywords: "food truck credit card processing Hawaii, mobile vendor payment processing, food truck POS Hawaii, wireless payment terminal Hawaii, farmers market card processing, food truck Square alternative",
    },
  },
  ecommerce: {
    slug: "ecommerce",
    name: "E-Commerce & Online Stores",
    title: "Hawaii Online Stores Lose $12,600/Year to Processing Fees",
    painNumber: "$12,600",
    painLine: "That's what the average Hawaii e-commerce business loses every year to credit card processing fees.",
    description: "Selling online means every single transaction is a card payment — there's no cash option. At 2.9% + 30¢ per transaction (Stripe's standard rate), a store doing $35K/month is handing over $1,000+ every month. That's money that should go toward inventory, marketing, or shipping.",
    problems: [
      "100% of sales are card-based — no way to avoid fees with traditional processors",
      "Stripe charges 2.9% + 30¢ per transaction with no volume discounts",
      "International cards and premium cards cost even more — up to 3.5%+",
      "Platform fees from Shopify, WooCommerce plugins, and gateways stack on top",
    ],
    benefits: [
      "Drastically reduced processing rates through our merchant account program",
      "Payment gateway integration with Shopify, WooCommerce, and custom sites",
      "Lower interchange rates than Stripe or PayPal — saves $3,000-$8,000+/year",
      "Virtual terminal for phone orders and manual card entry",
      "No long-term contracts — month-to-month from day one",
      "Local support team that helps you optimize your checkout for conversions",
    ],
    faq: [
      { q: "Can you beat Stripe's rates?", a: "Yes. Stripe charges a flat 2.9% + 30¢ with no room to negotiate. Our merchant account rates are significantly lower, especially for businesses doing $20K+/month. The savings add up fast." },
      { q: "Does it integrate with Shopify?", a: "Yes. We provide payment gateway credentials that integrate directly with Shopify, WooCommerce, Magento, and most major e-commerce platforms." },
      { q: "What about the cash discount for online?", a: "The cash discount program is designed for in-person transactions. For e-commerce, we focus on getting you the lowest possible interchange rates — which still saves thousands compared to Stripe or PayPal." },
    ],
    seo: {
      title: "E-Commerce Credit Card Processing Hawaii | Low Rates | TechSavvy",
      description: "Hawaii online stores save $12,600/year with lower processing rates than Stripe or PayPal. Shopify and WooCommerce integration, no contracts, local support.",
      keywords: "ecommerce credit card processing Hawaii, online store payment processing, Shopify payment gateway Hawaii, WooCommerce processing, Stripe alternative Hawaii, low rate online payment processing",
    },
  },
};

export default function IndustryPage() {
  const params = useParams<{ industry: string }>();
  const industry = industries[params.industry || ""];
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  if (!industry) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Industry not found</h1>
            <a href="/" className="text-primary underline">Back to home</a>
          </div>
        </div>
      </Layout>
    );
  }

  useSEO({
    title: industry.seo.title,
    description: industry.seo.description,
    keywords: industry.seo.keywords,
    canonical: `https://techsavvyhawaii.com/industries/${industry.slug}`,
    ogImage: "https://techsavvyhawaii.com/images/hero-hawaii-sunset.jpg",
  });

  return (
    <Layout>
      {/* Hero */}
      <section className="relative pt-24 pb-16 sm:pt-36 sm:pb-24 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/8 via-primary/3 to-transparent" />
          <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-primary/8 blur-[150px]" />
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div variants={fadeUp}>
              <Badge variant="outline" className="mb-5 text-primary border-primary/30 bg-primary/5">
                <MapPin className="w-3 h-3 mr-1" />
                Built for Hawai'i {industry.name}
              </Badge>
            </motion.div>
            <motion.h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] mb-6" variants={fadeUp}>
              {industry.title.split(industry.painNumber)[0]}
              <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">{industry.painNumber}/Year</span>
              {industry.title.split("/Year")[1]}
            </motion.h1>
            <motion.p className="text-base sm:text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto" variants={fadeUp}>
              {industry.painLine}
            </motion.p>
            <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-3" variants={fadeUp}>
              <Button size="lg" className="text-base px-8 py-6 w-full sm:w-auto" asChild>
                <a href="/statement-review">
                  Get Your Free AI Analysis
                  <ArrowRight className="w-4 h-4" />
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="tel:8087675460">
                  <Phone className="w-4 h-4" />
                  (808) 767-5460
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-14 sm:py-20">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl sm:text-4xl font-extrabold mb-5">The problem for {industry.name.toLowerCase()}</h2>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-8">{industry.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {industry.problems.map((p) => (
                <Card key={p} className="border-red-500/15">
                  <CardContent className="p-4 flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-red-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-400 text-xs font-bold">!</span>
                    </div>
                    <span className="text-sm text-foreground/80">{p}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Solution */}
      <section className="py-14 sm:py-20 relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-card/50 via-transparent to-card/50" />
        <div className="max-w-4xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl sm:text-4xl font-extrabold mb-5">How TechSavvy fixes this for {industry.name.toLowerCase()}</h2>
            <div className="space-y-3">
              {industry.benefits.map((b) => (
                <div key={b} className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground/90">{b}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Button size="lg" asChild>
                <a href="/statement-review">
                  See How Much Your {industry.name.split(" ")[0]} Could Save
                  <ArrowRight className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 sm:py-20">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-6">Questions from {industry.name.toLowerCase()} owners</h2>
          <div className="space-y-3">
            {industry.faq.map((faq, i) => (
              <Card key={i} className="border-border/50 overflow-hidden cursor-pointer" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <CardContent className="p-0">
                  <button className="w-full p-5 flex items-center justify-between text-left">
                    <span className="font-bold text-foreground pr-4">{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 -mt-1">
                      <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Card className="border-primary/20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-primary/3 to-transparent" />
            <CardContent className="p-8 sm:p-12 relative">
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
                Stop losing {industry.painNumber}/year.
              </h2>
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                Get a free AI-powered statement analysis and see exactly how much your {industry.name.toLowerCase().replace(/s$/, "")} is losing to processing fees.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button size="lg" className="px-8" asChild>
                  <a href="/statement-review">
                    Free AI Statement Analysis
                    <ArrowRight className="w-4 h-4" />
                  </a>
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
        </div>
      </section>
    </Layout>
  );
}
