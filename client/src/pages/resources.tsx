import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
  BookOpen,
  FileText,
  Search,
  Star,
  ArrowRight,
  ExternalLink,
  Target,
  Megaphone,
  GraduationCap,
  FolderOpen,
} from "lucide-react";
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { fadeUp, staggerContainer, scaleIn } from "@/lib/animations";
import Layout from "@/components/layout";
import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";

// ── Hardcoded CashSwipe Classroom Drive files ─────────────────────
// These always show regardless of DB state

interface DriveFile {
  title: string;
  description: string;
  category: "sales-materials" | "pos-systems" | "classroom";
  type: "pdf" | "doc";
  url: string;
  featured?: boolean;
}

const DRIVE_FILES: DriveFile[] = [
  // ── Client Sales Resources ──────────────────────────────────────
  { title: "Cash Discount Program — Part 1", description: "Comprehensive guide to the Cash Discount Program covering compliance, implementation, and customer communication.", category: "sales-materials", type: "pdf", url: "https://drive.google.com/file/d/1yiqqPiOkcTUizcncUYE7v0fs5ezPDMFu/view", featured: true },
  { title: "Cash Discount Program — Part 2", description: "Visual companion to the Cash Discount Program guide. Print-ready infographic with program details and signage requirements.", category: "sales-materials", type: "pdf", url: "https://drive.google.com/file/d/1FYLYcqF9Wm0vi4da2WQI4aaIyCw193qs/view" },
  { title: "3x4 Sticker Design", description: "Print-ready 3x4 sticker design for terminal branding and point-of-sale signage.", category: "sales-materials", type: "pdf", url: "https://drive.google.com/file/d/11Gi1iVlaQAxKA0FxkzQ_JxJBocs0N012/view" },
  { title: "Sales Flyer 1", description: "Professional sales flyer for merchant outreach — highlights zero-fee processing benefits and terminal offer.", category: "sales-materials", type: "pdf", url: "https://drive.google.com/file/d/1U2JEMh6qh-c_YoYODsQePykFUXcstXti/view", featured: true },
  { title: "Sales Flyer 2", description: "Alternative flyer design for different merchant verticals. Print-ready format.", category: "sales-materials", type: "pdf", url: "https://drive.google.com/file/d/18Q68EIHNAmyYD6Sc57NA9r05cP4tgCbx/view" },
  { title: "Sales Flyer 3", description: "Detailed sales flyer with pricing breakdown and feature comparison.", category: "sales-materials", type: "pdf", url: "https://drive.google.com/file/d/1Pn9QfiffkruzyuK2YAiOPlipNuexmqWc/view" },
  { title: "Sales Flyer 4", description: "Walk-in leave-behind flyer designed for high-impact first impressions.", category: "sales-materials", type: "pdf", url: "https://drive.google.com/file/d/1X2zv7bIA9QxYPhbfUg9IEL74tpkElvxK/view" },
  { title: "Savings Calculator — Page 1", description: "Visual savings calculator showing merchants exactly how much they save with zero-fee processing.", category: "sales-materials", type: "pdf", url: "https://drive.google.com/file/d/1_DSpS5jGL1AIe9mlzr2S19Nz-_-gIv6f/view", featured: true },
  { title: "Savings Calculator — Page 2", description: "Extended savings breakdown with annual projections and comparison charts.", category: "sales-materials", type: "pdf", url: "https://drive.google.com/file/d/1Pxc9mgUKGCExnT5PEbBCJoY06EheVQYh/view" },

  // ── POS Systems & Battlecards ───────────────────────────────────
  { title: "Battlecard — Aloha POS", description: "Competitive battlecard: RPOWER vs. Aloha POS. Key differentiators, objection handlers, and win strategies.", category: "pos-systems", type: "pdf", url: "https://drive.google.com/file/d/1q1-eylUdUoeVKoUgntf1cGLmZ8_Pg_Yi/view", featured: true },
  { title: "Battlecard — Clover", description: "Competitive battlecard: RPOWER vs. Clover. Feature comparison, pricing advantages, and sales talking points.", category: "pos-systems", type: "pdf", url: "https://drive.google.com/file/d/1Ha067oNONsNA4ZRI3NAchQq41yTrM5vT/view", featured: true },
  { title: "Battlecard — SkyTab", description: "Competitive battlecard: RPOWER vs. SkyTab. Side-by-side comparison for restaurant merchants.", category: "pos-systems", type: "pdf", url: "https://drive.google.com/file/d/12lf3AEDrdpn8eU1du81bKHUIWb2pknR3/view" },
  { title: "Battlecard — Toast", description: "Competitive battlecard: RPOWER vs. Toast. Counter-arguments for the most common POS competitor.", category: "pos-systems", type: "pdf", url: "https://drive.google.com/file/d/11VtrwKmJGV0HdWK8ZwgZNH5RyeQfXWxC/view", featured: true },
  { title: "RPOWER Reseller Presentation", description: "Complete reseller overview presentation covering RPOWER POS capabilities, pricing, and partnership model.", category: "pos-systems", type: "doc", url: "https://drive.google.com/file/d/1etbM1RikvCfRP-Xj7fQWcGZOUtxdcYFO/view", featured: true },
  { title: "RPOWER Buyer's Guide", description: "Comprehensive buyer's guide — features, pricing tiers, hardware options, and ROI calculator.", category: "pos-systems", type: "pdf", url: "https://drive.google.com/file/d/1I7WYWDtQNr30BQyPZ4ypIYFoAFiWZBZi/view" },
  { title: "RPOWER Reference Information", description: "Quick reference sheet with RPOWER technical specs, support contacts, and implementation timeline.", category: "pos-systems", type: "doc", url: "https://drive.google.com/file/d/1RM-7N44B8mxUkB2trR2NGlLjpbOYoZBt/view" },
  { title: "RPOWER mPay — Contactless Payments", description: "mPay contactless payment solution — tap-to-pay, mobile wallets, NFC capabilities.", category: "pos-systems", type: "pdf", url: "https://drive.google.com/file/d/1dlQJheSIL2YlfPUTcGe_XlKksrBn-NYK/view" },
  { title: "RPOWER — Accounting Integration", description: "How RPOWER integrates with accounting platforms for seamless financial reporting.", category: "pos-systems", type: "pdf", url: "https://drive.google.com/file/d/1FjsBCRO1ytBTklXfdDUEXzKv8kaSFd7L/view" },
  { title: "RPOWER — Bar & Nightclub", description: "POS solutions for bars and nightclubs — tab management, speed ordering, ID verification.", category: "pos-systems", type: "pdf", url: "https://drive.google.com/file/d/12qfP2eAU3quFOcygDCd6eTW6XUnm6e2k/view" },
  { title: "RPOWER — Full POS Brochure", description: "Complete RPOWER POS system brochure covering all features, hardware, and service plans.", category: "pos-systems", type: "pdf", url: "https://drive.google.com/file/d/105yY_FGwTcoCcpGAfkHkWseIw8p6h0md/view" },
  { title: "RPOWER — Counter Service", description: "POS solutions for counter-service restaurants — quick ordering, kitchen display, and screens.", category: "pos-systems", type: "pdf", url: "https://drive.google.com/file/d/191MbqX_JPkCVxMsKfFWvGNbQvS9sROlp/view" },
  { title: "RPOWER — Delivery & Pickup", description: "Online ordering, delivery dispatch, and curbside pickup capabilities.", category: "pos-systems", type: "pdf", url: "https://drive.google.com/file/d/1tmCe3OJNu298zDdKJ1V4qptlqJGj8iIr/view" },
  { title: "RPOWER — Fine Dining", description: "Premium POS features — coursing, split checks, wine list management, tableside ordering.", category: "pos-systems", type: "pdf", url: "https://drive.google.com/file/d/1DQ2gehnSQqn6Cgh5S6OeiyPw4Adeituf/view" },
  { title: "RPOWER — Gift & Loyalty", description: "Built-in gift card and loyalty program features to drive repeat business.", category: "pos-systems", type: "pdf", url: "https://drive.google.com/file/d/1Y-QuyMP04A83tS7ONAgOCOioIPVf9_xC/view" },
  { title: "RPOWER — Mobile POS", description: "Handheld and tablet POS solutions for tableside ordering, food trucks, and events.", category: "pos-systems", type: "pdf", url: "https://drive.google.com/file/d/1hz3ID7cvAyuStE5NTqvNJJnf-T2b5eP2/view" },
  { title: "RPOWER — rPortal Reporting", description: "Cloud-based reporting portal — real-time sales data, labor costs, inventory tracking.", category: "pos-systems", type: "pdf", url: "https://drive.google.com/file/d/1PieDCMCkzMXOJtTCudtEHiwYZwd2uwTh/view" },

  // ── CashSwipe Classroom ─────────────────────────────────────────
  { title: "5 Powerful Icebreakers to Start Conversations with Merchants", description: "Proven icebreaker techniques for engaging merchants in sales conversations. Essential training for new reps.", category: "classroom", type: "doc", url: "https://drive.google.com/file/d/1RauUWaVTQf_7HqYKOMhv6zkDrlqPPlrg/view", featured: true },
  { title: "Understanding Your Merchant Statement", description: "Guide to reading and analyzing merchant processing statements. Key skill for identifying savings opportunities.", category: "classroom", type: "doc", url: "https://drive.google.com/file/d/1w7XMTJYzFiyDYksrzA7jamk_8GlpiYcE/view", featured: true },
  ...[
    "1Us7dWmw7CYhfMP1U2q27n0scmj0Av9Pm", "1BXTK7aTZCW9_fhOJu8KlaeVtR1IDvmUq",
    "1l3t7yW1_5oeit0aIZIjCskql3C94Yfa1", "1TOCLzJh0dg7c181kvo1qUU_okOu1ZfbZ",
    "1cGqO1QvA_vuATHvsCtJc6r_1fouwh7No", "12-PUec5esxoFjXPsL8oypOe3OuwRWO6D",
    "1Rzj3ZETBB6MHCHFaFQ0AjcIHURosoyhS", "1fogX8lg-UuLfFrQzUR9QEouQVif6R5mQ",
    "12A1fXMG8v9HQpI2r98rCHOmebrXbZRqa", "1DCNp6oxvbms0PE5PDoEHWLcHzw-IwkyF",
    "1q8QZC5LQ_3AieouFfvGmvqtFTk6_knGt", "1uVFKc4ClEk5tLwx74Xx0QIiqb-pgt-xj",
    "1rEiOFLa2HtRlqa8ndbBmPPBthhdmLs_w", "1ODZ93kA7ieOWRVX3GfQqM334lrx4olgX",
    "14vTjgJb9sJnQbiMM4Tlk6WF4lj0Lc8sF", "1KcfNeHvEqFGX0pGW1aT9ZLCuHtCNGjN4",
    "1sxkGBGDxc7wMjHgMG4vF0H8eDalngZcX", "1RXWIWZQpVIUNfgu4clvn3M9T9XVkq1-r",
    "1UFZ9ApuUcSJbNpq33jbNSSDwsmygWH_k", "1cYvt5iNHSRFpRa3AWurxHCD8WIsZ3-Av",
    "1JIKQLLnCPO2s6PYB3HpCaoCzjRqI9ty-", "131x-bp7IkvAmn6-hxqz7W9ykNAIGajxa",
    "1gxUzlw3WdBRgh9x5rOS_bsJHXTVabbza", "1RPI5e7V-OLV4Sh8lGPDT0fGXUS-zXzdc",
    "1TMRzlQ8XQYTEkeSTGTsX0JCG1pmlyukv", "1q81ISq3PVU6O1CG1NiJvdSRGLL_bjnES",
    "1IfCuI7DdA57VXyJhQCRYZZuWyM9wyYXo", "1Y9ynOphu3AqU1oP2A_ET8uQ3ptqWjyAG",
    "1uJVDvzBno4PMfuDiHRLxhi37k1pc3Vob", "1rz3r6kW_qUMmliR0YVJeDSV5Mtv6i2cI",
    "1i_Z2X6cDgr4WB9lxVzMHYXjNguxGj0PH", "1BXgkwLkdL0_hCBUWLaF4OFRKoBQJIUT7",
    "1qcBAyga_1BD7JfgGuHY-TojajCbU61X_", "1fS3MOxhZ61agT64OQUgCHe6bV7IPtm3Y",
  ].map((id, i) => ({
    title: `CashSwipe Training — Module ${i + 1}`,
    description: "Training PDF from the CashSwipe Clients classroom. Open in Google Drive to view or download.",
    category: "classroom" as const,
    type: "pdf" as const,
    url: `https://drive.google.com/file/d/${id}/view`,
  })),
];

