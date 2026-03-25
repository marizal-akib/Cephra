"use client";

import { useEffect, useCallback, useRef, useMemo, useState } from "react";
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
  // Guard against resetting when our own onDataChange data round-trips through the parent
  const defaultValuesKey = JSON.stringify(defaultValues);
  const prevDefaultValuesKeyRef = useRef(defaultValuesKey);
  const stableDataRef = useRef<Record<string, unknown>>(defaultValues);
  useEffect(() => {
    if (prevDefaultValuesKeyRef.current !== defaultValuesKey) {
      prevDefaultValuesKeyRef.current = defaultValuesKey;
      // Only reset if the incoming defaults actually differ from current form data
      if (JSON.stringify(stableDataRef.current) !== defaultValuesKey) {
        form.reset(defaultValues);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValuesKey, form]);

  // ── Autosave ──
  // Use a debounced data signal to trigger the autosave timer.
  // updateData keeps the save ref fresh immediately so saveNow always has latest data.
  const [autosaveData, setAutosaveData] = useState<Record<string, unknown>>(defaultValues);

  const { saving, lastSaved, saveNow, updateData } = useAutosave({
    encounterId,
    section,
    data: autosaveData,
  });

  // ── Subscription-based form watching ──
  // form.watch(callback) does NOT cause re-renders of this wrapper.
  // Only the child form component (which has its own form.watch()) re-renders per keystroke.
  const onDataChangeRef = useRef(onDataChange);
  onDataChangeRef.current = onDataChange;
  const propagateTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const sub = form.watch((formData) => {
      const data = formData as Record<string, unknown>;
      stableDataRef.current = data;
      updateData(data); // keep autosave data ref fresh immediately
      // Debounce parent notification + autosave trigger to avoid per-keystroke
      // re-renders of the layout (which would re-run the diagnostic engine)
      if (propagateTimerRef.current) clearTimeout(propagateTimerRef.current);
      propagateTimerRef.current = setTimeout(() => {
        onDataChangeRef.current?.(stableDataRef.current);
        setAutosaveData(stableDataRef.current);
      }, 300);
    });
    return () => {
      sub.unsubscribe();
      if (propagateTimerRef.current) clearTimeout(propagateTimerRef.current);
    };
  }, [form, updateData]);

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

  // Flush pending propagation before navigation saves
  const flushAndSave = useCallback(async () => {
    if (propagateTimerRef.current) {
      clearTimeout(propagateTimerRef.current);
      propagateTimerRef.current = null;
      onDataChangeRef.current?.(stableDataRef.current);
    }
    await saveNow();
  }, [saveNow]);

  const handleBack = useCallback(async () => {
    await flushAndSave();
    if (prevStep) {
      router.push(`/encounters/${encounterId}/${prevStep.path}`);
    }
  }, [flushAndSave, prevStep, router, encounterId]);

  const handleNext = useCallback(async () => {
    await flushAndSave();
    if (nextStep) {
      router.push(`/encounters/${encounterId}/${nextStep.path}`);
    }
  }, [flushAndSave, nextStep, router, encounterId]);

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
          <Button variant="outline" onClick={flushAndSave} disabled={saving}>
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
