"use client";

import { useCallback } from "react";
import { useEncounterContext } from "../layout";
import { EncounterFormWrapper } from "@/components/encounter/encounter-form-wrapper";
import {
  previousInvestigationsSchema,
  PREVIOUS_INVESTIGATION_NAME_OPTIONS,
  PREVIOUS_INVESTIGATION_RESULT_OPTIONS,
  QUANTITATIVE_TESTS,
  STRUCTURED_FINDINGS,
  INVESTIGATION_FLAG_OPTIONS,
  type PreviousInvestigationResult,
} from "@/lib/schemas/previous-investigations";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DictationTextarea as Textarea } from "@/components/ui/dictation-textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PreviousInvestigationsPage() {
  const { encounterId, assessment, updateAssessmentLocal, updateEncounterLocal } =
    useEncounterContext();

  const defaultValues = (assessment?.previous_investigations || {}) as Record<string, unknown>;

  const handleDataChange = useCallback(
    (data: Record<string, unknown>) => {
      updateAssessmentLocal("previous_investigations", data);
    },
    [updateAssessmentLocal]
  );

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Review of Previous Investigations</h2>
        <p className="text-sm text-muted-foreground">
          Investigations performed before this consultation. Record each result
          with a clinical interpretation.
        </p>
      </div>

      <EncounterFormWrapper
        encounterId={encounterId}
        section="previous_investigations"
        schema={previousInvestigationsSchema}
        defaultValues={defaultValues}
        onDataChange={handleDataChange}
        onEncounterStatusChange={updateEncounterLocal}
      >
        {(form) => {
          const v = form.watch();
          const set = (name: string, value: unknown) =>
            form.setValue(name as never, value as never, { shouldDirty: true });

          const results = (Array.isArray(v.results) ? v.results : []) as PreviousInvestigationResult[];

          return (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold">Prior Results</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 gap-1 text-xs"
                    onClick={() =>
                      set("results", [
                        ...results,
                        { name: "", result: "", interpretation: "", nameSpecify: "", abnormalDetails: "" },
                      ])
                    }
                  >
                    <Plus className="h-3 w-3" />
                    Add Result
                  </Button>
                </div>
                {results.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    No prior investigations recorded. Use &ldquo;Add Result&rdquo; to log any
                    previous tests the patient has had.
                  </p>
                )}
                {results.map((inv, idx) => (
                  <div key={idx} className="rounded-lg border p-3 space-y-3 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">
                        Investigation {idx + 1}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                        onClick={() => {
                          const next = [...results];
                          next.splice(idx, 1);
                          set("results", next);
                        }}
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
                          next[idx] = {
                            ...next[idx],
                            name: val,
                            nameSpecify: val === "Others" ? next[idx].nameSpecify : "",
                          };
                          set("results", next);
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select investigation..." />
                        </SelectTrigger>
                        <SelectContent>
                          {PREVIOUS_INVESTIGATION_NAME_OPTIONS.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {inv.name === "Others" && (
                        <div className="space-y-1 mt-1.5">
                          <Label className="text-xs">Specify Investigation</Label>
                          <Input
                            value={inv.nameSpecify || ""}
                            onChange={(e) => {
                              const next = [...results];
                              next[idx] = { ...next[idx], nameSpecify: e.target.value };
                              set("results", next);
                            }}
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
                          next[idx] = {
                            ...next[idx],
                            result: val,
                            abnormalDetails: val === "Abnormal" ? next[idx].abnormalDetails : "",
                          };
                          set("results", next);
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select result..." />
                        </SelectTrigger>
                        <SelectContent>
                          {PREVIOUS_INVESTIGATION_RESULT_OPTIONS.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {QUANTITATIVE_TESTS[inv.name] && (
                        <div className="grid grid-cols-3 gap-2 mt-1.5">
                          <div className="space-y-1 col-span-1">
                            <Label className="text-xs">Value</Label>
                            <Input
                              type="number"
                              inputMode="decimal"
                              value={
                                typeof inv.numericValue === "number"
                                  ? inv.numericValue
                                  : ""
                              }
                              onChange={(e) => {
                                const next = [...results];
                                const raw = e.target.value;
                                next[idx] = {
                                  ...next[idx],
                                  numericValue:
                                    raw === "" ? undefined : Number(raw),
                                };
                                set("results", next);
                              }}
                              placeholder="e.g. 100"
                            />
                          </div>
                          <div className="space-y-1 col-span-1">
                            <Label className="text-xs">Units</Label>
                            <Input
                              value={
                                inv.units ?? QUANTITATIVE_TESTS[inv.name].units
                              }
                              onChange={(e) => {
                                const next = [...results];
                                next[idx] = {
                                  ...next[idx],
                                  units: e.target.value,
                                };
                                set("results", next);
                              }}
                            />
                          </div>
                          <div className="space-y-1 col-span-1">
                            <Label className="text-xs">Flag</Label>
                            <Select
                              value={inv.flag || ""}
                              onValueChange={(val) => {
                                const next = [...results];
                                next[idx] = {
                                  ...next[idx],
                                  flag:
                                    val === ""
                                      ? undefined
                                      : (val as PreviousInvestigationResult["flag"]),
                                };
                                set("results", next);
                              }}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="auto" />
                              </SelectTrigger>
                              <SelectContent>
                                {INVESTIGATION_FLAG_OPTIONS.map((opt) => (
                                  <SelectItem key={opt} value={opt}>
                                    {opt}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                      {STRUCTURED_FINDINGS[inv.name] && (
                        <div className="space-y-1 mt-1.5">
                          <Label className="text-xs">Finding</Label>
                          <Select
                            value={inv.finding || ""}
                            onValueChange={(val) => {
                              const next = [...results];
                              next[idx] = {
                                ...next[idx],
                                finding: val || undefined,
                              };
                              set("results", next);
                            }}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select finding (or leave blank)..." />
                            </SelectTrigger>
                            <SelectContent>
                              {STRUCTURED_FINDINGS[inv.name].map((opt) => (
                                <SelectItem key={opt} value={opt}>
                                  {opt.replace(/_/g, " ")}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      {inv.result === "Abnormal" && (
                        <div className="space-y-1 mt-1.5">
                          <Label className="text-xs">Abnormal Result Details</Label>
                          <Input
                            value={inv.abnormalDetails || ""}
                            onChange={(e) => {
                              const next = [...results];
                              next[idx] = { ...next[idx], abnormalDetails: e.target.value };
                              set("results", next);
                            }}
                            placeholder="Describe the abnormality..."
                          />
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Clinical Interpretation</Label>
                      <Textarea
                        value={inv.interpretation}
                        onChange={(e) => {
                          const next = [...results];
                          next[idx] = { ...next[idx], interpretation: e.target.value };
                          set("results", next);
                        }}
                        placeholder="What does this mean for diagnosis and management?"
                        className="min-h-[60px]"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={(v.notes as string) || ""}
                  onChange={(e) => set("notes", e.target.value)}
                  placeholder="Additional notes on prior investigations..."
                  className="min-h-[60px]"
                />
              </div>
            </div>
          );
        }}
      </EncounterFormWrapper>
    </div>
  );
}
