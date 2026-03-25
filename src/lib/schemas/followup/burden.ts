import { z } from "zod/v4";

export const burdenSchema = z.object({
  // Frequency
  headache_days_per_month: z.number().min(0).max(31).optional(),
  migraine_days_per_month: z.number().min(0).max(31).optional(),
  severe_days_per_month: z.number().min(0).max(31).optional(),
  attacks_per_month: z.number().min(0).optional(),
  attacks_per_day: z.number().min(0).optional(),

  // Severity
  avg_severity: z.number().min(0).max(10).optional(),
  worst_severity: z.number().min(0).max(10).optional(),

  // Duration
  typical_duration_hours: z.number().min(0).optional(),
  typical_duration_minutes: z.number().min(0).optional(),

  // Trend
  trend_direction: z.enum(["improving", "stable", "worsening"]).optional(),
  trend_notes: z.string().optional(),

  // Functional impact
  work_days_lost: z.number().min(0).optional(),
  disability_days: z.number().min(0).optional(),
  functional_impact_notes: z.string().optional(),

  // Aura (migraine-specific)
  aura_frequency_per_month: z.number().min(0).optional(),
  aura_type_changed: z.boolean().optional(),

  // Menstrual link (migraine-specific)
  menstrual_relationship: z.enum(["perimenstrual", "pure_menstrual", "no_link", "not_applicable"]).optional(),

  // Cluster-specific
  bout_start_date: z.string().optional(),
  bout_end_date: z.string().optional(),
  circadian_timing: z.string().optional(),

  // General notes
  notes: z.string().optional(),
});

export type BurdenFormData = z.infer<typeof burdenSchema>;
