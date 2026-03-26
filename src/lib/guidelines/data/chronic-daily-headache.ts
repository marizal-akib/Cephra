import type { Guideline } from "../types";

export const chronicDailyHeadache: Guideline = {
  slug: "chronic-daily-headache",
  title: "Chronic Daily Headache and New Daily Persistent Headache",
  subtitle:
    "Practical guidance synthesising UpToDate source material with current NICE, American and European guidance",
  category: "secondary-headaches-red-flags",
  tags: [
    "chronic daily headache",
    "CDH",
    "NDPH",
    "new daily persistent headache",
    "hemicrania continua",
    "medication overuse",
    "chronic migraine",
    "chronic tension-type",
  ],
  sourceDocument: "Chronic daily headache.docx",
  sections: [
    /* ------------------------------------------------------------------ */
    /*  Key take-home points                                               */
    /* ------------------------------------------------------------------ */
    {
      id: "key-take-home-points",
      title: "Key Take-Home Points",
      content: [
        {
          type: "callout",
          variant: "info",
          title: "Key take-home points",
          text: "Chronic daily headache (CDH) is a descriptive umbrella term, not an ICHD-3 diagnosis. The common long-duration forms are chronic migraine, chronic tension-type headache, medication overuse headache (MOH), hemicrania continua and new daily persistent headache (NDPH). NICE provides formal guidance for tension-type headache, migraine, cluster headache and MOH, but not a dedicated NDPH guideline. European Academy of Neurology guidance is especially relevant for MOH; American guidance is strongest for migraine prevention and chronic migraine pathways. NDPH remains a diagnosis of exclusion and is usually managed according to the nearest phenotype (migraine-like or tension-type-like) after secondary causes are excluded.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  1. Purpose and guideline basis                                     */
    /* ------------------------------------------------------------------ */
    {
      id: "purpose-and-guideline-basis",
      title: "Purpose and Guideline Basis",
      content: [
        {
          type: "paragraph",
          text: "This document provides a unified practical approach to chronic daily headache (CDH) and new daily persistent headache (NDPH), using the supplied source content together with current formal guidance and classification sources. NICE CG150 remains the principal UK guidance for common primary headaches and medication overuse headache; it covers tension-type headache, migraine, cluster headache and medication overuse headache in people aged 12 years and older, and recommends headache diaries, positive diagnosis and avoidance of unnecessary neuroimaging for reassurance alone when a primary headache diagnosis is secure. The International Classification of Headache Disorders, 3rd edition (ICHD-3), provides the diagnostic framework for CDH subtypes and for NDPH specifically. European Academy of Neurology (EAN) guidance is particularly relevant for medication overuse headache. American Headache Society (AHS) resources and position statements are most helpful for migraine prevention and chronic migraine care. No dedicated major NICE, AHS or EAN guideline focused solely on NDPH was identified in the sources reviewed; therefore the NDPH section below is necessarily evidence-informed but lower-certainty than the migraine and MOH sections.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  2. What chronic daily headache means in practice                   */
    /* ------------------------------------------------------------------ */
    {
      id: "what-cdh-means-in-practice",
      title: "What Chronic Daily Headache Means in Practice",
      content: [
        {
          type: "paragraph",
          text: "CDH is a descriptive clinical umbrella used when headache is present on 15 or more days per month for more than 3 months. It is useful for structuring assessment and management, but it is not itself an ICHD-3 diagnosis. The critical step is to identify the specific underlying primary or secondary headache type, and to determine whether medication overuse is perpetuating the problem.",
        },
      ],
      subsections: [
        {
          id: "major-cdh-syndromes",
          title: "Major CDH Syndromes",
          content: [
            {
              type: "table",
              headers: [
                "Syndrome",
                "Typical pattern",
                "Diagnostic clue",
                "First management priority",
              ],
              rows: [
                [
                  "Chronic migraine",
                  "\u226515 headache days/month for >3 months, with \u22658 days/month having migraine features",
                  "Any migrainous features push diagnosis toward chronic migraine rather than chronic tension-type headache",
                  "Preventive therapy, trigger/risk factor management, limit acute medication",
                ],
                [
                  "Chronic tension-type headache",
                  "Bilateral pressing/tightening headache on \u226515 days/month for >3 months",
                  "Featureless, mild\u2013moderate, not aggravated by routine activity",
                  "Simple acute therapy when needed, consider prevention, avoid opioids",
                ],
                [
                  "Medication overuse headache",
                  "Headache developed or worsened during regular overuse of acute medication for >3 months",
                  "Overuse thresholds: triptans/opioids/ergots/combination analgesics \u226510 days/month; simple analgesics/NSAIDs/paracetamol \u226515 days/month",
                  "Educate, stop or reduce offending medicine, treat underlying headache disorder",
                ],
                [
                  "Hemicrania continua",
                  "Continuous strictly unilateral headache with exacerbations and cranial autonomic symptoms",
                  "Absolute indomethacin response",
                  "Indomethacin trial and specialist confirmation",
                ],
                [
                  "New daily persistent headache",
                  "Clearly remembered onset with pain becoming daily and unremitting within 24 hours",
                  "Daily from onset, often migraine-like or tension-type-like",
                  "Exclude secondary causes; phenotype-based preventive treatment",
                ],
              ],
            },
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  3. Diagnostic approach to chronic daily headache                    */
    /* ------------------------------------------------------------------ */
    {
      id: "diagnostic-approach",
      title: "Diagnostic Approach to Chronic Daily Headache",
      content: [
        {
          type: "paragraph",
          text: "The diagnostic process is the same as for other headache presentations: decide whether the history is most consistent with a primary disorder or whether secondary causes need urgent or targeted investigation. In practice, every patient with CDH should have four issues actively addressed: (1) syndrome classification, (2) medication overuse, (3) red flags for secondary headache, and (4) disability burden and preventive treatment need.",
        },
      ],
      subsections: [
        {
          id: "minimum-assessment-dataset",
          title: "Minimum Assessment Dataset",
          content: [
            {
              type: "bullets",
              items: [
                "Headache chronology, including exact or approximate onset, frequency, duration, baseline intensity and superimposed exacerbations.",
                "Phenotype features: laterality, quality, aggravation by activity, migrainous symptoms, cranial autonomic symptoms, positional/Valsalva relationship and thunderclap onset.",
                "Medication review: all prescribed and over-the-counter acute treatments, caffeine-containing preparations and frequency of use.",
                "Comorbidity review: mood disorder, sleep disorder, obesity, neck pain, post-infectious onset, trauma, thrombosis risk, pregnancy, immunosuppression and cancer history.",
                "Focused neurologic examination, fundoscopy if feasible, blood pressure and targeted systemic examination.",
              ],
            },
          ],
        },
        {
          id: "red-flags",
          title:
            "Red Flags Requiring Lower Threshold for Imaging or Additional Investigation",
          content: [
            {
              type: "bullets",
              items: [
                "Age >50 years at new headache onset.",
                'Thunderclap onset or abrupt "worst headache" presentation.',
                "Progressive change in a previously stable pattern.",
                "Focal neurologic symptoms or signs, diplopia, papilloedema, pulsatile tinnitus, meningism, fever, weight loss, jaw claudication or scalp tenderness.",
                "Orthostatic headache or headache worsened by Valsalva, coughing, sneezing or bending.",
                "Cancer, immunosuppression, pregnancy/postpartum state or known hypercoagulability.",
              ],
            },
          ],
        },
        {
          id: "practical-imaging-and-test-strategy",
          title: "Practical Imaging and Test Strategy",
          content: [
            {
              type: "paragraph",
              text: "There is no one-size-fits-all testing bundle for CDH. Investigations should follow the phenotype and red flags. MRI brain with contrast is generally preferred when secondary headache remains a concern and is specifically recommended in presentations suspicious for NDPH to exclude mimics. MR or CT venography is appropriate when venous sinus thrombosis or idiopathic intracranial hypertension is suspected. Head and neck CTA/MRA is appropriate for thunderclap onset or suspected cervical artery dissection. Lumbar puncture should be used when infection, subarachnoid haemorrhage, intracranial pressure disorders or inflammatory processes are suspected. ESR/CRP should be checked in older adults where giant cell arteritis is a possibility.",
            },
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  4. Condition-specific management                                   */
    /* ------------------------------------------------------------------ */
    {
      id: "condition-specific-management",
      title: "Condition-Specific Management",
      content: [],
      subsections: [
        {
          id: "chronic-migraine",
          title: "Chronic Migraine",
          content: [
            {
              type: "paragraph",
              text: "Chronic migraine is the commonest specific CDH syndrome in specialist practice and frequently overlaps with medication overuse. NICE recommends diagnosing chronic migraine rather than chronic tension-type headache if there are any migraine features. Management should combine education, trigger/risk factor management, treatment of comorbidities, withdrawal or reduction of overused acute medication where relevant, and preventive therapy. AHS resources emphasise that preventive treatment should be considered for patients with frequent, disabling or long-lasting migraine attacks and broadly for those with four or more headache days per month. In chronic migraine, CGRP-pathway treatments and onabotulinumtoxinA may be appropriate in line with local commissioning and specialist pathways, but this document focuses on the broader CDH/NDPH framework rather than a full chronic migraine prescribing guideline.",
            },
          ],
        },
        {
          id: "chronic-tension-type-headache",
          title: "Chronic Tension-Type Headache",
          content: [
            {
              type: "paragraph",
              text: "For chronic tension-type headache, NICE recommends aspirin, paracetamol or an NSAID for acute treatment and specifically advises against opioids. For prevention, NICE advises considering a course of up to 10 sessions of acupuncture over 5\u20138 weeks. In practice, prevention also commonly includes behavioural therapies, sleep optimisation, stress management and, where appropriate, amitriptyline-based strategies under specialist or experienced primary care supervision.",
            },
          ],
        },
        {
          id: "medication-overuse-headache",
          title: "Medication Overuse Headache",
          content: [
            {
              type: "paragraph",
              text: "Medication overuse should be checked in every patient with CDH because it can both mimic and perpetuate chronic headache. NICE recommends being alert to MOH when headache developed or worsened while triptans, opioids, ergots or combination analgesics were taken on 10 or more days per month, or paracetamol/aspirin/NSAIDs on 15 or more days per month, for 3 months or longer. EAN guidance emphasises education and counselling as the first step, followed by stopping or reducing the overused medication, and using preventive treatment for the underlying headache disorder. The practical approach is to explain the diagnosis clearly, set realistic expectations about transient worsening during withdrawal, agree an acute rescue plan where needed, and arrange follow-up to reduce relapse risk.",
            },
          ],
        },
        {
          id: "hemicrania-continua",
          title: "Hemicrania Continua",
          content: [
            {
              type: "paragraph",
              text: "Hemicrania continua should be suspected in any strictly unilateral chronic daily headache with superimposed exacerbations and ipsilateral cranial autonomic symptoms. The hallmark is an absolute response to indomethacin. Because structural mimics exist, MRI brain with contrast is usually required before long-term therapeutic anchoring. Management is specialist-led and centres on the lowest effective indomethacin dose with gastroprotection, plus consideration of alternatives if indomethacin is contraindicated or not tolerated.",
            },
          ],
        },
        {
          id: "new-daily-persistent-headache",
          title: "New Daily Persistent Headache (NDPH)",
          content: [
            {
              type: "paragraph",
              text: "NDPH is the most distinctive CDH syndrome from a historical perspective: the headache starts on a clearly remembered day and becomes continuous and unremitting within 24 hours. The pain may be migraine-like, tension-type-like or mixed. Because the presentation is defined by sudden persistence rather than a single pathognomonic phenotype, NDPH is fundamentally a diagnosis of exclusion. In the absence of a dedicated major NICE/AHS/EAN NDPH guideline, the most defensible practical approach is: confirm the phenotype carefully, exclude important secondary causes, address medication overuse if present, then treat according to the nearest phenotype while being honest that response rates are often limited.",
            },
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  5. Focused guidance on NDPH                                        */
    /* ------------------------------------------------------------------ */
    {
      id: "focused-guidance-on-ndph",
      title: "Focused Guidance on NDPH",
      content: [],
      subsections: [
        {
          id: "when-to-suspect-ndph",
          title: "When to Suspect NDPH",
          content: [
            {
              type: "bullets",
              items: [
                "The patient can usually identify the exact date or circumstance of onset.",
                "Headache becomes daily and unremitting within 24 hours.",
                "There is often no previous history of escalating episodic headache that gradually transformed.",
                "The phenotype may resemble chronic migraine or chronic tension-type headache, but the onset pattern is the defining clue.",
                "Medication overuse can coexist, but NDPH should only be diagnosed if daily headache clearly pre-dated the medication overuse.",
              ],
            },
          ],
        },
        {
          id: "secondary-causes-exclusion",
          title:
            "Secondary Causes That Particularly Need Exclusion in Apparent NDPH",
          content: [
            {
              type: "table",
              headers: ["Potential mimic", "Clinical clues", "Preferred tests"],
              rows: [
                [
                  "Cerebral venous sinus thrombosis",
                  "Hypercoagulability, pregnancy/postpartum state, focal signs, papilloedema",
                  "MRI brain + MRV / CTV",
                ],
                [
                  "Spontaneous intracranial hypotension / CSF leak",
                  "Orthostatic headache, worse with Valsalva, neck pain, auditory symptoms",
                  "MRI brain with contrast; spine MRI and/or myelography if needed",
                ],
                [
                  "Idiopathic intracranial hypertension",
                  "Pulsatile tinnitus, visual obscurations, papilloedema, obesity",
                  "MRI brain + MRV; lumbar puncture with opening pressure",
                ],
                [
                  "Cervical/carotid/vertebral artery dissection or RCVS",
                  "Thunderclap onset, neck pain, Horner syndrome, focal signs",
                  "CTA/MRA head and neck",
                ],
                [
                  "Giant cell arteritis",
                  "Age >50, scalp tenderness, jaw claudication, visual symptoms, systemic upset",
                  "ESR/CRP, urgent specialist pathway",
                ],
                [
                  "CNS infection / inflammatory process",
                  "Meningism, fever, progressive encephalopathy",
                  "Lumbar puncture after appropriate imaging",
                ],
              ],
            },
          ],
        },
        {
          id: "recommended-core-work-up",
          title: "Recommended Core Work-Up for Suspected NDPH",
          content: [
            {
              type: "paragraph",
              text: "Recommended baseline work-up for suspected NDPH: MRI brain with gadolinium for all patients; targeted vascular imaging when thunderclap onset, neck pain, Horner syndrome or focal deficits are present; lumbar puncture when meningism, fever, visual symptoms, tinnitus, suspicion of raised/low CSF pressure or abnormal imaging suggests the need; ESR/CRP in patients older than 50 years or where giant cell arteritis is suspected; and spinal imaging when spontaneous intracranial hypotension remains possible even if brain MRI is non-diagnostic.",
            },
          ],
        },
        {
          id: "phenotype-based-treatment",
          title: "Phenotype-Based Treatment of NDPH",
          content: [
            {
              type: "table",
              headers: [
                "Predominant phenotype",
                "Suggested treatment orientation",
                "Comments",
              ],
              rows: [
                [
                  "Migraine-like NDPH",
                  "Use migraine preventive principles: e.g. amitriptyline/nortriptyline, candesartan, beta-blocker where appropriate, topiramate, CGRP-pathway therapy or onabotulinumtoxinA in specialist settings",
                  "Choose based on comorbidity, reproductive issues, weight, mood and previous response",
                ],
                [
                  "Tension-type-like NDPH",
                  "Use chronic tension-type prevention principles: amitriptyline often first practical choice; consider behavioural therapy, sleep/stress management, physical therapy",
                  "Avoid escalating simple analgesic use",
                ],
                [
                  "Recent-onset inflammatory/post-infectious phenotype",
                  "Some specialist reports describe benefit from a short early steroid course in selected recent-onset cases",
                  "Evidence is limited and should not delay secondary cause exclusion",
                ],
                [
                  "Refractory NDPH",
                  "Switch class or use rational combination therapy; consider onabotulinumtoxinA, nerve blocks or specialist headache referral",
                  "Set expectations early: many cases are difficult to treat and improvement may be partial",
                ],
              ],
            },
          ],
        },
        {
          id: "practical-treatment-notes",
          title: "Practical Treatment Notes for NDPH",
          content: [
            {
              type: "bullets",
              items: [
                "Stop medication overuse if present, even though withdrawal is less predictably beneficial in NDPH than in migraine-driven MOH.",
                "Use a headache diary from baseline to track intensity, associated symptoms, triggers, acute medicine days and disability.",
                "Treat sleep disturbance, depression, anxiety and cervical pain contributors in parallel.",
                "Escalate cautiously but do not leave patients on clearly ineffective therapies for prolonged periods.",
                "Be explicit about prognosis: some cases remit, but many persistent cases are treatment-resistant and require iterative management.",
              ],
            },
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  6. Unified service algorithm for CDH and NDPH                      */
    /* ------------------------------------------------------------------ */
    {
      id: "unified-service-algorithm",
      title: "Unified Service Algorithm for CDH and NDPH",
      content: [
        {
          type: "numbered",
          items: [
            "Confirm frequency \u226515 headache days/month for >3 months or a shorter-duration daily syndrome persisting without meaningful remission.",
            "Classify phenotype: chronic migraine, chronic tension-type headache, MOH, hemicrania continua, NDPH, TAC-related chronic daily syndrome, or other.",
            "Screen for red flags and secondary causes. If present, investigate urgently and specifically.",
            "Review all acute medication use and diagnose/avoid MOH where thresholds are met.",
            "Start or optimise preventive treatment according to the most likely syndrome or phenotype.",
            "Arrange structured follow-up with headache diary review and adjustment of preventive treatment, acute medication limits and comorbidity management.",
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  7. Referral and escalation thresholds                              */
    /* ------------------------------------------------------------------ */
    {
      id: "referral-and-escalation-thresholds",
      title: "Referral and Escalation Thresholds",
      content: [
        {
          type: "bullets",
          items: [
            "Any red flag suggesting secondary headache or an abnormal neurologic examination.",
            "Diagnostic uncertainty between chronic migraine, hemicrania continua, TACs and NDPH.",
            "Failure of two sensible preventive strategies, especially when disability remains high.",
            "Need for indomethacin-responsive headache confirmation, onabotulinumtoxinA, CGRP-pathway therapy, nerve blocks or inpatient headache management.",
            "Suspected CSF pressure disorder, venous thrombosis, dissection, vasculitis or refractory post-infectious NDPH.",
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  8. Honest evidence summary                                         */
    /* ------------------------------------------------------------------ */
    {
      id: "honest-evidence-summary",
      title: "Honest Evidence Summary",
      content: [
        {
          type: "paragraph",
          text: "The strongest current guidance is for common headache disorders that sit within the CDH umbrella, particularly migraine/chronic migraine, medication overuse headache, tension-type headache and cluster headache. NDPH is well recognised in ICHD-3 and in specialist reviews, but treatment evidence remains limited and no major body has produced a dedicated, comprehensive high-level guideline matching the maturity of migraine or MOH guidance. Therefore, the most defensible clinical strategy is careful exclusion of secondary causes, avoidance of medication overuse, and phenotype-based preventive management with early review and escalation when needed.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  9. Reference guide                                                 */
    /* ------------------------------------------------------------------ */
    {
      id: "reference-guide",
      title: "Reference Guide to the Main Sources Used",
      content: [
        {
          type: "bullets",
          items: [
            "NICE. Headaches in over 12s: diagnosis and management (CG150). Covers tension-type headache, migraine, cluster headache and medication overuse headache; recommends headache diaries, positive diagnosis and avoiding neuroimaging solely for reassurance when diagnosis is secure.",
            "ICHD-3. Diagnostic classification source for chronic migraine, chronic tension-type headache, MOH, hemicrania continua and NDPH.",
            "European Academy of Neurology guideline on the management of medication-overuse headache (2020).",
            "American Headache Society clinician resources and position statements on migraine prevention and headache care pathways.",
            "Matharu et al. New daily persistent headache: systematic review and meta-analysis (2023), used to inform the phenotype-based NDPH synthesis.",
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  Appendix: rapid diagnostic distinctions                            */
    /* ------------------------------------------------------------------ */
    {
      id: "appendix-rapid-diagnostic-distinctions",
      title: "Appendix: Rapid Diagnostic Distinctions",
      content: [
        {
          type: "table",
          headers: ["Disorder", "Core distinguishing point"],
          rows: [
            [
              "Chronic migraine",
              "\u226515 headache days/month for >3 months with \u22658 migraine-feature days/month",
            ],
            [
              "Chronic tension-type headache",
              "Pressing/tightening mild\u2013moderate headache on \u226515 days/month for >3 months, without sufficient migraine features",
            ],
            [
              "MOH",
              "Headache developed or worsened with regular overuse of acute medication above ICHD/NICE thresholds",
            ],
            [
              "Hemicrania continua",
              "Strictly unilateral continuous headache with absolute indomethacin response",
            ],
            [
              "NDPH",
              "Clearly remembered onset; daily and unremitting within 24 hours; secondary causes excluded",
            ],
            [
              "Chronic cluster headache",
              "Cluster attacks recur with remission <1 month over a 12-month period (NICE wording)",
            ],
            [
              "Chronic paroxysmal hemicrania",
              "Short frequent unilateral autonomic attacks, indomethacin-responsive, persisting >1 year without remission or with remission <3 months",
            ],
          ],
        },
      ],
    },
  ],
};
