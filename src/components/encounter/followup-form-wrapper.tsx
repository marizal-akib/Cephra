"use client";

import { useEffect, useCallback, useRef, useMemo, useState } from "react";
import { useForm, type FieldValues, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { FOLLOWUP_STEPS, type FollowUpSection, type Encounter } from "@/types";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const STEP_KEYS = FOLLOWUP_STEPS.map((s) => s.key);

interface FollowUpFormWrapperProps {
  encounterId: string;
  section: FollowUpSection;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: any;
  defaultValues: Record<string, unknown>;
  onDataChange?: (data: Record<string, unknown>) => void;
  onEncounterStatusChange?: (updates: Partial<Pick<Encounter, "status" | "current_step">>) => void;
  children: (form: UseFormReturn<FieldValues>) => React.ReactNode;
}

// Maps follow-up section keys to step keys for navigation
const SECTION_TO_STEP_KEY: Record<FollowUpSection, string> = {
  review: "review",
  burden: "burden",
  medication_review: "fu-medications",
  investigations: "fu-investigations",
  examination: "fu-examination",
  red_flags: "red-flag-review",
  assessment_plan: "fu-plan",
};

export function FollowUpFormWrapper({
  encounterId,
  section,
  schema,
  defaultValues,
  onDataChange,
  onEncounterStatusChange,
  children,
}: FollowUpFormWrapperProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // Sync form with defaultValues when data loads after initial mount
  const defaultValuesKey = JSON.stringify(defaultValues);
  const prevDefaultValuesKeyRef = useRef(defaultValuesKey);
  const stableDataRef = useRef<Record<string, unknown>>(defaultValues);
  useEffect(() => {
    if (prevDefaultValuesKeyRef.current !== defaultValuesKey) {
      prevDefaultValuesKeyRef.current = defaultValuesKey;
      if (JSON.stringify(stableDataRef.current) !== defaultValuesKey) {
        form.reset(defaultValues);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValuesKey, form]);

  // ── Autosave ──
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const savingRef = useRef(false);

  const save = useCallback(async () => {
    if (savingRef.current) return;
    savingRef.current = true;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("follow_up_assessments")
        .update({ [section]: stableDataRef.current })
        .eq("encounter_id", encounterId);
      if (error) throw error;
      setLastSaved(new Date());
    } catch {
      toast.error("Auto-save failed. Please save manually before navigating away.");
    } finally {
      setSaving(false);
      savingRef.current = false;
    }
  }, [encounterId, section, supabase]);

  // ── Subscription-based form watching ──
  const onDataChangeRef = useRef(onDataChange);
  onDataChangeRef.current = onDataChange;
  const propagateTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const sub = form.watch((formData) => {
      const data = formData as Record<string, unknown>;
      stableDataRef.current = data;
      if (propagateTimerRef.current) clearTimeout(propagateTimerRef.current);
      propagateTimerRef.current = setTimeout(() => {
        onDataChangeRef.current?.(stableDataRef.current);
        // Trigger debounced save
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(() => { save(); }, 1500);
      }, 300);
    });
    return () => {
      sub.unsubscribe();
      if (propagateTimerRef.current) clearTimeout(propagateTimerRef.current);
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [form, save]);

  const currentStepKey = SECTION_TO_STEP_KEY[section] || section;
  const currentIdx = STEP_KEYS.indexOf(currentStepKey as (typeof STEP_KEYS)[number]);

  const prevStep = currentIdx > 0 ? FOLLOWUP_STEPS[currentIdx - 1] : null;
  const nextStep =
    currentIdx >= 0 && currentIdx < STEP_KEYS.length - 1
      ? FOLLOWUP_STEPS[currentIdx + 1]
      : null;

  // Mark encounter as in_progress
  const statusSyncedRef = useRef(false);
  useEffect(() => {
    if (statusSyncedRef.current) return;
    statusSyncedRef.current = true;

    const updates = { status: "in_progress" as const, current_step: currentStepKey };
    onEncounterStatusChange?.(updates);

    supabase
      .from("encounters")
      .update(updates)
      .eq("id", encounterId)
      .then();
  }, [encounterId, currentStepKey, supabase, onEncounterStatusChange]);

  const flushAndSave = useCallback(async () => {
    if (propagateTimerRef.current) {
      clearTimeout(propagateTimerRef.current);
      propagateTimerRef.current = null;
      onDataChangeRef.current?.(stableDataRef.current);
    }
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
    await save();
  }, [save]);

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
