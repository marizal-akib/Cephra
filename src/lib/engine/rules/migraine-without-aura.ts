import type { RuleSet, DiagnosticInput } from "../types";
import { num, bool } from "../helpers";

export const migraineWithoutAura: RuleSet = {
  diagnosis: "migraine_without_aura",
  label: "Migraine without Aura",
  category: "primary",

  requiredAll: (i: DiagnosticInput) => [
    {
      met: num(i.pattern.duration_hours) >= 4 && num(i.pattern.duration_hours) <= 72,
      detail: "Attack duration 4-72 hours",
      missing: i.pattern.duration_hours == null,
    },
    {
      met: num(i.pain.peak_intensity) >= 4,
      detail: "Moderate to severe intensity (>=4/10)",
      missing: i.pain.peak_intensity == null,
    },
    {
      met: bool(i.pain.worse_with_activity) || bool(i.pain.prefers_to_lie_still),
      detail: "Aggravated by or causes avoidance of routine physical activity",
      missing:
        i.pain.worse_with_activity == null && i.pain.prefers_to_lie_still == null,
    },
    {
      met:
        bool(i.symptoms.nausea) ||
        bool(i.symptoms.vomiting) ||
        (bool(i.symptoms.photophobia) && bool(i.symptoms.phonophobia)),
      detail: "Nausea/vomiting OR photophobia + phonophobia",
      missing:
        i.symptoms.nausea == null &&
        i.symptoms.vomiting == null &&
        i.symptoms.photophobia == null &&
        i.symptoms.phonophobia == null,
    },
  ],

  supportingAny: (i: DiagnosticInput) => [
    { met: bool(i.pain.unilateral), detail: "Unilateral pain", weight: 10 },
    { met: bool(i.pain.pulsating), detail: "Pulsating quality", weight: 10 },
    { met: bool(i.triggers.menstruation), detail: "Menstrual trigger", weight: 5 },
    { met: bool(i.triggers.stress), detail: "Stress trigger", weight: 5 },
  ],

  downgradeIfAny: (i: DiagnosticInput) => [
    {
      met: bool(i.autonomic.lacrimation) || bool(i.autonomic.conjunctival_injection),
      detail: "Prominent autonomic features (consider TAC)",
    },
    {
      met: bool(i.pain.continuous_background),
      detail: "Continuous background pain",
    },
  ],

  hardExclusions: (i: DiagnosticInput) => [
    {
      met: bool(i.aura.visual_positive) || bool(i.aura.sensory_positive),
      detail: "Aura present — reclassify as migraine with aura",
    },
  ],
};
