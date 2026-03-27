import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  ArrowRight, ArrowLeft, Check, Users, DollarSign, TrendingUp,
  Phone, Mail, Building, User, Sparkles, Star, AlertTriangle,
  Repeat, Wallet, Clock, ShieldCheck, Zap, ChevronDown, FileText, Eye, EyeOff,
} from "lucide-react";
import { useState } from "react";
import { fadeUp, staggerContainer } from "@/lib/animations";
import Layout from "@/components/layout";
import { useSEO } from "@/hooks/useSEO";

const inputClass = "flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary";
const selectClass = inputClass;

const PROHIBITED_MERCHANTS = [
  "Adult content/audiotext", "Airlines or Cruise Lines", "Any merchant on MATCH", "Bail bonds",
  "Bankruptcy lawyers", "Business/Investment \"get-rich-quick\"", "Collection agencies", "Counterfeit goods",
  "Credit repair/debt consolidation", "Dating (sexually-oriented)/escort", "Drug paraphernalia",
  "Gambling (online & in-person)", "Gentleman's clubs/strip clubs", "Home-based software/web/SEO",
  "Illegal drugs/substances", "In-house financing", "Investment advice",
  "Marijuana businesses (excl. Hemp)", "MSB/Virtual Currency", "Multi-level marketing",
  "Nutraceuticals/pseudo-pharma", "Outbound telemarketing", "Payday loans", "Pyramid schemes",
  "Timeshares", "Weapons/ammo — Internet/MOTO",
];

// ─── Multi-Step Signup Form ──────────────────────────────────────

