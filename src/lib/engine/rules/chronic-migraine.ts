import type { RuleSet, DiagnosticInput } from "../types";
import { num, bool } from "../helpers";

export const chronicMigraine: RuleSet = {
  diagnosis: "chronic_migraine",
  label: "Chronic Migraine",
  category: "primary",

  requiredAll: (i: DiagnosticInput) => [
    {
      met: num(i.pattern.headache_days_per_month) >= 15,
      detail: "Headache on >=15 days/month",
      missing: i.pattern.headache_days_per_month == null,
    },
    {
      met: num(i.pattern.migraine_like_days_per_month) >= 8,
      detail: ">=8 days/month with migraine features",
      missing: i.pattern.migraine_like_days_per_month == null,
    },
    {
      met: num(i.pattern.pattern_duration_months) >= 3,
      detail: "Pattern present for >=3 months",
      missing: i.pattern.pattern_duration_months == null,
    },
  ],

  supportingAny: (i: DiagnosticInput) => [
    {
      met: bool(i.pattern.past_episodic_migraine),
      detail: "History of episodic migraine",
      weight: 10,
    },
    { met: bool(i.symptoms.photophobia), detail: "Photophobia", weight: 5 },
    { met: bool(i.symptoms.nausea), detail: "Nausea", weight: 5 },
    {
      met: bool(i.medications.response_to_triptan),
      detail: "Response to triptan",
      weight: 10,
    },
  ],

  downgradeIfAny: (i: DiagnosticInput) => [
    {
      met: bool(i.redFlags.thunderclap_onset),
      detail: "Red flags present — consider secondary cause",
    },
  ],

  hardExclusions: () => [],
};
