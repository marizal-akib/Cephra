"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type {
  Encounter,
  ClinicianAssessment,
  FollowUpAssessment,
  QuestionnaireResponse,
} from "@/types";
import { extractBaseline, type BaselineValues } from "@/lib/follow-up/baseline-adapter";

interface EncounterData {
  encounter: Encounter | null;
  assessment: ClinicianAssessment | null;
  followUpAssessment: FollowUpAssessment | null;
  baseline: BaselineValues | null;
  questionnaireResponse: QuestionnaireResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useEncounter(encounterId: string): EncounterData {
  const supabase = useMemo(() => createClient(), []);
  const [encounter, setEncounter] = useState<Encounter | null>(null);
  const [assessment, setAssessment] = useState<ClinicianAssessment | null>(null);
  const [followUpAssessment, setFollowUpAssessment] = useState<FollowUpAssessment | null>(null);
  const [baseline, setBaseline] = useState<BaselineValues | null>(null);
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
      // Always fetch encounter first to know the type
      const encRes = await supabase
        .from("encounters")
        .select("*, patient:patients(*)")
        .eq("id", encounterId)
        .single();

      if (generation !== fetchGenRef.current) return;
      if (encRes.error) throw encRes.error;

      const enc = encRes.data as unknown as Encounter;
      setEncounter(enc);

      if (enc.encounter_type === "follow_up") {
        // Fetch follow-up assessment + baseline from parent
        const [fuRes, baselineRes] = await Promise.all([
          supabase
            .from("follow_up_assessments")
            .select("*")
            .eq("encounter_id", encounterId)
            .maybeSingle(),
          enc.parent_encounter_id
            ? supabase
                .from("clinician_assessments")
                .select("*")
                .eq("encounter_id", enc.parent_encounter_id)
                .maybeSingle()
            : Promise.resolve({ data: null, error: null }),
        ]);

        if (generation !== fetchGenRef.current) return;

        setFollowUpAssessment(fuRes.data as unknown as FollowUpAssessment | null);
        setAssessment(null);
        setQuestionnaireResponse(null);

        // Extract baseline values from parent assessment
        if (baselineRes.data) {
          const parentAssessment = baselineRes.data as unknown as ClinicianAssessment;
          // Fetch parent encounter date for baseline comparison
          let parentDate: string | undefined;
          if (enc.parent_encounter_id) {
            const { data: parentEnc } = await supabase
              .from("encounters")
              .select("created_at")
              .eq("id", enc.parent_encounter_id)
              .single();
            if (generation !== fetchGenRef.current) return;
            parentDate = parentEnc?.created_at;
          }
          setBaseline(extractBaseline(parentAssessment, parentDate));
        } else {
          setBaseline(null);
        }
      } else {
        // Initial encounter — existing flow
        const [assessRes, qRes] = await Promise.all([
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

        if (generation !== fetchGenRef.current) return;

        setAssessment(assessRes.data as unknown as ClinicianAssessment);
        setQuestionnaireResponse(qRes.data as unknown as QuestionnaireResponse | null);
        setFollowUpAssessment(null);
        setBaseline(null);
      }
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
    followUpAssessment,
    baseline,
    questionnaireResponse,
    loading,
    error,
    refetch: fetchData,
  };
}
