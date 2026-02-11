import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Code,
  Palette,
  Monitor,
  Globe,
  Smartphone,
  Zap,
  ArrowRight,
  Check,
  TrendingUp,
  MapPin,
  ShoppingCart,
  Calendar,
  Image,
  Sparkles,
  Wrench,
  DollarSign,
  Settings,
} from "lucide-react";
import { fadeUp, staggerContainer, scaleIn } from "@/lib/animations";
import Layout from "@/components/layout";
import { Link } from "wouter";

function OnlineHero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-16 sm:pt-32 sm:pb-24">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/8 via-primary/3 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="outline" className="mb-3 text-primary border-primary/30 bg-primary/5">
            Online Processing
          </Badge>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            Grow Your Business <span className="text-primary">Online</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto">
            Get a professional business website and zero-fee online processing gateway. Accept payments via web, mobile, or payment links.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button size="lg" asChild>
              <Link href="/contact">Get Started Free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/faq">Learn More</Link>
            </Button>
          </div>

          <motion.div
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
          >
            <div className="bg-[#e8e8e8] dark:bg-[#2a2a2a] rounded-t-lg">
              <div className="flex items-center gap-2 px-4 py-2.5">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                </div>
                <div className="flex-1 bg-white dark:bg-[#1a1a1a] rounded px-3 py-1 text-xs text-muted-foreground truncate text-center">
                  poormantowing.com
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-b-lg border border-t-0 border-border">
              <img
                src="/images/poormantowing-preview.jpg"
                alt="Poorman Towing — λechSavvy client website example"
                className="w-full"
                data-testid="img-poormantowing-preview"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-3">Live client website built by λechSavvy</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function PortfolioSection() {
  const portfolioItems = [
    {
      type: "Restaurant & Food",
      description: "Online menu, ordering, reservations & payments",
      icon: ShoppingCart,
      color: "text-chart-3",
      bgColor: "bg-chart-3/15",
    },
    {
      type: "Salon & Beauty",
      description: "Appointment booking, gallery & service pricing",
      icon: Calendar,
      color: "text-chart-4",
      bgColor: "bg-chart-4/15",
    },
    {
      type: "Retail & E-Commerce",
      description: "Product catalog, shopping cart & secure checkout",
      icon: ShoppingCart,
      color: "text-chart-2",
      bgColor: "bg-chart-2/15",
    },
    {
      type: "Services & Trades",
      description: "Quote requests, service areas & testimonials",
      icon: Globe,
      color: "text-primary",
      bgColor: "bg-primary/15",
    },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Websites for Every Industry</h2>
          <p className="text-muted-foreground text-lg">Online-only merchants get a free custom website built for their business.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {portfolioItems.map((item, i) => (
            <Card key={i} className="hover-elevate">
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-lg ${item.bgColor} flex items-center justify-center mb-4`}>
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <h3 className="font-bold mb-2">{item.type}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function WebDesignShowcase() {
  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge variant="outline" className="mb-4 text-primary border-primary/30 bg-primary/5">
              Case Study
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-6">Aloha Beauty Salon</h2>
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/10">
                <div className="font-bold text-destructive mb-1 text-sm uppercase tracking-wider">Before</div>
                <p className="text-sm text-muted-foreground">No online presence. Losing customers to competitors. Phone-only bookings.</p>
              </div>
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                <div className="font-bold text-primary mb-1 text-sm uppercase tracking-wider">After</div>
                <p className="text-sm text-muted-foreground">Professional website with online booking. Resulted in 3x more bookings in the first month.</p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/contact">Get Your Free Mockup</Link>
              </Button>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <img src="/images/website-before-after.jpg" alt="Website transformation showcase" className="w-full h-auto" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function OnlineProcessingPage() {
  return (
    <Layout>
      <OnlineHero />
      <PortfolioSection />
      <WebDesignShowcase />
    </Layout>
  );
}
