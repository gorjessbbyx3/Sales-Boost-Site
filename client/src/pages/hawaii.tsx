import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
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
} from "lucide-react";
import { fadeUp, staggerContainer } from "@/lib/animations";
import Layout from "@/components/layout";
import { useSEO } from "@/hooks/useSEO";

// ─────────────────────────────────────────────────────────────────────────────
// /hawaii — "Partner, not vendor" positioning
// Chase Hughes–style copy: calm authority, pattern interrupts, calibrated
// statements, trust anchors, zero hype. We don't sell. We show up.
// ─────────────────────────────────────────────────────────────────────────────

export default function HawaiiPage() {
  useSEO({
    title: "TechSavvy Hawaii — The Business Partner Behind Hawai'i's Best Local Shops",
    description:
      "We're not a payment processor. We're the quiet team behind Hawai'i businesses that actually grow — websites, CRMs, branding, automation, and yes, zero-fee processing when it fits. Based in Honolulu.",
    keywords:
      "Hawaii business partner, Honolulu small business help, local business consulting Hawaii, CRM Hawaii, website design Honolulu, payment processing Hawaii, TechSavvy Hawaii",
    canonical: "https://techsavvyhawaii.com/hawaii",
    ogImage: "https://techsavvyhawaii.com/images/hero-hawaii-sunset.jpg",
  });

  return (
    <Layout>
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="relative pt-24 pb-16 sm:pt-36 sm:pb-24 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-primary/3 to-transparent" />
        </div>

        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div variants={fadeUp}>
              <Badge
                variant="outline"
                className="mb-5 text-primary border-primary/30 bg-primary/5"
              >
                <MapPin className="w-3 h-3 mr-1" />
                Built in Honolulu. Quietly running Hawai'i businesses.
              </Badge>
            </motion.div>

            <motion.h1
              className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] mb-6"
              variants={fadeUp}
            >
              Most people think we're a{" "}
              <span className="line-through text-muted-foreground/60">
                payment processor
              </span>
              .
              <br />
              <span className="text-primary">We're the team your business hires</span>{" "}
              when it's done being small.
            </motion.h1>

            <motion.p
              className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto"
              variants={fadeUp}
            >
              You already know what's broken. The website nobody updates. The
              spreadsheet pretending to be a CRM. The emails landing in spam.
              The card fees quietly eating your margin. We don't sell you a
              product — we sit down, look at all of it, and fix what's actually
              costing you money.
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
              <Button variant="outline" size="lg" asChild>
                <a href="tel:8087675460">
                  <Phone className="w-4 h-4" />
                  (808) 767-5460
                </a>
              </Button>
            </motion.div>

            <motion.p
              className="text-xs text-muted-foreground mt-5"
              variants={fadeUp}
            >
              No pitch deck. No pressure. If we can't help, we'll tell you in
              the first ten minutes.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── The frame: we're not who you think we are ─────────────────── */}
      <section className="py-14 sm:py-20">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="max-w-3xl">
              <Badge variant="outline" className="mb-4 text-xs">
                The honest version
              </Badge>
              <h2 className="text-2xl sm:text-4xl font-extrabold mb-6 leading-tight">
                Running a business in Hawai'i is{" "}
                <span className="text-primary">not the same</span> as running
                one anywhere else.
              </h2>
              <div className="space-y-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
                <p>
                  Rent is higher. Shipping is slower. Your customer base is
                  half local, half visitor, and your margins get squeezed from
                  every side. Most of the "business help" available out here
                  comes from mainland companies that'll never set foot on
                  O'ahu, or from giant processors who see your shop as a line
                  on a spreadsheet.
                </p>
                <p>
                  We built TechSavvy because Hawai'i deserves a real partner —
                  someone local, technical, and actually invested in whether
                  your business is still here in five years.
                </p>
                <p className="text-foreground font-medium">
                  Payment processing is one thing we do. It's usually not the
                  most important thing we do for a client.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── What we actually do ────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-card/50 via-transparent to-card/50" />
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <h2 className="text-2xl sm:text-4xl font-extrabold mb-3">
              What your business actually gets
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              One local team. One phone number. Everything below is something
              we've already built and shipped for Hawai'i businesses this year.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: Code2,
                title: "Custom websites & web apps",
                body: "Not a template. Real sites built on modern infrastructure (Cloudflare, React, fast load times) that your customers can actually use on their phones.",
              },
              {
                icon: Building2,
                title: "CRMs that fit your business",
                body: "Cleaning companies, plumbers, realtors, property managers — we've built custom CRMs for all of them. Your workflow, not somebody else's software forced onto it.",
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
                  className="border-primary/10 hover:border-primary/30 transition-colors"
                >
                  <CardContent className="p-6">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
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

      {/* ── Proof: who we work with ────────────────────────────────────── */}
      <section className="py-14 sm:py-20">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-4xl font-extrabold mb-3">
              Quiet work for real Hawai'i businesses
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl">
              A few of the local shops, trades, and operators we've built
              things for. No logos wall. Just real work.
            </p>

            <div className="space-y-4">
              {[
                {
                  name: "ProFlow Plumbing",
                  work:
                    "Custom CRM, booking flow, campaign pages, branded print materials, email deliverability.",
                },
                {
                  name: "808 All Purpose Cleaners",
                  work:
                    "CRM dashboard, pricing flyer, service posters, website, full brand cleanup.",
                },
                {
                  name: "Mel Castanares — Hawai'i Realtor",
                  work:
                    "Real-estate CRM with 35+ custom API endpoints, lead capture, deliverability fixes.",
                },
                {
                  name: "RoomRover — 934 Kapahulu",
                  work:
                    "Full property management app, public inquiry page, dashboard, EmailJS integration.",
                },
              ].map((c) => (
                <div
                  key={c.name}
                  className="flex gap-4 p-5 rounded-xl bg-primary/5 border border-primary/10"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-bold text-foreground">{c.name}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {c.work}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── How the partnership actually works ─────────────────────────── */}
      <section className="py-14 sm:py-20 relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-card/30 via-transparent to-card/30" />
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-4xl font-extrabold mb-8">
              How working with us actually looks
            </h2>

            <div className="space-y-6">
              {[
                {
                  n: "01",
                  title: "We sit down and look at what's actually broken",
                  body:
                    "20 minutes on the phone, or in person if you're on O'ahu. No pitch. We ask questions and you tell us where your business hurts. By the end, you'll know whether we can help.",
                },
                {
                  n: "02",
                  title: "We hand you a plan — in plain English",
                  body:
                    "Not a 40-page proposal. A short document that says: here's what we'd build, here's the order, here's what it costs, here's what it won't do. You decide.",
                },
                {
                  n: "03",
                  title: "We build. You get updates. Things start working.",
                  body:
                    "Most of our builds ship in days or weeks, not quarters. You'll have a direct line to us the entire time. Not a ticket queue in another time zone.",
                },
                {
                  n: "04",
                  title: "We stick around",
                  body:
                    "Your business changes. The tools need to change with it. We stay on as the technical team you text when something needs to happen — whether that's a new landing page, an ad campaign, or cutting your card fees to zero.",
                },
              ].map((step) => (
                <div key={step.n} className="flex gap-5">
                  <div className="text-2xl font-extrabold text-primary/40 flex-shrink-0 w-12">
                    {step.n}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Pattern interrupt: who we're NOT for ───────────────────────── */}
      <section className="py-14 sm:py-20">
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
                <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">
                  We're probably not the right fit if…
                </h2>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="text-primary mt-1">—</span>
                    <span>
                      You want the absolute cheapest option. We're fair, not
                      cheap. Cheap work costs you twice.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary mt-1">—</span>
                    <span>
                      You want to hand off the decisions and disappear. Our
                      best clients stay in the loop because their business is
                      theirs.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary mt-1">—</span>
                    <span>
                      You're looking for a magic-bullet growth hack. We build
                      real tools that compound. No magic.
                    </span>
                  </li>
                </ul>
                <p className="mt-6 text-foreground font-medium">
                  If any of that is a dealbreaker, that's fine. We'd rather
                  tell you now than six weeks in.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-24">
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
                Based at 1917 S King St, Honolulu — serving all islands.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
}
