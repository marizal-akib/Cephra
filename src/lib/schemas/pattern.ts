import { z } from "zod/v4";

export const patternSchema = z.object({
  first_headache_age: z.number().optional(),
  current_pattern_start: z.string().optional(),
  gradual_onset: z.boolean().optional(),
  sudden_onset: z.boolean().optional(),
  time_to_peak_minutes: z.number().min(0).optional(),
  duration_hours: z.number().min(0).optional(),
  duration_minutes: z.number().min(0).optional(),
  headache_days_per_month: z.number().min(0).max(31).optional(),
  severe_days_per_month: z.number().min(0).max(31).optional(),
  migraine_like_days_per_month: z.number().min(0).max(31).optional(),
  attacks_per_day: z.number().min(0).optional(),
  attacks_per_month: z.number().min(0).optional(),
  pain_free_intervals: z.boolean().optional(),
  continuous_background_pain: z.boolean().optional(),
  change_from_baseline: z.boolean().optional(),
  pattern_duration_months: z.number().min(0).optional(),
  pre_existing_primary_headache: z.boolean().optional(),
  past_episodic_migraine: z.boolean().optional(),
  daily_or_near_daily: z.boolean().optional(),
  worsening_with_increased_meds: z.boolean().optional(),
  wakes_from_sleep: z.boolean().optional(),
});

export type PatternFormData = z.infer<typeof patternSchema>;
