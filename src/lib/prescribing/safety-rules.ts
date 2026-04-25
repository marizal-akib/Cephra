// Phase 2 — non-blocking, non-clinical safety rules.
// Maps to §9.8 (duplicate_therapy_check, medication_overuse_prescribing_gate)
// of the Headache Evaluation Tool Implementation Pack. Production deployment
// requires licensed dm+d, allergy/pregnancy reconciliation (Screen 19), and a
// DCB0129/0160 safety case — none of which this file provides.

import type { Prescription } from "@/lib/schemas/prescription";
import type { MedsFormData } from "@/lib/schemas/meds";

export type SoftWarning = {
  code:
    | "duplicate_within_list"
    | "medication_overuse_risk"
    | "moh_phenotype";
  severity: "info" | "warning";
  message: string;
};

function canonicalName(name?: string): string {
  return (name || "").trim().toLowerCase();
}

/**
 * Returns indexes of duplicate rows. The FIRST occurrence of a name is not
 * flagged; subsequent rows with the same canonical medication_name are.
 * Empty names are ignored. Pure function, no side effects.
 */
export function detectDuplicateRows(
  prescriptions: Prescription[]
): Map<number, SoftWarning> {
  const warnings = new Map<number, SoftWarning>();
  const firstSeen = new Map<string, number>();
  prescriptions.forEach((rx, idx) => {
    const key = canonicalName(rx.medication_name);
    if (!key) return;
    const prev = firstSeen.get(key);
    if (prev === undefined) {
      firstSeen.set(key, idx);
      return;
    }
    warnings.set(idx, {
      code: "duplicate_within_list",
      severity: "warning",
      message: `Duplicate medication — "${rx.medication_name}" already prescribed in row ${prev + 1}. Review before signing.`,
    });
  });
  return warnings;
}

/**
 * Returns a single MOH warning if the patient's recorded medication exposure
 * crosses standard medication-overuse-headache thresholds. Threshold logic is
 * intentionally simple and conservative — production needs licensed clinical
 * content. Returns null when no risk detected or when meds data is missing.
 */
export function detectMedicationOveruseRisk(
  meds: MedsFormData | null | undefined
): SoftWarning | null {
  if (!meds) return null;
  const triggers: string[] = [];
  if ((meds.triptan_days_per_month ?? 0) >= 10) {
    triggers.push(`triptan ${meds.triptan_days_per_month}/month`);
  }
  if ((meds.opioid_days_per_month ?? 0) >= 10) {
    triggers.push(`opioid ${meds.opioid_days_per_month}/month`);
  }
  if ((meds.combination_analgesic_days_per_month ?? 0) >= 10) {
    triggers.push(
      `combination analgesic ${meds.combination_analgesic_days_per_month}/month`
    );
  }
  if ((meds.simple_analgesic_days_per_month ?? 0) >= 15) {
    triggers.push(
      `simple analgesic ${meds.simple_analgesic_days_per_month}/month`
    );
  }
  if ((meds.nsaid_days_per_month ?? 0) >= 15) {
    triggers.push(`NSAID ${meds.nsaid_days_per_month}/month`);
  }
  if ((meds.paracetamol_days_per_month ?? 0) >= 15) {
    triggers.push(`paracetamol ${meds.paracetamol_days_per_month}/month`);
  }
  if (triggers.length === 0) return null;
  return {
    code: "medication_overuse_risk",
    severity: "warning",
    message: `Medication-overuse risk: ${triggers.join(", ")}. Counsel re: limit-setting before issuing further acute therapy.`,
  };
}

/**
 * MOH warning derived from the diagnostic phenotype list. Returns warning when
 * a medication-overuse-headache phenotype is present (label substring match —
 * we deliberately avoid coupling to internal phenotype keys).
 */
export function detectMedicationOveruseFromPhenotypes(
  phenotypeLabels: string[]
): SoftWarning | null {
  const hit = phenotypeLabels.some((label) =>
    /medication[-\s]?overuse/i.test(label)
  );
  if (!hit) return null;
  return {
    code: "moh_phenotype",
    severity: "warning",
    message:
      "Working diagnosis includes medication-overuse headache. Avoid issuing further acute therapy without an explicit withdrawal/limit-setting plan.",
  };
}
