import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  MapPin,
  CalendarCheck,
} from "lucide-react";
import { useState, useMemo } from "react";
import { fadeUp, staggerContainer } from "@/lib/animations";
import Layout from "@/components/layout";
import { useSEO } from "@/hooks/useSEO";

function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    monthlyVolume: "",
    interest: "in-store-terminal",
    preferredTime: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="pt-32 pb-20 relative" data-testid="section-contact">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-primary/8 blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-14"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.div className="flex flex-wrap items-center justify-center gap-3" variants={fadeUp}>
            <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5 px-3 py-1">
              <CalendarCheck className="w-3.5 h-3.5 mr-2" />
              Free Consultation
            </Badge>
          </motion.div>
          <motion.h1
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mt-6 mb-6"
            variants={fadeUp}
            data-testid="text-contact-title"
          >
            Schedule a{" "}
            <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
              Call
            </span>
          </motion.h1>
          <motion.p
            className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed"
            variants={fadeUp}
          >
            Fill out the form and our team will reach out to discuss how zero-fee processing can work for your business.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-4">
            <motion.a
              href="tel:+18087675460"
              className="flex items-center gap-3 p-4 rounded-md border border-primary/10 bg-card/50 hover-elevate group"
              variants={fadeUp}
            >
              <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Call</div>
                <div className="text-sm font-bold text-foreground">(808) 767-5460</div>
              </div>
            </motion.a>
            <motion.a
              href="mailto:edifyhawaii@gmail.com"
              className="flex items-center gap-3 p-4 rounded-md border border-primary/10 bg-card/50 hover-elevate group"
              variants={fadeUp}
            >
              <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Email</div>
                <div className="text-xs font-bold text-foreground truncate max-w-[120px]">edifyhawaii@gmail.com</div>
              </div>
            </motion.a>
            <motion.div
              className="p-4 rounded-md border border-primary/10 bg-card/50"
              variants={fadeUp}
            >
              <div className="flex items-center gap-3 mb-3">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-wider">Hours</span>
              </div>
              <div className="text-sm text-muted-foreground">Mon-Fri: 8 AM - 5 PM</div>
              <div className="text-sm text-muted-foreground">Sat-Sun: Closed</div>
            </motion.div>
          </div>

          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="overflow-visible border-primary/10 shadow-xl shadow-primary/5">
              <CardContent className="p-6 sm:p-10 relative">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                      <Check className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-4" data-testid="text-contact-success">
                      Mahalo! We'll Be in Touch Soon.
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                      Our team will call you at your preferred time to discuss zero-fee processing for your business. Expect to hear from us within one business day.
                    </p>
                    <Button variant="outline" className="mt-8" onClick={() => setSubmitted(false)} data-testid="button-send-another">
                      Submit Another Request
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6" data-testid="form-contact">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground ml-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full rounded-md border border-border bg-background/50 px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                          placeholder="Your Name"
                          data-testid="input-contact-name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground ml-1">Business Name</label>
                        <input
                          type="text"
                          required
                          value={formData.businessName}
                          onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                          className="w-full rounded-md border border-border bg-background/50 px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                          placeholder="Business Name LLC"
                          data-testid="input-contact-business"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground ml-1">Phone Number</label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full rounded-md border border-border bg-background/50 px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                          placeholder="(808) 000-0000"
                          data-testid="input-contact-phone"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground ml-1">Email Address</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full rounded-md border border-border bg-background/50 px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                          placeholder="name@company.com"
                          data-testid="input-contact-email"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground ml-1">I'm Interested In</label>
                        <select
                          value={formData.interest}
                          onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                          className="w-full rounded-md border border-border bg-background/50 px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none appearance-none"
                          data-testid="select-contact-interest"
                        >
                          <option value="in-store-terminal">In-Store Terminal ($399)</option>
                          <option value="30-day-trial">30-Day Free Trial</option>
                          <option value="online-only">Online-Only (Free Website + Gateway)</option>
                          <option value="high-risk">High-Risk Merchant Account</option>
                          <option value="questions">Just Have Questions</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground ml-1">Best Time to Call</label>
                        <select
                          value={formData.preferredTime}
                          onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                          className="w-full rounded-md border border-border bg-background/50 px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none appearance-none"
                          data-testid="select-contact-preferred-time"
                        >
                          <option value="">Select a time...</option>
                          <option value="morning">Morning (8 AM - 11 AM)</option>
                          <option value="midday">Midday (11 AM - 1 PM)</option>
                          <option value="afternoon">Afternoon (1 PM - 5 PM)</option>
                          <option value="asap">Call Me ASAP</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground ml-1">Anything else we should know?</label>
                      <textarea
                        rows={3}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full rounded-md border border-border bg-background/50 px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
                        placeholder="Tell us a little more about your business..."
                        data-testid="input-contact-message"
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full h-14 text-base shadow-xl shadow-primary/20" data-testid="button-contact-submit">
                      Schedule My Call
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>

                    <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
                      <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground/80">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        PCI Compliant
                      </div>
                      <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground/80">
                        <Check className="w-4 h-4 text-primary" />
                        No Commitment
                      </div>
                      <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground/80">
                        <MapPin className="w-4 h-4 text-primary" />
                        Local HI Support
                      </div>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function ContactPage() {
  const jsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact λechSavvy (TechSavvy) — Get Started with Zero-Fee Processing",
    "description": "Schedule a call or request a free statement analysis. Get started with zero-fee payment processing and a free custom website today.",
    "url": "https://techsavvyhawaii.com/contact",
    "mainEntity": { "@id": "https://techsavvyhawaii.com/#localbusiness" }
  }), []);

  useSEO({
    title: "Contact Us | Get Started with Zero-Fee Payment Processing — λechSavvy (TechSavvy)",
    description: "Contact λechSavvy (TechSavvy) to get started with zero-fee payment processing. Schedule a call, request a free statement analysis, or ask about high-risk merchant accounts. Same-day setup available. Phone: (808) 767-5460. Free custom website included with every merchant account.",
    keywords: "contact payment processor, get merchant account, schedule payment processing consultation, free statement analysis, start accepting credit cards, payment processing sign up, merchant account application, get payment terminal, switch payment processor, payment processing quote, contact TechSavvy, payment processing phone number",
    canonical: "https://techsavvyhawaii.com/contact",
    ogTitle: "Contact λechSavvy — Start Zero-Fee Processing Today",
    ogDescription: "Schedule a call or get a free statement analysis. Same-day setup. Zero fees, no contracts, free website included. (808) 767-5460.",
    twitterTitle: "Contact λechSavvy (TechSavvy) — Get Started Today",
    twitterDescription: "Schedule a call for zero-fee payment processing. Same-day setup. Free website included. (808) 767-5460.",
    jsonLd,
  });

  return (
    <Layout>
      <ContactSection />
    </Layout>
  );
}
