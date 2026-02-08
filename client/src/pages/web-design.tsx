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
  ArrowRightLeft,
  Sparkles,
  ShoppingCart,
  Calendar,
  Star,
  Image,
} from "lucide-react";
import { fadeUp, staggerContainer, scaleIn } from "@/lib/animations";
import Layout from "@/components/layout";
import { Link } from "wouter";

function WebDesignHero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-10 sm:pt-36 sm:pb-20">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-chart-4/8 via-chart-4/3 to-transparent" />
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-chart-4/10 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="flex flex-wrap items-center justify-center gap-2" variants={fadeUp}>
            <Badge variant="outline" className="mb-3 text-xs sm:text-sm text-chart-4 border-chart-4/30 bg-chart-4/5">
              <Code className="w-3 h-3 mr-1" />
              Website Design
            </Badge>
            <Badge variant="outline" className="mb-3 text-xs sm:text-sm text-primary border-primary/30 bg-primary/5">
              <MapPin className="w-3 h-3 mr-1" />
              Honolulu, HI
            </Badge>
          </motion.div>

          <motion.h1
            className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1] mb-4 sm:mb-6"
            variants={fadeUp}
          >
            Get a{" "}
            <span className="bg-gradient-to-r from-chart-4 to-primary bg-clip-text text-transparent">
              FREE Custom Website
            </span>{" "}
            When You Switch
          </motion.h1>

          {/* Before/After showcase image */}
          <motion.div className="mb-6 sm:mb-8 rounded-xl overflow-hidden" variants={fadeUp}>
            <img
              src="/images/website-before-after.jpg"
              alt="FREE Custom Website — Before and After: Lisa's Salon to Aloha Beauty Salon"
              className="w-full h-auto rounded-xl shadow-lg"
            />
          </motion.div>

          <motion.p
            className="text-sm sm:text-lg text-muted-foreground leading-relaxed mb-6 max-w-2xl mx-auto"
            variants={fadeUp}
          >
            Online orders, bookings, and more — we build it all. Every Edify merchant gets a professional website included.
          </motion.p>

          <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-3" variants={fadeUp}>
            <Button size="lg" className="w-full sm:w-auto" asChild>
              <Link href="/contact">
                Get My Free Mockup
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto" asChild>
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

