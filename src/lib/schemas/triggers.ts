import { z } from "zod/v4";

export const triggersSchema = z.object({
  alcohol: z.boolean().optional(),
  menstruation: z.boolean().optional(),
  sleep_deprivation: z.boolean().optional(),
  stress: z.boolean().optional(),
  missed_meals: z.boolean().optional(),
  exertion: z.boolean().optional(),
  cough: z.boolean().optional(),
  valsalva: z.boolean().optional(),
  positional_worse_upright: z.boolean().optional(),
  positional_worse_supine: z.boolean().optional(),
  triggers_notes: z.string().optional(),
});

export type TriggersFormData = z.infer<typeof triggersSchema>;
