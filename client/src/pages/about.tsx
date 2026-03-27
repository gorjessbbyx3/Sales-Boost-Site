import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  MapPin, Heart, Shield, Users, Gift, Phone, ArrowRight,
  Zap, Target, HandHeart, Award, TrendingUp, Clock, Star,
} from "lucide-react";
import { fadeUp, staggerContainer } from "@/lib/animations";
import Layout from "@/components/layout";
import { useSEO } from "@/hooks/useSEO";
import { Link } from "wouter";

export default function AboutPage() {
  useSEO({
    title: "About TechSavvy Hawaii | Local Zero-Fee Payment Processing Team",
    description: "Meet the Honolulu-based team behind TechSavvy Hawaii. We built a better way for local businesses to accept credit cards — zero fees, free equipment, no contracts.",
    keywords: "about TechSavvy Hawaii, local payment processor Hawaii, Honolulu payment processing team, Hawaii merchant services company",
    canonical: "https://techsavvyhawaii.com/about",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "TechSavvy Hawaii",
      url: "https://techsavvyhawaii.com",
      address: { "@type": "PostalAddress", streetAddress: "1917 S King St", addressLocality: "Honolulu", addressRegion: "HI", postalCode: "96826" },
      telephone: "+18087675460",
      email: "contact@techsavvyhawaii.com",
      areaServed: "Hawaii",
    },
  });

  const team = [
    { name: "Jordan Galvez", role: "Founder & CEO", initial: "JG", desc: "Born and raised in Hawai'i. Saw local businesses losing thousands to mainland processors and built TechSavvy to fix it." },
    { name: "Merchant Services Team", role: "Head of Merchant Services", initial: "MS", desc: "Our merchant specialists work one-on-one with every business to find the best equipment and savings plan." },
    { name: "Tech Operations", role: "Technical Operations", initial: "TO", desc: "Handles terminal programming, gateway setup, and ensures every merchant is fully compliant from day one." },
    { name: "Customer Success", role: "Customer Success", initial: "CS", desc: "Your go-to after setup. Handles questions, troubleshooting, and makes sure you're always saving." },
  ];

  const values = [
    { icon: MapPin, title: "Real Support, Real People", desc: "Based in Honolulu and serving businesses nationwide. In Hawai'i, we come to you in person. Everywhere else, we connect live via Zoom, Discord, AnyDesk, or your preferred platform — no more paying employees to troubleshoot or sitting on hold." },
    { icon: Shield, title: "Total Transparency", desc: "No hidden fees, no fine print, no gotchas. What we tell you is what you get." },
    { icon: HandHeart, title: "No Contracts Ever", desc: "We earn your business every month. If you're not happy, you can leave anytime — zero penalty." },
    { icon: Gift, title: "Free Equipment for Qualifying Merchants", desc: "If your business meets our volume threshold, we pay for a brand new terminal or POS system, deliver it, set it up, train your staff, and handle all the tech — so you never have to." },
  ];

  const stats = [
    { value: "500+", label: "Hawaii Businesses", icon: Users },
    { value: "$2M+", label: "Saved Annually", icon: TrendingUp },
    { value: "4.9/5", label: "Merchant Rating", icon: Star },
    { value: "<24hr", label: "Support Response", icon: Clock },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div variants={fadeUp}>
              <Badge variant="outline" className="mb-4 text-primary border-primary/30 bg-primary/5">
                <MapPin className="w-3 h-3 mr-1.5" />
                Honolulu, Hawai'i
              </Badge>
            </motion.div>
            <motion.h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4" variants={fadeUp}>
              Built in Hawai'i.{" "}
              <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
                For Hawai'i.
              </span>
            </motion.h1>
            <motion.p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed" variants={fadeUp}>
              We watched local businesses lose thousands every year to mainland payment processors. So we built something better — a company that gives Hawai'i businesses free equipment, zero fees, and real local support.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((s) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <Card className="border-border/50 text-center">
                  <CardContent className="p-5">
                    <s.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-extrabold text-foreground">{s.value}</div>
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <Badge variant="outline" className="mb-4 text-primary border-primary/30 bg-primary/5">
                <Heart className="w-3 h-3 mr-1.5" />
                Our Story
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">Why We Started TechSavvy</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Every restaurant, salon, and shop in Hawai'i was paying 3–4% on every credit card transaction — and most didn't even realize how much that added up to. A restaurant doing $40K a month was losing $14,000+ a year just in processing fees.
                </p>
                <p>
                  The worst part? When they had a problem, they'd call a 1-800 number and wait on hold with someone on the mainland who'd never set foot in Hawai'i. No one was looking out for local businesses.
                </p>
                <p>
                  We built TechSavvy to change that. For qualifying merchants, we pay for brand new equipment, walk you through setup — in person in Hawai'i or live via Zoom, Discord, or AnyDesk anywhere else — and handle all the ongoing tech support. Our cash discount program eliminates processing fees entirely. When you support us, we invest right back into your business.
                </p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-emerald-500/10 border border-primary/20 p-8 text-center">
                <Target className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Invest in businesses the way business should be done. Every dollar we spend on your equipment and every fee we eliminate is money that stays in your pocket — paying employees, buying supplies, and growing your business. You support us, we support you.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-card/50 to-transparent">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">What We Stand For</h2>
            <p className="text-muted-foreground">The principles behind everything we do</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((v) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <Card className="h-full border-border/50 hover:border-primary/30 transition-colors">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <v.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">{v.title}</h3>
                      <p className="text-sm text-muted-foreground">{v.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">The Team</h2>
            <p className="text-muted-foreground">Real people. Right here in Honolulu.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {team.map((t) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <Card className="border-border/50">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-bold text-sm">
                      {t.initial}
                    </div>
                    <div>
                      <div className="font-bold">{t.name}</div>
                      <div className="text-xs text-primary mb-2">{t.role}</div>
                      <p className="text-sm text-muted-foreground">{t.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-background to-emerald-500/10 border border-primary/20 p-8 sm:p-12 text-center">
            <Gift className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">Ready to Keep Every Dollar You Earn?</h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Qualifying merchants get free equipment, zero processing fees, and hands-on tech support — in person or live remote. No contracts, no catches — just one business investing in another.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button size="lg" asChild>
                <Link href="/apply">
                  <Gift className="w-4 h-4" />
                  Claim Your Free Setup
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="tel:+18087675460">
                  <Phone className="w-4 h-4" />
                  (808) 767-5460
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
