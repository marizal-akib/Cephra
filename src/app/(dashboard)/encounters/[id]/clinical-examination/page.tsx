"use client";

import { useCallback, useEffect } from "react";
import { useEncounterContext } from "../layout";
import { EncounterFormWrapper } from "@/components/encounter/encounter-form-wrapper";
import { clinicalExaminationSchema } from "@/lib/schemas/clinical-examination";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DictationTextarea as Textarea } from "@/components/ui/dictation-textarea";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UseFormReturn } from "react-hook-form";

// ── General examination items (Absent / Present / Not assessed) ──

const GENERAL_ITEMS = [
  { key: "anaemia", label: "Anaemia" },
  { key: "cyanosis", label: "Cyanosis" },
  { key: "lymphadenopathy", label: "Lymphadenopathy" },
  { key: "peripheral_oedema", label: "Peripheral Oedema" },
] as const;

// ── Neurological examination items (Normal / Abnormal / Not assessed) ──

const NEURO_ITEMS = [
  { statusKey: "gait_status", detailKey: "gait_details", label: "Gait" },
  { statusKey: "cranial_nerves_status", detailKey: "cranial_nerves_details", label: "Cranial Nerves" },
  { statusKey: "fundoscopy_status", detailKey: "fundoscopy_details", label: "Fundoscopy" },
  { statusKey: "motor_status", detailKey: "motor_details", label: "Motor" },
  { statusKey: "sensory_status", detailKey: "sensory_details", label: "Sensory" },
  { statusKey: "cerebellar_status", detailKey: "cerebellar_details", label: "Cerebellar" },
  { statusKey: "reflexes_status", detailKey: "reflexes_details", label: "Reflexes" },
] as const;

// ── Segmented button component ──

