import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  ChevronRight,
  ArrowRight,
  Star,
  HeartHandshake,
  ThumbsUp,
  Users,
  Megaphone,
} from "lucide-react";
import { useState, useMemo } from "react";
import { fadeUp, staggerContainer, scaleIn } from "@/lib/animations";
import Layout from "@/components/layout";
import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";

function FAQSection() {
  const faqs = [
    {
      q: "How does zero-fee payment processing work?",
      a: "Instead of the merchant paying 2-4% processing fees on every sale, a small surcharge is passed to the customer at checkout. The merchant keeps 100% of the sale amount — deposited into their account by the next business day, with no deductions.",
    },
    {
      q: "What does the terminal include?",
      a: "Your terminal accepts chip, swipe, and contactless/NFC tap payments. Full setup, programming, training, compliance signage, and a free statement analysis are all included. For online payments, see our Online-Only package.",
    },
    {
      q: "What are the pricing options?",
      a: "Start with a free 30-day trial — we ship you a terminal, you process with zero fees. Love it? Keep it. Not for you? Return it and we cover shipping. No contracts, no monthly fees.",
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

function CustomerPsychologySection() {
  const points = [
    {
      icon: ThumbsUp,
      title: "It's a Cash Discount, Not a Surcharge",
      description: "Frame it positively: your cash-paying customers get a discount. Card users simply pay the standard listed price. Most businesses find customers respond better to \"cash discount\" messaging.",
      stat: null,
    },
    {
      icon: Users,
      title: "~90% of Customers Pay by Card Anyway",
      description: "Studies show roughly 90% of transactions are card-based. The vast majority of your customers won't even notice — they're already paying by card and expect the listed price.",
      stat: "~90%",
      statLabel: "pay by card",
    },
    {
      icon: Megaphone,
      title: "Signage Makes It Normal",
      description: "We provide professional point-of-sale signage that clearly communicates the program. When customers see it displayed, it feels standard — because it is. Thousands of businesses across the country do this every day.",
      stat: null,
    },
    {
      icon: HeartHandshake,
      title: "Your Customers Won't Mind",
      description: "Gas stations have done this for decades. Customers understand the value exchange — and you keep every dollar of your hard-earned revenue instead of handing it to the processor.",
      stat: null,
    },
  ];

  return (
    <section className="py-12 sm:py-24 relative" data-testid="section-psychology">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] rounded-full bg-chart-2/8 blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-14"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.div variants={fadeUp}>
            <Badge variant="outline" className="mb-5 text-chart-2 border-chart-2/30 bg-chart-2/5">
              <HeartHandshake className="w-3.5 h-3.5 mr-1.5" />
              Customer-Friendly
            </Badge>
          </motion.div>
          <motion.h2
            className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3"
            variants={fadeUp}
            data-testid="text-psychology-title"
          >
            Will My Customers{" "}
            <span className="bg-gradient-to-r from-chart-2 to-primary bg-clip-text text-transparent">
              Accept This
            </span>?
          </motion.h2>
          <motion.p
            className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-lg"
            variants={fadeUp}
          >
            The short answer: yes. Here's why businesses are making the switch.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {points.map((point, i) => (
            <motion.div key={i} variants={scaleIn}>
              <Card className="h-full overflow-visible border-chart-2/10">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-chart-2/5 to-transparent" />
                <CardContent className="p-6 relative">
                  <div className="flex items-start gap-4 flex-wrap">
                    <div className="w-10 h-10 rounded-md bg-gradient-to-b from-chart-2/20 to-chart-2/5 flex items-center justify-center shrink-0">
                      <point.icon className="w-5 h-5 text-chart-2" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap mb-2">
                        <h3 className="font-semibold text-foreground" data-testid={`text-psychology-point-${i}`}>
                          {point.title}
                        </h3>
                        {point.stat && (
                          <Badge variant="outline" className="text-chart-2 border-chart-2/30 bg-chart-2/5" data-testid={`badge-psychology-stat-${i}`}>
                            {point.stat} {point.statLabel}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {point.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Button size="lg" asChild>
            <Link href="/contact" data-testid="link-psychology-cta">
              Schedule a Call
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

function ReviewsSection() {
  const reviews = [
    {
      name: "Lisa K.",
      role: "Owner, Aloha Beauty Salon",
      content: "Switching to λechSavvy saved me over $400 a month in fees. The terminal was set up the same day and my customers love the tap-to-pay feature.",
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

export default function FaqPage() {
  const jsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Payment Processing FAQ — Zero-Fee Processing Questions Answered",
    "description": "Frequently asked questions about zero-fee payment processing, cash discount programs, surcharge processing, high-risk merchant accounts, and free business websites.",
    "url": "https://techsavvyhawaii.com/faq"
  }), []);

  useSEO({
    title: "Payment Processing FAQ | Zero-Fee Processing Questions Answered — λechSavvy (TechSavvy)",
    description: "Frequently asked questions about zero-fee payment processing, cash discount programs, surcharge processing, high-risk merchant accounts, payment terminals, online payment gateways, and free business websites. Learn how to eliminate credit card processing fees.",
    keywords: "payment processing FAQ, zero fee processing questions, how does cash discount work, is surcharging legal, what is a high risk merchant account, payment processing questions, credit card processing FAQ, merchant services FAQ, how to accept credit cards, payment terminal FAQ, online payment FAQ, free website FAQ, best payment processor questions",
    canonical: "https://techsavvyhawaii.com/faq",
    ogTitle: "Payment Processing FAQ — All Your Questions Answered | λechSavvy",
    ogDescription: "Get answers about zero-fee payment processing, cash discount programs, high-risk merchants, and free websites. Everything you need to know.",
    twitterTitle: "Payment Processing FAQ | λechSavvy (TechSavvy)",
    twitterDescription: "FAQ: zero-fee processing, cash discount, surcharging, high-risk accounts, free websites. All your payment processing questions answered.",
    jsonLd,
  });

  return (
    <Layout>
      <section className="pt-32 pb-16 bg-gradient-to-b from-primary/10 via-transparent to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6">
            Frequently Asked <span className="text-primary">Questions</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Find answers to common questions about our zero-fee processing and how it works for your business.
          </p>
        </div>
      </section>
      <FAQSection />
      <CustomerPsychologySection />
      <ReviewsSection />
    </Layout>
  );
}
