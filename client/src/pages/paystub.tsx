import { Printer } from "lucide-react";

// ─── Data ──────────────────────────────────────────────────────────────────────

const COMPANY = {
  name: "Y. Hata & Co., Limited",
  address: "285 Sand Island Access Road",
  city: "Honolulu, HI 96819",
  phone: "808 447-4162",
};

const EMPLOYEE = {
  name: "Aaron Peneyra",
  address: "1649 Quincy Pl",
  city: "Honolulu, HI 96816",
  id: "011492",
  ssn: "***-**-4821",
  payType: "Salary",
  dept: "000145 – Op",
  jobTitle: "OPERATIONS ASSOCIATE",
};

interface StubConfig {
  stubId: string;
  checkNum: string;
  checkDate: string;
  payFreq: string;
  periodStart: string;
  periodEnd: string;
  pdStartFmt: string;
  pdEndFmt: string;
  grossPay: number;
  federalTax: number;
  ficaEE: number;
  medEE: number;
  hiWH: number;
  hiTDI: number;
  ytdGross: number;
  ytdFederal: number;
  ytdFica: number;
  ytdMed: number;
  ytdHiWH: number;
  ytdHiTDI: number;
  netWords: string;
}

// ─── April stub — Gross $1,148.92 — Pay Date 04/07/2026 ───────────────────────
const APR: StubConfig = {
  stubId: "apr",
  checkNum: "009126",
  checkDate: "04/07/2026",
  payFreq: "Bi-Monthly",
  periodStart: "03/16/2026",
  periodEnd: "03/31/2026",
  pdStartFmt: "03/16/2026",
  pdEndFmt: "03/31/2026",
  grossPay: 1148.92,
  federalTax: 86.00,
  ficaEE: 71.23,     // 6.20%
  medEE: 16.66,      // 1.45%
  hiWH: 59.45,       // HRS §235 progressive
  hiTDI: 5.74,       // HRS §392 0.50%
  ytdGross: 6654.44,
  ytdFederal: 457.00,
  ytdFica: 412.56,
  ytdMed: 96.49,
  ytdHiWH: 337.25,
  ytdHiTDI: 33.25,
  netWords: "Nine Hundred Nine and 84/100 Dollars",
};

// ─── March stub — Gross $909.84 — Pay Date 03/20/2026 ─────────────────────────
const MAR: StubConfig = {
  stubId: "mar",
  checkNum: "009125",
  checkDate: "03/20/2026",
  payFreq: "Bi-Monthly",
  periodStart: "03/01/2026",
  periodEnd: "03/15/2026",
  pdStartFmt: "03/01/2026",
  pdEndFmt: "03/15/2026",
  grossPay: 909.84,
  federalTax: 27.00,
  ficaEE: 56.41,
  medEE: 13.19,
  hiWH: 40.00,
  hiTDI: 4.55,
  ytdGross: 5505.52,
  ytdFederal: 371.00,
  ytdFica: 341.33,
  ytdMed: 79.83,
  ytdHiWH: 277.80,
  ytdHiTDI: 27.51,
  netWords: "Seven Hundred Sixty-Eight and 69/100 Dollars",
};

