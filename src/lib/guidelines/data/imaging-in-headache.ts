import type { Guideline } from "../types";

export const imagingInHeadache: Guideline = {
  slug: "imaging-in-headache",
  title: "Imaging Guidance in Headache",
  subtitle:
    "Practical synthesis of NICE, American, European, and specialist recommendations",
  category: "imaging-investigations",
  tags: [
    "imaging",
    "MRI",
    "CT",
    "neuroimaging",
    "red flag",
    "thunderclap",
    "SAH",
    "IIH",
    "investigation",
  ],
  sourceDocument: "Imaging in headche.docx",
  sections: [
    {
      id: "core-principles",
      title: "Core Principles",
      content: [
        {
          type: "callout",
          variant: "info",
          title: "Core imaging principles",
          text: "Most primary headaches do not need neuroimaging. Imaging is driven by red flags, atypical syndromes, abnormal examination, or specific secondary-headache concerns. CT is first-line when speed matters; MRI is preferred for most non-acute scenarios.",
        },
        {
          type: "bullets",
          items: [
            "Most primary headaches do not need neuroimaging; imaging is driven by red flags, atypical syndromes, abnormal examination, or specific secondary-headache concerns.",
            "CT is first-line when speed matters (especially thunderclap headache, acute focal deficit, acute raised intracranial pressure, trauma, or acute haemorrhage concern).",
            "MRI is preferred for most non-acute scenarios when imaging is justified.",
          ],
        },
      ],
    },
    {
      id: "executive-summary",
      title: "Executive Summary",
      content: [
        {
          type: "bullets",
          items: [
            "Do not image uncomplicated migraine or tension-type headache solely for reassurance when the history is typical and the neurological examination is normal.",
            "Escalate immediately to urgent imaging for thunderclap headache, acute focal neurology, papilloedema, suspected raised or low intracranial pressure, new headache in pregnancy or postpartum, suspected infection, cancer or immunosuppression-associated headache, post-traumatic headache with concern for intracranial injury, and new headache over age 50 with possible giant cell arteritis or other secondary pathology.",
            "Use MRI rather than CT for most non-acute secondary-headache assessments, including trigeminal autonomic cephalalgias, cough/exertional/sexual headache, spontaneous intracranial hypotension, suspected intracranial hypertension, and persistent new daily headache when secondary causes must be excluded.",
            "Add targeted vascular imaging when the clinical question is vascular: CTA or MRA for dissection or reversible cerebral vasoconstriction syndrome, and MRV or CTV for cerebral venous sinus thrombosis or suspected idiopathic intracranial hypertension.",
          ],
        },
      ],
    },
    {
      id: "quick-decision-table",
      title: "Quick Decision Table",
      content: [
        {
          type: "table",
          headers: [
            "Clinical scenario",
            "Urgency",
            "Preferred initial imaging",
            "Why",
          ],
          rows: [
            [
              "Typical migraine or TTH; normal examination; no red flags",
              "Routine",
              "No imaging",
              "Low yield; avoid incidental findings",
            ],
            [
              "Thunderclap headache",
              "Emergency",
              "CT head without contrast ± CTA; LP if CT nondiagnostic and SAH still suspected",
              "Exclude SAH and vascular causes",
            ],
            [
              "Papilloedema / suspected raised ICP",
              "Urgent",
              "MRI brain + MRV (CT first only if MRI unavailable urgently)",
              "Exclude mass, hydrocephalus, CVST, IIH mimics",
            ],
            [
              "Positional headache worse upright / suspected low-pressure headache",
              "Urgent",
              "MRI brain with contrast; consider spine MRI",
              "Look for pachymeningeal enhancement and leak consequences",
            ],
            [
              "Cluster headache / TAC / SUNCT / SUNA",
              "Semi-urgent",
              "MRI brain with pituitary/cavernous sinus assessment",
              "Secondary TAC mimics matter",
            ],
            [
              "New headache in pregnancy or postpartum",
              "Urgent",
              "MRI head without contrast or CT head depending on acuity",
              "High-risk secondary causes",
            ],
            [
              "Red-flag headache: cancer, fever, immunosuppression, focal deficit, older age >50, post-traumatic change",
              "Urgent",
              "MRI brain preferred if stable; CT first if acute",
              "Higher probability of secondary pathology",
            ],
            [
              "New daily persistent headache",
              "Routine to urgent based on flags",
              "MRI brain with contrast; add targeted studies by flags",
              "Must exclude secondary causes",
            ],
            [
              "Suspected GCA headache in person >50",
              "Urgent",
              "Usually vascular/arterial pathway rather than routine brain imaging",
              "Prevent visual and vascular complications",
            ],
          ],
        },
      ],
    },
    {
      id: "red-flags-for-imaging",
      title: "Red Flags That Should Trigger Imaging",
      content: [
        {
          type: "bullets",
          items: [
            "Sudden onset severe headache or thunderclap pattern",
            "New focal neurological deficit, seizure, altered consciousness, or meningism",
            "Papilloedema, pulsatile tinnitus, transient visual obscurations, diplopia, or symptoms suggesting raised intracranial pressure",
            "Orthostatic headache or clear pressure-dependent headache",
            "Pregnancy or postpartum new headache or major change in pattern",
            "New headache after head trauma",
            "Fever, weight loss, cancer history, immunosuppression, or other systemic illness",
            "New headache after age 50, especially with jaw claudication, scalp tenderness, visual symptoms, or inflammatory markers suggesting giant cell arteritis",
            "Major change in established headache pattern, increasing severity or frequency, or failure of a previously reliable diagnosis",
          ],
        },
      ],
    },
    {
      id: "choosing-modality",
      title: "Choosing the Modality",
      content: [
        {
          type: "table",
          headers: ["Modality", "Use it when", "Notes"],
          rows: [
            [
              "CT head without contrast",
              "Acute thunderclap headache, acute focal deficit, suspected haemorrhage, acute hydrocephalus/mass effect, many post-traumatic settings",
              "Fast and widely available; less sensitive than MRI for many non-acute causes",
            ],
            [
              "MRI brain",
              "Most non-acute headaches when imaging is justified",
              "Better for parenchyma, posterior fossa, pituitary/cavernous sinus, inflammatory change, and low-pressure features",
            ],
            [
              "CTA / MRA",
              "Dissection, aneurysm, RCVS, vascular malformation, selected thunderclap or focal neurology pathways",
              "Choose according to urgency, availability, renal function, contrast issues, and local expertise",
            ],
            [
              "CTV / MRV",
              "Suspected CVST or headache with features of intracranial hypertension",
              "MRV often paired with MRI in suspected IIH; CTV useful acutely",
            ],
            [
              "MRI spine",
              "Suspected spontaneous intracranial hypotension or CSF leak",
              "Usually after or with brain MRI, tailored to local leak pathway",
            ],
          ],
        },
      ],
    },
    {
      id: "migraine-and-tth",
      title: "Migraine and Tension-Type Headache",
      content: [
        {
          type: "bullets",
          items: [
            "Do not routinely image patients with headache consistent with migraine who have a normal neurological examination and no atypical features or red flags.",
            "Neuroimaging may be considered when presumed migraine presents with unusual, prolonged, or persistent aura; increasing frequency, severity, or change in clinical features; first or worst migraine; brainstem aura; confusional or hemiplegic migraine; aura without headache; side-locked headache; or post-traumatic onset.",
            "NICE also advises not to refer patients with tension-type headache, migraine, cluster headache, or medication overuse headache for neuroimaging solely for reassurance.",
          ],
        },
      ],
    },
    {
      id: "trigeminal-autonomic",
      title: "Trigeminal Autonomic Cephalalgias",
      content: [
        {
          type: "bullets",
          items: [
            "MRI should be considered for cluster headache and other TACs, including paroxysmal hemicrania and SUNCT/SUNA, because secondary lesions can mimic these syndromes.",
            "A pituitary/cavernous sinus focused MRI approach is particularly useful in TAC pathways.",
          ],
        },
      ],
    },
    {
      id: "thunderclap-headache",
      title: "Thunderclap Headache",
      content: [
        {
          type: "bullets",
          items: [
            "CT head without contrast is first-line and should be performed urgently. If subarachnoid haemorrhage remains a concern after a negative CT, lumbar puncture is still required in the classic diagnostic pathway.",
            "When CT and CSF are nondiagnostic but concern remains, add vascular imaging and/or MRI depending on suspected cause, such as RCVS, dissection, CVST, pituitary apoplexy, or intracranial hypotension.",
          ],
        },
      ],
    },
    {
      id: "cough-exertional-sexual",
      title: "Cough, Exertional, and Sexual Headache",
      content: [
        {
          type: "bullets",
          items: [
            "Primary cough headache is a diagnosis of exclusion. MRI is recommended to exclude Chiari I malformation, posterior fossa lesions, or other CSF-flow obstruction.",
            "First-occurrence exertional or sexual headache should prompt evaluation for SAH and arterial dissection; use CT ± LP acutely, followed by CTA/MRA as indicated.",
          ],
        },
      ],
    },
    {
      id: "papilloedema-iih",
      title: "Papilloedema and Suspected Intracranial Hypertension",
      content: [
        {
          type: "bullets",
          items: [
            "Urgent neuroimaging is required. MRI brain with MRV is preferred where available; CT may be the first emergency study if MRI cannot be obtained rapidly.",
            "The aim is to exclude mass lesion, hydrocephalus, venous sinus thrombosis, and structural mimics before attributing the syndrome to IIH.",
          ],
        },
      ],
    },
    {
      id: "low-pressure-headache",
      title: "Suspected Low-Pressure Headache",
      content: [
        {
          type: "bullets",
          items: [
            "MRI brain with contrast is the preferred first study. Typical findings may include diffuse pachymeningeal enhancement, venous distension, pituitary enlargement, or brain sagging.",
            "If suspicion remains, add spinal imaging or a formal CSF-leak pathway depending on local protocol.",
          ],
        },
      ],
    },
    {
      id: "ndph-chronic-daily",
      title: "New Daily Persistent Headache and Chronic Daily Headache",
      content: [
        {
          type: "bullets",
          items: [
            "NDPH should not be diagnosed until secondary causes have been excluded. Brain MRI with contrast is reasonable for all suspected cases.",
            "Add MRV/CTV when CVST or IIH is a concern, CTA/MRA for thunderclap onset or dissection/RCVS concern, lumbar puncture for infection/SAH/IIH concern, and spinal imaging for possible spontaneous intracranial hypotension.",
          ],
        },
      ],
    },
    {
      id: "gca-headache",
      title: "Headache Suggestive of Giant Cell Arteritis",
      content: [
        {
          type: "bullets",
          items: [
            "In adults over 50 with new headache plus jaw claudication, scalp tenderness, constitutional symptoms, visual symptoms, or raised ESR/CRP, the priority is urgent treatment and confirmation of GCA rather than routine brain imaging.",
            "Imaging may still be required if there are neuro-ophthalmic symptoms, stroke symptoms, large-vessel concerns, or diagnostic uncertainty about alternative intracranial pathology.",
          ],
        },
      ],
    },
    {
      id: "imaging-bundles",
      title: "Suggested Imaging Bundles by Clinical Question",
      content: [
        {
          type: "table",
          headers: ["Clinical question", "Typical study bundle", "Comments"],
          rows: [
            [
              "Typical migraine, normal exam",
              "No imaging",
              "Reassure; review if pattern changes",
            ],
            [
              "Suspected SAH / thunderclap",
              "CT head without contrast → LP if needed → CTA/MRA as indicated",
              "Institutional acute pathway may vary",
            ],
            [
              "Suspected IIH",
              "MRI brain + MRV",
              "CT first only if MRI unavailable urgently",
            ],
            [
              "Suspected CVST",
              "MRI brain + MRV or CT + CTV",
              "Choose based on urgency and access",
            ],
            [
              "Suspected dissection",
              "CTA head/neck or MRA head/neck",
              "Neck pain/Horner syndrome/focal signs matter",
            ],
            [
              "Spontaneous intracranial hypotension",
              "MRI brain with contrast ± spine MRI",
              "Escalate to leak localisation pathway if needed",
            ],
            [
              "Cluster/TAC/SUNCT/SUNA",
              "MRI brain with pituitary/cavernous sinus detail",
              "Screen for secondary TAC causes",
            ],
            [
              "Cough headache / Chiari concern",
              "MRI brain incl. posterior fossa; consider cervical spine if Chiari/syrinx",
              "Especially if precipitated rather than merely aggravated",
            ],
            [
              "NDPH",
              "MRI brain with contrast; then targeted MRV/CTA/LP/spine imaging by flags",
              "Secondary causes common enough to exclude",
            ],
          ],
        },
      ],
    },
    {
      id: "guidance-alignment",
      title: "Where Guidance Streams Align and Differ",
      content: [
        {
          type: "bullets",
          items: [
            "Alignment: NICE, BSNR, AHS, and ACR all agree that uncomplicated primary headache with a normal examination should not be routinely imaged.",
            "Alignment: MRI is preferred over CT for most justified non-acute imaging scenarios.",
            "Alignment: CT remains the fastest first-line test for thunderclap headache and other acute intracranial emergencies.",
            "Difference: American guidance is more explicit on scenario-based appropriateness tables (for example, ACR variants for intracranial hypertension, intracranial hypotension, pregnancy/postpartum headache, and red-flag headache).",
            "Difference: The European headache federation consensus adds syndrome-specific MRI recommendations for persistent unilateral aura, brainstem aura, persistent aura without infarction, migrainous infarction, and TACs.",
          ],
        },
      ],
    },
    {
      id: "implementation-notes",
      title: "Implementation Notes",
      content: [
        {
          type: "bullets",
          items: [
            "Local radiology availability matters. If MRI is the preferred test but cannot be obtained within the time window needed for patient safety, use CT-based emergency imaging first.",
            "Do not order contrast automatically. Choose contrast when the question involves inflammation, infection, neoplasm, low-pressure features, or a specific vascular protocol.",
            "Be alert to incidental findings; explain this risk when imaging is ordered for low-probability indications.",
            "Imaging should answer a clinical question. Avoid 'rule-out everything' requests where the history strongly supports a primary headache disorder and examination is normal.",
          ],
        },
      ],
    },
    {
      id: "one-page-rule",
      title: "One-Page Practical Rule",
      content: [
        {
          type: "callout",
          variant: "info",
          title: "Quick reference",
          text: "If headache is typical primary headache + exam is normal + no red flags → do not image. If the problem is acute and dangerous → CT first. If the problem is non-acute but imaging is justified → MRI first.",
        },
        {
          type: "bullets",
          items: [
            "If headache is typical primary headache + exam is normal + no red flags → do not image.",
            "If the problem is acute and dangerous → CT first.",
            "If the problem is non-acute but imaging is justified → MRI first.",
            "If pressure syndrome is suspected → think MRI + venous imaging.",
            "If vascular syndrome is suspected → add CTA/MRA (and MRV/CTV when venous disease is possible).",
            "If TAC / cough / exertional / sexual / NDPH / low-pressure headache is suspected → image more readily than for routine migraine.",
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
            "NICE CG150. Headaches in over 12s: diagnosis and management. Published 2012; last updated 3 June 2025.",
            "NICE Quality Standard QS42, imaging statement for headache.",
            "American Headache Society systematic review and evidence-based guideline on neuroimaging for migraine (Evans et al., Headache 2020).",
            "ACR Appropriateness Criteria Headache: 2022 update.",
            "British Society of Neuroradiologists. Guidelines for neuroimaging in headache (2019).",
            "European Headache Federation consensus on technical investigation for primary headache disorders (2016).",
          ],
        },
      ],
    },
  ],
};
