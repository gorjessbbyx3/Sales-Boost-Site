import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  BookOpen, ArrowRight, Clock, DollarSign, Shield, Gift,
  Scale, CreditCard, ChefHat, Smartphone, TrendingDown, AlertTriangle,
} from "lucide-react";
import { fadeUp, staggerContainer } from "@/lib/animations";
import Layout from "@/components/layout";
import { useSEO } from "@/hooks/useSEO";
import { Link } from "wouter";

type Article = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  icon: any;
};

const ARTICLES: Article[] = [
  { id: "what-is-cash-discount", title: "What Is a Cash Discount Program?", excerpt: "Everything you need to know about cash discount programs — how they work, why they're legal, and how they differ from surcharging.", category: "Guide", readTime: "5 min", icon: DollarSign },
  { id: "cash-discount-vs-surcharging", title: "Cash Discount vs. Surcharging: What's the Difference?", excerpt: "They sound similar but the legal, practical, and customer-experience differences are significant. Here's what every business owner needs to know.", category: "Comparison", readTime: "6 min", icon: Scale },
  { id: "hidden-fees", title: "Top 5 Hidden Fees Your Payment Processor Is Charging You", excerpt: "Most merchants don't realize they're paying for PCI non-compliance, statement fees, batch fees, and more. Here's how to spot them.", category: "Tips", readTime: "4 min", icon: AlertTriangle },
  { id: "reduce-fees", title: "How to Reduce Credit Card Processing Fees in Hawaii", excerpt: "Practical strategies every Hawaii business can use today to lower or eliminate processing costs.", category: "Guide", readTime: "7 min", icon: TrendingDown },
  { id: "processing-cost", title: "How Much Does Credit Card Processing Really Cost?", excerpt: "A breakdown of interchange, assessment, and processor markup — and why most businesses are overpaying.", category: "Education", readTime: "6 min", icon: CreditCard },
  { id: "why-switching", title: "Why Hawaii Businesses Are Switching to Zero-Fee Processing", excerpt: "From Waikiki restaurants to Kailua salons, local businesses are ditching traditional processors. Here's why.", category: "Insights", readTime: "5 min", icon: Gift },
  { id: "pos-restaurants", title: "Best POS Systems for Hawaii Restaurants in 2026", excerpt: "Clover, Valor, PAX — which terminal is right for your restaurant? We compare features, pricing, and cash discount compatibility.", category: "Comparison", readTime: "8 min", icon: ChefHat },
  { id: "accept-cards-no-fees", title: "How to Accept Credit Cards Without Paying Fees", excerpt: "Yes, it's possible and legal. Here's the step-by-step process to eliminate processing fees from your business.", category: "Guide", readTime: "5 min", icon: Smartphone },
];

