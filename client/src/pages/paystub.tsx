import { Printer } from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface StubData {
  id: string;
  payDate: string;
  periodStart: string;
  periodEnd: string;
  periodNum: number;
  totalPeriods: number;
  grossPay: number;
  federalTax: number;
  socialSecurity: number;
  medicare: number;
  hawaiiStateTax: number;
  hawaiiTDI: number;
  ytdGross: number;
  ytdFederalTax: number;
  ytdSocialSecurity: number;
  ytdMedicare: number;
  ytdHawaiiStateTax: number;
  ytdHawaiiTDI: number;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

// ─── Company & Employee ────────────────────────────────────────────────────────
const COMPANY = {
  name: "Y HATA & CO., LIMITED",
  address: "285 Sand Island Access Rd, Honolulu, HI 96819",
};

const EMPLOYEE = {
  name: "AARON PENEYRA",
  id: "EMP-0117",
  ssn: "***-**-4821",
  address: "1649 QUINCY PL, HONOLULU, HI 96816",
  dept: "Operations",
  payType: "Salary",
  filingStatus: "Single / 0",
};

// ─── April Stub (Period 6) — Gross $1,148.92 ──────────────────────────────────
const GROSS_APR = 1148.92;
const apr: StubData = {
  id: "stub-apr",
  payDate: "04/07/2026",
  periodStart: "03/16/2026",
  periodEnd: "03/31/2026",
  periodNum: 6,
  totalPeriods: 24,
  grossPay: GROSS_APR,
  federalTax: 86.00,
  socialSecurity: parseFloat((GROSS_APR * 0.062).toFixed(2)),   // 71.23
  medicare: parseFloat((GROSS_APR * 0.0145).toFixed(2)),        // 16.66
  hawaiiStateTax: 59.45,
  hawaiiTDI: parseFloat((GROSS_APR * 0.005).toFixed(2)),        // 5.74
  ytdGross: 6654.44,
  ytdFederalTax: 457.00,
  ytdSocialSecurity: 412.56,
  ytdMedicare: 96.49,
  ytdHawaiiStateTax: 337.25,
  ytdHawaiiTDI: 33.25,
};

// ─── March Stub (Period 5) — Gross $909.84 (≈ April take-home) ────────────────
const GROSS_MAR = 909.84;
const mar: StubData = {
  id: "stub-mar",
  payDate: "03/20/2026",
  periodStart: "03/01/2026",
  periodEnd: "03/15/2026",
  periodNum: 5,
  totalPeriods: 24,
  grossPay: GROSS_MAR,
  federalTax: 27.00,
  socialSecurity: parseFloat((GROSS_MAR * 0.062).toFixed(2)),   // 56.41
  medicare: parseFloat((GROSS_MAR * 0.0145).toFixed(2)),        // 13.19
  hawaiiStateTax: 40.00,
  hawaiiTDI: parseFloat((GROSS_MAR * 0.005).toFixed(2)),        // 4.55
  ytdGross: 5505.52,
  ytdFederalTax: 371.00,
  ytdSocialSecurity: 341.33,
  ytdMedicare: 79.83,
  ytdHawaiiStateTax: 277.80,
  ytdHawaiiTDI: 27.51,
};

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function PaystubPage() {
  const printStub = (stubId: string) => {
    document.body.setAttribute("data-print-stub", stubId);
    window.print();
    document.body.removeAttribute("data-print-stub");
  };

  return (
    <div
      className="min-h-screen py-10 px-6 print:py-0 print:px-0 print:bg-white"
      style={{ backgroundColor: "#e5e7eb" }}
    >
      {/* Screen header */}
      <div className="max-w-5xl mx-auto mb-6 print:hidden">
        <h1 className="text-xl font-bold text-gray-800">Y HATA &amp; CO. — Pay Stubs</h1>
        <p className="text-sm text-gray-500 mt-1">
          Formatted for pre-perforated check stub paper (8.5″ × 3.5″ per stub).
          Click <em>Print Stub</em> on each to export as PDF.
        </p>
      </div>

      {/* ── Stub 1 — April ── */}
      <div className="max-w-5xl mx-auto mb-3 flex justify-end print:hidden">
        <button
          onClick={() => printStub("stub-apr")}
          className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg text-white shadow"
          style={{ backgroundColor: "hsl(152,76%,36%)" }}
        >
          <Printer className="w-3.5 h-3.5" />
          Print Stub — 04/07/2026
        </button>
      </div>
      <CheckStub stub={apr} />

      {/* ── Stub 2 — March ── */}
      <div className="max-w-5xl mx-auto mt-6 mb-3 flex justify-end print:hidden">
        <button
          onClick={() => printStub("stub-mar")}
          className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg text-white shadow"
          style={{ backgroundColor: "hsl(152,76%,36%)" }}
        >
          <Printer className="w-3.5 h-3.5" />
          Print Stub — 03/20/2026
        </button>
      </div>
      <CheckStub stub={mar} />

      <div className="pb-12 print:hidden" />

      {/* ── Print styles ── */}
      <style>{`
        /* Page size: standard pre-perforated check stub */
        @media print {
          @page {
            size: 8.5in 3.5in;
            margin: 0.2in 0.25in;
          }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }

          /* Hide both stubs by default when printing, then show only the target */
          [data-stub] { display: none !important; }

          body[data-print-stub="stub-apr"] [data-stub="stub-apr"] { display: block !important; }
          body[data-print-stub="stub-mar"] [data-stub="stub-mar"] { display: block !important; }
        }
      `}</style>
    </div>
  );
}

// ─── CheckStub ─────────────────────────────────────────────────────────────────
// Short-and-wide layout matching pre-perforated check stub paper
function CheckStub({ stub }: { stub: StubData }) {
  const totalDed = parseFloat(
    (stub.federalTax + stub.socialSecurity + stub.medicare +
      stub.hawaiiStateTax + stub.hawaiiTDI).toFixed(2)
  );
  const netPay = parseFloat((stub.grossPay - totalDed).toFixed(2));

  const ytdTotalDed = parseFloat(
    (stub.ytdFederalTax + stub.ytdSocialSecurity + stub.ytdMedicare +
      stub.ytdHawaiiStateTax + stub.ytdHawaiiTDI).toFixed(2)
  );
  const ytdNet = parseFloat((stub.ytdGross - ytdTotalDed).toFixed(2));

  return (
    <div
      data-stub={stub.id}
      className="max-w-5xl mx-auto bg-white shadow-md print:shadow-none print:max-w-none"
      style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
    >
      {/* ── Top color bar + header ── */}
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{ backgroundColor: "hsl(152,76%,36%)", color: "#fff" }}
      >
        <div>
          <div style={{ fontSize: "13px", fontWeight: 700, letterSpacing: "0.02em" }}>
            {COMPANY.name}
          </div>
          <div style={{ fontSize: "10px", opacity: 0.85 }}>{COMPANY.address}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "10px", opacity: 0.75, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Employee Pay Statement — Semi-Monthly
          </div>
          <div style={{ fontSize: "13px", fontWeight: 700 }}>
            Period {stub.periodNum}/{stub.totalPeriods}&ensp;|&ensp;Pay Date: {stub.payDate}
          </div>
          <div style={{ fontSize: "10px", opacity: 0.85 }}>
            Pay Period: {stub.periodStart} – {stub.periodEnd}
          </div>
        </div>
      </div>

      {/* ── Main body: 3 columns ── */}
      <div style={{ display: "grid", gridTemplateColumns: "220px 150px 1fr", borderTop: "2px solid hsl(152,76%,36%)" }}>

        {/* Col 1 — Employee info */}
        <div
          style={{
            padding: "8px 12px",
            borderRight: "1px solid #e5e7eb",
            fontSize: "11px",
          }}
        >
          <ColHeader>Employee</ColHeader>
          <ERow label="Name" value={EMPLOYEE.name} bold />
          <ERow label="ID" value={EMPLOYEE.id} />
          <ERow label="SSN" value={EMPLOYEE.ssn} />
          <ERow label="Address" value={EMPLOYEE.address} />
          <ERow label="Dept" value={EMPLOYEE.dept} />
          <ERow label="Filing" value={EMPLOYEE.filingStatus} />
          <ERow label="Pay Type" value={EMPLOYEE.payType} />
        </div>

        {/* Col 2 — Earnings & Net Pay */}
        <div
          style={{
            padding: "8px 12px",
            borderRight: "1px solid #e5e7eb",
            fontSize: "11px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <ColHeader>Earnings</ColHeader>
            <AmtRow label="Regular Salary" amount={stub.grossPay} />
            <div style={{ borderTop: "1px solid #e5e7eb", marginTop: 4, paddingTop: 4 }}>
              <AmtRow label="Gross Pay" amount={stub.grossPay} bold />
              <AmtRow label="YTD Gross" amount={stub.ytdGross} muted />
            </div>
          </div>

          {/* Net Pay box */}
          <div
            style={{
              marginTop: 8,
              padding: "6px 8px",
              backgroundColor: "hsl(152,76%,95%)",
              border: "1px solid hsl(152,76%,70%)",
              borderRadius: 4,
            }}
          >
            <div style={{ fontSize: "9px", fontWeight: 700, color: "hsl(152,76%,30%)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Net Pay
            </div>
            <div style={{ fontSize: "20px", fontWeight: 800, color: "hsl(152,76%,30%)", lineHeight: 1.2 }}>
              {fmt(netPay)}
            </div>
            <div style={{ fontSize: "9px", color: "#6b7280" }}>
              YTD Net: {fmt(ytdNet)}
            </div>
          </div>
        </div>

        {/* Col 3 — Deductions */}
        <div style={{ padding: "8px 12px", fontSize: "11px" }}>
          <ColHeader>Deductions &amp; Withholdings — Hawaii Tax Rates</ColHeader>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                <th style={thLeft}>Description</th>
                <th style={thRight}>Rate</th>
                <th style={thRight}>Current</th>
                <th style={thRight}>YTD</th>
              </tr>
            </thead>
            <tbody>
              <DRow
                label="Federal Income Tax"
                note="IRS Pub 15-T — Single/0"
                rate="Table"
                cur={stub.federalTax}
                ytd={stub.ytdFederalTax}
              />
              <DRow
                label="Social Security (OASDI)"
                note="Employee — HRS §383 / IRC §3101"
                rate="6.20%"
                cur={stub.socialSecurity}
                ytd={stub.ytdSocialSecurity}
              />
              <DRow
                label="Medicare"
                note="Employee — IRC §3101(b)"
                rate="1.45%"
                cur={stub.medicare}
                ytd={stub.ytdMedicare}
              />
              <DRow
                label="Hawaii State Income Tax"
                note="HRS §235 — Single/0 Allowances"
                rate="Prog."
                cur={stub.hawaiiStateTax}
                ytd={stub.ytdHawaiiStateTax}
              />
              <DRow
                label="Hawaii TDI"
                note="Temporary Disability Ins. — HRS §392"
                rate="0.50%"
                cur={stub.hawaiiTDI}
                ytd={stub.ytdHawaiiTDI}
              />
            </tbody>
            <tfoot>
              <tr style={{ borderTop: "1.5px solid #d1d5db", backgroundColor: "#f9fafb" }}>
                <td colSpan={2} style={{ ...tdBase, fontWeight: 700, fontSize: "10px", color: "#374151", textTransform: "uppercase", letterSpacing: "0.04em", paddingTop: 4 }}>
                  Total Deductions
                </td>
                <td style={{ ...tdRight, fontWeight: 700, color: "#dc2626", paddingTop: 4 }}>
                  ({fmt(totalDed)})
                </td>
                <td style={{ ...tdRight, fontWeight: 700, color: "#ef4444", paddingTop: 4 }}>
                  ({fmt(ytdTotalDed)})
                </td>
              </tr>
            </tfoot>
          </table>
          {/* Tax rate note */}
          <div style={{ fontSize: "9px", color: "#9ca3af", marginTop: 4, borderTop: "1px dashed #e5e7eb", paddingTop: 3 }}>
            Eff. rate this period: {((totalDed / stub.grossPay) * 100).toFixed(2)}%&ensp;·&ensp;
            Hawaii withholding per Hawaii Employer's Tax Guide (Rev. 2026)&ensp;·&ensp;
            Federal per IRS Pub. 15-T (2026)
          </div>
        </div>
      </div>

      {/* ── Bottom micro-footer ── */}
      <div
        style={{
          backgroundColor: "#f3f4f6",
          borderTop: "1px solid #e5e7eb",
          padding: "3px 12px",
          fontSize: "9px",
          color: "#9ca3af",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>{EMPLOYEE.name} · {EMPLOYEE.id} · SSN {EMPLOYEE.ssn}</span>
        <span>{COMPANY.name} · Pay Date {stub.payDate} · Period {stub.periodNum}/{stub.totalPeriods}</span>
      </div>
    </div>
  );
}

// ─── Micro helpers ─────────────────────────────────────────────────────────────

const tdBase: React.CSSProperties = {
  padding: "2px 0",
  fontSize: "11px",
  verticalAlign: "top",
};
const tdRight: React.CSSProperties = {
  ...tdBase,
  textAlign: "right",
  whiteSpace: "nowrap",
};
const thLeft: React.CSSProperties = {
  textAlign: "left",
  fontWeight: 700,
  fontSize: "9px",
  color: "#9ca3af",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  paddingBottom: 3,
};
const thRight: React.CSSProperties = {
  ...thLeft,
  textAlign: "right",
};

function ColHeader({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: "9px", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>
      {children}
    </div>
  );
}

function ERow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div style={{ display: "flex", gap: 4, lineHeight: "1.5", fontSize: "11px" }}>
      <span style={{ color: "#6b7280", width: 56, flexShrink: 0 }}>{label}:</span>
      <span style={{ color: "#111827", fontWeight: bold ? 700 : 400 }}>{value}</span>
    </div>
  );
}

function AmtRow({ label, amount, bold, muted }: { label: string; amount: number; bold?: boolean; muted?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: muted ? "10px" : "11px", color: muted ? "#9ca3af" : "#111827", fontWeight: bold ? 700 : 400, lineHeight: 1.6 }}>
      <span>{label}</span>
      <span>{fmt(amount)}</span>
    </div>
  );
}

function DRow({ label, note, rate, cur, ytd }: { label: string; note: string; rate: string; cur: number; ytd: number }) {
  return (
    <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
      <td style={tdBase}>
        <div style={{ fontWeight: 500, color: "#111827" }}>{label}</div>
        <div style={{ fontSize: "9px", color: "#9ca3af" }}>{note}</div>
      </td>
      <td style={{ ...tdRight, color: "#6b7280", fontSize: "9px" }}>{rate}</td>
      <td style={{ ...tdRight, color: "#111827" }}>{fmt(cur)}</td>
      <td style={{ ...tdRight, color: "#6b7280" }}>{fmt(ytd)}</td>
    </tr>
  );
}
