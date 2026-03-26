import type { Guideline } from "../types";

export const tacsLatestEvidence: Guideline = {
  slug: "tacs-latest-evidence",
  title: "Trigeminal Autonomic Cephalalgias (TACs) Latest Evidence",
  subtitle: "Clinically relevant summaries of selected headache papers",
  category: "evidence-summaries",
  tags: [
    "TAC",
    "trigeminal autonomic cephalalgia",
    "paroxysmal hemicrania",
    "hemicrania continua",
    "SUNCT",
    "SUNA",
    "SUNHA",
    "indomethacin",
    "melatonin",
    "evidence summary",
  ],
  sourceDocument: "TACS Latest Evidence V1.docx",
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
          text: "Rapid, clinically usable summaries of recent TAC evidence.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  Paper 1 – Indomethacin-responsive headache without indomethacin   */
    /* ------------------------------------------------------------------ */
    {
      id: "managing-indomethacin-responsive-headache",
      title: "Managing Indomethacin-Responsive Headache Without Indomethacin",
      content: [
        {
          type: "callout",
          variant: "info",
          title: "Why This Paper Matters",
          text: "Useful when a patient with PH or HC has a clear indomethacin response but cannot stay on treatment due to adverse effects.",
        },
        {
          type: "subheading",
          text: "Key Findings",
        },
        {
          type: "bullets",
          items: [
            "Indomethacin remains benchmark; 30\u201360% report side effects, 10\u201320% discontinue.",
            "Most consistently supported substitutes: acemethacin, selective COX-2 inhibitors, anticonvulsants.",
            "Melatonin highlighted as useful adjunct or substitute for both HC and PH.",
            "For HC: acemethacin 90\u2013180 mg/day, celecoxib 200\u2013400 mg/day, etoricoxib 30\u2013120 mg/day, gabapentin 900\u20132500 mg/day, pregabalin 150\u2013600 mg/day, or topiramate 50\u2013300 mg/day.",
            "For PH: melatonin, topiramate, and nVNS most emphasised.",
            "nVNS most promising nonpharmacologic option.",
          ],
        },
        {
          type: "callout",
          variant: "warning",
          title: "Important Caveat",
          text: "Formal consensus guidelines do not yet exist. Most evidence is low level.",
        },
        {
          type: "callout",
          variant: "info",
          title: "Clinical Application",
          text: "Practical rescue algorithm for true indomethacin responders who become intolerant. Pragmatic sequence: confirm phenotype, reduce to lowest effective indomethacin dose, try melatonin or better-tolerated anti-inflammatory, then anticonvulsants or nVNS. Escalate early to specialist when diagnosis is uncertain.",
        },
        {
          type: "paragraph",
          text: "Osiowski A, Stolarz K, Taterra D. Current Opinion in Neurology. 2025.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  Paper 2 – PH and HC review                                        */
    /* ------------------------------------------------------------------ */
    {
      id: "paroxysmal-hemicrania-and-hemicrania-continua",
      title: "Paroxysmal Hemicrania and Hemicrania Continua Review",
      content: [
        {
          type: "callout",
          variant: "info",
          title: "Why This Paper Matters",
          text: "Helpful for diagnostic framework for two commonly missed TACs.",
        },
        {
          type: "subheading",
          text: "Key Findings",
        },
        {
          type: "bullets",
          items: [
            "PH and HC are TACs with hallmark dramatic response to indomethacin.",
            "PH: severe unilateral orbital/supraorbital/temporal attacks, 2\u201330 min, >5 times/day, with autonomic features.",
            "HC: continuous unilateral headache >3 months with superimposed exacerbations and autonomic features.",
            "Migraine-like symptoms (nausea, photophobia) do not exclude these diagnoses.",
            "Absence of cranial autonomic features in every attack does not fully rule out diagnosis.",
            "Main differentials: cluster headache/SUNHA for PH; migraine for HC.",
          ],
        },
        {
          type: "callout",
          variant: "info",
          title: "Clinical Application",
          text: "If chronic \u201cmigraine\u201d is completely one-sided for months with restless/autonomic flares, reconsider HC. Indomethacin trial is decisive for diagnostic confidence. Image new-onset or atypical cases.",
        },
        {
          type: "paragraph",
          text: "Bahra A. Cephalalgia. 2023.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  Paper 3 – Melatonin in HC and PH                                  */
    /* ------------------------------------------------------------------ */
    {
      id: "melatonin-in-hc-and-ph",
      title: "Melatonin in HC and PH",
      content: [
        {
          type: "callout",
          variant: "info",
          title: "Why This Paper Matters",
          text: "Real-world data on melatonin in indomethacin-sensitive headache disorders.",
        },
        {
          type: "subheading",
          text: "Key Findings",
        },
        {
          type: "bullets",
          items: [
            "56 HC patients, 23 received melatonin (median 10 mg). 14/23 (61%) had some positive relief, none completely pain free.",
            "22 PH patients, 6 received melatonin (median 8 mg). 3/6 (50%) responded.",
            "Side effects uncommon and mild.",
            "Melatonin not equivalent to indomethacin but can provide clinically worthwhile symptom reduction.",
            "Start low, titrate gradually; 2 mg before sleep as starting point.",
          ],
        },
        {
          type: "callout",
          variant: "info",
          title: "Clinical Application",
          text: "Low-risk fallback or add-on for indomethacin-intolerant patients. Expect improvement rather than complete suppression. Particularly attractive with coexisting sleep disruption.",
        },
        {
          type: "paragraph",
          text: "Cheung SN, Oliveira R, Goadsby PJ. Cephalalgia. 2024.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  Paper 4 – Epidemiology and clinical features of SUNHA             */
    /* ------------------------------------------------------------------ */
    {
      id: "epidemiology-and-clinical-features-of-sunha",
      title: "Epidemiology and Clinical Features of SUNHA",
      content: [
        {
          type: "callout",
          variant: "info",
          title: "Why This Paper Matters",
          text: "Concise evidence-based phenotype for SUNHA/SUNCT/SUNA.",
        },
        {
          type: "subheading",
          text: "Key Findings",
        },
        {
          type: "bullets",
          items: [
            "Pooled relative frequency of SUNHA: 0.32% among adults evaluated for headache/facial pain.",
            "SUNCT: 0.18%, SUNA: 0.04%.",
            "Typically fifth decade, approximately equal sex distribution.",
            "Typical attack: episodic, side-locked, severe, stabbing, ophthalmic/maxillary distribution.",
            "Commonest autonomic features: lacrimation, conjunctival injection, rhinorrhea, nasal congestion.",
            "SUNCT attacks averaged ~68 seconds; SUNA ~96 seconds.",
            "~75 attacks/day for SUNCT, ~19 for SUNA.",
          ],
        },
        {
          type: "callout",
          variant: "info",
          title: "Clinical Application",
          text: "Distinguish from trigeminal neuralgia by autonomic features, orbital involvement, clustering. Very short, side-locked, autonomic attacks support SUNHA. Specialist referral sensible when diagnosis suspected.",
        },
        {
          type: "paragraph",
          text: "Larsen JG, et al. Cephalalgia. 2024.",
        },
      ],
    },
  ],
};
