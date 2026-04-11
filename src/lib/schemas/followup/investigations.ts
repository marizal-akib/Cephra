import { z } from "zod/v4";

export const INVESTIGATION_NAME_OPTIONS = [
  "FBC", "U&E", "CRP", "ESR", "LFT", "Bone panel", "Lipid profile",
  "HbA1C", "ANA", "ANCA", "Complement", "D Dimer", "Autoantibodies",
  "CT head", "CT carotid angiogram", "MRI Brain", "MRA", "CT Others", "Others",
] as const;

export const INVESTIGATION_RESULT_OPTIONS = [
  "Normal", "Abnormal", "Pending",
] as const;

const investigationResultSchema = z.object({
  name: z.string(),
  result: z.string(),
  interpretation: z.string(),
  nameSpecify: z.string().optional(),
  abnormalDetails: z.string().optional(),
});

export const investigationsSchema = z.object({
  // Results reviewed since last consultation
  results: z.array(investigationResultSchema).optional(),

  // Clinical summary of pasted raw lab/imaging results
  rawResultsSummary: z.string().optional(),

  // Pending investigations
  pending: z.string().optional(),

  // Notes
  notes: z.string().optional(),
});

export type InvestigationsFormData = z.infer<typeof investigationsSchema>;
export type InvestigationResult = z.infer<typeof investigationResultSchema>;
