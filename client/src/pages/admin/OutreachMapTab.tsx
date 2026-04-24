import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  MapPin, Phone, Star, Search, MessageSquare, TrendingUp, RefreshCw,
  Plus, Edit3, Trash2, CheckCircle2, X, Loader2, Navigation,
} from "lucide-react";
import type { OutreachBusiness } from "@shared/schema";

// ─── Constants ───────────────────────────────────────────────────────────────
const OFFICE_LAT = 21.2942;
const OFFICE_LNG = -157.8282;
const OFFICE_ADDR = "1917 S King St, Honolulu, HI";

const STATUS_CONFIG = {
  not_contacted: { label: "Not Yet",          color: "#9CA3AF", ring: "bg-gray-400",    text: "text-gray-600 dark:text-gray-400",    bg: "bg-gray-100 dark:bg-gray-800" },
  contacted:     { label: "Talked To",         color: "#22c55e", ring: "bg-green-500",   text: "text-green-700 dark:text-green-400",  bg: "bg-green-50 dark:bg-green-900/30" },
  visited:       { label: "Need to Go Back",   color: "#f97316", ring: "bg-orange-500",  text: "text-orange-700 dark:text-orange-400",bg: "bg-orange-50 dark:bg-orange-900/30" },
  converted:     { label: "Converted",         color: "#3b82f6", ring: "bg-blue-500",    text: "text-blue-700 dark:text-blue-400",    bg: "bg-blue-50 dark:bg-blue-900/30" },
} as const;
type Status = keyof typeof STATUS_CONFIG;
const STATUS_ORDER: Status[] = ["not_contacted", "contacted", "visited", "converted"];

