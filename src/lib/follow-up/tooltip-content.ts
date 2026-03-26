/**
 * Tooltip / hover-icon content for the follow-up assessment UI.
 *
 * Every string is the verbatim hover text embedded in:
 *   Headache follow up letter template.docx (w:tooltip attributes on ⓘ hyperlinks)
 *
 * Organised by DiagnosisTemplate key → UI field.
 * `getTooltip()` resolves the active template; falls back to "migraine".
 */

import type { DiagnosisTemplate } from "@/types";

/* ── per-field tooltip keys used across pages ─────────────────── */

export type TooltipField =
  | "review.patientDetails"
  | "review.workingDiagnosis"
  | "review.relevantBackground"
  | "review.keyQuestion"
  | "medications.section"
  | "investigations.section"
  | "investigations.resultsReviewed"
  | "investigations.pending"
  | "examination.section"
  | "examination.generalObservations"
  | "examination.neuroExam"
  | "examination.diagnosisSpecific"
  | "examination.examinationNotes"
  | "plan.assessment"
  | "plan.treatmentChanges"
  | "plan.safetyCounselling"
  | "plan.followUpPlan";

type TemplateTooltips = Record<TooltipField, string>;

/* ── Template 1 · Migraine ────────────────────────────────────── */

const migraine: TemplateTooltips = {
  "review.patientDetails":
    "Name, DOB, NHS / MRN, date of review, clinician, clinic type, source of referral / follow-up interval.",
  "review.workingDiagnosis":
    "Migraine subtype; aura status; episodic versus chronic; current control status; probable versus definite diagnosis if evolving.",
  "review.relevantBackground":
    "Comorbid headache disorders, pregnancy potential, psychiatric comorbidity, sleep disorder, vascular risk factors, medication overuse history.",
  "review.keyQuestion":
    "Is this still migraine, has frequency escalated to chronic migraine, or is there another coexisting/secondary headache process?",
  "medications.section":
    "Document monthly acute-treatment days, triptan/NSAID/gepant use, rescue use, adherence to preventives, response to each class, side effects, pregnancy/contraception considerations, and risk of medication overuse.",
  "investigations.section":
    "MRI/CT results, incidental findings, vascular imaging where relevant, laboratory or ophthalmology results if obtained.",
  "investigations.resultsReviewed":
    "Support primary migraine diagnosis, identify mimics, or justify further work-up.",
  "investigations.pending":
    "List requests, expected dates, and who will action results.",
  "examination.section":
    "Vital signs; general appearance; hydration; weight/BMI if relevant to preventive choice.",
  "examination.generalObservations":
    "Vital signs; general appearance; hydration; weight/BMI if relevant to preventive choice.",
  "examination.neuroExam":
    "Cranial nerves, fundoscopy if indicated, visual fields, motor/sensory/cerebellar screen, gait.",
  "examination.diagnosisSpecific":
    "Pericranial tenderness, cervical ROM, occipital tenderness, TMJ features if relevant.",
  "examination.examinationNotes":
    "Normal / abnormal findings and whether these alter diagnosis or investigation threshold.",
  "plan.assessment":
    "Summarise whether migraine burden is improved / stable / worsening; note episodic versus chronic status and any overuse or comorbidity issues.",
  "plan.treatmentChanges":
    "Acute strategy, preventive changes, behavioural/lifestyle advice, headache diary, trigger management, menstrual planning, rescue plan.",
  "plan.safetyCounselling":
    "Medication overuse thresholds, pregnancy advice where relevant, when to seek urgent review.",
  "plan.followUpPlan":
    "Next review date, monitoring metric (MHD/MMD), interval bloods / ECG if needed, and escalation criteria.",
};

/* ── Template 2 · Tension-type headache ───────────────────────── */

