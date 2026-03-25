"use client";

import { useCallback } from "react";
import { useEncounterContext } from "../layout";
import { FollowUpFormWrapper } from "@/components/encounter/followup-form-wrapper";
import { burdenSchema } from "@/lib/schemas/followup/burden";
import { NumberField } from "@/components/encounter/number-field";
import { Label } from "@/components/ui/label";
import { DictationTextarea as Textarea } from "@/components/ui/dictation-textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function BaselineCompare({ label, current, baseline, unit }: {
  label: string;
  current: number | undefined;
  baseline: number | null;
  unit?: string;
}) {
  if (baseline === null) return null;
  const diff = current !== undefined ? current - baseline : null;
  const arrow = diff === null ? "" : diff > 0 ? " ↑" : diff < 0 ? " ↓" : " →";
  const color = diff === null ? "" : diff > 0 ? "text-red-600" : diff < 0 ? "text-emerald-600" : "text-muted-foreground";

  return (
    <p className={`text-xs ${color}`}>
      Last review: {baseline}{unit ? ` ${unit}` : ""}{diff !== null ? ` (${diff > 0 ? "+" : ""}${diff}${arrow})` : ""}
    </p>
  );
}

export default function BurdenPage() {
  const { encounterId, followUpAssessment, baseline, updateFollowUpLocal, updateEncounterLocal } =
    useEncounterContext();

  const defaultValues = (followUpAssessment?.burden || {}) as Record<string, unknown>;

  const handleDataChange = useCallback(
    (data: Record<string, unknown>) => {
      updateFollowUpLocal("burden", data);
    },
    [updateFollowUpLocal]
  );

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Current Headache Burden</h2>
        <p className="text-sm text-muted-foreground">
          Quantify current burden and compare with last review. Use numbers, not adjectives.
        </p>
      </div>

      <FollowUpFormWrapper
        encounterId={encounterId}
        section="burden"
        schema={burdenSchema}
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
                <h3 className="text-sm font-semibold mb-3">Frequency</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <NumberField label="Headache days/month" value={v.headache_days_per_month as number | undefined} onChange={(val) => set("headache_days_per_month", val)} min={0} max={31} unit="days" />
                    <BaselineCompare label="Headache days" current={v.headache_days_per_month as number | undefined} baseline={baseline?.headache_days_per_month ?? null} unit="days" />
                  </div>
                  <div>
                    <NumberField label="Migraine days/month" value={v.migraine_days_per_month as number | undefined} onChange={(val) => set("migraine_days_per_month", val)} min={0} max={31} unit="days" />
                    <BaselineCompare label="Migraine days" current={v.migraine_days_per_month as number | undefined} baseline={baseline?.migraine_days_per_month ?? null} unit="days" />
                  </div>
                  <div>
                    <NumberField label="Severe days/month" value={v.severe_days_per_month as number | undefined} onChange={(val) => set("severe_days_per_month", val)} min={0} max={31} unit="days" />
                    <BaselineCompare label="Severe days" current={v.severe_days_per_month as number | undefined} baseline={baseline?.severe_days_per_month ?? null} unit="days" />
                  </div>
                  <NumberField label="Attacks/month" value={v.attacks_per_month as number | undefined} onChange={(val) => set("attacks_per_month", val)} min={0} />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3">Severity</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <NumberField label="Average severity" value={v.avg_severity as number | undefined} onChange={(val) => set("avg_severity", val)} min={0} max={10} unit="/10" />
                    <BaselineCompare label="Avg severity" current={v.avg_severity as number | undefined} baseline={baseline?.avg_severity ?? null} unit="/10" />
                  </div>
                  <div>
                    <NumberField label="Worst severity" value={v.worst_severity as number | undefined} onChange={(val) => set("worst_severity", val)} min={0} max={10} unit="/10" />
                    <BaselineCompare label="Worst severity" current={v.worst_severity as number | undefined} baseline={baseline?.worst_severity ?? null} unit="/10" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3">Trend</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Overall Trend</Label>
                    <Select value={(v.trend_direction as string) || ""} onValueChange={(val) => set("trend_direction", val)}>
                      <SelectTrigger><SelectValue placeholder="Select trend" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="improving">Improving</SelectItem>
                        <SelectItem value="stable">Stable</SelectItem>
                        <SelectItem value="worsening">Worsening</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Typical Duration</Label>
                    <div className="flex gap-2">
                      <NumberField label="Hours" value={v.typical_duration_hours as number | undefined} onChange={(val) => set("typical_duration_hours", val)} min={0} />
                      <NumberField label="Minutes" value={v.typical_duration_minutes as number | undefined} onChange={(val) => set("typical_duration_minutes", val)} min={0} max={59} />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3">Functional Impact</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <NumberField label="Work days lost" value={v.work_days_lost as number | undefined} onChange={(val) => set("work_days_lost", val)} min={0} unit="days" />
                  <NumberField label="Disability days" value={v.disability_days as number | undefined} onChange={(val) => set("disability_days", val)} min={0} unit="days" />
                </div>
                <div className="mt-3 space-y-2">
                  <Label>Functional Impact Notes</Label>
                  <Textarea
                    value={(v.functional_impact_notes as string) || ""}
                    onChange={(e) => set("functional_impact_notes", e.target.value)}
                    placeholder="Impact on work, school, or usual activities..."
                    className="min-h-[80px]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Additional Notes</Label>
                <Textarea
                  value={(v.notes as string) || ""}
                  onChange={(e) => set("notes", e.target.value)}
                  placeholder="Any additional observations about the headache pattern..."
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
