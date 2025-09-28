
import * as React from "react";
import { cn } from "@/lib/utils";

export function RBStatPill({ label, value, tone = "default" }:{ label: string; value: number | string; tone?: "default" | "ok" | "warn" | "error"; }){
  const toneCls = {
    default: "bg-secondary text-secondary-foreground",
    ok: "bg-green-100 text-green-900 border-green-300",
    warn: "bg-amber-100 text-amber-900 border-amber-300",
    error: "bg-rose-100 text-rose-900 border-rose-300",
  }[tone];
  return (
    <span className={cn("inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold", toneCls)}>
      <span className="uppercase tracking-wide">{label}</span>
      <span className="inline-flex h-5 min-w-[1.5rem] items-center justify-center rounded-full bg-white/70 px-1 text-[11px]">{value}</span>
    </span>
  );
}
