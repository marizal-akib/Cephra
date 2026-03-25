import type { Guideline } from "../types";

export const migraine: Guideline = {
  slug: "migraine",
  title: "Migraine in Adults",
  subtitle: "Evidence-based summary guideline",
  category: "primary-headaches",
  tags: [
    "migraine",
    "aura",
    "triptan",
    "CGRP",
    "preventive",
    "acute",
    "NICE",
    "botox",
    "gepant",
  ],
  sourceDocument: "Migraine.docx",
  sections: [
    /* ------------------------------------------------------------------ */
    /*  1. Key Practice Points                                            */
    /* ------------------------------------------------------------------ */
    {
      id: "key-practice-points",
      title: "Key Practice Points",
      content: [
        {
          type: "bullets",
          items: [
            "Migraine is a clinical diagnosis. Neuroimaging is not needed solely for reassurance when the history is typical and examination is normal.",
            "Typical attacks last 4\u201372 hours and are usually moderate or severe, aggravated by activity, and associated with nausea and/or photophobia/phonophobia.",
            "Aura is fully reversible, develops gradually over at least 5 minutes, and usually lasts 5\u201360 minutes.",
            "Offer acute treatment early: an oral triptan plus an NSAID, or an oral triptan plus paracetamol; consider anti-emetic therapy even without vomiting.",
            "For prevention, NICE now advises considering propranolol, topiramate, or amitriptyline first, with review after 3\u20136 months.",
            "In adults with at least 4 migraine days per month who have failed at least 3 preventive treatments, NICE allows specialist use of CGRP-pathway therapies and, in chronic migraine, botulinum toxin type A.",
            "Medication-overuse headache must be screened for in anyone using triptans/ergots/opioids/combination analgesics on at least 10 days per month, or simple analgesics/NSAIDs on at least 15 days per month for over 3 months.",
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  2. Pathophysiology                                                */
    /* ------------------------------------------------------------------ */
    {
      id: "pathophysiology",
      title: "Pathophysiology",
      content: [
        {
          type: "paragraph",
          text: "Current evidence supports migraine as a disorder of brain network excitability involving activation of the trigeminovascular system, release of calcitonin gene-related peptide (CGRP) and other neuropeptides, peripheral and central sensitisation, and altered sensory processing. This framework has replaced the older purely vascular model and is supported by the clinical effectiveness of CGRP-targeted therapies.",
        },
        {
          type: "paragraph",
          text: "Aura is best explained by cortical spreading depolarisation, a slowly propagating wave of neuronal and glial depolarisation followed by suppression of activity. Cortical spreading depolarisation is strongly linked to visual and sensory aura and may trigger trigeminal nociceptive pathways.",
        },
        {
          type: "paragraph",
          text: "Chronic migraine is thought to reflect progressive sensitisation and failure of pain-modulating networks, often worsened by medication overuse, sleep dysregulation, psychiatric comorbidity, obesity, and other modifiable factors.",
        },
        {
          type: "paragraph",
          text: "Migraine is best understood as a neurobiological disorder involving cortical spreading depolarisation, trigeminovascular activation, CGRP release, neurogenic inflammation, and peripheral/central sensitisation.",
        },
        {
          type: "paragraph",
          text: "Sensitisation is clinically important because it contributes to allodynia and may reduce the response to late acute treatment, particularly triptans once allodynia is established.",
        },
        {
          type: "paragraph",
          text: "Prodrome and postdrome deserve explicit recognition. Premonitory symptoms may include fatigue, neck pain, yawning, food cravings, irritability, cognitive slowing, photophobia, and phonophobia up to 24\u201348 hours before pain onset. Postdrome may last hours to a day and commonly causes fatigue, residual head pain on movement, and cognitive fog.",
        },
        {
          type: "paragraph",
          text: "Common aura phenotypes include visual, sensory, language, and rarely motor symptoms. Typical aura develops gradually, often spreads over several minutes, mixes positive and negative symptoms, and resolves completely.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  3. Typical Symptoms and Signs                                     */
    /* ------------------------------------------------------------------ */
    {
      id: "symptoms-and-signs",
      title: "Typical Symptoms and Signs",
      content: [
        {
          type: "table",
          headers: [
            "Domain",
            "Typical migraine features",
            "Clinical notes / red flags",
          ],
          rows: [
            [
              "Headache phenotype",
              "Often unilateral but may be bilateral; pulsating/throbbing; moderate\u2013severe; aggravated by routine activity; lasts 4\u201372 hours.",
              "Side-locked headache can still be migraine, but persistent fixed laterality or change in pattern warrants reconsideration.",
            ],
            [
              "Associated symptoms",
              "Nausea, vomiting, photophobia, phonophobia, osmophobia, cognitive slowing, fatigue, neck discomfort.",
              "Fever, meningism, jaw claudication, visual loss, immunosuppression, cancer history, or persistent vomiting suggest secondary causes.",
            ],
            [
              "Aura",
              "Fully reversible visual, sensory, or speech symptoms; gradual spread over \u22655 minutes; each symptom usually lasts 5\u201360 minutes.",
              "Motor weakness, monocular visual loss, diplopia, poor balance, or reduced consciousness are atypical and should prompt further assessment.",
            ],
            [
              "Prodrome / postdrome",
              "Yawning, mood change, food craving, neck stiffness, fatigue before attack; \u2018migraine hangover\u2019 afterwards.",
              "Useful diagnostically, especially in recurrent stereotyped attacks.",
            ],
            [
              "Examination",
              "Neurological examination is usually normal between attacks.",
              "Papilloedema, meningism, focal deficit, encephalopathy, or eye signs require urgent investigation.",
            ],
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  4. Diagnosis and Investigations                                   */
    /* ------------------------------------------------------------------ */
    {
      id: "diagnosis-and-investigations",
      title: "Diagnosis and Investigations",
      content: [],
      subsections: [
        {
          id: "clinical-diagnosis",
          title: "Clinical Diagnosis",
          content: [
            {
              type: "paragraph",
              text: "Diagnose migraine on a positive history rather than as a diagnosis of exclusion. NICE differentiates migraine from tension-type headache and cluster headache by headache quality, severity, aggravation by activity, associated symptoms, attack duration, and aura pattern.",
            },
            {
              type: "paragraph",
              text: "Suspect menstrual-related migraine when attacks occur predominantly from 2 days before to 3 days after menstruation in at least 2 of 3 consecutive cycles; confirm with a headache diary.",
            },
            {
              type: "bullets",
              items: [
                "Useful discriminators favouring migraine over tension-type headache include nausea, photophobia, phonophobia, and exacerbation with routine physical activity.",
              ],
            },
          ],
        },
        {
          id: "when-to-investigate",
          title: "When to Investigate",
          content: [
            {
              type: "paragraph",
              text: "Do not refer adults with typical migraine and a normal examination for neuroimaging solely for reassurance.",
            },
            {
              type: "paragraph",
              text: "Investigate or refer when there are red flags such as thunderclap onset, signs of raised intracranial pressure, new neurological deficit, atypical aura, systemic features, substantial change in headache pattern, cancer/immunosuppression risk, or headache triggered by cough, Valsalva, exertion, or posture.",
            },
            {
              type: "paragraph",
              text: "In practice, targeted tests depend on the suspected secondary cause: for example ESR/CRP for giant cell arteritis, MRI/MRA for atypical aura or focal neurology, CT/CTA for thunderclap headache, and ophthalmic assessment for acute angle-closure glaucoma or papilloedema.",
            },
            {
              type: "bullets",
              items: [
                "MRI is generally preferred in non-emergency settings where posterior fossa pathology, venous sinus disease, dissection, or CSF leak is a concern; CT remains appropriate first-line in acute emergency scenarios.",
              ],
            },
          ],
        },
        {
          id: "medication-overuse-screening",
          title: "Medication-Overuse Headache Screening",
          content: [
            {
              type: "paragraph",
              text: "Be alert to medication-overuse headache when attacks worsen while the patient is taking triptans, opioids, ergots, or combination analgesics on 10 or more days per month, or simple analgesics/NSAIDs on 15 or more days per month, for more than 3 months.",
            },
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  5. Acute Treatment                                                */
    /* ------------------------------------------------------------------ */
    {
      id: "acute-treatment",
      title: "Acute Treatment",
      content: [
        {
          type: "table",
          headers: ["Clinical situation", "Preferred treatment", "Notes"],
          rows: [
            [
              "Most adults",
              "Oral triptan + NSAID, or oral triptan + paracetamol.",
              "Give early in the attack. If monotherapy preferred, use oral triptan, NSAID, aspirin 900 mg, or paracetamol.",
            ],
            [
              "Prominent nausea/vomiting or poor oral tolerance",
              "Add anti-emetic; consider non-oral metoclopramide or prochlorperazine; add non-oral NSAID or triptan if needed.",
              "NICE allows anti-emetic use even without vomiting.",
            ],
            [
              "Triptan ineffective",
              "Try another triptan before classifying as failure.",
              "NICE advises starting with the lowest-cost triptan, then switching if consistently ineffective.",
            ],
            [
              "Triptan contraindicated / intolerant or inadequate after \u22652 triptans",
              "Rimegepant may be used under NICE TA919.",
              "Specialist/local formulary pathway may apply.",
            ],
            [
              "Avoid",
              "Opioids and ergots.",
              "They worsen outcomes and can drive medication overuse.",
            ],
          ],
        },
        {
          type: "bullets",
          items: [
            "Treat early and use an adequate initial dose. Large early doses are usually more effective than repeated small doses.",
            "Combining a triptan with an NSAID is often more effective than either alone. Sumatriptan-naproxen is the best studied combination.",
            "Patients with variable attacks often need more than one rescue plan, for example an oral regimen for milder attacks and a nasal or subcutaneous option for rapid-onset attacks with vomiting.",
            "Parenteral antiemetics such as metoclopramide or prochlorperazine are useful not only for nausea but also for headache relief, particularly in urgent care or emergency settings.",
            "For status migrainosus or severe refractory attacks, hospital treatment may include intravenous fluids plus ketorolac, metoclopramide or prochlorperazine, and sometimes dihydroergotamine or intravenous valproate.",
            "Adjunctive dexamethasone does not improve immediate pain relief but may reduce early headache recurrence after emergency department treatment.",
            "Opioids and barbiturate-containing combinations should be avoided except as a last resort.",
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  6. Preventive Treatment                                           */
    /* ------------------------------------------------------------------ */
    {
      id: "preventive-treatment",
      title: "Preventive Treatment",
      content: [
        {
          type: "paragraph",
          text: "Consider prevention when attacks are frequent, prolonged, disabling, or when acute therapy is overused, contraindicated, or ineffective.",
        },
        {
          type: "paragraph",
          text: "NICE first-line options to consider are propranolol, topiramate, or amitriptyline after a full discussion of suitability, comorbidity, and adverse effects.",
        },
        {
          type: "paragraph",
          text: "If the first preventive does not work or is not tolerated, try the second and then the third unless contraindicated.",
        },
        {
          type: "paragraph",
          text: "Do not offer gabapentin for migraine prevention.",
        },
        {
          type: "paragraph",
          text: "Review benefit after 3\u20136 months. Topiramate must not be used in pregnancy and in women/girls of childbearing potential unless the Pregnancy Prevention Programme conditions are met.",
        },
        {
          type: "bullets",
          items: [
            "A practical threshold commonly used in modern guidance is 4 or more headache days per month, but disability and treatment failure matter as much as frequency alone.",
            "Start low, titrate slowly, allow an adequate trial, use a diary to track monthly migraine days and acute medication use.",
            "Comorbidity-guided selection improves tolerability: amitriptyline may help when insomnia coexists, venlafaxine for anxiety/mood, topiramate in obesity, beta blockers with hypertension.",
            "Topiramate and valproate both have strong efficacy data, but topiramate should be avoided in pregnancy and valproate should generally be avoided in women of childbearing potential.",
            "Botulinum toxin should not be used for episodic migraine prevention; its role remains chronic migraine in line with NICE.",
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  7. Pregnancy and Hormonal Issues                                  */
    /* ------------------------------------------------------------------ */
    {
      id: "pregnancy-and-hormonal",
      title: "Pregnancy and Hormonal Issues",
      content: [
        {
          type: "paragraph",
          text: "During pregnancy, NICE recommends paracetamol first for acute treatment and says a triptan or an NSAID may be considered only after discussing risks and benefits. Seek specialist advice if prophylaxis is needed in pregnancy.",
        },
        {
          type: "paragraph",
          text: "Do not routinely offer combined hormonal contraception to women with migraine with aura.",
        },
        {
          type: "paragraph",
          text: "For predictable menstrual-related migraine not responding to standard acute therapy, NICE suggests short perimenstrual prophylaxis with frovatriptan or zolmitriptan.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  8. Specialist Therapies                                           */
    /* ------------------------------------------------------------------ */
    {
      id: "specialist-therapies",
      title: "Specialist Therapies",
      content: [
        {
          type: "table",
          headers: [
            "Therapy",
            "NICE status",
            "Who may receive it",
            "Stopping rule / review",
            "Comments",
          ],
          rows: [
            [
              "Greater occipital nerve block",
              "No specific NICE technology appraisal or CG150 recommendation for routine migraine use.",
              "Used variably in specialist practice; not a standard NICE-endorsed long-term pathway.",
              "No CG150 stopping rule.",
              "NICE surveillance in 2016 noted evidence but did not change CG150.",
            ],
            [
              "Botulinum toxin type A (BOTOX)",
              "Recommended (TA260) for chronic migraine.",
              "Adults with chronic migraine, after at least 3 preventive medicines have failed / are unsuitable / not tolerated, and medication overuse is appropriately managed.",
              "Stop if headache days do not reduce by at least 30% after 2 cycles, or if migraine becomes episodic for 3 consecutive months.",
              "Applies to chronic migraine; not a standard treatment for episodic migraine.",
            ],
            [
              "Atogepant",
              "Recommended (TA973, 2024).",
              "Adults with at least 4 migraine days per month when at least 3 preventive medicines have failed / are unsuitable / not tolerated.",
              "Stop after 12 weeks if migraine frequency does not reduce by at least 50% in episodic or 30% in chronic migraine.",
              "Oral gepant used for prevention; specialist/local pathway.",
            ],
            [
              "Rimegepant \u2013 prevention",
              "Recommended (TA906, 2023) for episodic migraine only.",
              "Adults with at least 4 and fewer than 15 migraine attacks per month when at least 3 preventive medicines have failed / are unsuitable / not tolerated.",
              "Stop after 12 weeks if attacks do not reduce by at least 50%.",
              "Oral CGRP receptor antagonist (gepant).",
            ],
            [
              "Rimegepant \u2013 acute treatment",
              "Recommended (TA919, 2023).",
              "Adults only if at least 2 triptans were ineffective, or triptans were contraindicated / not tolerated and NSAIDs plus paracetamol were insufficient.",
              "Use as acute therapy only; local prescribing pathway may apply.",
              "Useful particularly in triptan-ineligible or triptan-refractory patients.",
            ],
            [
              "Erenumab, fremanezumab, galcanezumab, eptinezumab",
              "Recommended by NICE TAs for prevention.",
              "Adults with at least 4 migraine days per month after failure / intolerance / unsuitability of at least 3 preventive medicines.",
              "Stop after 12 weeks if migraine frequency does not reduce by at least 50% in episodic or 30% in chronic migraine.",
              "CGRP-pathway monoclonal antibodies; choice depends on formulation, local pathway, and patient preference.",
            ],
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  9. International Guidance Updates                                 */
    /* ------------------------------------------------------------------ */
    {
      id: "international-guidance",
      title: "International Guidance Updates",
      content: [
        {
          type: "paragraph",
          text: "The 2024 AHS position statement says CGRP-targeting therapies should be considered a first-line option for migraine prevention and should not require prior failure of older non-specific preventive classes. This is more permissive than NICE, which still restricts NHS use mainly to patients who have failed at least 3 preventive medicines.",
        },
        {
          type: "paragraph",
          text: "The updated VA/DoD headache guideline (2023/2024) supports CGRP monoclonal antibodies for prevention and gepants for acute treatment, and places greater emphasis on rehabilitation, exercise, and multimodal care.",
        },
        {
          type: "paragraph",
          text: "The 2024 IHS global practice recommendations provide optimal and essential acute and preventive treatment frameworks to improve care across different health systems.",
        },
        {
          type: "paragraph",
          text: "European expert guidance continues to support CGRP monoclonal antibodies as effective and safe options for prevention.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  10. Practical Adult Migraine Pathway                              */
    /* ------------------------------------------------------------------ */
    {
      id: "practical-pathway",
      title: "Practical Adult Migraine Pathway",
      content: [
        {
          type: "numbered",
          items: [
            "Confirm a positive migraine diagnosis from the history and exclude red flags.",
            "Use a diary to document monthly migraine days, associated symptoms, acute medication use, and menstrual pattern.",
            "Start or optimise acute treatment: triptan + NSAID / paracetamol, plus anti-emetic if needed.",
            "Screen for medication-overuse headache and address it early.",
            "Offer prevention when attacks are disabling or frequent; consider propranolol, topiramate, or amitriptyline first, individualised to comorbidity and pregnancy potential.",
            "Escalate to specialist options when NICE criteria are met: botulinum toxin type A for chronic migraine, or CGRP-pathway therapies / gepants after adequate preventive failures.",
            "Review response objectively using monthly migraine days or headache days and apply stopping rules.",
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  11. Drug-Class Prescribing Caveats                                */
    /* ------------------------------------------------------------------ */
    {
      id: "prescribing-caveats",
      title: "Drug-Class Prescribing Caveats",
      content: [
        {
          type: "bullets",
          items: [
            "Triptans should generally be avoided in patients with hemiplegic migraine, migraine with brainstem aura, uncontrolled hypertension, ischaemic heart disease, prior stroke, or significant vasospastic disease, and should not be combined with another triptan or an ergot within the recommended exclusion interval.",
            "Gepants are useful when triptans are contraindicated, not tolerated, or ineffective. Intranasal zavegepant may help patients who cannot tolerate oral therapy because of nausea or vomiting.",
            "Lasmiditan is a non-vasoconstrictive acute option internationally, but it is not currently part of NICE migraine pathways and driving impairment precautions are important.",
            "Dihydroergotamine may be effective in refractory attacks but should not be used within 24 hours of a triptan, in pregnancy, or in patients with ischaemic vascular disease.",
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  12. Non-Pharmacological and Procedural Options                    */
    /* ------------------------------------------------------------------ */
    {
      id: "non-pharmacological",
      title: "Non-Pharmacological and Procedural Options",
      content: [
        {
          type: "bullets",
          items: [
            "Moderate support for behavioural and non-pharmacological prevention strategies such as regular aerobic exercise, biofeedback, relaxation approaches, cognitive-behavioural therapy, and selected neuromodulation approaches.",
            "Acupuncture remains a reasonable option within NICE after failure or intolerance of the usual oral preventive options, although effect sizes are modest.",
            "Peripheral nerve blocks, including greater occipital nerve block, may help selected refractory patients in specialist practice, but the evidence base is limited.",
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
            "NICE. Headaches in over 12s: diagnosis and management (CG150), accessed March 2026.",
            "NICE. Rimegepant for treating migraine (TA919), 2023.",
            "NICE. Rimegepant for preventing migraine (TA906), 2023.",
            "NICE. Atogepant for preventing migraine (TA973), 2024.",
            "NICE. Botulinum toxin type A for the prevention of headaches in adults with chronic migraine (TA260), 2012.",
            "NICE. Eptinezumab for preventing migraine (TA871), 2023.",
            "NICE. Fremanezumab for preventing migraine (TA764), 2022.",
            "NICE. Erenumab for preventing migraine (TA682), 2021.",
            "NICE. Galcanezumab for preventing migraine (TA659), 2020.",
            "Charles AC, et al. Calcitonin gene-related peptide-targeting therapies are a first-line option for migraine prevention: AHS position statement update. Headache. 2024.",
            "Sandbrink F, et al. 2023 VA/DoD Clinical Practice Guideline for the Management of Headache. Ann Intern Med. 2024.",
            "Puledda F, et al. IHS global practice recommendations for acute pharmacological treatment of migraine. Cephalalgia. 2024.",
            "Puledda F, et al. IHS Global Practice Recommendations for Preventive Pharmacological Treatment of Migraine. Cephalalgia. 2024.",
            "Sacco S, et al. EHF guideline on CGRP monoclonal antibodies for migraine prevention \u2013 2022 update.",
            "Eigenbrodt AK, et al. Diagnosis and management of migraine in ten steps. Nat Rev Neurol. 2021.",
            "Burch R, Rittenberg E. New treatments for migraine: CGRP monoclonal antibodies, gepants, and ditans. BMJ. 2025.",
          ],
        },
      ],
    },
  ],
};
