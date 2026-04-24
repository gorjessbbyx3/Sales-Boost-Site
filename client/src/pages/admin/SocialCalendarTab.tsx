import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Sparkles, Wand2,
  Instagram, Facebook, Image as ImageIcon, Copy, Trash2, X, Loader2, CheckCircle2,
  Edit3, Clock, Hash,
} from "lucide-react";
import type { SocialPost } from "@shared/schema";

type Platform = "instagram" | "facebook" | "both";
type Status = "idea" | "draft" | "scheduled" | "published";

const PLATFORM_CONFIG: Record<Platform, { label: string; icon: any; color: string; bg: string }> = {
  instagram: { label: "Instagram", icon: Instagram, color: "text-pink-600 dark:text-pink-400", bg: "bg-pink-50 dark:bg-pink-900/30" },
  facebook:  { label: "Facebook",  icon: Facebook,  color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/30" },
  both:      { label: "IG + FB",   icon: Sparkles,  color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-900/30" },
};

const STATUS_CONFIG: Record<Status, { label: string; color: string }> = {
  idea:      { label: "Idea",      color: "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200" },
  draft:     { label: "Draft",     color: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300" },
  scheduled: { label: "Scheduled", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300" },
  published: { label: "Published", color: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300" },
};

const STATUS_ORDER: Status[] = ["idea", "draft", "scheduled", "published"];
const PLATFORM_OPTIONS: Platform[] = ["both", "instagram", "facebook"];

const emptyForm = {
  platform: "both" as Platform,
  scheduledDate: new Date().toISOString().split("T")[0],
  scheduledTime: "09:00",
  title: "",
  contentIdea: "",
  caption: "",
  hashtags: "",
  visualPrompt: "",
  visualUrl: "",
  callToAction: "",
  status: "idea" as Status,
  notes: "",
};

function startOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth(), 1); }
function endOfMonth(d: Date)   { return new Date(d.getFullYear(), d.getMonth() + 1, 0); }
function fmtDate(d: Date)       { return d.toISOString().split("T")[0]; }
function fmtMonth(d: Date)      { return d.toLocaleString("en-US", { month: "long", year: "numeric" }); }

export default function SocialCalendarTab() {
  const { toast } = useToast();
  const [cursor, setCursor] = useState(() => startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState(fmtDate(new Date()));
  const [editPost, setEditPost] = useState<SocialPost | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [platformFilter, setPlatformFilter] = useState<Platform | "all">("all");
  const [generatingIdeas, setGeneratingIdeas] = useState(false);
  const [generatingVisual, setGeneratingVisual] = useState(false);

  const { data: posts = [], isLoading } = useQuery<SocialPost[]>({
    queryKey: ["/api/social-posts"],
    staleTime: 10_000,
  });

  // ── Mutations ──────────────────────────────────────────────────────────
  const createMut = useMutation({
    mutationFn: async (body: typeof emptyForm) => (await apiRequest("POST", "/api/social-posts", body)).json(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/social-posts"] });
      setShowAdd(false); setForm(emptyForm);
      toast({ title: "Post added to calendar" });
    },
  });

  const updateMut = useMutation({
    mutationFn: async (vars: { id: number } & Partial<typeof emptyForm>) => {
      const { id, ...body } = vars;
      return (await apiRequest("PATCH", `/api/social-posts/${id}`, body)).json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/social-posts"] });
      setEditPost(null); setForm(emptyForm);
      toast({ title: "Post updated" });
    },
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/social-posts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/social-posts"] });
      toast({ title: "Post deleted" });
    },
  });

  // ── AI Generators ──────────────────────────────────────────────────────
  async function generateIdeas() {
    setGeneratingIdeas(true);
    try {
      const monthLabel = fmtMonth(cursor);
      const r = await apiRequest("POST", "/api/social-posts/generate-ideas", {
        month: monthLabel, count: 8, startDate: fmtDate(startOfMonth(cursor)),
      });
      const data = await r.json();
      if (data.ideas?.length) {
        toast({ title: `Generated ${data.ideas.length} post ideas`, description: "Check your calendar — drafts added across the month." });
        queryClient.invalidateQueries({ queryKey: ["/api/social-posts"] });
      } else {
        toast({ title: "No ideas generated", description: data.error || "Try again", variant: "destructive" });
      }
    } catch (err: any) {
      toast({ title: "Generation failed", description: err.message, variant: "destructive" });
    } finally {
      setGeneratingIdeas(false);
    }
  }

  async function generateVisualPromptForForm() {
    if (!form.contentIdea && !form.caption && !form.title) {
      toast({ title: "Need content first", description: "Add a title, idea, or caption before generating a visual prompt.", variant: "destructive" });
      return;
    }
    setGeneratingVisual(true);
    try {
      const r = await apiRequest("POST", "/api/social-posts/generate-visual-prompt", {
        title: form.title, contentIdea: form.contentIdea, caption: form.caption, platform: form.platform,
      });
      const data = await r.json();
      if (data.visualPrompt) {
        setForm(f => ({ ...f, visualPrompt: data.visualPrompt }));
        toast({ title: "Visual prompt generated" });
      } else {
        toast({ title: "Failed", description: data.error || "Try again", variant: "destructive" });
      }
    } catch (err: any) {
      toast({ title: "Generation failed", description: err.message, variant: "destructive" });
    } finally {
      setGeneratingVisual(false);
    }
  }

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text);
    toast({ title: `${label} copied` });
  }

  function openEdit(p: SocialPost) {
    setEditPost(p);
    setForm({
      platform: (p.platform as Platform) || "both",
      scheduledDate: p.scheduledDate,
      scheduledTime: p.scheduledTime || "09:00",
      title: p.title || "",
      contentIdea: p.contentIdea || "",
      caption: p.caption || "",
      hashtags: p.hashtags || "",
      visualPrompt: p.visualPrompt || "",
      visualUrl: p.visualUrl || "",
      callToAction: p.callToAction || "",
      status: (p.status as Status) || "idea",
      notes: p.notes || "",
    });
  }

  function submit() {
    if (editPost) updateMut.mutate({ id: editPost.id, ...form });
    else createMut.mutate(form);
  }

  // ── Derived calendar grid ──────────────────────────────────────────────
  const filteredPosts = useMemo(() =>
    platformFilter === "all"
      ? posts
      : posts.filter(p => p.platform === platformFilter || p.platform === "both")
  , [posts, platformFilter]);

  const postsByDate = useMemo(() => {
    const map = new Map<string, SocialPost[]>();
    filteredPosts.forEach(p => {
      const arr = map.get(p.scheduledDate) || [];
      arr.push(p);
      map.set(p.scheduledDate, arr);
    });
    return map;
  }, [filteredPosts]);

  const calendarDays = useMemo(() => {
    const first = startOfMonth(cursor);
    const last = endOfMonth(cursor);
    const startWeekday = first.getDay(); // 0 = Sun
    const days: { date: string | null; day: number | null }[] = [];
    for (let i = 0; i < startWeekday; i++) days.push({ date: null, day: null });
    for (let d = 1; d <= last.getDate(); d++) {
      const date = new Date(cursor.getFullYear(), cursor.getMonth(), d);
      days.push({ date: fmtDate(date), day: d });
    }
    return days;
  }, [cursor]);

  const selectedPosts = useMemo(() => postsByDate.get(selectedDate) || [], [postsByDate, selectedDate]);

  const stats = useMemo(() => ({
    total: posts.length,
    scheduled: posts.filter(p => p.status === "scheduled").length,
    drafts: posts.filter(p => p.status === "draft").length,
    ideas: posts.filter(p => p.status === "idea").length,
    published: posts.filter(p => p.status === "published").length,
  }), [posts]);

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" /> Social Media Calendar
          </h2>
          <p className="text-sm text-muted-foreground">Plan, draft & schedule Instagram and Facebook posts.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={generateIdeas} disabled={generatingIdeas}>
            {generatingIdeas ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Wand2 className="h-4 w-4 mr-1" />}
            Generate Month's Ideas
          </Button>
          <Button size="sm" onClick={() => { setShowAdd(true); setForm({ ...emptyForm, scheduledDate: selectedDate }); }}>
            <Plus className="h-4 w-4 mr-1" /> New Post
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(["idea","draft","scheduled","published"] as Status[]).map(s => (
          <div key={s} className="rounded-lg border border-border bg-card p-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">{STATUS_CONFIG[s].label}</p>
            <p className="text-2xl font-bold mt-0.5">{stats[s as keyof typeof stats] ?? 0}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-4">
        {/* ── Calendar Grid ── */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="p-3 border-b border-border flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={() => setCursor(c => new Date(c.getFullYear(), c.getMonth() - 1, 1))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="font-semibold text-sm min-w-[140px] text-center">{fmtMonth(cursor)}</span>
              <Button variant="ghost" size="sm" onClick={() => setCursor(c => new Date(c.getFullYear(), c.getMonth() + 1, 1))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="ml-2 h-7 text-xs" onClick={() => { const t = new Date(); setCursor(startOfMonth(t)); setSelectedDate(fmtDate(t)); }}>Today</Button>
            </div>
            <Select value={platformFilter} onValueChange={v => setPlatformFilter(v as any)}>
              <SelectTrigger className="h-8 text-xs w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Weekday header */}
          <div className="grid grid-cols-7 border-b border-border bg-muted/40 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
              <div key={d} className="p-1.5 text-center">{d}</div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 auto-rows-fr">
            {calendarDays.map((cell, i) => {
              if (!cell.date) return <div key={i} className="h-20 border-b border-r border-border bg-muted/20" />;
              const dayPosts = postsByDate.get(cell.date) || [];
              const isToday = cell.date === fmtDate(new Date());
              const isSelected = cell.date === selectedDate;
              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(cell.date!)}
                  className={`h-20 border-b border-r border-border p-1 text-left flex flex-col gap-0.5 hover:bg-accent/40 transition-colors ${isSelected ? "bg-primary/10 ring-1 ring-primary ring-inset" : ""}`}
                >
                  <span className={`text-[11px] font-medium ${isToday ? "text-primary font-bold" : "text-foreground"}`}>{cell.day}</span>
                  <div className="flex flex-col gap-0.5 overflow-hidden">
                    {dayPosts.slice(0, 2).map(p => {
                      const Icon = PLATFORM_CONFIG[(p.platform as Platform)]?.icon ?? Sparkles;
                      return (
                        <div key={p.id} className={`flex items-center gap-1 text-[9px] px-1 py-0.5 rounded truncate ${PLATFORM_CONFIG[(p.platform as Platform)]?.bg ?? ""} ${PLATFORM_CONFIG[(p.platform as Platform)]?.color ?? ""}`}>
                          <Icon className="h-2.5 w-2.5 flex-shrink-0" />
                          <span className="truncate">{p.title || p.caption || "Untitled"}</span>
                        </div>
                      );
                    })}
                    {dayPosts.length > 2 && (
                      <span className="text-[9px] text-muted-foreground">+{dayPosts.length - 2} more</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Day detail panel ── */}
        <div className="bg-card border border-border rounded-lg flex flex-col" style={{ maxHeight: 600 }}>
          <div className="p-3 border-b border-border flex-shrink-0">
            <p className="text-xs text-muted-foreground">{new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p>
            <p className="text-sm font-semibold">{selectedPosts.length} post{selectedPosts.length === 1 ? "" : "s"}</p>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {isLoading ? (
              <div className="flex items-center justify-center h-32 text-muted-foreground text-sm gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading…
              </div>
            ) : selectedPosts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground text-sm gap-2 px-4 text-center">
                <CalendarIcon className="h-8 w-8 opacity-30" />
                <p>No posts scheduled for this day.</p>
                <Button variant="outline" size="sm" onClick={() => { setShowAdd(true); setForm({ ...emptyForm, scheduledDate: selectedDate }); }}>
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add post
                </Button>
              </div>
            ) : (
              selectedPosts.map(p => {
                const platformCfg = PLATFORM_CONFIG[(p.platform as Platform)] ?? PLATFORM_CONFIG.both;
                const Icon = platformCfg.icon;
                return (
                  <div key={p.id} className="p-3 space-y-1.5 hover:bg-muted/30 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Badge className={`text-[10px] px-1.5 py-0 h-4 ${platformCfg.bg} ${platformCfg.color} border-0`}>
                          <Icon className="h-2.5 w-2.5 mr-0.5" />{platformCfg.label}
                        </Badge>
                        <Badge className={`text-[10px] px-1.5 py-0 h-4 ${STATUS_CONFIG[(p.status as Status)]?.color || ""} border-0`}>
                          {STATUS_CONFIG[(p.status as Status)]?.label || p.status}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-0.5"><Clock className="h-2.5 w-2.5" />{p.scheduledTime}</span>
                      </div>
                      <div className="flex gap-0.5 flex-shrink-0">
                        <button onClick={() => openEdit(p)} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground" title="Edit">
                          <Edit3 className="h-3 w-3" />
                        </button>
                        <button onClick={() => { if (confirm("Delete this post?")) deleteMut.mutate(p.id); }} className="p-1 rounded hover:bg-red-100 text-muted-foreground hover:text-red-600" title="Delete">
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    {p.title && <p className="text-sm font-semibold leading-tight">{p.title}</p>}
                    {p.contentIdea && <p className="text-xs text-muted-foreground italic">💡 {p.contentIdea}</p>}
                    {p.caption && <p className="text-xs whitespace-pre-wrap">{p.caption}</p>}
                    {p.hashtags && (
                      <p className="text-xs text-blue-600 dark:text-blue-400 flex items-start gap-1">
                        <Hash className="h-3 w-3 mt-0.5 flex-shrink-0" /><span className="break-words">{p.hashtags}</span>
                      </p>
                    )}
                    {p.visualPrompt && (
                      <div className="bg-muted/40 border border-border rounded p-2 text-[11px] space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1 font-medium text-muted-foreground"><ImageIcon className="h-3 w-3" /> Visual Prompt</span>
                          <button onClick={() => copyToClipboard(p.visualPrompt, "Prompt")} className="text-primary hover:underline text-[10px] flex items-center gap-0.5">
                            <Copy className="h-2.5 w-2.5" /> Copy
                          </button>
                        </div>
                        <p className="text-muted-foreground leading-snug">{p.visualPrompt}</p>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ── Add / Edit Modal ── */}
      <Dialog open={showAdd || !!editPost} onOpenChange={open => { if (!open) { setShowAdd(false); setEditPost(null); setForm(emptyForm); } }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editPost ? "Edit Post" : "New Social Post"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Platform</Label>
                <Select value={form.platform} onValueChange={v => setForm(f => ({ ...f, platform: v as Platform }))}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PLATFORM_OPTIONS.map(p => <SelectItem key={p} value={p}>{PLATFORM_CONFIG[p].label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Date</Label>
                <Input type="date" className="h-8 text-xs" value={form.scheduledDate} onChange={e => setForm(f => ({ ...f, scheduledDate: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Time</Label>
                <Input type="time" className="h-8 text-xs" value={form.scheduledTime} onChange={e => setForm(f => ({ ...f, scheduledTime: e.target.value }))} />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Title / Hook</Label>
              <Input className="h-8 text-sm" placeholder="e.g. 5 Ways Hawaii Restaurants Save on Card Fees" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Content Idea / Brief</Label>
              <Textarea rows={2} className="text-sm" placeholder="What is this post about? Audience? Goal?" value={form.contentIdea} onChange={e => setForm(f => ({ ...f, contentIdea: e.target.value }))} />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Caption</Label>
              <Textarea rows={4} className="text-sm" placeholder="The actual post copy…" value={form.caption} onChange={e => setForm(f => ({ ...f, caption: e.target.value }))} />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Hashtags</Label>
                <Input className="h-8 text-sm" placeholder="#hawaii #smallbusiness" value={form.hashtags} onChange={e => setForm(f => ({ ...f, hashtags: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Call to Action</Label>
                <Input className="h-8 text-sm" placeholder="DM us / Visit techsavvy…" value={form.callToAction} onChange={e => setForm(f => ({ ...f, callToAction: e.target.value }))} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label className="text-xs flex items-center gap-1"><ImageIcon className="h-3 w-3" /> Visual Generation Prompt</Label>
                <Button variant="outline" size="sm" className="h-7 text-xs" onClick={generateVisualPromptForForm} disabled={generatingVisual}>
                  {generatingVisual ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Wand2 className="h-3 w-3 mr-1" />}
                  AI Generate
                </Button>
              </div>
              <Textarea rows={3} className="text-sm" placeholder="Detailed prompt for an AI image tool (Midjourney, DALL-E, etc)…" value={form.visualPrompt} onChange={e => setForm(f => ({ ...f, visualPrompt: e.target.value }))} />
              {form.visualPrompt && (
                <button onClick={() => copyToClipboard(form.visualPrompt, "Prompt")} className="text-[10px] text-primary hover:underline flex items-center gap-0.5">
                  <Copy className="h-2.5 w-2.5" /> Copy prompt
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Visual URL (optional)</Label>
                <Input className="h-8 text-sm" placeholder="https://…" value={form.visualUrl} onChange={e => setForm(f => ({ ...f, visualUrl: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Status</Label>
                <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v as Status }))}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STATUS_ORDER.map(s => <SelectItem key={s} value={s}>{STATUS_CONFIG[s].label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Notes</Label>
              <Textarea rows={2} className="text-sm" placeholder="Internal notes…" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => { setShowAdd(false); setEditPost(null); setForm(emptyForm); }}>
              <X className="h-4 w-4 mr-1" /> Cancel
            </Button>
            <Button size="sm" onClick={submit} disabled={createMut.isPending || updateMut.isPending}>
              {(createMut.isPending || updateMut.isPending)
                ? <Loader2 className="h-4 w-4 animate-spin mr-1" />
                : <CheckCircle2 className="h-4 w-4 mr-1" />}
              {editPost ? "Save Changes" : "Add Post"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
