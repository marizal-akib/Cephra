/**
 * Tooltip / hover-icon content for the follow-up assessment UI.
 *
 * Sources:
 *   - FU  = Headache follow up letter template.docx (field-level ⓘ markers + common core fields table)
 *   - DP9 = integrated_headache_diary_portal_template_v2.docx, Section 9 "Tooltip / hover-icon content library"
 */

export const TOOLTIP = {
  /* ── Review Details & Diagnosis ────────────────────────────── */
  review: {
    /** FU ⓘ on "Patient / identifiers"; common core administrative row */
    patientDetails:
      "Patient identifiers, demographics, encounter type, and interval since last review.",

    /** FU common core: "Working diagnosis and phenotype" */
    workingDiagnosis:
      "Confirm or update the working headache diagnosis and phenotype classification.",

    /** FU ⓘ on "Key diagnostic question today" */
    keyQuestion:
      "Frame the key question driving today's consultation, such as treatment response, diagnostic clarification, or emerging safety concern.",

    /** FU ⓘ on "Relevant background" */
    diagnosisNotes:
      "Note changes to diagnosis, relevant background, or phenotype refinement since last review.",
  },

  /* ── Medication Review ─────────────────────────────────────── */
  medications: {
    /** DP9: "Current medication" */
    section:
      "Record exact dose, schedule, adherence, efficacy, side effects, and any medication-overuse concern.",

    /** FU common core: "Acute medication use days/month" */
    acuteMedication:
      "Acute medication use days per month. Track against medication-overuse headache thresholds by drug class.",

    /** FU common core: "Treatment response and adverse effects" */
    treatmentResponse:
      "Treatment response and adverse effects for key therapeutic agents.",

    /** FU common core: "Current preventive and acute medications" */
    perDrugReview:
      "Current preventive and acute medications with dose, benefit, tolerability, and planned action.",
  },

  /* ── Investigation & Results Review ────────────────────────── */
  investigations: {
    /** DP9: "Result review" */
    section:
      "Summarise important imaging, blood tests, ophthalmology findings, sleep study results, or other investigations that change management.",

    /** FU ⓘ: "How results affect current diagnosis" */
    resultsReviewed:
      "Investigation outcomes and their implications for diagnosis and management.",

    /** FU ⓘ: "Pending investigations" */
    pending:
      "List tests awaited with expected timelines and contingency plans.",
  },

  /* ── Clinical Examination ──────────────────────────────────── */
  examination: {
    /** DP9: "Clinical examination" */
    section:
      "Document targeted headache and neurologic examination findings, fundoscopy status if relevant, neck findings where appropriate, and any abnormal signs that redirect the diagnosis.",

    /** FU ⓘ: "General examination" */
    generalObservations:
      "General examination including vital signs, weight, and overall clinical impression.",

    /** FU ⓘ: "Focused neurologic examination" */
    neuroExam:
      "Focused neurological examination including cranial nerves, fundoscopy, and comparison with baseline.",

    /** FU ⓘ: varies by diagnosis type */
    diagnosisSpecific:
      "Examination findings relevant to the specific headache diagnosis: pericranial tenderness, autonomic features, or cervical findings as appropriate.",

    /** FU ⓘ: "Examination summary" */
    examinationNotes:
      "Summary of all examination findings and their clinical significance for diagnosis and management.",
  },

  /* ── Assessment, Management & Follow-up Plan ───────────────── */
  plan: {
    /** FU ⓘ: "Assessment" */
    assessment:
      "Synthesise burden data, medication response, examination findings, and investigation results. State whether the patient is improving, stable, or worsening.",

    /** DP9: "Management plan and treatment" */
    treatmentChanges:
      "State acute treatment, preventive plan, non-pharmacologic measures, safety-netting, and escalation pathway.",

    /** FU ⓘ: "Safety counselling" */
    safetyCounselling:
      "Emergency escalation criteria including thunderclap headache, new focal neurology, and visual loss. Medication safety and driving or work implications.",

    /** DP9: "Follow-up plan" */
    followUpPlan:
      "Specify timeframe, trigger for earlier review, and what should be measured next time, including diary continuation and repeat graph review.",
  },
} as const;