function PartnerSignupForm() {
  const [step, setStep] = useState(1);
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);
  const [agreementRead, setAgreementRead] = useState(false);

  const [form, setForm] = useState({
    // Step 1: Personal
    name: "", email: "", phone: "", company: "", password: "", confirmPassword: "",
    // Step 2: Agreement
    agreementSignature: "",
    // Step 3: W-9
    w9Name: "", w9BusinessName: "", w9TaxClassification: "individual",
    w9Address: "", w9CityStateZip: "", w9TinType: "ssn", w9TinLast4: "",
    // Step 4: Payout
    payoutMethod: "", payoutHandle: "",
  });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const canNext = () => {
    if (step === 1) return form.name && form.email && form.phone && form.password && form.password === form.confirmPassword && form.password.length >= 6;
    if (step === 2) return agreementRead && form.agreementSignature.length >= 2;
    if (step === 3) return form.w9Name && form.w9Address && form.w9CityStateZip && form.w9TinLast4.length === 4;
    if (step === 4) return form.payoutMethod && form.payoutHandle;
    return false;
  };

  const handleSubmit = async () => {
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/partner/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      setResult(data);
      setStep(5);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Step 5: Success ──
  if (step === 5 && result) {
    return (
      <section className="py-14 sm:py-24" id="apply">
        <div className="max-w-xl mx-auto px-4">
          <Card className="border-primary/20">
            <CardContent className="p-8 sm:p-12 text-center">
              <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-4">
                <Check className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">Welcome to the Team!</h2>
              <p className="text-muted-foreground mb-6">Your partner account is set up and ready to go.</p>
              <Card className="bg-muted/50 border-border/50 mb-6">
                <CardContent className="p-4 text-left space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Your Access Code</span><span className="font-mono font-bold text-primary text-lg">{result.accessCode}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span>{form.email}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Payout</span><span>{form.payoutMethod} — {form.payoutHandle}</span></div>
                </CardContent>
              </Card>
              <p className="text-xs text-muted-foreground mb-6">Save your access code — you can log in with it or with your email + password.</p>
              <Button size="lg" className="w-full" asChild>
                <a href="https://program.techsavvyhawaii.com">Go to Partner Dashboard <ArrowRight className="w-4 h-4" /></a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-14 sm:py-24" id="apply">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
              Join the <span className="text-primary">Partner Program</span>
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">Complete the steps below to create your account and start earning.</p>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {["Account", "Agreement", "W-9", "Payout"].map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step > i + 1 ? "bg-primary text-primary-foreground" : step === i + 1 ? "bg-primary text-primary-foreground ring-2 ring-primary/30 ring-offset-2 ring-offset-background" : "bg-muted text-muted-foreground"}`}>
                  {step > i + 1 ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-xs hidden sm:inline ${step === i + 1 ? "font-semibold" : "text-muted-foreground"}`}>{label}</span>
                {i < 3 && <div className={`w-8 h-0.5 ${step > i + 1 ? "bg-primary" : "bg-border"}`} />}
              </div>
            ))}
          </div>

          <Card className="border-primary/15">
            <CardContent className="p-6 sm:p-8">
              {/* Step 1: Account */}
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-lg mb-1">Create Your Account</h3>
                  <p className="text-sm text-muted-foreground mb-4">This will be your login for the partner dashboard.</p>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Full Name *</label>
                    <input required value={form.name} onChange={e => set("name", e.target.value)} placeholder="Your full legal name" className={inputClass} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Email *</label>
                      <input type="email" required value={form.email} onChange={e => set("email", e.target.value)} placeholder="you@email.com" className={inputClass} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Phone *</label>
                      <input type="tel" required value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="(808) 555-1234" className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Business / Organization (optional)</label>
                    <input value={form.company} onChange={e => set("company", e.target.value)} placeholder="If applicable" className={inputClass} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Password *</label>
                      <div className="relative">
                        <input type={showPw ? "text" : "password"} required value={form.password} onChange={e => set("password", e.target.value)} placeholder="Min. 6 characters" className={inputClass} />
                        <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowPw(!showPw)}>{showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Confirm Password *</label>
                      <input type="password" required value={form.confirmPassword} onChange={e => set("confirmPassword", e.target.value)} placeholder="Confirm password" className={inputClass} />
                      {form.confirmPassword && form.password !== form.confirmPassword && <p className="text-xs text-red-500 mt-1">Passwords don't match</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Agreement */}
              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-lg mb-1">Referral Partner Agreement</h3>
                  <p className="text-sm text-muted-foreground mb-2">Please read the agreement below and sign to continue.</p>
                  <div className="max-h-72 overflow-y-auto rounded-lg border border-border bg-muted/30 p-5 text-sm space-y-4 leading-relaxed">
                    <p className="font-bold text-base">TechSavvy Hawaii — Referral Partner Agreement</p>
                    <p>This Agreement is entered into between <strong>TechSavvy Hawaii</strong> ("Company") and the undersigned Referral Partner ("Partner").</p>
                    <p className="font-semibold">1. Compensation</p>
                    <p>Partner shall receive <strong>50% of the Company's net revenue</strong> generated from each referred merchant account, paid monthly for the life of the merchant's account with TechSavvy Hawaii. Payments are made on the 15th of each month for the prior month's revenue.</p>
                    <p className="font-semibold">2. Referral Process</p>
                    <p>Partner may refer merchants via the Partner Dashboard, email introduction, or direct referral form. A referral is credited to Partner when the merchant activates their account and processes their first transaction.</p>
                    <p className="font-semibold">3. Payout Terms</p>
                    <p>Minimum payout threshold is $25. Payouts are made via the Partner's selected method (check, Venmo, PayPal, or Chime). Partner is responsible for all applicable taxes and must provide a valid W-9.</p>
                    <p className="font-semibold">4. Prohibited Merchant Types</p>
                    <p>Partner acknowledges that the following business types <strong>cannot be accepted</strong> and referrals of these merchants will not qualify for compensation:</p>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 ml-2">
                      {PROHIBITED_MERCHANTS.map(m => <span key={m} className="text-xs text-muted-foreground">• {m}</span>)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Exception policies may be available for certain restricted industries. Contact TechSavvy for details.</p>
                    <p className="font-semibold">5. Obligations</p>
                    <p>Partner agrees to represent TechSavvy Hawaii honestly and professionally. Partner shall not make guarantees, promises, or claims not authorized by TechSavvy. Partner is an independent contractor, not an employee.</p>
                    <p className="font-semibold">6. Termination</p>
                    <p>Either party may terminate this Agreement with 30 days written notice. Upon termination, Partner will continue to receive commissions for previously referred active merchants for 90 days, after which residual payments will cease.</p>
                    <p className="font-semibold">7. Non-Solicitation</p>
                    <p>Partner shall not attempt to directly poach, solicit, or redirect TechSavvy merchants to competing processors during the term of this Agreement and for 12 months following termination.</p>
                  </div>
                  <label className="flex items-start gap-2 cursor-pointer mt-2">
                    <input type="checkbox" checked={agreementRead} onChange={e => setAgreementRead(e.target.checked)} className="mt-1 rounded border-border" />
                    <span className="text-sm">I have read and agree to the Referral Partner Agreement, including the 50% revenue share terms, prohibited merchant list, and termination clauses.</span>
                  </label>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Electronic Signature *</label>
                    <input value={form.agreementSignature} onChange={e => set("agreementSignature", e.target.value)} placeholder="Type your full legal name to sign" className={inputClass} />
                    <p className="text-[10px] text-muted-foreground mt-1">By typing your name, you agree this constitutes a legally binding electronic signature.</p>
                  </div>
                </div>
              )}

              {/* Step 3: W-9 */}
              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-lg mb-1">W-9 Tax Information</h3>
                  <p className="text-sm text-muted-foreground mb-2">Required for tax reporting (1099). We only store the last 4 digits of your TIN for verification.</p>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Name (as shown on tax return) *</label>
                    <input value={form.w9Name} onChange={e => set("w9Name", e.target.value)} placeholder="Legal name" className={inputClass} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Business Name (if different)</label>
                    <input value={form.w9BusinessName} onChange={e => set("w9BusinessName", e.target.value)} placeholder="DBA or entity name" className={inputClass} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Tax Classification *</label>
                    <select value={form.w9TaxClassification} onChange={e => set("w9TaxClassification", e.target.value)} className={selectClass}>
                      <option value="individual">Individual / Sole Proprietor</option>
                      <option value="llc-single">LLC — Single Member</option>
                      <option value="llc-partnership">LLC — Partnership</option>
                      <option value="llc-c-corp">LLC — C Corporation</option>
                      <option value="llc-s-corp">LLC — S Corporation</option>
                      <option value="c-corp">C Corporation</option>
                      <option value="s-corp">S Corporation</option>
                      <option value="partnership">Partnership</option>
                      <option value="trust">Trust / Estate</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Address *</label>
                    <input value={form.w9Address} onChange={e => set("w9Address", e.target.value)} placeholder="Street address" className={inputClass} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">City, State, ZIP *</label>
                    <input value={form.w9CityStateZip} onChange={e => set("w9CityStateZip", e.target.value)} placeholder="Honolulu, HI 96813" className={inputClass} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">TIN Type *</label>
                      <select value={form.w9TinType} onChange={e => set("w9TinType", e.target.value)} className={selectClass}>
                        <option value="ssn">SSN (Social Security Number)</option>
                        <option value="ein">EIN (Employer Identification Number)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Last 4 Digits of {form.w9TinType === "ein" ? "EIN" : "SSN"} *</label>
                      <input maxLength={4} value={form.w9TinLast4} onChange={e => set("w9TinLast4", e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="XXXX" className={inputClass} />
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground">Under penalties of perjury, I certify that the information provided is correct and I am a U.S. person. This serves as your electronic W-9 submission.</p>
                </div>
              )}

              {/* Step 4: Payout */}
              {step === 4 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-lg mb-1">Payout Method</h3>
                  <p className="text-sm text-muted-foreground mb-4">How would you like to receive your commissions? Paid monthly on the 15th.</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: "venmo", label: "Venmo", icon: "💰" },
                      { value: "paypal", label: "PayPal", icon: "💳" },
                      { value: "chime", label: "Chime", icon: "🏦" },
                      { value: "check", label: "Check (mailed)", icon: "✉️" },
                    ].map(opt => (
                      <button key={opt.value} type="button" onClick={() => set("payoutMethod", opt.value)}
                        className={`p-4 rounded-lg border text-left transition-all ${form.payoutMethod === opt.value ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-border hover:border-primary/30"}`}>
                        <div className="text-xl mb-1">{opt.icon}</div>
                        <div className="font-semibold text-sm">{opt.label}</div>
                      </button>
                    ))}
                  </div>
                  {form.payoutMethod && (
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">
                        {form.payoutMethod === "check" ? "Mailing Address" : form.payoutMethod === "venmo" ? "Venmo Username or Phone" : form.payoutMethod === "paypal" ? "PayPal Email" : "Chime Username or $Cashtag"} *
                      </label>
                      <input value={form.payoutHandle} onChange={e => set("payoutHandle", e.target.value)}
                        placeholder={form.payoutMethod === "check" ? "Full mailing address" : form.payoutMethod === "venmo" ? "@username or phone" : form.payoutMethod === "paypal" ? "paypal@email.com" : "$cashtag or username"}
                        className={inputClass} />
                    </div>
                  )}
                </div>
              )}

              {error && <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-sm text-destructive mt-4">{error}</div>}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50">
                {step > 1 ? (
                  <Button variant="ghost" onClick={() => { setStep(step - 1); setError(""); }}><ArrowLeft className="w-4 h-4 mr-1" />Back</Button>
                ) : <div />}
                {step < 4 ? (
                  <Button onClick={() => { setError(""); setStep(step + 1); }} disabled={!canNext()}>
                    Next <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={!canNext() || submitting}>
                    {submitting ? "Creating Account..." : "Complete Signup"} {!submitting && <Check className="w-4 h-4" />}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Marketing Sections ─────────────────────────────────────────

function ReferralHero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-10 sm:pt-36 sm:pb-16">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/8 via-primary/3 to-transparent" />
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-primary/10 blur-[120px]" />
      </div>
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          <motion.div variants={fadeUp}>
            <Badge variant="outline" className="mb-4 text-primary border-primary/30 bg-primary/5">
              <Sparkles className="w-3 h-3 mr-1" />50% Revenue Share
            </Badge>
          </motion.div>
          <motion.h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-5" variants={fadeUp}>
            Earn <span className="bg-gradient-to-r from-primary to-emerald-300 bg-clip-text text-transparent">50% of Revenue</span>
            <br /><span className="text-2xl sm:text-3xl lg:text-4xl text-muted-foreground font-bold">On Every Merchant You Refer</span>
          </motion.h1>
          <motion.p className="text-sm sm:text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto" variants={fadeUp}>
            Know a business owner who accepts credit cards? Make a simple introduction and earn 50% of TechSavvy's revenue from that merchant — every month, for life.
          </motion.p>
          <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-3" variants={fadeUp}>
            <Button size="lg" className="w-full sm:w-auto text-base px-8" asChild>
              <a href="#apply">Sign Up Now <ArrowRight className="w-4 h-4" /></a>
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto" asChild>
              <a href="#how-it-works">See How It Works <ChevronDown className="w-4 h-4" /></a>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { num: "01", title: "Sign up in 5 minutes", desc: "Create your account, sign the partner agreement, and submit your W-9. Done.", icon: FileText },
    { num: "02", title: "Refer a business", desc: "Send us a name and number, make an email intro, or submit through your dashboard. That's all.", icon: Users },
    { num: "03", title: "We close the deal", desc: "Our team handles the pitch, application, setup, and training. You don't sell anything.", icon: Zap },
    { num: "04", title: "Get paid every month", desc: "50% of our revenue from that merchant. Monthly. For as long as they stay. Via Venmo, PayPal, Chime, or check.", icon: Wallet },
  ];
  return (
    <section className="py-14 sm:py-24" id="how-it-works">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
          <motion.div className="text-center mb-10" variants={fadeUp}>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">How It Works</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {steps.map(s => (
              <motion.div key={s.num} variants={fadeUp}>
                <Card className="h-full border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><s.icon className="w-5 h-5 text-primary" /></div>
                      <span className="text-3xl font-extrabold text-primary/15">{s.num}</span>
                    </div>
                    <h3 className="font-bold text-base mb-1">{s.title}</h3>
                    <p className="text-sm text-muted-foreground">{s.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function EarningsSection() {
  return (
    <section className="py-14 sm:py-24 bg-card/50">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
          <motion.div className="text-center mb-10" variants={fadeUp}>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">What You Could Earn</h2>
            <p className="text-muted-foreground">50% of TechSavvy's net revenue on every referred merchant. Real numbers.</p>
          </motion.div>
          <motion.div className="grid grid-cols-1 sm:grid-cols-3 gap-5" variants={fadeUp}>
            {[
              { biz: "Small Salon", vol: "$8K/mo volume", yours: "$50–$80/mo", color: "text-pink-500" },
              { biz: "Restaurant", vol: "$30K/mo volume", yours: "$150–$300/mo", color: "text-orange-500" },
              { biz: "Auto Shop", vol: "$50K+/mo volume", yours: "$300–$600/mo", color: "text-blue-500" },
            ].map(e => (
              <Card key={e.biz} className="border-border/50 text-center">
                <CardContent className="p-6">
                  <div className={`text-sm font-bold ${e.color} mb-1`}>{e.biz}</div>
                  <div className="text-xs text-muted-foreground mb-3">{e.vol}</div>
                  <div className="text-2xl font-extrabold text-primary">{e.yours}</div>
                  <div className="text-[10px] text-muted-foreground mt-1">Your monthly earnings</div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
          <motion.p className="text-center text-xs text-muted-foreground mt-6" variants={fadeUp}>
            Refer 5 restaurants and you could earn $750–$1,500+ per month in passive income. No cap on referrals.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Page Export ─────────────────────────────────────────────────

export default function ReferralPage() {
  useSEO({
    title: "Earn 50% Revenue Share — Referral Partner Program | TechSavvy Hawaii",
    description: "Earn 50% of TechSavvy's revenue on every merchant you refer. Monthly payouts for life. No selling required — just make introductions. Sign up in 5 minutes.",
    keywords: "referral partner program Hawaii, 50% revenue share, earn residual income, payment processing referral, TechSavvy partner program",
    canonical: "https://techsavvyhawaii.com/refer",
  });

  return (
    <Layout>
      <ReferralHero />
      <HowItWorks />
      <EarningsSection />
      <PartnerSignupForm />
    </Layout>
  );
}