function WebFeaturesSection() {
  const webFeatures = [
    {
      icon: Palette,
      title: "Custom Design",
      description: "Professionally designed to match your brand. No cookie-cutter templates — every site is built from scratch for your Hawai'i business.",
    },
    {
      icon: Smartphone,
      title: "Mobile-Optimized",
      description: "Looks perfect on every device. Over 60% of local searches happen on mobile — your site will be ready.",
    },
    {
      icon: Globe,
      title: "SEO-Ready",
      description: "Built with search engine optimization so customers in Honolulu, Maui, Kona, and across Hawai'i can find you online.",
    },
    {
      icon: Code,
      title: "E-Commerce & Custom Software",
      description: "Need online ordering, booking, or custom tools? Our premium packages include full e-commerce and custom software solutions.",
    },
    {
      icon: Monitor,
      title: "Hosting & Maintenance",
      description: "We handle hosting, updates, and security so you can focus on running your business.",
    },
    {
      icon: Zap,
      title: "Fast Turnaround",
      description: "Most business websites are live within 1-2 weeks. Premium and custom projects scoped individually.",
    },
  ];

  return (
    <section className="py-12 sm:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-8 sm:mb-14"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.h2
            className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3"
            variants={fadeUp}
          >
            What You Get
          </motion.h2>
          <motion.p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-lg" variants={fadeUp}>
            Every website we build is custom-designed for your business, not a template.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {webFeatures.map((f, i) => (
            <motion.div key={f.title} variants={scaleIn}>
              <Card className="h-full overflow-visible border-chart-4/10">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-chart-4/5 to-transparent" />
                <CardContent className="p-6 relative">
                  <div className="w-10 h-10 rounded-md bg-chart-4/15 flex items-center justify-center mb-4">
                    <f.icon className="w-5 h-5 text-chart-4" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2" data-testid={`text-web-feature-${i}`}>
                    {f.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {f.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function BeforeAfterSection() {
  const transformations = [
    {
      business: "Aloha Beauty Salon",
      owner: "Lisa K.",
      location: "Honolulu, HI",
      before: {
        issues: ["No online presence", "Losing customers to competitors", "Phone-only bookings", "No way to showcase work"],
      },
      after: {
        features: ["Professional website with gallery", "Online appointment booking", "Service menu with pricing", "Google Business integration", "Mobile-optimized design"],
      },
      result: "3x more bookings in the first month",
      color: "text-chart-4",
      borderColor: "border-chart-4/20",
      bgColor: "bg-chart-4",
    },
    {
      business: "Kona Plate Lunch",
      owner: "James T.",
      location: "Kailua-Kona, HI",
      before: {
        issues: ["Outdated Facebook page only", "No online ordering", "Customers couldn't find menu", "Missing takeout orders"],
      },
      after: {
        features: ["Custom website with full menu", "Online ordering system", "Payment integration", "SEO for local searches", "Catering request form"],
      },
      result: "40% increase in takeout orders",
      color: "text-chart-3",
      borderColor: "border-chart-3/20",
      bgColor: "bg-chart-3",
    },
    {
      business: "Maui Adventure Tours",
      owner: "Kai M.",
      location: "Lahaina, Maui",
      before: {
        issues: ["Basic Wix site with broken links", "No booking system", "Couldn't accept payments online", "Poor mobile experience"],
      },
      after: {
        features: ["Custom tour booking platform", "Online payment processing", "Photo gallery with reviews", "Automated confirmation emails", "Trip calendar integration"],
      },
      result: "Online bookings now 60% of revenue",
      color: "text-chart-2",
      borderColor: "border-chart-2/20",
      bgColor: "bg-chart-2",
    },
  ];

  return (
    <section className="py-12 sm:py-24 relative">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-card/30 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          <motion.div className="text-center mb-8 sm:mb-14" variants={fadeUp}>
            <Badge variant="outline" className="mb-4 text-chart-4 border-chart-4/30 bg-chart-4/5">
              <Sparkles className="w-3 h-3 mr-1" />
              Before & After
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground mb-2" data-testid="text-portfolio-title">
              Real Hawai'i Businesses We've Transformed
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-lg">
              Every Edify merchant gets a free custom website.
            </p>
          </motion.div>

          <div className="space-y-4 sm:space-y-8">
            {transformations.map((t, i) => (
              <motion.div key={t.business} variants={scaleIn}>
                <Card className={`overflow-visible ${t.borderColor}`}>
                  <CardContent className="p-4 sm:p-8">
                    <div className="flex flex-col sm:flex-row items-start gap-6">
                      <div className="flex-1 w-full">
                        <div className="flex items-center gap-3 mb-4 flex-wrap">
                          <h3 className={`text-xl font-bold ${t.color}`} data-testid={`text-portfolio-${i}`}>
                            {t.business}
                          </h3>
                          <Badge variant="outline" className="text-muted-foreground border-border/60 text-xs">
                            <MapPin className="w-3 h-3 mr-1" />
                            {t.location}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-6 h-6 rounded bg-destructive/15 flex items-center justify-center">
                                <span className="text-destructive text-xs font-bold">B</span>
                              </div>
                              <span className="text-sm font-semibold text-muted-foreground">Before Edify</span>
                            </div>
                            <ul className="space-y-2">
                              {t.before.issues.map((issue) => (
                                <li key={issue} className="flex items-start gap-2 text-sm text-muted-foreground">
                                  <span className="text-destructive mt-1">✕</span>
                                  <span>{issue}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <div className={`w-6 h-6 rounded ${t.bgColor}/15 flex items-center justify-center`}>
                                <span className={`${t.color} text-xs font-bold`}>A</span>
                              </div>
                              <span className="text-sm font-semibold text-muted-foreground">After Edify</span>
                            </div>
                            <ul className="space-y-2">
                              {t.after.features.map((feature) => (
                                <li key={feature} className="flex items-start gap-2 text-sm text-foreground/80">
                                  <Check className={`w-4 h-4 ${t.color} shrink-0 mt-0.5`} />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="mt-5 pt-4 border-t border-border/50">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Star className={`w-4 h-4 ${t.color}`} />
                            <span className={`text-sm font-semibold ${t.color}`}>Result:</span>
                            <span className="text-sm text-foreground/90">{t.result}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function PortfolioSection() {
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
    <section className="py-20 sm:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          <motion.div className="text-center mb-10" variants={fadeUp}>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3">
              Websites We Build for Every Industry
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              From restaurants to retail — here's what your free custom site could look like.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            variants={staggerContainer}
          >
            {portfolioItems.map((item, i) => (
              <motion.div key={item.type} variants={scaleIn}>
                <Card className={`h-full overflow-visible ${item.borderColor}`}>
                  <CardContent className="p-5">
                    <div className={`w-full h-28 rounded-md ${item.bgColor} flex items-center justify-center mb-4`}>
                      <item.icon className={`w-10 h-10 ${item.color} opacity-60`} />
                    </div>
                    <h4 className={`font-semibold ${item.color} mb-1.5`} data-testid={`text-portfolio-type-${i}`}>
                      {item.type}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      {item.description}
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                      <span className="font-medium">Pages:</span> {item.pages}
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

function SubscriptionTiersSection() {
  const subscriptionTiers = [
    {
      name: "Basic",
      price: "$99",
      period: "/month",
      description: "Keep your site running smoothly",
      features: [
        "Hosting & SSL security",
        "Monthly backups",
        "Basic content changes (hours, prices, photos)",
        "Uptime monitoring",
        "Email support",
      ],
      color: "text-muted-foreground",
      borderColor: "border-border",
      popular: false,
    },
    {
      name: "Pro",
      price: "$199",
      period: "/month",
      description: "Grow your online presence",
      features: [
        "Everything in Basic",
        "Monthly content updates & blog posts",
        "Google Business optimization",
        "Monthly SEO tweaks",
        "Performance reporting",
        "Priority support",
      ],
      color: "text-primary",
      borderColor: "border-primary/30",
      popular: true,
    },
    {
      name: "Premium",
      price: "$399",
      period: "/month",
      description: "Full business growth partner",
      features: [
        "Everything in Pro",
        "Custom backend (inventory, CRM, booking)",
        "Automated emails & invoicing",
        "Processing data integration & reporting",
        "Unlimited content changes",
        "Dedicated account manager",
      ],
      color: "text-chart-4",
      borderColor: "border-chart-4/30",
      popular: false,
    },
  ];

  return (
    <section className="py-20 sm:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          <motion.div className="text-center mb-10" variants={fadeUp}>
            <Badge variant="outline" className="mb-5 text-chart-4 border-chart-4/30 bg-chart-4/5">
              <TrendingUp className="w-3.5 h-3.5 mr-1.5" />
              Ongoing Growth
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3" data-testid="text-subscriptions-title">
              We Handle the Tech — You Focus on Business
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              After your free website is built, choose an optional maintenance plan to keep it growing. Cancel anytime.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {subscriptionTiers.map((tier, i) => (
              <motion.div key={tier.name} variants={scaleIn}>
                <Card className={`h-full overflow-visible relative ${tier.borderColor}`}>
                  {tier.popular && (
                    <>
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-primary/8 to-transparent" />
                      <div className="absolute -top-3 left-6">
                        <Badge className="shadow-lg shadow-primary/20">Most Popular</Badge>
                      </div>
                    </>
                  )}
                  <CardContent className={`p-6 relative ${tier.popular ? "pt-8" : ""}`}>
                    <h4 className={`text-lg font-bold ${tier.color} mb-1`} data-testid={`text-tier-name-${i}`}>
                      {tier.name}
                    </h4>
                    <p className="text-xs text-muted-foreground mb-4">{tier.description}</p>
                    <div className="flex items-baseline gap-1 mb-5">
                      <span className={`text-3xl font-extrabold ${tier.color}`}>{tier.price}</span>
                      <span className="text-sm text-muted-foreground">{tier.period}</span>
                    </div>
                    <ul className="space-y-2.5">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5 text-sm">
                          <Check className={`w-4 h-4 ${tier.color} shrink-0 mt-0.5`} />
                          <span className="text-foreground/80">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function WebDesignCTA() {
  return (
    <section className="py-20 sm:py-24 relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="overflow-visible border-chart-4/20">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-chart-4/5 via-primary/5 to-chart-4/5" />
            <CardContent className="p-8 relative text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3" data-testid="text-web-design-cta-title">
                Claim Your Free Website Mockup + Processing Savings Quote
              </h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Tell us about your business and we'll send you a personalized website mockup showing exactly what yours could look like — plus a savings analysis on your current processing fees. No commitment.
              </p>
              <Button size="lg" asChild>
                <Link href="/contact" data-testid="link-web-design-cta">
                  Get My Free Mockup + Quote
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

export default function WebDesignPage() {
  return (
    <Layout>
      <WebDesignHero />
      <WebFeaturesSection />
      <PortfolioSection />
      <BeforeAfterSection />
      <SubscriptionTiersSection />
      <WebDesignCTA />
    </Layout>
  );
}
