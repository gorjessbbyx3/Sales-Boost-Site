import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import {
  Plus, Trash2, Edit3, Calendar, CheckCircle, Clock, Target,
  FolderKanban, ArrowRight, Search, Filter,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import type { Project, ProjectType, ProjectStatus, ProjectMilestone, Client } from "./types";
import { PROJECT_TYPE_CONFIG, PROJECT_STATUS_CONFIG } from "./constants";

const TEAM_MEMBERS_LIST = [
  { value: "kepa", label: "Kepa" },
  { value: "jessica", label: "Jessica" },
  { value: "joey", label: "Joey" },
  { value: "aaron", label: "Aaron" },
] as const;

function parseJSON<T>(val: any, fallback: T): T {
  if (Array.isArray(val)) return val as T;
  if (typeof val === "string") { try { return JSON.parse(val); } catch { return fallback; } }
  return fallback;
}

function today() { return new Date().toISOString().split("T")[0]; }

export default function ProjectsTab() {
  const { toast } = useToast();
  const { data: projects = [], refetch } = useQuery<Project[]>({ queryKey: ["/api/projects"] });
  const { data: clients = [] } = useQuery<Client[]>({ queryKey: ["/api/clients"] });
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [filterStatus, setFilterStatus] = useState<ProjectStatus | "all" | "active">("active");
  const [filterType, setFilterType] = useState<ProjectType | "all">("all");
  const [search, setSearch] = useState("");

  const createMut = useMutation({
    mutationFn: async (data: any) => { const r = await apiRequest("POST", "/api/projects", data); return r.json(); },
    onSuccess: () => { refetch(); setShowForm(false); toast({ title: "Project created" }); },
  });
  const updateMut = useMutation({
    mutationFn: async ({ id, ...data }: any) => { const r = await apiRequest("PATCH", `/api/projects/${id}`, data); return r.json(); },
    onSuccess: () => { refetch(); setShowForm(false); setEditingProject(null); toast({ title: "Project updated" }); },
  });
  const deleteMut = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/projects/${id}`),
    onSuccess: () => { refetch(); toast({ title: "Project deleted" }); },
  });

  const clientMap = useMemo(() => new Map(clients.map(c => [c.id, c])), [clients]);

  const activeStatuses: ProjectStatus[] = ["not-started", "discovery", "in-progress", "review", "revision"];
  const filtered = useMemo(() => {
    return projects
      .map(p => ({ ...p, milestones: parseJSON<ProjectMilestone[]>(p.milestones, []) }))
      .filter(p => {
        if (filterStatus === "active") return activeStatuses.includes(p.status);
        if (filterStatus !== "all" && p.status !== filterStatus) return false;
        if (filterType !== "all" && p.type !== filterType) return false;
        if (search) {
          const s = search.toLowerCase();
          const client = clientMap.get(p.clientId);
          return p.title.toLowerCase().includes(s) || (client?.business || "").toLowerCase().includes(s);
        }
        return true;
      })
      .sort((a, b) => {
        const order: Record<ProjectStatus, number> = { "in-progress": 0, review: 1, revision: 2, discovery: 3, "not-started": 4, launched: 5, complete: 6, "on-hold": 7 };
        return (order[a.status] ?? 5) - (order[b.status] ?? 5);
      });
  }, [projects, filterStatus, filterType, search, clientMap]);

  const stats = useMemo(() => {
    const all = projects.map(p => ({ ...p, milestones: parseJSON<ProjectMilestone[]>(p.milestones, []) }));
    return {
      active: all.filter(p => activeStatuses.includes(p.status)).length,
      review: all.filter(p => p.status === "review" || p.status === "revision").length,
      launched: all.filter(p => p.status === "launched" || p.status === "complete").length,
      total: all.length,
    };
  }, [projects]);

  const openCreate = () => { setEditingProject(null); setShowForm(true); };
  const openEdit = (p: Project) => { setEditingProject({ ...p, milestones: parseJSON(p.milestones, []) }); setShowForm(true); };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2" data-testid="text-projects-title"><FolderKanban className="w-5 h-5 text-primary" />Project Delivery</h2>
          <p className="text-xs text-muted-foreground">{stats.active} active, {stats.review} in review, {stats.launched} launched</p>
        </div>
        <Button size="sm" onClick={openCreate} data-testid="button-create-project"><Plus className="w-3.5 h-3.5 mr-1" />New Project</Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="overflow-visible border-border/50"><CardContent className="p-3.5"><div className="text-[10px] text-muted-foreground mb-1">Active</div><div className="text-2xl font-extrabold text-blue-400">{stats.active}</div></CardContent></Card>
        <Card className="overflow-visible border-border/50"><CardContent className="p-3.5"><div className="text-[10px] text-muted-foreground mb-1">In Review</div><div className="text-2xl font-extrabold text-amber-400">{stats.review}</div></CardContent></Card>
        <Card className="overflow-visible border-border/50"><CardContent className="p-3.5"><div className="text-[10px] text-muted-foreground mb-1">Launched</div><div className="text-2xl font-extrabold text-emerald-400">{stats.launched}</div></CardContent></Card>
        <Card className="overflow-visible border-border/50"><CardContent className="p-3.5"><div className="text-[10px] text-muted-foreground mb-1">Total</div><div className="text-2xl font-extrabold">{stats.total}</div></CardContent></Card>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input className="pl-8 h-8 text-xs" placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)} data-testid="input-search-projects" />
        </div>
        <Select value={filterStatus} onValueChange={v => setFilterStatus(v as any)}>
          <SelectTrigger className="w-[140px] h-8 text-xs"><Filter className="w-3 h-3 mr-1" /><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="all">All</SelectItem>
            {(Object.keys(PROJECT_STATUS_CONFIG) as ProjectStatus[]).map(s => (
              <SelectItem key={s} value={s}>{PROJECT_STATUS_CONFIG[s].label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterType} onValueChange={v => setFilterType(v as any)}>
          <SelectTrigger className="w-[140px] h-8 text-xs"><SelectValue placeholder="All Types" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {(Object.keys(PROJECT_TYPE_CONFIG) as ProjectType[]).map(t => (
              <SelectItem key={t} value={t}>{PROJECT_TYPE_CONFIG[t].label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <Card className="overflow-visible border-dashed"><CardContent className="p-8 text-center">
          <FolderKanban className="w-8 h-8 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No projects found.</p>
          <Button variant="outline" size="sm" className="mt-3 text-xs" onClick={openCreate}><Plus className="w-3 h-3 mr-1" />Create Project</Button>
        </CardContent></Card>
      ) : (
        <div className="space-y-2">
          {filtered.map(project => {
            const client = clientMap.get(project.clientId);
            const milestones = project.milestones;
            const completedMs = milestones.filter(m => m.completed).length;
            const totalMs = milestones.length;
            const progress = totalMs > 0 ? Math.round((completedMs / totalMs) * 100) : 0;
            const typeCfg = PROJECT_TYPE_CONFIG[project.type] || PROJECT_TYPE_CONFIG.other;
            const statusCfg = PROJECT_STATUS_CONFIG[project.status] || PROJECT_STATUS_CONFIG["not-started"];
            const daysLeft = project.targetDate ? Math.ceil((new Date(project.targetDate).getTime() - Date.now()) / 86400000) : null;

            return (
              <Card key={project.id} className="overflow-visible border-border/50 hover:border-primary/30 transition-colors" data-testid={`card-project-${project.id}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-sm">{typeCfg.icon}</span>
                        <h3 className="text-sm font-semibold truncate">{project.title}</h3>
                        <Badge variant="outline" className={`text-[10px] ${statusCfg.bg} ${statusCfg.color}`}>{statusCfg.label}</Badge>
                        <Badge variant="outline" className={`text-[10px] ${typeCfg.color}`}>{typeCfg.label}</Badge>
                      </div>
                      {client && <p className="text-xs text-muted-foreground">{client.business || client.name}</p>}
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs text-muted-foreground">
                        {project.assigneeId && <span className="flex items-center gap-1"><span className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-[8px] font-bold text-primary">{project.assigneeId.charAt(0).toUpperCase()}</span>{TEAM_MEMBERS_LIST.find(m => m.value === project.assigneeId)?.label || project.assigneeId}</span>}
                        {project.startDate && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Started {project.startDate}</span>}
                        {project.targetDate && (
                          <span className={`flex items-center gap-1 ${daysLeft !== null && daysLeft < 0 ? "text-red-400" : daysLeft !== null && daysLeft <= 3 ? "text-amber-400" : ""}`}>
                            <Target className="w-3 h-3" />Due {project.targetDate}
                            {daysLeft !== null && daysLeft < 0 && <span className="text-red-400 font-medium">({Math.abs(daysLeft)}d overdue)</span>}
                            {daysLeft !== null && daysLeft >= 0 && daysLeft <= 7 && <span>({daysLeft}d left)</span>}
                          </span>
                        )}
                        {project.launchDate && <span className="flex items-center gap-1 text-emerald-400"><CheckCircle className="w-3 h-3" />Launched {project.launchDate}</span>}
                      </div>
                      {totalMs > 0 && (
                        <div className="mt-2.5">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] text-muted-foreground">{completedMs}/{totalMs} milestones</span>
                            <span className="text-[10px] font-medium">{progress}%</span>
                          </div>
                          <Progress value={progress} className="h-1.5" />
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {milestones.map((m, i) => (
                              <button
                                key={m.id || i}
                                className={`text-[10px] px-1.5 py-0.5 rounded border cursor-pointer transition-colors ${m.completed ? "bg-emerald-400/10 border-emerald-400/20 text-emerald-400 line-through" : "bg-muted/30 border-border/50 text-muted-foreground hover:border-primary/30"}`}
                                onClick={() => {
                                  const updated = [...milestones];
                                  updated[i] = { ...m, completed: !m.completed, completedAt: !m.completed ? new Date().toISOString() : "" };
                                  updateMut.mutate({ id: project.id, milestones: updated });
                                }}
                                data-testid={`button-milestone-${project.id}-${i}`}
                              >
                                {m.completed ? <CheckCircle className="w-2.5 h-2.5 inline mr-0.5" /> : <Clock className="w-2.5 h-2.5 inline mr-0.5" />}
                                {m.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      {project.notes && <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{project.notes}</p>}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Select value={project.status} onValueChange={v => updateMut.mutate({ id: project.id, status: v })}>
                        <SelectTrigger className="h-7 w-7 p-0 border-0 bg-transparent [&>svg]:hidden"><ArrowRight className="w-3.5 h-3.5 text-muted-foreground" /></SelectTrigger>
                        <SelectContent>{(Object.keys(PROJECT_STATUS_CONFIG) as ProjectStatus[]).map(s => <SelectItem key={s} value={s} className="text-xs">{PROJECT_STATUS_CONFIG[s].label}</SelectItem>)}</SelectContent>
                      </Select>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(project)} data-testid={`button-edit-project-${project.id}`}><Edit3 className="w-3.5 h-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteMut.mutate(project.id)} data-testid={`button-delete-project-${project.id}`}><Trash2 className="w-3.5 h-3.5" /></Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <ProjectFormDialog
        open={showForm}
        onClose={() => { setShowForm(false); setEditingProject(null); }}
        onSave={(form) => {
          if (editingProject) updateMut.mutate({ id: editingProject.id, ...form });
          else createMut.mutate(form);
        }}
        project={editingProject}
        clients={clients}
      />
    </div>
  );
}

function ProjectFormDialog({ open, onClose, onSave, project, clients }: {
  open: boolean;
  onClose: () => void;
  onSave: (form: any) => void;
  project: Project | null;
  clients: Client[];
}) {
  const [form, setForm] = useState<any>({});
  const [milestones, setMilestones] = useState<ProjectMilestone[]>([]);
  const [newMs, setNewMs] = useState("");

  const reset = () => {
    if (project) {
      setForm({ clientId: project.clientId, title: project.title, type: project.type, status: project.status, assigneeId: project.assigneeId, startDate: project.startDate, targetDate: project.targetDate, launchDate: project.launchDate, notes: project.notes });
      setMilestones(parseJSON(project.milestones, []));
    } else {
      setForm({ clientId: "", title: "", type: "website", status: "not-started", assigneeId: "", startDate: today(), targetDate: "", launchDate: "", notes: "" });
      setMilestones([
        { id: "1", label: "Discovery & intake", dueDate: "", completed: false, completedAt: "" },
        { id: "2", label: "Design mockup", dueDate: "", completed: false, completedAt: "" },
        { id: "3", label: "Client review", dueDate: "", completed: false, completedAt: "" },
        { id: "4", label: "Build & develop", dueDate: "", completed: false, completedAt: "" },
        { id: "5", label: "QA & testing", dueDate: "", completed: false, completedAt: "" },
        { id: "6", label: "Launch", dueDate: "", completed: false, completedAt: "" },
      ]);
    }
  };

  useEffect(() => { if (open) reset(); }, [open, project]);

  const set = (key: string, value: any) => setForm((p: any) => ({ ...p, [key]: value }));

  const addMilestone = () => {
    if (!newMs.trim()) return;
    setMilestones(prev => [...prev, { id: String(Date.now()), label: newMs.trim(), dueDate: "", completed: false, completedAt: "" }]);
    setNewMs("");
  };

  const removeMilestone = (idx: number) => setMilestones(prev => prev.filter((_, i) => i !== idx));

  const handleSave = () => {
    if (!form.title) return;
    onSave({ ...form, milestones });
  };

  return (
    <Dialog open={open} onOpenChange={o => { if (!o) onClose(); else reset(); }}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{project ? "Edit Project" : "New Project"}</DialogTitle><DialogDescription>Track delivery milestones for client work</DialogDescription></DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label className="text-xs">Project Title</Label><Input value={form.title || ""} onChange={e => set("title", e.target.value)} placeholder="Homepage redesign..." data-testid="input-project-title" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Type</Label>
              <Select value={form.type || "website"} onValueChange={v => set("type", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{(Object.keys(PROJECT_TYPE_CONFIG) as ProjectType[]).map(t => <SelectItem key={t} value={t}>{PROJECT_TYPE_CONFIG[t].icon} {PROJECT_TYPE_CONFIG[t].label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label className="text-xs">Client</Label>
              <Select value={form.clientId || "none"} onValueChange={v => set("clientId", v === "none" ? "" : v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No client</SelectItem>
                  {clients.map(c => <SelectItem key={c.id} value={c.id}>{c.business || c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5"><Label className="text-xs">Assignee</Label>
              <Select value={form.assigneeId || "none"} onValueChange={v => set("assigneeId", v === "none" ? "" : v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Unassigned</SelectItem>
                  {TEAM_MEMBERS_LIST.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label className="text-xs">Status</Label>
              <Select value={form.status || "not-started"} onValueChange={v => set("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{(Object.keys(PROJECT_STATUS_CONFIG) as ProjectStatus[]).map(s => <SelectItem key={s} value={s}>{PROJECT_STATUS_CONFIG[s].label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5"><Label className="text-xs">Start Date</Label><Input type="date" value={form.startDate || ""} onChange={e => set("startDate", e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label className="text-xs">Target Launch</Label><Input type="date" value={form.targetDate || ""} onChange={e => set("targetDate", e.target.value)} /></div>
            <div className="space-y-1.5"><Label className="text-xs">Actual Launch</Label><Input type="date" value={form.launchDate || ""} onChange={e => set("launchDate", e.target.value)} /></div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold">Milestones</Label>
            <div className="space-y-1">
              {milestones.map((m, i) => (
                <div key={m.id || i} className="flex items-center gap-2 group">
                  <Checkbox checked={m.completed} onCheckedChange={checked => {
                    const updated = [...milestones];
                    updated[i] = { ...m, completed: !!checked, completedAt: checked ? new Date().toISOString() : "" };
                    setMilestones(updated);
                  }} />
                  <Input className="h-7 text-xs flex-1" value={m.label} onChange={e => {
                    const updated = [...milestones];
                    updated[i] = { ...m, label: e.target.value };
                    setMilestones(updated);
                  }} />
                  <Input type="date" className="h-7 text-xs w-32" value={m.dueDate || ""} onChange={e => {
                    const updated = [...milestones];
                    updated[i] = { ...m, dueDate: e.target.value };
                    setMilestones(updated);
                  }} />
                  <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 text-destructive" onClick={() => removeMilestone(i)}><Trash2 className="w-3 h-3" /></Button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input className="h-7 text-xs flex-1" placeholder="Add milestone..." value={newMs} onChange={e => setNewMs(e.target.value)} onKeyDown={e => e.key === "Enter" && addMilestone()} data-testid="input-new-milestone" />
              <Button variant="outline" size="sm" className="h-7 text-xs" onClick={addMilestone}>Add</Button>
            </div>
          </div>

          <div className="space-y-1.5"><Label className="text-xs">Notes</Label><Textarea value={form.notes || ""} onChange={e => set("notes", e.target.value)} rows={2} className="resize-none text-sm" /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={!form.title} data-testid="button-save-project">{project ? "Update" : "Create Project"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
