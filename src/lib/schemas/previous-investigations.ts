import { z } from "zod/v4";

export const PREVIOUS_INVESTIGATION_NAME_OPTIONS = [
  "FBC", "U&E", "CRP", "ESR", "LFT", "Bone panel", "Lipid profile",
  "HbA1C", "ANA", "ANCA", "Complement", "D Dimer", "Autoantibodies",
  "LP / CSF",
  "CT head", "CT carotid angiogram", "MRI Brain", "MRA", "MRV", "CT Others", "Others",
] as const;

export const PREVIOUS_INVESTIGATION_RESULT_OPTIONS = [
  "Normal", "Abnormal", "Pending",
] as const;

export const INVESTIGATION_FLAG_OPTIONS = ["low", "normal", "high"] as const;

// Quantitative tests where the engine reads numericValue against thresholds.
// Form shows numeric + units inputs only for these names.
export const QUANTITATIVE_TESTS: Record<
  string,
  { units: string; highThreshold?: number; lowThreshold?: number }
> = {
  ESR: { units: "mm/hr", highThreshold: 50 },
  CRP: { units: "mg/L", highThreshold: 10 },
  Hb: { units: "g/dL", lowThreshold: 12 },
  "D Dimer": { units: "ng/mL", highThreshold: 500 },
  "LP / CSF": { units: "cm H2O", highThreshold: 25 },
};

// Structured findings the engine matches with hasFinding(). Free entry stays
// available via abnormalDetails when "Other / specify" is chosen.
export const STRUCTURED_FINDINGS: Record<string, string[]> = {
  "CT head": ["blood_on_ct", "mass_lesion", "hydrocephalus", "normal"],
  "MRI Brain": ["mass_lesion", "demyelination", "infarct", "thrombosis", "normal"],
  "MRA": ["aneurysm", "stenosis", "dissection", "normal"],
  "MRV": ["thrombosis_on_mrv", "normal"],
  "CT carotid angiogram": ["dissection", "stenosis", "occlusion", "normal"],
  "LP / CSF": ["xanthochromia", "pleocytosis", "elevated_protein", "normal"],
};

const previousInvestigationResultSchema = z.object({
  name: z.string(),
  result: z.string(),
  interpretation: z.string(),
  nameSpecify: z.string().optional(),
  abnormalDetails: z.string().optional(),
  numericValue: z.number().optional(),
  units: z.string().optional(),
  flag: z.enum(INVESTIGATION_FLAG_OPTIONS).optional(),
  finding: z.string().optional(),
});

export const previousInvestigationsSchema = z.object({
  // Investigations performed before this consultation
  results: z.array(previousInvestigationResultSchema).optional(),

  // Notes
  notes: z.string().optional(),
});

export type PreviousInvestigationsFormData = z.infer<typeof previousInvestigationsSchema>;
export type PreviousInvestigationResult = z.infer<typeof previousInvestigationResultSchema>;
