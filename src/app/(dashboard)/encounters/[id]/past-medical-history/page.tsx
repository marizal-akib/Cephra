"use client";

import { useCallback, useMemo } from "react";
import { useEncounterContext } from "../layout";
import { EncounterFormWrapper } from "@/components/encounter/encounter-form-wrapper";
import { pastMedicalHistorySchema } from "@/lib/schemas/past-medical-history";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DictationTextarea as Textarea } from "@/components/ui/dictation-textarea";

const COMMON_CONDITIONS = [
  { value: "hypertension", label: "Hypertension" },
  { value: "diabetes", label: "Diabetes" },
  { value: "thyroid_disorder", label: "Thyroid disorder" },
  { value: "asthma_copd", label: "Asthma/COPD" },
  { value: "heart_disease", label: "Heart disease" },
  { value: "stroke_tia", label: "Stroke/TIA" },
  { value: "epilepsy_seizure_disorder", label: "Epilepsy/seizure disorder" },
  { value: "anxiety_depression", label: "Anxiety/depression" },
] as const;

export default function PastMedicalHistoryPage() {
  const {
    encounterId,
    assessment,
    questionnaireResponse,
    updateAssessmentLocal,
    updateEncounterLocal,
  } = useEncounterContext();

  const savedPastMedicalHistory = (assessment?.past_medical_history ||
    {}) as Record<string, unknown>;
  const savedNotes =
    typeof savedPastMedicalHistory.notes === "string"
      ? savedPastMedicalHistory.notes.trim()
      : "";
  const savedCommonConditions = Array.isArray(
    savedPastMedicalHistory.common_conditions
  )
    ? (savedPastMedicalHistory.common_conditions as string[]).filter(
        (item) => typeof item === "string" && item.length > 0
      )
    : [];
  const questionnaireCommonConditions = Array.isArray(
    questionnaireResponse?.responses?.past_medical_history_common
  )
    ? (questionnaireResponse?.responses?.past_medical_history_common as string[])
        .filter((item) => typeof item === "string" && item.length > 0)
    : [];
  const questionnaireNotes =
    typeof questionnaireResponse?.responses?.past_medical_history_notes ===
    "string"
      ? questionnaireResponse.responses.past_medical_history_notes.trim()
      : typeof questionnaireResponse?.responses?.past_medical_history === "string"
        ? questionnaireResponse.responses.past_medical_history.trim()
      : "";

  const showQuestionnairePrefill =
    savedCommonConditions.length === 0 &&
    savedNotes.length === 0 &&
    (questionnaireCommonConditions.length > 0 || questionnaireNotes.length > 0);

  const defaultValues = useMemo(
    () =>
      showQuestionnairePrefill
        ? {
            common_conditions: questionnaireCommonConditions,
            notes: questionnaireNotes,
          }
        : savedPastMedicalHistory,
    [
      questionnaireCommonConditions,
      questionnaireNotes,
      savedPastMedicalHistory,
      showQuestionnairePrefill,
    ]
  );

  const handleDataChange = useCallback(
    (data: Record<string, unknown>) => {
      updateAssessmentLocal("past_medical_history", data);
    },
    [updateAssessmentLocal]
  );

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Past Medical History</h2>
        <p className="text-sm text-muted-foreground">
          Document relevant medical background and comorbid conditions.
        </p>
        {showQuestionnairePrefill && (
          <p className="mt-2 text-xs text-blue-700">
            Pre-filled from patient questionnaire response.
          </p>
        )}
      </div>

      <EncounterFormWrapper
        encounterId={encounterId}
        section="past_medical_history"
        schema={pastMedicalHistorySchema}
        defaultValues={defaultValues}
        onDataChange={handleDataChange}
        onEncounterStatusChange={updateEncounterLocal}
      >
        {(form) => {
          const v = form.watch();
          const set = (name: string, value: unknown) =>
            form.setValue(name as never, value as never, { shouldDirty: true });
          const selectedConditions = Array.isArray(v.common_conditions)
            ? (v.common_conditions as string[])
            : [];

          const toggleCondition = (condition: string, checked: boolean) => {
            if (checked) {
              if (!selectedConditions.includes(condition)) {
                set("common_conditions", [...selectedConditions, condition]);
              }
              return;
            }
            set(
              "common_conditions",
              selectedConditions.filter((item) => item !== condition)
            );
          };

          return (
            <div className="space-y-6">
              <div className="space-y-3">
                <Label>Common Conditions</Label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {COMMON_CONDITIONS.map((condition) => (
                    <label
                      key={condition.value}
                      className="flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors hover:bg-muted/50"
                    >
                      <Checkbox
                        checked={selectedConditions.includes(condition.value)}
                        onCheckedChange={(checked) =>
                          toggleCondition(condition.value, checked === true)
                        }
                        className="mt-0.5"
                      />
                      <span className="text-sm font-medium">
                        {condition.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Other Medical History Notes</Label>
              <Textarea
                value={(v.notes as string) || ""}
                onChange={(e) => set("notes", e.target.value)}
                placeholder="e.g. Hypertension, diabetes, thyroid disease, prior neurological conditions..."
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
