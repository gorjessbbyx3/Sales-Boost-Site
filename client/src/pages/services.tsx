import { motion } from "framer-motion";
import Layout from "@/components/layout";
import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import {
  Globe,
  Users,
  Palette,
  CreditCard,
  Megaphone,
  Mail,
  Check,
  ArrowRight,
  ChevronDown,
  Phone,
  Zap,
  Shield,
  Clock,
  TrendingUp,
  Target,
  Inbox,
} from "lucide-react";
import { useState } from "react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const SERVICES = [
  {
    id: "websites",
    icon: Globe,
    accent: "#22c55e",
    label: "Custom Websites",
    tagline: "Live in 7 days. Built for your brand.",
    intro:
      "We don't use templates or page builders. Every site we build starts with your business — your brand, your customers, your goals. We design, develop, and launch it. Then we stay.",
    features: [
      { icon: Zap, title: "7-Day Launch", body: "Most sites go from kickoff to live in under a week. Not months." },
      { icon: Globe, title: "Mobile-First Design", body: "Built for phones first. Over 70% of your traffic is mobile — we design for that." },
      { icon: Shield, title: "SEO From Day One", body: "Proper meta tags, structured data, canonical URLs, and fast load times baked in from the start." },
      { icon: Clock, title: "Hosting & Support Included", body: "We host it, maintain it, and keep it updated. One number to call if anything ever goes sideways." },
    ],
    whatYouGet: [
      "Fully custom design (no templates)",
      "Mobile-responsive on all screen sizes",
      "SEO structure: meta, schema, canonical, sitemap",
      "Contact forms with email notifications",
      "Google Analytics + Search Console setup",
      "Fast CDN hosting with SSL",
      "Content management (CMS) if needed",
      "Ongoing support — we don't disappear after launch",
    ],
    whoFor: "Restaurants, service businesses, retail shops, professionals, and anyone who needs a site that looks the part and actually works.",
    cta: "Get a free website quote",
    ctaHref: "/apply",
  },
  {
    id: "crm",
    icon: Users,
    accent: "#38bdf8",
    label: "CRM Systems",
    tagline: "A system that fits your team — not the other way around.",
    intro:
      "Off-the-shelf CRMs like HubSpot and Salesforce are built for massive enterprise sales teams. We build CRMs around how your business actually operates — your lead stages, your follow-up timing, your team's workflow.",
    features: [
      { icon: Target, title: "Custom Pipelines", body: "Your sales stages, your terminology, your process — not a generic template you have to shoehorn your business into." },
      { icon: Mail, title: "Auto Follow-Up", body: "Set up sequences that fire automatically: email, SMS, or internal tasks. No lead falls through the cracks." },
      { icon: Users, title: "Team Dashboards", body: "Every team member sees what they need — and nothing they don't. Managers get full pipeline visibility." },
      { icon: TrendingUp, title: "Lead Capture Integrations", body: "Forms on your website, Facebook Lead Ads, Google — all your leads flow into one place automatically." },
    ],
    whatYouGet: [
      "Custom deal/lead pipeline stages",
      "Contact & company records",
      "Automated follow-up sequences (email + SMS)",
      "Team task management and assignments",
      "Lead source tracking",
      "Form-to-CRM integrations",
      "Reporting dashboards",
      "Mobile-accessible for on-the-go teams",
    ],
    whoFor: "Sales teams, real estate agents, service businesses, contractors, and any business that needs to track and follow up with leads consistently.",
    cta: "Book a CRM demo",
    ctaHref: "/contact",
  },
  {
    id: "branding",
    icon: Palette,
    accent: "#a78bfa",
    label: "Brand & Design",
    tagline: "From nothing to a brand your customers recognize and trust.",
    intro:
      "Your brand is more than a logo. It's the feeling people get before they ever talk to you. We build complete brand identities — the visual language, the tone, the templates — so everything you put out looks like it belongs together.",
    features: [
      { icon: Palette, title: "Logo & Identity", body: "Primary logo, secondary marks, color palette, typography — everything you need to look consistent everywhere." },
      { icon: Globe, title: "Print & Collateral", body: "Business cards, flyers, menus, banners — designed in-house and print-ready." },
      { icon: Megaphone, title: "Social Templates", body: "Branded Canva or Figma templates your team can use without needing a designer every time." },
      { icon: TrendingUp, title: "Ongoing Content", body: "Monthly graphic packages for social, ads, and promotions — so you never run out of on-brand content." },
    ],
    whatYouGet: [
      "Logo suite (primary, secondary, icon mark)",
      "Brand color palette + typography guide",
      "Brand standards one-pager",
      "Business card design (print-ready)",
      "Social media profile graphics",
      "Editable social post templates",
      "Flyer / promotional design",
      "Ongoing monthly content packages available",
    ],
    whoFor: "New businesses launching their brand, established businesses that feel their look is dated, or anyone who wants everything to feel cohesive and professional.",
    cta: "Start your brand",
    ctaHref: "/apply",
  },
  {
    id: "payments",
    icon: CreditCard,
    accent: "#22c55e",
    label: "Zero-Fee Payment Processing",
    tagline: "Stop paying 2–4% on every sale. We have a legal way out.",
    intro:
      "Most Hawaii businesses pay $300–$800/month in credit card processing fees and have no idea it's optional. Our cash discount program is 100% legal, compliant, and eliminates your processing costs on day one.",
    features: [
      { icon: CreditCard, title: "$0 Processing Fees", body: "A small service fee is added to card transactions — you keep every dollar. Cash customers get a discount instead." },
      { icon: Zap, title: "Free Terminal Hardware", body: "We provide the physical terminal at no cost. No rental fees, no deposit, no contracts." },
      { icon: Clock, title: "Next-Day Deposits", body: "Sales from today hit your bank account tomorrow. No long settlement windows." },
      { icon: Shield, title: "High-Risk Approved", body: "CBD, vape, firearms, adult — we process categories that most processors decline." },
    ],
    whatYouGet: [
      "Zero processing fees (program fee passed to cardholder)",
      "Free terminal hardware (countertop, wireless, or mobile)",
      "Online payment gateway if needed",
      "Virtual terminal for phone orders",
      "Payment links and invoicing",
      "Next-day deposits",
      "No long-term contracts",
      "Local Hawaii support — not a call center",
    ],
    whoFor: "Any business in Hawaii accepting credit or debit cards — restaurants, retail, services, online stores, and high-risk merchants.",
    cta: "See how much you're losing",
    ctaHref: "/statement-review",
  },
  {
    id: "ads",
    icon: Megaphone,
    accent: "#fb923c",
    label: "Ad Funnels",
    tagline: "Paid ads that pay back.",
    intro:
      "Running ads without a funnel is like turning on a faucet with no bucket. We build the full system: ad creative, targeting, landing page, lead capture, and follow-up. Every dollar tracked.",
    features: [
      { icon: Target, title: "Meta & Google Ads", body: "We write, design, and launch campaigns on the platforms your customers actually use — and manage them week over week." },
      { icon: Palette, title: "AI-Generated Ad Creative", body: "Fast-cycle creative testing: headlines, images, hooks. We rotate what works and kill what doesn't." },
      { icon: Globe, title: "Landing Page Design", body: "Your ad needs somewhere to land. We build high-converting pages — not your homepage." },
      { icon: TrendingUp, title: "ROI Reporting", body: "You'll know exactly what each lead cost, where they came from, and what converted." },
    ],
    whatYouGet: [
      "Campaign strategy and audience research",
      "Ad creative (images, copy, video scripts)",
      "Meta Ads (Facebook + Instagram) management",
      "Google Ads management (Search + Display)",
      "TikTok Ads available",
      "Dedicated landing page for each campaign",
      "Lead capture + CRM integration",
      "Weekly performance reports",
    ],
    whoFor: "Businesses that want predictable new customer flow — restaurants, gyms, med spas, contractors, realtors, and service businesses ready to grow.",
    cta: "Get a free funnel audit",
    ctaHref: "/contact",
  },
  {
    id: "email",
    icon: Mail,
    accent: "#fb7185",
    label: "Email Deliverability",
    tagline: "Your emails are landing in spam. We fix that.",
    intro:
      "If your open rates are under 20% or you're sending and getting nothing back, your domain is probably flagged. We fix the technical setup first, then build sequences that actually get replies.",
    features: [
      { icon: Shield, title: "Domain Authentication", body: "SPF, DKIM, and DMARC configured correctly so your emails are trusted by Gmail, Outlook, and Apple Mail." },
      { icon: Inbox, title: "Inbox Placement Testing", body: "We test your sending reputation before and after — no guessing whether you're hitting the inbox." },
      { icon: Mail, title: "Drip Sequences", body: "Welcome sequences, follow-up flows, re-engagement campaigns — automated and written to get opened." },
      { icon: TrendingUp, title: "Open & Click Tracking", body: "Real data on what's working. Subject line A/B testing, click heat maps, and reply rate tracking." },
    ],
    whatYouGet: [
      "SPF, DKIM, and DMARC configuration",
      "Domain warm-up if starting fresh",
      "Inbox placement testing (pre and post)",
      "Blacklist check and remediation",
      "Email list cleaning",
      "Welcome / onboarding drip sequence",
      "Re-engagement campaign",
      "Monthly deliverability reporting",
    ],
    whoFor: "Any business doing email marketing — product launches, follow-up sequences, newsletters, or cold outreach — that isn't getting the open rates they expect.",
    cta: "Fix my email deliverability",
    ctaHref: "/contact",
  },
];

