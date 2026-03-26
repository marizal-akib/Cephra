import type { Guideline } from "../types";

export const chronicMigraine: Guideline = {
  slug: "chronic-migraine",
  title: "Chronic Migraine in Adults",
  subtitle:
    "Evidence summary and guideline comparison integrating NICE, American, and European guidance",
  category: "primary-headaches",
  tags: [
    "chronic migraine",
    "CGRP",
    "onabotulinumtoxinA",
    "Botox",
    "preventive",
    "medication overuse",
    "topiramate",
    "amitriptyline",
    "erenumab",
    "atogepant",
    "chronification",
  ],
  sourceDocument: "Chronic migraine.docx",
  sections: [
    {
      id: "scope",
      title: "Scope",
      content: [
        {
          type: "table",
          headers: ["Domain", "Detail"],
          rows: [
            [
              "Scope",
              "Standalone summary of chronic migraine: pathophysiology, epidemiology, diagnosis, investigation, management, and current access pathways.",
            ],
            [
              "Guideline lens",
              "NICE remains comparatively restrictive for advanced biologics/gepants, while AHS and EHF position CGRP-targeting therapies as earlier or first-line options in selected patients.",
            ],
            [
              "Clinical take-home",
              "Chronic migraine is a preventive-treatment disorder first; medication overuse, sleep, mood, obesity, and comorbidity management materially affect outcome.",
            ],
          ],
        },
      ],
    },
    {
      id: "definition-and-diagnostic-threshold",
      title: "Definition and Diagnostic Threshold",
      content: [
        {
          type: "paragraph",
          text: "Chronic migraine is defined clinically as headache on 15 or more days per month for more than 3 months, with migraine features present on at least 8 days per month. In practice, many patients have a background of near-daily headache with intermittent flares that are clearly migrainous.",
        },
        {
          type: "paragraph",
          text: "NICE advises diagnosing chronic migraine when headache is present on 15 or more days per month, with at least 8 days having migraine features, for more than 3 months. If chronic tension-type and migraine features overlap, diagnose chronic migraine when any migraine features are present.",
        },
        {
          type: "subheading",
          text: "Why this matters",
        },
        {
          type: "bullets",
          items: [
            "It is more disabling than episodic migraine and should be approached primarily as a preventive-treatment condition.",
            "Medication overuse, sleep disturbance, obesity, depression/anxiety, and ineffective acute treatment all increase the likelihood of persistence or chronification.",
            "Chronic migraine must be distinguished from medication overuse headache, chronic tension-type headache, new daily persistent headache, hemicrania continua, and secondary headache disorders.",
          ],
        },
      ],
    },
    {
      id: "pathophysiology-and-progression",
      title: "Pathophysiology and Progression from Episodic to Chronic Migraine",
      content: [
        {
          type: "paragraph",
          text: "Migraine pathophysiology centers on the trigeminovascular system, with activation of trigeminal afferents, CGRP-mediated neurogenic inflammation, abnormal sensory processing, and central sensitization. Cortical hyperexcitability and altered descending pain modulation contribute to susceptibility and persistence.",
        },
        {
          type: "paragraph",
          text: "The transition from episodic to chronic migraine is incompletely understood, but the leading model involves repeated attacks driving peripheral and then central sensitization, impaired pain inhibition, persistent trigeminocervical activation, and reinforcement by comorbid factors such as medication overuse, poor sleep, obesity, depression, and stress.",
        },
        {
          type: "bullets",
          items: [
            "CGRP remains a major therapeutic target because it participates in trigeminovascular pain transmission and vasodilatory/neuroinflammatory signalling.",
            "Functional and structural imaging changes have been described in chronic migraine, but these should be interpreted as correlates rather than proven causes of chronification.",
            "Clinically, allodynia is a useful marker of sensitization and is associated with increased risk of transformation.",
          ],
        },
      ],
    },
    {
      id: "epidemiology-and-risk-factors",
      title: "Epidemiology and Risk Factors",
      content: [
        {
          type: "paragraph",
          text: "Chronic migraine affects about 2% of the general population and is responsible for a disproportionate share of migraine-related disability, healthcare use, and productivity loss.",
        },
        {
          type: "paragraph",
          text: "Among people with episodic migraine, transition to chronic migraine occurs in roughly 3% per year. Reversion back to episodic migraine is common with effective preventive treatment, withdrawal of overused acute medication, and management of modifiable risk factors.",
        },
        {
          type: "subheading",
          text: "Risk factors for chronification",
        },
        {
          type: "table",
          headers: [
            "Non-modifiable or harder-to-modify",
            "Potentially modifiable",
          ],
          rows: [
            [
              "Female sex; younger age; genetic predisposition; prior head/neck injury; low socioeconomic status; stressful life events; baseline allodynia; comorbid pain syndromes.",
              "Higher headache frequency; medication overuse; depression/anxiety; obesity; sleep disorders or habitual snoring; high caffeine intake; persistent nausea; low efficacy of acute therapy; asthma.",
            ],
          ],
        },
      ],
    },
    {
      id: "clinical-picture-and-comorbidity",
      title: "Clinical Picture and Comorbidity Profile",
      content: [
        {
          type: "paragraph",
          text: "Many patients describe daily or near-daily mild-to-moderate headache plus superimposed severe attacks with photophobia, phonophobia, nausea, vomiting, osmophobia, and cutaneous allodynia. The phenotype may blur across days, so diagnosis depends more on longitudinal pattern than on a single-day symptom set.",
        },
        {
          type: "bullets",
          items: [
            "Psychiatric comorbidity is common: depression, generalized anxiety, panic symptoms, and health-related distress are frequent and clinically important.",
            "Sleep disturbance is common and bidirectional: insomnia, poor sleep quality, snoring, and daytime somnolence all worsen burden.",
            "Other frequently associated problems include obesity, neck pain, fibromyalgia or other pain syndromes, gastrointestinal symptoms, fatigue, and medication overuse headache.",
            "Migraine, particularly with aura, is associated with a small absolute increase in ischemic stroke risk.",
          ],
        },
      ],
    },
    {
      id: "assessment-investigation-differential",
      title: "Assessment, Investigation, and Differential Diagnosis",
      content: [
        {
          type: "paragraph",
          text: "The diagnosis remains clinical. A headache diary should record headache days, migraine days, severity, associated symptoms, acute medication use, and likely triggers over at least 8 weeks.",
        },
        {
          type: "subheading",
          text: "Investigations",
        },
        {
          type: "bullets",
          items: [
            "Routine neuroimaging is not required in an established primary headache disorder solely for reassurance.",
            "Image when there are red flags or atypical features: new focal neurology, papilloedema, thunderclap onset, change in pattern, positional headache, systemic features, immunosuppression, pregnancy/postpartum context, cancer history, or onset later in life.",
            "MRI is generally preferred outside the emergency setting; CT is appropriate when haemorrhage or acute stroke is suspected.",
            "Consider lumbar puncture when infection, subarachnoid haemorrhage after negative imaging, or pressure disorder is suspected.",
          ],
        },
        {
          type: "subheading",
          text: "Key diagnostic competitors",
        },
        {
          type: "bullets",
          items: [
            "Medication overuse headache: often coexists and perpetuates chronic migraine.",
            "Chronic tension-type headache.",
            "New daily persistent headache.",
            "Hemicrania continua or other trigeminal autonomic cephalalgias.",
            "Secondary headaches, including intracranial pressure disorders, structural lesions, meningitis, and vascular causes.",
          ],
        },
      ],
    },
    {
      id: "management-principles",
      title: "Management Principles",
      content: [
        {
          type: "paragraph",
          text: "Management should focus on preventive treatment, reduction of acute medication overuse, and treatment of comorbidities. The realistic aim is meaningful reduction in headache frequency, severity, duration, and disability, not necessarily complete remission.",
        },
        {
          type: "numbered",
          items: [
            "Confirm the diagnosis and quantify migraine days, headache days, and acute medication use.",
            "Address medication overuse early.",
            "Start or optimize preventive therapy with an adequate dose and duration.",
            "Treat mood, sleep, weight, and neck or musculoskeletal contributors in parallel.",
            "Use non-pharmacological measures and a diary to monitor response.",
            "Escalate to specialist therapies when oral preventives fail, are not tolerated, or are unsuitable.",
          ],
        },
      ],
    },
    {
      id: "acute-treatment",
      title: "Acute Treatment in Chronic Migraine",
      content: [
        {
          type: "paragraph",
          text: "Individual attacks are treated using the same principles as episodic migraine, but acute medication should be constrained because repeated use drives medication overuse headache and reduces preventive success.",
        },
        {
          type: "bullets",
          items: [
            "First options for many attacks: NSAID, aspirin, paracetamol, or a triptan depending on severity and prior response.",
            "Use a non-oral route when nausea or vomiting is prominent.",
            "Avoid opioids and ergots for routine acute treatment under NICE guidance.",
            "For refractory emergency presentations, parenteral antiemetics, ketorolac, subcutaneous sumatriptan, or dihydroergotamine-based pathways may be used in specialist settings.",
          ],
        },
        {
          type: "paragraph",
          text: "Medication overuse thresholds remain important: triptans, ergots, opioids, and combination analgesics on 10 or more days per month, or simple analgesics/NSAIDs on 15 or more days per month, raise concern for medication overuse headache.",
        },
      ],
    },
    {
      id: "preventive-treatment",
      title: "Preventive Treatment: Practical Hierarchy",
      content: [
        {
          type: "subheading",
          text: "Oral preventive options",
        },
        {
          type: "table",
          headers: ["Class", "Examples", "Common advantages", "Key cautions"],
          rows: [
            [
              "Beta blockers",
              "Propranolol, metoprolol",
              "Useful with hypertension/tremor; inexpensive.",
              "Avoid or use caution in asthma, bradycardia, hypotension, depression, some athletes.",
            ],
            [
              "Antidepressants",
              "Amitriptyline, venlafaxine",
              "Useful with insomnia, mood disorder, pain amplification.",
              "Anticholinergic burden, sedation, weight gain, withdrawal issues, QT and overdose considerations.",
            ],
            [
              "Anticonvulsants",
              "Topiramate; valproate in selected patients",
              "Topiramate helpful in obesity; valproate useful in selected non-pregnancy-risk groups.",
              "Topiramate cognitive effects/teratogenicity; valproate strongly restricted in people who could become pregnant.",
            ],
            [
              "Renin-angiotensin agents",
              "Candesartan; lisinopril",
              "Reasonable alternatives after first-line failure; useful with hypertension.",
              "Hypotension, dizziness, renal considerations; avoid in pregnancy.",
            ],
          ],
        },
        {
          type: "subheading",
          text: "Advanced preventive options with strongest chronic-migraine evidence",
        },
        {
          type: "bullets",
          items: [
            "Topiramate has randomized-trial support and remains a common oral first-line option.",
            "OnabotulinumtoxinA is established for chronic migraine, not episodic migraine.",
            "CGRP-pathway preventives have the strongest contemporary evidence for tolerability and are increasingly being moved earlier in care pathways by American and European guidance.",
          ],
        },
      ],
    },
    {
      id: "onabotulinumtoxina",
      title: "OnabotulinumtoxinA (Botox) in Chronic Migraine",
      content: [
        {
          type: "paragraph",
          text: "OnabotulinumtoxinA is recommended for chronic migraine, but not for episodic migraine. The evidence base comes primarily from PREEMPT and later real-world studies.",
        },
        {
          type: "bullets",
          items: [
            "European Headache Federation consensus recommends the PREEMPT protocol: 155 U to 195 U injected across 31 to 39 sites every 12 weeks.",
            "EHF advises that patients should preferably have tried 2 to 3 preventive agents first; medication overuse should ideally be withdrawn first, but treatment can still be started if withdrawal is not feasible immediately.",
            "NICE recommends Botox for adults with chronic migraine only after at least 3 preventive medicines have failed, are not tolerated, or are unsuitable, and when medication overuse is appropriately managed.",
            "Under NICE CG150, stop Botox if headache days do not reduce by at least 30% after 2 treatment cycles, or if the condition converts to episodic migraine for 3 consecutive months.",
          ],
        },
      ],
    },
    {
      id: "cgrp-targeting-therapies",
      title: "CGRP-Targeting Therapies and Gepants",
      content: [
        {
          type: "paragraph",
          text: "CGRP-targeting therapies include monoclonal antibodies (erenumab, fremanezumab, galcanezumab, eptinezumab) and oral gepants (atogepant, rimegepant). They are migraine-specific therapies with strong efficacy and generally favourable tolerability.",
        },
        {
          type: "subheading",
          text: "What the major guidance bodies say",
        },
        {
          type: "table",
          headers: ["Body", "Core position", "Practical threshold", "Comments"],
          rows: [
            [
              "AHS 2024",
              "CGRP-targeting therapies should be considered first-line preventive options alongside older first-line therapies.",
              "No prior failure requirement in the position statement.",
              "Applies to mAbs and preventive gepants; emphasises strong efficacy and tolerability.",
            ],
            [
              "EHF 2022",
              "mAbs targeting the CGRP pathway are recommended for migraine prevention and are effective and safe long-term.",
              "European guidance generally supports earlier specialist use.",
              "Pregnancy and certain vascular-risk settings still require caution.",
            ],
            [
              "NICE 2020\u20132025",
              "CGRP preventives are recommended options only after at least 3 preventive medicines have failed, are not tolerated, or are unsuitable.",
              "Need 4 or more migraine days per month.",
              "For chronic migraine, stop if migraine frequency is not reduced by at least 30% after 12 weeks.",
            ],
            [
              "NICE 2024",
              "Atogepant is recommended for preventing migraine, including chronic migraine, only after at least 3 preventive medicines have failed/are unsuitable.",
              "4 or more migraine days per month.",
              "Represents a major oral option in the UK pathway.",
            ],
          ],
        },
        {
          type: "subheading",
          text: "Practical points",
        },
        {
          type: "bullets",
          items: [
            "Erenumab: monitor for constipation and hypertension; NICE specifies use of the 140 mg dose in the appraisal pathway.",
            "Atogepant is now part of the UK preventive pathway for both episodic and chronic migraine after three preventive failures.",
            "Rimegepant is a preventive option in NICE for episodic migraine; in NICE it is not the chronic-migraine preventive gepant pathway.",
            "In post-marketing data, hypertension, Raynaud phenomenon, hypersensitivity, and rare angioedema/anaphylaxis have been reported with some CGRP-pathway agents.",
            "Avoid in pregnancy until better safety data exist; use extra caution in recent major cardiovascular or cerebrovascular ischemia.",
          ],
        },
      ],
    },
    {
      id: "non-pharmacological-strategies",
      title: "Non-Pharmacological and Adjunctive Strategies",
      content: [
        {
          type: "bullets",
          items: [
            "Headache diary, sleep optimisation, regular meals, regular aerobic exercise, caffeine moderation, and trigger management.",
            "Behavioural therapy: relaxation training, biofeedback, cognitive-behavioural therapy, and stress-management approaches.",
            "Occipital nerve blocks may help selected refractory patients and may be used as adjunctive therapy.",
            "Neuromodulation options exist, but evidence in chronic migraine is weaker and access varies by jurisdiction.",
          ],
        },
      ],
    },
    {
      id: "treatment-framework",
      title: "Recommended Treatment Framework for Clinic Practice",
      content: [
        {
          type: "numbered",
          items: [
            "Confirm chronic migraine and quantify medication overuse.",
            "Begin/optimise a diary and address sleep, mood, obesity, and trigger patterns.",
            "Withdraw overused acute medication where possible.",
            "Start one evidence-based preventive and titrate adequately.",
            "If ineffective or not tolerated, switch class rather than cycling within the same mechanism without rationale.",
            "Escalate to onabotulinumtoxinA or CGRP-pathway therapy when the patient meets the relevant local access criteria.",
            "Assess response against headache-day or migraine-day reduction and disability improvement, not just pain intensity.",
            "Reassess after an adequate trial: at least 8 weeks at target dose for oral agents; 2 to 3 Botox cycles; around 3 months for monthly CGRP mAbs and longer for quarterly regimens.",
          ],
        },
      ],
    },
    {
      id: "prognosis",
      title: "Prognosis",
      content: [
        {
          type: "paragraph",
          text: "Chronic migraine is treatable and not always a permanent state. Observational studies suggest that about one-quarter to two-thirds of patients can revert to episodic migraine over time, especially when medication overuse is addressed, preventive therapy is adhered to, and exercise and lifestyle measures are maintained.",
        },
        {
          type: "paragraph",
          text: "Favourable prognostic signs include lower baseline headache frequency, absence of allodynia, withdrawal of overused medication, and consistent engagement with preventive therapy.",
        },
      ],
    },
    {
      id: "bottom-line",
      title: "Bottom Line",
      content: [
        {
          type: "callout",
          variant: "info",
          text: "Chronic migraine should be treated as a preventive-care disorder. The core pillars are accurate diagnosis, early recognition of medication overuse, optimisation of sleep/mood/weight, and timely use of evidence-based preventives. NICE still applies a stepped-access model for Botox and CGRP therapies, whereas recent American and European guidance places CGRP-targeting therapies much earlier in the pathway because of their efficacy and tolerability.",
        },
      ],
    },
    {
      id: "references",
      title: "Selected References and Guideline Sources",
      content: [
        {
          type: "bullets",
          items: [
            "NICE CG150. Headaches in over 12s: diagnosis and management. Updated 2025.",
            "NICE TA260. Botulinum toxin type A for prevention of headaches in adults with chronic migraine.",
            "NICE TA682, TA659, TA764, TA871, and TA973 for erenumab, galcanezumab, fremanezumab, eptinezumab, and atogepant.",
            "American Headache Society. Calcitonin gene-related peptide-targeting therapies are a first-line option for the prevention of migraine: position statement update. Headache. 2024.",
            "European Headache Federation guideline on monoclonal antibodies targeting the CGRP pathway for migraine prevention. 2022 update.",
            "European Headache Federation consensus statement on onabotulinumtoxinA in chronic migraine. J Headache Pain. 2018.",
          ],
        },
      ],
    },
  ],
};
