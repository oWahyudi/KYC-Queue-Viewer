
import * as React from "react";
import { cn } from "@/lib/utils";

export function RBSection({ title, subtitle, right, className, children }:{
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}){
  return (
    <section className={cn("space-y-3", className)}>
      {(title || right) && (
        <div className="flex items-center justify-between">
          <div>
            {title && <h2 className="text-lg font-semibold tracking-tight">{title}</h2>}
            {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
          </div>
          {right}
        </div>
      )}
      {children}
    </section>
  );
}
