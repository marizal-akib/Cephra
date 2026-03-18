"use client";

import { useCallback } from "react";
import { useEncounterContext } from "../layout";
import { EncounterFormWrapper } from "@/components/encounter/encounter-form-wrapper";
import { autonomicSchema } from "@/lib/schemas/autonomic";
import { ToggleField } from "@/components/encounter/toggle-field";

export default function AutonomicPage() {
  const { encounterId, assessment, updateAssessmentLocal, updateEncounterLocal } =
    useEncounterContext();

  const defaultValues = (assessment?.autonomic || {}) as Record<string, unknown>;

  const handleDataChange = useCallback(
    (data: Record<string, unknown>) => {
      updateAssessmentLocal("autonomic", data);
    },
    [updateAssessmentLocal]
  );

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Autonomic / TAC Features</h2>
        <p className="text-sm text-muted-foreground">
          Cranial autonomic symptoms ipsilateral to the headache.
        </p>
      </div>

      <EncounterFormWrapper
        encounterId={encounterId}
        section="autonomic"
        schema={autonomicSchema}
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
              <ToggleField label="Lacrimation" description="Tearing of the eye" checked={!!v.lacrimation} onCheckedChange={(c) => set("lacrimation", c)} />
              <ToggleField label="Conjunctival injection" description="Red eye" checked={!!v.conjunctival_injection} onCheckedChange={(c) => set("conjunctival_injection", c)} />
              <ToggleField label="Rhinorrhoea" description="Runny nose" checked={!!v.rhinorrhoea} onCheckedChange={(c) => set("rhinorrhoea", c)} />
              <ToggleField label="Nasal congestion" checked={!!v.nasal_congestion} onCheckedChange={(c) => set("nasal_congestion", c)} />
              <ToggleField label="Ptosis" description="Drooping eyelid" checked={!!v.ptosis} onCheckedChange={(c) => set("ptosis", c)} />
              <ToggleField label="Miosis" description="Constricted pupil" checked={!!v.miosis} onCheckedChange={(c) => set("miosis", c)} />
              <ToggleField label="Eyelid oedema" checked={!!v.eyelid_oedema} onCheckedChange={(c) => set("eyelid_oedema", c)} />
              <ToggleField label="Facial sweating" checked={!!v.facial_sweating} onCheckedChange={(c) => set("facial_sweating", c)} />
              <ToggleField label="Ear fullness" checked={!!v.ear_fullness} onCheckedChange={(c) => set("ear_fullness", c)} />
            </div>
          );
        }}
      </EncounterFormWrapper>
    </div>
  );
}
