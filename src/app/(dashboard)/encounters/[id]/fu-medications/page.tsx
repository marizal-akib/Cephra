"use client";

import { useCallback } from "react";
import { useEncounterContext } from "../layout";
import { FollowUpFormWrapper } from "@/components/encounter/followup-form-wrapper";
import { medicationReviewSchema } from "@/lib/schemas/followup/medication-review";
import type { MedicationEntry } from "@/lib/schemas/followup/medication-review";
import { NumberField } from "@/components/encounter/number-field";
import { ToggleField } from "@/components/encounter/toggle-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DictationTextarea as Textarea } from "@/components/ui/dictation-textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Plus, Trash2 } from "lucide-react";
import { InfoTip } from "@/components/ui/info-tip";
import { getTooltip } from "@/lib/follow-up/tooltip-content";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FuMedicationsPage() {
  const { encounterId, encounter, followUpAssessment, baseline, updateFollowUpLocal, updateEncounterLocal } =
    useEncounterContext();
  const tip = (f: Parameters<typeof getTooltip>[1]) =>
    getTooltip(encounter?.diagnosis_template, f);

  const defaultValues = (followUpAssessment?.medication_review || {}) as Record<string, unknown>;

  const handleDataChange = useCallback(
    (data: Record<string, unknown>) => {
      updateFollowUpLocal("medication_review", data);
    },
    [updateFollowUpLocal]
  );

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Medication Review <InfoTip content={tip("medications.section")} /></h2>
        <p className="text-sm text-muted-foreground">
          Document every current medication with response, tolerability, and planned action.
        </p>
      </div>

      <FollowUpFormWrapper
        encounterId={encounterId}
        section="medication_review"
        schema={medicationReviewSchema}
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
            triptanDays >= 10 || opioidDays >= 10 || comboDays >= 10 ||
            simpleDays >= 15 || paracetamolDays >= 15 || nsaidDays >= 15;

          const medications = (Array.isArray(v.medications) ? v.medications : []) as MedicationEntry[];

          return (
            <div className="space-y-6">
              {mohOveruse && (
                <Alert className="border-amber-500 bg-amber-50">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800">
                    <p className="font-medium">Medication overuse threshold reached — consider MOH.</p>
                  </AlertDescription>
                </Alert>
              )}

              <div>
                <h3 className="text-sm font-semibold mb-3">Acute Medication (days/month)</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <NumberField label="Triptan" value={v.triptan_days_per_month as number | undefined} onChange={(val) => set("triptan_days_per_month", val)} min={0} max={31} unit="days/mo" />
                    {baseline?.triptan_days_per_month !== null && (
                      <p className="text-xs text-muted-foreground mt-0.5">Last review: {baseline?.triptan_days_per_month} days</p>
                    )}
                  </div>
                  <div>
                    <NumberField label="NSAID" value={v.nsaid_days_per_month as number | undefined} onChange={(val) => set("nsaid_days_per_month", val)} min={0} max={31} unit="days/mo" />
                    {baseline?.nsaid_days_per_month !== null && (
                      <p className="text-xs text-muted-foreground mt-0.5">Last review: {baseline?.nsaid_days_per_month} days</p>
                    )}
                  </div>
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
                  <ToggleField label="Response to oxygen" description="High-flow O₂ (cluster)" checked={!!v.response_to_oxygen} onCheckedChange={(c) => set("response_to_oxygen", c)} />
                  <ToggleField label="Response to indomethacin" description="Diagnostic for HC/PH" checked={!!v.response_to_indomethacin} onCheckedChange={(c) => set("response_to_indomethacin", c)} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold">Per-Drug Review</h3>
                  <Button
                    type="button" variant="outline" size="sm" className="h-7 gap-1 text-xs"
                    onClick={() => set("medications", [...medications, { drug: "", type: "acute", dose: "", benefit: "", benefit_detail: "", tolerability: "", tolerability_detail: "", action: "continue", notes: "" }])}
                  >
                    <Plus className="h-3 w-3" />Add Medication
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Record each drug with its response and planned action. This populates the medication review table in the follow-up letter.
                </p>
                {medications.length > 0 && (
                  <div className="space-y-3">
                    {medications.map((med, idx) => (
                      <div key={idx} className="rounded-lg border p-3 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-muted-foreground">Medication {idx + 1}</span>
                          <Button
                            type="button" variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                            onClick={() => { const next = [...medications]; next.splice(idx, 1); set("medications", next); }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div className="space-y-1">
                            <Label className="text-xs">Drug Name</Label>
                            <Input value={med.drug} onChange={(e) => { const next = [...medications]; next[idx] = { ...next[idx], drug: e.target.value }; set("medications", next); }} placeholder="e.g. Topiramate" />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Type</Label>
                            <Select value={med.type} onValueChange={(val) => { const next = [...medications]; next[idx] = { ...next[idx], type: val as MedicationEntry["type"] }; set("medications", next); }}>
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
                            <Input value={med.dose} onChange={(e) => { const next = [...medications]; next[idx] = { ...next[idx], dose: e.target.value }; set("medications", next); }} placeholder="e.g. 50mg BD" />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Action</Label>
                            <Select value={med.action} onValueChange={(val) => { const next = [...medications]; next[idx] = { ...next[idx], action: val as MedicationEntry["action"] }; set("medications", next); }}>
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
                            <Select value={med.benefit} onValueChange={(val) => { const next = [...medications]; next[idx] = { ...next[idx], benefit: val, benefit_detail: val === "No effect" ? next[idx].benefit_detail : "" }; set("medications", next); }}>
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
                              <Input value={med.benefit_detail || ""} onChange={(e) => { const next = [...medications]; next[idx] = { ...next[idx], benefit_detail: e.target.value }; set("medications", next); }} placeholder="Optional comment..." className="mt-1.5" />
                            )}
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Tolerability</Label>
                            <Select value={med.tolerability} onValueChange={(val) => { const next = [...medications]; next[idx] = { ...next[idx], tolerability: val, tolerability_detail: (val === "Minor side effects" || val === "Severe side effects") ? next[idx].tolerability_detail : "" }; set("medications", next); }}>
                              <SelectTrigger className="w-full"><SelectValue placeholder="Select tolerability" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Well tolerated">Well tolerated</SelectItem>
                                <SelectItem value="Minor side effects">Minor side effects</SelectItem>
                                <SelectItem value="Severe side effects">Severe side effects</SelectItem>
                              </SelectContent>
                            </Select>
                            {(med.tolerability === "Minor side effects" || med.tolerability === "Severe side effects") && (
                              <Input value={med.tolerability_detail || ""} onChange={(e) => { const next = [...medications]; next[idx] = { ...next[idx], tolerability_detail: e.target.value }; set("medications", next); }} placeholder="e.g. Paraesthesia, fatigue..." className="mt-1.5" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Medication Notes</Label>
                <Textarea
                  value={(v.medication_notes as string) || ""}
                  onChange={(e) => set("medication_notes", e.target.value)}
                  placeholder="Additional medication observations..."
                  className="min-h-[80px]"
                />
              </div>
            </div>
          );
        }}
      </FollowUpFormWrapper>
    </div>
  );
}
