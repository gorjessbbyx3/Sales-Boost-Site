import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft, Bot, Save, Zap, Settings, MessageSquare, Lock, LogOut,
  LayoutDashboard, Users, DollarSign, ClipboardList, Phone, Mail,
  Plus, Trash2, Edit3, Check, TrendingUp, CreditCard, Globe,
  AlertTriangle, Calendar, Search, Filter, Copy, MapPin, Paperclip, Target, BookOpen,
  UserPlus, Building, CheckCircle,
  BarChart3, ArrowUpRight, ArrowDownRight,
  Plug, FolderOpen, Activity, FileText, Video, File, Bell, Send, RefreshCw, ExternalLink, Upload, Hash, Library, Star,
  Pin, PinOff, Sparkles, Clock, UserCog, Briefcase, Sun, Moon,
} from "lucide-react";
import type { AiConfig } from "@shared/schema";
import { useTheme } from "@/hooks/use-theme";
import { useState, useEffect, useMemo } from "react";

// ─── Types ───────────────────────────────────────────────────────────

type PipelineStage = "new" | "contacted" | "qualified" | "statement-requested" | "statement-received" | "analysis-delivered" | "proposal-sent" | "negotiation" | "won" | "lost" | "nurture";
type LeadSource = "referral" | "networking" | "social" | "direct" | "lead-magnet";
type PackageType = "terminal" | "trial" | "online";
type MaintenancePlan = "none" | "basic" | "pro" | "premium";
type Vertical = "restaurant" | "retail" | "salon" | "auto" | "medical" | "cbd" | "vape" | "firearms" | "ecommerce" | "services" | "other";

interface Lead {
  id: string;
  name: string;
  business: string;
  address: string;
  phone: string;
  email: string;
  decisionMakerName: string;
  decisionMakerRole: string;
  bestContactMethod: string;
  package: PackageType;
  status: PipelineStage;
  source: LeadSource;
  vertical: Vertical;
  currentProcessor: string;
  currentEquipment: string;
  monthlyVolume: string;
  painPoints: string;
  nextStep: string;
  nextStepDate: string;
  attachments: Array<{ name: string; url: string }>;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface ReferralPartner {
  id: string;
  name: string;
  niche: string;
  clientTypes: string;
  referralTerms: string;
  introMethod: string;
  trackingNotes: string;
  lastCheckIn: string;
  nextCheckIn: string;
  createdAt: string;
}

interface PlaybookCheckItem {
  id: string;
  channel: string;
  label: string;
  completed: boolean;
  completedAt: string;
}

interface WeeklyKPI {
  id: string;
  weekStart: string;
  outboundCalls: number;
  outboundEmails: number;
  outboundDMs: number;
  walkIns: number;
  contactsMade: number;
  appointmentsSet: number;
  statementsRequested: number;
  statementsReceived: number;
  proposalsSent: number;
  dealsWon: number;
  volumeWon: number;
  notes: string;
}

interface PlanItem {
  id: string;
  phase: number;
  weekRange: string;
  title: string;
  description: string;
  completed: boolean;
  completedAt: string;
  order: number;
}

interface MaterialItem {
  id: string;
  category: string;
  name: string;
  description: string;
  status: string;
  fileUrl: string;
  updatedAt: string;
}

interface AdminResource {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  url: string;
  thumbnailUrl: string;
  order: number;
  featured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ChannelScore {
  source: string;
  total: number;
  contacted: number;
  contactRate: number;
  qualified: number;
  appointmentRate: number;
  stmtRequested: number;
  stmtReceived: number;
  stmtReceivedRate: number;
  proposalSent: number;
  won: number;
  lost: number;
  closeRate: number;
  avgTimeToClose: number;
  avgVolumeWon: number;
}

interface Client {
  id: string;
  name: string;
  business: string;
  phone: string;
  email: string;
  package: PackageType;
  maintenance: MaintenancePlan;
  websiteUrl: string;
  websiteStatus: "not-started" | "in-progress" | "live" | "self-hosted";
  terminalId: string;
  monthlyVolume: number;
  startDate: string;
  notes: string;
}

interface RevenueEntry {
  id: string;
  date: string;
  type: "terminal-sale" | "trial-convert" | "maintenance" | "one-off-update" | "website-addon" | "other";
  description: string;
  amount: number;
  clientId: string;
  recurring: boolean;
}

interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
  linkedTo: string;
  createdAt: string;
}

interface AdminFile {
  id: string;
  name: string;
  size: number;
  type: string;
  category: string;
  uploadedAt: string;
  url: string;
}

interface SlackConfig {
  webhookUrl: string;
  channel: string;
  enabled: boolean;
  notifyNewLead: boolean;
  notifyNewClient: boolean;
  notifyRevenue: boolean;
  notifyTaskDue: boolean;
}

interface ActivityEntry {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  type: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  status: string;
  dailyInvolvement: string;
  joinedAt: string;
}

interface BusinessInfoData {
  companyName: string;
  dba: string;
  phone: string;
  email: string;
  address: string;
  website: string;
  taxId: string;
  bankPartner: string;
  processorPartner: string;
  currentPhase: string;
  notes: string;
  updatedAt: string;
}

interface ScheduleItem {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  assigneeId: string;
  priority: string;
  status: string;
  isAiGenerated: boolean;
  category: string;
  createdAt: string;
}

interface PinnedPitch {
  id: string;
  scriptKey: string;
  customContent: string;
  pinnedAt: string;
}

interface AiRecommendation {
  title: string;
  description: string;
  assigneeName: string;
  priority: string;
  category: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────

function today() { return new Date().toISOString().split("T")[0]; }
function timeAgo(ts: string) {
  const s = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}
function formatBytes(b: number) {
  if (b === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(b) / Math.log(k));
  return `${parseFloat((b / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

// ─── Constants ───────────────────────────────────────────────────────

const PIPELINE_CONFIG: Record<PipelineStage, { label: string; color: string; bg: string; short: string }> = {
  new:                  { label: "New Lead", color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20", short: "New" },
  contacted:            { label: "Contacted", color: "text-sky-400", bg: "bg-sky-400/10 border-sky-400/20", short: "Contacted" },
  qualified:            { label: "Qualified", color: "text-cyan-400", bg: "bg-cyan-400/10 border-cyan-400/20", short: "Qualified" },
  "statement-requested":{ label: "Stmt Requested", color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/20", short: "Stmt Req" },
  "statement-received": { label: "Stmt Received", color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20", short: "Stmt Recv" },
  "analysis-delivered": { label: "Analysis Sent", color: "text-orange-400", bg: "bg-orange-400/10 border-orange-400/20", short: "Analysis" },
  "proposal-sent":      { label: "Proposal Sent", color: "text-purple-400", bg: "bg-purple-400/10 border-purple-400/20", short: "Proposal" },
  negotiation:          { label: "Negotiation", color: "text-pink-400", bg: "bg-pink-400/10 border-pink-400/20", short: "Negotiation" },
  won:                  { label: "Won", color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20", short: "Won" },
  lost:                 { label: "Lost", color: "text-red-400", bg: "bg-red-400/10 border-red-400/20", short: "Lost" },
  nurture:              { label: "Nurture", color: "text-violet-400", bg: "bg-violet-400/10 border-violet-400/20", short: "Nurture" },
};

const SOURCE_CONFIG: Record<LeadSource, { label: string; color: string; icon: string }> = {
  referral:     { label: "Referral Partner", color: "text-emerald-400", icon: "R" },
  networking:   { label: "Networking", color: "text-blue-400", icon: "N" },
  social:       { label: "Social Outreach", color: "text-pink-400", icon: "S" },
  direct:       { label: "Direct Prospecting", color: "text-orange-400", icon: "D" },
  "lead-magnet":{ label: "Lead Magnet", color: "text-purple-400", icon: "L" },
};

const VERTICAL_CONFIG: Record<Vertical, string> = {
  restaurant: "Restaurant/Food", retail: "Retail", salon: "Salon/Beauty", auto: "Auto/Repair",
  medical: "Medical/Dental", cbd: "CBD/Hemp", vape: "Vape/Smoke", firearms: "Firearms",
  ecommerce: "E-Commerce", services: "Professional Services", other: "Other",
};

const PACKAGE_CONFIG: Record<PackageType, { label: string; color: string }> = {
  terminal: { label: "Terminal ($399)", color: "text-primary" },
  trial: { label: "30-Day Trial", color: "text-chart-4" },
  online: { label: "Online (Free)", color: "text-chart-2" },
};

const MAINTENANCE_CONFIG: Record<MaintenancePlan, { label: string; price: string }> = {
  none: { label: "None / Self-Hosted", price: "$0" },
  basic: { label: "Basic", price: "$50/mo" },
  pro: { label: "Pro", price: "$199/mo" },
  premium: { label: "Premium", price: "$399/mo" },
};

const REVENUE_TYPES: Record<RevenueEntry["type"], string> = {
  "terminal-sale": "Terminal Sale", "trial-convert": "Trial Conversion",
  "maintenance": "Maintenance Plan", "one-off-update": "One-Off Update",
  "website-addon": "Website Add-On", "other": "Other",
};

const MODELS = [
  { value: "claude-sonnet-4-20250514", label: "Claude Sonnet 4 (Latest)" },
  { value: "claude-3-7-sonnet-20250219", label: "Claude 3.7 Sonnet" },
  { value: "claude-3-5-haiku-20241022", label: "Claude 3.5 Haiku (Fast)" },
];

const CONTACT_METHODS: Record<string, string> = {
  phone: "Phone Call", email: "Email", text: "Text/SMS", "in-person": "In-Person",
};

const ACTIVITY_COLORS: Record<string, string> = {
  lead: "bg-blue-400", client: "bg-emerald-400", revenue: "bg-purple-400",
  task: "bg-yellow-400", file: "bg-orange-400", integration: "bg-pink-400", auth: "bg-gray-400",
};

const MATERIAL_CATEGORIES: Record<string, { label: string; icon: string }> = {
  sales: { label: "Sales & Outreach Assets", icon: "S" },
  "lead-gen": { label: "Lead Generation Assets", icon: "L" },
  partner: { label: "Partner Program Assets", icon: "P" },
  tracking: { label: "Tracking & Ops Assets", icon: "T" },
};

const PLAYBOOK_SCRIPTS = {
  referral: {
    outreach: `I work with local businesses to lower processing costs and upgrade payment reliability. You already advise businesses on operations/financials — if you have clients complaining about fees or equipment, I can do a no-obligation statement review. If it helps, I'll pay a referral fee and track everything cleanly.`,
  },
  networking: {
    elevator: `I help local businesses stop bleeding money on hidden processing fees and outdated equipment. If you bring me a recent statement, I'll highlight what's actually being charged and what could be improved — no obligation.`,
  },
  social: {
    dm: `Appreciate you checking that post. If you want, I can do a quick statement check and tell you where the extra fees usually hide. It's a simple yes/no: either it's already solid, or there's money on the table.`,
  },
  direct: {
    coldCall: `Hi — I'm local and I help businesses reduce processing costs and fix the usual problems like hidden fees or outdated terminals. I'm not calling to sell you on the spot — I'm offering a no-obligation statement review. If you've got last month's statement, I'll show you exactly what you're paying and what can be improved.`,
    walkIn: `Hey, I'm in the area helping businesses compare statements — processing fees are all over the place right now. Who handles your merchant account? I can do a quick statement check and show you what's normal vs. what's inflated.`,
    email: `Subject: Quick question about your payment setup

Hi {Name} — I stopped by / noticed {specific observation}. I work with local {vertical} businesses to reduce processing fees and modernize checkout without disruption.

If you send a recent statement, I'll mark up what you're paying (including the sneaky line items) and give you a clear comparison — no obligation.

Best contact for a 10-minute review?`,
  },
  leadMagnet: {
    followUp24hr: `Hey {Name} — saw you grabbed the {Lead Magnet}. If you want, send a recent statement and I'll point out exactly where fees tend to stack up for {their vertical}. No pressure — you'll just know what's real.`,
  },
};

// ─── Login ───────────────────────────────────────────────────────────

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: async (pw: string) => { const res = await apiRequest("POST", "/api/admin/login", { password: pw }); return res.json(); },
    onSuccess: () => { onLogin(); toast({ title: "Logged in", description: "Welcome to the admin panel." }); },
    onError: () => { setError("Invalid password. Please try again."); },
  });

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-sm overflow-visible border-primary/10">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-primary/5 to-transparent" />
        <CardHeader className="text-center relative">
          <div className="w-14 h-14 rounded-md bg-primary/15 flex items-center justify-center mx-auto mb-3"><Lock className="w-7 h-7 text-primary" /></div>
          <CardTitle className="text-xl">Admin Access</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Enter your admin password to continue</p>
        </CardHeader>
        <CardContent className="relative">
          <form onSubmit={(e) => { e.preventDefault(); setError(""); loginMutation.mutate(password); }} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-muted rounded-md px-3 h-9 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary/50" placeholder="Enter admin password" />
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={loginMutation.isPending || !password}>{loginMutation.isPending ? "Logging in..." : "Log In"}</Button>
          </form>
          <div className="mt-4 text-center">
            <Button variant="ghost" size="sm" asChild>
              <a href={window.location.hostname.startsWith("admin.") ? `https://${window.location.hostname.replace("admin.", "")}` : "/"}>Back to Main Site</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────

export default function AiConfigPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const { data: authStatus } = useQuery<{ authenticated: boolean }>({ queryKey: ["/api/admin/check"] });

  useEffect(() => {
    if (authStatus !== undefined) { setIsAuthenticated(authStatus.authenticated); setAuthChecked(true); }
  }, [authStatus]);

  const logoutMutation = useMutation({
    mutationFn: async () => { await apiRequest("POST", "/api/admin/logout"); },
    onSuccess: () => { setIsAuthenticated(false); queryClient.invalidateQueries({ queryKey: ["/api/admin/check"] }); },
  });

  if (!authChecked) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="text-muted-foreground">Loading...</div></div>;
  if (!isAuthenticated) return <AdminLogin onLogin={() => { setIsAuthenticated(true); queryClient.invalidateQueries({ queryKey: ["/api/admin/check"] }); }} />;
  return <AdminDashboard onLogout={() => logoutMutation.mutate()} />;
}

