"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ENCOUNTER_STEPS } from "@/types";
import { cn } from "@/lib/utils";
import { Check, AlertTriangle } from "lucide-react";

interface StepDef {
  key: string;
  label: string;
  path: string;
}

interface StepNavProps {
  encounterId: string;
  completedSteps?: string[];
  redFlagged?: boolean;
  className?: string;
  steps?: StepDef[];
}

interface StepNavLinksProps {
  encounterId: string;
  completedSteps?: string[];
  redFlagged?: boolean;
  className?: string;
  steps?: StepDef[];
}

export function StepNavLinks({
  encounterId,
  completedSteps = [],
  redFlagged = false,
  className,
  steps,
}: StepNavLinksProps) {
  const pathname = usePathname();
  const stepList = steps ?? [...ENCOUNTER_STEPS];

  return (
    <nav className={cn("space-y-0.5 overflow-y-auto p-3", className)}>
      {stepList.map((step) => {
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
  steps,
}: StepNavProps) {
  return (
    <StepNavLinks
      encounterId={encounterId}
      completedSteps={completedSteps}
      redFlagged={redFlagged}
      steps={steps}
      className={cn(
        "hidden w-48 shrink-0 border-r border-border bg-sidebar-background lg:block",
        className
      )}
    />
  );
}
