import type { RuleSet, DiagnosticInput } from "../types";
import { num, bool } from "../helpers";

export const paroxysmalHemicrania: RuleSet = {
  diagnosis: "paroxysmal_hemicrania",
  label: "Paroxysmal Hemicrania",

  requiredAll: (i: DiagnosticInput) => [
    {
      met:
        bool(i.pain.unilateral) &&
        (bool(i.pain.orbital) ||
          bool(i.pain.supraorbital) ||
          bool(i.pain.temporal)),
      detail: "Strictly unilateral orbital, supraorbital, or temporal pain",
      missing: i.pain.unilateral == null,
    },
    {
      met: num(i.pattern.duration_minutes) >= 2 && num(i.pattern.duration_minutes) <= 30,
      detail: "Attack duration 2-30 minutes",
      missing: i.pattern.duration_minutes == null,
    },
    {
      met: num(i.pattern.attacks_per_day) >= 5,
      detail: "Frequency ≥5 attacks/day (at least in one period)",
      missing: i.pattern.attacks_per_day == null,
    },
    {
      met:
        bool(i.autonomic.lacrimation) ||
        bool(i.autonomic.conjunctival_injection) ||
        bool(i.autonomic.rhinorrhoea) ||
        bool(i.autonomic.nasal_congestion) ||
        bool(i.autonomic.ptosis) ||
        bool(i.autonomic.miosis) ||
        bool(i.autonomic.eyelid_oedema) ||
        bool(i.autonomic.facial_sweating),
      detail: "Ipsilateral cranial autonomic features",
      missing:
        i.autonomic.lacrimation == null &&
        i.autonomic.conjunctival_injection == null &&
        i.autonomic.rhinorrhoea == null,
    },
    {
      met: bool(i.medications.response_to_indomethacin),
      detail: "Absolute response to therapeutic doses of indomethacin",
      missing: i.medications.response_to_indomethacin == null,
    },
  ],

  supportingAny: (i: DiagnosticInput) => [
    {
      met: bool(i.pattern.wakes_from_sleep),
      detail: "Waking from sleep",
      weight: 10,
    },
    {
      met: num(i.pain.peak_intensity) >= 8,
      detail: "Severe intensity (≥8/10)",
      weight: 5,
    },
  ],

  downgradeIfAny: (i: DiagnosticInput) => [
    {
      met: bool(i.pain.bilateral),
      detail: "Bilateral pain pattern",
    },
    {
      met: bool(i.medications.response_to_oxygen),
      detail: "Response to oxygen (more typical of cluster)",
    },
  ],

  hardExclusions: () => [],
};
