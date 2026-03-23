"use client";

import { useCallback } from "react";
import { useEncounterContext } from "../layout";
import { EncounterFormWrapper } from "@/components/encounter/encounter-form-wrapper";
import { painSchema } from "@/lib/schemas/pain";
import { ToggleField } from "@/components/encounter/toggle-field";
import { NumberField } from "@/components/encounter/number-field";
import { Label } from "@/components/ui/label";
import { DictationTextarea as Textarea } from "@/components/ui/dictation-textarea";

export default function PainPage() {
  const { encounterId, assessment, updateAssessmentLocal, updateEncounterLocal } =
    useEncounterContext();

  const defaultValues = (assessment?.pain || {}) as Record<string, unknown>;

  const handleDataChange = useCallback(
    (data: Record<string, unknown>) => {
      updateAssessmentLocal("pain", data);
    },
    [updateAssessmentLocal]
  );

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Pain Characteristics</h2>
        <p className="text-sm text-muted-foreground">
          Location, quality, severity, and behaviour during attacks.
        </p>
      </div>

      <EncounterFormWrapper
        encounterId={encounterId}
        section="pain"
        schema={painSchema}
        defaultValues={defaultValues}
        onDataChange={handleDataChange}
        onEncounterStatusChange={updateEncounterLocal}
      >
        {(form) => {
          const v = form.watch();
          const set = (name: string, value: unknown) =>
            form.setValue(name as never, value as never, { shouldDirty: true });

          return (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold mb-3">Location</h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <ToggleField label="Unilateral" checked={!!v.unilateral} onCheckedChange={(c) => set("unilateral", c)} />
                  <ToggleField label="Bilateral" checked={!!v.bilateral} onCheckedChange={(c) => set("bilateral", c)} />
                  <ToggleField label="Side-locked" checked={!!v.side_locked} onCheckedChange={(c) => set("side_locked", c)} />
                  <ToggleField label="Alternating sides" checked={!!v.alternating_sides} onCheckedChange={(c) => set("alternating_sides", c)} />
                  <ToggleField label="Frontal" checked={!!v.frontal} onCheckedChange={(c) => set("frontal", c)} />
                  <ToggleField label="Temporal" checked={!!v.temporal} onCheckedChange={(c) => set("temporal", c)} />
                  <ToggleField label="Orbital" checked={!!v.orbital} onCheckedChange={(c) => set("orbital", c)} />
                  <ToggleField label="Supraorbital" checked={!!v.supraorbital} onCheckedChange={(c) => set("supraorbital", c)} />
                  <ToggleField label="Occipital" checked={!!v.occipital} onCheckedChange={(c) => set("occipital", c)} />
                  <ToggleField label="Neck-predominant" checked={!!v.neck_predominant} onCheckedChange={(c) => set("neck_predominant", c)} />
                  <ToggleField label="Generalized" checked={!!v.generalized} onCheckedChange={(c) => set("generalized", c)} />
                  <ToggleField label="Unable to characterize" checked={!!v.unable_to_characterize} onCheckedChange={(c) => set("unable_to_characterize", c)} />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3">Quality</h3>
                <div className="grid grid-cols-3 gap-3">
                  <ToggleField label="Pulsating" checked={!!v.pulsating} onCheckedChange={(c) => set("pulsating", c)} />
                  <ToggleField label="Pressing" checked={!!v.pressing} onCheckedChange={(c) => set("pressing", c)} />
                  <ToggleField label="Tightening" checked={!!v.tightening} onCheckedChange={(c) => set("tightening", c)} />
                  <ToggleField label="Stabbing" checked={!!v.stabbing} onCheckedChange={(c) => set("stabbing", c)} />
                  <ToggleField label="Burning" checked={!!v.burning} onCheckedChange={(c) => set("burning", c)} />
                  <ToggleField label="Boring" checked={!!v.boring} onCheckedChange={(c) => set("boring", c)} />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3">Severity</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <NumberField
                    label="Average intensity"
                    value={v.avg_intensity as number | undefined}
                    onChange={(val) => set("avg_intensity", val)}
                    min={0}
                    max={10}
                    unit="/10"
                  />
                  <NumberField
                    label="Peak intensity"
                    value={v.peak_intensity as number | undefined}
                    onChange={(val) => set("peak_intensity", val)}
                    min={0}
                    max={10}
                    unit="/10"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3">Behaviour</h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <ToggleField label="Worse with activity" checked={!!v.worse_with_activity} onCheckedChange={(c) => set("worse_with_activity", c)} />
                  <ToggleField label="Prefers to lie still" checked={!!v.prefers_to_lie_still} onCheckedChange={(c) => set("prefers_to_lie_still", c)} />
                  <ToggleField label="Restless or pacing" checked={!!v.restless_or_pacing} onCheckedChange={(c) => set("restless_or_pacing", c)} />
                  <ToggleField label="Continuous background" checked={!!v.continuous_background} onCheckedChange={(c) => set("continuous_background", c)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Pain Notes</Label>
                <Textarea
                  value={(v.notes as string) || ""}
                  onChange={(e) => set("notes", e.target.value)}
                  placeholder="Add additional details about pain characteristics..."
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
