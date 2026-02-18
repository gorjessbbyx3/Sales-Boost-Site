import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Gift, ArrowRight, Check, Users, DollarSign, Heart,
  Phone, Mail, Building, User, MessageSquare, Sparkles,
  HandshakeIcon, Star, ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { fadeUp, staggerContainer } from "@/lib/animations";
import Layout from "@/components/layout";
import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";

function ReferralHero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-6 sm:pt-36 sm:pb-10">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/8 via-primary/3 to-transparent" />
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          <motion.div variants={fadeUp}>
            <Badge variant="outline" className="mb-5 text-primary border-primary/30 bg-primary/5">
              <Gift className="w-3 h-3 mr-1.5" />
              Referral Program
            </Badge>
          </motion.div>
          <motion.h1
            className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1] mb-4 sm:mb-5"
            variants={fadeUp}
          >
            Know a Business That's{" "}
            <span className="bg-gradient-to-r from-primary to-emerald-300 bg-clip-text text-transparent">
              Overpaying on Fees?
            </span>
          </motion.h1>
          <motion.p
            className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            variants={fadeUp}
          >
            You don't need to own a business to help one save thousands. Refer a local business to TechSavvy and we'll take care of the rest — they save money, and you get rewarded.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      icon: Users,
      title: "Tell Us About Them",
      description: "Fill out the quick form below with the business name and any contact info you have. That's it — takes 60 seconds.",
    },
    {
      icon: Phone,
      title: "We Reach Out",
      description: "Our team contacts the business, introduces ourselves, and offers a free savings analysis on their current processing fees.",
    },
    {
      icon: DollarSign,
      title: "They Save, You're Rewarded",
      description: "If they sign up, they start saving immediately — and we send you a thank-you reward for the introduction.",
    },
  ];

  return (
    <section className="py-10 sm:py-16 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-10"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.h2 className="text-xl sm:text-3xl font-extrabold tracking-tight mb-3" variants={fadeUp}>
            How It Works
          </motion.h2>
          <motion.p className="text-muted-foreground text-sm sm:text-base" variants={fadeUp}>
            Three simple steps. No selling required.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {steps.map((step, i) => (
            <motion.div key={i} variants={fadeUp}>
              <Card className="h-full overflow-visible border-primary/10 relative">
                <div className="absolute -top-3 -left-1 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </div>
                <CardContent className="p-5 sm:p-6 pt-6">
                  <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center mb-3">
                    <step.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function WhoToRefer() {
  const types = [
    { icon: "🍕", label: "Restaurants & cafes" },
    { icon: "💇", label: "Salons & barbershops" },
    { icon: "🔧", label: "Auto shops & repair" },
    { icon: "🛍️", label: "Retail stores" },
    { icon: "🏥", label: "Medical & dental offices" },
    { icon: "🏋️", label: "Gyms & fitness studios" },
    { icon: "🌺", label: "Tourism & activities" },
    { icon: "🧹", label: "Cleaning & services" },
  ];

  return (
    <section className="py-10 sm:py-16 relative">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-card/30 to-transparent" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.h2 className="text-xl sm:text-3xl font-extrabold tracking-tight mb-3" variants={fadeUp}>
            Who Can You Refer?
          </motion.h2>
          <motion.p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto" variants={fadeUp}>
            Any local business that accepts credit card payments. If they're paying processing fees, we can probably eliminate them.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {types.map((t, i) => (
            <motion.div key={i} variants={fadeUp}>
              <Card className="overflow-visible border-primary/10 hover:border-primary/30 transition-colors">
                <CardContent className="p-4 flex items-center gap-3">
                  <span className="text-xl">{t.icon}</span>
                  <span className="text-sm font-medium text-foreground">{t.label}</span>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ReferralForm() {
  const [formData, setFormData] = useState({
    referrerName: "",
    referrerEmail: "",
    referrerPhone: "",
    businessName: "",
    businessOwner: "",
    businessPhone: "",
    businessEmail: "",
    businessType: "",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiRequest("POST", "/api/referrals/public", formData);
    } catch {}
    setSubmitting(false);
    setSubmitted(true);
  };

  const inputClasses = "w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";

  return (
    <section id="refer" className="py-10 sm:py-16 relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-primary/8 blur-[120px]" />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.h2 className="text-xl sm:text-3xl font-extrabold tracking-tight mb-3" variants={fadeUp}>
            Refer a{" "}
            <span className="bg-gradient-to-r from-primary to-emerald-300 bg-clip-text text-transparent">
              Business Now
            </span>
          </motion.h2>
          <motion.p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto" variants={fadeUp}>
            Just tell us who they are — we handle everything from here. The more info you can give us, the better, but even just a business name helps.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="overflow-visible border-primary/10">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-primary/5 to-transparent" />
            <CardContent className="p-7 sm:p-10 relative">
              {submitted ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-5">
                    <Heart className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    Thank You for the Referral!
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    We'll reach out to them within 24 hours. You're helping a local business save thousands — that's a big deal.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          referrerName: formData.referrerName,
                          referrerEmail: formData.referrerEmail,
                          referrerPhone: formData.referrerPhone,
                          businessName: "", businessOwner: "", businessPhone: "",
                          businessEmail: "", businessType: "", notes: "",
                        });
                      }}
                    >
                      <Gift className="w-4 h-4 mr-1.5" />
                      Refer Another Business
                    </Button>
                    <Button asChild>
                      <Link href="/contact">
                        Own a Business? Get a Quote
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* About You */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
                        <User className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground text-sm">About You</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">Your Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.referrerName}
                          onChange={e => setFormData({ ...formData, referrerName: e.target.value })}
                          className={inputClasses}
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">Your Email</label>
                        <input
                          type="email"
                          value={formData.referrerEmail}
                          onChange={e => setFormData({ ...formData, referrerEmail: e.target.value })}
                          className={inputClasses}
                          placeholder="you@email.com"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">Your Phone</label>
                        <input
                          type="tel"
                          value={formData.referrerPhone}
                          onChange={e => setFormData({ ...formData, referrerPhone: e.target.value })}
                          className={inputClasses}
                          placeholder="(808) 555-1234"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Business You're Referring */}
                  <div className="pt-2 border-t border-border/50">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
                        <Building className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground text-sm">Business You're Referring</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-foreground mb-1.5 block">Business Name *</label>
                          <input
                            type="text"
                            required
                            value={formData.businessName}
                            onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                            className={inputClasses}
                            placeholder="Their business name"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-foreground mb-1.5 block">Owner's Name</label>
                          <input
                            type="text"
                            value={formData.businessOwner}
                            onChange={e => setFormData({ ...formData, businessOwner: e.target.value })}
                            className={inputClasses}
                            placeholder="Owner or manager name"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-foreground mb-1.5 block">Business Phone</label>
                          <input
                            type="tel"
                            value={formData.businessPhone}
                            onChange={e => setFormData({ ...formData, businessPhone: e.target.value })}
                            className={inputClasses}
                            placeholder="(808) 555-5678"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-foreground mb-1.5 block">Business Email</label>
                          <input
                            type="email"
                            value={formData.businessEmail}
                            onChange={e => setFormData({ ...formData, businessEmail: e.target.value })}
                            className={inputClasses}
                            placeholder="owner@business.com"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">Business Type</label>
                        <select
                          value={formData.businessType}
                          onChange={e => setFormData({ ...formData, businessType: e.target.value })}
                          className={inputClasses}
                        >
                          <option value="">Select type...</option>
                          <option value="restaurant">Restaurant / Food Service</option>
                          <option value="retail">Retail Store</option>
                          <option value="salon">Salon / Beauty</option>
                          <option value="auto">Auto / Repair</option>
                          <option value="professional">Professional Services</option>
                          <option value="medical">Medical / Dental</option>
                          <option value="fitness">Gym / Fitness</option>
                          <option value="tourism">Tourism / Activities</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">
                          Anything else we should know?
                        </label>
                        <textarea
                          rows={3}
                          value={formData.notes}
                          onChange={e => setFormData({ ...formData, notes: e.target.value })}
                          className={`${inputClasses} resize-none`}
                          placeholder="How do you know them? Any details that would help us reach out? (e.g. 'Tell them Sarah sent you', 'They use Square right now', 'Best to call mornings')"
                        />
                      </div>
                    </div>
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                    {submitting ? "Submitting..." : "Send My Referral"}
                    {!submitting && <ArrowRight className="w-4 h-4" />}
                  </Button>

                  <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-primary" />
                      <span>We never spam or cold-call</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-primary" />
                      <span>Professional, friendly outreach</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-primary" />
                      <span>Your info stays private</span>
                    </div>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

function PartnerCTA() {
  return (
    <section className="py-10 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="overflow-visible border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-primary/5">
            <CardContent className="p-6 sm:p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">
                Want to Make It a Side Income?
              </h3>
              <p className="text-sm text-muted-foreground max-w-lg mx-auto mb-5 leading-relaxed">
                If you regularly connect with business owners — as a realtor, accountant, consultant, or community leader — our Referral Partner Program pays real commissions. Earn up to 100% of the first month's revenue per referral.
              </p>
              <Button asChild>
                <Link href="/partner-agreement">
                  Learn About Partner Commissions
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

export default function ReferralPage() {
  useSEO({
    title: "Refer a Business | TechSavvy Hawaii Referral Program",
    description: "Know a local business overpaying on credit card processing fees? Refer them to TechSavvy Hawaii — they save thousands, and you get rewarded. No business ownership required.",
    keywords: "refer a business, TechSavvy referral, Hawaii merchant services referral, payment processing referral program",
    canonical: "https://techsavvyhawaii.com/refer",
  });

  return (
    <Layout>
      <ReferralHero />
      <HowItWorks />
      <WhoToRefer />
      <ReferralForm />
      <PartnerCTA />
    </Layout>
  );
}
