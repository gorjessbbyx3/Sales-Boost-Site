import { useState } from "react";
import { Globe, Users, Palette, CreditCard, Megaphone, Mail, ArrowRight, Check } from "lucide-react";

const services = [
  {
    icon: Globe,
    title: "Custom Websites",
    tagline: "Built from scratch. Fast. Yours.",
    description:
      "We design and build fully custom websites — no templates, no page builders. Your brand, your flow, your content. Most sites go live within 7 days.",
    features: ["Mobile-first design", "SEO-optimized from day one", "CMS or static — your choice", "Hosting & support included"],
    color: "emerald",
    accent: "#22c55e",
  },
  {
    icon: Users,
    title: "CRM Systems",
    tagline: "Your workflow, not someone else's.",
    description:
      "A CRM that fits how your team actually works — not a generic tool you have to bend to fit. We build around your process: leads, follow-ups, pipelines, automations.",
    features: ["Custom pipelines", "Auto follow-up sequences", "Lead capture integrations", "Team dashboards"],
    color: "sky",
    accent: "#38bdf8",
  },
  {
    icon: Palette,
    title: "Brand & Design",
    tagline: "Logos, print, social content — in-house.",
    description:
      "Full brand identity from strategy to print. Logo, color palette, typography, business cards, social templates, and ongoing content creation — one team handles it all.",
    features: ["Logo & brand identity", "Business cards & print", "Social media templates", "Ongoing content creation"],
    color: "violet",
    accent: "#a78bfa",
  },
  {
    icon: CreditCard,
    title: "Zero-Fee Processing",
    tagline: "Keep every dollar you earn.",
    description:
      "We pass processing fees to the card brands — not you. Most of our merchants save $300–$800/month the day they switch. Free terminal hardware included.",
    features: ["$0 per transaction", "Free terminal hardware", "Next-day deposits", "High-risk approved"],
    color: "green",
    accent: "#22c55e",
  },
  {
    icon: Megaphone,
    title: "Ad Funnels",
    tagline: "Meta ads, landing pages, real leads.",
    description:
      "We run paid ads that actually convert — Meta, Google, TikTok. Full funnel: ad creative, landing page, email capture, and follow-up sequence. We track every dollar.",
    features: ["Meta & Google ads", "AI-generated ad creative", "Landing page design", "ROI reporting"],
    color: "orange",
    accent: "#fb923c",
  },
  {
    icon: Mail,
    title: "Email Deliverability",
    tagline: "Stop landing in spam. Period.",
    description:
      "DNS setup, DKIM, DMARC, SPF — we fix the technical side so your emails land in inboxes. Then we build the sequences that get opened, clicked, and replied to.",
    features: ["Domain authentication (SPF/DKIM/DMARC)", "Inbox placement testing", "Drip sequences", "Open & click tracking"],
    color: "rose",
    accent: "#fb7185",
  },
];

export function TabbedSpotlight() {
  const [active, setActive] = useState(0);
  const s = services[active];
  const Icon = s.icon;

  return (
    <div className="bg-[#07090f] min-h-screen py-14 px-6 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <span className="text-[#22c55e] text-xs font-bold uppercase tracking-widest">
            What your business gets
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-2 leading-tight">
            One team. Everything you need.
          </h2>
        </div>

        <div className="grid grid-cols-5 gap-5 min-h-[420px]">
          {/* Tab list */}
          <div className="col-span-2 flex flex-col gap-1.5">
            {services.map((item, i) => {
              const TabIcon = item.icon;
              const isActive = i === active;
              return (
                <button
                  key={item.title}
                  onClick={() => setActive(i)}
                  className={`w-full text-left flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 border ${
                    isActive
                      ? "bg-white/[0.07] border-white/15 shadow-lg"
                      : "bg-transparent border-transparent hover:bg-white/[0.04]"
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
                    style={{ background: isActive ? `${item.accent}22` : "rgba(255,255,255,0.05)" }}
                  >
                    <TabIcon
                      className="w-4 h-4 transition-colors"
                      style={{ color: isActive ? item.accent : "rgba(255,255,255,0.35)" }}
                    />
                  </div>
                  <div className="min-w-0">
                    <p
                      className={`text-sm font-semibold leading-tight truncate transition-colors ${
                        isActive ? "text-white" : "text-white/50"
                      }`}
                    >
                      {item.title}
                    </p>
                  </div>
                  {isActive && (
                    <div
                      className="ml-auto w-1 h-full rounded-full flex-shrink-0"
                      style={{ background: s.accent, opacity: 0.8 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Detail panel */}
          <div
            key={active}
            className="col-span-3 rounded-2xl border border-white/[0.08] p-7 flex flex-col justify-between"
            style={{ background: `linear-gradient(135deg, ${s.accent}0d 0%, #07090f 60%)` }}
          >
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: `${s.accent}22` }}
                >
                  <Icon className="w-6 h-6" style={{ color: s.accent }} />
                </div>
                <div>
                  <h3 className="font-black text-white text-xl leading-tight">{s.title}</h3>
                  <p className="text-white/40 text-xs">{s.tagline}</p>
                </div>
              </div>

              <p className="text-white/65 text-sm leading-relaxed mb-6">{s.description}</p>

              <div className="grid grid-cols-2 gap-2">
                {s.features.map((f) => (
                  <div key={f} className="flex items-start gap-2 text-xs text-white/50">
                    <Check className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: s.accent }} />
                    {f}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3 pt-5 border-t border-white/[0.07]">
              <button
                className="inline-flex items-center gap-2 font-bold px-5 py-2.5 rounded-xl text-sm transition-colors text-[#07090f]"
                style={{ background: s.accent }}
              >
                Get started <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <span className="text-white/25 text-xs">No commitment required</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button className="inline-flex items-center gap-2 bg-[#22c55e] text-[#07090f] font-bold px-7 py-3 rounded-xl text-sm hover:bg-[#16a34a] transition-colors shadow-lg shadow-green-500/25">
            Book a free 20-min call <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
