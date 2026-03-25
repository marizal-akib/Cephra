"use client";

import { useCallback } from "react";
import { useEncounterContext } from "../layout";
import { FollowUpFormWrapper } from "@/components/encounter/followup-form-wrapper";
import { examinationSchema } from "@/lib/schemas/followup/examination";
import { NumberField } from "@/components/encounter/number-field";
import { ToggleField } from "@/components/encounter/toggle-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DictationTextarea as Textarea } from "@/components/ui/dictation-textarea";
import { InfoTip } from "@/components/ui/info-tip";
import { TOOLTIP } from "@/lib/follow-up/tooltip-content";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FuExaminationPage() {
  const { encounterId, followUpAssessment, baseline, updateFollowUpLocal, updateEncounterLocal } =
    useEncounterContext();

  const defaultValues = (followUpAssessment?.examination || {}) as Record<string, unknown>;

  const handleDataChange = useCallback(
    (data: Record<string, unknown>) => {
      updateFollowUpLocal("examination", data);
    },
    [updateFollowUpLocal]
  );

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Focused Clinical Examination <InfoTip content={TOOLTIP.examination.section} /></h2>
        <p className="text-sm text-muted-foreground">
          Perform a focused examination relevant to the diagnosis. Document changes from baseline.
        </p>
      </div>

      <FollowUpFormWrapper
        encounterId={encounterId}
        section="examination"
        schema={examinationSchema}
        defaultValues={defaultValues}
        onDataChange={handleDataChange}
        onEncounterStatusChange={updateEncounterLocal}
      >
        {(form) => {
          const v = form.watch();
          const set = (name: string, value: unknown) =>
            form.setValue(name as never, value as never, { shouldDirty: true });

          const examUnchanged = !!v.exam_unchanged;

          return (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold mb-3">General Observations <InfoTip content={TOOLTIP.examination.generalObservations} /></h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <NumberField label="BP Systolic" value={v.bp_systolic as number | undefined} onChange={(val) => set("bp_systolic", val)} min={60} max={300} unit="mmHg" />
                  <NumberField label="BP Diastolic" value={v.bp_diastolic as number | undefined} onChange={(val) => set("bp_diastolic", val)} min={30} max={200} unit="mmHg" />
                  <NumberField label="Heart Rate" value={v.heart_rate_bpm as number | undefined} onChange={(val) => set("heart_rate_bpm", val)} min={20} max={250} unit="bpm" />
                  <NumberField label="Weight" value={v.weight_kg as number | undefined} onChange={(val) => set("weight_kg", val)} min={1} max={400} unit="kg" />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3">Neurological Examination <InfoTip content={TOOLTIP.examination.neuroExam} /></h3>
                <ToggleField
                  label="Examination unchanged from baseline"
                  description={baseline?.encounter_date ? `From ${new Date(baseline.encounter_date).toLocaleDateString("en-GB")}` : undefined}
                  checked={examUnchanged}
                  onCheckedChange={(c) => {
                    set("exam_unchanged", c);
                    if (c && baseline?.encounter_date) {
                      set("exam_unchanged_date", baseline.encounter_date);
                    }
                  }}
                />

                {!examUnchanged && (
                  <div className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Neuro Status</Label>
                        <Select value={(v.neuro_status as string) || ""} onValueChange={(val) => set("neuro_status", val)}>
                          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="abnormal">Abnormal</SelectItem>
                            <SelectItem value="not_assessed">Not assessed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Fundoscopy</Label>
                        <Select value={(v.fundoscopy_status as string) || ""} onValueChange={(val) => set("fundoscopy_status", val)}>
                          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="abnormal">Abnormal</SelectItem>
                            <SelectItem value="not_assessed">Not assessed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    {v.neuro_status === "abnormal" && (
                      <div className="space-y-2">
                        <Label>Neuro Details</Label>
                        <Textarea value={(v.neuro_details as string) || ""} onChange={(e) => set("neuro_details", e.target.value)} placeholder="Describe abnormal findings..." className="min-h-[60px]" />
                      </div>
                    )}
                    {v.fundoscopy_status === "abnormal" && (
                      <div className="space-y-2">
                        <Label>Fundoscopy Details</Label>
                        <Textarea value={(v.fundoscopy_details as string) || ""} onChange={(e) => set("fundoscopy_details", e.target.value)} placeholder="Describe abnormal findings..." className="min-h-[60px]" />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3">Diagnosis-Specific Findings <InfoTip content={TOOLTIP.examination.diagnosisSpecific} /></h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Pericranial Tenderness</Label>
                    <Select value={(v.pericranial_tenderness as string) || ""} onValueChange={(val) => set("pericranial_tenderness", val)}>
                      <SelectTrigger><SelectValue placeholder="Select (if relevant)" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="absent">Absent</SelectItem>
                        <SelectItem value="mild">Mild</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="severe">Severe</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <ToggleField label="Autonomic signs present" checked={!!v.autonomic_signs_present} onCheckedChange={(c) => set("autonomic_signs_present", c)} />
                  {v.autonomic_signs_present && (
                    <div className="space-y-2">
                      <Label>Autonomic Details</Label>
                      <Input value={(v.autonomic_signs_details as string) || ""} onChange={(e) => set("autonomic_signs_details", e.target.value)} placeholder="e.g. lacrimation, ptosis, rhinorrhoea" />
                    </div>
                  )}
                  <ToggleField label="Headache reproduced by neck movement" checked={!!v.headache_reproduced_by_neck} onCheckedChange={(c) => set("headache_reproduced_by_neck", c)} />
                  <div className="space-y-2">
                    <Label>Cervical ROM / Neck Findings</Label>
                    <Input value={(v.cervical_rom as string) || ""} onChange={(e) => set("cervical_rom", e.target.value)} placeholder="e.g. Reduced rotation R, tender C2-3" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Examination Notes <InfoTip content={TOOLTIP.examination.examinationNotes} /></Label>
                <Textarea
                  value={(v.notes as string) || ""}
                  onChange={(e) => set("notes", e.target.value)}
                  placeholder="Additional examination findings..."
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
