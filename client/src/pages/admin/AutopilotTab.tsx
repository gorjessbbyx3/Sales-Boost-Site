import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Zap, Play, Pause, RefreshCw, Mail, Clock, Send, Eye, Phone,
  SkipForward, Trash2, Bot, Sparkles, TrendingUp, AlertTriangle,
  CheckCircle, XCircle, Loader2, RotateCw,
} from "lucide-react";
import { useState, useEffect } from "react";

interface AutopilotConfig {
  id: string;
  enabled: boolean;
  autoProspectEnabled: boolean;
  prospectLocations: string;
  prospectVerticals: string;
  maxProspectsPerRun: number;
  autoOutreachEnabled: boolean;
  outreachDelay: number;
  maxOutreachPerDay: number;
  autoFollowUpEnabled: boolean;
  followUpAfterDays: number;
  maxFollowUpsPerLead: number;
  autoEnrichEnabled: boolean;
  outreachEmailEnabled: boolean;
  outreachSmsEnabled: boolean;
  lastRunAt: string;
  totalProspected: number;
  totalEmailed: number;
  totalFollowUps: number;
  updatedAt: string;
}

interface QueueItem {
  id: string;
  leadId: string;
  type: string;
  status: string;
  subject: string;
  body: string;
  htmlBody: string;
  scheduledFor: string;
  sentAt: string;
  error: string;
  createdAt: string;
  leadName?: string;
  leadBusiness?: string;
  leadEmail?: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
  pending: { label: "Pending", color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20", icon: Clock },
  generating: { label: "Generating...", color: "text-blue-400 bg-blue-400/10 border-blue-400/20", icon: Loader2 },
  ready: { label: "Ready to Send", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20", icon: CheckCircle },
  sent: { label: "Sent", color: "text-primary bg-primary/10 border-primary/20", icon: Send },
  failed: { label: "Failed", color: "text-red-400 bg-red-400/10 border-red-400/20", icon: XCircle },
  skipped: { label: "Skipped", color: "text-muted-foreground bg-muted/30 border-muted", icon: SkipForward },
};

function timeAgo(ts: string) {
  if (!ts) return "never";
  const s = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export default function AutopilotTab() {
  const { toast } = useToast();
  const { data: config, refetch: refetchConfig } = useQuery<AutopilotConfig>({
    queryKey: ["/api/autopilot/config"],
  });
  const { data: queue = [], refetch: refetchQueue } = useQuery<QueueItem[]>({
    queryKey: ["/api/autopilot/queue"],
  });

  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [rewriteItem, setRewriteItem] = useState<string | null>(null);
  const [rewriteTone, setRewriteTone] = useState("friendly");
  const [rewriteLength, setRewriteLength] = useState("medium");
  const [rewriteInstructions, setRewriteInstructions] = useState("");

  const updateConfig = useMutation({
    mutationFn: async (data: Partial<AutopilotConfig>) => { const r = await apiRequest("PATCH", "/api/autopilot/config", data); return r.json(); },
    onSuccess: () => { refetchConfig(); toast({ title: "Settings updated" }); },
  });

  const toggleMut = useMutation({
    mutationFn: async () => { const r = await apiRequest("POST", "/api/autopilot/toggle"); return r.json(); },
    onSuccess: (data) => { refetchConfig(); toast({ title: data.enabled ? "Autopilot ON" : "Autopilot OFF" }); },
  });

  const runNowMut = useMutation({
    mutationFn: async () => { const r = await apiRequest("POST", "/api/autopilot/run"); return r.json(); },
    onSuccess: () => { refetchConfig(); refetchQueue(); toast({ title: "Autopilot cycle complete" }); },
  });

  const regenerateMut = useMutation({
    mutationFn: async (params: { id: string; tone?: string; length?: string; instructions?: string }) => {
      const r = await apiRequest("POST", `/api/autopilot/queue/${params.id}/regenerate`, { tone: params.tone || "friendly", length: params.length || "medium", instructions: params.instructions || "" });
      return r.json();
    },
    onSuccess: () => { refetchQueue(); toast({ title: "Email rewritten" }); },
  });

  const sendMut = useMutation({
    mutationFn: async (id: string) => { const r = await apiRequest("POST", `/api/autopilot/queue/${id}/send`); return r.json(); },
    onSuccess: () => { refetchQueue(); refetchConfig(); toast({ title: "Email sent" }); },
    onError: (err: Error) => { toast({ title: "Send failed", description: err.message.replace(/^\d+:\s*/, ""), variant: "destructive" }); },
  });

  const skipMut = useMutation({
    mutationFn: async (id: string) => apiRequest("POST", `/api/autopilot/queue/${id}/skip`),
    onSuccess: () => { refetchQueue(); toast({ title: "Skipped" }); },
  });

  const deleteMut = useMutation({
    mutationFn: async (id: string) => apiRequest("DELETE", `/api/autopilot/queue/${id}`),
    onSuccess: () => { refetchQueue(); toast({ title: "Deleted" }); },
  });

  const c = config;
  const filteredQueue = filterStatus === "all" ? queue : queue.filter(q => q.status === filterStatus);
  const pendingCount = queue.filter(q => q.status === "pending").length;
  const readyCount = queue.filter(q => q.status === "ready").length;
  const sentCount = queue.filter(q => q.status === "sent").length;

  return (
    <div className="space-y-6">
      {/* Header + Master Toggle */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2"><Zap className="w-5 h-5 text-primary" /> AI Autopilot</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Automated lead enrichment, AI-written outreach, and smart follow-ups — runs every 5 minutes
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button size="sm" variant="outline" onClick={() => runNowMut.mutate()} disabled={runNowMut.isPending}>
            <Play className={`w-3.5 h-3.5 ${runNowMut.isPending ? "animate-spin" : ""}`} />
            {runNowMut.isPending ? "Running..." : "Run Now"}
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{c?.enabled ? "ON" : "OFF"}</span>
            <Switch checked={!!c?.enabled} onCheckedChange={() => toggleMut.mutate()} />
          </div>
        </div>
      </div>

      {/* Status Banner */}
      {c?.enabled ? (
        <Card className="border-emerald-400/20 bg-emerald-400/5">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm font-medium text-emerald-400">Autopilot is active</span>
            <span className="text-xs text-muted-foreground">Last run: {timeAgo(c.lastRunAt)}</span>
            <div className="ml-auto flex items-center gap-4 text-xs text-muted-foreground">
              <span>{c.totalEmailed} emails sent</span>
              <span>{c.totalFollowUps} follow-ups</span>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-yellow-400/20 bg-yellow-400/5">
          <CardContent className="p-4 flex items-center gap-3">
            <Pause className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-yellow-400">Autopilot is paused — toggle ON to start automation</span>
          </CardContent>
        </Card>
      )}

      {/* How it works */}
      <Card className="border-border/30 bg-muted/30">
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">How Autopilot works:</span> Only <span className="text-amber-400 font-medium">unassigned leads</span> (marked 🤖 Autopilot in the Pipeline) are handled automatically.
            When you assign a lead to a team member, autopilot stops touching it.
            Autopilot generates emails into the queue below for your review before sending — nothing goes out without approval.
          </p>
        </CardContent>
      </Card>

      {/* Config Panels */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Auto-Outreach */}
        <Card className="border-border/50">
          <CardHeader className="py-3 px-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2"><Mail className="w-4 h-4" /> Auto-Outreach</CardTitle>
              <Switch checked={!!c?.autoOutreachEnabled} onCheckedChange={(v) => updateConfig.mutate({ autoOutreachEnabled: v })} />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-3">
            <p className="text-[10px] text-muted-foreground">AI writes unique emails & SMS for each new lead. No templates — every message is personalized to their business, processor, and vertical.</p>
            <div className="rounded-md border border-border/30 p-2.5 space-y-2">
              <p className="text-[10px] font-medium text-muted-foreground">Outreach Channels</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2"><Mail className="w-3 h-3 text-blue-400" /><span className="text-xs">Emails</span></div>
                <Switch checked={c?.outreachEmailEnabled !== false} onCheckedChange={(v) => updateConfig.mutate({ outreachEmailEnabled: v })} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2"><Phone className="w-3 h-3 text-emerald-400" /><span className="text-xs">SMS Drafts</span></div>
                <Switch checked={c?.outreachSmsEnabled !== false} onCheckedChange={(v) => updateConfig.mutate({ outreachSmsEnabled: v })} />
              </div>
              {!c?.outreachEmailEnabled && !c?.outreachSmsEnabled && (
                <p className="text-[10px] text-amber-400">Both channels are off — autopilot won't generate any messages.</p>
              )}
            </div>
            <div>
              <Label className="text-[10px]">Delay after lead created (hours)</Label>
              <Input type="number" className="h-7 text-xs" value={c?.outreachDelay ?? 2}
                onChange={(e) => updateConfig.mutate({ outreachDelay: parseInt(e.target.value) || 2 })} />
            </div>
            <div>
              <Label className="text-[10px]">Max emails per day</Label>
              <Input type="number" className="h-7 text-xs" value={c?.maxOutreachPerDay ?? 15}
                onChange={(e) => updateConfig.mutate({ maxOutreachPerDay: parseInt(e.target.value) || 15 })} />
            </div>
          </CardContent>
        </Card>

        {/* Auto Follow-Ups */}
        <Card className="border-border/50">
          <CardHeader className="py-3 px-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2"><RefreshCw className="w-4 h-4" /> Smart Follow-Ups</CardTitle>
              <Switch checked={!!c?.autoFollowUpEnabled} onCheckedChange={(v) => updateConfig.mutate({ autoFollowUpEnabled: v })} />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-3">
            <p className="text-[10px] text-muted-foreground">Automatically follows up with leads who haven't responded. Each follow-up uses a different angle — value stat, competitor insight, then a breakup email.</p>
            <div>
              <Label className="text-[10px]">Days between follow-ups</Label>
              <Input type="number" className="h-7 text-xs" value={c?.followUpAfterDays ?? 3}
                onChange={(e) => updateConfig.mutate({ followUpAfterDays: parseInt(e.target.value) || 3 })} />
            </div>
            <div>
              <Label className="text-[10px]">Max follow-ups per lead</Label>
              <Select value={String(c?.maxFollowUpsPerLead ?? 3)} onValueChange={(v) => updateConfig.mutate({ maxFollowUpsPerLead: parseInt(v) })}>
                <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 follow-up</SelectItem>
                  <SelectItem value="2">2 follow-ups</SelectItem>
                  <SelectItem value="3">3 follow-ups (recommended)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Auto-Enrich */}
        <Card className="border-border/50">
          <CardHeader className="py-3 px-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2"><Sparkles className="w-4 h-4" /> Auto-Enrich</CardTitle>
              <Switch checked={!!c?.autoEnrichEnabled} onCheckedChange={(v) => updateConfig.mutate({ autoEnrichEnabled: v })} />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-3">
            <p className="text-[10px] text-muted-foreground">When a lead is imported with a website URL, AI automatically scans it to fill in phone, email, address, processor, and vertical — so you don't have to.</p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-[10px]">
                <CheckCircle className="w-3 h-3 text-emerald-400" />
                <span>Payment processor detection</span>
              </div>
              <div className="flex items-center gap-2 text-[10px]">
                <CheckCircle className="w-3 h-3 text-emerald-400" />
                <span>Contact info extraction</span>
              </div>
              <div className="flex items-center gap-2 text-[10px]">
                <CheckCircle className="w-3 h-3 text-emerald-400" />
                <span>Business vertical classification</span>
              </div>
              <div className="flex items-center gap-2 text-[10px]">
                <CheckCircle className="w-3 h-3 text-emerald-400" />
                <span>Tech stack identification</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Email Queue */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <Mail className="w-4 h-4" /> Outreach Queue
            {pendingCount > 0 && <Badge variant="outline" className="text-[10px] text-yellow-400 bg-yellow-400/10">{pendingCount} pending</Badge>}
            {readyCount > 0 && <Badge variant="outline" className="text-[10px] text-emerald-400 bg-emerald-400/10">{readyCount} ready</Badge>}
          </h3>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[140px] h-7 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All ({queue.length})</SelectItem>
              <SelectItem value="pending">Pending ({queue.filter(q => q.status === "pending").length})</SelectItem>
              <SelectItem value="ready">Ready ({readyCount})</SelectItem>
              <SelectItem value="sent">Sent ({sentCount})</SelectItem>
              <SelectItem value="failed">Failed ({queue.filter(q => q.status === "failed").length})</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          {filteredQueue.map(item => {
            const sCfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.pending;
            const StatusIcon = sCfg.icon;
            const isExpanded = expandedItem === item.id;

            return (
              <Card key={item.id} className="border-border/50">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <StatusIcon className={`w-4 h-4 shrink-0 ${sCfg.color.split(" ")[0]} ${item.status === "generating" ? "animate-spin" : ""}`} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-medium truncate">{item.leadBusiness || item.leadName || "Unknown"}</span>
                          <Badge variant="outline" className={`text-[10px] ${sCfg.color}`}>{sCfg.label}</Badge>
                          <Badge variant="outline" className="text-[10px]">{item.type}</Badge>
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {item.leadEmail && <span>{item.leadEmail}</span>}
                          {item.subject && <span className="ml-2">Subject: {item.subject}</span>}
                          {item.error && <span className="ml-2 text-red-400">{item.error}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {item.status === "ready" && (
                        <>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setExpandedItem(isExpanded ? null : item.id)} title="Preview">
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-emerald-400" onClick={() => sendMut.mutate(item.id)} title="Send now" disabled={sendMut.isPending}>
                            <Send className="w-3 h-3" />
                          </Button>
                        </>
                      )}
                      {(item.status === "pending" || item.status === "ready" || item.status === "failed") && (
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setRewriteItem(rewriteItem === item.id ? null : item.id); setRewriteTone("friendly"); setRewriteLength("medium"); setRewriteInstructions(""); }} title="Rewrite with AI" disabled={regenerateMut.isPending}>
                          <RotateCw className={`w-3 h-3 ${regenerateMut.isPending && regenerateMut.variables?.id === item.id ? "animate-spin" : ""}`} />
                        </Button>
                      )}
                      {item.status !== "sent" && (
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" onClick={() => skipMut.mutate(item.id)} title="Skip">
                          <SkipForward className="w-3 h-3" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400" onClick={() => deleteMut.mutate(item.id)} title="Delete">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Expanded preview */}
                  {isExpanded && item.body && (
                    <div className="mt-3 pt-3 border-t border-border/30">
                      <div className="text-xs font-medium mb-1">Subject: {item.subject}</div>
                      <div className="text-xs text-muted-foreground whitespace-pre-wrap bg-muted/30 rounded p-3 max-h-48 overflow-y-auto">
                        {item.body}
                      </div>
                    </div>
                  )}

                  {/* AI Rewrite panel */}
                  {rewriteItem === item.id && (
                    <div className="mt-3 pt-3 border-t border-border/30 space-y-3">
                      {item.body && (
                        <div>
                          <div className="text-[10px] text-muted-foreground mb-1 font-medium">Current message:</div>
                          <div className="text-xs text-muted-foreground whitespace-pre-wrap bg-muted/30 rounded p-2.5 max-h-32 overflow-y-auto">{item.body}</div>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-[10px] text-muted-foreground">Tone</Label>
                          <Select value={rewriteTone} onValueChange={setRewriteTone}>
                            <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="friendly">Friendly</SelectItem>
                              <SelectItem value="professional">Professional</SelectItem>
                              <SelectItem value="casual">Casual</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-[10px] text-muted-foreground">Length</Label>
                          <Select value={rewriteLength} onValueChange={setRewriteLength}>
                            <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="short">Short (2-3 sentences)</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="long">Long (detailed)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-[10px] text-muted-foreground">Custom instructions (optional)</Label>
                        <Textarea value={rewriteInstructions} onChange={(e) => setRewriteInstructions(e.target.value)} placeholder='e.g. "Mention their Yelp reviews" or "Ask about their current processor"' className="text-xs h-16 resize-none" />
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="text-xs h-7" onClick={() => { regenerateMut.mutate({ id: item.id, tone: rewriteTone, length: rewriteLength, instructions: rewriteInstructions }); setRewriteItem(null); }} disabled={regenerateMut.isPending}>
                          <Sparkles className="w-3 h-3 mr-1" />Rewrite
                        </Button>
                        <Button size="sm" variant="ghost" className="text-xs h-7" onClick={() => setRewriteItem(null)}>Cancel</Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}

          {filteredQueue.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center">
                <Bot className="w-8 h-8 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  {queue.length === 0
                    ? "No emails in queue. Import leads and turn on Auto-Outreach to get started."
                    : "No emails match this filter."}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
