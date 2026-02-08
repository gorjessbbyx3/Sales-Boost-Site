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
  ShieldCheck,
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
    { label: "Our Work", href: "/our-work" },
    { label: "High-Risk", href: "/high-risk" },
    { label: "FAQ", href: "/contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-xl border-b border-border shadow-sm py-2"
          : "bg-transparent py-4"
      }`}
      data-testid="navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-12">
          <Link
            href="/"
            className="font-bold text-xl tracking-tight flex items-center gap-2.5 transition-transform hover:scale-105"
            data-testid="link-logo"
          >
            <img src="/images/IMG_6304.png" alt="Edify Limited" className="w-8 h-8 sm:w-9 sm:h-9 rounded shadow-sm" />
            <span className="text-foreground hidden sm:inline">Edify</span>
          </Link>

          <div className="hidden md:flex items-center gap-1 bg-muted/30 p-1 rounded-lg">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-1.5 text-xs lg:text-sm transition-all rounded-md hover:bg-background/50 hover:text-foreground ${
                  location === l.href ? "bg-background text-foreground shadow-sm font-medium" : "text-muted-foreground"
                }`}
                data-testid={`link-nav-${l.label.toLowerCase().replace(/\s/g, "-")}`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild className="text-xs h-9">
              <Link href="/contact" data-testid="link-nav-contact">
                Contact
              </Link>
            </Button>
            <Button size="sm" asChild className="text-xs h-9 shadow-lg shadow-primary/20">
              <Link href="/contact" data-testid="link-nav-get-terminal">
                Get Started
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-10 w-10"
            onClick={() => setMobileOpen(!mobileOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileOpen ? <XIcon className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-background/98 backdrop-blur-2xl border-b border-border px-4 py-6 shadow-2xl animate-in slide-in-from-top duration-300">
          <div className="space-y-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`block px-4 py-3 text-sm rounded-lg transition-colors ${
                  location === l.href ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground hover:bg-muted/50"
                }`}
                onClick={() => setMobileOpen(false)}
                data-testid={`link-mobile-${l.label.toLowerCase().replace(/\s/g, "-")}`}
              >
                {l.label}
              </Link>
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-3">
            <Button size="lg" asChild className="w-full shadow-lg shadow-primary/20">
              <Link href="/contact" data-testid="link-mobile-get-terminal" onClick={() => setMobileOpen(false)}>
                Get Your Terminal
              </Link>
            </Button>
            <a
              href="tel:+18087675460"
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-muted/50 text-sm font-medium text-foreground hover:bg-muted transition-colors"
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
    <footer className="border-t border-border/50 py-12 sm:py-20 relative bg-muted/30" data-testid="section-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-16">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="font-bold text-lg flex items-center gap-2.5 mb-6 group">
              <img src="/images/IMG_6304.png" alt="Edify Limited" className="w-8 h-8 rounded shadow-sm group-hover:scale-110 transition-transform" />
              <span className="text-foreground">Edify Limited</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Hawai'i's trusted partner for zero-fee payment processing and professional web design. We help local businesses keep more of their revenue.
            </p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-primary">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs font-medium text-foreground">4.9/5 Rating</span>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-sm mb-6 uppercase tracking-wider text-foreground">Services</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li>
                <Link href="/pricing" className="transition-colors hover:text-primary" data-testid="link-footer-pricing">
                  Zero-Fee Processing
                </Link>
              </li>
              <li>
                <Link href="/our-work" className="transition-colors hover:text-primary" data-testid="link-footer-our-work">
                  Custom Web Design
                </Link>
              </li>
              <li>
                <Link href="/high-risk" className="transition-colors hover:text-primary" data-testid="link-footer-high-risk">
                  High-Risk Solutions
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="transition-colors hover:text-primary" data-testid="link-footer-features">
                  Cash Discount Program
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm mb-6 uppercase tracking-wider text-foreground">Contact</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <a href="tel:+18087675460" className="transition-colors hover:text-primary">(808) 767-5460</a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <a href="mailto:edifyhawaii@gmail.com" className="transition-colors hover:text-primary break-all">edifyhawaii@gmail.com</a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span>Honolulu, Hawai'i</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-primary shrink-0" />
                <span>M-F: 8 AM – 5 PM</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm mb-6 uppercase tracking-wider text-foreground">Legal & Security</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>PCI Compliant</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Secure SSL</span>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-primary">Legal Disclosures</Link>
              </li>
              <li>
                <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-600 bg-emerald-50">Authorized Partner</Badge>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Edify Limited. All rights reserved. Proudly locally owned and operated in Hawai'i.</p>
          <div className="flex items-center gap-6">
            <Link href="/contact" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <Navbar />
      <main className="pt-0">{children}</main>
      <Footer />
    </div>
  );
}

