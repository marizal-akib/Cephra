"use client";

import {
  Brain,
  AlertTriangle,
  ScanLine,
  Stethoscope,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { GuidelineCategory, CategoryDefinition } from "@/lib/guidelines/types";
import { cn } from "@/lib/utils";

const CATEGORY_ICONS: Record<GuidelineCategory, React.ElementType> = {
  "primary-headaches": Brain,
  "secondary-headaches-red-flags": AlertTriangle,
  "imaging-investigations": ScanLine,
  "treatment-follow-up": Stethoscope,
};

export function CategoryCard({
  category,
  count,
  isActive,
  onClick,
}: {
  category: CategoryDefinition;
  count: number;
  isActive: boolean;
  onClick: () => void;
}) {
  const Icon = CATEGORY_ICONS[category.id];
  const isComingSoon = count === 0;

  return (
    <button onClick={onClick} disabled={isComingSoon} className="w-full text-left">
      <Card
        className={cn(
          "h-full transition-colors",
          isActive && "ring-2 ring-primary",
          isComingSoon
            ? "opacity-60"
            : "cursor-pointer hover:bg-accent/40",
        )}
      >
        <CardContent className="flex items-start gap-3">
          <div
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
              isActive
                ? "bg-primary text-primary-foreground"
                : "bg-accent text-accent-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium leading-tight">
              {category.label}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
              {category.description}
            </p>
            <p className="mt-1 text-xs font-medium text-muted-foreground">
              {isComingSoon ? "Coming soon" : `${count} ${count === 1 ? "guide" : "guides"}`}
            </p>
          </div>
        </CardContent>
      </Card>
    </button>
  );
}
