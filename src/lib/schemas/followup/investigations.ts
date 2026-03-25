import { z } from "zod/v4";

const investigationResultSchema = z.object({
  name: z.string(),
  result: z.string(),
  interpretation: z.string(),
});

export const investigationsSchema = z.object({
  // Results reviewed since last consultation
  results: z.array(investigationResultSchema).optional(),

  // Pending investigations
  pending: z.string().optional(),

  // Notes
  notes: z.string().optional(),
});

export type InvestigationsFormData = z.infer<typeof investigationsSchema>;
export type InvestigationResult = z.infer<typeof investigationResultSchema>;