// ─── Dashboard Shell ─────────────────────────────────────────────────

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState("overview");
  const { theme, toggleTheme } = useTheme();
  const mainDomain = window.location.hostname.startsWith("admin.") ? `https://${window.location.hostname.replace("admin.", "")}` : "/";

  const tabs = [
    { value: "overview", icon: BarChart3, label: "Dashboard" },
    { value: "leads", icon: UserPlus, label: "Leads" },
    { value: "playbooks", icon: BookOpen, label: "Playbooks" },
    { value: "scorecard", icon: Target, label: "Scorecard" },
    { value: "plan", icon: Calendar, label: "90-Day Plan" },
    { value: "materials", icon: ClipboardList, label: "Materials" },
    { value: "clients", icon: Users, label: "Clients" },
    { value: "revenue", icon: DollarSign, label: "Revenue" },
    { value: "tasks", icon: ClipboardList, label: "Tasks" },
    { value: "files", icon: FolderOpen, label: "Files" },
    { value: "integrations", icon: Plug, label: "Integrations" },
    { value: "resources", icon: Library, label: "Resources" },
    { value: "team", icon: UserCog, label: "Team" },
    { value: "schedule", icon: Clock, label: "Schedule" },
    { value: "ai-ops", icon: Sparkles, label: "AI Ops" },
    { value: "activity", icon: Activity, label: "Activity" },
    { value: "ai", icon: Bot, label: "AI Chat" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <a href={mainDomain} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"><ArrowLeft className="w-4 h-4" /></a>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-primary/15 flex items-center justify-center"><LayoutDashboard className="w-4 h-4 text-primary" /></div>
                <h1 className="text-sm font-bold">TechSavvy Admin</h1>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={toggleTheme} className="text-muted-foreground" title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" size="sm" onClick={onLogout} className="text-muted-foreground"><LogOut className="w-4 h-4" /><span className="hidden sm:inline ml-1.5">Log Out</span></Button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-border/50 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-transparent h-auto p-0 gap-0 rounded-none w-full justify-start overflow-x-auto scrollbar-none">
              {tabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-2.5 sm:px-4 py-3 text-[11px] sm:text-sm gap-1 sm:gap-1.5 shrink-0"
                  title={tab.label}>
                  <tab.icon className="w-4 h-4 sm:w-3.5 sm:h-3.5" /><span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="overview"><OverviewTab setActiveTab={setActiveTab} /></TabsContent>
          <TabsContent value="leads"><LeadsTab /></TabsContent>
          <TabsContent value="playbooks"><PlaybooksTab /></TabsContent>
          <TabsContent value="scorecard"><ScorecardTab /></TabsContent>
          <TabsContent value="plan"><PlanTab /></TabsContent>
          <TabsContent value="materials"><MaterialsTab /></TabsContent>
          <TabsContent value="clients"><ClientsTab /></TabsContent>
          <TabsContent value="revenue"><RevenueTab /></TabsContent>
          <TabsContent value="tasks"><TasksTab /></TabsContent>
          <TabsContent value="files"><FilesTab /></TabsContent>
          <TabsContent value="integrations"><IntegrationsTab /></TabsContent>
          <TabsContent value="resources"><ResourcesManagerTab /></TabsContent>
          <TabsContent value="team"><TeamTab /></TabsContent>
          <TabsContent value="schedule"><ScheduleTab /></TabsContent>
          <TabsContent value="ai-ops"><AiOpsTab /></TabsContent>
          <TabsContent value="activity"><ActivityTab /></TabsContent>
          <TabsContent value="ai"><AiSettingsTab /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// ─── Overview Tab ────────────────────────────────────────────────────

function MetricCard({ icon: Icon, label, value, subtext, color, bgColor }: {
  icon: React.ElementType; label: string; value: string; subtext: string; color: string; bgColor: string;
}) {
  return (
    <Card className="overflow-visible border-border/50">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-9 h-9 rounded-md ${bgColor} flex items-center justify-center`}><Icon className={`w-4 h-4 ${color}`} /></div>
          <span className="text-xs text-muted-foreground">{label}</span>
        </div>
        <div className="text-xl sm:text-2xl font-extrabold">{value}</div>
        <div className="text-[10px] sm:text-xs text-muted-foreground mt-1">{subtext}</div>
      </CardContent>
    </Card>
  );
}

function OverviewTab({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const { data: leads = [] } = useQuery<Lead[]>({ queryKey: ["/api/leads"] });
  const { data: clients = [] } = useQuery<Client[]>({ queryKey: ["/api/clients"] });
  const { data: revenueEntries = [] } = useQuery<RevenueEntry[]>({ queryKey: ["/api/revenue"] });
  const { data: tasks = [] } = useQuery<Task[]>({ queryKey: ["/api/tasks"] });
  const { data: activityData = [] } = useQuery<ActivityEntry[]>({ queryKey: ["/api/activity"] });
  const { data: slackCfg } = useQuery<SlackConfig>({ queryKey: ["/api/integrations/slack"] });
  const { data: filesData = [] } = useQuery<AdminFile[]>({ queryKey: ["/api/files"] });
  const { data: planData = [] } = useQuery<PlanItem[]>({ queryKey: ["/api/plan-items"] });
  const { data: materialsData = [] } = useQuery<MaterialItem[]>({ queryKey: ["/api/materials"] });

  const activeLeads = leads.filter((l) => !["won", "lost", "nurture"].includes(l.status));
  const wonThisMonth = leads.filter((l) => { const d = new Date(l.updatedAt); const n = new Date(); return l.status === "won" && d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear(); });
  const monthlyRecurring = clients.reduce((sum, c) => { const p: Record<MaintenancePlan, number> = { none: 0, basic: 50, pro: 199, premium: 399 }; return sum + p[c.maintenance]; }, 0);
  const now = new Date();
  const thisMonthRevenue = revenueEntries.filter((r) => { const d = new Date(r.date); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); }).reduce((s, r) => s + r.amount, 0);
  const pendingTasks = tasks.filter((t) => !t.completed);
  const overdueTasks = pendingTasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date(today()));
  const recentLeads = [...leads].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
  const upcomingTasks = [...pendingTasks].sort((a, b) => (a.dueDate || "9").localeCompare(b.dueDate || "9")).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <MetricCard icon={UserPlus} label="Active Pipeline" value={activeLeads.length.toString()} subtext={`${wonThisMonth.length} won this month`} color="text-blue-400" bgColor="bg-blue-400/10" />
        <MetricCard icon={Users} label="Total Clients" value={clients.length.toString()} subtext={`${clients.filter((c) => c.maintenance !== "none").length} on maintenance`} color="text-emerald-400" bgColor="bg-emerald-400/10" />
        <MetricCard icon={TrendingUp} label="Monthly Recurring" value={`$${monthlyRecurring.toLocaleString()}`} subtext={`${clients.filter((c) => c.maintenance !== "none").length} active plans`} color="text-primary" bgColor="bg-primary/10" />
        <MetricCard icon={DollarSign} label="Revenue This Month" value={`$${thisMonthRevenue.toLocaleString()}`} subtext={`${revenueEntries.filter((r) => { const d = new Date(r.date); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); }).length} txns`} color="text-chart-4" bgColor="bg-chart-4/10" />
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        <div className="text-center py-3 rounded-lg bg-muted/30 border border-border/30">
          <div className="text-lg font-bold">{pendingTasks.length}</div>
          <div className="text-[10px] text-muted-foreground">Pending Tasks</div>
        </div>
        <div className="text-center py-3 rounded-lg bg-muted/30 border border-border/30">
          <div className={`text-lg font-bold ${overdueTasks.length > 0 ? "text-red-400" : ""}`}>{overdueTasks.length}</div>
          <div className="text-[10px] text-muted-foreground">Overdue</div>
        </div>
        <div className="text-center py-3 rounded-lg bg-muted/30 border border-border/30">
          <div className="text-lg font-bold">{filesData.length}</div>
          <div className="text-[10px] text-muted-foreground">Files</div>
        </div>
        <div className="text-center py-3 rounded-lg bg-muted/30 border border-border/30 hidden sm:block">
          <div className={`text-lg font-bold ${slackCfg?.enabled ? "text-emerald-400" : "text-muted-foreground"}`}>{slackCfg?.enabled ? "ON" : "OFF"}</div>
          <div className="text-[10px] text-muted-foreground">Slack</div>
        </div>
        <div className="text-center py-3 rounded-lg bg-muted/30 border border-border/30 hidden sm:block">
          <div className="text-lg font-bold">{clients.filter((c) => c.websiteStatus === "live").length}</div>
          <div className="text-[10px] text-muted-foreground">Sites Live</div>
        </div>
      </div>

      {overdueTasks.length > 0 && (
        <Card className="border-destructive/30 overflow-visible">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-destructive/10 flex items-center justify-center shrink-0"><AlertTriangle className="w-4 h-4 text-destructive" /></div>
            <div><p className="text-sm font-medium text-destructive">{overdueTasks.length} overdue task{overdueTasks.length > 1 ? "s" : ""}</p><p className="text-xs text-muted-foreground">Check your task list for follow-ups</p></div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <Button variant="outline" size="sm" className="justify-start text-xs h-9" onClick={() => setActiveTab("leads")}><Plus className="w-3.5 h-3.5 mr-1.5" />Add New Lead</Button>
        <Button variant="outline" size="sm" className="justify-start text-xs h-9" onClick={() => setActiveTab("playbooks")}><BookOpen className="w-3.5 h-3.5 mr-1.5" />Open Playbooks</Button>
        <Button variant="outline" size="sm" className="justify-start text-xs h-9" onClick={() => setActiveTab("scorecard")}><Target className="w-3.5 h-3.5 mr-1.5" />View Scorecard</Button>
        <Button variant="outline" size="sm" className="justify-start text-xs h-9" onClick={() => setActiveTab("plan")}><Calendar className="w-3.5 h-3.5 mr-1.5" />90-Day Plan</Button>
      </div>

      {/* Plan + Materials Progress */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Card className="overflow-visible border-border/50 cursor-pointer hover:border-primary/30 transition-colors" onClick={() => setActiveTab("plan")}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2"><Calendar className="w-4 h-4 text-blue-400" /><span className="text-xs font-semibold">90-Day Plan Progress</span></div>
            <Progress value={planData.length > 0 ? (planData.filter(p => p.completed).length / planData.length) * 100 : 0} className="h-2 mb-1.5" />
            <p className="text-[10px] text-muted-foreground">{planData.filter(p => p.completed).length} / {planData.length} tasks completed</p>
          </CardContent>
        </Card>
        <Card className="overflow-visible border-border/50 cursor-pointer hover:border-primary/30 transition-colors" onClick={() => setActiveTab("materials")}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2"><ClipboardList className="w-4 h-4 text-emerald-400" /><span className="text-xs font-semibold">Materials Checklist</span></div>
            <Progress value={materialsData.length > 0 ? (materialsData.filter(m => m.status === "completed").length / materialsData.length) * 100 : 0} className="h-2 mb-1.5" />
            <p className="text-[10px] text-muted-foreground">{materialsData.filter(m => m.status === "completed").length} / {materialsData.length} assets ready</p>
          </CardContent>
        </Card>
      </div>

      {/* Channel Scorecard */}
      <Card className="overflow-visible border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-2"><BarChart3 className="w-4 h-4 text-primary" />Channel Scorecard</CardTitle>
            <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => setActiveTab("scorecard")}>Full Scorecard <ArrowUpRight className="w-3 h-3 ml-1" /></Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {(Object.keys(SOURCE_CONFIG) as LeadSource[]).map((src) => {
              const srcLeads = leads.filter((l) => l.source === src);
              const won = srcLeads.filter((l) => l.status === "won").length;
              const rate = srcLeads.length > 0 ? Math.round((won / srcLeads.length) * 100) : 0;
              return (
                <div key={src} className="text-center py-3 rounded-lg bg-muted/30">
                  <div className={`text-xs font-semibold ${SOURCE_CONFIG[src].color} mb-1`}>{SOURCE_CONFIG[src].label}</div>
                  <div className="text-lg font-bold">{srcLeads.length}</div>
                  <div className="text-[10px] text-muted-foreground">{won} won ({rate}%)</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Pipeline + Recent */}
      <Card className="overflow-visible border-border/50">
        <CardHeader className="pb-3"><CardTitle className="text-sm font-semibold flex items-center gap-2"><BarChart3 className="w-4 h-4 text-primary" />Sales Pipeline</CardTitle></CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-11 gap-1.5">
            {(Object.keys(PIPELINE_CONFIG) as PipelineStage[]).map((stage) => {
              const count = leads.filter((l) => l.status === stage).length;
              return (
                <div key={stage} className="text-center py-2 rounded-lg bg-muted/30">
                  <div className={`text-lg font-bold ${PIPELINE_CONFIG[stage].color}`}>{count}</div>
                  <div className="text-[9px] text-muted-foreground leading-tight">{PIPELINE_CONFIG[stage].short}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="overflow-visible border-border/50">
          <CardHeader className="pb-3"><CardTitle className="text-sm font-semibold flex items-center gap-2"><UserPlus className="w-4 h-4 text-blue-400" />Recent Leads</CardTitle></CardHeader>
          <CardContent className="pt-0">
            {recentLeads.length === 0 ? <p className="text-sm text-muted-foreground py-4 text-center">No leads yet.</p> : (
              <div className="space-y-2">{recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between gap-3 py-2 border-b border-border/30 last:border-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{lead.business || lead.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[10px] ${SOURCE_CONFIG[lead.source]?.color || "text-muted-foreground"}`}>{SOURCE_CONFIG[lead.source]?.label || lead.source}</span>
                      <span className="text-[10px] text-muted-foreground">{PACKAGE_CONFIG[lead.package].label}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className={`text-[10px] shrink-0 ${PIPELINE_CONFIG[lead.status].bg} ${PIPELINE_CONFIG[lead.status].color}`}>{PIPELINE_CONFIG[lead.status].short}</Badge>
                </div>
              ))}</div>
            )}
          </CardContent>
        </Card>

        <Card className="overflow-visible border-border/50">
          <CardHeader className="pb-3"><CardTitle className="text-sm font-semibold flex items-center gap-2"><Activity className="w-4 h-4 text-chart-4" />Recent Activity</CardTitle></CardHeader>
          <CardContent className="pt-0">
            {activityData.length === 0 ? <p className="text-sm text-muted-foreground py-4 text-center">No activity yet.</p> : (
              <div className="space-y-2">{activityData.slice(0, 8).map((a) => (
                <div key={a.id} className="flex items-center gap-3 py-1.5 border-b border-border/30 last:border-0">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${ACTIVITY_COLORS[a.type] || "bg-gray-400"}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs truncate"><span className="font-medium">{a.action}</span> — {a.details}</p>
                    <p className="text-[10px] text-muted-foreground">{timeAgo(a.timestamp)}</p>
                  </div>
                </div>
              ))}</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ─── Leads Tab ───────────────────────────────────────────────────────

function LeadsTab() {
  const { data: leads = [], refetch } = useQuery<Lead[]>({ queryKey: ["/api/leads"] });
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<PipelineStage | "all">("all");
  const [filterSource, setFilterSource] = useState<LeadSource | "all">("all");
  const { toast } = useToast();

  const createMutation = useMutation({
    mutationFn: async (data: Partial<Lead>) => { const res = await apiRequest("POST", "/api/leads", data); return res.json(); },
    onSuccess: () => { refetch(); toast({ title: "Lead added" }); setShowForm(false); setEditingLead(null); },
  });
  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Lead> & { id: string }) => { const res = await apiRequest("PATCH", `/api/leads/${id}`, data); return res.json(); },
    onSuccess: () => { refetch(); toast({ title: "Lead updated" }); setShowForm(false); setEditingLead(null); },
  });
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { await apiRequest("DELETE", `/api/leads/${id}`); },
    onSuccess: () => { refetch(); toast({ title: "Lead deleted" }); },
  });
  const convertMutation = useMutation({
    mutationFn: async (lead: Lead) => {
      await apiRequest("POST", "/api/clients", { name: lead.name, business: lead.business, phone: lead.phone, email: lead.email, package: lead.package, maintenance: "none", websiteUrl: "", websiteStatus: "not-started", terminalId: "", monthlyVolume: 0, startDate: today(), notes: lead.notes });
      await apiRequest("PATCH", `/api/leads/${lead.id}`, { status: "won" });
    },
    onSuccess: () => { refetch(); queryClient.invalidateQueries({ queryKey: ["/api/clients"] }); toast({ title: "Lead converted to client" }); },
  });

  const filteredLeads = useMemo(() => leads
    .filter((l) => filterStatus === "all" || l.status === filterStatus)
    .filter((l) => filterSource === "all" || l.source === filterSource)
    .filter((l) => !search || [l.name, l.business, l.email, l.phone, l.currentProcessor].some((f) => f?.toLowerCase().includes(search.toLowerCase())))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  [leads, filterStatus, filterSource, search]);

  const handleSave = (form: Partial<Lead>) => {
    if (editingLead) updateMutation.mutate({ ...form, id: editingLead.id } as Lead & { id: string });
    else createMutation.mutate(form);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">Lead Pipeline</h2>
          <p className="text-xs text-muted-foreground">{leads.length} total — {leads.filter((l) => !["won", "lost", "nurture"].includes(l.status)).length} active pipeline</p>
        </div>
        <Button size="sm" onClick={() => { setEditingLead(null); setShowForm(true); }}><Plus className="w-3.5 h-3.5" />Add Lead</Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input placeholder="Search leads..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
        </div>
        <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as PipelineStage | "all")}>
          <SelectTrigger className="w-full sm:w-40 h-9"><Filter className="w-3.5 h-3.5 mr-1.5" /><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            {(Object.keys(PIPELINE_CONFIG) as PipelineStage[]).map((s) => <SelectItem key={s} value={s}>{PIPELINE_CONFIG[s].label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterSource} onValueChange={(v) => setFilterSource(v as LeadSource | "all")}>
          <SelectTrigger className="w-full sm:w-40 h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            {(Object.keys(SOURCE_CONFIG) as LeadSource[]).map((s) => <SelectItem key={s} value={s}>{SOURCE_CONFIG[s].label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {filteredLeads.length === 0 ? (
        <Card className="overflow-visible border-dashed"><CardContent className="p-8 text-center"><UserPlus className="w-8 h-8 text-muted-foreground/50 mx-auto mb-3" /><p className="text-sm text-muted-foreground">{leads.length === 0 ? "No leads yet. Click 'Add Lead' to start." : "No leads match filters."}</p></CardContent></Card>
      ) : (
        <div className="space-y-2">{filteredLeads.map((lead) => (
          <Card key={lead.id} className="overflow-visible border-border/50">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row items-start gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1 flex-wrap">
                    <span className="font-semibold text-sm">{lead.business || lead.name}</span>
                    <Badge variant="outline" className={`text-[10px] ${PIPELINE_CONFIG[lead.status].bg} ${PIPELINE_CONFIG[lead.status].color}`}>{PIPELINE_CONFIG[lead.status].short}</Badge>
                    <Badge variant="outline" className={`text-[10px] ${SOURCE_CONFIG[lead.source]?.color || ""}`}>{SOURCE_CONFIG[lead.source]?.label || lead.source}</Badge>
                    <Badge variant="outline" className={`text-[10px] ${PACKAGE_CONFIG[lead.package].color}`}>{PACKAGE_CONFIG[lead.package].label}</Badge>
                  </div>
                  {lead.business && lead.name && <p className="text-xs text-muted-foreground">{lead.name}{lead.decisionMakerName ? ` — DM: ${lead.decisionMakerName}${lead.decisionMakerRole ? ` (${lead.decisionMakerRole})` : ""}` : ""}</p>}
                  <div className="flex flex-wrap gap-x-3 sm:gap-x-4 gap-y-1 mt-1.5 text-xs text-muted-foreground">
                    {lead.phone && <a href={`tel:${lead.phone}`} className="flex items-center gap-1 hover:text-foreground"><Phone className="w-3 h-3" />{lead.phone}</a>}
                    {lead.email && <a href={`mailto:${lead.email}`} className="flex items-center gap-1 hover:text-foreground truncate max-w-[180px] sm:max-w-none"><Mail className="w-3 h-3" />{lead.email}</a>}
                    {lead.address && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{lead.address}</span>}
                    {lead.vertical && <span className="text-[10px]">{VERTICAL_CONFIG[lead.vertical] || lead.vertical}</span>}
                    {lead.currentProcessor && <span className="text-[10px]">Processor: {lead.currentProcessor}</span>}
                    {lead.currentEquipment && <span className="text-[10px]">POS: {lead.currentEquipment}</span>}
                    {lead.monthlyVolume && <span className="text-[10px]">Vol: {lead.monthlyVolume}</span>}
                    {lead.bestContactMethod && lead.bestContactMethod !== "phone" && <Badge variant="outline" className="text-[9px]">{CONTACT_METHODS[lead.bestContactMethod] || lead.bestContactMethod}</Badge>}
                    {lead.attachments?.length > 0 && <span className="flex items-center gap-1 text-[10px]"><Paperclip className="w-3 h-3" />{lead.attachments.length} file{lead.attachments.length > 1 ? "s" : ""}</span>}
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(lead.createdAt).toLocaleDateString()}</span>
                  </div>
                  {lead.nextStep && <p className="text-xs text-primary mt-1.5">Next: {lead.nextStep}{lead.nextStepDate ? ` (${lead.nextStepDate})` : ""}</p>}
                  {lead.painPoints && <p className="text-[10px] text-muted-foreground mt-1">Pain: {lead.painPoints}</p>}
                  {lead.notes && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{lead.notes}</p>}
                </div>
                <div className="flex items-center gap-1 shrink-0 self-end sm:self-start">
                  {!["won", "lost"].includes(lead.status) && (
                    <Select value={lead.status} onValueChange={(v) => updateMutation.mutate({ id: lead.id, status: v } as any)}>
                      <SelectTrigger className="h-7 w-24 text-[10px]"><SelectValue /></SelectTrigger>
                      <SelectContent>{(Object.keys(PIPELINE_CONFIG) as PipelineStage[]).map((s) => <SelectItem key={s} value={s} className="text-xs">{PIPELINE_CONFIG[s].short}</SelectItem>)}</SelectContent>
                    </Select>
                  )}
                  {!["won", "lost"].includes(lead.status) && (
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-emerald-400" onClick={() => convertMutation.mutate(lead)} title="Convert to client"><CheckCircle className="w-3.5 h-3.5" /></Button>
                  )}
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditingLead(lead); setShowForm(true); }}><Edit3 className="w-3.5 h-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteMutation.mutate(lead.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}</div>
      )}
      <LeadFormDialog open={showForm} onClose={() => { setShowForm(false); setEditingLead(null); }} onSave={handleSave} lead={editingLead} />
    </div>
  );
}

