import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Globe,
  ArrowRight,
  Check,
  AlertTriangle,
  HeartHandshake,
  ThumbsUp,
  Users,
  Megaphone,
  MapPin,
} from "lucide-react";
import { fadeUp, staggerContainer, scaleIn } from "@/lib/animations";
import Layout from "@/components/layout";
import { Link } from "wouter";

function HighRiskHero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-20">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-chart-2/8 via-chart-2/3 to-transparent" />
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-chart-2/10 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="flex flex-wrap items-center justify-center gap-3" variants={fadeUp}>
            <Badge variant="outline" className="mb-4 text-chart-2 border-chart-2/30 bg-chart-2/5">
              <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
              High-Risk Merchants Welcome
            </Badge>
            <Badge variant="outline" className="mb-4 text-primary border-primary/30 bg-primary/5">
              <MapPin className="w-3.5 h-3.5 mr-1.5" />
              Serving All of Hawai'i
            </Badge>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] mb-6"
            variants={fadeUp}
          >
            High-Risk{" "}
            <span className="bg-gradient-to-r from-chart-2 to-primary bg-clip-text text-transparent">
              Payment Processing
            </span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto"
            variants={fadeUp}
          >
            Turned down by other processors? We specialize in high-risk merchant accounts with the same zero-fee processing and no hidden charges.
          </motion.p>

          <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-4" variants={fadeUp}>
            <Button size="lg" asChild>
              <Link href="/contact">
                Apply for High-Risk Account
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="/#pricing">
                See Pricing
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function HighRiskDetailsSection() {
  const industries = [
    "CBD & Hemp",
    "Vape & E-Cigarette",
    "Firearms & Ammunition",
    "Nutraceuticals",
    "Travel & Tourism",
    "Debt Collection",
    "Online Gaming",
    "Adult Entertainment",
    "Subscription Services",
    "Tech Support",
    "Telemarketing",
    "E-Commerce",
  ];

  return (
    <section className="py-20 sm:py-24 relative" data-testid="section-high-risk">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="h-full overflow-visible border-chart-2/20">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-chart-2/5 to-transparent" />
              <CardHeader className="relative">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="w-10 h-10 rounded-md bg-chart-2/15 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-chart-2" />
                  </div>
                  <CardTitle className="text-lg">Why Merchants Choose Us</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="relative space-y-3">
                {[
                  "No application denials based on industry type",
                  "Same zero processing fees as standard merchants",
                  "No reserve requirements or fund holds",
                  "Fast approval — often same-day setup",
                  "Dedicated support for high-risk industries",
                  "Chargeback prevention tools included",
                  "PCI-compliant secure transactions",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-chart-2 shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground/80">{item}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="h-full overflow-visible border-primary/10">
              <CardHeader>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="w-10 h-10 rounded-md bg-primary/15 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Industries We Serve</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {industries.map((industry) => (
                    <Badge
                      key={industry}
                      variant="outline"
                      className="text-muted-foreground border-border/60"
                      data-testid={`badge-industry-${industry.toLowerCase().replace(/[\s&]/g, "-")}`}
                    >
                      {industry}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-5 leading-relaxed">
                  Don't see your industry? Contact us — we work with nearly every business type that other processors reject.
                </p>
                <Button className="w-full mt-5" asChild>
                  <Link href="/contact" data-testid="link-high-risk-apply">
                    Apply for High-Risk Account
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
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
    <section className="py-20 sm:py-24 relative" data-testid="section-psychology">
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
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-5"
            variants={fadeUp}
            data-testid="text-psychology-title"
          >
            Will My Customers{" "}
            <span className="bg-gradient-to-r from-chart-2 to-primary bg-clip-text text-transparent">
              Actually Accept This
            </span>?
          </motion.h2>
          <motion.p
            className="text-muted-foreground max-w-2xl mx-auto text-lg"
            variants={fadeUp}
          >
            The short answer: yes. Here's why businesses across the country are making the switch without losing a single customer.
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
      </div>
    </section>
  );
}

export default function HighRiskPage() {
  return (
    <Layout>
      <HighRiskHero />
      <HighRiskDetailsSection />
      <CustomerPsychologySection />
    </Layout>
  );
}
