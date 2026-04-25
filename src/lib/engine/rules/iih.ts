import type { RuleSet, DiagnosticInput } from "../types";
import {
  bool,
  num,
  isAbnormalHigh,
  pickInvestigation,
  isFemale,
  ageAtLeast,
  ageBelow,
} from "../helpers";

export const iih: RuleSet = {
  diagnosis: "iih",
  label: "Idiopathic Intracranial Hypertension",
  category: "secondary",

  requiredAll: (i: DiagnosticInput) => [
    {
      // Daily / chronic pattern OR papilloedema-suggesting symptoms.
      met:
        num(i.pattern.headache_days_per_month) >= 15 ||
        bool(i.redFlags.papilloedema_symptoms),
      detail: "Chronic/daily headache or features of raised ICP",
      missing:
        i.pattern.headache_days_per_month == null &&
        i.redFlags.papilloedema_symptoms == null,
    },
  ],

  supportingAny: (i: DiagnosticInput) => {
    const lp = pickInvestigation(i, "LP / CSF");
    return [
      {
        met: isAbnormalHigh(i, "LP / CSF"),
        detail:
          typeof lp?.numericValue === "number"
            ? `LP opening pressure ${lp.numericValue} ${lp.units || "cm H2O"} (>25)`
            : "Raised LP opening pressure",
        weight: 20,
      },
      {
        met: bool(i.redFlags.papilloedema_symptoms),
        detail: "Visual obscurations / pulsatile tinnitus",
        weight: 10,
      },
      {
        met:
          bool(i.triggers.valsalva) ||
          bool(i.triggers.cough) ||
          bool(i.triggers.positional_worse_supine),
        detail: "Worse with Valsalva / cough / lying down",
        weight: 5,
      },
      {
        met: isFemale(i) && ageAtLeast(i, 18) && ageBelow(i, 50),
        detail: "Female of childbearing age",
        weight: 5,
      },
      {
        met: bool(i.clinicalExamination?.fundoscopy_status === "abnormal"),
        detail: "Abnormal fundoscopy",
        weight: 10,
      },
    ];
  },

  downgradeIfAny: () => [],

  hardExclusions: () => [],
};
