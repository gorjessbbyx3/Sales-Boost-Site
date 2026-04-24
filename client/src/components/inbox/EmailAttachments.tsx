import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Paperclip, Eye, Download, FolderPlus, Users, PenLine, Loader2,
  FileText, FileImage, FileVideo, FileAudio, File as FileIcon, Forward, X,
  CheckCircle2, Trash2,
} from "lucide-react";
import { PDFDocument, rgb } from "pdf-lib";

export interface EmailAttachment {
  id: string;
  messageId: string;
  threadId: string;
  filename: string;
  contentType: string;
  size: number;
  url: string;
  direction: "inbound" | "outbound";
  signedOf?: string;
  savedToFiles?: boolean;
  createdAt: string;
}

interface ClientLite { id: string; name: string; business?: string; }

function fmtSize(bytes: number): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function iconFor(contentType: string) {
  const ct = (contentType || "").toLowerCase();
  if (ct.startsWith("image/")) return FileImage;
  if (ct.startsWith("video/")) return FileVideo;
  if (ct.startsWith("audio/")) return FileAudio;
  if (ct.includes("pdf") || ct.includes("word") || ct.includes("document") || ct.startsWith("text/")) return FileText;
  return FileIcon;
}

// ─────────────────────────────────────────────────────────────────────
// Attachment List + Chip
// ─────────────────────────────────────────────────────────────────────

