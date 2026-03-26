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
import { InfoTip } from "@/components/ui/info-tip";
import { getTooltip } from "@/lib/follow-up/tooltip-content";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  INVESTIGATION_NAME_OPTIONS,
  INVESTIGATION_RESULT_OPTIONS,
} from "@/lib/schemas/followup/investigations";

export default function FuInvestigationsPage() {
  const { encounterId, encounter, followUpAssessment, updateFollowUpLocal, updateEncounterLocal } =
    useEncounterContext();
  const tip = (f: Parameters<typeof getTooltip>[1]) =>
    getTooltip(encounter?.diagnosis_template, f);

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
        <h2 className="text-xl font-bold">Investigation & Results Review <InfoTip content={tip("investigations.section")} /></h2>
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
                  <h3 className="text-sm font-semibold">Results Reviewed <InfoTip content={tip("investigations.resultsReviewed")} /></h3>
                  <Button
                    type="button" variant="outline" size="sm" className="h-7 gap-1 text-xs"
                    onClick={() => set("results", [...results, { name: "", result: "", interpretation: "", nameSpecify: "", abnormalDetails: "" }])}
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
                      <Select
                        value={inv.name || ""}
                        onValueChange={(val) => {
                          const next = [...results];
                          next[idx] = { ...next[idx], name: val, nameSpecify: val === "Others" ? next[idx].nameSpecify : "" };
                          set("results", next);
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select investigation..." />
                        </SelectTrigger>
                        <SelectContent>
                          {INVESTIGATION_NAME_OPTIONS.map((opt) => (
                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {inv.name && !INVESTIGATION_NAME_OPTIONS.includes(inv.name as typeof INVESTIGATION_NAME_OPTIONS[number]) && (
                        <p className="text-xs text-muted-foreground mt-1">Previous value: {inv.name}</p>
                      )}
                      {inv.name === "Others" && (
                        <div className="space-y-1 mt-1.5">
                          <Label className="text-xs">Specify Investigation</Label>
                          <Input
                            value={inv.nameSpecify || ""}
                            onChange={(e) => { const next = [...results]; next[idx] = { ...next[idx], nameSpecify: e.target.value }; set("results", next); }}
                            placeholder="Specify investigation name..."
                          />
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Result</Label>
                      <Select
                        value={inv.result || ""}
                        onValueChange={(val) => {
                          const next = [...results];
                          next[idx] = { ...next[idx], result: val, abnormalDetails: val === "Abnormal" ? next[idx].abnormalDetails : "" };
                          set("results", next);
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select result..." />
                        </SelectTrigger>
                        <SelectContent>
                          {INVESTIGATION_RESULT_OPTIONS.map((opt) => (
                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {inv.result && !INVESTIGATION_RESULT_OPTIONS.includes(inv.result as typeof INVESTIGATION_RESULT_OPTIONS[number]) && (
                        <p className="text-xs text-muted-foreground mt-1">Previous value: {inv.result}</p>
                      )}
                      {inv.result === "Abnormal" && (
                        <div className="space-y-1 mt-1.5">
                          <Label className="text-xs">Abnormal Result Details</Label>
                          <Input
                            value={inv.abnormalDetails || ""}
                            onChange={(e) => { const next = [...results]; next[idx] = { ...next[idx], abnormalDetails: e.target.value }; set("results", next); }}
                            placeholder="Describe the abnormality..."
                          />
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Clinical Interpretation</Label>
                      <Textarea value={inv.interpretation} onChange={(e) => { const next = [...results]; next[idx] = { ...next[idx], interpretation: e.target.value }; set("results", next); }} placeholder="What does this mean for diagnosis and management?" className="min-h-[60px]" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label>Pending Investigations <InfoTip content={tip("investigations.pending")} /></Label>
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
