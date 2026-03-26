import type { Guideline } from "../types";

export const clusterHeadacheLatestEvidence: Guideline = {
  slug: "cluster-headache-latest-evidence",
  title: "Cluster Headache Latest Evidence",
  subtitle:
    "Clinically relevant short summaries of selected cluster headache papers",
  category: "evidence-summaries",
  tags: [
    "cluster headache",
    "evidence",
    "smoking",
    "CGRP",
    "vagus nerve stimulation",
    "nVNS",
    "diagnostic delay",
    "galcanezumab",
    "fremanezumab",
  ],
  sourceDocument: "Cluster Headache Latest Evidence V1.docx",
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
          text: "Rapid, clinically usable summaries rather than full critical appraisals. Each paper is searchable by topic.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  Paper 1 – Smoking in primary headaches                            */
    /* ------------------------------------------------------------------ */
    {
      id: "smoking-in-primary-headaches",
      title: "Smoking in Primary Headaches",
      content: [
        {
          type: "callout",
          variant: "info",
          title: "Why This Paper Matters",
          text: "Useful for quick clinic counselling because smoking is commonly discussed by patients with migraine and cluster headache, yet the actual association is often oversimplified.",
        },
        {
          type: "subheading",
          text: "Key Points",
        },
        {
          type: "bullets",
          items: [
            "Smoking prevalence was 20% in migraine, 27% in migraine with aura, 19% in TTH, and 65% in cluster headache; overall prevalence across primary headache disorders was 32%.",
            "Current smoking was associated with a modestly increased odds of migraine versus people without headache (OR 1.29; 95% CI 1.02\u20131.62).",
            "Current smoking was associated with lower odds of TTH (OR 0.78; 95% CI 0.68\u20130.89), but this should not be interpreted as smoking being protective in practice.",
            "No clear association was found between current smoking and cluster headache despite the very high prevalence of smoking among CH cohorts, and no clear association was found between former smoking and migraine.",
            "The authors highlight a major limitation: many studies were suitable for prevalence estimates but not for valid association analyses because of control-group problems and inconsistent smoking definitions.",
          ],
        },
        {
          type: "subheading",
          text: "Bottom Line",
        },
        {
          type: "paragraph",
          text: "Use this paper mainly for nuanced counselling rather than for causal claims. It supports advising smoking cessation for general health reasons and because migraine risk may be higher in current smokers, but it does not justify saying smoking causes or prevents any primary headache disorder with confidence.",
        },
        {
          type: "callout",
          variant: "info",
          title: "Clinical Application",
          text: "For migraine clinics: a reasonable counselling line is that current smoking is associated with migraine in pooled data, even if causality remains uncertain. For cluster headache: do not confuse high smoking prevalence with proof that smoking causes CH. The clinical message is association in the population, not confirmed direct causation. For TTH: avoid telling patients smoking is beneficial. The inverse association is likely vulnerable to residual confounding and should not guide behaviour. Useful in preventive discussions where lifestyle optimisation is being reviewed alongside sleep, caffeine, alcohol, and medication overuse.",
        },
        {
          type: "paragraph",
          text: "B\u0142aszczyk B, Martynowicz H, Przegra\u0142ek J, et al. The Journal of Headache and Pain. 2025.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  Paper 2 – CGRP antagonists for cluster headache                   */
    /* ------------------------------------------------------------------ */
    {
      id: "cgrp-antagonists-for-cluster-headache",
      title: "Calcitonin Gene-Related Peptide Antagonists for Cluster Headache",
      content: [
        {
          type: "callout",
          variant: "info",
          title: "Why This Paper Matters",
          text: "CGRP-targeted therapies are already familiar from migraine practice, but clinicians still need a concise evidence summary for their role in cluster headache prevention.",
        },
        {
          type: "subheading",
          text: "Key Points",
        },
        {
          type: "bullets",
          items: [
            "Systematic review and meta-analysis including 4 randomized controlled trials and 2 single-arm trials in adults with episodic or chronic cluster headache.",
            "CGRP antagonists reduced weekly cluster attacks by a pooled mean of 7.23 attacks per week (95% CI 4.60\u20139.86 fewer).",
            "The pooled \u226550% responder rate was 46%, and the \u226530% responder rate was 59%.",
            "Benefits appeared larger in episodic cluster headache than in chronic cluster headache.",
            "At least one treatment-emergent adverse event occurred in about 60% of participants, but serious adverse events (4%) and discontinuations (3%) were uncommon.",
            "The review reflects current evidence for monoclonal antibodies; no eligible gepant trials were available.",
          ],
        },
        {
          type: "subheading",
          text: "Bottom Line",
        },
        {
          type: "paragraph",
          text: "CGRP monoclonal antibodies look promising as preventive options for selected cluster headache patients, especially refractory or episodic cases, but the evidence remains supportive rather than definitive. They fit best as individualized preventive options rather than universal first-line replacements.",
        },
        {
          type: "callout",
          variant: "info",
          title: "Clinical Application",
          text: "Most relevant use case: refractory CH or patients who cannot tolerate, fail, or are poorly controlled on standard preventives such as verapamil, lithium, or topiramate. Stronger signal in episodic CH means clinicians should be more cautious when extrapolating benefit to chronic CH. The tolerability profile is clinically attractive, especially where vasoconstrictive treatments are problematic or cardiovascular comorbidity complicates management. Good paper to support discussion of add-on preventive strategies, but still not a substitute for clinical judgement, attack diary review, and conventional treatment optimisation.",
        },
        {
          type: "paragraph",
          text: "Khanfar R, Radwan E, Hattab S. BMC Neurology. 2026 (article in press).",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  Paper 3 – nVNS for cluster headache and migraine                  */
    /* ------------------------------------------------------------------ */
    {
      id: "noninvasive-vagus-nerve-stimulation",
      title:
        "Noninvasive Vagus Nerve Stimulation for Cluster Headache and Migraine",
      content: [
        {
          type: "callout",
          variant: "info",
          title: "Why This Paper Matters",
          text: "Goes beyond efficacy alone and adds GRADE certainty, cost-effectiveness, budget impact, and patient-perspective data for nVNS.",
        },
        {
          type: "subheading",
          text: "Key Points",
        },
        {
          type: "bullets",
          items: [
            "For acute cluster headache, nVNS did not show statistically significant improvement in overall response, pain freedom, attack duration, or acute medication use; evidence certainty ranged from low to very low.",
            "For preventive cluster headache, nVNS reduced weekly attack frequency, improved responder outcomes, reduced acute medication use, and improved quality of life, although certainty was only low to very low.",
            "For acute migraine, nVNS improved pain relief response, but effects on sustained response, pain freedom, acute medication use, and pain intensity were small or uncertain.",
            "For preventive migraine, nVNS may slightly reduce headache or migraine days, but a no-effect possibility remains.",
            "Economically, nVNS plus standard care appeared likely cost-effective for prevention of cluster headache (ICER about $27,338 per QALY) but not for migraine prevention.",
          ],
        },
        {
          type: "subheading",
          text: "Bottom Line",
        },
        {
          type: "paragraph",
          text: "nVNS looks most attractive as a non-drug adjunct or alternative in preventive cluster headache rather than as a strong first-choice technology for migraine.",
        },
        {
          type: "callout",
          variant: "info",
          title: "Clinical Application",
          text: "Best fit: patients with cluster headache who prefer a nonpharmacologic option, cannot tolerate standard therapy, or need an adjunctive preventive strategy. For migraine, this paper supports caution: nVNS may help some patients, but evidence strength and cost-effectiveness are weaker. Useful in shared decision-making because the report includes patient preference data showing strong interest in noninvasive options. Important service-design point: population-level funding decisions for migraine are heavily constrained by cost and budget impact.",
        },
        {
          type: "paragraph",
          text: "Ontario Health Technology Assessment Series. May 2025.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  Paper 4 – Diagnostic delay and its predictors                     */
    /* ------------------------------------------------------------------ */
    {
      id: "diagnostic-delay-and-predictors",
      title: "Cluster Headache Diagnostic Delay and Its Predictors",
      content: [
        {
          type: "callout",
          variant: "info",
          title: "Why This Paper Matters",
          text: "Immediately relevant to frontline neurology, general practice, emergency care, and ophthalmology because delayed recognition of cluster headache remains a major practical problem.",
        },
        {
          type: "subheading",
          text: "Key Points",
        },
        {
          type: "bullets",
          items: [
            "The pooled mean diagnostic delay for cluster headache was 10.43 years (95% CI 9.09\u201311.77), confirming a major unmet need in routine care.",
            "Diagnostic delay has improved over time, with progressive reductions since the 1960s.",
            "Autonomic features were associated with shorter delay, which is clinically plausible because they make the TAC phenotype more recognizable.",
            "Lower age at onset, alternating attack side, and nocturnal headaches were associated with longer delay.",
            "Migraine-like or atypical-appearing presentations can still confuse diagnosis.",
          ],
        },
        {
          type: "subheading",
          text: "Bottom Line",
        },
        {
          type: "paragraph",
          text: "The main practical value is diagnostic vigilance. Reminds clinicians to actively screen for cluster features whenever a patient reports strictly unilateral recurrent attacks, nocturnal attacks, agitation/restlessness, or cranial autonomic symptoms.",
        },
        {
          type: "callout",
          variant: "info",
          title: "Clinical Application",
          text: "In first-contact settings, ask directly about tearing, nasal blockage, ptosis, agitation, attack duration, and attack frequency rather than relying on the word \u201cmigraine.\u201d Alternating side and younger onset do not rule out CH; in fact, this paper suggests they may contribute to delay. Nocturnal attacks should increase suspicion rather than reassure against CH. Useful for education of non-headache specialists because reducing diagnostic delay is likely one of the highest-yield quality improvements in CH care.",
        },
        {
          type: "paragraph",
          text: "Van Obberghen EK, Fabre R, Lanteri-Minet M. The Journal of Headache and Pain. 2025.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  How to use in clinic                                              */
    /* ------------------------------------------------------------------ */
    {
      id: "how-to-use-in-clinic",
      title: "How to Use in Clinic",
      content: [
        {
          type: "bullets",
          items: [
            "Use the navigation pane to jump directly to a paper by topic or intervention.",
            "Search by terms such as smoking, CGRP, nVNS, or diagnostic delay to locate the relevant summary rapidly.",
            "These summaries are designed for day-to-day clinical use; for high-stakes decisions, confirm details against the original paper and current local guidance.",
          ],
        },
      ],
    },
  ],
};
