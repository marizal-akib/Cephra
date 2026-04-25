import type { RuleSet, DiagnosticInput } from "../types";
import {
  bool,
  ageAtLeast,
  isAbnormalHigh,
  pickInvestigation,
} from "../helpers";

export const giantCellArteritis: RuleSet = {
  diagnosis: "giant_cell_arteritis",
  label: "Giant Cell Arteritis",
  category: "secondary",

  requiredAll: (i: DiagnosticInput) => [
    {
      met: ageAtLeast(i, 50),
      detail: "Age >= 50 (GCA almost never below 50)",
      missing:
        i.demographics?.age == null && !i.redFlags.age_over_50_new_onset,
    },
    {
      // New-onset headache is the entry criterion. Use the existing
      // age_over_50_new_onset flag as the strongest signal; otherwise infer
      // from a recorded duration of weeks-to-months in the pattern section.
      met:
        bool(i.redFlags.age_over_50_new_onset) ||
        bool(i.pattern.new_onset),
      detail: "New-onset headache",
      missing:
        !i.redFlags.age_over_50_new_onset && i.pattern.new_onset == null,
    },
  ],

  supportingAny: (i: DiagnosticInput) => {
    const esr = pickInvestigation(i, "ESR");
    const crp = pickInvestigation(i, "CRP");
    return [
      {
        met: isAbnormalHigh(i, "ESR"),
        detail:
          typeof esr?.numericValue === "number"
            ? `ESR ${esr.numericValue} ${esr.units || "mm/hr"} (>50)`
            : "ESR elevated",
        weight: 15,
      },
      {
        met: isAbnormalHigh(i, "CRP"),
        detail:
          typeof crp?.numericValue === "number"
            ? `CRP ${crp.numericValue} ${crp.units || "mg/L"} (>10)`
            : "CRP elevated",
        weight: 10,
      },
      {
        met: bool(i.redFlags.jaw_claudication),
        detail: "Jaw claudication",
        weight: 10,
      },
      {
        met: bool(i.redFlags.scalp_tenderness),
        detail: "Scalp tenderness",
        weight: 5,
      },
      {
        met: bool(i.redFlags.visual_loss),
        detail: "Visual loss / amaurosis fugax",
        weight: 10,
      },
      {
        met: bool(i.clinicalExamination?.temporal_artery_tenderness),
        detail: "Temporal artery tenderness on exam",
        weight: 5,
      },
    ];
  },

  downgradeIfAny: () => [],

  hardExclusions: () => [],
};
