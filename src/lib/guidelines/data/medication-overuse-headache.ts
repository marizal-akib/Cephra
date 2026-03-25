import type { Guideline } from "../types";

export const medicationOveruseHeadache: Guideline = {
  slug: "medication-overuse-headache",
  title: "Medication Overuse Headache (MOH)",
  subtitle:
    "Adult clinical guidance integrating NICE, European and American guidance",
  category: "secondary-headaches-red-flags",
  tags: [
    "MOH",
    "medication overuse",
    "withdrawal",
    "chronic",
    "preventive",
    "NICE",
    "analgesic",
    "triptan",
    "opioid",
  ],
  sourceDocument: "Medication overuse headache.docx",
  sections: [
    {
      id: "key-messages",
      title: "Key Messages",
      content: [
        {
          type: "callout",
          variant: "warning",
          title: "Key messages",
          text: "MOH is a secondary headache disorder defined by headache on ≥15 days/month in a person with a pre-existing headache disorder plus regular overuse of acute headache medication for >3 months. The core treatment principle is to reduce or stop the overused acute medication, support the patient through short-term worsening/withdrawal, and optimize preventive treatment for the underlying primary headache disorder.",
        },
        {
          type: "bullets",
          items: [
            "MOH is a secondary headache disorder defined by headache on ≥15 days/month in a person with a pre-existing headache disorder plus regular overuse of acute headache medication for >3 months.",
            "The core treatment principle across all major guidance is to reduce or stop the overused acute medication, support the patient through short-term worsening/withdrawal, and optimize preventive treatment for the underlying primary headache disorder.",
            "NICE is the most prescriptive: stop all overused acute headache medicines abruptly for at least 1 month, consider preventive therapy, avoid routine inpatient withdrawal, and review at 4–8 weeks.",
            "European guidance is more flexible: education and preventive therapy are central, abrupt withdrawal/restriction is reasonable for simple analgesics, triptans and ergots, but slow tapering is recommended for opioids, barbiturates and tranquilizers.",
            "Among publicly available U.S. guidance, the 2023 VA/DoD headache guideline does not endorse one specific MOH withdrawal or preventive strategy, but it highlights high-risk patients and lower practical thresholds for butalbital and opioid overuse.",
          ],
        },
      ],
    },
    {
      id: "scope-and-purpose",
      title: "Scope and Purpose",
      content: [
        {
          type: "paragraph",
          text: "This document provides a concise, practice-oriented adult summary of medication overuse headache (MOH), integrating current publicly available guidance from NICE, the European Academy of Neurology (EAN), the International Classification of Headache Disorders (ICHD-3), and U.S. sources including the 2023 VA/DoD headache clinical practice guideline and recent randomized trial evidence. It is intended as a clinical summary, not as a substitute for full guideline review or specialist judgment.",
        },
        {
          type: "paragraph",
          text: "Practical note: the evidence base for MOH treatment is much weaker than for many other headache conditions, so some recommendations differ in how prescriptive they are. This document highlights both the common ground and the important disagreements.",
        },
      ],
    },
    {
      id: "definition-and-criteria",
      title: "Definition and Diagnostic Criteria",
      content: [
        {
          type: "paragraph",
          text: "ICHD-3 definition. MOH is headache on 15 or more days per month in a patient with a pre-existing headache disorder, with regular overuse for more than 3 months of one or more acute/symptomatic headache medicines, and no better alternative diagnosis.",
        },
        {
          type: "paragraph",
          text: "In practice, MOH often coexists with the underlying primary headache diagnosis, especially chronic migraine; both diagnoses should be recorded when both sets of criteria are met.",
        },
      ],
      subsections: [
        {
          id: "overuse-thresholds",
          title: "Practical Medication Overuse Thresholds",
          content: [
            {
              type: "table",
              headers: ["Medication class", "Threshold suggesting overuse", "Notes"],
              rows: [
                [
                  "Triptans",
                  "≥10 days/month for >3 months",
                  "ICHD-3 / NICE threshold.",
                ],
                [
                  "Ergotamines",
                  "≥10 days/month for >3 months",
                  "ICHD-3 / NICE threshold.",
                ],
                [
                  "Opioids",
                  "≥10 days/month (ICHD-3 / NICE); practical risk may emerge around ≥8 days/month",
                  "VA/DoD highlights a lower practical risk threshold.",
                ],
                [
                  "Combination analgesics",
                  "≥10 days/month for >3 months",
                  "Includes many caffeine-, opioid- or butalbital-containing combinations.",
                ],
                [
                  "Simple analgesics / non-opioid analgesics (paracetamol, aspirin, NSAIDs)",
                  "≥15 days/month for >3 months",
                  "ICHD-3 / NICE threshold.",
                ],
                [
                  "Butalbital-containing products",
                  "No separate ICHD-3 category; practical risk may emerge around ≥5 days/month",
                  "VA/DoD flags especially high risk.",
                ],
              ],
            },
            {
              type: "paragraph",
              text: "Clinical takeaway: the official diagnostic thresholds remain 10 or 15 days/month depending on drug class, but butalbital- and opioid-containing products appear capable of driving MOH at lower frequencies.",
            },
          ],
        },
      ],
    },
    {
      id: "pathophysiology-and-risk",
      title: "Pathophysiology and Risk Factors",
      content: [
        {
          type: "paragraph",
          text: "MOH does not usually arise de novo; it develops in susceptible people who already have a primary headache disorder, most commonly migraine, and less often tension-type headache or mixed headache phenotypes.",
        },
        {
          type: "paragraph",
          text: "The pathophysiology is incompletely understood but likely involves central sensitization, altered pain modulation, dependence-like behaviour, psychiatric comorbidity, and drug-specific neurobiologic changes. Repeated exposure to triptans, opioids and some combination analgesics may amplify pronociceptive signalling and reduce endogenous antinociceptive control.",
        },
        {
          type: "paragraph",
          text: "Across guideline and review sources, recurrent risk factors include female sex, higher headache frequency, migraine diagnosis, anxiety/depression, smoking, pain comorbidity, frequent use of anxiolytics or sedative-hypnotics, and socioeconomic vulnerability.",
        },
      ],
    },
    {
      id: "clinical-features",
      title: "Clinical Features and Assessment",
      content: [
        {
          type: "paragraph",
          text: "Typical history: a pre-existing episodic headache disorder becomes progressively more frequent; acute medication gives only transient relief; the patient then escalates use further and can end up taking medication daily to prevent or treat withdrawal-type worsening.",
        },
        {
          type: "paragraph",
          text: "Phenotype is variable. Some patients have near-daily dull or pressure-like headaches; others have a daily migraine-like phenotype with nausea, photophobia, phonophobia and disability. Triptan-overuse often preserves migrainous features more than simple analgesic overuse.",
        },
        {
          type: "paragraph",
          text: "Associated symptoms can include nausea, asthenia, irritability, poor concentration, memory complaints, disturbed sleep and anxiety.",
        },
      ],
      subsections: [
        {
          id: "assessment-checklist",
          title: "Core Assessment Checklist",
          content: [
            {
              type: "bullets",
              items: [
                "Confirm the underlying primary headache diagnosis (most often migraine or chronic migraine).",
                "Record exact acute medications used, including over-the-counter products, caffeine combinations, codeine-containing products, butalbital combinations, and medicines taken for non-headache indications.",
                "Quantify days/month of each acute medicine, not just doses.",
                "Screen for psychiatric comorbidity, substance-use vulnerability, sleep disturbance and other chronic pain conditions.",
                "Assess red flags and secondary headache features; neuroimaging is not required for reassurance alone when the diagnosis is otherwise secure.",
              ],
            },
          ],
        },
      ],
    },
    {
      id: "guidance-comparison",
      title: "What the Major Guidance Sources Say",
      content: [
        {
          type: "table",
          headers: [
            "Source",
            "Diagnosis / thresholds",
            "Management stance",
            "Key practical message",
          ],
          rows: [
            [
              "NICE CG150 (UK, updated 2025)",
              "Suspect MOH if headache develops or worsens with triptans/opioids/ergots/combination analgesics on ≥10 days/month or paracetamol/aspirin/NSAIDs on ≥15 days/month for ≥3 months.",
              "Explain diagnosis; advise abrupt stopping of all overused acute medicines for at least 1 month; warn that symptoms may worsen first; consider prophylaxis; do not routinely offer inpatient withdrawal.",
              "Most directive and simple to implement in general practice.",
            ],
            [
              "EAN guideline (Europe, 2020)",
              "Uses ICHD-3 framework and classifies according to specific medication(s) and primary headache type.",
              "Education is fundamental; preventive treatment should be used; if insufficient, withdraw overused drugs. Abrupt stop for simple analgesics, ergots and triptans; slow taper for opioids, barbiturates and tranquilizers. Outpatient, daycare or inpatient care can all be appropriate.",
              "More nuanced than NICE and more tailored to drug class and severity.",
            ],
            [
              "VA/DoD headache CPG (U.S., 2023)",
              "Uses ICHD-3 criteria but highlights practical lower-risk thresholds for butalbital (~5 days/month) and opioids (~8 days/month).",
              "Suggests screening for high-risk factors; concludes there is insufficient evidence to recommend one specific preventive agent or withdrawal strategy for MOH overall.",
              "Useful U.S. evidence-based summary, but less prescriptive about detox strategy.",
            ],
            [
              "Recent trial evidence (JAMA Neurol 2020; Neurology 2022 MOTS)",
              "Not diagnostic guidance.",
              "A randomized trial supported withdrawal plus preventive treatment from the start. The MOTS pragmatic trial found that adding migraine preventive therapy while either limiting/switching or initially continuing the overused medication produced similar short-term headache outcomes.",
              "Supports individualized care rather than one rigid pathway for every patient.",
            ],
          ],
        },
      ],
    },
    {
      id: "practice-guidance",
      title: "Cohesive Adult Practice Guidance",
      content: [
        {
          type: "paragraph",
          text: "The following approach is a synthesis of the major guidance sources and the current evidence base.",
        },
        { type: "subheading", text: "Step 1 – Make the diagnosis clearly and early" },
        {
          type: "paragraph",
          text: "Use ICHD-3 criteria and quantify medication days per month. In any patient with headache on ≥15 days/month, explicitly ask about all acute medicines, including OTC agents, combination products, and drugs taken for non-headache pain.",
        },
        {
          type: "subheading",
          text: "Step 2 – Explain the mechanism and set expectations",
        },
        {
          type: "paragraph",
          text: "Tell the patient that frequent acute treatment can itself perpetuate headache and make all treatments seem less effective. Explain that the first 2–10 days after reducing/stopping the overused drug may be worse before improvement occurs.",
        },
        { type: "subheading", text: "Step 3 – Reduce or stop the overused medicine" },
        {
          type: "paragraph",
          text: "For triptans, ergots, simple analgesics and most NSAIDs, abrupt discontinuation is reasonable in most adults. For opioids, barbiturates/butalbital and benzodiazepines, tapering is safer because of dependence and withdrawal risk.",
        },
        {
          type: "subheading",
          text: "Step 4 – Treat the underlying headache disorder",
        },
        {
          type: "paragraph",
          text: "Most patients need preventive treatment, especially those with chronic migraine or high monthly headache burden. Choice of preventive should be driven by the underlying primary headache and comorbidity profile.",
        },
        {
          type: "subheading",
          text: "Step 5 – Use short-term rescue or bridge therapy selectively",
        },
        {
          type: "paragraph",
          text: "For severe withdrawal symptoms or status migrainosus-type worsening, consider short-term bridge treatment. Common strategies include a long-acting NSAID or short glucocorticoid course in the outpatient setting, or monitored inpatient therapy such as intravenous dihydroergotamine-based regimens in selected refractory patients.",
        },
        {
          type: "subheading",
          text: "Step 6 – Follow up closely to prevent relapse",
        },
        {
          type: "paragraph",
          text: "Review within 4–8 weeks after withdrawal begins, then continue structured follow-up. Relapse is common, especially in the first year. Reinforce medication limits, optimize prevention, and address anxiety, depression, sleep problems and other pain disorders.",
        },
      ],
      subsections: [
        {
          id: "withdrawal-by-class",
          title: "Withdrawal Approach by Medication Class",
          content: [
            {
              type: "table",
              headers: [
                "Drug class",
                "Preferred initial strategy",
                "Typical setting",
                "Notes",
              ],
              rows: [
                [
                  "Simple analgesics / NSAIDs",
                  "Usually abrupt stop",
                  "Outpatient",
                  "Warn about short-term worsening; consider bridge therapy if needed.",
                ],
                [
                  "Triptans",
                  "Usually abrupt stop",
                  "Outpatient",
                  "Withdrawal tends to be shorter than with analgesics/opioids.",
                ],
                [
                  "Ergots",
                  "Usually abrupt stop",
                  "Outpatient or specialist setting",
                  "Monitor for severe rebound or diagnostic uncertainty.",
                ],
                [
                  "Combination analgesics (without opioid/barbiturate dependence)",
                  "Usually stop; sometimes structured restriction",
                  "Outpatient",
                  "Check caffeine exposure and hidden ingredients.",
                ],
                [
                  "Opioids",
                  "Slow taper",
                  "Outpatient if stable; inpatient if high dose/complex",
                  "Escalates MOH risk and can cause significant withdrawal.",
                ],
                [
                  "Butalbital / barbiturate-containing products",
                  "Slow taper; consider phenobarbital-supported taper where appropriate",
                  "Often specialist-supervised; inpatient if high-risk",
                  "High relapse and withdrawal-seizure concern.",
                ],
                [
                  "Benzodiazepines co-overused",
                  "Slow taper",
                  "Often specialist-supervised",
                  "Taper according to dependence risk and pharmacokinetics.",
                ],
              ],
            },
          ],
        },
        {
          id: "preventive-therapy",
          title: "Preventive Therapy",
          content: [
            {
              type: "paragraph",
              text: "Do not wait for months if the patient clearly has chronic migraine or a high attack burden. For most adults, preventive therapy should be started when withdrawal begins or even just before it, provided the patient understands the plan.",
            },
            {
              type: "paragraph",
              text: "If the underlying headache is chronic migraine, commonly used evidence-based preventive options include topiramate, onabotulinumtoxinA and CGRP-pathway therapies, although the exact access pathway varies by country and service.",
            },
            {
              type: "paragraph",
              text: "European guidance specifically supports topiramate, onabotulinumtoxinA, and CGRP/CGRP-receptor monoclonal antibodies as effective in chronic migraine with medication overuse, while NICE simply advises considering prophylactic treatment for the underlying primary headache disorder.",
            },
            {
              type: "paragraph",
              text: "The 2023 VA/DoD guideline strongly recommends erenumab, fremanezumab or galcanezumab for episodic or chronic migraine prevention, weakly recommends eptinezumab, topiramate and propranolol, and weakly recommends onabotulinumtoxinA for chronic migraine; however, it does not endorse a single MOH-specific preventive strategy.",
            },
          ],
        },
        {
          id: "bridge-therapy",
          title: "Bridge / Rescue Therapy During Withdrawal",
          content: [
            {
              type: "table",
              headers: ["Situation", "Reasonable options", "Comments"],
              rows: [
                [
                  "Milder / intermittent breakthrough attacks",
                  "Alternative acute medicine from a different class, used on ≤2 days/week",
                  "Avoid simply substituting one high-risk overused pattern for another.",
                ],
                [
                  "Outpatient severe withdrawal or predictable rebound",
                  "Long-acting NSAID (for example naproxen) or a short glucocorticoid course",
                  "Evidence is mixed; choose according to comorbidity and risk.",
                ],
                [
                  "Inpatient severe or refractory symptoms",
                  "IV dihydroergotamine plus metoclopramide in monitored settings",
                  "Avoid if vascular disease, pregnancy, uncontrolled hypertension, hemiplegic migraine, or brainstem aura.",
                ],
                [
                  "Alternative inpatient strategies when DHE unsuitable",
                  "Prochlorperazine, valproate sodium, methylprednisolone, selected antiemetic-based protocols",
                  "Use local expertise and monitoring.",
                ],
              ],
            },
          ],
        },
      ],
    },
    {
      id: "relapse-prevention",
      title: "Relapse Prevention",
      content: [
        {
          type: "paragraph",
          text: "Relapse is common, particularly in the first year. Most studies report that the majority of relapses occur early, so regular review in the first 6–12 months matters.",
        },
        {
          type: "paragraph",
          text: "Maintain effective preventive therapy, give clear written limits for acute treatment, and stop ineffective acute medicines rather than letting the patient keep rotating through suboptimal drugs.",
        },
        {
          type: "paragraph",
          text: "Practical limits commonly used in specialist practice are: triptans / ergots / combination analgesics on no more than 9 days per month on average, NSAIDs / simple analgesics on no more than 14 days per month, and butalbital-containing products sparingly if at all.",
        },
        {
          type: "paragraph",
          text: "CGRP-pathway acute treatments and noninvasive neuromodulation appear less likely to cause MOH than older acute medicines, but long-term real-world data remain more limited than for traditional classes.",
        },
      ],
    },
    {
      id: "when-to-refer",
      title: "When to Refer or Consider Inpatient Management",
      content: [
        {
          type: "bullets",
          items: [
            "Strong opioid, barbiturate or benzodiazepine overuse.",
            "Relevant psychiatric or medical comorbidity, including substance-use vulnerability, suicidality, unstable mood disorder, or major sleep disorder.",
            "Previous failed outpatient withdrawal attempts.",
            "Diagnostic uncertainty, red flags, or concern for another secondary headache disorder.",
            "Severe withdrawal symptoms, dehydration, persistent vomiting, or status migrainosus.",
          ],
        },
      ],
    },
    {
      id: "ongoing-uncertainty",
      title: "Areas of Ongoing Uncertainty",
      content: [
        {
          type: "paragraph",
          text: "Whether every patient must stop the overused medicine immediately is debated. NICE says yes for all overused acute headache medicines; European guidance is more drug-class specific; the MOTS trial suggests some patients with chronic migraine and medication overuse can still improve if preventive treatment is optimized even before acute medication is tightly restricted.",
        },
        {
          type: "paragraph",
          text: "The best bridge therapy is not established. Steroids, long-acting NSAIDs and DHE-based inpatient protocols are all used, but comparative evidence is limited.",
        },
        {
          type: "paragraph",
          text: "The exact MOH risk of newer acute medicines, especially gepants, appears lower than for triptans or combination analgesics, but long-term surveillance is still evolving.",
        },
      ],
    },
    {
      id: "clinic-template",
      title: "Suggested Clinic Template",
      content: [
        {
          type: "bullets",
          items: [
            "Confirm headache type(s) and count monthly headache days.",
            "Count monthly acute-medication days by class, including OTC products.",
            "Identify whether diagnostic thresholds for MOH are met.",
            "Explain MOH clearly and agree a withdrawal/reduction plan.",
            "Decide whether abrupt stop or taper is safer.",
            "Provide rescue/bridge plan if needed.",
            "Start or optimize preventive therapy.",
            "Arrange review at 4–8 weeks and again within 3–6 months.",
          ],
        },
      ],
    },
    {
      id: "references",
      title: "References",
      content: [
        {
          type: "bullets",
          items: [
            "International Headache Society. ICHD-3 online: 8.2 Medication-overuse headache (MOH).",
            "NICE. Headaches in over 12s (CG150), recommendations 1.2.7 and 1.3.42–1.3.48; updated June 2025.",
            "Diener HC, et al. EAN guideline on the management of medication-overuse headache. Eur J Neurol. 2020.",
            "VA/DoD Clinical Practice Guideline for the Management of Headache. September 2023.",
            "Carlsen LN, et al. Comparison of 3 treatment strategies for medication overuse headache: a randomized clinical trial. JAMA Neurol. 2020;77:1069–1078.",
            "Schwedt TJ, et al. Patient-centered treatment of chronic migraine with medication overuse: a prospective, randomized, pragmatic clinical trial. Neurology. 2022;98:e1409–e1421.",
            "International Headache Society global practice recommendations for the acute pharmacological treatment of migraine. Cephalalgia. 2024.",
          ],
        },
      ],
    },
  ],
};
