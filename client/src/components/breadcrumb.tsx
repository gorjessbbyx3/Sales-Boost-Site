import { Link, useLocation } from "wouter";
import { ChevronRight, Home } from "lucide-react";

const routeNames: Record<string, string> = {
  "/pricing": "Pricing",
  "/how-it-works": "How It Works",
  "/high-risk": "High-Risk Merchants",
  "/contact": "Contact",
  "/faq": "FAQ",
  "/connect": "Connect",
  "/statement-review": "Statement Analysis",
  "/refer": "Refer a Business",
  "/apply": "Apply",
};

export function Breadcrumb() {
  const [location] = useLocation();
  if (location === "/") return null;

  const name = routeNames[location] || location.replace("/", "").replace(/-/g, " ");

  return (
    <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-0" aria-label="Breadcrumb">
      <ol className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <li>
          <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1">
            <Home className="w-3 h-3" />
            Home
          </Link>
        </li>
        <li><ChevronRight className="w-3 h-3" /></li>
        <li className="text-foreground font-medium capitalize">{name}</li>
      </ol>
    </nav>
  );
}
