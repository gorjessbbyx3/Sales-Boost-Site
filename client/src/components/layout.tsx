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

  const links = [
    { label: "How It Works", href: "/how-it-works" },
    { label: "Pricing", href: "/pricing" },
    { label: "Online Processing", href: "/online-processing" },
    { label: "High-Risk", href: "/high-risk" },
    { label: "FAQ", href: "/contact" },
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
            <span className="text-foreground font-extrabold text-xl tracking-tight"><span className="text-primary italic">λ</span>echSavvy</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-2 text-sm transition-colors rounded-md hover:text-foreground ${
                  location === l.href ? "text-foreground font-medium" : "text-muted-foreground"
                }`}
                data-testid={`link-nav-${l.label.toLowerCase().replace(/\s/g, "-")}`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/connect" data-testid="link-nav-connect">
                Connect
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
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`block px-3 py-2.5 text-sm ${
                location === l.href ? "text-foreground font-medium" : "text-muted-foreground"
              }`}
              onClick={() => setMobileOpen(false)}
              data-testid={`link-mobile-${l.label.toLowerCase().replace(/\s/g, "-")}`}
            >
              {l.label}
            </Link>
          ))}
          <div className="mt-3 flex flex-col gap-2">
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link href="/connect" data-testid="link-mobile-connect" onClick={() => setMobileOpen(false)}>
                Connect With Us
              </Link>
            </Button>
            <Button size="sm" asChild className="w-full">
              <Link href="/contact" data-testid="link-mobile-get-terminal" onClick={() => setMobileOpen(false)}>
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
    <footer className="relative py-8 sm:py-14 overflow-hidden" data-testid="section-footer">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        src="/videos/footer-bg.mp4"
      />
      <div className="absolute inset-0 bg-black/75" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10">
          <div className="col-span-2 md:col-span-1">
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed max-w-sm mb-3">
              Hawai'i's trusted payment processing and web design company. Zero fees — plus free websites for online-only merchants.
            </p>
            <div className="space-y-2.5 text-sm text-white/60">
              <a href="tel:+18087675460" className="flex items-center gap-2 transition-colors hover:text-white">
                <Phone className="w-3.5 h-3.5 text-primary" />
                <span>(808) 767-5460</span>
              </a>
              <a href="mailto:contact@techsavvyhawaii.com" className="flex items-center gap-2 transition-colors hover:text-white">
                <Mail className="w-3.5 h-3.5 text-primary" />
                <span>contact@techsavvyhawaii.com</span>
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
            <h4 className="font-semibold text-sm mb-4 text-white">Services</h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li>
                <Link href="/pricing" className="transition-colors hover:text-white" data-testid="link-footer-pricing">
                  Payment Processing
                </Link>
              </li>
              <li>
                <Link href="/online-processing" className="transition-colors hover:text-white" data-testid="link-footer-online-processing">
                  Online Processing
                </Link>
              </li>
              <li>
                <Link href="/high-risk" className="transition-colors hover:text-white" data-testid="link-footer-high-risk">
                  High-Risk Merchants
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="transition-colors hover:text-white" data-testid="link-footer-features">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 text-white">Quick Links</h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li>
                <Link href="/how-it-works" className="transition-colors hover:text-white" data-testid="link-footer-how">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-white" data-testid="link-footer-faq">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-white" data-testid="link-footer-contact">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/connect" className="transition-colors hover:text-white" data-testid="link-footer-connect">
                  Connect With Us
                </Link>
              </li>
              <li>
                <Link href="/" className="transition-colors hover:text-white" data-testid="link-footer-top">
                  Home
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 text-white">Serving Hawai'i</h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li>Honolulu & O'ahu</li>
              <li>Maui</li>
              <li>Big Island (Kona & Hilo)</li>
              <li>Kaua'i & Neighbor Islands</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-8 text-center text-xs text-white/50">
          &copy; {new Date().getFullYear()} TechSavvy Hawaii. All rights reserved.
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
