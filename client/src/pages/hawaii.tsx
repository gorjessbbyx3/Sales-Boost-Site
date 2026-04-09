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
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Layout from "@/components/layout";
import { useSEO } from "@/hooks/useSEO";
import logoImg from "@assets/IMG_6366.jpeg";
import techSavvyLogoImg from "@assets/IMG_6386.jpeg";
import paymentImg from "@assets/IMG_6470.jpeg";
import frustratedOwnerImg from "@assets/IMG_6402_1770892555479.png";

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

  const clients = [
    {
      name: "Capture by Christian",
      url: "https://capturebychristian.vercel.app/",
      tag: "Photography",
      work: "Full custom website, brand system, booking flow, and portfolio architecture — built to convert browsers into clients.",
      color: "from-violet-500/20 to-purple-900/20",
      accent: "bg-violet-500",
    },
    {
      name: "GorJess.co",
      url: "https://gorjess.co",
      tag: "Design Studio",
      work: "Our sister design studio. Logos, print, social systems, full brand identities — the visual layer behind our best clients.",
      color: "from-rose-500/20 to-pink-900/20",
      accent: "bg-rose-500",
    },
    {
      name: "808 All Purpose Cleaners",
      url: "#",
      tag: "Service Business",
      work: "CRM dashboard, pricing collateral, service posters, website, and a full brand cleanup that actually stuck.",
      color: "from-sky-500/20 to-blue-900/20",
      accent: "bg-sky-500",
    },
    {
      name: "Mel Castanares — Realtor",
      url: "#",
      tag: "Real Estate",
      work: "Real-estate CRM with 35+ custom API endpoints, lead capture, automated follow-ups, email deliverability.",
      color: "from-emerald-500/20 to-green-900/20",
      accent: "bg-emerald-500",
    },
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
          src="/images/hero-video-v2.mp4"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#060810]/60 via-[#060810]/40 to-[#060810]" />

        {/* Floating logo image — desktop only */}
        <div className="absolute right-4 top-24 lg:right-12 lg:top-28 hidden sm:block">
          <motion.div
            initial={{ opacity: 0, x: 60, rotate: 6 }}
            animate={{ opacity: 1, x: 0, rotate: 3 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            className="w-32 h-32 lg:w-48 lg:h-48 rounded-2xl overflow-hidden border border-primary/20 shadow-2xl shadow-primary/10"
          >
            <img
              src={techSavvyLogoImg}
              alt="TechSavvy Hawaii"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-5 pt-28 pb-16 sm:pt-32 sm:pb-20">
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
            className="flex flex-col sm:flex-row gap-3 mb-10"
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

        {/* Pain-point image strip at bottom of hero */}
        <div className="relative z-10 w-full overflow-hidden">
          <div className="max-w-5xl mx-auto px-5 pb-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
            >
              <img
                src={frustratedOwnerImg}
                alt="Business owner overwhelmed by processing fees"
                className="w-full h-48 sm:h-72 object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#060810]/80 via-transparent to-transparent" />
              <div className="absolute inset-0 flex items-center px-6 sm:px-10">
                <div>
                  <p className="text-white/60 text-xs uppercase tracking-widest mb-1">
                    Sound familiar?
                  </p>
                  <p className="text-white font-black text-xl sm:text-3xl leading-tight max-w-xs">
                    Watching fees eat your margin every single month.
                  </p>
                  <p className="text-primary font-semibold text-sm mt-2">
                    That ends when you call us.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────────── */}
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

      {/* ── SERVICES — horizontal scroll on mobile ───────────────────────── */}
      <section className="py-16 sm:py-20 bg-[#07090f]">
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

          {/* Mobile: horizontal scroll | Desktop: grid */}
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

      {/* ── REAL WORK — client proof ──────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-[#060810]">
        <div className="max-w-5xl mx-auto px-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <span className="text-primary text-xs font-bold uppercase tracking-widest">
              Real work, real businesses
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white mt-2 leading-tight">
              A few things we've built this year.
            </h2>
            <p className="text-white/50 text-sm mt-2">
              No logos wall. Actual work, shipped.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {clients.map((c, i) => (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-2xl overflow-hidden border border-white/10 p-6 bg-gradient-to-br ${c.color} hover:border-white/20 transition-all group`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div
                      className={`inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${c.accent} text-white mb-2`}
                    >
                      {c.tag}
                    </div>
                    <h3 className="text-white font-black text-lg leading-tight">
                      {c.name}
                    </h3>
                  </div>
                  {c.url !== "#" && (
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors group-hover:scale-105"
                      data-testid={`link-client-${c.name.toLowerCase().replace(/\s/g, "-")}`}
                    >
                      <ExternalLink className="w-4 h-4 text-white" />
                    </a>
                  )}
                </div>
                <p className="text-white/60 text-sm leading-relaxed">{c.work}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-[#07090f]">
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

          {/* Payment visual */}
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
        <div className="absolute inset-0">
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
