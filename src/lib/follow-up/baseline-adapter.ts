/**
 * Extracts comparable baseline values from an initial encounter's
 * clinician assessment, so follow-up forms can display trend comparisons.
 */

import type { ClinicianAssessment } from "@/types";

export interface BaselineValues {
  // Burden comparison
  headache_days_per_month: number | null;
  migraine_days_per_month: number | null;
  severe_days_per_month: number | null;
  attacks_per_month: number | null;
  avg_severity: number | null;
  worst_severity: number | null;
  duration_hours: number | null;
  duration_minutes: number | null;

  // Medication comparison
  triptan_days_per_month: number | null;
  nsaid_days_per_month: number | null;
  paracetamol_days_per_month: number | null;
  opioid_days_per_month: number | null;
  simple_analgesic_days_per_month: number | null;
  combination_analgesic_days_per_month: number | null;
  current_preventive: string | null;
  medication_actions: MedicationBaseline[];

  // Diagnosis
  working_diagnosis: string | null;

  // Dates
  encounter_date: string | null;
}

interface MedicationBaseline {
  drug: string;
  type: string;
  dose: string;
  action: string;
}

function numOrNull(val: unknown): number | null {
  return typeof val === "number" ? val : null;
}

function strOrNull(val: unknown): string | null {
  return typeof val === "string" && val.trim() ? val.trim() : null;
}

export function extractBaseline(
  assessment: ClinicianAssessment,
  encounterDate?: string
): BaselineValues {
  const pattern = (assessment.pattern || {}) as Record<string, unknown>;
  const pain = (assessment.pain || {}) as Record<string, unknown>;
  const meds = (assessment.medications || {}) as Record<string, unknown>;

  const medActions = Array.isArray(meds.medication_actions)
    ? (meds.medication_actions as MedicationBaseline[]).filter((m) => m.drug)
    : [];

  return {
    headache_days_per_month: numOrNull(pattern.headache_days_per_month),
    migraine_days_per_month: numOrNull(pattern.migraine_like_days_per_month),
    severe_days_per_month: numOrNull(pattern.severe_days_per_month),
    attacks_per_month: numOrNull(pattern.attacks_per_month),
    avg_severity: numOrNull(pain.avg_intensity),
    worst_severity: numOrNull(pain.peak_intensity),
    duration_hours: numOrNull(pattern.duration_hours),
    duration_minutes: numOrNull(pattern.duration_minutes),

    triptan_days_per_month: numOrNull(meds.triptan_days_per_month),
    nsaid_days_per_month: numOrNull(meds.nsaid_days_per_month),
    paracetamol_days_per_month: numOrNull(meds.paracetamol_days_per_month),
    opioid_days_per_month: numOrNull(meds.opioid_days_per_month),
    simple_analgesic_days_per_month: numOrNull(meds.simple_analgesic_days_per_month),
    combination_analgesic_days_per_month: numOrNull(meds.combination_analgesic_days_per_month),
    current_preventive: strOrNull(meds.current_preventive),
    medication_actions: medActions,

    working_diagnosis: null, // filled by caller from diagnostic run if available
    encounter_date: encounterDate ?? null,
  };
}