const FAQS = [
  {
    q: "Do I have to use all your services, or can I pick one?",
    a: "You can pick exactly what you need. Many clients start with payment processing or a website and add services as they grow. There's no bundle requirement.",
  },
  {
    q: "How fast can you actually launch a website?",
    a: "Most sites we build go live in 5–7 business days from kickoff. Complex builds (eCommerce, custom CRMs, booking systems) can take 2–3 weeks. We'll give you an honest timeline upfront.",
  },
  {
    q: "Is the zero-fee payment processing actually legal?",
    a: "Yes — 100%. The cash discount / surcharge model is legal in Hawaii and compliant with Visa, Mastercard, and Discover rules. We've processed millions in transactions for Hawaii businesses using this model.",
  },
  {
    q: "What's the difference between a CRM you build and something like HubSpot?",
    a: "HubSpot is built for enterprise sales teams and costs $800+/month at scale. We build a CRM around exactly how your business works — your stages, your language, your team. You're not paying for features you'll never use.",
  },
  {
    q: "Do you work with businesses outside Oahu?",
    a: "Yes. We serve businesses across all islands — Maui, Big Island, Kauai, Molokai — as well as mainland businesses that want Hawaii-based support. Most of our work is done remotely.",
  },
  {
    q: "Is there a contract or minimum commitment?",
    a: "No long-term contracts. Month-to-month for ongoing services. One-time builds are paid per project. We stay because we do good work — not because you're locked in.",
  },
  {
    q: "What does support look like after you build something?",
    a: "You get a real person — not a ticket queue. Most clients text or call their account rep directly. We're local, Hawaii-based, and available during business hours.",
  },
];