const ARTICLE_CONTENT: Record<string, { paragraphs: string[] }> = {
  "what-is-cash-discount": {
    paragraphs: [
      "A cash discount program is a pricing model where businesses set their standard listed price as the card price and offer a discount to customers who pay with cash. It's the same concept gas stations have used for decades — a cash price and a card price — and it's fully legal in all 50 states including Hawaii.",
      "Here's how it works in practice: your menu or price tags show the regular price. When a customer pays with a credit or debit card, they pay that listed price. When a customer pays with cash, they receive a small discount (typically 3-4%) off the listed price. The receipt clearly shows 'cash discount applied' for cash transactions.",
      "This is fundamentally different from surcharging, which adds a fee on top of the listed price for card users. Cash discounting frames the difference as a reward for cash payers rather than a penalty for card users — and customers respond to it much more positively.",
      "The result for your business? You effectively pay zero processing fees. The card price covers the cost of processing, while cash customers get a genuine discount. Most businesses report zero customer complaints after the first week, and the savings add up fast — a business processing $25,000/month saves over $9,000 per year.",
    ],
  },
  "cash-discount-vs-surcharging": {
    paragraphs: [
      "Cash discounting and surcharging both shift processing costs away from the merchant, but they do it in fundamentally different ways — and the distinction matters legally, practically, and for your customer experience.",
      "Surcharging adds a fee on top of your listed price when a customer pays by card. For example, if your listed price is $100, a card-paying customer might see $103.50 at checkout. Surcharging is restricted or banned in some states (though currently legal in Hawaii), requires specific disclosures, and often creates a negative customer experience because it feels like a penalty.",
      "Cash discounting works the opposite way. Your listed price IS the standard price. Cash customers receive a discount — so a $100 item might cost a cash customer $96.50. The psychology is completely different: customers see a reward for paying cash rather than a punishment for using a card. It's legal in all 50 states with no restrictions, and it's supported by Visa, Mastercard, and the FTC.",
      "For Hawaii businesses, we strongly recommend cash discounting over surcharging. The compliance requirements are simpler, the customer experience is better, and the legal footing is more solid. Our team handles all the signage, receipt formatting, and terminal programming to ensure you're 100% compliant from day one.",
    ],
  },
  "hidden-fees": {
    paragraphs: [
      "Most business owners look at their processing rate and think that's all they're paying. But buried in your monthly statement are fees that can add hundreds of dollars to your costs — and most processors hope you'll never notice them.",
      "PCI Non-Compliance Fee ($19.95–$99/month): If you haven't completed your annual PCI compliance questionnaire, your processor charges you a monthly penalty. Many merchants don't even know this questionnaire exists. Statement Fee ($7.95–$14.95/month): A charge for the privilege of receiving your monthly statement — even if it's electronic. Batch Fee ($0.10–$0.30 per batch): Charged every time your terminal settles transactions at end of day. At 30 batches per month, that's $3–$9 you probably didn't know about.",
      "Minimum Processing Fee ($25–$35/month): If your processing fees don't reach a minimum threshold, they charge you the difference. This hits seasonal businesses especially hard. Account Maintenance Fee ($5–$15/month): A vague fee that covers... nothing specific. It's pure profit for the processor.",
      "With TechSavvy's cash discount program, you pay none of these fees. Zero processing fees, zero monthly fees, zero hidden charges. What you see is what you get — and what you get is keeping 100% of every sale.",
    ],
  },
  "reduce-fees": {
    paragraphs: [
      "If you're a Hawaii business owner paying 2.5-4% on every credit card transaction, you're not alone — and you have more options than you think. Here are proven strategies to reduce or eliminate your processing costs.",
      "Strategy 1: Negotiate your current rates. Most processors won't offer their best rate upfront. Call your processor and ask for interchange-plus pricing instead of tiered or flat-rate pricing. This alone can save 0.5-1%. Strategy 2: Eliminate unnecessary fees. Review your statement for junk fees like PCI non-compliance, statement fees, and minimum processing charges. Ask your processor to waive them — many will if you push.",
      "Strategy 3: Switch to a cash discount program. This is the most effective option. A compliant cash discount program eliminates processing fees entirely. Your posted prices account for card costs, and cash customers receive a discount. It's legal in all 50 states, supported by all card networks, and used by thousands of businesses nationwide.",
      "Strategy 4: Encourage cash and debit payments. Debit transactions cost less than credit (typically 0.5-1% vs. 2.5-4%). Some businesses offer small incentives for cash payments. Strategy 5: Get a free rate analysis. Companies like TechSavvy offer free statement reviews that show you exactly where you're overpaying and how much you could save. There's no commitment — just clarity.",
    ],
  },
  "processing-cost": {
    paragraphs: [
      "Credit card processing fees have three components, and understanding them is the key to knowing whether you're getting a fair deal — or getting ripped off.",
      "Interchange fees are set by the card networks (Visa, Mastercard) and paid to the card-issuing bank. These range from 1.5% to 3.5% depending on the card type, transaction method, and industry. You can't negotiate these — they're the same for everyone. Assessment fees are charged by the card networks themselves (Visa, Mastercard, Discover, Amex). These are typically 0.13-0.15% and are also non-negotiable.",
      "Processor markup is where things get interesting — and where most businesses get overcharged. This is your processor's profit margin on top of interchange and assessment fees. It can range from 0.1% (great deal) to 1.5%+ (terrible deal). The problem is that many processors bundle these three components together so you can't see what you're actually paying for each.",
      "For a typical Hawaii business processing $25,000/month, total fees range from $625 to $1,000+ per month — that's $7,500 to $12,000 per year. With TechSavvy's cash discount program, that number drops to zero. The processing cost is built into your listed prices, cash customers get a discount, and you keep every dollar of every sale.",
    ],
  },
  "why-switching": {
    paragraphs: [
      "Across the Hawaiian Islands, businesses are making the switch from traditional payment processors to zero-fee cash discount programs — and the trend is accelerating. Here's what's driving the change.",
      "The math is simple and undeniable. A Waikiki restaurant processing $40,000/month was paying $1,200 in fees — that's $14,400 per year going straight to their processor. After switching to TechSavvy's cash discount program, they pay $0 in processing fees. That $14,400 now goes to hiring staff, buying better ingredients, and growing the business.",
      "Local support matters more than people realize. When a terminal goes down during Friday dinner rush, you need someone who can help now — not a 1-800 number with a 45-minute hold time. TechSavvy's team is in Honolulu. When merchants call, a real person picks up. When something needs fixing, someone can be at your business the same day.",
      "The switching process is easier than expected. Most businesses are fully set up within a week. TechSavvy handles the terminal, the signage, the receipt programming, and staff training. There's no downtime, no complicated migration, and no learning curve. The only thing that changes is your bank account — it starts growing instead of shrinking.",
    ],
  },
  "pos-restaurants": {
    paragraphs: [
      "Choosing the right POS system for your Hawaii restaurant is about more than just taking payments. You need something that handles table management, kitchen orders, tip adjustments, and — if you're smart — a cash discount program that eliminates processing fees entirely.",
      "Clover Station Solo ($145-$195/mo) is the flagship option for full-service restaurants. Its 14-inch HD touchscreen handles table management, split checks, kitchen ticket printing, and detailed sales reporting. The Clover Flex ($73/mo) is ideal for counter-service restaurants and food trucks — it's portable with a built-in printer and camera scanner. Both work seamlessly with cash discount programs.",
      "Valor VL550 is our most popular restaurant terminal. Its 5.5-inch touchscreen with built-in thermal printer handles cash discount automatically — no extra configuration needed. For restaurants that want Android app capabilities (online ordering, loyalty programs, inventory), the Valor VP550 offers a full Android OS with app marketplace.",
      "PAX A920 is the go-to for food trucks and mobile restaurants. It's fully wireless with 4G LTE, has a long-lasting battery, and the built-in printer means no external hardware to carry around. All of these systems are available free through TechSavvy's cash discount program for qualifying businesses. We pre-program everything for compliance and train your staff on-site.",
    ],
  },
  "accept-cards-no-fees": {
    paragraphs: [
      "Yes, you can accept credit cards without paying processing fees — and it's completely legal. Here's exactly how to make it happen for your business, step by step.",
      "Step 1: Apply for a cash discount program. This is the foundation. A cash discount program legally allows you to set your posted prices to account for card processing costs while offering cash-paying customers a discount. TechSavvy handles the entire application — it takes about 5 minutes online and approval typically comes within 24-48 hours.",
      "Step 2: Get your terminal set up. You'll need a terminal that's programmed for cash discount compliance. TechSavvy provides this free — we ship it pre-programmed, install it at your business, and set up the required signage (a small notice at the entrance and point-of-sale letting customers know about the cash discount). We also configure your receipts to show the discount properly.",
      "Step 3: Train your staff and go live. Your staff needs to understand the program so they can answer customer questions confidently. TechSavvy provides on-site training covering: how to explain the program to customers, how to process different payment types, and how to handle the rare customer question. Most businesses report smooth sailing after the first day — and their next bank statement shows zero processing fees for the first time.",
    ],
  },
};

