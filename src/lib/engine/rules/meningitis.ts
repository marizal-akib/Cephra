import type { RuleSet, DiagnosticInput } from "../types";
import { bool, hasFinding } from "../helpers";

export const meningitis: RuleSet = {
  diagnosis: "meningitis",
  label: "Meningitis",
  category: "secondary",

  requiredAll: (i: DiagnosticInput) => [
    {
      met: bool(i.redFlags.fever) || bool(i.redFlags.neck_stiffness),
      detail: "Fever or neck stiffness",
      missing:
        i.redFlags.fever == null && i.redFlags.neck_stiffness == null,
    },
  ],

  supportingAny: (i: DiagnosticInput) => [
    {
      met: bool(i.redFlags.fever) && bool(i.redFlags.neck_stiffness),
      detail: "Fever AND neck stiffness (classic meningismus)",
      weight: 15,
    },
    {
      met: bool(i.redFlags.confusion),
      detail: "Altered consciousness",
      weight: 10,
    },
    {
      met: bool(i.symptoms.photophobia),
      detail: "Photophobia",
      weight: 5,
    },
    {
      met: hasFinding(i, "LP / CSF", "pleocytosis"),
      detail: "CSF pleocytosis",
      weight: 15,
    },
    {
      met: bool(i.redFlags.immunosuppression),
      detail: "Immunosuppression",
      weight: 5,
    },
    {
      met: bool(i.redFlags.seizure),
      detail: "Seizure",
      weight: 5,
    },
  ],

  downgradeIfAny: () => [],

  hardExclusions: () => [],
};
