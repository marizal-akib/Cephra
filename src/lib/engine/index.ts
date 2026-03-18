import type { DiagnosticInput, DiagnosticOutput } from "./types";
import { evaluateRedFlags } from "./red-flags";
import { scoreRuleSet } from "./scorer";
import { deriveSuggestedWorkup } from "./workup";
import { migraineWithoutAura } from "./rules/migraine-without-aura";
import { migraineWithAura } from "./rules/migraine-with-aura";
import { tensionType } from "./rules/tension-type";
import { cluster } from "./rules/cluster";
import { medicationOveruse } from "./rules/medication-overuse";
import { chronicMigraine } from "./rules/chronic-migraine";

const ALL_RULE_SETS = [
  migraineWithoutAura,
  migraineWithAura,
  tensionType,
  cluster,
  medicationOveruse,
  chronicMigraine,
];

export function runDiagnosticEngine(
  input: DiagnosticInput
): DiagnosticOutput {
  const redFlagResult = evaluateRedFlags(input);

  const phenotypes = ALL_RULE_SETS.map((rs) => scoreRuleSet(rs, input))
    .filter((r): r is NonNullable<typeof r> => r !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const suggestedWorkup = deriveSuggestedWorkup(redFlagResult, phenotypes);

  return {
    redFlagResult,
    phenotypes,
    suggestedWorkup,
    engineVersion: "1.0.0",
  };
}

export { type DiagnosticInput, type DiagnosticOutput } from "./types";
