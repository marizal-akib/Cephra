"use client";

import { useCallback } from "react";
import { useEncounterContext } from "../layout";
import { EncounterFormWrapper } from "@/components/encounter/encounter-form-wrapper";
import { autonomicSchema } from "@/lib/schemas/autonomic";
import { ToggleField } from "@/components/encounter/toggle-field";
import { Label } from "@/components/ui/label";
import { DictationTextarea as Textarea } from "@/components/ui/dictation-textarea";

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
          const autonomicNA = !!v.autonomic_features_na;

          return (
            <div className="space-y-4">
              <ToggleField
                label="Not applicable (N/A)"
                description="Use when TAC/autonomic features are not applicable to this case."
                checked={autonomicNA}
                onCheckedChange={(checked) => {
                  set("autonomic_features_na", checked);
                  if (checked) {
                    set("lacrimation", false);
                    set("conjunctival_injection", false);
                    set("rhinorrhoea", false);
                    set("nasal_congestion", false);
                    set("ptosis", false);
                    set("miosis", false);
                    set("eyelid_oedema", false);
                    set("facial_sweating", false);
                    set("ear_fullness", false);
                  }
                }}
              />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <ToggleField label="Lacrimation" description="Tearing of the eye" checked={!!v.lacrimation} onCheckedChange={(c) => set("lacrimation", c)} disabled={autonomicNA} />
                <ToggleField label="Conjunctival injection" description="Red eye" checked={!!v.conjunctival_injection} onCheckedChange={(c) => set("conjunctival_injection", c)} disabled={autonomicNA} />
                <ToggleField label="Rhinorrhoea" description="Runny nose" checked={!!v.rhinorrhoea} onCheckedChange={(c) => set("rhinorrhoea", c)} disabled={autonomicNA} />
                <ToggleField label="Nasal congestion" checked={!!v.nasal_congestion} onCheckedChange={(c) => set("nasal_congestion", c)} disabled={autonomicNA} />
                <ToggleField label="Ptosis" description="Drooping eyelid" checked={!!v.ptosis} onCheckedChange={(c) => set("ptosis", c)} disabled={autonomicNA} />
                <ToggleField label="Miosis" description="Constricted pupil" checked={!!v.miosis} onCheckedChange={(c) => set("miosis", c)} disabled={autonomicNA} />
                <ToggleField label="Eyelid oedema" checked={!!v.eyelid_oedema} onCheckedChange={(c) => set("eyelid_oedema", c)} disabled={autonomicNA} />
                <ToggleField label="Facial sweating" checked={!!v.facial_sweating} onCheckedChange={(c) => set("facial_sweating", c)} disabled={autonomicNA} />
                <ToggleField label="Ear fullness" checked={!!v.ear_fullness} onCheckedChange={(c) => set("ear_fullness", c)} disabled={autonomicNA} />
              </div>
              <div className="space-y-2">
                <Label>Autonomic Notes</Label>
                <Textarea
                  value={(v.notes as string) || ""}
                  onChange={(e) => set("notes", e.target.value)}
                  placeholder="Add additional details about autonomic features..."
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