const tension_type: TemplateTooltips = {
  "review.patientDetails":
    "Name, DOB, NHS / MRN, date of review, clinician, clinic type, source of referral / follow-up interval.",
  "review.workingDiagnosis":
    "Tension-type headache subtype; pericranial tenderness present/absent; chronicity and overlap with migraine features.",
  "review.relevantBackground":
    "Stress, anxiety/depression, sleep disturbance, bruxism, medication overuse risk, cervical/postural contributors.",
  "review.keyQuestion":
    "Is this pure TTH, mixed migraine/TTH, chronic migraine, or a secondary headache mimicking TTH?",
  "medications.section":
    "Record simple analgesic use, caffeine-containing preparations, preventive adherence, physiotherapy/behavioural strategies, sleep and stress interventions, and days/month of acute medication.",
  "investigations.section":
    "Imaging or blood tests if undertaken, including reasons and outcomes.",
  "investigations.resultsReviewed":
    "Explain whether results support primary headache or redirect to another diagnosis.",
  "investigations.pending":
    "List and justify only if clinically indicated.",
  "examination.section":
    "State normality of neurologic examination and any features that lower threshold for imaging or referral.",
  "examination.generalObservations":
    "State normality of neurologic examination and any features that lower threshold for imaging or referral.",
  "examination.neuroExam":
    "State normality of neurologic examination and any features that lower threshold for imaging or referral.",
  "examination.diagnosisSpecific":
    "Scalp, temporalis, masseter, trapezius, cervical paraspinal tenderness; ROM and postural features.",
  "examination.examinationNotes":
    "TMJ dysfunction, bruxism signs, shoulder girdle tension, occupational ergonomics.",
  "plan.assessment":
    "Burden trend, chronicity, likely drivers (stress, poor sleep, musculoskeletal tension, mixed migraine features).",
  "plan.treatmentChanges":
    "Acute analgesic advice, preventive options, behavioural therapy, sleep hygiene, physiotherapy / posture strategy, diary use.",
  "plan.safetyCounselling":
    "Explicit max use plan for analgesics and review threshold if headache days increase.",
  "plan.followUpPlan":
    "Date, interval, response metrics, and triggers for reconsidering diagnosis or arranging imaging.",
};

/* ── Template 3 · Cluster headache ────────────────────────────── */

const cluster: TemplateTooltips = {
  "review.patientDetails":
    "Name, DOB, NHS / MRN, date of review, clinician, clinic type, source of referral / follow-up interval.",
  "review.workingDiagnosis":
    "Cluster headache subtype (episodic/chronic), side-locked laterality, current bout status, and any diagnostic uncertainty versus other TACs.",
  "review.relevantBackground":
    "Smoking history, circadian/bout pattern, prior verapamil response, steroid bridge use, oxygen access, psychiatric burden, sleep issues.",
  "review.keyQuestion":
    "Is the patient currently in bout, entering remission, or showing an alternative TAC/secondary cause pattern?",
  "medications.section":
    "Document oxygen flow/mask access and efficacy, sumatriptan/zolmitriptan use, preventive agent dose (especially verapamil), ECG monitoring, steroid bridge course, and attack burden despite therapy.",
  "investigations.section":
    "MRI brain/pituitary \u00b1 vascular imaging where indicated; record date and whether secondary causes have been excluded.",
  "investigations.resultsReviewed":
    "ECG, lithium levels, renal/thyroid tests, treatment access issues (home oxygen, device approvals).",
  "investigations.pending":
    "Imaging/lab follow-up, ECG scheduling, oxygen prescription or home supply arrangements.",
  "examination.section":
    "Focused neurologic exam, cranial nerves, Horner features, visual symptoms, gait, and any atypical findings.",
  "examination.generalObservations":
    "Pulse, blood pressure, ECG status / PR interval if on verapamil or lithium review needs.",
  "examination.neuroExam":
    "Focused neurologic exam, cranial nerves, Horner features, visual symptoms, gait, and any atypical findings.",
  "examination.diagnosisSpecific":
    "Ipsilateral tearing, conjunctival injection, ptosis/miosis, nasal symptoms during or between attacks if observed/reported.",
  "examination.examinationNotes":
    "Pulse, blood pressure, ECG status / PR interval if on verapamil or lithium review needs.",
  "plan.assessment":
    "Current bout activity, response to acute therapies, preventive efficacy, and whether phenotype remains typical cluster headache.",
  "plan.treatmentChanges":
    "Acute therapy optimization, preventive titration, bridge therapy, ECG/lithium monitoring, neuromodulation or specialist escalation if refractory.",
  "plan.safetyCounselling":
    "Home oxygen logistics, triptan max plan, emergency advice, psychological support.",
  "plan.followUpPlan":
    "Review date matched to bout activity; earlier review if attack frequency escalates or red flags emerge.",
};

/* ── Template 4 · Trigeminal autonomic cephalalgia ────────────── */

