"use client";

import { useCallback } from "react";
import { useEncounterContext } from "../layout";
import { EncounterFormWrapper } from "@/components/encounter/encounter-form-wrapper";
import { medsSchema } from "@/lib/schemas/meds";
import { ToggleField } from "@/components/encounter/toggle-field";
import { NumberField } from "@/components/encounter/number-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

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

          const mohRisk =
            triptanDays >= 10 ||
            opioidDays >= 10 ||
            comboDays >= 10 ||
            simpleDays >= 15;

          return (
            <div className="space-y-6">
              {mohRisk && (
                <Alert className="border-amber-500 bg-amber-50">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800">
                    Medication overuse thresholds crossed. This may contribute to
                    or cause chronic headache.
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
            </div>
          );
        }}
      </EncounterFormWrapper>
    </div>
  );
}