export default function BlogPage() {
  useSEO({
    title: "Blog & Resources | Credit Card Processing Tips | TechSavvy Hawaii",
    description: "Expert guides on credit card processing, cash discount programs, payment fees, and POS systems for Hawaii businesses. Learn how to eliminate processing fees.",
    keywords: "credit card processing blog, cash discount program guide, payment processing tips Hawaii, reduce processing fees, best POS system Hawaii, merchant services education",
    canonical: "https://techsavvyhawaii.com/blog",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "TechSavvy Hawaii Blog",
      url: "https://techsavvyhawaii.com/blog",
      description: "Expert guides on payment processing, cash discount programs, and merchant services for Hawaii businesses.",
      publisher: { "@type": "Organization", name: "TechSavvy Hawaii" },
    },
  });

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-24 sm:pt-32 pb-10 sm:pb-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div variants={fadeUp}>
              <Badge variant="outline" className="mb-4 text-primary border-primary/30 bg-primary/5">
                <BookOpen className="w-3 h-3 mr-1.5" />
                Blog & Resources
              </Badge>
            </motion.div>
            <motion.h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4" variants={fadeUp}>
              Learn How to{" "}
              <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">Stop Overpaying</span>
            </motion.h1>
            <motion.p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto" variants={fadeUp}>
              Guides, tips, and resources to help Hawaii businesses understand payment processing and keep more of what they earn.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Article Index */}
      <section className="pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ARTICLES.map((a, i) => (
              <motion.div key={a.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <a href={`#${a.id}`}>
                  <Card className="h-full border-border/50 hover:border-primary/30 hover:shadow-lg transition-all cursor-pointer group">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                          <a.icon className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">{a.category}</Badge>
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" />{a.readTime}
                            </span>
                          </div>
                          <h3 className="font-bold text-sm group-hover:text-primary transition-colors">{a.title}</h3>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{a.excerpt}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Full Articles */}
      <section className="pb-16 sm:pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="space-y-16">
            {ARTICLES.map((a) => {
              const content = ARTICLE_CONTENT[a.id];
              if (!content) return null;
              return (
                <motion.article key={a.id} id={a.id} className="scroll-mt-24" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: "-100px" }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="text-xs">{a.category}</Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />{a.readTime} read
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">{a.title}</h2>
                  <div className="space-y-4">
                    {content.paragraphs.map((p, i) => (
                      <p key={i} className="text-sm sm:text-base text-muted-foreground leading-relaxed">{p}</p>
                    ))}
                  </div>
                  <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/15 flex flex-col sm:flex-row items-center gap-3">
                    <Gift className="w-5 h-5 text-primary shrink-0" />
                    <p className="text-sm text-foreground/80 flex-1">Ready to stop paying processing fees? Get free equipment and zero fees with our cash discount program.</p>
                    <Button size="sm" asChild className="shrink-0">
                      <Link href="/apply">
                        Get Started Free
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </Button>
                  </div>
                  <div className="mt-8 border-b border-border/30" />
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
}
