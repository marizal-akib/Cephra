import type { Guideline } from "../types";

export const migraineVariants: Guideline = {
  slug: "migraine-variants",
  title: "Adult Migraine Variants and Hormone / Stroke Considerations",
  subtitle:
    "Summary of NICE, American and European guidance for estrogen-associated migraine, hemiplegic migraine, vestibular migraine, and migraine-associated stroke",
  category: "primary-headaches",
  tags: [
    "migraine variants",
    "menstrual migraine",
    "estrogen",
    "hemiplegic migraine",
    "vestibular migraine",
    "migrainous infarction",
    "stroke",
    "contraception",
    "aura",
    "hormonal",
    "frovatriptan",
    "verapamil",
  ],
  sourceDocument: "Migraine variants.docx",
  sections: [
    {
      id: "scope-and-method",
      title: "Scope and Method",
      content: [
        {
          type: "callout",
          variant: "info",
          text: "This document synthesizes the user-supplied source material with current public guidance and consensus documents. Where formal subtype-specific guidelines are lacking, the summary explicitly labels recommendations as consensus-based or extrapolated from broader migraine guidance rather than high-certainty randomized evidence.",
        },
      ],
    },
    {
      id: "executive-summary",
      title: "Executive Summary",
      content: [
        {
          type: "table",
          headers: [
            "Topic",
            "What NICE clearly covers",
            "What American / European guidance adds",
            "Practical takeaway",
          ],
          rows: [
            [
              "Estrogen-associated migraine",
              "Menstrual-related migraine is recognized; short-term frovatriptan or zolmitriptan may be considered for predictable attacks; combined hormonal contraception should not routinely be offered to people with migraine with aura.",
              "American stroke-prevention and headache guidance puts more emphasis on vascular risk-factor modification, shared decision-making about contraception, and use of progestin-only or non-hormonal contraception when aura is present.",
              "For predictable menstrual attacks, use diary-confirmed timing and mini-prophylaxis; avoid routine combined hormonal contraception in aura.",
            ],
            [
              "Hemiplegic migraine",
              "No dedicated NICE treatment pathway; motor aura should prompt consideration of further investigation or referral.",
              "Current practice remains largely consensus-based. Diagnosis is clinical; imaging is important when symptoms are new, prolonged or atypical. Vasoconstrictive drugs are still commonly avoided.",
              "Treat as a rare specialist migraine subtype and as a stroke mimic until proven otherwise during acute first presentations.",
            ],
            [
              "Vestibular migraine",
              "No dedicated NICE subtype guideline.",
              "Barany Society / IHS 2022 criteria define diagnosis; treatment recommendations are largely extrapolated from standard migraine preventives plus vestibular symptomatic treatment.",
              "Make the diagnosis clinically after excluding Meniere disease, BPPV, stroke and other vestibular syndromes.",
            ],
            [
              "Migraine-associated stroke",
              "NICE covers migraine and contraception, but not a dedicated migrainous infarction pathway.",
              "AHA/ASA 2024 emphasizes vascular risk-factor assessment in adults with migraine and recommends progestin-only or non-hormonal contraception for people with aura who need contraception.",
              "Persistent aura >60 minutes with matching infarction on imaging should be treated as stroke first, not as benign migraine.",
            ],
          ],
        },
      ],
    },
    {
      id: "cross-guideline-principles",
      title: "Cross-Guideline Principles",
      content: [
        {
          type: "bullets",
          items: [
            "NICE CG150 remains the core UK migraine guideline and was last updated on 3 June 2025. It covers migraine with and without aura, menstrual-related migraine, and chronic migraine prevention, but it does not provide a dedicated full management pathway for vestibular migraine or hemiplegic migraine.",
            "Recent American and international guidance is more permissive than NICE around CGRP-targeting therapies for prevention in general migraine care, but that broader first-line stance does not automatically translate into strong condition-specific evidence for rarer subtypes such as hemiplegic migraine or vestibular migraine.",
            "For hemiplegic migraine and vestibular migraine, diagnosis remains primarily clinical and specialist-led; treatment recommendations are still driven largely by expert consensus, small studies, observational data, and extrapolation from common migraine practice.",
            "Across all four topics in this document, red-flag assessment remains essential: new focal deficit, prolonged atypical aura, first severe vertigo syndrome, thunderclap onset, reduced consciousness, fever, meningism, or objective persistent neurologic deficit should trigger urgent evaluation for secondary causes.",
          ],
        },
      ],
    },
    {
      id: "estrogen-associated-migraine",
      title: "Estrogen-Associated Migraine",
      content: [
        {
          type: "subheading",
          text: "Clinical definition",
        },
        {
          type: "paragraph",
          text: "This term includes pure menstrual migraine, menstrually related migraine and hormonally triggered attacks linked to menstruation, the hormone-free interval of combined hormonal contraception, pregnancy/postpartum shifts, perimenopause and exogenous hormone exposure. In practice, diary confirmation over at least two cycles is helpful before labeling attacks as truly menstrual or estrogen-withdrawal related.",
        },
        {
          type: "subheading",
          text: "Key diagnostic points",
        },
        {
          type: "bullets",
          items: [
            "Suspect menstrual-related migraine when attacks cluster from day \u22122 to day +3 around menstruation in at least two out of three cycles.",
            "Establish whether aura is present, because aura materially changes contraceptive and stroke-risk counselling.",
            "Clarify whether attacks occur only in the menstrual window or also outside it; this helps distinguish pure menstrual migraine from menstrually related migraine.",
            "Take a specific history of combined hormonal contraception, hormone-free week symptoms, pregnancy, postpartum relapse, breastfeeding, fertility treatment and perimenopausal worsening.",
          ],
        },
        {
          type: "subheading",
          text: "Management summary",
        },
        {
          type: "bullets",
          items: [
            "Lifestyle and routine measures remain the foundation: regular sleep, meals, exercise, trigger tracking, and avoidance of medication overuse.",
            "Acute treatment is the same as for other migraine attacks and should be stratified by severity and nausea burden.",
            "Mini-prophylaxis is appropriate for predictable attacks, especially regular menstrual attacks.",
            "Continuous prevention is preferred when cycles are irregular, attacks are unpredictable, attacks are frequent or severe, or mini-prophylaxis fails.",
          ],
        },
        {
          type: "subheading",
          text: "What current guidance supports",
        },
        {
          type: "bullets",
          items: [
            "NICE recommends considering frovatriptan 2.5 mg twice daily or zolmitriptan 2.5 mg two or three times daily on the days migraine is expected for predictable menstrual-related migraine that does not respond adequately to standard acute treatment.",
            "NICE also advises that combined hormonal contraceptives should not routinely be offered for contraception to women and girls with migraine with aura.",
            "For migraine prevention in general, NICE now places propranolol, topiramate and amitriptyline side by side as \u201cconsider\u201d options after discussion of risks and suitability; this broader preventive framework can also inform patients with estrogen-associated migraine whose attacks are not adequately controlled by mini-prophylaxis.",
            "American stroke-prevention guidance recommends vascular risk-factor assessment for adults with migraine and favors progestin-only or non-hormonal contraception when aura is present and contraception is needed.",
          ],
        },
        {
          type: "callout",
          variant: "info",
          text: "Practical prescribing approach. For predictable menstrual attacks: start with diary-based timing, then consider naproxen mini-prophylaxis, and escalate to cyclic frovatriptan or zolmitriptan if needed. For irregular, frequent or disabling hormonally linked attacks, move to standard continuous migraine prevention or continuous/extended hormonal suppression when appropriate and safe.",
        },
        {
          type: "subheading",
          text: "Special situations: pregnancy, postpartum, perimenopause",
        },
        {
          type: "bullets",
          items: [
            "Pregnancy: migraine often worsens in the first trimester and improves later; preventive drug choices are narrower, so non-pharmacologic measures and pregnancy-compatible acute therapy are preferred.",
            "Postpartum and lactation: relapse is common, especially after abrupt postpartum estrogen withdrawal. NSAIDs and triptans are commonly used; ergots should be avoided during breastfeeding.",
            "Perimenopause: migraine may transiently worsen while hormone levels fluctuate. Transdermal physiologic-dose menopausal hormone therapy is generally viewed differently from combined hormonal contraception and may be acceptable after vascular risk assessment.",
          ],
        },
      ],
    },
    {
      id: "hemiplegic-migraine",
      title: "Hemiplegic Migraine",
      content: [
        {
          type: "subheading",
          text: "Clinical position",
        },
        {
          type: "paragraph",
          text: "Hemiplegic migraine is a rare migraine-with-aura subtype defined by reversible motor weakness plus at least one other aura feature. It may be familial or sporadic. Because it closely mimics stroke, especially during first or atypical presentations, urgent evaluation is often required.",
        },
        {
          type: "subheading",
          text: "Diagnosis and red flags",
        },
        {
          type: "bullets",
          items: [
            "Diagnosis is clinical, but imaging is important when symptoms are prolonged, atypical, unusually severe, first-ever, or when the cause is uncertain.",
            "A careful family history helps separate familial from sporadic hemiplegic migraine, but genetic testing is not required in every case.",
            "Common differentials include TIA or stroke, seizure with Todd paresis, SMART syndrome, HaNDL, tumor, infection, and metabolic or inherited stroke-like disorders.",
            "Patients with reduced consciousness, fever, coma, seizures, marked cerebral edema or persistent deficits should be managed urgently in hospital.",
          ],
        },
        {
          type: "subheading",
          text: "Management summary",
        },
        {
          type: "bullets",
          items: [
            "There are still no high-quality randomized controlled treatment trials specific to hemiplegic migraine.",
            "Common specialist preventive choices include verapamil, flunarizine where available, acetazolamide in familial disease, topiramate or amitriptyline when headache burden predominates, and lamotrigine for persistent aura-dominant disease.",
            "Severe attacks may require admission, supportive care, seizure management if needed, and selected use of corticosteroids in refractory encephalopathic attacks based on case-level evidence only.",
            "Most experts still avoid triptans and ergot derivatives in hemiplegic migraine because of theoretical ischemic risk and the difficulty distinguishing acute hemiplegic attacks from stroke.",
          ],
        },
        {
          type: "callout",
          variant: "warning",
          text: "Guideline gap. Neither NICE nor the American Headache Society currently provides a robust dedicated hemiplegic-migraine treatment algorithm backed by high-quality trials. Clinical practice is therefore specialist, individualized and largely consensus-driven.",
        },
        {
          type: "subheading",
          text: "Practical take-home points",
        },
        {
          type: "bullets",
          items: [
            "First presentations should generally be treated as potential cerebrovascular events until imaging and clinical evolution support hemiplegic migraine.",
            "Do not rely on response to migraine medication to make the diagnosis.",
            "If a patient already has a well-established hemiplegic migraine diagnosis, acute plans should still include explicit thresholds for emergency reassessment, such as prolonged weakness, altered consciousness, or a substantially different symptom pattern.",
          ],
        },
      ],
    },
    {
      id: "vestibular-migraine",
      title: "Vestibular Migraine",
      content: [
        {
          type: "subheading",
          text: "Clinical definition",
        },
        {
          type: "paragraph",
          text: "Vestibular migraine is defined by recurrent vestibular symptoms of moderate or severe intensity, lasting 5 minutes to 72 hours, in a patient with current or previous migraine, with migrainous features during at least half of episodes and no better alternative explanation.",
        },
        {
          type: "subheading",
          text: "Diagnostic points",
        },
        {
          type: "bullets",
          items: [
            "Use the 2022 Barany Society / International Headache Society criteria for definite or probable vestibular migraine.",
            "Vestibular symptoms can include spontaneous vertigo, positional vertigo, visually induced vertigo, head-motion-induced vertigo, or head-motion-induced dizziness with nausea.",
            "The major mimics are Meniere disease, BPPV, posterior circulation TIA or stroke, superior semicircular canal dehiscence, PPPD and episodic ataxia.",
            "Audiometry is especially useful when auditory symptoms are prominent or persistent; neuroimaging is needed when symptoms are new, atypical, prolonged or accompanied by objective neurologic signs.",
          ],
        },
        {
          type: "subheading",
          text: "Management summary",
        },
        {
          type: "bullets",
          items: [
            "Evidence for acute treatment remains limited. For prolonged or severe attacks, symptomatic vestibular suppressants and antiemetics are commonly used; triptans are a reasonable alternative when headache is prominent but trial evidence is modest.",
            "Preventive therapy generally mirrors standard migraine prevention: beta-blockers, topiramate, valproate, lamotrigine, venlafaxine or amitriptyline are commonly used depending on comorbidity profile and tolerability.",
            "Lifestyle measures matter: sleep regularity, trigger review, motion-sickness management, and treatment of comorbid anxiety, BPPV, PPPD or Meniere-like symptoms.",
            "Emerging evidence suggests CGRP-targeting therapies may help some refractory patients with vestibular migraine, but evidence is still early and not yet strong enough to call them subtype-specific first-line therapy.",
          ],
        },
        {
          type: "callout",
          variant: "info",
          text: "Evidence quality. Current vestibular migraine treatment recommendations remain largely adapted from general migraine literature plus expert neuro-otology practice. A dedicated high-quality evidence base is still limited.",
        },
      ],
    },
    {
      id: "migraine-associated-stroke",
      title: "Migraine-Associated Stroke and Stroke-Risk Counselling",
      content: [
        {
          type: "subheading",
          text: "Key concept",
        },
        {
          type: "paragraph",
          text: "Migrainous infarction is uncommon. It should be suspected when a patient with migraine with aura develops aura symptoms typical of prior attacks but one or more symptoms persist for more than 60 minutes and imaging shows a relevant ischemic infarct.",
        },
        {
          type: "subheading",
          text: "Risk factors that matter most",
        },
        {
          type: "bullets",
          items: [
            "Migraine with aura carries a higher ischemic stroke association than migraine without aura.",
            "Risk is amplified by female sex, smoking, estrogen-containing contraception and traditional vascular risk factors such as hypertension and diabetes.",
            "Although the relative risk rises in selected groups, the absolute stroke risk for most younger patients remains low; counselling should therefore be individualized rather than alarmist.",
          ],
        },
        {
          type: "subheading",
          text: "Guidance summary",
        },
        {
          type: "bullets",
          items: [
            "The 2024 AHA/ASA primary prevention guideline recommends evaluation and modification of vascular risk factors in adults aged 18 to 64 years with migraine, with or without aura.",
            "For adults with migraine with aura who desire contraception, the same AHA/ASA guideline recommends progestin-only or non-hormonal forms to avoid the increased ischemic stroke risk associated with combined hormonal contraception.",
            "NICE does not routinely offer combined hormonal contraceptives for contraception to women and girls with migraine with aura.",
            "Primary prevention with aspirin is not recommended purely because a patient has migraine; standard antiplatelet or anticoagulant therapy should instead follow ordinary primary- or secondary-stroke indications.",
          ],
        },
        {
          type: "subheading",
          text: "Clinical practice points",
        },
        {
          type: "bullets",
          items: [
            "Treat prolonged aura with objective deficit as stroke until proven otherwise; do not assume it is \u201cjust migraine\u201d.",
            "Stroke education should be part of counselling for patients with aura, especially smokers and users of estrogen-containing contraception.",
            "When choosing migraine preventives for patients with prior stroke or substantial vascular risk, avoid vasoconstrictive acute treatments such as triptans and ergots unless specialist advice supports otherwise.",
            "Shared decision-making is essential when considering estrogen-containing contraception or menopausal hormone therapy in patients with migraine, especially when aura or other vascular risk factors are present.",
          ],
        },
      ],
    },
    {
      id: "where-guidance-differs",
      title: "Where the Guidance Differs",
      content: [
        {
          type: "table",
          headers: [
            "Question",
            "NICE / UK approach",
            "American approach",
            "European / international approach",
          ],
          rows: [
            [
              "How strongly are hormonal migraine pathways specified?",
              "NICE explicitly defines menstrual-related migraine and gives mini-prophylaxis options for predictable attacks.",
              "American resources emphasize hormonal history, contraception counselling and individualized stroke-risk discussion, but there is not one single AHS formal guideline dedicated only to menstrual migraine.",
              "European and international literature broadly supports diary-based diagnosis, mini-prophylaxis and individualized hormonal suppression when safe.",
            ],
            [
              "What about vestibular migraine?",
              "No dedicated NICE pathway.",
              "AHS educational resources recognize vestibular migraine and support clinical recognition, but formal evidence-based treatment guidance remains limited.",
              "Barany Society / IHS provides the accepted diagnostic criteria; treatment remains mostly extrapolated from standard migraine prevention.",
            ],
            [
              "What about hemiplegic migraine?",
              "No dedicated NICE treatment pathway; atypical aura with motor weakness should prompt further assessment or referral.",
              "No robust dedicated AHS treatment guideline located; care is still specialist and consensus-based.",
              "European literature similarly emphasizes diagnostic exclusion of stroke and low-certainty preventive choices such as verapamil, acetazolamide and lamotrigine.",
            ],
            [
              "How accessible are CGRP therapies?",
              "NHS/NICE uses a step-access model after failure, intolerance or unsuitability of at least three preventives in general migraine care.",
              "AHS 2024 considers CGRP-targeting therapies a first-line preventive option in general migraine care.",
              "Recent international guidance is closer to the broader-access American position than to NICE, but rare subtype-specific data remain limited.",
            ],
          ],
        },
      ],
    },
    {
      id: "when-to-refer-urgently",
      title: "When to Refer Urgently or Seek Specialist Input",
      content: [
        {
          type: "bullets",
          items: [
            "First-ever motor aura, brainstem symptoms, persistent focal deficit, coma, seizures, fever or meningism.",
            "New vestibular syndrome with neurologic signs, sudden hearing loss, prolonged symptoms, or vascular risk factors suggesting posterior circulation stroke.",
            "Worsening migraine with combined hormonal contraception, especially new aura or change in aura pattern.",
            "Suspected migrainous infarction or inability to distinguish migraine from TIA or stroke in the acute setting.",
            "Refractory vestibular migraine or hemiplegic migraine requiring off-label, combination or specialist preventive strategies.",
          ],
        },
      ],
    },
    {
      id: "selected-references",
      title: "Selected References",
      content: [
        {
          type: "bullets",
          items: [
            "NICE. Headaches in over 12s: diagnosis and management (CG150). Published 2012; last updated 3 June 2025.",
            "NICE. Recommendations in CG150: prophylaxis, CGRP stopping rules, botulinum toxin stopping rules, combined hormonal contraception and menstrual-related migraine recommendations.",
            "Charles AC, Digre KB, Goadsby PJ, et al. Calcitonin gene-related peptide-targeting therapies are a first-line option for the prevention of migraine: American Headache Society position statement update. Headache. 2024.",
            "Puledda F, Sacco S, Ashina M, et al. International Headache Society Global Practice Recommendations for Preventive Pharmacological Treatment of Migraine. Cephalalgia. 2024.",
            "Puledda F, Sacco S, Diener HC, et al. International Headache Society global practice recommendations for the acute pharmacological treatment of migraine. Cephalalgia. 2024.",
            "Lempert T, von Brevern M, Beh S, et al. Vestibular migraine: Diagnostic criteria (update). Consensus document of the Barany Society and the International Headache Society. J Vestib Res. 2022.",
            "Villar-Martinez MD, et al. Vestibular migraine: an update. Curr Opin Neurol. 2024.",
            "Di Stefano V, Rispoli MG, Pellegrino N, et al. Diagnostic and therapeutic aspects of hemiplegic migraine. J Neurol Neurosurg Psychiatry. 2020.",
            "Bushnell C, et al. 2024 Guideline for the Primary Prevention of Stroke: A Guideline From the American Heart Association/American Stroke Association. Stroke. 2024.",
            "Ashina M, Katsarava Z, Do TP, et al. Diagnosis and management of migraine in ten steps. Nat Rev Neurol. 2021.",
          ],
        },
      ],
    },
  ],
};