// ─── Helpers ───────────────────────────────────────────────────────────────────
const usd = (n: number) =>
  new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function PaystubPage() {
  const printStub = (id: string) => {
    document.body.setAttribute("data-print-stub", id);
    window.print();
    setTimeout(() => document.body.removeAttribute("data-print-stub"), 500);
  };

  return (
    <div style={{ background: "#ccc", minHeight: "100vh", padding: "24px 12px", fontFamily: "Arial, Helvetica, sans-serif" }}>
      {/* Screen controls */}
      <div style={{ maxWidth: 800, margin: "0 auto 12px", display: "flex", gap: 10, justifyContent: "flex-end" }} className="print:hidden">
        <button
          onClick={() => printStub("apr")}
          style={{ display: "flex", alignItems: "center", gap: 6, background: "hsl(152,76%,36%)", color: "#fff", border: "none", borderRadius: 6, padding: "8px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
        >
          <Printer size={14} /> Print 04/07/2026 (PDF)
        </button>
        <button
          onClick={() => printStub("mar")}
          style={{ display: "flex", alignItems: "center", gap: 6, background: "#374151", color: "#fff", border: "none", borderRadius: 6, padding: "8px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
        >
          <Printer size={14} /> Print 03/20/2026 (PDF)
        </button>
      </div>

      {/* April */}
      <div data-stub="apr">
        <StubDocument cfg={APR} />
      </div>

      <div style={{ height: 32 }} className="print:hidden" />

      {/* March */}
      <div data-stub="mar">
        <StubDocument cfg={MAR} />
      </div>

      <div style={{ height: 32 }} className="print:hidden" />

      <style>{`
        @media print {
          @page { size: letter portrait; margin: 0.3in; }
          body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .print\\:hidden { display: none !important; }
          [data-stub] { display: none !important; }
          body[data-print-stub="apr"] [data-stub="apr"] { display: block !important; }
          body[data-print-stub="mar"] [data-stub="mar"] { display: block !important; }
        }
      `}</style>
    </div>
  );
}

// ─── StubDocument ──────────────────────────────────────────────────────────────
function StubDocument({ cfg }: { cfg: StubConfig }) {
  const totalTaxes = cfg.federalTax + cfg.ficaEE + cfg.medEE + cfg.hiWH + cfg.hiTDI;
  const ytdTotalTaxes = cfg.ytdFederal + cfg.ytdFica + cfg.ytdMed + cfg.ytdHiWH + cfg.ytdHiTDI;
  const netPay = cfg.grossPay - totalTaxes;
  const ytdNetPay = cfg.ytdGross - ytdTotalTaxes;

  // Taxable wages (no pre-tax deductions, so same as gross)
  const txWages = cfg.grossPay;

  const page: React.CSSProperties = {
    maxWidth: 780,
    margin: "0 auto",
    background: "#fff",
    border: "1px solid #666",
    fontSize: 9,
    color: "#000",
    lineHeight: 1.3,
  };

  const tbl: React.CSSProperties = { width: "100%", borderCollapse: "collapse" };

  const sectionHead = (label: string): React.CSSProperties => ({
    background: "#d8d8d8",
    fontWeight: 700,
    fontSize: 8,
    textAlign: "center" as const,
    border: "1px solid #999",
    padding: "1px 4px",
    letterSpacing: "0.04em",
  });

  const colHead: React.CSSProperties = {
    background: "#ebebeb",
    fontWeight: 700,
    fontSize: 8,
    border: "1px solid #aaa",
    padding: "1px 4px",
    whiteSpace: "nowrap" as const,
  };

  const td: React.CSSProperties = { border: "1px solid #ccc", padding: "1px 4px" };
  const tdR: React.CSSProperties = { ...td, textAlign: "right" as const };
  const tdB: React.CSSProperties = { ...td, fontWeight: 700 };
  const tdBR: React.CSSProperties = { ...tdR, fontWeight: 700 };

  return (
    <div style={page}>

      {/* ══ HEADER ══════════════════════════════════════════════════════════════ */}
      <table style={{ ...tbl, borderBottom: "2px solid #666" }}>
        <tbody>
          <tr>
            <td style={{ padding: "4px 8px", width: "55%", verticalAlign: "top" }}>
              <div style={{ fontWeight: 800, fontSize: 13 }}>{COMPANY.name}</div>
              <div>{COMPANY.address}</div>
              <div>{COMPANY.city}</div>
              <div>{COMPANY.phone}</div>
            </td>
            <td style={{ padding: "4px 8px", verticalAlign: "top", textAlign: "right" }}>
              <div><b>Check Date:</b> {cfg.checkDate}</div>
              <div><b>Check Number:</b> {cfg.checkNum}</div>
              <div><b>Pay Frequency:</b> {cfg.payFreq}</div>
              <div><b>Pay Period Dates:</b> {cfg.periodStart} – {cfg.periodEnd}</div>
              <div><b>Tax Freq for this Payment:</b> {cfg.payFreq}</div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* ══ EMPLOYEE INFORMATION ════════════════════════════════════════════════ */}
      <table style={tbl}>
        <thead>
          <tr>
            <th colSpan={2} style={{ ...sectionHead(""), textAlign: "left" }}>Employee Information</th>
            <th style={sectionHead("")}>Tax Type</th>
            <th style={sectionHead("")}>Tax Jurisdiction</th>
            <th style={sectionHead("")}>Status</th>
            <th style={sectionHead("")}>Exem</th>
            <th style={sectionHead("")}>Adjs</th>
            <th style={{ ...sectionHead(""), width: 160 }}>Other Tax Information</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td rowSpan={2} style={{ ...td, verticalAlign: "top", width: 180 }}>
              <div style={{ fontWeight: 700 }}>{EMPLOYEE.name}</div>
              <div>{EMPLOYEE.address}</div>
              <div>{EMPLOYEE.city}</div>
            </td>
            <td rowSpan={2} style={{ ...td, verticalAlign: "top", fontSize: 8 }}>
              <div>ID#: {EMPLOYEE.id}</div>
              <div>SSN#: {EMPLOYEE.ssn}</div>
              <div>Pay Type: {EMPLOYEE.payType}</div>
              <div>Base Rate: —</div>
              <div>Dept: {EMPLOYEE.dept}</div>
            </td>
            <td style={td}>Federal</td>
            <td style={td}></td>
            <td style={td}>Single</td>
            <td style={{ ...td, textAlign: "center" }}>1</td>
            <td style={td}></td>
            <td style={td}></td>
          </tr>
          <tr>
            <td style={td}>HI</td>
            <td style={td}></td>
            <td style={td}>Single</td>
            <td style={{ ...td, textAlign: "center" }}>1</td>
            <td style={td}></td>
            <td style={td}></td>
          </tr>
        </tbody>
      </table>

      {/* ══ EARNINGS + DEDUCTIONS COLUMNS ═══════════════════════════════════════ */}
      <table style={tbl}>
        <tbody>
          <tr style={{ verticalAlign: "top" }}>

            {/* ── LEFT: Earnings ── */}
            <td style={{ width: "58%", borderRight: "2px solid #666" }}>
              <table style={tbl}>
                <thead>
                  <tr><th colSpan={8} style={sectionHead("")}>Earnings</th></tr>
                  <tr>
                    <th style={colHead}>Pd Start</th>
                    <th style={colHead}>Pd End</th>
                    <th style={{ ...colHead, width: 90 }}>Description</th>
                    <th style={colHead}>PayRate</th>
                    <th style={colHead}>Hrs/Units</th>
                    <th style={{ ...colHead, textAlign: "right" }}>Earnings</th>
                    <th style={colHead}>YTD Hrs</th>
                    <th style={{ ...colHead, textAlign: "right" }}>YTD Earnings</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={td}>{cfg.pdStartFmt}</td>
                    <td style={td}>{cfg.pdEndFmt}</td>
                    <td style={td}>Regular</td>
                    <td style={td}></td>
                    <td style={td}></td>
                    <td style={tdR}>{usd(cfg.grossPay)}</td>
                    <td style={td}></td>
                    <td style={tdR}>{usd(cfg.ytdGross)}</td>
                  </tr>
                  {/* blank filler rows to keep parity with right column height */}
                  {[...Array(5)].map((_, i) => (
                    <tr key={i}>
                      <td style={{ ...td, height: 14 }}></td>
                      <td style={td}></td>
                      <td style={td}></td>
                      <td style={td}></td>
                      <td style={td}></td>
                      <td style={tdR}></td>
                      <td style={td}></td>
                      <td style={tdR}></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </td>

            {/* ── RIGHT: Pre-Tax / Taxes / Post-Tax ── */}
            <td style={{ width: "42%" }}>

              {/* Pre-Tax Deductions */}
              <table style={tbl}>
                <thead>
                  <tr><th colSpan={4} style={sectionHead("")}>Pre-Tax Deductions Withheld</th></tr>
                  <tr>
                    <th style={{ ...colHead, width: 120 }}>Description</th>
                    <th style={colHead}>Sch/Amt</th>
                    <th style={{ ...colHead, textAlign: "right" }}>Curr Amt</th>
                    <th style={{ ...colHead, textAlign: "right" }}>YTD Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td style={{ ...td, height: 14 }}></td><td style={td}></td><td style={tdR}></td><td style={tdR}></td></tr>
                  <tr>
                    <td colSpan={2} style={tdB}>Total Pre-Tax</td>
                    <td style={tdBR}>0.00</td>
                    <td style={tdBR}>0.00</td>
                  </tr>
                </tbody>
              </table>

              {/* Taxes Withheld */}
              <table style={tbl}>
                <thead>
                  <tr><th colSpan={4} style={sectionHead("")}>Taxes Withheld</th></tr>
                  <tr>
                    <th style={{ ...colHead, width: 90 }}>Description</th>
                    <th style={{ ...colHead, textAlign: "right" }}>Tx Wages</th>
                    <th style={{ ...colHead, textAlign: "right" }}>Curr Amt</th>
                    <th style={{ ...colHead, textAlign: "right" }}>YTD Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={td}>Fed W/H</td>
                    <td style={tdR}>{usd(txWages)}</td>
                    <td style={tdR}>{usd(cfg.federalTax)}</td>
                    <td style={tdR}>{usd(cfg.ytdFederal)}</td>
                  </tr>
                  <tr>
                    <td style={td}>FICA EE</td>
                    <td style={tdR}>{usd(txWages)}</td>
                    <td style={tdR}>{usd(cfg.ficaEE)}</td>
                    <td style={tdR}>{usd(cfg.ytdFica)}</td>
                  </tr>
                  <tr>
                    <td style={td}>Fed MWT EE</td>
                    <td style={tdR}>{usd(txWages)}</td>
                    <td style={tdR}>{usd(cfg.medEE)}</td>
                    <td style={tdR}>{usd(cfg.ytdMed)}</td>
                  </tr>
                  <tr>
                    <td style={td}>HI W/H</td>
                    <td style={tdR}>{usd(txWages)}</td>
                    <td style={tdR}>{usd(cfg.hiWH)}</td>
                    <td style={tdR}>{usd(cfg.ytdHiWH)}</td>
                  </tr>
                  <tr>
                    <td style={td}>HI TDI EE</td>
                    <td style={tdR}>{usd(txWages)}</td>
                    <td style={tdR}>{usd(cfg.hiTDI)}</td>
                    <td style={tdR}>{usd(cfg.ytdHiTDI)}</td>
                  </tr>
                  <tr>
                    <td colSpan={2} style={tdB}>Total Taxes</td>
                    <td style={tdBR}>{usd(totalTaxes)}</td>
                    <td style={tdBR}>{usd(ytdTotalTaxes)}</td>
                  </tr>
                </tbody>
              </table>

              {/* Post-Tax Deductions */}
              <table style={tbl}>
                <thead>
                  <tr><th colSpan={4} style={sectionHead("")}>Post-Tax Deductions Withheld</th></tr>
                  <tr>
                    <th style={{ ...colHead, width: 120 }}>Description</th>
                    <th style={colHead}>Sch/Amt</th>
                    <th style={{ ...colHead, textAlign: "right" }}>Curr Amt</th>
                    <th style={{ ...colHead, textAlign: "right" }}>YTD Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td style={{ ...td, height: 14 }}></td><td style={td}></td><td style={tdR}></td><td style={tdR}></td></tr>
                </tbody>
              </table>

            </td>
          </tr>
        </tbody>
      </table>

      {/* ══ TOTAL HOURS AND EARNINGS ════════════════════════════════════════════ */}
      <table style={tbl}>
        <thead>
          <tr><th colSpan={7} style={sectionHead("")}>Total Hours and Earnings</th></tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ ...tdB, width: "25%" }}>Total Hours and Earnings</td>
            <td style={{ ...tdR, width: "10%" }}>0.00</td>
            <td style={{ ...tdBR, width: "12%" }}>{usd(cfg.grossPay)}</td>
            <td style={{ ...tdR, width: "10%" }}>0.00</td>
            <td style={{ ...tdBR, width: "12%" }}>{usd(cfg.ytdGross)}</td>
            <td style={td}></td>
            <td style={td}></td>
          </tr>
        </tbody>
      </table>

      {/* ══ OTHER PAYROLL INFO + MESSAGES ═══════════════════════════════════════ */}
      <table style={tbl}>
        <thead>
          <tr><th colSpan={4} style={sectionHead("")}>Other Payroll Information</th></tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ ...td, width: 80, fontWeight: 700, fontSize: 8 }}>Job Title:</td>
            <td style={{ ...td, width: 200 }}>{EMPLOYEE.jobTitle}</td>
            <td style={td}></td>
            <td style={td}></td>
          </tr>
        </tbody>
      </table>

      <table style={tbl}>
        <thead>
          <tr><th colSpan={2} style={sectionHead("")}>Messages from your Employer</th></tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ ...td, fontSize: 8, color: "#444", padding: "2px 4px" }} colSpan={2}>
              Hawaii withholding per HRS §235 &amp; Hawaii Employer's Tax Guide (2026) · Federal per IRS Pub. 15-T (2026) · TDI per HRS §392 · FICA: SS 6.20% / Medicare 1.45%
            </td>
          </tr>
        </tbody>
      </table>

      {/* ══ GROSS TO NET RECAP + NET PAY DISTRIBUTION ═══════════════════════════ */}
      <table style={tbl}>
        <tbody>
          <tr style={{ verticalAlign: "top" }}>

            {/* Gross to Net */}
            <td style={{ width: "62%", borderRight: "2px solid #666" }}>
              <table style={tbl}>
                <thead>
                  <tr>
                    <th colSpan={6} style={sectionHead("")}>Gross to Net Recap</th>
                  </tr>
                  <tr>
                    <th style={colHead}></th>
                    <th style={{ ...colHead, textAlign: "right" }}>Paid</th>
                    <th style={{ ...colHead, textAlign: "right" }}>Pre-Tax</th>
                    <th style={{ ...colHead, textAlign: "right" }}>Taxes</th>
                    <th style={{ ...colHead, textAlign: "right" }}>Deductions</th>
                    <th style={{ ...colHead, textAlign: "right" }}>Total Net Pay</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={tdB}>Current</td>
                    <td style={tdR}>{usd(cfg.grossPay)}</td>
                    <td style={tdR}>0.00</td>
                    <td style={tdR}>{usd(totalTaxes)}</td>
                    <td style={tdR}>0.00</td>
                    <td style={tdBR}>{usd(netPay)}</td>
                  </tr>
                  <tr>
                    <td style={tdB}>YTD</td>
                    <td style={tdR}>{usd(cfg.ytdGross)}</td>
                    <td style={tdR}>0.00</td>
                    <td style={tdR}>{usd(ytdTotalTaxes)}</td>
                    <td style={tdR}>0.00</td>
                    <td style={tdBR}>{usd(ytdNetPay)}</td>
                  </tr>
                </tbody>
              </table>
            </td>

            {/* Net Pay Distribution */}
            <td style={{ width: "38%" }}>
              <table style={tbl}>
                <thead>
                  <tr>
                    <th colSpan={3} style={sectionHead("")}>Net Pay Distribution</th>
                  </tr>
                  <tr>
                    <th style={colHead}>Description</th>
                    <th style={colHead}>Account Number</th>
                    <th style={{ ...colHead, textAlign: "right" }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={td}>Check</td>
                    <td style={td}></td>
                    <td style={tdR}>{usd(netPay)}</td>
                  </tr>
                  <tr>
                    <td colSpan={2} style={tdB}>Total Current Net Pay</td>
                    <td style={tdBR}>{usd(netPay)}</td>
                  </tr>
                </tbody>
              </table>
            </td>

          </tr>
        </tbody>
      </table>

      {/* ══ PERFORATION LINE ════════════════════════════════════════════════════ */}
      <div style={{
        borderTop: "2px dashed #666",
        margin: "8px 0 4px",
        padding: "3px 0 0",
        fontSize: 8,
        textAlign: "center",
        letterSpacing: "0.06em",
        color: "#333",
      }}>
        Statement of Earnings &nbsp;–&nbsp; Detach at perforation below and keep for your records.
      </div>

      {/* ══ CHECK ════════════════════════════════════════════════════════════════ */}
      <table style={{ ...tbl, border: "1px solid #333", marginTop: 4 }}>
        <tbody>

          {/* Check header row */}
          <tr>
            <td style={{ padding: "6px 10px", width: "55%", verticalAlign: "top", borderRight: "1px solid #aaa" }}>
              <div style={{ fontWeight: 800, fontSize: 12 }}>{COMPANY.name}</div>
              <div style={{ fontSize: 9 }}>{COMPANY.address}</div>
              <div style={{ fontSize: 9 }}>{COMPANY.city}</div>
            </td>
            <td style={{ padding: "6px 10px", verticalAlign: "top", textAlign: "right" }}>
              <div style={{ fontSize: 9 }}>Bank of Hawaii</div>
              <div style={{ fontSize: 9 }}>Honolulu, HI 96819</div>
              <div style={{ fontSize: 9, marginTop: 2 }}>59-102 / 1213</div>
            </td>
            <td style={{ padding: "6px 10px", verticalAlign: "top", textAlign: "right", width: 90 }}>
              <div style={{ border: "1px solid #666", padding: "2px 6px", fontWeight: 700, fontSize: 12, textAlign: "center" }}>
                {cfg.checkNum}
              </div>
            </td>
          </tr>

          {/* Date row */}
          <tr>
            <td colSpan={2} style={{ padding: "3px 10px", borderTop: "1px solid #aaa" }}>
              <b>DATE</b> {cfg.checkDate}
            </td>
            <td style={{ padding: "3px 10px", borderTop: "1px solid #aaa", borderLeft: "1px solid #aaa" }}></td>
          </tr>

          {/* Pay row */}
          <tr>
            <td colSpan={2} style={{ padding: "3px 10px", borderTop: "1px solid #aaa" }}>
              <b>PAY</b>&ensp;{cfg.netWords}
            </td>
            <td style={{
              padding: "3px 8px",
              borderTop: "1px solid #aaa",
              borderLeft: "1px solid #aaa",
              fontWeight: 800,
              fontSize: 13,
              textAlign: "right",
              whiteSpace: "nowrap",
            }}>
              ${usd(netPay)}
            </td>
          </tr>

          {/* To the order of */}
          <tr>
            <td style={{ padding: "3px 10px", borderTop: "1px solid #aaa", width: "55%" }}>
              <div style={{ fontSize: 8, color: "#666" }}>TO THE ORDER OF</div>
              <div style={{ fontWeight: 700 }}>{EMPLOYEE.name}</div>
              <div>{EMPLOYEE.address}</div>
              <div>{EMPLOYEE.city}</div>
            </td>
            <td style={{ padding: "3px 10px", borderTop: "1px solid #aaa", textAlign: "right", verticalAlign: "bottom" }}>
              <div style={{ fontSize: 8, color: "#888" }}>VOID AFTER 180 DAYS</div>
            </td>
            <td style={{ padding: "3px 10px", borderTop: "1px solid #aaa", borderLeft: "1px solid #aaa", verticalAlign: "bottom", textAlign: "right" }}>
              <div style={{ borderTop: "1px solid #333", marginTop: 24, paddingTop: 2, fontSize: 8, color: "#555" }}>
                Authorized Signature
              </div>
            </td>
          </tr>

          {/* MICR line */}
          <tr>
            <td colSpan={3} style={{
              borderTop: "1px solid #aaa",
              padding: "3px 10px",
              fontSize: 9,
              letterSpacing: "0.12em",
              color: "#555",
              fontFamily: "monospace",
              textAlign: "center",
            }}>
              ⑆{cfg.checkNum}⑆ ⑆121301028⑆ 0003={cfg.checkNum}⑈
            </td>
          </tr>

        </tbody>
      </table>
    </div>
  );
}
