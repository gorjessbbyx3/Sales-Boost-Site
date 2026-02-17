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
  Wrench,
  DollarSign,
  Settings,
} from "lucide-react";
import { fadeUp, staggerContainer, scaleIn } from "@/lib/animations";
import Layout from "@/components/layout";
import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";

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
              className="w-full h-auto max-h-[50vh] object-contain rounded-xl shadow-lg"
            />
          </motion.div>

          <motion.p
            className="text-sm sm:text-lg text-muted-foreground leading-relaxed mb-6 max-w-2xl mx-auto"
            variants={fadeUp}
          >
            When you switch to our Cash Discount Processing Program, we build and deliver a professional, custom website completely free of charge — no upfront cost, no hidden fees for the initial build.
          </motion.p>

          <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-3" variants={fadeUp}>
            <Button size="lg" className="w-full sm:w-auto" asChild>
              <Link href="/contact">
                Get My Free Mockup
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto" asChild>
              <Link href="/pricing">
                See Pricing
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function WebFeaturesSection() {
  const included = [
    {
      icon: Palette,
      title: "Modern, Mobile-Friendly Design",
      description: "Tailored to your business — restaurant, salon, retail, service provider, and more. No cookie-cutter templates.",
    },
    {
      icon: Globe,
      title: "Essential Pages",
      description: "Home, About, Services/Menu, Contact, and whatever pages your business needs to look professional online.",
    },
    {
      icon: Code,
      title: "Integrated Payment Options",
      description: "Connected to our processing gateway so you can accept payments online via payment links, invoices, and shopping carts.",
    },
    {
      icon: Smartphone,
      title: "Basic SEO & Google-Friendly Structure",
      description: "Built to rank in local searches so Honolulu, Maui, Kona, and Hawai'i customers can find you online.",
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
            What's Included — Free
          </motion.h2>
          <motion.p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-lg" variants={fadeUp}>
            Help your Honolulu business get online quickly, look professional, and start capturing more customers — all at zero cost for the website creation itself.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {included.map((f, i) => (
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

function UpkeepOptionsSection() {
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
            <Badge variant="outline" className="mb-4 text-primary border-primary/30 bg-primary/5">
              <Settings className="w-3 h-3 mr-1.5" />
              After the Build
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
              Your Site, Your Choice
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-lg">
              Websites need ongoing care to stay secure, fast, and fresh. You have complete flexibility — nothing is mandatory.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
            <motion.div variants={scaleIn}>
              <Card className="h-full overflow-visible border-chart-2/20">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-chart-2/5 to-transparent" />
                <CardContent className="p-5 sm:p-7 relative">
                  <div className="w-10 h-10 rounded-md bg-chart-2/15 flex items-center justify-center mb-4">
                    <Wrench className="w-5 h-5 text-chart-2" />
                  </div>
                  <h3 className="font-bold text-chart-2 mb-1">Do It Yourself</h3>
                  <div className="text-2xl font-extrabold text-chart-2 mb-3">FREE</div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    Take full ownership of your site and handle hosting, maintenance, updates, and security on your own.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-chart-2 shrink-0 mt-0.5" />
                      <span className="text-foreground/80">You own the site completely</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-chart-2 shrink-0 mt-0.5" />
                      <span className="text-foreground/80">Host it wherever you want</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-chart-2 shrink-0 mt-0.5" />
                      <span className="text-foreground/80">No ongoing cost</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={scaleIn}>
              <Card className="h-full overflow-visible border-chart-3/20">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-chart-3/5 to-transparent" />
                <CardContent className="p-5 sm:p-7 relative">
                  <div className="w-10 h-10 rounded-md bg-chart-3/15 flex items-center justify-center mb-4">
                    <DollarSign className="w-5 h-5 text-chart-3" />
                  </div>
                  <h3 className="font-bold text-chart-3 mb-1">One-Off Updates</h3>
                  <div className="text-2xl font-extrabold text-chart-3 mb-3">From $40</div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    Need help with specific content changes? We offer one-off updates on demand — price depends on scope.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-chart-3 shrink-0 mt-0.5" />
                      <span className="text-foreground/80">Update prices, photos, hours</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-chart-3 shrink-0 mt-0.5" />
                      <span className="text-foreground/80">Add a blog post or new page</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-chart-3 shrink-0 mt-0.5" />
                      <span className="text-foreground/80">Pay only when you need us</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={scaleIn}>
              <Card className="h-full overflow-visible border-primary/20">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-primary/5 to-transparent" />
                <CardContent className="p-5 sm:p-7 relative">
                  <div className="w-10 h-10 rounded-md bg-primary/15 flex items-center justify-center mb-4">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-primary mb-1">Maintenance Plans</h3>
                  <div className="text-2xl font-extrabold text-primary mb-3">$50–$399/mo</div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    We handle all the tech while you focus on growing your business. Month-to-month — cancel anytime, no penalties.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-foreground/80">Hosting, security & backups</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-foreground/80">Content updates & SEO</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-foreground/80">Hands-off — we do everything</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div className="text-center mt-8 sm:mt-12 max-w-2xl mx-auto" variants={fadeUp}>
            <Card className="border-primary/20">
              <CardContent className="p-5 sm:p-6">
                <p className="text-sm sm:text-base text-foreground/90 font-medium leading-relaxed">
                  <span className="text-primary font-bold">Bottom line:</span> The website is 100% free to get started — we build it for you when you switch your processing. After that, upkeep is 100% your choice.
                </p>
              </CardContent>
            </Card>
          </motion.div>
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
              Online-only processing merchants get a free custom website.
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
                              <span className="text-sm font-semibold text-muted-foreground">Before TechSavvy</span>
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
                              <span className="text-sm font-semibold text-muted-foreground">After TechSavvy</span>
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

function LiveExampleSection() {
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
            <Badge variant="outline" className="mb-4 text-primary border-primary/30 bg-primary/5">
              <Monitor className="w-3 h-3 mr-1.5" />
              Live Example
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
              See a Real TechSavvy Website in Action
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-lg">
              Here's one of the custom websites we built for a Hawai'i business — browse it live below.
            </p>
          </motion.div>

          <motion.div variants={scaleIn} className="max-w-5xl mx-auto">
            <Card className="overflow-hidden border-primary/20">
              <div className="bg-muted/50 px-4 py-2.5 flex items-center gap-2 border-b">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-chart-3/60" />
                  <div className="w-3 h-3 rounded-full bg-chart-2/60" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-background rounded-md px-3 py-1 text-xs text-muted-foreground text-center border">
                    allin1bonding.vercel.app
                  </div>
                </div>
              </div>
              <div className="relative w-full" style={{ paddingBottom: "62.5%" }}>
                <iframe
                  src="https://allin1bonding.vercel.app/"
                  title="All In 1 Bonding — Example TechSavvy Website"
                  className="absolute inset-0 w-full h-full border-0"
                  loading="lazy"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            </Card>
            <p className="text-center text-xs text-muted-foreground mt-3">
              <a href="https://allin1bonding.vercel.app/" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground transition-colors">
                allin1bonding.vercel.app
              </a>{" "}
              — built by TechSavvy
            </p>
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
      price: "$50",
      period: "/month",
      description: "Keep your site running smoothly",
      features: [
        "Hosting & SSL security",
        "Monthly backups",
        "Basic content changes (hours, prices, photos)",
        "Other content changes start at $40+",
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
            <p className="text-sm text-primary font-medium mt-3">
              Don't need a plan? Extra content updates start at just $40.
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
  useSEO({
    title: "AI Web Design & SEO Hawaii | Free Websites for Merchants | TechSavvy",
    description: "AI-powered website design and search engine optimization for Hawaii businesses. Free custom websites for TechSavvy merchants. AI-optimized SEO, mobile-responsive, e-commerce ready. Portfolio and maintenance plans.",
    keywords: "AI web design Hawaii, search engine optimization Honolulu, AI-powered SEO, free website merchants Hawaii, web development Maui, AI website builder, intelligent web design, e-commerce website Hawaii",
    canonical: "https://techsavvyhawaii.com/our-work",
    ogImage: "https://techsavvyhawaii.com/images/website-before-after.jpg",
  });

  return (
    <Layout>
      <WebDesignHero />
      <WebFeaturesSection />
      <UpkeepOptionsSection />
      <PortfolioSection />
      <LiveExampleSection />
      <BeforeAfterSection />
      <SubscriptionTiersSection />
      <WebDesignCTA />
    </Layout>
  );
}
