import { Button } from "@/components/ui/button";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Phone,
  MapPin,
  ChevronDown,
  ExternalLink,
  Check,
  Star,
  Globe,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Layout from "@/components/layout";
import { useSEO } from "@/hooks/useSEO";
import logoImg from "@assets/IMG_6366.jpeg";
import techSavvyLogoImg from "@assets/IMG_6386.jpeg";
import paymentImg from "@assets/IMG_6470.jpeg";
import soundFamiliarImg from "@assets/IMG_6407_1775728573513.png";

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

// ─────────────────────────────────────────────────────────────────────────────
export default function HawaiiPage() {
  useSEO({
    title: "TechSavvy Hawaii — Your Local Tech & Business Partner",
    description:
      "Websites, CRMs, branding, ads, and zero-fee payment processing — all from one local Honolulu team. We build, we stay, we grow with you.",
    keywords:
      "Hawaii business partner, Honolulu web design, CRM Hawaii, payment processing Hawaii, TechSavvy Hawaii, local business tech Oahu",
    canonical: "https://techsavvyhawaii.com/hawaii",
  });

  const services = [
    { title: "Custom Websites", sub: "Built from scratch. Fast. Yours." },
    { title: "CRM Systems", sub: "Your workflow, not someone else's." },
    { title: "Brand & Design", sub: "Via GorJess.co — our design studio." },
    { title: "Zero-Fee Processing", sub: "Keep every dollar you earn." },
    { title: "Ad Funnels", sub: "Meta ads, landing pages, leads." },
    { title: "Email Deliverability", sub: "Stop landing in spam. Period." },
  ];

  const steps = [
    {
      n: "01",
      title: "20-minute call",
      body: "No pitch. We listen, ask where your business hurts, and tell you honestly if we can help.",
    },
    {
      n: "02",
      title: "Plain-English plan",
      body: "What we'd build, the order, what it costs, what it won't do. You decide.",
    },
    {
      n: "03",
      title: "We build. We stay.",
      body: "Most builds ship in days. Then we stick around — not a ticket queue. A real team you can text.",
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
      url: "allpurposecleaners.gorjess.co",
      label: "808 All Purpose Cleaners",
      tag: "Service Business",
      accent: "bg-sky-600",
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
          src="/hero-hawaii.mp4"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#060810]/50 via-[#060810]/30 to-[#060810]" />

        {/* Floating logo — desktop */}
        <div className="absolute right-6 top-28 lg:right-16 lg:top-32 hidden sm:block">
          <motion.div
            initial={{ opacity: 0, x: 50, rotate: 6 }}
            animate={{ opacity: 1, x: 0, rotate: 3 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            className="w-28 h-28 lg:w-44 lg:h-44 rounded-2xl overflow-hidden border border-primary/20 shadow-2xl shadow-primary/10"
          >
            <img
              src={techSavvyLogoImg}
              alt="TechSavvy Hawaii"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-5 pt-28 pb-12 sm:pt-36 sm:pb-16">
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
            className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.02] text-white mb-6"
          >
            We're the team your{" "}
            <br className="hidden sm:block" />
            business hires{" "}
            <span className="text-primary italic">when it's done</span>
            <br className="hidden sm:block" />
            {" "}being small.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-base sm:text-xl text-white/70 max-w-xl leading-relaxed mb-8"
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

        {/* "Sound familiar?" pain-point card */}
        <div className="relative z-10 w-full">
          <div className="max-w-5xl mx-auto px-5 pb-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.65 }}
              className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
            >
              <img
                src={soundFamiliarImg}
                alt="Business owner losing money on processing fees"
                className="w-full h-52 sm:h-80 object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#060810]/90 via-[#060810]/60 to-transparent" />
              <div className="absolute inset-0 flex items-center px-6 sm:px-10">
                <div>
                  <p className="text-white/60 text-xs uppercase tracking-widest mb-2">
                    Sound familiar?
                  </p>
                  <p className="text-white font-black text-2xl sm:text-4xl leading-tight max-w-sm">
                    Watching 4% disappear every single swipe.
                  </p>
                  <p className="text-primary font-bold text-sm mt-3">
                    That ends when you call us. →
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ──────────────────────────────────────────────────── */}
      <section className="bg-primary py-10 sm:py-12">
        <div className="max-w-5xl mx-auto px-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { n: 50, s: "+", label: "HI Businesses" },
              { n: 35, s: "+", label: "Custom API endpoints" },
              { n: 4, s: "", label: "Service lines" },
              { n: 0, p: "$", s: "", label: "Processing fees" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl sm:text-4xl font-black text-white mb-0.5">
                  <AnimatedCounter
                    target={stat.n}
                    prefix={stat.p || ""}
                    suffix={stat.s}
                  />
                </div>
                <div className="text-xs text-white/70 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 bg-[#07090f]">
        <div className="max-w-5xl mx-auto px-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <span className="text-primary text-xs font-bold uppercase tracking-widest">
              What your business gets
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white mt-2 leading-tight">
              One team. Everything you need.
            </h2>
          </motion.div>

          <div className="flex sm:grid sm:grid-cols-3 gap-3 overflow-x-auto pb-3 sm:pb-0 -mx-5 px-5 sm:mx-0 sm:px-0 scrollbar-none">
            {services.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="flex-shrink-0 w-[72vw] sm:w-auto bg-white/[0.04] border border-white/10 rounded-2xl p-5 hover:border-primary/40 hover:bg-white/[0.07] transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                  <span className="text-primary text-xs font-black">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="font-bold text-white text-base mb-1">{s.title}</h3>
                <p className="text-white/50 text-sm">{s.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIVE WEBSITE SHOWCASE ─────────────────────────────────────────── */}
      <section className="py-14 sm:py-24 bg-[#060810]">
        <div className="max-w-6xl mx-auto px-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <span className="text-primary text-xs font-bold uppercase tracking-widest">
              Live sites we've shipped
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white mt-2 leading-tight">
              Real businesses. Live right now.
            </h2>
            <p className="text-white/40 text-sm mt-2">
              Not mockups. Not demos. Click to visit.
            </p>
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
                className="relative bg-white/[0.04] border border-white/10 rounded-2xl p-6 hover:border-primary/30 transition-all"
              >
                <div className="text-5xl font-black text-primary/20 mb-3 leading-none">
                  {step.n}
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{step.body}</p>
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

      {/* ── TESTIMONIAL ──────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 bg-[#060810]">
        <div className="max-w-3xl mx-auto px-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="flex justify-center gap-1 mb-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <blockquote className="text-xl sm:text-3xl font-bold text-white leading-snug mb-6">
              "I hired them for a website. A year later they're running my CRM,
              my ads, my email, and my card processing. They're not a vendor —
              they're on my team."
            </blockquote>
            <div className="text-white/40 text-sm">
              Hawai'i Small Business Owner · O'ahu
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
