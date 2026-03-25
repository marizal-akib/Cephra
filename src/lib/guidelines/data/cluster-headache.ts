import type { Guideline } from "../types";

export const clusterHeadache: Guideline = {
  slug: "cluster-headache",
  title: "Adult Cluster Headache",
  subtitle:
    "Diagnosis and management guidance synthesised from NICE, European, American and VA/DoD sources",
  category: "primary-headaches",
  tags: [
    "cluster",
    "TAC",
    "trigeminal",
    "autonomic",
    "oxygen",
    "sumatriptan",
    "verapamil",
    "preventive",
  ],
  sourceDocument: "Cluster headache.docx",
  sections: [
    /* ------------------------------------------------------------------ */
    /*  1. Executive Summary                                              */
    /* ------------------------------------------------------------------ */
    {
      id: "executive-summary",
      title: "Executive Summary",
      content: [
        {
          type: "callout",
          variant: "info",
          title: "Practice synthesis",
          text: "Cluster headache is a clinical diagnosis, but secondary causes matter, especially at first presentation, with atypical features, abnormal examination, pituitary symptoms, or poor response to standard therapy.",
        },
        {
          type: "bullets",
          items: [
            "Cluster headache is a clinical diagnosis, but secondary causes matter, especially at first presentation, with atypical features, abnormal examination, pituitary symptoms, or poor response to standard therapy.",
            "Acute first-line treatment is high-flow 100% oxygen via non-rebreather mask and/or a rapid-acting triptan, usually subcutaneous sumatriptan.",
            "Preventive therapy should start as soon as a bout is recognised. Verapamil remains the practical first-line preventive agent across most specialist pathways.",
            "Transitional therapy is often needed while prevention takes effect; oral corticosteroids or greater occipital nerve block are the main options.",
            "For refractory disease, consider lithium, topiramate, galcanezumab for episodic cluster headache, and specialist interventional options.",
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  2. Diagnosis and Classification                                   */
    /* ------------------------------------------------------------------ */
    {
      id: "diagnosis-and-classification",
      title: "Diagnosis and Classification",
      content: [
        {
          type: "paragraph",
          text: "Cluster headache is the commonest trigeminal autonomic cephalalgia (TAC). It presents with recurrent attacks of excruciating unilateral orbital, supraorbital and/or temporal pain, accompanied by ipsilateral cranial autonomic features and/or marked restlessness or agitation. Diagnosis is clinical and should be anchored to ICHD-3 criteria.",
        },
        {
          type: "table",
          headers: [
            "Feature",
            "Typical cluster headache pattern",
            "Comment",
          ],
          rows: [
            [
              "Pain",
              "Strictly unilateral, orbital/supraorbital/temporal; very severe",
              "Sharp, stabbing, boring or burning pain are all described.",
            ],
            [
              "Duration",
              "15\u2013180 minutes untreated",
              "Shorter or longer attacks suggest a mimic or atypical cluster syndrome.",
            ],
            [
              "Frequency",
              "1 every other day to 8/day",
              "Many patients have 1\u20133 attacks/day during an active bout.",
            ],
            [
              "Associated features",
              "Ipsilateral autonomic symptoms and/or agitation",
              "Restlessness helps separate cluster headache from migraine.",
            ],
            [
              "Rhythm",
              "Circadian/circannual pattern common",
              "Nocturnal attacks are frequent.",
            ],
            [
              "Course",
              "Episodic or chronic",
              "Episodic disease has remissions \u22653 months; chronic disease has remissions <3 months or none.",
            ],
          ],
        },
      ],
      subsections: [
        {
          id: "ichd3-definitions",
          title: "ICHD-3 Practical Definitions",
          content: [
            {
              type: "bullets",
              items: [
                "Episodic cluster headache: bouts lasting 7 days to 1 year, with pain-free remissions of at least 3 months.",
                "Chronic cluster headache: attacks for at least 1 year without remission, or with remissions shorter than 3 months.",
                "Probable cluster headache may be considered when the pattern is strongly suggestive but one diagnostic element is missing.",
              ],
            },
          ],
        },
        {
          id: "alternative-diagnosis",
          title: "When to Suspect an Alternative Diagnosis",
          content: [
            {
              type: "bullets",
              items: [
                "Atypical duration/frequency, absence of characteristic autonomic symptoms/restlessness, or continuous background pain.",
                "Abnormal neurologic examination, persistent Horner syndrome between attacks, focal deficits, pituitary/endocrine symptoms, fever, dental/sinus features, or ocular pain/redness suggestive of glaucoma.",
                "Change in phenotype, thunderclap onset, jaw claudication, or poor response to standard treatment.",
              ],
            },
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  3. Imaging and Evaluation Strategy                                */
    /* ------------------------------------------------------------------ */
    {
      id: "imaging-and-evaluation",
      title: "Imaging and Evaluation Strategy",
      content: [
        {
          type: "paragraph",
          text: "Guidance differs slightly on how broadly neuroimaging should be used. NICE advises discussing imaging for a first bout with a headache specialist and advises against imaging solely for reassurance. European and many specialist sources favour MRI at initial evaluation because structural lesions, especially pituitary and parasellar disease, can mimic cluster headache.",
        },
        {
          type: "callout",
          variant: "info",
          title: "Pragmatic imaging recommendation",
          text: "Obtain MRI brain with contrast, including focused pituitary/parasellar assessment if possible, at first presentation of suspected cluster headache or when the diagnosis is uncertain. Use urgent vascular or alternative imaging where clinically indicated, such as suspected carotid dissection, aneurysm, cerebral venous thrombosis, or pituitary apoplexy. Repeat or extend investigations when the phenotype is atypical, examination is abnormal, or response to standard therapy is unexpectedly poor.",
        },
        {
          type: "bullets",
          items: [
            "Obtain MRI brain with contrast, including focused pituitary/parasellar assessment if possible, at first presentation of suspected cluster headache or when the diagnosis is uncertain.",
            "Use urgent vascular or alternative imaging where clinically indicated, such as suspected carotid dissection, aneurysm, cerebral venous thrombosis, or pituitary apoplexy.",
            "Repeat or extend investigations when the phenotype is atypical, examination is abnormal, or response to standard therapy is unexpectedly poor.",
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  4. Acute Treatment of Attacks                                     */
    /* ------------------------------------------------------------------ */
    {
      id: "acute-treatment",
      title: "Acute Treatment of Attacks",
      content: [
        {
          type: "paragraph",
          text: "All major guidelines agree that treatment must act quickly because cluster attacks escalate rapidly. Oral simple analgesics, NSAIDs, and oral triptans are generally too slow or ineffective.",
        },
        {
          type: "table",
          headers: ["Option", "How to use it", "Strengths", "Key cautions"],
          rows: [
            [
              "100% oxygen",
              "\u226512 L/min via non-rebreather for ~15 min; some benefit from 12\u201315 L/min or demand-valve systems",
              "Fast, safe, non-systemic",
              "Practical access/logistics; use caution in severe COPD and around smoking/fire risk.",
            ],
            [
              "Sumatriptan SC",
              "6 mg subcutaneously at attack onset",
              "Most consistently effective drug option",
              "Avoid in significant ischaemic vascular disease, uncontrolled hypertension, or recent ergot/triptan overlap.",
            ],
            [
              "Zolmitriptan intranasal",
              "5\u201310 mg intranasally",
              "Evidence-based non-injectable option",
              "Slower than SC sumatriptan; same triptan cautions.",
            ],
            [
              "Sumatriptan intranasal",
              "20 mg intranasally",
              "Useful practical alternative in UK pathways",
              "Evidence base is less robust than SC sumatriptan or intranasal zolmitriptan.",
            ],
          ],
        },
        {
          type: "bullets",
          items: [
            "Offer both oxygen and a triptan strategy where feasible.",
            "Ensure adequate home access to oxygen and enough triptan supply for the expected daily attack burden.",
            "NICE specifically advises against paracetamol, NSAIDs, opioids, ergots and oral triptans for routine acute cluster headache treatment.",
          ],
        },
      ],
      subsections: [
        {
          id: "second-line-acute",
          title: "Second-Line or Specialist Acute Options",
          content: [
            {
              type: "bullets",
              items: [
                "Intranasal lidocaine may help some patients when triptans are contraindicated or poorly tolerated.",
                "Dihydroergotamine is a specialist option, especially in monitored or inpatient settings, but should not be used within 24 hours of a triptan.",
                "Octreotide is occasionally used when vasoconstrictors are unsuitable.",
                "Noninvasive vagus nerve stimulation has some evidence for acute episodic cluster headache, but access varies.",
              ],
            },
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  5. Transitional and Preventive Treatment                          */
    /* ------------------------------------------------------------------ */
    {
      id: "transitional-and-preventive",
      title: "Transitional and Preventive Treatment",
      content: [
        {
          type: "paragraph",
          text: "Because patients may have multiple attacks every day, preventive therapy should start as soon as an active cluster bout is recognised.",
        },
      ],
      subsections: [
        {
          id: "transitional",
          title: "Transitional Treatment",
          content: [
            {
              type: "table",
              headers: ["Option", "Typical role", "Practical points"],
              rows: [
                [
                  "Prednisolone / prednisone",
                  "Bridge while verapamil is titrated, or stand-alone therapy for short infrequent bouts",
                  "EAN supports at least 100 mg oral or up to 500 mg IV methylprednisolone equivalent over 5 days, then taper. Short courses only.",
                ],
                [
                  "Greater occipital nerve block",
                  "Bridge or adjunct, especially for severe bouts or when oral steroids are unsuitable",
                  "AHS gives suboccipital steroid injection the strongest preventive evidence grade; EAN recommends GON block.",
                ],
              ],
            },
          ],
        },
        {
          id: "longer-term-prevention",
          title: "Longer-Term Prevention",
          content: [
            {
              type: "table",
              headers: [
                "Agent",
                "Suggested place in pathway",
                "Monitoring / cautions",
              ],
              rows: [
                [
                  "Verapamil",
                  "Practical first-line preventive for most episodic and chronic cluster headache",
                  "Baseline ECG; repeat ECG after higher-dose increases, especially above 480 mg/day. Watch for bradycardia, heart block, hypotension, oedema and constipation.",
                ],
                [
                  "Lithium",
                  "Alternative when verapamil fails or is contraindicated, especially in chronic disease",
                  "Requires renal, thyroid and electrolyte monitoring, plus lithium levels and ECG.",
                ],
                [
                  "Topiramate",
                  "Alternative or add-on option when first-line therapy is inadequate",
                  "Cognitive adverse effects, paresthesia, mood effects, teratogenicity, nephrolithiasis risk.",
                ],
                [
                  "Galcanezumab",
                  "Option for episodic cluster headache when conventional prevention is ineffective or poorly tolerated",
                  "FDA-approved for episodic cluster headache in the US; evidence for chronic cluster headache is negative.",
                ],
                [
                  "Melatonin",
                  "Lower-risk adjunct in selected patients, often for nocturnal pattern",
                  "Evidence is limited and effect size is modest.",
                ],
              ],
            },
          ],
        },
        {
          id: "verapamil-pathway",
          title: "How to Use Verapamil",
          content: [
            {
              type: "bullets",
              items: [
                "Typical starting dose is 80 mg three times daily, with gradual upward titration.",
                "Most patients respond in the 240\u2013480 mg/day range, but some require higher specialist-supervised doses.",
                "Bridge with prednisolone or GON block while verapamil is titrated over 1\u20133 weeks.",
                "Taper preventive treatment once the bout has clearly ended; do not stop high-dose verapamil abruptly.",
              ],
            },
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  6. Refractory Cluster Headache                                    */
    /* ------------------------------------------------------------------ */
    {
      id: "refractory-disease",
      title: "Refractory Cluster Headache",
      content: [
        {
          type: "bullets",
          items: [
            "Re-check the diagnosis and imaging, review medication adherence, and exclude medication overuse, secondary causes and mixed headache phenotypes.",
            "Escalate to a headache specialist if attacks persist despite adequate trials.",
            "Noninvasive vagus nerve stimulation, sphenopalatine ganglion stimulation and occipital nerve stimulation remain specialist options.",
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  7. Special Situations and Counselling                             */
    /* ------------------------------------------------------------------ */
    {
      id: "special-situations",
      title: "Special Situations and Counselling",
      content: [
        {
          type: "bullets",
          items: [
            "Pregnancy: seek specialist advice. Treatment selection must balance maternal disability with fetal safety; routine ergot use is contraindicated.",
            "Smoking and alcohol: smoking is strongly associated with cluster headache epidemiologically, and alcohol can trigger attacks during an active bout. Advise complete alcohol avoidance during a bout and support smoking cessation.",
            "Mental health: cluster headache carries a substantial burden of depression, sleep disruption and suicidal ideation. Ask directly about mood and safety.",
            "Supply planning: patients often need home oxygen arrangements, written instructions, and enough acute medication to match their usual maximum attack frequency.",
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  8. Guideline Comparison                                           */
    /* ------------------------------------------------------------------ */
    {
      id: "guideline-comparison",
      title: "Guideline Comparison",
      content: [
        {
          type: "table",
          headers: [
            "Topic",
            "NICE 2025",
            "EAN 2023",
            "AHS 2016",
            "VA/DoD 2023",
          ],
          rows: [
            [
              "Diagnosis",
              "Clinical diagnosis; discuss imaging for first bout",
              "Clinical diagnosis; specialist imaging practice",
              "Treatment-focused guideline",
              "Cluster section within broader headache CPG",
            ],
            [
              "Acute oxygen",
              "Offer; 100% \u226512 L/min; arrange home oxygen",
              "Strong recommendation",
              "Level A",
              "Weak recommendation",
            ],
            [
              "Acute triptan",
              "SC or nasal triptan; avoid oral triptans",
              "Strong for 6 mg SC sumatriptan",
              "Level A for SC sumatriptan and IN zolmitriptan",
              "Weak for SC sumatriptan 6 mg or IN zolmitriptan 10 mg",
            ],
            [
              "Verapamil",
              "Consider; specialist advice and ECG support",
              "Recommended; at least 240 mg/day",
              "Commonly used, lower evidence grade",
              "Insufficient evidence for or against",
            ],
            [
              "Steroids / GON block",
              "Not detailed in main cluster section",
              "Recommended",
              "Suboccipital steroid injection Level A prevention",
              "Used in practice, not principal emphasis",
            ],
            [
              "Galcanezumab",
              "Not incorporated into cluster section",
              "Alternative; episodic cluster only",
              "Not available at time of guideline",
              "Suggest for episodic CH; against for chronic CH",
            ],
          ],
        },
        {
          type: "paragraph",
          text: "Key reconciliation point: The main area of disagreement is verapamil. NICE, EAN and most specialist headache services continue to use it as first-line prevention, whereas the 2023 VA/DoD guideline judged the trial evidence insufficient. In real-world practice, verapamil remains the most coherent first preventive choice provided ECG-based safety monitoring is built in.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  9. Suggested Practical Adult Pathway                              */
    /* ------------------------------------------------------------------ */
    {
      id: "practical-pathway",
      title: "Suggested Practical Adult Pathway",
      content: [
        {
          type: "numbered",
          items: [
            "Confirm the phenotype is compatible with cluster headache and look for red flags or atypical features.",
            "Arrange MRI brain with contrast at first presentation or if any concern for a secondary cause.",
            "Start acute treatment immediately: high-flow oxygen and/or subcutaneous sumatriptan; add intranasal triptan strategy if injections are not acceptable.",
            "Begin prevention the same day: verapamil for most patients; add prednisolone bridge or GON block if attacks are frequent or severe.",
            "If control is inadequate, escalate to specialist-guided lithium, topiramate, galcanezumab for episodic cluster headache, or interventional options.",
            "Reassess attack diary, ECGs, adverse effects and mental health at each review. Taper prevention after the bout ends.",
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  10. References                                                    */
    /* ------------------------------------------------------------------ */
    {
      id: "references",
      title: "References",
      content: [
        {
          type: "bullets",
          items: [
            "NICE. Headaches in over 12s: diagnosis and management (CG150). Published 2012; last updated 3 June 2025.",
            "May A, et al. EAN guidelines on the treatment of cluster headache. Eur J Neurol. 2023;30(10).",
            "Robbins MS, et al. Treatment of Cluster Headache: AHS Evidence-Based Guidelines. Headache. 2016;56(7):1093-1106.",
            "VA/DoD. Clinical Practice Guideline for the Management of Headache. September 2023.",
            "ICHD-3, International Headache Society.",
          ],
        },
      ],
    },
  ],
};