const CATEGORIES = [
  { id: "all", label: "All Resources", icon: BookOpen },
  { id: "sales-materials", label: "Sales Materials", icon: Target },
  { id: "pos-systems", label: "POS Systems", icon: Megaphone },
  { id: "classroom", label: "CashSwipe Classroom", icon: GraduationCap },
];

const TYPE_COLORS: Record<string, string> = {
  pdf: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  doc: "text-blue-400 bg-blue-400/10 border-blue-400/20",
};

function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-20 pb-10 sm:pt-36 sm:pb-16">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/8 via-primary/3 to-transparent" />
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="flex flex-wrap items-center justify-center gap-2" variants={fadeUp}>
            <Badge variant="outline" className="mb-3 text-primary border-primary/30 bg-primary/5">
              <GraduationCap className="w-3 h-3 mr-1" />
              CashSwipe Classroom
            </Badge>
          </motion.div>

          <motion.h1
            className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1] mb-4 sm:mb-6"
            variants={fadeUp}
          >
            CashSwipe Clients{" "}
            <span className="bg-gradient-to-r from-primary to-emerald-300 bg-clip-text text-transparent">
              Resource Library
            </span>
          </motion.h1>

          <motion.p
            className="text-sm sm:text-lg text-muted-foreground leading-relaxed mb-6 max-w-2xl mx-auto"
            variants={fadeUp}
          >
            Sales materials, POS battlecards, and all 34 training modules from
            the CashSwipe Clients classroom — hosted on Google Drive.
          </motion.p>

          <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-3" variants={fadeUp}>
            <Badge variant="outline" className="text-xs text-muted-foreground">
              <FolderOpen className="w-3 h-3 mr-1" />
              {DRIVE_FILES.length} files on Google Drive
            </Badge>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function FileCard({ file }: { file: DriveFile }) {
  const color = TYPE_COLORS[file.type] || TYPE_COLORS.doc;
  const Icon = file.type === "pdf" ? FileText : BookOpen;

  return (
    <motion.div variants={scaleIn}>
      <a
        href={file.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block group"
      >
        <Card className="h-full bg-card/50 border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
          <CardContent className="p-5">
            <div className="flex items-start gap-3 mb-3">
              <Badge variant="outline" className={`shrink-0 text-xs ${color}`}>
                <Icon className="w-3 h-3 mr-1" />
                {file.type === "pdf" ? "PDF" : "Guide"}
              </Badge>
              {file.featured && (
                <Badge variant="outline" className="shrink-0 text-xs text-amber-400 bg-amber-400/10 border-amber-400/20">
                  <Star className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
            </div>

            <h3 className="font-semibold text-foreground mb-2 leading-snug group-hover:text-primary transition-colors">
              {file.title}
            </h3>

            <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
              {file.description}
            </p>

            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary group-hover:text-primary/80 transition-colors">
              Open in Google Drive
              <ExternalLink className="w-3.5 h-3.5" />
            </span>
          </CardContent>
        </Card>
      </a>
    </motion.div>
  );
}

function FeaturedResources() {
  const featured = DRIVE_FILES.filter((f) => f.featured);

  return (
    <section className="py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.div className="flex items-center gap-3 mb-8" variants={fadeUp}>
            <Star className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl sm:text-2xl font-bold">Featured Resources</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((file, i) => (
              <FileCard key={i} file={file} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function AllResources({ searchQuery }: { searchQuery: string }) {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return DRIVE_FILES.filter((f) => {
      const matchesCat = activeCategory === "all" || f.category === activeCategory;
      const matchesSearch =
        !query ||
        f.title.toLowerCase().includes(query) ||
        f.description.toLowerCase().includes(query);
      return matchesCat && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <section className="py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const count = cat.id === "all"
              ? DRIVE_FILES.length
              : DRIVE_FILES.filter((f) => f.category === cat.id).length;
            return (
              <Button
                key={cat.id}
                variant={activeCategory === cat.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(cat.id)}
                className="gap-1.5"
              >
                <Icon className="w-3.5 h-3.5" />
                {cat.label}
                <Badge
                  variant="secondary"
                  className={`ml-1 text-xs px-1.5 py-0 ${
                    activeCategory === cat.id
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {count}
                </Badge>
              </Button>
            );
          })}
        </div>

        {filtered.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            key={activeCategory + searchQuery}
          >
            {filtered.map((file, i) => (
              <FileCard key={`${file.title}-${i}`} file={file} />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16">
            <Search className="w-10 h-10 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-muted-foreground">No resources found matching your criteria.</p>
          </div>
        )}
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/15 via-primary/5 to-transparent border border-primary/20 p-8 sm:p-12 text-center"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
          <h2 className="text-xl sm:text-3xl font-bold mb-4 relative z-10">
            Ready to Start Closing Deals?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-6 relative z-10">
            Get your free terminal and start processing payments with zero fees today.
            Our team will help you set everything up.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 relative z-10">
            <Button size="lg" asChild>
              <Link href="/contact">
                Get Your Terminal
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/connect">
                Connect With Us
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function ResourcesPage() {
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearchQuery(value), 250);
  }, []);

  useEffect(() => {
    return () => clearTimeout(debounceRef.current);
  }, []);

  useSEO({
    title: "CashSwipe Classroom — Resources | TechSavvy Hawaii",
    description: "Access sales materials, POS battlecards, and all 34 CashSwipe training modules. Everything you need to build your merchant services business.",
    canonical: "https://techsavvyhawaii.com/resources",
  });

  return (
    <Layout>
      <HeroSection />

      {/* Search bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative max-w-md mx-auto sm:mx-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            value={inputValue}
            onChange={handleSearchChange}
            className="pl-9 bg-card/50 border-border/50"
          />
        </div>
      </div>

      {!searchQuery && <FeaturedResources />}
      <AllResources searchQuery={searchQuery} />
      <CTASection />
    </Layout>
  );
}
