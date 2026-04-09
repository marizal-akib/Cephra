import { z } from "zod/v4";

export const PREVIOUS_INVESTIGATION_NAME_OPTIONS = [
  "FBC", "U&E", "CRP", "ESR", "LFT", "Bone panel", "Lipid profile",
  "HbA1C", "ANA", "ANCA", "Complement", "D Dimer", "Autoantibodies",
  "CT head", "CT carotid angiogram", "MRI Brain", "MRA", "CT Others", "Others",
] as const;

export const PREVIOUS_INVESTIGATION_RESULT_OPTIONS = [
  "Normal", "Abnormal", "Pending",
] as const;

const previousInvestigationResultSchema = z.object({
  name: z.string(),
  result: z.string(),
  interpretation: z.string(),
  nameSpecify: z.string().optional(),
  abnormalDetails: z.string().optional(),
});

export const previousInvestigationsSchema = z.object({
  // Investigations performed before this consultation
  results: z.array(previousInvestigationResultSchema).optional(),

  // Notes
  notes: z.string().optional(),
});

export type PreviousInvestigationsFormData = z.infer<typeof previousInvestigationsSchema>;
export type PreviousInvestigationResult = z.infer<typeof previousInvestigationResultSchema>;
