import { Button } from "@/components/ui/button";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Phone,
  MapPin,
  ChevronDown,
  ExternalLink,
  Check,
  Globe,
  Users,
  Palette,
  CreditCard,
  Megaphone,
  Mail,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Layout from "@/components/layout";
import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import logoImg from "@assets/IMG_6366.jpeg";
import techSavvyLogoImg from "@assets/IMG_6386.jpeg";
import paymentImg from "@assets/IMG_6470.jpeg";
import soundFamiliarImg from "@assets/IMG_6407_1775959425123.jpeg";
import hiw1Img from "@assets/1B14A086-2642-4916-8C70-3AE1B7162168_1775737253686.png";
import hiw2Img from "@assets/EAB85ACC-FCBA-44CC-A7B3-DEB15B59D196_1775737505329.png";
import hiw3Img from "@assets/IMG_6952_1775737505329.png";

import POSReceiptShowcase from "@/components/pos-receipt-showcase";

// ─── Animated counter ──────────────────────────────────────────────────────
function AnimatedCounter({
  target,
  prefix = "",
  suffix = "",
  duration = 2,
}: {
  target: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView || !ref.current) return;
    let start: number;
    let id: number;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / (duration * 1000), 1);
      const v = Math.round((1 - Math.pow(1 - p, 3)) * target);
      if (ref.current)
        ref.current.textContent = `${prefix}${v.toLocaleString()}${suffix}`;
      if (p < 1) id = requestAnimationFrame(step);
    };
    id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [inView, target, prefix, suffix, duration]);
  return (
    <span ref={ref}>
      {prefix}0{suffix}
    </span>
  );
}

// ─── FAQ item ──────────────────────────────────────────────────────────────
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border-b border-white/10 last:border-0"
      onClick={() => setOpen((o) => !o)}
    >
      <button className="w-full flex items-center justify-between gap-4 py-5 text-left">
        <span className="font-semibold text-white text-sm sm:text-base">{q}</span>
        <ChevronDown
          className={`w-5 h-5 text-primary flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${open ? "max-h-48 pb-5" : "max-h-0"}`}
      >
        <p className="text-white/60 text-sm leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

