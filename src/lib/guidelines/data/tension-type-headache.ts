import type { Guideline } from "../types";

export const tensionTypeHeadache: Guideline = {
  slug: "tension-type-headache",
  title: "Tension-Type Headache in Adults",
  subtitle:
    "Evidence-based guideline summary covering diagnosis, acute treatment, prevention, and practical implementation",
  category: "primary-headaches",
  tags: [
    "tension-type",
    "TTH",
    "bilateral",
    "pressing",
    "amitriptyline",
    "analgesic",
    "chronic",
    "episodic",
  ],
  sourceDocument: "Tension type headache.docx",
  sections: [
    /* ------------------------------------------------------------------ */
    /*  1. At-a-Glance Recommendations                                    */
    /* ------------------------------------------------------------------ */
    {
      id: "at-a-glance",
      title: "At-a-Glance Recommendations",
      content: [
        {
          type: "table",
          headers: ["Core diagnosis", "Core management"],
          rows: [
            [
              "Bilateral, pressing/tightening, mild\u2013moderate headache; not aggravated by routine activity; no nausea/vomiting; at most one of photophobia or phonophobia.",
              "Acute first line: ibuprofen, aspirin, or paracetamol/acetaminophen; avoid opioids routinely.",
            ],
            [
              "If any migrainous features are present in chronic daily headache, classify and manage as chronic migraine rather than chronic TTH.",
              "Prevention is indicated when attacks are frequent, prolonged, disabling, or acute therapy is overused/insufficient.",
            ],
            [
              "Do not image solely for reassurance when the clinical picture is typical and examination is normal.",
              "For chronic TTH, amitriptyline is the best-supported pharmacologic preventive option; behavioural therapy and exercise/physical therapy are reasonable non-drug options.",
            ],
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  2. Scope and Positioning                                          */
    /* ------------------------------------------------------------------ */
    {
      id: "scope-and-positioning",
      title: "Scope and Positioning",
      content: [
        {
          type: "paragraph",
          text: "This document is a practical, clinician-facing summary of tension-type headache (TTH) in adults. It synthesises the current NICE headache guideline for people aged 12 years and over, the latest U.S. VA/DoD headache guideline, the longstanding European EFNS guidance, ICHD-3 diagnostic criteria, and recent evidence reviews. It is intended to support day-to-day assessment and treatment rather than replace formal guideline documents.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  3. Definition and Classification                                  */
    /* ------------------------------------------------------------------ */
    {
      id: "definition-and-classification",
      title: "Definition and Classification",
      content: [
        {
          type: "paragraph",
          text: "TTH is a primary headache disorder characterised by bilateral, pressing or tightening head pain of mild to moderate intensity, typically without nausea or vomiting and without clear aggravation by routine physical activity. ICHD-3 classifies TTH into infrequent episodic, frequent episodic, and chronic forms.",
        },
        {
          type: "table",
          headers: ["Subtype", "Frequency", "Key note"],
          rows: [
            [
              "Infrequent episodic TTH",
              "<1 day/month on average",
              "Usually low disability; often managed with acute measures only.",
            ],
            [
              "Frequent episodic TTH",
              "1\u201314 days/month on average for >3 months",
              "Common threshold where preventive strategies become useful.",
            ],
            [
              "Chronic TTH",
              "\u226515 days/month for >3 months",
              "High disability; assess carefully for migraine overlap and medication overuse.",
            ],
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  4. Epidemiology and Pathophysiology                               */
    /* ------------------------------------------------------------------ */
    {
      id: "epidemiology-and-pathophysiology",
      title: "Epidemiology and Pathophysiology",
      content: [
        {
          type: "paragraph",
          text: "TTH is the most prevalent primary headache disorder. Most cases are episodic; chronic TTH is much less common but carries disproportionate disability. Current understanding supports a mixed peripheral\u2013central model: pericranial myofascial tenderness and trigger-point activity appear more relevant in episodic disease, while central sensitisation and altered pain modulation become more important in chronic TTH.",
        },
        {
          type: "bullets",
          items: [
            "Pericranial muscle tenderness is the most consistent examination abnormality.",
            "Stress, poor sleep, fatigue, dehydration, and musculoskeletal strain are commonly reported triggers or exacerbating factors.",
            "Migraine and TTH frequently coexist; this is one of the main diagnostic challenges in practice.",
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  5. Diagnostic Approach                                            */
    /* ------------------------------------------------------------------ */
    {
      id: "diagnostic-approach",
      title: "Diagnostic Approach",
      content: [],
      subsections: [
        {
          id: "typical-clinical-features",
          title: "Typical Clinical Features",
          content: [
            {
              type: "bullets",
              items: [
                "Bilateral headache.",
                "Pressing, tightening, or band-like quality; usually non-pulsatile.",
                "Mild to moderate intensity.",
                "Not worsened by walking, stairs, or other routine activity.",
                "No nausea or vomiting; at most one of photophobia or phonophobia.",
                "Pericranial tenderness may be present on palpation of the frontal, temporal, masseter, sternocleidomastoid, splenius, or trapezius muscles.",
              ],
            },
          ],
        },
        {
          id: "ichd3-criteria",
          title: "ICHD-3 Diagnostic Criteria in Practice",
          content: [
            {
              type: "table",
              headers: ["Criterion", "Practical point"],
              rows: [
                [
                  "Duration",
                  "30 minutes to 7 days for episodic TTH; chronic TTH may last hours to days or be unremitting.",
                ],
                [
                  "Pain features",
                  "At least 2 of: bilateral, pressing/tightening, mild/moderate intensity, not aggravated by routine activity.",
                ],
                [
                  "Associated features",
                  "No nausea/vomiting; no more than one of photophobia or phonophobia; chronic TTH allows mild nausea only if photophobia/phonophobia are not both present.",
                ],
                [
                  "Exclusion",
                  "Not better accounted for by another headache diagnosis or secondary cause.",
                ],
              ],
            },
          ],
        },
        {
          id: "distinguishing-from-migraine",
          title: "Distinguishing TTH from Migraine",
          content: [
            {
              type: "bullets",
              items: [
                "If headache is disabling, unilateral, pulsatile, aggravated by activity, or associated with nausea, definite photophobia plus phonophobia, osmophobia, or aura, think migraine first.",
                "In chronic daily headache, any clear migraine features favour a diagnosis of chronic migraine over chronic TTH.",
                "Many \u2018tension headaches\u2019 seen in clinic are actually migraine, medication overuse headache, or mixed headache phenotypes.",
              ],
            },
          ],
        },
        {
          id: "when-to-investigate",
          title: "When to Investigate",
          content: [
            {
              type: "table",
              headers: ["Investigate / refer if\u2026", "Examples"],
              rows: [
                [
                  "Atypical headache phenotype",
                  "Abrupt onset, focal/unilateral pattern, progressive course, severe intensity, positional worsening, exertional precipitation.",
                ],
                [
                  "Associated neurologic/systemic features",
                  "Visual loss, focal weakness, fever, meningism, reduced consciousness, cancer history, immunosuppression.",
                ],
                [
                  "Risk-context features",
                  "Age >50 years at new onset, anticoagulation, pregnancy/postpartum, significant trauma.",
                ],
              ],
            },
            {
              type: "paragraph",
              text: "In a typical presentation with normal examination, neuroimaging is not required. NICE specifically advises against neuroimaging solely for reassurance.",
            },
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  6. Acute Treatment                                                */
    /* ------------------------------------------------------------------ */
    {
      id: "acute-treatment",
      title: "Acute Treatment",
      content: [
        {
          type: "paragraph",
          text: "Acute treatment is aimed at prompt and sustained pain relief while minimising medication-overuse risk. For most patients with episodic TTH, treatment is self-directed with simple analgesics.",
        },
      ],
      subsections: [
        {
          id: "first-line-acute",
          title: "First-Line Acute Options",
          content: [
            {
              type: "table",
              headers: ["Drug", "Typical adult dose", "Notes"],
              rows: [
                [
                  "Ibuprofen",
                  "400\u2013600 mg",
                  "Good evidence base; often first choice if no NSAID contraindication.",
                ],
                [
                  "Aspirin",
                  "500\u20131000 mg",
                  "Avoid in under-16s; consider GI risk.",
                ],
                [
                  "Naproxen sodium",
                  "220\u2013550 mg",
                  "Useful when longer duration is desired.",
                ],
                [
                  "Diclofenac",
                  "25\u2013100 mg",
                  "Effective option; consider cardiovascular/GI profile.",
                ],
                [
                  "Ketoprofen",
                  "25\u201350 mg",
                  "Reasonable alternative where available.",
                ],
                [
                  "Paracetamol / acetaminophen",
                  "500\u20131000 mg",
                  "Preferred when NSAIDs/aspirin are unsuitable and in pregnancy.",
                ],
              ],
            },
            {
              type: "bullets",
              items: [
                "Treat as early as possible after headache onset.",
                "Use an effective single dose rather than repeated subtherapeutic dosing.",
                "If one simple analgesic fails, try a different simple analgesic before escalating.",
              ],
            },
          ],
        },
        {
          id: "escalation",
          title: "Escalation for Persistent Symptoms",
          content: [
            {
              type: "bullets",
              items: [
                "Combination analgesics containing caffeine can be used for episodic TTH not responding to simple analgesics; a practical regimen is acetaminophen/aspirin/caffeine.",
                "Parenteral therapy (for severe attacks presenting to an urgent care or ED) may include ketorolac, metoclopramide, or chlorpromazine, usually after diagnostic reconsideration.",
                "If symptoms are severe, recurrent, or atypical, re-evaluate for migraine, medication overuse, cervicogenic headache, or a secondary cause.",
              ],
            },
          ],
        },
        {
          id: "treatments-to-avoid",
          title: "Treatments to Avoid or Use Only Rarely",
          content: [
            {
              type: "bullets",
              items: [
                "Do not use opioids routinely for acute TTH.",
                "Triptans are not standard treatment for TTH and should not be used unless the clinical picture is actually migraine or mixed migraine/TTH.",
                "Muscle relaxants are not recommended for routine acute TTH treatment.",
                "Limit acute therapy frequency to reduce medication-overuse headache risk: simple analgesics \u226414 days/month; combination analgesics \u22649 days/month; butalbital-containing agents should generally be avoided.",
              ],
            },
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  7. Preventive Treatment                                           */
    /* ------------------------------------------------------------------ */
    {
      id: "preventive-treatment",
      title: "Preventive Treatment",
      content: [
        {
          type: "paragraph",
          text: "Preventive treatment is indicated when headaches are frequent, prolonged, disabling, poorly responsive to acute therapy, or when acute medication use is beginning to escalate.",
        },
      ],
      subsections: [
        {
          id: "when-to-start",
          title: "When to Start Prevention",
          content: [
            {
              type: "bullets",
              items: [
                "At least 2 headache days each week, or",
                "Headaches often last 4 hours or more, or",
                "Symptoms meaningfully impair function, or",
                "Acute treatment is only partly effective, poorly tolerated, or being used too often.",
              ],
            },
          ],
        },
        {
          id: "non-pharmacologic",
          title: "Non-Pharmacologic Prevention",
          content: [
            {
              type: "bullets",
              items: [
                "Behavioural therapy is an appropriate starting strategy for many patients, especially biofeedback plus relaxation therapy.",
                "Stress management, trigger modification, sleep regularisation, hydration, and structured exercise are useful practical measures.",
                "Physical therapy or aerobic exercise is reasonable, especially when there is cervical/pericranial musculoskeletal contribution.",
                "Acupuncture is supported by NICE for chronic TTH and may help selected patients who prefer non-drug options.",
              ],
            },
          ],
        },
        {
          id: "pharmacologic",
          title: "Pharmacologic Prevention",
          content: [
            {
              type: "table",
              headers: [
                "Agent",
                "Typical starting / target approach",
                "Practical comments",
              ],
              rows: [
                [
                  "Amitriptyline",
                  "10\u201312.5 mg nightly, titrate slowly; often target 25\u201375 mg, sometimes higher",
                  "Best-supported drug preventive for chronic TTH; watch sedation, anticholinergic burden, weight gain, and ECG/cardiac issues.",
                ],
                [
                  "Nortriptyline / protriptyline",
                  "Use if amitriptyline is poorly tolerated",
                  "Less evidence than amitriptyline but practical alternatives.",
                ],
                [
                  "Mirtazapine",
                  "15 mg nightly, may increase to 30 mg",
                  "May help when sleep disturbance or poor tricyclic tolerance coexists.",
                ],
                [
                  "Venlafaxine",
                  "37.5 mg daily, titrate upward if needed",
                  "Evidence is weaker than for amitriptyline; useful when anxiety/depression is prominent.",
                ],
                [
                  "Topiramate / gabapentin / tizanidine",
                  "Specialist-selected alternatives",
                  "Evidence is limited or inconsistent; not first-choice routine options.",
                ],
              ],
            },
            {
              type: "bullets",
              items: [
                "Start low and titrate slowly.",
                "Give a fair trial: early benefit may take 4\u20136 weeks, with fuller effect over 2\u20133 months.",
                "Review headache diary data rather than relying on memory alone.",
                "Once effective, continue for at least 3\u20136 months before considering gradual taper.",
              ],
            },
          ],
        },
        {
          id: "interventional",
          title: "Interventional Options",
          content: [
            {
              type: "bullets",
              items: [
                "Botulinum toxin is not a routine recommended preventive for chronic TTH; both U.S. and European guidance are cautious, and evidence remains uncertain.",
                "Trigger-point injections or other local procedures may help selected patients, but they are not standard first-line TTH prevention.",
              ],
            },
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  8. Practical Stepwise Algorithm                                   */
    /* ------------------------------------------------------------------ */
    {
      id: "stepwise-algorithm",
      title: "Practical Stepwise Algorithm",
      content: [
        {
          type: "table",
          headers: ["Step", "Action"],
          rows: [
            [
              "1",
              "Confirm that the phenotype really fits TTH and not migraine, chronic migraine, medication-overuse headache, or a secondary headache.",
            ],
            [
              "2",
              "If typical episodic TTH: start early with ibuprofen, aspirin, or paracetamol/acetaminophen, respecting contraindications and medication-overuse limits.",
            ],
            [
              "3",
              "If inadequate response: switch to a different simple analgesic, or use a caffeine-containing combination in appropriate patients.",
            ],
            [
              "4",
              "If headaches are frequent, prolonged, disabling, or medication use is escalating: start prevention. Use behavioural therapy and lifestyle management for most; add amitriptyline when pharmacologic prevention is required.",
            ],
            [
              "5",
              "If chronic TTH or atypical/severe symptoms: reassess diagnosis, look specifically for migraine overlap and MOH, and investigate when red flags are present.",
            ],
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  9. Guideline Comparison                                           */
    /* ------------------------------------------------------------------ */
    {
      id: "guideline-comparison",
      title: "Guideline Comparison",
      content: [
        {
          type: "table",
          headers: ["Topic", "NICE (UK)", "American (VA/DoD)", "European"],
          rows: [
            [
              "Diagnosis",
              "Use clinical features table; do not image solely for reassurance.",
              "Use clinical assessment and exclude secondary causes.",
              "ICHD-3 diagnostic framing plus clinical exclusion of secondary causes.",
            ],
            [
              "Acute first line",
              "Aspirin, paracetamol, or NSAID.",
              "Ibuprofen 400 mg or acetaminophen 1000 mg suggested.",
              "Simple analgesics/NSAIDs recommended for episodic TTH.",
            ],
            [
              "Opioids",
              "Do not offer.",
              "Not part of recommended acute care for TTH.",
              "Should not be used.",
            ],
            [
              "Chronic TTH prevention",
              "Acupuncture (up to 10 sessions over 5\u20138 weeks) may be considered.",
              "Amitriptyline suggested for chronic TTH; PT or aerobic exercise can be used.",
              "Amitriptyline remains first-choice pharmacologic preventive.",
            ],
            [
              "Botulinum toxin",
              "No routine TTH role.",
              "Suggested against for chronic TTH.",
              "Evidence uncertain; not standard care.",
            ],
          ],
        },
        {
          type: "paragraph",
          text: "Interpretation: all three sources support simple analgesics as first-line acute therapy, advise against routine opioid use, and place the greatest pharmacologic preventive emphasis on amitriptyline for chronic TTH.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  10. Key Prescribing Cautions                                      */
    /* ------------------------------------------------------------------ */
    {
      id: "prescribing-cautions",
      title: "Key Prescribing Cautions",
      content: [
        {
          type: "bullets",
          items: [
            "Always screen for medication-overuse headache in chronic or near-daily headache.",
            "Avoid serial escalation of analgesics without revisiting the diagnosis.",
            "Check cardiovascular, gastrointestinal, renal, hepatic, and pregnancy considerations before advising acute therapy.",
            "Before tricyclic therapy, assess for conduction disease; obtain baseline ECG in older adults or when cardiac risk/history is present.",
            "In apparent chronic TTH with any migrainous features, manage as chronic migraine rather than forcing a pure TTH label.",
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  11. References                                                    */
    /* ------------------------------------------------------------------ */
    {
      id: "references",
      title: "References",
      content: [
        {
          type: "bullets",
          items: [
            "NICE. Headaches in over 12s: diagnosis and management (CG150). Updated 3 June 2025.",
            "Sico JJ, et al. 2023 VA/DoD Clinical Practice Guideline for the Management of Headache. Ann Intern Med. 2024.",
            "Bendtsen L, et al. EFNS guideline on the treatment of tension-type headache. Eur J Neurol. 2010;17:e99-e102.",
            "International Headache Society. ICHD-3 online classification: tension-type headache.",
            "Lee HJ, et al. Update on Tension-type Headache. Headache Pain Res. 2025;26(1):38-47.",
          ],
        },
      ],
    },
  ],
};
