"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Encounter, ClinicianAssessment, QuestionnaireResponse } from "@/types";

interface EncounterData {
  encounter: Encounter | null;
  assessment: ClinicianAssessment | null;
  questionnaireResponse: QuestionnaireResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useEncounter(encounterId: string): EncounterData {
  const supabase = useMemo(() => createClient(), []);
  const [encounter, setEncounter] = useState<Encounter | null>(null);
  const [assessment, setAssessment] = useState<ClinicianAssessment | null>(null);
  const [questionnaireResponse, setQuestionnaireResponse] =
    useState<QuestionnaireResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Stale-request guard: tracks the current fetch generation
  const fetchGenRef = useRef(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const generation = ++fetchGenRef.current;

    try {
      const [encRes, assessRes, qRes] = await Promise.all([
        supabase
          .from("encounters")
          .select("*, patient:patients(*)")
          .eq("id", encounterId)
          .single(),
        supabase
          .from("clinician_assessments")
          .select("*")
          .eq("encounter_id", encounterId)
          .maybeSingle(),
        supabase
          .from("questionnaire_responses")
          .select("*")
          .eq("encounter_id", encounterId)
          .eq("partial", false)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
      ]);

      // Discard if a newer fetch has started
      if (generation !== fetchGenRef.current) return;

      if (encRes.error) throw encRes.error;
      setEncounter(encRes.data as unknown as Encounter);
      setAssessment(assessRes.data as unknown as ClinicianAssessment);
      setQuestionnaireResponse(
        qRes.data as unknown as QuestionnaireResponse | null
      );
    } catch (err: unknown) {
      if (generation === fetchGenRef.current) {
        setError(err instanceof Error ? err.message : "Failed to load encounter");
      }
    } finally {
      if (generation === fetchGenRef.current) {
        setLoading(false);
      }
    }
  }, [encounterId, supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    encounter,
    assessment,
    questionnaireResponse,
    loading,
    error,
    refetch: fetchData,
  };
}
