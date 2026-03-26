import type { Guideline } from "../types";

export const migraineLatestEvidence: Guideline = {
  slug: "migraine-latest-evidence",
  title: "Migraine Latest Evidence",
  subtitle:
    "Unified searchable clinical briefing based on recent migraine research",
  category: "evidence-summaries",
  tags: [
    "migraine",
    "evidence",
    "REN",
    "neuromodulation",
    "aura",
    "atogepant",
    "gepant",
    "pharmacogenetics",
    "triptan",
    "acupuncture",
    "behavioral",
    "GONB",
    "occipital nerve block",
    "eptinezumab",
    "CGRP",
    "preventive treatment",
  ],
  sourceDocument: "Migraine_latest_evidence_V1 (1).docx",
  sections: [
    /* ------------------------------------------------------------------ */
    /*  How to use                                                         */
    /* ------------------------------------------------------------------ */
    {
      id: "how-to-use",
      title: "How to Use This Document",
      content: [
        {
          type: "callout",
          variant: "info",
          text: "Purpose: quick-reference clinical summaries of recent migraine papers and guideline-oriented updates. Structure: each paper has a summary and practical application panel. Scope: application-focused synthesis, not a full critical appraisal.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  Paper 1: REN for acute migraine                                    */
    /* ------------------------------------------------------------------ */
    {
      id: "ren-acute-migraine",
      title:
        "Paper 1: Remote Electrical Neuromodulation (REN) for Acute Migraine",
      content: [
        {
          type: "callout",
          variant: "info",
          title: "Why This Paper Matters",
          text: "This large systematic review/meta-analysis supports REN as a pragmatic, home-based acute option for migraine, particularly when patients want a non-drug therapy or have contraindications, poor tolerance, or overuse risk with acute medications.",
        },
        {
          type: "subheading",
          text: "Key Clinical Points",
        },
        {
          type: "bullets",
          items: [
            "Included 12 studies with 9,912 patients.",
            "At 2 hours, 64% achieved pain relief and 22% were pain-free.",
            "Sustained pain relief at 24 hours was 59%, and sustained pain-free status at 24 hours was 54%.",
            "Functional improvement at 2 hours occurred in 59%, and the most bothersome symptom resolved in about 55%.",
            "In comparative analyses, REN improved 2-hour pain freedom versus control/sham, while device-related adverse events remained low.",
          ],
        },
        {
          type: "callout",
          variant: "warning",
          title: "Caveat",
          text: "Most evidence addresses acute treatment rather than replacing preventive therapy. Device access, cost, and adherence still matter in real-world use.",
        },
        {
          type: "callout",
          variant: "info",
          title: "Clinical Application",
          text: "Consider for patients with episodic or chronic migraine who prefer non-pharmacologic acute treatment. Useful when triptans are contraindicated, poorly tolerated, or contributing to medication overuse. Potentially attractive for adolescents and for patients prioritising portability and self-administration. Explain that benefit is meaningful but not universal; set expectations similarly to other acute therapies.",
        },
        {
          type: "paragraph",
          text: "Citation: Alnajjar et al. BMC Neurology, 2025.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  Paper 2: Migraine with aura                                        */
    /* ------------------------------------------------------------------ */
    {
      id: "migraine-with-aura",
      title:
        "Paper 2: Migraine with Aura \u2014 What It Looks Like and Why It Matters",
      content: [
        {
          type: "callout",
          variant: "info",
          title: "Why This Paper Matters",
          text: "Helps clinicians recognise the breadth of aura phenotypes and avoid overcalling TIA, seizure, or ocular disease while still respecting red flags.",
        },
        {
          type: "subheading",
          text: "Key Clinical Points",
        },
        {
          type: "bullets",
          items: [
            "Migraine aura affects up to 30% of people with migraine and is usually visual, but may also be sensory, speech/language, motor, brainstem, or retinal.",
            "Typical aura symptoms are gradual, fully reversible, and usually last up to 60 minutes, but prolonged visual aura beyond 60 minutes is not rare in practice.",
            "The pathophysiologic anchor remains cortical spreading depression with downstream neurovascular and trigeminovascular changes.",
            "A stronger hereditary signal is described for migraine with aura than for migraine without aura, with recent migraine-aura-specific loci including HMOX2, CACNA1A, and MPPED2.",
            "Differential diagnosis remains central: TIA/stroke, epilepsy, inflammatory CNS disease, and ocular causes of monocular visual loss must still be considered.",
          ],
        },
        {
          type: "callout",
          variant: "warning",
          title: "Caveat",
          text: "The review is broad and conceptually rich, but evidence for therapies that specifically target aura itself remains limited.",
        },
        {
          type: "callout",
          variant: "info",
          title: "Clinical Application",
          text: "Use chronology: gradual spread, positive then negative symptoms, and full reversibility support aura. Be careful with monocular visual symptoms; retinal migraine is uncommon and misdiagnosis risk is high. If presentation is abrupt, fixed, prolonged, or atypical for the patient, investigate for stroke/TIA or other secondary causes. Useful when documenting complex aura phenotype in clinic letters.",
        },
        {
          type: "paragraph",
          text: "Citation: Joppekov\u00e1 et al. The Journal of Headache and Pain, 2025.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  Paper 3: Atogepant for migraine prevention                         */
    /* ------------------------------------------------------------------ */
    {
      id: "atogepant-prevention",
      title: "Paper 3: Atogepant for Migraine Prevention",
      content: [
        {
          type: "callout",
          variant: "info",
          title: "Why This Paper Matters",
          text: "Reinforces atogepant as an effective oral preventive option across episodic and chronic migraine, with the main trade-off being gastrointestinal tolerability rather than major safety signals elsewhere.",
        },
        {
          type: "subheading",
          text: "Key Clinical Points",
        },
        {
          type: "bullets",
          items: [
            "Six randomised trials with 4,052 patients were included.",
            "Atogepant improved monthly migraine days over 12 weeks across 10 mg, 30 mg, and 60 mg dosing.",
            "It also reduced monthly headache days, increased the proportion achieving at least 50% reduction in monthly migraine days, and reduced acute medication use days.",
            "Treatment-emergent adverse events were increased, driven mainly by gastrointestinal effects such as constipation and nausea.",
            "Dose should be matched to patient context rather than assuming higher dose is always preferable.",
          ],
        },
        {
          type: "callout",
          variant: "warning",
          title: "Caveat",
          text: "The pooled analysis supports benefit, but the dose-response question and long-term comparative positioning against other modern preventives still need refinement.",
        },
        {
          type: "callout",
          variant: "info",
          title: "Clinical Application",
          text: "A strong oral option for patients who want prevention without injectables. Discuss constipation and nausea upfront and monitor early tolerability. Useful in both episodic and chronic migraine; chronic cases should still be reviewed for central sensitisation, allodynia, and comorbid medication overuse. Dose selection should balance efficacy goals with tolerability and patient preference.",
        },
        {
          type: "paragraph",
          text: "Citation: Ladhwani et al. BMC Neurology, 2025.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  Paper 4: Pharmacogenetics of triptan non-response                  */
    /* ------------------------------------------------------------------ */
    {
      id: "pharmacogenetics-triptan",
      title: "Paper 4: Pharmacogenetics of Triptan Non-Response",
      content: [
        {
          type: "callout",
          variant: "info",
          title: "Why This Paper Matters",
          text: "Clinically useful as a future-facing review: does not give a ready-to-use genetic test, but clarifies why some patients repeatedly fail triptans and why precision treatment pathways may become relevant.",
        },
        {
          type: "subheading",
          text: "Key Clinical Points",
        },
        {
          type: "bullets",
          items: [
            "About 40% of patients are described as non-responsive to triptans.",
            "Nine studies were included in the final analysis.",
            "Overall pooled analysis did not confirm one robust standalone genetic predictor.",
            "Subgroup findings suggested associations between triptan non-response and polymorphisms involving SLC6A4, 5-HT1B, and COMT; CALCA and PRDM16 had moderate evidence, while GRIA1 and SCN1A had limited evidence.",
            "Polygenic risk scores and combined genetic approaches may ultimately be more clinically useful than single-marker testing.",
          ],
        },
        {
          type: "callout",
          variant: "warning",
          title: "Caveat",
          text: "The literature is heterogeneous, small, and methodologically inconsistent. Current findings are hypothesis-generating rather than immediately practice-changing.",
        },
        {
          type: "callout",
          variant: "info",
          title: "Clinical Application",
          text: "Do not use this paper to justify routine genetic testing yet. Use it to explain to refractory patients that repeated triptan failure may reflect biology, not simply poor adherence or poor timing. If a patient fails several triptans, move on pragmatically to gepants, ditans, REN, or better preventive optimisation rather than endlessly rotating similar drugs. Precision medicine is the future direction, but present-day practice still relies on phenotype and treatment history.",
        },
        {
          type: "paragraph",
          text: "Citation: Andreata et al. Brain and Behavior, 2025.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  Paper 5: Acupuncture vs standard care for migraine prophylaxis     */
    /* ------------------------------------------------------------------ */
    {
      id: "acupuncture-prophylaxis",
      title:
        "Paper 5: Acupuncture versus Standard Medical Care for Migraine Prophylaxis",
      content: [
        {
          type: "callout",
          variant: "info",
          title: "Why This Paper Matters",
          text: "Supports acupuncture as a credible adjunctive preventive strategy, mainly for improving quality of life, reducing analgesic use, and offering a lower-burden option when standard preventives are poorly tolerated.",
        },
        {
          type: "subheading",
          text: "Key Clinical Points",
        },
        {
          type: "bullets",
          items: [
            "Fifteen studies were eligible.",
            "Compared with standard medical care, acupuncture did not show a statistically significant advantage for reducing migraine days or pain intensity overall.",
            "It did reduce analgesic use and improved quality of life.",
            "The authors position acupuncture as an adjunct rather than a replacement for established pharmacologic prevention.",
            "Benefits may be particularly relevant where tolerability, patient preference, pregnancy/adolescence, or multimorbidity limit standard preventive options.",
          ],
        },
        {
          type: "callout",
          variant: "warning",
          title: "Caveat",
          text: "Evidence is complicated by protocol heterogeneity, sham-design issues, and lack of head-to-head comparison with newer CGRP-targeted preventives.",
        },
        {
          type: "callout",
          variant: "info",
          title: "Clinical Application",
          text: "Reasonable to offer as an add-on in patients seeking non-drug prevention. Particularly useful in patients with medication intolerance, strong preference for integrative care, or incomplete response to standard prevention. Set expectations clearly: likely improvement in burden and medication use, but not a guaranteed large reduction in migraine frequency. Access, cost, and availability are often the real determinants of uptake.",
        },
        {
          type: "paragraph",
          text: "Citation: Pistoia et al. European Journal of Neurology, 2025.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  Paper 6: Behavioral interventions for migraine prevention          */
    /* ------------------------------------------------------------------ */
    {
      id: "behavioral-interventions",
      title: "Paper 6: Behavioral Interventions for Migraine Prevention",
      content: [
        {
          type: "callout",
          variant: "info",
          title: "Why This Paper Matters",
          text: "One of the most practice-relevant summaries for integrating behavioral care into migraine prevention pathways for adults and young people.",
        },
        {
          type: "subheading",
          text: "Key Clinical Points",
        },
        {
          type: "bullets",
          items: [
            "Included 50 adult trials (6,024 adults) and 13 pediatric/adolescent trials (1,444 children/adolescents).",
            "For adults, CBT, relaxation training, and mindfulness-based therapies may reduce migraine/headache frequency.",
            "Education alone that targets behavior may improve disability in adults.",
            "For children/adolescents, CBT plus biofeedback plus relaxation training may reduce attack frequency and disability more than education alone.",
            "Evidence quality was generally low because many studies were small, multicomponent, and at high risk of bias.",
          ],
        },
        {
          type: "callout",
          variant: "warning",
          title: "Caveat",
          text: "The evidence base supports use, but component-specific dosing, ideal delivery format, and the size of benefit versus expectation/placebo effects remain incompletely defined.",
        },
        {
          type: "callout",
          variant: "info",
          title: "Clinical Application",
          text: "Behavioral treatment should be considered a real preventive modality, not merely supportive counselling. Adults: CBT, relaxation, and mindfulness are reasonable adjuncts or stand-alone options for selected patients. Children/adolescents: structured CBT-biofeedback-relaxation packages appear especially relevant. Useful when patients want to reduce medication exposure or when comorbid stress, sleep disturbance, anxiety, or coping problems are prominent.",
        },
        {
          type: "paragraph",
          text: "Citation: Treadwell et al. Headache, 2025.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  Paper 7: Greater occipital nerve block for migraine                */
    /* ------------------------------------------------------------------ */
    {
      id: "gonb-migraine",
      title: "Paper 7: Greater Occipital Nerve Block for Migraine",
      content: [
        {
          type: "callout",
          variant: "info",
          title: "Why This Paper Matters",
          text: "Provides a rigorous look at GONB evidence including an umbrella review showing prior reviews were weak.",
        },
        {
          type: "subheading",
          text: "Key Clinical Points",
        },
        {
          type: "bullets",
          items: [
            "Most prior systematic reviews were methodologically weak or contained pooling/extraction errors.",
            "With moderate certainty, local anaesthetic GONB reduced headache severity in acute migraine over short follow-up (\u226448 hours), with signal seen as early as 30 minutes in some trials.",
            "With low certainty, weekly bilateral local anaesthetic GONB for chronic migraine reduced headache severity at one month and reduced monthly headache days by about 4.5 days at one month.",
            "Evidence was insufficient for steroid-only GONB, local anaesthetic plus steroid GONB, unilateral GONB, or episodic migraine prevention.",
            "No serious adverse effects identified. Reported problems: injection-site pain/bleeding, dizziness/vertigo, neck discomfort; steroid injections rarely associated with cutaneous atrophy or alopecia.",
          ],
        },
        {
          type: "callout",
          variant: "info",
          title: "Bottom Line",
          text: "Supports GONB mainly as a short-term or bridging option.",
        },
        {
          type: "callout",
          variant: "info",
          title: "Clinical Application",
          text: "Most defensible use: short-term rescue or bridge treatment. Best supported scenario: local anaesthetic GONB for acute migraine relief, and weekly bilateral local anaesthetic GONB for selected chronic migraine patients. Do not overstate durability: sustained benefit beyond the short term remains uncertain. Steroid use is not clearly supported; avoid assuming steroids improve efficacy. Counselling point: the procedure appears generally safe, but common local adverse effects should be discussed.",
        },
        {
          type: "paragraph",
          text: "Citation: Atraszkiewicz D, Uenal E, Bassett P, et al. Cephalalgia. 2025.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  Paper 8: Comprehensive safety analysis of eptinezumab              */
    /* ------------------------------------------------------------------ */
    {
      id: "eptinezumab-safety",
      title: "Paper 8: Comprehensive Safety Analysis of Eptinezumab",
      content: [
        {
          type: "callout",
          variant: "info",
          title: "Why This Paper Matters",
          text: "For safety counselling.",
        },
        {
          type: "subheading",
          text: "Key Clinical Points",
        },
        {
          type: "bullets",
          items: [
            "In the meta-analysis, overall adverse-event risk was not higher than placebo (RR 1.02, 95% CI 0.95\u20131.10).",
            "Serious adverse events were more frequent than placebo in pooled trial data (RR 2.87, 95% CI 1.27\u20136.48), although absolute event numbers were still low.",
            "Upper respiratory tract infections were more common with eptinezumab (RR 1.49, P=0.04).",
            "FAERS identified strong reporting signals for \u2018drug ineffective\u2019 and \u2018migraine\u2019.",
            "Important real-world safety signals included anaphylactic reactions and rare reports such as increased intracranial pressure; most adverse-event reports occurred within the first treatment month.",
          ],
        },
        {
          type: "callout",
          variant: "info",
          title: "Bottom Line",
          text: "Routine use remains reasonable, but clinicians should monitor carefully around infusion timing.",
        },
        {
          type: "callout",
          variant: "info",
          title: "Clinical Application",
          text: "Use the paper mainly for safety counselling, not efficacy selection. Highest-yield monitoring window: the first month after infusion. Discuss infusion or hypersensitivity reactions explicitly. Remember that FAERS signals are hypothesis-generating, not proof of causation. Upper respiratory infections may be slightly more frequent.",
        },
        {
          type: "paragraph",
          text: "Citation: Chen J, Huang S, Chen Y, et al. Scientific Reports. 2025.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  Paper 9: IHS guidelines on non-invasive neuromodulation devices    */
    /* ------------------------------------------------------------------ */
    {
      id: "ihs-neuromodulation-guidelines",
      title:
        "Paper 9: IHS Evidence-Based Guidelines on Non-Invasive Neuromodulation Devices",
      content: [
        {
          type: "callout",
          variant: "info",
          title: "Why This Paper Matters",
          text: "First IHS guideline on neuromodulation devices.",
        },
        {
          type: "subheading",
          text: "Key Clinical Points",
        },
        {
          type: "bullets",
          items: [
            "For acute migraine treatment, weak recommendations in favour of SAVI Dual, Cefaly, Relivion, and Nerivio.",
            "For preventive migraine treatment, weak recommendations in favour of gammaCore Sapphire, Cefaly, and Nerivio.",
            "Several cleared devices received no recommendation because evidence was too limited.",
            "Evidence quality ranged from very low to moderate; many recommendations remained weak.",
            "The authors emphasise that these devices are generally safe, well tolerated, and free of drug interactions, and provide expert-consensus suggestions for broader scenarios.",
          ],
        },
        {
          type: "callout",
          variant: "info",
          title: "Bottom Line",
          text: "This is a \u2018consider as an option\u2019 guideline rather than standard-of-care.",
        },
        {
          type: "callout",
          variant: "info",
          title: "Clinical Application",
          text: "Think of neuromodulation as an adjunct or alternative, especially when drug therapy is contraindicated, poorly tolerated, or undesired. Best evidence in prevention is still only weak/conditional; set expectations accordingly. Good fit: patients who want low systemic adverse-effect burden or who are concerned about drug interactions. Practical barriers: adherence, device technique, cost, and insurance coverage.",
        },
        {
          type: "paragraph",
          text: "Citation: Yuan H, Orr SL, Al-Karagholi MAM, et al. Cephalalgia. 2025.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  Paper 10: Pharmacological treatment guidelines                     */
    /* ------------------------------------------------------------------ */
    {
      id: "pharmacological-treatment-guidelines",
      title:
        "Paper 10: Evidence-Based Guidelines for Pharmacological Treatment of Migraine",
      content: [
        {
          type: "callout",
          variant: "info",
          title: "Why This Paper Matters",
          text: "Helps structure escalation logically while individualising.",
        },
        {
          type: "subheading",
          text: "Key Clinical Points",
        },
        {
          type: "bullets",
          items: [
            "Covers acute therapy and preventive therapy comprehensively.",
            "For episodic migraine prevention, strong recommendations: atogepant 60 mg, erenumab 70/140 mg, fremanezumab, galcanezumab 120 mg, topiramate 100\u2013200 mg, and eptinezumab 100/300 mg.",
            "For chronic migraine prevention, strong recommendations: onabotulinumtoxinA, atogepant 60 mg, eptinezumab, erenumab, fremanezumab, and galcanezumab.",
            "Older preventive drugs remain clinically relevant but have weaker evidence from older trials.",
            "Separates evidence-based recommendations from expert opinion.",
          ],
        },
        {
          type: "callout",
          variant: "info",
          title: "Bottom Line",
          text: "Helps structure escalation logically.",
        },
        {
          type: "callout",
          variant: "info",
          title: "Clinical Application",
          text: "Use as a framework document for drug-class prioritisation and escalation. High-evidence preventive options are concentrated among newer CGRP-pathway agents, onabotulinumtoxinA for chronic migraine, and topiramate. Do not dismiss older drugs entirely. Helpful phrase: evidence strength and real-world suitability are not the same thing.",
        },
        {
          type: "paragraph",
          text: "Citation: Ornello R, Caponnetto V, Ahmed F, et al. Cephalalgia. 2025.",
        },
      ],
    },
  ],
};
