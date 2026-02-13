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
  Loader2,
} from "lucide-react";
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fadeUp, staggerContainer, scaleIn } from "@/lib/animations";
import Layout from "@/components/layout";
import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";

interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  url: string;
  thumbnailUrl: string;
  order: number;
  featured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

const CATEGORIES = [
  { id: "all", label: "All Resources", icon: BookOpen },
  { id: "sales-materials", label: "Sales Materials", icon: Target },
  { id: "pos-systems", label: "POS Systems", icon: Megaphone },
  { id: "classroom", label: "CashSwipe Classroom", icon: GraduationCap },
];

const TYPE_COLORS: Record<string, string> = {
  pdf: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  doc: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  video: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  template: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  link: "text-sky-400 bg-sky-400/10 border-sky-400/20",
};

const TYPE_LABELS: Record<string, string> = {
  pdf: "PDF",
  doc: "Guide",
  video: "Video",
  template: "Template",
  link: "Link",
};

function HeroSection({ count }: { count: number }) {
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
            Sales materials, POS battlecards, and all training modules from
            the CashSwipe Clients classroom — hosted on Google Drive.
          </motion.p>

          <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-3" variants={fadeUp}>
            <Badge variant="outline" className="text-xs text-muted-foreground">
              <FolderOpen className="w-3 h-3 mr-1" />
              {count} files available
            </Badge>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function FileCard({ file }: { file: Resource }) {
  const color = TYPE_COLORS[file.type] || TYPE_COLORS.doc;
  const Icon = file.type === "pdf" ? FileText : BookOpen;
  const label = TYPE_LABELS[file.type] || file.type;

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
                {label}
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

function FeaturedResources({ resources }: { resources: Resource[] }) {
  const featured = resources.filter((f) => f.featured);
  if (featured.length === 0) return null;

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
            {featured.map((file) => (
              <FileCard key={file.id} file={file} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function AllResources({ resources, searchQuery }: { resources: Resource[]; searchQuery: string }) {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return resources.filter((f) => {
      const matchesCat = activeCategory === "all" || f.category === activeCategory;
      const matchesSearch =
        !query ||
        f.title.toLowerCase().includes(query) ||
        f.description.toLowerCase().includes(query);
      return matchesCat && matchesSearch;
    });
  }, [activeCategory, searchQuery, resources]);

  return (
    <section className="py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const count = cat.id === "all"
              ? resources.length
              : resources.filter((f) => f.category === cat.id).length;
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
            {filtered.map((file) => (
              <FileCard key={file.id} file={file} />
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

  // Fetch resources from the API (seeded from Google Drive in the backend)
  const { data: resources = [], isLoading } = useQuery<Resource[]>({
    queryKey: ["/api/resources"],
  });

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
      <HeroSection count={resources.length} />

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

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : (
        <>
          {!searchQuery && <FeaturedResources resources={resources} />}
          <AllResources resources={resources} searchQuery={searchQuery} />
        </>
      )}
      <CTASection />
    </Layout>
  );
}
