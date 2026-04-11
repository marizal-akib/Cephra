"use client";

/**
 * Read-only rich renderer for the generated clinic note.
 *
 * The note is a structured plain-text letter with section headings in ALL
 * CAPS followed by `===` separator lines. This component parses it into
 * sections and renders each section with its own formatting rules:
 *
 *   - RED FLAG SYMPTOMS AND SIGNS → red alert rows for PRESENT,
 *     muted check rows for Absent.
 *   - ASSESSMENT MANAGEMENT AND FOLLOW UP PLAN → bold sub-headings for
 *     Assessment / Treatment changes / Safety counselling / Follow-up plan.
 *   - Default → bullet lists, numbered differentials with confidence
 *     badges, `Against:` highlighting.
 *
 * Kept **intentionally duplicated** from the renderer inlined in the note
 * page (`src/app/(dashboard)/encounters/[id]/note/page.tsx`). The note page
 * is in active clinical use and the special-case branches are fragile, so
 * we accept the duplication instead of risking regressions in /note.
 */
import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";

interface NoteDisplayProps {
  content: string;
  loading?: boolean;
}

type NoteSection = { heading: string; body: string };

function parseNoteSections(content: string): NoteSection[] {
  const sections: NoteSection[] = [];
  const lines = content.split("\n");
  let currentHeading = "";
  let currentBody: string[] = [];
  for (const line of lines) {
    if (/^[A-Z][A-Z\s]+$/.test(line.trim()) && line.trim().length > 3) {
      if (currentHeading || currentBody.length > 0) {
        sections.push({ heading: currentHeading, body: currentBody.join("\n").trim() });
      }
      currentHeading = line.trim();
      currentBody = [];
      continue;
    }
    if (/^[=-]+$/.test(line.trim())) continue;
    currentBody.push(line);
  }
  if (currentHeading || currentBody.length > 0) {
    sections.push({ heading: currentHeading, body: currentBody.join("\n").trim() });
  }
  return sections;
}

export function NoteDisplay({ content, loading = false }: NoteDisplayProps) {
  const noteSections = useMemo(() => parseNoteSections(content), [content]);

  return (
    <Card className="print:block">
      <CardContent className="p-6 space-y-6 print-note-content">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : noteSections.length > 0 ? (
          noteSections.map((section, i) => (
            <div key={i}>
              {i > 0 && <Separator className="mb-6" />}
              {section.heading && (
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  {section.heading}
                </h3>
              )}
              <div className="text-sm leading-relaxed text-foreground whitespace-pre-wrap print-note-section">
                {section.heading === "RED FLAG SYMPTOMS AND SIGNS" ? (
                  section.body.split("\n").map((line, j) => {
                    if (line.includes(": PRESENT")) {
                      return (
                        <div
                          key={j}
                          className="flex items-start gap-2 rounded-md bg-red-50 border border-red-200 px-3 py-1.5 mb-1.5 text-red-800 text-sm"
                        >
                          <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                          <span className="font-medium">{line.replace(/^- /, "")}</span>
                        </div>
                      );
                    }
                    if (line.includes(": Absent")) {
                      return (
                        <div
                          key={j}
                          className="flex items-start gap-2 px-3 py-1 mb-0.5 text-sm text-muted-foreground"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5 text-emerald-500" />
                          <span>{line.replace(/^- /, "")}</span>
                        </div>
                      );
                    }
                    if (line.trim() === "") return <div key={j} className="h-2" />;
                    return (
                      <p key={j} className="mb-1 text-sm">
                        {line}
                      </p>
                    );
                  })
                ) : section.heading === "ASSESSMENT MANAGEMENT AND FOLLOW UP PLAN" ? (
                  section.body.split("\n").map((line, j) => {
                    if (
                      /^(Assessment|Treatment changes|Safety counselling|Follow-up plan):$/.test(
                        line.trim()
                      )
                    ) {
                      return (
                        <p
                          key={j}
                          className="font-semibold text-slate-700 mt-3 mb-1 first:mt-0"
                        >
                          {line}
                        </p>
                      );
                    }
                    if (line.trim() === "") return <div key={j} className="h-1" />;
                    return (
                      <p key={j} className="mb-1">
                        {line}
                      </p>
                    );
                  })
                ) : (
                  section.body.split("\n").map((line, j) => {
                    if (line.startsWith("RED FLAGS:")) {
                      return (
                        <div
                          key={j}
                          className="flex items-start gap-2 rounded-md bg-red-50 border border-red-200 px-3 py-2 mb-3 text-red-800"
                        >
                          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                          <span className="font-medium">{line}</span>
                        </div>
                      );
                    }
                    if (line.startsWith("No red flags")) {
                      return (
                        <div
                          key={j}
                          className="flex items-center gap-2 rounded-md bg-emerald-50 border border-emerald-200 px-3 py-2 mb-3 text-emerald-800"
                        >
                          <CheckCircle2 className="h-4 w-4 shrink-0" />
                          <span>{line}</span>
                        </div>
                      );
                    }
                    if (/^\d+\.\s/.test(line)) {
                      const match = line.match(
                        /^(\d+)\.\s(.+?)\s\((\w+)\s+confidence\)\s*-\s*(.*)$/
                      );
                      if (match) {
                        const [, num, name, confidence, rationale] = match;
                        return (
                          <div key={j} className="ml-1 mb-2">
                            <div className="flex items-center gap-2">
                              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-600">
                                {num}
                              </span>
                              <span className="font-medium">{name}</span>
                              <Badge
                                variant="outline"
                                className={
                                  confidence === "high"
                                    ? "border-emerald-300 bg-emerald-50 text-emerald-700 text-[10px]"
                                    : confidence === "moderate"
                                      ? "border-amber-300 bg-amber-50 text-amber-700 text-[10px]"
                                      : "border-slate-300 bg-slate-50 text-slate-600 text-[10px]"
                                }
                              >
                                {confidence}
                              </Badge>
                            </div>
                            {rationale && (
                              <p className="ml-7 mt-0.5 text-xs text-muted-foreground">
                                {rationale}
                              </p>
                            )}
                          </div>
                        );
                      }
                    }
                    if (line.trim().startsWith("Against:"))
                      return (
                        <p key={j} className="ml-7 text-xs text-red-600/80 mb-2">
                          {line.trim()}
                        </p>
                      );
                    if (line.startsWith("- "))
                      return (
                        <div key={j} className="flex items-start gap-2 ml-1 mb-1">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />
                          <span>{line.substring(2)}</span>
                        </div>
                      );
                    if (line.endsWith(":") && !line.includes("."))
                      return (
                        <p key={j} className="font-medium text-slate-700 mt-2 mb-1">
                          {line}
                        </p>
                      );
                    if (line.trim() === "") return <div key={j} className="h-2" />;
                    return (
                      <p key={j} className="mb-1">
                        {line}
                      </p>
                    );
                  })
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">
            No clinic note content to display.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
