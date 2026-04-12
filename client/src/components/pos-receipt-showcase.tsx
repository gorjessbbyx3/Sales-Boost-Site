import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate, useInView } from "framer-motion";
import { CreditCard, Banknote, CheckCircle2, TrendingDown, TrendingUp, DollarSign } from "lucide-react";

const ITEMS = [
  { label: "1× PLATE LUNCH", value: "$13.00" },
  { label: "2× LOCO MOCO", value: "$16.00" },
  { label: "1× HAUPIA PIE", value: "$6.00" },
];
const SUBTOTAL = 35.0;
const FEE = 1.4;
const MONTHLY = 700;
const YEARLY = 8400;

/* ─── Animated fee counter ─────────────────────────────────────── */
function FeeCounter() {
  const count = useMotionValue(0);
  const formatted = useTransform(count, (v) =>
    `$${Math.round(v).toLocaleString()}`
  );
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-80px" });

  useEffect(() => {
    if (inView) animate(count, YEARLY, { duration: 2.5, ease: "easeOut" });
  }, [inView, count]);

  return (
    <motion.span ref={ref} className="tabular-nums">
      {formatted}
    </motion.span>
  );
}

/* ─── Mini bar chart ────────────────────────────────────────────── */
function MiniBarChart({ type }: { type: "loss" | "gain" }) {
  const isLoss = type === "loss";
  const heights = isLoss
    ? [18, 28, 36, 44, 52, 58, 66, 74, 82, 88, 94, 100]
    : [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100];
  const color = isLoss ? "#ef4444" : "#10b981";

  return (
    <div className="flex items-end gap-[3px] h-10 w-full">
      {heights.map((h, i) => (
        <motion.div
          key={i}
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + i * 0.04, duration: 0.35, ease: "easeOut" }}
          className="flex-1 rounded-t-sm"
          style={{
            height: `${h}%`,
            background: color,
            opacity: isLoss ? 0.5 + (i / 11) * 0.5 : 0.75,
            transformOrigin: "bottom",
          }}
        />
      ))}
    </div>
  );
}

