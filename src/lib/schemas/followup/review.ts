import { z } from "zod";

export const reviewSchema = z.object({
  clinic_type: z.string().optional(),
  key_question: z.string().optional(),
  diagnosis_notes: z.string().optional(),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;
