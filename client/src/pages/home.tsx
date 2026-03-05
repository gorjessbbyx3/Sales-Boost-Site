import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, useInView } from "framer-motion";
import {
  Check, ArrowRight, ChevronDown, DollarSign, TrendingUp, Star,
  Phone, Headphones, MapPin, Sparkles, Calculator, ShieldCheck,
  AlertTriangle, Clock, Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { fadeUp, staggerContainer } from "@/lib/animations";
import Layout from "@/components/layout";
import { useSEO } from "@/hooks/useSEO";

// ─── Animated Counter ───────────────────────────────────────────────────────

function AnimatedCounter({ target, prefix = "", suffix = "", duration = 2 }: { target: number; prefix?: string; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView || !ref.current) return;
    let start: number; let id: number;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / (duration * 1000), 1);
      const v = Math.round((1 - Math.pow(1 - p, 3)) * target);
      if (ref.current) ref.current.textContent = `${prefix}${v.toLocaleString()}${suffix}`;
      if (p < 1) id = requestAnimationFrame(step);
    };
    id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [inView]);
  return <span ref={ref}>{prefix}0{suffix}</span>;
}

// ─── 1. Hero — Lead with pain ───────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative pt-24 pb-16 sm:pt-36 sm:pb-24 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/8 via-primary/3 to-transparent" />
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] rounded-full bg-primary/8 blur-[150px]" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="max-w-3xl mx-auto text-center" variants={staggerContainer} initial="hidden" animate="visible">
          <motion.div variants={fadeUp}>
            <Badge variant="outline" className="mb-5 text-primary border-primary/30 bg-primary/5">
              <MapPin className="w-3 h-3 mr-1" />
              Built for Hawaii Small Businesses
            </Badge>
          </motion.div>

          <motion.h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6" variants={fadeUp}>
            Credit Card Fees Are{" "}
            <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              Eating Your Profits.
            </span>
          </motion.h1>

          <motion.p className="text-lg sm:text-2xl text-muted-foreground leading-relaxed mb-4 max-w-2xl mx-auto" variants={fadeUp}>
            TechSavvy Hawaii helps local businesses eliminate processing fees with a compliant cash discount program.
          </motion.p>

          <motion.p className="text-sm sm:text-base text-muted-foreground/80 mb-10 max-w-xl mx-auto" variants={fadeUp}>
            Apply online. Once approved, we configure your POS and help you start saving.
          </motion.p>

          <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-3" variants={fadeUp}>
            <Button size="lg" className="text-base px-8 py-6 w-full sm:w-auto" asChild>
              <a href="/statement-review">
                Free AI Statement Analysis
                <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
            <Button variant="outline" size="lg" className="text-base px-6 py-6 w-full sm:w-auto" asChild>
              <a href="#calculator">
                See How Much You're Losing
                <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── 2. The Problem — How much you're losing ────────────────────────────────

