import { Globe, Users, Palette, CreditCard, Megaphone, Mail, ArrowRight, Check } from "lucide-react";

export function Bento() {
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

        {/* Bento grid */}
        <div className="grid grid-cols-6 grid-rows-3 gap-3 auto-rows-[160px]">

          {/* Websites — large */}
          <div className="col-span-4 row-span-1 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-emerald-900/30 to-[#07090f] p-6 flex flex-col justify-between group hover:border-emerald-500/30 transition-colors">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                <Globe className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-[10px] text-white/30 font-mono">01</span>
            </div>
            <div>
              <h3 className="font-black text-white text-xl mb-1">Custom Websites</h3>
              <p className="text-white/40 text-sm">Built from scratch. Fast. Yours. Live in days — not months.</p>
            </div>
          </div>

          {/* Zero-Fee Processing — tall right */}
          <div className="col-span-2 row-span-2 rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#22c55e]/10 to-[#07090f] p-6 flex flex-col justify-between group hover:border-[#22c55e]/30 transition-colors">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#22c55e]/15 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-[#22c55e]" />
              </div>
              <span className="text-[10px] text-white/30 font-mono">04</span>
            </div>
            <div>
              <h3 className="font-black text-white text-lg mb-2">Zero-Fee Processing</h3>
              <p className="text-white/40 text-xs mb-4">Keep every dollar you earn. We pass the fees to the card brands — not you.</p>
              <div className="space-y-1.5">
                {["No monthly fees", "Next-day deposits", "Free terminal"].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-xs text-white/50">
                    <Check className="w-3 h-3 text-[#22c55e]" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CRM + Brand — two small */}
          <div className="col-span-2 row-span-1 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 flex flex-col justify-between group hover:border-sky-500/30 hover:bg-sky-900/10 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-sky-500/15 flex items-center justify-center">
              <Users className="w-4 h-4 text-sky-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm mb-0.5">CRM Systems</h3>
              <p className="text-white/35 text-xs">Your workflow, not someone else's.</p>
            </div>
          </div>

          <div className="col-span-2 row-span-1 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 flex flex-col justify-between group hover:border-violet-500/30 hover:bg-violet-900/10 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center">
              <Palette className="w-4 h-4 text-violet-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm mb-0.5">Brand & Design</h3>
              <p className="text-white/35 text-xs">Logos, print, social content.</p>
            </div>
          </div>

          {/* Ad Funnels — wide */}
          <div className="col-span-3 row-span-1 rounded-2xl border border-white/[0.08] bg-gradient-to-r from-orange-900/20 to-[#07090f] p-5 flex items-center gap-5 group hover:border-orange-500/30 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-orange-500/15 flex items-center justify-center flex-shrink-0">
              <Megaphone className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base mb-0.5">Ad Funnels</h3>
              <p className="text-white/40 text-xs">Meta ads, landing pages, leads that actually convert.</p>
            </div>
          </div>

          {/* Email — wide */}
          <div className="col-span-3 row-span-1 rounded-2xl border border-white/[0.08] bg-gradient-to-r from-rose-900/20 to-[#07090f] p-5 flex items-center gap-5 group hover:border-rose-500/30 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-rose-500/15 flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base mb-0.5">Email Deliverability</h3>
              <p className="text-white/40 text-xs">Stop landing in spam. Your emails reach real inboxes.</p>
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
