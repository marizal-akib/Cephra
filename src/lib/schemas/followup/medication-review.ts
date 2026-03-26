import { z } from "zod/v4";

const medicationEntrySchema = z.object({
  drug: z.string(),
  type: z.enum(["preventive", "acute", "other"]),
  dose: z.string(),
  benefit: z.string(),
  benefit_detail: z.string().optional(),
  tolerability: z.string(),
  tolerability_detail: z.string().optional(),
  action: z.enum(["continue", "increase", "decrease", "stop", "add", "switch"]),
  notes: z.string().optional(),
});

export const medicationReviewSchema = z.object({
  // Acute medication days/month
  triptan_days_per_month: z.number().min(0).max(31).optional(),
  nsaid_days_per_month: z.number().min(0).max(31).optional(),
  paracetamol_days_per_month: z.number().min(0).max(31).optional(),
  opioid_days_per_month: z.number().min(0).max(31).optional(),
  simple_analgesic_days_per_month: z.number().min(0).max(31).optional(),
  combination_analgesic_days_per_month: z.number().min(0).max(31).optional(),

  // Treatment response
  response_to_triptan: z.boolean().optional(),
  response_to_oxygen: z.boolean().optional(),
  response_to_indomethacin: z.boolean().optional(),

  // Structured medication table
  medications: z.array(medicationEntrySchema).optional(),

  // Free text
  medication_notes: z.string().optional(),
});

export type MedicationReviewFormData = z.infer<typeof medicationReviewSchema>;
export type MedicationEntry = z.infer<typeof medicationEntrySchema>;
