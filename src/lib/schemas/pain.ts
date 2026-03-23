import { z } from "zod/v4";

export const painSchema = z.object({
  unilateral: z.boolean().optional(),
  bilateral: z.boolean().optional(),
  side_locked: z.boolean().optional(),
  alternating_sides: z.boolean().optional(),
  frontal: z.boolean().optional(),
  temporal: z.boolean().optional(),
  orbital: z.boolean().optional(),
  supraorbital: z.boolean().optional(),
  occipital: z.boolean().optional(),
  neck_predominant: z.boolean().optional(),
  generalized: z.boolean().optional(),
  unable_to_characterize: z.boolean().optional(),
  pulsating: z.boolean().optional(),
  pressing: z.boolean().optional(),
  tightening: z.boolean().optional(),
  stabbing: z.boolean().optional(),
  burning: z.boolean().optional(),
  boring: z.boolean().optional(),
  avg_intensity: z.number().min(0).max(10).optional(),
  peak_intensity: z.number().min(0).max(10).optional(),
  worse_with_activity: z.boolean().optional(),
  prefers_to_lie_still: z.boolean().optional(),
  restless_or_pacing: z.boolean().optional(),
  continuous_background: z.boolean().optional(),
  notes: z.string().optional(),
});

export type PainFormData = z.infer<typeof painSchema>;
