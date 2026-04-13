import { motion } from "framer-motion";
import Layout from "@/components/layout";
import { useSEO } from "@/hooks/useSEO";
import {
  Check,
  ArrowRight,
  Phone,
  Globe,
  Users,
  Palette,
  CreditCard,
  Megaphone,
  Mail,
  Zap,
  Star,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

// ─── Package data ──────────────────────────────────────────────────────────────

const PACKAGES = [
  {
    name: "Starter",
    tagline: "Stop worrying about your website.",
    setup: "$799",
    monthly: "$199",
    monthlyNote: "/month",
    accent: "#38bdf8",
    highlight: false,
    setupIncludes: [
      "Fully custom website (up to 6 pages)",
      "Mobile-first design",
      "SEO setup: meta, schema, sitemap",
      "Contact forms + email notifications",
      "Google Analytics + Search Console",
      "Fast hosting with SSL",
    ],
    monthlyIncludes: [
      "Hosting, SSL & uptime monitoring",
      "Up to 4 content updates/month",
      "Monthly Analytics summary (plain English)",
      "Priority text/email support",
      "Annual SEO refresh",
    ],
    bestFor: "Restaurants, retail shops, service businesses, and professionals who need a solid online presence without the headache of managing it themselves.",
    cta: "Get started",
    ctaHref: "/apply",
  },
  {
    name: "Growth",
    tagline: "Get new customers every month.",
    setup: "$500",
    monthly: "$750",
    monthlyNote: "/month",
    accent: "#22c55e",
    highlight: true,
    badge: "Most popular",
    setupIncludes: [
      "Fully custom website (up to 6 pages)",
      "Mobile-first design + SEO setup",
      "Contact forms + Google Analytics",
      "Campaign landing page",
      "Initial ad account setup (Meta or Google)",
    ],
    monthlyIncludes: [
      "Everything in Starter",
      "Meta or Google Ads managed weekly",
      "New ad creative every month (copy + design)",
      "1–2 email campaigns/month (written + sent)",
      "Monthly performance report — leads, cost per lead, opens, clicks",
    ],
    bestFor: "Businesses ready to grow predictably — gyms, med spas, contractors, restaurants, realtors — anyone who wants new customers coming in without running ads themselves.",
    cta: "Start growing",
    ctaHref: "/apply",
  },
  {
    name: "Full Stack",
    tagline: "We run your entire digital operation.",
    setup: "$1,500",
    monthly: "$1,200",
    monthlyNote: "/month",
    accent: "#a78bfa",
    highlight: false,
    setupIncludes: [
      "Fully custom website",
      "Custom CRM built around your workflow",
      "Full brand identity (logo, colors, fonts, guidelines)",
      "Email deliverability setup (SPF/DKIM/DMARC)",
      "Ad account setup on Meta + Google",
    ],
    monthlyIncludes: [
      "Everything in Growth",
      "CRM management — leads, sequences, pipelines",
      "8–10 branded social post templates/month",
      "Email deliverability monitoring + list hygiene",
      "Quarterly strategy call — what's working, what to change",
      "First priority on any new builds or changes",
    ],
    bestFor: "Businesses serious about growth that want one team handling everything — no juggling four vendors, no wondering who to call.",
    cta: "Let's talk",
    ctaHref: "/contact",
  },
];

const ADD_ONS = [
  { icon: Globe, label: "Extra pages", price: "$150 each", desc: "Add pages beyond the base package — services, team, gallery, etc." },
  { icon: CreditCard, label: "eCommerce setup", price: "$600+", desc: "Online store with product pages, cart, and checkout." },
  { icon: Palette, label: "Additional brand collateral", price: "$200–$400", desc: "Menus, flyers, business cards, banners — print-ready files." },
  { icon: Megaphone, label: "TikTok Ads", price: "$300 setup + $500/mo", desc: "Add TikTok to your ad mix — targeting, creative, and management." },
  { icon: Mail, label: "Email sequence build", price: "$400–$800", desc: "Welcome series, drip campaigns, re-engagement flows — written and built." },
  { icon: Users, label: "Additional CRM users/training", price: "$200", desc: "Onboard more team members with live training and documentation." },
];

const FAQS = [
  {
    q: "Is there a contract or minimum commitment?",
    a: "No long-term contracts. Monthly services are month-to-month — cancel anytime. Setup fees are one-time, paid at kickoff.",
  },
  {
    q: "How does payment work?",
    a: "Setup fee is due at project kickoff. Monthly billing starts when your site launches. We accept card, ACH, or cash.",
  },
  {
    q: "Do you offer payment plans on setup fees?",
    a: "Yes — for setup fees over $1,000 we offer a 50/50 split: half at kickoff, half at launch. Just ask.",
  },
  {
    q: "What if I only want one service — like just ads or just email?",
    a: "The packages are designed as bundles for the best value, but we do take standalone projects. Reach out and we'll put together a custom quote.",
  },
  {
    q: "Does this include the cost of running ads?",
    a: "No — ad spend goes directly to Meta or Google from your account. Our fee covers the strategy, creative, and management. We recommend a minimum $500/month ad budget to start.",
  },
  {
    q: "What about payment processing?",
    a: "Payment processing is always free — no setup fee, no monthly fee, no processing fees. We earn a small backend residual from the card networks, not from you.",
  },
];

// ─── Components ───────────────────────────────────────────────────────────────

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/10 last:border-0 cursor-pointer" onClick={() => setOpen((o) => !o)}>
      <button className="w-full flex items-center justify-between gap-4 py-5 text-left">
        <span className="font-semibold text-white text-sm sm:text-base">{q}</span>
        <ChevronDown className={`w-5 h-5 text-primary flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-64 pb-5" : "max-h-0"}`}>
        <p className="text-white/60 text-sm leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

function PackageCard({ pkg, index }: { pkg: typeof PACKAGES[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative flex flex-col rounded-2xl border overflow-hidden"
      style={{
        borderColor: pkg.highlight ? pkg.accent + "60" : "rgba(255,255,255,0.08)",
        background: pkg.highlight
          ? `linear-gradient(135deg, ${pkg.accent}10 0%, rgba(255,255,255,0.02) 100%)`
          : "rgba(255,255,255,0.02)",
        boxShadow: pkg.highlight ? `0 0 60px ${pkg.accent}18` : "none",
      }}
    >
      {pkg.highlight && (
        <div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: `linear-gradient(90deg, transparent, ${pkg.accent}, transparent)` }}
        />
      )}

      {pkg.badge && (
        <div className="absolute top-4 right-4">
          <span
            className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
            style={{ background: pkg.accent + "20", color: pkg.accent, border: `1px solid ${pkg.accent}40` }}
          >
            <Star className="w-2.5 h-2.5" /> {pkg.badge}
          </span>
        </div>
      )}

      <div className="p-6 sm:p-8 flex flex-col flex-1">
        {/* Header */}
        <div className="mb-6">
          <span className="text-xs font-black uppercase tracking-[0.18em] mb-2 block" style={{ color: pkg.accent }}>
            {pkg.name}
          </span>
          <h3 className="text-white font-black text-xl leading-snug mb-3">{pkg.tagline}</h3>

          {/* Pricing */}
          <div className="flex items-end gap-4 flex-wrap">
            <div>
              <span className="text-white/40 text-xs uppercase tracking-widest block mb-0.5">Setup</span>
              <span className="text-3xl font-black text-white">{pkg.setup}</span>
              <span className="text-white/40 text-sm ml-1">once</span>
            </div>
            <div className="text-white/20 text-xl font-light mb-1">+</div>
            <div>
              <span className="text-white/40 text-xs uppercase tracking-widest block mb-0.5">Then</span>
              <span className="text-3xl font-black" style={{ color: pkg.accent }}>{pkg.monthly}</span>
              <span className="text-white/40 text-sm ml-1">{pkg.monthlyNote}</span>
            </div>
          </div>
        </div>

        {/* Setup includes */}
        <div className="mb-5">
          <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-3">Setup includes</p>
          <ul className="space-y-2">
            {pkg.setupIncludes.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-white/70">
                <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: pkg.accent }} />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Monthly includes */}
        <div className="mb-6 rounded-xl p-4 border" style={{ borderColor: pkg.accent + "20", background: pkg.accent + "08" }}>
          <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: pkg.accent }}>Monthly includes</p>
          <ul className="space-y-2">
            {pkg.monthlyIncludes.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-white/70">
                <Zap className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: pkg.accent }} />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Best for */}
        <p className="text-white/40 text-xs leading-relaxed mb-6 flex-1">{pkg.bestFor}</p>

        {/* CTA */}
        <a
          href={pkg.ctaHref}
          data-testid={`link-package-cta-${pkg.name.toLowerCase().replace(" ", "-")}`}
          className="flex items-center justify-center gap-2 font-black py-3.5 rounded-xl text-sm transition-opacity hover:opacity-90"
          style={pkg.highlight
            ? { background: pkg.accent, color: "#fff" }
            : { border: `1px solid ${pkg.accent}50`, color: pkg.accent, background: pkg.accent + "10" }
          }
        >
          {pkg.cta} <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PackagesPage() {
  useSEO({
    title: "Packages & Pricing — Websites, CRMs, Ads & More | TechSavvy Hawaii",
    description:
      "Simple, transparent pricing for Hawaii businesses. Starter from $199/month, Growth from $750/month, Full Stack from $1,200/month. Custom websites, CRMs, ad management, email, and branding — one local team.",
    keywords:
      "Hawaii web design pricing, website packages Hawaii, CRM pricing Hawaii, digital marketing packages Hawaii, TechSavvy Hawaii pricing, small business website cost Hawaii, ad management pricing Honolulu",
    canonical: "https://techsavvyhawaii.com/packages",
    ogTitle: "Packages & Pricing | TechSavvy Hawaii",
    ogDescription:
      "Starter $199/mo · Growth $750/mo · Full Stack $1,200/mo. One local Hawaii team for your website, CRM, ads, email, and branding.",
    ogImage: "https://techsavvyhawaii.com/images/hero-hawaii-sunset.jpg",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": "https://techsavvyhawaii.com/packages#webpage",
      name: "Packages & Pricing | TechSavvy Hawaii",
      url: "https://techsavvyhawaii.com/packages",
      description: "Service packages and pricing for TechSavvy Hawaii — websites, CRMs, ad management, email deliverability, and branding.",
      isPartOf: { "@id": "https://techsavvyhawaii.com/#website" },
    },
  });

  return (
    <Layout>
      {/* ── Hero ── */}
      <section className="bg-[#060810] pt-28 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[340px] bg-primary/8 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-5 text-center">
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="text-primary text-xs font-bold uppercase tracking-[0.2em]">Transparent pricing</span>
            <h1 className="text-4xl sm:text-6xl font-black text-white mt-3 mb-5 leading-[1.05]">
              Simple packages.<br />
              <span className="text-primary">No surprises.</span>
            </h1>
            <p className="text-white/50 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              One setup fee. One monthly rate. No hidden costs, no add-on traps. Pick the package that fits where your business is right now — you can always upgrade.
            </p>
          </motion.div>

          {/* Free processing callout */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2.5 mt-8 px-5 py-3 rounded-full border border-primary/30 bg-primary/8"
          >
            <CreditCard className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="text-white/80 text-sm">
              <span className="text-primary font-bold">Payment processing is always free</span> — no setup fee, no monthly fee, no processing fees. Ever.
            </span>
          </motion.div>
        </div>
      </section>

      {/* ── Package cards ── */}
      <section className="bg-[#060810] pb-20">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PACKAGES.map((pkg, i) => (
              <PackageCard key={pkg.name} pkg={pkg} index={i} />
            ))}
          </div>

          {/* Plan comparison note */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-white/25 text-xs mt-8"
          >
            No contracts. Cancel anytime. Setup fees are one-time. Monthly billing starts at launch.
          </motion.p>
        </div>
      </section>

      {/* ── Add-ons ── */}
      <section className="bg-[#07090f] py-20 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-primary text-xs font-bold uppercase tracking-[0.2em]">À la carte</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-3 mb-3">Add what you need.</h2>
            <p className="text-white/50 text-base">Stack any of these onto your package at any time.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ADD_ONS.map((addon, i) => {
              const Icon = addon.icon;
              return (
                <motion.div
                  key={addon.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="font-bold text-white text-sm">{addon.label}</span>
                    </div>
                    <span className="text-primary text-xs font-black whitespace-nowrap">{addon.price}</span>
                  </div>
                  <p className="text-white/50 text-xs leading-relaxed">{addon.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-[#060810] py-20 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-primary text-xs font-bold uppercase tracking-[0.2em]">Before you ask</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-3">Pricing questions.</h2>
          </motion.div>
          <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl px-6 sm:px-8">
            {FAQS.map((f) => (
              <FAQItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#07090f] py-20 border-t border-white/5">
        <div className="max-w-2xl mx-auto px-5 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Not sure which fits?</h2>
            <p className="text-white/50 text-base mb-8 leading-relaxed">
              Book a free 20-minute call. We'll look at where your business is, where you want it to go, and tell you honestly which package makes sense — or if none of them do.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/contact"
                data-testid="link-packages-cta-contact"
                className="inline-flex items-center gap-2 bg-primary text-white font-black px-8 py-4 rounded-xl text-base hover:opacity-90 transition-opacity"
              >
                Book a free call <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="tel:+18087675460"
                data-testid="link-packages-cta-phone"
                className="inline-flex items-center gap-2 border border-white/15 text-white/70 font-semibold px-6 py-4 rounded-xl text-sm hover:border-white/30 hover:text-white transition-all"
              >
                <Phone className="w-4 h-4" /> (808) 767-5460
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
