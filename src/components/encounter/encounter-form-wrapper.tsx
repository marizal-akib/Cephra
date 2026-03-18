"use client";

import { useEffect, useCallback, useRef, useMemo } from "react";
import { useForm, type FieldValues, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useAutosave } from "@/hooks/use-autosave";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { ENCOUNTER_STEPS, SECTION_TO_STEP, type AssessmentSection, type Encounter } from "@/types";
import { ArrowLeft } from "lucide-react";

const STEP_KEYS = ENCOUNTER_STEPS.map((s) => s.key);

interface EncounterFormWrapperProps {
  encounterId: string;
  section: AssessmentSection;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: any;
  defaultValues: Record<string, unknown>;
  onDataChange?: (data: Record<string, unknown>) => void;
  onEncounterStatusChange?: (updates: Partial<Pick<Encounter, "status" | "current_step">>) => void;
  children: (form: UseFormReturn<FieldValues>) => React.ReactNode;
}

export function EncounterFormWrapper({
  encounterId,
  section,
  schema,
  defaultValues,
  onDataChange,
  onEncounterStatusChange,
  children,
}: EncounterFormWrapperProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // Sync form with defaultValues when assessment data loads after initial mount
  const defaultValuesKey = JSON.stringify(defaultValues);
  const prevDefaultValuesKeyRef = useRef(defaultValuesKey);
  useEffect(() => {
    if (prevDefaultValuesKeyRef.current !== defaultValuesKey) {
      prevDefaultValuesKeyRef.current = defaultValuesKey;
      form.reset(defaultValues);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValuesKey, form]);

  const watchedData = form.watch();

  // Stabilize watchedData to prevent infinite re-renders
  const prevDataRef = useRef<string>("");
  const stableDataRef = useRef<Record<string, unknown>>(watchedData as Record<string, unknown>);
  const serialized = JSON.stringify(watchedData);
  if (serialized !== prevDataRef.current) {
    prevDataRef.current = serialized;
    stableDataRef.current = watchedData as Record<string, unknown>;
  }

  const { saving, lastSaved, saveNow } = useAutosave({
    encounterId,
    section,
    data: stableDataRef.current,
  });

  useEffect(() => {
    onDataChange?.(stableDataRef.current);
  }, [serialized, onDataChange]);

  const currentStepKey = SECTION_TO_STEP[section as AssessmentSection] || section;
  const currentIdx = STEP_KEYS.indexOf(currentStepKey as (typeof STEP_KEYS)[number]);

  const prevStep =
    currentIdx > 0 ? ENCOUNTER_STEPS[currentIdx - 1] : null;
  const nextStep =
    currentIdx >= 0 && currentIdx < STEP_KEYS.length - 1
      ? ENCOUNTER_STEPS[currentIdx + 1]
      : null;

  // Mark encounter as in_progress when landing on an assessment step (beyond red-flags)
  const statusSyncedRef = useRef(false);
  useEffect(() => {
    if (statusSyncedRef.current || section === "red_flags") return;
    statusSyncedRef.current = true;

    const updates = { status: "in_progress" as const, current_step: currentStepKey };
    onEncounterStatusChange?.(updates);

    supabase
      .from("encounters")
      .update(updates)
      .eq("id", encounterId)
      .then();
  }, [encounterId, section, currentStepKey, supabase, onEncounterStatusChange]);

  const handleBack = useCallback(async () => {
    await saveNow();
    if (prevStep) {
      router.push(`/encounters/${encounterId}/${prevStep.path}`);
    }
  }, [saveNow, prevStep, router, encounterId]);

  const handleNext = useCallback(async () => {
    await saveNow();
    if (nextStep) {
      router.push(`/encounters/${encounterId}/${nextStep.path}`);
    }
  }, [saveNow, nextStep, router, encounterId, section, currentStepKey]);

  return (
    <div className="space-y-6">
      {children(form)}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
        <div className="flex min-w-[180px] items-center gap-3">
          {prevStep && (
            <Button variant="ghost" size="sm" onClick={handleBack} disabled={saving}>
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back: {prevStep.label}</span>
              <span className="sm:hidden">Back</span>
            </Button>
          )}
          <span className="text-xs text-muted-foreground">
            {saving
              ? "Saving..."
              : lastSaved
                ? `Saved ${lastSaved.toLocaleTimeString()}`
                : ""}
          </span>
        </div>
        <div className="ml-auto flex flex-wrap gap-2">
          <Button variant="outline" onClick={saveNow} disabled={saving}>
            Save
          </Button>
          {nextStep && (
            <Button onClick={handleNext}>
              <span className="hidden sm:inline">Next: {nextStep.label}</span>
              <span className="sm:hidden">Next</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
