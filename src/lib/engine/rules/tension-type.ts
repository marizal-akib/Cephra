import type { RuleSet, DiagnosticInput } from "../types";
import { num, bool } from "../helpers";

export const tensionType: RuleSet = {
  diagnosis: "tension_type",
  label: "Tension-type Headache",
  category: "primary",

  requiredAll: (i: DiagnosticInput) => [
    {
      met: bool(i.pain.bilateral),
      detail: "Bilateral location",
      missing: i.pain.bilateral == null,
    },
    {
      met: bool(i.pain.pressing) || bool(i.pain.tightening),
      detail: "Pressing or tightening (non-pulsating) quality",
      missing: i.pain.pressing == null && i.pain.tightening == null,
    },
    {
      met: num(i.pain.peak_intensity) <= 6,
      detail: "Mild to moderate intensity (<=6/10)",
      missing: i.pain.peak_intensity == null,
    },
    {
      met: i.pain.worse_with_activity != null && !bool(i.pain.worse_with_activity),
      detail: "Not aggravated by routine physical activity",
      missing: i.pain.worse_with_activity == null,
    },
    {
      met: i.symptoms.nausea != null && !bool(i.symptoms.nausea),
      detail: "No nausea",
      missing: i.symptoms.nausea == null,
    },
    {
      met: i.symptoms.vomiting != null && !bool(i.symptoms.vomiting),
      detail: "No vomiting",
      missing: i.symptoms.vomiting == null,
    },
  ],

  supportingAny: (i: DiagnosticInput) => [
    { met: bool(i.triggers.stress), detail: "Stress trigger", weight: 5 },
    {
      met:
        (i.aura.visual_positive != null || i.aura.sensory_positive != null) &&
        !bool(i.aura.visual_positive) &&
        !bool(i.aura.sensory_positive),
      detail: "No aura",
      weight: 5,
    },
  ],

  downgradeIfAny: (i: DiagnosticInput) => [
    {
      met: bool(i.symptoms.photophobia) && bool(i.symptoms.phonophobia),
      detail: "Both photophobia and phonophobia present",
    },
    {
      met: bool(i.pain.restless_or_pacing),
      detail: "Restlessness or pacing",
    },
  ],

  hardExclusions: () => [],
};
