"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ENCOUNTER_STEPS } from "@/types";
import { cn } from "@/lib/utils";
import { Check, AlertTriangle } from "lucide-react";

interface StepNavProps {
  encounterId: string;
  completedSteps?: string[];
  redFlagged?: boolean;
  className?: string;
}

interface StepNavLinksProps {
  encounterId: string;
  completedSteps?: string[];
  redFlagged?: boolean;
  className?: string;
}

export function StepNavLinks({
  encounterId,
  completedSteps = [],
  redFlagged = false,
  className,
}: StepNavLinksProps) {
  const pathname = usePathname();

  return (
    <nav className={cn("space-y-0.5 overflow-y-auto p-3", className)}>
      {ENCOUNTER_STEPS.map((step) => {
        const href = `/encounters/${encounterId}/${step.path}`;
        const isActive = pathname.endsWith(`/${step.path}`);
        const isCompleted = completedSteps.includes(step.key);
        const isRedFlag = step.key === "red-flags" && redFlagged;

        return (
          <Link
            key={step.key}
            href={href}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
              isActive
                ? "bg-primary text-primary-foreground font-medium"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              isRedFlag && !isActive && "text-red-flag font-medium"
            )}
          >
            <span className="flex h-4 w-4 shrink-0 items-center justify-center">
              {isRedFlag ? (
                <AlertTriangle className="h-3.5 w-3.5" />
              ) : isCompleted ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-current opacity-40" />
              )}
            </span>
            <span className="truncate">{step.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function StepNav({
  encounterId,
  completedSteps = [],
  redFlagged = false,
  className,
}: StepNavProps) {
  return (
    <StepNavLinks
      encounterId={encounterId}
      completedSteps={completedSteps}
      redFlagged={redFlagged}
      className={cn(
        "hidden w-48 shrink-0 border-r border-border bg-sidebar-background lg:block",
        className
      )}
    />
  );
}
