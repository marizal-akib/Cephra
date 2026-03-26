import type { Guideline } from "../types";

export const migraine: Guideline = {
  slug: "migraine",
  title: "Migraine in Adults",
  subtitle:
    "Evidence-based summary guideline - revised with additional evidence integration",
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
    "pathophysiology",
    "medication-overuse",
    "pregnancy",
    "CGRP-monoclonal-antibody",
    "rimegepant",
    "atogepant",
    "non-pharmacological",
  ],
  sourceDocument: "Migraine P.docx",
  sections: [
    /* ------------------------------------------------------------------ */
    /*  Scope and Caveat                                                   */
    /* ------------------------------------------------------------------ */
    {
      id: "scope-and-caveat",
      title: "Scope and Caveat",
      content: [
        {
          type: "callout",
          variant: "info",
          title: "Scope and caveat",
          text: "This document is a clinician-facing summary for adults with migraine. It synthesises NICE CG150 and relevant NICE technology appraisals with recent American Headache Society (AHS), VA/DoD, European Headache Federation (EHF), International Headache Society (IHS), and major review evidence. UpToDate full articles are paywalled; only publicly visible titles/summary lines could be verified directly, so no paywalled UpToDate text has been quoted.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  Key Practice Points                                                */
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
    /*  1. Pathophysiology                                                 */
    /* ------------------------------------------------------------------ */
    {
      id: "pathophysiology",
      title: "1. Pathophysiology",
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
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  2. Typical Symptoms and Signs                                      */
    /* ------------------------------------------------------------------ */
    {
      id: "symptoms-and-signs",
      title: "2. Typical Symptoms and Signs",
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
              "Often unilateral but may be bilateral; pulsating/throbbing; moderate-severe; aggravated by routine activity; lasts 4-72 hours.",
              "Side-locked headache can still be migraine, but persistent fixed laterality or change in pattern warrants reconsideration.",
            ],
            [
              "Associated symptoms",
              "Nausea, vomiting, photophobia, phonophobia, osmophobia, cognitive slowing, fatigue, neck discomfort.",
              "Fever, meningism, jaw claudication, visual loss, immunosuppression, cancer history, or persistent vomiting suggest secondary causes.",
            ],
            [
              "Aura",
              "Fully reversible visual, sensory, or speech symptoms; gradual spread over >=5 minutes; each symptom usually lasts 5-60 minutes.",
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
    /*  3. Diagnosis and Investigations                                    */
    /* ------------------------------------------------------------------ */
    {
      id: "diagnosis-and-investigations",
      title: "3. Diagnosis and Investigations",
      content: [],
      subsections: [
        {
          id: "clinical-diagnosis",
          title: "3.1 Clinical Diagnosis",
          content: [
            {
              type: "paragraph",
              text: "Diagnose migraine on a positive history rather than as a diagnosis of exclusion. NICE differentiates migraine from tension-type headache and cluster headache by headache quality, severity, aggravation by activity, associated symptoms, attack duration, and aura pattern.",
            },
            {
              type: "paragraph",
              text: "Suspect menstrual-related migraine when attacks occur predominantly from 2 days before to 3 days after menstruation in at least 2 of 3 consecutive cycles; confirm with a headache diary.",
            },
          ],
        },
        {
          id: "when-to-investigate",
          title: "3.2 When to Investigate",
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
          ],
        },
        {
          id: "medication-overuse-headache",
          title: "3.3 Medication-Overuse Headache",
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
    /*  4. Management                                                      */
    /* ------------------------------------------------------------------ */
    {
      id: "management",
      title: "4. Management",
      content: [],
      subsections: [
        {
          id: "general-measures",
          title: "4.1 General Measures",
          content: [
            {
              type: "paragraph",
              text: "Educate patients using a headache diary to capture frequency, severity, associated features, medication use, triggers, and menstrual association.",
            },
            {
              type: "paragraph",
              text: "Optimise sleep, hydration, regular meals, exercise, and trigger management. Avoid rigid trigger elimination strategies that worsen quality of life without clear benefit.",
            },
            {
              type: "paragraph",
              text: "Assess comorbidity (depression, anxiety, sleep disorder, obesity, hypertension, asthma, pregnancy potential, cardiovascular disease) because it influences drug choice.",
            },
          ],
        },
        {
          id: "acute-treatment",
          title: "4.2 Acute Treatment",
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
                  "Triptan contraindicated / intolerant or inadequate after >=2 triptans",
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
          ],
        },
        {
          id: "preventive-treatment",
          title: "4.3 Preventive Treatment",
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
              type: "callout",
              variant: "warning",
              text: "Do not offer gabapentin for migraine prevention.",
            },
            {
              type: "paragraph",
              text: "Review benefit after 3\u20136 months. Topiramate must not be used in pregnancy and in women/girls of childbearing potential unless the Pregnancy Prevention Programme conditions are met.",
            },
          ],
        },
        {
          id: "pregnancy-and-hormonal",
          title: "4.4 Pregnancy and Hormonal Issues",
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
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  5. NICE Specialist Therapies                                       */
    /* ------------------------------------------------------------------ */
    {
      id: "specialist-therapies",
      title: "5. NICE Specialist Therapies: GON, BOTOX, CGRP Therapies and Gepants",
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
              "Greater occipital nerve block (GON block)",
              "No specific NICE technology appraisal or CG150 recommendation for routine migraine use.",
              "Used variably in specialist practice; not a standard NICE-endorsed long-term pathway.",
              "No CG150 stopping rule.",
              "NICE surveillance in 2016 noted evidence on occipital nerve block but did not change CG150. Separate NICE guidance exists for occipital nerve stimulation, not GON block.",
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
              "NICE CG150: stop after 12 weeks if migraine frequency does not reduce by at least 50% in episodic or 30% in chronic migraine.",
              "Oral gepant used for prevention; specialist/local pathway.",
            ],
            [
              "Rimegepant - prevention",
              "Recommended (TA906, 2023) for episodic migraine only.",
              "Adults with at least 4 and fewer than 15 migraine attacks per month when at least 3 preventive medicines have failed / are unsuitable / not tolerated.",
              "Stop after 12 weeks if attacks do not reduce by at least 50%.",
              "Oral CGRP receptor antagonist (gepant).",
            ],
            [
              "Rimegepant - acute treatment",
              "Recommended (TA919, 2023).",
              "Adults only if at least 2 triptans were ineffective, or triptans were contraindicated / not tolerated and NSAIDs plus paracetamol were insufficient.",
              "Use as acute therapy only; local prescribing pathway may apply.",
              "Useful particularly in triptan-ineligible or triptan-refractory patients.",
            ],
            [
              "Erenumab, fremanezumab, galcanezumab, eptinezumab",
              "Recommended by NICE TAs for prevention.",
              "Adults with at least 4 migraine days per month after failure / intolerance / unsuitability of at least 3 preventive medicines.",
              "NICE CG150: stop after 12 weeks if migraine frequency does not reduce by at least 50% in episodic or 30% in chronic migraine.",
              "CGRP-pathway monoclonal antibodies; choice depends on formulation, local pathway, and patient preference.",
            ],
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  6. What Recent American and European Guidance Adds                  */
    /* ------------------------------------------------------------------ */
    {
      id: "international-guidance",
      title: "6. What Recent American and European Guidance Adds",
      content: [
        {
          type: "paragraph",
          text: "The 2024 AHS position statement says CGRP-targeting therapies should be considered a first-line option for migraine prevention and should not require prior failure of older non-specific preventive classes. This is more permissive than NICE, which still restricts NHS use mainly to patients who have failed at least 3 preventive medicines.",
        },
        {
          type: "paragraph",
          text: "The updated VA/DoD headache guideline (2023/2024 primary-care summary) supports CGRP monoclonal antibodies for prevention and gepants for acute treatment, and places greater emphasis on rehabilitation, exercise, and multimodal care.",
        },
        {
          type: "paragraph",
          text: "The 2024 IHS global practice recommendations provide optimal and essential acute and preventive treatment frameworks to improve care across different health systems, again supporting migraine-specific therapies including gepants where available.",
        },
        {
          type: "paragraph",
          text: "European expert guidance continues to support CGRP monoclonal antibodies as effective and safe options for prevention, and EHF consensus statements have helped define triptan failure and refractory migraine more explicitly, which is clinically useful when deciding whether to escalate therapy.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  7. Practical Adult Migraine Pathway                                */
    /* ------------------------------------------------------------------ */
    {
      id: "practical-pathway",
      title: "7. Practical Adult Migraine Pathway",
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
    /*  8. Important Limitations and Points of Interpretation              */
    /* ------------------------------------------------------------------ */
    {
      id: "limitations",
      title: "8. Important Limitations and Points of Interpretation",
      content: [
        {
          type: "bullets",
          items: [
            "This document summarises guidance and evidence; it is not a substitute for full NICE technology appraisals, local formulary rules, MHRA safety updates, or specialist judgement.",
            "NICE access criteria reflect NHS cost-effectiveness decisions and are narrower than regulatory licences or some American recommendations.",
            "No NICE guideline specifically endorses routine greater occipital nerve block for migraine prevention. NICE material more clearly addresses occipital nerve stimulation rather than injection-based GON block.",
            "UpToDate content is proprietary. Only publicly visible bibliographic and summary information could be verified directly for this report.",
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  9. Addendum: Additional Evidence Integrated                        */
    /* ------------------------------------------------------------------ */
    {
      id: "addendum",
      title: "9. Addendum: Additional Evidence Integrated from Supplied Reference Text",
      content: [
        {
          type: "paragraph",
          text: "This revision incorporates clinically relevant points from the supplied reference extracts on migraine pathophysiology, acute treatment, and preventive treatment.",
        },
      ],
      subsections: [
        {
          id: "additional-pathophysiology",
          title: "9.1 Additional Pathophysiology and Clinical Features",
          content: [
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
              text: "Prodrome and postdrome deserve explicit recognition in clinical assessment. Premonitory symptoms may include fatigue, neck pain, yawning, food cravings, irritability, cognitive slowing, photophobia, and phonophobia up to 24\u201348 hours before pain onset. Postdrome may last hours to a day and commonly causes fatigue, residual head pain on movement, and cognitive fog.",
            },
            {
              type: "paragraph",
              text: "Common aura phenotypes include visual, sensory, language, and rarely motor symptoms. Typical aura develops gradually, often spreads over several minutes, mixes positive and negative symptoms, and resolves completely.",
            },
          ],
        },
        {
          id: "practical-diagnosis-additions",
          title: "9.2 Practical Additions for Diagnosis and Investigation",
          content: [
            {
              type: "paragraph",
              text: "The supplied material reinforces that migraine should be diagnosed positively using ICHD-3 compatible features rather than as a diagnosis of exclusion.",
            },
            {
              type: "paragraph",
              text: "Useful discriminators favouring migraine over tension-type headache include nausea, photophobia, phonophobia, and exacerbation with routine physical activity.",
            },
            {
              type: "paragraph",
              text: "Imaging is not required for most patients with a typical history and normal examination, but it is reasonable when there is abrupt onset, postural headache, new abnormal neurological examination, change in pattern, late onset, immune compromise, pregnancy-related concern, or failure to meet criteria for a primary headache disorder.",
            },
            {
              type: "paragraph",
              text: "MRI is generally preferred in non-emergency settings where posterior fossa pathology, venous sinus disease, dissection, or CSF leak is a concern; CT remains appropriate first-line in acute emergency scenarios such as suspected subarachnoid haemorrhage or intracerebral haemorrhage.",
            },
          ],
        },
        {
          id: "acute-treatment-refinements",
          title: "9.3 Acute Treatment Refinements",
          content: [
            {
              type: "paragraph",
              text: "Treat early and use an adequate initial dose. Large early doses are usually more effective than repeated small doses, and non-oral therapy should be chosen early for attacks with prominent nausea, vomiting, or poor gastric absorption.",
            },
            {
              type: "paragraph",
              text: "For mild attacks, simple analgesics remain reasonable first-line treatment. For moderate-severe attacks, triptans with or without an NSAID remain the core evidence-based option unless contraindicated.",
            },
            {
              type: "paragraph",
              text: "Combining a triptan with an NSAID is often more effective than either alone. Sumatriptan-naproxen is the best studied combination, but co-prescription of another triptan with an NSAID is also commonly used in practice.",
            },
            {
              type: "paragraph",
              text: "Patients with variable attacks often need more than one rescue plan, for example an oral regimen for milder attacks and a nasal or subcutaneous option for rapid-onset attacks with vomiting.",
            },
            {
              type: "paragraph",
              text: "Parenteral antiemetics such as metoclopramide or prochlorperazine are useful not only for nausea but also for headache relief, particularly in urgent care or emergency settings. Diphenhydramine may be co-administered to reduce akathisia or dystonic reactions when dopamine antagonists are used.",
            },
            {
              type: "paragraph",
              text: "For status migrainosus or severe refractory attacks, hospital treatment may include intravenous fluids plus ketorolac, metoclopramide or prochlorperazine, and sometimes dihydroergotamine or intravenous valproate depending on response and contraindications.",
            },
            {
              type: "paragraph",
              text: "Adjunctive dexamethasone does not improve immediate pain relief but may reduce early headache recurrence after emergency department treatment.",
            },
            {
              type: "paragraph",
              text: "Opioids and barbiturate-containing combinations should be avoided except as a last resort because they are less effective for migraine, increase return visits, and strongly increase the risk of medication-overuse headache and chronification.",
            },
          ],
        },
        {
          id: "drug-class-caveats",
          title: "9.4 Drug-Class Caveats",
          content: [
            {
              type: "paragraph",
              text: "Triptans should generally be avoided in patients with hemiplegic migraine, migraine with brainstem aura, uncontrolled hypertension, ischaemic heart disease, prior stroke, or significant vasospastic disease, and should not be combined with another triptan or an ergot within the recommended exclusion interval.",
            },
            {
              type: "paragraph",
              text: "Gepants are useful when triptans are contraindicated, not tolerated, or ineffective. The supplied evidence also supports the practical value of intranasal zavegepant for patients who cannot tolerate oral therapy because of nausea or vomiting, although UK availability and local formulary status should always be checked before prescribing.",
            },
            {
              type: "paragraph",
              text: "Lasmiditan is a non-vasoconstrictive acute option internationally, but it is not currently part of NICE migraine pathways and driving impairment precautions are important where it is available.",
            },
            {
              type: "paragraph",
              text: "Dihydroergotamine may be effective in refractory attacks but should not be used within 24 hours of a triptan, in pregnancy, or in patients with ischaemic vascular disease.",
            },
          ],
        },
        {
          id: "preventive-treatment-refinements",
          title: "9.5 Preventive Treatment Refinements",
          content: [
            {
              type: "paragraph",
              text: "The supplied prevention material supports offering preventive therapy when migraine is frequent, prolonged, disabling, poorly responsive to acute therapy, associated with medication overuse risk, or when acute options are contraindicated. A practical threshold commonly used in modern guidance is 4 or more headache days per month, but disability and treatment failure matter as much as frequency alone.",
            },
            {
              type: "paragraph",
              text: "General preventive principles should be explicit: start low, titrate slowly, allow an adequate trial, use a diary to track monthly migraine days and acute medication use, and review only after enough time has passed for benefit to emerge.",
            },
            {
              type: "paragraph",
              text: "Comorbidity-guided selection improves tolerability: amitriptyline may help when insomnia coexists, venlafaxine may help when anxiety or mood symptoms coexist, topiramate may help in obesity, and beta blockers may be useful in some patients with hypertension but should be used cautiously in asthma, bradycardia, Raynaud phenomenon, and low blood pressure.",
            },
            {
              type: "callout",
              variant: "warning",
              text: "Topiramate and valproate both have strong efficacy data, but the supplied evidence reinforces important safety counselling: topiramate should be avoided in pregnancy and valproate should generally be avoided in women of childbearing potential because of teratogenic and neurodevelopmental risk.",
            },
            {
              type: "paragraph",
              text: "Botulinum toxin should not be used for episodic migraine prevention on the basis of current evidence; its role remains chronic migraine in line with NICE.",
            },
            {
              type: "paragraph",
              text: "The supplied text supports the 2024 American Headache Society position that CGRP-targeting therapies may be used as first-line preventive options in some health systems, but this remains broader than current NICE commissioning criteria, which still require failure, intolerance, or unsuitability of at least 3 preventive medicines before specialist CGRP-pathway treatment.",
            },
          ],
        },
        {
          id: "non-pharmacological-additions",
          title: "9.6 Non-Pharmacological and Procedural Additions",
          content: [
            {
              type: "paragraph",
              text: "The supplied evidence adds moderate support for behavioural and non-pharmacological prevention strategies such as regular aerobic exercise, biofeedback, relaxation approaches, cognitive-behavioural therapy, and selected neuromodulation approaches.",
            },
            {
              type: "paragraph",
              text: "Acupuncture remains a reasonable option within NICE after failure or intolerance of the usual oral preventive options, although effect sizes are modest and sham-controlled trials suggest part of the benefit may be non-specific.",
            },
            {
              type: "paragraph",
              text: "Peripheral nerve blocks, including greater occipital nerve block, may help selected refractory patients in specialist practice, especially when acute attacks are prolonged or difficult to control, but the evidence base is limited and this should not be overstated as a routine NICE-endorsed preventive strategy for uncomplicated episodic migraine.",
            },
          ],
        },
        {
          id: "what-changed",
          title: "9.7 What Changed in This Revision",
          content: [
            {
              type: "bullets",
              items: [
                "Expanded the explanation of prodrome, aura, postdrome, allodynia, and sensitisation.",
                "Added practical acute-care detail on non-oral therapy, emergency department management, dexamethasone, valproate, and avoidance of opioids/barbiturates.",
                "Strengthened preventive treatment guidance with explicit indications, comorbidity-based agent selection, and clarification that botulinum toxin is not recommended for episodic migraine prevention.",
                "Added a clearer distinction between broader American first-line CGRP practice and narrower NICE access criteria.",
              ],
            },
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  10. Practical Medication Summary                                   */
    /* ------------------------------------------------------------------ */
    {
      id: "medication-summary",
      title: "10. Practical Medication Summary for Acute and Preventive Treatment",
      content: [],
      subsections: [
        {
          id: "acute-medication-summary",
          title: "10.1 Acute Treatment Summary",
          content: [
            {
              type: "paragraph",
              text: "Use acute treatment early in the attack. Choose non-oral options when nausea, vomiting, or poor gastric absorption limits oral therapy. Avoid opioid-based escalation where possible because of poorer efficacy and medication-overuse risk.",
            },
            {
              type: "table",
              headers: [
                "Medicine / class",
                "Usual adult dose",
                "Key place in therapy",
                "Important cautions / practical notes",
              ],
              rows: [
                [
                  "Aspirin",
                  "900 mg as soon as symptoms develop.",
                  "Simple analgesic option for acute migraine, especially if attacks are mild-moderate or when a triptan is not yet required.",
                  "Avoid in peptic ulcer disease, bleeding risk, aspirin hypersensitivity, and late pregnancy. Consider gastroprotection if recurrent use is likely.",
                ],
                [
                  "Sumatriptan",
                  "Oral 50-100 mg; nasal 10-20 mg; subcutaneous 6 mg. Maximum depends on formulation.",
                  "SIGN recommends sumatriptan as first-choice triptan for most adults. Nasal or subcutaneous formulations are useful when vomiting or rapid escalation occurs.",
                  "Avoid in ischaemic heart disease, previous TIA/stroke, significant peripheral vascular disease, uncontrolled hypertension, severe hepatic impairment, or with ergot/triptan overlap. If the first dose fails completely, do not repeat for the same attack.",
                ],
                [
                  "Zolmitriptan",
                  "Oral 2.5 mg, may repeat after at least 2 hours; intranasal 5 mg. Menstrual prophylaxis: 2.5 mg three times daily from 2 days before until 3 days after bleeding starts.",
                  "Alternative triptan when sumatriptan is ineffective or poorly tolerated; intranasal option is helpful when oral absorption is unreliable.",
                  "Same class contraindications as other triptans. Useful to remember as a short perimenstrual prophylaxis option in selected patients.",
                ],
                [
                  "Rizatriptan",
                  "10 mg orally, may repeat after 2 hours if migraine recurs; maximum 20 mg/day.",
                  "Alternative triptan with good 2-hour pain response in some patients.",
                  "Reduce maximum dose to 5 mg per dose if also taking propranolol; do not take within 2 hours of propranolol. Same cardiovascular and cerebrovascular contraindications as other triptans.",
                ],
                [
                  "Other triptans",
                  "Examples: almotriptan 12.5 mg, eletriptan 40-80 mg, frovatriptan 2.5 mg, naratriptan 2.5 mg.",
                  "Try another triptan if the first choice is ineffective or poorly tolerated. Some agents differ in recurrence risk and tolerability.",
                  "Eletriptan should not be combined with strong CYP3A4 inhibitors. Frovatriptan and naratriptan may be better tolerated but often act more slowly.",
                ],
                [
                  "Rimegepant (acute)",
                  "75 mg orally as required.",
                  "NICE acute option in adults when at least 2 triptans were ineffective, not tolerated, or contraindicated and NSAID/paracetamol strategies were insufficient.",
                  "Check local formulary pathway. Useful when vasoconstrictor triptans are unsuitable.",
                ],
                [
                  "Metoclopramide",
                  "10 mg orally, IM, or slow IV up to 3 times daily for a maximum of 5 days.",
                  "Adjunct for migraine with nausea or vomiting; can also improve headache response in urgent care settings.",
                  "Not licensed specifically for migraine. Short-term use only because of dystonia and other extrapyramidal effects. Avoid in GI obstruction/perforation, phaeochromocytoma, epilepsy, and Parkinson disease. Use caution in younger people, older adults, and cardiac conduction disorders.",
                ],
                [
                  "Prochlorperazine",
                  "10 mg orally as a single dose for acute migraine; buccal formulations may help for nausea/vomiting in previously diagnosed migraine.",
                  "Alternative anti-emetic / anti-migraine adjunct when nausea, vomiting, or poor oral tolerance is prominent.",
                  "Not licensed specifically for migraine. Sedation and extrapyramidal adverse effects can occur. Avoid in Parkinson disease, phaeochromocytoma, significant QT prolongation, myasthenia gravis, or marked CNS depression. Consider ECG risk if other QT-prolonging drugs are present.",
                ],
              ],
            },
          ],
        },
        {
          id: "preventive-medication-summary",
          title: "10.2 Preventive Treatment Summary",
          content: [
            {
              type: "paragraph",
              text: "Consider prevention when attacks are frequent, prolonged, disabling, acute therapy is overused, or acute options are ineffective or contraindicated. Start low, titrate slowly, and review benefit objectively with a diary after an adequate trial.",
            },
            {
              type: "table",
              headers: [
                "Medicine / class",
                "Usual adult dose",
                "Clinical role",
                "Important cautions / practical notes",
              ],
              rows: [
                [
                  "Propranolol",
                  "80-240 mg daily in divided doses.",
                  "One of the core NICE/SIGN/BASH preventive options for episodic or chronic migraine.",
                  "Avoid in asthma or obstructive airways disease, marked bradycardia, hypotension, heart block, Prinzmetal angina, significant peripheral vascular disease, or uncompensated heart failure. Can mask hypoglycaemia and thyrotoxicosis. Use caution in diabetes, psoriasis, myasthenia gravis, renal/hepatic impairment, and history of anaphylaxis.",
                ],
                [
                  "Topiramate",
                  "Start 25 mg at night for 1 week, then increase by 25 mg weekly; usual 50-100 mg/day in 2 divided doses; maximum 200 mg/day.",
                  "One of the core first-line preventive options and also useful when weight reduction is desirable.",
                  "Strictly contraindicated in pregnancy. Do not use in women of childbearing potential unless Pregnancy Prevention Programme requirements are met. Warn about cognitive slowing, mood change, nephrolithiasis, metabolic acidosis, acute angle-closure glaucoma, reduced sweating, and interaction with hormonal contraception.",
                ],
                [
                  "Amitriptyline",
                  "Usually start 10-25 mg at night and increase every 3-7 days; usual 25-75 mg nightly. SIGN target often 30-50 mg; higher doses occasionally used with caution.",
                  "Reasonable option when insomnia, chronic pain, or tension-type overlap coexists.",
                  "Use caution in older adults and cardiovascular disease. Anticholinergic effects, sedation, weight gain, and overdose toxicity should be discussed.",
                ],
                [
                  "Candesartan",
                  "16 mg once daily (unlicensed for migraine prophylaxis).",
                  "Useful alternative preventive when standard first-line options are unsuitable or not tolerated.",
                  "Avoid in pregnancy, severe hepatic impairment, or cholestasis. Use caution in renal impairment, renal artery stenosis, aortic/mitral stenosis, hypertrophic cardiomyopathy, primary aldosteronism, angioedema history, and in older adults prone to hyperkalaemia or postural hypotension.",
                ],
                [
                  "Atogepant",
                  "60 mg once daily.",
                  "Oral CGRP-receptor antagonist for prevention in adults with at least 4 migraine days per month, generally after failure/intolerance of 3 preventives under NICE criteria.",
                  "Specialist or formulary-restricted pathway may apply. Review after 12 weeks and stop if NICE response thresholds are not met.",
                ],
                [
                  "Rimegepant (prevention)",
                  "75 mg on alternate days.",
                  "Oral gepant preventive option for episodic migraine in adults meeting NICE access criteria.",
                  "NICE prevention use is generally for episodic migraine after failure/intolerance of 3 preventive options. Review response after 12 weeks.",
                ],
                [
                  "Erenumab",
                  "70 mg subcutaneously every 4 weeks; may increase to 140 mg every 4 weeks.",
                  "Specialist CGRP-pathway preventive for adults with at least 4 migraine days per month after failure/intolerance of 3 preventives.",
                  "Review after 3 months; stop if ineffective. Useful when oral preventive burden is high or poorly tolerated.",
                ],
                [
                  "Fremanezumab",
                  "225 mg monthly or 675 mg every 3 months subcutaneously.",
                  "Specialist CGRP-pathway preventive option.",
                  "Review within the first 3 months and regularly thereafter.",
                ],
                [
                  "Galcanezumab",
                  "Loading dose 240 mg once, then 120 mg monthly subcutaneously.",
                  "Specialist CGRP-pathway preventive option.",
                  "Review at 3 months; stop if response is inadequate according to local/NICE criteria.",
                ],
                [
                  "Eptinezumab",
                  "100 mg IV every 12 weeks; may increase to 300 mg every 12 weeks.",
                  "Intravenous CGRP-pathway preventive option, typically initiated by a specialist.",
                  "Assess need for dose escalation within the first 12 weeks and review treatment after 6 months.",
                ],
              ],
            },
          ],
        },
        {
          id: "practical-safety-notes",
          title: "10.3 Practical Safety Notes",
          content: [
            {
              type: "bullets",
              items: [
                "Screen actively for medication-overuse headache before escalating therapy, especially if triptans, combination analgesics, or NSAIDs are used frequently.",
                "Check pregnancy status and pregnancy plans before prescribing topiramate or candesartan, and discuss contraception clearly where relevant.",
                "Before prescribing a triptan, review cardiovascular and cerebrovascular history, blood pressure control, and interacting drugs.",
                "Use anti-emetics such as metoclopramide only short term because of extrapyramidal risk; warn about sedation and driving with prochlorperazine.",
                "For newer gepants and CGRP monoclonal antibodies, confirm local access criteria, response thresholds, and review dates at the point of prescribing.",
              ],
            },
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    /*  References                                                         */
    /* ------------------------------------------------------------------ */
    {
      id: "references",
      title: "References",
      content: [
        {
          type: "numbered",
          items: [
            "NICE. Headaches in over 12s: diagnosis and management (CG150), recommendations page, accessed March 2026.",
            "NICE. Rimegepant for treating migraine (TA919), 2023.",
            "NICE. Rimegepant for preventing migraine (TA906), 2023.",
            "NICE. Atogepant for preventing migraine (TA973), 2024.",
            "NICE. Botulinum toxin type A for the prevention of headaches in adults with chronic migraine (TA260), 2012.",
            "NICE. Eptinezumab for preventing migraine (TA871), 2023.",
            "NICE. Fremanezumab for preventing migraine (TA764), 2022.",
            "NICE. Erenumab for preventing migraine (TA682), 2021.",
            "NICE. Galcanezumab for preventing migraine (TA659), 2020.",
            "NICE. Surveillance report 2016 - Headaches in over 12s: diagnosis and management (CG150).",
            "NICE. Occipital nerve stimulation for intractable chronic migraine (HTG310/IPG452).",
            "Various UpToDate, AHS, VA/DoD, IHS, EHF sources as cited in the text.",
          ],
        },
      ],
    },
  ],
};
