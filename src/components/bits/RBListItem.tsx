
import * as React from "react";
import { cn } from "@/lib/utils";

export function RBListItem({ active, primary, secondary, onClick }:{ 
  active?: boolean;
  primary: React.ReactNode;
  secondary?: React.ReactNode;
  onClick?: () => void;
}){
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left px-3 py-2 rounded-md transition-all",
        "hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2",
        active ? "bg-accent/60 shadow-sm ring-1 ring-accent" : "border-transparent"
      )}
    >
      <div className="flex items-center gap-2">
        <span className={cn("w-1.5 h-1.5 rounded-full", active ? "bg-purple-600" : "bg-muted-foreground/40")} />
        <span className="font-medium tracking-tight truncate">{primary}</span>
      </div>
      {secondary && <div className="text-xs text-muted-foreground mt-0.5 truncate">{secondary}</div>}
    </button>
  );
}
