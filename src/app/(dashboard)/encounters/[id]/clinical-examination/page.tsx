"use client";

import { useCallback, useState } from "react";
import { useEncounterContext } from "../layout";
import { EncounterFormWrapper } from "@/components/encounter/encounter-form-wrapper";
import { clinicalExaminationSchema } from "@/lib/schemas/clinical-examination";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle } from "lucide-react";

type ExamOption = { value: string; label: string };
type ExamGroupConfig = {
  key: string;
  noteKey: string;
  label: string;
  description: string;
  options: ExamOption[];
  abnormalValues: string[];
};

const EXAM_GROUPS: ExamGroupConfig[] = [
  {
    key: "general_status",
    noteKey: "general_status_note",
    label: "General Status",
    description: "Overall clinical appearance.",
    options: [
      { value: "well", label: "Well" },
      { value: "unwell", label: "Unwell" },
      { value: "not_done", label: "Not done" },
    ],
    abnormalValues: ["unwell"],
  },
  {
    key: "orientation",
    noteKey: "orientation_note",
    label: "Orientation",
    description: "Mental status / orientation check.",
    options: [
      { value: "normal", label: "Normal" },
      { value: "abnormal", label: "Abnormal" },
      { value: "not_done", label: "Not done" },
    ],
    abnormalValues: ["abnormal"],
  },
  {
    key: "cranial_nerves",
    noteKey: "cranial_nerves_note",
    label: "Cranial Nerves",
    description: "Gross cranial nerve examination.",
    options: [
      { value: "normal", label: "Normal" },
      { value: "abnormal", label: "Abnormal" },
      { value: "not_done", label: "Not done" },
    ],
    abnormalValues: ["abnormal"],
  },
  {
    key: "focal_neurology",
    noteKey: "focal_neurology_note",
    label: "Focal Neurology",
    description: "Any focal neurological deficit.",
    options: [
      { value: "absent", label: "Absent" },
      { value: "present", label: "Present" },
      { value: "not_done", label: "Not done" },
    ],
    abnormalValues: ["present"],
  },
  {
    key: "motor_sensory",
    noteKey: "motor_sensory_note",
    label: "Motor and Sensory",
    description: "Motor and sensory system overview.",
    options: [
      { value: "normal", label: "Normal" },
      { value: "abnormal", label: "Abnormal" },
      { value: "not_done", label: "Not done" },
    ],
    abnormalValues: ["abnormal"],
  },
  {
    key: "gait_cerebellar",
    noteKey: "gait_cerebellar_note",
    label: "Gait / Cerebellar",
    description: "Gait and cerebellar function.",
    options: [
      { value: "normal", label: "Normal" },
      { value: "abnormal", label: "Abnormal" },
      { value: "not_done", label: "Not done" },
    ],
    abnormalValues: ["abnormal"],
  },
  {
    key: "meningeal_signs",
    noteKey: "meningeal_signs_note",
    label: "Meningeal Signs",
    description: "Neck stiffness / meningeal irritation.",
    options: [
      { value: "absent", label: "Absent" },
      { value: "present", label: "Present" },
      { value: "not_done", label: "Not done" },
    ],
    abnormalValues: ["present"],
  },
  {
    key: "fundoscopy",
    noteKey: "fundoscopy_note",
    label: "Fundoscopy",
    description: "Optic disc/fundus assessment.",
    options: [
      { value: "normal", label: "Normal" },
      { value: "papilledema", label: "Papilledema" },
      { value: "abnormal_other", label: "Abnormal (other)" },
      { value: "not_done", label: "Not done" },
    ],
    abnormalValues: ["papilledema", "abnormal_other"],
  },
];

