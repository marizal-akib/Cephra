import type { Guideline } from "../types";

export const tensionTypeHeadacheLatestEvidence: Guideline = {
  slug: "tension-type-headache-latest-evidence",
  title: "Tension-Type Headache Latest Evidence",
  subtitle: "Clinically relevant summaries of selected headache papers",
  category: "evidence-summaries",
  tags: [
    "tension-type headache",
    "TTH",
    "acupuncture",
    "psychological treatment",
    "CBT",
    "exercise",
    "amitriptyline",
    "prophylaxis",
    "evidence summary",
  ],
  sourceDocument: "Tension Type Headcahe Latest Evidence V1.docx",
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
          text: "Rapid, clinically usable summaries of recent TTH evidence.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  Paper 1 – Acupuncture for TTH                                     */
    /* ------------------------------------------------------------------ */
    {
      id: "acupuncture-for-tension-type-headache",
      title: "Acupuncture for Tension-Type Headache",
      content: [
        {
          type: "callout",
          variant: "info",
          title: "Why This Paper Matters",
          text: "Structured answer to whether acupuncture has evidence beyond placebo for TTH.",
        },
        {
          type: "subheading",
          text: "Key Findings",
        },
        {
          type: "bullets",
          items: [
            "SR and MA of 6 RCTs, 927 patients with mainly chronic TTH.",
            "At 6 weeks, acupuncture modestly reduced headache frequency vs sham (SMD -0.23).",
            "Odds of meaningful relief higher with acupuncture (OR 1.85).",
            "Better results when >10 sessions or >1 month treatment (SMD -0.32).",
            "Evidence base small with risk-of-bias concerns.",
          ],
        },
        {
          type: "callout",
          variant: "info",
          title: "Clinical Application",
          text: "Reasonable non-drug option for chronic/frequent TTH. Plan treatment block (>10 sessions), not single sessions. Not a substitute for red-flag assessment or addressing medication overuse.",
        },
        {
          type: "paragraph",
          text: "Lin PT, Su SY, Shih CL. J Oral Facial Pain Headache. 2025.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  Paper 2 – Psychological interventions for TTH                     */
    /* ------------------------------------------------------------------ */
    {
      id: "psychological-interventions-for-tth",
      title: "Psychological Interventions for TTH",
      content: [
        {
          type: "callout",
          variant: "info",
          title: "Why This Paper Matters",
          text: "Strengthens case for integrating behavioural care into TTH management.",
        },
        {
          type: "subheading",
          text: "Key Findings",
        },
        {
          type: "bullets",
          items: [
            "SR/MA of 19 trials, 1069 participants.",
            "Psychological interventions reduced headache days by ~4.5 days/month (MD -4.53).",
            "Treatment response higher (RR 2.43).",
            "Mindfulness/meditation reduced intensity; relaxation-only did not show same signal.",
            "Analgesic-use outcomes too inconsistently reported for pooled analysis.",
          ],
        },
        {
          type: "callout",
          variant: "info",
          title: "Clinical Application",
          text: "Adjunct or alternative to prophylaxis in frequent/chronic TTH. Best for stress-linked headache, central sensitisation, insomnia, catastrophising. Prioritise CBT, biofeedback, or structured mindfulness over vague advice to \u201crelax.\u201d",
        },
        {
          type: "paragraph",
          text: "Yuan L, et al. The Journal of Headache and Pain. 2026.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  Paper 3 – Exercise for chronic TTH and chronic migraine           */
    /* ------------------------------------------------------------------ */
    {
      id: "exercise-for-chronic-tth-and-migraine",
      title: "Exercise for Chronic TTH and Chronic Migraine",
      content: [
        {
          type: "callout",
          variant: "info",
          title: "Why This Paper Matters",
          text: "Supports moving beyond generic exercise advice toward programme-based rehabilitation.",
        },
        {
          type: "subheading",
          text: "Key Findings",
        },
        {
          type: "bullets",
          items: [
            "SR of 10 studies, 848 participants.",
            "Exercise programmes outperformed control for pain reduction.",
            "Interventions combined strengthening, postural correction, cervical/scapular exercise, relaxation.",
            "Exercise may help through central pain modulation, reduced sensitisation, better postural control.",
            "Evidence limited by heterogeneity and mixed interventions.",
          ],
        },
        {
          type: "callout",
          variant: "info",
          title: "Clinical Application",
          text: "Good candidates: chronic TTH with neck/shoulder dysfunction, sedentary lifestyle, postural strain. Prescribe frequency, type, duration, progression (e.g., 2\u20133 sessions/week). Best as part of multimodal care. Early flares can occur; persistence matters.",
        },
        {
          type: "paragraph",
          text: "Palacio-Del Rio CJ, et al. Healthcare. 2025.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  Paper 4 – Pharmacological prophylaxis for TTH                     */
    /* ------------------------------------------------------------------ */
    {
      id: "pharmacological-prophylaxis-for-tth",
      title: "Pharmacological Prophylaxis for TTH",
      content: [
        {
          type: "callout",
          variant: "info",
          title: "Why This Paper Matters",
          text: "Compares multiple preventive options head-to-head.",
        },
        {
          type: "subheading",
          text: "Key Findings",
        },
        {
          type: "bullets",
          items: [
            "SR and Bayesian NMA of 35 RCTs; 33 in chronic TTH.",
            "Amitriptyline 100 mg reduced monthly headache days at 4 weeks (MD -6.59) and 8 weeks (MD -6.14).",
            "BTX-A 100 U also reduced days (MD -3.79).",
            "Amitriptyline ranked highest across timepoints.",
            "Amitriptyline 100 mg and BTX-A 500 U had higher AE rates.",
            "Evidence certainty low to very low.",
          ],
        },
        {
          type: "callout",
          variant: "info",
          title: "Clinical Application",
          text: "Amitriptyline remains first-line prophylaxis unless comorbidity/tolerability argues otherwise. BTX-A selective option for refractory chronic TTH, not standard next step. Dose, tolerability, anticholinergic burden matter more than SUCRA rankings.",
        },
        {
          type: "paragraph",
          text: "Tao QF, et al. Annals of Medicine. 2026.",
        },
      ],
    },
  ],
};
