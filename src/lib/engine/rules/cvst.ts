import type { RuleSet, DiagnosticInput } from "../types";
import { bool, hasFinding, isAbnormalHigh, isFemale } from "../helpers";

export const cvst: RuleSet = {
  diagnosis: "cvst",
  label: "Cerebral Venous Sinus Thrombosis",
  category: "secondary",

  requiredAll: (i: DiagnosticInput) => [
    {
      // Direct imaging evidence is sufficient on its own; otherwise require a
      // recognised prothrombotic risk factor.
      met:
        hasFinding(i, "MRV", "thrombosis_on_mrv") ||
        hasFinding(i, "MRI Brain", "thrombosis") ||
        bool(i.redFlags.anticoagulation) ||
        bool(i.redFlags.pregnancy_new_headache) ||
        bool(i.redFlags.postpartum_new_headache) ||
        bool(i.redFlags.cancer_history) ||
        (isFemale(i) && bool(i.medications.hormonal_contraception)),
      detail: "Prothrombotic risk factor or imaging evidence of CVST",
      missing:
        i.redFlags.pregnancy_new_headache == null &&
        i.redFlags.postpartum_new_headache == null &&
        i.redFlags.cancer_history == null &&
        i.redFlags.anticoagulation == null &&
        !i.previousInvestigations?.results?.length,
    },
  ],

  supportingAny: (i: DiagnosticInput) => [
    {
      met:
        hasFinding(i, "MRV", "thrombosis_on_mrv") ||
        hasFinding(i, "MRI Brain", "thrombosis"),
      detail: "Thrombosis on MRV / MRI",
      weight: 25,
    },
    {
      met: bool(i.redFlags.papilloedema_symptoms),
      detail: "Features of raised intracranial pressure",
      weight: 10,
    },
    {
      met: bool(i.redFlags.seizure),
      detail: "Seizure",
      weight: 10,
    },
    {
      met: bool(i.redFlags.focal_deficit),
      detail: "Focal neurological deficit",
      weight: 10,
    },
    {
      met: isAbnormalHigh(i, "D Dimer"),
      detail: "Elevated D-dimer",
      weight: 5,
    },
    {
      met:
        bool(i.redFlags.pregnancy_new_headache) ||
        bool(i.redFlags.postpartum_new_headache),
      detail: "Pregnancy / postpartum",
      weight: 5,
    },
  ],

  downgradeIfAny: () => [],

  hardExclusions: () => [],
};
