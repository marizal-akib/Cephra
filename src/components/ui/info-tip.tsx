"use client";

import * as React from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface InfoTipProps {
  content: string;
  className?: string;
}

export function InfoTip({ content, className }: InfoTipProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const handler = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, [open]);

  return (
    <span ref={ref} className={cn("group/info relative inline-flex items-center ml-1 align-middle", className)}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center justify-center rounded-full p-0.5 text-blue-500/70 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring transition-colors"
        aria-label="More information"
      >
        <Info className="h-3.5 w-3.5" />
      </button>
      <span
        role="tooltip"
        className={cn(
          "absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-64 rounded-md border bg-popover px-3 py-2 text-xs leading-relaxed text-popover-foreground shadow-md",
          "pointer-events-none opacity-0 transition-opacity duration-150",
          "group-hover/info:pointer-events-auto group-hover/info:opacity-100",
          open && "pointer-events-auto opacity-100"
        )}
      >
        {content}
      </span>
    </span>
  );
}
