import type {
  DiagnosticInput,
  RuleSet,
  PhenotypeResult,
  Confidence,
} from "./types";

export function scoreRuleSet(
  ruleSet: RuleSet,
  input: DiagnosticInput
): PhenotypeResult | null {
  // Check hard exclusions first
  const exclusions = ruleSet.hardExclusions(input);
  const activeExclusion = exclusions.find((e) => e.met);
  if (activeExclusion) return null;

  const required = ruleSet.requiredAll(input);
  const supporting = ruleSet.supportingAny(input);
  const downgrades = ruleSet.downgradeIfAny(input);

  const rationale: string[] = [];
  const contradictions: string[] = [];
  const missingData: string[] = [];

  // Evaluate required criteria
  const allRequiredMet = required.every((r) => r.met);
  const requiredMetCount = required.filter((r) => r.met).length;

  for (const r of required) {
    if (r.met) {
      rationale.push(r.detail);
    } else if (r.missing) {
      missingData.push(r.detail);
    } else {
      contradictions.push(`Not met: ${r.detail}`);
    }
  }

  // Base score: 60 if all required met, proportional otherwise
  // Guard against empty required array (division by zero)
  let score = allRequiredMet
    ? 60
    : required.length > 0
      ? Math.round((requiredMetCount / required.length) * 40)
      : 0;

  // Add supporting criteria
  for (const s of supporting) {
    if (s.met) {
      score += s.weight;
      rationale.push(s.detail);
    }
  }

  // Apply downgrades
  for (const d of downgrades) {
    if (d.met) {
      score -= 15;
      contradictions.push(d.detail);
    }
  }

  // Clamp score
  score = Math.max(0, Math.min(100, score));

  // Below threshold — exclude
  if (score < 25) return null;

  // Map to confidence
  let confidence: Confidence = "possible";
  if (score >= 75) confidence = "high";
  else if (score >= 50) confidence = "moderate";

  return {
    diagnosis: ruleSet.diagnosis,
    label: ruleSet.label,
    category: ruleSet.category,
    confidence,
    score,
    rationale,
    contradictions,
    missingData,
  };
}
