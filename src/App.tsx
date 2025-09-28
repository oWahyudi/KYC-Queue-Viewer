
import React, { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { RBSection } from "@/components/bits/RBSection";
import { RBListItem } from "@/components/bits/RBListItem";
import { RBStatPill } from "@/components/bits/RBStatPill";
import { Search } from "lucide-react";


type FinalDecision = "PROCESSED" | "INPROCESS" | "FAILED";
interface KycRecord {
  id: number;
  File_Name: string;
  customer_name: string;
  identification_no: string;
  email_id: string;
  final_decision: FinalDecision;
  created_at: string;
  modified_at: string;
  audit_log: string[];
}


const isProd = import.meta.env.PROD;
const API_BASE = import.meta.env.VITE_API_BASE || "";
// In development we use the local JSON; in production, fetch from API `${API_BASE}/v1/kycrecord`
//const DATA_URL = isProd ? `${API_BASE.replace(/\/$/, "")}/v1/kycrecord` : "/data/KYC_Status_with_audit_revised.json";
const DATA_URL = "/data/KYC_Status_with_audit_revised.json";


function toDisplayId(rec: KycRecord): string {
  const year = new Date(rec.created_at).getFullYear();
  const padded = String(rec.id).padStart(4, "0");
  return `KYC-${year}-${padded}`;
}

function formatIso(iso: string) {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString();
  } catch {
    return iso;
  }
}

export default function App() {
  const [data, setData] = useState<KycRecord[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeQueue, setActiveQueue] = useState<FinalDecision>("PROCESSED");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(DATA_URL);
        if (!res.ok) throw new Error(`Failed to load ${DATA_URL}: ${res.status}`);
        const json = (await res.json());
        const normalized = json.map((r: any) => ({
          ...r,
          final_decision: r.final_decision
        })) as KycRecord[];

        if (!mounted) return;
        setData(normalized);
        const first = normalized.find((r) => r.final_decision === activeQueue) ?? normalized[0];
        setSelectedId(first?.id ?? null);
      } catch (e: any) {
        setError(e.message ?? String(e));
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const counts = useMemo(() => {
    const c = { PROCESSED: 0, INPROCESS: 0, FAILED: 0 } as Record<FinalDecision, number>;
    (data ?? []).forEach((r) => c[r.final_decision]++);
    return c;
  }, [data]);

  const filtered = useMemo(() => {
    const list = (data ?? []).filter((r) => r.final_decision === activeQueue);
    if (!query.trim()) return list;
    const q = query.trim().toLowerCase();
    return list.filter((r) => toDisplayId(r).toLowerCase().includes(q));
  }, [data, activeQueue, query]);

  const selected = useMemo(() => (data ?? []).find((r) => r.id === selectedId) ?? null, [data, selectedId]);

  const QueueTab = ({ value, label }: { value: FinalDecision; label: string }) => (
    <TabsTrigger value={value} onClick={() => setActiveQueue(value)} className="gap-2">
      <span>{label}</span>
      {/* <Badge variant="secondary" className="ml-1">{counts[value]}</Badge> */}
    </TabsTrigger>
  );

  const docBaseUrl = "/docs"; // change to your bucket/CDN

  return (
  
          <div className="p-4 md:p-4 grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-4 lg:col-span-3">
                  <Card className="p-4 space-y-4">
                    <RBSection title="Queues" subtitle="Browse KYC records by status" />
                    <div className="flex items-center gap-2 flex-wrap">
                      <RBStatPill label="Processed" value={counts["PROCESSED"]} tone="ok" />
                      <RBStatPill label="Inprocess" value={counts["INPROCESS"]} tone="warn" />
                      <RBStatPill label="Failed" value={counts["FAILED"]} tone="error" />
                    </div>
                    <Tabs value={activeQueue} className="w-full">
                      <TabsList className="grid grid-cols-3 gap-2">
                        <QueueTab value="PROCESSED" label="Processed" />
                        <QueueTab value="INPROCESS" label="InProcess" />
                        <QueueTab value="FAILED" label="Failed" />
                      </TabsList>
                    </Tabs>
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60" />
                      <Input className="pl-8" placeholder="Search by Document ID…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search by Document ID" />
                    </div>
                    <ScrollArea className="h-[60vh] border rounded-md">
                      {loading ? (
                        <div className="flex items-center justify-center h-40 opacity-80">Loading…</div>
                      ) : error ? (
                        <div className="p-3 text-sm text-red-600">{error}</div>
                      ) : filtered.length === 0 ? (
                        <div className="p-3 text-sm opacity-70">No records.</div>
                      ) : (
                        <ul className="space-y-1">
                          {filtered.map((rec) => (
                            <li key={rec.id}>
                              <RBListItem
                                active={rec.id === selectedId}
                                primary={toDisplayId(rec)}
                                secondary={rec.customer_name}
                                onClick={() => setSelectedId(rec.id)}
                              />
                            </li>
                          ))}
                        </ul>
                      )}
                    </ScrollArea>
                  </Card>
                </div>
                <div className="md:col-span-8 lg:col-span-9">
                  <Card className="p-6 space-y-4">
                    <RBSection title="Record Details" right={selected && (<Badge variant={selected.final_decision === "FAILED" ? "destructive" : "default"}>{selected.final_decision}</Badge>)} />
                    {!selected ? (
                      <div className="text-sm opacity-70">Select a record from the left to view details.</div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="id" value={toDisplayId(selected)} />
                        <FileField fileName={selected.File_Name} baseUrl={docBaseUrl} />
                        <Field label="customer_name" value={selected.customer_name} />
                        <Field label="identification_no" value={selected.identification_no} />
                        <Field label="email_id" value={selected.email_id} />
                        <Field label="created_at" value={formatIso(selected.created_at)} />
                        <Field label="modified_at" value={formatIso(selected.modified_at)} />
                        <div className="md:col-span-2">
                          <label className="text-xs uppercase tracking-wide opacity-60">audit_log</label>
                          <Textarea readOnly value={selected.audit_log.join("\n")} className="min-h-[160px] resize-y" aria-label="Audit log" />
                        </div>
                      </div>
                    )}
                  </Card>
                </div>
          </div>
  ); 

}

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide opacity-60">{label}</div>
      <div className="text-sm font-medium break-all">{value ?? "-"}</div>
    </div>
  );
}

type FileLinkProps = {
  fileName: string;
};

function FileField({ fileName, baseUrl }: { fileName: string; baseUrl: string }) {
  const [exists, setExists] = useState<boolean | null>(null);
  const href = `${baseUrl.replace(/\/$/, "")}/${encodeURIComponent(fileName)}`;

  return (

    <div className="flex items-center gap-2">
      <div className="grow min-w-0">
        <div className="text-xs uppercase tracking-wide opacity-60">File_Name</div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="link" className="p-0 h-auto font-medium truncate" title={fileName}>
              {fileName}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-5xl">
            <DialogHeader>
              <DialogTitle>{fileName}</DialogTitle>
            </DialogHeader>
            <div className="aspect-video w-full border rounded-md overflow-hidden">
              <iframe title={fileName} src={href} className="w-full h-full" /> 
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
