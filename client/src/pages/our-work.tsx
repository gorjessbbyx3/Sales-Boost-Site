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
    url: "poormantowing.com",
    label: "Poorman Towing",
    sub: "Towing & Recovery — O'ahu",
    tag: "Service Business",
    accent: "#f59e0b",
    description: "24/7 towing service site built for lead generation. Fast load, click-to-call CTAs, and clear service area coverage.",
    features: ["Click-to-call", "24/7 messaging", "Service area map", "Fast load"],
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
    title: "Our Work — TechSavvy Hawaii",
    description: "Real websites and CRMs we've built for Hawaii businesses. Not mockups — live, working sites for restaurants, realtors, service businesses, and more.",
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
              { n: "15+", label: "Sites Launched" },
              { n: "5", label: "Industries" },
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