export function EmailAttachmentList({
  attachments,
  onSigned,
}: {
  attachments: EmailAttachment[];
  onSigned?: () => void;
}) {
  if (!attachments || attachments.length === 0) return null;
  return (
    <div className="mt-3 pt-3 border-t border-border/50">
      <div className="flex items-center gap-1.5 mb-2">
        <Paperclip className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-[11px] font-medium text-muted-foreground">
          {attachments.length} attachment{attachments.length !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {attachments.map((a) => (
          <AttachmentChip key={a.id} attachment={a} onSigned={onSigned} />
        ))}
      </div>
    </div>
  );
}

function AttachmentChip({ attachment, onSigned }: { attachment: EmailAttachment; onSigned?: () => void }) {
  const Icon = iconFor(attachment.contentType);
  const isPdf = (attachment.contentType || "").toLowerCase().includes("pdf");
  const { toast } = useToast();
  const [signOpen, setSignOpen] = useState(false);
  const [clientPickerOpen, setClientPickerOpen] = useState(false);

  const saveToFilesMut = useMutation({
    mutationFn: async () => {
      const r = await apiRequest("POST", `/api/email/attachments/${attachment.id}/save-to-files`, {});
      return r.json();
    },
    onSuccess: () => toast({ title: "Saved to admin files", description: `"${attachment.filename}" → Email Attachments` }),
    onError: (e: Error) => toast({ title: "Save failed", description: e.message, variant: "destructive" }),
  });

  const downloadFile = async () => {
    try {
      const res = await fetch(attachment.url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = attachment.filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
    } catch {
      // Fallback: open in new tab
      window.open(attachment.url, "_blank");
    }
  };

  return (
    <div className="group flex items-center gap-2 px-2 py-1.5 rounded-md border border-border/60 bg-muted/30 hover:bg-muted/60 transition-colors">
      <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
      <div className="flex flex-col min-w-0">
        <span className="text-xs font-medium truncate max-w-[180px]" title={attachment.filename}>
          {attachment.filename}
        </span>
        <span className="text-[10px] text-muted-foreground">{fmtSize(attachment.size)}</span>
      </div>
      {attachment.savedToFiles && (
        <Badge variant="outline" className="h-4 text-[9px] gap-0.5 px-1 border-emerald-500/40 text-emerald-400">
          <CheckCircle2 className="w-2.5 h-2.5" />Saved
        </Badge>
      )}
      <div className="flex items-center gap-0.5 ml-1">
        <Button size="sm" variant="ghost" className="h-6 w-6 p-0" title="View" onClick={() => window.open(attachment.url, "_blank")}>
          <Eye className="w-3 h-3" />
        </Button>
        <Button size="sm" variant="ghost" className="h-6 w-6 p-0" title="Download" onClick={downloadFile}>
          <Download className="w-3 h-3" />
        </Button>
        <Button size="sm" variant="ghost" className="h-6 w-6 p-0" title="Save to admin files" disabled={saveToFilesMut.isPending} onClick={() => saveToFilesMut.mutate()}>
          {saveToFilesMut.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <FolderPlus className="w-3 h-3" />}
        </Button>
        <SaveToClientPopover
          attachment={attachment}
          open={clientPickerOpen}
          onOpenChange={setClientPickerOpen}
        />
        {isPdf && (
          <Button size="sm" variant="ghost" className="h-6 w-6 p-0" title="Sign PDF" onClick={() => setSignOpen(true)}>
            <PenLine className="w-3 h-3" />
          </Button>
        )}
      </div>
      {signOpen && (
        <SignPdfDialog
          attachment={attachment}
          open={signOpen}
          onOpenChange={setSignOpen}
          onSigned={() => { setSignOpen(false); onSigned?.(); }}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Save-to-Client popover (with client picker)
// ─────────────────────────────────────────────────────────────────────

function SaveToClientPopover({
  attachment, open, onOpenChange,
}: {
  attachment: EmailAttachment;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const { data: clients = [] } = useQuery<ClientLite[]>({ queryKey: ["/api/clients"], enabled: open });

  const saveMut = useMutation({
    mutationFn: async (clientId: string) => {
      const r = await apiRequest("POST", `/api/email/attachments/${attachment.id}/save-to-client/${clientId}`, {});
      return r.json();
    },
    onSuccess: () => {
      onOpenChange(false);
      setSearch("");
      toast({ title: "Saved to client", description: attachment.filename });
    },
    onError: (e: Error) => toast({ title: "Save failed", description: e.message, variant: "destructive" }),
  });

  const filtered = clients.filter((c) => {
    const q = search.toLowerCase();
    return !q || c.name?.toLowerCase().includes(q) || c.business?.toLowerCase().includes(q);
  }).slice(0, 30);

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button size="sm" variant="ghost" className="h-6 w-6 p-0" title="Save to client">
          <Users className="w-3 h-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="end">
        <Input placeholder="Search clients..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-7 text-xs mb-2" />
        <ScrollArea className="h-48">
          <div className="space-y-1">
            {filtered.length === 0 && <p className="text-[11px] text-muted-foreground py-2 text-center">No clients found.</p>}
            {filtered.map((c) => (
              <button
                key={c.id}
                disabled={saveMut.isPending}
                onClick={() => saveMut.mutate(c.id)}
                className="w-full text-left px-2 py-1.5 rounded text-xs hover:bg-accent transition-colors flex flex-col"
              >
                <span className="font-medium truncate">{c.name || "Unnamed"}</span>
                {c.business && <span className="text-[10px] text-muted-foreground truncate">{c.business}</span>}
              </button>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Forward dialog
// ─────────────────────────────────────────────────────────────────────

export function ForwardDialog({
  open, onOpenChange, messageId, defaultSubject, attachments, onForwarded,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  messageId: string;
  defaultSubject: string;
  attachments: EmailAttachment[];
  onForwarded?: () => void;
}) {
  const { toast } = useToast();
  const [to, setTo] = useState("");
  const [note, setNote] = useState("");
  const [includeIds, setIncludeIds] = useState<Set<string>>(() => new Set(attachments.map((a) => a.id)));

  useEffect(() => {
    if (open) {
      setTo("");
      setNote("");
      setIncludeIds(new Set(attachments.map((a) => a.id)));
    }
  }, [open, attachments]);

  const fwdMut = useMutation({
    mutationFn: async () => {
      const r = await apiRequest("POST", `/api/email/messages/${messageId}/forward`, {
        to: to.trim(),
        note: note.trim(),
        includeAttachmentIds: Array.from(includeIds),
      });
      return r.json();
    },
    onSuccess: () => {
      toast({ title: "Email forwarded", description: `Sent to ${to}` });
      onOpenChange(false);
      onForwarded?.();
    },
    onError: (e: Error) => toast({ title: "Forward failed", description: e.message, variant: "destructive" }),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base flex items-center gap-2"><Forward className="w-4 h-4" />Forward email</DialogTitle>
          <DialogDescription className="text-xs">Forward this message (with optional attachments) to another recipient.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="text-xs">To</Label>
            <Input type="email" placeholder="recipient@example.com" value={to} onChange={(e) => setTo(e.target.value)} className="h-8 text-sm" />
          </div>
          <div>
            <Label className="text-xs">Subject</Label>
            <Input value={defaultSubject.toLowerCase().startsWith("fwd:") ? defaultSubject : `Fwd: ${defaultSubject}`} disabled className="h-8 text-sm bg-muted/30" />
          </div>
          <div>
            <Label className="text-xs">Note (optional)</Label>
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note above the original message..." rows={3} className="text-sm resize-none" />
          </div>
          {attachments.length > 0 && (
            <div>
              <Label className="text-xs">Attachments to include</Label>
              <div className="mt-1 space-y-1 max-h-32 overflow-y-auto border border-border/50 rounded p-2">
                {attachments.map((a) => (
                  <label key={a.id} className="flex items-center gap-2 text-xs cursor-pointer hover:bg-muted/40 px-1 py-0.5 rounded">
                    <Checkbox
                      checked={includeIds.has(a.id)}
                      onCheckedChange={(v) => {
                        const next = new Set(includeIds);
                        if (v) next.add(a.id); else next.delete(a.id);
                        setIncludeIds(next);
                      }}
                    />
                    <Paperclip className="w-3 h-3 text-muted-foreground" />
                    <span className="truncate flex-1">{a.filename}</span>
                    <span className="text-[10px] text-muted-foreground">{fmtSize(a.size)}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button size="sm" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button size="sm" disabled={!to.trim() || fwdMut.isPending} onClick={() => fwdMut.mutate()}>
            {fwdMut.isPending ? <><Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />Sending...</> : <><Forward className="w-3.5 h-3.5 mr-1" />Forward</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Sign PDF dialog (signature pad → pdf-lib overlay)
// ─────────────────────────────────────────────────────────────────────

function SignPdfDialog({
  attachment, open, onOpenChange, onSigned,
}: {
  attachment: EmailAttachment;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSigned?: () => void;
}) {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const hasInk = useRef(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [signerName, setSignerName] = useState("");
  const [signing, setSigning] = useState(false);
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);

  // Fetch the PDF whenever the dialog opens; clear stale bytes when it closes
  // so a previous document can never be signed/uploaded by mistake.
  useEffect(() => {
    if (!open) {
      setPdfBytes(null);
      setPageCount(1);
      setPageNumber(1);
      setSignerName("");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(attachment.url, { credentials: "same-origin" });
        if (!res.ok) throw new Error(`Download failed (${res.status})`);
        const buf = new Uint8Array(await res.arrayBuffer());
        if (cancelled) return;
        setPdfBytes(buf);
        const pdf = await PDFDocument.load(buf);
        if (cancelled) return;
        setPageCount(pdf.getPageCount());
        setPageNumber(pdf.getPageCount());
      } catch (e: any) {
        if (!cancelled) toast({ title: "Couldn't load PDF", description: e.message, variant: "destructive" });
      }
    })();
    return () => { cancelled = true; };
  }, [open, attachment.url, toast]);

  // Setup canvas
  useEffect(() => {
    if (!open || !canvasRef.current) return;
    const c = canvasRef.current;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    hasInk.current = false;
  }, [open]);

  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current!;
    const rect = c.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * c.width,
      y: ((e.clientY - rect.top) / rect.height) * c.height,
    };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    drawing.current = true;
    const ctx = canvasRef.current!.getContext("2d")!;
    const p = getPos(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    canvasRef.current!.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const ctx = canvasRef.current!.getContext("2d")!;
    const p = getPos(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    hasInk.current = true;
  };
  const onPointerUp = () => { drawing.current = false; };

  const clearSig = () => {
    const c = canvasRef.current!;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, c.width, c.height);
    hasInk.current = false;
  };

  const trimSignature = (): { dataUrl: string; bbox: { x: number; y: number; w: number; h: number } } | null => {
    if (!canvasRef.current || !hasInk.current) return null;
    const c = canvasRef.current;
    const ctx = c.getContext("2d")!;
    const img = ctx.getImageData(0, 0, c.width, c.height);
    let minX = c.width, minY = c.height, maxX = 0, maxY = 0;
    for (let y = 0; y < c.height; y++) {
      for (let x = 0; x < c.width; x++) {
        const i = (y * c.width + x) * 4;
        // Pixel that's not white-ish
        if (img.data[i] < 220 || img.data[i + 1] < 220 || img.data[i + 2] < 220) {
          if (x < minX) minX = x;
          if (y < minY) minY = y;
          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;
        }
      }
    }
    if (maxX <= minX || maxY <= minY) return null;
    const pad = 4;
    minX = Math.max(0, minX - pad); minY = Math.max(0, minY - pad);
    maxX = Math.min(c.width, maxX + pad); maxY = Math.min(c.height, maxY + pad);
    const w = maxX - minX, h = maxY - minY;
    const off = document.createElement("canvas");
    off.width = w; off.height = h;
    const offCtx = off.getContext("2d")!;
    offCtx.drawImage(c, minX, minY, w, h, 0, 0, w, h);
    return { dataUrl: off.toDataURL("image/png"), bbox: { x: minX, y: minY, w, h } };
  };

  const handleSign = async () => {
    if (!pdfBytes) return;
    const sig = trimSignature();
    if (!sig) {
      toast({ title: "Please draw a signature first", variant: "destructive" });
      return;
    }
    setSigning(true);
    try {
      const pdf = await PDFDocument.load(pdfBytes);
      const pages = pdf.getPages();
      const targetIdx = Math.max(0, Math.min(pages.length - 1, pageNumber - 1));
      const page = pages[targetIdx];

      // Embed signature PNG
      const pngBytes = await fetch(sig.dataUrl).then((r) => r.arrayBuffer());
      const pngImg = await pdf.embedPng(pngBytes);

      // Place signature at bottom-right of the page, scaled to ~ 35% of page width
      const { width: pw, height: ph } = page.getSize();
      const targetW = Math.min(pw * 0.35, 200);
      const scale = targetW / pngImg.width;
      const w = pngImg.width * scale;
      const h = pngImg.height * scale;
      const x = pw - w - 40;
      const y = 60;
      page.drawImage(pngImg, { x, y, width: w, height: h });

      // Add "Signed by" text under the signature
      const label = `Signed by ${signerName || "TechSavvy Hawaii"} · ${new Date().toLocaleDateString()}`;
      page.drawText(label, { x, y: y - 10, size: 7, color: rgb(0.4, 0.4, 0.4) });

      const out = await pdf.save();
      // Convert to base64
      let bin = "";
      const chunk = 0x8000;
      for (let i = 0; i < out.length; i += chunk) {
        bin += String.fromCharCode.apply(null, Array.from(out.subarray(i, i + chunk)) as any);
      }
      const b64 = btoa(bin);

      const r = await apiRequest("POST", `/api/email/attachments/${attachment.id}/sign`, { signedBase64: b64 });
      await r.json();
      toast({ title: "PDF signed", description: `Saved as ${attachment.filename.replace(/\.pdf$/i, "")}-SIGNED.pdf` });
      onSigned?.();
    } catch (e: any) {
      toast({ title: "Signing failed", description: e.message, variant: "destructive" });
    } finally {
      setSigning(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base flex items-center gap-2"><PenLine className="w-4 h-4" />Sign "{attachment.filename}"</DialogTitle>
          <DialogDescription className="text-xs">
            Draw your signature below. It will be placed in the bottom-right of the chosen page and saved as a new signed PDF (also added to admin files → Signed Documents).
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Signer name</Label>
              <Input value={signerName} onChange={(e) => setSignerName(e.target.value)} placeholder="Your name" className="h-8 text-sm" />
            </div>
            <div>
              <Label className="text-xs">Place on page</Label>
              <Input
                type="number"
                min={1}
                max={pageCount}
                value={pageNumber}
                onChange={(e) => setPageNumber(Math.max(1, Math.min(pageCount, parseInt(e.target.value || "1", 10))))}
                className="h-8 text-sm"
              />
              <span className="text-[10px] text-muted-foreground">of {pageCount} page{pageCount !== 1 ? "s" : ""}</span>
            </div>
          </div>
          <div>
            <Label className="text-xs">Signature</Label>
            <div className="relative border border-border/60 rounded bg-white">
              <canvas
                ref={canvasRef}
                width={500}
                height={150}
                className="w-full h-[150px] touch-none cursor-crosshair rounded"
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                onPointerLeave={onPointerUp}
              />
              <Button size="sm" variant="ghost" className="absolute top-1 right-1 h-6 w-6 p-0 text-muted-foreground" onClick={clearSig} title="Clear">
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button size="sm" variant="ghost" onClick={() => onOpenChange(false)}><X className="w-3.5 h-3.5 mr-1" />Cancel</Button>
          <Button size="sm" disabled={signing || !pdfBytes} onClick={handleSign}>
            {signing ? <><Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />Signing...</> : <><PenLine className="w-3.5 h-3.5 mr-1" />Sign &amp; Save</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
