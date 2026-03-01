import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  GraduationCap, BookOpen, Award, TrendingUp, Users, DollarSign,
  ChevronRight, CheckCircle, Circle, Play, Lock, ArrowLeft,
  Send, Building, Phone, Mail, User, Star, Trophy, Zap,
  Clock, Target, Gift, LogOut, Menu, X, Sparkles, Shield,
  BarChart3, Heart, Video, CalendarDays, MapPin, Globe, FileText,
  CreditCard, ChevronDown, ChevronUp,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────

interface Partner {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  avatarColor: string;
  tier: string;
  totalReferrals: number;
  successfulReferrals: number;
  totalEarned: number;
  lastLogin: string;
  createdAt: string;
}

interface Module {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  durationMinutes: number;
  sortOrder: number;
  content: string;
  videoUrl: string;
  quizJson: any[];
  points: number;
  progress: {
    status: string;
    quizScore: number;
    completedAt: string;
    startedAt: string;
  };
}

interface Referral {
  id: string;
  businessName: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  notes: string;
  status: string;
  payoutAmount: number;
  payoutDate: string;
  createdAt: string;
}

interface Stats {
  completedModules: number;
  totalModules: number;
  totalPoints: number;
  maxPoints: number;
  totalReferrals: number;
  successfulReferrals: number;
  totalEarned: number;
  tier: string;
  referralBreakdown: { submitted: number; contacted: number; activated: number; paid: number };
}

interface Meeting {
  id: string;
  merchantName: string;
  merchantPhone: string;
  merchantEmail: string;
  businessName: string;
  meetingType: string;
  preferredDate: string;
  preferredTime: string;
  location: string;
  notes: string;
  status: string;
  createdAt: string;
}

interface ClassroomVideo {
  id: string;
  name: string;
  url: string;
  size: number;
  uploadedAt: string;
}

// ─── Config ──────────────────────────────────────────────────────────

