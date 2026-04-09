import {
  Globe,
  Users,
  Palette,
  CreditCard,
  Megaphone,
  Mail,
  ArrowRight,
} from "lucide-react";

const services = [
  {
    icon: Globe,
    title: "Custom Websites",
    sub: "Built from scratch. Fast. Yours.",
    color: "from-emerald-500/20 to-emerald-500/5",
    border: "border-emerald-500/20 hover:border-emerald-400/40",
    glow: "shadow-emerald-500/10",
  },
  {
    icon: Users,
    title: "CRM Systems",
    sub: "Your workflow, not someone else's.",
    color: "from-sky-500/20 to-sky-500/5",
    border: "border-sky-500/20 hover:border-sky-400/40",
    glow: "shadow-sky-500/10",
  },
  {
    icon: Palette,
    title: "Brand & Design",
    sub: "Logos, print, social content — built in-house.",
    color: "from-violet-500/20 to-violet-500/5",
    border: "border-violet-500/20 hover:border-violet-400/40",
    glow: "shadow-violet-500/10",
  },
  {
    icon: CreditCard,
    title: "Zero-Fee Processing",
    sub: "Keep every dollar you earn.",
    color: "from-green-500/20 to-green-500/5",
    border: "border-green-500/20 hover:border-green-400/40",
    glow: "shadow-green-500/10",
  },
  {
    icon: Megaphone,
    title: "Ad Funnels",
    sub: "Meta ads, landing pages, leads.",
    color: "from-orange-500/20 to-orange-500/5",
    border: "border-orange-500/20 hover:border-orange-400/40",
    glow: "shadow-orange-500/10",
  },
  {
    icon: Mail,
    title: "Email Deliverability",
    sub: "Stop landing in spam. Period.",
    color: "from-rose-500/20 to-rose-500/5",
    border: "border-rose-500/20 hover:border-rose-400/40",
    glow: "shadow-rose-500/10",
  },
];

export function IconGrid() {
  return (
    <div className="bg-[#07090f] min-h-screen py-16 px-6 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <span className="text-[#22c55e] text-xs font-bold uppercase tracking-widest">
            What your business gets
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-2 leading-tight">
            One team. Everything you need.
          </h2>
          <p className="text-white/50 mt-2 text-sm max-w-lg">
            Six core services. One Honolulu team. No fragmented vendors.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.title}
                className={`group relative rounded-2xl border p-6 transition-all duration-300 cursor-pointer
                  ${s.border} shadow-xl ${s.glow}
                  hover:shadow-2xl hover:-translate-y-0.5`}
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-4`}
                >
                  <Icon className="w-5 h-5 text-white/80" />
                </div>
                <h3 className="font-bold text-white text-base mb-1">{s.title}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{s.sub}</p>
                <div className="mt-4 flex items-center gap-1 text-xs text-[#22c55e] opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            );
          })}
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