const DISTANCE_OPTIONS = [
  { value: "all",  label: "Any Distance" },
  { value: "0.25", label: "< ¼ mile" },
  { value: "0.5",  label: "< ½ mile" },
  { value: "1",    label: "< 1 mile" },
  { value: "2",    label: "< 2 miles" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function haversine(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 3958.8;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function makePin(color: string, size = 14, border = 2) {
  return L.divIcon({
    className: "",
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:${border}px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.45);cursor:pointer"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2 + 4)],
  });
}

const officePin = L.divIcon({
  className: "",
  html: `<div style="width:20px;height:20px;border-radius:50%;background:#ef4444;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.6);z-index:999"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -14],
});

function StarRating({ rating }: { rating: number | null }) {
  if (!rating) return null;
  return (
    <span className="flex items-center gap-0.5 text-xs text-amber-500">
      <Star className="h-3 w-3 fill-current" />
      {rating.toFixed(1)}
    </span>
  );
}

// ─── Empty form ───────────────────────────────────────────────────────────────
const emptyForm = { name: "", address: "", category: "", type: "", phone: "", rating: "", notes: "" };

// ─── Main component ───────────────────────────────────────────────────────────
export default function OutreachMapTab() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [distanceFilter, setDistanceFilter] = useState("all");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [editBusiness, setEditBusiness] = useState<OutreachBusiness | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [geocodingRemaining, setGeocodingRemaining] = useState(0);
  const geocodingStarted = useRef(false);
  const geocodingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: businesses = [], isLoading, refetch } = useQuery<OutreachBusiness[]>({
    queryKey: ["/api/outreach-businesses"],
    staleTime: 10_000,
  });

  // ── Geocoding loop ────────────────────────────────────────────────────────
  const doNextGeocode = useCallback(async () => {
    try {
      const resp = await apiRequest("POST", "/api/outreach-businesses/geocode-next");
      const data = await resp.json();
      await queryClient.invalidateQueries({ queryKey: ["/api/outreach-businesses"] });
      if (!data.done && data.remaining > 0) {
        setGeocodingRemaining(data.remaining);
        geocodingTimer.current = setTimeout(doNextGeocode, 1350);
      } else {
        setGeocodingRemaining(0);
        geocodingStarted.current = false;
      }
    } catch {
      setGeocodingRemaining(0);
      geocodingStarted.current = false;
    }
  }, []);

  useEffect(() => {
    if (!geocodingStarted.current && businesses.length > 0) {
      const ungeocoded = businesses.filter(b => !b.geocoded).length;
      if (ungeocoded > 0) {
        geocodingStarted.current = true;
        setGeocodingRemaining(ungeocoded);
        geocodingTimer.current = setTimeout(doNextGeocode, 600);
      }
    }
    return () => { if (geocodingTimer.current) clearTimeout(geocodingTimer.current); };
  }, [businesses.length, doNextGeocode]);

  // ── Mutations ─────────────────────────────────────────────────────────────
  const updateMutation = useMutation({
    mutationFn: (vars: { id: number } & Record<string, any>) => {
      const { id, ...body } = vars;
      return apiRequest("PATCH", `/api/outreach-businesses/${id}`, body);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/outreach-businesses"] }),
  });

  const createMutation = useMutation({
    mutationFn: (body: typeof emptyForm) => apiRequest("POST", "/api/outreach-businesses", body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/outreach-businesses"] });
      setShowAdd(false);
      setForm(emptyForm);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/outreach-businesses/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/outreach-businesses"] });
      setSelectedId(null);
    },
  });

  // ── Derived data ──────────────────────────────────────────────────────────
  const categories = useMemo(() => Array.from(new Set(businesses.map(b => b.category))).sort(), [businesses]);

  const withDistance = useMemo(() =>
    businesses.map(b => ({
      ...b,
      distance: (b.lat != null && b.lng != null)
        ? haversine(OFFICE_LAT, OFFICE_LNG, b.lat, b.lng)
        : null,
    })),
  [businesses]);

  const filtered = useMemo(() => {
    const maxDist = distanceFilter !== "all" ? parseFloat(distanceFilter) : Infinity;
    return withDistance.filter(b => {
      if (categoryFilter !== "all" && b.category !== categoryFilter) return false;
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      if (distanceFilter !== "all") {
        if (b.distance === null || b.distance > maxDist) return false;
      }
      if (search) {
        const q = search.toLowerCase();
        if (!b.name.toLowerCase().includes(q) && !b.address.toLowerCase().includes(q) && !b.type.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [withDistance, categoryFilter, statusFilter, distanceFilter, search]);

  const stats = useMemo(() => {
    const total = businesses.length;
    const byStatus = businesses.reduce((acc, b) => { acc[b.status as Status] = (acc[b.status as Status] || 0) + 1; return acc; }, {} as Record<Status, number>);
    const geocodedCount = businesses.filter(b => b.geocoded).length;
    return { total, geocodedCount, ...byStatus };
  }, [businesses]);

  function cycleStatus(b: OutreachBusiness) {
    const idx = STATUS_ORDER.indexOf(b.status as Status);
    const next = STATUS_ORDER[(idx + 1) % STATUS_ORDER.length];
    updateMutation.mutate({ id: b.id, status: next });
  }

  function setStatus(b: OutreachBusiness, status: Status) {
    updateMutation.mutate({ id: b.id, status });
  }

  function openEdit(b: OutreachBusiness) {
    setEditBusiness(b);
    setForm({ name: b.name, address: b.address, category: b.category, type: b.type, phone: b.phone, rating: b.rating?.toString() || "", notes: b.notes });
  }

  function submitEdit() {
    if (!editBusiness) return;
    updateMutation.mutate({ id: editBusiness.id, ...form });
    setEditBusiness(null);
    setForm(emptyForm);
  }

  function submitAdd() {
    createMutation.mutate(form);
  }

  const geocodedBusinesses = useMemo(() => withDistance.filter(b => b.geocoded && b.lat != null && b.lng != null), [withDistance]);
  const mapFiltered = useMemo(() => {
    const maxDist = distanceFilter !== "all" ? parseFloat(distanceFilter) : Infinity;
    return geocodedBusinesses.filter(b => {
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      if (distanceFilter !== "all" && (b.distance === null || b.distance > maxDist)) return false;
      return true;
    });
  }, [geocodedBusinesses, statusFilter, distanceFilter]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Outreach Map</h2>
          <p className="text-sm text-muted-foreground">McCully &amp; King St area · Office: {OFFICE_ADDR}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => { setShowAdd(true); setForm(emptyForm); }}>
            <Plus className="h-4 w-4 mr-1" /> Add Business
          </Button>
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Geocoding progress */}
      {geocodingRemaining > 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 border border-border rounded-lg px-3 py-2">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span>Placing pins on map… {stats.geocodedCount} / {stats.total} geocoded ({geocodingRemaining} remaining)</span>
          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden ml-2">
            <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${(stats.geocodedCount / stats.total) * 100}%` }} />
          </div>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {STATUS_ORDER.map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(statusFilter === s ? "all" : s)}
            className={`rounded-lg border p-3 text-left transition-all ${statusFilter === s ? "ring-2 ring-primary" : "border-border hover:border-primary/50"} ${STATUS_CONFIG[s].bg}`}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className={`h-2.5 w-2.5 rounded-full inline-block ${STATUS_CONFIG[s].ring}`} />
              <span className={`text-xs font-medium ${STATUS_CONFIG[s].text}`}>{STATUS_CONFIG[s].label}</span>
            </div>
            <p className={`text-2xl font-bold ${STATUS_CONFIG[s].text}`}>{stats[s] || 0}</p>
          </button>
        ))}
      </div>

      {/* Map + List */}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-4">
        {/* ── Map ── */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="p-2.5 border-b border-border flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-red-500" />
            <span className="font-medium">Live Map</span>
            <span className="text-muted-foreground text-xs ml-auto">{mapFiltered.length} pins shown</span>
          </div>
          {/* Color legend */}
          <div className="flex gap-3 px-3 py-1.5 border-b border-border flex-wrap">
            {STATUS_ORDER.map(s => (
              <span key={s} className="flex items-center gap-1 text-xs text-muted-foreground">
                <span className="h-2.5 w-2.5 rounded-full inline-block flex-shrink-0" style={{ background: STATUS_CONFIG[s].color }} />
                {STATUS_CONFIG[s].label}
              </span>
            ))}
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="h-2.5 w-2.5 rounded-full inline-block bg-red-500 flex-shrink-0" />
              Office
            </span>
          </div>
          <div style={{ height: 460 }}>
            <MapContainer
              center={[OFFICE_LAT, OFFICE_LNG]}
              zoom={15}
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {/* Office marker */}
              <Marker position={[OFFICE_LAT, OFFICE_LNG]} icon={officePin}>
                <Popup>
                  <div className="text-sm">
                    <p className="font-bold">🏢 TechSavvy Hawaii (Office)</p>
                    <p className="text-gray-600">{OFFICE_ADDR}</p>
                  </div>
                </Popup>
              </Marker>
              {/* Business markers */}
              {mapFiltered.map(b => {
                const cfg = STATUS_CONFIG[b.status as Status] ?? STATUS_CONFIG.not_contacted;
                const isSelected = b.id === selectedId;
                const icon = makePin(cfg.color, isSelected ? 18 : 13, isSelected ? 3 : 2);
                return (
                  <Marker
                    key={b.id}
                    position={[b.lat!, b.lng!]}
                    icon={icon}
                    eventHandlers={{ click: () => setSelectedId(b.id) }}
                  >
                    <Popup minWidth={220}>
                      <div style={{ fontSize: 13, lineHeight: 1.4 }}>
                        <p style={{ fontWeight: 700, marginBottom: 2 }}>{b.name}</p>
                        <p style={{ color: "#666", marginBottom: 4 }}>{b.address}</p>
                        {b.type && <p style={{ color: "#888", marginBottom: 2 }}>{b.category} · {b.type}</p>}
                        {b.phone && <p style={{ marginBottom: 6 }}><a href={`tel:${b.phone}`} style={{ color: "#3b82f6" }}>📞 {b.phone}</a></p>}
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 6 }}>
                          {STATUS_ORDER.map(s => (
                            <button
                              key={s}
                              onClick={() => setStatus(b, s)}
                              style={{
                                background: b.status === s ? STATUS_CONFIG[s].color : "#f3f4f6",
                                color: b.status === s ? "white" : "#374151",
                                border: "none", borderRadius: 4, padding: "2px 6px", fontSize: 11, cursor: "pointer",
                              }}
                            >
                              {STATUS_CONFIG[s].label}
                            </button>
                          ))}
                        </div>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button onClick={() => openEdit(b)} style={{ fontSize: 11, color: "#3b82f6", cursor: "pointer", background: "none", border: "none" }}>✏️ Edit</button>
                          <button onClick={() => { if (confirm(`Delete "${b.name}"?`)) deleteMutation.mutate(b.id); }} style={{ fontSize: 11, color: "#ef4444", cursor: "pointer", background: "none", border: "none" }}>🗑 Delete</button>
                        </div>
                        {b.distance != null && <p style={{ color: "#aaa", fontSize: 11, marginTop: 4 }}>{b.distance.toFixed(2)} mi from office</p>}
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        </div>

        {/* ── Business List ── */}
        <div className="bg-card border border-border rounded-lg flex flex-col" style={{ height: 546 }}>
          {/* Filters */}
          <div className="p-3 border-b border-border space-y-2 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-9" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={distanceFilter} onValueChange={setDistanceFilter}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Distance" /></SelectTrigger>
                <SelectContent>
                  {DISTANCE_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground">{filtered.length} of {businesses.length} businesses</p>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {isLoading ? (
              <div className="flex items-center justify-center h-40 text-muted-foreground text-sm gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading…
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">No results</div>
            ) : (
              filtered.map(b => {
                const cfg = STATUS_CONFIG[b.status as Status] ?? STATUS_CONFIG.not_contacted;
                const isSelected = b.id === selectedId;
                return (
                  <div
                    key={b.id}
                    onClick={() => setSelectedId(isSelected ? null : b.id)}
                    className={`p-2.5 cursor-pointer transition-colors ${isSelected ? "bg-accent" : "hover:bg-muted/40"}`}
                  >
                    <div className="flex items-start gap-2">
                      {/* Status dot */}
                      <button
                        onClick={e => { e.stopPropagation(); cycleStatus(b); }}
                        title="Click to cycle status"
                        className="mt-1 flex-shrink-0"
                      >
                        <span className="block h-3 w-3 rounded-full border-2 border-white shadow" style={{ background: cfg.color }} />
                      </button>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <p className="text-sm font-medium leading-tight truncate">{b.name}</p>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <StarRating rating={b.rating} />
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{b.address}</p>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-4 cursor-pointer ${cfg.bg} ${cfg.text} border-current/20`}
                            onClick={e => { e.stopPropagation(); cycleStatus(b); }}>
                            {cfg.label}
                          </Badge>
                          {b.type && <span className="text-[10px] text-muted-foreground">{b.type}</span>}
                          {b.phone && (
                            <a href={`tel:${b.phone}`} onClick={e => e.stopPropagation()}
                              className="flex items-center gap-0.5 text-[10px] text-primary hover:underline">
                              <Phone className="h-2.5 w-2.5" />{b.phone}
                            </a>
                          )}
                          {b.distance != null && (
                            <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                              <Navigation className="h-2.5 w-2.5" />{b.distance.toFixed(2)} mi
                            </span>
                          )}
                        </div>
                        {b.notes && <p className="text-[10px] text-muted-foreground italic mt-0.5 truncate">📝 {b.notes}</p>}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-1 flex-shrink-0">
                        <button
                          onClick={e => { e.stopPropagation(); openEdit(b); }}
                          className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                          title="Edit"
                        >
                          <Edit3 className="h-3 w-3" />
                        </button>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            if (confirm(`Delete "${b.name}"?`)) deleteMutation.mutate(b.id);
                          }}
                          className="p-1 rounded hover:bg-red-100 text-muted-foreground hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ── Add / Edit Modal ── */}
      <Dialog open={showAdd || !!editBusiness} onOpenChange={open => { if (!open) { setShowAdd(false); setEditBusiness(null); setForm(emptyForm); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editBusiness ? "Edit Business" : "Add Business"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {[
              { key: "name",     label: "Business Name",  placeholder: "e.g. Zippy's McCully" },
              { key: "address",  label: "Address",         placeholder: "e.g. 1725 S King St, Honolulu, HI" },
              { key: "category", label: "Category",        placeholder: "e.g. RESTAURANTS & FOOD" },
              { key: "type",     label: "Type",            placeholder: "e.g. Restaurant" },
              { key: "phone",    label: "Phone",           placeholder: "(808) 555-0000" },
              { key: "rating",   label: "Rating (0-5)",   placeholder: "4.5" },
            ].map(({ key, label, placeholder }) => (
              <div key={key} className="space-y-1">
                <Label className="text-xs">{label}</Label>
                <Input
                  className="h-8 text-sm"
                  placeholder={placeholder}
                  value={(form as any)[key]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                />
              </div>
            ))}
            <div className="space-y-1">
              <Label className="text-xs">Notes</Label>
              <textarea
                className="w-full border border-input rounded-md p-2 text-sm bg-background resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                rows={2}
                placeholder="Optional notes…"
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => { setShowAdd(false); setEditBusiness(null); setForm(emptyForm); }}>
              <X className="h-4 w-4 mr-1" /> Cancel
            </Button>
            <Button size="sm" onClick={editBusiness ? submitEdit : submitAdd}
              disabled={createMutation.isPending || updateMutation.isPending}>
              {(createMutation.isPending || updateMutation.isPending)
                ? <Loader2 className="h-4 w-4 animate-spin mr-1" />
                : <CheckCircle2 className="h-4 w-4 mr-1" />}
              {editBusiness ? "Save Changes" : "Add Business"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
