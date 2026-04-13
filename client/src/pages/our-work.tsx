import { motion } from "framer-motion";
import Layout from "@/components/layout";
import { ExternalLink } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

const PROJECTS = [
  {
    url: "melcastanares.techsavvyhawaii.com",
    label: "Mel Castanares",
    sub: "Real Estate Agent — O'ahu",
    tag: "CRM + Website",
    accent: "#10b981",
    description: "Custom real estate CRM with lead tracking, client communication tools, and a branded public-facing site. Fully managed and hosted.",
    features: ["Lead management", "Client portal", "Listing showcase", "Contact forms"],
  },
  {
    url: "808allpurposecleaners.vercel.app",
    label: "808 All Purpose Cleaners",
    sub: "Cleaning Services — Honolulu",
    tag: "Website",
    accent: "#38bdf8",
    description: "Clean, conversion-focused service website with online booking, service area info, and a professional brand identity.",
    features: ["Online booking", "Service pages", "Mobile-first", "Local SEO"],
  },
  {
    url: "drestastysoutherncuisine.vercel.app",
    label: "Dr. E's Tasty Southern Cuisine",
    sub: "Restaurant — Honolulu",
    tag: "Restaurant Website",
    accent: "#f97316",
    description: "Bold, appetizing restaurant site with full menu display, hours, location, and a strong social media presence integration.",
    features: ["Menu display", "Location + hours", "Photo gallery", "Social integration"],
  },
  {
    url: "retentionanalyzer.gorjess.co",
    label: "Retention Analyzer",
    sub: "Business Intelligence Tool",
    tag: "Web App",
    accent: "#a855f7",
    description: "AI-powered customer retention analysis tool. Helps businesses identify churn risk, track loyalty trends, and act on data-driven insights.",
    features: ["Churn prediction", "Retention metrics", "AI insights", "Dashboard"],
  },
  {
    url: "gorjess.co",
    label: "GorJess",
    sub: "Creative Agency — Hawaii",
    tag: "Agency Website",
    accent: "#ec4899",
    description: "Sleek creative agency site showcasing branding, web design, and digital marketing services. Built to convert visitors into clients.",
    features: ["Portfolio showcase", "Service pages", "Brand identity", "Lead capture"],
  },
  {
    url: "allin1bonding.vercel.app",
    label: "All In 1 Bonding",
    sub: "Bail Bonds — Hawaii",
    tag: "Website",
    accent: "#f59e0b",
    description: "Fast, trust-building website for a Hawaii bail bond service. Clear CTAs, 24/7 availability messaging, and mobile-optimized for urgent situations.",
    features: ["24/7 contact", "Fast load times", "Mobile-first", "Trust signals"],
  },
  {
    url: "street-patrol.vercel.app",
    label: "Street Patrol",
    sub: "Security Services — Hawaii",
    tag: "Website",
    accent: "#3b82f6",
    description: "Professional security services website with service area maps, coverage options, and direct inquiry forms for commercial clients.",
    features: ["Service areas", "Coverage plans", "Contact forms", "Professional design"],
  },
  {
    url: "sonsauto.vercel.app",
    label: "Son's Auto",
    sub: "Auto Services — Hawaii",
    tag: "Website",
    accent: "#ef4444",
    description: "Bold auto services website with service listings, appointment requests, and a strong local brand presence for Hawaii car owners.",
    features: ["Service menu", "Appointment requests", "Local branding", "Mobile-ready"],
  },
  {
    url: "oahu-tours.vercel.app",
    label: "Oahu Tours",
    sub: "Tours & Activities — O'ahu",
    tag: "Tourism Website",
    accent: "#14b8a6",
    description: "Vibrant tour company site showcasing O'ahu experiences with tour listings, photo galleries, and easy booking prompts for visitors.",
    features: ["Tour listings", "Photo gallery", "Booking CTA", "SEO-optimized"],
  },
  {
    url: "martin-law.vercel.app",
    label: "Martin Law",
    sub: "Law Firm — Hawaii",
    tag: "Law Firm Website",
    accent: "#6366f1",
    description: "Clean, authoritative law firm website with practice area pages, attorney profiles, and consultation request forms built for trust and conversion.",
    features: ["Practice areas", "Attorney profiles", "Consultation form", "Professional design"],
  },
];