function LeadFormDialog({ open, onClose, onSave, lead }: { open: boolean; onClose: () => void; onSave: (form: Partial<Lead>) => void; lead: Lead | null; }) {
  const [form, setForm] = useState<Partial<Lead>>({});
  useEffect(() => {
    if (open) setForm(lead || { name: "", business: "", address: "", phone: "", email: "", decisionMakerName: "", decisionMakerRole: "", bestContactMethod: "phone", package: "terminal", status: "new", source: "direct", vertical: "other", currentProcessor: "", currentEquipment: "", monthlyVolume: "", painPoints: "", nextStep: "", nextStepDate: "", attachments: [], notes: "" });
  }, [open, lead]);
  const set = (key: keyof Lead, value: any) => setForm((p) => ({ ...p, [key]: value }));
  const attachments = (form.attachments || []) as Array<{ name: string; url: string }>;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{lead ? "Edit Lead" : "Add New Lead"}</DialogTitle><DialogDescription>Track a sales opportunity through the pipeline</DialogDescription></DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label className="text-xs">Contact Name *</Label><Input value={form.name || ""} onChange={(e) => set("name", e.target.value)} placeholder="John Doe" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Business Name *</Label><Input value={form.business || ""} onChange={(e) => set("business", e.target.value)} placeholder="Aloha Cafe" /></div>
          </div>
          <div className="space-y-1.5"><Label className="text-xs">Business Address</Label><Input value={form.address || ""} onChange={(e) => set("address", e.target.value)} placeholder="123 Main St, City, State" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label className="text-xs">Phone</Label><Input value={form.phone || ""} onChange={(e) => set("phone", e.target.value)} placeholder="808-555-1234" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Email</Label><Input value={form.email || ""} onChange={(e) => set("email", e.target.value)} placeholder="john@aloha.com" /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5"><Label className="text-xs">Decision Maker</Label><Input value={form.decisionMakerName || ""} onChange={(e) => set("decisionMakerName", e.target.value)} placeholder="Owner name" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Role</Label><Input value={form.decisionMakerRole || ""} onChange={(e) => set("decisionMakerRole", e.target.value)} placeholder="Owner, Manager..." /></div>
            <div className="space-y-1.5"><Label className="text-xs">Best Contact</Label>
              <Select value={form.bestContactMethod || "phone"} onValueChange={(v) => set("bestContactMethod", v)}><SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{Object.entries(CONTACT_METHODS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent></Select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5"><Label className="text-xs">Lead Source</Label>
              <Select value={form.source || "direct"} onValueChange={(v) => set("source", v)}><SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{(Object.keys(SOURCE_CONFIG) as LeadSource[]).map((s) => <SelectItem key={s} value={s}>{SOURCE_CONFIG[s].label}</SelectItem>)}</SelectContent></Select>
            </div>
            <div className="space-y-1.5"><Label className="text-xs">Package</Label>
              <Select value={form.package || "terminal"} onValueChange={(v) => set("package", v)}><SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="terminal">Terminal ($399)</SelectItem><SelectItem value="trial">30-Day Trial</SelectItem><SelectItem value="online">Online (Free)</SelectItem></SelectContent></Select>
            </div>
            <div className="space-y-1.5"><Label className="text-xs">Pipeline Stage</Label>
              <Select value={form.status || "new"} onValueChange={(v) => set("status", v)}><SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{(Object.keys(PIPELINE_CONFIG) as PipelineStage[]).map((s) => <SelectItem key={s} value={s}>{PIPELINE_CONFIG[s].label}</SelectItem>)}</SelectContent></Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label className="text-xs">Business Vertical</Label>
              <Select value={form.vertical || "other"} onValueChange={(v) => set("vertical", v)}><SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{(Object.keys(VERTICAL_CONFIG) as Vertical[]).map((v) => <SelectItem key={v} value={v}>{VERTICAL_CONFIG[v]}</SelectItem>)}</SelectContent></Select>
            </div>
            <div className="space-y-1.5"><Label className="text-xs">Current Processor</Label><Input value={form.currentProcessor || ""} onChange={(e) => set("currentProcessor", e.target.value)} placeholder="Square, Clover, etc." /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label className="text-xs">Current Equipment/POS</Label><Input value={form.currentEquipment || ""} onChange={(e) => set("currentEquipment", e.target.value)} placeholder="Clover Mini, Verifone..." /></div>
            <div className="space-y-1.5"><Label className="text-xs">Est. Monthly Volume</Label><Input value={form.monthlyVolume || ""} onChange={(e) => set("monthlyVolume", e.target.value)} placeholder="$5K-$10K" /></div>
          </div>
          <div className="space-y-1.5"><Label className="text-xs">Pain Points</Label><Input value={form.painPoints || ""} onChange={(e) => set("painPoints", e.target.value)} placeholder="High fees, old terminal, chargebacks, funding delays..." /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label className="text-xs">Next Step</Label><Input value={form.nextStep || ""} onChange={(e) => set("nextStep", e.target.value)} placeholder="Statement review call" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Next Step Date</Label><Input type="date" value={form.nextStepDate || ""} onChange={(e) => set("nextStepDate", e.target.value)} /></div>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between"><Label className="text-xs">Attachments</Label>
              <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={() => set("attachments", [...attachments, { name: "", url: "" }])}><Plus className="w-3 h-3" />Add</Button>
            </div>
            {attachments.map((att, i) => (
              <div key={i} className="flex gap-2 items-center">
                <Input className="flex-1 h-8 text-xs" value={att.name} onChange={(e) => { const a = [...attachments]; a[i] = { ...a[i], name: e.target.value }; set("attachments", a); }} placeholder="Statement PDF" />
                <Input className="flex-1 h-8 text-xs" value={att.url} onChange={(e) => { const a = [...attachments]; a[i] = { ...a[i], url: e.target.value }; set("attachments", a); }} placeholder="https://drive.google.com/..." />
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive shrink-0" onClick={() => set("attachments", attachments.filter((_, j) => j !== i))}><Trash2 className="w-3 h-3" /></Button>
              </div>
            ))}
          </div>
          <div className="space-y-1.5"><Label className="text-xs">Notes</Label><Textarea value={form.notes || ""} onChange={(e) => set("notes", e.target.value)} rows={3} className="resize-none text-sm" placeholder="Details, observations..." /></div>
        </div>
        <DialogFooter><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={() => onSave(form)} disabled={!form.name && !form.business}><Save className="w-3.5 h-3.5" />{lead ? "Update" : "Add Lead"}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Reusable Script Card ────────────────────────────────────────────

function ScriptCard({ title, content, scriptKey, pinned, onPin, onUnpin, onRefresh, isRefreshing }: {
  title: string; content: string; scriptKey?: string;
  pinned?: PinnedPitch | null; onPin?: (key: string, content: string) => void;
  onUnpin?: (id: string) => void; onRefresh?: (key: string) => void; isRefreshing?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const displayContent = pinned?.customContent || content;
  const handleCopy = () => { navigator.clipboard.writeText(displayContent); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <Card className={`overflow-visible border-border/50 ${pinned ? "ring-1 ring-primary/30" : ""}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2 gap-2">
          <span className="text-xs font-semibold flex items-center gap-1.5">
            {pinned && <Pin className="w-3 h-3 text-primary" />}{title}
          </span>
          <div className="flex items-center gap-1">
            {scriptKey && onRefresh && (
              <Button variant="ghost" size="sm" className="text-[10px] h-6 px-1.5" onClick={() => onRefresh(scriptKey)} disabled={isRefreshing} title="Get AI variation">
                <RefreshCw className={`w-3 h-3 ${isRefreshing ? "animate-spin" : ""}`} />
              </Button>
            )}
            {scriptKey && !pinned && onPin && (
              <Button variant="ghost" size="sm" className="text-[10px] h-6 px-1.5" onClick={() => onPin(scriptKey, displayContent)} title="Pin this pitch">
                <Pin className="w-3 h-3" />
              </Button>
            )}
            {pinned && onUnpin && (
              <Button variant="ghost" size="sm" className="text-[10px] h-6 px-1.5 text-primary" onClick={() => onUnpin(pinned.id)} title="Unpin">
                <PinOff className="w-3 h-3" />
              </Button>
            )}
            <Button variant="outline" size="sm" className="text-[10px] h-6" onClick={handleCopy}>
              {copied ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
            </Button>
          </div>
        </div>
        <pre className="text-xs text-muted-foreground whitespace-pre-wrap bg-muted/30 rounded-md p-3 leading-relaxed">{displayContent}</pre>
      </CardContent>
    </Card>
  );
}

// ─── Playbooks Tab ──────────────────────────────────────────────────

function PlaybooksTab() {
  const { data: partners = [], refetch: refetchPartners } = useQuery<ReferralPartner[]>({ queryKey: ["/api/referral-partners"] });
  const { data: checks = [], refetch: refetchChecks } = useQuery<PlaybookCheckItem[]>({ queryKey: ["/api/playbook-checks"] });
  const { data: pinnedPitches = [], refetch: refetchPins } = useQuery<PinnedPitch[]>({ queryKey: ["/api/pinned-pitches"] });
  const [showPartnerForm, setShowPartnerForm] = useState(false);
  const [partnerForm, setPartnerForm] = useState({ name: "", niche: "", clientTypes: "", referralTerms: "", introMethod: "", nextCheckIn: "" });
  const [refreshing, setRefreshing] = useState<string | null>(null);
  const { toast } = useToast();

  const getPinned = (key: string) => pinnedPitches.find(p => p.scriptKey === key) || null;

  const pinMutation = useMutation({
    mutationFn: async ({ scriptKey, customContent }: { scriptKey: string; customContent: string }) => {
      const r = await apiRequest("POST", "/api/pinned-pitches", { scriptKey, customContent }); return r.json();
    },
    onSuccess: () => { refetchPins(); toast({ title: "Pitch pinned" }); },
  });

  const unpinMutation = useMutation({
    mutationFn: async (id: string) => { await apiRequest("DELETE", `/api/pinned-pitches/${id}`); },
    onSuccess: () => { refetchPins(); toast({ title: "Pitch unpinned" }); },
  });

  const handleRefresh = async (scriptKey: string) => {
    setRefreshing(scriptKey);
    try {
      const r = await apiRequest("POST", "/api/ai-ops/chat", {
        message: `Generate a fresh variation of the "${scriptKey}" sales pitch for a merchant services company. Keep the same intent and key selling points (zero-fee processing, statement review, no obligation) but change the wording to sound natural and different. Return ONLY the pitch text, nothing else.`,
      });
      const data = await r.json();
      if (data.reply) {
        await apiRequest("POST", "/api/pinned-pitches", { scriptKey, customContent: data.reply });
        refetchPins();
        toast({ title: "Fresh pitch generated & pinned" });
      }
    } catch { toast({ title: "Failed to refresh", variant: "destructive" }); }
    setRefreshing(null);
  };

  const createPartnerMutation = useMutation({
    mutationFn: async (data: any) => { const r = await apiRequest("POST", "/api/referral-partners", data); return r.json(); },
    onSuccess: () => { refetchPartners(); toast({ title: "Partner added" }); setShowPartnerForm(false); setPartnerForm({ name: "", niche: "", clientTypes: "", referralTerms: "", introMethod: "", nextCheckIn: "" }); },
  });
  const deletePartnerMutation = useMutation({
    mutationFn: async (id: string) => { await apiRequest("DELETE", `/api/referral-partners/${id}`); },
    onSuccess: () => { refetchPartners(); },
  });
  const toggleCheckMutation = useMutation({
    mutationFn: async ({ id, channel, label, completed }: { id: string; channel: string; label: string; completed: boolean }) => {
      const existing = checks.find((c) => c.id === id);
      if (existing) { await apiRequest("PATCH", `/api/playbook-checks/${id}`, { completed }); }
      else { await apiRequest("POST", "/api/playbook-checks", { id, channel, label, completed }); }
    },
    onSuccess: () => { refetchChecks(); },
  });

  const isChecked = (id: string) => checks.find((c) => c.id === id)?.completed || false;

  const referralChecklist = [
    { id: "ref-1", label: "Identify 20 referral partner targets (local + niche)" },
    { id: "ref-2", label: "Draft referral agreement with commission terms" },
    { id: "ref-3", label: "Create intro email template for partners" },
    { id: "ref-4", label: "Set up partner tracking field in CRM" },
    { id: "ref-5", label: "Schedule first 5 partner outreach meetings" },
  ];

  const leadMagnetResources = [
    { id: "lm-1", label: "Top 10 Things to Check on Your Merchant Statement" },
    { id: "lm-2", label: "Cash Discount Program Explained: Is It Right for Your Business?" },
    { id: "lm-3", label: "Payment Security Checklist for Small Businesses" },
    { id: "lm-4", label: "Industry-Specific Rate Comparison Guide" },
  ];

  return (
    <div className="space-y-4">
      <div><h2 className="text-lg font-bold flex items-center gap-2"><BookOpen className="w-5 h-5 text-primary" />Channel Playbooks</h2><p className="text-xs text-muted-foreground mt-1">Scripts, workflows, and checklists for each prospecting channel</p></div>

      <Accordion type="multiple" defaultValue={["referral"]} className="space-y-2">
        {/* Referral Partners */}
        <AccordionItem value="referral" className="border rounded-lg px-4">
          <AccordionTrigger className="text-sm font-semibold py-3"><span className="flex items-center gap-2"><span className="w-6 h-6 rounded bg-emerald-400/10 flex items-center justify-center text-emerald-400 text-xs font-bold">R</span>Referral Partner Program</span></AccordionTrigger>
          <AccordionContent className="space-y-3 pb-4">
            <ScriptCard title="Partner Outreach Script" content={PLAYBOOK_SCRIPTS.referral.outreach} scriptKey="referral.outreach" pinned={getPinned("referral.outreach")} onPin={(k, c) => pinMutation.mutate({ scriptKey: k, customContent: c })} onUnpin={(id) => unpinMutation.mutate(id)} onRefresh={handleRefresh} isRefreshing={refreshing === "referral.outreach"} />
            <div>
              <p className="text-xs font-semibold mb-2">Partner Onboarding Checklist</p>
              <div className="space-y-1.5">{referralChecklist.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <Checkbox checked={isChecked(item.id)} onCheckedChange={(v) => toggleCheckMutation.mutate({ id: item.id, channel: "referral", label: item.label, completed: !!v })} />
                  <span className={`text-xs ${isChecked(item.id) ? "line-through text-muted-foreground" : ""}`}>{item.label}</span>
                </div>
              ))}</div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold">Active Partners ({partners.length})</p>
                <Button variant="outline" size="sm" className="h-6 text-[10px]" onClick={() => setShowPartnerForm(true)}><Plus className="w-3 h-3" />Add Partner</Button>
              </div>
              {partners.length === 0 ? <p className="text-xs text-muted-foreground py-2">No partners yet. Start by adding your first referral partner.</p> : (
                <div className="space-y-1.5">{partners.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-2 rounded-md bg-muted/30 border border-border/30">
                    <div><p className="text-xs font-medium">{p.name}</p><p className="text-[10px] text-muted-foreground">{p.niche}{p.referralTerms ? ` — ${p.referralTerms}` : ""}{p.nextCheckIn ? ` — Next check-in: ${p.nextCheckIn}` : ""}</p></div>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => deletePartnerMutation.mutate(p.id)}><Trash2 className="w-3 h-3" /></Button>
                  </div>
                ))}</div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Networking */}
        <AccordionItem value="networking" className="border rounded-lg px-4">
          <AccordionTrigger className="text-sm font-semibold py-3"><span className="flex items-center gap-2"><span className="w-6 h-6 rounded bg-blue-400/10 flex items-center justify-center text-blue-400 text-xs font-bold">N</span>Networking & Community Presence</span></AccordionTrigger>
          <AccordionContent className="space-y-3 pb-4">
            <ScriptCard title="30-Second Elevator Pitch" content={PLAYBOOK_SCRIPTS.networking.elevator} scriptKey="networking.elevator" pinned={getPinned("networking.elevator")} onPin={(k, c) => pinMutation.mutate({ scriptKey: k, customContent: c })} onUnpin={(id) => unpinMutation.mutate(id)} onRefresh={handleRefresh} isRefreshing={refreshing === "networking.elevator"} />
            <Card className="overflow-visible border-border/50 bg-blue-400/5">
              <CardContent className="p-3">
                <p className="text-xs font-semibold mb-1">Event Reminders</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>- Always bring a "Statement Review Offer" card and QR code to lead magnet</li>
                  <li>- Focus on relationship + credibility, not rate pitching</li>
                  <li>- Target: Chamber of Commerce, BNI, industry events</li>
                  <li>- Weekly cadence: 1 networking event/week</li>
                </ul>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Social Outreach */}
        <AccordionItem value="social" className="border rounded-lg px-4">
          <AccordionTrigger className="text-sm font-semibold py-3"><span className="flex items-center gap-2"><span className="w-6 h-6 rounded bg-pink-400/10 flex items-center justify-center text-pink-400 text-xs font-bold">S</span>Social Media Outreach</span></AccordionTrigger>
          <AccordionContent className="space-y-3 pb-4">
            <ScriptCard title="DM Script (After Engagement)" content={PLAYBOOK_SCRIPTS.social.dm} scriptKey="social.dm" pinned={getPinned("social.dm")} onPin={(k, c) => pinMutation.mutate({ scriptKey: k, customContent: c })} onUnpin={(id) => unpinMutation.mutate(id)} onRefresh={handleRefresh} isRefreshing={refreshing === "social.dm"} />
            <Card className="overflow-visible border-border/50 bg-pink-400/5">
              <CardContent className="p-3">
                <p className="text-xs font-semibold mb-1">Content That Converts</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>- Educational posts about hidden fees and cash discount programs</li>
                  <li>- Payment security tips and updates</li>
                  <li>- Fee comparisons and success stories (with permission)</li>
                  <li>- Cadence: 3 posts/week + 10 targeted comments/day</li>
                </ul>
                <p className="text-xs font-semibold mt-2 mb-1">Platforms</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>- LinkedIn: insights + industry group engagement</li>
                  <li>- Instagram: visuals, fee comparisons, success stories</li>
                  <li>- Facebook: local business groups (help first, pitch later)</li>
                </ul>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Direct Prospecting */}
        <AccordionItem value="direct" className="border rounded-lg px-4">
          <AccordionTrigger className="text-sm font-semibold py-3"><span className="flex items-center gap-2"><span className="w-6 h-6 rounded bg-orange-400/10 flex items-center justify-center text-orange-400 text-xs font-bold">D</span>Direct Prospecting</span></AccordionTrigger>
          <AccordionContent className="space-y-3 pb-4">
            <ScriptCard title="Cold Call Script (30 sec)" content={PLAYBOOK_SCRIPTS.direct.coldCall} scriptKey="direct.coldCall" pinned={getPinned("direct.coldCall")} onPin={(k, c) => pinMutation.mutate({ scriptKey: k, customContent: c })} onUnpin={(id) => unpinMutation.mutate(id)} onRefresh={handleRefresh} isRefreshing={refreshing === "direct.coldCall"} />
            <ScriptCard title="Walk-In Opener" content={PLAYBOOK_SCRIPTS.direct.walkIn} scriptKey="direct.walkIn" pinned={getPinned("direct.walkIn")} onPin={(k, c) => pinMutation.mutate({ scriptKey: k, customContent: c })} onUnpin={(id) => unpinMutation.mutate(id)} onRefresh={handleRefresh} isRefreshing={refreshing === "direct.walkIn"} />
            <ScriptCard title="Personalized Email Template" content={PLAYBOOK_SCRIPTS.direct.email} scriptKey="direct.email" pinned={getPinned("direct.email")} onPin={(k, c) => pinMutation.mutate({ scriptKey: k, customContent: c })} onUnpin={(id) => unpinMutation.mutate(id)} onRefresh={handleRefresh} isRefreshing={refreshing === "direct.email"} />
            <Card className="overflow-visible border-border/50 bg-orange-400/5">
              <CardContent className="p-3">
                <p className="text-xs font-semibold mb-1">Direct Prospecting Tips</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>- Research first: estimate volume, identify pain points before contact</li>
                  <li>- Walk-ins: go during off-peak hours with a one-page value prop</li>
                  <li>- Personalize emails with specific observations about their business</li>
                  <li>- Target: 100 businesses over weeks 7-12</li>
                </ul>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Lead Magnets */}
        <AccordionItem value="lead-magnet" className="border rounded-lg px-4">
          <AccordionTrigger className="text-sm font-semibold py-3"><span className="flex items-center gap-2"><span className="w-6 h-6 rounded bg-purple-400/10 flex items-center justify-center text-purple-400 text-xs font-bold">L</span>Educational Lead Magnets</span></AccordionTrigger>
          <AccordionContent className="space-y-3 pb-4">
            <Card className="overflow-visible border-destructive/30 bg-destructive/5">
              <CardContent className="p-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-destructive shrink-0" />
                <p className="text-xs font-medium text-destructive">Critical Rule: Follow up within 24 hours of every download</p>
              </CardContent>
            </Card>
            <ScriptCard title="24-Hour Follow-Up Template" content={PLAYBOOK_SCRIPTS.leadMagnet.followUp24hr} scriptKey="leadMagnet.followUp24hr" pinned={getPinned("leadMagnet.followUp24hr")} onPin={(k, c) => pinMutation.mutate({ scriptKey: k, customContent: c })} onUnpin={(id) => unpinMutation.mutate(id)} onRefresh={handleRefresh} isRefreshing={refreshing === "leadMagnet.followUp24hr"} />
            <div>
              <p className="text-xs font-semibold mb-2">High-Converting Resources to Create</p>
              <div className="space-y-1.5">{leadMagnetResources.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <Checkbox checked={isChecked(item.id)} onCheckedChange={(v) => toggleCheckMutation.mutate({ id: item.id, channel: "lead-magnet", label: item.label, completed: !!v })} />
                  <span className={`text-xs ${isChecked(item.id) ? "line-through text-muted-foreground" : ""}`}>{item.label}</span>
                </div>
              ))}</div>
            </div>
            <Card className="overflow-visible border-border/50 bg-purple-400/5">
              <CardContent className="p-3">
                <p className="text-xs font-semibold mb-1">Distribution Channels</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>- Social ads targeted to local business owners</li>
                  <li>- Email newsletter to existing contacts</li>
                  <li>- Landing pages with opt-in forms</li>
                  <li>- QR codes on printed materials and leave-behinds</li>
                </ul>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Partner Form Dialog */}
      <Dialog open={showPartnerForm} onOpenChange={(o) => !o && setShowPartnerForm(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Add Referral Partner</DialogTitle><DialogDescription>Track a referral partner relationship</DialogDescription></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label className="text-xs">Partner Name *</Label><Input value={partnerForm.name} onChange={(e) => setPartnerForm(p => ({ ...p, name: e.target.value }))} placeholder="Jane Smith, CPA" /></div>
              <div className="space-y-1.5"><Label className="text-xs">Niche/Industry</Label><Input value={partnerForm.niche} onChange={(e) => setPartnerForm(p => ({ ...p, niche: e.target.value }))} placeholder="Accounting, POS reseller..." /></div>
            </div>
            <div className="space-y-1.5"><Label className="text-xs">Client Types They Serve</Label><Input value={partnerForm.clientTypes} onChange={(e) => setPartnerForm(p => ({ ...p, clientTypes: e.target.value }))} placeholder="Restaurants, retail shops..." /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label className="text-xs">Referral Terms</Label><Input value={partnerForm.referralTerms} onChange={(e) => setPartnerForm(p => ({ ...p, referralTerms: e.target.value }))} placeholder="$100 flat or 10% residual" /></div>
              <div className="space-y-1.5"><Label className="text-xs">Intro Method</Label><Input value={partnerForm.introMethod} onChange={(e) => setPartnerForm(p => ({ ...p, introMethod: e.target.value }))} placeholder="Email intro, shared form..." /></div>
            </div>
            <div className="space-y-1.5"><Label className="text-xs">Next Check-In Date</Label><Input type="date" value={partnerForm.nextCheckIn} onChange={(e) => setPartnerForm(p => ({ ...p, nextCheckIn: e.target.value }))} /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setShowPartnerForm(false)}>Cancel</Button><Button onClick={() => createPartnerMutation.mutate(partnerForm)} disabled={!partnerForm.name}><Save className="w-3.5 h-3.5" />Add Partner</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Scorecard Tab ──────────────────────────────────────────────────

function ScorecardTab() {
  const { data: scoreData } = useQuery<{ scorecard: ChannelScore[]; overall: { totalLeads: number; activeLeads: number; totalWon: number; totalLost: number } }>({ queryKey: ["/api/metrics/scorecard"] });
  const { data: kpis = [], refetch: refetchKPIs } = useQuery<WeeklyKPI[]>({ queryKey: ["/api/kpis"] });
  const [showKPIForm, setShowKPIForm] = useState(false);
  const [kpiForm, setKpiForm] = useState<Partial<WeeklyKPI>>({ weekStart: today(), outboundCalls: 0, outboundEmails: 0, outboundDMs: 0, walkIns: 0, contactsMade: 0, appointmentsSet: 0, statementsRequested: 0, statementsReceived: 0, proposalsSent: 0, dealsWon: 0, volumeWon: 0, notes: "" });
  const { toast } = useToast();

  const createKPIMutation = useMutation({
    mutationFn: async (data: Partial<WeeklyKPI>) => { const r = await apiRequest("POST", "/api/kpis", data); return r.json(); },
    onSuccess: () => { refetchKPIs(); toast({ title: "KPI logged" }); setShowKPIForm(false); },
  });
  const deleteKPIMutation = useMutation({
    mutationFn: async (id: string) => { await apiRequest("DELETE", `/api/kpis/${id}`); },
    onSuccess: () => { refetchKPIs(); },
  });

  const rateColor = (rate: number) => rate >= 50 ? "text-emerald-400" : rate >= 25 ? "text-yellow-400" : "text-red-400";

  return (
    <div className="space-y-6">
      <div><h2 className="text-lg font-bold flex items-center gap-2"><Target className="w-5 h-5 text-primary" />Channel Scorecard</h2><p className="text-xs text-muted-foreground mt-1">Full pipeline metrics by lead source channel</p></div>

      {scoreData?.overall && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="text-center py-3 rounded-lg bg-muted/30 border border-border/30"><div className="text-lg font-bold">{scoreData.overall.totalLeads}</div><div className="text-[10px] text-muted-foreground">Total Leads</div></div>
          <div className="text-center py-3 rounded-lg bg-muted/30 border border-border/30"><div className="text-lg font-bold text-blue-400">{scoreData.overall.activeLeads}</div><div className="text-[10px] text-muted-foreground">Active Pipeline</div></div>
          <div className="text-center py-3 rounded-lg bg-muted/30 border border-border/30"><div className="text-lg font-bold text-emerald-400">{scoreData.overall.totalWon}</div><div className="text-[10px] text-muted-foreground">Won</div></div>
          <div className="text-center py-3 rounded-lg bg-muted/30 border border-border/30"><div className="text-lg font-bold text-red-400">{scoreData.overall.totalLost}</div><div className="text-[10px] text-muted-foreground">Lost</div></div>
        </div>
      )}

      {scoreData?.scorecard && (
        <Card className="overflow-visible border-border/50">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[10px]">Channel</TableHead>
                  <TableHead className="text-[10px] text-center">Total</TableHead>
                  <TableHead className="text-[10px] text-center">Contacted</TableHead>
                  <TableHead className="text-[10px] text-center">Contact %</TableHead>
                  <TableHead className="text-[10px] text-center">Qualified</TableHead>
                  <TableHead className="text-[10px] text-center">Appt %</TableHead>
                  <TableHead className="text-[10px] text-center">Stmt Recv</TableHead>
                  <TableHead className="text-[10px] text-center">Stmt %</TableHead>
                  <TableHead className="text-[10px] text-center">Won</TableHead>
                  <TableHead className="text-[10px] text-center">Close %</TableHead>
                  <TableHead className="text-[10px] text-center">Avg Days</TableHead>
                  <TableHead className="text-[10px] text-center">Avg Vol</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scoreData.scorecard.map((ch) => (
                  <TableRow key={ch.source}>
                    <TableCell className={`text-xs font-semibold ${SOURCE_CONFIG[ch.source as LeadSource]?.color || ""}`}>{SOURCE_CONFIG[ch.source as LeadSource]?.label || ch.source}</TableCell>
                    <TableCell className="text-xs text-center font-medium">{ch.total}</TableCell>
                    <TableCell className="text-xs text-center">{ch.contacted}</TableCell>
                    <TableCell className={`text-xs text-center font-semibold ${rateColor(ch.contactRate)}`}>{ch.contactRate}%</TableCell>
                    <TableCell className="text-xs text-center">{ch.qualified}</TableCell>
                    <TableCell className={`text-xs text-center font-semibold ${rateColor(ch.appointmentRate)}`}>{ch.appointmentRate}%</TableCell>
                    <TableCell className="text-xs text-center">{ch.stmtReceived}</TableCell>
                    <TableCell className={`text-xs text-center font-semibold ${rateColor(ch.stmtReceivedRate)}`}>{ch.stmtReceivedRate}%</TableCell>
                    <TableCell className="text-xs text-center font-semibold text-emerald-400">{ch.won}</TableCell>
                    <TableCell className={`text-xs text-center font-semibold ${rateColor(ch.closeRate)}`}>{ch.closeRate}%</TableCell>
                    <TableCell className="text-xs text-center">{ch.avgTimeToClose}d</TableCell>
                    <TableCell className="text-xs text-center">${ch.avgVolumeWon.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {/* Weekly KPI Logger */}
      <div className="flex items-center justify-between">
        <div><h3 className="text-sm font-bold">Weekly KPI Log</h3><p className="text-[10px] text-muted-foreground">Track outreach activity week by week</p></div>
        <Button size="sm" onClick={() => { setKpiForm({ weekStart: today(), outboundCalls: 0, outboundEmails: 0, outboundDMs: 0, walkIns: 0, contactsMade: 0, appointmentsSet: 0, statementsRequested: 0, statementsReceived: 0, proposalsSent: 0, dealsWon: 0, volumeWon: 0, notes: "" }); setShowKPIForm(true); }}><Plus className="w-3.5 h-3.5" />Log This Week</Button>
      </div>

      {kpis.length === 0 ? (
        <Card className="overflow-visible border-dashed"><CardContent className="p-6 text-center"><BarChart3 className="w-8 h-8 text-muted-foreground/50 mx-auto mb-3" /><p className="text-sm text-muted-foreground">No KPIs logged yet. Start tracking your weekly activity.</p></CardContent></Card>
      ) : (
        <Card className="overflow-visible border-border/50"><div className="overflow-x-auto"><Table><TableHeader><TableRow>
          <TableHead className="text-[10px]">Week</TableHead>
          <TableHead className="text-[10px] text-center">Calls</TableHead>
          <TableHead className="text-[10px] text-center">Emails</TableHead>
          <TableHead className="text-[10px] text-center">DMs</TableHead>
          <TableHead className="text-[10px] text-center">Walk-Ins</TableHead>
          <TableHead className="text-[10px] text-center">Contacts</TableHead>
          <TableHead className="text-[10px] text-center">Appts</TableHead>
          <TableHead className="text-[10px] text-center">Stmts</TableHead>
          <TableHead className="text-[10px] text-center">Won</TableHead>
          <TableHead className="text-[10px] text-center">Vol $</TableHead>
          <TableHead className="text-[10px] w-10"></TableHead>
        </TableRow></TableHeader><TableBody>
          {[...kpis].sort((a, b) => b.weekStart.localeCompare(a.weekStart)).map((k) => (
            <TableRow key={k.id}>
              <TableCell className="text-xs font-medium">{k.weekStart}</TableCell>
              <TableCell className="text-xs text-center">{k.outboundCalls}</TableCell>
              <TableCell className="text-xs text-center">{k.outboundEmails}</TableCell>
              <TableCell className="text-xs text-center">{k.outboundDMs}</TableCell>
              <TableCell className="text-xs text-center">{k.walkIns}</TableCell>
              <TableCell className="text-xs text-center">{k.contactsMade}</TableCell>
              <TableCell className="text-xs text-center">{k.appointmentsSet}</TableCell>
              <TableCell className="text-xs text-center">{k.statementsReceived}</TableCell>
              <TableCell className="text-xs text-center font-semibold text-emerald-400">{k.dealsWon}</TableCell>
              <TableCell className="text-xs text-center">${k.volumeWon.toLocaleString()}</TableCell>
              <TableCell><Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => deleteKPIMutation.mutate(k.id)}><Trash2 className="w-3 h-3" /></Button></TableCell>
            </TableRow>
          ))}
        </TableBody></Table></div></Card>
      )}

      <Dialog open={showKPIForm} onOpenChange={(o) => !o && setShowKPIForm(false)}>
        <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Log Weekly KPIs</DialogTitle><DialogDescription>Track your outreach and conversion metrics</DialogDescription></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5"><Label className="text-xs">Week Starting</Label><Input type="date" value={kpiForm.weekStart || today()} onChange={(e) => setKpiForm(p => ({ ...p, weekStart: e.target.value }))} /></div>
            <p className="text-xs font-semibold text-muted-foreground">Outreach Activity</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label className="text-xs">Outbound Calls</Label><Input type="number" value={kpiForm.outboundCalls || ""} onChange={(e) => setKpiForm(p => ({ ...p, outboundCalls: Number(e.target.value) }))} /></div>
              <div className="space-y-1.5"><Label className="text-xs">Outbound Emails</Label><Input type="number" value={kpiForm.outboundEmails || ""} onChange={(e) => setKpiForm(p => ({ ...p, outboundEmails: Number(e.target.value) }))} /></div>
              <div className="space-y-1.5"><Label className="text-xs">Social DMs</Label><Input type="number" value={kpiForm.outboundDMs || ""} onChange={(e) => setKpiForm(p => ({ ...p, outboundDMs: Number(e.target.value) }))} /></div>
              <div className="space-y-1.5"><Label className="text-xs">Walk-Ins</Label><Input type="number" value={kpiForm.walkIns || ""} onChange={(e) => setKpiForm(p => ({ ...p, walkIns: Number(e.target.value) }))} /></div>
            </div>
            <p className="text-xs font-semibold text-muted-foreground">Conversions</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label className="text-xs">Contacts Made</Label><Input type="number" value={kpiForm.contactsMade || ""} onChange={(e) => setKpiForm(p => ({ ...p, contactsMade: Number(e.target.value) }))} /></div>
              <div className="space-y-1.5"><Label className="text-xs">Appointments Set</Label><Input type="number" value={kpiForm.appointmentsSet || ""} onChange={(e) => setKpiForm(p => ({ ...p, appointmentsSet: Number(e.target.value) }))} /></div>
              <div className="space-y-1.5"><Label className="text-xs">Stmts Requested</Label><Input type="number" value={kpiForm.statementsRequested || ""} onChange={(e) => setKpiForm(p => ({ ...p, statementsRequested: Number(e.target.value) }))} /></div>
              <div className="space-y-1.5"><Label className="text-xs">Stmts Received</Label><Input type="number" value={kpiForm.statementsReceived || ""} onChange={(e) => setKpiForm(p => ({ ...p, statementsReceived: Number(e.target.value) }))} /></div>
              <div className="space-y-1.5"><Label className="text-xs">Proposals Sent</Label><Input type="number" value={kpiForm.proposalsSent || ""} onChange={(e) => setKpiForm(p => ({ ...p, proposalsSent: Number(e.target.value) }))} /></div>
              <div className="space-y-1.5"><Label className="text-xs">Deals Won</Label><Input type="number" value={kpiForm.dealsWon || ""} onChange={(e) => setKpiForm(p => ({ ...p, dealsWon: Number(e.target.value) }))} /></div>
            </div>
            <div className="space-y-1.5"><Label className="text-xs">Volume Won ($)</Label><Input type="number" value={kpiForm.volumeWon || ""} onChange={(e) => setKpiForm(p => ({ ...p, volumeWon: Number(e.target.value) }))} placeholder="Total monthly processing volume from wins" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Notes</Label><Input value={kpiForm.notes || ""} onChange={(e) => setKpiForm(p => ({ ...p, notes: e.target.value }))} placeholder="What worked this week..." /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setShowKPIForm(false)}>Cancel</Button><Button onClick={() => createKPIMutation.mutate(kpiForm)}><Save className="w-3.5 h-3.5" />Log KPIs</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── 90-Day Plan Tab ────────────────────────────────────────────────

function PlanTab() {
  const { data: items = [], refetch } = useQuery<PlanItem[]>({ queryKey: ["/api/plan-items"] });
  const [showAddForm, setShowAddForm] = useState(false);
  const [addPhase, setAddPhase] = useState(1);
  const [addTitle, setAddTitle] = useState("");
  const [addDesc, setAddDesc] = useState("");
  const { toast } = useToast();

  const [startDate, setStartDate] = useState(() => {
    try { return localStorage.getItem("plan-start-date") || ""; } catch { return ""; }
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => { await apiRequest("PATCH", `/api/plan-items/${id}`, { completed }); },
    onSuccess: () => { refetch(); },
  });
  const addMutation = useMutation({
    mutationFn: async (data: any) => { const r = await apiRequest("POST", "/api/plan-items", data); return r.json(); },
    onSuccess: () => { refetch(); toast({ title: "Item added" }); setShowAddForm(false); setAddTitle(""); setAddDesc(""); },
  });

  const totalCompleted = items.filter((i) => i.completed).length;
  const progress = items.length > 0 ? Math.round((totalCompleted / items.length) * 100) : 0;

  const currentWeek = startDate ? Math.max(1, Math.ceil((Date.now() - new Date(startDate).getTime()) / (7 * 86400000))) : null;
  const currentPhase = currentWeek ? (currentWeek <= 2 ? 1 : currentWeek <= 6 ? 2 : 3) : null;

  const handleSetStart = (date: string) => {
    setStartDate(date);
    try { localStorage.setItem("plan-start-date", date); } catch {}
  };

  const phases = [
    { num: 1, range: "1-2", title: "Foundation", color: "blue", borderColor: "border-l-blue-400" },
    { num: 2, range: "3-6", title: "Relationship Building", color: "amber", borderColor: "border-l-amber-400" },
    { num: 3, range: "7-12", title: "Active Prospecting", color: "emerald", borderColor: "border-l-emerald-400" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div><h2 className="text-lg font-bold flex items-center gap-2"><Calendar className="w-5 h-5 text-primary" />90-Day Execution Plan</h2><p className="text-xs text-muted-foreground mt-1">From the sales playbook — operationalized and trackable</p></div>
        <div className="flex items-center gap-2 shrink-0">
          <Label className="text-[10px] text-muted-foreground whitespace-nowrap">Day 1:</Label>
          <Input type="date" className="h-8 w-36 text-xs" value={startDate} onChange={(e) => handleSetStart(e.target.value)} />
        </div>
      </div>

      <Card className="overflow-visible border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold">Overall Progress</span>
            <span className="text-xs text-muted-foreground">{totalCompleted} / {items.length} ({progress}%)</span>
          </div>
          <Progress value={progress} className="h-2.5" />
          {currentWeek && <p className="text-[10px] text-primary mt-2">You're in Week {Math.min(currentWeek, 12)} — Phase {currentPhase}: {phases[(currentPhase || 1) - 1]?.title}</p>}
        </CardContent>
      </Card>

      {phases.map((phase) => {
        const phaseItems = items.filter((i) => i.phase === phase.num);
        const phaseCompleted = phaseItems.filter((i) => i.completed).length;
        const isActive = currentPhase === phase.num;
        return (
          <Card key={phase.num} className={`overflow-visible border-border/50 border-l-4 ${phase.borderColor} ${isActive ? "ring-1 ring-primary/20" : ""}`}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-sm font-semibold">Phase {phase.num}: {phase.title}</CardTitle>
                  <Badge variant="outline" className="text-[10px]">Weeks {phase.range}</Badge>
                  {isActive && <Badge className="text-[9px]">Current</Badge>}
                </div>
                <span className="text-xs text-muted-foreground">{phaseCompleted}/{phaseItems.length}</span>
              </div>
              <Progress value={phaseItems.length > 0 ? (phaseCompleted / phaseItems.length) * 100 : 0} className="h-1.5 mt-1" />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-1.5">
                {phaseItems.map((item) => (
                  <div key={item.id} className="flex items-start gap-2 py-1.5">
                    <Checkbox className="mt-0.5" checked={item.completed} onCheckedChange={(v) => toggleMutation.mutate({ id: item.id, completed: !!v })} />
                    <div>
                      <p className={`text-xs ${item.completed ? "line-through text-muted-foreground" : "font-medium"}`}>{item.title}</p>
                      {item.description && <p className="text-[10px] text-muted-foreground">{item.description}</p>}
                      {item.completed && item.completedAt && <p className="text-[9px] text-emerald-400 mt-0.5">Completed {new Date(item.completedAt).toLocaleDateString()}</p>}
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="ghost" size="sm" className="text-[10px] h-6 mt-2" onClick={() => { setAddPhase(phase.num); setShowAddForm(true); }}><Plus className="w-3 h-3" />Add custom item</Button>
            </CardContent>
          </Card>
        );
      })}

      <Dialog open={showAddForm} onOpenChange={(o) => !o && setShowAddForm(false)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Add Plan Item</DialogTitle><DialogDescription>Add a custom item to Phase {addPhase}</DialogDescription></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5"><Label className="text-xs">Title *</Label><Input value={addTitle} onChange={(e) => setAddTitle(e.target.value)} placeholder="What needs to be done" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Description</Label><Input value={addDesc} onChange={(e) => setAddDesc(e.target.value)} placeholder="Details or context" /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button><Button onClick={() => addMutation.mutate({ phase: addPhase, weekRange: phases[addPhase - 1].range, title: addTitle, description: addDesc })} disabled={!addTitle}><Save className="w-3.5 h-3.5" />Add</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Materials Tab ──────────────────────────────────────────────────

function MaterialsTab() {
  const { data: items = [], refetch } = useQuery<MaterialItem[]>({ queryKey: ["/api/materials"] });
  const [editingUrl, setEditingUrl] = useState<string | null>(null);
  const [urlValue, setUrlValue] = useState("");
  const { toast } = useToast();

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<MaterialItem>) => { const r = await apiRequest("PATCH", `/api/materials/${id}`, data); return r.json(); },
    onSuccess: () => { refetch(); },
  });

  const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    "not-started": { label: "Not Started", color: "text-muted-foreground", bg: "bg-muted/30" },
    "in-progress": { label: "In Progress", color: "text-yellow-400", bg: "bg-yellow-400/10" },
    completed: { label: "Completed", color: "text-emerald-400", bg: "bg-emerald-400/10" },
  };

  const categories = ["sales", "lead-gen", "partner", "tracking"];

  return (
    <div className="space-y-6">
      <div><h2 className="text-lg font-bold flex items-center gap-2"><ClipboardList className="w-5 h-5 text-primary" />Materials Checklist</h2><p className="text-xs text-muted-foreground mt-1">Track creation of all sales, lead gen, partner, and tracking assets</p></div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {categories.map((cat) => {
          const catItems = items.filter((i) => i.category === cat);
          const completed = catItems.filter((i) => i.status === "completed").length;
          const pct = catItems.length > 0 ? Math.round((completed / catItems.length) * 100) : 0;
          return (
            <Card key={cat} className="overflow-visible border-border/50">
              <CardContent className="p-3">
                <p className="text-[10px] font-semibold text-muted-foreground mb-1">{MATERIAL_CATEGORIES[cat]?.label || cat}</p>
                <div className="flex items-center justify-between mb-1"><span className="text-sm font-bold">{completed}/{catItems.length}</span><span className="text-[10px] text-muted-foreground">{pct}%</span></div>
                <Progress value={pct} className="h-1.5" />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {categories.map((cat) => {
        const catItems = items.filter((i) => i.category === cat);
        if (catItems.length === 0) return null;
        return (
          <Card key={cat} className="overflow-visible border-border/50">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">{MATERIAL_CATEGORIES[cat]?.label || cat}</CardTitle></CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {catItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 py-2 border-b border-border/30 last:border-0">
                    <Select value={item.status} onValueChange={(v) => { updateMutation.mutate({ id: item.id, status: v }); toast({ title: `Status: ${statusConfig[v]?.label}` }); }}>
                      <SelectTrigger className={`h-7 w-28 text-[10px] shrink-0 ${statusConfig[item.status]?.bg} ${statusConfig[item.status]?.color}`}><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="not-started">Not Started</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs font-medium ${item.status === "completed" ? "line-through text-muted-foreground" : ""}`}>{item.name}</p>
                      <p className="text-[10px] text-muted-foreground">{item.description}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {editingUrl === item.id ? (
                        <div className="flex items-center gap-1">
                          <Input className="h-7 w-40 text-[10px]" value={urlValue} onChange={(e) => setUrlValue(e.target.value)} placeholder="File URL..." />
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { updateMutation.mutate({ id: item.id, fileUrl: urlValue }); setEditingUrl(null); }}><Check className="w-3 h-3" /></Button>
                        </div>
                      ) : (
                        <>
                          {item.fileUrl ? (
                            <a href={item.fileUrl} target="_blank" rel="noopener noreferrer"><Button variant="ghost" size="icon" className="h-7 w-7 text-primary"><ExternalLink className="w-3 h-3" /></Button></a>
                          ) : null}
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditingUrl(item.id); setUrlValue(item.fileUrl || ""); }} title="Attach file URL"><Paperclip className="w-3 h-3" /></Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// ─── Clients Tab ─────────────────────────────────────────────────────

function ClientsTab() {
  const { data: clients = [], refetch } = useQuery<Client[]>({ queryKey: ["/api/clients"] });
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const createMutation = useMutation({ mutationFn: async (data: Partial<Client>) => { const res = await apiRequest("POST", "/api/clients", data); return res.json(); }, onSuccess: () => { refetch(); toast({ title: "Client added" }); setShowForm(false); setEditingClient(null); } });
  const updateMutation = useMutation({ mutationFn: async ({ id, ...data }: Partial<Client> & { id: string }) => { const res = await apiRequest("PATCH", `/api/clients/${id}`, data); return res.json(); }, onSuccess: () => { refetch(); toast({ title: "Client updated" }); setShowForm(false); setEditingClient(null); } });
  const deleteMutation = useMutation({ mutationFn: async (id: string) => { await apiRequest("DELETE", `/api/clients/${id}`); }, onSuccess: () => { refetch(); toast({ title: "Client removed" }); } });

  const filtered = useMemo(() => clients.filter((c) => !search || [c.name, c.business, c.email].some((f) => f.toLowerCase().includes(search.toLowerCase()))).sort((a, b) => a.business.localeCompare(b.business)), [clients, search]);
  const handleSave = (form: Partial<Client>) => { if (editingClient) updateMutation.mutate({ ...form, id: editingClient.id } as Client & { id: string }); else createMutation.mutate(form); };
  const WS: Record<string, { label: string; color: string }> = { "not-started": { label: "Not Started", color: "text-muted-foreground" }, "in-progress": { label: "In Progress", color: "text-yellow-400" }, live: { label: "Live", color: "text-emerald-400" }, "self-hosted": { label: "Self-Hosted", color: "text-blue-400" } };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div><h2 className="text-lg font-bold">Client Directory</h2><p className="text-xs text-muted-foreground">{clients.length} active merchants</p></div>
        <Button size="sm" onClick={() => { setEditingClient(null); setShowForm(true); }}><Plus className="w-3.5 h-3.5" />Add Client</Button>
      </div>
      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" /><Input placeholder="Search clients..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-sm" /></div>
      {filtered.length === 0 ? (
        <Card className="overflow-visible border-dashed"><CardContent className="p-8 text-center"><Building className="w-8 h-8 text-muted-foreground/50 mx-auto mb-3" /><p className="text-sm text-muted-foreground">{clients.length === 0 ? "No clients yet." : "No match."}</p></CardContent></Card>
      ) : (
        <div className="space-y-2">{filtered.map((client) => (
          <Card key={client.id} className="overflow-visible border-border/50"><CardContent className="p-3 sm:p-4">
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-semibold text-sm">{client.business || client.name}</span>
                  <Badge variant="outline" className={`text-[10px] ${PACKAGE_CONFIG[client.package].color}`}>{PACKAGE_CONFIG[client.package].label}</Badge>
                  {client.maintenance !== "none" && <Badge variant="outline" className="text-[10px] text-primary">{MAINTENANCE_CONFIG[client.maintenance].label} — {MAINTENANCE_CONFIG[client.maintenance].price}</Badge>}
                </div>
                {client.business && client.name && <p className="text-xs text-muted-foreground">{client.name}</p>}
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs text-muted-foreground">
                  {client.phone && <a href={`tel:${client.phone}`} className="flex items-center gap-1 hover:text-foreground"><Phone className="w-3 h-3" />{client.phone}</a>}
                  {client.email && <a href={`mailto:${client.email}`} className="flex items-center gap-1 hover:text-foreground"><Mail className="w-3 h-3" />{client.email}</a>}
                  <span className="flex items-center gap-1"><Globe className="w-3 h-3" />Website: <span className={WS[client.websiteStatus]?.color}>{WS[client.websiteStatus]?.label}</span></span>
                  {client.websiteUrl && <a href={client.websiteUrl.startsWith("http") ? client.websiteUrl : `https://${client.websiteUrl}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-foreground text-primary"><ExternalLink className="w-3 h-3" />{client.websiteUrl}</a>}
                  {client.monthlyVolume > 0 && <span><DollarSign className="w-3 h-3 inline" />${client.monthlyVolume.toLocaleString()}/mo</span>}
                </div>
                {client.notes && <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{client.notes}</p>}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditingClient(client); setShowForm(true); }}><Edit3 className="w-3.5 h-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteMutation.mutate(client.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
              </div>
            </div>
          </CardContent></Card>
        ))}</div>
      )}
      <ClientFormDialog open={showForm} onClose={() => { setShowForm(false); setEditingClient(null); }} onSave={handleSave} client={editingClient} />
    </div>
  );
}

function ClientFormDialog({ open, onClose, onSave, client }: { open: boolean; onClose: () => void; onSave: (form: Partial<Client>) => void; client: Client | null; }) {
  const [form, setForm] = useState<Partial<Client>>({});
  useEffect(() => { if (open) setForm(client || { name: "", business: "", phone: "", email: "", package: "terminal", maintenance: "none", websiteUrl: "", websiteStatus: "not-started", terminalId: "", monthlyVolume: 0, startDate: today(), notes: "" }); }, [open, client]);
  const set = (key: keyof Client, value: string | number) => setForm((p) => ({ ...p, [key]: value }));
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{client ? "Edit Client" : "Add New Client"}</DialogTitle><DialogDescription>Manage merchant details</DialogDescription></DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3"><div className="space-y-1.5"><Label className="text-xs">Contact Name</Label><Input value={form.name || ""} onChange={(e) => set("name", e.target.value)} /></div><div className="space-y-1.5"><Label className="text-xs">Business Name</Label><Input value={form.business || ""} onChange={(e) => set("business", e.target.value)} /></div></div>
          <div className="grid grid-cols-2 gap-3"><div className="space-y-1.5"><Label className="text-xs">Phone</Label><Input value={form.phone || ""} onChange={(e) => set("phone", e.target.value)} /></div><div className="space-y-1.5"><Label className="text-xs">Email</Label><Input value={form.email || ""} onChange={(e) => set("email", e.target.value)} /></div></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label className="text-xs">Package</Label><Select value={form.package || "terminal"} onValueChange={(v) => set("package", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="terminal">Terminal ($399)</SelectItem><SelectItem value="trial">30-Day Trial</SelectItem><SelectItem value="online">Online (Free)</SelectItem></SelectContent></Select></div>
            <div className="space-y-1.5"><Label className="text-xs">Maintenance</Label><Select value={form.maintenance || "none"} onValueChange={(v) => set("maintenance", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">None</SelectItem><SelectItem value="basic">Basic ($50/mo)</SelectItem><SelectItem value="pro">Pro ($199/mo)</SelectItem><SelectItem value="premium">Premium ($399/mo)</SelectItem></SelectContent></Select></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label className="text-xs">Website Status</Label><Select value={form.websiteStatus || "not-started"} onValueChange={(v) => set("websiteStatus", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="not-started">Not Started</SelectItem><SelectItem value="in-progress">In Progress</SelectItem><SelectItem value="live">Live</SelectItem><SelectItem value="self-hosted">Self-Hosted</SelectItem></SelectContent></Select></div>
            <div className="space-y-1.5"><Label className="text-xs">Website URL</Label><Input value={form.websiteUrl || ""} onChange={(e) => set("websiteUrl", e.target.value)} placeholder="example.com" /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5"><Label className="text-xs">Terminal ID</Label><Input value={form.terminalId || ""} onChange={(e) => set("terminalId", e.target.value)} /></div>
            <div className="space-y-1.5"><Label className="text-xs">Monthly Vol ($)</Label><Input type="number" value={form.monthlyVolume || ""} onChange={(e) => set("monthlyVolume", Number(e.target.value))} /></div>
            <div className="space-y-1.5"><Label className="text-xs">Start Date</Label><Input type="date" value={form.startDate || today()} onChange={(e) => set("startDate", e.target.value)} /></div>
          </div>
          <div className="space-y-1.5"><Label className="text-xs">Notes</Label><Textarea value={form.notes || ""} onChange={(e) => set("notes", e.target.value)} rows={3} className="resize-none text-sm" /></div>
        </div>
        <DialogFooter><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={() => onSave(form)} disabled={!form.name && !form.business}><Save className="w-3.5 h-3.5" />{client ? "Update" : "Add Client"}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Revenue Tab ─────────────────────────────────────────────────────

function RevenueTab() {
  const { data: entries = [], refetch } = useQuery<RevenueEntry[]>({ queryKey: ["/api/revenue"] });
  const { data: clients = [] } = useQuery<Client[]>({ queryKey: ["/api/clients"] });
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<RevenueEntry | null>(null);
  const { toast } = useToast();

  const createMutation = useMutation({ mutationFn: async (d: Partial<RevenueEntry>) => { const r = await apiRequest("POST", "/api/revenue", d); return r.json(); }, onSuccess: () => { refetch(); toast({ title: "Revenue recorded" }); setShowForm(false); setEditingEntry(null); } });
  const updateMutation = useMutation({ mutationFn: async ({ id, ...d }: Partial<RevenueEntry> & { id: string }) => { const r = await apiRequest("PATCH", `/api/revenue/${id}`, d); return r.json(); }, onSuccess: () => { refetch(); toast({ title: "Updated" }); setShowForm(false); setEditingEntry(null); } });
  const deleteMutation = useMutation({ mutationFn: async (id: string) => { await apiRequest("DELETE", `/api/revenue/${id}`); }, onSuccess: () => { refetch(); toast({ title: "Deleted" }); } });
  const handleSave = (form: Partial<RevenueEntry>) => { if (editingEntry) updateMutation.mutate({ ...form, id: editingEntry.id } as RevenueEntry & { id: string }); else createMutation.mutate(form); };

  const now = new Date();
  const thisMonth = entries.filter((r) => { const d = new Date(r.date); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); });
  const lastMonth = entries.filter((r) => { const d = new Date(r.date); const lm = new Date(now.getFullYear(), now.getMonth() - 1, 1); return d.getMonth() === lm.getMonth() && d.getFullYear() === lm.getFullYear(); });
  const thisMonthTotal = thisMonth.reduce((s, r) => s + r.amount, 0);
  const lastMonthTotal = lastMonth.reduce((s, r) => s + r.amount, 0);
  const mrrFromClients = clients.reduce((sum, c) => { const p: Record<MaintenancePlan, number> = { none: 0, basic: 50, pro: 199, premium: 399 }; return sum + p[c.maintenance]; }, 0);
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div><h2 className="text-lg font-bold">Revenue Tracker</h2><p className="text-xs text-muted-foreground">{entries.length} entries</p></div>
        <Button size="sm" onClick={() => { setEditingEntry(null); setShowForm(true); }}><Plus className="w-3.5 h-3.5" />Record Revenue</Button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="overflow-visible border-border/50"><CardContent className="p-4"><p className="text-xs text-muted-foreground mb-1">This Month</p><p className="text-xl font-extrabold text-primary">${thisMonthTotal.toLocaleString()}</p><p className="text-[10px] text-muted-foreground mt-1">{lastMonthTotal > 0 ? (thisMonthTotal >= lastMonthTotal ? <span className="text-emerald-400 flex items-center gap-0.5"><ArrowUpRight className="w-3 h-3" />vs last mo</span> : <span className="text-red-400 flex items-center gap-0.5"><ArrowDownRight className="w-3 h-3" />vs last mo</span>) : "No prior data"}</p></CardContent></Card>
        <Card className="overflow-visible border-border/50"><CardContent className="p-4"><p className="text-xs text-muted-foreground mb-1">One-Time</p><p className="text-xl font-extrabold">${thisMonth.filter((r) => !r.recurring).reduce((s, r) => s + r.amount, 0).toLocaleString()}</p></CardContent></Card>
        <Card className="overflow-visible border-border/50"><CardContent className="p-4"><p className="text-xs text-muted-foreground mb-1">Recurring</p><p className="text-xl font-extrabold text-chart-2">${thisMonth.filter((r) => r.recurring).reduce((s, r) => s + r.amount, 0).toLocaleString()}</p></CardContent></Card>
        <Card className="overflow-visible border-border/50"><CardContent className="p-4"><p className="text-xs text-muted-foreground mb-1">Expected MRR</p><p className="text-xl font-extrabold text-emerald-400">${mrrFromClients.toLocaleString()}</p></CardContent></Card>
      </div>
      {sorted.length === 0 ? (
        <Card className="overflow-visible border-dashed"><CardContent className="p-8 text-center"><DollarSign className="w-8 h-8 text-muted-foreground/50 mx-auto mb-3" /><p className="text-sm text-muted-foreground">No revenue yet.</p></CardContent></Card>
      ) : (
        <Card className="overflow-visible border-border/50"><div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead className="text-xs">Date</TableHead><TableHead className="text-xs">Type</TableHead><TableHead className="text-xs">Description</TableHead><TableHead className="text-xs text-right">Amount</TableHead><TableHead className="text-xs w-20"></TableHead></TableRow></TableHeader><TableBody>
          {sorted.map((e) => (<TableRow key={e.id}><TableCell className="text-xs">{e.date}</TableCell><TableCell className="text-xs"><div className="flex items-center gap-1.5">{e.recurring && <Badge variant="outline" className="text-[9px] text-chart-2 border-chart-2/20">Recurring</Badge>}<span>{REVENUE_TYPES[e.type]}</span></div></TableCell><TableCell className="text-xs text-muted-foreground">{e.description}</TableCell><TableCell className="text-xs text-right font-semibold text-primary">${e.amount.toLocaleString()}</TableCell><TableCell><div className="flex items-center gap-1 justify-end"><Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditingEntry(e); setShowForm(true); }}><Edit3 className="w-3 h-3" /></Button><Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteMutation.mutate(e.id)}><Trash2 className="w-3 h-3" /></Button></div></TableCell></TableRow>))}
        </TableBody></Table></div></Card>
      )}
      <RevenueFormDialog open={showForm} onClose={() => { setShowForm(false); setEditingEntry(null); }} onSave={handleSave} entry={editingEntry} clients={clients} />
    </div>
  );
}

function RevenueFormDialog({ open, onClose, onSave, entry, clients }: { open: boolean; onClose: () => void; onSave: (f: Partial<RevenueEntry>) => void; entry: RevenueEntry | null; clients: Client[]; }) {
  const [form, setForm] = useState<Partial<RevenueEntry>>({});
  useEffect(() => { if (open) setForm(entry || { date: today(), type: "terminal-sale", description: "", amount: 0, clientId: "", recurring: false }); }, [open, entry]);
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>{entry ? "Edit Entry" : "Record Revenue"}</DialogTitle><DialogDescription>Track income</DialogDescription></DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3"><div className="space-y-1.5"><Label className="text-xs">Date</Label><Input type="date" value={form.date || today()} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} /></div><div className="space-y-1.5"><Label className="text-xs">Amount ($)</Label><Input type="number" value={form.amount || ""} onChange={(e) => setForm((p) => ({ ...p, amount: Number(e.target.value) }))} /></div></div>
          <div className="space-y-1.5"><Label className="text-xs">Type</Label><Select value={form.type || "terminal-sale"} onValueChange={(v) => setForm((p) => ({ ...p, type: v as RevenueEntry["type"] }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Object.entries(REVENUE_TYPES).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent></Select></div>
          {clients.length > 0 && <div className="space-y-1.5"><Label className="text-xs">Client</Label><Select value={form.clientId || "none"} onValueChange={(v) => setForm((p) => ({ ...p, clientId: v === "none" ? "" : v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">None</SelectItem>{clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.business || c.name}</SelectItem>)}</SelectContent></Select></div>}
          <div className="space-y-1.5"><Label className="text-xs">Description</Label><Input value={form.description || ""} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} /></div>
          <div className="flex items-center gap-2"><Switch checked={form.recurring || false} onCheckedChange={(v) => setForm((p) => ({ ...p, recurring: v }))} /><Label className="text-xs">Recurring</Label></div>
        </div>
        <DialogFooter><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={() => onSave(form)} disabled={!form.amount}><Save className="w-3.5 h-3.5" />{entry ? "Update" : "Record"}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Tasks Tab ───────────────────────────────────────────────────────

function TasksTab() {
  const { data: tasks = [], refetch } = useQuery<Task[]>({ queryKey: ["/api/tasks"] });
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("pending");
  const { toast } = useToast();

  const createMutation = useMutation({ mutationFn: async (d: Partial<Task>) => { const r = await apiRequest("POST", "/api/tasks", d); return r.json(); }, onSuccess: () => { refetch(); toast({ title: "Task added" }); setShowForm(false); setEditingTask(null); } });
  const updateMutation = useMutation({ mutationFn: async ({ id, ...d }: Partial<Task> & { id: string }) => { const r = await apiRequest("PATCH", `/api/tasks/${id}`, d); return r.json(); }, onSuccess: () => { refetch(); } });
  const deleteMutation = useMutation({ mutationFn: async (id: string) => { await apiRequest("DELETE", `/api/tasks/${id}`); }, onSuccess: () => { refetch(); } });
  const handleSave = (form: Partial<Task>) => { if (editingTask) { updateMutation.mutate({ ...form, id: editingTask.id } as Task & { id: string }); setShowForm(false); setEditingTask(null); toast({ title: "Updated" }); } else createMutation.mutate(form); };

  const filtered = useMemo(() => tasks.filter((t) => filter === "all" || (filter === "pending" ? !t.completed : t.completed)).sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    const o: Record<string, number> = { high: 0, medium: 1, low: 2 };
    if (a.priority !== b.priority) return o[a.priority] - o[b.priority];
    return (a.dueDate || "9").localeCompare(b.dueDate || "9");
  }), [tasks, filter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div><h2 className="text-lg font-bold">Tasks & Follow-Ups</h2><p className="text-xs text-muted-foreground">{tasks.filter((t) => !t.completed).length} pending</p></div>
        <Button size="sm" onClick={() => { setEditingTask(null); setShowForm(true); }}><Plus className="w-3.5 h-3.5" />Add Task</Button>
      </div>
      <div className="flex gap-2">{(["pending", "all", "completed"] as const).map((f) => <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" className="text-xs" onClick={() => setFilter(f)}>{f === "pending" ? "Pending" : f === "all" ? "All" : "Completed"}</Button>)}</div>
      {filtered.length === 0 ? (
        <Card className="overflow-visible border-dashed"><CardContent className="p-8 text-center"><CheckCircle className="w-8 h-8 text-muted-foreground/50 mx-auto mb-3" /><p className="text-sm text-muted-foreground">No tasks match.</p></CardContent></Card>
      ) : (
        <div className="space-y-1.5">{filtered.map((task) => (
          <Card key={task.id} className={`overflow-visible border-border/50 ${task.completed ? "opacity-60" : ""}`}><CardContent className="p-3 flex items-center gap-3">
            <button onClick={() => updateMutation.mutate({ id: task.id, completed: !task.completed })} className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${task.completed ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/30 hover:border-primary"}`}>{task.completed && <Check className="w-3 h-3" />}</button>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2"><span className={`text-sm ${task.completed ? "line-through text-muted-foreground" : ""}`}>{task.title}</span><div className={`w-1.5 h-1.5 rounded-full ${task.priority === "high" ? "bg-red-400" : task.priority === "medium" ? "bg-yellow-400" : "bg-blue-400"}`} /></div>
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground mt-0.5">{task.dueDate && <span className={!task.completed && new Date(task.dueDate) < new Date(today()) ? "text-destructive font-medium" : ""}>Due {task.dueDate}</span>}{task.linkedTo && <span>{task.linkedTo}</span>}</div>
            </div>
            <div className="flex items-center gap-1 shrink-0"><Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditingTask(task); setShowForm(true); }}><Edit3 className="w-3 h-3" /></Button><Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteMutation.mutate(task.id)}><Trash2 className="w-3 h-3" /></Button></div>
          </CardContent></Card>
        ))}</div>
      )}
      <TaskFormDialog open={showForm} onClose={() => { setShowForm(false); setEditingTask(null); }} onSave={handleSave} task={editingTask} />
    </div>
  );
}

function TaskFormDialog({ open, onClose, onSave, task }: { open: boolean; onClose: () => void; onSave: (f: Partial<Task>) => void; task: Task | null; }) {
  const [form, setForm] = useState<Partial<Task>>({});
  useEffect(() => { if (open) setForm(task || { title: "", dueDate: "", priority: "medium", completed: false, linkedTo: "" }); }, [open, task]);
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>{task ? "Edit Task" : "Add Task"}</DialogTitle><DialogDescription>Create a follow-up</DialogDescription></DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5"><Label className="text-xs">Task</Label><Input value={form.title || ""} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="Follow up with..." /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label className="text-xs">Due Date</Label><Input type="date" value={form.dueDate || ""} onChange={(e) => setForm((p) => ({ ...p, dueDate: e.target.value }))} /></div>
            <div className="space-y-1.5"><Label className="text-xs">Priority</Label><Select value={form.priority || "medium"} onValueChange={(v) => setForm((p) => ({ ...p, priority: v as Task["priority"] }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="high">High</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="low">Low</SelectItem></SelectContent></Select></div>
          </div>
          <div className="space-y-1.5"><Label className="text-xs">Linked To</Label><Input value={form.linkedTo || ""} onChange={(e) => setForm((p) => ({ ...p, linkedTo: e.target.value }))} placeholder="Business name" /></div>
        </div>
        <DialogFooter><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={() => onSave(form)} disabled={!form.title}><Save className="w-3.5 h-3.5" />{task ? "Update" : "Add"}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Files Tab ───────────────────────────────────────────────────────

function FilesTab() {
  const { data: files = [], refetch } = useQuery<AdminFile[]>({ queryKey: ["/api/files"] });
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const { toast } = useToast();

  const createMutation = useMutation({ mutationFn: async (d: Partial<AdminFile>) => { const r = await apiRequest("POST", "/api/files", d); return r.json(); }, onSuccess: () => { refetch(); toast({ title: "File added" }); setShowForm(false); } });
  const deleteMutation = useMutation({ mutationFn: async (id: string) => { await apiRequest("DELETE", `/api/files/${id}`); }, onSuccess: () => { refetch(); toast({ title: "File deleted" }); } });

  const categories = ["all", "contracts", "invoices", "marketing", "client-assets", "lead-magnets", "scripts", "general"];
  const typeIcons: Record<string, React.ElementType> = { document: FileText, image: File, video: Video, spreadsheet: FileText, other: File };
  const filtered = useMemo(() => files.filter((f) => filterCat === "all" || f.category === filterCat).filter((f) => !search || f.name.toLowerCase().includes(search.toLowerCase())), [files, filterCat, search]);

  const [form, setForm] = useState({ name: "", url: "", type: "document", category: "general", size: 0 });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div><h2 className="text-lg font-bold">File Manager</h2><p className="text-xs text-muted-foreground">{files.length} files — contracts, lead magnets, scripts, assets</p></div>
        <Button size="sm" onClick={() => { setForm({ name: "", url: "", type: "document", category: "general", size: 0 }); setShowForm(true); }}><Upload className="w-3.5 h-3.5" />Add File</Button>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" /><Input placeholder="Search files..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-sm" /></div>
        <Select value={filterCat} onValueChange={setFilterCat}><SelectTrigger className="w-full sm:w-44 h-9"><SelectValue /></SelectTrigger><SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c === "all" ? "All Categories" : c.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}</SelectItem>)}</SelectContent></Select>
      </div>
      {filtered.length === 0 ? (
        <Card className="overflow-visible border-dashed"><CardContent className="p-8 text-center"><FolderOpen className="w-8 h-8 text-muted-foreground/50 mx-auto mb-3" /><p className="text-sm text-muted-foreground">No files yet. Add contracts, lead magnets, scripts, and more.</p></CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">{filtered.map((file) => {
          const Icon = typeIcons[file.type] || File;
          return (
            <Card key={file.id} className="overflow-visible border-border/50"><CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-md bg-muted/50 flex items-center justify-center shrink-0"><Icon className="w-5 h-5 text-muted-foreground" /></div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-[9px]">{file.category}</Badge>
                    {file.size > 0 && <span className="text-[10px] text-muted-foreground">{formatBytes(file.size)}</span>}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">{new Date(file.uploadedAt).toLocaleDateString()}</p>
                </div>
                <div className="flex flex-col gap-1">
                  {file.url && <a href={file.url} target="_blank" rel="noopener noreferrer"><Button variant="ghost" size="icon" className="h-7 w-7"><ExternalLink className="w-3 h-3" /></Button></a>}
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteMutation.mutate(file.id)}><Trash2 className="w-3 h-3" /></Button>
                </div>
              </div>
            </CardContent></Card>
          );
        })}</div>
      )}
      <Dialog open={showForm} onOpenChange={(o) => !o && setShowForm(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Add File</DialogTitle><DialogDescription>Track a file or resource</DialogDescription></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5"><Label className="text-xs">File Name</Label><Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Referral Agreement v2.pdf" /></div>
            <div className="space-y-1.5"><Label className="text-xs">URL / Link</Label><Input value={form.url} onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))} placeholder="https://drive.google.com/..." /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label className="text-xs">Type</Label><Select value={form.type} onValueChange={(v) => setForm((p) => ({ ...p, type: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="document">Document</SelectItem><SelectItem value="image">Image</SelectItem><SelectItem value="video">Video</SelectItem><SelectItem value="spreadsheet">Spreadsheet</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select></div>
              <div className="space-y-1.5"><Label className="text-xs">Category</Label><Select value={form.category} onValueChange={(v) => setForm((p) => ({ ...p, category: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="contracts">Contracts</SelectItem><SelectItem value="invoices">Invoices</SelectItem><SelectItem value="marketing">Marketing</SelectItem><SelectItem value="client-assets">Client Assets</SelectItem><SelectItem value="lead-magnets">Lead Magnets</SelectItem><SelectItem value="scripts">Scripts & Templates</SelectItem><SelectItem value="general">General</SelectItem></SelectContent></Select></div>
            </div>
            <div className="space-y-1.5"><Label className="text-xs">Size (bytes, optional)</Label><Input type="number" value={form.size || ""} onChange={(e) => setForm((p) => ({ ...p, size: Number(e.target.value) }))} /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button><Button onClick={() => createMutation.mutate(form)} disabled={!form.name}><Save className="w-3.5 h-3.5" />Add File</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Integrations Tab ────────────────────────────────────────────────

function IntegrationsTab() {
  const { data: slackCfg, refetch: refetchSlack } = useQuery<SlackConfig>({ queryKey: ["/api/integrations/slack"] });
  const [slack, setSlack] = useState<SlackConfig>({ webhookUrl: "", channel: "#general", enabled: false, notifyNewLead: true, notifyNewClient: true, notifyRevenue: false, notifyTaskDue: true });
  const { toast } = useToast();

  useEffect(() => { if (slackCfg) setSlack(slackCfg); }, [slackCfg]);

  const saveSlackMutation = useMutation({
    mutationFn: async (cfg: SlackConfig) => { const r = await apiRequest("PATCH", "/api/integrations/slack", cfg); return r.json(); },
    onSuccess: () => { refetchSlack(); toast({ title: "Slack settings saved" }); },
  });

  const testSlackMutation = useMutation({
    mutationFn: async () => { const r = await apiRequest("POST", "/api/integrations/slack/test"); return r.json(); },
    onSuccess: () => { toast({ title: "Test sent", description: "Check your Slack channel" }); },
    onError: () => { toast({ title: "Test failed", description: "Check webhook URL", variant: "destructive" }); },
  });

  return (
    <div className="space-y-6 max-w-3xl">
      <div><h2 className="text-lg font-bold flex items-center gap-2"><Plug className="w-5 h-5 text-primary" />Integrations</h2><p className="text-xs text-muted-foreground mt-1">Connect external tools and automate notifications</p></div>

      {/* Slack */}
      <Card className="overflow-visible border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-[#4A154B]/15 flex items-center justify-center"><Hash className="w-5 h-5 text-[#E01E5A]" /></div>
            <div><CardTitle className="text-sm">Slack Integration</CardTitle><p className="text-xs text-muted-foreground">Get notified in Slack when things happen</p></div>
            <div className="ml-auto flex items-center gap-2">
              <Badge variant={slack.enabled ? "default" : "outline"}>{slack.enabled ? "Connected" : "Disabled"}</Badge>
              <Switch checked={slack.enabled} onCheckedChange={(v) => setSlack((p) => ({ ...p, enabled: v }))} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label className="text-xs">Webhook URL</Label><Input value={slack.webhookUrl} onChange={(e) => setSlack((p) => ({ ...p, webhookUrl: e.target.value }))} placeholder="https://hooks.slack.com/services/..." className="text-xs" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Channel</Label><Input value={slack.channel} onChange={(e) => setSlack((p) => ({ ...p, channel: e.target.value }))} placeholder="#general" /></div>
          </div>
          <div>
            <Label className="text-xs mb-2 block">Notify on:</Label>
            <div className="grid grid-cols-2 gap-2">
              {([["notifyNewLead", "New leads"], ["notifyNewClient", "New clients"], ["notifyRevenue", "Revenue recorded"], ["notifyTaskDue", "Tasks due"]] as const).map(([key, label]) => (
                <div key={key} className="flex items-center gap-2 p-2 rounded-md bg-muted/30">
                  <Switch checked={(slack as any)[key]} onCheckedChange={(v) => setSlack((p) => ({ ...p, [key]: v }))} />
                  <span className="text-xs">{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button size="sm" onClick={() => saveSlackMutation.mutate(slack)} disabled={saveSlackMutation.isPending}><Save className="w-3.5 h-3.5" />Save Slack Settings</Button>
            <Button size="sm" variant="outline" onClick={() => testSlackMutation.mutate()} disabled={!slack.webhookUrl || testSlackMutation.isPending}><Send className="w-3.5 h-3.5" />Test Notification</Button>
          </div>
        </CardContent>
      </Card>

      {/* Integration Ideas */}
      <Card className="overflow-visible border-border/50">
        <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><Globe className="w-4 h-4 text-blue-400" />Available Integrations</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { name: "Google Sheets", desc: "Sync leads & revenue to a spreadsheet", status: "coming-soon" },
              { name: "Zapier", desc: "Connect 5000+ apps with webhooks", status: "coming-soon" },
              { name: "Email (SMTP)", desc: "Auto-send follow-up emails to leads", status: "coming-soon" },
              { name: "Google Calendar", desc: "Sync task due dates to your calendar", status: "coming-soon" },
              { name: "Twilio SMS", desc: "Auto-text leads within 24hrs of download", status: "coming-soon" },
              { name: "QuickBooks", desc: "Sync revenue entries to accounting", status: "coming-soon" },
            ].map((i) => (
              <div key={i.name} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/30">
                <div className="w-8 h-8 rounded-md bg-muted/50 flex items-center justify-center"><Plug className="w-4 h-4 text-muted-foreground" /></div>
                <div className="min-w-0 flex-1"><p className="text-sm font-medium">{i.name}</p><p className="text-[10px] text-muted-foreground">{i.desc}</p></div>
                <Badge variant="outline" className="text-[9px] shrink-0">Soon</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Resources Manager Tab ──────────────────────────────────────────

const RESOURCE_CATEGORIES: Record<string, string> = {
  "sales-materials": "Client Sales Resources",
  "pos-systems": "POS Systems & Battlecards",
  "classroom": "CashSwipe Classroom",
};

const RESOURCE_TYPES: Record<string, string> = {
  video: "Video", pdf: "PDF", doc: "Guide", template: "Template", link: "Link",
};

function ResourcesManagerTab() {
  const { toast } = useToast();
  const { data: resources = [], refetch } = useQuery<AdminResource[]>({
    queryKey: ["/api/resources/all"],
    queryFn: async () => { const r = await fetch("/api/resources/all", { credentials: "include" }); if (!r.ok) throw new Error("Failed"); return r.json(); },
  });
  const [showDialog, setShowDialog] = useState(false);
  const [editingResource, setEditingResource] = useState<AdminResource | null>(null);
  const [filterCat, setFilterCat] = useState("all");
  const [form, setForm] = useState({ title: "", description: "", category: "sales-materials", type: "doc", url: "", thumbnailUrl: "", featured: false, published: true, order: 1 });

  const createMut = useMutation({
    mutationFn: (data: typeof form) => apiRequest("POST", "/api/resources", data),
    onSuccess: () => { refetch(); setShowDialog(false); toast({ title: "Resource added" }); },
  });

  const updateMut = useMutation({
    mutationFn: ({ id, ...data }: Partial<AdminResource> & { id: string }) => apiRequest("PATCH", `/api/resources/${id}`, data),
    onSuccess: () => { refetch(); setShowDialog(false); setEditingResource(null); toast({ title: "Resource updated" }); },
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/resources/${id}`),
    onSuccess: () => { refetch(); toast({ title: "Resource deleted" }); },
  });

  const openCreate = () => {
    setEditingResource(null);
    setForm({ title: "", description: "", category: "getting-started", type: "doc", url: "", thumbnailUrl: "", featured: false, published: true, order: resources.length + 1 });
    setShowDialog(true);
  };

  const openEdit = (r: AdminResource) => {
    setEditingResource(r);
    setForm({ title: r.title, description: r.description, category: r.category, type: r.type, url: r.url, thumbnailUrl: r.thumbnailUrl, featured: r.featured, published: r.published, order: r.order });
    setShowDialog(true);
  };

  const handleSave = () => {
    if (editingResource) {
      updateMut.mutate({ id: editingResource.id, ...form });
    } else {
      createMut.mutate(form);
    }
  };

  const filtered = filterCat === "all" ? resources : resources.filter((r) => r.category === filterCat);
  const grouped = Object.entries(RESOURCE_CATEGORIES).map(([catId, catLabel]) => ({
    id: catId,
    label: catLabel,
    items: filtered.filter((r) => r.category === catId),
  })).filter((g) => filterCat === "all" ? g.items.length > 0 : g.id === filterCat);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2"><Library className="w-5 h-5 text-primary" />Resources Manager</h2>
          <p className="text-xs text-muted-foreground mt-1">Manage the public resources page — {resources.length} total, {resources.filter((r) => r.published).length} published</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={filterCat} onValueChange={setFilterCat}>
            <SelectTrigger className="w-[180px] h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {Object.entries(RESOURCE_CATEGORIES).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button size="sm" onClick={openCreate}><Plus className="w-3.5 h-3.5" />Add Resource</Button>
        </div>
      </div>

      {grouped.map((group) => (
        <Card key={group.id} className="overflow-visible">
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-sm font-semibold">{group.label} ({group.items.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs w-8">#</TableHead>
                  <TableHead className="text-xs">Title</TableHead>
                  <TableHead className="text-xs w-20">Type</TableHead>
                  <TableHead className="text-xs w-20">Status</TableHead>
                  <TableHead className="text-xs w-16">Featured</TableHead>
                  <TableHead className="text-xs w-24 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {group.items.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="text-xs text-muted-foreground">{r.order}</TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium truncate max-w-xs">{r.title}</p>
                        <p className="text-[10px] text-muted-foreground truncate max-w-xs">{r.description}</p>
                        {r.url && <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary hover:underline flex items-center gap-0.5 mt-0.5"><ExternalLink className="w-2.5 h-2.5" />Link</a>}
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="outline" className="text-[10px]">{RESOURCE_TYPES[r.type] || r.type}</Badge></TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-[10px] cursor-pointer ${r.published ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" : "text-muted-foreground bg-muted/30"}`}
                        onClick={() => updateMut.mutate({ id: r.id, published: !r.published })}>
                        {r.published ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {r.featured && <Badge variant="outline" className="text-[10px] text-amber-400 bg-amber-400/10 border-amber-400/20"><Star className="w-2.5 h-2.5" /></Badge>}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(r)}><Edit3 className="w-3 h-3" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400 hover:text-red-300" onClick={() => { if (confirm("Delete this resource?")) deleteMut.mutate(r.id); }}><Trash2 className="w-3 h-3" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}

      {filtered.length === 0 && (
        <Card className="border-dashed"><CardContent className="p-8 text-center">
          <Library className="w-8 h-8 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No resources in this category yet.</p>
          <Button size="sm" variant="outline" className="mt-3" onClick={openCreate}><Plus className="w-3.5 h-3.5" />Add Resource</Button>
        </CardContent></Card>
      )}

      <Dialog open={showDialog} onOpenChange={(o) => { setShowDialog(o); if (!o) setEditingResource(null); }}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingResource ? "Edit Resource" : "Add Resource"}</DialogTitle>
            <DialogDescription>Fill in the resource details below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Resource title" />
            </div>
            <div>
              <Label className="text-xs">Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief description" rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>{Object.entries(RESOURCE_CATEGORIES).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                  <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>{Object.entries(RESOURCE_TYPES).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-xs">Resource URL</Label>
              <Input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://..." />
            </div>
            <div>
              <Label className="text-xs">Thumbnail URL (optional)</Label>
              <Input value={form.thumbnailUrl} onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })} placeholder="https://..." />
            </div>
            <div>
              <Label className="text-xs">Display Order</Label>
              <Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 1 })} min={1} />
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={form.featured} onCheckedChange={(c) => setForm({ ...form, featured: !!c })} />
                Featured
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={form.published} onCheckedChange={(c) => setForm({ ...form, published: !!c })} />
                Published
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!form.title}>{editingResource ? "Update" : "Add"} Resource</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Activity Tab ────────────────────────────────────────────────────

function ActivityTab() {
  const { data: activity = [], refetch } = useQuery<ActivityEntry[]>({ queryKey: ["/api/activity"], refetchInterval: 15000 });

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex items-center justify-between">
        <div><h2 className="text-lg font-bold flex items-center gap-2"><Activity className="w-5 h-5 text-primary" />Activity Feed</h2><p className="text-xs text-muted-foreground mt-1">Real-time log of all admin actions</p></div>
        <Button variant="outline" size="sm" onClick={() => refetch()}><RefreshCw className="w-3.5 h-3.5" />Refresh</Button>
      </div>
      {activity.length === 0 ? (
        <Card className="overflow-visible border-dashed"><CardContent className="p-8 text-center"><Activity className="w-8 h-8 text-muted-foreground/50 mx-auto mb-3" /><p className="text-sm text-muted-foreground">No activity yet. Actions will appear here as you use the dashboard.</p></CardContent></Card>
      ) : (
        <div className="space-y-0">{activity.map((a, i) => (
          <div key={a.id} className="flex gap-4 py-3 border-b border-border/30 last:border-0">
            <div className="flex flex-col items-center">
              <div className={`w-3 h-3 rounded-full shrink-0 ${ACTIVITY_COLORS[a.type] || "bg-gray-400"}`} />
              {i < activity.length - 1 && <div className="w-px flex-1 bg-border/30 mt-1" />}
            </div>
            <div className="min-w-0 flex-1 pb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium">{a.action}</span>
                <Badge variant="outline" className="text-[9px]">{a.type}</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{a.details}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{timeAgo(a.timestamp)} — {new Date(a.timestamp).toLocaleString()}</p>
            </div>
          </div>
        ))}</div>
      )}
    </div>
  );
}

// ─── Team & Business Tab ─────────────────────────────────────────────

function TeamTab() {
  const { data: team = [], refetch: refetchTeam } = useQuery<TeamMember[]>({ queryKey: ["/api/team-members"] });
  const { data: biz, refetch: refetchBiz } = useQuery<BusinessInfoData>({ queryKey: ["/api/business-info"] });
  const { data: clients = [] } = useQuery<Client[]>({ queryKey: ["/api/clients"] });
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [memberForm, setMemberForm] = useState({ name: "", role: "", email: "", phone: "", dailyInvolvement: "full" });
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [bizForm, setBizForm] = useState<Partial<BusinessInfoData>>({});
  const [bizDirty, setBizDirty] = useState(false);
  const { toast } = useToast();

  useEffect(() => { if (biz) { setBizForm(biz); setBizDirty(false); } }, [biz]);

  const createMemberMutation = useMutation({
    mutationFn: async (data: any) => { const r = await apiRequest("POST", "/api/team-members", data); return r.json(); },
    onSuccess: () => { refetchTeam(); toast({ title: "Team member added" }); setShowMemberForm(false); setMemberForm({ name: "", role: "", email: "", phone: "", dailyInvolvement: "full" }); },
  });
  const updateMemberMutation = useMutation({
    mutationFn: async ({ id, ...data }: any) => { const r = await apiRequest("PATCH", `/api/team-members/${id}`, data); return r.json(); },
    onSuccess: () => { refetchTeam(); setEditingMember(null); toast({ title: "Updated" }); },
  });
  const deleteMemberMutation = useMutation({
    mutationFn: async (id: string) => { await apiRequest("DELETE", `/api/team-members/${id}`); },
    onSuccess: () => { refetchTeam(); },
  });
  const saveBizMutation = useMutation({
    mutationFn: async (data: Partial<BusinessInfoData>) => { const r = await apiRequest("PATCH", "/api/business-info", data); return r.json(); },
    onSuccess: () => { refetchBiz(); setBizDirty(false); toast({ title: "Business info saved" }); },
  });

  const PHASE_CONFIG: Record<string, { label: string; color: string }> = {
    onboarding: { label: "Onboarding & Training", color: "text-blue-400" },
    training: { label: "Advanced Training", color: "text-cyan-400" },
    "pre-launch": { label: "Pre-Launch Prep", color: "text-yellow-400" },
    active: { label: "Active Sales", color: "text-emerald-400" },
    scaling: { label: "Scaling", color: "text-purple-400" },
  };

  const INVOLVEMENT_LABELS: Record<string, string> = { minimal: "Minimal", "part-time": "Part-Time", full: "Full-Time" };

  return (
    <div className="space-y-6">
      <div><h2 className="text-lg font-bold flex items-center gap-2"><Briefcase className="w-5 h-5 text-primary" />Team & Business</h2><p className="text-xs text-muted-foreground mt-1">Manage your team, business details, and client assignments. Everyone on the team can see this.</p></div>

      {/* Business Info */}
      <Card className="overflow-visible border-border/50">
        <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><Building className="w-4 h-4" />Business Information</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label className="text-xs">Company Name</Label><Input value={bizForm.companyName || ""} onChange={(e) => { setBizForm(f => ({ ...f, companyName: e.target.value })); setBizDirty(true); }} placeholder="TechSavvy Hawaii LLC" /></div>
            <div className="space-y-1.5"><Label className="text-xs">DBA (Doing Business As)</Label><Input value={bizForm.dba || ""} onChange={(e) => { setBizForm(f => ({ ...f, dba: e.target.value })); setBizDirty(true); }} placeholder="TechSavvy" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Phone</Label><Input value={bizForm.phone || ""} onChange={(e) => { setBizForm(f => ({ ...f, phone: e.target.value })); setBizDirty(true); }} placeholder="808-767-5460" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Email</Label><Input value={bizForm.email || ""} onChange={(e) => { setBizForm(f => ({ ...f, email: e.target.value })); setBizDirty(true); }} placeholder="contact@techsavvyhawaii.com" /></div>
            <div className="space-y-1.5 sm:col-span-2"><Label className="text-xs">Address</Label><Input value={bizForm.address || ""} onChange={(e) => { setBizForm(f => ({ ...f, address: e.target.value })); setBizDirty(true); }} placeholder="Honolulu, HI" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Website</Label><Input value={bizForm.website || ""} onChange={(e) => { setBizForm(f => ({ ...f, website: e.target.value })); setBizDirty(true); }} /></div>
            <div className="space-y-1.5"><Label className="text-xs">EIN / Tax ID</Label><Input value={bizForm.taxId || ""} onChange={(e) => { setBizForm(f => ({ ...f, taxId: e.target.value })); setBizDirty(true); }} placeholder="Pending — Joey is handling" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Processor Partner</Label><Input value={bizForm.processorPartner || ""} onChange={(e) => { setBizForm(f => ({ ...f, processorPartner: e.target.value })); setBizDirty(true); }} /></div>
            <div className="space-y-1.5"><Label className="text-xs">Current Phase</Label>
              <Select value={bizForm.currentPhase || "onboarding"} onValueChange={(v) => { setBizForm(f => ({ ...f, currentPhase: v })); setBizDirty(true); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{Object.entries(PHASE_CONFIG).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5"><Label className="text-xs">Notes</Label><Textarea value={bizForm.notes || ""} onChange={(e) => { setBizForm(f => ({ ...f, notes: e.target.value })); setBizDirty(true); }} rows={2} className="resize-none text-sm" placeholder="Any notes about the business..." /></div>
          {bizDirty && <div className="flex justify-end"><Button size="sm" onClick={() => saveBizMutation.mutate(bizForm)}><Save className="w-3.5 h-3.5" />Save Business Info</Button></div>}
        </CardContent>
      </Card>

      {/* Team Members */}
      <Card className="overflow-visible border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2"><Users className="w-4 h-4" />Team Members ({team.length})</CardTitle>
            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setShowMemberForm(true)}><Plus className="w-3 h-3" />Add Member</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {team.map((m) => (
              <div key={m.id} className="flex items-start sm:items-center justify-between gap-2 p-3 rounded-lg bg-muted/30 border border-border/30">
                <div className="flex items-start sm:items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center text-sm font-bold text-primary shrink-0">{m.name.charAt(0)}</div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.role}</p>
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-0.5">
                      <Badge variant="outline" className="text-[10px] h-4">{INVOLVEMENT_LABELS[m.dailyInvolvement] || m.dailyInvolvement}</Badge>
                      {m.email && <span className="text-[10px] text-muted-foreground truncate max-w-[140px] sm:max-w-none">{m.email}</span>}
                      {m.phone && <span className="text-[10px] text-muted-foreground">{m.phone}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditingMember(m)}><Edit3 className="w-3 h-3" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteMemberMutation.mutate(m.id)}><Trash2 className="w-3 h-3" /></Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Client Assignments */}
      <Card className="overflow-visible border-border/50">
        <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><UserPlus className="w-4 h-4" />Client-Team Assignments</CardTitle></CardHeader>
        <CardContent>
          {clients.length === 0 ? <p className="text-xs text-muted-foreground py-2">No clients yet. Once you add clients, you can assign them to team members here.</p> : (
            <div className="space-y-2">{clients.map((c) => {
              const assignMatch = c.notes?.match(/\[ASSIGNED:([^\]]+)\]/);
              const assignedId = assignMatch ? assignMatch[1] : "";
              const assignedMember = team.find(m => m.id === assignedId);
              return (
                <div key={c.id} className="flex items-center justify-between p-2 rounded-md bg-muted/20 border border-border/30">
                  <div>
                    <p className="text-xs font-medium">{c.business || c.name}</p>
                    <p className="text-[10px] text-muted-foreground">{c.package} — {c.maintenance !== "none" ? c.maintenance : "no maintenance"}{assignedMember ? ` • ${assignedMember.name}` : ""}</p>
                  </div>
                  <Select value={assignedId || "unassigned"} onValueChange={async (v) => {
                    const cleanNotes = (c.notes || "").replace(/\[ASSIGNED:[^\]]+\]\s*/g, "");
                    const newNotes = v !== "unassigned" ? `[ASSIGNED:${v}] ${cleanNotes}` : cleanNotes;
                    await apiRequest("PATCH", `/api/clients/${c.id}`, { notes: newNotes });
                    queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
                  }}>
                    <SelectTrigger className="w-[140px] h-7 text-xs"><SelectValue placeholder="Assign..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      {team.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              );
            })}</div>
          )}
        </CardContent>
      </Card>

      {/* Add Member Dialog */}
      <Dialog open={showMemberForm} onOpenChange={(o) => !o && setShowMemberForm(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Add Team Member</DialogTitle><DialogDescription>Add a new member to the team</DialogDescription></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label className="text-xs">Name *</Label><Input value={memberForm.name} onChange={(e) => setMemberForm(f => ({ ...f, name: e.target.value }))} /></div>
              <div className="space-y-1.5"><Label className="text-xs">Involvement</Label>
                <Select value={memberForm.dailyInvolvement} onValueChange={(v) => setMemberForm(f => ({ ...f, dailyInvolvement: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="full">Full-Time</SelectItem><SelectItem value="part-time">Part-Time</SelectItem><SelectItem value="minimal">Minimal</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5"><Label className="text-xs">Role / Responsibilities</Label><Input value={memberForm.role} onChange={(e) => setMemberForm(f => ({ ...f, role: e.target.value }))} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label className="text-xs">Email</Label><Input value={memberForm.email} onChange={(e) => setMemberForm(f => ({ ...f, email: e.target.value }))} /></div>
              <div className="space-y-1.5"><Label className="text-xs">Phone</Label><Input value={memberForm.phone} onChange={(e) => setMemberForm(f => ({ ...f, phone: e.target.value }))} /></div>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setShowMemberForm(false)}>Cancel</Button><Button onClick={() => createMemberMutation.mutate(memberForm)} disabled={!memberForm.name}><Plus className="w-3.5 h-3.5" />Add</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Member Dialog */}
      <Dialog open={!!editingMember} onOpenChange={(o) => !o && setEditingMember(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Edit Team Member</DialogTitle><DialogDescription>Update member details</DialogDescription></DialogHeader>
          {editingMember && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label className="text-xs">Name</Label><Input value={editingMember.name} onChange={(e) => setEditingMember(m => m ? { ...m, name: e.target.value } : m)} /></div>
                <div className="space-y-1.5"><Label className="text-xs">Involvement</Label>
                  <Select value={editingMember.dailyInvolvement} onValueChange={(v) => setEditingMember(m => m ? { ...m, dailyInvolvement: v } : m)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="full">Full-Time</SelectItem><SelectItem value="part-time">Part-Time</SelectItem><SelectItem value="minimal">Minimal</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5"><Label className="text-xs">Role</Label><Input value={editingMember.role} onChange={(e) => setEditingMember(m => m ? { ...m, role: e.target.value } : m)} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label className="text-xs">Email</Label><Input value={editingMember.email} onChange={(e) => setEditingMember(m => m ? { ...m, email: e.target.value } : m)} /></div>
                <div className="space-y-1.5"><Label className="text-xs">Phone</Label><Input value={editingMember.phone} onChange={(e) => setEditingMember(m => m ? { ...m, phone: e.target.value } : m)} /></div>
              </div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setEditingMember(null)}>Cancel</Button><Button onClick={() => editingMember && updateMemberMutation.mutate(editingMember)}><Save className="w-3.5 h-3.5" />Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Schedule Tab ────────────────────────────────────────────────────

function ScheduleTab() {
  const { data: schedule = [], refetch: refetchSchedule } = useQuery<ScheduleItem[]>({ queryKey: ["/api/schedule"] });
  const { data: team = [] } = useQuery<TeamMember[]>({ queryKey: ["/api/team-members"] });
  const [showForm, setShowForm] = useState(false);
  const [viewDate, setViewDate] = useState(today());
  const [viewMode, setViewMode] = useState<"day" | "week">("day");
  const [form, setForm] = useState({ title: "", description: "", date: today(), time: "09:00", duration: 30, assigneeId: "", priority: "medium", category: "general" });
  const { toast } = useToast();

  const createMutation = useMutation({
    mutationFn: async (data: any) => { const r = await apiRequest("POST", "/api/schedule", data); return r.json(); },
    onSuccess: () => { refetchSchedule(); toast({ title: "Scheduled" }); setShowForm(false); setForm({ title: "", description: "", date: today(), time: "09:00", duration: 30, assigneeId: "", priority: "medium", category: "general" }); },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => { const r = await apiRequest("PATCH", `/api/schedule/${id}`, { status }); return r.json(); },
    onSuccess: () => refetchSchedule(),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { await apiRequest("DELETE", `/api/schedule/${id}`); },
    onSuccess: () => refetchSchedule(),
  });

  const [aiLoading, setAiLoading] = useState(false);
  const handleAiRecommend = async () => {
    setAiLoading(true);
    try {
      const r = await apiRequest("POST", "/api/ai-ops/recommend");
      const data = await r.json();
      if (data.recommendations?.length > 0) {
        for (const rec of data.recommendations) {
          const member = team.find(m => m.name.toLowerCase() === rec.assigneeName?.toLowerCase());
          await apiRequest("POST", "/api/schedule", {
            title: rec.title,
            description: rec.description,
            date: today(),
            assigneeId: member?.id || "",
            priority: rec.priority || "medium",
            category: rec.category || "general",
            isAiGenerated: true,
          });
        }
        refetchSchedule();
        toast({ title: `${data.recommendations.length} AI tasks added to today's schedule` });
      }
    } catch { toast({ title: "Failed to get AI recommendations", variant: "destructive" }); }
    setAiLoading(false);
  };

  const getWeekDates = (d: string) => {
    const date = new Date(d + "T12:00:00");
    const day = date.getDay();
    const start = new Date(date);
    start.setDate(date.getDate() - day);
    return Array.from({ length: 7 }, (_, i) => {
      const dt = new Date(start);
      dt.setDate(start.getDate() + i);
      return dt.toISOString().split("T")[0];
    });
  };

  const weekDates = getWeekDates(viewDate);
  const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const CATEGORY_COLORS: Record<string, string> = { training: "bg-blue-400", outreach: "bg-orange-400", admin: "bg-gray-400", meeting: "bg-purple-400", "follow-up": "bg-cyan-400", development: "bg-pink-400", general: "bg-muted-foreground" };
  const PRIORITY_COLORS: Record<string, string> = { high: "text-red-400", medium: "text-yellow-400", low: "text-muted-foreground" };

  const filteredItems = viewMode === "day"
    ? schedule.filter(s => s.date === viewDate)
    : schedule.filter(s => weekDates.includes(s.date));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div><h2 className="text-lg font-bold flex items-center gap-2"><Clock className="w-5 h-5 text-primary" />Schedule</h2><p className="text-xs text-muted-foreground mt-1">Daily and weekly task schedule — visible to the whole team</p></div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-xs h-7" onClick={handleAiRecommend} disabled={aiLoading}>
            <Sparkles className="w-3 h-3" />{aiLoading ? "Generating..." : "AI Recommend"}
          </Button>
          <Button size="sm" className="text-xs h-7" onClick={() => { setForm(f => ({ ...f, date: viewDate })); setShowForm(true); }}><Plus className="w-3 h-3" />Add Task</Button>
        </div>
      </div>

      {/* Date nav */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1">
          <Button variant={viewMode === "day" ? "default" : "outline"} size="sm" className="text-xs h-7" onClick={() => setViewMode("day")}>Day</Button>
          <Button variant={viewMode === "week" ? "default" : "outline"} size="sm" className="text-xs h-7" onClick={() => setViewMode("week")}>Week</Button>
        </div>
        <Input type="date" value={viewDate} onChange={(e) => setViewDate(e.target.value)} className="w-auto h-7 text-xs" />
        <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => setViewDate(today())}>Today</Button>
      </div>

      {/* Schedule items */}
      {viewMode === "day" ? (
        <div className="space-y-2">
          {filteredItems.length === 0 ? (
            <Card className="border-dashed border-border/50"><CardContent className="p-6 text-center"><p className="text-xs text-muted-foreground">No tasks scheduled for this day. Click "AI Recommend" to get suggestions or add tasks manually.</p></CardContent></Card>
          ) : filteredItems.sort((a, b) => (a.time || "99:99").localeCompare(b.time || "99:99")).map((item) => {
            const member = team.find(m => m.id === item.assigneeId);
            return (
              <Card key={item.id} className={`overflow-visible border-border/50 ${item.status === "completed" ? "opacity-60" : ""}`}>
                <CardContent className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 flex-1">
                      <Checkbox checked={item.status === "completed"} onCheckedChange={(v) => toggleStatusMutation.mutate({ id: item.id, status: v ? "completed" : "pending" })} className="mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-xs font-semibold ${item.status === "completed" ? "line-through" : ""}`}>{item.title}</span>
                          {item.isAiGenerated && <Sparkles className="w-3 h-3 text-primary" />}
                          <span className={`w-1.5 h-1.5 rounded-full ${CATEGORY_COLORS[item.category] || "bg-muted"}`} />
                          <span className={`text-[10px] ${PRIORITY_COLORS[item.priority] || ""}`}>{item.priority}</span>
                        </div>
                        {item.description && <p className="text-[10px] text-muted-foreground mt-0.5">{item.description}</p>}
                        <div className="flex items-center gap-2 mt-1">
                          {item.time && <span className="text-[10px] text-muted-foreground flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" />{item.time}</span>}
                          {member && <Badge variant="outline" className="text-[10px] h-4">{member.name}</Badge>}
                          {!member && item.assigneeId && <Badge variant="outline" className="text-[10px] h-4">AI</Badge>}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive shrink-0" onClick={() => deleteMutation.mutate(item.id)}><Trash2 className="w-3 h-3" /></Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="grid grid-cols-7 gap-2 min-w-[600px] sm:min-w-0">
            {weekDates.map((d, i) => {
              const dayItems = schedule.filter(s => s.date === d);
              const isToday = d === today();
              return (
                <div key={d} className={`rounded-lg border p-2 min-h-[120px] ${isToday ? "border-primary/50 bg-primary/5" : "border-border/30"}`}>
                  <p className={`text-[10px] font-semibold mb-1 ${isToday ? "text-primary" : "text-muted-foreground"}`}>{DAY_NAMES[i]} {d.slice(5)}</p>
                  <div className="space-y-1">{dayItems.map((item) => (
                    <div key={item.id} className={`rounded px-1.5 py-0.5 text-[9px] cursor-pointer ${item.status === "completed" ? "line-through opacity-50" : ""} ${(CATEGORY_COLORS[item.category] || "bg-muted") + "/10"}`} onClick={() => toggleStatusMutation.mutate({ id: item.id, status: item.status === "completed" ? "pending" : "completed" })}>
                      {item.title.slice(0, 25)}{item.title.length > 25 ? "…" : ""}
                    </div>
                  ))}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Task Dialog */}
      <Dialog open={showForm} onOpenChange={(o) => !o && setShowForm(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Add Schedule Item</DialogTitle><DialogDescription>Create a new task on the schedule</DialogDescription></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5"><Label className="text-xs">Title *</Label><Input value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Complete CashSwipe Module 3" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Description</Label><Input value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Details..." /></div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5"><Label className="text-xs">Date</Label><Input type="date" value={form.date} onChange={(e) => setForm(f => ({ ...f, date: e.target.value }))} /></div>
              <div className="space-y-1.5"><Label className="text-xs">Time</Label><Input type="time" value={form.time} onChange={(e) => setForm(f => ({ ...f, time: e.target.value }))} /></div>
              <div className="space-y-1.5"><Label className="text-xs">Duration (min)</Label><Input type="number" value={form.duration} onChange={(e) => setForm(f => ({ ...f, duration: Number(e.target.value) }))} /></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5"><Label className="text-xs">Assign To</Label>
                <Select value={form.assigneeId || "unassigned"} onValueChange={(v) => setForm(f => ({ ...f, assigneeId: v === "unassigned" ? "" : v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {team.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                    <SelectItem value="ai">AI Assistant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label className="text-xs">Priority</Label>
                <Select value={form.priority} onValueChange={(v) => setForm(f => ({ ...f, priority: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="high">High</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="low">Low</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label className="text-xs">Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm(f => ({ ...f, category: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="training">Training</SelectItem><SelectItem value="outreach">Outreach</SelectItem><SelectItem value="admin">Admin</SelectItem><SelectItem value="meeting">Meeting</SelectItem><SelectItem value="follow-up">Follow-Up</SelectItem><SelectItem value="development">Development</SelectItem><SelectItem value="general">General</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button><Button onClick={() => createMutation.mutate(form)} disabled={!form.title}><Plus className="w-3.5 h-3.5" />Add</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── AI Ops Tab ──────────────────────────────────────────────────────

function AiOpsTab() {
  const { data: team = [] } = useQuery<TeamMember[]>({ queryKey: ["/api/team-members"] });
  const { data: schedule = [], refetch: refetchSchedule } = useQuery<ScheduleItem[]>({ queryKey: ["/api/schedule"] });
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<AiRecommendation[]>([]);
  const [recLoading, setRecLoading] = useState(false);
  const { toast } = useToast();

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const newMsg = { role: "user" as const, content: input.trim() };
    setMessages(prev => [...prev, newMsg]);
    setInput("");
    setLoading(true);
    try {
      const r = await apiRequest("POST", "/api/ai-ops/chat", { message: newMsg.content, history: messages });
      const data = await r.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
    } catch { setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I couldn't process that. Please try again." }]); }
    setLoading(false);
  };

  const handleGetRecommendations = async () => {
    setRecLoading(true);
    try {
      const r = await apiRequest("POST", "/api/ai-ops/recommend");
      const data = await r.json();
      setRecommendations(data.recommendations || []);
    } catch { toast({ title: "Failed to get recommendations", variant: "destructive" }); }
    setRecLoading(false);
  };

  const handleAddToSchedule = async (rec: AiRecommendation) => {
    const member = team.find(m => m.name.toLowerCase() === rec.assigneeName?.toLowerCase());
    await apiRequest("POST", "/api/schedule", {
      title: rec.title,
      description: rec.description,
      date: today(),
      assigneeId: member?.id || "",
      priority: rec.priority,
      category: rec.category,
      isAiGenerated: true,
    });
    refetchSchedule();
    toast({ title: `Added "${rec.title}" to schedule` });
    setRecommendations(prev => prev.filter(r => r.title !== rec.title));
  };

  const todayItems = schedule.filter(s => s.date === today());
  const PRIORITY_ICON: Record<string, string> = { high: "text-red-400", medium: "text-yellow-400", low: "text-green-400" };

  return (
    <div className="space-y-4">
      <div><h2 className="text-lg font-bold flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary" />AI Operations Assistant</h2><p className="text-xs text-muted-foreground mt-1">Get AI-powered recommendations, reminders, and manage daily ops. Ask anything about your business.</p></div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chat Panel */}
        <Card className="overflow-visible border-border/50">
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><MessageSquare className="w-4 h-4" />Chat with AI Ops</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[350px] overflow-y-auto mb-3 space-y-2 p-2 rounded-md bg-muted/20 border border-border/30">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <Sparkles className="w-8 h-8 text-primary/30 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Ask me about daily tasks, reminders, business strategy, or anything else.</p>
                  <div className="flex flex-wrap gap-1 mt-3 justify-center">
                    {["What should the team focus on today?", "Give me a status update", "What tasks are overdue?", "Help me plan this week"].map(q => (
                      <Button key={q} variant="outline" size="sm" className="text-[10px] h-6" onClick={() => { setInput(q); }}>{q}</Button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-lg px-3 py-2 text-xs ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                    <pre className="whitespace-pre-wrap font-sans">{m.content}</pre>
                  </div>
                </div>
              ))}
              {loading && <div className="flex justify-start"><div className="bg-muted rounded-lg px-3 py-2 text-xs text-muted-foreground animate-pulse">Thinking...</div></div>}
            </div>
            <div className="flex gap-2">
              <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask AI anything..." className="text-sm"
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }} />
              <Button size="sm" onClick={handleSend} disabled={!input.trim() || loading}><Send className="w-3.5 h-3.5" /></Button>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations Panel */}
        <div className="space-y-4">
          <Card className="overflow-visible border-border/50">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2"><Sparkles className="w-4 h-4" />AI Recommendations</CardTitle>
                <Button variant="outline" size="sm" className="text-xs h-7" onClick={handleGetRecommendations} disabled={recLoading}>
                  <RefreshCw className={`w-3 h-3 ${recLoading ? "animate-spin" : ""}`} />{recLoading ? "Loading..." : "Generate"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recommendations.length === 0 ? (
                <p className="text-xs text-muted-foreground py-4 text-center">Click "Generate" to get AI-powered task recommendations for today.</p>
              ) : (
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {recommendations.map((rec, i) => (
                    <div key={i} className="flex items-start justify-between gap-2 p-2 rounded-md bg-muted/20 border border-border/30">
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-bold ${PRIORITY_ICON[rec.priority] || ""}`}>{rec.priority?.toUpperCase()}</span>
                          <span className="text-xs font-medium">{rec.title}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{rec.description}</p>
                        <Badge variant="outline" className="text-[10px] h-4 mt-1">{rec.assigneeName}</Badge>
                      </div>
                      <Button variant="outline" size="sm" className="text-[10px] h-6 shrink-0" onClick={() => handleAddToSchedule(rec)}>
                        <Plus className="w-2.5 h-2.5" />Add
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Today's Quick View */}
          <Card className="overflow-visible border-border/50">
            <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Calendar className="w-4 h-4" />Today's Schedule ({todayItems.length})</CardTitle></CardHeader>
            <CardContent>
              {todayItems.length === 0 ? (
                <p className="text-xs text-muted-foreground py-2">No tasks scheduled for today.</p>
              ) : (
                <div className="space-y-1 max-h-[200px] overflow-y-auto">
                  {todayItems.map((item) => {
                    const member = team.find(m => m.id === item.assigneeId);
                    return (
                      <div key={item.id} className={`flex items-center gap-2 p-1.5 rounded text-xs ${item.status === "completed" ? "opacity-50 line-through" : ""}`}>
                        <Checkbox checked={item.status === "completed"} onCheckedChange={async (v) => { await apiRequest("PATCH", `/api/schedule/${item.id}`, { status: v ? "completed" : "pending" }); refetchSchedule(); }} />
                        <span className="flex-1">{item.title}</span>
                        {member && <span className="text-[10px] text-muted-foreground">{member.name}</span>}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── AI Settings Tab ─────────────────────────────────────────────────

function AiSettingsTab() {
  const { toast } = useToast();
  const { data: config, isLoading } = useQuery<AiConfig>({ queryKey: ["/api/ai-config"] });
  const [enabled, setEnabled] = useState(false);
  const [model, setModel] = useState("claude-sonnet-4-20250514");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [maxTokens, setMaxTokens] = useState(1024);

  useEffect(() => { if (config) { setEnabled(config.enabled); setModel(config.model); setSystemPrompt(config.systemPrompt); setWelcomeMessage(config.welcomeMessage); setMaxTokens(config.maxTokens); } }, [config]);

  const saveMutation = useMutation({
    mutationFn: async (data: Partial<AiConfig>) => { const res = await apiRequest("PATCH", "/api/ai-config", data); return res.json(); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/ai-config"] }); toast({ title: "Settings saved" }); },
    onError: (err: Error) => { toast({ title: "Error", description: err.message, variant: "destructive" }); },
  });
  const toggleMutation = useMutation({
    mutationFn: async (v: boolean) => { const res = await apiRequest("PATCH", "/api/ai-config", { enabled: v }); return res.json(); },
    onSuccess: (data: AiConfig) => { setEnabled(data.enabled); queryClient.invalidateQueries({ queryKey: ["/api/ai-config"] }); toast({ title: data.enabled ? "AI Enabled" : "AI Disabled" }); },
  });

  if (isLoading) return <div className="py-12 text-center text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <div><h2 className="text-lg font-bold flex items-center gap-2"><Bot className="w-5 h-5 text-primary" />AI Chatbot Settings</h2><p className="text-xs text-muted-foreground mt-1">Configure the AI assistant on your main website</p></div>
      <Card className="overflow-visible border-primary/10">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-primary/5 to-transparent" />
        <CardContent className="p-5 relative">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-md bg-primary/15 flex items-center justify-center"><Zap className="w-5 h-5 text-primary" /></div><div><p className="text-sm font-semibold">Agent Status</p><p className="text-xs text-muted-foreground">Turn chatbot on or off</p></div></div>
            <div className="flex items-center gap-3"><Badge variant={enabled ? "default" : "outline"}>{enabled ? "Active" : "Inactive"}</Badge><Switch checked={enabled} onCheckedChange={(v) => { setEnabled(v); toggleMutation.mutate(v); }} /></div>
          </div>
        </CardContent>
      </Card>
      <Card className="overflow-visible border-border/50"><CardContent className="p-5 space-y-4">
        <div className="flex items-center gap-3 mb-2"><div className="w-10 h-10 rounded-md bg-chart-2/15 flex items-center justify-center"><Settings className="w-5 h-5 text-chart-2" /></div><div><p className="text-sm font-semibold">Model Settings</p></div></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5"><Label className="text-xs">AI Model</Label><Select value={model} onValueChange={setModel}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{MODELS.map((m) => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-1.5"><Label className="text-xs">Max Response Length</Label><Select value={String(maxTokens)} onValueChange={(v) => setMaxTokens(Number(v))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="512">Short (512)</SelectItem><SelectItem value="1024">Medium (1024)</SelectItem><SelectItem value="2048">Long (2048)</SelectItem><SelectItem value="4096">Very Long (4096)</SelectItem></SelectContent></Select></div>
        </div>
      </CardContent></Card>
      <Card className="overflow-visible border-border/50"><CardContent className="p-5 space-y-4">
        <div className="flex items-center gap-3 mb-2"><div className="w-10 h-10 rounded-md bg-chart-4/15 flex items-center justify-center"><MessageSquare className="w-5 h-5 text-chart-4" /></div><div><p className="text-sm font-semibold">Chat Configuration</p></div></div>
        <div className="space-y-1.5"><Label className="text-xs">System Prompt</Label><Textarea value={systemPrompt} onChange={(e) => setSystemPrompt(e.target.value)} rows={6} className="resize-none text-sm" /></div>
        <div className="space-y-1.5"><Label className="text-xs">Welcome Message</Label><Textarea value={welcomeMessage} onChange={(e) => setWelcomeMessage(e.target.value)} rows={3} className="resize-none text-sm" /></div>
      </CardContent></Card>
      <div className="flex justify-end"><Button onClick={() => saveMutation.mutate({ model, systemPrompt, welcomeMessage, maxTokens })} disabled={saveMutation.isPending}><Save className="w-4 h-4" />{saveMutation.isPending ? "Saving..." : "Save Settings"}</Button></div>
    </div>
  );
}
