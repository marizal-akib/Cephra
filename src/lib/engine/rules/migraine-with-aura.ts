import type { RuleSet, DiagnosticInput } from "../types";
import { num, bool } from "../helpers";

export const migraineWithAura: RuleSet = {
  diagnosis: "migraine_with_aura",
  label: "Migraine with Aura",

  requiredAll: (i: DiagnosticInput) => [
    {
      met:
        bool(i.aura.visual_positive) ||
        bool(i.aura.visual_negative) ||
        bool(i.aura.sensory_positive) ||
        bool(i.aura.sensory_negative) ||
        bool(i.aura.speech_disturbance),
      detail: "At least one aura symptom (visual, sensory, or speech)",
      missing:
        i.aura.visual_positive == null &&
        i.aura.sensory_positive == null,
    },
    {
      met: bool(i.aura.aura_reversible),
      detail: "Aura is fully reversible",
      missing: i.aura.aura_reversible == null,
    },
    {
      met:
        num(i.aura.aura_duration_minutes) >= 5 &&
        num(i.aura.aura_duration_minutes) <= 60,
      detail: "Aura duration 5-60 minutes",
      missing: i.aura.aura_duration_minutes == null,
    },
  ],

  supportingAny: (i: DiagnosticInput) => [
    { met: bool(i.aura.gradual_spread), detail: "Gradual spread over >=5 minutes", weight: 10 },
    { met: bool(i.aura.headache_follows_aura), detail: "Headache follows aura", weight: 10 },
    { met: bool(i.symptoms.nausea), detail: "Nausea present", weight: 5 },
    { met: bool(i.symptoms.photophobia), detail: "Photophobia present", weight: 5 },
  ],

  downgradeIfAny: (i: DiagnosticInput) => [
    {
      met: bool(i.aura.motor_weakness),
      detail: "Motor weakness (consider hemiplegic migraine — escalate)",
    },
    {
      met: bool(i.aura.diplopia),
      detail: "Diplopia (consider brainstem aura — escalate)",
    },
  ],

  hardExclusions: () => [],
};
