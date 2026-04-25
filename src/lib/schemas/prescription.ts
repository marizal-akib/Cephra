import { z } from "zod/v4";

// Dropdown option constants — follow followup/investigations.ts naming convention
export const FREQUENCY_OPTIONS = [
  "once daily",
  "twice daily",
  "three times daily",
  "four times daily",
  "every morning",
  "every night",
  "as required/PRN",
  "weekly",
  "custom",
] as const;

export const ROUTE_OPTIONS = [
  "oral",
  "sublingual",
  "topical",
  "inhaled",
  "nasal",
  "subcutaneous",
  "intramuscular",
  "intravenous",
  "rectal",
  "transdermal",
] as const;

export const DURATION_UNIT_OPTIONS = ["days", "weeks", "months", "ongoing"] as const;

export const CATEGORY_OPTIONS = ["acute", "preventive", "rescue", "prn"] as const;

export const BENEFIT_OPTIONS = [
  "no_benefit",
  "minimal",
  "moderate",
  "good",
  "excellent",
] as const;

export const TOLERABILITY_OPTIONS = [
  "not_tolerated",
  "poorly_tolerated",
  "acceptable",
  "well_tolerated",
] as const;

export const ACTION_OPTIONS = [
  "continue",
  "increase",
  "decrease",
  "stop",
  "switch",
] as const;

// Human-readable labels for dropdowns & letter output
export const BENEFIT_LABELS: Record<(typeof BENEFIT_OPTIONS)[number], string> = {
  no_benefit: "No benefit",
  minimal: "Minimal",
  moderate: "Moderate",
  good: "Good",
  excellent: "Excellent",
};

export const TOLERABILITY_LABELS: Record<(typeof TOLERABILITY_OPTIONS)[number], string> = {
  not_tolerated: "Not tolerated",
  poorly_tolerated: "Poorly tolerated",
  acceptable: "Acceptable",
  well_tolerated: "Well tolerated",
};

export const ACTION_LABELS: Record<(typeof ACTION_OPTIONS)[number], string> = {
  continue: "Continue",
  increase: "Increase dose",
  decrease: "Decrease dose",
  stop: "Stop",
  switch: "Switch",
};

export const CATEGORY_LABELS: Record<(typeof CATEGORY_OPTIONS)[number], string> = {
  acute: "Acute",
  preventive: "Preventive",
  rescue: "Rescue",
  prn: "PRN",
};

// Prescription record nested inside workup_data (initial) or assessment_plan (follow-up).
// All fields optional to let autosave persist partial entries without blocking zodResolver.
export const prescriptionSchema = z.object({
  id: z.string(),
  prescribed_at_encounter_id: z.string().optional(),
  medication_name: z.string().optional(),
  dosage: z.string().optional(),
  frequency: z.string().optional(),
  frequency_custom: z.string().optional(),
  route: z.string().optional(),
  duration_value: z.number().optional(),
  duration_unit: z.string().optional(),
  quantity: z.string().optional(),
  category: z.string().optional(),
  indication: z.string().optional(),
  special_instructions: z.string().optional(),
  prescriber_name: z.string().optional(),
  prescribed_date: z.string().optional(),
  // Lifecycle states. Original values (active|stopped|amended) preserved for
  // backward compatibility with rows persisted before Phase 3. New values
  // (draft|ready_to_sign|signed|cancelled|transmitted|superseded) follow
  // §9.6 of the Headache Evaluation Tool Implementation Pack.
  status: z
    .enum([
      "active",
      "stopped",
      "amended",
      "draft",
      "ready_to_sign",
      "signed",
      "cancelled",
      "transmitted",
      "superseded",
    ])
    .optional(),
  signed_by: z.string().optional(),
  signed_at: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type Prescription = z.infer<typeof prescriptionSchema>;

// Review of a previous-visit prescription. Lives only in follow_up_assessments.assessment_plan.
// previous_* fields are snapshotted once at first interaction so the letter generator never
// needs to cross-query another encounter.
export const prescriptionReviewSchema = z.object({
  prescription_id: z.string(),
  source_encounter_id: z.string().optional(),
  previous_medication_name: z.string().optional(),
  previous_dosage: z.string().optional(),
  previous_frequency: z.string().optional(),
  benefit: z.string().optional(),
  tolerability: z.string().optional(),
  action: z.string().optional(),
  stop_reason: z.string().optional(),
  new_dose: z.string().optional(),
  new_frequency: z.string().optional(),
});

export type PrescriptionReview = z.infer<typeof prescriptionReviewSchema>;
