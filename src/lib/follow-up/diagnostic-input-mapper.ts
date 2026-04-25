/**
 * Converts follow-up assessment data into the DiagnosticInput shape
 * expected by the diagnostic engine, so the engine can score phenotypes
 * during follow-up encounters.
 */

import type { DiagnosticInput, InvestigationResult } from "@/lib/engine/types";
import type { FollowUpAssessment } from "@/types";

export function followUpToDiagnosticInput(
  fuAssessment: FollowUpAssessment
): DiagnosticInput {
  const burden = fuAssessment.burden || {};
  const medReview = fuAssessment.medication_review || {};
  const exam = fuAssessment.examination || {};
  const redFlags = fuAssessment.red_flags || {};
  const investigations = fuAssessment.investigations || {};

  // Build red flags from the checklist items
  const redFlagMap: Record<string, boolean> = {};
  const flagItems = Array.isArray(redFlags.flags) ? redFlags.flags : [];
  for (const item of flagItems as { flag: string; present: boolean }[]) {
    if (item.flag && item.present) {
      redFlagMap[item.flag] = true;
    }
  }

  return {
    redFlags: redFlagMap,
    pattern: {
      headache_days_per_month: burden.headache_days_per_month,
      migraine_like_days_per_month: burden.migraine_days_per_month,
      severe_days_per_month: burden.severe_days_per_month,
      attacks_per_month: burden.attacks_per_month,
      attacks_per_day: burden.attacks_per_day,
      duration_hours: burden.typical_duration_hours,
      duration_minutes: burden.typical_duration_minutes,
    },
    pain: {
      avg_intensity: burden.avg_severity,
      peak_intensity: burden.worst_severity,
    },
    symptoms: {},
    aura: {
      // Map aura frequency to boolean flags for engine compatibility
      ...(typeof burden.aura_frequency_per_month === "number" &&
      burden.aura_frequency_per_month > 0
        ? { visual_positive: true }
        : {}),
    },
    autonomic: {
      ...(exam.autonomic_signs_present ? { lacrimation: true } : {}),
    },
    triggers: {},
    medications: {
      triptan_days_per_month: medReview.triptan_days_per_month,
      nsaid_days_per_month: medReview.nsaid_days_per_month,
      paracetamol_days_per_month: medReview.paracetamol_days_per_month,
      opioid_days_per_month: medReview.opioid_days_per_month,
      simple_analgesic_days_per_month: medReview.simple_analgesic_days_per_month,
      combination_analgesic_days_per_month: medReview.combination_analgesic_days_per_month,
      response_to_triptan: medReview.response_to_triptan,
      response_to_oxygen: medReview.response_to_oxygen,
      response_to_indomethacin: medReview.response_to_indomethacin,
    },
    clinicalExamination: {
      fundoscopy_status: exam.fundoscopy_status,
      fundoscopy_details: exam.fundoscopy_details,
    },
    previousInvestigations: Array.isArray(
      (investigations as { results?: unknown }).results
    )
      ? {
          results: (investigations as { results: InvestigationResult[] }).results,
        }
      : undefined,
  };
}
