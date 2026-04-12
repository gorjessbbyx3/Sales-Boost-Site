import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Banknote, ChevronRight, CheckCircle } from "lucide-react";
const terminalImg = "/images/terminal-399.png";

interface ReceiptLine {
  label: string;
  value: string;
  bold?: boolean;
  highlight?: string;
  strike?: boolean;
}

const BUSINESS = {
  name: "Aloha Plate Restaurant",
  address: "1234 Kapiolani Blvd",
  city: "Honolulu, HI 96814",
  tel: "Tel: (808) 555-0198",
  order: "ORDER # 001337",
  date: "04/12/2026  11:43",
  items: [
    { label: "1- PLATE LUNCH", value: "$13.00" },
    { label: "2- LOCO MOCO", value: "$16.00" },
    { label: "1- HAUPIA PIE", value: "$6.00" },
  ],
  subtotal: "$35.00",
  serviceFee: "$1.40",
};

const CC_LINES: ReceiptLine[] = [
  { label: "VISA ****", value: "1234" },
  { label: "", value: "" },
  { label: "SUB TOTAL:", value: BUSINESS.subtotal },
  { label: "SERVICE FEE:", value: BUSINESS.serviceFee, highlight: "text-red-400" },
  { label: "CASH DISCOUNT", value: "$0.00" },
  { label: "TOTAL:", value: "$36.40", bold: true },
];

const CASH_LINES: ReceiptLine[] = [
  { label: "PAID WITH CASH", value: "" },
  { label: "", value: "" },
  { label: "SUB TOTAL:", value: BUSINESS.subtotal },
  { label: "SERVICE FEE:", value: BUSINESS.serviceFee },
  { label: "CASH DISCOUNT", value: "-$1.40", highlight: "text-emerald-400" },
  { label: "TOTAL:", value: "$35.00", bold: true },
];

