import type { RuleSet, DiagnosticInput } from "../types";
import { num, bool } from "../helpers";

export const tensionType: RuleSet = {
  diagnosis: "tension_type",
  label: "Tension-type Headache",

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
      met: !bool(i.pain.worse_with_activity),
      detail: "Not aggravated by routine physical activity",
      missing: i.pain.worse_with_activity == null,
    },
    {
      met: !bool(i.symptoms.nausea),
      detail: "No nausea",
    },
    {
      met: !bool(i.symptoms.vomiting),
      detail: "No vomiting",
    },
  ],

  supportingAny: (i: DiagnosticInput) => [
    { met: bool(i.triggers.stress), detail: "Stress trigger", weight: 5 },
    {
      met: !bool(i.aura.visual_positive) && !bool(i.aura.sensory_positive),
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
