import type { RuleSet, DiagnosticInput } from "../types";
import { num, bool } from "../helpers";

export const hemicraniaContinua: RuleSet = {
  diagnosis: "hemicrania_continua",
  label: "Hemicrania Continua",

  requiredAll: (i: DiagnosticInput) => [
    {
      met: bool(i.pain.unilateral),
      detail: "Unilateral head pain without side-shift",
      missing: i.pain.unilateral == null,
    },
    {
      met: bool(i.pattern.continuous_background_pain) || i.pattern.pain_free_intervals === false,
      detail: "Continuous pain without pain-free periods",
      missing:
        i.pattern.continuous_background_pain == null &&
        i.pattern.pain_free_intervals == null,
    },
    {
      met: num(i.pattern.pattern_duration_months) >= 3,
      detail: "Duration ≥3 months without remission",
      missing: i.pattern.pattern_duration_months == null,
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
      met: bool(i.pain.restless_or_pacing),
      detail: "Restlessness or agitation during exacerbations",
      weight: 10,
    },
    {
      met: num(i.pain.peak_intensity) >= 5,
      detail: "Moderate-to-severe exacerbations",
      weight: 5,
    },
  ],

  downgradeIfAny: (i: DiagnosticInput) => [
    {
      met: bool(i.pain.bilateral),
      detail: "Bilateral pain pattern",
    },
    {
      met: bool(i.pattern.pain_free_intervals),
      detail: "Pain-free intervals present (argues against continuous pain)",
    },
  ],

  hardExclusions: () => [],
};
