import type { ClinicianAssessment } from "@/types";
import type { DiagnosticOutput } from "@/lib/engine/types";
import { RED_FLAG_FIELDS } from "@/lib/schemas/red-flags";

export interface NoteContext {
  patientName: string;
  patientId?: string;
  age?: number;
  sex?: string;
  dateOfBirth?: string;
  assessment: ClinicianAssessment;
  diagnosticOutput: DiagnosticOutput;
  clinicianName?: string;
  clinicianCredentials?: string;
  clinicianDesignation?: string;
  consultationDate?: string;
  assessmentReference?: string;
}

// ── Utilities ──

function formatConsultationDate(isoDate: string | undefined): string {
  if (!isoDate) return "";
  return new Date(isoDate).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateOnly(isoDate: string | undefined): string {
  if (!isoDate) return "";
  return new Date(isoDate).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function describeLocation(pain: Record<string, unknown>): string {
  const parts: string[] = [];
  if (pain.unilateral === true) parts.push("unilateral");
  if (pain.bilateral === true) parts.push("bilateral");
  if (pain.side_locked === true) parts.push("side-locked");
  if (pain.alternating_sides === true) parts.push("alternating sides");
  if (pain.frontal === true) parts.push("frontal");
  if (pain.temporal === true) parts.push("temporal");
  if (pain.orbital === true) parts.push("orbital");
  if (pain.supraorbital === true) parts.push("supraorbital");
  if (pain.occipital === true) parts.push("occipital");
  if (pain.neck_predominant === true) parts.push("neck-predominant");
  if (pain.generalized === true) parts.push("generalized");
  if (pain.unable_to_characterize === true) parts.push("unable to characterize");
  return parts.length > 0 ? parts.join(", ") : "location not specified";
}

function describeQuality(pain: Record<string, unknown>): string {
  const parts: string[] = [];
  if (pain.pulsating === true) parts.push("pulsating");
  if (pain.pressing === true) parts.push("pressing");
  if (pain.tightening === true) parts.push("tightening");
  if (pain.stabbing === true) parts.push("stabbing");
  if (pain.burning === true) parts.push("burning");
  if (pain.boring === true) parts.push("boring");
  return parts.length > 0 ? parts.join(", ") : "quality not specified";
}

function describeSymptoms(symptoms: Record<string, unknown>): string {
  const parts: string[] = [];
  if (symptoms.nausea === true) parts.push("nausea");
  if (symptoms.vomiting === true) parts.push("vomiting");
  if (symptoms.photophobia === true) parts.push("photophobia");
  if (symptoms.phonophobia === true) parts.push("phonophobia");
  if (symptoms.osmophobia === true) parts.push("osmophobia");
  if (symptoms.motion_sensitivity === true) parts.push("motion sensitivity");
  if (symptoms.dizziness === true) parts.push("dizziness");
  if (symptoms.fatigue === true) parts.push("fatigue");
  if (symptoms.neck_pain === true) parts.push("neck pain");
  return parts.length > 0 ? parts.join(", ") : "none reported";
}

function str(val: unknown): string {
  return typeof val === "string" ? val.trim() : "";
}

function num(val: unknown): number | null {
  return typeof val === "number" ? val : null;
}

// ── Section 1: Review Details and Diagnosis ──

function generateReviewDetailsAndDiagnosis(ctx: NoteContext): string {
  const lines: string[] = [];

  // Patient identifiers
  lines.push(`Patient name: ${ctx.patientName}`);
  if (ctx.patientId) lines.push(`Patient ID: ${ctx.patientId}`);
  if (ctx.dateOfBirth) lines.push(`Date of birth: ${formatDateOnly(ctx.dateOfBirth)}`);
  if (ctx.age !== undefined) lines.push(`Age: ${ctx.age} years`);
  if (ctx.sex) lines.push(`Sex: ${ctx.sex}`);

  // Consultation details
  if (ctx.consultationDate) lines.push(`Date of review: ${formatConsultationDate(ctx.consultationDate)}`);
  if (ctx.clinicianName) lines.push(`Clinician: ${ctx.clinicianName}`);
  if (ctx.assessmentReference) lines.push(`Assessment reference: ${ctx.assessmentReference}`);

  // Current working diagnosis
  const top = ctx.diagnosticOutput.phenotypes[0];
  if (top) {
    lines.push("");
    lines.push(`Current working diagnosis: ${top.label} (${top.confidence} confidence)`);
  }

  // Relevant background
  const pmh = (ctx.assessment.past_medical_history || {}) as Record<string, unknown>;
  const conditionLabels: Record<string, string> = {
    hypertension: "Hypertension",
    diabetes: "Diabetes",
    thyroid_disorder: "Thyroid disorder",
    asthma_copd: "Asthma/COPD",
    heart_disease: "Heart disease",
    stroke_tia: "Stroke/TIA",
    epilepsy_seizure_disorder: "Epilepsy/seizure disorder",
    anxiety_depression: "Anxiety/depression",
  };
  const conditions = Array.isArray(pmh.common_conditions)
    ? (pmh.common_conditions as string[])
        .filter((item) => typeof item === "string" && item.length > 0)
        .map((item) => conditionLabels[item] || item)
    : [];
  const pmhNotes = str(pmh.notes);
  if (conditions.length > 0 || pmhNotes) {
    lines.push("");
    lines.push("Relevant background:");
    if (conditions.length > 0) lines.push(conditions.join(", "));
    if (pmhNotes) lines.push(pmhNotes);
  }

  // Key diagnostic question
  const workupData = (ctx.assessment.workup_data || {}) as Record<string, unknown>;
  const keyQuestion = str(workupData.key_diagnostic_question);
  if (keyQuestion) {
    lines.push("");
    lines.push(`Key diagnostic question today: ${keyQuestion}`);
  }

  return lines.join("\n");
}

// ── Section 2: Current Headache Burden, Severity and Pattern ──

function generateCurrentHeadacheBurden(ctx: NoteContext): string {
  const { assessment } = ctx;
  const pattern = (assessment.pattern || {}) as Record<string, unknown>;
  const pain = (assessment.pain || {}) as Record<string, unknown>;
  const symptoms = (assessment.symptoms || {}) as Record<string, unknown>;
  const aura = (assessment.aura || {}) as Record<string, unknown>;
  const autonomic = (assessment.autonomic || {}) as Record<string, unknown>;
  const triggers = (assessment.triggers || {}) as Record<string, unknown>;

  const sections: string[] = [];

  // Frequency
  const freqParts: string[] = [];
  if (num(pattern.headache_days_per_month) !== null)
    freqParts.push(`${pattern.headache_days_per_month} headache days/month`);
  if (num(pattern.severe_days_per_month) !== null)
    freqParts.push(`${pattern.severe_days_per_month} severe days/month`);
  if (num(pattern.migraine_like_days_per_month) !== null)
    freqParts.push(`${pattern.migraine_like_days_per_month} migraine-like days/month`);
  if (num(pattern.attacks_per_month) !== null)
    freqParts.push(`${pattern.attacks_per_month} attacks/month`);
  if (num(pattern.attacks_per_day) !== null)
    freqParts.push(`${pattern.attacks_per_day} attacks/day`);
  if (freqParts.length > 0) sections.push(`Frequency: ${freqParts.join(", ")}.`);

  // Duration
  const durParts: string[] = [];
  if (num(pattern.duration_hours) !== null) durParts.push(`${pattern.duration_hours} hours`);
  if (num(pattern.duration_minutes) !== null) durParts.push(`${pattern.duration_minutes} minutes`);
  if (durParts.length > 0) sections.push(`Typical untreated attack duration: ${durParts.join(", ")}.`);

  // Time to peak
  if (num(pattern.time_to_peak_minutes) !== null)
    sections.push(`Time to peak: ${pattern.time_to_peak_minutes} minutes.`);

  // Pattern duration
  if (num(pattern.pattern_duration_months) !== null)
    sections.push(`Current pattern duration: ${pattern.pattern_duration_months} months.`);
  if (num(pattern.first_headache_age) !== null)
    sections.push(`Age at first headache: ${pattern.first_headache_age} years.`);

  // Intensity
  const intParts: string[] = [];
  if (num(pain.avg_intensity) !== null) intParts.push(`average ${pain.avg_intensity}/10`);
  if (num(pain.peak_intensity) !== null) intParts.push(`peak ${pain.peak_intensity}/10`);
  if (intParts.length > 0) sections.push(`Intensity: ${intParts.join(", ")}.`);

  // Temporal features
  const temporalParts: string[] = [];
  if (pattern.gradual_onset === true) temporalParts.push("gradual onset");
  if (pattern.sudden_onset === true) temporalParts.push("sudden onset");
  if (pattern.pain_free_intervals === true) temporalParts.push("pain-free intervals present");
  if (pattern.continuous_background_pain === true) temporalParts.push("continuous background pain");
  if (pattern.daily_or_near_daily === true) temporalParts.push("daily or near-daily");
  if (pattern.wakes_from_sleep === true) temporalParts.push("wakes from sleep");
  if (pattern.change_from_baseline === true) temporalParts.push("change from baseline");
  if (pattern.worsening_with_increased_meds === true) temporalParts.push("worsening with increased medication");
  if (pattern.pre_existing_primary_headache === true) temporalParts.push("pre-existing primary headache");
  if (pattern.past_episodic_migraine === true) temporalParts.push("past episodic migraine");
  if (temporalParts.length > 0) sections.push(`Temporal features: ${temporalParts.join(", ")}.`);

  // Pain characteristics
  const painDesc = `${describeQuality(pain)}, ${describeLocation(pain)}`;
  if (painDesc !== "quality not specified, location not specified") {
    sections.push(`Pain characteristics: ${painDesc}.`);
  }
  const behaviourParts: string[] = [];
  if (pain.worse_with_activity === true) behaviourParts.push("worse with activity");
  if (pain.prefers_to_lie_still === true) behaviourParts.push("prefers to lie still");
  if (pain.restless_or_pacing === true) behaviourParts.push("restless/pacing");
  if (pain.continuous_background === true) behaviourParts.push("continuous background");
  if (behaviourParts.length > 0) sections.push(`Pain behaviour: ${behaviourParts.join(", ")}.`);
  const painNotes = str(pain.notes);
  if (painNotes) sections.push(`Pain notes: ${painNotes}`);

  // Associated symptoms
  const symptomDesc = describeSymptoms(symptoms);
  if (symptomDesc !== "none reported") sections.push(`Associated symptoms: ${symptomDesc}.`);
  const symptomsNotes = str(symptoms.associated_symptoms_notes);
  if (symptomsNotes) sections.push(`Symptom notes: ${symptomsNotes}`);

  // Aura
  const auraParts: string[] = [];
  if (aura.visual_positive === true) auraParts.push("visual positive");
  if (aura.visual_negative === true) auraParts.push("visual negative");
  if (aura.sensory_positive === true) auraParts.push("sensory positive");
  if (aura.sensory_negative === true) auraParts.push("sensory negative");
  if (aura.speech_disturbance === true) auraParts.push("speech disturbance");
  if (aura.motor_weakness === true) auraParts.push("motor weakness");
  if (aura.diplopia === true) auraParts.push("diplopia");
  if (aura.vertigo === true) auraParts.push("vertigo");
  if (auraParts.length > 0) {
    let auraLine = `Aura: ${auraParts.join(", ")}`;
    if (num(aura.aura_duration_minutes) !== null) auraLine += `, duration ${aura.aura_duration_minutes} minutes`;
    if (aura.aura_reversible === true) auraLine += ", reversible";
    if (aura.gradual_spread === true) auraLine += ", gradual spread (>=5 min)";
    if (aura.headache_follows_aura === true) auraLine += ", headache follows aura";
    sections.push(`${auraLine}.`);
  }
  const auraNotes = str(aura.notes);
  if (auraNotes) sections.push(`Aura notes: ${auraNotes}`);

  // Autonomic
  if (autonomic.autonomic_features_na === true) {
    sections.push("Autonomic features: N/A.");
  } else {
    const autoParts: string[] = [];
    if (autonomic.lacrimation === true) autoParts.push("lacrimation");
    if (autonomic.conjunctival_injection === true) autoParts.push("conjunctival injection");
    if (autonomic.rhinorrhoea === true) autoParts.push("rhinorrhoea");
    if (autonomic.nasal_congestion === true) autoParts.push("nasal congestion");
    if (autonomic.ptosis === true) autoParts.push("ptosis");
    if (autonomic.miosis === true) autoParts.push("miosis");
    if (autonomic.eyelid_oedema === true) autoParts.push("eyelid oedema");
    if (autonomic.facial_sweating === true) autoParts.push("facial sweating");
    if (autonomic.ear_fullness === true) autoParts.push("ear fullness");
    if (autoParts.length > 0) sections.push(`Autonomic features: ${autoParts.join(", ")}.`);
  }
  const autoNotes = str(autonomic.notes);
  if (autoNotes) sections.push(`Autonomic notes: ${autoNotes}`);

  // Triggers
  const triggerParts: string[] = [];
  if (triggers.alcohol === true) triggerParts.push("alcohol");
  if (triggers.menstruation === true) triggerParts.push("menstruation");
  if (triggers.sleep_deprivation === true) triggerParts.push("sleep deprivation");
  if (triggers.stress === true) triggerParts.push("stress");
  if (triggers.missed_meals === true) triggerParts.push("missed meals");
  if (triggers.exertion === true) triggerParts.push("exertion");
  if (triggers.cough === true) triggerParts.push("cough");
  if (triggers.valsalva === true) triggerParts.push("Valsalva");
  if (triggers.positional_worse_upright === true) triggerParts.push("worse upright");
  if (triggers.positional_worse_supine === true) triggerParts.push("worse supine");
  if (triggerParts.length > 0) sections.push(`Triggers: ${triggerParts.join(", ")}.`);
  const triggersNotes = str(triggers.triggers_notes);
  if (triggersNotes) sections.push(`Trigger notes: ${triggersNotes}`);

  // Functional impact
  const functionalNotes = str(pattern.functional_impact_notes);
  if (functionalNotes) sections.push(`Functional impact: ${functionalNotes}`);

  // Pattern notes
  const patternNotes = str(pattern.notes);
  if (patternNotes) sections.push(`Pattern notes: ${patternNotes}`);

  return sections.join("\n");
}

// ── Section 3: Medication Review ──

function generateMedicationReview(ctx: NoteContext): string {
  const meds = (ctx.assessment.medications || {}) as Record<string, unknown>;
  const parts: string[] = [];

  // Acute medication days/month
  const acuteEntries: string[] = [];
  if (num(meds.triptan_days_per_month) !== null)
    acuteEntries.push(`Triptans: ${meds.triptan_days_per_month} days/month${(meds.triptan_days_per_month as number) >= 10 ? " [ABOVE MOH THRESHOLD]" : ""}`);
  if (num(meds.nsaid_days_per_month) !== null)
    acuteEntries.push(`NSAIDs: ${meds.nsaid_days_per_month} days/month`);
  if (num(meds.paracetamol_days_per_month) !== null)
    acuteEntries.push(`Paracetamol: ${meds.paracetamol_days_per_month} days/month${(meds.paracetamol_days_per_month as number) >= 15 ? " [ABOVE MOH THRESHOLD]" : ""}`);
  if (num(meds.opioid_days_per_month) !== null)
    acuteEntries.push(`Opioids: ${meds.opioid_days_per_month} days/month${(meds.opioid_days_per_month as number) >= 10 ? " [ABOVE MOH THRESHOLD]" : ""}`);
  if (num(meds.simple_analgesic_days_per_month) !== null)
    acuteEntries.push(`Simple analgesics: ${meds.simple_analgesic_days_per_month} days/month${(meds.simple_analgesic_days_per_month as number) >= 15 ? " [ABOVE MOH THRESHOLD]" : ""}`);
  if (num(meds.combination_analgesic_days_per_month) !== null)
    acuteEntries.push(`Combination analgesics: ${meds.combination_analgesic_days_per_month} days/month${(meds.combination_analgesic_days_per_month as number) >= 10 ? " [ABOVE MOH THRESHOLD]" : ""}`);
  if (acuteEntries.length > 0) {
    parts.push("Acute medication use:");
    acuteEntries.forEach((e) => parts.push(`- ${e}`));
  }

  // Treatment response
  const responseParts: string[] = [];
  if (meds.response_to_triptan === true) responseParts.push("responds to triptans");
  if (meds.response_to_oxygen === true) responseParts.push("responds to high-flow oxygen");
  if (meds.response_to_indomethacin === true) responseParts.push("responds to indomethacin");
  if (responseParts.length > 0) parts.push(`Treatment response: ${responseParts.join(", ")}.`);

  // Current preventive
  const preventive = str(meds.current_preventive);
  if (preventive) parts.push(`Current preventive: ${preventive}.`);
  const prevResponse = str(meds.preventive_response);
  if (prevResponse) parts.push(`Preventive response: ${prevResponse}.`);

  // Current medications
  const currentMeds = str(meds.current_medications_text);
  if (currentMeds) parts.push(`Other current medications:\n${currentMeds}`);

  // Structured medication actions table
  interface MedAction {
    drug: string;
    type: string;
    dose: string;
    benefit: string;
    tolerability: string;
    action: string;
  }
  const medActions = Array.isArray(meds.medication_actions)
    ? (meds.medication_actions as MedAction[]).filter((m) => m.drug)
    : [];
  if (medActions.length > 0) {
    parts.push("");
    parts.push("Medication review:");
    for (const m of medActions) {
      const actionLabel = m.action.charAt(0).toUpperCase() + m.action.slice(1);
      const mx = m as unknown as Record<string, unknown>;
      const benefitText = (m.benefit || "not stated") + (mx.benefit_detail ? ` (${mx.benefit_detail})` : "");
      const tolerabilityText = (m.tolerability || "not stated") + (mx.tolerability_detail ? ` (${mx.tolerability_detail})` : "");
      parts.push(`- ${m.drug} (${m.type}): ${m.dose}. Benefit: ${benefitText}. Tolerability: ${tolerabilityText}. Action: ${actionLabel}.`);
    }
  }

  return parts.join("\n");
}

// ── Section 4: Investigation and Results Review ──

function generateInvestigationReview(ctx: NoteContext): string {
  const { diagnosticOutput, assessment } = ctx;
  const workupData = (assessment.workup_data || {}) as Record<string, unknown>;
  const includeSuggestions = workupData.include_workup_suggestions !== false;
  const acceptedWorkupItems =
    typeof workupData.accepted_workup_items === "object" && workupData.accepted_workup_items
      ? (workupData.accepted_workup_items as Record<string, unknown>)
      : {};

  const lines: string[] = [];

  // Investigation results with interpretation
  interface InvResult {
    name: string;
    result: string;
    interpretation: string;
  }
  const results = Array.isArray(workupData.investigation_results)
    ? (workupData.investigation_results as InvResult[]).filter((r) => r.name)
    : [];
  if (results.length > 0) {
    lines.push("Results reviewed:");
    for (const r of results) {
      lines.push(`- ${r.name}: ${r.result || "result pending"}. Interpretation: ${r.interpretation || "not stated"}.`);
    }
  }

  // Suggested workup (accepted items)
  if (includeSuggestions && diagnosticOutput.suggestedWorkup.length > 0) {
    const selectedWorkup = diagnosticOutput.suggestedWorkup.filter(
      (item) => acceptedWorkupItems[item] === true
    );
    if (selectedWorkup.length > 0) {
      if (lines.length > 0) lines.push("");
      lines.push("Planned investigations:");
      selectedWorkup.forEach((item) => lines.push(`- ${item}`));
    }
  }

  // Workup notes
  const workupNotes = str(workupData.workup_notes);
  if (workupNotes) {
    if (lines.length > 0) lines.push("");
    lines.push(workupNotes);
  }

  // Pending investigations
  const pending = str(workupData.pending_investigations);
  if (pending) {
    if (lines.length > 0) lines.push("");
    lines.push(`Pending investigations: ${pending}`);
  }

  return lines.join("\n");
}

// ── Section 5: Clinical Examination ──

function generateClinicalExamination(ctx: NoteContext): string {
  const exam = (ctx.assessment.clinical_examination || {}) as Record<string, unknown>;
  const lines: string[] = [];

  // General Examination
  const generalItems = [
    { key: "anaemia", label: "anaemia" },
    { key: "cyanosis", label: "cyanosis" },
    { key: "lymphadenopathy", label: "lymphadenopathy" },
    { key: "peripheral_oedema", label: "peripheral oedema" },
  ];
  const absentItems: string[] = [];
  const presentItems: string[] = [];
  for (const item of generalItems) {
    const val = exam[item.key];
    if (val === "absent") absentItems.push(item.label);
    else if (val === "present") presentItems.push(item.label);
  }
  if (absentItems.length > 0 || presentItems.length > 0) {
    const parts: string[] = [];
    if (absentItems.length > 0) parts.push(`no ${absentItems.join(", ")}`);
    if (presentItems.length > 0) parts.push(presentItems.join(", ") + " present");
    lines.push(`General examination: ${parts.join("; ")}.`);
  }

  // Observations
  const obsParts: string[] = [];
  if (num(exam.heart_rate_bpm) !== null) obsParts.push(`HR ${exam.heart_rate_bpm} bpm`);
  if (num(exam.bp_systolic) !== null && num(exam.bp_diastolic) !== null)
    obsParts.push(`BP ${exam.bp_systolic}/${exam.bp_diastolic} mmHg`);
  if (num(exam.oxygen_saturation) !== null) obsParts.push(`SpO2 ${exam.oxygen_saturation}%`);
  if (num(exam.temperature) !== null) obsParts.push(`Temp ${exam.temperature}\u00B0C`);
  if (num(exam.weight_kg) !== null) obsParts.push(`Weight ${exam.weight_kg} kg`);
  if (num(exam.height_cm) !== null) obsParts.push(`Height ${exam.height_cm} cm`);
  if (num(exam.bmi) !== null) obsParts.push(`BMI ${exam.bmi}`);
  if (obsParts.length > 0) lines.push(`Observations: ${obsParts.join(", ")}.`);

  // Neurological Examination
  const neuroItems = [
    { statusKey: "gait_status", detailKey: "gait_details", label: "gait" },
    { statusKey: "cranial_nerves_status", detailKey: "cranial_nerves_details", label: "cranial nerves" },
    { statusKey: "fundoscopy_status", detailKey: "fundoscopy_details", label: "fundoscopy" },
    { statusKey: "motor_status", detailKey: "motor_details", label: "motor" },
    { statusKey: "sensory_status", detailKey: "sensory_details", label: "sensory" },
    { statusKey: "cerebellar_status", detailKey: "cerebellar_details", label: "cerebellar" },
    { statusKey: "reflexes_status", detailKey: "reflexes_details", label: "reflexes" },
  ];

  const normalNeuro: string[] = [];
  const abnormalNeuro: string[] = [];
  const notAssessedNeuro: string[] = [];

  for (const item of neuroItems) {
    const status = exam[item.statusKey];
    const detail = str(exam[item.detailKey]);
    if (status === "normal") normalNeuro.push(item.label);
    else if (status === "abnormal") abnormalNeuro.push(detail ? `${item.label} abnormal (${detail})` : `${item.label} abnormal`);
    else if (status === "not_assessed") notAssessedNeuro.push(item.label);
  }

  const gcsTotal = num(exam.gcs_total);
  const neuroParts: string[] = [];
  if (gcsTotal !== null) neuroParts.push(`GCS ${gcsTotal}/15`);
  if (normalNeuro.length > 0) neuroParts.push(`${normalNeuro.join(", ")} normal`);
  if (abnormalNeuro.length > 0) neuroParts.push(abnormalNeuro.join(", "));
  if (notAssessedNeuro.length > 0) neuroParts.push(`not assessed: ${notAssessedNeuro.join(", ")}`);

  if (neuroParts.length > 0) {
    lines.push(`Neurological examination: ${neuroParts.join("; ")}.`);
  }

  const notes = str(exam.notes);
  if (notes) lines.push(notes);

  return lines.join("\n");
}

// ── Section 6: Red Flag Symptoms and Signs ──

function generateRedFlagSymptomsAndSigns(ctx: NoteContext): string {
  const redFlags = (ctx.assessment.red_flags || {}) as Record<string, unknown>;
  const lines: string[] = [];

  // Exhaustively list every red flag as present or absent
  for (const field of RED_FLAG_FIELDS) {
    const present = redFlags[field.name] === true;
    const status = present ? "PRESENT" : "Absent";
    lines.push(`- ${field.label}: ${status}`);
  }

  // Exam-derived red flags
  const exam = (ctx.assessment.clinical_examination || {}) as Record<string, unknown>;
  const gcs = num(exam.gcs_total);
  if (gcs !== null && gcs < 15) {
    lines.push(`- GCS < 15 (${gcs}/15): PRESENT`);
  }
  if (exam.fundoscopy_status === "abnormal") {
    const detail = str(exam.fundoscopy_details);
    lines.push(`- Abnormal fundoscopy${detail ? ` (${detail})` : ""}: PRESENT`);
  }

  // Red flag notes
  const notes = str(redFlags.notes);
  if (notes) {
    lines.push("");
    lines.push(`Red flag notes: ${notes}`);
  }

  return lines.join("\n");
}

// ── Section 7: Assessment, Management and Follow-Up Plan ──

function generateAssessmentManagementFollowUp(ctx: NoteContext): string {
  const workupData = (ctx.assessment.workup_data || {}) as Record<string, unknown>;
  const followUp = (ctx.assessment.follow_up || {}) as Record<string, unknown>;
  const lines: string[] = [];

  // Assessment subsection
  lines.push("Assessment:");
  const summary = str(workupData.assessment_summary);
  const top = ctx.diagnosticOutput.phenotypes[0];
  if (summary) {
    lines.push(summary);
  }
  if (top) {
    lines.push(`Clinical impression: ${top.label} (${top.confidence} confidence).`);
  }
  if (!summary && !top) {
    lines.push("Not yet documented.");
  }

  // Treatment changes subsection
  lines.push("");
  lines.push("Treatment changes:");
  const changes = str(workupData.treatment_changes);
  lines.push(changes || "No changes documented.");

  // Safety counselling subsection
  lines.push("");
  lines.push("Safety counselling:");
  const safety = str(followUp.safety_counselling);
  lines.push(safety || "Not documented.");

  // Follow-up plan subsection
  lines.push("");
  lines.push("Follow-up plan:");
  const fuParts: string[] = [];
  const typeLabels: Record<string, string> = {
    clinic: "Clinic (face-to-face)",
    virtual: "Virtual",
    gp_review: "GP review",
    telephone: "Telephone",
  };
  const fuType = str(followUp.follow_up_type);
  if (fuType) fuParts.push(`Type: ${typeLabels[fuType] || fuType}`);
  const fuDate = str(followUp.follow_up_date);
  if (fuDate) fuParts.push(`Date: ${fuDate}`);
  const fuTime = str(followUp.follow_up_time);
  if (fuTime) fuParts.push(`Time: ${fuTime}`);
  const fuPurpose = str(followUp.follow_up_purpose);
  if (fuPurpose) fuParts.push(`Purpose: ${fuPurpose}`);
  const fuClinician = str(followUp.follow_up_clinician);
  if (fuClinician) fuParts.push(`Responsible clinician: ${fuClinician}`);
  if (fuParts.length > 0) {
    fuParts.forEach((p) => lines.push(p));
  } else {
    lines.push("Not yet scheduled.");
  }

  // Clinician sign-off
  const name = ctx.clinicianName?.trim() || "";
  const credentials = ctx.clinicianCredentials?.trim() || "";
  const designation = ctx.clinicianDesignation?.trim() || "";
  if (name || credentials || designation) {
    lines.push("");
    const identity = [name, credentials].filter(Boolean).join(", ");
    lines.push(identity || "Clinician");
    if (designation) lines.push(designation);
  }

  return lines.join("\n");
}

// ── Main Generator ──

export function generateNote(ctx: NoteContext): string {
  const sections: { heading: string; body: string; hideWhenEmpty?: boolean }[] = [
    { heading: "REVIEW DETAILS AND DIAGNOSIS", body: generateReviewDetailsAndDiagnosis(ctx), hideWhenEmpty: false },
    { heading: "CURRENT HEADACHE BURDEN SEVERITY AND PATTERN", body: generateCurrentHeadacheBurden(ctx), hideWhenEmpty: true },
    { heading: "MEDICATION REVIEW", body: generateMedicationReview(ctx), hideWhenEmpty: true },
    { heading: "INVESTIGATION AND RESULTS REVIEW", body: generateInvestigationReview(ctx), hideWhenEmpty: true },
    { heading: "CLINICAL EXAMINATION", body: generateClinicalExamination(ctx), hideWhenEmpty: true },
    { heading: "RED FLAG SYMPTOMS AND SIGNS", body: generateRedFlagSymptomsAndSigns(ctx), hideWhenEmpty: false },
    { heading: "ASSESSMENT MANAGEMENT AND FOLLOW UP PLAN", body: generateAssessmentManagementFollowUp(ctx), hideWhenEmpty: false },
  ];

  return sections
    .filter((s) => !s.hideWhenEmpty || s.body.trim().length > 0)
    .map((s) => `${s.heading}\n${"=".repeat(s.heading.length)}\n${s.body}`)
    .join("\n\n");
}