// ─── Components ───────────────────────────────────────────────────────────────

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border-b border-border/70 last:border-0 cursor-pointer"
      onClick={() => setOpen((o) => !o)}
    >
      <button className="w-full flex items-center justify-between gap-4 py-5 text-left">
        <span className="font-semibold text-foreground text-sm sm:text-base">{q}</span>
        <ChevronDown
          className={`w-5 h-5 text-primary flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-64 pb-5" : "max-h-0"}`}>
        <p className="text-muted-foreground text-sm leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

function ServiceSection({ svc, index }: { svc: typeof SERVICES[0]; index: number }) {
  const Icon = svc.icon;
  const isEven = index % 2 === 0;

  return (
    <section id={svc.id} className="py-20 border-b border-border/40 scroll-mt-24">
      <div className="max-w-6xl mx-auto px-5">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} gap-12 lg:gap-16 items-start`}
        >
          {/* Left/Right: text */}
          <div className="flex-1 min-w-0">
            {/* Label */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: svc.accent + "20", border: `1px solid ${svc.accent}40` }}>
                <Icon className="w-5 h-5" style={{ color: svc.accent }} />
              </div>
              <span className="text-xs font-black uppercase tracking-[0.18em]" style={{ color: svc.accent }}>
                {svc.label}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-foreground leading-tight mb-4">
              {svc.tagline}
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed mb-8">{svc.intro}</p>

            {/* Feature cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {svc.features.map((f) => {
                const FIcon = f.icon;
                return (
                  <div key={f.title}
                    className="rounded-xl border border-border bg-card p-4">
                    <div className="flex items-center gap-2.5 mb-2">
                      <FIcon className="w-4 h-4 flex-shrink-0" style={{ color: svc.accent }} />
                      <span className="font-bold text-foreground text-sm">{f.title}</span>
                    </div>
                    <p className="text-muted-foreground text-xs leading-relaxed">{f.body}</p>
                  </div>
                );
              })}
            </div>

            <Link
              href={svc.ctaHref}
              data-testid={`link-service-cta-${svc.id}`}
              className="inline-flex items-center gap-2 font-bold px-6 py-3 rounded-xl text-sm transition-opacity hover:opacity-90"
              style={{ background: svc.accent, color: "#fff" }}
            >
              {svc.cta} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right/Left: what you get + who it's for */}
          <div className="lg:w-[360px] flex-shrink-0 space-y-5">
            {/* What you get */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-black text-sm uppercase tracking-widest mb-4" style={{ color: svc.accent }}>
                What you get
              </h3>
              <ul className="space-y-2.5">
                {svc.whatYouGet.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-foreground/80">
                    <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: svc.accent }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Who it's for */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-black text-sm uppercase tracking-widest mb-3" style={{ color: svc.accent }}>
                Best for
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{svc.whoFor}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ServicesPage() {
  useSEO({
    title: "All Services — Websites, CRMs, Branding, Ads, Email & Zero-Fee Payments | TechSavvy Hawaii",
    description:
      "TechSavvy Hawaii builds custom websites, CRM systems, brand identities, ad funnels, and email deliverability — plus zero-fee payment processing for Hawaii businesses. One local team. No mainland runaround.",
    keywords:
      "Hawaii web design, custom website Hawaii, CRM Hawaii, brand identity Hawaii, ad funnels Hawaii, email deliverability Hawaii, zero-fee payment processing Hawaii, business services Honolulu, TechSavvy Hawaii services",
    canonical: "https://techsavvyhawaii.com/services",
    ogTitle: "All Services — TechSavvy Hawaii",
    ogDescription:
      "Websites, CRMs, branding, paid ads, email deliverability, and zero-fee payment processing. One Honolulu team for everything your business needs.",
    ogImage: "https://techsavvyhawaii.com/images/hero-hawaii-sunset.jpg",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": "https://techsavvyhawaii.com/services#webpage",
        name: "All Services | TechSavvy Hawaii",
        url: "https://techsavvyhawaii.com/services",
        description:
          "Full list of services offered by TechSavvy Hawaii: custom websites, CRM systems, branding, ad funnels, email deliverability, and zero-fee payment processing.",
        isPartOf: { "@id": "https://techsavvyhawaii.com/#website" },
        about: { "@id": "https://techsavvyhawaii.com/#organization" },
      },
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "TechSavvy Hawaii Services",
        url: "https://techsavvyhawaii.com/services",
        numberOfItems: 6,
        itemListElement: SERVICES.map((s, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: s.label,
          description: s.tagline,
          url: `https://techsavvyhawaii.com/services#${s.id}`,
        })),
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
      {/* ── Hero ── */}
      <section className="bg-background pt-28 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[340px] bg-primary/8 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-5 text-center">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-primary text-xs font-bold uppercase tracking-[0.2em]">
              Everything we do
            </span>
            <h1 className="text-4xl sm:text-6xl font-black text-foreground mt-3 mb-5 leading-[1.05]">
              One team.<br />
              <span className="text-primary">Everything your business needs.</span>
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              We're not a marketplace or an agency farm. We're a small, focused Hawaii-based team that builds websites, systems, brands, and marketing for local businesses — and we do the work ourselves.
            </p>
          </motion.div>

          {/* Quick nav pills */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-wrap justify-center gap-2.5 mt-10"
          >
            {SERVICES.map((s) => {
              const Icon = s.icon;
              return (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  data-testid={`link-service-nav-${s.id}`}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card text-muted-foreground text-xs font-semibold hover:border-primary/40 hover:text-foreground transition-all"
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: s.accent }} />
                  {s.label}
                </a>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Service deep-dives ── */}
      <div className="bg-background">
        {SERVICES.map((svc, i) => (
          <ServiceSection key={svc.id} svc={svc} index={i} />
        ))}
      </div>

      {/* ── FAQ ── */}
      <section className="bg-muted/20 py-20 border-t border-border/40">
        <div className="max-w-3xl mx-auto px-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-primary text-xs font-bold uppercase tracking-[0.2em]">Common questions</span>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground mt-3">
              Good questions. Straight answers.
            </h2>
          </motion.div>
          <div className="bg-card border border-border rounded-2xl px-6 sm:px-8">
            {FAQS.map((f) => (
              <FAQItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="bg-background py-20 border-t border-border/40">
        <div className="max-w-2xl mx-auto px-5 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-black text-foreground mb-4">
              Not sure where to start?
            </h2>
            <p className="text-muted-foreground text-base mb-8 leading-relaxed">
              Book a free 20-minute call. We'll listen, ask where your business hurts, and tell you honestly what would move the needle — even if it's nothing we sell.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/contact"
                data-testid="link-services-cta-contact"
                className="inline-flex items-center gap-2 bg-primary text-white font-black px-8 py-4 rounded-xl text-base hover:opacity-90 transition-opacity"
              >
                Book a free call <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="tel:+18087675460"
                data-testid="link-services-cta-phone"
                className="inline-flex items-center gap-2 border border-border text-muted-foreground font-semibold px-6 py-4 rounded-xl text-sm hover:border-foreground/30 hover:text-foreground transition-all"
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
