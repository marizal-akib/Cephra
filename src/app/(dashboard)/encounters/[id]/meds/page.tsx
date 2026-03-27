"use client";

import { useCallback } from "react";
import { useEncounterContext } from "../layout";
import { EncounterFormWrapper } from "@/components/encounter/encounter-form-wrapper";
import { medsSchema } from "@/lib/schemas/meds";
import { ToggleField } from "@/components/encounter/toggle-field";
import { NumberField } from "@/components/encounter/number-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DictationTextarea as Textarea } from "@/components/ui/dictation-textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle2, XCircle, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MedicationAction {
  drug: string;
  type: "preventive" | "acute" | "other";
  dose: string;
  benefit: string;
  benefit_detail?: string;
  tolerability: string;
  tolerability_detail?: string;
  action: "continue" | "increase" | "decrease" | "stop" | "add" | "switch";
}

export default function MedsPage() {
  const { encounterId, assessment, updateAssessmentLocal, updateEncounterLocal } =
    useEncounterContext();

  const defaultValues = (assessment?.medications || {}) as Record<string, unknown>;

  const handleDataChange = useCallback(
    (data: Record<string, unknown>) => {
      updateAssessmentLocal("medications", data);
    },
    [updateAssessmentLocal]
  );

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Medication Exposure</h2>
        <p className="text-sm text-muted-foreground">
          Current acute and preventive medication use.
        </p>
      </div>

      <EncounterFormWrapper
        encounterId={encounterId}
        section="medications"
        schema={medsSchema}
        defaultValues={defaultValues}
        onDataChange={handleDataChange}
        onEncounterStatusChange={updateEncounterLocal}
      >
        {(form) => {
          const v = form.watch();
          const set = (name: string, value: unknown) =>
            form.setValue(name as never, value as never, { shouldDirty: true });

          const triptanDays = (v.triptan_days_per_month as number) || 0;
          const opioidDays = (v.opioid_days_per_month as number) || 0;
          const simpleDays = (v.simple_analgesic_days_per_month as number) || 0;
          const comboDays = (v.combination_analgesic_days_per_month as number) || 0;

          const paracetamolDays = (v.paracetamol_days_per_month as number) || 0;
          const nsaidDays = (v.nsaid_days_per_month as number) || 0;

          const mohOveruse =
            triptanDays >= 10 ||
            opioidDays >= 10 ||
            comboDays >= 10 ||
            simpleDays >= 15 ||
            paracetamolDays >= 15 ||
            nsaidDays >= 15;

          const patternData = (assessment?.pattern || {}) as Record<string, unknown>;
          const hdpm = typeof patternData.headache_days_per_month === "number" ? patternData.headache_days_per_month : null;
          const mohFrequency = hdpm !== null && hdpm >= 15;
          const mohPreExisting = patternData.pre_existing_primary_headache === true;

          return (
            <div className="space-y-6">
              {mohOveruse && (
                <Alert className="border-amber-500 bg-amber-50">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800 space-y-2">
                    <p className="font-medium">Medication overuse threshold reached — consider MOH.</p>
                    <p className="text-xs">All three ICHD-3 criteria are required for MOH to appear as a diagnostic suggestion:</p>
                    <ul className="text-xs space-y-1">
                      <li className="flex items-center gap-1.5">
                        {mohOveruse ? <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" /> : <XCircle className="h-3 w-3 text-red-500 shrink-0" />}
                        Acute medication overuse above threshold
                      </li>
                      <li className="flex items-center gap-1.5">
                        {mohFrequency ? <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" /> : <XCircle className="h-3 w-3 text-red-500 shrink-0" />}
                        Headache {"\u2265"}15 days/month{hdpm === null ? " (not yet recorded — Pattern section)" : mohFrequency ? ` (${hdpm} days)` : ` (${hdpm} days — below threshold)`}
                      </li>
                      <li className="flex items-center gap-1.5">
                        {mohPreExisting ? <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" /> : <XCircle className="h-3 w-3 text-red-500 shrink-0" />}
                        Pre-existing primary headache disorder{!mohPreExisting ? " (not set — Pattern section)" : ""}
                      </li>
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <div>
                <h3 className="text-sm font-semibold mb-3">
                  Acute Medication (days/month)
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <NumberField label="Triptan" value={v.triptan_days_per_month as number | undefined} onChange={(val) => set("triptan_days_per_month", val)} min={0} max={31} unit="days/mo" />
                  <NumberField label="NSAID" value={v.nsaid_days_per_month as number | undefined} onChange={(val) => set("nsaid_days_per_month", val)} min={0} max={31} unit="days/mo" />
                  <NumberField label="Paracetamol" value={v.paracetamol_days_per_month as number | undefined} onChange={(val) => set("paracetamol_days_per_month", val)} min={0} max={31} unit="days/mo" />
                  <NumberField label="Opioid" value={v.opioid_days_per_month as number | undefined} onChange={(val) => set("opioid_days_per_month", val)} min={0} max={31} unit="days/mo" />
                  <NumberField label="Simple analgesic" value={v.simple_analgesic_days_per_month as number | undefined} onChange={(val) => set("simple_analgesic_days_per_month", val)} min={0} max={31} unit="days/mo" />
                  <NumberField label="Combination analgesic" value={v.combination_analgesic_days_per_month as number | undefined} onChange={(val) => set("combination_analgesic_days_per_month", val)} min={0} max={31} unit="days/mo" />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3">Treatment Response</h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <ToggleField label="Response to triptan" checked={!!v.response_to_triptan} onCheckedChange={(c) => set("response_to_triptan", c)} />
                  <ToggleField label="Response to oxygen" description="High-flow O2 (cluster)" checked={!!v.response_to_oxygen} onCheckedChange={(c) => set("response_to_oxygen", c)} />
                  <ToggleField label="Response to indomethacin" description="Diagnostic for HC/PH" checked={!!v.response_to_indomethacin} onCheckedChange={(c) => set("response_to_indomethacin", c)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Current preventive medication</Label>
                <Input
                  value={(v.current_preventive as string) || ""}
                  onChange={(e) => set("current_preventive", e.target.value)}
                  placeholder="e.g. Topiramate 50mg BD"
                />
              </div>

              <div className="space-y-2">
                <Label>Preventive response</Label>
                <Input
                  value={(v.preventive_response as string) || ""}
                  onChange={(e) => set("preventive_response", e.target.value)}
                  placeholder="e.g. Partial response, side effects"
                />
              </div>
              <div className="space-y-2">
                <Label>Current Medications</Label>
                <Textarea
                  value={(v.current_medications_text as string) || ""}
                  onChange={(e) => set("current_medications_text", e.target.value)}
                  placeholder="List other current medications the patient is using..."
                  className="min-h-[120px]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold">Medication Review</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 gap-1 text-xs"
                    onClick={() => {
                      const actions = (Array.isArray(v.medication_actions) ? v.medication_actions : []) as MedicationAction[];
                      set("medication_actions", [...actions, { drug: "", type: "acute", dose: "", benefit: "", benefit_detail: "", tolerability: "", tolerability_detail: "", action: "continue" }]);
                    }}
                  >
                    <Plus className="h-3 w-3" />Add Medication
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Structured per-medication review for the clinic letter. Record each drug with its response and planned action.
                </p>
                {Array.isArray(v.medication_actions) && (v.medication_actions as MedicationAction[]).length > 0 && (
                  <div className="space-y-3">
                    {(v.medication_actions as MedicationAction[]).map((med, idx) => (
                      <div key={idx} className="rounded-lg border p-3 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-muted-foreground">Medication {idx + 1}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                            onClick={() => {
                              const actions = [...(v.medication_actions as MedicationAction[])];
                              actions.splice(idx, 1);
                              set("medication_actions", actions);
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div className="space-y-1">
                            <Label className="text-xs">Drug Name</Label>
                            <Input
                              value={med.drug}
                              onChange={(e) => {
                                const actions = [...(v.medication_actions as MedicationAction[])];
                                actions[idx] = { ...actions[idx], drug: e.target.value };
                                set("medication_actions", actions);
                              }}
                              placeholder="e.g. Topiramate"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Type</Label>
                            <Select
                              value={med.type}
                              onValueChange={(val) => {
                                const actions = [...(v.medication_actions as MedicationAction[])];
                                actions[idx] = { ...actions[idx], type: val as MedicationAction["type"] };
                                set("medication_actions", actions);
                              }}
                            >
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="preventive">Preventive</SelectItem>
                                <SelectItem value="acute">Acute</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Dose & Schedule</Label>
                            <Input
                              value={med.dose}
                              onChange={(e) => {
                                const actions = [...(v.medication_actions as MedicationAction[])];
                                actions[idx] = { ...actions[idx], dose: e.target.value };
                                set("medication_actions", actions);
                              }}
                              placeholder="e.g. 50mg BD"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Action</Label>
                            <Select
                              value={med.action}
                              onValueChange={(val) => {
                                const actions = [...(v.medication_actions as MedicationAction[])];
                                actions[idx] = { ...actions[idx], action: val as MedicationAction["action"] };
                                set("medication_actions", actions);
                              }}
                            >
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="continue">Continue</SelectItem>
                                <SelectItem value="increase">Increase</SelectItem>
                                <SelectItem value="decrease">Decrease</SelectItem>
                                <SelectItem value="stop">Stop</SelectItem>
                                <SelectItem value="add">Add (new)</SelectItem>
                                <SelectItem value="switch">Switch</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div className="space-y-1">
                            <Label className="text-xs">Benefit</Label>
                            <Select value={med.benefit} onValueChange={(val) => { const actions = [...(v.medication_actions as MedicationAction[])]; actions[idx] = { ...actions[idx], benefit: val, benefit_detail: val === "No effect" ? actions[idx].benefit_detail : "" }; set("medication_actions", actions); }}>
                              <SelectTrigger className="w-full"><SelectValue placeholder="Select benefit" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Aborts headache in 100% episodes">Aborts headache in 100% episodes</SelectItem>
                                <SelectItem value="Aborts headache more than 50% episodes">Aborts headache &gt;50% episodes</SelectItem>
                                <SelectItem value="Aborts headache less than 50% episodes">Aborts headache &lt;50% episodes</SelectItem>
                                <SelectItem value="Reduced frequency and severity more than 50%">Reduced frequency &amp; severity &gt;50%</SelectItem>
                                <SelectItem value="Reduced frequency and severity less than 50%">Reduced frequency &amp; severity &lt;50%</SelectItem>
                                <SelectItem value="No effect">No effect</SelectItem>
                              </SelectContent>
                            </Select>
                            {med.benefit === "No effect" && (
                              <Input value={med.benefit_detail || ""} onChange={(e) => { const actions = [...(v.medication_actions as MedicationAction[])]; actions[idx] = { ...actions[idx], benefit_detail: e.target.value }; set("medication_actions", actions); }} placeholder="Optional comment..." className="mt-1.5" />
                            )}
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Tolerability</Label>
                            <Select value={med.tolerability} onValueChange={(val) => { const actions = [...(v.medication_actions as MedicationAction[])]; actions[idx] = { ...actions[idx], tolerability: val, tolerability_detail: (val === "Minor side effects" || val === "Severe side effects") ? actions[idx].tolerability_detail : "" }; set("medication_actions", actions); }}>
                              <SelectTrigger className="w-full"><SelectValue placeholder="Select tolerability" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Well tolerated">Well tolerated</SelectItem>
                                <SelectItem value="Minor side effects">Minor side effects</SelectItem>
                                <SelectItem value="Severe side effects">Severe side effects</SelectItem>
                              </SelectContent>
                            </Select>
                            {(med.tolerability === "Minor side effects" || med.tolerability === "Severe side effects") && (
                              <Input value={med.tolerability_detail || ""} onChange={(e) => { const actions = [...(v.medication_actions as MedicationAction[])]; actions[idx] = { ...actions[idx], tolerability_detail: e.target.value }; set("medication_actions", actions); }} placeholder="e.g. Paraesthesia, fatigue..." className="mt-1.5" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        }}
      </EncounterFormWrapper>
    </div>
  );
}
