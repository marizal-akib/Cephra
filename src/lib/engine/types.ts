export type DiagnosisCode =
  | "migraine_without_aura"
  | "migraine_with_aura"
  | "tension_type"
  | "cluster"
  | "medication_overuse"
  | "chronic_migraine";

export type Confidence = "high" | "moderate" | "possible";

export interface RedFlagResult {
  flagged: boolean;
  flags: {
    code: string;
    description: string;
    severity: "urgent" | "high";
  }[];
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
}

export interface CriterionResult {
  met: boolean;
  detail: string;
  missing?: boolean; // true if unmet due to missing data rather than contradiction
}

export interface RuleSet {
  diagnosis: DiagnosisCode;
  label: string;
  requiredAll: (input: DiagnosticInput) => CriterionResult[];
  supportingAny: (input: DiagnosticInput) => (CriterionResult & { weight: number })[];
  downgradeIfAny: (input: DiagnosticInput) => CriterionResult[];
  hardExclusions: (input: DiagnosticInput) => CriterionResult[];
}

export interface PhenotypeResult {
  diagnosis: DiagnosisCode;
  label: string;
  confidence: Confidence;
  score: number;
  rationale: string[];
  contradictions: string[];
  missingData: string[];
}

export interface DiagnosticOutput {
  redFlagResult: RedFlagResult;
  phenotypes: PhenotypeResult[];
  suggestedWorkup: string[];
  engineVersion: string;
}
