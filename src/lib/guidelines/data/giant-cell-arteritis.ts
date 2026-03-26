import type { Guideline } from "../types";

export const giantCellArteritis: Guideline = {
  slug: "giant-cell-arteritis",
  title: "Giant Cell Arteritis (GCA)",
  subtitle:
    "Cohesive clinical guidance integrating UK/NICE-aligned, American (ACR/VF), and European (EULAR) recommendations",
  category: "secondary-headaches-red-flags",
  tags: [
    "GCA",
    "giant cell arteritis",
    "temporal arteritis",
    "vasculitis",
    "tocilizumab",
    "prednisolone",
    "glucocorticoid",
    "biopsy",
    "ultrasound",
    "PMR",
    "polymyalgia",
    "visual loss",
    "aortic",
  ],
  sourceDocument: "Giant cell arteritis.docx",
  sections: [
    {
      id: "what-this-document-does",
      title: "What This Document Does",
      content: [
        {
          type: "callout",
          variant: "info",
          text: "Converts detailed background material on GCA into a concise practice guide for diagnosis, initial treatment, monitoring, relapse, and large-vessel surveillance. Synthesises three main guidance streams: UK practice (NICE CKS aligned to BSR), American College of Rheumatology/Vasculitis Foundation (ACR/VF), and European guidance (EULAR). Highlights both areas of agreement and the few important differences that affect day-to-day decision making.",
        },
      ],
    },
    {
      id: "scope-and-intended-use",
      title: "1. Scope and Intended Use",
      content: [
        {
          type: "paragraph",
          text: "This document is designed as a clinician-facing guidance summary for adults with suspected or confirmed giant cell arteritis. It prioritises emergency recognition of ischaemic risk, confirmation of diagnosis by biopsy or imaging, prompt glucocorticoid treatment, judicious use of steroid-sparing therapy, structured follow-up, and surveillance for large-vessel complications.",
        },
        {
          type: "paragraph",
          text: "It is not a replacement for specialist clinical judgment, local pathway requirements, or emergency ophthalmology/stroke management where vision loss or cerebrovascular symptoms are present.",
        },
      ],
    },
    {
      id: "source-hierarchy",
      title: "2. Source Hierarchy Used for This Guidance",
      content: [
        {
          type: "bullets",
          items: [
            "UK/NICE-aligned practice: NICE Clinical Knowledge Summary (CKS, revised January 2026) and the British Society for Rheumatology (BSR) guideline.",
            "American guidance: 2021 ACR/Vasculitis Foundation guideline for management of GCA.",
            "European guidance: 2023 EULAR imaging recommendations (published 2024), 2018 EULAR large-vessel vasculitis management update, and 2024 treat-to-target recommendations for GCA/PMR.",
            "Evidence context: User-supplied detailed background text on pathogenesis, manifestations, diagnosis, and treatment was used to enrich explanatory sections.",
          ],
        },
      ],
    },
    {
      id: "core-disease-concepts",
      title: "3. Core Disease Concepts",
      content: [
        {
          type: "bullets",
          items: [
            "Disease type: Immune-mediated granulomatous vasculitis of large and medium arteries in adults aged over 50 years.",
            "Main clinical phenotypes: cranial GCA, large-vessel GCA, and overlapping disease.",
            "Main harms to prevent: irreversible visual loss, stroke (especially vertebrobasilar), aortic aneurysm/dissection, and cumulative glucocorticoid toxicity.",
            "PMR relationship: polymyalgia rheumatica coexists in approximately 40\u201350% of patients with GCA; PMR should heighten diagnostic vigilance.",
          ],
        },
      ],
    },
    {
      id: "when-to-suspect-gca",
      title: "4. When to Suspect GCA",
      content: [
        {
          type: "callout",
          variant: "warning",
          text: "Red-flag clinical features in adults >50 years. Immediate concern should be high when any of the following are present:",
        },
        {
          type: "bullets",
          items: [
            "New headache or clear change in headache pattern",
            "Jaw claudication or tongue claudication",
            "Transient monocular visual loss, diplopia, blurred vision, or permanent visual loss",
            "Constitutional inflammation without an alternative explanation (fever, weight loss, fatigue, raised CRP/ESR)",
            "PMR symptoms with cranial symptoms or refractory inflammatory markers",
            "Arm claudication, pulse asymmetry, blood pressure asymmetry, vascular bruits, or unexplained aortic syndrome",
          ],
        },
      ],
    },
    {
      id: "immediate-action-pathway",
      title: "5. Immediate Action Pathway",
      content: [
        {
          type: "numbered",
          items: [
            "If GCA is strongly suspected, start glucocorticoids immediately; do not delay treatment while arranging biopsy or imaging.",
            "If visual symptoms, diplopia, or cerebrovascular symptoms are present, treat as an emergency and involve rheumatology plus ophthalmology and/or stroke services urgently.",
            "Arrange confirmatory testing promptly, ideally temporal artery ultrasound before or within days of treatment if local expertise is available, and/or temporal artery biopsy within 2\u20134 weeks of starting glucocorticoids.",
            "Assess for large-vessel disease early, especially when cranial assessment is negative or systemic/limb vascular features predominate.",
          ],
        },
      ],
    },
    {
      id: "diagnostic-work-up",
      title: "6. Diagnostic Work-up",
      content: [
        {
          type: "paragraph",
          text: "Baseline investigations should usually include:",
        },
        {
          type: "bullets",
          items: [
            "CBC, ESR, CRP, renal profile, liver enzymes, glucose, albumin",
            "Urinalysis",
            "Consider SPEP/bone profile where differential diagnosis or prolonged steroid planning makes this useful",
            "Formal vascular examination including bilateral arm blood pressures, pulses, and bruits",
            "Fundus/visual assessment if any ocular complaint is reported",
          ],
        },
      ],
    },
    {
      id: "confirming-diagnosis",
      title: "7. Confirming the Diagnosis: Biopsy and Imaging",
      content: [
        {
          type: "table",
          headers: ["Modality", "Best use", "Key practice point", "Main limitation"],
          rows: [
            [
              "Temporal artery ultrasound with Doppler",
              "Fast first-line test where expertise exists",
              "European guidance now places ultrasound first-line for all suspected GCA; axillary arteries should be included",
              "Operator and machine dependent; sensitivity falls quickly after steroids start",
            ],
            [
              "Temporal artery biopsy",
              "Histologic confirmation of cranial GCA",
              "Still highly valuable, especially where ultrasound expertise is limited or the result is equivocal",
              "False negatives occur; does not exclude large-vessel GCA",
            ],
            [
              "CTA / MRA / PET-CT",
              "Suspected large-vessel GCA; nondiagnostic cranial work-up",
              "Needed when large-vessel disease is suspected or cranial tests are negative but clinical suspicion remains high",
              "Availability, contrast/radiation issues, and post-treatment changes may affect interpretation",
            ],
            [
              "Axillary/subclavian/carotid ultrasound",
              "Large-vessel extension",
              "Useful adjunct, particularly in cranial GCA and in follow-up of structural disease",
              "Cannot assess the full thoracic aorta",
            ],
          ],
        },
        {
          type: "paragraph",
          text: "Practical synthesis: use temporal/axillary ultrasound first when there is experienced access; if not, temporal artery biopsy remains an appropriate default confirmatory test. Large-vessel imaging is required when the initial cranial work-up is negative or when the clinical picture suggests large-vessel disease.",
        },
      ],
    },
    {
      id: "suggested-diagnostic-strategy",
      title: "8. Suggested Diagnostic Strategy in Practice",
      content: [
        {
          type: "bullets",
          items: [
            "Suspected cranial GCA with local ultrasound expertise: same-day or urgent temporal plus axillary ultrasound, start glucocorticoids immediately, and reserve biopsy for equivocal or negative-but-high-suspicion cases.",
            "Suspected cranial GCA without reliable ultrasound access: start glucocorticoids, arrange unilateral temporal artery biopsy (aiming for at least 1 cm specimen length in vivo), and consider contralateral biopsy or large-vessel imaging if the biopsy is negative but suspicion remains high.",
            "Predominantly systemic or large-vessel presentation: arrange CTA, MRA, PET-CT, or specialist vascular ultrasound; a negative temporal artery biopsy does not exclude the diagnosis.",
            "Normal ESR/CRP lowers probability but does not fully exclude GCA if the phenotype is classic, particularly with jaw claudication or visual symptoms.",
          ],
        },
      ],
    },
    {
      id: "initial-treatment",
      title: "9. Initial Treatment",
      content: [
        {
          type: "table",
          headers: ["Clinical scenario", "Recommended immediate treatment", "Key notes"],
          rows: [
            [
              "No visual loss or TIA/stroke",
              "Prednisone/prednisolone 40\u201360 mg/day orally",
              "This is the common consensus starting range across UK/European guidance; ACR allows up to 1 mg/kg/day (max 80 mg/day)",
            ],
            [
              "Threatened or established visual loss, diplopia, or cerebrovascular event potentially due to GCA",
              "IV methylprednisolone 500\u20131000 mg/day for 3 days, then high-dose oral glucocorticoid",
              "Treat urgently; the aim is prevention of additional irreversible ischaemic injury",
            ],
            [
              "High-risk glucocorticoid toxicity with new disease",
              "Add steroid-sparing therapy early, most commonly tocilizumab, while still starting high-dose glucocorticoid",
              "Risk factors include diabetes, osteoporosis, glaucoma, severe cardiovascular/metabolic risk, and prior steroid toxicity",
            ],
          ],
        },
        {
          type: "paragraph",
          text: "Patients usually improve quickly symptomatically after glucocorticoids. Failure to improve should prompt reconsideration of the diagnosis, especially if biopsy and imaging are nondiagnostic.",
        },
      ],
    },
    {
      id: "steroid-sparing-therapy",
      title: "10. Steroid-sparing Therapy",
      content: [
        {
          type: "bullets",
          items: [
            "Tocilizumab: best-supported steroid-sparing agent; especially useful in relapse and in patients at high risk of glucocorticoid toxicity.",
            "Upadacitinib: an emerging option in some jurisdictions, but not yet embedded uniformly across core rheumatology guidelines; use depends on local approval, risk assessment, and specialist practice.",
            "Methotrexate: reasonable alternative when tocilizumab or JAK inhibition cannot be used, though the steroid-sparing effect is smaller.",
            "Clinical difference worth knowing: ACR/VF is generally more proactive about adjunctive tocilizumab in newly diagnosed disease, whereas UK/BSR/NICE-aligned and EULAR practice tends to reserve it particularly for relapse or for patients at higher risk from steroid toxicity.",
          ],
        },
      ],
    },
    {
      id: "glucocorticoid-tapering",
      title: "11. Glucocorticoid Tapering",
      content: [
        {
          type: "paragraph",
          text: "No single taper schedule fits all patients. The consistent principle across guidelines is to start high, taper once disease control is achieved, slow down as doses approach 20 mg and especially below 10 mg/day, and respond to relapse clinically rather than tapering mechanistically.",
        },
        {
          type: "bullets",
          items: [
            "For glucocorticoid monotherapy, taper is usually gradual over many months and often 12 months or longer.",
            "When combined with tocilizumab, an accelerated taper such as a 26-week schedule is commonly used in trial-based practice.",
            "Disease relapse is common during tapering, especially below 20 mg/day and in the first treatment year.",
          ],
        },
      ],
    },
    {
      id: "monitoring-and-follow-up",
      title: "12. Monitoring and Follow-up",
      content: [
        {
          type: "table",
          headers: ["Domain", "What to monitor", "Comments"],
          rows: [
            [
              "Disease activity",
              "Headache, jaw claudication, PMR symptoms, visual symptoms, constitutional symptoms, limb claudication",
              "Clinical review remains the anchor of monitoring",
            ],
            [
              "Inflammatory markers",
              "ESR and CRP",
              "Useful if not receiving IL-6 blockade; not reliable on tocilizumab",
            ],
            [
              "Vision",
              "Visual acuity, visual fields, fundus/OCT where indicated",
              "Ophthalmology follow-up is crucial when ocular symptoms or papillo-ophthalmic complications are present",
            ],
            [
              "Treatment toxicity",
              "Glucose, BP, infection risk, bone health, cataract/glaucoma risk, liver tests/lipids if on targeted therapy",
              "Steroid harm prevention should begin at diagnosis",
            ],
            [
              "Large-vessel complications",
              "Aortic and branch-vessel imaging where baseline or follow-up concern exists",
              "Frequency should be individualised",
            ],
          ],
        },
      ],
    },
    {
      id: "large-vessel-gca",
      title: "13. Large-vessel GCA and Postdiagnostic Surveillance",
      content: [
        {
          type: "paragraph",
          text: "Large-vessel involvement is common, often subclinical, and should not be overlooked. Patients with upper limb claudication, pulse asymmetry, bruits, systemic inflammation without prominent cranial features, or a negative biopsy despite strong clinical suspicion should be assessed with large-vessel imaging.",
        },
        {
          type: "bullets",
          items: [
            "Thoracic aortic disease is the most important late structural complication.",
            "Baseline vascular imaging beyond the temporal arteries is reasonable in newly diagnosed GCA when large-vessel disease is suspected and is increasingly adopted in specialist practice.",
            "For known aortitis, aneurysm, or progressive stenosis, repeat imaging intervals should be individualised; six-month reassessment is reasonable for newly identified or enlarging aneurysms, followed by annual imaging if stable.",
          ],
        },
      ],
    },
    {
      id: "relapse",
      title: "14. Relapse: How to Respond",
      content: [
        {
          type: "numbered",
          items: [
            "Confirm that symptoms represent relapse rather than infection, alternative diagnosis, or isolated steroid withdrawal symptoms.",
            "Increase glucocorticoids according to severity: major ischaemic relapse requires emergency treatment; non-ischaemic relapse usually needs a step-up to the last effective dose or slightly above it.",
            "Add or escalate steroid-sparing therapy if the patient is not already receiving one, or if relapse occurs despite tapering.",
            "For large-vessel relapse, consider repeat imaging because symptoms and inflammatory markers may underestimate activity.",
          ],
        },
      ],
    },
    {
      id: "preventing-treatment-related-harm",
      title: "15. Preventing Treatment-related Harm",
      content: [
        {
          type: "bullets",
          items: [
            "Bone protection from the outset: calcium/vitamin D optimisation, fracture-risk assessment, and osteoporosis prophylaxis as indicated.",
            "Vaccination review before or during immunosuppression in line with local guidance.",
            "Screening for latent tuberculosis and hepatitis as appropriate before biologic/JAK inhibitor therapy.",
            "Assess cardiovascular risk, infection risk, and gastrointestinal bleeding risk; use a PPI when aspirin or prolonged high-dose glucocorticoids make this appropriate.",
            "Consider but individualise Pneumocystis prophylaxis; absolute PCP risk in GCA is low, but risk rises with high cumulative immunosuppression.",
          ],
        },
      ],
    },
    {
      id: "areas-where-guidelines-diverge",
      title: "16. Areas Where Guidelines Diverge",
      content: [
        {
          type: "table",
          headers: [
            "Topic",
            "UK/NICE-aligned / BSR",
            "ACR/VF",
            "EULAR / European practice",
            "Practical synthesis",
          ],
          rows: [
            [
              "First-line cranial assessment",
              "Urgent pathway supports biopsy and increasing ultrasound use",
              "Conditional preference for biopsy over ultrasound in the US context",
              "Ultrasound first-line in all suspected GCA when expertise exists",
              "Use ultrasound first where it is excellent; otherwise biopsy remains entirely acceptable",
            ],
            [
              "Initial oral steroid dose",
              "40\u201360 mg/day typical",
              "1 mg/kg/day up to 80 mg/day",
              "40\u201360 mg/day",
              "Most clinicians can safely standardise to 40\u201360 mg/day unless severity dictates more",
            ],
            [
              "Tocilizumab in new disease",
              "Usually targeted to higher-risk or relapsing patients",
              "More strongly favoured as part of initial therapy",
              "Recommended particularly in relapsing or toxicity-prone disease",
              "Use selectively but early in the right patient",
            ],
            [
              "Monitoring on tocilizumab",
              "Clinical plus imaging if needed",
              "Clinical plus imaging if needed",
              "Clinical plus imaging if needed",
              "All major guidance agrees ESR/CRP become much less useful on IL-6 blockade",
            ],
          ],
        },
      ],
    },
    {
      id: "cohesive-practice-recommendations",
      title: "17. Cohesive Practice Recommendations",
      content: [
        {
          type: "callout",
          variant: "info",
          text: "Recommended default pathway",
        },
        {
          type: "numbered",
          items: [
            "Suspect early: any patient over 50 with new headache, jaw claudication, visual symptoms, unexplained inflammatory syndrome, or PMR plus cranial/vascular symptoms.",
            "Treat first if suspicion is high: start glucocorticoids immediately; do not wait for biopsy or imaging.",
            "Confirm objectively: use expert temporal/axillary ultrasound first where available; otherwise arrange temporal artery biopsy. Escalate to large-vessel imaging when needed.",
            "Protect vision and the aorta: urgent IV steroids for visual or cerebrovascular presentations; structured surveillance for large-vessel disease.",
            "Reduce steroid burden intelligently: use tocilizumab early for relapse or toxicity-prone patients; consider alternatives when contraindications or access issues apply.",
            "Monitor clinically, not just biochemically: especially if the patient is receiving tocilizumab.",
            "Plan long-term: expect relapse risk, bone protection needs, and possible aortic surveillance even after cranial symptoms settle.",
          ],
        },
      ],
    },
    {
      id: "reference-framework",
      title: "18. Reference Framework Used in This Document",
      content: [
        {
          type: "bullets",
          items: [
            "Mackie SL, Dejaco C, Appenzeller S, et al. British Society for Rheumatology guideline on diagnosis and treatment of giant cell arteritis. Rheumatology (Oxford). 2020;59:e1-e23.",
            "NICE Clinical Knowledge Summary. Giant cell arteritis. Last revised January 2026; diagnosis and management topics updated in line with the BSR guideline.",
            "Maz M, Chung SA, Abril A, et al. 2021 American College of Rheumatology/Vasculitis Foundation guideline for the management of giant cell arteritis and Takayasu arteritis. Arthritis Rheumatol. 2021;73:1349-1365.",
            "Hellmich B, Agueda A, Monti S, et al. 2018 update of the EULAR recommendations for the management of large vessel vasculitis. Ann Rheum Dis. 2020;79:19-30.",
            "Dejaco C, Ramiro S, Bond M, et al. EULAR recommendations for the use of imaging in large vessel vasculitis in clinical practice: 2023 update. Ann Rheum Dis. 2024;83:741-751.",
            "Dejaco C, Hysa E, Liew DFL, et al. Treat-to-target recommendations in giant cell arteritis and polymyalgia rheumatica. Ann Rheum Dis. 2024;83:48-57.",
            "NICE draft guidance consultation. Upadacitinib for treating giant cell arteritis. Issue date January 2026 (draft; not final guidance).",
          ],
        },
      ],
    },
  ],
};
