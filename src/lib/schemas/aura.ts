import { z } from "zod/v4";

export const auraSchema = z.object({
  visual_positive: z.boolean().optional(),
  visual_negative: z.boolean().optional(),
  sensory_positive: z.boolean().optional(),
  sensory_negative: z.boolean().optional(),
  speech_disturbance: z.boolean().optional(),
  motor_weakness: z.boolean().optional(),
  diplopia: z.boolean().optional(),
  vertigo: z.boolean().optional(),
  aura_duration_minutes: z.number().min(0).optional(),
  aura_reversible: z.boolean().optional(),
  gradual_spread: z.boolean().optional(),
  headache_follows_aura: z.boolean().optional(),
});

export type AuraFormData = z.infer<typeof auraSchema>;
