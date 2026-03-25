import type { Guideline } from "../types";

export const redFlagsEscalation: Guideline = {
  slug: "red-flags-escalation",
  title: "Red Flags and Escalation",
  subtitle:
    "SNOOP4 screening criteria and diagnosis-specific red flag checklists",
  category: "secondary-headaches-red-flags",
  tags: [
    "red flag",
    "SNOOP",
    "escalation",
    "urgent",
    "thunderclap",
    "secondary headache",
    "safety",
  ],
  sourceDocument: "Cephra codebase (src/lib/engine/red-flags.ts, src/lib/schemas/followup/red-flag-review.ts)",
  sections: [
    {
      id: "overview",
      title: "Overview",
      content: [
        {
          type: "paragraph",
          text: "This page summarises the red flag screening criteria and diagnosis-specific red flag checklists used within Cephra. Red flags are clinical features that raise concern for a secondary headache disorder and may require urgent investigation, referral, or change in management.",
        },
        {
          type: "callout",
          variant: "warning",
          title: "Clinical safety",
          text: "Red flags should be actively screened for at every assessment. The presence of any urgent red flag warrants immediate clinical action. High-severity red flags require prompt evaluation.",
        },
      ],
    },
    {
      id: "snoop4-urgent",
      title: "Urgent Red Flags",
      content: [
        {
          type: "paragraph",
          text: "The following red flags are classified as urgent and should prompt immediate investigation or referral.",
        },
        {
          type: "table",
          headers: ["Code", "Description"],
          rows: [
            ["thunderclap_onset", "Thunderclap onset (peak in <1 minute)"],
            ["new_focal_neurology", "New focal neurological deficit"],
            ["seizure_or_confusion", "Seizure or altered consciousness"],
            [
              "papilloedema",
              "Symptoms suggesting raised intracranial pressure",
            ],
            [
              "neuro_exam_gcs_reduced",
              "Reduced GCS on clinical examination (GCS < 15)",
            ],
            [
              "neuro_exam_fundoscopy_abnormal",
              "Abnormal fundoscopy on clinical examination",
            ],
          ],
        },
      ],
    },
    {
      id: "snoop4-high",
      title: "High-Severity Red Flags",
      content: [
        {
          type: "paragraph",
          text: "The following red flags are classified as high severity and require prompt evaluation and consideration of further investigation.",
        },
        {
          type: "table",
          headers: ["Code", "Description"],
          rows: [
            [
              "fever_or_systemic",
              "Fever, weight loss, or systemic illness",
            ],
            [
              "cancer_or_immunosuppression",
              "Active cancer or immunosuppression",
            ],
            [
              "pregnancy_postpartum",
              "New headache in pregnancy or postpartum",
            ],
            ["new_onset_over_50", "New-onset headache after age 50"],
            [
              "trauma_anticoagulation",
              "Headache after trauma or on anticoagulation",
            ],
            [
              "gca_features",
              "Jaw claudication or scalp tenderness (GCA concern)",
            ],
            [
              "positional_cough",
              "Positional or cough/Valsalva-triggered headache",
            ],
            [
              "neuro_exam_abnormal_finding",
              "Abnormal neurological examination finding",
            ],
          ],
        },
      ],
    },
    {
      id: "clinical-examination-flags",
      title: "Clinical Examination Escalation Rules",
      content: [
        {
          type: "paragraph",
          text: "The following red flags are detected from clinical examination findings during the encounter.",
        },
        {
          type: "bullets",
          items: [
            "Reduced GCS (GCS < 15) on clinical examination — urgent severity.",
            "Abnormal fundoscopy on clinical examination — urgent severity.",
            "Abnormal neurological examination finding in any domain (gait, cranial nerves, motor, sensory, cerebellar) — high severity.",
          ],
        },
      ],
    },
    {
      id: "diagnosis-specific-migraine",
      title: "Migraine-Specific Red Flags",
      content: [
        {
          type: "bullets",
          items: [
            "New or changed aura pattern",
            "Aura lasting >60 minutes",
            "Thunderclap headache onset",
            "New focal neurological deficit",
            "Headache always on same side (consider secondary cause)",
            "Significant escalation in frequency or severity",
          ],
        },
      ],
    },
    {
      id: "diagnosis-specific-tth",
      title: "Tension-Type Headache Red Flags",
      content: [
        {
          type: "bullets",
          items: [
            "New focal neurological signs",
            "Progressive worsening despite treatment",
            "Significant change in headache character",
            "New onset after age 50",
            "Associated systemic symptoms",
          ],
        },
      ],
    },
    {
      id: "diagnosis-specific-cluster",
      title: "Cluster Headache Red Flags",
      content: [
        {
          type: "bullets",
          items: [
            "Change in attack pattern suggesting secondary cause",
            "Persistent neurological deficit between attacks",
            "Loss of remission in previously episodic CH",
            "Suicidal ideation or severe psychological distress",
            "New autonomic features not previously present",
            "Failure to respond to expected hallmark treatment",
          ],
        },
      ],
    },
    {
      id: "diagnosis-specific-tac",
      title: "Trigeminal Autonomic Cephalalgia Red Flags",
      content: [
        {
          type: "bullets",
          items: [
            "Poor response to indomethacin (PH/HC)",
            "Change in attack frequency or character",
            "New neurological signs between attacks",
            "Secondary cause features (structural lesion)",
            "Failure to respond to expected hallmark treatment",
          ],
        },
      ],
    },
    {
      id: "diagnosis-specific-moh",
      title: "Medication Overuse Headache Red Flags",
      content: [
        {
          type: "bullets",
          items: [
            "Progressive headache despite withdrawal",
            "New neurological symptoms during withdrawal",
            "Relapse into overuse pattern",
            "Secondary headache features emerging",
            "Severe withdrawal symptoms requiring medical intervention",
          ],
        },
      ],
    },
    {
      id: "diagnosis-specific-cervicogenic",
      title: "Cervicogenic Headache Red Flags",
      content: [
        {
          type: "bullets",
          items: [
            "Progressive neurological deficit",
            "New radiculopathy or myelopathy signs",
            "Severe neck pain with systemic features",
            "Failure to respond to appropriate treatment",
            "New onset of cervicogenic features after trauma",
          ],
        },
      ],
    },
    {
      id: "diagnosis-specific-occipital",
      title: "Occipital Neuralgia Red Flags",
      content: [
        {
          type: "bullets",
          items: [
            "Progressive sensory loss in occipital distribution",
            "New neurological deficit beyond expected territory",
            "Structural lesion features on examination",
            "Failure to respond to nerve block",
            "Bilateral spread suggesting central cause",
          ],
        },
      ],
    },
  ],
};
