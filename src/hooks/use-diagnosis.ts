"use client";

import { useMemo } from "react";
import { runDiagnosticEngine } from "@/lib/engine";
import type { DiagnosticInput, DiagnosticOutput } from "@/lib/engine/types";
import type { ClinicianAssessment, FollowUpAssessment } from "@/types";
import { followUpToDiagnosticInput } from "@/lib/follow-up/diagnostic-input-mapper";

export function useDiagnosis(
  assessment: ClinicianAssessment | null,
  followUpAssessment?: FollowUpAssessment | null
): DiagnosticOutput | null {
  return useMemo(() => {
    // Follow-up path
    if (followUpAssessment) {
      const input = followUpToDiagnosticInput(followUpAssessment);
      const hasData = Object.values(input).some((section) =>
        Object.values(section).some((v) => v != null)
      );
      if (!hasData) return null;
      return runDiagnosticEngine(input);
    }

    // Initial assessment path
    if (!assessment) return null;

    const input: DiagnosticInput = {
      redFlags: (assessment.red_flags || {}) as Record<string, boolean>,
      pattern: (assessment.pattern || {}) as Record<string, unknown>,
      pain: (assessment.pain || {}) as Record<string, unknown>,
      symptoms: (assessment.symptoms || {}) as Record<string, unknown>,
      aura: (assessment.aura || {}) as Record<string, unknown>,
      autonomic: (assessment.autonomic || {}) as Record<string, unknown>,
      triggers: (assessment.triggers || {}) as Record<string, unknown>,
      medications: (assessment.medications || {}) as Record<string, unknown>,
      clinicalExamination: (assessment.clinical_examination || {}) as Record<string, unknown>,
    };

    // Only run if at least some data exists
    const hasData = Object.values(input).some((section) =>
      Object.values(section).some((v) => v != null)
    );
    if (!hasData) return null;

    return runDiagnosticEngine(input);
  }, [assessment, followUpAssessment]);
}
