import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { CreditCard, Banknote, CheckCircle2, TrendingDown, DollarSign } from "lucide-react";

const ITEMS = [
  { label: "1× PLATE LUNCH", value: "$13.00" },
  { label: "2× LOCO MOCO", value: "$16.00" },
  { label: "1× HAUPIA PIE", value: "$6.00" },
];
const SUBTOTAL = 35.0;
const FEE = 1.4;

function SavingsCounter({ active }: { active: boolean }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => `$${v.toFixed(2)}`);
  const monthlyRef = useRef<ReturnType<typeof animate> | null>(null);

  useEffect(() => {
    if (monthlyRef.current) monthlyRef.current.stop();
    if (active) {
      monthlyRef.current = animate(count, FEE, { duration: 0.6, ease: "easeOut" });
    } else {
      monthlyRef.current = animate(count, 0, { duration: 0.3, ease: "easeIn" });
    }
  }, [active, count]);

  return (
    <motion.span className="tabular-nums text-emerald-400 font-black">
      {rounded}
    </motion.span>
  );
}

export default function POSReceiptShowcase() {
  const [mode, setMode] = useState<"cc" | "cash">("cc");
  const [printing, setPrinting] = useState(false);
  const [visible, setVisible] = useState(true);

  const isCash = mode === "cash";

  const switchMode = (next: "cc" | "cash") => {
    if (next === mode || printing) return;
    setPrinting(true);
    setVisible(false);
    setTimeout(() => {
      setMode(next);
      setVisible(true);
      setPrinting(false);
    }, 500);
  };

  return (
    <div className="w-full flex flex-col items-center">

      {/* ── Toggle ── */}
      <div className="flex gap-3 mb-10">
        <button
          data-testid="button-mode-cc"
          onClick={() => switchMode("cc")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border transition-all duration-200 ${
            !isCash
              ? "bg-red-500/15 border-red-500/40 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
              : "bg-white/3 border-white/10 text-white/40 hover:text-white/60"
          }`}
        >
          <CreditCard className="w-4 h-4" />
          Credit Card
        </button>
        <button
          data-testid="button-mode-cash"
          onClick={() => switchMode("cash")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border transition-all duration-200 ${
            isCash
              ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
              : "bg-white/3 border-white/10 text-white/40 hover:text-white/60"
          }`}
        >
          <Banknote className="w-4 h-4" />
          Cash / Debit
        </button>
      </div>

      {/* ── 3-D Receipt Scene ── */}
      <div
        style={{ perspective: "1000px", perspectiveOrigin: "50% 30%" }}
        className="w-full max-w-xs relative"
      >
        {/* Printer head */}
        <div
          className="relative mx-auto mb-0 rounded-t-xl border border-white/10 flex items-center justify-center"
          style={{
            width: "200px",
            height: "40px",
            background: "linear-gradient(180deg,#1c2a3a 0%,#111a26 100%)",
            boxShadow: "0 -4px 20px rgba(0,0,0,0.6)",
          }}
        >
          {/* LED */}
          <motion.div
            animate={{ opacity: printing ? [1, 0.3, 1] : 1, scale: printing ? [1, 1.4, 1] : 1 }}
            transition={{ repeat: printing ? Infinity : 0, duration: 0.4 }}
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: printing ? "#f59e0b" : isCash ? "#10b981" : "#ef4444", boxShadow: `0 0 8px ${printing ? "#f59e0b" : isCash ? "#10b981" : "#ef4444"}` }}
          />
          {/* Paper slot */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-28 h-1.5 rounded-b"
            style={{ background: "rgba(0,0,0,0.6)" }}
          />
        </div>

        {/* Receipt paper with 3D tilt */}
        <motion.div
          style={{ transformStyle: "preserve-3d", rotateX: "4deg", transformOrigin: "top center" }}
          className="mx-auto"
          animate={{ rotateX: printing ? "2deg" : "4deg" }}
          transition={{ duration: 0.3 }}
        >
          {/* Paper feed animation wrapper */}
          <motion.div
            animate={{ scaleY: visible ? 1 : 0, originY: 0 }}
            transition={{ duration: 0.4, ease: printing ? "easeIn" : "easeOut" }}
            style={{ transformOrigin: "top" }}
          >
            <div
              className="bg-white shadow-2xl"
              style={{
                width: "200px",
                margin: "0 auto",
                fontFamily: "'Courier New', Courier, monospace",
                fontSize: "11px",
                color: "#111",
                boxShadow: isCash
                  ? "0 30px 80px rgba(16,185,129,0.25), 0 0 0 1px rgba(16,185,129,0.3)"
                  : "0 30px 80px rgba(239,68,68,0.2), 0 0 0 1px rgba(239,68,68,0.2)",
              }}
            >
              {/* Perforated edge top */}
              <div style={{ height: "10px", background: "repeating-linear-gradient(90deg,rgba(0,0,0,0.15) 0,rgba(0,0,0,0.15) 6px,transparent 6px,transparent 10px)" }} />

              <div className="px-4 py-3">
                {/* Header */}
                <div className="text-center mb-2">
                  <p className="font-black text-[12px]">ALOHA PLATE</p>
                  <p className="text-[9px] text-gray-500">1234 Kapiolani Blvd, Honolulu HI</p>
                  <p className="text-[9px] text-gray-500">Tel: (808) 555-0198</p>
                </div>

                <div className="border-t border-dashed border-gray-300 my-2" />
                <div className="text-[9px] text-gray-400 flex justify-between mb-2">
                  <span>ORDER #1337</span><span>04/12/2026</span>
                </div>
                <div className="border-t border-dashed border-gray-300 my-2" />

                {/* Items */}
                {ITEMS.map((it) => (
                  <div key={it.label} className="flex justify-between text-[10px] text-gray-700 leading-5">
                    <span>{it.label}</span><span>{it.value}</span>
                  </div>
                ))}

                <div className="border-t border-dashed border-gray-300 my-2" />

                {/* Subtotal */}
                <div className="flex justify-between text-[10px] text-gray-600 leading-5">
                  <span>SUBTOTAL</span><span>${SUBTOTAL.toFixed(2)}</span>
                </div>

                {/* THE MAGIC MOMENT — animates between modes */}
                <AnimatePresence mode="wait">
                  {isCash ? (
                    <motion.div key="cash"
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex justify-between leading-5">
                        <span className="text-[10px] text-gray-400 line-through">SERVICE FEE</span>
                        <span className="text-[10px] text-gray-400 line-through">${FEE.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between leading-5">
                        <span className="text-[10px] font-bold text-emerald-600">CASH DISCOUNT</span>
                        <span className="text-[10px] font-bold text-emerald-600">-${FEE.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-dashed border-gray-300 my-2" />
                      <div className="flex justify-between">
                        <span className="font-black text-[13px]">TOTAL</span>
                        <span className="font-black text-[13px] text-emerald-600">${SUBTOTAL.toFixed(2)}</span>
                      </div>
                      <p className="text-[9px] text-emerald-600 text-center mt-1">✓ Cash discount applied!</p>
                    </motion.div>
                  ) : (
                    <motion.div key="cc"
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex justify-between leading-5">
                        <span className="text-[10px] text-red-500 font-semibold">SERVICE FEE</span>
                        <span className="text-[10px] text-red-500 font-semibold">+${FEE.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-dashed border-gray-300 my-2" />
                      <div className="flex justify-between">
                        <span className="font-black text-[13px]">TOTAL</span>
                        <span className="font-black text-[13px] text-red-500">${(SUBTOTAL + FEE).toFixed(2)}</span>
                      </div>
                      <p className="text-[9px] text-gray-400 text-center mt-1">Card processing cost passed on.</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="border-t border-dashed border-gray-300 mt-2 mb-3" />
                <p className="text-center text-[9px] text-gray-400">Thank you — Mahalo!</p>
              </div>

              {/* Perforated edge bottom */}
              <div style={{ height: "10px", background: "repeating-linear-gradient(90deg,rgba(0,0,0,0.15) 0,rgba(0,0,0,0.15) 6px,transparent 6px,transparent 10px)" }} />

              {/* Paper tail */}
              <div className="bg-white/50" style={{ height: "30px" }} />
            </div>
          </motion.div>
        </motion.div>

        {/* Floating savings badge */}
        <AnimatePresence>
          {isCash && (
            <motion.div
              key="savings-badge"
              initial={{ opacity: 0, scale: 0.5, x: 60, y: -20 }}
              animate={{ opacity: 1, scale: 1, x: 80, y: -60 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.3 }}
              className="absolute top-1/2 right-0 flex flex-col items-center justify-center rounded-2xl border border-emerald-500/40 px-4 py-3 text-center"
              style={{ background: "linear-gradient(135deg,rgba(16,185,129,0.15),rgba(16,185,129,0.05))", boxShadow: "0 0 30px rgba(16,185,129,0.25)", backdropFilter: "blur(8px)", minWidth: "90px" }}
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-400 mb-1" />
              <span className="text-[10px] text-emerald-400/70 uppercase tracking-widest font-bold">Saved</span>
              <span className="text-2xl font-black text-emerald-400"><SavingsCounter active={isCash} /></span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Savings multiplier ── */}
      <motion.div
        key={mode}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mt-12 max-w-lg w-full rounded-2xl border p-5 text-center"
        style={{
          background: isCash ? "rgba(16,185,129,0.06)" : "rgba(239,68,68,0.06)",
          borderColor: isCash ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.2)",
        }}
      >
        {isCash ? (
          <>
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingDown className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-400 font-black text-sm uppercase tracking-widest">Zero processing fees</span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              At just 500 transactions/month, your customers save{" "}
              <span className="text-emerald-400 font-black">$700/month</span> — and{" "}
              <span className="text-white font-bold">you keep 100% of every sale.</span>
            </p>
          </>
        ) : (
          <>
            <div className="flex items-center justify-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-red-400" />
              <span className="text-red-400 font-black text-sm uppercase tracking-widest">Fees eating your margins</span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              500 transactions/month at 4% = your processor pockets{" "}
              <span className="text-red-400 font-black">$700+/month</span> that should be yours.{" "}
              <button
                onClick={() => switchMode("cash")}
                className="text-white font-bold underline underline-offset-2 hover:text-emerald-400 transition-colors"
              >
                Switch to Cash Discount →
              </button>
            </p>
          </>
        )}
      </motion.div>

    </div>
  );
}
