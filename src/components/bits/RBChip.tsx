
import * as React from "react";
import { cn } from "@/lib/utils";

export function RBChip({ children, className }:{ children: React.ReactNode; className?: string; }){
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium bg-white shadow-sm", className)}>
      {children}
    </span>
  );
}
