import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Zap,
  ArrowRight,
  Check,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  MapPin,
} from "lucide-react";
import { useState } from "react";
import { fadeUp, staggerContainer } from "@/lib/animations";
import Layout from "@/components/layout";

function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    monthlyVolume: "",
    interest: "bundle-terminal",
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
              <Zap className="w-3.5 h-3.5 mr-2" />
              Free — No Commitment
            </Badge>
          </motion.div>
          <motion.h1
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mt-6 mb-6"
            variants={fadeUp}
            data-testid="text-contact-title"
          >
            Get Your Free Mockup +{" "}
            <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
              Savings Analysis
            </span>
          </motion.h1>
          <motion.p
            className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed"
            variants={fadeUp}
          >
            Our team will prepare a custom website mockup and a detailed analysis of how much you'll save by switching to zero-fee processing.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-4">
            <motion.a
              href="tel:+18087675460"
              className="flex items-center gap-3 p-4 rounded-xl border border-primary/10 bg-card/50 hover:border-primary/30 transition-all hover:shadow-md group"
              variants={fadeUp}
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Call</div>
                <div className="text-sm font-bold text-foreground">(808) 767-5460</div>
              </div>
            </motion.a>
            <motion.a
              href="mailto:edifyhawaii@gmail.com"
              className="flex items-center gap-3 p-4 rounded-xl border border-primary/10 bg-card/50 hover:border-primary/30 transition-all hover:shadow-md group"
              variants={fadeUp}
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Email</div>
                <div className="text-xs font-bold text-foreground truncate max-w-[120px]">edifyhawaii@gmail.com</div>
              </div>
            </motion.a>
            <motion.div
              className="p-4 rounded-xl border border-primary/10 bg-card/50"
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
                      Mahalo! We've Received Your Request.
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                      Our team is already working on your personalized website mockup and savings analysis. We'll be in touch within one business day.
                    </p>
                    <Button variant="outline" className="mt-8" onClick={() => setSubmitted(false)} data-testid="button-send-another">
                      Send Another Request
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
                          className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
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
                          className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                          placeholder="Business Name LLC"
                          data-testid="input-contact-business"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground ml-1">Email Address</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                          placeholder="name@company.com"
                          data-testid="input-contact-email"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground ml-1">Phone Number</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                          placeholder="(808) 000-0000"
                          data-testid="input-contact-phone"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground ml-1">Monthly Sales Volume</label>
                        <select
                          value={formData.monthlyVolume}
                          onChange={(e) => setFormData({ ...formData, monthlyVolume: e.target.value })}
                          className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none appearance-none"
                          data-testid="select-contact-volume"
                        >
                          <option value="">Select volume...</option>
                          <option value="under-5k">Under $5,000</option>
                          <option value="5k-10k">$5,000 - $10,000</option>
                          <option value="10k-25k">$10,000 - $25,000</option>
                          <option value="25k-50k">$25,000 - $50,000</option>
                          <option value="50k-100k">$50,000 - $100,000</option>
                          <option value="100k+">$100,000+</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground ml-1">I'm Interested In</label>
                        <select
                          value={formData.interest}
                          onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                          className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none appearance-none"
                          data-testid="select-contact-interest"
                        >
                          <option value="bundle-terminal">In-Store Terminal ($399)</option>
                          <option value="bundle-trial">30-Day Risk-Free Trial</option>
                          <option value="online-only">Online-Only (Free Website + Gateway)</option>
                          <option value="high-risk">High-Risk Merchant Account</option>
                          <option value="questions">Just Have Questions</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground ml-1">Any specific requirements?</label>
                      <textarea
                        rows={3}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
                        placeholder="Tell us a little more about what you need..."
                        data-testid="input-contact-message"
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full h-14 text-base shadow-xl shadow-primary/20" data-testid="button-contact-submit">
                      Get My Free Mockup + Quote
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
  return (
    <Layout>
      <ContactSection />
    </Layout>
  );
}
