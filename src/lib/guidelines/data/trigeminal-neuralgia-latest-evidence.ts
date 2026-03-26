import type { Guideline } from "../types";

export const trigeminalNeuralgiaLatestEvidence: Guideline = {
  slug: "trigeminal-neuralgia-latest-evidence",
  title: "Trigeminal Neuralgia Latest Evidence",
  subtitle: "Clinically relevant summaries of selected headache papers",
  category: "evidence-summaries",
  tags: [
    "trigeminal neuralgia",
    "carbamazepine",
    "oxcarbazepine",
    "anticonvulsant",
    "lidocaine",
    "radiosurgery",
    "rhizotomy",
    "MVD",
    "multiple sclerosis",
    "evidence summary",
  ],
  sourceDocument: "Trigeminal Neuralgia Latest Evidence V1.docx",
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
          text: "Rapid, clinically usable summaries of recent trigeminal neuralgia evidence.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  Paper 1 – Anticonvulsant therapy in TN                            */
    /* ------------------------------------------------------------------ */
    {
      id: "anticonvulsant-therapy-in-tn",
      title: "Anticonvulsant Therapy in TN \u2013 Class-Oriented Systematic Review",
      content: [
        {
          type: "callout",
          variant: "info",
          title: "Why This Paper Matters",
          text: "Useful when choosing or sequencing drug therapy beyond carbamazepine.",
        },
        {
          type: "subheading",
          text: "Key Findings",
        },
        {
          type: "bullets",
          items: [
            "SR of 12 studies from 922 records.",
            "Sodium-channel blockers most effective class overall.",
            "Carbamazepine high efficacy but frequent CNS and haematologic adverse effects.",
            "Oxcarbazepine similar efficacy, better tolerability, but hyponatraemia.",
            "Lamotrigine reasonable better-tolerated alternative.",
            "Gabapentin-based strategies safer but lower efficacy, especially combined with local anaesthetic block.",
            "Levetiracetam and topiramate moderately effective with limited evidence.",
          ],
        },
        {
          type: "callout",
          variant: "info",
          title: "Clinical Application",
          text: "CBZ and OXC remain benchmark first-line. Monitor sodium closely with OXC/eslicarbazepine, especially older adults. Lamotrigine sensible when CBZ-type toxicity is problematic. Gabapentinoids when tolerability matters more than maximal efficacy.",
        },
        {
          type: "paragraph",
          text: "Moreira MP, et al. Medicines. 2026.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  Paper 2 – Lidocaine infusion for intractable TN                   */
    /* ------------------------------------------------------------------ */
    {
      id: "lidocaine-infusion-for-intractable-tn",
      title: "Lidocaine Infusion for Intractable TN",
      content: [
        {
          type: "callout",
          variant: "info",
          title: "Why This Paper Matters",
          text: "Helpful for refractory TN when standard oral agents failing and surgery unsuitable.",
        },
        {
          type: "subheading",
          text: "Key Findings",
        },
        {
          type: "bullets",
          items: [
            "UK retrospective series of 20 patients plus SR.",
            "Protocol: 1.5 mg/kg IV lidocaine over 60 minutes with monitoring.",
            "16/20 (80%) achieved BNI III control after first infusion.",
            "Duration >6 months in 45%, 3\u20136 months in 25%, <3 months in 30%.",
            "No significant adverse events reported.",
            "More like disease-control/rescue strategy than curative.",
          ],
        },
        {
          type: "callout",
          variant: "info",
          title: "Clinical Application",
          text: "Adjunctive rescue or bridging treatment, not replacement for definitive management. Best for refractory worsening TN, patients awaiting procedures, or unfit for surgery. Continue baseline medical therapy after infusion. Use only with appropriate monitoring and protocols.",
        },
        {
          type: "paragraph",
          text: "Mohamed MW, et al. Acta Neurochirurgica. 2025.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  Paper 3 – Stereotactic radiosurgery vs rhizotomy                  */
    /* ------------------------------------------------------------------ */
    {
      id: "stereotactic-radiosurgery-vs-rhizotomy",
      title: "Stereotactic Radiosurgery vs Rhizotomy",
      content: [
        {
          type: "callout",
          variant: "info",
          title: "Why This Paper Matters",
          text: "Useful for counselling patients choosing between SRS and rhizotomy.",
        },
        {
          type: "subheading",
          text: "Key Findings",
        },
        {
          type: "bullets",
          items: [
            "SR/MA of 15 studies, 1,251 patients (577 SRS, 674 rhizotomy).",
            "Rhizotomy better initial pain-free outcomes.",
            "SRS no significant disadvantage at last follow-up.",
            "SRS reduced recurrence, retreatment, and facial numbness.",
            "SRS trended toward fewer complications in MS patients.",
          ],
        },
        {
          type: "callout",
          variant: "info",
          title: "Clinical Application",
          text: "Rhizotomy: faster onset, stronger immediate rates, but more numbness and retreatment. SRS: slower onset, better durability, lower sensory morbidity. Match to patient priorities: urgency vs durability. For MS-related TN, SRS may offer lower complication burden.",
        },
        {
          type: "paragraph",
          text: "Soltani Khaboushan A, et al. Neurosurgical Review. 2025.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  Paper 4 – Radiofrequency rhizotomy for MS-related TN              */
    /* ------------------------------------------------------------------ */
    {
      id: "radiofrequency-rhizotomy-for-ms-related-tn",
      title: "Radiofrequency Rhizotomy for MS-Related TN",
      content: [
        {
          type: "callout",
          variant: "info",
          title: "Why This Paper Matters",
          text: "Directly relevant for TN in multiple sclerosis.",
        },
        {
          type: "subheading",
          text: "Key Findings",
        },
        {
          type: "bullets",
          items: [
            "SR/MA of 15 retrospective studies, 278 MS-TN patients treated with RFR.",
            "Pooled initial pain-free rate: 78%.",
            "Pooled initial adequate pain-relief rate: 96%.",
            "At last follow-up: pain-free 64%, adequate relief 86%.",
            "Pooled complication rate: 9%.",
          ],
        },
        {
          type: "callout",
          variant: "info",
          title: "Clinical Application",
          text: "RFR mainstream option for MS-TN when medical therapy inadequate. Set expectations: immediate response common but repeat procedures may be needed. Sensory complications not prohibitive but should be counselled. Long-term outcome varies; individualise forecasting.",
        },
        {
          type: "paragraph",
          text: "Hajikarimloo B, et al. BMC Surgery. 2025.",
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
          text: "Optimise anticonvulsants by mechanism and tolerability, use IV lidocaine selectively for rescue/bridging, and choose between rhizotomy and radiosurgery based on need for speed versus durability, with special attention to MS-related disease.",
        },
      ],
    },
  ],
};
