import type { Guideline } from "../types";

export const headachePaperSummaries: Guideline = {
  slug: "headache-paper-summaries",
  title: "Clinically Relevant Short Summaries of Selected Headache Papers",
  subtitle:
    "Searchable briefing document with clinical application panels",
  category: "evidence-summaries",
  tags: [
    "evidence",
    "tension-type headache",
    "TTH",
    "acupuncture",
    "psychological treatment",
    "CBT",
    "exercise",
    "prophylaxis",
    "amitriptyline",
    "botulinum toxin",
  ],
  sourceDocument: "selected_headache_paper_clinical_summaries.docx",
  sections: [
    {
      id: "how-to-use",
      title: "How to Use This Document",
      content: [
        {
          type: "callout",
          variant: "info",
          title: "Purpose",
          text: "Rapid, clinically usable summaries rather than full critical appraisals. Layout: left column summarises the study; right shaded panel translates findings into day-to-day clinical use.",
        },
      ],
    },
    {
      id: "acupuncture-for-tth",
      title: "Acupuncture for Tension-Type Headache",
      content: [
        {
          type: "callout",
          variant: "info",
          title: "Why This Paper Matters",
          text: "Useful for clinicians who want a structured answer to whether acupuncture has evidence beyond placebo for TTH. The signal is positive, but the effect size is modest and appears protocol-dependent.",
        },
        {
          type: "paragraph",
          text: "Research question: Does manual acupuncture improve tension-type headache outcomes versus sham acupuncture?",
        },
        {
          type: "paragraph",
          text: "Study design: Systematic review and meta-analysis of 6 RCTs including 927 patients with mainly chronic TTH; databases searched to August 2024.",
        },
        {
          type: "subheading",
          text: "Key Findings",
        },
        {
          type: "bullets",
          items: [
            "At 6 weeks after treatment, acupuncture modestly reduced headache frequency versus sham (SMD \u22120.23; 95% CI \u22120.43 to \u22120.03).",
            "The odds of achieving meaningful headache relief were higher with acupuncture than sham (OR 1.85; 95% CI 1.34 to 2.57).",
            "Pain reduction was more convincing when treatment lasted more than 1 month or included more than 10 sessions (SMD \u22120.32; 95% CI \u22120.56 to \u22120.09).",
            "The evidence base was small and included trials with risk-of-bias concerns, so effect estimates should be interpreted as supportive rather than definitive.",
          ],
        },
        {
          type: "paragraph",
          text: "Bottom line: Acupuncture is a reasonable non-drug option for selected TTH patients, especially when patients prefer non-pharmacological treatment or cannot tolerate preventives, but it should be offered with realistic expectations and a defined treatment course.",
        },
        {
          type: "callout",
          variant: "info",
          title: "Clinical Application",
          text: "Best-fit use: chronic or frequent TTH when standard education, trigger management, and simple preventives are insufficient or poorly tolerated. Set expectations around a treatment block rather than a single session; this paper suggests benefit is more plausible with >10 sessions or >1 month of treatment. Do not present acupuncture as a substitute for red-flag assessment or for addressing medication overuse, mood symptoms, sleep, and neck/shoulder contributors. Practical counselling line: \u201CThe evidence suggests a modest benefit, especially with a complete course, but it is not a guaranteed response.\u201D",
        },
        {
          type: "paragraph",
          text: "Citation: Lin PT, Su SY, Shih CL. J Oral Facial Pain Headache. 2025.",
        },
      ],
    },
    {
      id: "psychological-interventions-for-tth",
      title: "Psychological Interventions for Tension-Type Headache",
      content: [
        {
          type: "callout",
          variant: "info",
          title: "Why This Paper Matters",
          text: "Strengthens the case for integrating behavioural care into TTH management rather than viewing it as an optional add-on. Especially relevant for patients with stress amplification, poor sleep, anxiety, low coping reserve, or persistent disability.",
        },
        {
          type: "paragraph",
          text: "Research question: Do psychological treatments such as CBT, relaxation, biofeedback, mindfulness, and related approaches improve TTH outcomes?",
        },
        {
          type: "paragraph",
          text: "Study design: Systematic review and meta-analysis of 19 randomized trials with 1069 participants; primary outcome was monthly headache days.",
        },
        {
          type: "subheading",
          text: "Key Findings",
        },
        {
          type: "bullets",
          items: [
            "Psychological interventions reduced headache days by about 4.5 days per month compared with controls (MD \u22124.53; 95% CI \u22125.52 to \u22123.54).",
            "Treatment response was higher with psychological therapy (RR 2.43; 95% CI 1.32 to 4.48).",
            "Headache intensity also improved (MD \u22121.88), but heterogeneity was substantial (I\u00B2 93%).",
            "Exploratory subgroup analysis suggested mindfulness/meditation and some other psychological approaches reduced intensity, whereas relaxation-only approaches did not show the same signal.",
            "Analgesic-use outcomes were too inconsistently reported for pooled analysis, and follow-up was generally short to moderate.",
          ],
        },
        {
          type: "paragraph",
          text: "Bottom line: Psychological treatment should be considered a genuine management option for TTH, particularly for chronic or frequent disease and for patients with psychosocial amplification.",
        },
        {
          type: "callout",
          variant: "info",
          title: "Clinical Application",
          text: "Most clinically useful position: adjunct or alternative to pharmacological prophylaxis in patients with frequent/chronic TTH, comorbid anxiety/depression, or medication-overuse risk. Think in phenotypes: stress-linked headache, central sensitisation features, insomnia, catastrophising, and high disability may point toward higher value from behavioural care. Do not oversimplify as \u201Cjust stress\u201D; frame this as evidence-based headache treatment that modifies pain processing and coping. Where resources are limited, prioritise CBT-style approaches, biofeedback, or structured mindfulness programmes over vague advice to \u201Crelax\u201D.",
        },
        {
          type: "paragraph",
          text: "Citation: Yuan L, Pantila K, Niu XY, et al. The Journal of Headache and Pain. 2026.",
        },
      ],
    },
    {
      id: "exercise-for-chronic-tth-and-migraine",
      title: "Exercise for Chronic Tension-Type Headache and Chronic Migraine",
      content: [
        {
          type: "callout",
          variant: "info",
          title: "Why This Paper Matters",
          text: "Headache clinics often underuse exercise as a structured therapeutic prescription. Supports moving beyond generic advice toward a programme-based rehabilitation model, particularly in patients with neck dysfunction, deconditioning, or chronicity.",
        },
        {
          type: "paragraph",
          text: "Research question: Does exercise help reduce pain in chronic TTH and chronic migraine?",
        },
        {
          type: "paragraph",
          text: "Study design: Systematic review of 10 studies (848 participants); qualitative synthesis because protocols and outcomes were heterogeneous.",
        },
        {
          type: "subheading",
          text: "Key Findings",
        },
        {
          type: "bullets",
          items: [
            "Across most included studies, exercise-based programmes outperformed control care for pain reduction.",
            "Interventions commonly combined strengthening/resistance work, postural correction, cervical/scapular exercise, relaxation components, and sometimes manual or adjunctive therapies.",
            "The authors argue that exercise may help through central pain modulation, reduced sensitisation, and better postural/musculoskeletal control.",
            "Evidence quality was limited by heterogeneity, mixed intervention packages, and the practical difficulty of blinding participants and therapists.",
            "The review\u2019s clinical direction was to combine aerobic exercise with postural re-education and soft-tissue tension-reducing strategies.",
          ],
        },
        {
          type: "paragraph",
          text: "Bottom line: Exercise appears clinically worthwhile in chronic TTH and chronic migraine, but it should be prescribed as a tailored programme rather than as a vague instruction to \u201Cbe more active\u201D.",
        },
        {
          type: "callout",
          variant: "info",
          title: "Clinical Application",
          text: "Good candidates: chronic TTH or chronic migraine with neck/shoulder dysfunction, sedentary lifestyle, postural strain, fear-avoidance, or persistent disability. Prescribe frequency, type, duration, and progression\u2014e.g., 2\u20133 sessions/week of cervical-scapular strengthening plus graded aerobic activity and home mobility work. Expect exercise to work best as part of multimodal care, not as an isolated cure. Counselling point: early symptom flares can occur; persistence with graded progression matters more than a perfect immediate response.",
        },
        {
          type: "paragraph",
          text: "Citation: Palacio-Del R\u00EDo CJ, Monti-Ballano S, Lucha-L\u00F3pez MO, et al. Healthcare. 2025.",
        },
      ],
    },
    {
      id: "pharmacological-prophylaxis-for-tth",
      title: "Pharmacological Prophylaxis for Tension-Type Headache",
      content: [
        {
          type: "callout",
          variant: "info",
          title: "Why This Paper Matters",
          text: "Compares multiple preventive options rather than reviewing one drug at a time. Broadly reinforces amitriptyline as the most evidence-supported conventional option for chronic TTH.",
        },
        {
          type: "paragraph",
          text: "Research question: Among pharmacological options studied for TTH prevention, which agents appear most effective and what are their trade-offs?",
        },
        {
          type: "paragraph",
          text: "Study design: Systematic review and Bayesian network meta-analysis of 35 RCTs; 33 trials involved chronic TTH and 24 provided data for quantitative analysis.",
        },
        {
          type: "subheading",
          text: "Key Findings",
        },
        {
          type: "bullets",
          items: [
            "Amitriptyline 100 mg reduced monthly headache days versus placebo at 4 weeks (MD \u22126.59) and 8 weeks (MD \u22126.14).",
            "Botulinum toxin A 100 U also reduced monthly headache days (MD \u22123.79; 95% CrI \u22127.16 to \u22120.33).",
            "Amitriptyline 100 mg ranked highest for headache-day reduction at 4, 8, and 24 weeks; lidocaine 25 ml ranked highest at 12 weeks in the model.",
            "Amitriptyline 100 mg and BTX-A 500 U were associated with higher adverse-event rates than placebo.",
            "The certainty of evidence was low to very low, with substantial heterogeneity and many older or higher-risk trials.",
          ],
        },
        {
          type: "paragraph",
          text: "Bottom line: For chronic TTH prevention, amitriptyline remains the most defensible first pharmacological choice.",
        },
        {
          type: "callout",
          variant: "info",
          title: "Clinical Application",
          text: "Keep amitriptyline as first-line prophylaxis unless comorbidity or tolerability argues otherwise. Use the paper to support shared decision-making rather than to over-interpret rankings. If considering BTX-A, frame it as a selective option for refractory chronic TTH rather than a standard next step. Clinical caveat: dose, tolerability, sedation, anticholinergic burden, and comorbidity still matter more than any single SUCRA ranking.",
        },
        {
          type: "paragraph",
          text: "Citation: Tao QF, Hua C, Mou JJ, et al. Annals of Medicine. 2026.",
        },
      ],
    },
    {
      id: "using-this-document-in-clinic",
      title: "How to Use This Document in Clinic",
      content: [
        {
          type: "bullets",
          items: [
            "Use the navigation pane to jump directly to a paper by topic.",
            "Search by intervention name (e.g., amitriptyline, acupuncture, mindfulness, exercise) to find practical summaries quickly.",
            "These summaries are application-focused; if you are making a major treatment decision, review the original paper and the relevant guideline alongside the summary.",
          ],
        },
      ],
    },
  ],
};
