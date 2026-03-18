"use client";

import { useMemo } from "react";
import { runDiagnosticEngine } from "@/lib/engine";
import type { DiagnosticInput, DiagnosticOutput } from "@/lib/engine/types";
import type { ClinicianAssessment } from "@/types";

export function useDiagnosis(
  assessment: ClinicianAssessment | null
): DiagnosticOutput | null {
  return useMemo(() => {
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
    };

    // Only run if at least some data exists
    const hasData = Object.values(input).some(
      (section) => Object.keys(section).length > 0
    );
    if (!hasData) return null;

    return runDiagnosticEngine(input);
  }, [assessment]);
}
