import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  ArrowRight, Phone, Check, Globe, Users, Palette, CreditCard,
  Megaphone, Star, Clock, Shield, Sparkles, ChevronDown, Zap, Building2,
} from "lucide-react";
import { useState } from "react";
import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { useSEO } from "@/hooks/useSEO";

const SERVICES = [
  {
    icon: Globe,
    title: "Custom Websites",
    desc: "Hand-coded, conversion-focused sites. No drag-and-drop templates, no bloated page builders. Most projects launch in 7–14 days.",
    accent: "#22c55e",
  },
  {
    icon: Users,
    title: "Custom CRM Systems",
    desc: "Tailored pipelines, automations, and dashboards built around how your team actually sells — not a one-size-fits-all SaaS.",
    accent: "#38bdf8",
  },
  {
    icon: Palette,
    title: "Brand & Design",
    desc: "Identity systems, print collateral, social templates, and ongoing creative — all produced in-house by a single design team.",
    accent: "#a78bfa",
  },
  {
    icon: CreditCard,
    title: "Zero-Fee Payment Processing",
    desc: "Compliant cash-discount and surcharge programs that legally pass the processing fee to the customer. Keep 100% of every sale.",
    accent: "#f59e0b",
  },
  {
    icon: Megaphone,
    title: "Performance Ad Funnels",
    desc: "Google, Meta, and YouTube ad campaigns engineered for ROAS. Real reporting, no agency black boxes.",
    accent: "#ef4444",
  },
  {
    icon: Sparkles,
    title: "AI & Automation",
    desc: "Chatbots, automated booking, smart follow-ups, and back-office automations that cut admin work by 60%+.",
    accent: "#14b8a6",
  },
];

const STATS = [
  { value: "500+", label: "Businesses served" },
  { value: "50", label: "U.S. states & territories" },
  { value: "$8M+", label: "Saved in processing fees" },
  { value: "<24h", label: "Average response time" },
];

const TESTIMONIALS = [
  { name: "Daniel R.", biz: "HVAC — Phoenix, AZ", quote: "We replaced three vendors with this team. Website, CRM, and processing all on one bill. Saved $2,200/month." },
  { name: "Sarah L.", biz: "Boutique — Nashville, TN", quote: "The cash-discount program alone covered the cost of the entire website rebuild in the first quarter." },
  { name: "Marcus B.", biz: "Auto Detailing — Charlotte, NC", quote: "I was getting nowhere with a national agency. These folks built me a working CRM in two weeks." },
  { name: "Elena V.", biz: "Med Spa — Austin, TX", quote: "Booking automations replaced two front-desk hours a day. The ROI was immediate." },
  { name: "Greg P.", biz: "Plumbing — Denver, CO", quote: "Their ad funnel paid for itself in week one. Real numbers, no fluff reports." },
  { name: "Tasha M.", biz: "Salon Suite — Atlanta, GA", quote: "I finally have a website that doesn't look like a template. And processing dropped to literally zero." },
];

const PROCESS = [
  { n: "01", title: "Free Discovery Call", desc: "30 minutes. We learn your business, your bottlenecks, and what you actually need built." },
  { n: "02", title: "Scoped Proposal", desc: "Within 48 hours, you get a fixed-price proposal — line items, timeline, no surprise add-ons." },
  { n: "03", title: "Build Sprint", desc: "Weekly demos, async updates in your timezone. You see progress every Friday." },
  { n: "04", title: "Launch & Support", desc: "We don't disappear after launch. Ongoing support, edits, and optimization on a flat monthly rate." },
];

