"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, ShieldAlert, CircleHelp } from "lucide-react";
import type { DiagnosticOutput, PhenotypeResult } from "@/lib/engine/types";
import { cn } from "@/lib/utils";

interface DiagnosisRailProps {
  output: DiagnosticOutput | null;
  className?: string;
}

const CONFIDENCE_STYLES = {
  high: "bg-green-100 text-green-800",
  moderate: "bg-yellow-100 text-yellow-800",
  possible: "bg-slate-100 text-slate-700",
};

interface DiagnosisRailContentProps {
  output: DiagnosticOutput | null;
}

export function DiagnosisRailContent({ output }: DiagnosisRailContentProps) {
  if (!output) {
    return (
      <Card>
        <CardContent className="py-6 text-center text-sm text-muted-foreground">
          Complete assessment sections to see diagnostic suggestions.
        </CardContent>
      </Card>
    );
  }

  const { redFlagResult, phenotypes, secondaryAlerts, suggestedWorkup } = output;

  return (
    <div className="space-y-4">
      {/* Triage Banner */}
      {redFlagResult.flagged && (
        <Alert variant="destructive" className="border-red-flag">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle className="font-bold">Red Flags Identified</AlertTitle>
          <AlertDescription className="text-xs">
            {redFlagResult.flags.length} warning sign
            {redFlagResult.flags.length > 1 ? "s" : ""} detected. Consider
            urgent review.
          </AlertDescription>
        </Alert>
      )}

      {/* Triage Level */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Triage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Badge
            className={cn(
              "text-sm px-3 py-1",
              redFlagResult.flagged
                ? "bg-red-100 text-red-800"
                : "bg-green-100 text-green-800"
            )}
          >
            {redFlagResult.flagged ? "Red / Amber" : "Green"}
          </Badge>
        </CardContent>
      </Card>

      {/* Secondary cause alerts (GCA, IIH, SAH, Meningitis, CVST) */}
      {secondaryAlerts.length > 0 && (
        <Card className="border-amber-500/60 bg-amber-50/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-amber-800">
              Consider Secondary Cause
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {secondaryAlerts.map((p: PhenotypeResult) => (
              <div key={p.diagnosis} className="space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-medium">{p.label}</span>
                  <Badge
                    variant="secondary"
                    className={cn("text-xs", CONFIDENCE_STYLES[p.confidence])}
                  >
                    {p.confidence} ({p.score})
                  </Badge>
                </div>
                {p.rationale[0] && (
                  <p className="text-xs text-muted-foreground">
                    {p.rationale[0]}
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Phenotype Ranking */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Top Phenotypes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {phenotypes.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              Insufficient data for ranking.
            </p>
          ) : (
            phenotypes.map((p: PhenotypeResult, i: number) => (
              <div key={p.diagnosis} className="space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={cn(
                      "text-sm font-medium",
                      redFlagResult.flagged && "opacity-60"
                    )}
                  >
                    {i + 1}. {p.label}
                  </span>
                </div>
                <Badge
                  variant="secondary"
                  className={cn("text-xs", CONFIDENCE_STYLES[p.confidence])}
                >
                  {p.confidence}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Missing Data */}
      {phenotypes.some((p) => p.missingData.length > 0) && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <CircleHelp className="h-3 w-3" />
              Missing Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 text-xs text-muted-foreground">
              {Array.from(
                new Set(phenotypes.flatMap((p) => p.missingData))
              )
                .slice(0, 5)
                .map((item) => (
                  <li key={item} className="flex items-start gap-1">
                    <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-amber-flag" />
                    {item}
                  </li>
                ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Suggested Plan Items */}
      {suggestedWorkup.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Suggested Plan Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 text-xs text-muted-foreground">
              {suggestedWorkup.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export function DiagnosisRail({ output, className }: DiagnosisRailProps) {
  return (
    <aside
      className={cn(
        "hidden w-64 shrink-0 border-l border-border bg-sidebar-background p-4 xl:block",
        className
      )}
    >
      <div className="sticky top-0 max-h-screen overflow-y-auto">
        <DiagnosisRailContent output={output} />
      </div>
    </aside>
  );
}
