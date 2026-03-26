import type { Guideline } from "../types";

export const cervicogenicHeadache: Guideline = {
  slug: "cervicogenic-headache",
  title: "Cervicogenic Headache",
  subtitle:
    "Holistic guideline synthesising NICE, American, European and society-based recommendations",
  category: "secondary-headaches-red-flags",
  tags: [
    "cervicogenic",
    "CEH",
    "neck pain",
    "cervical spine",
    "physical therapy",
    "diagnostic block",
    "radiofrequency",
    "ICHD-3",
    "whiplash",
    "facet joint",
  ],
  sourceDocument: "Cervicogenic headache.docx",
  sections: [
    {
      id: "how-to-use",
      title: "How This Document Should Be Used",
      content: [
        {
          type: "callout",
          variant: "info",
          text: "Use this as a practical clinic-facing standard for assessment, imaging decisions, conservative treatment, interventional escalation and follow-up in suspected cervicogenic headache (CEH). It is not a substitute for urgent evaluation of red flags, vascular emergencies, infection, tumour, intracranial pressure disorders, occipital neuralgia or primary headache disorders that can mimic CEH. Because there is no single up-to-date dedicated NICE, AHS or EAN CEH guideline, this document integrates formal headache guidance, ICHD-3 diagnostic criteria, VA/DoD recommendations, interventional pain consensus and recent expert review literature.",
        },
      ],
    },
    {
      id: "executive-summary",
      title: "Executive Summary",
      content: [
        {
          type: "paragraph",
          text: "Cervicogenic headache is a secondary headache attributed to a cervical spine or neck soft-tissue disorder, usually with neck pain and reduced cervical range of motion, but diagnosis requires more than the presence of neck pain alone.",
        },
        {
          type: "paragraph",
          text: "The most useful foundation is the ICHD-3 framework: evidence of a plausible cervical lesion plus at least two indicators of causation, such as temporal relation, improvement with treatment of the neck disorder, provocation by cervical manoeuvres, or abolition with diagnostic blockade.",
        },
        {
          type: "paragraph",
          text: "NICE does not publish a dedicated cervicogenic headache guideline. NICE headache guidance remains important for structured assessment, diary use, medication overuse review and avoiding indiscriminate investigation of primary headache, while neck-pain pathways inform conservative management and referral thresholds.",
        },
        {
          type: "paragraph",
          text: "Among broader national guidance, the 2023 VA/DoD headache guideline explicitly includes cervicogenic headache and suggests physical therapy as a management option; topic-specific CEH recommendations are most detailed in the 2021 Chinese Association for the Study of Pain expert guideline and in cervical facet intervention consensus documents.",
        },
        {
          type: "paragraph",
          text: "Routine diagnosis should prioritise: (1) red flag exclusion, (2) careful differentiation from migraine, tension-type headache, occipital neuralgia and cervical vascular causes, (3) identification of a plausible cervical pain generator, and (4) selective imaging and/or diagnostic blocks in appropriately chosen patients.",
        },
        {
          type: "paragraph",
          text: "First-line management should be non-operative: explanation, activity modification, headache diary, targeted physical therapy and treatment of overlapping headache phenotypes. Escalation to image-guided blocks, radiofrequency procedures or surgery should be reserved for well-selected refractory cases with a confirmed pain generator.",
        },
      ],
    },
    {
      id: "basis-of-guidance",
      title: "Basis of This Guidance",
      content: [
        {
          type: "paragraph",
          text: "This document combines: ICHD-3 diagnostic criteria; NICE CG150 headache guidance (updated June 2025); the 2023 VA/DoD Clinical Practice Guideline for Management of Headache; the 2021 Chinese Association for the Study of Pain expert guideline on cervicogenic headache; the 2021 multispecialty international consensus on cervical facet joint interventions; and recent expert review literature addressing the overlap between cervicogenic headache and occipital neuralgia. Formal dedicated European or American society CEH guidelines remain limited, so some recommendations below are consensus-based rather than trial-driven.",
        },
      ],
    },
    {
      id: "core-diagnostic-concept",
      title: "Core Diagnostic Concept",
      content: [
        {
          type: "paragraph",
          text: "Diagnose probable cervicogenic headache only when the clinical picture suggests pain referred from the neck rather than simply headache with incidental neck pain. Neck pain is common in migraine and tension-type headache, so cervical symptoms alone are not diagnostic.",
        },
        {
          type: "table",
          headers: ["Feature", "Supports CEH", "Comments / caveats"],
          rows: [
            [
              "Pain pattern",
              "Side-locked or clearly unilateral pain beginning in neck/occiput and radiating anteriorly",
              "Not pathognomonic; migraine can also be unilateral.",
            ],
            [
              "Provocation",
              "Typical headache reproduced or worsened by neck movement, sustained posture, or cervical palpation",
              "Provocation strengthens suspicion but does not prove causation.",
            ],
            [
              "Cervical dysfunction",
              "Reduced neck range of motion, especially painful rotation/flexion-rotation restriction",
              "Supports cervical contribution; also seen in other disorders.",
            ],
            [
              "Temporal relation",
              "Headache started after cervical injury, whiplash, arthropathy flare, or evolving upper cervical disorder",
              "A coherent timeline matters.",
            ],
            [
              "Response to block",
              "Abolition or near-complete relief after targeted diagnostic block",
              "Most specific confirmatory step when available.",
            ],
            [
              "Imaging",
              "Plausible upper cervical lesion matching symptoms",
              "Imaging is supportive, not sufficient on its own.",
            ],
          ],
        },
      ],
    },
    {
      id: "red-flags",
      title: "Red Flags and Immediate Alternative Diagnoses",
      content: [
        {
          type: "paragraph",
          text: "Before labelling headache as cervicogenic, actively exclude dangerous secondary causes. NICE headache assessment guidance and cervical vascular safety frameworks support urgent escalation when the presentation is acute, progressive or neurologically abnormal.",
        },
        {
          type: "table",
          headers: ["Red flag", "Potential diagnosis", "Action"],
          rows: [
            [
              "Sudden severe or thunderclap onset",
              "Subarachnoid haemorrhage, RCVS, cervical artery dissection",
              "Emergency assessment; same-day neurovascular work-up.",
            ],
            [
              "New focal neurology, Horner syndrome, ataxia, dysarthria or persistent cranial nerve signs",
              "Vertebral/carotid artery dissection, stroke, posterior fossa lesion",
              "Urgent MRI/CTA or MRA and specialist review.",
            ],
            [
              "Fever, meningism, immunosuppression or systemic illness",
              "Infection, meningitis, inflammatory disease, malignancy",
              "Urgent medical evaluation.",
            ],
            [
              "Cancer history, unexplained weight loss, nocturnal pain or progressive worsening",
              "Tumour, metastasis, inflammatory or destructive cervical lesion",
              "Cross-sectional imaging and urgent referral.",
            ],
            [
              "Papilloedema, pulsatile tinnitus, positional headache",
              "Intracranial pressure disorder or CSF leak",
              "MRI \u00b1 MRV/LP according to syndrome.",
            ],
            [
              "Marked trauma or suspected instability",
              "Fracture, ligament injury, atlantoaxial instability",
              "Immobilise if needed and image promptly.",
            ],
          ],
        },
      ],
    },
    {
      id: "diagnostic-work-up",
      title: "Recommended Diagnostic Work-Up",
      content: [
        {
          type: "numbered",
          items: [
            "Headache history: Document onset, laterality, frequency, duration, aggravating neck movements, prior neck trauma/whiplash, migrainous symptoms, medication use, occupational posture, sleep and disability. NICE recommends structured headache recording when diagnosis or treatment response is uncertain.",
            "Focused examination: Assess cervical range of motion, upper cervical tenderness, reproduction of typical pain, neurologic examination, cranial nerves, limb power/sensation/reflexes and vascular clues. The flexion-rotation test can support upper cervical dysfunction but is not diagnostic by itself.",
            "Differentiate from common mimics: Specifically review migraine, tension-type headache, occipital neuralgia, medication overuse, post-traumatic headache, cervical radiculopathy and cervical artery dissection.",
            "Initial imaging strategy: Plain cervical radiographs can be considered when structural cervical disease or instability is suspected, but MRI is preferred when neurologic features, refractory symptoms, inflammatory disease, tumour, myelopathy, suspected disc pathology or atypical features are present. Imaging findings must match the clinical picture before they are used to support CEH.",
            "Diagnostic block pathway: For moderate-severe or persistent cases, or before invasive procedures, use image-guided diagnostic blocks of the suspected cervical structure or nerve supply. Diagnostic blockade is the most specific confirmatory step when available.",
          ],
        },
      ],
    },
    {
      id: "imaging-guidance",
      title: "Imaging Guidance",
      content: [
        {
          type: "paragraph",
          text: "No dedicated NICE imaging pathway exists for cervicogenic headache. The practical imaging approach below synthesises ICHD-3 cautionary notes, broader NICE headache principles, and expert guidance. Imaging should answer a clinical question; it should not be ordered simply because headache and neck pain coexist.",
        },
        {
          type: "table",
          headers: ["Scenario", "Preferred test", "Why", "Notes"],
          rows: [
            [
              "Typical mild CEH, no neurology, symptoms linked to posture/movement",
              "No immediate advanced neuroimaging",
              "Start with clinical assessment and conservative treatment",
              "Avoid reflex scanning if no red flags and no surgical question.",
            ],
            [
              "Suspected cervical arthropathy/instability",
              "Cervical radiographs \u00b1 flexion-extension views",
              "Screens for alignment and dynamic instability",
              "Helpful when upper cervical instability is a concern.",
            ],
            [
              "Persistent or severe CEH; atypical features; pre-intervention planning",
              "MRI cervical spine",
              "Best overview of disc, neural, ligamentous and soft tissue pathology",
              "Use contrast if infection, inflammatory disease or tumour is suspected.",
            ],
            [
              "Predominant bony/facet or atlantoaxial question",
              "CT cervical spine",
              "Better bony detail than MRI",
              "Useful adjunct before some procedures.",
            ],
            [
              "Acute unilateral neck-head pain with Horner syndrome or focal deficits",
              "CTA or MRA head/neck",
              "Excludes carotid or vertebral dissection",
              "Urgent same-day pathway.",
            ],
            [
              "Possible intracranial or pressure disorder",
              "Brain MRI \u00b1 MRV/LP",
              "Excludes secondary causes outside the neck",
              "CEH is a diagnosis of attribution, not default exclusion.",
            ],
          ],
        },
      ],
    },
    {
      id: "diagnostic-blocks",
      title: "Diagnostic Blocks and Interventional Confirmation",
      content: [
        {
          type: "paragraph",
          text: "If available, perform image-guided diagnostic anaesthetic blocks when the diagnosis remains uncertain after assessment or when interventional treatment is being considered. This is especially valuable for suspected C2\u20133 zygapophyseal/third occipital pain, atlantoaxial joint pain or other upper cervical generators.",
        },
        {
          type: "paragraph",
          text: "A positive block should produce near-complete or complete temporary relief of the patient\u2019s typical headache, ideally with concordance between the block target and the pain pattern. Dual comparative blocks may reduce false-positive responses in selected cases.",
        },
        {
          type: "paragraph",
          text: "Blocks should be undertaken by clinicians experienced in cervical image-guided procedures because serious complications, including vascular or neural injury, can occur, particularly around the C1\u20132 region.",
        },
      ],
    },
    {
      id: "management-pathway",
      title: "Management Pathway",
      content: [
        {
          type: "table",
          headers: ["Step", "Intervention", "Practical guidance"],
          rows: [
            [
              "1",
              "Education and self-management",
              "Explain that CEH is a secondary headache attributed to the neck, address ergonomics, posture, driving/work triggers, sleep support, headache diary, and avoid medication overuse. NICE headache guidance supports structured diary review and medication review.",
            ],
            [
              "2",
              "Targeted physical therapy",
              "Use individualised physiotherapy focusing on cervical mobility, deep neck flexor and scapular control, posture, graded exercise, and reduction of secondary muscle tension. The VA/DoD guideline suggests physical therapy for cervicogenic headache, and recent reviews support education plus exercise-based rehabilitation.",
            ],
            [
              "3",
              "Drug therapy (adjunctive, not curative)",
              "Consider pragmatic neuropathic/pain-modulating options when needed: pregabalin, duloxetine, gabapentin or amitriptyline may be tried according to comorbidity and tolerability. Evidence is limited and weaker than for physical therapy or targeted procedures.",
            ],
            [
              "4",
              "Image-guided local injection",
              "For selected patients with a confirmed or strongly suspected pain generator, consider diagnostic/therapeutic local anaesthetic \u00b1 corticosteroid injections, particularly around relevant zygapophyseal or atlantoaxial structures. Benefit is often temporary.",
            ],
            [
              "5",
              "Radiofrequency procedures",
              "For refractory, well-selected cases with a positive diagnostic block, radiofrequency treatment of the implicated cervical facet/nerve supply may provide more durable benefit than injection alone. Multispecialty cervical facet consensus supports careful patient selection and image guidance.",
            ],
            [
              "6",
              "Surgery",
              "Reserve for rare cases with a clearly demonstrated surgically remediable lesion and concordant block/imaging findings after failure of comprehensive conservative and interventional care.",
            ],
          ],
        },
      ],
    },
    {
      id: "important-practice-points",
      title: "Important Practice Points",
      content: [
        {
          type: "bullets",
          items: [
            "Do not diagnose cervicogenic headache solely from \u201cneck pain with headache\u201d.",
            "Do not let cervical imaging abnormalities override the history; degenerative findings are common and often incidental.",
            "Treat coexisting migraine, tension-type headache or medication overuse independently if present; more than one headache diagnosis may apply.",
            "Avoid high-velocity cervical manipulation when vascular pathology has not been excluded or when acute atypical pain is present. Cervical vascular safety frameworks should be followed before manual techniques.",
            "Document headache days/month, moderate-severe days, acute medication days, neck disability, range of motion, pain location and trigger pattern at each review.",
          ],
        },
      ],
    },
    {
      id: "follow-up-and-outcome-measures",
      title: "Follow-Up and Outcome Measures",
      content: [
        {
          type: "paragraph",
          text: "Review interval should match severity and treatment stage: typically 6 to 8 weeks after starting therapy, sooner after procedural treatment, and earlier if red flags emerge. Follow-up should record headache frequency, severity, duration, medication use, neck movement tolerance, work/driving limitation, and response to examination manoeuvres or blocks.",
        },
        {
          type: "table",
          headers: ["Measure", "Minimum documentation set"],
          rows: [
            [
              "Headache burden",
              "Headache days/month, moderate-severe days/month, typical duration, average and peak severity",
            ],
            [
              "Neck-related burden",
              "Range of motion restriction, provoking movements, Neck Disability Index or equivalent functional measure",
            ],
            [
              "Medication review",
              "Acute medication days/month, current preventives, adverse effects, overuse risk",
            ],
            [
              "Response to treatment",
              "PT adherence, benefit from posture/ergonomic change, response to blocks or injections, quality-of-life change",
            ],
            [
              "Reconsider diagnosis",
              "Escalating severity, new neurologic signs, new side-switching, systemic symptoms, failure of expected treatment response",
            ],
          ],
        },
      ],
    },
    {
      id: "evidence-gaps",
      title: "Evidence Gaps and Uncertainty",
      content: [
        {
          type: "paragraph",
          text: "The evidence base for cervicogenic headache remains less mature than for primary headache disorders. Dedicated contemporary NICE, AHS or EAN treatment guidelines are lacking; much of current practice still depends on expert consensus, selective interventional studies and extrapolation from neck pain or headache rehabilitation literature. Clinicians should therefore combine evidence with careful phenotype review, shared decision-making and readiness to revisit the diagnosis if the course is atypical.",
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
            "[1] ICHD-3. 11.2.1 Cervicogenic headache. International Headache Society.",
            "[2] NICE. Headaches in over 12s: diagnosis and management (CG150). Published 2012; last updated 3 June 2025.",
            "[3] VA/DoD Clinical Practice Guideline for the Management of Headache. Version 3.0, September 2023.",
            "[4] Xiao H, et al. Expert panel\u2019s guideline on cervicogenic headache: The Chinese Association for the Study of Pain recommendation. World J Clin Cases. 2021;9:2027-2038.",
            "[5] Hurley RW, et al. Consensus practice guidelines on interventions for cervical spine (facet) joint pain from a multispecialty international working group. Pain Med. 2021;22:2443-2524.",
            "[6] Lefel N, van Suijlekom H, Cohen SPC, Kallewaard JW, Van Zundert J. Cervicogenic headache and occipital neuralgia. Pain Practice. 2025;25:e13405.",
            "[7] International IFOMPT Cervical Framework / cervical vascular safety guidance (JOSPT 2023).",
            "[8] Eurospine educational summary, 2024: Evidence-Based Diagnosis and Rehabilitation of Cervicogenic Headache.",
          ],
        },
      ],
    },
  ],
};
