import { z } from "zod/v4";

export const pastMedicalHistorySchema = z.object({
  common_conditions: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

export type PastMedicalHistoryFormData = z.infer<typeof pastMedicalHistorySchema>;
