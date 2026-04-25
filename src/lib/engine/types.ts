export type DiagnosisCode =
  | "migraine_without_aura"
  | "migraine_with_aura"
  | "tension_type"
  | "cluster"
  | "medication_overuse"
  | "chronic_migraine"
  | "paroxysmal_hemicrania"
  | "hemicrania_continua"
  | "sunct"
  | "suna"
  | "giant_cell_arteritis"
  | "iih"
  | "sah"
  | "meningitis"
  | "cvst";

export type RuleCategory = "primary" | "secondary";

export type Confidence = "high" | "moderate" | "possible";

export interface RedFlagResult {
  flagged: boolean;
  flags: {
    code: string;
    description: string;
    severity: "urgent" | "high";
  }[];
}

// Plain structural shape of a previous investigation row, mirroring
// PreviousInvestigationResult in src/lib/schemas/previous-investigations.ts
// without dragging Zod into the engine bundle.
export interface InvestigationResult {
  name: string;
  result: string;
  interpretation?: string;
  nameSpecify?: string;
  abnormalDetails?: string;
  numericValue?: number;
  units?: string;
  flag?: "low" | "normal" | "high";
  finding?: string;
}

export interface DiagnosticInput {
  redFlags: Record<string, boolean>;
  pattern: Record<string, unknown>;
  pain: Record<string, unknown>;
  symptoms: Record<string, unknown>;
  aura: Record<string, unknown>;
  autonomic: Record<string, unknown>;
  triggers: Record<string, unknown>;
  medications: Record<string, unknown>;
  clinicalExamination?: Record<string, unknown>;
  previousInvestigations?: { results?: InvestigationResult[] };
  demographics?: { age?: number; sex?: "male" | "female" | "other" };
}

export interface CriterionResult {
  met: boolean;
  detail: string;
  missing?: boolean; // true if unmet due to missing data rather than contradiction
}

export interface RuleSet {
  diagnosis: DiagnosisCode;
  label: string;
  category: RuleCategory;
  requiredAll: (input: DiagnosticInput) => CriterionResult[];
  supportingAny: (input: DiagnosticInput) => (CriterionResult & { weight: number })[];
  downgradeIfAny: (input: DiagnosticInput) => CriterionResult[];
  hardExclusions: (input: DiagnosticInput) => CriterionResult[];
}

export interface PhenotypeResult {
  diagnosis: DiagnosisCode;
  label: string;
  category: RuleCategory;
  confidence: Confidence;
  score: number;
  rationale: string[];
  contradictions: string[];
  missingData: string[];
}

export interface DiagnosticOutput {
  redFlagResult: RedFlagResult;
  phenotypes: PhenotypeResult[];
  secondaryAlerts: PhenotypeResult[];
  suggestedWorkup: string[];
  engineVersion: string;
}
