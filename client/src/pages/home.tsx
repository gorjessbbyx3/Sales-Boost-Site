import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import {
  CreditCard,
  Globe,
  ShieldCheck,
  Check,
  ArrowRight,
  ChevronRight,
  Zap,
  Clock,
  DollarSign,
  TrendingUp,
  Star,
  Users,
  Award,
  CircleDollarSign,
  Palette,
  MapPin,
  AlertTriangle,
  ShoppingCart,
  Calendar,
  Image,
  Sparkles,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { fadeUp, staggerContainer, scaleIn } from "@/lib/animations";
import Layout from "@/components/layout";
import { Link } from "wouter";

function AnimatedCounter({ target, prefix = "", suffix = "", duration = 2 }: { target: number; prefix?: string; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => `${prefix}${Math.round(v).toLocaleString()}${suffix}`);

  useEffect(() => {
    if (inView) {
      animate(count, target, { duration, ease: "easeOut" });
    }
  }, [inView, target, duration, count]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

function HeroSection() {
  return (
    <section
      className="relative overflow-hidden pt-20 pb-12 sm:pt-36 sm:pb-24"
      data-testid="section-hero"
    >
      <div className="absolute inset-0 -z-10">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/images/hero-hawaii-sunset.jpg"
          className="w-full h-full object-cover object-center opacity-15 sm:opacity-20"
        >
          <source src="/images/hero-video.mp4" type="video/mp4" />
          <img
            src="/images/hero-hawaii-sunset.jpg"
            alt="Eliminate Credit Card Fees — TechSavvy Hawaii"
            className="w-full h-full object-cover object-center"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="flex flex-wrap items-center justify-center gap-2" variants={fadeUp}>
            <Badge variant="outline" className="mb-3 sm:mb-4 py-1 px-3 text-xs sm:text-sm text-primary border-primary/30 bg-primary/5">
              <MapPin className="w-3 h-3 mr-1" />
              Proudly Serving Hawai'i
            </Badge>
            <Badge variant="outline" className="mb-3 sm:mb-4 py-1 px-3 text-xs sm:text-sm text-primary border-primary/30 bg-primary/5">
              <CircleDollarSign className="w-3 h-3 mr-1" />
              Save $3,600+ Per Year
            </Badge>
          </motion.div>

          <motion.h1
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-5 sm:mb-8"
            variants={fadeUp}
            data-testid="text-hero-title"
          >
            Hawai'i's #1{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-primary via-emerald-300 to-primary bg-clip-text text-transparent">
                Zero-Fee
              </span>
            </span>{" "}
            Payment Processor
          </motion.h1>

          <motion.p
            className="text-sm sm:text-lg text-muted-foreground leading-relaxed mb-6 sm:mb-10 max-w-2xl mx-auto"
            variants={fadeUp}
            data-testid="text-hero-subtitle"
          >
            Starting at $399 for a terminal — or try free for 30 days. No monthly fees. No processing fees.
            Keep{" "}
            <span className="text-primary font-semibold">100% of every sale</span>. Plus, get a{" "}
            <span className="text-primary font-semibold">free custom website</span>.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
            variants={fadeUp}
          >
            <Button size="lg" className="w-full sm:w-auto" asChild>
              <Link href="/contact" data-testid="link-hero-get-terminal">
                Get Your Terminal
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto" asChild>
              <Link href="/how-it-works" data-testid="link-hero-learn-more">
                See How It Works
                <ChevronRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            className="mt-8 sm:mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-muted-foreground"
            variants={fadeUp}
          >
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              <span>PCI Compliant</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-primary" />
              <span>Same-Day Setup</span>
            </div>
            <div className="flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-primary" />
              <span>Zero Monthly Fees</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-primary" />
              <span>Free Website</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-8 sm:mt-14 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
        >
          <div className="grid grid-cols-3 gap-3 sm:gap-6">
            {[
              { value: 5400, prefix: "$", suffix: "+", label: "Saved/Year", color: "text-primary" },
              { value: 0, prefix: "$", suffix: "", label: "Monthly Fees", color: "text-foreground" },
              { value: 100, prefix: "", suffix: "%", label: "Revenue Kept", color: "text-foreground" },
            ].map((stat, i) => (
              <Card key={stat.label} className="overflow-visible text-center border-primary/10">
                <CardContent className="p-3 sm:p-6">
                  <div className={`text-xl sm:text-3xl lg:text-5xl font-extrabold ${stat.color} mb-1`}>
                    <AnimatedCounter target={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                  </div>
                  <div className="text-[10px] sm:text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function SocialProofBar() {
  const stats = [
    { icon: Users, value: "500+", label: "Hawai'i Businesses" },
    { icon: Star, value: "4.9/5", label: "Customer Rating" },
    { icon: TrendingUp, value: "$12M+", label: "Revenue Protected" },
    { icon: Award, value: "99.9%", label: "Uptime" },
  ];

  return (
    <section className="py-8 sm:py-16 relative" data-testid="section-social-proof">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          className="grid grid-cols-4 gap-3 sm:gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              className="text-center"
              variants={fadeUp}
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-md bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <div className="text-lg sm:text-3xl font-extrabold text-foreground mb-0.5">
                {stat.value}
              </div>
              <div className="text-[9px] sm:text-sm text-muted-foreground">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ServicesOverview() {
  const services = [
    {
      icon: CreditCard,
      title: "Payment Processing",
      description: "Zero-fee terminals starting at $399. Keep 100% of every sale with no monthly fees and no contracts.",
      href: "/pricing",
      cta: "See Pricing",
      color: "text-primary",
      border: "border-primary/20",
      accent: "from-primary/10 to-transparent",
    },
    {
      icon: Zap,
      title: "How It Works",
      description: "Three simple steps: choose your plan, we set everything up same-day, and you keep every dollar.",
      href: "/how-it-works",
      cta: "Learn More",
      color: "text-chart-2",
      border: "border-chart-2/20",
      accent: "from-chart-2/10 to-transparent",
    },
    {
      icon: Globe,
      title: "Free Custom Website",
      description: "Every TechSavvy merchant gets a professional business website — mobile-optimized and SEO-ready.",
      href: "/our-work",
      cta: "See Examples",
      color: "text-chart-3",
      border: "border-chart-3/20",
      accent: "from-chart-3/10 to-transparent",
    },
    {
      icon: ShieldCheck,
      title: "High-Risk Merchants",
      description: "CBD, vape, firearms, gaming & more — same zero-fee processing with fast approvals.",
      href: "/high-risk",
      cta: "Learn More",
      color: "text-chart-4",
      border: "border-chart-4/20",
      accent: "from-chart-4/10 to-transparent",
    },
  ];

  return (
    <section className="py-12 sm:py-24 relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-10 sm:mb-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.div variants={fadeUp}>
            <Badge variant="outline" className="mb-4 text-primary border-primary/30 bg-primary/5">
              Our Services
            </Badge>
          </motion.div>
          <motion.h2
            className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3"
            variants={fadeUp}
          >
            Everything Your Business Needs
          </motion.h2>
          <motion.p
            className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-lg"
            variants={fadeUp}
          >
            Payment processing, websites, and support — all from one trusted Hawai'i company.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-5xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {services.map((s, i) => (
            <motion.div key={i} variants={scaleIn}>
              <Card className={`h-full overflow-visible ${s.border}`}>
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-b ${s.accent}`} />
                <CardContent className="p-5 sm:p-7 relative">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                      <s.icon className={`w-5 h-5 ${s.color}`} />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-foreground">{s.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {s.description}
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={s.href}>
                      {s.cta}
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
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
              Every TechSavvy merchant gets a free custom website — here's what yours could look like.
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

          <motion.div className="text-center mt-6 sm:mt-10" variants={fadeUp}>
            <Button variant="outline" size="lg" asChild>
              <Link href="/our-work">
                See Our Work
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
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
                  <div className="text-2xl font-extrabold text-primary mb-2">$99–$399/mo</div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Hands-off — we handle hosting, security, SEO & updates
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div className="text-center mt-6 sm:mt-10" variants={fadeUp}>
            <Button variant="outline" size="lg" asChild>
              <Link href="/our-work">
                See Full Plan Details
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function QuickPricingPreview() {
  return (
    <section className="py-12 sm:py-24 relative">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-card/30 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-8 sm:mb-14"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.div variants={fadeUp}>
            <Badge variant="outline" className="mb-4 text-primary border-primary/30 bg-primary/5">
              <DollarSign className="w-3 h-3 mr-1.5" />
              Pricing
            </Badge>
          </motion.div>
          <motion.h2
            className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3"
            variants={fadeUp}
          >
            Simple, Transparent Pricing
          </motion.h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {[
            {
              title: "In-Store Terminal",
              price: "$399",
              note: "One-time · Best Value",
              icon: CreditCard,
              color: "text-primary",
              border: "border-primary/20",
              features: ["Own it from day one", "Free custom website", "Zero fees forever"],
            },
            {
              title: "30-Day Trial",
              price: "FREE",
              note: "Then $599 if you keep it",
              icon: Clock,
              color: "text-chart-4",
              border: "border-chart-4/20",
              features: ["Try before you buy", "Real transactions", "Return anytime"],
            },
            {
              title: "Online-Only",
              price: "FREE",
              note: "With Cash Discount Processing",
              icon: Globe,
              color: "text-chart-2",
              border: "border-chart-2/20",
              features: ["Free website built for you", "Optional maintenance plans", "Host your own site"],
            },
          ].map((plan, i) => (
            <motion.div key={i} variants={scaleIn}>
              <Card className={`h-full overflow-visible ${plan.border}`}>
                <CardContent className="p-5 sm:p-6 text-center">
                  <div className={`w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center mx-auto mb-3`}>
                    <plan.icon className={`w-5 h-5 ${plan.color}`} />
                  </div>
                  <h3 className="font-bold text-foreground mb-1">{plan.title}</h3>
                  <div className={`text-2xl sm:text-3xl font-extrabold ${plan.color} mb-1`}>{plan.price}</div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground mb-4">{plan.note}</div>
                  <ul className="space-y-2 text-left mb-4">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <Check className={`w-3.5 h-3.5 ${plan.color} shrink-0`} />
                        <span className="text-foreground/80">{f}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-6 sm:mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Button size="lg" asChild>
            <Link href="/pricing">
              Compare All Options
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

function TestimonialSection() {
  const testimonials = [
    {
      quote: "Switching to TechSavvy saved us over $4,800 last year. The free website brings in new customers every week.",
      name: "Marcus Kalani",
      role: "Kalani's Auto Repair — Honolulu",
      rating: 5,
    },
    {
      quote: "Zero monthly fees means we keep what we earn. Setup was same day and they built us a beautiful website.",
      name: "Sarah Chen",
      role: "Golden Lotus Restaurant — Maui",
      rating: 5,
    },
    {
      quote: "As a high-risk CBD merchant, nobody would work with us. TechSavvy got us approved same day with zero fees.",
      name: "David Kealoha",
      role: "Island Wellness CBD — Kona",
      rating: 5,
    },
  ];

  return (
    <section className="py-12 sm:py-24 relative" data-testid="section-testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-8 sm:mb-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.div variants={fadeUp}>
            <Badge variant="outline" className="mb-4 text-chart-3 border-chart-3/30 bg-chart-3/5">
              <Star className="w-3 h-3 mr-1.5" />
              Testimonials
            </Badge>
          </motion.div>
          <motion.h2
            className="text-2xl sm:text-4xl font-extrabold tracking-tight"
            variants={fadeUp}
          >
            Hawai'i Businesses Love TechSavvy
          </motion.h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {testimonials.map((t, i) => (
            <motion.div key={i} variants={scaleIn}>
              <Card className="h-full overflow-visible border-chart-3/10">
                <CardContent className="p-5 sm:p-7">
                  <div className="flex items-center gap-0.5 mb-3">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-3.5 h-3.5 fill-chart-3 text-chart-3" />
                    ))}
                  </div>
                  <p className="text-sm text-foreground/90 mb-4 leading-relaxed italic">
                    "{t.quote}"
                  </p>
                  <div>
                    <div className="font-semibold text-xs sm:text-sm text-foreground">{t.name}</div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground">{t.role}</div>
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

function CTASection() {
  return (
    <section className="py-12 sm:py-24 relative" data-testid="section-cta">
      <div className="absolute inset-0 -z-10">
        <img
          src="/images/serving-hawaii.jpg"
          alt="Proudly Serving Honolulu Businesses"
          className="w-full h-full object-cover object-center opacity-10 sm:opacity-15"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative rounded-xl overflow-visible p-[1px]">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/50 via-emerald-300/30 to-primary/50" />
            <div className="relative rounded-xl bg-gradient-to-b from-card via-card to-background p-6 sm:p-12 lg:p-16 text-center">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-primary/10 to-transparent" />
              <div className="relative">
                <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mb-4 text-foreground">
                  Processing Savings + Website ={" "}
                  <span className="bg-gradient-to-r from-primary to-emerald-300 bg-clip-text text-transparent">
                    More Profit
                  </span>
                </h2>
                <p className="text-muted-foreground text-sm sm:text-lg mb-6 sm:mb-10 max-w-2xl mx-auto">
                  Stop losing money to processing fees. Get your terminal starting at $399 — plus a free custom website.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Button size="lg" className="w-full sm:w-auto" asChild>
                    <Link href="/contact">
                      Get Free Mockup + Savings Quote
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
                    <Link href="/contact">
                      Have Questions? Let's Talk
                    </Link>
                  </Button>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mt-6 sm:mt-10 text-xs sm:text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span>Same-Day Setup</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-primary" />
                    <span>Free Website</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-primary" />
                    <span>Zero Fees</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <Layout>
      <HeroSection />
      <SocialProofBar />
      <ServicesOverview />
      <QuickPricingPreview />
      <PortfolioShowcase />
      <WebsiteUpkeepOverview />
      <TestimonialSection />
      <CTASection />
    </Layout>
  );
}
