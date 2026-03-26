import type { Guideline } from "../types";

export const trigeminalNeuralgia: Guideline = {
  slug: "trigeminal-neuralgia",
  title: "Trigeminal Neuralgia in Adults",
  subtitle:
    "Holistic evidence-based guidance integrating current UK NICE/CKS practice, UK multidisciplinary guidance, European Academy of Neurology guidance, and the American Academy of Neurology guideline",
  category: "primary-headaches",
  tags: [
    "trigeminal",
    "neuralgia",
    "facial-pain",
    "neuropathic",
    "carbamazepine",
    "oxcarbazepine",
    "microvascular-decompression",
    "MVD",
  ],
  sourceDocument: "Trigeminal Neuralgia P.docx",
  sections: [
    /* ------------------------------------------------------------------ */
    /*  Key Practice Points                                               */
    /* ------------------------------------------------------------------ */
    {
      id: "key-practice-points",
      title: "Key Practice Points",
      content: [
        {
          type: "callout",
          variant: "info",
          title: "Practice synthesis",
          text: "Trigeminal neuralgia is usually a clinical diagnosis: recurrent unilateral electric shock-like pain, lasting a fraction of a second to 2 minutes, in one or more trigeminal divisions, typically triggered by innocuous stimuli.",
        },
        {
          type: "bullets",
          items: [
            "Trigeminal neuralgia is usually a clinical diagnosis: recurrent unilateral electric shock-like pain, lasting a fraction of a second to 2 minutes, in one or more trigeminal divisions, typically triggered by innocuous stimuli.",
            "All patients with suspected trigeminal neuralgia should have specialist assessment and MRI-based evaluation to exclude a secondary cause and to identify neurovascular compression where possible.",
            "Carbamazepine remains the key licensed first-line medicine in UK practice; oxcarbazepine is an accepted alternative and is often better tolerated.",
            "If first-line therapy is ineffective or poorly tolerated, early specialist referral is appropriate rather than prolonged uncontrolled escalation in primary care.",
            "Patients with classical trigeminal neuralgia and demonstrated neurovascular compression should be offered discussion of microvascular decompression if medically fit and willing, because it offers the best chance of durable pain freedom.",
            "Opioids are not indicated for routine trigeminal neuralgia management.",
            "Pain diaries, psychological support, medication counselling, and clear relapse plans are part of good care, not optional extras.",
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  1. Definitions, Classification, and Pathophysiology               */
    /* ------------------------------------------------------------------ */
    {
      id: "definitions-classification-pathophysiology",
      title: "Definitions, Classification, and Pathophysiology",
      content: [
        {
          type: "paragraph",
          text: "TN is a neuropathic facial pain syndrome characterised by brief, severe, shock-like unilateral facial pain in the distribution of the trigeminal nerve. The core mechanism in most cases is focal demyelination and hyperexcitability, usually caused by vascular compression at the trigeminal root entry zone.",
        },
        {
          type: "subheading",
          text: "Current classification",
        },
        {
          type: "bullets",
          items: [
            "Classical TN \u2014 trigeminal neuralgia due to neurovascular compression with morphological change of the nerve on imaging or at surgery.",
            "Secondary TN \u2014 trigeminal neuralgia caused by another structural lesion (MS plaque, CP angle tumour, vascular malformation).",
            "Idiopathic TN \u2014 clinical TN without a clear structural explanation on imaging or other diagnostic testing.",
          ],
        },
        {
          type: "paragraph",
          text: "The pain most commonly involves the maxillary (V2) and/or mandibular (V3) divisions. Isolated V1 disease is uncommon and should raise the threshold for assuming straightforward classical TN.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  2. Clinical Presentation and Positive Diagnosis                   */
    /* ------------------------------------------------------------------ */
    {
      id: "clinical-presentation",
      title: "Clinical Presentation and Positive Diagnosis",
      content: [
        {
          type: "table",
          headers: ["Feature", "Typical trigeminal neuralgia pattern"],
          rows: [
            [
              "Pain quality",
              "Electric shock-like, stabbing, sharp, or shooting; maximal at onset.",
            ],
            [
              "Attack duration",
              "Usually a fraction of a second to 2 minutes.",
            ],
            [
              "Distribution",
              "Strictly within one or more trigeminal divisions; most often V2 and/or V3.",
            ],
            [
              "Laterality",
              "Usually unilateral; bilateral disease is unusual and increases concern for a secondary cause.",
            ],
            [
              "Triggers",
              "Light touch, face washing, talking, chewing, brushing teeth, smiling, cold wind, or other innocuous stimuli.",
            ],
            [
              "Pattern",
              "Paroxysmal attacks with pain-free intervals; some patients later develop a persistent background ache between paroxysms.",
            ],
            [
              "Examination",
              "Often normal between attacks, though a trigger zone may be demonstrable.",
            ],
          ],
        },
        {
          type: "paragraph",
          text: "Features that make the diagnosis less secure include continuous burning pain without distinct paroxysms, prominent sensory loss, marked cranial autonomic features, fixed neurological deficits, purely intraoral triggers, or pain that radiates beyond the trigeminal territory.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  3. Red Flags and Important Alternative Diagnoses                  */
    /* ------------------------------------------------------------------ */
    {
      id: "red-flags-alternative-diagnoses",
      title: "Red Flags and Important Alternative Diagnoses",
      content: [
        {
          type: "table",
          headers: ["Red flag / atypical feature", "Why it matters / likely action"],
          rows: [
            [
              "Age <40 years at onset",
              "Higher likelihood of secondary TN; urgent MRI-focused evaluation and specialist review.",
            ],
            [
              "Objective sensory loss, corneal change, or other cranial nerve deficit",
              "Consider tumour, demyelination, trigeminal neuropathy, or other structural disease.",
            ],
            [
              "Bilateral symptoms",
              "Raises concern for multiple sclerosis or systemic disease.",
            ],
            [
              "Persistent pain dominating over paroxysms",
              "Reconsider painful trigeminal neuropathy, dental pathology, temporomandibular disease, or other facial pain syndromes.",
            ],
            [
              "Prominent autonomic features",
              "Consider SUNCT/SUNA or other trigeminal autonomic cephalalgias.",
            ],
            [
              "Only intraoral triggers or suspected dental source",
              "Dental review may be required before labelling as TN.",
            ],
            [
              "Rapid progression, weight loss, constitutional symptoms, cancer history, immunosuppression",
              "Consider structural lesion or other secondary process; escalate urgency.",
            ],
            [
              "Acute severe mood symptoms or suicidal thinking",
              "Medication burden and severe pain can destabilise mental health; assess urgently and manage alongside pain control.",
            ],
          ],
        },
        {
          type: "paragraph",
          text: "Key mimics include painful trigeminal neuropathy, dental pain (pulpitis, abscess, caries, cracked tooth), glossopharyngeal neuralgia, SUNCT/SUNA, primary stabbing headache, first bite syndrome, and cluster-tic syndrome.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  4. Investigations and Imaging Pathway                             */
    /* ------------------------------------------------------------------ */
    {
      id: "investigations-imaging-pathway",
      title: "Investigations and Imaging Pathway",
      content: [],
      subsections: [
        {
          id: "core-imaging-recommendation",
          title: "Core Imaging Recommendation",
          content: [
            {
              type: "paragraph",
              text: "Patients with suspected TN should undergo MRI-based assessment.",
            },
            {
              type: "bullets",
              items: [
                "Preferred study: brain MRI with and without contrast, plus vascular imaging (MRA where available).",
                "Use high-resolution thin-slice trigeminal sequences through the root entry zone and Meckel\u2019s cave when possible.",
                "If MRI is not feasible, CT/CTA and trigeminal reflex testing may help, but these are second-line substitutes.",
              ],
            },
          ],
        },
        {
          id: "what-imaging-is-trying-to-answer",
          title: "What Imaging Is Trying to Answer",
          content: [
            {
              type: "table",
              headers: ["Question", "Clinical relevance"],
              rows: [
                [
                  "Is there a structural cause?",
                  "Routine imaging may identify a structural cause in up to about 15% of patients.",
                ],
                [
                  "Is there neurovascular compression with nerve distortion?",
                  "Supports classification as classical TN and helps decide whether MVD is realistic.",
                ],
                [
                  "Is there demyelination or cerebellopontine angle pathology?",
                  "Supports secondary TN and may alter treatment.",
                ],
                [
                  "Is the pattern atypical or non-trigeminal?",
                  "Helps avoid mislabelling facial pain syndromes as TN.",
                ],
              ],
            },
          ],
        },
        {
          id: "role-of-other-tests",
          title: "Role of Other Tests",
          content: [
            {
              type: "bullets",
              items: [
                "Trigeminal reflex testing can help distinguish secondary TN from classical TN when imaging is nondiagnostic.",
                "Dental examination and imaging are appropriate if triggers are purely intraoral.",
                "Routine blood tests are not diagnostic but baseline tests are needed before starting carbamazepine.",
              ],
            },
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  5. Holistic Management Principles                                 */
    /* ------------------------------------------------------------------ */
    {
      id: "holistic-management-principles",
      title: "Holistic Management Principles",
      content: [
        {
          type: "bullets",
          items: [
            "Treat pain promptly, but pair symptom control with accurate phenotyping and imaging.",
            "Assess impact on eating, drinking, oral hygiene, speaking, sleep, mobility, work, and mood at every review.",
            "Screen for depression and anxiety, and ask specifically about hopelessness or self-harm thoughts in severe disease.",
            "Use a pain diary to record daily pain severity, number of attacks, triggers, breakthrough medication, and adverse effects.",
            "Explain the titration plan clearly; many drug failures are really failures of tolerability, dose escalation, or understanding.",
            "Avoid opioids for routine TN management.",
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  6. Pharmacological Treatment                                      */
    /* ------------------------------------------------------------------ */
    {
      id: "pharmacological-treatment",
      title: "Pharmacological Treatment",
      content: [],
      subsections: [
        {
          id: "first-line-medicines",
          title: "First-line Medicines",
          content: [
            {
              type: "table",
              headers: [
                "Medicine",
                "Typical starting dose",
                "Typical maintenance range",
                "Key strengths",
                "Key cautions",
              ],
              rows: [
                [
                  "Carbamazepine",
                  "100 mg once or twice daily",
                  "Usually 600\u2013800 mg/day; some UK guidance allows up to 1200\u20131600 mg/day",
                  "Licensed in UK; strongest evidence base",
                  "Drug interactions, sedation, dizziness, hyponatraemia, rash, blood dyscrasias, hepatic effects",
                ],
                [
                  "Oxcarbazepine",
                  "150\u2013300 mg twice daily",
                  "Usually 1200\u20131800 mg/day",
                  "Similar efficacy; often fewer interaction problems",
                  "Hyponatraemia, dizziness, rash, cross-reactivity with carbamazepine",
                ],
              ],
            },
          ],
        },
        {
          id: "carbamazepine-prescribing-essentials",
          title: "Carbamazepine Prescribing Essentials",
          content: [
            {
              type: "table",
              headers: ["Domain", "Key prescribing points"],
              rows: [
                [
                  "Starting and titration",
                  "100 mg once or twice daily, increase by 100\u2013200 mg every 1\u20132 weeks according to response and tolerability.",
                ],
                [
                  "Contraindications",
                  "Hypersensitivity, atrioventricular block, prior bone marrow depression, hepatic porphyria, current/recent MAOI use.",
                ],
                [
                  "Common adverse effects",
                  "Nausea, vomiting, sedation, dizziness, diplopia, blurred vision, ataxia, lethargy, rash, hyponatraemia.",
                ],
                [
                  "Serious adverse effects",
                  "Agranulocytosis, aplastic anaemia, severe cutaneous adverse reactions, hepatic dysfunction, severe hypersensitivity.",
                ],
                [
                  "Monitoring",
                  "Baseline and periodic FBC and LFTs; serum drug levels not routinely required unless toxicity or adherence uncertain.",
                ],
                [
                  "Genetics",
                  "Screen for HLA-B*15:02 in at-risk East/South-East Asian ancestry groups.",
                ],
                [
                  "Pregnancy",
                  "Discuss teratogenic risk, contraception, and specialist advice.",
                ],
              ],
            },
          ],
        },
        {
          id: "alternatives-and-add-on-options",
          title: "Alternatives and Add-on Options",
          content: [
            {
              type: "table",
              headers: [
                "Medicine",
                "Typical role",
                "Usual dose range",
                "Main limitations",
              ],
              rows: [
                [
                  "Lamotrigine",
                  "Add-on or switch option",
                  "Slow titration; often up to 200 mg twice daily",
                  "Very slow titration; rash risk",
                ],
                [
                  "Gabapentin",
                  "Alternative or add-on",
                  "100\u2013300 mg daily up to 900\u20132400 mg/day",
                  "Sedation, dizziness, weight gain; weaker evidence",
                ],
                [
                  "Pregabalin",
                  "Alternative or add-on",
                  "150\u2013600 mg/day",
                  "Sedation, dizziness, weight gain; less robust evidence",
                ],
                [
                  "Baclofen",
                  "Add-on or alternative",
                  "5\u201310 mg daily up to 60\u201380 mg/day",
                  "Sedation, nausea; slow withdrawal required",
                ],
                [
                  "Botulinum toxin A",
                  "Selected specialist add-on",
                  "Variable dose/technique",
                  "Limited evidence; not routine",
                ],
                [
                  "Phenytoin / fosphenytoin",
                  "Rescue or specialist use",
                  "IV or oral specialist dosing",
                  "Monitoring burden, interactions, toxicity",
                ],
              ],
            },
          ],
        },
        {
          id: "medicines-not-routinely-recommended",
          title: "Medicines Not Routinely Recommended",
          content: [
            {
              type: "bullets",
              items: [
                "Opioids are not indicated for routine TN management.",
                "Do not introduce other drug treatments in primary care without specialist advice if carbamazepine is contraindicated, ineffective, or not tolerated.",
              ],
            },
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  7. Acute Rescue and Bridging Therapy                              */
    /* ------------------------------------------------------------------ */
    {
      id: "acute-rescue-bridging-therapy",
      title: "Acute Rescue and Bridging Therapy",
      content: [
        {
          type: "table",
          headers: ["Option", "Usual place in care", "Comments"],
          rows: [
            [
              "Short-term dose escalation of preventive drug",
              "First practical step if not at maximum tolerated dose",
              "Often easiest strategy for breakthrough flares.",
            ],
            [
              "Intranasal or IV lidocaine",
              "Specialist / acute-care rescue",
              "Rapid but short-lived relief.",
            ],
            [
              "IV phenytoin or fosphenytoin",
              "Specialist rescue",
              "Severe acute exacerbations or hospital settings.",
            ],
            [
              "IV lacosamide",
              "Specialist rescue",
              "Emerging acute-care option.",
            ],
            [
              "Peripheral nerve block",
              "Selected specialist or dental/orofacial pain pathway",
              "May help with trigger-zone dominant disease.",
            ],
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  8. Surgical Management                                            */
    /* ------------------------------------------------------------------ */
    {
      id: "surgical-management",
      title: "Surgical Management",
      content: [
        {
          type: "table",
          headers: [
            "Procedure",
            "Best suited to",
            "Advantages",
            "Main trade-offs",
          ],
          rows: [
            [
              "Microvascular decompression (MVD)",
              "Classical TN with neurovascular compression",
              "Best chance of long-term pain freedom; preserves nerve function",
              "Requires craniotomy; small but real neurosurgical risk",
            ],
            [
              "Radiofrequency thermocoagulation / balloon compression / glycerol rhizolysis",
              "Patients unsuitable for open surgery",
              "Less invasive; often effective quickly",
              "Higher facial numbness rate; more recurrence",
            ],
            [
              "Stereotactic radiosurgery",
              "Higher operative risk patients",
              "Non-incisional option",
              "Pain relief may be delayed; recurrence possible",
            ],
            [
              "Procedure for underlying lesion",
              "Secondary TN due to tumour/AVM/other",
              "May address root cause",
              "Depends on lesion type",
            ],
          ],
        },
        {
          type: "subheading",
          text: "Practical consensus",
        },
        {
          type: "bullets",
          items: [
            "European and UK guidance recommend MVD as first-line surgery in classical TN when neurovascular compression is demonstrated and patient is medically fit.",
            "When MRI does not demonstrate neurovascular compression, neuroablative procedures are often preferred.",
            "Patients should receive written information on benefits, recurrence risk, sensory consequences, and postoperative expectations.",
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  9. Follow-up and Monitoring Pathway                               */
    /* ------------------------------------------------------------------ */
    {
      id: "follow-up-monitoring-pathway",
      title: "Follow-up and Monitoring Pathway",
      content: [
        {
          type: "table",
          headers: ["At review, ask about", "What to do"],
          rows: [
            [
              "Current dose and titration understanding",
              "Confirm exactly what patient is taking.",
            ],
            [
              "Pain control",
              "Assess attack frequency, severity, triggers, background pain, and functional impact.",
            ],
            [
              "Adverse effects",
              "Ask about dizziness, sedation, nausea, diplopia, rash, low mood, confusion.",
            ],
            [
              "Mood and coping",
              "Screen for anxiety, depression, hopelessness, social withdrawal.",
            ],
            [
              "Blood-test or safety issues",
              "Review FBC/LFT; ask about fever, sore throat, rash, bruising, jaundice.",
            ],
            [
              "Need for referral escalation",
              "Refer if pain uncontrolled at maximum tolerated dose, severe disability, or atypical features.",
            ],
          ],
        },
        {
          type: "subheading",
          text: "Suggested follow-up timing",
        },
        {
          type: "bullets",
          items: [
            "Early review after starting or changing treatment.",
            "Stable patients still require periodic review.",
            "If fully remitted, gradual dose reduction after sustained pain-free period (at least 4 weeks).",
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  10. Practical Care Pathway by Setting                             */
    /* ------------------------------------------------------------------ */
    {
      id: "practical-care-pathway",
      title: "Practical Care Pathway by Setting",
      content: [
        {
          type: "subheading",
          text: "Primary care responsibilities",
        },
        {
          type: "bullets",
          items: [
            "Recognise likely TN, document triggers and distribution, check for red flags.",
            "Start carbamazepine if appropriate, provide titration instructions, organise baseline blood tests.",
            "Refer for specialist assessment and imaging.",
            "Do not rely on opioids or repeated non-specific analgesics.",
          ],
        },
        {
          type: "subheading",
          text: "Specialist responsibilities",
        },
        {
          type: "bullets",
          items: [
            "Confirm phenotype, arrange/interpret imaging, distinguish classical/secondary/idiopathic TN.",
            "Optimise second-line/add-on medicines and discuss rescue options.",
            "Refer promptly to neurosurgery when medical therapy is inadequate.",
            "Coordinate dental, pain, psychology, and neurosurgical input.",
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  11. Special Situations                                            */
    /* ------------------------------------------------------------------ */
    {
      id: "special-situations",
      title: "Special Situations",
      content: [
        {
          type: "subheading",
          text: "Pregnancy and women of childbearing potential",
        },
        {
          type: "paragraph",
          text: "Carbamazepine has known teratogenic risk; oxcarbazepine pregnancy risk remains less certain. Individualise decisions with counselling and specialist input.",
        },
        {
          type: "subheading",
          text: "Older adults",
        },
        {
          type: "paragraph",
          text: "More vulnerable to dizziness, ataxia, hyponatraemia, polypharmacy interactions, and falls. Slower titration and closer monitoring.",
        },
        {
          type: "subheading",
          text: "Multiple sclerosis or other secondary TN",
        },
        {
          type: "paragraph",
          text: "Same broad pharmacological principles; must also address the underlying disease process.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  12. Integrated Summary                                            */
    /* ------------------------------------------------------------------ */
    {
      id: "integrated-summary",
      title: "Integrated Summary",
      content: [
        {
          type: "table",
          headers: [
            "Area",
            "NICE/UK practice",
            "European guidance",
            "American guidance",
          ],
          rows: [
            [
              "Diagnosis",
              "Positive clinical diagnosis plus specialist referral; MRI expected",
              "High-resolution MRI/MRA strongly emphasised",
              "Routine imaging may be considered",
            ],
            [
              "First-line drugs",
              "Carbamazepine first; oxcarbazepine acceptable alternative",
              "Both strongly supported",
              "Carbamazepine offered; oxcarbazepine considered",
            ],
            [
              "Second-line drugs",
              "Usually specialist-led",
              "Lamotrigine, gabapentin, pregabalin, baclofen, phenytoin, BTX-A may be used",
              "Baclofen and lamotrigine have some support",
            ],
            [
              "Surgery",
              "Early neurosurgical access encouraged",
              "MVD first-line in classical TN",
              "Early surgical therapy may be considered",
            ],
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  13. References                                                    */
    /* ------------------------------------------------------------------ */
    {
      id: "references",
      title: "References",
      content: [
        {
          type: "bullets",
          items: [
            "NICE Clinical Knowledge Summaries. Trigeminal neuralgia. Accessed March 2026.",
            "Royal College of Surgeons / Faculty of Dental Surgery. Guidelines for TN management. 2021.",
            "Bendtsen L, et al. EAN guideline on trigeminal neuralgia. Eur J Neurol. 2019.",
            "Gronseth G, et al. AAN diagnostic evaluation and treatment of TN. Neurology. 2008; reaffirmed 2024.",
            "Chong MS, et al. Guidelines for TN management. Cleveland Clin J Med. 2023.",
            "MHRA Drug Safety Update. Antiepileptic drugs in pregnancy. 2021.",
          ],
        },
      ],
    },
  ],
};