function SegmentedButtons({
  value,
  options,
  onChange,
}: {
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex rounded-lg border border-border overflow-hidden">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            "flex-1 px-3 py-1.5 text-xs font-medium transition-colors border-r last:border-r-0",
            value === opt.value
              ? opt.value === "present" || opt.value === "abnormal"
                ? "bg-amber-100 text-amber-900 border-amber-200"
                : opt.value === "not_assessed"
                  ? "bg-muted text-muted-foreground"
                  : "bg-primary/10 text-primary"
              : "bg-background text-muted-foreground hover:bg-muted/50"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ── Numeric input helper ──

function VitalInput({
  label,
  unit,
  value,
  onChange,
  placeholder,
  readOnly,
}: {
  label: string;
  unit: string;
  value: string | number;
  onChange?: (v: string) => void;
  placeholder?: string;
  readOnly?: boolean;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="flex items-center gap-1.5">
        <Input
          type="number"
          value={value === "" || value === undefined || value === null ? "" : value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
          className={cn("h-8 w-20 text-sm", readOnly && "bg-muted")}
        />
        {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
      </div>
    </div>
  );
}

// ── Main page ──

export default function ClinicalExaminationPage() {
  const { encounterId, assessment, updateAssessmentLocal, updateEncounterLocal } =
    useEncounterContext();

  const defaultValues = (assessment?.clinical_examination || {}) as Record<string, unknown>;

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
          Record general and neurological examination findings.
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
        {(form) => <ExamFormContent form={form} />}
      </EncounterFormWrapper>
    </div>
  );
}

// ── Form content (separated for cleaner hooks usage) ──

function ExamFormContent({ form }: { form: UseFormReturn<Record<string, unknown>> }) {
  const v = form.watch();
  const set = (name: string, value: unknown) =>
    form.setValue(name as never, value as never, { shouldDirty: true });

  // ── Auto-calculate BMI ──
  const weightKg = typeof v.weight_kg === "number" ? v.weight_kg : null;
  const heightCm = typeof v.height_cm === "number" ? v.height_cm : null;

  useEffect(() => {
    if (weightKg && heightCm && heightCm > 0) {
      const heightM = heightCm / 100;
      const bmi = Math.round((weightKg / (heightM * heightM)) * 10) / 10;
      if (v.bmi !== bmi) set("bmi", bmi);
    }
  }, [weightKg, heightCm]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Auto-calculate GCS Total ──
  const gcsEye = typeof v.gcs_eye === "number" ? v.gcs_eye : null;
  const gcsVerbal = typeof v.gcs_verbal === "number" ? v.gcs_verbal : null;
  const gcsMotor = typeof v.gcs_motor === "number" ? v.gcs_motor : null;

  useEffect(() => {
    if (gcsEye !== null && gcsVerbal !== null && gcsMotor !== null) {
      const total = gcsEye + gcsVerbal + gcsMotor;
      if (v.gcs_total !== total) set("gcs_total", total);
    }
  }, [gcsEye, gcsVerbal, gcsMotor]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Check for urgent abnormalities ──
  const hasUrgentAbnormality =
    (typeof v.gcs_total === "number" && v.gcs_total < 15) ||
    v.fundoscopy_status === "abnormal" ||
    v.motor_status === "abnormal" ||
    v.cranial_nerves_status === "abnormal" ||
    v.cerebellar_status === "abnormal";

  const hasAnyAbnormality =
    hasUrgentAbnormality ||
    v.gait_status === "abnormal" ||
    v.sensory_status === "abnormal";

  // ── Quick actions ──
  function normalAllGeneral() {
    for (const item of GENERAL_ITEMS) {
      set(item.key, "absent");
    }
  }

  function normalAllNeuro() {
    for (const item of NEURO_ITEMS) {
      set(item.statusKey, "normal");
      set(item.detailKey, "");
    }
  }

  return (
    <div className="space-y-6">
      {hasUrgentAbnormality && (
        <Alert className="border-red-500 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            High-risk neurological finding detected. Correlate urgently with
            clinical context and red-flag assessment.
          </AlertDescription>
        </Alert>
      )}

      {hasAnyAbnormality && !hasUrgentAbnormality && (
        <Alert className="border-amber-500 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            Abnormal neurological examination finding recorded. Review in
            context of overall assessment.
          </AlertDescription>
        </Alert>
      )}

      {/* ── General Examination ── */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">General Examination</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 gap-1.5 text-xs"
              onClick={normalAllGeneral}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Normal all
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status items */}
          <div className="space-y-3">
            {GENERAL_ITEMS.map((item) => (
              <div key={item.key} className="flex items-center justify-between gap-4">
                <Label className="text-sm font-medium w-40 shrink-0">
                  {item.label}
                </Label>
                <div className="w-64">
                  <SegmentedButtons
                    value={(v[item.key] as string) || ""}
                    options={[
                      { value: "absent", label: "Absent" },
                      { value: "present", label: "Present" },
                      { value: "not_assessed", label: "Not assessed" },
                    ]}
                    onChange={(val) => set(item.key, val)}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Observations / Vitals */}
          <div className="border-t pt-4">
            <Label className="text-sm font-medium text-muted-foreground mb-3 block">
              Observations
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3">
              <VitalInput
                label="Heart rate"
                unit="bpm"
                value={v.heart_rate_bpm as number ?? ""}
                onChange={(val) => set("heart_rate_bpm", val === "" ? "" : Number(val))}
                placeholder="78"
              />
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Blood pressure</Label>
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    value={v.bp_systolic === "" || v.bp_systolic == null ? "" : v.bp_systolic as number}
                    onChange={(e) => set("bp_systolic", e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="120"
                    className="h-8 w-16 text-sm"
                  />
                  <span className="text-xs text-muted-foreground">/</span>
                  <Input
                    type="number"
                    value={v.bp_diastolic === "" || v.bp_diastolic == null ? "" : v.bp_diastolic as number}
                    onChange={(e) => set("bp_diastolic", e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="80"
                    className="h-8 w-16 text-sm"
                  />
                  <span className="text-xs text-muted-foreground">mmHg</span>
                </div>
              </div>
              <VitalInput
                label="SpO2"
                unit="%"
                value={v.oxygen_saturation as number ?? ""}
                onChange={(val) => set("oxygen_saturation", val === "" ? "" : Number(val))}
                placeholder="98"
              />
              <VitalInput
                label="Temperature"
                unit={"\u00B0C"}
                value={v.temperature as number ?? ""}
                onChange={(val) => set("temperature", val === "" ? "" : Number(val))}
                placeholder="36.8"
              />
              <VitalInput
                label="Weight"
                unit="kg"
                value={v.weight_kg as number ?? ""}
                onChange={(val) => set("weight_kg", val === "" ? "" : Number(val))}
                placeholder="72"
              />
              <VitalInput
                label="Height"
                unit="cm"
                value={v.height_cm as number ?? ""}
                onChange={(val) => set("height_cm", val === "" ? "" : Number(val))}
                placeholder="170"
              />
              <VitalInput
                label="BMI"
                unit=""
                value={typeof v.bmi === "number" ? v.bmi : ""}
                readOnly
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Neurological Examination ── */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Neurological Examination</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 gap-1.5 text-xs"
              onClick={normalAllNeuro}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Normal all
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* GCS */}
          <div className="rounded-lg border p-3">
            <Label className="text-sm font-medium mb-2 block">
              Glasgow Coma Scale (GCS)
            </Label>
            <div className="flex flex-wrap items-end gap-4">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Eye (1-4)</Label>
                <Input
                  type="number"
                  min={1}
                  max={4}
                  value={v.gcs_eye === "" || v.gcs_eye == null ? "" : v.gcs_eye as number}
                  onChange={(e) => set("gcs_eye", e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="4"
                  className="h-8 w-16 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Verbal (1-5)</Label>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  value={v.gcs_verbal === "" || v.gcs_verbal == null ? "" : v.gcs_verbal as number}
                  onChange={(e) => set("gcs_verbal", e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="5"
                  className="h-8 w-16 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Motor (1-6)</Label>
                <Input
                  type="number"
                  min={1}
                  max={6}
                  value={v.gcs_motor === "" || v.gcs_motor == null ? "" : v.gcs_motor as number}
                  onChange={(e) => set("gcs_motor", e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="6"
                  className="h-8 w-16 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Total</Label>
                <div
                  className={cn(
                    "flex h-8 w-16 items-center justify-center rounded-md border bg-muted text-sm font-semibold",
                    typeof v.gcs_total === "number" && v.gcs_total < 15
                      ? "border-red-300 bg-red-50 text-red-700"
                      : ""
                  )}
                >
                  {typeof v.gcs_total === "number" ? `${v.gcs_total}/15` : "\u2014"}
                </div>
              </div>
            </div>
          </div>

          {/* Neuro domains */}
          <div className="space-y-3">
            {NEURO_ITEMS.map((item) => {
              const status = (v[item.statusKey] as string) || "";
              const details = (v[item.detailKey] as string) || "";
              const isAbnormal = status === "abnormal";

              return (
                <div key={item.statusKey} className="space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <Label className="text-sm font-medium w-40 shrink-0">
                      {item.label}
                    </Label>
                    <div className="w-64">
                      <SegmentedButtons
                        value={status}
                        options={[
                          { value: "normal", label: "Normal" },
                          { value: "abnormal", label: "Abnormal" },
                          { value: "not_assessed", label: "Not assessed" },
                        ]}
                        onChange={(val) => {
                          set(item.statusKey, val);
                          if (val !== "abnormal") set(item.detailKey, "");
                        }}
                      />
                    </div>
                  </div>
                  {isAbnormal && (
                    <div className="ml-0 sm:ml-44">
                      <Input
                        value={details}
                        onChange={(e) => set(item.detailKey, e.target.value)}
                        placeholder={`Brief ${item.label.toLowerCase()} findings...`}
                        className="h-8 text-sm"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* ── Additional Notes ── */}
      <div className="space-y-2">
        <Label>Additional Examination Notes</Label>
        <Textarea
          value={(v.notes as string) || ""}
          onChange={(e) => set("notes", e.target.value)}
          placeholder="Any additional clinical examination details..."
          className="min-h-[100px]"
        />
      </div>
    </div>
  );
}
