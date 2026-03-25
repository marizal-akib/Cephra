"use client";

import { useEffect, useRef, useCallback, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { AssessmentSection } from "@/types";

interface UseAutosaveOptions {
  encounterId: string;
  section: AssessmentSection;
  data: Record<string, unknown>;
  enabled?: boolean;
}

export function useAutosave({
  encounterId,
  section,
  data,
  enabled = true,
}: UseAutosaveOptions) {
  const supabase = useMemo(() => createClient(), []);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const dataRef = useRef(data);
  dataRef.current = data;

  // Imperatively update data ref (for callers using subscription-based watching)
  const updateData = useCallback((newData: Record<string, unknown>) => {
    dataRef.current = newData;
  }, []);

  const save = useCallback(async () => {
    if (!enabled) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("clinician_assessments")
        .update({ [section]: dataRef.current })
        .eq("encounter_id", encounterId);
      if (error) throw error;
      setLastSaved(new Date());
    } catch {
      toast.error("Auto-save failed. Please save manually before navigating away.");
    } finally {
      setSaving(false);
    }
  }, [encounterId, section, enabled, supabase]);

  // Debounced save on data change
  useEffect(() => {
    if (!enabled) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      save();
    }, 1500);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [data, save, enabled]);

  // Immediate save function for navigation
  const saveNow = useCallback(async () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    await save();
  }, [save]);

  return { saving, lastSaved, saveNow, updateData };
}
