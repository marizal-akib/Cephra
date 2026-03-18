"use client";

import { useCallback } from "react";
import { useEncounterContext } from "../layout";
import { EncounterFormWrapper } from "@/components/encounter/encounter-form-wrapper";
import { patternSchema } from "@/lib/schemas/pattern";
import { ToggleField } from "@/components/encounter/toggle-field";
import { NumberField } from "@/components/encounter/number-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function PatternPage() {
  const { encounterId, assessment, updateAssessmentLocal, updateEncounterLocal } =
    useEncounterContext();

  const defaultValues = (assessment?.pattern || {}) as Record<string, unknown>;

  const handleDataChange = useCallback(
    (data: Record<string, unknown>) => {
      updateAssessmentLocal("pattern", data);
    },
    [updateAssessmentLocal]
  );

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Headache Pattern</h2>
        <p className="text-sm text-muted-foreground">
          Chronology, frequency, duration, and temporal characteristics.
        </p>
      </div>

      <EncounterFormWrapper
        encounterId={encounterId}
        section="pattern"
        schema={patternSchema}
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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Pattern onset date</Label>
                  <Input
                    type="date"
                    value={(v.current_pattern_start as string) || ""}
                    onChange={(e) => set("current_pattern_start", e.target.value)}
                    className="w-48"
                  />
                </div>
                <NumberField
                  label="Age at first headache"
                  description="Age (years) when headaches first began"
                  value={v.first_headache_age as number | undefined}
                  onChange={(val) => set("first_headache_age", val)}
                  min={0}
                  unit="yrs"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-4">
                  <NumberField
                    label="Duration (hours)"
                    description="Typical untreated attack duration"
                    value={v.duration_hours as number | undefined}
                    onChange={(val) => set("duration_hours", val)}
                    min={0}
                    unit="hours"
                  />
                </div>
                <div className="space-y-2 rounded-lg border p-3">
                  <NumberField
                    label="Duration (minutes)"
                    description="For short attacks (TAC/cluster)"
                    value={v.duration_minutes as number | undefined}
                    onChange={(val) => set("duration_minutes", val)}
                    min={0}
                    unit="min"
                    disabled={!!v.duration_minutes_na}
                  />
                  <label className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={!!v.duration_minutes_na}
                      onCheckedChange={(checked) => {
                        const isChecked = checked === true;
                        set("duration_minutes_na", isChecked);
                        if (isChecked) {
                          set("duration_minutes", undefined);
                        }
                      }}
                    />
                    <span>N/A</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <NumberField
                  label="Time to peak"
                  value={v.time_to_peak_minutes as number | undefined}
                  onChange={(val) => set("time_to_peak_minutes", val)}
                  min={0}
                  unit="min"
                />
                <NumberField
                  label="Pattern duration"
                  description="How long this pattern has lasted"
                  value={v.pattern_duration_months as number | undefined}
                  onChange={(val) => set("pattern_duration_months", val)}
                  min={0}
                  unit="months"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <NumberField
                  label="Headache days/month"
                  value={v.headache_days_per_month as number | undefined}
                  onChange={(val) => set("headache_days_per_month", val)}
                  min={0}
                  max={31}
                />
                <NumberField
                  label="Severe days/month"
                  value={v.severe_days_per_month as number | undefined}
                  onChange={(val) => set("severe_days_per_month", val)}
                  min={0}
                  max={31}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <NumberField
                  label="Migraine-like days/month"
                  value={v.migraine_like_days_per_month as number | undefined}
                  onChange={(val) => set("migraine_like_days_per_month", val)}
                  min={0}
                  max={31}
                />
                <NumberField
                  label="Attacks per month"
                  description="Discrete attacks (if episodic)"
                  value={v.attacks_per_month as number | undefined}
                  onChange={(val) => set("attacks_per_month", val)}
                  min={0}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2 rounded-lg border p-3">
                  <NumberField
                    label="Attacks per day"
                    description="For cluster/TAC patterns"
                    value={v.attacks_per_day as number | undefined}
                    onChange={(val) => set("attacks_per_day", val)}
                    min={0}
                    disabled={!!v.attacks_per_day_na}
                  />
                  <label className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={!!v.attacks_per_day_na}
                      onCheckedChange={(checked) => {
                        const isChecked = checked === true;
                        set("attacks_per_day_na", isChecked);
                        if (isChecked) {
                          set("attacks_per_day", undefined);
                        }
                      }}
                    />
                    <span>N/A</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <ToggleField
                  label="Gradual onset"
                  checked={!!v.gradual_onset}
                  onCheckedChange={(c) => set("gradual_onset", c)}
                />
                <ToggleField
                  label="Sudden onset"
                  checked={!!v.sudden_onset}
                  onCheckedChange={(c) => set("sudden_onset", c)}
                />
                <ToggleField
                  label="Pain-free intervals"
                  checked={!!v.pain_free_intervals}
                  onCheckedChange={(c) => set("pain_free_intervals", c)}
                />
                <ToggleField
                  label="Continuous background pain"
                  checked={!!v.continuous_background_pain}
                  onCheckedChange={(c) => set("continuous_background_pain", c)}
                />
                <ToggleField
                  label="Change from baseline"
                  checked={!!v.change_from_baseline}
                  onCheckedChange={(c) => set("change_from_baseline", c)}
                />
                <ToggleField
                  label="Wakes from sleep"
                  checked={!!v.wakes_from_sleep}
                  onCheckedChange={(c) => set("wakes_from_sleep", c)}
                />
                <ToggleField
                  label="Pre-existing primary headache"
                  checked={!!v.pre_existing_primary_headache}
                  onCheckedChange={(c) => set("pre_existing_primary_headache", c)}
                />
                <ToggleField
                  label="Past episodic migraine"
                  checked={!!v.past_episodic_migraine}
                  onCheckedChange={(c) => set("past_episodic_migraine", c)}
                />
                <ToggleField
                  label="Daily or near-daily"
                  checked={!!v.daily_or_near_daily}
                  onCheckedChange={(c) => set("daily_or_near_daily", c)}
                />
                <ToggleField
                  label="Worsening with increased medication"
                  checked={!!v.worsening_with_increased_meds}
                  onCheckedChange={(c) => set("worsening_with_increased_meds", c)}
                />
              </div>
            </div>
          );
        }}
      </EncounterFormWrapper>
    </div>
  );
}
