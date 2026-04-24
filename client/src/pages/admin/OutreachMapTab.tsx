import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Phone, Star, Search, CheckCircle2, MessageSquare, Eye, TrendingUp, RefreshCw } from "lucide-react";
import type { OutreachBusiness } from "@shared/schema";

const STATUS_CONFIG = {
  not_contacted: { label: "Not Contacted", color: "bg-muted text-muted-foreground border-border", dot: "bg-gray-400" },
  contacted:     { label: "Contacted",     color: "bg-amber-500/10 text-amber-600 border-amber-500/30 dark:text-amber-400", dot: "bg-amber-400" },
  visited:       { label: "Visited",       color: "bg-blue-500/10 text-blue-600 border-blue-500/30 dark:text-blue-400", dot: "bg-blue-400" },
  converted:     { label: "Converted",     color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:text-emerald-400", dot: "bg-emerald-400" },
} as const;

type Status = keyof typeof STATUS_CONFIG;

const STATUS_ORDER: Status[] = ["not_contacted", "contacted", "visited", "converted"];

function StarRating({ rating }: { rating: number | null }) {
  if (!rating) return null;
  return (
    <span className="flex items-center gap-0.5 text-xs text-amber-500">
      <Star className="h-3 w-3 fill-current" />
      <span>{rating.toFixed(1)}</span>
    </span>
  );
}

export default function OutreachMapTab() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [noteInput, setNoteInput] = useState<Record<number, string>>({});

  const { data: businesses = [], isLoading, refetch } = useQuery<OutreachBusiness[]>({
    queryKey: ["/api/outreach-businesses"],
    staleTime: 30_000,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status, notes }: { id: number; status?: string; notes?: string }) =>
      apiRequest("PATCH", `/api/outreach-businesses/${id}`, { status, notes }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/outreach-businesses"] }),
  });

  const categories = useMemo(() => {
    const cats = Array.from(new Set(businesses.map(b => b.category))).sort();
    return cats;
  }, [businesses]);

  const filtered = useMemo(() => {
    return businesses.filter(b => {
      if (categoryFilter !== "all" && b.category !== categoryFilter) return false;
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return b.name.toLowerCase().includes(q) || b.address.toLowerCase().includes(q) || b.type.toLowerCase().includes(q);
      }
      return true;
    });
  }, [businesses, categoryFilter, statusFilter, search]);

  const stats = useMemo(() => {
    const total = businesses.length;
    const byStatus = businesses.reduce((acc, b) => {
      acc[b.status as Status] = (acc[b.status as Status] || 0) + 1;
      return acc;
    }, {} as Record<Status, number>);
    const contacted = (byStatus.contacted || 0) + (byStatus.visited || 0) + (byStatus.converted || 0);
    const pct = total > 0 ? Math.round((contacted / total) * 100) : 0;
    return { total, ...byStatus, contacted, pct };
  }, [businesses]);

  function cycleStatus(business: OutreachBusiness) {
    const current = business.status as Status;
    const idx = STATUS_ORDER.indexOf(current);
    const next = STATUS_ORDER[(idx + 1) % STATUS_ORDER.length];
    updateMutation.mutate({ id: business.id, status: next });
  }

  function saveNote(id: number) {
    const notes = noteInput[id] ?? "";
    updateMutation.mutate({ id, notes });
    setExpandedId(null);
  }

  const mapSrc = "https://maps.google.com/maps?q=1917+S+King+St+Honolulu+HI+96826&hl=en&z=15&output=embed";

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Outreach Map</h2>
          <p className="text-sm text-muted-foreground">McCully &amp; King St area · Centered on 1917 S King St</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-1.5 ${isLoading ? "animate-spin" : ""}`} />
          {isLoading ? "Loading…" : "Refresh"}
        </Button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Businesses", value: stats.total, icon: MapPin, color: "text-foreground" },
          { label: "Contacted",        value: (stats.contacted || 0), icon: MessageSquare, color: "text-amber-500" },
          { label: "Visited",          value: (stats.visited || 0),   icon: Eye,           color: "text-blue-500" },
          { label: "Converted",        value: (stats.converted || 0), icon: TrendingUp,    color: "text-emerald-500" },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <s.icon className={`h-4 w-4 ${s.color}`} />
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="bg-card border border-border rounded-lg p-3">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">Overall progress</span>
          <span className="font-medium">{stats.contacted} / {stats.total} contacted ({stats.pct}%)</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${stats.pct}%` }}
          />
        </div>
      </div>

      {/* Map + List split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Map */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="p-3 border-b border-border flex items-center gap-2">
            <MapPin className="h-4 w-4 text-red-500" />
            <span className="text-sm font-medium">1917 S King St, Honolulu, HI (Office)</span>
          </div>
          <div className="relative" style={{ height: 480 }}>
            <iframe
              title="Outreach Area Map"
              src={mapSrc}
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Business list */}
        <div className="bg-card border border-border rounded-lg flex flex-col" style={{ height: 537 }}>
          {/* Filters */}
          <div className="p-3 border-b border-border space-y-2 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search businesses…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8 h-9"
              />
            </div>
            <div className="flex gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="flex-1 h-8 text-xs">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36 h-8 text-xs">
                  <SelectValue placeholder="All status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {STATUS_ORDER.map(s => (
                    <SelectItem key={s} value={s}>{STATUS_CONFIG[s].label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground">
              Showing {filtered.length} of {businesses.length} businesses
            </p>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {isLoading ? (
              <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
                Loading businesses…
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
                No businesses match your filters
              </div>
            ) : (
              filtered.map(b => {
                const cfg = STATUS_CONFIG[b.status as Status] ?? STATUS_CONFIG.not_contacted;
                const isExpanded = expandedId === b.id;
                return (
                  <div key={b.id} className="p-3 hover:bg-muted/30 transition-colors">
                    <div className="flex items-start gap-3">
                      {/* Status dot + cycle button */}
                      <button
                        onClick={() => cycleStatus(b)}
                        title="Click to cycle status"
                        className="mt-1 flex-shrink-0"
                      >
                        <div className={`h-3 w-3 rounded-full ${cfg.dot} ring-2 ring-offset-1 ring-offset-background ring-current opacity-70 hover:opacity-100 transition-opacity`} />
                      </button>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <p className="text-sm font-medium leading-tight truncate">{b.name}</p>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <StarRating rating={b.rating} />
                            <Badge
                              variant="outline"
                              className={`text-[10px] px-1.5 py-0 h-5 cursor-pointer select-none ${cfg.color}`}
                              onClick={() => cycleStatus(b)}
                            >
                              {cfg.label}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{b.address}</p>
                        <div className="flex items-center gap-3 mt-1">
                          {b.type && <span className="text-xs text-muted-foreground">{b.type}</span>}
                          {b.phone && (
                            <a
                              href={`tel:${b.phone}`}
                              className="flex items-center gap-1 text-xs text-primary hover:underline"
                              onClick={e => e.stopPropagation()}
                            >
                              <Phone className="h-3 w-3" />
                              {b.phone}
                            </a>
                          )}
                        </div>
                        {b.notes && !isExpanded && (
                          <p className="text-xs text-muted-foreground mt-1 italic truncate">📝 {b.notes}</p>
                        )}
                      </div>

                      {/* Expand note button */}
                      <button
                        className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => {
                          if (isExpanded) {
                            setExpandedId(null);
                          } else {
                            setExpandedId(b.id);
                            setNoteInput(prev => ({ ...prev, [b.id]: b.notes || "" }));
                          }
                        }}
                        title="Add/edit note"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Expanded notes area */}
                    {isExpanded && (
                      <div className="mt-2 ml-6 space-y-1.5">
                        <textarea
                          className="w-full text-xs border border-border rounded p-1.5 bg-background resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                          rows={2}
                          placeholder="Add a note…"
                          value={noteInput[b.id] ?? ""}
                          onChange={e => setNoteInput(prev => ({ ...prev, [b.id]: e.target.value }))}
                        />
                        <div className="flex gap-2">
                          <Button size="sm" className="h-6 text-xs px-2" onClick={() => saveNote(b.id)}>
                            <CheckCircle2 className="h-3 w-3 mr-1" /> Save
                          </Button>
                          <Button size="sm" variant="ghost" className="h-6 text-xs px-2" onClick={() => setExpandedId(null)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Status legend */}
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="font-medium">Tip: Click the colored dot or badge on any business to cycle through statuses.</span>
        {STATUS_ORDER.map(s => (
          <span key={s} className="flex items-center gap-1">
            <span className={`h-2.5 w-2.5 rounded-full ${STATUS_CONFIG[s].dot}`} />
            {STATUS_CONFIG[s].label}
          </span>
        ))}
      </div>
    </div>
  );
}
