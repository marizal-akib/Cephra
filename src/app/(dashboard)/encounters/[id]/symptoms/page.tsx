"use client";

import { useCallback } from "react";
import { useEncounterContext } from "../layout";
import { EncounterFormWrapper } from "@/components/encounter/encounter-form-wrapper";
import { symptomsSchema } from "@/lib/schemas/symptoms";
import { ToggleField } from "@/components/encounter/toggle-field";

export default function SymptomsPage() {
  const { encounterId, assessment, updateAssessmentLocal, updateEncounterLocal } =
    useEncounterContext();

  const defaultValues = (assessment?.symptoms || {}) as Record<string, unknown>;

  const handleDataChange = useCallback(
    (data: Record<string, unknown>) => {
      updateAssessmentLocal("symptoms", data);
    },
    [updateAssessmentLocal]
  );

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Associated Symptoms</h2>
        <p className="text-sm text-muted-foreground">
          Symptoms that accompany typical headache attacks.
        </p>
      </div>

      <EncounterFormWrapper
        encounterId={encounterId}
        section="symptoms"
        schema={symptomsSchema}
        defaultValues={defaultValues}
        onDataChange={handleDataChange}
        onEncounterStatusChange={updateEncounterLocal}
      >
        {(form) => {
          const v = form.watch();
          const set = (name: string, value: unknown) =>
            form.setValue(name as never, value as never, { shouldDirty: true });

          return (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <ToggleField label="Nausea" checked={!!v.nausea} onCheckedChange={(c) => set("nausea", c)} />
              <ToggleField label="Vomiting" checked={!!v.vomiting} onCheckedChange={(c) => set("vomiting", c)} />
              <ToggleField label="Photophobia" description="Light sensitivity" checked={!!v.photophobia} onCheckedChange={(c) => set("photophobia", c)} />
              <ToggleField label="Phonophobia" description="Sound sensitivity" checked={!!v.phonophobia} onCheckedChange={(c) => set("phonophobia", c)} />
              <ToggleField label="Osmophobia" description="Smell sensitivity" checked={!!v.osmophobia} onCheckedChange={(c) => set("osmophobia", c)} />
              <ToggleField label="Motion sensitivity" checked={!!v.motion_sensitivity} onCheckedChange={(c) => set("motion_sensitivity", c)} />
              <ToggleField label="Dizziness" checked={!!v.dizziness} onCheckedChange={(c) => set("dizziness", c)} />
              <ToggleField label="Fatigue" checked={!!v.fatigue} onCheckedChange={(c) => set("fatigue", c)} />
              <ToggleField label="Neck pain" checked={!!v.neck_pain} onCheckedChange={(c) => set("neck_pain", c)} />
            </div>
          );
        }}
      </EncounterFormWrapper>
    </div>
  );
}
