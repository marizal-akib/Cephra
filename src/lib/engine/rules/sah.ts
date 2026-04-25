import type { RuleSet, DiagnosticInput } from "../types";
import { bool, hasFinding } from "../helpers";

export const sah: RuleSet = {
  diagnosis: "sah",
  label: "Subarachnoid Haemorrhage",
  category: "secondary",

  requiredAll: (i: DiagnosticInput) => [
    {
      met:
        bool(i.redFlags.thunderclap_onset) ||
        hasFinding(i, "CT head", "blood_on_ct") ||
        hasFinding(i, "LP / CSF", "xanthochromia"),
      detail: "Thunderclap onset OR direct evidence (blood on CT / xanthochromia)",
      missing:
        i.redFlags.thunderclap_onset == null &&
        !i.previousInvestigations?.results?.length,
    },
  ],

  supportingAny: (i: DiagnosticInput) => [
    {
      met: hasFinding(i, "CT head", "blood_on_ct"),
      detail: "Blood on CT head",
      weight: 25,
    },
    {
      met: hasFinding(i, "LP / CSF", "xanthochromia"),
      detail: "CSF xanthochromia",
      weight: 25,
    },
    {
      met: hasFinding(i, "MRA", "aneurysm"),
      detail: "Aneurysm on MRA",
      weight: 10,
    },
    {
      met: bool(i.redFlags.neck_stiffness),
      detail: "Neck stiffness / meningismus",
      weight: 5,
    },
    {
      met: bool(i.redFlags.anticoagulation),
      detail: "On anticoagulation",
      weight: 5,
    },
    {
      met: bool(i.redFlags.thunderclap_onset),
      detail: "Thunderclap onset (peak <1 minute)",
      weight: 10,
    },
  ],

  downgradeIfAny: () => [],

  hardExclusions: (i: DiagnosticInput) => [
    {
      // If a CT head was explicitly normal, no thunderclap, and no other
      // direct evidence, suppress the alert to avoid over-triage.
      met:
        hasFinding(i, "CT head", "normal") &&
        !bool(i.redFlags.thunderclap_onset) &&
        !hasFinding(i, "LP / CSF", "xanthochromia"),
      detail: "Normal CT head and no thunderclap features",
    },
  ],
};
