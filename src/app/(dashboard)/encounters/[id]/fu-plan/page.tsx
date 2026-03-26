"use client";

import { useCallback } from "react";
import { useEncounterContext } from "../layout";
import { FollowUpFormWrapper } from "@/components/encounter/followup-form-wrapper";
import { assessmentPlanSchema } from "@/lib/schemas/followup/assessment-plan";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DictationTextarea as Textarea } from "@/components/ui/dictation-textarea";
import { ToggleField } from "@/components/encounter/toggle-field";
import { Button } from "@/components/ui/button";
import { InfoTip } from "@/components/ui/info-tip";
import { getTooltip } from "@/lib/follow-up/tooltip-content";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FuPlanPage() {
  const { encounterId, encounter, followUpAssessment, diagnosticOutput, updateFollowUpLocal, updateEncounterLocal } =
    useEncounterContext();
  const tip = (f: Parameters<typeof getTooltip>[1]) =>
    getTooltip(encounter?.diagnosis_template, f);
  const router = useRouter();

  const defaultValues = (followUpAssessment?.assessment_plan || {}) as Record<string, unknown>;

  const handleDataChange = useCallback(
    (data: Record<string, unknown>) => {
      updateFollowUpLocal("assessment_plan", data);
    },
    [updateFollowUpLocal]
  );

  const topDiagnosis = diagnosticOutput?.phenotypes[0];

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Assessment, Management & Follow-up</h2>
        <p className="text-sm text-muted-foreground">
          Clinical synthesis, treatment changes, safety counselling, and follow-up plan.
        </p>
      </div>

      <FollowUpFormWrapper
        encounterId={encounterId}
        section="assessment_plan"
        schema={assessmentPlanSchema}
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
                <h3 className="text-sm font-semibold mb-3">Assessment <InfoTip content={tip("plan.assessment")} /></h3>
                <div className="space-y-4">
                  {topDiagnosis && (
                    <p className="text-sm text-muted-foreground">
                      Working diagnosis: {topDiagnosis.label} ({topDiagnosis.confidence} confidence)
                    </p>
                  )}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Diagnosis Status</Label>
                      <Select value={(v.diagnosis_status as string) || ""} onValueChange={(val) => set("diagnosis_status", val)}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="revised">Revised</SelectItem>
                          <SelectItem value="unchanged">Unchanged</SelectItem>
                          <SelectItem value="uncertain">Uncertain</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Overall Trend</Label>
                      <Select value={(v.trend_overall as string) || ""} onValueChange={(val) => set("trend_overall", val)}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="improving">Improving</SelectItem>
                          <SelectItem value="stable">Stable</SelectItem>
                          <SelectItem value="worsening">Worsening</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Assessment Summary</Label>
                    <Textarea
                      value={(v.assessment_summary as string) || ""}
                      onChange={(e) => set("assessment_summary", e.target.value)}
                      placeholder="Clinical summary tying together burden data, medication response, exam findings, and investigation results. State whether improving, stable, or worsening..."
                      className="min-h-[120px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3">Treatment Changes <InfoTip content={tip("plan.treatmentChanges")} /></h3>
                <Textarea
                  value={(v.treatment_changes as string) || ""}
                  onChange={(e) => set("treatment_changes", e.target.value)}
                  placeholder="Specific changes made today: dose adjustments, new prescriptions, stopped medications, referrals. Include dose, route, frequency, titration instructions..."
                  className="min-h-[100px]"
                />
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3">Safety Counselling <InfoTip content={tip("plan.safetyCounselling")} /></h3>
                <Textarea
                  value={(v.safety_counselling as string) || ""}
                  onChange={(e) => set("safety_counselling", e.target.value)}
                  placeholder="Emergency escalation advice (thunderclap headache, new focal neurology, visual loss), medication safety, driving/work implications..."
                  className="min-h-[100px]"
                />
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3">Follow-up Plan <InfoTip content={tip("plan.followUpPlan")} /></h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Follow-up Type</Label>
                      <Select value={(v.follow_up_type as string) || ""} onValueChange={(val) => set("follow_up_type", val)}>
                        <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="clinic">Clinic (face-to-face)</SelectItem>
                          <SelectItem value="virtual">Virtual</SelectItem>
                          <SelectItem value="gp_review">GP Review</SelectItem>
                          <SelectItem value="telephone">Telephone</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Responsible Clinician</Label>
                      <Input value={(v.follow_up_clinician as string) || ""} onChange={(e) => set("follow_up_clinician", e.target.value)} placeholder="Clinician or service name" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Follow-up Date</Label>
                      <Input type="date" value={(v.follow_up_date as string) || ""} onChange={(e) => set("follow_up_date", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Follow-up Time</Label>
                      <Input type="time" value={(v.follow_up_time as string) || ""} onChange={(e) => set("follow_up_time", e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Purpose of Follow-up</Label>
                    <Input value={(v.follow_up_purpose as string) || ""} onChange={(e) => set("follow_up_purpose", e.target.value)} placeholder="e.g. Review preventive response at 3 months" />
                  </div>
                  <ToggleField
                    label="Discharge from clinic"
                    description="If discharging, specify re-referral criteria below"
                    checked={!!v.discharge}
                    onCheckedChange={(c) => set("discharge", c)}
                  />
                  {v.discharge && (
                    <div className="space-y-2">
                      <Label>Discharge / Re-referral Criteria</Label>
                      <Textarea
                        value={(v.discharge_criteria as string) || ""}
                        onChange={(e) => set("discharge_criteria", e.target.value)}
                        placeholder="GP can re-refer if..."
                        className="min-h-[60px]"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        }}
      </FollowUpFormWrapper>

      <div className="flex justify-end mt-6">
        <Button onClick={() => router.push(`/encounters/${encounterId}/fu-letter`)}>
          Proceed to Follow-up Letter
        </Button>
      </div>
    </div>
  );
}