function ProblemSection() {
  return (
    <section className="py-16 sm:py-24 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-5">
              Every time a customer swipes a card,{" "}
              <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">your processor takes a cut.</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-4">
              Most Hawaii business owners are paying 2–4% on every credit card transaction. That's $500–$3,000+ walking out the door every single month — money that should be going back into your business, your employees, and your family.
            </p>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-6">
              And the worst part? Most don't even realize how much they're losing because the fees are buried in confusing statements.
            </p>
            <p className="text-foreground font-bold text-lg">
              We fix that. Simply and permanently.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="grid grid-cols-1 gap-4">
              {[
                { amount: "$800", label: "Average monthly fees for a small restaurant" },
                { amount: "$1,500", label: "Average monthly fees for an auto shop" },
                { amount: "$2,400", label: "Average monthly fees for a medical office" },
              ].map((item) => (
                <Card key={item.label} className="border-red-500/15">
                  <CardContent className="p-4 sm:p-5 flex items-center gap-4">
                    <div className="text-2xl sm:text-3xl font-extrabold text-red-400 min-w-[80px]">-{item.amount}</div>
                    <div className="text-sm text-muted-foreground">{item.label}</div>
                  </CardContent>
                </Card>
              ))}
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-4 sm:p-5 flex items-center gap-4">
                  <div className="text-2xl sm:text-3xl font-extrabold text-primary min-w-[80px]">$0</div>
                  <div className="text-sm text-foreground font-medium">What you pay with TechSavvy</div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── 3. How It Works — Remove uncertainty ───────────────────────────────────

function HowItWorks() {
  const steps = [
    { num: "1", title: "Apply in 3 minutes", desc: "Quick online application. No paperwork, no fax machines. Just a few questions about your business." },
    { num: "2", title: "Get approved", desc: "Usually within 24 hours. We review your info and show you exactly how much you'll save." },
    { num: "3", title: "We set up your POS", desc: "Our local team configures your terminal, installs signage, and trains your staff. You don't touch a thing." },
    { num: "4", title: "Start saving immediately", desc: "Accept payments with $0 processing fees from day one. Keep 100% of every sale." },
  ];

  return (
    <section className="py-16 sm:py-24 relative">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-card/50 via-transparent to-card/50" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
          <motion.div className="text-center mb-10 sm:mb-16" variants={fadeUp}>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
              How It Works
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((step, i) => (
              <motion.div key={step.num} variants={fadeUp}>
                <Card className="h-full border-primary/10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/60 to-primary/20" />
                  <CardContent className="p-5 sm:p-6">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <span className="text-lg font-extrabold text-primary">{step.num}</span>
                    </div>
                    <h3 className="font-bold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div className="text-center mt-8" variants={fadeUp}>
            <Button size="lg" asChild>
              <a href="/statement-review">
                Start Your Free AI Analysis
                <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── 4. Qualify for Free Equipment ──────────────────────────────────────────

function QualifySection() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ businessType: "", volume: "", currentProcessor: "", name: "", phone: "", email: "", businessName: "" });
  const [result, setResult] = useState<"qualified" | "contact" | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const businessTypes = [
    "Restaurant / Bar", "Retail Store", "Salon / Spa", "Auto Repair",
    "Medical / Dental", "Food Truck", "Vape / CBD Shop", "Other",
  ];

  const volumes = [
    { label: "Under $5K/month", value: "under-5k", qualifies: false },
    { label: "$5K – $10K/month", value: "5k-10k", qualifies: false },
    { label: "$10K – $25K/month", value: "10k-25k", qualifies: true },
    { label: "$25K – $50K/month", value: "25k-50k", qualifies: true },
    { label: "$50K – $100K/month", value: "50k-100k", qualifies: true },
    { label: "$100K+/month", value: "100k-plus", qualifies: true },
  ];

  const processors = [
    "Square", "Clover", "Toast", "Heartland", "Bank Processor", "Not sure", "Other",
  ];

  const submitForm = async (qualified: boolean) => {
    setSubmitting(true);
    try {
      await fetch("/api/contact-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: answers.businessName || `${answers.businessType} - Equipment Qualification`,
          contactName: answers.name,
          phone: answers.phone,
          email: answers.email,
          plan: qualified ? "free-equipment-qualified" : "free-equipment-under-volume",
          monthlyProcessing: answers.volume,
          bestContactTime: "anytime",
          highRisk: false,
        }),
      });
    } catch (e) {}
    setResult(qualified ? "qualified" : "contact");
    setSubmitting(false);
  };

  const progressPercent = Math.min((step / 4) * 100, 100);

  if (result === "qualified") {
    return (
      <section className="py-16 sm:py-24" id="qualify">
        <div className="max-w-xl mx-auto px-4">
          <Card className="border-primary/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
            <CardContent className="p-8 sm:p-12 text-center relative">
              <div className="w-20 h-20 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-5">
                <Check className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-2 text-primary">You Qualify!</h2>
              <p className="text-lg font-semibold text-foreground mb-3">Your business qualifies for a free equipment upgrade.</p>
              <p className="text-muted-foreground mb-6">
                One of our local team members will reach out within 24 hours to get your new POS system set up — at no cost.
              </p>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { label: "Equipment", value: "FREE" },
                  { label: "Setup", value: "FREE" },
                  { label: "Monthly Fees", value: "$0" },
                ].map((item) => (
                  <div key={item.label} className="bg-primary/5 rounded-lg p-3">
                    <div className="text-lg font-extrabold text-primary">{item.value}</div>
                    <div className="text-[10px] text-muted-foreground">{item.label}</div>
                  </div>
                ))}
              </div>
              <img src="/images/pos-equipment.jpeg" alt="Free POS equipment" className="w-full max-w-xs mx-auto rounded-xl mb-4" />
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  if (result === "contact") {
    return (
      <section className="py-16 sm:py-24" id="qualify">
        <div className="max-w-xl mx-auto px-4">
          <Card className="border-chart-4/30 overflow-hidden">
            <CardContent className="p-8 sm:p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-chart-4/15 flex items-center justify-center mx-auto mb-5">
                <Phone className="w-8 h-8 text-chart-4" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">We'll Be In Touch!</h2>
              <p className="text-muted-foreground mb-4">
                Your business may still qualify for reduced-cost equipment or special pricing. One of our Hawaii team members will contact you within 24 hours to discuss your options.
              </p>
              <p className="text-sm text-foreground font-medium">
                We work with businesses of all sizes — there's a plan for everyone.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  const inputClass = "flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary";

  return (
    <section className="py-16 sm:py-24 relative" id="qualify">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="text-center mb-8">
            <Badge variant="outline" className="mb-4 text-primary border-primary/30 bg-primary/5">
              <Sparkles className="w-3 h-3 mr-1" />
              Free Equipment Upgrade
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
              Does your business qualify for{" "}
              <span className="text-primary">free equipment?</span>
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Answer 4 quick questions to find out. Takes about 30 seconds.
            </p>
          </div>

          <Card className="border-primary/15 overflow-hidden">
            {/* Progress bar */}
            <div className="h-1.5 bg-muted">
              <div className="h-full bg-primary transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }} />
            </div>

            <CardContent className="p-6 sm:p-8">
              {step === 0 && (
                <div>
                  <p className="text-sm font-semibold text-foreground mb-4">What type of business do you run?</p>
                  <div className="grid grid-cols-2 gap-3">
                    {businessTypes.map((biz) => (
                      <button
                        key={biz}
                        type="button"
                        onClick={() => { setAnswers(a => ({ ...a, businessType: biz })); setStep(1); }}
                        className="rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 p-3 text-sm font-medium text-foreground transition-all text-left"
                      >
                        {biz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 1 && (
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">How much do you process in card payments monthly?</p>
                  <p className="text-xs text-muted-foreground mb-4">Your best estimate is fine.</p>
                  <div className="space-y-2.5">
                    {volumes.map((vol) => (
                      <button
                        key={vol.value}
                        type="button"
                        onClick={() => { setAnswers(a => ({ ...a, volume: vol.value })); setStep(2); }}
                        className="w-full rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 p-3 text-sm font-medium text-foreground transition-all text-left"
                      >
                        {vol.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <p className="text-sm font-semibold text-foreground mb-4">Who processes your payments now?</p>
                  <div className="grid grid-cols-2 gap-3">
                    {processors.map((proc) => (
                      <button
                        key={proc}
                        type="button"
                        onClick={() => { setAnswers(a => ({ ...a, currentProcessor: proc })); setStep(3); }}
                        className="rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 p-3 text-sm font-medium text-foreground transition-all text-left"
                      >
                        {proc}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <p className="text-sm font-semibold text-foreground mb-4">Almost done — where should we send your results?</p>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Business Name</label>
                      <input value={answers.businessName} onChange={(e) => setAnswers(a => ({ ...a, businessName: e.target.value }))} placeholder="Your Business Name" className={inputClass} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Your Name *</label>
                      <input required value={answers.name} onChange={(e) => setAnswers(a => ({ ...a, name: e.target.value }))} placeholder="Full Name" className={inputClass} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Phone *</label>
                        <input type="tel" required value={answers.phone} onChange={(e) => setAnswers(a => ({ ...a, phone: e.target.value }))} placeholder="(808) 555-1234" className={inputClass} />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Email *</label>
                        <input type="email" required value={answers.email} onChange={(e) => setAnswers(a => ({ ...a, email: e.target.value }))} placeholder="you@email.com" className={inputClass} />
                      </div>
                    </div>
                    <Button
                      size="lg"
                      className="w-full"
                      disabled={!answers.name || !answers.phone || !answers.email || submitting}
                      onClick={() => {
                        const vol = volumes.find(v => v.value === answers.volume);
                        submitForm(vol?.qualifies ?? false);
                      }}
                    >
                      {submitting ? "Checking..." : "See If I Qualify"}
                      {!submitting && <ArrowRight className="w-4 h-4" />}
                    </Button>
                    <p className="text-[10px] text-muted-foreground text-center">No spam. We'll only contact you about your equipment qualification.</p>
                  </div>
                </div>
              )}

              {step > 0 && step < 4 && result === null && (
                <button onClick={() => setStep(s => s - 1)} className="mt-4 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  ← Go back
                </button>
              )}
            </CardContent>
          </Card>

          {step < 3 && (
            <div className="mt-6 text-center">
              <img src="/images/pos-equipment.jpeg" alt="Free POS equipment upgrade" className="w-full max-w-sm mx-auto rounded-xl opacity-80" />
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

// ─── 5. Savings Calculator ──────────────────────────────────────────────────

function SavingsCalculator() {
  const [volume, setVolume] = useState(25000);
  const [rate, setRate] = useState(3.3);
  const monthlyFees = volume * (rate / 100);
  const annualFees = monthlyFees * 12;
  const fmt = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  return (
    <section className="py-16 sm:py-24 relative" id="calculator">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-card/50 via-transparent to-card/50" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
          <motion.div className="text-center mb-10" variants={fadeUp}>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
              How much are you <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">throwing away</span> every month?
            </h2>
            <p className="text-muted-foreground text-sm sm:text-lg max-w-xl mx-auto">
              Slide the bar. See the number. That's real money leaving your business.
            </p>
          </motion.div>

          <motion.div variants={fadeUp}>
            <Card className="border-primary/15">
              <CardContent className="p-6 sm:p-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                  <div>
                    <div className="mb-6">
                      <label className="text-sm font-medium mb-2 block">Your monthly card sales</label>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-muted-foreground">$</span>
                        <input type="text" inputMode="numeric" value={volume.toLocaleString()} onChange={(e) => { const v = parseInt(e.target.value.replace(/[^0-9]/g, "")) || 0; setVolume(Math.min(Math.max(v, 1000), 500000)); }}
                          className="flex-1 h-10 rounded-md border border-border bg-background px-3 text-lg font-bold outline-none focus:ring-1 focus:ring-primary" />
                      </div>
                      <input type="range" min="1000" max="200000" step="1000" value={volume} onChange={(e) => setVolume(parseInt(e.target.value))}
                        className="w-full h-2 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer"
                        style={{ background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${((volume - 1000) / 199000) * 100}%, hsl(var(--muted)) ${((volume - 1000) / 199000) * 100}%, hsl(var(--muted)) 100%)` }} />
                      <div className="flex justify-between mt-1 text-xs text-muted-foreground"><span>$1K</span><span>$100K</span><span>$200K</span></div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Your current processing rate</label>
                      <div className="flex items-center gap-2">
                        <input type="number" min="1" max="6" step="0.1" value={rate} onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
                          className="w-24 h-10 rounded-md border border-border bg-background px-3 text-lg font-bold outline-none focus:ring-1 focus:ring-primary" />
                        <span className="text-muted-foreground">%</span>
                        <span className="text-xs text-muted-foreground ml-2">(most businesses pay 2.5–4%)</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center">
                    <div className="text-center p-6 rounded-xl bg-red-500/5 border border-red-500/15 mb-4">
                      <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">You're losing every year</div>
                      <div className="text-4xl sm:text-5xl font-extrabold text-red-400">{fmt(annualFees)}</div>
                    </div>
                    <div className="text-center p-6 rounded-xl bg-primary/5 border border-primary/15">
                      <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">You'd keep with TechSavvy</div>
                      <div className="text-4xl sm:text-5xl font-extrabold text-primary">{fmt(annualFees)}</div>
                    </div>
                    <div className="mt-4 text-center">
                      <Button size="lg" asChild>
                        <a href="/statement-review">
                          Get Your Free AI Analysis
                          <ArrowRight className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── 6. Competitor Comparison ───────────────────────────────────────────────

function CompareSection() {
  return (
    <section className="py-16 sm:py-24 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
          <motion.div className="text-center mb-10 sm:mb-14" variants={fadeUp}>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
              Why local businesses are switching.
            </h2>
          </motion.div>

          <motion.div variants={fadeUp}>
            <Card className="overflow-hidden border-border/50">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left p-4 font-semibold text-muted-foreground w-[28%]"></th>
                      <th className="text-center p-4 w-[24%] text-muted-foreground font-semibold">Square</th>
                      <th className="text-center p-4 w-[24%] text-muted-foreground font-semibold">Clover</th>
                      <th className="text-center p-4 w-[24%] bg-primary/5">
                        <span className="font-bold text-primary">TechSavvy</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { f: "Processing Fees", sq: "2.6–3.5%", cl: "2.3–3.5%", ts: "0%", big: true },
                      { f: "Monthly Fees", sq: "$0–$60+", cl: "$14.95–$85", ts: "$0", big: true },
                      { f: "Contracts", sq: "No", cl: "Sometimes", ts: "Never", big: false },
                      { f: "Setup Time", sq: "Medium", cl: "Medium", ts: "Fast", big: false },
                      { f: "Hardware Cost", sq: "$$$", cl: "$$$", ts: "Free*", big: false },
                      { f: "Local Hawaii Support", sq: "No", cl: "No", ts: "Yes", big: true },
                    ].map((r, i) => (
                      <tr key={r.f} className={`border-b border-border/30 ${i % 2 ? "bg-muted/10" : ""}`}>
                        <td className="p-3 sm:p-4 font-medium text-foreground/80">{r.f}</td>
                        <td className="p-3 sm:p-4 text-center text-red-400/80">{r.sq}</td>
                        <td className="p-3 sm:p-4 text-center text-red-400/80">{r.cl}</td>
                        <td className={`p-3 sm:p-4 text-center bg-primary/5 ${r.big ? "text-primary font-bold text-base sm:text-lg" : "text-primary font-semibold"}`}>{r.ts}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-2 text-[10px] text-muted-foreground border-t border-border/30">
                *Free terminal for businesses processing $5K+/month
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── 7. Who We Work With ────────────────────────────────────────────────────

function WhoWeWorkWith() {
  return (
    <section className="py-16 sm:py-24 relative">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-card/50 via-transparent to-card/50" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
          <motion.div className="text-center mb-10 sm:mb-14" variants={fadeUp}>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
              If you accept credit cards, we can save you money.
            </h2>
            <p className="text-muted-foreground text-sm sm:text-lg max-w-xl mx-auto">
              We work with all types of Hawaii businesses — from food trucks to medical offices.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              "Restaurants & Bars", "Food Trucks", "Salons & Spas", "Auto Repair Shops",
              "Retail Stores", "Medical & Dental", "Vape & CBD Shops", "Convenience Stores",
            ].map((biz) => (
              <motion.div key={biz} variants={fadeUp}>
                <Card className="border-border/50 hover:border-primary/30 transition-colors">
                  <CardContent className="p-4 sm:p-5 text-center">
                    <div className="text-sm font-semibold text-foreground/90">{biz}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <motion.p className="text-center text-muted-foreground text-sm mt-6" variants={fadeUp}>
            Plus hotels, gas stations, contractors, nonprofits, and more.{" "}
            <a href="#qualify" className="text-primary font-medium underline underline-offset-2">See if you qualify for free equipment →</a>
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

// ─── 8. Trust — Built for Hawaii ────────────────────────────────────────────

function TrustSection() {
  return (
    <section className="py-16 sm:py-24 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-5">
              Built for Hawaii.{" "}
              <span className="text-primary">Run by Hawaii.</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-6">
              We're not a mainland company with a 1-800 number. We're local. When you call, a real person from Hawaii picks up. When you need help, someone comes to your business — not an email bot.
            </p>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-8">
              Our reputation in the community is everything. That's why we never lock you in a contract — we earn your business every single month.
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                "No contracts — ever",
                "Next-day funding",
                "24/7 support",
                "Local Hawaii team",
                "Rates locked in",
                "Accept all cards",
              ].map((b) => (
                <div key={b} className="flex items-center gap-2 bg-primary/5 border border-primary/15 rounded-full px-4 py-2">
                  <Check className="w-3.5 h-3.5 text-primary" />
                  <span className="text-sm font-medium text-foreground/90">{b}</span>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 p-8 sm:p-12 text-center">
              <MapPin className="w-14 h-14 text-primary mx-auto mb-4" />
              <div className="text-2xl font-bold text-foreground mb-2">Locally Owned & Operated</div>
              <div className="text-muted-foreground mb-6">Honolulu, O'ahu · Serving all islands</div>
              <Button size="lg" variant="outline" asChild>
                <a href="tel:8087675460">
                  <Phone className="w-4 h-4" />
                  (808) 767-5460
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── 9. Testimonials ────────────────────────────────────────────────────────

function TestimonialSection() {
  const testimonials = [
    { name: "Restaurant Owner", loc: "Waikiki", quote: "We were losing over $1,200 a month and didn't even know it. TechSavvy showed us the numbers and switched us over in a week. Best business decision we made this year." },
    { name: "Nail Salon Owner", loc: "Kailua", quote: "Switching was so easy. TechSavvy's local team set everything up and we got a new terminal for free. The savings are real — we see it every month." },
    { name: "Eye Care Associates", loc: "Ala Moana", quote: "Their customer service is incredible. Whenever we need help, they pick up the phone. No runaround, no waiting on hold. Highly recommend." },
    { name: "Spa Owner", loc: "Waikiki", quote: "Great rates, great service, and the equipment was free. I tell every business owner I know about TechSavvy." },
  ];

  return (
    <section className="py-16 sm:py-24 relative">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-card/50 via-transparent to-card/50" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
          <motion.div className="text-center mb-10 sm:mb-14" variants={fadeUp}>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
              Hawaii business owners who stopped losing money.
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {testimonials.map((t, i) => (
              <motion.div key={i} variants={fadeUp}>
                <Card className="h-full border-border/50">
                  <CardContent className="p-5 sm:p-7">
                    <div className="flex items-center gap-0.5 mb-3">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm text-foreground/90 leading-relaxed mb-4">"{t.quote}"</p>
                    <div className="font-semibold text-sm text-foreground">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.loc}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── 10. FAQ — Address fears ────────────────────────────────────────────────

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);
  const faqs = [
    { q: "Is this actually legal?", a: "Yes — 100% legal in Hawaii and all 50 states. Visa, Mastercard, and the FTC all allow it when properly disclosed. We handle all the compliance and signage for you." },
    { q: "Will my customers get mad about the surcharge?", a: "Most don't even notice. It's the same model gas stations have used for years — cash price vs. card price. It's now standard at restaurants, salons, and retail stores across Hawaii." },
    { q: "Is it hard to switch processors?", a: "Not at all. We handle everything — terminal, programming, signage, training. Most businesses are up and running in 3–7 days. You don't cancel your old processor until you're ready." },
    { q: "How much will I actually save?", a: "That depends on your volume, but most Hawaii businesses save $500–$3,000+ per month. We'll show you your exact number with a free statement analysis — no commitment required." },
    { q: "What if I don't like it?", a: "No contract. No cancellation fee. If it's not working for you, you can leave anytime with zero penalty. We keep businesses by saving them money, not by trapping them." },
    { q: "Do I have to buy the terminal?", a: "If you process $5K+ per month, the terminal is free. We ship it, set it up, and train your team. You don't pay a dime for equipment." },
  ];

  return (
    <section className="py-16 sm:py-24 relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
          <motion.div className="text-center mb-10 sm:mb-14" variants={fadeUp}>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Questions you're probably thinking.
            </h2>
          </motion.div>
          <motion.div className="space-y-3" variants={fadeUp}>
            {faqs.map((faq, i) => (
              <Card key={i} className="border-border/50 overflow-hidden cursor-pointer" onClick={() => setOpen(open === i ? null : i)}>
                <CardContent className="p-0">
                  <button className="w-full p-5 flex items-center justify-between text-left">
                    <span className="font-bold text-foreground pr-4">{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`} />
                  </button>
                  {open === i && (
                    <div className="px-5 pb-5 -mt-1">
                      <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── 11. Contact Form ───────────────────────────────────────────────────────

function ContactFormSection() {
  const [formData, setFormData] = useState({ businessName: "", contactName: "", phone: "", email: "", plan: "savings-estimate", highRisk: false, monthlyProcessing: "", bestContactTime: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      <section className="py-16 sm:py-24" id="contact-form">
        <div className="max-w-xl mx-auto px-4">
          <Card className="border-primary/20">
            <CardContent className="p-8 sm:p-12 text-center">
              <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-4">
                <Check className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">We'll Be In Touch!</h2>
              <p className="text-muted-foreground">We'll review your info and reach out with your savings estimate. Usually within a few hours. Mahalo!</p>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  const inputClass = "flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary";

  return (
    <section className="py-16 sm:py-24 relative" id="contact-form">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
              Find out how much{" "}
              <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">you're losing.</span>
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Free. No commitment. We just show you the number.
            </p>
          </div>

          <Card className="border-primary/15">
            <CardContent className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Business Name *</label>
                  <input required value={formData.businessName} onChange={(e) => set("businessName", e.target.value)} placeholder="Your Business Name" className={inputClass} />
                </div>
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
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Email *</label>
                  <input type="email" required value={formData.email} onChange={(e) => set("email", e.target.value)} placeholder="you@business.com" className={inputClass} />
                </div>

                {error && <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-sm text-destructive">{error}</div>}

                <Button type="submit" size="lg" className="w-full text-base" disabled={submitting}>
                  {submitting ? "Submitting..." : "Get My Free AI Analysis"}
                  {!submitting && <ArrowRight className="w-4 h-4" />}
                </Button>

                <p className="text-[10px] text-muted-foreground text-center">
                  No spam. No pressure. We'll reach out with your personalized savings number.
                </p>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Page Export ─────────────────────────────────────────────────────────────

export default function Home() {
  useSEO({
    title: "Credit Card Fees Are Eating Your Profits | TechSavvy Hawaii",
    description: "TechSavvy Hawaii helps local businesses eliminate processing fees with a compliant cash discount program. Apply online, get approved in 24 hours, start saving immediately. No contracts.",
    keywords: "stop paying credit card fees Hawaii, save money processing fees Honolulu, zero fee payment processing, Hawaii small business payment processor, no contract merchant services, TechSavvy Hawaii",
    canonical: "https://techsavvyhawaii.com/",
    ogImage: "https://techsavvyhawaii.com/images/hero-hawaii-sunset.jpg",
  });

  return (
    <Layout>
      <HeroSection />
      <HowItWorks />
      <SavingsCalculator />
      <ProblemSection />
      <QualifySection />
      <CompareSection />
      <WhoWeWorkWith />
      <TrustSection />
      <TestimonialSection />
      <FAQSection />
      <ContactFormSection />
    </Layout>
  );
}