function Receipt({
  type,
  lines,
  active,
}: {
  type: "cc" | "cash";
  lines: ReceiptLine[];
  active: boolean;
}) {
  const isCC = type === "cc";
  const accentColor = isCC ? "#ef4444" : "#10b981";
  const label = isCC ? "Credit Card" : "Cash Payment";
  const total = isCC ? "$36.40" : "$35.00";
  const totalColor = isCC ? "text-red-400" : "text-emerald-400";

  return (
    <motion.div
      animate={{ scale: active ? 1 : 0.96, opacity: active ? 1 : 0.7 }}
      transition={{ duration: 0.3 }}
      className="relative flex flex-col"
      style={{ perspective: "800px" }}
    >
      {/* Receipt label */}
      <div
        className="text-center text-xs font-bold uppercase tracking-widest mb-2 px-3 py-1 rounded-full self-center"
        style={{
          color: accentColor,
          background: accentColor + "18",
          border: `1px solid ${accentColor}40`,
        }}
      >
        {label}
      </div>

      {/* Receipt paper */}
      <motion.div
        animate={{ rotateY: active ? 0 : isCC ? 6 : -6 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-lg shadow-2xl overflow-hidden"
        style={{
          fontFamily: "'Courier New', Courier, monospace",
          minWidth: "220px",
          border: `2px solid ${accentColor}60`,
          boxShadow: active
            ? `0 20px 60px ${accentColor}30, 0 0 0 2px ${accentColor}40`
            : "0 10px 30px rgba(0,0,0,0.4)",
        }}
      >
        {/* Perforated top */}
        <div
          className="h-3 w-full"
          style={{
            background: `repeating-linear-gradient(90deg, ${accentColor}40 0px, ${accentColor}40 8px, transparent 8px, transparent 12px)`,
          }}
        />

        {/* Receipt content */}
        <div className="px-4 py-3 text-gray-900 text-[11px] leading-5">
          {/* Header */}
          <div className="text-center mb-3">
            <p className="font-black text-[12px]">{BUSINESS.name}</p>
            <p className="text-gray-500 text-[10px]">{BUSINESS.address}</p>
            <p className="text-gray-500 text-[10px]">{BUSINESS.city}</p>
            <p className="text-gray-500 text-[10px]">{BUSINESS.tel}</p>
          </div>

          <div className="border-t border-dashed border-gray-300 my-2" />

          <div className="flex justify-between text-[10px] text-gray-500 mb-1">
            <span>{BUSINESS.order}</span>
          </div>
          <div className="text-[10px] text-gray-500 mb-2">{BUSINESS.date}</div>

          <div className="border-t border-dashed border-gray-300 my-2" />

          {/* Items */}
          {BUSINESS.items.map((item) => (
            <div key={item.label} className="flex justify-between">
              <span className="text-gray-700">{item.label}</span>
              <span className="text-gray-700">{item.value}</span>
            </div>
          ))}

          <div className="border-t border-dashed border-gray-300 my-2" />

          {/* Payment & totals */}
          {lines.map((line, i) => {
            if (!line.label && !line.value) return <div key={i} className="h-1" />;
            const isTotalLine = line.bold;
            return (
              <div
                key={i}
                className={`flex justify-between ${isTotalLine ? "mt-1 pt-1 border-t border-dashed border-gray-300" : ""}`}
              >
                <span className={`${isTotalLine ? "font-black text-[13px] text-gray-900" : "text-gray-600"}`}>
                  {line.label}
                </span>
                <span
                  className={`${isTotalLine ? `font-black text-[13px] ${totalColor}` : ""} ${line.highlight || "text-gray-600"}`}
                >
                  {line.value}
                </span>
              </div>
            );
          })}

          <div className="border-t border-dashed border-gray-300 mt-2 mb-3" />

          {/* Footer */}
          <p className="text-center text-[9px] text-gray-400">
            {isCC
              ? "Service fee covers processing costs."
              : "Cash discount applied — you paid less!"}
          </p>
          <p className="text-center text-[9px] text-gray-400 mt-0.5">
            Thank you — Mahalo!
          </p>
        </div>

        {/* Perforated bottom */}
        <div
          className="h-3 w-full"
          style={{
            background: `repeating-linear-gradient(90deg, ${accentColor}40 0px, ${accentColor}40 8px, transparent 8px, transparent 12px)`,
          }}
        />
      </motion.div>

      {/* Total badge */}
      <div
        className="text-center mt-3 text-2xl font-black"
        style={{ color: accentColor }}
        data-testid={`text-receipt-total-${type}`}
      >
        {total}
      </div>
      <p className="text-center text-[10px] text-white/40 mt-0.5">
        {isCC ? "Customer pays" : "Customer pays"}
      </p>
    </motion.div>
  );
}

function POSTerminal() {
  return (
    <div className="flex flex-col items-center">
      <div
        className="relative rounded-2xl overflow-hidden border border-white/10"
        style={{
          width: "140px",
          background: "linear-gradient(145deg, #1a1a2e 0%, #0d0d1a 100%)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        <img
          src={terminalImg}
          alt="Clover POS Terminal"
          className="w-full object-contain p-2"
          style={{ filter: "drop-shadow(0 4px 12px rgba(16,185,129,0.3))" }}
        />
        {/* Glow underneath terminal */}
        <div
          className="absolute bottom-0 inset-x-0 h-6"
          style={{ background: "linear-gradient(to top, rgba(16,185,129,0.15), transparent)" }}
        />
      </div>
      <p className="text-xs text-white/40 mt-2 text-center">Clover POS Terminal</p>
    </div>
  );
}

export default function POSReceiptShowcase() {
  const [active, setActive] = useState<"cc" | "cash">("cc");
  const [printing, setPrinting] = useState(false);

  const handleSwitch = (type: "cc" | "cash") => {
    if (type === active) return;
    setPrinting(true);
    setTimeout(() => {
      setActive(type);
      setPrinting(false);
    }, 300);
  };

  return (
    <div className="w-full">
      {/* Toggle */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex rounded-xl p-1 gap-1 border border-white/10 bg-white/3" style={{ background: "rgba(255,255,255,0.03)" }}>
          <button
            data-testid="button-toggle-cc"
            onClick={() => handleSwitch("cc")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              active === "cc"
                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                : "text-white/40 hover:text-white/60"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Credit Card
          </button>
          <button
            data-testid="button-toggle-cash"
            onClick={() => handleSwitch("cash")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              active === "cash"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "text-white/40 hover:text-white/60"
            }`}
          >
            <Banknote className="w-4 h-4" />
            Cash / Debit
          </button>
        </div>
      </div>

      {/* Main display */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
        {/* POS Terminal + printer animation */}
        <div className="flex flex-col items-center gap-3">
          <POSTerminal />
          {/* Paper coming out */}
          <AnimatePresence>
            {printing && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 40, opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="w-24 bg-white rounded-b"
                style={{ originY: 0 }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Receipts side by side */}
        <div className="flex flex-row gap-6 items-start">
          <Receipt type="cc" lines={CC_LINES} active={active === "cc"} />
          <div className="flex flex-col items-center justify-center self-center gap-2 py-8">
            <div className="w-px h-16 bg-white/10" />
            <span className="text-white/20 text-xs font-bold">VS</span>
            <div className="w-px h-16 bg-white/10" />
          </div>
          <Receipt type="cash" lines={CASH_LINES} active={active === "cash"} />
        </div>
      </div>

      {/* Summary bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-10 rounded-2xl border border-white/8 p-5 max-w-xl mx-auto text-center"
        style={{ background: "rgba(16,185,129,0.05)", borderColor: "rgba(16,185,129,0.2)" }}
      >
        <CheckCircle className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
        <p className="text-sm text-white/80 leading-relaxed">
          <span className="font-bold text-white">The "Service Fee" covers card processing costs.</span>{" "}
          When your customer pays with cash, this fee is removed as a discount — so they pay the original price.{" "}
          <span className="text-emerald-400 font-semibold">You keep 100% either way.</span>
        </p>
      </motion.div>
    </div>
  );
}
