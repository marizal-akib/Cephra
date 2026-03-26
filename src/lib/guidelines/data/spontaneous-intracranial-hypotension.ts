import type { Guideline } from "../types";

export const spontaneousIntracranialHypotension: Guideline = {
  slug: "spontaneous-intracranial-hypotension",
  title: "Spontaneous Intracranial Hypotension (SIH)",
  subtitle:
    "Integrated synthesis of evidence with current UK/NICE, American, and European guidance",
  category: "imaging-investigations",
  tags: [
    "SIH",
    "spontaneous intracranial hypotension",
    "CSF leak",
    "orthostatic headache",
    "blood patch",
    "brain sagging",
    "SEEPS",
    "epidural",
    "CSF-venous fistula",
    "myelography",
    "low pressure headache",
  ],
  sourceDocument: "Spontaneous intracranial hypotension.docx",
  sections: [
    {
      id: "scope-and-positioning",
      title: "Scope and Positioning",
      content: [
        {
          type: "callout",
          variant: "info",
          title: "Purpose and Scope",
          text: "This document is a clinic- and radiology-ready reference for the recognition, investigation, and initial management of spontaneous intracranial hypotension (SIH). It is intended for neurologists, headache specialists, neuroradiologists, and other clinicians involved in headache or CSF-leak services.",
        },
        {
          type: "paragraph",
          text: "The guidance integrates information from the following sources to provide a cohesive, practical framework:",
        },
        {
          type: "bullets",
          items: [
            "NICE referral guidance and evolving interventional procedure oversight relevant to SIH.",
            "UK and European multidisciplinary consensus guidelines on the diagnosis and management of SIH.",
            "American diagnostic and treatment guidance, including recent consensus imaging guidelines.",
            "European neuroradiology recommendations for standardised SIH imaging protocols.",
          ],
        },
      ],
    },
    {
      id: "executive-practice-summary",
      title: "Executive Practice Summary",
      content: [
        {
          type: "bullets",
          items: [
            "Think of SIH in any patient with orthostatic headache, especially when headache improves with recumbency, is associated with nausea, neck pain/stiffness, tinnitus, dizziness, auditory distortion, diplopia, or unexplained \u201cbrain sagging\u201d on MRI.",
            "Do not exclude SIH solely because the headache is no longer strictly orthostatic, because brain MRI is normal, or because lumbar puncture opening pressure is normal.",
            "First-line diagnostic imaging should be MRI brain with gadolinium and MRI whole spine performed together where feasible.",
            "Brain MRI is the most sensitive initial test, but spine imaging provides direct or indirect evidence of leak and helps triage the next myelographic study.",
            "Lumbar puncture is not a routine first-line diagnostic test for SIH and may worsen symptoms or confound the diagnosis.",
            "If initial MRI is nondiagnostic but suspicion remains high, escalate to leak-localising imaging rather than dismissing the diagnosis.",
            "A non-targeted epidural blood patch remains an accepted early treatment step in many patients; persistent or severe cases require targeted localisation and specialist multidisciplinary management.",
            "CSF\u2013venous fistula treatment is evolving rapidly; NICE currently regards transvenous embolisation as requiring formal research in the NHS while evidence matures.",
          ],
        },
      ],
    },
    {
      id: "definition-and-pathophysiology",
      title: "Definition and Pathophysiologic Framework",
      content: [
        {
          type: "paragraph",
          text: "Spontaneous intracranial hypotension is a syndrome caused by spontaneous loss of cerebrospinal fluid (CSF) volume, almost always through a spinal dural breach or CSF\u2013venous fistula, without a preceding procedure or obvious trauma. The resulting CSF hypovolaemia leads to reduced intracranial CSF buoyancy, downward displacement of the brain, compensatory venous engorgement, and the hallmark symptom of orthostatic headache.",
        },
        {
          type: "bullets",
          items: [
            "Loss of CSF buoyancy causes the brain to sag within the cranial vault, producing traction on pain-sensitive dural and vascular structures.",
            "Typical leak mechanisms include ventral dural tears (often at the thoracic or cervicothoracic level), leaks through meningeal diverticula or nerve-root sleeve defects, and CSF\u2013venous fistulas.",
            "Underlying dural fragility or connective tissue disorders may predispose some patients, though the majority have no identified systemic condition.",
          ],
        },
        {
          type: "table",
          headers: ["Core mechanism", "Practical implication"],
          rows: [
            [
              "CSF hypovolaemia with brain sagging",
              "Explains orthostatic headache, cranial nerve traction syndromes, and imaging signs such as pachymeningeal enhancement and venous engorgement.",
            ],
            [
              "Spinal rather than cranial leak in most cases",
              "Investigation must prioritise the spine even when the presenting symptoms are purely cranial.",
            ],
            [
              "Opening pressure can be normal",
              "A normal lumbar puncture does not rule out SIH.",
            ],
            [
              "Leak phenotype varies",
              "Choice of myelographic test should be tailored to whether the patient appears SLEC-positive, SLEC-negative, or likely to have a fistula/high-flow leak.",
            ],
          ],
        },
      ],
    },
    {
      id: "epidemiology-and-service-relevance",
      title: "Epidemiology and Service Relevance",
      content: [
        {
          type: "paragraph",
          text: "SIH is uncommon but probably underdiagnosed. Reported annual incidence is about 4\u20135 per 100,000, mean age at presentation is early 40s, and women predominate. Diagnostic delay remains a major systems problem, particularly because presentations may mimic migraine, cervicogenic headache, Chiari I malformation, postural tachycardia syndrome, or chronic daily headache.",
        },
      ],
    },
    {
      id: "when-to-suspect-sih",
      title: "When to Suspect SIH",
      content: [
        {
          type: "table",
          headers: ["Clinical clue", "Comment"],
          rows: [
            [
              "Orthostatic headache",
              "Most characteristic feature; typically absent or mild on waking, worsens after sitting/standing, improves after lying flat.",
            ],
            [
              "Loss of orthostatic pattern over time",
              "Chronic cases may evolve into daily or mixed-pattern headache and still represent SIH.",
            ],
            [
              "Vestibulo-auditory symptoms",
              "Tinnitus, muffled hearing, echoing, hyperacusis, dizziness, or vertigo are common supportive clues.",
            ],
            [
              "Neck pain / interscapular or back pain",
              "Supportive, especially when combined with orthostatic headache.",
            ],
            [
              "Diplopia or abducens palsy",
              "Should heighten urgency; may reflect downward brainstem traction.",
            ],
            [
              "Behavioral/cognitive change with brain sagging",
              "Rare but important; severe cases can mimic frontotemporal dementia.",
            ],
            [
              "Subdural collections or \u201cChiari-like\u201d MRI appearance",
              "Always ask whether SIH could explain the scan rather than labelling as primary Chiari or isolated subdural disease.",
            ],
          ],
        },
        {
          type: "paragraph",
          text: "In UK practice, headaches relieved by lying down should prompt consideration of spontaneous intracranial hypotension. Even though NICE does not publish a dedicated SIH pathway, this posture-dependent headache pattern is explicitly flagged in NICE referral guidance.",
        },
      ],
    },
    {
      id: "atypical-and-severe-presentations",
      title: "Important Atypical and Severe Presentations",
      content: [
        {
          type: "bullets",
          items: [
            "Thunderclap onset can occur and does not exclude SIH.",
            "Orthostatic character may be delayed, intermittent, paradoxical, or absent in chronic disease.",
            "Rare but serious manifestations include impaired consciousness, brainstem syndromes, ataxia, quadriparesis, movement disorders, acute subdural haematoma, venous sinus thrombosis, posterior circulation infarction, and superficial siderosis.",
            "When severe neurological deterioration coexists with imaging signs of brain sagging, urgent specialist review is required.",
          ],
        },
      ],
    },
    {
      id: "diagnostic-criteria",
      title: "Diagnostic Criteria and Practical Diagnostic Standard",
      content: [
        {
          type: "paragraph",
          text: "The ICHD-3 criteria for headache attributed to low CSF pressure require evidence of low CSF pressure or CSF leakage; however, in clinical practice, many patients with genuine SIH do not meet strict ICHD-3 criteria at initial presentation because opening pressure may be normal and leak localisation may not yet have been performed. The practical diagnostic standard used in specialist services is therefore broader and more clinically pragmatic.",
        },
        {
          type: "table",
          headers: [
            "Practical diagnostic standard for routine care",
            "Required?",
          ],
          rows: [
            [
              "Compatible syndrome (usually orthostatic headache \u00b1 associated symptoms)",
              "Yes",
            ],
            [
              "Brain MRI and whole-spine MRI as first-line imaging",
              "Yes",
            ],
            [
              "Demonstrated low opening pressure on lumbar puncture",
              "No",
            ],
            [
              "Demonstrated exact leak site before starting treatment",
              "No in all cases; yes for targeted treatment or persistent/refractory disease",
            ],
            [
              "Alternative diagnoses reasonably excluded",
              "Yes",
            ],
          ],
        },
      ],
    },
    {
      id: "recommended-diagnostic-pathway",
      title: "Recommended Diagnostic Pathway",
      content: [
        {
          type: "table",
          headers: ["Step", "Action", "Rationale"],
          rows: [
            [
              "1",
              "Recognise the syndrome",
              "Orthostatic headache and supportive symptoms are the key trigger for work-up.",
            ],
            [
              "2",
              "MRI brain with gadolinium + MRI whole spine",
              "Best first-line combination; identifies indirect intracranial signs and direct/indirect spinal leak features.",
            ],
            [
              "3",
              "If imaging supports SIH, classify as likely SLEC-positive or SLEC-negative",
              "This guides the next localising test if needed.",
            ],
            [
              "4",
              "If MRI is nondiagnostic but suspicion remains high, proceed to noninvasive MR myelography or another specialist leak-localising study",
              "Normal initial MRI does not exclude SIH.",
            ],
            [
              "5",
              "Reserve lumbar puncture for selected cases, usually when a myelographic procedure already requires dural puncture",
              "LP can worsen SIH and opening pressure is not reliably low.",
            ],
            [
              "6",
              "Escalate persistent or severe cases to a specialist SIH MDT",
              "Needed for leak localisation, targeted blood patch, surgery, or fistula-directed intervention.",
            ],
          ],
        },
      ],
    },
    {
      id: "initial-imaging-guidance",
      title: "Initial Imaging Guidance",
      content: [],
      subsections: [
        {
          id: "mri-brain",
          title: "MRI Brain",
          content: [
            {
              type: "bullets",
              items: [
                "Preferred first-line test: MRI brain with gadolinium contrast unless contraindicated.",
                "Most useful signs may be remembered with the mnemonic SEEPS: Subdural fluid collections, pachymeningeal Enhancement, venous Engorgement, Pituitary enlargement, and Sagging of the brain.",
                "Brain MRI is the most sensitive initial investigation, but approximately one in five patients may still have a normal study.",
              ],
            },
            {
              type: "table",
              headers: [
                "Common MRI brain findings in SIH",
                "How to interpret",
              ],
              rows: [
                [
                  "Diffuse smooth pachymeningeal enhancement",
                  "Most characteristic indirect sign; leptomeningeal enhancement is not the expected pattern.",
                ],
                [
                  "Subdural hygromas or haematomas",
                  "Support SIH, especially when combined with orthostatic headache or other SEEPS signs.",
                ],
                [
                  "Venous sinus engorgement",
                  "Part of Monro\u2013Kellie compensatory venous dilatation.",
                ],
                [
                  "Pituitary enlargement",
                  "Can mimic pituitary pathology if the clinical context is missed.",
                ],
                [
                  "Brainstem descent / reduced suprasellar and prepontine cisterns",
                  "Represents \u201cbrain sagging\u201d; distinguish from primary Chiari I malformation.",
                ],
                [
                  "Perioptic CSF reduction / superior ophthalmic vein dilatation",
                  "Supportive but not required.",
                ],
              ],
            },
          ],
        },
        {
          id: "mri-whole-spine",
          title: "MRI Whole Spine",
          content: [
            {
              type: "bullets",
              items: [
                "Brain MRI and whole-spine MRI should be requested together whenever SIH is seriously suspected.",
                "Whole-spine MRI is used to look for direct evidence of spinal longitudinal epidural CSF collection (SLEC) and for indirect signs such as dilated epidural veins, meningeal diverticula, collapse of the dural sac, or epidural fluid.",
                "The European neuroradiology recommendations specifically advocate a standardised whole-spine protocol including heavily T2-weighted 3D myelographic sequences.",
              ],
            },
            {
              type: "table",
              headers: ["Spine MRI pattern", "Likely implication for next test"],
              rows: [
                [
                  "SLEC-positive (extradural fluid collection visible)",
                  "Suggests a dural tear/high-flow leak; dynamic CT myelography or appropriately positioned myelographic study is often next.",
                ],
                [
                  "SLEC-negative with meningeal diverticula or persistent high suspicion",
                  "Raises possibility of a diverticular leak or CSF\u2013venous fistula; decubitus/digital subtraction techniques may be required.",
                ],
                [
                  "Completely normal spine MRI",
                  "Does not exclude SIH; proceed according to overall clinical probability and expert review.",
                ],
              ],
            },
          ],
        },
      ],
    },
    {
      id: "escalation-imaging",
      title: "Escalation Imaging When First-Line MRI Is Nondiagnostic",
      content: [
        {
          type: "bullets",
          items: [
            "If clinical suspicion remains high despite nondiagnostic first-line MRI, escalate rather than abandon the diagnosis.",
            "A noninvasive heavily T2-weighted MR myelographic study is a reasonable next step because it avoids dural puncture, radiation, and intrathecal contrast.",
            "For leak localisation, targeted invasive studies may be required: CT myelography, dynamic CT myelography, digital subtraction myelography, or MR myelography with contrast, depending on the suspected leak phenotype and local expertise.",
          ],
        },
        {
          type: "table",
          headers: ["Modality", "Best use", "Limitations / cautions"],
          rows: [
            [
              "Noninvasive MR myelography",
              "Useful when initial MRI is nondiagnostic; may show meningeal diverticula or extradural fluid.",
              "May still fail to localise small or intermittent leaks.",
            ],
            [
              "Intrathecal CT myelography",
              "Widely used leak-localising test; often preferred after nondiagnostic MRI in many centres.",
              "Requires dural puncture and intrathecal contrast.",
            ],
            [
              "Dynamic CT myelography / cone-beam CT variants",
              "Helpful for high-flow leaks and precise temporal localisation.",
              "Specialist test; radiation burden; requires protocol expertise.",
            ],
            [
              "Digital subtraction myelography",
              "Particularly helpful for SLEC-negative cases and CSF\u2013venous fistulas.",
              "Highly operator dependent; invasive; positioning matters.",
            ],
            [
              "Radioisotope cisternography",
              "Rare fallback option only.",
              "Lower spatial/temporal resolution and now largely superseded.",
            ],
          ],
        },
      ],
    },
    {
      id: "lumbar-puncture",
      title: "Lumbar Puncture: Limited but Not Zero Role",
      content: [
        {
          type: "bullets",
          items: [
            "Do not use lumbar puncture as the routine first-line diagnostic test for SIH.",
            "Opening pressure may be low, normal, or occasionally misleadingly high depending on chronicity, recumbency, intermittent leak behaviour, or timing.",
            "Lumbar puncture may worsen symptoms, create an iatrogenic leak, and complicate interpretation.",
            "Its main diagnostic value is when pressure measurement is obtained during an invasive myelographic study that is already clinically indicated.",
          ],
        },
        {
          type: "table",
          headers: ["CSF result", "Interpretation"],
          rows: [
            [
              "Opening pressure <60 mmH\u2082O",
              "Supportive but not mandatory.",
            ],
            [
              "Normal opening pressure",
              "Does not exclude SIH.",
            ],
            [
              "Mild lymphocytic pleocytosis or modestly raised protein",
              "May occur reactively and should not automatically divert attention to infection if the overall picture supports SIH.",
            ],
            [
              "Low CSF glucose / abnormal microbiology / cytology",
              "Unexpected for uncomplicated SIH; reassess the diagnosis.",
            ],
          ],
        },
      ],
    },
    {
      id: "differential-diagnosis",
      title: "Differential Diagnosis",
      content: [
        {
          type: "table",
          headers: ["Condition", "How it differs from SIH"],
          rows: [
            [
              "Migraine",
              "May worsen later in the day and may include nausea or dizziness, but typically lacks rapid recumbency relief and characteristic MRI signs.",
            ],
            [
              "Cervicogenic headache",
              "May worsen upright because of cervical strain but should not produce SIH imaging features.",
            ],
            [
              "Chiari I malformation",
              "Headache is more often Valsalva-related than orthostatic; check for true SIH brain sagging before diagnosing Chiari.",
            ],
            [
              "Postural tachycardia syndrome / orthostatic intolerance",
              "Orthostatic symptoms occur without imaging evidence of CSF leak; tachycardia pattern assists differentiation.",
            ],
            [
              "Post-dural puncture headache",
              "Temporal relation to recent spinal procedure is the main clue.",
            ],
            [
              "CSF shunt overdrainage",
              "Clinical syndrome can be identical; the shunt history is decisive.",
            ],
          ],
        },
      ],
    },
    {
      id: "initial-management-pathway",
      title: "Initial Management Pathway",
      content: [
        {
          type: "paragraph",
          text: "The following pathway is aligned with current multidisciplinary consensus guidance and reflects the stepwise escalation model endorsed by UK, European, and American expert recommendations.",
        },
        {
          type: "table",
          headers: ["Clinical situation", "Recommended next step"],
          rows: [
            [
              "Mild or early symptoms, stable patient",
              "Conservative strategy may be tried briefly (bed rest, hydration, caffeine according to local practice), but prolonged passive observation is not favoured if disability is significant.",
            ],
            [
              "Persistent symptoms despite conservative strategy, or severe disabling symptoms",
              "Non-targeted lumbar epidural blood patch is an accepted early treatment; European recommendations describe >20 mL autologous blood in the lumbar epidural space.",
            ],
            [
              "Partial response after first blood patch",
              "Repeat blood patch may be reasonable; benefit may be cumulative.",
            ],
            [
              "Failure after two or three non-targeted patches, recurrent symptoms, severe neurological manifestations, or strong suspicion of a focal leak/fistula",
              "Proceed to specialist leak localisation and targeted treatment (directed blood patch, fibrin glue, surgery, or fistula-directed endovascular/surgical therapy).",
            ],
            [
              "Acute neurological deterioration (eg, coma, severe brain sagging syndrome, major subdural collection)",
              "Urgent specialist transfer; temporising emergency blood patch, saline strategies, or surgical/endovascular management may be required.",
            ],
          ],
        },
      ],
    },
    {
      id: "csf-venous-fistula",
      title: "CSF\u2013Venous Fistula and Evolving Interventional Guidance",
      content: [
        {
          type: "bullets",
          items: [
            "CSF\u2013venous fistula is now a major recognised cause of SLEC-negative SIH and often requires decubitus/digital subtraction or dynamic myelography for identification.",
            "Definitive treatment options include surgery, CT-guided fibrin glue approaches, and transvenous embolisation in selected specialist centres.",
            "NICE currently has in-development interventional procedure guidance for transvenous embolisation for SIH caused by a CSF\u2013venous fistula. As of the latest draft available during this review, NICE states that more research is needed and the procedure should only be used as part of formal research in the NHS.",
            "Therefore, UK services should treat transvenous embolisation as a specialist, MDT-led, research-linked option rather than routine standard care until final guidance and stronger comparative evidence are available.",
          ],
        },
      ],
    },
    {
      id: "mdt-structure",
      title: "Suggested MDT Structure for SIH Services",
      content: [
        {
          type: "bullets",
          items: [
            "Headache neurologist or neurologist experienced in SIH.",
            "Diagnostic neuroradiologist familiar with SIH MRI, MR myelography, CT myelography, and DSM pathways.",
            "Interventional neuroradiologist / spinal intervention specialist for targeted blood patching, fibrin glue procedures, and fistula embolisation where available.",
            "Neurosurgeon or spinal surgeon for repair of dural tears, diverticular surgery, or persistent/refractory cases.",
            "Neuro-ophthalmology support where visual symptoms, diplopia, or differential diagnostic uncertainty exists.",
          ],
        },
      ],
    },
    {
      id: "radiology-reporting-minimum-dataset",
      title: "Radiology Reporting Minimum Dataset",
      content: [
        {
          type: "table",
          headers: ["Report element", "Minimum statement to include"],
          rows: [
            [
              "Brain MRI impression",
              "Whether findings are typical, equivocal, or not supportive of SIH; mention SEEPS features individually.",
            ],
            [
              "Brain sagging severity",
              "Comment on cerebellar tonsillar descent, reduced cisternal spaces, and whether appearances could mimic Chiari I.",
            ],
            [
              "Subdural collections",
              "Presence, laterality, size, and haemorrhagic features.",
            ],
            [
              "Spine MRI",
              "State whether SLEC is present or absent and describe meningeal diverticula, epidural venous engorgement, or suspected leak level.",
            ],
            [
              "Next imaging suggestion",
              "When appropriate, recommend the likely next study (eg, dynamic CT myelography, decubitus DSM, MR myelography) rather than leaving escalation undefined.",
            ],
          ],
        },
      ],
    },
    {
      id: "cohesive-practice-recommendations",
      title: "Cohesive Practice Recommendations",
      content: [
        {
          type: "bullets",
          items: [
            "Use SIH as an active differential diagnosis whenever headache improves with lying flat, even if symptoms have become chronic or atypical.",
            "Obtain MRI brain with gadolinium and MRI whole spine together as the default first-line imaging package.",
            "Treat a normal opening pressure as non-exclusionary.",
            "Avoid routine diagnostic lumbar puncture outside an already-indicated myelographic pathway.",
            "Escalate to specialist myelographic localisation when first-line MRI is negative but clinical suspicion remains high or when blood patch treatment fails.",
            "Adopt an MDT model for persistent, severe, recurrent, or fistula-mediated disease.",
            "In UK practice, recognise that NICE currently provides referral signals and evolving interventional oversight rather than a full dedicated SIH pathway; therefore, the 2023 multidisciplinary consensus guideline and newer imaging guidance should anchor practice.",
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
            "[1] Cheema S, Anderson J, Angus-Leppan H, et al. Multidisciplinary consensus guideline for the diagnosis and management of spontaneous intracranial hypotension. J Neurol Neurosurg Psychiatry. 2023;94(10):835-843.",
            "[2] Kranz PG, Amrhein TJ, Brinjikji W, et al. Consensus Guidelines on Diagnostic Brain and Spine Imaging of Spontaneous Intracranial Hypotension. AJNR Am J Neuroradiol. 2025;46(12):2457-2467.",
            "[3] Ciceri EFM, Cirillo L, Causin F, et al. Recommendations for the diagnosis and treatment of spontaneous intracranial hypotension. Radiol Med. 2026;131:332-339.",
            "[4] NICE. Suspected neurological conditions: recognition and referral (NG127).",
            "[5] NICE. Transvenous embolisation for spontaneous intracranial hypotension caused by a cerebrospinal fluid\u2013venous fistula. Interventional procedures draft guidance GID-IPG10318.",
            "[6] D\u2019Antona L, Jaime Merchan MA, Vassiliou A, et al. Clinical presentation, investigation findings, and treatment outcomes of spontaneous intracranial hypotension syndrome. JAMA Neurol. 2021;78(3):329-337.",
            "[7] Dobrocky T, Nicholson P, H\u00e4ni L, et al. Spontaneous intracranial hypotension: searching for the CSF leak. Lancet Neurol. 2022;21(4):369-380.",
            "[8] Callen AL, Friedman DI, Parikh S, et al. Diagnosis and treatment of spontaneous intracranial hypotension: role of epidural blood patching. Neurol Clin Pract. 2024;14(3):e200290.",
          ],
        },
      ],
    },
  ],
};
