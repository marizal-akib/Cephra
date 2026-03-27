import { z } from "zod/v4";

export const medsSchema = z.object({
  triptan_days_per_month: z.number().min(0).max(31).optional(),
  nsaid_days_per_month: z.number().min(0).max(31).optional(),
  paracetamol_days_per_month: z.number().min(0).max(31).optional(),
  opioid_days_per_month: z.number().min(0).max(31).optional(),
  simple_analgesic_days_per_month: z.number().min(0).max(31).optional(),
  combination_analgesic_days_per_month: z.number().min(0).max(31).optional(),
  response_to_triptan: z.boolean().optional(),
  response_to_oxygen: z.boolean().optional(),
  response_to_indomethacin: z.boolean().optional(),
  current_preventive: z.string().optional(),
  preventive_response: z.string().optional(),
  current_medications_text: z.string().optional(),
  medication_actions: z.array(z.object({
    drug: z.string(),
    type: z.enum(["preventive", "acute", "other"]),
    dose: z.string(),
    benefit: z.string(),
    benefit_detail: z.string().optional(),
    tolerability: z.string(),
    tolerability_detail: z.string().optional(),
    action: z.enum(["continue", "increase", "decrease", "stop", "add", "switch"]),
  })).optional(),
});

export type MedsFormData = z.infer<typeof medsSchema>;