const tac: TemplateTooltips = {
  "review.patientDetails":
    "Name, DOB, NHS / MRN, date of review, clinician, clinic type, source of referral / follow-up interval.",
  "review.workingDiagnosis":
    "TAC subtype and current confidence level; include key discriminators such as attack duration/frequency, continuous background pain, and indomethacin response.",
  "review.relevantBackground":
    "Prior response to indomethacin, lamotrigine/lidocaine/topiramate, side-locking, autonomic features, interictal pain, and structural lesion work-up.",
  "review.keyQuestion":
    "Does current evolution confirm a TAC subtype, suggest cluster headache/trigeminal neuralgia/secondary headache, or justify reclassification?",
  "medications.section":
    "Document preventive and rescue therapy by subtype: indomethacin exposure and GI protection; lamotrigine/oxcarbazepine/topiramate/gabapentin; IV lidocaine admissions; nerve blocks; neurosurgical or neuromodulation discussions.",
  "investigations.section":
    "MRI brain including posterior fossa/pituitary when relevant; vascular imaging; any lesion potentially explaining secondary TAC phenotype.",
  "investigations.resultsReviewed":
    "ECG / infusion monitoring / renal function / GI protection review where relevant.",
  "investigations.pending":
    "State what remains outstanding and whether diagnosis depends on these results.",
  "examination.section":
    "Cranial nerves, sensory change in trigeminal distribution, Horner features, visual fields, gait.",
  "examination.generalObservations":
    "Cranial nerves, sensory change in trigeminal distribution, Horner features, visual fields, gait.",
  "examination.neuroExam":
    "Cranial nerves, sensory change in trigeminal distribution, Horner features, visual fields, gait.",
  "examination.diagnosisSpecific":
    "Autonomic signs, trigger zones, conjunctival injection/lacrimation, scalp/temporal/occipital tenderness if relevant.",
  "examination.examinationNotes":
    "Presence or absence of indomethacin response, continuous pain, refractory periods, triggerability, restlessness.",
  "plan.assessment":
    "Subtype impression, treatment response, and rationale for maintaining or revising the TAC diagnosis.",
  "plan.treatmentChanges":
    "Medication adjustment, GI protection, inpatient lidocaine plan, nerve block / neurosurgical referral if appropriate.",
  "plan.safetyCounselling":
    "Renal/GI/ECG/lab surveillance as appropriate to chosen therapy.",
  "plan.followUpPlan":
    "Date and key review aims: attack count, response threshold, imaging review, or consideration of advanced therapies.",
};

/* ── Template 5 · Medication overuse headache ─────────────────── */

const medication_overuse: TemplateTooltips = {
  "review.patientDetails":
    "Name, DOB, NHS / MRN, date of review, clinician, clinic type, source of referral / follow-up interval.",
  "review.workingDiagnosis":
    "Medication overuse headache with underlying primary headache disorder specified; record overused drug class and current stage of withdrawal / recovery.",
  "review.relevantBackground":
    "Duration of overuse, prior detox attempts, opioid/barbiturate use, caffeine excess, psychiatric comorbidity, relapse triggers.",
  "review.keyQuestion":
    "Is current headache primarily withdrawal/recovery, persistent underlying primary headache, or another secondary headache?",
  "medications.section":
    "Document exact monthly days of each acute medication class, start date of withdrawal, bridge treatment, preventive regimen, adherence, and whether opioid or combination-analgesic dependence concerns exist.",
  "investigations.section":
    "Only investigations clinically indicated for atypical presentation or red flags.",
  "investigations.resultsReviewed":
    "Pharmacy / GP records, OTC use, emergency department use, caffeine-containing compounds.",
  "investigations.pending":
    "Has withdrawal clarified the underlying headache diagnosis?",
  "examination.section":
    "State whether exam is normal and whether any feature suggests alternate pathology.",
  "examination.generalObservations":
    "State whether exam is normal and whether any feature suggests alternate pathology.",
  "examination.neuroExam":
    "State whether exam is normal and whether any feature suggests alternate pathology.",
  "examination.diagnosisSpecific":
    "Hydration, sleep, mood, autonomic symptoms, blood pressure if relevant, and dependence concerns.",
  "examination.examinationNotes":
    "Document whether underlying disorder is migraine, TTH, mixed phenotype, or uncertain.",
  "plan.assessment":
    "Current withdrawal phase, likely underlying headache type, and progress toward reversal of overuse.",
  "plan.treatmentChanges":
    "Withdrawal advice, preventive optimisation, bridge therapy, psychological support, written limits for future acute medication use.",
  "plan.safetyCounselling":
    "Specify monthly maximums and patient education provided.",
  "plan.followUpPlan":
    "Date for reassessment after withdrawal window and when diagnosis will be formally revised if required.",
};

/* ── Template 6 · Cervicogenic headache ───────────────────────── */

