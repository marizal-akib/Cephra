import type { Guideline } from "../types";

export const cervicogenicHeadacheLatestEvidence: Guideline = {
  slug: "cervicogenic-headache-latest-evidence",
  title: "Cervicogenic Headache Latest Evidence",
  subtitle: "Clinically relevant summaries of selected headache papers",
  category: "evidence-summaries",
  tags: [
    "cervicogenic headache",
    "manual therapy",
    "mobilisation",
    "SNAG",
    "C2 DRG",
    "interventional",
    "evidence summary",
  ],
  sourceDocument: "Cervicogenic Headache Latest Evidence V1.docx",
  sections: [
    /* ------------------------------------------------------------------ */
    /*  How to use                                                        */
    /* ------------------------------------------------------------------ */
    {
      id: "how-to-use",
      title: "How to Use",
      content: [
        {
          type: "callout",
          variant: "info",
          title: "Purpose",
          text: "Rapid, clinically usable summaries of recent evidence relevant to cervicogenic headache assessment and treatment. Each paper has a concise evidence summary and a practical application panel.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  Paper 1 – Minimally invasive interventions for CEH                */
    /* ------------------------------------------------------------------ */
    {
      id: "minimally-invasive-interventions",
      title: "Minimally Invasive Interventions for Cervicogenic Headache",
      content: [
        {
          type: "callout",
          variant: "info",
          title: "Why This Paper Matters",
          text: "This review is helpful when deciding which anatomy-directed procedures are worth considering in refractory cervicogenic headache and which targets currently have the strongest support.",
        },
        {
          type: "subheading",
          text: "Key Points",
        },
        {
          type: "bullets",
          items: [
            "Included 23 studies: 4 randomized trials, 13 cohort studies, 1 case-control study, and 5 anatomical studies.",
            "Interventions directed at the C2 DRG, C1-2 joint, cervical discs, deep cervical plexus, and greater occipital nerve generally produced short-term pain reduction.",
            "The C2 DRG emerged as the most consistently supported target. PRF and ultrasound-guided approaches appeared promising, while C2 DRG RFA carried notable risk of hypersensitivity.",
            "C1-2 joint interventions (PRF, intra-articular steroid) showed meaningful benefit, including some durability out to 12 months.",
            "Heterogeneity: different diagnostic criteria, targets, techniques, outcome measures, and follow-up periods.",
          ],
        },
        {
          type: "callout",
          variant: "warning",
          title: "Important Caveat",
          text: "The overall evidence base is still preliminary. Most supporting studies are retrospective or single-centre.",
        },
        {
          type: "callout",
          variant: "info",
          title: "Clinical Application",
          text: "Where this fits: use after a convincing cervicogenic phenotype and conservative management failure. Best-supported target: C2 DRG-directed treatment, especially when symptoms suggest upper cervical pain generator. Choose precision over escalation. Safer PRF may be more attractive than destructive techniques. Set expectations around improvement rather than cure. Should sit in a specialist pathway with diagnostic confidence and image guidance.",
        },
        {
          type: "paragraph",
          text: "Jin X, Zhang Q, Lin J, Sun Y, Dong Z, Jin W. Journal of Pain Research. 2026.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  Paper 2 – Manual therapy for cervicogenic headache                */
    /* ------------------------------------------------------------------ */
    {
      id: "manual-therapy-for-cervicogenic-headache",
      title: "Manual Therapy for Cervicogenic Headache",
      content: [
        {
          type: "callout",
          variant: "info",
          title: "Why This Paper Matters",
          text: "Useful when choosing between manual therapy strategies.",
        },
        {
          type: "subheading",
          text: "Key Points",
        },
        {
          type: "bullets",
          items: [
            "Included 14 studies with 1,297 patients.",
            "SNAG mobilization outperformed non-SNAG comparators for pain (VAS), disability (NDI and HDI), and flexion-rotation test.",
            "In network meta-analysis, cervical spine manipulation (CSM) ranked highest for short-term improvement.",
            "Mobilization ranked second, while massage and exercise were less effective as stand-alone strategies.",
            "SNAG techniques were safer, manipulation more effective but dependent on clinician expertise.",
          ],
        },
        {
          type: "callout",
          variant: "warning",
          title: "Important Caveat",
          text: "Network ranking supports short-term effectiveness, but doesn\u2019t remove need for individualised decision-making.",
        },
        {
          type: "callout",
          variant: "info",
          title: "Clinical Application",
          text: "Start with mobilization-led programme (SNAG + exercise) for many patients. Consider cervical/thoracic manipulation when delivered by experienced clinician and contraindications excluded. Manual therapy best combined with active rehabilitation plan. Mobilization and SNAG appear lower risk; upper cervical manipulation requires more caution. Supports a stepped conservative pathway before invasive procedures.",
        },
        {
          type: "paragraph",
          text: "Xu X, Ling Y. Frontiers in Neurology. 2025.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  Overall clinical takeaway                                         */
    /* ------------------------------------------------------------------ */
    {
      id: "overall-clinical-takeaway",
      title: "Overall Clinical Takeaway",
      content: [
        {
          type: "paragraph",
          text: "Support a stepped pathway: start with targeted manual therapy and exercise, reserve image-guided procedures for refractory cases.",
        },
        {
          type: "table",
          headers: [
            "Clinical situation",
            "Most useful evidence signal",
            "Practical implication",
          ],
          rows: [
            [
              "Initial conservative care",
              "SNAG/mobilization improves pain, disability, and cervical movement",
              "Use mobilisation-led programme first",
            ],
            [
              "Refractory upper cervical phenotype",
              "C2 DRG and C1-2 joint targets best current signal",
              "Consider referral for specialist procedures",
            ],
            [
              "Patient counselling",
              "Both reviews show benefit but no universal cure",
              "Frame as phenotype-guided symptom reduction",
            ],
          ],
        },
      ],
    },
  ],
};
