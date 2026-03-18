"use client";

import { useCallback } from "react";
import { useEncounterContext } from "../layout";
import { EncounterFormWrapper } from "@/components/encounter/encounter-form-wrapper";
import { triggersSchema } from "@/lib/schemas/triggers";
import { ToggleField } from "@/components/encounter/toggle-field";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export default function TriggersPage() {
  const { encounterId, assessment, updateAssessmentLocal, updateEncounterLocal } =
    useEncounterContext();

  const defaultValues = (assessment?.triggers || {}) as Record<string, unknown>;

  const handleDataChange = useCallback(
    (data: Record<string, unknown>) => {
      updateAssessmentLocal("triggers", data);
    },
    [updateAssessmentLocal]
  );

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Triggers & Positional Factors</h2>
        <p className="text-sm text-muted-foreground">
          Factors that provoke or worsen headaches.
        </p>
      </div>

      <EncounterFormWrapper
        encounterId={encounterId}
        section="triggers"
        schema={triggersSchema}
        defaultValues={defaultValues}
        onDataChange={handleDataChange}
        onEncounterStatusChange={updateEncounterLocal}
      >
        {(form) => {
          const v = form.watch();
          const set = (name: string, value: unknown) =>
            form.setValue(name as never, value as never, { shouldDirty: true });

          const hasPositionalCough =
            !!v.cough ||
            !!v.valsalva ||
            !!v.positional_worse_upright ||
            !!v.positional_worse_supine;

          return (
            <div className="space-y-6">
              {hasPositionalCough && (
                <Alert className="border-amber-500 bg-amber-50">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800">
                    Positional or cough/Valsalva triggers detected. These also
                    feed the red-flag engine — consider secondary causes.
                  </AlertDescription>
                </Alert>
              )}

              <div>
                <h3 className="text-sm font-semibold mb-3">Common Triggers</h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <ToggleField label="Alcohol" checked={!!v.alcohol} onCheckedChange={(c) => set("alcohol", c)} />
                  <ToggleField label="Menstruation" checked={!!v.menstruation} onCheckedChange={(c) => set("menstruation", c)} />
                  <ToggleField label="Sleep deprivation" checked={!!v.sleep_deprivation} onCheckedChange={(c) => set("sleep_deprivation", c)} />
                  <ToggleField label="Stress" checked={!!v.stress} onCheckedChange={(c) => set("stress", c)} />
                  <ToggleField label="Missed meals" checked={!!v.missed_meals} onCheckedChange={(c) => set("missed_meals", c)} />
                  <ToggleField label="Exertion" checked={!!v.exertion} onCheckedChange={(c) => set("exertion", c)} />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3">
                  Positional / Provocative
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <ToggleField label="Cough-triggered" checked={!!v.cough} onCheckedChange={(c) => set("cough", c)} />
                  <ToggleField label="Valsalva-triggered" checked={!!v.valsalva} onCheckedChange={(c) => set("valsalva", c)} />
                  <ToggleField label="Worse upright" description="Suggests low CSF pressure" checked={!!v.positional_worse_upright} onCheckedChange={(c) => set("positional_worse_upright", c)} />
                  <ToggleField label="Worse supine" description="Suggests raised ICP" checked={!!v.positional_worse_supine} onCheckedChange={(c) => set("positional_worse_supine", c)} />
                </div>
              </div>
            </div>
          );
        }}
      </EncounterFormWrapper>
    </div>
  );
}
