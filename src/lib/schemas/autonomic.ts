import { z } from "zod/v4";

export const autonomicSchema = z.object({
  autonomic_features_na: z.boolean().optional(),
  lacrimation: z.boolean().optional(),
  conjunctival_injection: z.boolean().optional(),
  rhinorrhoea: z.boolean().optional(),
  nasal_congestion: z.boolean().optional(),
  ptosis: z.boolean().optional(),
  miosis: z.boolean().optional(),
  eyelid_oedema: z.boolean().optional(),
  facial_sweating: z.boolean().optional(),
  ear_fullness: z.boolean().optional(),
  notes: z.string().optional(),
});

export type AutonomicFormData = z.infer<typeof autonomicSchema>;