export default function ClinicalExaminationPage() {
  const { encounterId, assessment, updateAssessmentLocal, updateEncounterLocal } =
    useEncounterContext();
  const [manualOpenNotes, setManualOpenNotes] = useState<Record<string, boolean>>(
    {}
  );

  const defaultValues = (assessment?.clinical_examination ||
    {}) as Record<string, unknown>;

  const handleDataChange = useCallback(
    (data: Record<string, unknown>) => {
      updateAssessmentLocal("clinical_examination", data);
    },
    [updateAssessmentLocal]
  );

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Clinical Examination</h2>
        <p className="text-sm text-muted-foreground">
          Record key examination findings. This section is ready for future
          structured expansion.
        </p>
      </div>

      <EncounterFormWrapper
        encounterId={encounterId}
        section="clinical_examination"
        schema={clinicalExaminationSchema}
        defaultValues={defaultValues}
        onDataChange={handleDataChange}
        onEncounterStatusChange={updateEncounterLocal}
      >
        {(form) => {
          const v = form.watch();
          const set = (name: string, value: unknown) =>
            form.setValue(name as never, value as never, { shouldDirty: true });
          const hasUrgentAbnormality =
            v.focal_neurology === "present" ||
            v.meningeal_signs === "present" ||
            v.fundoscopy === "papilledema" ||
            v.fundoscopy === "abnormal_other";

          return (
            <div className="space-y-6">
              {hasUrgentAbnormality && (
                <Alert className="border-amber-500 bg-amber-50">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800">
                    Abnormal focal neurological findings, meningeal signs, or
                    fundoscopy changes detected. Correlate urgently with overall
                    assessment and red-flag context.
                  </AlertDescription>
                </Alert>
              )}

              {EXAM_GROUPS.map((group) => {
                const value =
                  typeof v[group.key] === "string" ? (v[group.key] as string) : "";
                const quickNote =
                  typeof v[group.noteKey] === "string"
                    ? (v[group.noteKey] as string)
                    : "";
                const autoShowNote = group.abnormalValues.includes(value);
                const showNote =
                  autoShowNote ||
                  manualOpenNotes[group.noteKey] === true ||
                  quickNote.trim().length > 0;

                return (
                  <div key={group.key} className="space-y-2 rounded-lg border p-4">
                    <div>
                      <Label className="text-sm font-semibold">{group.label}</Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        {group.description}
                      </p>
                    </div>

                    <RadioGroup
                      value={value}
                      onValueChange={(nextValue) => {
                        set(group.key, nextValue);
                        if (group.abnormalValues.includes(nextValue)) {
                          setManualOpenNotes((prev) => ({
                            ...prev,
                            [group.noteKey]: true,
                          }));
                        }
                      }}
                      className="grid grid-cols-1 gap-2 sm:grid-cols-2"
                    >
                      {group.options.map((option) => (
                        <label
                          key={option.value}
                          className="flex items-center gap-3 rounded-md border px-3 py-2 cursor-pointer hover:bg-muted/40"
                        >
                          <RadioGroupItem value={option.value} id={`${group.key}-${option.value}`} />
                          <span className="text-sm">{option.label}</span>
                        </label>
                      ))}
                    </RadioGroup>

                    {showNote ? (
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">
                          Quick note
                        </Label>
                        <Input
                          value={quickNote}
                          onChange={(e) => set(group.noteKey, e.target.value)}
                          placeholder="Quick note..."
                        />
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 px-0 text-xs text-muted-foreground"
                        onClick={() =>
                          setManualOpenNotes((prev) => ({
                            ...prev,
                            [group.noteKey]: true,
                          }))
                        }
                      >
                        Add quick note
                      </Button>
                    )}
                  </div>
                );
              })}

              <div className="space-y-2">
                <Label>Additional Examination Notes</Label>
                <Textarea
                  value={(v.notes as string) || ""}
                  onChange={(e) => set("notes", e.target.value)}
                  placeholder="Any additional clinical examination details..."
                  className="min-h-[140px]"
                />
              </div>
            </div>
          );
        }}
      </EncounterFormWrapper>
    </div>
  );
}