// ─── Browser frame component ────────────────────────────────────────────────
function BrowserFrame({
  url,
  label,
  tag,
  accent,
  delay = 0,
}: {
  url: string;
  label: string;
  tag: string;
  accent: string;
  delay?: number;
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const displayUrl = url.replace(/^https?:\/\//, "");

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      className="flex flex-col rounded-2xl overflow-hidden border border-white/10 bg-[#0d0f18] shadow-2xl shadow-black/40 group"
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[#151821] border-b border-white/10 flex-shrink-0">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
        </div>
        <div className="flex-1 mx-2">
          <div className="flex items-center gap-1.5 bg-[#0d0f18] border border-white/10 rounded-md px-3 py-1 min-w-0">
            <Globe className="w-3 h-3 text-white/30 flex-shrink-0" />
            <span className="text-white/40 text-xs truncate">{displayUrl}</span>
          </div>
        </div>
        <a
          href={`https://${displayUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-6 h-6 rounded flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors flex-shrink-0"
          data-testid={`link-frame-${label.toLowerCase().replace(/\s/g, "-")}`}
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink className="w-3 h-3 text-white/40" />
        </a>
      </div>

      {/* Tag + name strip */}
      <div className="flex items-center gap-2 px-4 py-2 bg-[#0d0f18] border-b border-white/[0.06]">
        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${accent} text-white`}>
          {tag}
        </span>
        <span className="text-white/60 text-xs font-medium">{label}</span>
      </div>

      {/* iframe area */}
      <div className="relative w-full" style={{ height: "320px" }}>
        {!failed ? (
          <>
            {!loaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0d0f18] z-10">
                <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                <span className="text-white/30 text-xs">Loading preview…</span>
              </div>
            )}
            <iframe
              src={`https://${displayUrl}`}
              title={label}
              loading="lazy"
              onLoad={() => setLoaded(true)}
              onError={() => setFailed(true)}
              className="w-full h-full border-0 bg-white"
              style={{
                transformOrigin: "top left",
                transform: "scale(0.6)",
                width: "166.67%",
                height: "166.67%",
                pointerEvents: "none",
              }}
            />
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0d0f18]">
            <Globe className="w-8 h-8 text-white/20" />
            <p className="text-white/40 text-xs text-center px-4">
              Preview restricted by browser policy
            </p>
            <a
              href={`https://${displayUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary text-xs font-semibold hover:underline flex items-center gap-1"
            >
              Open site <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>

      {/* Visit button */}
      <div className="px-4 py-3 bg-[#151821] border-t border-white/10 flex items-center justify-between">
        <span className="text-white/30 text-xs">Built by TechSavvy Hawaii</span>
        <a
          href={`https://${displayUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-primary text-xs font-semibold hover:text-primary/80 transition-colors"
        >
          Visit site <ArrowRight className="w-3 h-3" />
        </a>
      </div>
    </motion.div>
  );
}

// ─── Services Tabbed Spotlight ───────────────────────────────────────────────
function ServicesTabs({ services }: { services: any[] }) {
  const [active, setActive] = useState(0);
  const s = services[active];
  const Icon = s.icon;

  return (
    <section className="py-14 sm:py-20 bg-[#07090f]">
      <div className="max-w-5xl mx-auto px-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 sm:mb-10"
        >
          <span className="text-primary text-xs font-bold uppercase tracking-widest">
            What your business gets
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white mt-2 leading-tight">
            One team. Everything you need.
          </h2>
        </motion.div>

        {/* ── Mobile: horizontal scroll tabs + detail card ── */}
        <div className="sm:hidden">
          <div className="flex gap-2 overflow-x-auto pb-3 -mx-5 px-5 scrollbar-none">
            {services.map((item, i) => {
              const TabIcon = item.icon;
              const isActive = i === active;
              return (
                <button
                  key={item.title}
                  onClick={() => setActive(i)}
                  className={`flex-shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm transition-all ${
                    isActive
                      ? "border-white/15 bg-white/[0.08] text-white font-semibold"
                      : "border-transparent bg-white/[0.04] text-white/50"
                  }`}
                >
                  <TabIcon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: isActive ? item.accent : undefined }} />
                  {item.title}
                </button>
              );
            })}
          </div>
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4 rounded-2xl border border-white/[0.08] p-6 flex flex-col gap-5"
            style={{ background: `linear-gradient(135deg, ${s.accent}0d 0%, #07090f 60%)` }}
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: `${s.accent}22` }}>
                <Icon className="w-5 h-5" style={{ color: s.accent }} />
              </div>
              <div>
                <h3 className="font-black text-white text-lg leading-tight">{s.title}</h3>
                <p className="text-white/40 text-xs">{s.tagline}</p>
              </div>
            </div>
            <p className="text-white/65 text-sm leading-relaxed">{s.description}</p>
            <div className="grid grid-cols-2 gap-2">
              {s.features.map((f: string) => (
                <div key={f} className="flex items-start gap-1.5 text-xs text-white/50">
                  <Check className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: s.accent }} />
                  {f}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-white/[0.07]">
              <a
                href="/contact"
                className="inline-flex items-center gap-2 font-bold px-5 py-2.5 rounded-xl text-sm text-[#07090f]"
                style={{ background: s.accent }}
              >
                Get started <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <span className="text-white/25 text-xs">No commitment required</span>
            </div>
          </motion.div>
        </div>

        {/* ── Desktop: left tab list + right detail panel ── */}
        <div className="hidden sm:grid grid-cols-5 gap-5 min-h-[420px]">
          <div className="col-span-2 flex flex-col gap-1.5">
            {services.map((item, i) => {
              const TabIcon = item.icon;
              const isActive = i === active;
              return (
                <button
                  key={item.title}
                  onClick={() => setActive(i)}
                  className={`w-full text-left flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 border ${
                    isActive
                      ? "bg-white/[0.07] border-white/15 shadow-lg"
                      : "bg-transparent border-transparent hover:bg-white/[0.04]"
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
                    style={{ background: isActive ? `${item.accent}22` : "rgba(255,255,255,0.05)" }}
                  >
                    <TabIcon
                      className="w-4 h-4 transition-colors"
                      style={{ color: isActive ? item.accent : "rgba(255,255,255,0.35)" }}
                    />
                  </div>
                  <p className={`text-sm font-semibold leading-tight truncate transition-colors ${isActive ? "text-white" : "text-white/50"}`}>
                    {item.title}
                  </p>
                  {isActive && (
                    <div className="ml-auto w-1 h-6 rounded-full flex-shrink-0" style={{ background: s.accent, opacity: 0.8 }} />
                  )}
                </button>
              );
            })}
          </div>

          <motion.div
            key={active}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.22 }}
            className="col-span-3 rounded-2xl border border-white/[0.08] p-7 flex flex-col justify-between"
            style={{ background: `linear-gradient(135deg, ${s.accent}0d 0%, #07090f 60%)` }}
          >
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${s.accent}22` }}>
                  <Icon className="w-6 h-6" style={{ color: s.accent }} />
                </div>
                <div>
                  <h3 className="font-black text-white text-xl leading-tight">{s.title}</h3>
                  <p className="text-white/40 text-xs">{s.tagline}</p>
                </div>
              </div>
              <p className="text-white/65 text-sm leading-relaxed mb-6">{s.description}</p>
              <div className="grid grid-cols-2 gap-2">
                {s.features.map((f: string) => (
                  <div key={f} className="flex items-start gap-2 text-xs text-white/50">
                    <Check className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: s.accent }} />
                    {f}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 flex items-center gap-3 pt-5 border-t border-white/[0.07]">
              <a
                href="/contact"
                className="inline-flex items-center gap-2 font-bold px-5 py-2.5 rounded-xl text-sm text-[#07090f] hover:opacity-90 transition-opacity"
                style={{ background: s.accent }}
              >
                Get started <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <span className="text-white/25 text-xs">No commitment required</span>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 flex justify-center"
        >
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-7 py-3 rounded-xl text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
          >
            Book a free 20-min call <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function HawaiiPage() {
  useSEO({
    title: "TechSavvy Hawaii — Websites, CRMs, Branding & Zero-Fee Payment Processing | Honolulu",
    description:
      "Honolulu's full-service business tech team. Custom websites, CRMs, brand identities, video content, ad funnels, and zero-fee payment processing — one local team, one number, no mainland runaround.",
    keywords:
      "TechSavvy Hawaii, Honolulu web design, custom website Hawaii, CRM Hawaii, branding Hawaii, video marketing Hawaii, ad funnels Hawaii, zero-fee payment processing Hawaii, local tech company Honolulu, business technology Oahu, small business website Hawaii, Hawaii business partner",
    canonical: "https://techsavvyhawaii.com/",
  });

  const services = [
    {
      icon: Globe, title: "Custom Websites", sub: "Built from scratch. Fast. Yours.",
      tagline: "Built from scratch. Fast. Yours.",
      description: "We design and build fully custom websites — no templates, no page builders. Your brand, your flow, your content. Most sites go live within 7 days.",
      features: ["Mobile-first design", "SEO-optimized from day one", "CMS or static — your choice", "Hosting & support included"],
      accent: "#22c55e",
    },
    {
      icon: Users, title: "CRM Systems", sub: "Your workflow, not someone else's.",
      tagline: "Your workflow, not someone else's.",
      description: "A CRM that fits how your team actually works — not a generic tool you have to bend to fit. We build around your process: leads, follow-ups, pipelines, automations.",
      features: ["Custom pipelines", "Auto follow-up sequences", "Lead capture integrations", "Team dashboards"],
      accent: "#38bdf8",
    },
    {
      icon: Palette, title: "Brand & Design", sub: "Logos, print, social content — in-house.",
      tagline: "Logos, print, social content — in-house.",
      description: "Full brand identity from strategy to print. Logo, color palette, typography, business cards, social templates, and ongoing content creation — one team handles it all.",
      features: ["Logo & brand identity", "Business cards & print", "Social media templates", "Ongoing content creation"],
      accent: "#a78bfa",
    },
    {
      icon: CreditCard, title: "Zero-Fee Processing", sub: "Keep every dollar you earn.",
      tagline: "Keep every dollar you earn.",
      description: "We pass processing fees to the card brands — not you. Most of our merchants save $300–$800/month the day they switch. Free terminal hardware included.",
      features: ["$0 per transaction", "Free terminal hardware", "Next-day deposits", "High-risk approved"],
      accent: "#22c55e",
    },
    {
      icon: Megaphone, title: "Ad Funnels", sub: "Meta ads, landing pages, real leads.",
      tagline: "Meta ads, landing pages, real leads.",
      description: "We run paid ads that actually convert — Meta, Google, TikTok. Full funnel: ad creative, landing page, email capture, and follow-up sequence. We track every dollar.",
      features: ["Meta & Google ads", "AI-generated ad creative", "Landing page design", "ROI reporting"],
      accent: "#fb923c",
    },
    {
      icon: Mail, title: "Email Deliverability", sub: "Stop landing in spam. Period.",
      tagline: "Stop landing in spam. Period.",
      description: "DNS setup, DKIM, DMARC, SPF — we fix the technical side so your emails land in inboxes. Then we build the sequences that get opened, clicked, and replied to.",
      features: ["Domain authentication (SPF/DKIM/DMARC)", "Inbox placement testing", "Drip sequences", "Open & click tracking"],
      accent: "#fb7185",
    },
  ];

  const steps = [
    {
      n: "01",
      title: "20-minute call",
      body: "No pitch. We listen, ask where your business hurts, and tell you honestly if we can help.",
      img: hiw1Img,
      imgAlt: "TechSavvy team member on the phone",
    },
    {
      n: "02",
      title: "Plain-English plan",
      body: "What we'd build, the order, what it costs, what it won't do. You decide.",
      img: hiw2Img,
      imgAlt: "TechSavvy building a website for a local business",
    },
    {
      n: "03",
      title: "We build. We stay.",
      body: "Most builds ship in days. Then we stick around — not a ticket queue. A real team you can text.",
      img: hiw3Img,
      imgAlt: "TechSavvy rep meeting a local business owner",
    },
  ];

  const webframes = [
    {
      url: "melcastanares.techsavvyhawaii.com",
      label: "Mel Castanares — Realtor",
      tag: "Real Estate CRM",
      accent: "bg-emerald-600",
    },
    {
      url: "drestastysoutherncuisine.vercel.app",
      label: "Dr. E's Tasty Southern Cuisine",
      tag: "Restaurant",
      accent: "bg-orange-600",
    },
  ];

  return (
    <Layout>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#060810]">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          src="/images/hero-video-v3.mp4"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#060810]/50 via-[#060810]/30 to-[#060810]" />

        <div className="relative z-10 max-w-7xl mx-auto px-5 pt-24 pb-12 sm:pt-32 sm:pb-14 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* ── Left column ── */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 mb-6"
            >
              <MapPin className="w-3 h-3 text-primary" />
              <span className="text-xs text-primary font-medium">
                Built in Honolulu · Serving all islands
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight leading-[1.04] text-white mb-6"
            >
              We're the team your{" "}
              business hires{" "}
              <span className="text-primary italic">when it's done</span>{" "}
              being small.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-base sm:text-lg text-white/70 max-w-xl leading-relaxed mb-8"
            >
              Websites. CRMs. Branding. Ad funnels. Email that lands. Zero-fee
              processing. One Honolulu team. One number. No mainland runaround.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="flex flex-col sm:flex-row gap-3 mb-8"
            >
              <Button
                size="lg"
                className="text-base font-bold px-8 py-6 rounded-xl shadow-lg shadow-primary/30"
                asChild
              >
                <a href="/contact" data-testid="button-hero-cta">
                  Book a free 20-min call
                  <ArrowRight className="w-4 h-4" />
                </a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-base px-8 py-6 rounded-xl border-white/20 text-white hover:bg-white/10"
                asChild
              >
                <a href="tel:8087675460" data-testid="button-hero-phone">
                  <Phone className="w-4 h-4" />
                  (808) 767-5460
                </a>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-wrap gap-x-6 gap-y-2"
            >
              {[
                "No pitch. No pressure.",
                "Local team, not mainland",
                "Ships in days, not quarters",
              ].map((t) => (
                <div key={t} className="flex items-center gap-1.5 text-xs text-white/50">
                  <Check className="w-3 h-3 text-primary" />
                  {t}
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Right column — Bento service grid ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
            className="hidden lg:block"
          >
            <div className="grid grid-cols-6 grid-rows-[160px_160px_auto] gap-2.5">

              {/* Websites — wide top */}
              <div className="col-span-4 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-emerald-900/35 to-[#060810] p-5 flex flex-col justify-between hover:border-emerald-500/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                    <Globe className="w-4.5 h-4.5 text-emerald-400" />
                  </div>
                  <span className="text-[10px] text-white/20 font-mono">01</span>
                </div>
                <div>
                  <h3 className="font-black text-white text-lg mb-0.5">Custom Websites</h3>
                  <p className="text-white/40 text-xs">Built from scratch. Live in 7 days — not months.</p>
                </div>
              </div>

              {/* Zero-Fee — tall right */}
              <div className="col-span-2 row-span-2 rounded-2xl border border-white/[0.08] bg-gradient-to-b from-primary/15 to-[#060810] p-5 flex flex-col justify-between hover:border-primary/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
                    <CreditCard className="w-4.5 h-4.5 text-primary" />
                  </div>
                  <span className="text-[10px] text-white/20 font-mono">04</span>
                </div>
                <div>
                  <h3 className="font-black text-white text-base mb-1.5">Zero-Fee Processing</h3>
                  <p className="text-white/40 text-[11px] mb-3">Keep every dollar. We pass fees to the card brands — not you.</p>
                  <div className="space-y-1.5">
                    {["No monthly fees", "Next-day deposits", "Free terminal"].map((f) => (
                      <div key={f} className="flex items-center gap-1.5 text-[11px] text-white/50">
                        <Check className="w-3 h-3 text-primary" />{f}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* CRM */}
              <div className="col-span-2 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 flex flex-col justify-between hover:border-sky-500/30 hover:bg-sky-900/10 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-sky-500/15 flex items-center justify-center">
                  <Users className="w-4 h-4 text-sky-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm mb-0.5">CRM Systems</h3>
                  <p className="text-white/35 text-xs">Your workflow, not someone else's.</p>
                </div>
              </div>

              {/* Brand */}
              <div className="col-span-2 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 flex flex-col justify-between hover:border-violet-500/30 hover:bg-violet-900/10 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center">
                  <Palette className="w-4 h-4 text-violet-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm mb-0.5">Brand & Design</h3>
                  <p className="text-white/35 text-xs">Logos, print, social content.</p>
                </div>
              </div>

              {/* Ad Funnels */}
              <div className="col-span-3 rounded-2xl border border-white/[0.08] bg-gradient-to-r from-orange-900/20 to-[#060810] p-4 flex items-center gap-3 hover:border-orange-500/30 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-orange-500/15 flex items-center justify-center flex-shrink-0">
                  <Megaphone className="w-4.5 h-4.5 text-orange-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm mb-0.5">Ad Funnels</h3>
                  <p className="text-white/40 text-xs">Meta · Google · TikTok ads that convert.</p>
                </div>
              </div>

              {/* Email */}
              <div className="col-span-3 rounded-2xl border border-white/[0.08] bg-gradient-to-r from-rose-900/20 to-[#060810] p-4 flex items-center gap-3 hover:border-rose-500/30 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-rose-500/15 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4.5 h-4.5 text-rose-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm mb-0.5">Email Deliverability</h3>
                  <p className="text-white/40 text-xs">Stop landing in spam. Period.</p>
                </div>
              </div>

            </div>
          </motion.div>
        </div>

      </section>

      {/* ── SERVICES ─────────────────────────────────────────────────────── */}
      <ServicesTabs services={services} />

      {/* ── LIVE WEBSITE SHOWCASE ─────────────────────────────────────────── */}
      <section className="py-14 sm:py-24 bg-[#060810]">
        <div className="max-w-6xl mx-auto px-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
          >
            <div>
              <span className="text-primary text-xs font-bold uppercase tracking-widest">
                Live sites we've shipped
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white mt-2 leading-tight">
                Real businesses. Live right now.
              </h2>
              <p className="text-white/40 text-sm mt-2">
                Not mockups. Not demos. Click to visit.
              </p>
            </div>
            <Link href="/our-work" className="inline-flex items-center gap-2 text-sm font-bold text-primary border border-primary/30 rounded-xl px-5 py-2.5 hover:bg-primary/10 transition-colors whitespace-nowrap">
              See all our work →
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {webframes.map((f, i) => (
              <BrowserFrame
                key={f.url}
                url={f.url}
                label={f.label}
                tag={f.tag}
                accent={f.accent}
                delay={i * 0.12}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── SOCIAL MEDIA & VIDEO MARKETING ──────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-[#060810] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-5">

          {/* Header — minimal, punchy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <span className="text-primary text-xs font-bold uppercase tracking-[0.2em]">
              In-house production
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white mt-3 mb-4 leading-[1.1]">
              Content that makes them{" "}
              <span className="text-primary italic">stop.</span>
            </h2>
            <p className="text-white/40 text-base max-w-sm mx-auto">
              Shot, edited, and posted by our team. No stock. No templates.
            </p>
          </motion.div>

          {/* Video — full width, custom player */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl mb-10 group"
            style={{ boxShadow: "0 0 80px rgba(0,255,170,0.06), 0 30px 60px rgba(0,0,0,0.6)" }}
          >
            <video
              id="showreel-video"
              src="/videos/showreel-v3.mp4"
              poster="/images/showreel-poster.png"
              playsInline
              controls
              preload="metadata"
              className="w-full block"
              style={{ maxHeight: "520px", objectFit: "cover" }}
            />
            {/* Play button overlay — fades out when controls appear */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none group-has-[video:not([controls])]:opacity-0"
              aria-hidden="true"
            >
              <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-0 transition-opacity" />
            </div>
          </motion.div>

          {/* Single CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center mt-10"
          >
            <Button
              size="lg"
              className="font-bold px-10 py-5 rounded-xl text-base shadow-lg shadow-primary/30"
              asChild
            >
              <a href="/contact" data-testid="button-video-cta">
                Book a free 20-min call
                <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
            <p className="text-white/25 text-xs mt-4">Realtors · Restaurants · Local brands</p>
          </motion.div>

        </div>
      </section>

      {/* ── SOUND FAMILIAR ────────────────────────────────────────────────── */}
      <section className="bg-[#060810] pb-0">
        <div className="max-w-5xl mx-auto px-5 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
          >
            {/* Mobile: image full-width at natural ratio, text below */}
            <div className="lg:hidden flex flex-col bg-gradient-to-b from-[#0d1220] to-[#060810]">
              <img
                src={soundFamiliarImg}
                alt="Business owner losing money on processing fees"
                className="w-full h-auto object-contain"
              />
              <div className="px-6 py-6">
                <p className="text-white/60 text-xs uppercase tracking-widest mb-2">
                  Sound familiar?
                </p>
                <p className="text-white font-black text-2xl leading-tight">
                  Watching 4% disappear every single swipe.
                </p>
                <p className="text-primary font-bold text-sm mt-2">
                  That ends when you call us. →
                </p>
              </div>
            </div>

            {/* Desktop: side-by-side split — no cropping */}
            <div className="hidden lg:grid lg:grid-cols-2 min-h-[300px]">
              <div className="bg-gradient-to-br from-[#0d1220] to-[#060810] p-10 flex flex-col justify-center">
                <p className="text-white/50 text-xs uppercase tracking-widest mb-3">
                  Sound familiar?
                </p>
                <p className="text-white font-black text-3xl xl:text-4xl leading-tight mb-4">
                  Watching 4% disappear<br />every single swipe.
                </p>
                <p className="text-primary font-bold text-sm">
                  That ends when you call us. →
                </p>
              </div>
              <div className="relative overflow-hidden">
                <img
                  src={soundFamiliarImg}
                  alt="Business owner losing money on processing fees"
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#0d1220]/40" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── COMPETITOR FEE TICKER ─────────────────────────────────────────── */}
      <style>{`
        @keyframes fee-ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .fee-ticker-track {
          display: flex;
          width: max-content;
          animation: fee-ticker 36s linear infinite;
        }
        .fee-ticker-track:hover {
          animation-play-state: paused;
        }
      `}</style>
      <section className="bg-[#060810] border-y border-white/[0.07] py-4 overflow-hidden">
        <div className="flex overflow-hidden select-none">
          <div className="fee-ticker-track">
            {[
              { processor: "Square",        amount: "$3,100", note: "avg merchant" },
              { processor: "Clover",        amount: "$3,400", note: "avg merchant" },
              { processor: "Toast",         amount: "$4,500", note: "avg restaurant" },
              { processor: "Stripe",        amount: "$3,500", note: "avg merchant" },
              { processor: "Wix Payments",  amount: "$3,500", note: "avg merchant" },
              { processor: "PayPal",        amount: "$4,200", note: "avg merchant" },
              { processor: "Square",        amount: "$3,100", note: "avg merchant" },
              { processor: "Clover",        amount: "$3,400", note: "avg merchant" },
              { processor: "Toast",         amount: "$4,500", note: "avg restaurant" },
              { processor: "Stripe",        amount: "$3,500", note: "avg merchant" },
              { processor: "Wix Payments",  amount: "$3,500", note: "avg merchant" },
              { processor: "PayPal",        amount: "$4,200", note: "avg merchant" },
            ].map((item, i) => (
              <span key={i} className="inline-flex items-center gap-3 px-8 whitespace-nowrap">
                <span className="text-white/30 text-xs font-semibold uppercase tracking-widest">{item.note}</span>
                <span className="text-white/60 text-sm font-bold">{item.processor}</span>
                <span className="text-white/20 text-xs">pays</span>
                <span className="text-primary font-black text-base">{item.amount}/yr</span>
                <span className="text-white/15 text-xs">in fees</span>
                <span className="mx-4 text-white/10 text-lg">·</span>
                <span className="text-white/20 text-xs font-medium italic">TechSavvy merchants pay</span>
                <span className="text-primary font-black text-base">$0</span>
                <span className="mx-6 text-white/10 text-lg">✦</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── POS RECEIPT SHOWCASE ──────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-[#07090f] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/4 rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span className="text-primary text-xs font-bold uppercase tracking-[0.2em]">
              Cash Discount Program
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white mt-3 mb-4 leading-[1.1]">
              See it on the receipt.
            </h2>
            <p className="text-white/40 text-base max-w-sm mx-auto">
              Your customers see exactly what they're paying — and why cash saves them money.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <POSReceiptShowcase />
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-24 bg-[#07090f]">
        <div className="max-w-5xl mx-auto px-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <span className="text-primary text-xs font-bold uppercase tracking-widest">
              How it works
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white mt-2 leading-tight">
              What working with us actually looks like.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="relative bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden hover:border-primary/30 transition-all"
              >
                <div className="h-44 sm:h-48 overflow-hidden">
                  <img
                    src={step.img}
                    alt={step.imgAlt}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="p-6">
                  <div className="text-5xl font-black text-primary/20 mb-3 leading-none">
                    {step.n}
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{step.body}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-6 rounded-2xl overflow-hidden border border-white/10"
          >
            <img
              src={paymentImg}
              alt="How zero-fee payment processing works"
              className="w-full h-40 sm:h-56 object-cover object-center"
            />
            <div className="bg-white/[0.04] border-t border-white/10 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="text-white font-bold text-sm">
                  Zero-fee processing — when it fits, it's free.
                </p>
                <p className="text-white/50 text-xs mt-0.5">
                  Legally compliant cash discount. No contracts. Free terminal.
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 flex-shrink-0"
                asChild
              >
                <a href="/statement-review" data-testid="button-payment-cta">
                  Analyze my statement
                  <ArrowRight className="w-3 h-3" />
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 bg-[#07090f]">
        <div className="max-w-2xl mx-auto px-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <span className="text-primary text-xs font-bold uppercase tracking-widest">
              Questions
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">
              Before you call.
            </h2>
          </motion.div>

          <div className="divide-y divide-white/0">
            <FAQItem
              q="Do I have to use your payment processing to work with you?"
              a="No. Plenty of our clients hired us for a website or CRM and never switched. The services are separate. We'll show you the math — you decide."
            />
            <FAQItem
              q="How is this different from hiring a freelancer?"
              a="Freelancers disappear when the project ships. We stay. Your business keeps evolving, and we evolve with it — not a ticket queue, a direct line."
            />
            <FAQItem
              q="Are you actually local?"
              a="Yes. 1917 S King St, Honolulu. We meet clients in person on O'ahu and work remotely with Maui, Big Island, and Kaua'i businesses."
            />
            <FAQItem
              q="How fast do you start?"
              a="Most engagements kick off within a week of the first call. Small builds ship in days. We don't do quarter-long planning phases."
            />
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#060810] py-16 sm:py-24">
        <div className="absolute inset-0 pointer-events-none">
          <img
            src={logoImg}
            alt=""
            aria-hidden="true"
            className="absolute right-0 bottom-0 w-64 sm:w-96 opacity-[0.06] object-contain"
          />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-5 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-primary text-xs font-bold uppercase tracking-widest">
              Ready?
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white mt-3 mb-4 leading-tight">
              One conversation.
              <br />
              <span className="text-primary">No pitch. No pressure.</span>
            </h2>
            <p className="text-white/50 text-base max-w-md mx-auto mb-8 leading-relaxed">
              Tell us what your business looks like today and where you want it
              in a year. We'll tell you — honestly — if we're the team that
              gets you there.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
              <Button
                size="lg"
                className="w-full sm:w-auto text-base font-bold px-10 py-6 rounded-xl shadow-xl shadow-primary/30"
                asChild
              >
                <a href="/contact" data-testid="button-final-cta">
                  Start the conversation
                  <ArrowRight className="w-4 h-4" />
                </a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-base px-10 py-6 rounded-xl border-white/20 text-white hover:bg-white/10"
                asChild
              >
                <a href="tel:8087675460" data-testid="button-final-phone">
                  <Phone className="w-4 h-4" />
                  (808) 767-5460
                </a>
              </Button>
            </div>
            <p className="text-white/30 text-xs flex items-center justify-center gap-2">
              <MapPin className="w-3 h-3" />
              1917 S King St, Honolulu · Mon–Fri 8am–5pm
            </p>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
