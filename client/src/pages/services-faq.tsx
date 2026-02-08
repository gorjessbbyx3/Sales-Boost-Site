import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  CreditCard,
  Zap,
  Globe,
  ShieldCheck,
  Check,
  ArrowRight,
  ChevronRight,
  Phone,
  Mail,
  Clock,
  MapPin,
  Star,
  Users,
  Award,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { fadeUp, staggerContainer, scaleIn } from "@/lib/animations";
import Layout from "@/components/layout";
import { Link } from "wouter";

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
      a: "Option 1: Purchase outright for $399 — best value, you own it immediately. Option 2: Try free for 30 days, then $599 if you keep it. Both options come with zero monthly fees and zero processing fees forever.",
    },
    {
      q: "Are there any monthly fees or contracts?",
      a: "No. There are zero monthly fees, zero contracts, and zero commitments.",
    },
    {
      q: "How long does setup take?",
      a: "Setup can be completed the same day. We configure your terminal, connect it to your bank, and train you so you can start accepting payments immediately.",
    },
    {
      q: "Do you accept high-risk merchants?",
      a: "Yes. We specialize in high-risk merchant accounts including CBD, vape, firearms, and more. Same zero-fee processing and fast approvals.",
    },
    {
      q: "Won't customers be upset about the surcharge?",
      a: "Most businesses find it goes smoothly. We provide compliance signage and help frame it as a 'cash discount', which customers respond to positively.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 relative bg-muted/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-14"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={fadeUp}>
            <Badge variant="outline" className="mb-5 text-primary border-primary/30 bg-primary/5">
              FAQ
            </Badge>
          </motion.div>
          <motion.h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-5" variants={fadeUp}>
            Common Questions
          </motion.h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div key={i} variants={fadeUp}>
              <Card
                className="overflow-visible cursor-pointer hover-elevate border-primary/5"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-semibold text-foreground">{faq.q}</h3>
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
                    >
                      {faq.a}
                    </motion.p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewsSection() {
  const reviews = [
    {
      name: "Lisa K.",
      role: "Owner, Aloha Beauty Salon",
      content: "Switching to Edify saved me over $400 a month in fees. The free website they built is beautiful and my customers love the new terminal.",
      stars: 5,
    },
    {
      name: "James T.",
      role: "Manager, Kona Plate Lunch",
      content: "The zero-fee model works perfectly. Our customers haven't complained once about the surcharge, and we're keeping 100% of our sales.",
      stars: 5,
    },
    {
      name: "Kai M.",
      role: "Owner, Maui Adventure Tours",
      content: "Finally, a processor that understands Hawai'i businesses. Same-day setup and the local support is unbeatable.",
      stars: 5,
    },
  ];

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <Badge variant="outline" className="mb-4 text-primary border-primary/30 bg-primary/5">
            Testimonials
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold">What Local Businesses Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((r, i) => (
            <Card key={i} className="border-primary/10 hover-elevate">
              <CardContent className="p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(r.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground italic mb-6">"{r.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                    {r.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-sm">{r.name}</div>
                    <div className="text-xs text-muted-foreground">{r.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  const services = [
    {
      icon: CreditCard,
      title: "Zero-Fee Processing",
      description: "Keep 100% of every sale. No processing fees, no monthly fees, and no contracts.",
    },
    {
      icon: Globe,
      title: "Free Custom Website",
      description: "Every merchant gets a professional, mobile-optimized business website included.",
    },
    {
      icon: ShieldCheck,
      title: "High-Risk Merchant Accounts",
      description: "Fast approvals for CBD, vape, and other high-risk industries with zero-fee processing.",
    },
    {
      icon: Zap,
      title: "Same-Day Setup",
      description: "Start accepting payments today with our easy-to-use terminals and local support.",
    },
  ];

  return (
    <section className="py-20 relative bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <Badge variant="outline" className="mb-4 text-primary border-primary/30 bg-primary/5">
            Our Services
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold">Everything Your Business Needs</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s, i) => (
            <Card key={i} className="border-primary/10">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <s.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ServicesFaqPage() {
  return (
    <Layout>
      <section className="pt-32 pb-16 bg-gradient-to-b from-primary/10 via-transparent to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6">
            Services & <span className="text-primary">FAQ</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Learn more about our zero-fee processing, free websites, and find answers to common questions.
          </p>
        </div>
      </section>
      <ServicesSection />
      <FAQSection />
      <ReviewsSection />
    </Layout>
  );
}