function ProjectCard({ project, index }: { project: typeof PROJECTS[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative bg-white/[0.03] border border-white/8 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300"
      style={{ boxShadow: "0 4px 40px rgba(0,0,0,0.3)" }}
    >
      {/* Browser chrome */}
      <div className="bg-[#0d0f18] border-b border-white/[0.06] px-4 py-3 flex items-center gap-3">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        </div>
        <div className="flex-1 bg-white/5 rounded-md px-3 py-1 text-[11px] text-white/30 font-mono truncate">
          {project.url}
        </div>
        <a
          href={`https://${project.url}`}
          target="_blank"
          rel="noopener noreferrer"
          data-testid={`link-project-${index}`}
          className="text-white/20 hover:text-primary transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Preview iframe */}
      <div className="relative overflow-hidden bg-white" style={{ height: "240px" }}>
        <iframe
          src={`https://${project.url}`}
          title={project.label}
          loading="lazy"
          className="border-0 bg-white"
          style={{
            width: "166.67%",
            height: "166.67%",
            transform: "scale(0.6)",
            transformOrigin: "top left",
            pointerEvents: "none",
          }}
        />
        <a
          href={`https://${project.url}`}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-10 flex items-end justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)" }}
        >
          <span
            className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg"
            style={{ background: project.accent, color: "#fff" }}
          >
            Visit site <ExternalLink className="w-3 h-3" />
          </span>
        </a>
      </div>

      {/* Info */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <span
              className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full mb-2 inline-block"
              style={{ background: project.accent + "20", color: project.accent, border: `1px solid ${project.accent}40` }}
            >
              {project.tag}
            </span>
            <h3 className="text-white font-black text-lg leading-tight">{project.label}</h3>
            <p className="text-white/40 text-xs mt-0.5">{project.sub}</p>
          </div>
        </div>

        <p className="text-white/60 text-sm leading-relaxed mb-4">{project.description}</p>

        <div className="flex flex-wrap gap-2">
          {project.features.map((f) => (
            <span
              key={f}
              className="text-[10px] font-semibold text-white/40 bg-white/5 border border-white/8 px-2.5 py-1 rounded-full"
            >
              {f}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function OurWorkPage() {
  useSEO({
    title: "Our Work — Real Websites & CRMs Built for Hawaii Businesses | TechSavvy Hawaii",
    description: "See live websites and custom CRMs built for Hawaii restaurants, realtors, and service businesses by TechSavvy Hawaii. Real work, real clients, real results — not templates or mockups.",
    keywords: "Hawaii web design portfolio, custom website examples Hawaii, CRM Hawaii examples, restaurant website Hawaii, realtor website Honolulu, TechSavvy Hawaii portfolio, website design Oahu, small business website Hawaii",
    canonical: "https://techsavvyhawaii.com/our-work",
    ogImage: "https://techsavvyhawaii.com/images/hero-hawaii-sunset.jpg",
    ogTitle: "Our Work — Real Websites & CRMs Built for Hawaii | TechSavvy Hawaii",
    ogDescription: "Live sites and custom CRMs we've built for Hawaii restaurants, realtors, and service businesses. Not mockups — real work, real results.",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": "https://techsavvyhawaii.com/our-work#webpage",
        "name": "Our Work — Websites & CRMs Built for Hawaii Businesses | TechSavvy Hawaii",
        "url": "https://techsavvyhawaii.com/our-work",
        "isPartOf": { "@id": "https://techsavvyhawaii.com/#website" },
        "about": { "@id": "https://techsavvyhawaii.com/#organization" },
        "description": "Real websites and CRM systems built for Hawaii businesses by TechSavvy Hawaii — restaurants, realtors, service companies, and more.",
        "speakable": {
          "@type": "SpeakableSpecification",
          "cssSelector": ["h1", "h2"]
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "TechSavvy Hawaii Portfolio",
        "description": "Live websites and CRM systems built for Hawaii businesses",
        "url": "https://techsavvyhawaii.com/our-work",
        "numberOfItems": 10,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Mel Castanares — Realtor Website & CRM",
            "url": "https://melcastanares.techsavvyhawaii.com",
            "description": "Custom real estate website and CRM for a top Honolulu realtor."
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Dr. E's Tasty Southern Cuisine — Restaurant Website",
            "url": "https://drestastysoutherncuisine.vercel.app",
            "description": "Custom restaurant website for a Hawaii-based Southern cuisine spot."
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "808 All Purpose Cleaners — Cleaning Services Website",
            "url": "https://808allpurposecleaners.vercel.app",
            "description": "Conversion-focused website for a Honolulu cleaning company."
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": "Retention Analyzer — Business Intelligence Web App",
            "url": "https://retentionanalyzer.gorjess.co",
            "description": "AI-powered customer retention and churn analysis tool."
          },
          {
            "@type": "ListItem",
            "position": 5,
            "name": "GorJess — Creative Agency Website",
            "url": "https://gorjess.co",
            "description": "Creative agency site for branding, web design, and digital marketing services."
          },
          {
            "@type": "ListItem",
            "position": 6,
            "name": "All In 1 Bonding — Bail Bonds Website",
            "url": "https://allin1bonding.vercel.app",
            "description": "Fast, trust-building bail bond service website for Hawaii clients."
          },
          {
            "@type": "ListItem",
            "position": 7,
            "name": "Street Patrol — Security Services Website",
            "url": "https://street-patrol.vercel.app",
            "description": "Professional security services site for a Hawaii patrol company."
          },
          {
            "@type": "ListItem",
            "position": 8,
            "name": "Son's Auto — Auto Services Website",
            "url": "https://sonsauto.vercel.app",
            "description": "Bold auto services website for Hawaii car owners."
          },
          {
            "@type": "ListItem",
            "position": 9,
            "name": "Oahu Tours — Tourism & Activities Website",
            "url": "https://oahu-tours.vercel.app",
            "description": "Vibrant tour company website showcasing O'ahu experiences."
          },
          {
            "@type": "ListItem",
            "position": 10,
            "name": "Martin Law — Law Firm Website",
            "url": "https://martin-law.vercel.app",
            "description": "Clean, authoritative law firm website built for trust and conversion."
          }
        ]
      }
    ],
  });

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-[#060810] pt-28 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/8 rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-5 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-primary text-xs font-bold uppercase tracking-[0.2em]">
              Portfolio
            </span>
            <h1 className="text-4xl sm:text-6xl font-black text-white mt-3 mb-4 leading-[1.05]">
              Real sites.<br />
              <span className="text-primary">Real businesses.</span>
            </h1>
            <p className="text-white/50 text-base max-w-md mx-auto">
              Every site here is live, built by our team, and actively serving customers. Not a single stock photo or template in the bunch.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex justify-center gap-8 sm:gap-16 mt-10"
          >
            {[
              { n: "20+", label: "Sites Launched" },
              { n: "9+", label: "Industries" },
              { n: "7 days", label: "Avg Launch Time" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl sm:text-3xl font-black text-white">{s.n}</p>
                <p className="text-white/40 text-xs uppercase tracking-widest mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Projects grid */}
      <section className="bg-[#060810] pb-24">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {PROJECTS.map((p, i) => (
              <ProjectCard key={p.url} project={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#07090f] py-20 border-t border-white/5">
        <div className="max-w-2xl mx-auto px-5 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Want yours next?
            </h2>
            <p className="text-white/50 text-base mb-8">
              We build fast, stay on, and charge you nothing for payment processing. Most sites go live in under a week.
            </p>
            <a
              href="/apply"
              data-testid="link-our-work-apply"
              className="inline-flex items-center gap-2 bg-primary text-white font-black px-8 py-4 rounded-xl text-base hover:opacity-90 transition-opacity"
            >
              Get started free →
            </a>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
