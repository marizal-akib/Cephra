import type { Guideline } from "../types";

export const idiopathicIntracranialHypertension: Guideline = {
  slug: "idiopathic-intracranial-hypertension",
  title: "Idiopathic Intracranial Hypertension (IIH)",
  subtitle:
    "Standalone cohesive diagnostic and management guidance synthesising UK, European, American, and society sources",
  category: "secondary-headaches-red-flags",
  tags: [
    "IIH",
    "idiopathic intracranial hypertension",
    "pseudotumor cerebri",
    "papilloedema",
    "acetazolamide",
    "optic nerve",
    "CSF pressure",
    "obesity",
    "visual loss",
    "lumbar puncture",
    "topiramate",
    "weight loss",
  ],
  sourceDocument: "Idiopathic intracranual hypertension.docx",
  sections: [
    {
      id: "how-to-use",
      title: "How to Use This Document",
      content: [
        {
          type: "callout",
          variant: "info",
          text: "This document is written as a practical clinic-facing reference. It is adult-focused, with a dedicated section on paediatric and pregnancy considerations. It aims to provide a pragmatic framework rather than replace local neuro-ophthalmology, neurology, neurosurgery, obesity-service, or obstetric pathways.",
        },
      ],
    },
    {
      id: "source-hierarchy",
      title: "Source Hierarchy and Interpretation",
      content: [
        {
          type: "numbered",
          items: [
            "The backbone of this guidance is the 2018 UK multidisciplinary adult consensus guideline, which remains the most comprehensive practical management document for IIH.",
            "European guidance is aligned overall, especially through the 2018 European Headache Federation (EHF) guideline. No newer full EAN practice guideline was identified; the EAN has listed IIH as a priority topic for 2025\u20132027.",
            "For children and young people, the 2024 UK paediatric consensus recommendations provide the most up-to-date structured guidance.",
            "No dedicated NICE IIH guideline was identified. NICE contributes indirectly through obesity-management guidance and weight-management technology appraisals.",
            "No dedicated full American society guideline equivalent to the UK consensus was identified. American practice is reflected in recent AAO educational guidance, NANOS resources, and long-standing neuro-ophthalmology expert practice patterns.",
            "The International Headache Society 2023 IIH guideline is a controlled-clinical-trials guidance document, not a bedside management guideline.",
          ],
        },
      ],
    },
    {
      id: "key-recommendations",
      title: "Key Recommendations at a Glance",
      content: [
        {
          type: "table",
          headers: ["Domain", "Core recommendation", "Practical note"],
          rows: [
            [
              "Diagnosis",
              "Confirm papilloedema, exclude structural/venous causes with MRI+MRV, then perform lumbar puncture with a correctly measured opening pressure and normal CSF composition.",
              "Do not diagnose IIH from symptoms alone. Papilloedema remains central in usual adult disease.",
            ],
            [
              "Vision risk",
              "Treat severe papilloedema, declining visual fields, or rapid visual loss as time-critical.",
              "Fulminant IIH needs same-day specialist escalation.",
            ],
            [
              "Disease modification",
              "Target sustained weight loss in typical obesity-associated IIH.",
              "In current UK practice, this may include specialist dietetic pathways, bariatric referral, or anti-obesity medication when criteria are met.",
            ],
            [
              "First-line medical therapy",
              "Use acetazolamide when vision is threatened or symptomatic papilloedema is present; consider topiramate when migraine phenotype or weight-loss benefit is useful and contraindications allow.",
              "Headache-only disease without active papilloedema is treated differently from vision-threatening disease.",
            ],
            [
              "Headache care",
              "Phenotype the headache properly; many patients have migraine, medication-overuse headache, or mixed headache syndromes.",
              "Do not assume all pain is pressure-driven.",
            ],
            [
              "Surgery",
              "Escalate to optic nerve sheath fenestration and/or CSF diversion for progressive visual loss despite maximal medical therapy or fulminant disease.",
              "Choice depends on local expertise, dominant problem, and patient factors.",
            ],
            [
              "Venous sinus stenting",
              "Reserve for carefully selected refractory cases in experienced centres.",
              "Evidence continues to evolve; it is not yet a universal first-line intervention.",
            ],
          ],
        },
      ],
    },
    {
      id: "diagnostic-pathway",
      title: "Diagnostic Pathway",
      content: [
        {
          type: "subheading",
          text: "When to suspect IIH",
        },
        {
          type: "paragraph",
          text: "Suspect IIH in a patient with headache and papilloedema, particularly when accompanied by transient visual obscurations, pulsatile tinnitus, diplopia, sixth nerve palsy, or unexplained visual field loss.",
        },
        {
          type: "paragraph",
          text: "The typical phenotype remains an overweight woman of childbearing age, but IIH also occurs in men, children, pregnant patients, and patients without obesity. These groups may be at higher risk of delayed diagnosis.",
        },
        {
          type: "subheading",
          text: "Essential diagnostic steps",
        },
        {
          type: "table",
          headers: ["Step", "What to do", "Key pitfalls"],
          rows: [
            [
              "1. Confirm disc swelling",
              "Obtain urgent ophthalmic confirmation when papilloedema is subtle or uncertain; use dilated fundus exam, visual fields, fundus photography, and OCT where available.",
              "Pseudopapilloedema, optic disc drusen, hypertensive disc oedema, and other optic neuropathies can mimic papilloedema.",
            ],
            [
              "2. Image first",
              "Perform MRI brain with venography (preferably MRI with contrast plus MRV).",
              "Do not perform lumbar puncture first in a patient with papilloedema before excluding a mass lesion or cerebral venous thrombosis.",
            ],
            [
              "3. Measure opening pressure correctly",
              "Perform LP in lateral decubitus, relaxed, legs extended, and record opening pressure with normal CSF chemistry and cell count.",
              "Prone or seated measurements overestimate pressure; pain, anxiety, and sedation can distort readings.",
            ],
            [
              "4. Exclude secondary causes",
              "Review drugs, endocrine/metabolic factors, venous thrombosis risk, sleep apnoea, anaemia, pregnancy, and systemic disease.",
              "A diagnosis of \u201cidiopathic\u201d intracranial hypertension is inappropriate until plausible secondary causes have been addressed.",
            ],
            [
              "5. Stage visual risk",
              "Document visual acuity, formal perimetry, papilloedema grade, and symptom tempo.",
              "Visual acuity alone underestimates severity; field loss often precedes acuity loss.",
            ],
          ],
        },
        {
          type: "subheading",
          text: "Interpretation of lumbar puncture opening pressure",
        },
        {
          type: "paragraph",
          text: "In adults, pressures <200 mmH2O are usually treated as normal, >250 mmH2O as abnormal, and 200\u2013250 mmH2O as equivocal. Equivocal pressures should be interpreted alongside the whole clinical picture, especially papilloedema, MR/MRV features, and exclusion of secondary causes.",
        },
        {
          type: "subheading",
          text: "Important imaging findings that support IIH but do not independently diagnose it",
        },
        {
          type: "table",
          headers: ["Imaging feature", "Clinical interpretation"],
          rows: [
            [
              "Posterior globe flattening",
              "One of the more specific MRI signs supporting raised intracranial pressure.",
            ],
            [
              "Distended perioptic subarachnoid spaces \u00b1 tortuous optic nerves",
              "Common supportive sign, particularly in papilloedema.",
            ],
            [
              "Empty or partially empty sella",
              "Supportive but nonspecific; should not be used in isolation.",
            ],
            [
              "Transverse venous sinus stenosis",
              "Common in IIH and highly supportive when bilateral, but can be consequence as well as contributor to raised intracranial pressure.",
            ],
            [
              "Optic nerve head protrusion / enhancement",
              "Can support active papilloedema in the right context.",
            ],
          ],
        },
      ],
    },
    {
      id: "core-management",
      title: "Core Management Principles",
      content: [
        {
          type: "paragraph",
          text: "Across UK, European, and American practice sources, management can be organised around three priorities: (1) treat the underlying disease driver, particularly obesity where present; (2) preserve vision; and (3) minimise headache morbidity and treatment toxicity.",
        },
        {
          type: "paragraph",
          text: "Disease severity should be judged by visual risk and tempo, not by headache severity alone. Some patients have severe headache with low visual risk; others have relatively little headache but significant risk to vision.",
        },
        {
          type: "subheading",
          text: "Weight loss and disease modification",
        },
        {
          type: "paragraph",
          text: "Sustained weight reduction remains the only established disease-modifying strategy for typical obesity-associated IIH. A practical initial target of 6% to 10% weight loss is commonly used in clinical practice, although some patients may need greater loss for remission.",
        },
        {
          type: "paragraph",
          text: "Patients with severe obesity, recurrent IIH, inability to achieve durable weight reduction, or frequent relapse should be considered early for specialist obesity referral and discussion of medical or surgical weight-management pathways.",
        },
        {
          type: "subheading",
          text: "Initial medical therapy",
        },
        {
          type: "table",
          headers: ["Treatment", "Usual role", "Advantages", "Cautions / limitations"],
          rows: [
            [
              "Acetazolamide",
              "First-line for symptomatic papilloedema or visual risk.",
              "Best-supported agent; improves visual-field and papilloedema outcomes in mild visual loss when combined with weight management.",
              "Paresthesia, fatigue, GI upset, renal stones, metabolic acidosis; tolerability often limits dose.",
            ],
            [
              "Topiramate",
              "Alternative or adjunct, especially if headache is migraine-like or weight loss is desirable.",
              "Carbonic anhydrase activity, migraine prevention, appetite/weight benefit.",
              "Cognitive adverse effects, mood effects, teratogenic concerns, drug interactions.",
            ],
            [
              "Furosemide",
              "Adjunct when acetazolamide alone is insufficient or poorly tolerated.",
              "Can be helpful in selected patients.",
              "Evidence base is weaker; monitor volume and electrolyte status.",
            ],
            [
              "Headache-directed preventive therapy",
              "For persistent migraine-type headache after or alongside ICP treatment.",
              "Targets the headache phenotype rather than pressure alone.",
              "Avoid agents likely to worsen weight where possible; watch for medication overuse.",
            ],
          ],
        },
        {
          type: "subheading",
          text: "Acetazolamide practical use",
        },
        {
          type: "paragraph",
          text: "A common adult starting regimen is 500 mg twice daily, titrated as tolerated. In specialist practice, doses up to 2\u20134 g/day are used, though many patients cannot tolerate the upper range. The IIHTT supports benefit in patients with mild visual loss when combined with diet and weight management.",
        },
        {
          type: "subheading",
          text: "Headache management",
        },
        {
          type: "paragraph",
          text: "Persistent headache in IIH must be phenotyped carefully. Many patients have migraine, medication-overuse headache, or mixed headache syndromes. Escalating pressure-lowering therapy for all ongoing headache is poor practice unless there is parallel evidence of active papilloedema or deteriorating visual function.",
        },
      ],
    },
    {
      id: "vision-risk-stratification",
      title: "Vision Risk Stratification and Emergency Escalation",
      content: [
        {
          type: "paragraph",
          text: "Higher Fris\u00e9n papilloedema grades, definite visual loss at presentation, rapidly worsening visual fields, or fulminant symptom evolution over days to weeks indicate high risk of permanent visual impairment.",
        },
        {
          type: "paragraph",
          text: "Patients with fulminant IIH should be discussed urgently with neuro-ophthalmology and neurosurgery. Medical therapy should begin immediately, but definitive intervention should not be delayed when vision is clearly deteriorating.",
        },
        {
          type: "table",
          headers: ["Scenario", "Recommended response", "Notes"],
          rows: [
            [
              "Mild papilloedema, normal or near-normal vision",
              "Weight-management programme, acetazolamide if symptomatic or fields are abnormal, close ophthalmic review.",
              "Headache care may run in parallel.",
            ],
            [
              "Moderate papilloedema or progressive field change",
              "Escalate acetazolamide/topiramate strategy, ensure expedited neuro-ophthalmology review, consider surgical planning if worsening continues.",
              "Follow-up should be weeks, not months.",
            ],
            [
              "Fulminant IIH / rapid visual decline",
              "Same-day specialist escalation; urgent high-dose pressure-lowering therapy; temporising CSF drainage may be required while preparing surgery.",
              "Do not rely on serial outpatient reassessment.",
            ],
            [
              "Headache severe but vision stable",
              "Treat headache phenotype and avoid assuming pressure failure.",
              "Recheck for medication overuse and migraine features.",
            ],
          ],
        },
      ],
    },
    {
      id: "procedural-and-surgical",
      title: "Procedural and Surgical Options",
      content: [
        {
          type: "paragraph",
          text: "The strongest indication for intervention is progressive visual loss despite appropriate medical therapy, or severe/fulminant visual threat at presentation. The dominant symptom (vision versus headache), local expertise, and anatomy all influence the preferred procedure.",
        },
        {
          type: "paragraph",
          text: "Across the major practice documents, optic nerve sheath fenestration and CSF diversion remain the main established surgical pathways. Venous sinus stenting is increasingly used in specialist centres but remains more selectively indicated.",
        },
        {
          type: "subheading",
          text: "Optic nerve sheath fenestration (ONSF)",
        },
        {
          type: "paragraph",
          text: "ONSF is primarily a vision-preserving operation. It is generally preferred when optic nerve compromise is the dominant issue and local expertise is available. It often stabilises or improves vision, but headache response is variable. Relapse or need for repeat surgery can occur.",
        },
        {
          type: "subheading",
          text: "CSF diversion (ventriculo-peritoneal or lumbo-peritoneal shunting)",
        },
        {
          type: "paragraph",
          text: "CSF shunting can improve papilloedema, visual loss, and sometimes headache, but revision burden is substantial. Modern practice in many centres favours ventriculo-peritoneal shunting over lumbo-peritoneal shunting because of better technical control and often fewer revisions.",
        },
        {
          type: "subheading",
          text: "Venous sinus stenting",
        },
        {
          type: "paragraph",
          text: "Venous sinus stenting is best considered in carefully selected refractory patients with relevant venous sinus stenosis after multidisciplinary review in experienced centres. The procedure can be effective in selected cases, but evidence remains heterogeneous, complications occur, and long-term durability is still being defined. It should not be represented as routine first-line therapy for most IIH patients.",
        },
        {
          type: "subheading",
          text: "Temporising measures",
        },
        {
          type: "paragraph",
          text: "Serial lumbar punctures or lumbar drainage may be used as short-term bridges in fulminant disease or in selected pregnancy scenarios, but they are not good long-term management strategies because benefit is transient and the procedures are burdensome and complication-prone.",
        },
      ],
    },
    {
      id: "monitoring-and-follow-up",
      title: "Monitoring and Follow-Up",
      content: [
        {
          type: "paragraph",
          text: "Follow-up should be led by visual risk rather than by a fixed generic timetable. The minimum dataset at review is clinical symptom review, visual acuity, formal visual field testing, dilated fundus examination, and optic nerve documentation (photographs and/or OCT where available).",
        },
        {
          type: "table",
          headers: ["Risk group", "Suggested review interval", "Focus of review"],
          rows: [
            [
              "Fulminant / rapidly progressive visual loss",
              "Same day to weekly until stable",
              "Urgent decision-making about surgery or temporising drainage.",
            ],
            [
              "Moderate papilloedema or recent field change",
              "2\u20136 weekly initially",
              "Trend visual fields and papilloedema grade; confirm treatment tolerance.",
            ],
            [
              "Mild stable papilloedema",
              "Every 1\u20133 months initially",
              "Ensure fields remain stable and weight-loss strategy is active.",
            ],
            [
              "Chronic low-grade stable disease",
              "Every 6\u201312 months, individualised",
              "Monitor for relapse, weight regain, and late headache transformation.",
            ],
            [
              "After remission",
              "Long-term follow-up if prior visual risk or relapse tendency",
              "Recurrence can occur years later, often with weight regain.",
            ],
          ],
        },
      ],
    },
    {
      id: "special-situations",
      title: "Special Situations",
      content: [
        {
          type: "subheading",
          text: "IIH without papilloedema",
        },
        {
          type: "paragraph",
          text: "This diagnosis should be made cautiously. In routine clinical practice, isolated headache plus a borderline raised LP pressure is insufficient. Supportive imaging findings and careful exclusion of mimics are necessary, and the visual-risk profile is lower than in classic papilloedema-associated IIH.",
        },
        {
          type: "subheading",
          text: "Pregnancy",
        },
        {
          type: "paragraph",
          text: "Pregnancy requires shared management with obstetrics. Vision-threatening disease still requires urgent treatment. Acetazolamide use in pregnancy remains an individualised risk\u2013benefit decision in specialist care. Serial LPs or lumbar drainage may be considered as temporary measures when medication choices are constrained.",
        },
        {
          type: "subheading",
          text: "Children and young people",
        },
        {
          type: "paragraph",
          text: "Paediatric IIH should follow specialist paediatric neurology/ophthalmology pathways. The 2024 consensus recommendations emphasise multidisciplinary discussion, careful interpretation of opening pressure, and age-specific assessment rather than simple application of adult thresholds.",
        },
        {
          type: "subheading",
          text: "Medication-associated intracranial hypertension",
        },
        {
          type: "paragraph",
          text: "A drug history is mandatory. Potential culprits include tetracyclines, vitamin A derivatives, growth hormone, and other recognised associations. Stopping the trigger is important, but additional IIH treatment may still be needed if papilloedema or visual risk persists.",
        },
      ],
    },
    {
      id: "practical-clinic-guidance",
      title: "Practical Standalone Clinic Guidance",
      content: [
        {
          type: "bullets",
          items: [
            "A diagnosis of IIH should rest on the full triad of compatible syndrome, exclusion of structural/venous causes, and documented raised opening pressure with normal CSF composition\u2014interpreted in context.",
            "Do not over-treat headache when the real issue is migraine, medication overuse, or chronic post-IIH headache. Conversely, do not under-treat a patient with relatively mild headache but worsening visual fields.",
            "For most adult patients, the most important long-term intervention is durable weight reduction supported by a structured obesity pathway.",
            "For sight-threatening disease, delays are more dangerous than overtreatment. Escalate early when visual decline is demonstrable.",
            "Venous sinus stenting should remain a specialist-centre decision until further comparative data mature.",
          ],
        },
      ],
    },
    {
      id: "references",
      title: "Selected Reference and Guideline Framework",
      content: [
        {
          type: "bullets",
          items: [
            "Mollan SP, Davies B, Silver NC, et al. Idiopathic intracranial hypertension: consensus guidelines on management. J Neurol Neurosurg Psychiatry. 2018;89:1088-1100.",
            "Hoffmann J, Mollan SP, Paemeleire K, et al. European Headache Federation guideline on idiopathic intracranial hypertension. J Headache Pain. 2018;19:93.",
            "Amin S, Whitehouse WP, et al. Consensus recommendations for the assessment and management of idiopathic intracranial hypertension in children and young people. Arch Dis Child. 2024.",
            "NICE. Overweight and obesity management (NG246). Published 2025; updated 2026.",
            "NICE. Semaglutide for managing overweight and obesity (TA875). 2023.",
            "American Academy of Ophthalmology. Diagnosis and Management of Idiopathic Intracranial Hypertension. Ophthalmic Pearls / EyeNet. 2025.",
            "North American Neuro-Ophthalmology Society. Idiopathic Intracranial Hypertension / Pseudotumor Cerebri patient and practice resource. Accessed 2026.",
            "International Headache Society. Guidelines for Controlled Clinical Trials in Idiopathic Intracranial Hypertension. 2023.",
            "European Academy of Neurology. Priority Topics 2025\u20132027: Diagnosis and Management of Idiopathic Intracranial Hypertension.",
          ],
        },
      ],
    },
  ],
};
