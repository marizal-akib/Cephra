import type { RedFlagResult, PhenotypeResult } from "./types";

export function deriveSuggestedWorkup(
  redFlags: RedFlagResult,
  phenotypes: PhenotypeResult[]
): string[] {
  const workup: string[] = [];

  if (redFlags.flagged) {
    workup.push("Urgent clinical review recommended");

    for (const flag of redFlags.flags) {
      switch (flag.code) {
        case "thunderclap_onset":
          workup.push("Urgent CT head +/- CT angiography");
          workup.push("Consider lumbar puncture if imaging normal");
          break;
        case "new_focal_neurology":
        case "seizure_or_confusion":
          workup.push("Urgent brain imaging (MRI preferred, CT if urgent)");
          break;
        case "papilloedema":
          workup.push("Urgent brain imaging");
          workup.push("Ophthalmology review");
          break;
        case "fever_or_systemic":
          workup.push("Blood tests: FBC, CRP, ESR");
          workup.push("Consider lumbar puncture if meningitis suspected");
          break;
        case "gca_features":
          workup.push("Urgent ESR and CRP");
          workup.push("Consider temporal artery biopsy");
          break;
        case "trauma_anticoagulation":
          workup.push("CT head");
          workup.push("Review anticoagulation status");
          break;
        case "positional_cough":
          workup.push("MRI brain with Chiari protocol");
          workup.push("Consider CSF pressure studies");
          break;
        case "new_onset_over_50":
          workup.push("ESR, CRP (exclude GCA)");
          workup.push("Brain imaging");
          break;
        case "cancer_or_immunosuppression":
          workup.push("Brain imaging with contrast");
          break;
        case "pregnancy_postpartum":
          workup.push("MRI/MRA brain (no contrast in pregnancy)");
          workup.push("Consider cerebral venous thrombosis workup");
          break;
        case "neuro_exam_gcs_reduced":
          workup.push("Urgent brain imaging");
          workup.push("Consider neurology review");
          break;
        case "neuro_exam_fundoscopy_abnormal":
          workup.push("Urgent brain imaging");
          workup.push("Ophthalmology review");
          break;
        case "neuro_exam_abnormal_finding":
          workup.push("Consider neuroimaging if new or unexplained finding");
          break;
      }
    }
  }

  // Diagnosis-specific workup
  const topDiagnosis = phenotypes[0]?.diagnosis;
  if (topDiagnosis === "cluster" && !redFlags.flagged) {
    workup.push("MRI brain to exclude structural lesion (first presentation)");
  }

  // Deduplicate
  return [...new Set(workup)];
}
