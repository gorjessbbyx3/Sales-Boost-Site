import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Phone,
  MapPin,
  Code2,
  Palette,
  Mail,
  LineChart,
  Shield,
  Handshake,
  Sparkles,
  Building2,
  Zap,
  Star,
  ChevronDown,
  Clock,
  Users,
  Wrench,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { fadeUp, staggerContainer } from "@/lib/animations";
import Layout from "@/components/layout";
import { useSEO } from "@/hooks/useSEO";

// ─────────────────────────────────────────────────────────────────────────────
// /hawaii — Staging page for the new TechSavvy Hawaii landing page.
// Positioning: full local business partner (websites, CRMs, branding, ads,
// email, automation, and payments) — NOT "just a payment processor."
// Tone: Chase Hughes–flavored. Calm authority, pattern interrupts, calibrated
// statements, embedded commands, zero hype. We don't sell. We show up.
// This lives separately from / until the copy + layout are locked in.
// ─────────────────────────────────────────────────────────────────────────────

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
    <div className="border border-primary/10 rounded-xl overflow-hidden bg-card/40">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-primary/5 transition-colors"
      >
        <span className="font-semibold text-foreground">{q}</span>
        <ChevronDown
          className={`w-5 h-5 text-primary flex-shrink-0 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 text-muted-foreground leading-relaxed text-sm">
          {a}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function HawaiiPage() {
  useSEO({
    title:
      "TechSavvy Hawaii — The Local Team Behind Hawai'i's Best Small Businesses",
    description:
      "We're not a payment processor. We're the local team Hawai'i businesses hire to build websites, CRMs, brands, ad funnels, and yes — zero-fee processing. Based in Honolulu. Serving all islands.",
    keywords:
      "Hawaii business partner, Honolulu small business consulting, CRM Hawaii, website design Honolulu, payment processing Hawaii, TechSavvy Hawaii, local business help Oahu",
    canonical: "https://techsavvyhawaii.com/hawaii",
    ogImage: "https://techsavvyhawaii.com/images/hero-hawaii-sunset.jpg",
  });

  return (
    <Layout>
      {/* ── 1. HERO — Pattern interrupt + reframe ─────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="relative w-full">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            src="/images/hero-video-v2.mp4"
            className="w-full h-[50vh] sm:h-[65vh] object-cover"
            aria-label="Hawaii local business partnership"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-background" />
        </div>

        <div className="relative z-10 -mt-32 sm:-mt-48 pb-10">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={fadeUp}>
                <Badge
                  variant="outline"
                  className="mb-5 text-primary border-primary/40 bg-background/80 backdrop-blur"
                >
                  <MapPin className="w-3 h-3 mr-1" />
                  Built in Honolulu · Serving all islands
                </Badge>
              </motion.div>

              <motion.h1
                className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] mb-5 text-white drop-shadow-lg"
                variants={fadeUp}
              >
                Most people think we're a{" "}
                <span className="line-through text-white/50">
                  payment processor
                </span>
                .
                <br />
                <span className="text-primary">
                  We're the team your business hires
                </span>{" "}
                when it's done being small.
              </motion.h1>

              <motion.p
                className="text-base sm:text-lg text-white/90 leading-relaxed mb-7 max-w-2xl mx-auto drop-shadow"
                variants={fadeUp}
              >
                Websites. CRMs. Brand work. Ad funnels. Email that actually
                lands. And yes — zero-fee card processing when it fits. One
                local team. One phone number. No mainland runaround.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center gap-3"
                variants={fadeUp}
              >
                <Button size="lg" className="px-8" asChild>
                  <a href="/contact">
                    Book a 20-minute walkthrough
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-background/80 backdrop-blur"
                  asChild
                >
                  <a href="tel:8087675460">
                    <Phone className="w-4 h-4" />
                    (808) 767-5460
                  </a>
                </Button>
              </motion.div>

              <motion.p
                className="text-xs text-white/80 mt-5 drop-shadow"
                variants={fadeUp}
              >
                No pitch. No pressure. If we can't help, we'll tell you in the
                first ten minutes.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 2. STATS STRIP ────────────────────────────────────────────── */}
      <section className="py-10 sm:py-14 border-y border-primary/10 bg-card/30">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { n: 50, suffix: "+", label: "Hawai'i businesses served" },
              { n: 35, suffix: "+", label: "Custom API endpoints shipped" },
              { n: 4, suffix: "", label: "In-house service lines" },
              {
                n: 0,
                prefix: "$",
                suffix: "",
                label: "Processing fees (when it fits)",
              },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl sm:text-4xl font-extrabold text-primary mb-1">
                  <AnimatedCounter
                    target={s.n}
                    prefix={s.prefix || ""}
                    suffix={s.suffix}
                  />
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground leading-tight">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. THE HONEST VERSION ─────────────────────────────────────── */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="mb-4 text-xs">
              The honest version
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-extrabold mb-6 leading-tight">
              Running a business in Hawai'i is{" "}
              <span className="text-primary">not the same</span> as running
              one anywhere else.
            </h2>
            <div className="space-y-5 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
              <p>
                Rent is higher. Shipping is slower. Your customer base is half
                local, half visitor, and your margins get squeezed from every
                side. Most of the "business help" out here comes from mainland
                companies that'll never set foot on O'ahu, or from giant
                processors who see your shop as a line on a spreadsheet.
              </p>
              <p>
                We built TechSavvy because Hawai'i deserves a real partner —
                local, technical, and actually invested in whether your
                business is still here in five years.
              </p>
              <p className="text-foreground font-medium border-l-2 border-primary pl-4">
                Payment processing is one thing we do. It's usually not the
                most important thing we do for a client.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 4. WHAT WE ACTUALLY DO ────────────────────────────────────── */}
      <section className="py-16 sm:py-24 relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-card/50 via-transparent to-card/50" />
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 max-w-2xl"
          >
            <Badge variant="outline" className="mb-4 text-xs">
              What your business actually gets
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-extrabold mb-3">
              One local team. Every tool your business needs.
            </h2>
            <p className="text-muted-foreground">
              Everything below is work we've already built and shipped for
              Hawai'i businesses this year. Not a service menu. A track record.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: Code2,
                title: "Custom websites & web apps",
                body: "Not a template. Real sites built on modern infrastructure — fast, mobile-first, and your customers can actually use them.",
              },
              {
                icon: Building2,
                title: "CRMs that fit your business",
                body: "Cleaners, plumbers, realtors, property managers — we've built custom CRMs for all of them. Your workflow, not somebody else's software forced onto it.",
              },
              {
                icon: Palette,
                title: "Brand & design work",
                body: "Through our sister studio GorJess.co: logos, print materials, social templates, full brand systems. The kind of look that makes customers take you seriously.",
              },
              {
                icon: Mail,
                title: "Email that lands in inboxes",
                body: "SPF, DKIM, DMARC, deliverability audits. Boring, invisible work that means your quotes and invoices stop landing in spam folders.",
              },
              {
                icon: LineChart,
                title: "Ads, funnels & lead tools",
                body: "Meta ads, landing pages, lead magnets, retention analysis. We build the pipeline — not just hand you a login and disappear.",
              },
              {
                icon: Shield,
                title: "Zero-fee payment processing",
                body: "When it makes sense, we'll set you up on a compliant cash-discount program with free equipment. When it doesn't, we'll say so.",
              },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <Card
                  key={s.title}
                  className="border-primary/10 hover:border-primary/30 transition-colors group"
                >
                  <CardContent className="p-6">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {s.body}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 5. PROOF ──────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 max-w-2xl"
          >
            <Badge variant="outline" className="mb-4 text-xs">
              Quiet work, real businesses
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-extrabold mb-3">
              A few of the local shops we've built things for
            </h2>
            <p className="text-muted-foreground">
              No logos wall. Just real work, shipped this year.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                name: "ProFlow Plumbing",
                tag: "Trades",
                work: "Custom CRM, booking flow, campaign pages, branded print materials, email deliverability setup.",
              },
              {
                name: "808 All Purpose Cleaners",
                tag: "Service business",
                work: "CRM dashboard, pricing flyer, service posters, website, full brand cleanup.",
              },
              {
                name: "Mel Castanares — Hawai'i Realtor",
                tag: "Real estate",
                work: "Real-estate CRM with 35+ custom API endpoints, lead capture, deliverability fixes.",
              },
              {
                name: "RoomRover — 934 Kapahulu",
                tag: "Property management",
                work: "Full property management app, public inquiry page, dashboard, EmailJS integration.",
              },
            ].map((c) => (
              <Card key={c.name} className="border-primary/10">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="font-bold text-foreground text-lg">
                      {c.name}
                    </div>
                    <Badge variant="outline" className="text-xs flex-shrink-0">
                      {c.tag}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground leading-relaxed">
                    {c.work}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. TESTIMONIAL ────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4">
          <Card className="border-primary/15 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
            <CardContent className="p-8 sm:p-12 relative">
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <p className="text-lg sm:text-2xl text-foreground leading-relaxed mb-6 italic">
                "I hired them for a website. A year later they're running my
                CRM, my ads, my email, and my card processing. They're not a
                vendor — they're on my team."
              </p>
              <div className="font-semibold text-foreground">
                Hawai'i Small Business Owner
              </div>
              <div className="text-sm text-muted-foreground">O'ahu</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ── 7. HOW IT WORKS ───────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-card/30 via-transparent to-card/30" />
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="mb-4 text-xs">
              How the partnership works
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-extrabold mb-10">
              What working with us actually looks like
            </h2>

            <div className="space-y-6">
              {[
                {
                  n: "01",
                  icon: Users,
                  title: "We sit down and look at what's actually broken",
                  body: "Twenty minutes on the phone, or in person if you're on O'ahu. No pitch. We ask questions, you tell us where your business hurts. By the end, you'll know whether we can help.",
                },
                {
                  n: "02",
                  icon: Clock,
                  title: "We hand you a plan — in plain English",
                  body: "Not a forty-page proposal. A short document that says: here's what we'd build, here's the order, here's what it costs, here's what it won't do. You decide.",
                },
                {
                  n: "03",
                  icon: Wrench,
                  title: "We build. You get updates. Things start working.",
                  body: "Most of our builds ship in days or weeks, not quarters. You get a direct line to us the entire time — not a ticket queue in another time zone.",
                },
                {
                  n: "04",
                  icon: Handshake,
                  title: "We stick around",
                  body: "Your business changes. The tools need to change with it. We stay on as the technical team you text when something needs to happen — a landing page, an ad campaign, or cutting your card fees to zero.",
                },
              ].map((step) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.n}
                    className="flex gap-5 p-5 rounded-xl border border-primary/10 bg-card/40 hover:border-primary/25 transition-colors"
                  >
                    <div className="flex-shrink-0 flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="text-xs font-extrabold text-primary/50">
                        {step.n}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">{step.title}</h3>
                      <p className="text-muted-foreground leading-relaxed text-sm">
                        {step.body}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 8. WHO WE'RE NOT FOR ──────────────────────────────────────── */}
      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="border-primary/15">
              <CardContent className="p-8 sm:p-10">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <Badge variant="outline" className="text-xs">
                    Straight talk
                  </Badge>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold mb-5">
                  We're probably not the right fit if…
                </h2>
                <ul className="space-y-4 text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="text-primary mt-1 font-bold">—</span>
                    <span>
                      You want the absolute cheapest option. We're fair, not
                      cheap. Cheap work costs you twice.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary mt-1 font-bold">—</span>
                    <span>
                      You want to hand off the decisions and disappear. Our
                      best clients stay in the loop because their business is
                      theirs.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary mt-1 font-bold">—</span>
                    <span>
                      You're looking for a magic-bullet growth hack. We build
                      real tools that compound. No magic.
                    </span>
                  </li>
                </ul>
                <p className="mt-6 text-foreground font-medium">
                  If any of that's a dealbreaker, that's fine. We'd rather
                  tell you now than six weeks in.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* ── 9. FAQ ────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-card/30 via-transparent to-transparent" />
        <div className="max-w-3xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="mb-4 text-xs">
              Questions people actually ask
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-extrabold mb-8">
              Before you pick up the phone
            </h2>

            <div className="space-y-3">
              <FAQItem
                q="Do I have to use your payment processing to work with you?"
                a="No. Plenty of our clients hired us for a website or a CRM and never switched their card processing. The services are independent. If moving to zero-fee processing saves you real money, we'll show you the math. If not, we won't push it."
              />
              <FAQItem
                q="How is this different from hiring a freelancer?"
                a="A freelancer disappears when the project ships. We stay on. Your business keeps evolving, and we stay plugged into it — so when you need a new landing page, an ad push, or a bug fix, you're texting a team that already knows your setup."
              />
              <FAQItem
                q="Are you actually local?"
                a="Yes. We're based at 1917 S King St in Honolulu. We meet clients in person on O'ahu and work remotely with businesses on Maui, the Big Island, and Kaua'i."
              />
              <FAQItem
                q="What does it cost?"
                a="It depends on what you need. A small website is a one-time project. A custom CRM is a build plus ongoing support. Payment processing, when it fits, is zero monthly fees. We quote honestly after the first call — no surprise invoices."
              />
              <FAQItem
                q="How fast can you start?"
                a="Most new engagements kick off within a week of the first call. Small builds ship in days. Bigger custom work takes a few weeks. We don't do quarter-long planning phases."
              />
              <FAQItem
                q="What if I already have a website / CRM / processor?"
                a="Good. We'll audit what you have first and tell you what's worth keeping. We're not here to replace working tools for the sake of a bigger invoice."
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 10. FINAL CTA ─────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Card className="border-primary/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/3 to-transparent" />
            <CardContent className="p-8 sm:p-14 relative">
              <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-5">
                <Handshake className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold mb-4 leading-tight">
                One conversation. No pitch. No pressure.
              </h2>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto leading-relaxed">
                Tell us what your business looks like today and what you wish
                it looked like a year from now. We'll tell you — honestly —
                whether we're the team that can get you there.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button size="lg" className="px-8" asChild>
                  <a href="/contact">
                    Start the conversation
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href="tel:8087675460">
                    <Phone className="w-4 h-4" />
                    (808) 767-5460
                  </a>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-6 flex items-center justify-center gap-2">
                <Zap className="w-3 h-3" />
                Based at 1917 S King St, Honolulu · Serving all islands
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
}
