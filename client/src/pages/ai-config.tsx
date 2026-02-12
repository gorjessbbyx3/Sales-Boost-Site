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
} from "lucide-react";
import type { AiConfig } from "@shared/schema";
import { useState, useEffect, useMemo } from "react";

// ─── Types ───────────────────────────────────────────────────────────

type LeadStatus = "new" | "contacted" | "demo" | "proposal" | "won" | "lost";
type PackageType = "terminal" | "trial" | "online";
type MaintenancePlan = "none" | "basic" | "pro" | "premium";

interface Lead {
  id: string;
  name: string;
  business: string;
  phone: string;
  email: string;
  package: PackageType;
  status: LeadStatus;
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

// ─── Helpers ─────────────────────────────────────────────────────────

function today() {
  return new Date().toISOString().split("T")[0];
}

// ─── Constants ───────────────────────────────────────────────────────

const LEAD_STATUS_CONFIG: Record<LeadStatus, { label: string; color: string; bg: string }> = {
  new: { label: "New", color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20" },
  contacted: { label: "Contacted", color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/20" },
  demo: { label: "Demo Set", color: "text-purple-400", bg: "bg-purple-400/10 border-purple-400/20" },
  proposal: { label: "Proposal", color: "text-orange-400", bg: "bg-orange-400/10 border-orange-400/20" },
  won: { label: "Won", color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20" },
  lost: { label: "Lost", color: "text-red-400", bg: "bg-red-400/10 border-red-400/20" },
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
  "terminal-sale": "Terminal Sale",
  "trial-convert": "Trial Conversion",
  "maintenance": "Maintenance Plan",
  "one-off-update": "One-Off Update",
  "website-addon": "Website Add-On",
  "other": "Other",
};

const MODELS = [
  { value: "claude-sonnet-4-20250514", label: "Claude Sonnet 4 (Latest)" },
  { value: "claude-3-7-sonnet-20250219", label: "Claude 3.7 Sonnet" },
  { value: "claude-3-5-haiku-20241022", label: "Claude 3.5 Haiku (Fast)" },
];

// ─── Login ───────────────────────────────────────────────────────────

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: async (pw: string) => {
      const res = await apiRequest("POST", "/api/admin/login", { password: pw });
      return res.json();
    },
    onSuccess: () => {
      onLogin();
      toast({ title: "Logged in", description: "Welcome to the admin panel." });
    },
    onError: () => {
      setError("Invalid password. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    loginMutation.mutate(password);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-sm overflow-visible border-primary/10">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-primary/5 to-transparent" />
        <CardHeader className="text-center relative">
          <div className="w-14 h-14 rounded-md bg-primary/15 flex items-center justify-center mx-auto mb-3">
            <Lock className="w-7 h-7 text-primary" />
          </div>
          <CardTitle className="text-xl">Admin Access</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Enter your admin password to continue</p>
        </CardHeader>
        <CardContent className="relative">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-muted rounded-md px-3 h-9 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary/50"
                placeholder="Enter admin password"
              />
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={loginMutation.isPending || !password}>
              {loginMutation.isPending ? "Logging in..." : "Log In"}
            </Button>
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

  const { data: authStatus } = useQuery<{ authenticated: boolean }>({
    queryKey: ["/api/admin/check"],
  });

  useEffect(() => {
    if (authStatus !== undefined) {
      setIsAuthenticated(authStatus.authenticated);
      setAuthChecked(true);
    }
  }, [authStatus]);

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/admin/logout");
    },
    onSuccess: () => {
      setIsAuthenticated(false);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/check"] });
    },
  });

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <AdminLogin
        onLogin={() => {
          setIsAuthenticated(true);
          queryClient.invalidateQueries({ queryKey: ["/api/admin/check"] });
        }}
      />
    );
  }

  return <AdminDashboard onLogout={() => logoutMutation.mutate()} />;
}