const TIER_CONFIG: Record<string, { label: string; color: string; bg: string; icon: typeof Star; min: number; payout: string }> = {
  bronze: { label: "Bronze", color: "text-amber-600", bg: "bg-amber-500/10 border-amber-500/20", icon: Star, min: 0, payout: "$50/referral" },
  silver: { label: "Silver", color: "text-slate-400", bg: "bg-slate-400/10 border-slate-400/20", icon: Award, min: 5, payout: "$75/referral" },
  gold: { label: "Gold", color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/20", icon: Trophy, min: 10, payout: "$100 + residuals" },
  platinum: { label: "Platinum", color: "text-cyan-300", bg: "bg-cyan-300/10 border-cyan-300/20", icon: Zap, min: 20, payout: "$150 + residuals" },
};

const CATEGORY_CONFIG: Record<string, { label: string; icon: typeof BookOpen; color: string }> = {
  basics: { label: "Fundamentals", icon: BookOpen, color: "text-blue-400" },
  skills: { label: "Skills", icon: Target, color: "text-emerald-400" },
  advanced: { label: "Advanced", icon: Sparkles, color: "text-purple-400" },
};

const DIFFICULTY_CONFIG: Record<string, { label: string; color: string }> = {
  beginner: { label: "Beginner", color: "text-green-400" },
  intermediate: { label: "Intermediate", color: "text-yellow-400" },
  advanced: { label: "Advanced", color: "text-red-400" },
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  submitted: { label: "Submitted", color: "text-blue-400", bg: "bg-blue-400/10" },
  contacted: { label: "Contacted", color: "text-yellow-400", bg: "bg-yellow-400/10" },
  activated: { label: "Activated", color: "text-emerald-400", bg: "bg-emerald-400/10" },
  paid: { label: "Paid", color: "text-green-400", bg: "bg-green-400/10" },
  declined: { label: "Declined", color: "text-red-400", bg: "bg-red-400/10" },
};

// ─── Login Page ──────────────────────────────────────────────────────

function PartnerLogin({ onLogin }: { onLogin: () => void }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await apiRequest("POST", "/api/partner/login", { accessCode: code });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Invalid code"); }
      onLogin();
    } catch (err: any) {
      setError(err.message || "Invalid access code");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-300px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-indigo-600/8 blur-[150px]" />
        <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] rounded-full bg-purple-600/5 blur-[120px]" />
      </div>

      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-4 shadow-lg shadow-indigo-500/20">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Partner Program</h1>
          <p className="text-sm text-zinc-500 mt-1">TechSavvy Hawaii — Learning Dashboard</p>
        </div>

        {/* Login card */}
        <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-6 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs text-zinc-400 font-medium">Access Code</Label>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Enter your access code"
                className="bg-zinc-800/50 border-zinc-700/50 text-white placeholder:text-zinc-600 h-11 text-center tracking-widest font-mono text-lg focus:border-indigo-500/50 focus:ring-indigo-500/20"
                maxLength={12}
                autoFocus
              />
              {error && <p className="text-xs text-red-400 text-center">{error}</p>}
            </div>
            <Button type="submit" className="w-full h-11 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium" disabled={loading || !code}>
              {loading ? "Verifying..." : "Sign In"}
              {!loading && <ChevronRight className="w-4 h-4 ml-1" />}
            </Button>
          </form>
          <p className="text-[11px] text-zinc-600 text-center mt-4">
            Don't have a code? <a href="https://techsavvyhawaii.com/refer" className="text-indigo-400 hover:text-indigo-300">Join the referral program</a>
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Module Viewer ──────────────────────────────────────────────────

function ModuleViewer({ module, onBack, onComplete }: { module: Module; onBack: () => void; onComplete: () => void }) {
  const { toast } = useToast();
  const isCompleted = module.progress.status === "completed";

  const completeMutation = useMutation({
    mutationFn: async () => { await apiRequest("POST", `/api/partner/modules/${module.id}/progress`, { status: "completed" }); },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/partner/modules"] });
      queryClient.invalidateQueries({ queryKey: ["/api/partner/stats"] });
      toast({ title: "Module completed!", description: `+${module.points} points earned` });
      onComplete();
    },
  });

  const startMutation = useMutation({
    mutationFn: async () => { await apiRequest("POST", `/api/partner/modules/${module.id}/progress`, { status: "in_progress" }); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/partner/modules"] }); },
  });

  useEffect(() => {
    if (module.progress.status === "not_started") startMutation.mutate();
  }, [module.id]);

  // Parse markdown-like content to HTML
  const renderContent = (text: string) => {
    return text
      .split("\n\n")
      .map((block, i) => {
        if (block.startsWith("## ")) return <h2 key={i} className="text-xl font-bold text-white mt-8 mb-3">{block.replace("## ", "")}</h2>;
        if (block.startsWith("### ")) return <h3 key={i} className="text-base font-semibold text-zinc-200 mt-6 mb-2">{block.replace("### ", "")}</h3>;
        if (block.includes("\n- ")) {
          const items = block.split("\n").filter(l => l.startsWith("- "));
          return (
            <ul key={i} className="space-y-1.5 my-3">
              {items.map((item, j) => (
                <li key={j} className="flex items-start gap-2 text-sm text-zinc-300 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
                  <span dangerouslySetInnerHTML={{ __html: item.replace(/^- /, "").replace(/\*\*([^*]+)\*\*/g, "<strong class='text-white'>$1</strong>") }} />
                </li>
              ))}
            </ul>
          );
        }
        if (block.match(/^\d+\./)) {
          const items = block.split("\n").filter(l => l.match(/^\d+\./));
          return (
            <ol key={i} className="space-y-1.5 my-3">
              {items.map((item, j) => (
                <li key={j} className="flex items-start gap-2.5 text-sm text-zinc-300 leading-relaxed">
                  <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px] font-bold mt-0.5 shrink-0">{j + 1}</span>
                  <span dangerouslySetInnerHTML={{ __html: item.replace(/^\d+\.\s*/, "").replace(/\*\*([^*]+)\*\*/g, "<strong class='text-white'>$1</strong>") }} />
                </li>
              ))}
            </ol>
          );
        }
        return <p key={i} className="text-sm text-zinc-400 leading-relaxed my-2" dangerouslySetInnerHTML={{ __html: block.replace(/\*\*([^*]+)\*\*/g, "<strong class='text-zinc-200'>$1</strong>") }} />;
      });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />Back to modules
      </button>

      <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-800/60">
          <div className="flex items-center gap-3 mb-2">
            <Badge variant="outline" className={`text-[10px] ${CATEGORY_CONFIG[module.category]?.color || ""}`}>
              {CATEGORY_CONFIG[module.category]?.label || module.category}
            </Badge>
            <Badge variant="outline" className={`text-[10px] ${DIFFICULTY_CONFIG[module.difficulty]?.color || ""}`}>
              {DIFFICULTY_CONFIG[module.difficulty]?.label || module.difficulty}
            </Badge>
            <span className="text-[10px] text-zinc-500 flex items-center gap-1"><Clock className="w-3 h-3" />{module.durationMinutes} min</span>
            <span className="text-[10px] text-yellow-400 flex items-center gap-1"><Star className="w-3 h-3" />{module.points} pts</span>
          </div>
          <h1 className="text-xl font-bold text-white">{module.title}</h1>
          <p className="text-sm text-zinc-500 mt-1">{module.description}</p>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {renderContent(module.content)}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-800/60 flex items-center justify-between">
          {isCompleted ? (
            <div className="flex items-center gap-2 text-emerald-400 text-sm">
              <CheckCircle className="w-4 h-4" />
              Completed — {module.points} points earned
            </div>
          ) : (
            <div className="text-xs text-zinc-500">Complete this module to earn {module.points} points</div>
          )}
          {!isCompleted && (
            <Button
              onClick={() => completeMutation.mutate()}
              className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white"
              disabled={completeMutation.isPending}
            >
              <CheckCircle className="w-4 h-4 mr-1.5" />
              {completeMutation.isPending ? "Completing..." : "Mark Complete"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ─────────────────────────────────────────────────

function ProgramDashboard({ partner, onLogout }: { partner: Partner; onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [showReferralForm, setShowReferralForm] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const { toast } = useToast();

  const { data: modules = [] } = useQuery<Module[]>({ queryKey: ["/api/partner/modules"] });
  const { data: referrals = [] } = useQuery<Referral[]>({ queryKey: ["/api/partner/referrals"] });
  const { data: stats } = useQuery<Stats>({ queryKey: ["/api/partner/stats"] });
  const { data: meetings = [] } = useQuery<Meeting[]>({ queryKey: ["/api/partner/meetings"] });
  const { data: classroomVideos = [] } = useQuery<ClassroomVideo[]>({ queryKey: ["/api/partner/classroom-videos"] });

  const tierCfg = TIER_CONFIG[partner.tier] || TIER_CONFIG.bronze;
  const TierIcon = tierCfg.icon;
  const completionPct = stats ? Math.round((stats.completedModules / Math.max(stats.totalModules, 1)) * 100) : 0;
  const pointsPct = stats ? Math.round((stats.totalPoints / Math.max(stats.maxPoints, 1)) * 100) : 0;

  const categories = useMemo(() => {
    const cats: Record<string, Module[]> = {};
    for (const m of modules) {
      if (!cats[m.category]) cats[m.category] = [];
      cats[m.category].push(m);
    }
    return cats;
  }, [modules]);

  // Merchant Application form
  const emptyApp = {
    businessName: "", dbaName: "", contactName: "", contactPhone: "", contactEmail: "",
    address: "", city: "", state: "HI", zip: "", businessPhone: "", businessEmail: "",
    website: "", productsServices: "", yearsInBusiness: "", monthlyVolume: "", avgTransaction: "",
    cardPresent: "80", keyed: "10", ecommerce: "10", currentProcessor: "", reasonLeaving: "",
    cardTypes: ["visa", "mastercard", "discover"] as string[], businessType: "retail", notes: "",
  };
  const [refForm, setRefForm] = useState(emptyApp);
  const [appStep, setAppStep] = useState(0);
  const submitReferral = useMutation({
    mutationFn: async (data: typeof refForm) => {
      await apiRequest("POST", "/api/partner/referrals", {
        businessName: data.businessName || data.dbaName,
        contactName: data.contactName,
        contactPhone: data.contactPhone || data.businessPhone,
        contactEmail: data.contactEmail || data.businessEmail,
        notes: data.notes,
        applicationData: {
          dbaName: data.dbaName, address: data.address, city: data.city, state: data.state, zip: data.zip,
          businessPhone: data.businessPhone, businessEmail: data.businessEmail, website: data.website,
          productsServices: data.productsServices, yearsInBusiness: data.yearsInBusiness,
          monthlyVolume: data.monthlyVolume, avgTransaction: data.avgTransaction,
          cardPresent: data.cardPresent, keyed: data.keyed, ecommerce: data.ecommerce,
          currentProcessor: data.currentProcessor, reasonLeaving: data.reasonLeaving,
          cardTypes: data.cardTypes, businessType: data.businessType,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/partner/referrals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/partner/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/partner/me"] });
      toast({ title: "Application submitted!", description: "TechSavvy will reach out within 24 hours." });
      setShowReferralForm(false);
      setRefForm(emptyApp);
      setAppStep(0);
    },
    onError: () => toast({ title: "Failed to submit", variant: "destructive" }),
  });

  // Meeting form
  const emptyMeeting = { merchantName: "", merchantPhone: "", merchantEmail: "", businessName: "", meetingType: "video", preferredDate: "", preferredTime: "", location: "", notes: "" };
  const [meetingForm, setMeetingForm] = useState(emptyMeeting);
  const [showMeetingForm, setShowMeetingForm] = useState(false);
  const submitMeeting = useMutation({
    mutationFn: async (data: typeof meetingForm) => { await apiRequest("POST", "/api/partner/meetings", data); },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/partner/meetings"] });
      toast({ title: "Meeting requested!", description: "A TechSavvy team member will confirm shortly." });
      setShowMeetingForm(false);
      setMeetingForm(emptyMeeting);
    },
    onError: () => toast({ title: "Failed to submit", variant: "destructive" }),
  });

  if (selectedModule) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] px-4 py-8">
        <ModuleViewer module={selectedModule} onBack={() => setSelectedModule(null)} onComplete={() => setSelectedModule(null)} />
      </div>
    );
  }

  const navItems = [
    { value: "overview", icon: BarChart3, label: "Dashboard" },
    { value: "learn", icon: GraduationCap, label: "Learn" },
    { value: "referrals", icon: FileText, label: "Apply" },
    { value: "meetings", icon: CalendarDays, label: "Meetings" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 border-b border-zinc-800/60 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-white text-sm hidden sm:block">TechSavvy Partner</span>
          </div>
          <nav className="hidden sm:flex items-center gap-1">
            {navItems.map(({ value, icon: Icon, label }) => (
              <button
                key={value}
                onClick={() => setActiveTab(value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === value ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />{label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: partner.avatarColor }}>
                {partner.name.charAt(0).toUpperCase()}
              </div>
              <div className="text-right">
                <div className="text-xs font-medium text-white">{partner.name}</div>
                <div className={`text-[10px] flex items-center gap-1 ${tierCfg.color}`}>
                  <TierIcon className="w-2.5 h-2.5" />{tierCfg.label}
                </div>
              </div>
            </div>
            <button onClick={onLogout} className="text-zinc-600 hover:text-zinc-400 transition-colors" title="Sign out">
              <LogOut className="w-4 h-4" />
            </button>
            <button onClick={() => setMobileMenu(!mobileMenu)} className="sm:hidden text-zinc-400">
              {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {/* Mobile nav */}
        {mobileMenu && (
          <div className="sm:hidden border-t border-zinc-800/60 px-4 py-2 flex gap-1">
            {navItems.map(({ value, icon: Icon, label }) => (
              <button
                key={value}
                onClick={() => { setActiveTab(value); setMobileMenu(false); }}
                className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-lg text-[10px] font-medium ${
                  activeTab === value ? "bg-zinc-800 text-white" : "text-zinc-500"
                }`}
              >
                <Icon className="w-4 h-4" />{label}
              </button>
            ))}
          </div>
        )}
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* ─── Overview Tab ─── */}
        {activeTab === "overview" && (
          <>
            {/* Welcome */}
            <div>
              <h1 className="text-xl font-bold text-white">Welcome back, {partner.name.split(" ")[0]}</h1>
              <p className="text-sm text-zinc-500 mt-0.5">Here's your progress and earnings overview.</p>
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <Card className="bg-zinc-900/60 border-zinc-800/60">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">Learning</span>
                    <GraduationCap className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">{completionPct}%</div>
                  <Progress value={completionPct} className="h-1 mt-2 bg-zinc-800" />
                  <p className="text-[10px] text-zinc-500 mt-1.5">{stats?.completedModules || 0} of {stats?.totalModules || 0} modules</p>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900/60 border-zinc-800/60">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">Points</span>
                    <Star className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">{stats?.totalPoints || 0}</div>
                  <Progress value={pointsPct} className="h-1 mt-2 bg-zinc-800" />
                  <p className="text-[10px] text-zinc-500 mt-1.5">of {stats?.maxPoints || 0} total points</p>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900/60 border-zinc-800/60">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">Referrals</span>
                    <Gift className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">{stats?.totalReferrals || 0}</div>
                  <p className="text-[10px] text-zinc-500 mt-3">{stats?.successfulReferrals || 0} activated</p>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900/60 border-zinc-800/60">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">Earnings</span>
                    <DollarSign className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">${stats?.totalEarned?.toFixed(0) || 0}</div>
                  <p className="text-[10px] text-zinc-500 mt-3">{tierCfg.payout}</p>
                </CardContent>
              </Card>
            </div>

            {/* Tier progress */}
            <Card className="bg-zinc-900/60 border-zinc-800/60">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl ${tierCfg.bg} flex items-center justify-center`}>
                    <TierIcon className={`w-5 h-5 ${tierCfg.color}`} />
                  </div>
                  <div>
                    <div className={`text-sm font-semibold ${tierCfg.color}`}>{tierCfg.label} Partner</div>
                    <div className="text-[10px] text-zinc-500">Commission: {tierCfg.payout}</div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {Object.entries(TIER_CONFIG).map(([key, cfg]) => {
                    const isActive = key === partner.tier;
                    const isReached = (stats?.totalReferrals || 0) >= cfg.min;
                    const TIcon = cfg.icon;
                    return (
                      <div key={key} className={`p-3 rounded-xl border text-center transition-all ${isActive ? cfg.bg + " scale-105" : isReached ? "border-zinc-700/50 bg-zinc-800/30" : "border-zinc-800/30 opacity-40"}`}>
                        <TIcon className={`w-5 h-5 mx-auto mb-1 ${isActive ? cfg.color : "text-zinc-600"}`} />
                        <div className={`text-[10px] font-semibold ${isActive ? cfg.color : "text-zinc-500"}`}>{cfg.label}</div>
                        <div className="text-[9px] text-zinc-600 mt-0.5">{cfg.min}+ referrals</div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Quick actions */}
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setActiveTab("learn")} className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5 text-left hover:border-indigo-500/30 transition-all group">
                <GraduationCap className="w-6 h-6 text-indigo-400 mb-3" />
                <div className="text-sm font-semibold text-white">Continue Learning</div>
                <p className="text-[10px] text-zinc-500 mt-1">{stats ? stats.totalModules - stats.completedModules : 0} modules remaining</p>
              </button>
              <button onClick={() => setShowReferralForm(true)} className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5 text-left hover:border-emerald-500/30 transition-all group">
                <Send className="w-6 h-6 text-emerald-400 mb-3" />
                <div className="text-sm font-semibold text-white">Submit Application</div>
                <p className="text-[10px] text-zinc-500 mt-1">Refer a business and earn commission</p>
              </button>
            </div>
          </>
        )}

        {/* ─── Learn Tab ─── */}
        {activeTab === "learn" && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-white">Learning Center</h1>
                <p className="text-sm text-zinc-500 mt-0.5">Master payment processing to maximize your referrals.</p>
              </div>
              <Badge variant="outline" className="text-yellow-400 border-yellow-400/20 bg-yellow-400/5">
                <Star className="w-3 h-3 mr-1" />{stats?.totalPoints || 0} pts
              </Badge>
            </div>

            <div className="bg-zinc-900/40 border border-zinc-800/40 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-zinc-400">Overall Progress</span>
                <span className="text-xs font-medium text-white">{completionPct}%</span>
              </div>
              <Progress value={completionPct} className="h-2 bg-zinc-800" />
              <p className="text-[10px] text-zinc-500 mt-2">{stats?.completedModules || 0} of {stats?.totalModules || 0} modules completed</p>
            </div>

            {/* Training Videos from Classroom */}
            {classroomVideos.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Video className="w-4 h-4 text-red-400" />
                  <h2 className="text-sm font-semibold text-white">Training Videos</h2>
                  <Badge variant="outline" className="text-[9px] text-zinc-500">{classroomVideos.length}</Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {classroomVideos.map((vid) => (
                    <a key={vid.id} href={vid.url} target="_blank" rel="noopener noreferrer" className="block bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-4 hover:border-red-500/30 transition-all group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0 group-hover:bg-red-500/20 transition-colors">
                          <Play className="w-5 h-5 text-red-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-white truncate">{vid.name.replace(/\.[^.]+$/, "")}</div>
                          <div className="text-[10px] text-zinc-500 mt-0.5">{(vid.size / 1024 / 1024).toFixed(1)} MB</div>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {Object.entries(categories).map(([cat, mods]) => {
              const catCfg = CATEGORY_CONFIG[cat] || { label: cat, icon: BookOpen, color: "text-zinc-400" };
              const CatIcon = catCfg.icon;
              return (
                <div key={cat}>
                  <div className="flex items-center gap-2 mb-3">
                    <CatIcon className={`w-4 h-4 ${catCfg.color}`} />
                    <h2 className="text-sm font-semibold text-white">{catCfg.label}</h2>
                    <Badge variant="outline" className="text-[9px] text-zinc-500">
                      {mods.filter(m => m.progress.status === "completed").length}/{mods.length}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {mods.map((mod) => {
                      const isCompleted = mod.progress.status === "completed";
                      const isStarted = mod.progress.status === "in_progress";
                      return (
                        <button
                          key={mod.id}
                          onClick={() => setSelectedModule(mod)}
                          className={`w-full text-left bg-zinc-900/60 border rounded-xl p-4 transition-all hover:border-indigo-500/30 ${isCompleted ? "border-emerald-500/20" : "border-zinc-800/60"}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${isCompleted ? "bg-emerald-500/10" : isStarted ? "bg-indigo-500/10" : "bg-zinc-800/50"}`}>
                              {isCompleted ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : isStarted ? <Play className="w-4 h-4 text-indigo-400" /> : <Circle className="w-4 h-4 text-zinc-600" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className={`text-sm font-medium ${isCompleted ? "text-zinc-400" : "text-white"}`}>{mod.title}</span>
                                {isCompleted && <Badge variant="outline" className="text-[9px] text-emerald-400 border-emerald-400/20">Complete</Badge>}
                              </div>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-[10px] text-zinc-500 flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{mod.durationMinutes}m</span>
                                <span className={`text-[10px] ${DIFFICULTY_CONFIG[mod.difficulty]?.color || "text-zinc-500"}`}>{DIFFICULTY_CONFIG[mod.difficulty]?.label || mod.difficulty}</span>
                                <span className="text-[10px] text-yellow-400/60">{mod.points} pts</span>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-zinc-600 shrink-0" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* ─── Referral Merchant Application Tab ─── */}
        {activeTab === "referrals" && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-white">Referral Merchant Application</h1>
                <p className="text-sm text-zinc-500 mt-0.5">Submit a merchant for processing — the more detail, the faster we move.</p>
              </div>
              <Button onClick={() => { setShowReferralForm(true); setAppStep(0); }} className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white">
                <FileText className="w-3.5 h-3.5 mr-1.5" />New Application
              </Button>
            </div>

            {/* Status breakdown */}
            {stats && (
              <div className="grid grid-cols-4 gap-2">
                {Object.entries(stats.referralBreakdown).map(([key, count]) => {
                  const cfg = STATUS_CONFIG[key] || { label: key, color: "text-zinc-400", bg: "bg-zinc-800" };
                  return (
                    <div key={key} className={`p-3 rounded-xl border border-zinc-800/60 ${cfg.bg} text-center`}>
                      <div className={`text-lg font-bold ${cfg.color}`}>{count}</div>
                      <div className="text-[10px] text-zinc-500 capitalize">{cfg.label}</div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Referrals list */}
            {referrals.length === 0 ? (
              <Card className="bg-zinc-900/60 border-zinc-800/60 border-dashed">
                <CardContent className="py-12 text-center">
                  <Gift className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                  <p className="text-sm text-zinc-500">No applications yet</p>
                  <p className="text-xs text-zinc-600 mt-1">Submit your first merchant application to start earning</p>
                  <Button onClick={() => setShowReferralForm(true)} variant="outline" className="mt-4 text-xs">
                    <Send className="w-3.5 h-3.5 mr-1.5" />Submit Application
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {referrals.map((ref) => {
                  const sCfg = STATUS_CONFIG[ref.status] || { label: ref.status, color: "text-zinc-400", bg: "bg-zinc-800/50" };
                  return (
                    <Card key={ref.id} className="bg-zinc-900/60 border-zinc-800/60">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-white">{ref.businessName}</span>
                              <Badge variant="outline" className={`text-[10px] ${sCfg.color}`}>{sCfg.label}</Badge>
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-[10px] text-zinc-500">
                              {ref.contactName && <span className="flex items-center gap-1"><User className="w-2.5 h-2.5" />{ref.contactName}</span>}
                              {ref.contactPhone && <span className="flex items-center gap-1"><Phone className="w-2.5 h-2.5" />{ref.contactPhone}</span>}
                              <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{new Date(ref.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          {ref.payoutAmount > 0 && (
                            <div className="text-right">
                              <div className="text-sm font-bold text-green-400">${ref.payoutAmount}</div>
                              <div className="text-[10px] text-zinc-500">{ref.payoutDate ? new Date(ref.payoutDate).toLocaleDateString() : "Pending"}</div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>

      {/* ─── Meetings Tab ─── */}
      {activeTab === "meetings" && (
        <main className="max-w-6xl mx-auto px-4 py-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">Schedule a Meeting</h1>
              <p className="text-sm text-zinc-500 mt-0.5">Set up a video call or in-person meeting with a TechSavvy team member and merchant.</p>
            </div>
            <Button onClick={() => setShowMeetingForm(true)} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white">
              <CalendarDays className="w-3.5 h-3.5 mr-1.5" />New Meeting
            </Button>
          </div>

          {/* Meeting type cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button onClick={() => { setShowMeetingForm(true); setMeetingForm(f => ({ ...f, meetingType: "video" })); }} className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5 text-left hover:border-indigo-500/30 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-3 group-hover:bg-indigo-500/20 transition-colors">
                <Video className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="text-sm font-semibold text-white">Video Meeting</div>
              <p className="text-xs text-zinc-500 mt-1">Schedule a Zoom or Google Meet call with the merchant and a TechSavvy rep.</p>
            </button>
            <button onClick={() => { setShowMeetingForm(true); setMeetingForm(f => ({ ...f, meetingType: "in-person" })); }} className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5 text-left hover:border-emerald-500/30 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-3 group-hover:bg-emerald-500/20 transition-colors">
                <MapPin className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-sm font-semibold text-white">In-Person Meeting</div>
              <p className="text-xs text-zinc-500 mt-1">Meet face-to-face at the merchant's location. We'll send a TechSavvy rep.</p>
            </button>
          </div>

          {/* Scheduled meetings list */}
          {meetings.length === 0 ? (
            <Card className="bg-zinc-900/60 border-zinc-800/60 border-dashed">
              <CardContent className="py-12 text-center">
                <CalendarDays className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                <p className="text-sm text-zinc-500">No meetings scheduled yet</p>
                <p className="text-xs text-zinc-600 mt-1">Request a meeting and we'll coordinate with the merchant</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {meetings.map((m) => {
                const isVideo = m.meetingType === "video";
                return (
                  <Card key={m.id} className="bg-zinc-900/60 border-zinc-800/60">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${isVideo ? "bg-indigo-500/10" : "bg-emerald-500/10"}`}>
                          {isVideo ? <Video className="w-4 h-4 text-indigo-400" /> : <MapPin className="w-4 h-4 text-emerald-400" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-white">{m.businessName || m.merchantName}</span>
                            <Badge variant="outline" className={`text-[10px] ${m.status === "confirmed" ? "text-green-400" : m.status === "cancelled" ? "text-red-400" : "text-yellow-400"}`}>
                              {m.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-[10px] text-zinc-500">
                            <span className="flex items-center gap-1"><User className="w-2.5 h-2.5" />{m.merchantName}</span>
                            {m.preferredDate && <span className="flex items-center gap-1"><CalendarDays className="w-2.5 h-2.5" />{m.preferredDate}</span>}
                            {m.preferredTime && <span>{m.preferredTime}</span>}
                            <span className="capitalize">{m.meetingType}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </main>
      )}

      {/* ─── Merchant Application Dialog ─── */}
      <Dialog open={showReferralForm} onOpenChange={(open) => { setShowReferralForm(open); if (!open) { setAppStep(0); setRefForm(emptyApp); } }}>
        <DialogContent className="sm:max-w-2xl bg-zinc-900 border-zinc-800 max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              Referral Merchant Application
            </DialogTitle>
            <DialogDescription>The more info you provide, the faster TechSavvy can close the deal — and the sooner you get paid.</DialogDescription>
          </DialogHeader>

          {/* Step indicators */}
          <div className="flex items-center gap-2 pb-2">
            {["Business Info", "Owner / Contact", "Processing Details", "Additional"].map((label, i) => (
              <button key={i} onClick={() => setAppStep(i)} className={`flex-1 text-center py-2 rounded-lg text-[10px] font-medium transition-all ${appStep === i ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30" : appStep > i ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-800/40 text-zinc-500"}`}>
                {appStep > i ? <CheckCircle className="w-3 h-3 inline mr-1" /> : null}{label}
              </button>
            ))}
          </div>

          {/* Step 0: Business Information */}
          {appStep === 0 && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Legal Business Name *</Label>
                <Input value={refForm.businessName} onChange={(e) => setRefForm(p => ({ ...p, businessName: e.target.value }))} placeholder="ABC Enterprises LLC" className="bg-zinc-800/50 border-zinc-700/50" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">DBA Name (Doing Business As)</Label>
                <Input value={refForm.dbaName} onChange={(e) => setRefForm(p => ({ ...p, dbaName: e.target.value }))} placeholder="Aloha Cafe" className="bg-zinc-800/50 border-zinc-700/50" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Business Address</Label>
                <Input value={refForm.address} onChange={(e) => setRefForm(p => ({ ...p, address: e.target.value }))} placeholder="123 Kalakaua Ave" className="bg-zinc-800/50 border-zinc-700/50" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-zinc-400">City</Label>
                  <Input value={refForm.city} onChange={(e) => setRefForm(p => ({ ...p, city: e.target.value }))} placeholder="Honolulu" className="bg-zinc-800/50 border-zinc-700/50" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-zinc-400">State</Label>
                  <Input value={refForm.state} onChange={(e) => setRefForm(p => ({ ...p, state: e.target.value }))} placeholder="HI" className="bg-zinc-800/50 border-zinc-700/50" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-zinc-400">Zip</Label>
                  <Input value={refForm.zip} onChange={(e) => setRefForm(p => ({ ...p, zip: e.target.value }))} placeholder="96815" className="bg-zinc-800/50 border-zinc-700/50" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-zinc-400">Business Phone</Label>
                  <Input value={refForm.businessPhone} onChange={(e) => setRefForm(p => ({ ...p, businessPhone: e.target.value }))} placeholder="808-555-1234" className="bg-zinc-800/50 border-zinc-700/50" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-zinc-400">Business Email</Label>
                  <Input value={refForm.businessEmail} onChange={(e) => setRefForm(p => ({ ...p, businessEmail: e.target.value }))} placeholder="info@alohacafe.com" className="bg-zinc-800/50 border-zinc-700/50" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-zinc-400">Website</Label>
                  <Input value={refForm.website} onChange={(e) => setRefForm(p => ({ ...p, website: e.target.value }))} placeholder="www.alohacafe.com" className="bg-zinc-800/50 border-zinc-700/50" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-zinc-400">Years in Business</Label>
                  <Input value={refForm.yearsInBusiness} onChange={(e) => setRefForm(p => ({ ...p, yearsInBusiness: e.target.value }))} placeholder="5" className="bg-zinc-800/50 border-zinc-700/50" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Products / Services Sold</Label>
                <Input value={refForm.productsServices} onChange={(e) => setRefForm(p => ({ ...p, productsServices: e.target.value }))} placeholder="Coffee, pastries, lunch service" className="bg-zinc-800/50 border-zinc-700/50" />
              </div>
            </div>
          )}

          {/* Step 1: Owner / Contact */}
          {appStep === 1 && (
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-indigo-500/5 border border-indigo-500/10">
                <p className="text-xs text-indigo-300">Contact info for the owner or decision-maker. TechSavvy will reach out directly.</p>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Contact / Owner Name *</Label>
                <Input value={refForm.contactName} onChange={(e) => setRefForm(p => ({ ...p, contactName: e.target.value }))} placeholder="John Smith" className="bg-zinc-800/50 border-zinc-700/50" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-zinc-400">Contact Phone *</Label>
                  <Input value={refForm.contactPhone} onChange={(e) => setRefForm(p => ({ ...p, contactPhone: e.target.value }))} placeholder="808-555-5678" className="bg-zinc-800/50 border-zinc-700/50" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-zinc-400">Contact Email</Label>
                  <Input value={refForm.contactEmail} onChange={(e) => setRefForm(p => ({ ...p, contactEmail: e.target.value }))} placeholder="john@email.com" className="bg-zinc-800/50 border-zinc-700/50" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Business Type</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "restaurant", label: "Restaurant / Food" },
                    { value: "retail", label: "Retail / Shop" },
                    { value: "salon", label: "Salon / Beauty" },
                    { value: "auto", label: "Auto / Repair" },
                    { value: "medical", label: "Medical / Dental" },
                    { value: "other", label: "Other" },
                  ].map((t) => (
                    <button key={t.value} onClick={() => setRefForm(p => ({ ...p, businessType: t.value }))} className={`p-2.5 rounded-lg text-xs font-medium border transition-all ${refForm.businessType === t.value ? "bg-indigo-500/20 border-indigo-500/30 text-indigo-400" : "bg-zinc-800/40 border-zinc-700/30 text-zinc-400 hover:border-zinc-600"}`}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Processing Details */}
          {appStep === 2 && (
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                <p className="text-xs text-emerald-300">Don't worry if you don't know exact numbers — estimates are fine. We'll do a full analysis.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-zinc-400">Average Transaction Amount</Label>
                  <Input value={refForm.avgTransaction} onChange={(e) => setRefForm(p => ({ ...p, avgTransaction: e.target.value }))} placeholder="$45" className="bg-zinc-800/50 border-zinc-700/50" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-zinc-400">Monthly Card Volume</Label>
                  <Input value={refForm.monthlyVolume} onChange={(e) => setRefForm(p => ({ ...p, monthlyVolume: e.target.value }))} placeholder="$25,000" className="bg-zinc-800/50 border-zinc-700/50" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Processing Breakdown (% — should total ~100%)</Label>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] text-zinc-500">Card Present / Swiped</span>
                    <Input value={refForm.cardPresent} onChange={(e) => setRefForm(p => ({ ...p, cardPresent: e.target.value }))} placeholder="80" className="bg-zinc-800/50 border-zinc-700/50 text-center" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-zinc-500">Manually Keyed</span>
                    <Input value={refForm.keyed} onChange={(e) => setRefForm(p => ({ ...p, keyed: e.target.value }))} placeholder="10" className="bg-zinc-800/50 border-zinc-700/50 text-center" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-zinc-500">eCommerce / Online</span>
                    <Input value={refForm.ecommerce} onChange={(e) => setRefForm(p => ({ ...p, ecommerce: e.target.value }))} placeholder="10" className="bg-zinc-800/50 border-zinc-700/50 text-center" />
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Card Types Accepted</Label>
                <div className="flex flex-wrap gap-2">
                  {["visa", "mastercard", "discover", "amex", "pin-debit", "ebt"].map((ct) => (
                    <button key={ct} onClick={() => setRefForm(p => ({ ...p, cardTypes: p.cardTypes.includes(ct) ? p.cardTypes.filter(c => c !== ct) : [...p.cardTypes, ct] }))} className={`px-3 py-1.5 rounded-lg text-[10px] font-medium border transition-all ${refForm.cardTypes.includes(ct) ? "bg-indigo-500/20 border-indigo-500/30 text-indigo-400" : "bg-zinc-800/40 border-zinc-700/30 text-zinc-500"}`}>
                      {ct === "amex" ? "AMEX" : ct === "pin-debit" ? "PIN Debit" : ct === "ebt" ? "EBT" : ct.charAt(0).toUpperCase() + ct.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-zinc-400">Current Processor</Label>
                  <Input value={refForm.currentProcessor} onChange={(e) => setRefForm(p => ({ ...p, currentProcessor: e.target.value }))} placeholder="Square, Clover, etc." className="bg-zinc-800/50 border-zinc-700/50" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-zinc-400">Reason for Leaving</Label>
                  <Input value={refForm.reasonLeaving} onChange={(e) => setRefForm(p => ({ ...p, reasonLeaving: e.target.value }))} placeholder="High fees, poor service..." className="bg-zinc-800/50 border-zinc-700/50" />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Additional Info */}
          {appStep === 3 && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Additional Notes</Label>
                <Textarea value={refForm.notes} onChange={(e) => setRefForm(p => ({ ...p, notes: e.target.value }))} placeholder="How do you know this business? Best time to reach them? Any details that help us close the deal faster..." className="bg-zinc-800/50 border-zinc-700/50 h-28" />
              </div>
              {/* Summary */}
              <div className="p-4 rounded-xl bg-zinc-800/30 border border-zinc-700/30 space-y-2">
                <h4 className="text-xs font-semibold text-white">Application Summary</h4>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-[11px]">
                  {refForm.businessName && <div><span className="text-zinc-500">Business:</span> <span className="text-white">{refForm.businessName}</span></div>}
                  {refForm.dbaName && <div><span className="text-zinc-500">DBA:</span> <span className="text-white">{refForm.dbaName}</span></div>}
                  {refForm.contactName && <div><span className="text-zinc-500">Contact:</span> <span className="text-white">{refForm.contactName}</span></div>}
                  {refForm.contactPhone && <div><span className="text-zinc-500">Phone:</span> <span className="text-white">{refForm.contactPhone}</span></div>}
                  {refForm.monthlyVolume && <div><span className="text-zinc-500">Volume:</span> <span className="text-white">{refForm.monthlyVolume}</span></div>}
                  {refForm.currentProcessor && <div><span className="text-zinc-500">Current:</span> <span className="text-white">{refForm.currentProcessor}</span></div>}
                  {refForm.businessType && <div><span className="text-zinc-500">Type:</span> <span className="text-white capitalize">{refForm.businessType}</span></div>}
                  {(refForm.city || refForm.state) && <div><span className="text-zinc-500">Location:</span> <span className="text-white">{[refForm.city, refForm.state].filter(Boolean).join(", ")}</span></div>}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex-row justify-between sm:justify-between">
            <Button variant="ghost" onClick={() => appStep > 0 ? setAppStep(appStep - 1) : setShowReferralForm(false)} className="text-zinc-400">
              {appStep > 0 ? "Back" : "Cancel"}
            </Button>
            {appStep < 3 ? (
              <Button onClick={() => setAppStep(appStep + 1)} className="bg-zinc-800 hover:bg-zinc-700 text-white">
                Next <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={() => submitReferral.mutate(refForm)}
                disabled={!refForm.businessName || submitReferral.isPending}
                className="bg-gradient-to-r from-emerald-600 to-green-600 text-white"
              >
                <Send className="w-3.5 h-3.5 mr-1.5" />
                {submitReferral.isPending ? "Submitting..." : "Submit Application"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Schedule Meeting Dialog ─── */}
      <Dialog open={showMeetingForm} onOpenChange={(open) => { setShowMeetingForm(open); if (!open) setMeetingForm(emptyMeeting); }}>
        <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              {meetingForm.meetingType === "video" ? <Video className="w-5 h-5 text-indigo-400" /> : <MapPin className="w-5 h-5 text-emerald-400" />}
              Schedule {meetingForm.meetingType === "video" ? "Video" : "In-Person"} Meeting
            </DialogTitle>
            <DialogDescription>We'll coordinate with the merchant and confirm the details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="flex gap-2">
              <button onClick={() => setMeetingForm(f => ({ ...f, meetingType: "video" }))} className={`flex-1 p-3 rounded-lg text-xs font-medium border transition-all flex items-center justify-center gap-2 ${meetingForm.meetingType === "video" ? "bg-indigo-500/20 border-indigo-500/30 text-indigo-400" : "bg-zinc-800/40 border-zinc-700/30 text-zinc-400"}`}>
                <Video className="w-3.5 h-3.5" />Video Call
              </button>
              <button onClick={() => setMeetingForm(f => ({ ...f, meetingType: "in-person" }))} className={`flex-1 p-3 rounded-lg text-xs font-medium border transition-all flex items-center justify-center gap-2 ${meetingForm.meetingType === "in-person" ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400" : "bg-zinc-800/40 border-zinc-700/30 text-zinc-400"}`}>
                <MapPin className="w-3.5 h-3.5" />In-Person
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Merchant Name *</Label>
                <Input value={meetingForm.merchantName} onChange={(e) => setMeetingForm(p => ({ ...p, merchantName: e.target.value }))} placeholder="John Smith" className="bg-zinc-800/50 border-zinc-700/50" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Business Name</Label>
                <Input value={meetingForm.businessName} onChange={(e) => setMeetingForm(p => ({ ...p, businessName: e.target.value }))} placeholder="Aloha Cafe" className="bg-zinc-800/50 border-zinc-700/50" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Phone</Label>
                <Input value={meetingForm.merchantPhone} onChange={(e) => setMeetingForm(p => ({ ...p, merchantPhone: e.target.value }))} placeholder="808-555-1234" className="bg-zinc-800/50 border-zinc-700/50" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Email</Label>
                <Input value={meetingForm.merchantEmail} onChange={(e) => setMeetingForm(p => ({ ...p, merchantEmail: e.target.value }))} placeholder="john@email.com" className="bg-zinc-800/50 border-zinc-700/50" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Preferred Date</Label>
                <Input type="date" value={meetingForm.preferredDate} onChange={(e) => setMeetingForm(p => ({ ...p, preferredDate: e.target.value }))} className="bg-zinc-800/50 border-zinc-700/50" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Preferred Time</Label>
                <Input type="time" value={meetingForm.preferredTime} onChange={(e) => setMeetingForm(p => ({ ...p, preferredTime: e.target.value }))} className="bg-zinc-800/50 border-zinc-700/50" />
              </div>
            </div>
            {meetingForm.meetingType === "in-person" && (
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Meeting Location / Address</Label>
                <Input value={meetingForm.location} onChange={(e) => setMeetingForm(p => ({ ...p, location: e.target.value }))} placeholder="Merchant's business address" className="bg-zinc-800/50 border-zinc-700/50" />
              </div>
            )}
            <div className="space-y-1.5">
              <Label className="text-xs text-zinc-400">Notes</Label>
              <Textarea value={meetingForm.notes} onChange={(e) => setMeetingForm(p => ({ ...p, notes: e.target.value }))} placeholder="Any context for the meeting..." className="bg-zinc-800/50 border-zinc-700/50 h-20" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowMeetingForm(false)}>Cancel</Button>
            <Button
              onClick={() => submitMeeting.mutate(meetingForm)}
              disabled={!meetingForm.merchantName || submitMeeting.isPending}
              className={meetingForm.meetingType === "video" ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white" : "bg-gradient-to-r from-emerald-600 to-green-600 text-white"}
            >
              <CalendarDays className="w-3.5 h-3.5 mr-1.5" />
              {submitMeeting.isPending ? "Requesting..." : "Request Meeting"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────

export default function PartnerProgramPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checked, setChecked] = useState(false);

  const { data: partner, isError } = useQuery<Partner>({
    queryKey: ["/api/partner/me"],
    retry: false,
  });

  useEffect(() => {
    if (partner) { setIsLoggedIn(true); setChecked(true); }
    else if (isError) { setIsLoggedIn(false); setChecked(true); }
  }, [partner, isError]);

  const handleLogout = async () => {
    try { await apiRequest("POST", "/api/partner/logout"); } catch {}
    setIsLoggedIn(false);
    queryClient.invalidateQueries({ queryKey: ["/api/partner/me"] });
  };

  if (!checked) return <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center"><div className="text-zinc-600">Loading...</div></div>;

  if (!isLoggedIn || !partner) return <PartnerLogin onLogin={() => { setIsLoggedIn(true); queryClient.invalidateQueries({ queryKey: ["/api/partner/me"] }); }} />;

  return <ProgramDashboard partner={partner} onLogout={handleLogout} />;
}
