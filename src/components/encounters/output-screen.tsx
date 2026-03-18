"use client";

import Link from "next/link";
import { useEncounterContext } from "@/app/(dashboard)/encounters/[id]/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  ShieldAlert,
  ShieldCheck,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  CircleHelp,
  ClipboardList,
  FileText,
} from "lucide-react";
import type { PhenotypeResult } from "@/lib/engine/types";
import { cn } from "@/lib/utils";

const CONFIDENCE_STYLES: Record<
  PhenotypeResult["confidence"],
  { badge: string; ring: string }
> = {
  high: {
    badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
    ring: "ring-emerald-200",
  },
  moderate: {
    badge: "bg-amber-100 text-amber-800 border-amber-200",
    ring: "ring-amber-200",
  },
  possible: {
    badge: "bg-slate-100 text-slate-700 border-slate-200",
    ring: "ring-slate-200",
  },
};

function ScoreBar({ score }: { score: number }) {
  const pct = Math.min(Math.max(score, 0), 100);
  return (
    <div className="h-2 w-full rounded-full bg-muted">
      <div
        className={cn(
          "h-full rounded-full transition-all",
          pct >= 70
            ? "bg-emerald-500"
            : pct >= 40
              ? "bg-amber-500"
              : "bg-slate-400"
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function OutputScreen({ encounterId }: { encounterId: string }) {
  const { diagnosticOutput } = useEncounterContext();

  if (!diagnosticOutput) {
    return (
      <div className="max-w-4xl space-y-4">
        <h2 className="text-xl font-bold">Assessment Output</h2>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              Complete the assessment sections to generate diagnostic output.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { redFlagResult, phenotypes, suggestedWorkup, engineVersion } =
    diagnosticOutput;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Assessment Output</h2>
          <p className="text-sm text-muted-foreground">
            Final diagnostic phenotype results and suggested plan items
          </p>
        </div>
        <Badge variant="outline" className="shrink-0 text-xs">
          Engine v{engineVersion}
        </Badge>
      </div>

      {/* Triage / Red Flags */}
      {redFlagResult.flagged ? (
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle className="font-bold">Red Flags Identified</AlertTitle>
          <AlertDescription className="mt-2 space-y-1">
            {redFlagResult.flags.map((flag) => (
              <div key={flag.code} className="flex items-start gap-2 text-sm">
                <Badge
                  variant="secondary"
                  className={cn(
                    "mt-0.5 shrink-0 text-[10px] uppercase",
                    flag.severity === "urgent"
                      ? "bg-red-200 text-red-900"
                      : "bg-orange-200 text-orange-900"
                  )}
                >
                  {flag.severity}
                </Badge>
                <span>{flag.description}</span>
              </div>
            ))}
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="border-emerald-200 bg-emerald-50 text-emerald-800 [&>svg]:text-emerald-600">
          <ShieldCheck className="h-4 w-4" />
          <AlertTitle className="font-semibold">No Red Flags</AlertTitle>
          <AlertDescription className="text-sm">
            No SNOOP4 red-flag warning signs were identified in this assessment.
          </AlertDescription>
        </Alert>
      )}

      {/* Phenotype Ranking */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Phenotype Ranking</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {phenotypes.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Insufficient data to rank phenotypes.
            </p>
          ) : (
            phenotypes.map((phenotype, idx) => (
              <div
                key={phenotype.diagnosis}
                className={cn(
                  "rounded-lg border p-4 ring-1",
                  CONFIDENCE_STYLES[phenotype.confidence].ring
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-bold">
                      {idx + 1}
                    </span>
                    <h3 className="font-semibold">{phenotype.label}</h3>
                  </div>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "shrink-0 border capitalize",
                      CONFIDENCE_STYLES[phenotype.confidence].badge
                    )}
                  >
                    {phenotype.confidence}
                  </Badge>
                </div>

                <div className="mt-3 flex items-center gap-3">
                  <ScoreBar score={phenotype.score} />
                  <span className="shrink-0 text-xs font-medium text-muted-foreground">
                    {phenotype.score}%
                  </span>
                </div>

                {phenotype.rationale.length > 0 && (
                  <div className="mt-3">
                    <p className="mb-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                      Supporting Criteria
                    </p>
                    <ul className="space-y-0.5 text-sm text-muted-foreground">
                      {phenotype.rationale.map((r, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-400" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {phenotype.contradictions.length > 0 && (
                  <div className="mt-3">
                    <p className="mb-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <XCircle className="h-3 w-3 text-rose-500" />
                      Contradictions
                    </p>
                    <ul className="space-y-0.5 text-sm text-muted-foreground">
                      {phenotype.contradictions.map((c, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-rose-400" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {phenotype.missingData.length > 0 && (
                  <div className="mt-3">
                    <p className="mb-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <CircleHelp className="h-3 w-3 text-amber-500" />
                      Missing Data
                    </p>
                    <ul className="space-y-0.5 text-sm text-muted-foreground">
                      {phenotype.missingData.map((m, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-400" />
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Suggested Plan Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ClipboardList className="h-4 w-4" />
            Suggested Plan Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          {suggestedWorkup.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No specific work-up suggested based on current findings.
            </p>
          ) : (
            <ul className="space-y-2">
              {suggestedWorkup.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 rounded-md border border-border/60 bg-muted/30 px-3 py-2 text-sm"
                >
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                  {item}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex flex-wrap items-center justify-end gap-3 border-t pt-4">
        <Button variant="outline" asChild>
          <Link href={`/encounters/${encounterId}/workup`}>
            <ClipboardList className="h-4 w-4" />
            Review Plan & Follow-up
          </Link>
        </Button>
        <Button asChild>
          <Link href={`/encounters/${encounterId}/note`}>
            <FileText className="h-4 w-4" />
            Clinic Note
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
