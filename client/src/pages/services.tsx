import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  CreditCard,
  Zap,
  Globe,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { fadeUp, staggerContainer, scaleIn } from "@/lib/animations";
import Layout from "@/components/layout";
import { Link } from "wouter";
import servicesBanner from "@assets/IMG_6296_1770672559549.png";

function ServicesSection() {
  const services = [
    {
      icon: CreditCard,
      title: "Zero-Fee Processing",
      description: "Keep 100% of every sale. No processing fees, no monthly fees, and no contracts.",
    },
    {
      icon: Globe,
      title: "Online Business Package",
      description: "Go online-only with a free custom website and payment gateway — an alternative to the physical terminal.",
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

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {services.map((s, i) => (
            <motion.div key={i} variants={scaleIn}>
              <Card className="border-primary/10 h-full">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <s.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
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
            <Link href="/contact" data-testid="link-services-cta">
              Schedule a Call
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

export default function ServicesPage() {
  return (
    <Layout>
      <section className="pt-20 sm:pt-24" data-testid="section-services-hero">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={servicesBanner}
              alt="λechSavvy — Eliminate Credit Card Fees Forever. Cash Discount Program, Free Custom Website, 30-Day Risk-Free Trial."
              className="w-full rounded-lg shadow-2xl"
              data-testid="img-services-banner"
            />
          </motion.div>
        </div>
      </section>
      <ServicesSection />
    </Layout>
  );
}
