import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Zap,
  ArrowRight,
  Check,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  Clock,
} from "lucide-react";
import { useState } from "react";
import { fadeUp, staggerContainer } from "@/lib/animations";
import Layout from "@/components/layout";

function FAQSection() {
  const faqs = [
    {
      q: "How does zero-fee payment processing work?",
      a: "Instead of the merchant paying 2-4% processing fees on every sale, a small surcharge is passed to the customer at checkout. The merchant keeps 100% of the sale amount — deposited into their account by the next business day, with no deductions.",
    },
    {
      q: "What does the terminal include?",
      a: "Your terminal accepts chip, swipe, and contactless/NFC tap payments, plus online payment gateway access. Full setup, programming, training, compliance signage, and a free statement analysis are all included.",
    },
    {
      q: "What are the pricing options?",
      a: "Option 1: Purchase outright for $399 — best value, you own it immediately. Option 2: Try free for 30 days, then $599 if you keep it. Both options come with zero monthly fees and zero processing fees forever. Retail terminals sell for $800+.",
    },
    {
      q: "Are there any monthly fees or contracts?",
      a: "No. There are zero monthly fees, zero contracts, and zero commitments. Whether you purchase outright ($399) or keep after a trial ($599), your ongoing cost is $0.",
    },
    {
      q: "How long does setup take?",
      a: "Setup can be completed the same day. We configure your terminal, connect it to your bank, and train you on how to use it so you can start accepting payments immediately.",
    },
    {
      q: "When do I receive my funds?",
      a: "Funds are deposited to your bank account by the next business day. You can track all deposits and transactions through your real-time dashboard.",
    },
    {
      q: "Do you accept high-risk merchants?",
      a: "Yes. We specialize in high-risk merchant accounts including CBD, vape, firearms, nutraceuticals, travel, online gaming, adult entertainment, and more. Same zero-fee processing, no excessive reserves, and fast approvals.",
    },
    {
      q: "Won't customers be upset about the surcharge?",
      a: "Most businesses are surprised by how smoothly it goes. About 90% of customers already pay by card and expect the listed price. Gas stations have done this for decades. We also help you frame it as a 'cash discount' — rewarding cash payers — which customers respond to positively. Professional signage we provide makes it feel standard.",
    },
    {
      q: "How does the 30-day trial work?",
      a: "We loan you a terminal for 30 days with live processing — real transactions, real deposits. If you love it (most do), your terminal auto-purchases at $599 on day 31. If not, return it — we cover return shipping or you can drop it off locally in Honolulu. Only 4 trial spots available per month.",
    },
    {
      q: "Do I need a minimum sales volume?",
      a: "Yes — we require a minimum of $5,000-$10,000 in monthly processing volume to qualify. This ensures the zero-fee model delivers meaningful savings for your business.",
    },
    {
      q: "Does Edify offer website design for Hawai'i businesses?",
      a: "Yes. Every Edify payment processing merchant gets a free custom-built business website — no templates, no extra cost. We also offer premium website packages with e-commerce integration, online ordering, booking systems, and custom software. All websites are mobile-optimized, SEO-ready, and built to help your Hawai'i business get found online.",
    },
    {
      q: "What areas in Hawai'i does Edify serve?",
      a: "We serve businesses across all Hawaiian Islands — O'ahu (Honolulu, Kailua, Pearl City), Maui (Kahului, Lahaina, Kihei), the Big Island (Kona, Hilo), Kaua'i, Moloka'i, and Lana'i. We offer same-day setup with remote training, and on-site support is available in the Honolulu area.",
    },
    {
      q: "Is the surcharge legal in Hawai'i?",
      a: "Yes. Surcharging is legal in Hawai'i and fully compliant with Visa and Mastercard rules. We handle all the compliance requirements — signage, receipt disclosures, and card brand registration — so your business is always in the clear.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      id="faq"
      className="relative pt-20 pb-10 sm:pt-36 sm:pb-20"
      data-testid="section-faq"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-14"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeUp}>
            <Badge variant="outline" className="mb-5 text-primary border-primary/30 bg-primary/5">
              FAQ
            </Badge>
          </motion.div>
          <motion.h1
            className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3 sm:mb-5"
            variants={fadeUp}
            data-testid="text-faq-title"
          >
            Common Questions
          </motion.h1>
          <motion.p
            className="text-muted-foreground text-lg"
            variants={fadeUp}
          >
            Everything you need to know about our payment processing and website design services.
          </motion.p>
        </motion.div>

        <motion.div
          className="space-y-3"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {faqs.map((faq, i) => (
            <motion.div key={i} variants={fadeUp}>
              <Card
                className="overflow-visible cursor-pointer hover-elevate border-primary/5"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                data-testid={`button-faq-${i}`}
              >
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-semibold text-sm sm:text-base text-foreground" data-testid={`text-faq-q-${i}`}>
                      {faq.q}
                    </h3>
                    <ChevronRight
                      className={`w-4 h-4 text-primary shrink-0 mt-0.5 transition-transform duration-200 ${
                        openIndex === i ? "rotate-90" : ""
                      }`}
                    />
                  </div>
                  {openIndex === i && (
                    <motion.p
                      className="text-muted-foreground text-sm mt-4 leading-relaxed"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      data-testid={`text-faq-a-${i}`}
                    >
                      {faq.a}
                    </motion.p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    businessType: "",
    monthlyVolume: "",
    interest: "bundle-terminal",
    hasWebsite: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-20 sm:py-24 relative" data-testid="section-contact">
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
            <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 px-3 py-1">
              <ShieldCheck className="w-3.5 h-3.5 mr-2" />
              Secure Form
            </Badge>
          </motion.div>
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mt-6 mb-6"
            variants={fadeUp}
            data-testid="text-contact-title"
          >
            Get Your Free Mockup +{" "}
            <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
              Savings Analysis
            </span>
          </motion.h2>
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
              <div className="text-sm text-muted-foreground">Mon–Fri: 8 AM – 5 PM</div>
              <div className="text-sm text-muted-foreground">Sat–Sun: Closed</div>
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
              <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-primary/5 to-transparent" />
              <CardContent className="p-6 sm:p-10 relative">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-500">
                      <Check className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-4" data-testid="text-contact-success">
                      Mahalo! We've Received Your Request.
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                      Our team is already working on your personalized website mockup and savings analysis. We'll be in touch within one business day.
                    </p>
                    <Button variant="outline" className="mt-8" onClick={() => setSubmitted(false)}>
                      Send Another Request
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6" data-testid="form-contact">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground ml-1">
                          Full Name
                        </label>
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
                        <label className="text-sm font-bold text-foreground ml-1">
                          Business Name
                        </label>
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
                        <label className="text-sm font-bold text-foreground ml-1">
                          Email Address
                        </label>
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
                        <label className="text-sm font-bold text-foreground ml-1">
                          Phone Number
                        </label>
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
                        <label className="text-sm font-bold text-foreground ml-1">
                          Monthly Sales Volume
                        </label>
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
                        <label className="text-sm font-bold text-foreground ml-1">
                          I'm Interested In
                        </label>
                        <select
                          value={formData.interest}
                          onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                          className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none appearance-none"
                          data-testid="select-contact-interest"
                        >
                          <option value="bundle-terminal">Terminal + Free Website</option>
                          <option value="bundle-trial">30-Day Risk-Free Trial</option>
                          <option value="online-only">Online-Only Package (FREE)</option>
                          <option value="high-risk">High-Risk Merchant Account</option>
                          <option value="questions">Just Have Questions</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground ml-1">
                        Any specific requirements?
                      </label>
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
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

export default function ContactPage() {
  return (
    <Layout>
      <FAQSection />
      <ContactSection />
    </Layout>
  );
}