// ─── Dashboard Shell ─────────────────────────────────────────────────

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState("overview");

  const mainDomain = window.location.hostname.startsWith("admin.")
    ? `https://${window.location.hostname.replace("admin.", "")}`
    : "/";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <a href={mainDomain} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </a>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-primary/15 flex items-center justify-center">
                  <LayoutDashboard className="w-4 h-4 text-primary" />
                </div>
                <h1 className="text-sm font-bold">TechSavvy Admin</h1>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onLogout} className="text-muted-foreground">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline ml-1.5">Log Out</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-border/50 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-transparent h-auto p-0 gap-0 rounded-none w-full justify-start overflow-x-auto">
              {[
                { value: "overview", icon: BarChart3, label: "Dashboard" },
                { value: "leads", icon: UserPlus, label: "Leads" },
                { value: "clients", icon: Users, label: "Clients" },
                { value: "revenue", icon: DollarSign, label: "Revenue" },
                { value: "tasks", icon: ClipboardList, label: "Tasks" },
                { value: "ai", icon: Bot, label: "AI Chat" },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-3 sm:px-4 py-3 text-xs sm:text-sm gap-1.5 shrink-0"
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="overview"><OverviewTab /></TabsContent>
          <TabsContent value="leads"><LeadsTab /></TabsContent>
          <TabsContent value="clients"><ClientsTab /></TabsContent>
          <TabsContent value="revenue"><RevenueTab /></TabsContent>
          <TabsContent value="tasks"><TasksTab /></TabsContent>
          <TabsContent value="ai"><AiSettingsTab /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// ─── Overview Tab ────────────────────────────────────────────────────

function OverviewTab() {
  const { data: leads = [] } = useQuery<Lead[]>({ queryKey: ["/api/leads"] });
  const { data: clients = [] } = useQuery<Client[]>({ queryKey: ["/api/clients"] });
  const { data: revenue = [] } = useQuery<RevenueEntry[]>({ queryKey: ["/api/revenue"] });
  const { data: tasks = [] } = useQuery<Task[]>({ queryKey: ["/api/tasks"] });

  const activeLeads = leads.filter((l) => !["won", "lost"].includes(l.status));
  const wonThisMonth = leads.filter((l) => {
    const d = new Date(l.updatedAt);
    const now = new Date();
    return l.status === "won" && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const monthlyRecurring = clients.reduce((sum, c) => {
    const prices: Record<MaintenancePlan, number> = { none: 0, basic: 99, pro: 199, premium: 399 };
    return sum + prices[c.maintenance];
  }, 0);

  const thisMonthRevenue = revenue.filter((r) => {
    const d = new Date(r.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).reduce((sum, r) => sum + r.amount, 0);

  const pendingTasks = tasks.filter((t) => !t.completed);
  const overdueTasks = pendingTasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date(today()));

  const recentLeads = [...leads].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
  const upcomingTasks = [...pendingTasks].sort((a, b) => (a.dueDate || "9").localeCompare(b.dueDate || "9")).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <MetricCard icon={UserPlus} label="Active Leads" value={activeLeads.length.toString()} subtext={`${wonThisMonth.length} won this month`} color="text-blue-400" bgColor="bg-blue-400/10" />
        <MetricCard icon={Users} label="Total Clients" value={clients.length.toString()} subtext={`${clients.filter((c) => c.maintenance !== "none").length} on maintenance`} color="text-emerald-400" bgColor="bg-emerald-400/10" />
        <MetricCard icon={TrendingUp} label="Monthly Recurring" value={`$${monthlyRecurring.toLocaleString()}`} subtext={`${clients.filter((c) => c.maintenance !== "none").length} active plans`} color="text-primary" bgColor="bg-primary/10" />
        <MetricCard icon={DollarSign} label="Revenue This Month" value={`$${thisMonthRevenue.toLocaleString()}`} subtext={`${revenue.filter((r) => { const d = new Date(r.date); const n = new Date(); return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear(); }).length} transactions`} color="text-chart-4" bgColor="bg-chart-4/10" />
      </div>

      {overdueTasks.length > 0 && (
        <Card className="border-destructive/30 overflow-visible">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-destructive/10 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 text-destructive" />
            </div>
            <div>
              <p className="text-sm font-medium text-destructive">{overdueTasks.length} overdue task{overdueTasks.length > 1 ? "s" : ""}</p>
              <p className="text-xs text-muted-foreground">Check your task list for follow-ups</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="overflow-visible border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-blue-400" />
              Recent Leads
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {recentLeads.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No leads yet. Add your first lead to get started.</p>
            ) : (
              <div className="space-y-2">
                {recentLeads.map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between gap-3 py-2 border-b border-border/30 last:border-0">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{lead.business || lead.name}</p>
                      <p className="text-xs text-muted-foreground">{PACKAGE_CONFIG[lead.package].label}</p>
                    </div>
                    <Badge variant="outline" className={`text-[10px] shrink-0 ${LEAD_STATUS_CONFIG[lead.status].bg} ${LEAD_STATUS_CONFIG[lead.status].color}`}>
                      {LEAD_STATUS_CONFIG[lead.status].label}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="overflow-visible border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-chart-4" />
              Upcoming Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {upcomingTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No pending tasks. You're all caught up!</p>
            ) : (
              <div className="space-y-2">
                {upcomingTasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-3 py-2 border-b border-border/30 last:border-0">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${task.priority === "high" ? "bg-red-400" : task.priority === "medium" ? "bg-yellow-400" : "bg-blue-400"}`} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm truncate">{task.title}</p>
                      {task.dueDate && (
                        <p className={`text-xs ${new Date(task.dueDate) < new Date(today()) ? "text-destructive" : "text-muted-foreground"}`}>
                          Due {task.dueDate}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-visible border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            Lead Pipeline
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {(Object.keys(LEAD_STATUS_CONFIG) as LeadStatus[]).map((status) => {
              const count = leads.filter((l) => l.status === status).length;
              return (
                <div key={status} className="text-center py-3 rounded-lg bg-muted/30">
                  <div className={`text-lg sm:text-2xl font-bold ${LEAD_STATUS_CONFIG[status].color}`}>{count}</div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground">{LEAD_STATUS_CONFIG[status].label}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-visible border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-400" />
            Client Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(["terminal", "trial", "online"] as PackageType[]).map((pkg) => {
              const count = clients.filter((c) => c.package === pkg).length;
              return (
                <div key={pkg} className="text-center py-3 rounded-lg bg-muted/30">
                  <div className={`text-lg font-bold ${PACKAGE_CONFIG[pkg].color}`}>{count}</div>
                  <div className="text-xs text-muted-foreground">{PACKAGE_CONFIG[pkg].label}</div>
                </div>
              );
            })}
            <div className="text-center py-3 rounded-lg bg-muted/30">
              <div className="text-lg font-bold text-primary">{clients.filter((c) => c.websiteStatus === "live").length}</div>
              <div className="text-xs text-muted-foreground">Websites Live</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, subtext, color, bgColor }: {
  icon: React.ElementType; label: string; value: string; subtext: string; color: string; bgColor: string;
}) {
  return (
    <Card className="overflow-visible border-border/50">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-9 h-9 rounded-md ${bgColor} flex items-center justify-center`}>
            <Icon className={`w-4 h-4 ${color}`} />
          </div>
          <span className="text-xs text-muted-foreground">{label}</span>
        </div>
        <div className="text-xl sm:text-2xl font-extrabold">{value}</div>
        <div className="text-[10px] sm:text-xs text-muted-foreground mt-1">{subtext}</div>
      </CardContent>
    </Card>
  );
}

// ─── Leads Tab ───────────────────────────────────────────────────────

function LeadsTab() {
  const { data: leads = [], refetch } = useQuery<Lead[]>({ queryKey: ["/api/leads"] });
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<LeadStatus | "all">("all");
  const { toast } = useToast();

  const createMutation = useMutation({
    mutationFn: async (data: Partial<Lead>) => {
      const res = await apiRequest("POST", "/api/leads", data);
      return res.json();
    },
    onSuccess: () => { refetch(); toast({ title: "Lead added" }); setShowForm(false); setEditingLead(null); },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Lead> & { id: string }) => {
      const res = await apiRequest("PATCH", `/api/leads/${id}`, data);
      return res.json();
    },
    onSuccess: () => { refetch(); toast({ title: "Lead updated" }); setShowForm(false); setEditingLead(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { await apiRequest("DELETE", `/api/leads/${id}`); },
    onSuccess: () => { refetch(); toast({ title: "Lead deleted" }); },
  });

  const convertMutation = useMutation({
    mutationFn: async (lead: Lead) => {
      await apiRequest("POST", "/api/clients", {
        name: lead.name, business: lead.business, phone: lead.phone, email: lead.email,
        package: lead.package, maintenance: "none", websiteUrl: "", websiteStatus: "not-started",
        terminalId: "", monthlyVolume: 0, startDate: today(), notes: lead.notes,
      });
      await apiRequest("PATCH", `/api/leads/${lead.id}`, { status: "won" });
    },
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      toast({ title: "Lead converted to client" });
    },
  });

  const filteredLeads = useMemo(() => {
    return leads
      .filter((l) => filterStatus === "all" || l.status === filterStatus)
      .filter((l) => !search || [l.name, l.business, l.email, l.phone].some((f) => f.toLowerCase().includes(search.toLowerCase())))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [leads, filterStatus, search]);

  const handleSave = (form: Partial<Lead>) => {
    if (editingLead) {
      updateMutation.mutate({ ...form, id: editingLead.id } as Lead & { id: string });
    } else {
      createMutation.mutate(form);
    }
  };

  const handleStatusChange = (id: string, status: LeadStatus) => {
    updateMutation.mutate({ id, status } as any);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">Lead Management</h2>
          <p className="text-xs text-muted-foreground">{leads.length} total leads — {leads.filter((l) => !["won", "lost"].includes(l.status)).length} active</p>
        </div>
        <Button size="sm" onClick={() => { setEditingLead(null); setShowForm(true); }}>
          <Plus className="w-3.5 h-3.5" />
          Add Lead
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input placeholder="Search leads..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
        </div>
        <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as LeadStatus | "all")}>
          <SelectTrigger className="w-full sm:w-40 h-9">
            <Filter className="w-3.5 h-3.5 mr-1.5" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {(Object.keys(LEAD_STATUS_CONFIG) as LeadStatus[]).map((s) => (
              <SelectItem key={s} value={s}>{LEAD_STATUS_CONFIG[s].label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredLeads.length === 0 ? (
        <Card className="overflow-visible border-dashed">
          <CardContent className="p-8 text-center">
            <UserPlus className="w-8 h-8 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">{leads.length === 0 ? "No leads yet. Click 'Add Lead' to start tracking." : "No leads match your filters."}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filteredLeads.map((lead) => (
            <Card key={lead.id} className="overflow-visible border-border/50">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-semibold text-sm">{lead.business || lead.name}</span>
                      <Badge variant="outline" className={`text-[10px] ${LEAD_STATUS_CONFIG[lead.status].bg} ${LEAD_STATUS_CONFIG[lead.status].color}`}>
                        {LEAD_STATUS_CONFIG[lead.status].label}
                      </Badge>
                      <Badge variant="outline" className={`text-[10px] ${PACKAGE_CONFIG[lead.package].color}`}>
                        {PACKAGE_CONFIG[lead.package].label}
                      </Badge>
                    </div>
                    {lead.business && lead.name && <p className="text-xs text-muted-foreground">{lead.name}</p>}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs text-muted-foreground">
                      {lead.phone && <a href={`tel:${lead.phone}`} className="flex items-center gap-1 hover:text-foreground"><Phone className="w-3 h-3" />{lead.phone}</a>}
                      {lead.email && <a href={`mailto:${lead.email}`} className="flex items-center gap-1 hover:text-foreground"><Mail className="w-3 h-3" />{lead.email}</a>}
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(lead.createdAt).toLocaleDateString()}</span>
                    </div>
                    {lead.notes && <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{lead.notes}</p>}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {lead.status !== "won" && lead.status !== "lost" && (
                      <Select value={lead.status} onValueChange={(v) => handleStatusChange(lead.id, v as LeadStatus)}>
                        <SelectTrigger className="h-7 w-24 text-[10px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {(Object.keys(LEAD_STATUS_CONFIG) as LeadStatus[]).map((s) => (
                            <SelectItem key={s} value={s} className="text-xs">{LEAD_STATUS_CONFIG[s].label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    {lead.status !== "won" && lead.status !== "lost" && (
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-emerald-400" onClick={() => convertMutation.mutate(lead)} title="Convert to client">
                        <CheckCircle className="w-3.5 h-3.5" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditingLead(lead); setShowForm(true); }}>
                      <Edit3 className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteMutation.mutate(lead.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <LeadFormDialog open={showForm} onClose={() => { setShowForm(false); setEditingLead(null); }} onSave={handleSave} lead={editingLead} />
    </div>
  );
}

function LeadFormDialog({ open, onClose, onSave, lead }: {
  open: boolean; onClose: () => void; onSave: (form: Partial<Lead>) => void; lead: Lead | null;
}) {
  const [form, setForm] = useState<Partial<Lead>>({});
  useEffect(() => {
    if (open) setForm(lead || { name: "", business: "", phone: "", email: "", package: "terminal", status: "new", notes: "" });
  }, [open, lead]);
  const set = (key: keyof Lead, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{lead ? "Edit Lead" : "Add New Lead"}</DialogTitle>
          <DialogDescription>Track a new sales opportunity</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label className="text-xs">Contact Name</Label><Input value={form.name || ""} onChange={(e) => set("name", e.target.value)} placeholder="John Doe" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Business Name</Label><Input value={form.business || ""} onChange={(e) => set("business", e.target.value)} placeholder="Aloha Café" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label className="text-xs">Phone</Label><Input value={form.phone || ""} onChange={(e) => set("phone", e.target.value)} placeholder="808-555-1234" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Email</Label><Input value={form.email || ""} onChange={(e) => set("email", e.target.value)} placeholder="john@aloha.com" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Interested In</Label>
              <Select value={form.package || "terminal"} onValueChange={(v) => set("package", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="terminal">Terminal ($399)</SelectItem>
                  <SelectItem value="trial">30-Day Trial</SelectItem>
                  <SelectItem value="online">Online (Free)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Status</Label>
              <Select value={form.status || "new"} onValueChange={(v) => set("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(LEAD_STATUS_CONFIG) as LeadStatus[]).map((s) => (
                    <SelectItem key={s} value={s}>{LEAD_STATUS_CONFIG[s].label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Notes</Label>
            <Textarea value={form.notes || ""} onChange={(e) => set("notes", e.target.value)} rows={3} placeholder="Any details about this lead..." className="resize-none text-sm" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave(form)} disabled={!form.name && !form.business}><Save className="w-3.5 h-3.5" />{lead ? "Update" : "Add Lead"}</Button>
        </DialogFooter>
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

  const createMutation = useMutation({
    mutationFn: async (data: Partial<Client>) => { const res = await apiRequest("POST", "/api/clients", data); return res.json(); },
    onSuccess: () => { refetch(); toast({ title: "Client added" }); setShowForm(false); setEditingClient(null); },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Client> & { id: string }) => { const res = await apiRequest("PATCH", `/api/clients/${id}`, data); return res.json(); },
    onSuccess: () => { refetch(); toast({ title: "Client updated" }); setShowForm(false); setEditingClient(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { await apiRequest("DELETE", `/api/clients/${id}`); },
    onSuccess: () => { refetch(); toast({ title: "Client removed" }); },
  });

  const filteredClients = useMemo(() => {
    return clients
      .filter((c) => !search || [c.name, c.business, c.email].some((f) => f.toLowerCase().includes(search.toLowerCase())))
      .sort((a, b) => a.business.localeCompare(b.business));
  }, [clients, search]);

  const handleSave = (form: Partial<Client>) => {
    if (editingClient) { updateMutation.mutate({ ...form, id: editingClient.id } as Client & { id: string }); }
    else { createMutation.mutate(form); }
  };

  const WEBSITE_STATUS: Record<string, { label: string; color: string }> = {
    "not-started": { label: "Not Started", color: "text-muted-foreground" },
    "in-progress": { label: "In Progress", color: "text-yellow-400" },
    "live": { label: "Live", color: "text-emerald-400" },
    "self-hosted": { label: "Self-Hosted", color: "text-blue-400" },
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div><h2 className="text-lg font-bold">Client Directory</h2><p className="text-xs text-muted-foreground">{clients.length} active merchants</p></div>
        <Button size="sm" onClick={() => { setEditingClient(null); setShowForm(true); }}><Plus className="w-3.5 h-3.5" />Add Client</Button>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <Input placeholder="Search clients..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
      </div>

      {filteredClients.length === 0 ? (
        <Card className="overflow-visible border-dashed">
          <CardContent className="p-8 text-center">
            <Building className="w-8 h-8 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">{clients.length === 0 ? "No clients yet. Add clients or convert leads." : "No clients match your search."}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filteredClients.map((client) => (
            <Card key={client.id} className="overflow-visible border-border/50">
              <CardContent className="p-3 sm:p-4">
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
                      <span className="flex items-center gap-1"><Globe className="w-3 h-3" />Website: <span className={WEBSITE_STATUS[client.websiteStatus]?.color}>{WEBSITE_STATUS[client.websiteStatus]?.label}</span></span>
                      {client.websiteUrl && <a href={client.websiteUrl.startsWith("http") ? client.websiteUrl : `https://${client.websiteUrl}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-foreground text-primary"><ArrowUpRight className="w-3 h-3" />{client.websiteUrl}</a>}
                      {client.monthlyVolume > 0 && <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />${client.monthlyVolume.toLocaleString()}/mo volume</span>}
                    </div>
                    {client.notes && <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{client.notes}</p>}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditingClient(client); setShowForm(true); }}><Edit3 className="w-3.5 h-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteMutation.mutate(client.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ClientFormDialog open={showForm} onClose={() => { setShowForm(false); setEditingClient(null); }} onSave={handleSave} client={editingClient} />
    </div>
  );
}

function ClientFormDialog({ open, onClose, onSave, client }: {
  open: boolean; onClose: () => void; onSave: (form: Partial<Client>) => void; client: Client | null;
}) {
  const [form, setForm] = useState<Partial<Client>>({});
  useEffect(() => {
    if (open) setForm(client || { name: "", business: "", phone: "", email: "", package: "terminal", maintenance: "none", websiteUrl: "", websiteStatus: "not-started", terminalId: "", monthlyVolume: 0, startDate: today(), notes: "" });
  }, [open, client]);
  const set = (key: keyof Client, value: string | number) => setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{client ? "Edit Client" : "Add New Client"}</DialogTitle>
          <DialogDescription>Manage merchant details and services</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label className="text-xs">Contact Name</Label><Input value={form.name || ""} onChange={(e) => set("name", e.target.value)} /></div>
            <div className="space-y-1.5"><Label className="text-xs">Business Name</Label><Input value={form.business || ""} onChange={(e) => set("business", e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label className="text-xs">Phone</Label><Input value={form.phone || ""} onChange={(e) => set("phone", e.target.value)} /></div>
            <div className="space-y-1.5"><Label className="text-xs">Email</Label><Input value={form.email || ""} onChange={(e) => set("email", e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Package</Label>
              <Select value={form.package || "terminal"} onValueChange={(v) => set("package", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="terminal">Terminal ($399)</SelectItem><SelectItem value="trial">30-Day Trial</SelectItem><SelectItem value="online">Online (Free)</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Maintenance Plan</Label>
              <Select value={form.maintenance || "none"} onValueChange={(v) => set("maintenance", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="none">None / Self-Hosted</SelectItem><SelectItem value="basic">Basic ($50/mo)</SelectItem><SelectItem value="pro">Pro ($199/mo)</SelectItem><SelectItem value="premium">Premium ($399/mo)</SelectItem></SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Website Status</Label>
              <Select value={form.websiteStatus || "not-started"} onValueChange={(v) => set("websiteStatus", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="not-started">Not Started</SelectItem><SelectItem value="in-progress">In Progress</SelectItem><SelectItem value="live">Live</SelectItem><SelectItem value="self-hosted">Self-Hosted</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5"><Label className="text-xs">Website URL</Label><Input value={form.websiteUrl || ""} onChange={(e) => set("websiteUrl", e.target.value)} placeholder="example.com" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label className="text-xs">Terminal ID</Label><Input value={form.terminalId || ""} onChange={(e) => set("terminalId", e.target.value)} placeholder="TID-XXXXX" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Monthly Volume ($)</Label><Input type="number" value={form.monthlyVolume || ""} onChange={(e) => set("monthlyVolume", Number(e.target.value))} placeholder="10000" /></div>
          </div>
          <div className="space-y-1.5"><Label className="text-xs">Start Date</Label><Input type="date" value={form.startDate || today()} onChange={(e) => set("startDate", e.target.value)} /></div>
          <div className="space-y-1.5"><Label className="text-xs">Notes</Label><Textarea value={form.notes || ""} onChange={(e) => set("notes", e.target.value)} rows={3} className="resize-none text-sm" /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave(form)} disabled={!form.name && !form.business}><Save className="w-3.5 h-3.5" />{client ? "Update" : "Add Client"}</Button>
        </DialogFooter>
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

  const createMutation = useMutation({
    mutationFn: async (data: Partial<RevenueEntry>) => { const res = await apiRequest("POST", "/api/revenue", data); return res.json(); },
    onSuccess: () => { refetch(); toast({ title: "Revenue recorded" }); setShowForm(false); setEditingEntry(null); },
  });
  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<RevenueEntry> & { id: string }) => { const res = await apiRequest("PATCH", `/api/revenue/${id}`, data); return res.json(); },
    onSuccess: () => { refetch(); toast({ title: "Entry updated" }); setShowForm(false); setEditingEntry(null); },
  });
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { await apiRequest("DELETE", `/api/revenue/${id}`); },
    onSuccess: () => { refetch(); toast({ title: "Entry deleted" }); },
  });

  const handleSave = (form: Partial<RevenueEntry>) => {
    if (editingEntry) { updateMutation.mutate({ ...form, id: editingEntry.id } as RevenueEntry & { id: string }); }
    else { createMutation.mutate(form); }
  };

  const now = new Date();
  const thisMonth = entries.filter((r) => { const d = new Date(r.date); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); });
  const lastMonth = entries.filter((r) => { const d = new Date(r.date); const lm = new Date(now.getFullYear(), now.getMonth() - 1, 1); return d.getMonth() === lm.getMonth() && d.getFullYear() === lm.getFullYear(); });
  const thisMonthTotal = thisMonth.reduce((s, r) => s + r.amount, 0);
  const lastMonthTotal = lastMonth.reduce((s, r) => s + r.amount, 0);
  const oneTimeThisMonth = thisMonth.filter((r) => !r.recurring).reduce((s, r) => s + r.amount, 0);
  const recurringThisMonth = thisMonth.filter((r) => r.recurring).reduce((s, r) => s + r.amount, 0);
  const mrrFromClients = clients.reduce((sum, c) => {
    const prices: Record<MaintenancePlan, number> = { none: 0, basic: 99, pro: 199, premium: 399 };
    return sum + prices[c.maintenance];
  }, 0);

  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div><h2 className="text-lg font-bold">Revenue Tracker</h2><p className="text-xs text-muted-foreground">{entries.length} total entries</p></div>
        <Button size="sm" onClick={() => { setEditingEntry(null); setShowForm(true); }}><Plus className="w-3.5 h-3.5" />Record Revenue</Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="overflow-visible border-border/50"><CardContent className="p-4">
          <p className="text-xs text-muted-foreground mb-1">This Month</p>
          <p className="text-xl font-extrabold text-primary">${thisMonthTotal.toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground mt-1">{lastMonthTotal > 0 ? (thisMonthTotal >= lastMonthTotal ? <span className="text-emerald-400 flex items-center gap-0.5"><ArrowUpRight className="w-3 h-3" /> vs last month</span> : <span className="text-red-400 flex items-center gap-0.5"><ArrowDownRight className="w-3 h-3" /> vs last month</span>) : "No prior month data"}</p>
        </CardContent></Card>
        <Card className="overflow-visible border-border/50"><CardContent className="p-4"><p className="text-xs text-muted-foreground mb-1">One-Time (This Mo)</p><p className="text-xl font-extrabold">${oneTimeThisMonth.toLocaleString()}</p><p className="text-[10px] text-muted-foreground mt-1">Terminals, conversions, add-ons</p></CardContent></Card>
        <Card className="overflow-visible border-border/50"><CardContent className="p-4"><p className="text-xs text-muted-foreground mb-1">Recurring (This Mo)</p><p className="text-xl font-extrabold text-chart-2">${recurringThisMonth.toLocaleString()}</p><p className="text-[10px] text-muted-foreground mt-1">Logged recurring entries</p></CardContent></Card>
        <Card className="overflow-visible border-border/50"><CardContent className="p-4"><p className="text-xs text-muted-foreground mb-1">Expected MRR</p><p className="text-xl font-extrabold text-emerald-400">${mrrFromClients.toLocaleString()}</p><p className="text-[10px] text-muted-foreground mt-1">From active maintenance plans</p></CardContent></Card>
      </div>

      {sorted.length === 0 ? (
        <Card className="overflow-visible border-dashed"><CardContent className="p-8 text-center"><DollarSign className="w-8 h-8 text-muted-foreground/50 mx-auto mb-3" /><p className="text-sm text-muted-foreground">No revenue entries yet. Record your first sale.</p></CardContent></Card>
      ) : (
        <Card className="overflow-visible border-border/50">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader><TableRow>
                <TableHead className="text-xs">Date</TableHead><TableHead className="text-xs">Type</TableHead><TableHead className="text-xs">Description</TableHead><TableHead className="text-xs text-right">Amount</TableHead><TableHead className="text-xs w-20"></TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {sorted.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="text-xs">{entry.date}</TableCell>
                    <TableCell className="text-xs"><div className="flex items-center gap-1.5">{entry.recurring && <Badge variant="outline" className="text-[9px] text-chart-2 border-chart-2/20">Recurring</Badge>}<span>{REVENUE_TYPES[entry.type]}</span></div></TableCell>
                    <TableCell className="text-xs text-muted-foreground">{entry.description}</TableCell>
                    <TableCell className="text-xs text-right font-semibold text-primary">${entry.amount.toLocaleString()}</TableCell>
                    <TableCell><div className="flex items-center gap-1 justify-end">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditingEntry(entry); setShowForm(true); }}><Edit3 className="w-3 h-3" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteMutation.mutate(entry.id)}><Trash2 className="w-3 h-3" /></Button>
                    </div></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      <RevenueFormDialog open={showForm} onClose={() => { setShowForm(false); setEditingEntry(null); }} onSave={handleSave} entry={editingEntry} clients={clients} />
    </div>
  );
}

function RevenueFormDialog({ open, onClose, onSave, entry, clients }: {
  open: boolean; onClose: () => void; onSave: (form: Partial<RevenueEntry>) => void; entry: RevenueEntry | null; clients: Client[];
}) {
  const [form, setForm] = useState<Partial<RevenueEntry>>({});
  useEffect(() => {
    if (open) setForm(entry || { date: today(), type: "terminal-sale", description: "", amount: 0, clientId: "", recurring: false });
  }, [open, entry]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>{entry ? "Edit Entry" : "Record Revenue"}</DialogTitle><DialogDescription>Track income from sales and services</DialogDescription></DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label className="text-xs">Date</Label><Input type="date" value={form.date || today()} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} /></div>
            <div className="space-y-1.5"><Label className="text-xs">Amount ($)</Label><Input type="number" value={form.amount || ""} onChange={(e) => setForm((p) => ({ ...p, amount: Number(e.target.value) }))} placeholder="399" /></div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Type</Label>
            <Select value={form.type || "terminal-sale"} onValueChange={(v) => setForm((p) => ({ ...p, type: v as RevenueEntry["type"] }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{Object.entries(REVENUE_TYPES).map(([k, v]) => (<SelectItem key={k} value={k}>{v}</SelectItem>))}</SelectContent>
            </Select>
          </div>
          {clients.length > 0 && (
            <div className="space-y-1.5">
              <Label className="text-xs">Client (optional)</Label>
              <Select value={form.clientId || "none"} onValueChange={(v) => setForm((p) => ({ ...p, clientId: v === "none" ? "" : v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="none">No client linked</SelectItem>{clients.map((c) => (<SelectItem key={c.id} value={c.id}>{c.business || c.name}</SelectItem>))}</SelectContent>
              </Select>
            </div>
          )}
          <div className="space-y-1.5"><Label className="text-xs">Description</Label><Input value={form.description || ""} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="Terminal sale for Aloha Café" /></div>
          <div className="flex items-center gap-2">
            <Switch checked={form.recurring || false} onCheckedChange={(v) => setForm((p) => ({ ...p, recurring: v }))} />
            <Label className="text-xs">Recurring revenue (maintenance plan, etc.)</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave(form)} disabled={!form.amount}><Save className="w-3.5 h-3.5" />{entry ? "Update" : "Record"}</Button>
        </DialogFooter>
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

  const createMutation = useMutation({
    mutationFn: async (data: Partial<Task>) => { const res = await apiRequest("POST", "/api/tasks", data); return res.json(); },
    onSuccess: () => { refetch(); toast({ title: "Task added" }); setShowForm(false); setEditingTask(null); },
  });
  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Task> & { id: string }) => { const res = await apiRequest("PATCH", `/api/tasks/${id}`, data); return res.json(); },
    onSuccess: () => { refetch(); },
  });
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { await apiRequest("DELETE", `/api/tasks/${id}`); },
    onSuccess: () => { refetch(); },
  });

  const handleSave = (form: Partial<Task>) => {
    if (editingTask) { updateMutation.mutate({ ...form, id: editingTask.id } as Task & { id: string }); setShowForm(false); setEditingTask(null); toast({ title: "Task updated" }); }
    else { createMutation.mutate(form); }
  };

  const toggleComplete = (task: Task) => {
    updateMutation.mutate({ id: task.id, completed: !task.completed });
  };

  const filtered = useMemo(() => {
    return tasks
      .filter((t) => filter === "all" || (filter === "pending" ? !t.completed : t.completed))
      .sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
        if (a.priority !== b.priority) return order[a.priority] - order[b.priority];
        return (a.dueDate || "9").localeCompare(b.dueDate || "9");
      });
  }, [tasks, filter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div><h2 className="text-lg font-bold">Tasks & Follow-Ups</h2><p className="text-xs text-muted-foreground">{tasks.filter((t) => !t.completed).length} pending — {tasks.filter((t) => t.completed).length} completed</p></div>
        <Button size="sm" onClick={() => { setEditingTask(null); setShowForm(true); }}><Plus className="w-3.5 h-3.5" />Add Task</Button>
      </div>

      <div className="flex gap-2">
        {(["pending", "all", "completed"] as const).map((f) => (
          <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" className="text-xs" onClick={() => setFilter(f)}>
            {f === "pending" ? "Pending" : f === "all" ? "All" : "Completed"}
          </Button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card className="overflow-visible border-dashed"><CardContent className="p-8 text-center"><CheckCircle className="w-8 h-8 text-muted-foreground/50 mx-auto mb-3" /><p className="text-sm text-muted-foreground">{tasks.length === 0 ? "No tasks yet. Add a follow-up or to-do." : "No tasks match this filter."}</p></CardContent></Card>
      ) : (
        <div className="space-y-1.5">
          {filtered.map((task) => (
            <Card key={task.id} className={`overflow-visible border-border/50 ${task.completed ? "opacity-60" : ""}`}>
              <CardContent className="p-3 flex items-center gap-3">
                <button onClick={() => toggleComplete(task)} className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${task.completed ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/30 hover:border-primary"}`}>
                  {task.completed && <Check className="w-3 h-3" />}
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${task.completed ? "line-through text-muted-foreground" : ""}`}>{task.title}</span>
                    <div className={`w-1.5 h-1.5 rounded-full ${task.priority === "high" ? "bg-red-400" : task.priority === "medium" ? "bg-yellow-400" : "bg-blue-400"}`} />
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground mt-0.5">
                    {task.dueDate && <span className={!task.completed && new Date(task.dueDate) < new Date(today()) ? "text-destructive font-medium" : ""}>Due {task.dueDate}</span>}
                    {task.linkedTo && <span>{task.linkedTo}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditingTask(task); setShowForm(true); }}><Edit3 className="w-3 h-3" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteMutation.mutate(task.id)}><Trash2 className="w-3 h-3" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <TaskFormDialog open={showForm} onClose={() => { setShowForm(false); setEditingTask(null); }} onSave={handleSave} task={editingTask} />
    </div>
  );
}

function TaskFormDialog({ open, onClose, onSave, task }: {
  open: boolean; onClose: () => void; onSave: (form: Partial<Task>) => void; task: Task | null;
}) {
  const [form, setForm] = useState<Partial<Task>>({});
  useEffect(() => {
    if (open) setForm(task || { title: "", dueDate: "", priority: "medium", completed: false, linkedTo: "" });
  }, [open, task]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>{task ? "Edit Task" : "Add Task"}</DialogTitle><DialogDescription>Create a follow-up or to-do</DialogDescription></DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5"><Label className="text-xs">Task</Label><Input value={form.title || ""} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="Follow up with Aloha Café about trial" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label className="text-xs">Due Date</Label><Input type="date" value={form.dueDate || ""} onChange={(e) => setForm((p) => ({ ...p, dueDate: e.target.value }))} /></div>
            <div className="space-y-1.5">
              <Label className="text-xs">Priority</Label>
              <Select value={form.priority || "medium"} onValueChange={(v) => setForm((p) => ({ ...p, priority: v as Task["priority"] }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="high">High</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="low">Low</SelectItem></SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5"><Label className="text-xs">Linked To (optional)</Label><Input value={form.linkedTo || ""} onChange={(e) => setForm((p) => ({ ...p, linkedTo: e.target.value }))} placeholder="Business name or reference" /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave(form)} disabled={!form.title}><Save className="w-3.5 h-3.5" />{task ? "Update" : "Add Task"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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

  useEffect(() => {
    if (config) { setEnabled(config.enabled); setModel(config.model); setSystemPrompt(config.systemPrompt); setWelcomeMessage(config.welcomeMessage); setMaxTokens(config.maxTokens); }
  }, [config]);

  const saveMutation = useMutation({
    mutationFn: async (data: Partial<AiConfig>) => { const res = await apiRequest("PATCH", "/api/ai-config", data); return res.json(); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/ai-config"] }); toast({ title: "Settings saved", description: "AI agent configuration updated." }); },
    onError: (err: Error) => { toast({ title: "Error", description: err.message, variant: "destructive" }); },
  });

  const toggleMutation = useMutation({
    mutationFn: async (newEnabled: boolean) => { const res = await apiRequest("PATCH", "/api/ai-config", { enabled: newEnabled }); return res.json(); },
    onSuccess: (data: AiConfig) => {
      setEnabled(data.enabled);
      queryClient.invalidateQueries({ queryKey: ["/api/ai-config"] });
      toast({ title: data.enabled ? "AI Agent Enabled" : "AI Agent Disabled", description: data.enabled ? "The chatbot is now live on your site." : "The chatbot has been turned off." });
    },
    onError: (err: Error) => { toast({ title: "Error", description: err.message, variant: "destructive" }); },
  });

  if (isLoading) return <div className="py-12 text-center text-muted-foreground">Loading AI configuration...</div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-lg font-bold flex items-center gap-2"><Bot className="w-5 h-5 text-primary" />AI Chatbot Settings</h2>
        <p className="text-xs text-muted-foreground mt-1">Configure the AI assistant on your main website</p>
      </div>

      <Card className="overflow-visible border-primary/10">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-primary/5 to-transparent" />
        <CardContent className="p-5 relative">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-primary/15 flex items-center justify-center"><Zap className="w-5 h-5 text-primary" /></div>
              <div><p className="text-sm font-semibold">Agent Status</p><p className="text-xs text-muted-foreground">Turn the chatbot on or off for visitors</p></div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={enabled ? "default" : "outline"}>{enabled ? "Active" : "Inactive"}</Badge>
              <Switch checked={enabled} onCheckedChange={(checked) => { setEnabled(checked); toggleMutation.mutate(checked); }} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-visible border-border/50">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-md bg-chart-2/15 flex items-center justify-center"><Settings className="w-5 h-5 text-chart-2" /></div>
            <div><p className="text-sm font-semibold">Model Settings</p><p className="text-xs text-muted-foreground">Choose AI model and response limits</p></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label className="text-xs">AI Model</Label><Select value={model} onValueChange={setModel}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{MODELS.map((m) => (<SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>))}</SelectContent></Select></div>
            <div className="space-y-1.5"><Label className="text-xs">Max Response Length</Label><Select value={String(maxTokens)} onValueChange={(v) => setMaxTokens(Number(v))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="512">Short (512)</SelectItem><SelectItem value="1024">Medium (1024)</SelectItem><SelectItem value="2048">Long (2048)</SelectItem><SelectItem value="4096">Very Long (4096)</SelectItem></SelectContent></Select></div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-visible border-border/50">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-md bg-chart-4/15 flex items-center justify-center"><MessageSquare className="w-5 h-5 text-chart-4" /></div>
            <div><p className="text-sm font-semibold">Chat Configuration</p><p className="text-xs text-muted-foreground">Customize personality and greeting</p></div>
          </div>
          <div className="space-y-1.5"><Label className="text-xs">System Prompt</Label><Textarea value={systemPrompt} onChange={(e) => setSystemPrompt(e.target.value)} rows={6} className="resize-none text-sm" /></div>
          <div className="space-y-1.5"><Label className="text-xs">Welcome Message</Label><Textarea value={welcomeMessage} onChange={(e) => setWelcomeMessage(e.target.value)} rows={3} className="resize-none text-sm" /></div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={() => saveMutation.mutate({ model, systemPrompt, welcomeMessage, maxTokens })} disabled={saveMutation.isPending}>
          <Save className="w-4 h-4" />{saveMutation.isPending ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}