const FAQS = [
  {
    q: "Where is your team based?",
    a: "Our headquarters is in the U.S. with a fully distributed team across multiple time zones, so wherever you are in the country, you're working with someone in your business hours.",
  },
  {
    q: "Can you really work with a business in another state?",
    a: "Most of our work runs remotely with weekly video check-ins, shared project boards, and Slack/Teams access for your team. We've built and shipped projects for clients in nearly every state — distance hasn't been an issue in years.",
  },
  {
    q: "What does zero-fee payment processing actually mean?",
    a: "We set up a compliant cash-discount or surcharge program (legal in 49 states with proper signage and disclosure) that passes the processing fee to the customer at checkout. The customer chooses to pay with card and covers the small fee — your business keeps 100% of the listed price.",
  },
  {
    q: "How fast can you launch a new website?",
    a: "Standard 5–7 page custom websites launch in 7–14 business days. E-commerce, multi-language, or deeply custom CRM-integrated builds typically take 3–6 weeks.",
  },
  {
    q: "Do I have to switch processors to work with you?",
    a: "No. The zero-fee processing program is offered separately and is genuinely optional. You can hire us for websites, CRM, branding, or ads without changing anything about your payments.",
  },
  {
    q: "What industries do you specialize in?",
    a: "We work across home services (HVAC, plumbing, electrical, cleaning), retail and boutiques, restaurants and cafes, beauty and wellness (salons, med spas, gyms), professional services (law, accounting, consulting), automotive, and high-risk verticals like cannabis-adjacent and adult.",
  },
  {
    q: "Do you offer financing or payment plans?",
    a: "Yes. Larger projects can be split into milestone-based payments, and certain build types can be rolled into a flat monthly retainer with $0 upfront.",
  },
  {
    q: "What if I already have a website I just want improved?",
    a: "We do redesigns, performance overhauls, SEO migrations, and platform replatforms (WordPress → custom, Wix → custom, Shopify migrations, etc.) all the time. Send us your current site for a free audit.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border/40 rounded-xl overflow-hidden bg-card/50">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center justify-between p-5 text-left hover-elevate"
        data-testid={`faq-q-${q.slice(0, 24).replace(/\s+/g, "-")}`}
      >
        <span className="font-semibold text-sm md:text-base pr-4">{q}</span>
        <ChevronDown className={`w-5 h-5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{a}</div>}
    </div>
  );
}

export default function MainlandPage() {
  useSEO({
    title: "TechSavvy — Custom Websites, CRM Systems & Zero-Fee Payment Processing for U.S. Businesses",
    description:
      "American small and mid-market businesses use TechSavvy for custom websites, CRM platforms, branding, performance ads, and zero-fee payment processing. One team, fixed pricing, real U.S.-based support. Free discovery call.",
    keywords:
      "custom website design, small business CRM, zero fee payment processing, cash discount program, surcharge processing, US web design agency, custom CRM development, performance marketing agency, business automation, merchant services USA, website redesign, custom software for small business, AI automation for business",
    canonical: "https://techsavvyhawaii.com/home",
    ogTitle: "TechSavvy — Built for U.S. Businesses That Want to Stop Overpaying",
    ogDescription:
      "Custom websites, CRMs, branding, ads, and zero-fee payment processing — all from one team. Free discovery call.",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "@id": "https://techsavvyhawaii.com/home#service",
        name: "TechSavvy",
        url: "https://techsavvyhawaii.com/home",
        telephone: "+1-808-767-5460",
        email: "contact@techsavvyhawaii.com",
        priceRange: "$$",
        areaServed: { "@type": "Country", name: "United States" },
        serviceType: [
          "Custom Website Development",
          "CRM Development",
          "Brand & Graphic Design",
          "Payment Processing",
          "Digital Advertising",
          "Business Automation",
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  });

  return (
    <Layout>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-950/10 via-background to-background pt-20 pb-24 md:pt-32 md:pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(56,189,248,0.08),transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(168,139,250,0.06),transparent_50%)] pointer-events-none" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold tracking-wider uppercase mb-6">
              <Zap className="w-3.5 h-3.5" /> Serving U.S. businesses coast to coast
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.05] mb-6">
              The Tech Team Behind{" "}
              <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                Better-Run U.S. Businesses
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              Custom websites, CRM systems, branding, performance ads, and zero-fee payment processing — engineered by one team, billed on one invoice, supported by real humans in your timezone.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/contact">
                <Button size="lg" className="text-base px-7 h-12" data-testid="button-hero-discovery">
                  Book Free Discovery Call <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <Link href="/statement-review">
                <Button size="lg" variant="outline" className="text-base px-7 h-12" data-testid="button-hero-statement">
                  Free Merchant Statement Review
                </Button>
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5"><Check className="w-4 h-4 text-sky-400" /> Fixed-price proposals</div>
              <div className="flex items-center gap-1.5"><Check className="w-4 h-4 text-sky-400" /> No long-term contracts</div>
              <div className="flex items-center gap-1.5"><Check className="w-4 h-4 text-sky-400" /> U.S.-based support</div>
              <div className="flex items-center gap-1.5"><Check className="w-4 h-4 text-sky-400" /> Same team start to finish</div>
            </div>
          </motion.div>

          {/* Stats strip */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="text-center p-5 rounded-2xl border border-border/40 bg-card/40 backdrop-blur-sm"
              >
                <div className="text-2xl md:text-3xl font-black bg-gradient-to-br from-sky-400 to-violet-400 bg-clip-text text-transparent">
                  {s.value}
                </div>
                <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-20 md:py-28 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Every Piece of Your Operation, From One Team
            </h2>
            <p className="text-muted-foreground">
              Stop juggling six vendors, four logins, and a Slack channel for each. We handle the whole stack — and we built our own admin platform to prove we use what we sell.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {SERVICES.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group relative p-6 rounded-2xl border border-border/40 bg-background/50 hover-elevate"
                data-testid={`service-${s.title.replace(/\s+/g, "-").toLowerCase()}`}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${s.accent}1a`, color: s.accent }}
                >
                  <s.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How Working With Us Actually Goes</h2>
            <p className="text-muted-foreground">
              No mystery. No agency theatre. Four steps from first call to launched, supported, and growing.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {PROCESS.map((p) => (
              <div
                key={p.n}
                className="relative p-6 rounded-2xl border border-border/40 bg-card/40"
              >
                <div className="text-4xl font-black bg-gradient-to-br from-sky-400/40 to-violet-400/40 bg-clip-text text-transparent mb-3">
                  {p.n}
                </div>
                <h3 className="font-bold mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-20 md:py-24 bg-card/30">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Building2,
                title: "One Vendor, One Invoice",
                desc: "Website, CRM, branding, ads, and processing on a single monthly statement. No vendor finger-pointing when something breaks.",
              },
              {
                icon: Clock,
                title: "Your Timezone, Real Humans",
                desc: "U.S.-based team across multiple time zones. Email gets answered the same day. Calls get picked up.",
              },
              {
                icon: Shield,
                title: "Compliance Built-In",
                desc: "We handle PCI, surcharge disclosure, ADA accessibility, GDPR/CCPA basics, and SOC-2 vendor relationships. You don't think about any of it.",
              },
            ].map((b) => (
              <div key={b.title} className="text-center p-6">
                <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center mx-auto mb-4">
                  <b.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg mb-2">{b.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Owners Across the Country, Same Story</h2>
            <p className="text-muted-foreground">
              The work speaks louder than the marketing copy. Here's a sample.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="p-6 rounded-2xl border border-border/40 bg-card/40"
                data-testid={`testimonial-${t.name.replace(/\s+/g, "-").toLowerCase()}`}
              >
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-4">"{t.quote}"</p>
                <div className="text-xs">
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-muted-foreground">{t.biz}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQS.map((f) => <FAQItem key={f.q} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 bg-gradient-to-b from-background via-sky-950/10 to-background">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-5 tracking-tight">
            Ready to stop bleeding margin to vendors who don't know your business?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Book a 30-minute discovery call or send us your last merchant statement. Either way, you'll walk away with real numbers and a clear plan — at zero cost.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/contact">
              <Button size="lg" className="text-base px-7 h-12" data-testid="button-final-discovery">
                Book Free Discovery Call <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link href="/statement-review">
              <Button size="lg" variant="outline" className="text-base px-7 h-12" data-testid="button-final-statement">
                Free Statement Review
              </Button>
            </Link>
            <a href="tel:+18087675460">
              <Button size="lg" variant="ghost" className="text-base px-7 h-12" data-testid="button-final-call">
                <Phone className="w-4 h-4 mr-1" /> Or just call
              </Button>
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
