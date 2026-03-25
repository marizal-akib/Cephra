"use client";

import { useCallback } from "react";
import { useEncounterContext } from "../layout";
import { FollowUpFormWrapper } from "@/components/encounter/followup-form-wrapper";
import { investigationsSchema } from "@/lib/schemas/followup/investigations";
import type { InvestigationResult } from "@/lib/schemas/followup/investigations";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DictationTextarea as Textarea } from "@/components/ui/dictation-textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

export default function FuInvestigationsPage() {
  const { encounterId, followUpAssessment, updateFollowUpLocal, updateEncounterLocal } =
    useEncounterContext();

  const defaultValues = (followUpAssessment?.investigations || {}) as Record<string, unknown>;

  const handleDataChange = useCallback(
    (data: Record<string, unknown>) => {
      updateFollowUpLocal("investigations", data);
    },
    [updateFollowUpLocal]
  );

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Investigation & Results Review</h2>
        <p className="text-sm text-muted-foreground">
          Review results since last consultation. Never list a result without an interpretation.
        </p>
      </div>

      <FollowUpFormWrapper
        encounterId={encounterId}
        section="investigations"
        schema={investigationsSchema}
        defaultValues={defaultValues}
        onDataChange={handleDataChange}
        onEncounterStatusChange={updateEncounterLocal}
      >
        {(form) => {
          const v = form.watch();
          const set = (name: string, value: unknown) =>
            form.setValue(name as never, value as never, { shouldDirty: true });

          const results = (Array.isArray(v.results) ? v.results : []) as InvestigationResult[];

          return (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold">Results Reviewed</h3>
                  <Button
                    type="button" variant="outline" size="sm" className="h-7 gap-1 text-xs"
                    onClick={() => set("results", [...results, { name: "", result: "", interpretation: "" }])}
                  >
                    <Plus className="h-3 w-3" />Add Result
                  </Button>
                </div>
                {results.map((inv, idx) => (
                  <div key={idx} className="rounded-lg border p-3 space-y-3 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">Investigation {idx + 1}</span>
                      <Button
                        type="button" variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                        onClick={() => { const next = [...results]; next.splice(idx, 1); set("results", next); }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Investigation Name</Label>
                      <Input value={inv.name} onChange={(e) => { const next = [...results]; next[idx] = { ...next[idx], name: e.target.value }; set("results", next); }} placeholder="e.g. MRI brain with contrast" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Result</Label>
                      <Input value={inv.result} onChange={(e) => { const next = [...results]; next[idx] = { ...next[idx], result: e.target.value }; set("results", next); }} placeholder="e.g. Normal, no structural lesion" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Clinical Interpretation</Label>
                      <Textarea value={inv.interpretation} onChange={(e) => { const next = [...results]; next[idx] = { ...next[idx], interpretation: e.target.value }; set("results", next); }} placeholder="What does this mean for diagnosis and management?" className="min-h-[60px]" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label>Pending Investigations</Label>
                <Textarea
                  value={(v.pending as string) || ""}
                  onChange={(e) => set("pending", e.target.value)}
                  placeholder="List pending tests with expected timelines..."
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={(v.notes as string) || ""}
                  onChange={(e) => set("notes", e.target.value)}
                  placeholder="Additional investigation notes..."
                  className="min-h-[60px]"
                />
              </div>
            </div>
          );
        }}
      </FollowUpFormWrapper>
    </div>
  );
}
