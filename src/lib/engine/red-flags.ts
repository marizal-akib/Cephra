import type { DiagnosticInput, RedFlagResult } from "./types";

interface RedFlagRule {
  code: string;
  description: string;
  severity: "urgent" | "high";
  check: (input: DiagnosticInput) => boolean;
}

const RED_FLAG_RULES: RedFlagRule[] = [
  {
    code: "thunderclap_onset",
    description: "Thunderclap onset (peak in <1 minute)",
    severity: "urgent",
    check: (i) => !!i.redFlags.thunderclap_onset,
  },
  {
    code: "new_focal_neurology",
    description: "New focal neurological deficit",
    severity: "urgent",
    check: (i) => !!i.redFlags.focal_deficit,
  },
  {
    code: "seizure_or_confusion",
    description: "Seizure or altered consciousness",
    severity: "urgent",
    check: (i) => !!i.redFlags.seizure || !!i.redFlags.confusion,
  },
  {
    code: "fever_or_systemic",
    description: "Fever, weight loss, or systemic illness",
    severity: "high",
    check: (i) => !!i.redFlags.fever || !!i.redFlags.weight_loss,
  },
  {
    code: "cancer_or_immunosuppression",
    description: "Active cancer or immunosuppression",
    severity: "high",
    check: (i) => !!i.redFlags.cancer_history || !!i.redFlags.immunosuppression,
  },
  {
    code: "pregnancy_postpartum",
    description: "New headache in pregnancy or postpartum",
    severity: "high",
    check: (i) => !!i.redFlags.pregnancy_new_headache || !!i.redFlags.postpartum_new_headache,
  },
  {
    code: "new_onset_over_50",
    description: "New-onset headache after age 50",
    severity: "high",
    check: (i) => !!i.redFlags.age_over_50_new_onset,
  },
  {
    code: "papilloedema",
    description: "Symptoms suggesting raised intracranial pressure",
    severity: "urgent",
    check: (i) => !!i.redFlags.papilloedema_symptoms,
  },
  {
    code: "trauma_anticoagulation",
    description: "Headache after trauma or on anticoagulation",
    severity: "high",
    check: (i) => !!i.redFlags.trauma || !!i.redFlags.anticoagulation,
  },
  {
    code: "gca_features",
    description: "Jaw claudication or scalp tenderness (GCA concern)",
    severity: "high",
    check: (i) => !!i.redFlags.jaw_claudication || !!i.redFlags.scalp_tenderness,
  },
  {
    code: "positional_cough",
    description: "Positional or cough/Valsalva-triggered headache",
    severity: "high",
    check: (i) =>
      !!i.triggers.positional_worse_upright ||
      !!i.triggers.positional_worse_supine ||
      !!i.triggers.cough ||
      !!i.triggers.valsalva,
  },
];

export function evaluateRedFlags(input: DiagnosticInput): RedFlagResult {
  const flags = RED_FLAG_RULES.filter((rule) => rule.check(input)).map(
    ({ code, description, severity }) => ({ code, description, severity })
  );

  return {
    flagged: flags.length > 0,
    flags,
  };
}
