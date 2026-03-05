import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  CreditCard, Check, ArrowRight, Clock, DollarSign, ShieldCheck,
  Zap, Phone, FileText, BarChart3, Users, Headphones,
} from "lucide-react";
import { useState } from "react";
import { fadeUp, staggerContainer } from "@/lib/animations";
import Layout from "@/components/layout";
import { useSEO } from "@/hooks/useSEO";
import { Link } from "wouter";

const stepChoosePlan = "/images/step-choose-plan.png";
const stepSetup = "/images/step-setup.png";
const stepKeepProfits = "/images/step-keep-revenue.png";

export default function HowItWorksPage() {
  useSEO({
    title: "How It Works | Zero-Fee Payment Processing | TechSavvy Hawaii",
    description: "See how TechSavvy Hawaii eliminates your processing fees in 3 simple steps. Cash Back, free terminals, no contracts. Get set up in days, not weeks.",
    keywords: "how payment processing works Hawaii, Cash Back explained, cash discount program, zero fee processing setup, merchant services Hawaii",
    canonical: "https://techsavvyhawaii.com/how-it-works",
    ogImage: "https://techsavvyhawaii.com/images/hero-hawaii-sunset.jpg",
  });

  const steps = [
    {
      num: "01",
      title: "Contact Us & Get a Free Analysis",
      description: "We review your current processing statement and show you exactly how much you're losing to hidden fees. No obligation, no pressure — just the real numbers.",
      details: [
        "Free statement analysis — see your true effective rate",
        "Side-by-side comparison: your current costs vs. TechSavvy",
        "Personalized savings estimate for your business",
      ],
      icon: FileText,
      image: stepChoosePlan,
      imageAlt: "Business owner reviewing processing statement",
    },
    {
      num: "02",
      title: "We Handle the Entire Setup",
      description: "Our local team programs your terminal, configures the Cash Back program, installs compliance signage, and trains your staff. You don't lift a finger.",
      details: [
        "Free terminal delivered to your business",
        "Full programming & Cash Back program configuration",
        "Compliance signage and staff training included",
      ],
      icon: Zap,
      image: stepSetup,
      imageAlt: "TechSavvy team setting up payment terminal",
    },
    {
      num: "03",
      title: "Keep 100% of Every Sale",
      description: "Start processing with zero fees from day one. Your customers choose cash or card — and you keep every dollar either way. No monthly fees, no contracts, no surprises.",
      details: [
        "Zero processing fees — forever",
        "Zero monthly fees or hidden charges",
        "Cancel anytime — no contracts, no penalties",
      ],
      icon: DollarSign,
      image: stepKeepProfits,
      imageAlt: "Business owner keeping all profits",
    },
  ];

  const features = [
    { icon: Clock, title: "3–7 Day Setup", description: "Most businesses are live and processing within a week." },
    { icon: ShieldCheck, title: "Fully Compliant", description: "Cash Back is legal in all 50 states. We handle all disclosures." },
    { icon: CreditCard, title: "Accept All Cards", description: "Chip, swipe, tap, Apple Pay, Google Pay — all accepted." },
    { icon: BarChart3, title: "Real-Time Dashboard", description: "Track every transaction, deposit, and refund from your phone." },
    { icon: Headphones, title: "Local Hawaii Support", description: "Real people based in Hawaii. Call, text, or email anytime." },
    { icon: Users, title: "No Contracts", description: "We earn your business every month. Leave whenever you want." },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-10 sm:pt-36 sm:pb-16">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/8 via-primary/3 to-transparent" />
          <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-primary/10 blur-[120px]" />
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div variants={fadeUp}>
              <Badge variant="outline" className="mb-4 text-primary border-primary/30 bg-primary/5">
                <Zap className="w-3 h-3 mr-1" />
                Simple 3-Step Process
              </Badge>
            </motion.div>
            <motion.h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-5" variants={fadeUp}>
              How <span className="text-primary">TechSavvy</span> Works
            </motion.h1>
            <motion.p className="text-sm sm:text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto" variants={fadeUp}>
              Three steps to eliminate your processing fees. We handle everything — you just keep making money.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Button size="lg" asChild>
                <a href="#steps">
                  See the Steps
                  <ArrowRight className="w-4 h-4" />
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 sm:py-24" id="steps">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20 sm:space-y-28">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6 }}
              >
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <step.icon className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-5xl font-extrabold text-primary/15">{step.num}</span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-4">{step.title}</h2>
                  <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-6">{step.description}</p>
                  <ul className="space-y-3">
                    {step.details.map((d) => (
                      <li key={d} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <span className="text-foreground/90">{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                  <div className="rounded-2xl overflow-hidden border border-border/30 bg-muted/10">
                    <img src={step.image} alt={step.imageAlt} className="w-full aspect-[4/3] object-cover" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 sm:py-24 relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-card/50 via-transparent to-card/50" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
            <motion.div className="text-center mb-10 sm:mb-14" variants={fadeUp}>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
                Everything You Need. <span className="text-primary">Nothing You Don't.</span>
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((f) => (
                <motion.div key={f.title} variants={fadeUp}>
                  <Card className="h-full border-border/50">
                    <CardContent className="p-6">
                      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                        <f.icon className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="font-bold mb-2">{f.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 sm:py-24 relative" id="contact-form">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContactForm />
        </div>
      </section>
    </Layout>
  );
}

function ContactForm() {
  const [formData, setFormData] = useState({ businessName: "", contactName: "", phone: "", email: "", plan: "savings-estimate", highRisk: false, monthlyProcessing: "", bestContactTime: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expanded && formData.contactName && formData.phone) {
      setExpanded(true);
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact-leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      if (!res.ok) { const data = await res.json(); throw new Error(data.error || "Failed to submit"); }
      setSubmitted(true);
    } catch (err: any) { setError(err.message || "Something went wrong."); } finally { setSubmitting(false); }
  };
  const set = (field: string, value: string | boolean) => setFormData((prev) => ({ ...prev, [field]: value }));

  if (submitted) {
    return (
      <Card className="border-primary/20">
        <CardContent className="p-8 sm:p-12 text-center">
          <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-4">
            <Check className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">Mahalo! We're On It 🤙</h2>
          <p className="text-muted-foreground">We'll review your info and reach out with your savings estimate. Usually within a few hours.</p>
        </CardContent>
      </Card>
    );
  }

  const inputClass = "flex h-11 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30";

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
          Find out how much{" "}
          <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">you're losing.</span>
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Free. No commitment. Just your name and number to start.
        </p>
      </div>

      <Card className="border-primary/15">
        <CardContent className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Your Name *</label>
                <input required value={formData.contactName} onChange={(e) => set("contactName", e.target.value)} placeholder="First & Last Name" className={inputClass} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Phone *</label>
                <input type="tel" required value={formData.phone} onChange={(e) => set("phone", e.target.value)} placeholder="(808) 555-1234" className={inputClass} />
              </div>
            </div>

            {expanded && (
              <>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Email</label>
                  <input type="email" value={formData.email} onChange={(e) => set("email", e.target.value)} placeholder="you@business.com (optional)" className={inputClass} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Business Name</label>
                  <input value={formData.businessName} onChange={(e) => set("businessName", e.target.value)} placeholder="Your business name (optional)" className={inputClass} />
                </div>
              </>
            )}

            {error && <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-sm text-destructive">{error}</div>}

            <Button type="submit" size="lg" className="w-full text-base" disabled={submitting}>
              {submitting ? "Submitting..." : expanded ? "Get My Free Analysis" : "Next — Almost Done"}
              {!submitting && <ArrowRight className="w-4 h-4" />}
            </Button>

            <p className="text-[10px] text-muted-foreground text-center">
              No spam. No pressure. We'll reach out with your personalized savings number.
            </p>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
