import type { Guideline } from "../types";

export const trigeminalAutonomicCephalalgia: Guideline = {
  slug: "trigeminal-autonomic-cephalalgia",
  title: "Adult Trigeminal Autonomic Cephalalgias",
  subtitle:
    "Integrated diagnosis and management guideline for cluster headache, paroxysmal hemicrania, SUNCT/SUNA, and hemicrania continua",
  category: "primary-headaches",
  tags: [
    "TAC",
    "trigeminal autonomic cephalalgia",
    "cluster headache",
    "paroxysmal hemicrania",
    "SUNCT",
    "SUNA",
    "hemicrania continua",
    "indomethacin",
    "verapamil",
    "oxygen",
    "lamotrigine",
  ],
  sourceDocument: "Trugeminal autonomic cephalgia.docx",
  sections: [
    /* ------------------------------------------------------------------ */
    /*  How to use this guideline                                         */
    /* ------------------------------------------------------------------ */
    {
      id: "how-to-use",
      title: "How to Use This Guideline",
      content: [
        {
          type: "callout",
          variant: "info",
          title: "Purpose and method",
          text: "Purpose: provide a practical, clinician-facing pathway for recognising TAC phenotypes, choosing first-line treatment, ordering appropriate imaging, and escalating therapy safely. Method: integrates most recent formal NICE, American, European, and VA/DoD guidance where available, uses ICHD-3 diagnostic criteria, supplements non-cluster TAC sections with current specialist reviews.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  Executive Summary                                                 */
    /* ------------------------------------------------------------------ */
    {
      id: "executive-summary",
      title: "Executive Summary",
      content: [
        {
          type: "bullets",
          items: [
            "Cluster headache is the only TAC with recent formal guideline coverage across NICE, AHS, EAN, and VA/DoD. Core first-line treatment is high-flow 100% oxygen and a rapid triptan, with early preventive therapy at bout onset.",
            "Verapamil remains the usual preventive anchor for cluster headache in routine specialist practice, although the 2023 VA/DoD guideline judged the evidence insufficient for or against routine use. EAN 2023 continues to recommend verapamil, alongside short-course corticosteroids as transitional therapy.",
            "Paroxysmal hemicrania and hemicrania continua are indomethacin-responsive TACs. A complete response to therapeutic indomethacin is both diagnostically and therapeutically central.",
            "SUNCT and SUNA require posterior fossa and pituitary-directed MRI because symptomatic mimics are well described. Intravenous lidocaine is the preferred rescue option for severe attacks; lamotrigine is the leading preventive treatment.",
            "A normal neurologic examination does not reliably exclude secondary TACs. MRI with contrast is appropriate in all new suspected TACs, with pituitary and posterior fossa assessment prioritised in SUNCT/SUNA, PH, and HC, and vascular imaging added when dissection or vascular lesions are suspected.",
            "For PH, SUNCT/SUNA, and HC, there is no recent full-spectrum NICE/AHS/EAN guideline equivalent to cluster headache.",
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  Method and Evidence Hierarchy                                     */
    /* ------------------------------------------------------------------ */
    {
      id: "method-and-evidence-hierarchy",
      title: "Method and Evidence Hierarchy",
      content: [
        {
          type: "paragraph",
          text: "This guideline synthesises the most authoritative and recent sources available for each TAC subtype. Where formal guideline recommendations exist, they are prioritised; where they do not, specialist reviews and expert consensus are used. The evidence hierarchy applied is as follows:",
        },
        {
          type: "bullets",
          items: [
            "NICE CG150 (Headaches in over 12s, updated 2025): UK national guideline covering diagnosis and management of primary headaches including cluster headache. Provides recommendations on acute, transitional, and preventive treatment.",
            "American guidance (AHS 2016): Evidence-based guideline on treatment of cluster headache published by the American Headache Society. Covers acute and preventive therapies with graded recommendations.",
            "European guidance (EAN 2023): European Academy of Neurology guideline on the treatment of cluster headache, incorporating updated evidence including CGRP-targeted therapies.",
            "VA/DoD Clinical Practice Guideline for Management of Headache, Version 3.0 (2023): US federal guideline with systematic evidence review covering cluster headache; notably diverges from EAN on verapamil evidence grading.",
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  TAC Diagnostic Comparison                                         */
    /* ------------------------------------------------------------------ */
    {
      id: "tac-diagnostic-comparison",
      title: "TAC Diagnostic Comparison",
      content: [
        {
          type: "table",
          headers: [
            "Disorder",
            "Attack duration",
            "Attack frequency",
            "Key features",
            "Diagnostic anchor",
            "Core first-line treatment",
          ],
          rows: [
            [
              "Cluster headache",
              "15–180 min",
              "1 every other day to 8/day",
              "Excruciating orbital/temporal pain, agitation/restlessness, marked ipsilateral autonomic features",
              "Clinical phenotype + MRI to exclude secondary cause",
              "Oxygen ± SC sumatriptan; start prevention early",
            ],
            [
              "Paroxysmal hemicrania",
              "2–30 min",
              ">5/day, often 10+/day",
              "Strictly unilateral short attacks with autonomic signs or restlessness",
              "Absolute response to indomethacin",
              "Indomethacin",
            ],
            [
              "SUNCT / SUNA",
              "1–600 sec",
              "At least 1/day; often many/day",
              "Very brief neuralgiform attacks with prominent cranial autonomic symptoms; usually no refractory period",
              "Clinical phenotype + MRI posterior fossa/pituitary; indomethacin and oxygen typically not helpful",
              "IV lidocaine for rescue; lamotrigine prevention",
            ],
            [
              "Hemicrania continua",
              ">3 months continuous with exacerbations",
              "Continuous baseline pain",
              "Side-locked continuous unilateral headache with superimposed flares and autonomic symptoms/agitation",
              "Absolute response to indomethacin",
              "Indomethacin",
            ],
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  Shared Assessment for Any Suspected TAC                           */
    /* ------------------------------------------------------------------ */
    {
      id: "shared-assessment",
      title: "Shared Assessment for Any Suspected TAC",
      content: [
        {
          type: "bullets",
          items: [
            "Take a structured history of side-locking, attack duration, attack frequency, autonomic signs, agitation/restlessness, triggers, circadian periodicity, remission pattern, medication response, and interictal pain.",
            "Document attack frequency prospectively when diagnostic uncertainty exists.",
            "Examine pupils, ptosis, conjunctival injection, tearing, facial sweating, sensory loss, and ocular findings; check for Horner syndrome or cranial neuropathy.",
            "Look actively for secondary clues: atypical onset, older age at onset, continuously progressive course, new neurologic deficit, abnormal fundi, pituitary symptoms, fever, trauma, dental/sinus/orbital disease, and vascular risk features.",
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  Recommended Imaging Strategy                                      */
    /* ------------------------------------------------------------------ */
    {
      id: "recommended-imaging-strategy",
      title: "Recommended Imaging Strategy",
      content: [
        {
          type: "bullets",
          items: [
            "MRI brain with contrast in all new suspected TACs, even if the examination is normal.",
            "Ensure pituitary/sellar assessment in cluster headache, paroxysmal hemicrania, SUNCT/SUNA, and hemicrania continua when clinically feasible.",
            "Prioritise posterior fossa and trigeminal root entry zone imaging in SUNCT/SUNA.",
            "Add CTA/MRA head and neck when carotid or vertebral artery dissection, aneurysm, fistula, or vascular malformation is suspected.",
            "Use targeted additional testing for atypical cases: pituitary profile, inflammatory markers, lumbar puncture, ophthalmology, dental or sinus evaluation as indicated.",
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  1. Cluster Headache                                               */
    /* ------------------------------------------------------------------ */
    {
      id: "cluster-headache",
      title: "1. Cluster Headache",
      content: [],
      subsections: [
        {
          id: "cluster-diagnosis",
          title: "Diagnosis",
          content: [
            {
              type: "paragraph",
              text: "Cluster headache is the commonest TAC. It presents with recurrent attacks of excruciating unilateral orbital, supraorbital, or temporal pain lasting 15–180 minutes, accompanied by ipsilateral cranial autonomic features (conjunctival injection, lacrimation, nasal congestion, rhinorrhoea, forehead and facial sweating, miosis, ptosis, eyelid oedema) and/or a sense of restlessness or agitation. Attacks occur between one every other day and eight per day. Episodic cluster headache has bouts lasting weeks to months separated by remission periods of at least three months; chronic cluster headache has no such remission or remission lasting less than three months for at least one year. Diagnosis is clinical and should follow ICHD-3 criteria, but MRI brain with contrast is appropriate at first presentation to exclude secondary causes.",
            },
          ],
        },
        {
          id: "cluster-acute-treatment",
          title: "Acute Treatment",
          content: [
            {
              type: "bullets",
              items: [
                "High-flow 100% oxygen at 12 L/min via non-rebreather mask for at least 15 minutes at attack onset. This is the recommended first-line acute treatment across NICE, AHS, and EAN.",
                "Subcutaneous sumatriptan 6 mg is the fastest-acting triptan for cluster attacks and is recommended by all major guidelines.",
                "Intranasal zolmitriptan 5 mg or intranasal sumatriptan 20 mg are alternatives when injection is not feasible or not tolerated.",
                "Avoid oral analgesics and opioids; they are too slow for cluster attacks and risk medication-overuse headache.",
              ],
            },
          ],
        },
        {
          id: "cluster-transitional-and-preventive",
          title: "Transitional and Preventive Treatment",
          content: [
            {
              type: "bullets",
              items: [
                "Start preventive therapy as soon as a cluster bout is recognised. Early prevention reduces attack burden and bout duration.",
                "Verapamil is the most widely used preventive agent in specialist practice. Start at 240 mg/day in divided doses, titrating upward as needed (doses above 480 mg/day are common in refractory cases). ECG monitoring is mandatory before starting and at each dose increase because of the risk of heart block.",
                "Short-course oral corticosteroids (e.g. prednisolone tapering over 2–3 weeks) are recommended as transitional therapy to suppress attacks while prevention takes effect. EAN 2023 and NICE both support this approach.",
                "Galcanezumab 300 mg SC monthly is approved for episodic cluster headache based on the CGAL study. EAN 2023 recommends it; the VA/DoD 2023 guideline also suggests it for episodic cluster headache.",
                "Alternative preventive options include lithium (especially for chronic cluster headache), topiramate, greater occipital nerve (GON) block with corticosteroid and local anaesthetic, and non-invasive vagus nerve stimulation (nVNS).",
              ],
            },
          ],
        },
        {
          id: "cluster-guideline-divergence",
          title: "Practical Note on Differing Guidelines",
          content: [
            {
              type: "paragraph",
              text: "There is notable divergence between current guidelines on verapamil. EAN 2023 continues to recommend verapamil as a first-line preventive for cluster headache, consistent with long-standing European and UK specialist practice. The VA/DoD 2023 guideline, however, judged the available evidence insufficient to recommend for or against routine verapamil use, reflecting strict application of its evidence-grading methodology. In practice, verapamil remains the standard first-line preventive in most specialist headache centres, with ECG monitoring as a safety requirement.",
            },
          ],
        },
        {
          id: "cluster-when-to-refer",
          title: "When to Refer Urgently",
          content: [
            {
              type: "bullets",
              items: [
                "Atypical features or diagnostic uncertainty after initial assessment.",
                "Secondary features: new neurologic deficit, abnormal examination, pituitary symptoms, abnormal MRI.",
                "Failure to respond to oxygen and triptan acutely, or failure to respond to first-line preventive therapy.",
                "Chronic cluster headache not responding to verapamil or requiring high doses.",
                "Need for specialist interventional options (e.g. sphenopalatine ganglion stimulation, deep brain stimulation, occipital nerve stimulation).",
              ],
            },
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  2. Paroxysmal Hemicrania                                          */
    /* ------------------------------------------------------------------ */
    {
      id: "paroxysmal-hemicrania",
      title: "2. Paroxysmal Hemicrania",
      content: [
        {
          type: "paragraph",
          text: "Paroxysmal hemicrania presents with strictly unilateral attacks of severe orbital, supraorbital, or temporal pain lasting 2–30 minutes, occurring more than five times per day (often 10 or more per day), accompanied by ipsilateral cranial autonomic features and/or restlessness. The defining diagnostic feature is an absolute and complete response to therapeutic doses of indomethacin (ICHD-3 criterion). Episodic and chronic forms exist. MRI brain with contrast is recommended, with pituitary assessment included where possible, to exclude secondary causes.",
        },
        {
          type: "subheading",
          text: "Core Management",
        },
        {
          type: "bullets",
          items: [
            "Indomethacin is the treatment of choice and the diagnostic anchor. Start at 25 mg three times daily, increasing to 50 mg three times daily if needed, and up to 75 mg three times daily for a definitive trial. A complete response is expected within days.",
            "Once the response is confirmed, reduce to the lowest effective maintenance dose. Some patients require long-term therapy; others have remitting courses.",
            "Co-prescribe a proton pump inhibitor for gastroprotection when indomethacin is used long-term.",
            "Monitor renal function and blood pressure periodically with chronic indomethacin use.",
          ],
        },
        {
          type: "subheading",
          text: "Alternatives When Indomethacin Is Not Tolerated",
        },
        {
          type: "bullets",
          items: [
            "Other NSAIDs (e.g. celecoxib, naproxen) may provide partial benefit but rarely match the efficacy of indomethacin.",
            "Verapamil has been reported to help some patients as an adjunct or alternative.",
            "Topiramate and melatonin have limited case-series evidence.",
            "Greater occipital nerve block may provide temporary relief in refractory cases.",
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  3. SUNCT and SUNA                                                 */
    /* ------------------------------------------------------------------ */
    {
      id: "sunct-and-suna",
      title: "3. SUNCT and SUNA",
      content: [
        {
          type: "paragraph",
          text: "SUNCT (Short-lasting Unilateral Neuralgiform headache attacks with Conjunctival injection and Tearing) and SUNA (Short-lasting Unilateral Neuralgiform headache attacks with cranial Autonomic symptoms) are rare TACs characterised by very brief (1–600 seconds) strictly unilateral neuralgiform attacks with prominent cranial autonomic features. Attacks are often very frequent (many per day) and may lack a refractory period between attacks, distinguishing them from trigeminal neuralgia. Indomethacin and oxygen are typically not helpful, separating these disorders from PH and cluster headache respectively.",
        },
        {
          type: "subheading",
          text: "Imaging and Work-Up",
        },
        {
          type: "bullets",
          items: [
            "MRI brain with contrast is mandatory, with dedicated posterior fossa and trigeminal root entry zone sequences to exclude neurovascular compression, demyelinating lesions, or structural abnormalities.",
            "Pituitary-directed MRI is recommended because pituitary adenomas are a well-described cause of symptomatic SUNCT/SUNA.",
            "Consider pituitary hormone profile if any clinical suspicion of pituitary dysfunction.",
            "Exclude trigeminal neuralgia: SUNCT/SUNA typically lacks a refractory period and has more prominent autonomic features; however, overlap exists and imaging helps differentiate.",
          ],
        },
        {
          type: "subheading",
          text: "Acute Rescue",
        },
        {
          type: "bullets",
          items: [
            "Intravenous lidocaine is the preferred rescue treatment for severe or status-like SUNCT/SUNA attacks. This requires cardiac monitoring and is typically administered in a hospital or specialist setting.",
            "Standard acute treatments for other TACs (oxygen, triptans) are not reliably effective in SUNCT/SUNA.",
          ],
        },
        {
          type: "subheading",
          text: "Preventive Therapy",
        },
        {
          type: "bullets",
          items: [
            "Lamotrigine is the leading preventive treatment for SUNCT/SUNA. Start at a low dose (25 mg/day) and titrate slowly according to standard lamotrigine dosing protocols. Effective doses are typically 200–400 mg/day.",
            "Topiramate, gabapentin, and carbamazepine are alternative preventive options with case-series support.",
            "Greater occipital nerve block may provide temporary benefit.",
            "Refer to a specialist headache centre for refractory cases; neurosurgical options (microvascular decompression) may be considered when neurovascular compression is confirmed on imaging.",
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  4. Hemicrania Continua                                            */
    /* ------------------------------------------------------------------ */
    {
      id: "hemicrania-continua",
      title: "4. Hemicrania Continua",
      content: [
        {
          type: "paragraph",
          text: "Hemicrania continua is a persistent, strictly side-locked unilateral headache present for more than three months without pain-free periods, with superimposed exacerbations accompanied by ipsilateral cranial autonomic features and/or a sense of restlessness or agitation. The defining diagnostic feature, as with paroxysmal hemicrania, is an absolute and complete response to therapeutic doses of indomethacin (ICHD-3 criterion). MRI brain with contrast is recommended to exclude secondary causes, with pituitary assessment included where possible.",
        },
        {
          type: "subheading",
          text: "Core Management",
        },
        {
          type: "bullets",
          items: [
            "Indomethacin is the treatment of choice and diagnostic anchor. Initiate at 25 mg three times daily, titrating to 50 mg three times daily and up to 75 mg three times daily for a definitive therapeutic trial.",
            "Confirm complete response, then reduce to the lowest effective maintenance dose. Many patients require long-term continuous treatment.",
            "Co-prescribe a proton pump inhibitor for gastroprotection.",
            "Monitor renal function and blood pressure periodically with chronic use.",
          ],
        },
        {
          type: "subheading",
          text: "Alternatives When Indomethacin Is Not Tolerated",
        },
        {
          type: "bullets",
          items: [
            "Other NSAIDs (e.g. celecoxib) may provide partial relief but are rarely as effective as indomethacin.",
            "Topiramate, verapamil, and melatonin have limited evidence from case reports and small series.",
            "Greater occipital nerve block with corticosteroid may offer temporary benefit.",
            "OnabotulinumtoxinA has anecdotal reports of benefit in refractory hemicrania continua.",
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  5. Cross-Guideline Synthesis                                      */
    /* ------------------------------------------------------------------ */
    {
      id: "cross-guideline-synthesis",
      title: "5. Cross-Guideline Synthesis",
      content: [
        {
          type: "table",
          headers: [
            "Area",
            "NICE 2025",
            "AHS 2016",
            "EAN 2023",
            "Integrated interpretation for practice",
          ],
          rows: [
            [
              "Cluster diagnosis",
              "Clinical diagnosis using ICHD-3 criteria; consider MRI to exclude secondary causes",
              "Clinical diagnosis; imaging recommended at first presentation",
              "Clinical diagnosis; MRI brain recommended",
              "All sources agree: clinical diagnosis with MRI at first presentation to exclude secondary causes",
            ],
            [
              "Acute cluster treatment",
              "Oxygen 12 L/min and/or SC sumatriptan; intranasal triptans as alternatives",
              "High-flow oxygen and SC sumatriptan are first-line (Level A); intranasal zolmitriptan (Level B)",
              "Oxygen and SC sumatriptan first-line; intranasal triptans alternative",
              "Consensus across all guidelines: high-flow oxygen and SC sumatriptan are first-line acute treatments",
            ],
            [
              "Cluster prevention",
              "Verapamil as first-line preventive; corticosteroids as transitional therapy",
              "Verapamil recommended; suboccipital steroid injection; civamide intranasal",
              "Verapamil first-line; short-course corticosteroids for transitional therapy",
              "Verapamil remains the practical first-line preventive despite VA/DoD 2023 rating evidence as insufficient. ECG monitoring is mandatory",
            ],
            [
              "Episodic cluster CGRP therapy",
              "Not yet incorporated in current NICE update",
              "Pre-dates galcanezumab evidence",
              "Galcanezumab 300 mg SC recommended for episodic cluster headache",
              "Galcanezumab is an evidence-based option for episodic cluster headache; use when standard prevention is insufficient or not tolerated",
            ],
            [
              "PH / SUNCT-SUNA / HC",
              "Limited specific coverage; general headache pathway applies",
              "Not covered in AHS 2016 cluster guideline",
              "Not covered in EAN 2023 cluster guideline",
              "No recent full-spectrum guideline for non-cluster TACs. Management guided by ICHD-3 criteria, specialist reviews, and expert consensus. Indomethacin for PH/HC; lamotrigine for SUNCT/SUNA",
            ],
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  6. Practical Clinical Pathway                                     */
    /* ------------------------------------------------------------------ */
    {
      id: "practical-clinical-pathway",
      title: "6. Practical Clinical Pathway",
      content: [
        {
          type: "numbered",
          items: [
            "Confirm the phenotype: use attack duration, frequency, autonomic features, restlessness, side-locking, and response to prior treatments to classify the TAC subtype (cluster headache, paroxysmal hemicrania, SUNCT/SUNA, or hemicrania continua).",
            "Exclude secondary causes early with MRI brain with contrast. Include pituitary/sellar views, especially for SUNCT/SUNA, PH, and HC. Add CTA/MRA if vascular pathology is suspected.",
            "Treat according to phenotype: cluster headache — oxygen and SC sumatriptan acutely, verapamil and/or corticosteroids for prevention; paroxysmal hemicrania — indomethacin trial; SUNCT/SUNA — IV lidocaine for rescue, lamotrigine for prevention; hemicrania continua — indomethacin trial.",
            "Reassess if partial response, escalating dose requirements, side shift, bilateral symptoms, or new neurologic features develop. These may indicate a secondary cause or diagnostic revision.",
            "Escalate to a specialist headache centre for refractory disease, diagnostic uncertainty, need for interventional therapies, or when standard treatments are not tolerated.",
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  References                                                        */
    /* ------------------------------------------------------------------ */
    {
      id: "references",
      title: "References",
      content: [
        {
          type: "bullets",
          items: [
            "NICE CG150 updated 2025.",
            "AHS Clinical Practice Guidelines page (2016 cluster headache guideline).",
            "Robbins MS et al. Treatment of Cluster Headache: AHS Evidence-Based Guidelines. Headache. 2016;56:1093-1106.",
            "May A, et al. EAN guidelines on treatment of cluster headache. Eur J Neurol. 2023.",
            "VA/DoD CPG for Management of Headache. Version 3.0. 2023.",
            "ICHD-3 diagnostic criteria.",
            "Bahra A, et al. Paroxysmal hemicrania and hemicrania continua: review. Cephalalgia. 2023.",
            "Burish M. Cluster Headache, SUNCT, and SUNA. Continuum. 2024;30(2):391-410.",
            "May A, Leone M, et al. EFNS guidelines on treatment of cluster headache and other TACs. Eur J Neurol. 2006;13:1066-1077.",
            "Hagen K, et al. One-year prevalence of cluster headache, HC, PH, and SUNCT/SUNA in Norway. Cephalalgia. 2024.",
          ],
        },
      ],
    },
  ],
};
