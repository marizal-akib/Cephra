import type { RuleSet, DiagnosticInput } from "../types";
import { num, bool } from "../helpers";

export const cluster: RuleSet = {
  diagnosis: "cluster",
  label: "Cluster Headache",

  requiredAll: (i: DiagnosticInput) => [
    {
      met: bool(i.pain.unilateral) && (bool(i.pain.orbital) || bool(i.pain.supraorbital) || bool(i.pain.temporal)),
      detail: "Strictly unilateral orbital, supraorbital, or temporal pain",
      missing: i.pain.unilateral == null,
    },
    {
      met: num(i.pain.peak_intensity) >= 8,
      detail: "Very severe intensity (>=8/10)",
      missing: i.pain.peak_intensity == null,
    },
    {
      met: num(i.pattern.duration_minutes) >= 15 && num(i.pattern.duration_minutes) <= 180,
      detail: "Attack duration 15-180 minutes",
      missing: i.pattern.duration_minutes == null,
    },
    {
      met:
        bool(i.autonomic.lacrimation) ||
        bool(i.autonomic.conjunctival_injection) ||
        bool(i.autonomic.rhinorrhoea) ||
        bool(i.autonomic.nasal_congestion) ||
        bool(i.autonomic.ptosis) ||
        bool(i.autonomic.miosis) ||
        bool(i.pain.restless_or_pacing),
      detail: "Ipsilateral autonomic features OR restlessness/pacing",
      missing:
        i.autonomic.lacrimation == null &&
        i.autonomic.conjunctival_injection == null &&
        i.pain.restless_or_pacing == null,
    },
  ],

  supportingAny: (i: DiagnosticInput) => [
    { met: bool(i.pattern.wakes_from_sleep), detail: "Waking from sleep", weight: 10 },
    { met: bool(i.triggers.alcohol), detail: "Alcohol trigger", weight: 5 },
    { met: bool(i.medications.response_to_oxygen), detail: "Response to oxygen", weight: 15 },
  ],

  downgradeIfAny: (i: DiagnosticInput) => [
    {
      met: bool(i.pain.prefers_to_lie_still),
      detail: "Prefers to lie still (more typical of migraine)",
    },
    {
      met: bool(i.pain.bilateral),
      detail: "Bilateral pain pattern",
    },
  ],

  hardExclusions: () => [],
};
