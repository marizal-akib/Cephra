import type { RuleSet, DiagnosticInput } from "../types";
import { num, bool } from "../helpers";

export const medicationOveruse: RuleSet = {
  diagnosis: "medication_overuse",
  label: "Medication-overuse Headache",

  requiredAll: (i: DiagnosticInput) => [
    {
      met: num(i.pattern.headache_days_per_month) >= 15,
      detail: "Headache on >=15 days/month",
      missing: i.pattern.headache_days_per_month == null,
    },
    {
      met: bool(i.pattern.pre_existing_primary_headache),
      detail: "Pre-existing primary headache disorder",
      missing: i.pattern.pre_existing_primary_headache == null,
    },
    {
      met:
        num(i.medications.triptan_days_per_month) >= 10 ||
        num(i.medications.opioid_days_per_month) >= 10 ||
        num(i.medications.combination_analgesic_days_per_month) >= 10 ||
        num(i.medications.simple_analgesic_days_per_month) >= 15,
      detail:
        "Regular overuse of acute medication (>=10 days/month triptans/opioids/combination, or >=15 days/month simple analgesics)",
      missing:
        i.medications.triptan_days_per_month == null &&
        i.medications.opioid_days_per_month == null &&
        i.medications.combination_analgesic_days_per_month == null &&
        i.medications.simple_analgesic_days_per_month == null,
    },
  ],

  supportingAny: (i: DiagnosticInput) => [
    {
      met: bool(i.pattern.daily_or_near_daily),
      detail: "Daily or near-daily headache pattern",
      weight: 10,
    },
    {
      met: bool(i.pattern.worsening_with_increased_meds),
      detail: "Worsening after escalating medication use",
      weight: 10,
    },
  ],

  downgradeIfAny: () => [],
  hardExclusions: () => [],
};
