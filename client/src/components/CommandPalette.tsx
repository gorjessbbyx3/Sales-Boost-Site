import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { UserPlus, Users, Mail, FolderKanban, LayoutDashboard, ClipboardList, BookOpen, Target, DollarSign, Zap, Sparkles, FolderOpen, GraduationCap, MapPin, Calendar, ArrowRight, Settings, Search } from "lucide-react";

export interface GlobalSearchResult {
  leads: Array<{ id: string; name: string; business: string; status: string }>;
  clients: Array<{ id: string; name: string; business: string }>;
  threads: Array<{ id: string; subject: string; contactName: string; contactEmail: string }>;
  tasks: Array<{ id: string; title: string; assignee: string; dueDate: string }>;
}

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onNavigate: (tab: string, recordId?: string) => void;
}

const NAV_ITEMS: { tab: string; label: string; icon: typeof Mail; group: string; keywords?: string[] }[] = [
  { tab: "overview",  label: "Today",          icon: LayoutDashboard, group: "Go to" },
  { tab: "tasks",     label: "Tasks & Schedule", icon: ClipboardList, group: "Go to" },
  { tab: "leads",     label: "Pipeline",       icon: UserPlus,        group: "Go to", keywords: ["leads"] },
  { tab: "follow-up", label: "Follow-Up",      icon: ArrowRight,      group: "Go to" },
  { tab: "clients",   label: "Clients",        icon: Users,           group: "Go to" },
  { tab: "outreach",  label: "Outreach Map",   icon: MapPin,          group: "Go to" },
  { tab: "social",    label: "Social Calendar", icon: Calendar,       group: "Go to" },
  { tab: "inbox",     label: "Inbox",          icon: Mail,            group: "Go to", keywords: ["email", "mail"] },
  { tab: "playbooks", label: "Playbooks",      icon: BookOpen,        group: "Go to" },
  { tab: "analytics", label: "Analytics",      icon: Target,          group: "Go to" },
  { tab: "finances",  label: "Finances",       icon: DollarSign,      group: "Go to", keywords: ["money", "revenue"] },
  { tab: "autopilot", label: "Autopilot",      icon: Zap,             group: "Go to" },
  { tab: "ai-tools",  label: "AI Tools",       icon: Sparkles,        group: "Go to" },
  { tab: "files",     label: "Files",          icon: FolderOpen,      group: "Go to" },
  { tab: "partners",  label: "Partners",       icon: GraduationCap,   group: "Go to" },
  { tab: "settings",  label: "Settings",       icon: Settings,        group: "Go to" },
];

export function CommandPalette({ open, onOpenChange, onNavigate }: Props) {
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebounced(q.trim()), 180);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    if (!open) setQ("");
  }, [open]);

  const { data: results } = useQuery<GlobalSearchResult>({
    queryKey: [`/api/search/global?q=${encodeURIComponent(debounced)}`],
    enabled: open && debounced.length >= 2,
  });

  const navigate = (tab: string, recordId?: string) => {
    onOpenChange(false);
    setTimeout(() => onNavigate(tab, recordId), 50);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search leads, clients, threads, tasks… or type a page name"
        value={q}
        onValueChange={setQ}
      />
      <CommandList className="max-h-[420px]">
        <CommandEmpty>
          {debounced.length < 2 ? (
            <div className="flex items-center justify-center gap-2 py-6 text-xs text-muted-foreground">
              <Search className="w-3.5 h-3.5" />Type at least 2 characters to search records
            </div>
          ) : "No results"}
        </CommandEmpty>

        {results && results.leads && results.leads.length > 0 && (
          <CommandGroup heading="Leads">
            {results.leads.map(l => (
              <CommandItem key={`lead-${l.id}`} value={`lead ${l.id} ${l.name} ${l.business}`} onSelect={() => navigate("leads", l.id)}>
                <UserPlus className="w-3.5 h-3.5 mr-2 text-blue-400" />
                <span className="font-medium">{l.business || l.name}</span>
                {l.business && l.name && <span className="text-muted-foreground ml-1.5">· {l.name}</span>}
                <span className="ml-auto text-[10px] text-muted-foreground">{l.status}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {results && results.clients && results.clients.length > 0 && (
          <CommandGroup heading="Clients">
            {results.clients.map(c => (
              <CommandItem key={`client-${c.id}`} value={`client ${c.id} ${c.name} ${c.business}`} onSelect={() => navigate("clients", c.id)}>
                <Users className="w-3.5 h-3.5 mr-2 text-emerald-400" />
                <span className="font-medium">{c.business || c.name}</span>
                {c.business && c.name && <span className="text-muted-foreground ml-1.5">· {c.name}</span>}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {results && results.threads && results.threads.length > 0 && (
          <CommandGroup heading="Inbox">
            {results.threads.map(t => (
              <CommandItem key={`thread-${t.id}`} value={`thread ${t.id} ${t.subject} ${t.contactName} ${t.contactEmail}`} onSelect={() => navigate("inbox", t.id)}>
                <Mail className="w-3.5 h-3.5 mr-2 text-amber-400" />
                <span className="truncate">{t.subject || "(no subject)"}</span>
                <span className="ml-2 text-[10px] text-muted-foreground truncate">{t.contactName || t.contactEmail}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {results && results.tasks && results.tasks.length > 0 && (
          <CommandGroup heading="Tasks">
            {results.tasks.map(t => (
              <CommandItem key={`task-${t.id}`} value={`task ${t.id} ${t.title}`} onSelect={() => navigate("tasks", t.id)}>
                <ClipboardList className="w-3.5 h-3.5 mr-2 text-purple-400" />
                <span className="truncate">{t.title}</span>
                {t.dueDate && <span className="ml-auto text-[10px] text-muted-foreground">{t.dueDate}</span>}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {(results === undefined || (debounced.length < 2)) && (
          <CommandGroup heading="Go to">
            {NAV_ITEMS.map(n => (
              <CommandItem key={n.tab} value={`${n.label} ${(n.keywords || []).join(" ")}`} onSelect={() => navigate(n.tab)}>
                <n.icon className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
                <span>{n.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {results && (results.leads?.length || results.clients?.length || results.threads?.length || results.tasks?.length) ? (
          <>
            <CommandSeparator />
            <CommandGroup heading="Go to">
              {NAV_ITEMS.slice(0, 6).map(n => (
                <CommandItem key={n.tab} value={`go ${n.label}`} onSelect={() => navigate(n.tab)}>
                  <n.icon className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
                  <span>{n.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        ) : null}
      </CommandList>
    </CommandDialog>
  );
}
