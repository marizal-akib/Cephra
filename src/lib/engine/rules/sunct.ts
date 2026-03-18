import type { RuleSet, DiagnosticInput } from "../types";
import { num, bool } from "../helpers";

export const sunct: RuleSet = {
  diagnosis: "sunct",
  label: "SUNCT",

  requiredAll: (i: DiagnosticInput) => [
    {
      met: bool(i.pain.unilateral),
      detail: "Unilateral head pain",
      missing: i.pain.unilateral == null,
    },
    {
      met: num(i.pattern.duration_minutes) >= 0 && num(i.pattern.duration_minutes) <= 10,
      detail: "Very short attack duration (1 second to 10 minutes)",
      missing: i.pattern.duration_minutes == null,
    },
    {
      met: num(i.pattern.attacks_per_day) >= 1,
      detail: "At least 1 attack per day",
      missing: i.pattern.attacks_per_day == null,
    },
    {
      met: bool(i.autonomic.conjunctival_injection) && bool(i.autonomic.lacrimation),
      detail: "Both conjunctival injection AND lacrimation (tearing)",
      missing:
        i.autonomic.conjunctival_injection == null &&
        i.autonomic.lacrimation == null,
    },
  ],

  supportingAny: (i: DiagnosticInput) => [
    {
      met: num(i.pattern.attacks_per_day) >= 5,
      detail: "High frequency (≥5 attacks/day)",
      weight: 10,
    },
    {
      met:
        bool(i.pain.orbital) ||
        bool(i.pain.supraorbital) ||
        bool(i.pain.temporal),
      detail: "Orbital/periorbital/temporal location",
      weight: 5,
    },
    {
      met: num(i.pain.peak_intensity) >= 7,
      detail: "Severe intensity",
      weight: 5,
    },
  ],

  downgradeIfAny: (i: DiagnosticInput) => [
    {
      met: bool(i.medications.response_to_indomethacin),
      detail: "Response to indomethacin (more typical of paroxysmal hemicrania)",
    },
    {
      met: bool(i.medications.response_to_oxygen),
      detail: "Response to oxygen (more typical of cluster)",
    },
  ],

  hardExclusions: () => [],
};
