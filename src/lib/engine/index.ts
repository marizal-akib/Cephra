import type { DiagnosticInput, DiagnosticOutput, PhenotypeResult } from "./types";
import { evaluateRedFlags } from "./red-flags";
import { scoreRuleSet } from "./scorer";
import { deriveSuggestedWorkup } from "./workup";
import { migraineWithoutAura } from "./rules/migraine-without-aura";
import { migraineWithAura } from "./rules/migraine-with-aura";
import { tensionType } from "./rules/tension-type";
import { cluster } from "./rules/cluster";
import { medicationOveruse } from "./rules/medication-overuse";
import { chronicMigraine } from "./rules/chronic-migraine";
import { paroxysmalHemicrania } from "./rules/paroxysmal-hemicrania";
import { hemicraniaContinua } from "./rules/hemicrania-continua";
import { sunct } from "./rules/sunct";
import { suna } from "./rules/suna";
import { giantCellArteritis } from "./rules/giant-cell-arteritis";
import { iih } from "./rules/iih";
import { sah } from "./rules/sah";
import { meningitis } from "./rules/meningitis";
import { cvst } from "./rules/cvst";

const ALL_RULE_SETS = [
  // Primary headache phenotypes
  migraineWithoutAura,
  migraineWithAura,
  tensionType,
  cluster,
  medicationOveruse,
  chronicMigraine,
  paroxysmalHemicrania,
  hemicraniaContinua,
  sunct,
  suna,
  // Secondary causes — surfaced in a separate alert track
  giantCellArteritis,
  iih,
  sah,
  meningitis,
  cvst,
];

export function runDiagnosticEngine(
  input: DiagnosticInput
): DiagnosticOutput {
  const redFlagResult = evaluateRedFlags(input);

  const scored = ALL_RULE_SETS.map((rs) => scoreRuleSet(rs, input)).filter(
    (r): r is PhenotypeResult => r !== null
  );

  const phenotypes = scored
    .filter((r) => r.category === "primary")
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const secondaryAlerts = scored
    .filter((r) => r.category === "secondary" && r.score >= 50)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const suggestedWorkup = deriveSuggestedWorkup(redFlagResult, phenotypes);

  return {
    redFlagResult,
    phenotypes,
    secondaryAlerts,
    suggestedWorkup,
    engineVersion: "2.0.0",
  };
}

export { type DiagnosticInput, type DiagnosticOutput } from "./types";