const cervicogenic: TemplateTooltips = {
  "review.patientDetails":
    "Name, DOB, NHS / MRN, date of review, clinician, clinic type, source of referral / follow-up interval.",
  "review.workingDiagnosis":
    "Cervicogenic headache, unilateral/bilateral pattern, suspected cervical pain generator, and basis for diagnosis (clinical/imaging/block response where available).",
  "review.relevantBackground":
    "Relevant trauma, cervical spondylosis, physiotherapy history, occupational posture, sleep position, coexisting migraine/TTH.",
  "review.keyQuestion":
    "Is headache truly cervicogenic, mixed with primary headache, or secondary to another cervical / intracranial process?",
  "medications.section":
    "Document analgesics, muscle relaxants/neuropathic agents if used, physiotherapy adherence, home exercise programme, block or interventional response, and any medication overuse risk.",
  "investigations.section":
    "C-spine MRI/X-ray/CT, diagnostic blocks, physiotherapy reports, pain clinic correspondence.",
  "investigations.resultsReviewed":
    "Whether findings support cervical source and correlate clinically.",
  "investigations.pending":
    "Further imaging or specialist review only if clinically justified.",
  "examination.section":
    "Cranial nerve and limb neurologic exam; screen for myelopathy/radiculopathy.",
  "examination.generalObservations":
    "Cranial nerve and limb neurologic exam; screen for myelopathy/radiculopathy.",
  "examination.neuroExam":
    "Cranial nerve and limb neurologic exam; screen for myelopathy/radiculopathy.",
  "examination.diagnosisSpecific":
    "Active ROM, pain provocation, upper cervical tenderness, facet loading, posture, scapular dysfunction.",
  "examination.examinationNotes":
    "Tender points, occipital nerve tenderness, trapezius/suboccipital spasm, trigger points.",
  "plan.assessment":
    "Current evidence for cervicogenic mechanism, overlap with other headache disorders, and treatment response.",
  "plan.treatmentChanges":
    "Exercise / physiotherapy plan, medication changes, ergonomic advice, interventional referral if appropriate.",
  "plan.safetyCounselling":
    "Pain clinic, spinal review, or neurology re-evaluation depending on findings.",
  "plan.followUpPlan":
    "Date plus targeted metrics: ROM, headache frequency, pain score, and response to rehabilitation/intervention.",
};

/* ── Template 7 · Occipital neuralgia ─────────────────────────── */

const occipital_neuralgia: TemplateTooltips = {
  "review.patientDetails":
    "Name, DOB, NHS / MRN, date of review, clinician, clinic type, source of referral / follow-up interval.",
  "review.workingDiagnosis":
    "Occipital neuralgia (greater/lesser/third occipital distribution) versus mixed occipital pain syndrome; document side, nerve territory, and certainty of diagnosis.",
  "review.relevantBackground":
    "Cervical trauma, prior surgery, nerve block response, allodynia/dysaesthesia, scalp tenderness, coexisting migraine or cervicogenic headache.",
  "review.keyQuestion":
    "Is pain neuralgic in quality and distribution, or is another posterior headache phenotype more likely?",
  "medications.section":
    "Document neuropathic pain agents, local anaesthetic/steroid block history, rescue analgesic use, physiotherapy/manual therapy, and any opioid or overuse concerns.",
  "investigations.section":
    "C-spine imaging, brain imaging if obtained, ultrasound/nerve block records, pain clinic interventions.",
  "investigations.resultsReviewed":
    "Whether results support peripheral nerve source or suggest alternate diagnosis.",
  "investigations.pending":
    "Further imaging, repeat block, pain service or surgical referral where appropriate.",
  "examination.section":
    "Cranial nerve and limb neurologic exam; look for alternative central causes.",
  "examination.generalObservations":
    "Cranial nerve and limb neurologic exam; look for alternative central causes.",
  "examination.neuroExam":
    "Cranial nerve and limb neurologic exam; look for alternative central causes.",
  "examination.diagnosisSpecific":
    "Tenderness over nerve emergence points, Tinel-like sign, sensory change/allodynia in occipital territory.",
  "examination.examinationNotes":
    "ROM limitation, trigger points, muscle spasm, overlap with cervicogenic features.",
  "plan.assessment":
    "Occipital neuralgia burden, overlap with migraine/cervicogenic headache, and response to prior block or medication.",
  "plan.treatmentChanges":
    "Medication changes, repeat/diagnostic block consideration, physical therapy, pain specialist referral, self-management advice.",
  "plan.safetyCounselling":
    "Overuse limits, driving/sedation counselling, when to seek urgent review.",
  "plan.followUpPlan":
    "Date and goals: pain frequency, block response duration, medication tolerance, and need for escalation.",
};

/* ── lookup table ──────────────────────────────────────────────── */

const TEMPLATES: Record<string, TemplateTooltips> = {
  migraine,
  tension_type,
  cluster,
  tac,
  medication_overuse,
  cervicogenic,
  occipital_neuralgia,
};

/**
 * Return the tooltip text for a given field, resolved to the active
 * diagnosis template. Falls back to the migraine template when the
 * template key is null / unknown.
 */
export function getTooltip(
  template: DiagnosisTemplate | string | null | undefined,
  field: TooltipField,
): string {
  const t = (template && TEMPLATES[template]) || migraine;
  return t[field];
}
