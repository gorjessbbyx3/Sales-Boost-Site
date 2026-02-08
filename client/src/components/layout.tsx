import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Menu,
  XIcon,
  MapPin,
  Phone,
  Mail,
  Clock,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHome = location === "/";

  const links = [
    { label: "How It Works", href: isHome ? "#how-it-works" : "/#how-it-works", isPage: false },
    { label: "Pricing", href: isHome ? "#pricing" : "/#pricing", isPage: false },
    { label: "Web Design", href: "/web-design", isPage: true },
    { label: "High-Risk", href: "/high-risk", isPage: true },
    { label: "FAQ", href: "/contact", isPage: true },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border"
          : "bg-transparent"
      }`}
      data-testid="navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          <Link
            href="/"
            className="font-bold text-xl tracking-tight flex items-center gap-2.5"
            data-testid="link-logo"
          >
            <img src="/images/IMG_6304.png" alt="Edify Limited" className="w-9 h-9 rounded" />
            <span className="text-foreground">Edify</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((l) =>
              l.isPage ? (
                <Link
                  key={l.href}
                  href={l.href}
                  className="px-3 py-2 text-sm text-muted-foreground transition-colors rounded-md hover:text-foreground"
                  data-testid={`link-nav-${l.label.toLowerCase().replace(/\s/g, "-")}`}
                >
                  {l.label}
                </Link>
              ) : (
                <a
                  key={l.href}
                  href={l.href}
                  className="px-3 py-2 text-sm text-muted-foreground transition-colors rounded-md hover:text-foreground"
                  data-testid={`link-nav-${l.label.toLowerCase().replace(/\s/g, "-")}`}
                >
                  {l.label}
                </a>
              )
            )}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/contact" data-testid="link-nav-contact">
                Contact Us
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/contact" data-testid="link-nav-get-terminal">
                Get Your Terminal
                <ArrowRight className="w-3 h-3" />
              </Link>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileOpen ? <XIcon /> : <Menu />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border px-4 pb-4">
          {links.map((l) =>
            l.isPage ? (
              <Link
                key={l.href}
                href={l.href}
                className="block px-3 py-2.5 text-sm text-muted-foreground"
                onClick={() => setMobileOpen(false)}
                data-testid={`link-mobile-${l.label.toLowerCase().replace(/\s/g, "-")}`}
              >
                {l.label}
              </Link>
            ) : (
              <a
                key={l.href}
                href={l.href}
                className="block px-3 py-2.5 text-sm text-muted-foreground"
                onClick={() => setMobileOpen(false)}
                data-testid={`link-mobile-${l.label.toLowerCase().replace(/\s/g, "-")}`}
              >
                {l.label}
              </a>
            )
          )}
          <div className="mt-3 flex flex-col gap-2">
            <Button size="sm" asChild className="w-full">
              <Link href="/contact" data-testid="link-mobile-get-terminal">
                Get Your Terminal
              </Link>
            </Button>
            <a
              href="tel:+18087675460"
              className="flex items-center justify-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Phone className="w-4 h-4 text-primary" />
              (808) 767-5460
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/50 py-8 sm:py-14 relative" data-testid="section-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10">
          <div className="col-span-2 md:col-span-1">
            <div className="font-bold text-base sm:text-lg flex items-center gap-2 mb-3">
              <img src="/images/IMG_6304.png" alt="Edify Limited" className="w-7 h-7 sm:w-8 sm:h-8 rounded" />
              <span className="text-foreground">Edify Limited</span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm mb-3">
              Hawai'i's trusted payment processing and web design company. Zero fees — plus free websites for every merchant.
            </p>
            <div className="space-y-2.5 text-sm text-muted-foreground">
              <a href="tel:+18087675460" className="flex items-center gap-2 transition-colors hover:text-foreground">
                <Phone className="w-3.5 h-3.5 text-primary" />
                <span>(808) 767-5460</span>
              </a>
              <a href="mailto:edifyhawaii@gmail.com" className="flex items-center gap-2 transition-colors hover:text-foreground">
                <Mail className="w-3.5 h-3.5 text-primary" />
                <span>edifyhawaii@gmail.com</span>
              </a>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span>Mon–Fri, 8:00 AM – 5:00 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span>Honolulu, Hawai'i</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 text-foreground">Services</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="/#pricing" className="transition-colors hover:text-foreground" data-testid="link-footer-pricing">
                  Payment Processing
                </a>
              </li>
              <li>
                <Link href="/web-design" className="transition-colors hover:text-foreground" data-testid="link-footer-web-design">
                  Website Design
                </Link>
              </li>
              <li>
                <Link href="/high-risk" className="transition-colors hover:text-foreground" data-testid="link-footer-high-risk">
                  High-Risk Merchants
                </Link>
              </li>
              <li>
                <a href="/#how-it-works" className="transition-colors hover:text-foreground" data-testid="link-footer-features">
                  How It Works
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 text-foreground">Quick Links</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="/#how-it-works" className="transition-colors hover:text-foreground" data-testid="link-footer-how">
                  How It Works
                </a>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-foreground" data-testid="link-footer-faq">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-foreground" data-testid="link-footer-contact">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/" className="transition-colors hover:text-foreground" data-testid="link-footer-top">
                  Home
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 text-foreground">Serving Hawai'i</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>Honolulu & O'ahu</li>
              <li>Maui</li>
              <li>Big Island (Kona & Hilo)</li>
              <li>Kaua'i & Neighbor Islands</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 mt-10 pt-8 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Edify Limited. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