/* ─── Left panel — the cost of doing nothing ────────────────────── */
function LossPanel({ switchMode }: { switchMode: (m: "cc" | "cash") => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="rounded-2xl border border-red-500/20 p-5 flex flex-col gap-4"
      style={{ background: "rgba(239,68,68,0.05)" }}
    >
      {/* Label */}
      <div className="flex items-center gap-2">
        <TrendingDown className="w-4 h-4 text-red-400 shrink-0" />
        <span className="text-red-400 text-xs font-black uppercase tracking-widest">
          Without us
        </span>
      </div>

      {/* Big number */}
      <div>
        <div className="text-3xl sm:text-4xl font-black text-red-400 leading-none">
          <FeeCounter />
        </div>
        <p className="text-white/40 text-xs mt-1">lost to fees per year</p>
      </div>

      {/* Bar chart */}
      <div>
        <MiniBarChart type="loss" />
        <p className="text-white/25 text-[10px] mt-1.5">Fees accumulating month over month</p>
      </div>

      {/* Breakdown */}
      <div className="border-t border-white/5 pt-3 space-y-1.5">
        {[
          { label: "Per transaction", val: `$${FEE.toFixed(2)}` },
          { label: "Per month (500 tx)", val: `$${MONTHLY.toLocaleString()}` },
          { label: "Per year", val: `$${YEARLY.toLocaleString()}` },
        ].map((r) => (
          <div key={r.label} className="flex justify-between text-xs">
            <span className="text-white/40">{r.label}</span>
            <span className="text-red-400 font-bold">{r.val}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        data-testid="button-loss-panel-switch"
        onClick={() => switchMode("cash")}
        className="mt-auto text-xs font-bold text-red-400/70 hover:text-red-400 transition-colors text-left"
      >
        Stop the bleed → Switch to cash discount
      </button>
    </motion.div>
  );
}

/* ─── Right panel — what you keep ──────────────────────────────── */
function GainPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="rounded-2xl border border-emerald-500/20 p-5 flex flex-col gap-4"
      style={{ background: "rgba(16,185,129,0.05)" }}
    >
      {/* Label */}
      <div className="flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
        <span className="text-emerald-400 text-xs font-black uppercase tracking-widest">
          With us
        </span>
      </div>

      {/* Big number */}
      <div>
        <div className="text-3xl sm:text-4xl font-black text-emerald-400 leading-none">
          $0
        </div>
        <p className="text-white/40 text-xs mt-1">in processing fees. Ever.</p>
      </div>

      {/* Bar chart */}
      <div>
        <MiniBarChart type="gain" />
        <p className="text-white/25 text-[10px] mt-1.5">100% of revenue stays yours</p>
      </div>

      {/* Breakdown */}
      <div className="border-t border-white/5 pt-3 space-y-1.5">
        {[
          { label: "Per transaction", val: "$0.00" },
          { label: "Per month (500 tx)", val: "$0" },
          { label: "Per year", val: "$0" },
        ].map((r) => (
          <div key={r.label} className="flex justify-between text-xs">
            <span className="text-white/40">{r.label}</span>
            <span className="text-emerald-400 font-bold">{r.val}</span>
          </div>
        ))}
      </div>

      {/* Badge */}
      <div
        className="flex items-center gap-2 rounded-xl px-3 py-2.5 border border-emerald-500/25 mt-auto"
        style={{ background: "rgba(16,185,129,0.1)" }}
      >
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        <span className="text-emerald-300 text-xs font-bold">
          You keep 100% — customers save on cash
        </span>
      </div>
    </motion.div>
  );
}

/* ─── Receipt center ────────────────────────────────────────────── */
function ReceiptCenter({
  mode,
  printing,
  visible,
}: {
  mode: "cc" | "cash";
  printing: boolean;
  visible: boolean;
}) {
  const isCash = mode === "cash";

  return (
    <div
      style={{ perspective: "1000px", perspectiveOrigin: "50% 30%" }}
      className="relative flex-shrink-0"
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
        <motion.div
          animate={{ opacity: printing ? [1, 0.3, 1] : 1, scale: printing ? [1, 1.4, 1] : 1 }}
          transition={{ repeat: printing ? Infinity : 0, duration: 0.4 }}
          className="w-2.5 h-2.5 rounded-full"
          style={{
            background: printing ? "#f59e0b" : isCash ? "#10b981" : "#ef4444",
            boxShadow: `0 0 8px ${printing ? "#f59e0b" : isCash ? "#10b981" : "#ef4444"}`,
          }}
        />
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-28 h-1.5 rounded-b"
          style={{ background: "rgba(0,0,0,0.6)" }}
        />
      </div>

      {/* Receipt */}
      <motion.div
        style={{ transformStyle: "preserve-3d", rotateX: "4deg", transformOrigin: "top center" }}
        animate={{ rotateX: printing ? "2deg" : "4deg" }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          animate={{ scaleY: visible ? 1 : 0 }}
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
            <div style={{ height: "10px", background: "repeating-linear-gradient(90deg,rgba(0,0,0,0.15) 0,rgba(0,0,0,0.15) 6px,transparent 6px,transparent 10px)" }} />
            <div className="px-4 py-3">
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
              {ITEMS.map((it) => (
                <div key={it.label} className="flex justify-between text-[10px] text-gray-700 leading-5">
                  <span>{it.label}</span><span>{it.value}</span>
                </div>
              ))}
              <div className="border-t border-dashed border-gray-300 my-2" />
              <div className="flex justify-between text-[10px] text-gray-600 leading-5">
                <span>SUBTOTAL</span><span>${SUBTOTAL.toFixed(2)}</span>
              </div>
              <AnimatePresence mode="wait">
                {isCash ? (
                  <motion.div key="cash" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }}>
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
                  <motion.div key="cc" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }}>
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
            <div style={{ height: "10px", background: "repeating-linear-gradient(90deg,rgba(0,0,0,0.15) 0,rgba(0,0,0,0.15) 6px,transparent 6px,transparent 10px)" }} />
            <div className="bg-white/50" style={{ height: "30px" }} />
          </div>
        </motion.div>
      </motion.div>

      {/* Floating savings badge — mobile only */}
      <AnimatePresence>
        {isCash && (
          <motion.div
            key="badge"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1, x: 70, y: -50 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.3 }}
            className="absolute top-1/2 right-0 lg:hidden flex flex-col items-center rounded-2xl border border-emerald-500/40 px-3 py-2 text-center"
            style={{ background: "rgba(16,185,129,0.12)", backdropFilter: "blur(8px)", minWidth: "80px" }}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mb-0.5" />
            <span className="text-[9px] text-emerald-400/70 uppercase tracking-widest font-bold">Saved</span>
            <span className="text-lg font-black text-emerald-400">$1.40</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Main export ───────────────────────────────────────────────── */
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

      {/* Toggle */}
      <div className="flex gap-3 mb-8">
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

      {/* ── Desktop: 3-column layout ── */}
      <div className="w-full hidden lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-8 lg:items-start">
        <LossPanel switchMode={switchMode} />
        <ReceiptCenter mode={mode} printing={printing} visible={visible} />
        <GainPanel />
      </div>

      {/* ── Mobile: receipt centered, panels below ── */}
      <div className="lg:hidden flex flex-col items-center w-full gap-6">
        <ReceiptCenter mode={mode} printing={printing} visible={visible} />
        <div className="grid grid-cols-2 gap-3 w-full">
          <LossPanel switchMode={switchMode} />
          <GainPanel />
        </div>
      </div>

      {/* Bottom note */}
      <p className="text-white/20 text-[11px] mt-8 text-center">
        * Based on 500 transactions/month at avg $1.40 fee. Your actual savings may vary.
      </p>

    </div>
  );
}
