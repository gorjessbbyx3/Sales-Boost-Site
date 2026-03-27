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
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit3, DollarSign, Calendar, Monitor, Megaphone, Send, Users, Eye, CheckCircle, Tag, Copy } from "lucide-react";
import { useState } from "react";
import type { Opportunity, Lead, TeamMember, DealStage } from "./types";
import { DEAL_STAGE_CONFIG, DEAL_STAGES } from "./constants";

interface Equipment { id: string; name: string; serialNumber: string; model: string; brand: string; status: string; }
interface Campaign { id: string; name: string; type: string; status: string; offerCode: string; contentUrl: string; contentName: string; targetCount: number; sentCount: number; responseCount: number; notes: string; createdAt: string; updatedAt: string; }

export default function DealsTab() {
  const { toast } = useToast();
  const [view, setView] = useState<"deals" | "campaigns">("deals");
  const { data: deals = [] } = useQuery<Opportunity[]>({ queryKey: ["/api/opportunities"] });
  const { data: leads = [] } = useQuery<Lead[]>({ queryKey: ["/api/leads"] });
  const { data: team = [] } = useQuery<TeamMember[]>({ queryKey: ["/api/team-members"] });
  const { data: equipment = [] } = useQuery<Equipment[]>({ queryKey: ["/api/equipment"] });
  const [showForm, setShowForm] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Opportunity | null>(null);
  const [filterStage, setFilterStage] = useState("all");
  const [form, setForm] = useState({ title: "", leadId: "", stage: "prospecting" as DealStage, value: 0, probability: 10, expectedCloseDate: "", notes: "", assigneeId: "", equipmentId: "" });

  const { data: campaigns = [], refetch: refetchCampaigns } = useQuery<Campaign[]>({ queryKey: ["/api/campaigns"] });
  const [showCampForm, setShowCampForm] = useState(false);
  const [campForm, setCampForm] = useState({ name: "", type: "direct_mail", offerCode: "", contentUrl: "", contentName: "", notes: "" });
  const [expandedCamp, setExpandedCamp] = useState<string | null>(null);
  const [campDetail, setCampDetail] = useState<any>(null);
  const [addLeadsOpen, setAddLeadsOpen] = useState<string | null>(null);
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);

  const createMut = useMutation({ mutationFn: async (data: typeof form) => { const r = await apiRequest("POST", "/api/opportunities", data); return r.json(); }, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/opportunities"] }); setShowForm(false); toast({ title: "Deal created" }); } });
  const updateMut = useMutation({ mutationFn: async ({ id, ...data }: Partial<Opportunity> & { id: string }) => { const r = await apiRequest("PATCH", `/api/opportunities/${id}`, data); return r.json(); }, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/opportunities"] }); setShowForm(false); setEditingDeal(null); toast({ title: "Deal updated" }); } });
  const deleteMut = useMutation({ mutationFn: (id: string) => apiRequest("DELETE", `/api/opportunities/${id}`), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/opportunities"] }); toast({ title: "Deal deleted" }); } });

  const createCampMut = useMutation({ mutationFn: async (data: typeof campForm) => { const r = await apiRequest("POST", "/api/campaigns", data); return r.json(); }, onSuccess: () => { refetchCampaigns(); setShowCampForm(false); toast({ title: "Campaign created" }); setCampForm({ name: "", type: "direct_mail", offerCode: "", contentUrl: "", contentName: "", notes: "" }); } });
  const deleteCampMut = useMutation({ mutationFn: (id: string) => apiRequest("DELETE", `/api/campaigns/${id}`), onSuccess: () => { refetchCampaigns(); toast({ title: "Campaign deleted" }); } });
  const sendCampMut = useMutation({ mutationFn: async (id: string) => { const r = await apiRequest("POST", `/api/campaigns/${id}/send`); return r.json(); }, onSuccess: () => { refetchCampaigns(); toast({ title: "Campaign marked as sent" }); } });
  const addRecipMut = useMutation({ mutationFn: async ({ campId, leadIds }: { campId: string; leadIds: string[] }) => { const r = await apiRequest("POST", `/api/campaigns/${campId}/recipients`, { leadIds }); return r.json(); }, onSuccess: (data) => { refetchCampaigns(); setAddLeadsOpen(null); setSelectedLeadIds([]); toast({ title: `Added ${data.added} recipients` }); } });
  const respondMut = useMutation({ mutationFn: async ({ recipId, responseType, offerRedeemed }: { recipId: string; responseType: string; offerRedeemed: boolean }) => { const r = await apiRequest("POST", `/api/campaigns/recipients/${recipId}/respond`, { responseType, offerRedeemed }); return r.json(); }, onSuccess: () => { refetchCampaigns(); if (expandedCamp && campDetail) loadCampDetail(expandedCamp); toast({ title: "Response recorded" }); } });

  const loadCampDetail = async (id: string) => { if (expandedCamp === id) { setExpandedCamp(null); return; } try { const r = await apiRequest("GET", `/api/campaigns/${id}`); const data = await r.json(); setCampDetail(data); setExpandedCamp(id); } catch {} };
  const openCreate = () => { setEditingDeal(null); setForm({ title: "", leadId: "", stage: "prospecting", value: 399, probability: 10, expectedCloseDate: "", notes: "", assigneeId: "", equipmentId: "" }); setShowForm(true); };
  const openEdit = (d: Opportunity) => { setEditingDeal(d); setForm({ title: d.title, leadId: d.leadId, stage: d.stage as DealStage, value: d.value, probability: d.probability, expectedCloseDate: d.expectedCloseDate, notes: d.notes, assigneeId: d.assigneeId, equipmentId: d.equipmentId || "" }); setShowForm(true); };
  const handleSave = () => { if (!form.title) return; if (editingDeal) updateMut.mutate({ id: editingDeal.id, ...form }); else createMut.mutate(form); };
  const handleStageChange = (dealId: string, newStage: DealStage) => { updateMut.mutate({ id: dealId, stage: newStage }); };

  const activeDeals = deals.filter(d => d.stage !== "closed-won" && d.stage !== "closed-lost");
  const totalPipeline = activeDeals.reduce((s, d) => s + d.value, 0);
  const weightedPipeline = activeDeals.reduce((s, d) => s + d.value * (d.probability / 100), 0);
  const wonDeals = deals.filter(d => d.stage === "closed-won");
  const wonTotal = wonDeals.reduce((s, d) => s + d.value, 0);
  const filtered = filterStage === "all" ? deals : deals.filter(d => d.stage === filterStage);
  const totalSent = campaigns.reduce((s, c) => s + c.sentCount, 0);
  const totalResponses = campaigns.reduce((s, c) => s + c.responseCount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Button variant={view === "deals" ? "default" : "ghost"} size="sm" className="h-8 text-xs" onClick={() => setView("deals")}><DollarSign className="w-3.5 h-3.5 mr-1" />Deals ({deals.length})</Button>
          <Button variant={view === "campaigns" ? "default" : "ghost"} size="sm" className="h-8 text-xs" onClick={() => setView("campaigns")}><Megaphone className="w-3.5 h-3.5 mr-1" />Campaigns ({campaigns.length})</Button>
        </div>
        {view === "deals" && <Button size="sm" onClick={openCreate}><Plus className="w-3.5 h-3.5 mr-1" />New Deal</Button>}
        {view === "campaigns" && <Button size="sm" onClick={() => setShowCampForm(true)}><Plus className="w-3.5 h-3.5 mr-1" />New Campaign</Button>}
      </div>

      {view === "deals" && (<>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[{ label: "Pipeline", value: `$${totalPipeline.toLocaleString()}`, sub: `${activeDeals.length} active` }, { label: "Weighted", value: `$${Math.round(weightedPipeline).toLocaleString()}`, sub: "adjusted", color: "text-primary" }, { label: "Won", value: `$${wonTotal.toLocaleString()}`, sub: `${wonDeals.length} deals`, color: "text-emerald-400" }, { label: "Win Rate", value: deals.filter(d => d.stage === "closed-won" || d.stage === "closed-lost").length > 0 ? `${Math.round((wonDeals.length / deals.filter(d => d.stage === "closed-won" || d.stage === "closed-lost").length) * 100)}%` : "—", sub: "of closed" }].map(k => (<Card key={k.label} className="border-border/50"><CardContent className="p-4"><div className="text-xs text-muted-foreground mb-1">{k.label}</div><div className={`text-xl font-bold ${k.color || ""}`}>{k.value}</div><div className="text-[10px] text-muted-foreground">{k.sub}</div></CardContent></Card>))}
        </div>
        <div className="flex items-center gap-2">
          <Select value={filterStage} onValueChange={setFilterStage}><SelectTrigger className="w-[160px] h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All Stages</SelectItem>{DEAL_STAGES.map(s => <SelectItem key={s} value={s}>{DEAL_STAGE_CONFIG[s].label}</SelectItem>)}</SelectContent></Select>
          <span className="text-xs text-muted-foreground">{filtered.length} deals</span>
        </div>
        <div className="space-y-2">
          {filtered.map(deal => { const cfg = DEAL_STAGE_CONFIG[deal.stage as DealStage] || DEAL_STAGE_CONFIG.prospecting; return (<Card key={deal.id} className="border-border/50"><CardContent className="p-4"><div className="flex items-center justify-between gap-4"><div className="flex-1 min-w-0"><div className="flex items-center gap-2 mb-1"><h3 className="font-semibold text-sm truncate">{deal.title}</h3><Badge variant="outline" className={`text-[10px] ${cfg.bg} ${cfg.color}`}>{cfg.label}</Badge></div><div className="flex items-center gap-3 text-xs text-muted-foreground">{deal.leadBusiness && <span>{deal.leadBusiness}</span>}{deal.assigneeName && <span>→ {deal.assigneeName}</span>}{deal.expectedCloseDate && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{deal.expectedCloseDate}</span>}</div></div><div className="text-right shrink-0"><div className="text-sm font-bold">${deal.value.toLocaleString()}</div><div className="text-[10px] text-muted-foreground">{deal.probability}%</div></div><div className="flex items-center gap-1">{deal.stage !== "closed-won" && deal.stage !== "closed-lost" && (<Select value={deal.stage} onValueChange={(v) => handleStageChange(deal.id, v as DealStage)}><SelectTrigger className="w-[100px] h-7 text-[10px]"><SelectValue /></SelectTrigger><SelectContent>{DEAL_STAGES.map(s => <SelectItem key={s} value={s} className="text-xs">{DEAL_STAGE_CONFIG[s].label}</SelectItem>)}</SelectContent></Select>)}<Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(deal)}><Edit3 className="w-3 h-3" /></Button><Button variant="ghost" size="icon" className="h-7 w-7 text-red-400" onClick={() => { if (confirm("Delete?")) deleteMut.mutate(deal.id); }}><Trash2 className="w-3 h-3" /></Button></div></div></CardContent></Card>); })}
          {filtered.length === 0 && <Card className="border-dashed"><CardContent className="p-8 text-center"><DollarSign className="w-8 h-8 text-muted-foreground/50 mx-auto mb-3" /><p className="text-sm text-muted-foreground">No deals yet.</p></CardContent></Card>}
        </div>
      </>)}

      {view === "campaigns" && (<>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[{ label: "Campaigns", value: String(campaigns.length), sub: `${campaigns.filter(c => c.status === "sent").length} sent` }, { label: "Sent", value: String(totalSent), sub: "recipients" }, { label: "Responses", value: String(totalResponses), sub: totalSent > 0 ? `${Math.round((totalResponses / totalSent) * 100)}% rate` : "—", color: "text-emerald-400" }, { label: "Codes", value: String(campaigns.filter(c => c.offerCode).length), sub: "trackable" }].map(k => (<Card key={k.label} className="border-border/50"><CardContent className="p-4"><div className="text-xs text-muted-foreground mb-1">{k.label}</div><div className={`text-xl font-bold ${k.color || ""}`}>{k.value}</div><div className="text-[10px] text-muted-foreground">{k.sub}</div></CardContent></Card>))}
        </div>
        <div className="space-y-2">
          {campaigns.map(camp => { const isExp = expandedCamp === camp.id; const rate = camp.sentCount > 0 ? Math.round((camp.responseCount / camp.sentCount) * 100) : 0; return (
            <Card key={camp.id} className="border-border/50"><CardContent className="p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1"><h3 className="font-semibold text-sm truncate">{camp.name}</h3><Badge variant="outline" className={`text-[10px] ${camp.status === "sent" ? "text-emerald-400 bg-emerald-400/10" : "text-muted-foreground"}`}>{camp.status}</Badge><Badge variant="outline" className="text-[10px]">{camp.type.replace(/_/g, " ")}</Badge></div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground"><span><Users className="w-3 h-3 inline mr-1" />{camp.targetCount}</span><span><Send className="w-3 h-3 inline mr-1" />{camp.sentCount}</span><span><CheckCircle className="w-3 h-3 inline mr-1" />{camp.responseCount} ({rate}%)</span>{camp.offerCode && <span className="text-amber-400 cursor-pointer" onClick={() => { navigator.clipboard.writeText(camp.offerCode); toast({ title: "Copied!" }); }}><Tag className="w-3 h-3 inline mr-1" />{camp.offerCode} <Copy className="w-2.5 h-2.5 inline" /></span>}</div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => loadCampDetail(camp.id)}><Eye className="w-3 h-3" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setAddLeadsOpen(camp.id); setSelectedLeadIds([]); }}><Users className="w-3 h-3" /></Button>
                  {camp.status === "draft" && <Button variant="ghost" size="icon" className="h-7 w-7 text-emerald-400" onClick={() => sendCampMut.mutate(camp.id)}><Send className="w-3 h-3" /></Button>}
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400" onClick={() => { if (confirm("Delete?")) deleteCampMut.mutate(camp.id); }}><Trash2 className="w-3 h-3" /></Button>
                </div>
              </div>
              {camp.sentCount > 0 && <div className="mt-2"><Progress value={rate} className="h-1.5" /></div>}
              {isExp && campDetail?.id === camp.id && (
                <div className="mt-3 pt-3 border-t border-border/30 space-y-2">
                  {camp.contentUrl && <div className="text-xs"><span className="text-muted-foreground">Content:</span> <a href={camp.contentUrl} target="_blank" className="text-primary hover:underline">{camp.contentName || "View"}</a></div>}
                  {camp.notes && <div className="text-xs text-muted-foreground">{camp.notes}</div>}
                  <div className="text-xs font-medium">Recipients ({campDetail.recipients?.length || 0})</div>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {(campDetail.recipients || []).map((r: any) => (
                      <div key={r.id} className="flex items-center justify-between text-xs p-2 bg-muted/20 rounded">
                        <div><span className="font-medium">{r.business || r.name}</span>{r.address && <span className="text-muted-foreground ml-2 text-[10px]">{r.address}</span>}</div>
                        <div className="flex items-center gap-2">
                          {r.sentAt && <Badge variant="outline" className="text-[9px]">Sent</Badge>}
                          {r.responded ? <Badge variant="outline" className="text-[9px] text-emerald-400 bg-emerald-400/10">Responded{r.offerRedeemed ? " ✓" : ""}</Badge> : r.sentAt ? <Button size="sm" variant="ghost" className="h-5 text-[9px] px-1.5" onClick={() => respondMut.mutate({ recipId: r.id, responseType: "inquiry", offerRedeemed: false })}>Log Response</Button> : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent></Card>); })}
          {campaigns.length === 0 && <Card className="border-dashed"><CardContent className="p-8 text-center"><Megaphone className="w-8 h-8 text-muted-foreground/50 mx-auto mb-3" /><p className="text-sm text-muted-foreground">No campaigns yet. Track direct mail, flyers, or marketing.</p></CardContent></Card>}
        </div>
      </>)}

      <Dialog open={showForm} onOpenChange={(o) => { setShowForm(o); if (!o) setEditingDeal(null); }}><DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto"><DialogHeader><DialogTitle>{editingDeal ? "Edit Deal" : "New Deal"}</DialogTitle><DialogDescription>Track an opportunity.</DialogDescription></DialogHeader><div className="space-y-3"><div><Label className="text-xs">Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div><div className="grid grid-cols-2 gap-3"><div><Label className="text-xs">Lead</Label><Select value={form.leadId || "none"} onValueChange={(v) => { const lid = v === "none" ? "" : v; const l = leads.find(x => x.id === lid); setForm({ ...form, leadId: lid, title: form.title || (l ? `${l.business} - Deal` : "") }); }}><SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">None</SelectItem>{leads.map(l => <SelectItem key={l.id} value={l.id}>{l.business || l.name}</SelectItem>)}</SelectContent></Select></div><div><Label className="text-xs">Assigned</Label><Select value={form.assigneeId || "none"} onValueChange={(v) => setForm({ ...form, assigneeId: v === "none" ? "" : v })}><SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">Unassigned</SelectItem>{team.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent></Select></div></div><div><Label className="text-xs">Equipment</Label><Select value={form.equipmentId || "none"} onValueChange={(v) => setForm({ ...form, equipmentId: v === "none" ? "" : v })}><SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">None</SelectItem>{equipment.map(e => <SelectItem key={e.id} value={e.id}>{e.name || e.model}</SelectItem>)}</SelectContent></Select></div><div className="grid grid-cols-3 gap-3"><div><Label className="text-xs">Stage</Label><Select value={form.stage} onValueChange={(v) => { const p: Record<string, number> = { prospecting: 10, qualification: 25, proposal: 50, negotiation: 75, "closed-won": 100, "closed-lost": 0 }; setForm({ ...form, stage: v as DealStage, probability: p[v] ?? form.probability }); }}><SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger><SelectContent>{DEAL_STAGES.map(s => <SelectItem key={s} value={s}>{DEAL_STAGE_CONFIG[s].label}</SelectItem>)}</SelectContent></Select></div><div><Label className="text-xs">Value ($)</Label><Input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: parseFloat(e.target.value) || 0 })} /></div><div><Label className="text-xs">Prob (%)</Label><Input type="number" min={0} max={100} value={form.probability} onChange={(e) => setForm({ ...form, probability: parseInt(e.target.value) || 0 })} /></div></div><div><Label className="text-xs">Close Date</Label><Input type="date" value={form.expectedCloseDate} onChange={(e) => setForm({ ...form, expectedCloseDate: e.target.value })} /></div><div><Label className="text-xs">Notes</Label><Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} /></div></div><DialogFooter><Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button><Button onClick={handleSave} disabled={!form.title}>{editingDeal ? "Update" : "Create"}</Button></DialogFooter></DialogContent></Dialog>

      <Dialog open={showCampForm} onOpenChange={setShowCampForm}><DialogContent className="max-w-lg"><DialogHeader><DialogTitle>New Campaign</DialogTitle><DialogDescription>Track direct mail, flyers, or marketing outreach.</DialogDescription></DialogHeader><div className="space-y-3"><div><Label className="text-xs">Name</Label><Input value={campForm.name} onChange={(e) => setCampForm({ ...campForm, name: e.target.value })} placeholder="March Kaimuki Flyer Drop" /></div><div className="grid grid-cols-2 gap-3"><div><Label className="text-xs">Type</Label><Select value={campForm.type} onValueChange={(v) => setCampForm({ ...campForm, type: v })}><SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="direct_mail">Direct Mail</SelectItem><SelectItem value="flyer">Flyer</SelectItem><SelectItem value="postcard">Postcard</SelectItem><SelectItem value="door_hanger">Door Hanger</SelectItem><SelectItem value="email_blast">Email Blast</SelectItem><SelectItem value="social_ad">Social Ad</SelectItem></SelectContent></Select></div><div><Label className="text-xs">Offer Code</Label><Input value={campForm.offerCode} onChange={(e) => setCampForm({ ...campForm, offerCode: e.target.value.toUpperCase() })} placeholder="Auto-generated" /></div></div><div><Label className="text-xs">Content URL</Label><Input value={campForm.contentUrl} onChange={(e) => setCampForm({ ...campForm, contentUrl: e.target.value })} placeholder="Link to PDF or image" /></div><div><Label className="text-xs">Content Name</Label><Input value={campForm.contentName} onChange={(e) => setCampForm({ ...campForm, contentName: e.target.value })} /></div><div><Label className="text-xs">Notes</Label><Textarea value={campForm.notes} onChange={(e) => setCampForm({ ...campForm, notes: e.target.value })} rows={2} /></div></div><DialogFooter><Button variant="outline" onClick={() => setShowCampForm(false)}>Cancel</Button><Button onClick={() => createCampMut.mutate(campForm)} disabled={!campForm.name}>Create</Button></DialogFooter></DialogContent></Dialog>

      <Dialog open={!!addLeadsOpen} onOpenChange={(o) => { if (!o) { setAddLeadsOpen(null); setSelectedLeadIds([]); } }}><DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto"><DialogHeader><DialogTitle>Add Recipients</DialogTitle><DialogDescription>Select pipeline leads to add.</DialogDescription></DialogHeader><div className="space-y-1.5 max-h-96 overflow-y-auto">{leads.filter(l => l.address).map(l => (<label key={l.id} className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${selectedLeadIds.includes(l.id) ? "bg-primary/10 border border-primary/20" : "bg-muted/20 border border-transparent"}`}><input type="checkbox" checked={selectedLeadIds.includes(l.id)} onChange={() => setSelectedLeadIds(p => p.includes(l.id) ? p.filter(x => x !== l.id) : [...p, l.id])} className="rounded" /><div className="flex-1 min-w-0"><div className="text-sm font-medium truncate">{l.business || l.name}</div><div className="text-[10px] text-muted-foreground truncate">{l.address}</div></div></label>))}</div><DialogFooter><span className="text-xs text-muted-foreground mr-auto">{selectedLeadIds.length} selected</span><Button variant="outline" onClick={() => setAddLeadsOpen(null)}>Cancel</Button><Button disabled={selectedLeadIds.length === 0} onClick={() => { if (addLeadsOpen) addRecipMut.mutate({ campId: addLeadsOpen, leadIds: selectedLeadIds }); }}>Add {selectedLeadIds.length}</Button></DialogFooter></DialogContent></Dialog>
    </div>
  );
}
