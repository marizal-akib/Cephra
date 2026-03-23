"use client";

import { useCallback } from "react";
import { useEncounterContext } from "../layout";
import { EncounterFormWrapper } from "@/components/encounter/encounter-form-wrapper";
import { auraSchema } from "@/lib/schemas/aura";
import { ToggleField } from "@/components/encounter/toggle-field";
import { NumberField } from "@/components/encounter/number-field";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { DictationTextarea as Textarea } from "@/components/ui/dictation-textarea";

export default function AuraPage() {
  const { encounterId, assessment, updateAssessmentLocal, updateEncounterLocal } =
    useEncounterContext();

  const defaultValues = (assessment?.aura || {}) as Record<string, unknown>;

  const handleDataChange = useCallback(
    (data: Record<string, unknown>) => {
      updateAssessmentLocal("aura", data);
    },
    [updateAssessmentLocal]
  );

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Aura Features</h2>
        <p className="text-sm text-muted-foreground">
          Visual, sensory, speech, and motor aura characteristics.
        </p>
      </div>

      <EncounterFormWrapper
        encounterId={encounterId}
        section="aura"
        schema={auraSchema}
        defaultValues={defaultValues}
        onDataChange={handleDataChange}
        onEncounterStatusChange={updateEncounterLocal}
      >
        {(form) => {
          const v = form.watch();
          const set = (name: string, value: unknown) =>
            form.setValue(name as never, value as never, { shouldDirty: true });

          const hasAtypical = !!v.motor_weakness || !!v.diplopia;

          return (
            <div className="space-y-6">
              {hasAtypical && (
                <Alert className="border-amber-500 bg-amber-50">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800">
                    Atypical aura features detected (motor weakness / diplopia).
                    Consider further investigation.
                  </AlertDescription>
                </Alert>
              )}

              <div>
                <h3 className="text-sm font-semibold mb-3">Aura Types</h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <ToggleField label="Visual positive" description="Flashing lights, zigzag lines" checked={!!v.visual_positive} onCheckedChange={(c) => set("visual_positive", c)} />
                  <ToggleField label="Visual negative" description="Blind spots, visual loss" checked={!!v.visual_negative} onCheckedChange={(c) => set("visual_negative", c)} />
                  <ToggleField label="Sensory positive" description="Tingling, pins and needles" checked={!!v.sensory_positive} onCheckedChange={(c) => set("sensory_positive", c)} />
                  <ToggleField label="Sensory negative" description="Numbness" checked={!!v.sensory_negative} onCheckedChange={(c) => set("sensory_negative", c)} />
                  <ToggleField label="Speech disturbance" description="Dysphasia, dysarthria" checked={!!v.speech_disturbance} onCheckedChange={(c) => set("speech_disturbance", c)} />
                  <ToggleField label="Motor weakness" description="Hemiplegic features" checked={!!v.motor_weakness} onCheckedChange={(c) => set("motor_weakness", c)} />
                  <ToggleField label="Diplopia" checked={!!v.diplopia} onCheckedChange={(c) => set("diplopia", c)} />
                  <ToggleField label="Vertigo" checked={!!v.vertigo} onCheckedChange={(c) => set("vertigo", c)} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <NumberField
                  label="Aura duration"
                  value={v.aura_duration_minutes as number | undefined}
                  onChange={(val) => set("aura_duration_minutes", val)}
                  min={0}
                  unit="min"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <ToggleField label="Aura is reversible" checked={!!v.aura_reversible} onCheckedChange={(c) => set("aura_reversible", c)} />
                <ToggleField label="Gradual spread (>=5 min)" checked={!!v.gradual_spread} onCheckedChange={(c) => set("gradual_spread", c)} />
                <ToggleField label="Headache follows aura" checked={!!v.headache_follows_aura} onCheckedChange={(c) => set("headache_follows_aura", c)} />
              </div>
              <div className="space-y-2">
                <Label>Aura Notes</Label>
                <Textarea
                  value={(v.notes as string) || ""}
                  onChange={(e) => set("notes", e.target.value)}
                  placeholder="Add additional details about aura features..."
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
