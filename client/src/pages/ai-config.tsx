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
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft, Bot, Save, Zap, Settings, MessageSquare, Lock, LogOut,
  LayoutDashboard, Users, DollarSign, ClipboardList, Phone, Mail,
  Plus, Trash2, Edit3, Check, TrendingUp, CreditCard, Globe,
  AlertTriangle, Calendar, Search, Filter,
  UserPlus, Building, CheckCircle,
  BarChart3, ArrowUpRight, ArrowDownRight,
  Plug, FolderOpen, Activity, FileText, Video, File, Bell, Send, RefreshCw, ExternalLink, Upload, Hash,
} from "lucide-react";
import type { AiConfig } from "@shared/schema";
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
  phone: string;
  email: string;
  package: PackageType;
  status: PipelineStage;
  source: LeadSource;
  vertical: Vertical;
  currentProcessor: string;
  monthlyVolume: string;
  painPoints: string;
  nextStep: string;
  nextStepDate: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
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

const ACTIVITY_COLORS: Record<string, string> = {
  lead: "bg-blue-400", client: "bg-emerald-400", revenue: "bg-purple-400",
  task: "bg-yellow-400", file: "bg-orange-400", integration: "bg-pink-400", auth: "bg-gray-400",
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
  const mainDomain = window.location.hostname.startsWith("admin.") ? `https://${window.location.hostname.replace("admin.", "")}` : "/";

  const tabs = [
    { value: "overview", icon: BarChart3, label: "Dashboard" },
    { value: "leads", icon: UserPlus, label: "Leads" },
    { value: "clients", icon: Users, label: "Clients" },
    { value: "revenue", icon: DollarSign, label: "Revenue" },
    { value: "tasks", icon: ClipboardList, label: "Tasks" },
    { value: "files", icon: FolderOpen, label: "Files" },
    { value: "integrations", icon: Plug, label: "Integrations" },
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
            <Button variant="ghost" size="sm" onClick={onLogout} className="text-muted-foreground"><LogOut className="w-4 h-4" /><span className="hidden sm:inline ml-1.5">Log Out</span></Button>
          </div>
        </div>
      </div>

      <div className="border-b border-border/50 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-transparent h-auto p-0 gap-0 rounded-none w-full justify-start overflow-x-auto">
              {tabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-3 sm:px-4 py-3 text-xs sm:text-sm gap-1.5 shrink-0">
                  <tab.icon className="w-3.5 h-3.5" /><span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="overview"><OverviewTab /></TabsContent>
          <TabsContent value="leads"><LeadsTab /></TabsContent>
          <TabsContent value="clients"><ClientsTab /></TabsContent>
          <TabsContent value="revenue"><RevenueTab /></TabsContent>
          <TabsContent value="tasks"><TasksTab /></TabsContent>
          <TabsContent value="files"><FilesTab /></TabsContent>
          <TabsContent value="integrations"><IntegrationsTab /></TabsContent>
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

function OverviewTab() {
  const { data: leads = [] } = useQuery<Lead[]>({ queryKey: ["/api/leads"] });
  const { data: clients = [] } = useQuery<Client[]>({ queryKey: ["/api/clients"] });
  const { data: revenueEntries = [] } = useQuery<RevenueEntry[]>({ queryKey: ["/api/revenue"] });
  const { data: tasks = [] } = useQuery<Task[]>({ queryKey: ["/api/tasks"] });
  const { data: activityData = [] } = useQuery<ActivityEntry[]>({ queryKey: ["/api/activity"] });
  const { data: slackCfg } = useQuery<SlackConfig>({ queryKey: ["/api/integrations/slack"] });
  const { data: filesData = [] } = useQuery<AdminFile[]>({ queryKey: ["/api/files"] });

  const activeLeads = leads.filter((l) => !["won", "lost", "nurture"].includes(l.status));
  const wonThisMonth = leads.filter((l) => { const d = new Date(l.updatedAt); const n = new Date(); return l.status === "won" && d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear(); });
  const monthlyRecurring = clients.reduce((sum, c) => { const p: Record<MaintenancePlan, number> = { none: 0, basic: 99, pro: 199, premium: 399 }; return sum + p[c.maintenance]; }, 0);
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

      {/* Channel Scorecard */}
      <Card className="overflow-visible border-border/50">
        <CardHeader className="pb-3"><CardTitle className="text-sm font-semibold flex items-center gap-2"><BarChart3 className="w-4 h-4 text-primary" />Channel Scorecard</CardTitle></CardHeader>
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
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-semibold text-sm">{lead.business || lead.name}</span>
                    <Badge variant="outline" className={`text-[10px] ${PIPELINE_CONFIG[lead.status].bg} ${PIPELINE_CONFIG[lead.status].color}`}>{PIPELINE_CONFIG[lead.status].short}</Badge>
                    <Badge variant="outline" className={`text-[10px] ${SOURCE_CONFIG[lead.source]?.color || ""}`}>{SOURCE_CONFIG[lead.source]?.label || lead.source}</Badge>
                    <Badge variant="outline" className={`text-[10px] ${PACKAGE_CONFIG[lead.package].color}`}>{PACKAGE_CONFIG[lead.package].label}</Badge>
                  </div>
                  {lead.business && lead.name && <p className="text-xs text-muted-foreground">{lead.name}</p>}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs text-muted-foreground">
                    {lead.phone && <a href={`tel:${lead.phone}`} className="flex items-center gap-1 hover:text-foreground"><Phone className="w-3 h-3" />{lead.phone}</a>}
                    {lead.email && <a href={`mailto:${lead.email}`} className="flex items-center gap-1 hover:text-foreground"><Mail className="w-3 h-3" />{lead.email}</a>}
                    {lead.vertical && <span className="text-[10px]">{VERTICAL_CONFIG[lead.vertical] || lead.vertical}</span>}
                    {lead.currentProcessor && <span className="text-[10px]">Processor: {lead.currentProcessor}</span>}
                    {lead.monthlyVolume && <span className="text-[10px]">Vol: {lead.monthlyVolume}</span>}
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(lead.createdAt).toLocaleDateString()}</span>
                  </div>
                  {lead.nextStep && <p className="text-xs text-primary mt-1.5">Next: {lead.nextStep}{lead.nextStepDate ? ` (${lead.nextStepDate})` : ""}</p>}
                  {lead.painPoints && <p className="text-[10px] text-muted-foreground mt-1">Pain: {lead.painPoints}</p>}
                  {lead.notes && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{lead.notes}</p>}
                </div>
                <div className="flex items-center gap-1 shrink-0">
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
    if (open) setForm(lead || { name: "", business: "", phone: "", email: "", package: "terminal", status: "new", source: "direct", vertical: "other", currentProcessor: "", monthlyVolume: "", painPoints: "", nextStep: "", nextStepDate: "", notes: "" });
  }, [open, lead]);
  const set = (key: keyof Lead, value: string) => setForm((p) => ({ ...p, [key]: value }));

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{lead ? "Edit Lead" : "Add New Lead"}</DialogTitle><DialogDescription>Track a sales opportunity through the pipeline</DialogDescription></DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label className="text-xs">Contact Name *</Label><Input value={form.name || ""} onChange={(e) => set("name", e.target.value)} placeholder="John Doe" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Business Name *</Label><Input value={form.business || ""} onChange={(e) => set("business", e.target.value)} placeholder="Aloha Cafe" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label className="text-xs">Phone</Label><Input value={form.phone || ""} onChange={(e) => set("phone", e.target.value)} placeholder="808-555-1234" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Email</Label><Input value={form.email || ""} onChange={(e) => set("email", e.target.value)} placeholder="john@aloha.com" /></div>
          </div>
          <div className="grid grid-cols-3 gap-3">
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
            <div className="space-y-1.5"><Label className="text-xs">Est. Monthly Volume</Label><Input value={form.monthlyVolume || ""} onChange={(e) => set("monthlyVolume", e.target.value)} placeholder="$5K-$10K" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Pain Points</Label><Input value={form.painPoints || ""} onChange={(e) => set("painPoints", e.target.value)} placeholder="High fees, old terminal..." /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label className="text-xs">Next Step</Label><Input value={form.nextStep || ""} onChange={(e) => set("nextStep", e.target.value)} placeholder="Statement review call" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Next Step Date</Label><Input type="date" value={form.nextStepDate || ""} onChange={(e) => set("nextStepDate", e.target.value)} /></div>
          </div>
          <div className="space-y-1.5"><Label className="text-xs">Notes</Label><Textarea value={form.notes || ""} onChange={(e) => set("notes", e.target.value)} rows={3} className="resize-none text-sm" placeholder="Details, observations..." /></div>
        </div>
        <DialogFooter><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={() => onSave(form)} disabled={!form.name && !form.business}><Save className="w-3.5 h-3.5" />{lead ? "Update" : "Add Lead"}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
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
          <div className="grid grid-cols-3 gap-3">
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
  const mrrFromClients = clients.reduce((sum, c) => { const p: Record<MaintenancePlan, number> = { none: 0, basic: 99, pro: 199, premium: 399 }; return sum + p[c.maintenance]; }, 0);
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
