import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Palette,
  Globe,
  Zap,
  TrendingUp,
  ShoppingCart,
  Calendar,
  Image,
  DollarSign,
} from "lucide-react";
import { useMemo } from "react";
import { fadeUp, staggerContainer, scaleIn } from "@/lib/animations";
import Layout from "@/components/layout";
import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";

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
              <Link href="/faq">Read Processing FAQs</Link>
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

function PortfolioShowcase() {
  const portfolioItems = [
    {
      type: "Restaurant & Food",
      description: "Online menu, ordering, reservations & payments",
      pages: "Home, Menu, Order Online, About, Contact",
      icon: ShoppingCart,
      color: "text-chart-3",
      bgColor: "bg-chart-3/15",
      borderColor: "border-chart-3/20",
    },
    {
      type: "Salon & Beauty",
      description: "Appointment booking, gallery & service pricing",
      pages: "Home, Services, Book Now, Gallery, Contact",
      icon: Calendar,
      color: "text-chart-4",
      bgColor: "bg-chart-4/15",
      borderColor: "border-chart-4/20",
    },
    {
      type: "Retail & E-Commerce",
      description: "Product catalog, shopping cart & secure checkout",
      pages: "Home, Shop, Cart, About, Contact",
      icon: ShoppingCart,
      color: "text-chart-2",
      bgColor: "bg-chart-2/15",
      borderColor: "border-chart-2/20",
    },
    {
      type: "Services & Trades",
      description: "Quote requests, service areas & testimonials",
      pages: "Home, Services, Get a Quote, Reviews, Contact",
      icon: Globe,
      color: "text-primary",
      bgColor: "bg-primary/15",
      borderColor: "border-primary/20",
    },
    {
      type: "Tourism & Activities",
      description: "Tour booking, trip calendars & photo galleries",
      pages: "Home, Tours, Book Now, Gallery, Contact",
      icon: Image,
      color: "text-chart-3",
      bgColor: "bg-chart-3/15",
      borderColor: "border-chart-3/20",
    },
    {
      type: "CBD & Wellness",
      description: "Age-gated storefront, lab results & compliance",
      pages: "Home, Products, Lab Results, About, Contact",
      icon: Zap,
      color: "text-chart-2",
      bgColor: "bg-chart-2/15",
      borderColor: "border-chart-2/20",
    },
  ];

  return (
    <section className="py-12 sm:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          <motion.div className="text-center mb-8 sm:mb-14" variants={fadeUp}>
            <Badge variant="outline" className="mb-4 text-chart-4 border-chart-4/30 bg-chart-4/5">
              <Palette className="w-3 h-3 mr-1.5" />
              Free Custom Websites
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
              Websites We Build for Every Industry
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-lg">
              Online-only processing merchants get a free custom website — here's what yours could look like.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-5 max-w-5xl mx-auto"
            variants={staggerContainer}
          >
            {portfolioItems.map((item) => (
              <motion.div key={item.type} variants={scaleIn}>
                <Card className={`h-full overflow-visible ${item.borderColor}`}>
                  <CardContent className="p-4 sm:p-5">
                    <div className={`w-full h-20 sm:h-28 rounded-md ${item.bgColor} flex items-center justify-center mb-3`}>
                      <item.icon className={`w-8 h-8 sm:w-10 sm:h-10 ${item.color} opacity-60`} />
                    </div>
                    <h4 className={`font-semibold text-sm sm:text-base ${item.color} mb-1`}>
                      {item.type}
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function WebsiteUpkeepOverview() {
  return (
    <section className="py-12 sm:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          <motion.div className="text-center mb-8 sm:mb-14" variants={fadeUp}>
            <Badge variant="outline" className="mb-4 text-chart-4 border-chart-4/30 bg-chart-4/5">
              <TrendingUp className="w-3.5 h-3.5 mr-1.5" />
              After the Build
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
              Website Upkeep — Your Choice
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-lg">
              The website is 100% free to get started. After that, upkeep is 100% your choice.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
            <motion.div variants={scaleIn}>
              <Card className="h-full overflow-visible border-chart-2/20">
                <CardContent className="p-5 sm:p-6 text-center">
                  <div className="w-10 h-10 rounded-md bg-chart-2/15 flex items-center justify-center mx-auto mb-3">
                    <Zap className="w-5 h-5 text-chart-2" />
                  </div>
                  <h3 className="font-bold text-chart-2 mb-1">Manage It Yourself</h3>
                  <div className="text-2xl font-extrabold text-chart-2 mb-2">FREE</div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Take full ownership — host and maintain the site yourself
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={scaleIn}>
              <Card className="h-full overflow-visible border-chart-3/20">
                <CardContent className="p-5 sm:p-6 text-center">
                  <div className="w-10 h-10 rounded-md bg-chart-3/15 flex items-center justify-center mx-auto mb-3">
                    <DollarSign className="w-5 h-5 text-chart-3" />
                  </div>
                  <h3 className="font-bold text-chart-3 mb-1">One-Off Updates</h3>
                  <div className="text-2xl font-extrabold text-chart-3 mb-2">From $40</div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Pay only when you need changes — prices, photos, new pages
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={scaleIn}>
              <Card className="h-full overflow-visible border-primary/20">
                <CardContent className="p-5 sm:p-6 text-center">
                  <div className="w-10 h-10 rounded-md bg-primary/15 flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-primary mb-1">Maintenance Plans</h3>
                  <div className="text-2xl font-extrabold text-primary mb-2">$50–$399/mo</div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Hands-off — we handle hosting, security, SEO & updates
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}


export default function OnlineProcessingPage() {
  const jsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Online Payment Processing — Free Website & Payment Gateway",
    "description": "Accept payments online with a free custom website and zero-fee payment gateway. Payment links, invoicing, recurring billing & more. No terminal needed.",
    "url": "https://techsavvyhawaii.com/online-processing",
    "mainEntity": { "@id": "https://techsavvyhawaii.com/#online-processing" }
  }), []);

  useSEO({
    title: "Online Payment Processing | Free Website & Payment Gateway — λechSavvy (TechSavvy)",
    description: "Accept payments online with a free custom website and zero-fee payment gateway. Features include payment links, online invoicing, recurring billing, online ordering, and booking integration. No physical terminal needed. Perfect for e-commerce, service businesses, and freelancers.",
    keywords: "online payment processing, payment gateway, accept payments online, online payment gateway, virtual terminal, e-commerce payment processing, online invoicing, recurring billing, subscription payments, payment links, online ordering, booking integration, accept credit cards online, digital payments, mobile payment processing, e-commerce website, free business website, online payment solutions",
    canonical: "https://techsavvyhawaii.com/online-processing",
    ogTitle: "Online Payment Processing — Free Website & Gateway | λechSavvy",
    ogDescription: "Accept payments online for FREE. Custom website + payment gateway included. Payment links, invoicing, recurring billing. No terminal needed.",
    twitterTitle: "Online Payment Processing — Free Website | λechSavvy (TechSavvy)",
    twitterDescription: "Accept payments online with a free custom website and zero-fee payment gateway. No terminal needed. E-commerce, invoicing, subscriptions.",
    jsonLd,
  });

  return (
    <Layout>
      <OnlineHero />
      <PortfolioShowcase />
      <WebsiteUpkeepOverview />
    </Layout>
  );
}
