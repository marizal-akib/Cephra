import { z } from "zod/v4";

export const symptomsSchema = z.object({
  nausea: z.boolean().optional(),
  vomiting: z.boolean().optional(),
  photophobia: z.boolean().optional(),
  phonophobia: z.boolean().optional(),
  osmophobia: z.boolean().optional(),
  motion_sensitivity: z.boolean().optional(),
  dizziness: z.boolean().optional(),
  fatigue: z.boolean().optional(),
  neck_pain: z.boolean().optional(),
  associated_symptoms_notes: z.string().optional(),
});

export type SymptomsFormData = z.infer<typeof symptomsSchema>;
