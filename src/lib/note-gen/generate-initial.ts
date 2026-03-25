import type { NoteContext } from "./generate";
import { RED_FLAG_FIELDS } from "@/lib/schemas/red-flags";

// ── Shared utilities ──

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

function str(val: unknown): string {
  return typeof val === "string" ? val.trim() : "";
}

function num(val: unknown): number | null {
  return typeof val === "number" ? val : null;
}

function pluralUnit(value: number, unit: string): string {
  return value === 1 ? `${value} ${unit}` : `${value} ${unit}s`;
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
  return parts.length > 0 ? parts.join(", ") : "not specified";
}

function describeQuality(pain: Record<string, unknown>): string {
  const parts: string[] = [];
  if (pain.pulsating === true) parts.push("pulsating");
  if (pain.pressing === true) parts.push("pressing");
  if (pain.tightening === true) parts.push("tightening");
  if (pain.stabbing === true) parts.push("stabbing");
  if (pain.burning === true) parts.push("burning");
  if (pain.boring === true) parts.push("boring");
  return parts.length > 0 ? parts.join(", ") : "not specified";
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

// ── Section 1: Patient Details ──

function generatePatientDetails(ctx: NoteContext): string {
  const lines: string[] = [];
  lines.push(`Patient name: ${ctx.patientName}`);
  if (ctx.patientId) lines.push(`NHS / Hospital no.: ${ctx.patientId}`);
  if (ctx.dateOfBirth) lines.push(`Date of birth: ${formatDateOnly(ctx.dateOfBirth)}`);
  if (ctx.age !== undefined) lines.push(`Age: ${ctx.age} years`);
  if (ctx.sex) lines.push(`Sex: ${ctx.sex}`);
  if (ctx.consultationDate) lines.push(`Clinic date: ${formatConsultationDate(ctx.consultationDate)}`);
  if (ctx.clinicianName) lines.push(`Consultant / Clinician: ${ctx.clinicianName}`);
  if (ctx.assessmentReference) lines.push(`Assessment reference: ${ctx.assessmentReference}`);
  return lines.join("\n");
}

// ── Section 2: Working Diagnosis ──

function generateWorkingDiagnosis(ctx: NoteContext): string {
  const phenotypes = ctx.diagnosticOutput.phenotypes;
  if (phenotypes.length === 0) return "Insufficient data for diagnostic classification.";

  const lines: string[] = [];
  const top = phenotypes[0];
  lines.push(`Primary working diagnosis: ${top.label} (${top.confidence} confidence, score ${top.score}%).`);

  if (top.rationale.length > 0) {
    lines.push(`Supporting criteria: ${top.rationale.join("; ")}.`);
  }
  if (top.contradictions.length > 0) {
    lines.push(`Against: ${top.contradictions.join("; ")}.`);
  }

  if (phenotypes.length > 1) {
    lines.push("");
    lines.push("Differential diagnoses:");
    for (let i = 1; i < phenotypes.length; i++) {
      const p = phenotypes[i];
      let line = `${i + 1}. ${p.label} (${p.confidence} confidence, score ${p.score}%)`;
      if (p.rationale.length > 0) line += ` — ${p.rationale.join("; ")}`;
      lines.push(line);
    }
  }

  return lines.join("\n");
}

// ── Section 3: Past Medical History and Relevant Background ──

function generatePMHAndBackground(ctx: NoteContext): string {
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
  const notes = str(pmh.notes);

  const lines: string[] = [];
  lines.push("Past medical history:");
  if (conditions.length > 0) {
    lines.push(conditions.join(", "));
  } else {
    lines.push("No significant past medical history recorded.");
  }

  if (notes) {
    lines.push("");
    lines.push("Relevant background / additional notes:");
    lines.push(notes);
  }

  return lines.join("\n");
}

// ── Section 4: Current Medication and Allergy Status ──

function generateMedicationAndAllergy(ctx: NoteContext): string {
  const meds = (ctx.assessment.medications || {}) as Record<string, unknown>;
  const parts: string[] = [];

  // Allergy status
  const allergyStatus = str(meds.allergy_status);
  const allergyDetails = str(meds.allergy_details);
  if (allergyStatus === "nkda" || (!allergyStatus && !allergyDetails)) {
    parts.push("Allergies: No known drug allergies recorded.");
  } else if (allergyStatus || allergyDetails) {
    parts.push(`Allergies: ${allergyDetails || allergyStatus}.`);
  }

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
    for (const m of medActions) {
      const overuseRisk = m.type === "acute" ? "Monitor" : "N/A";
      parts.push(`- ${m.drug} (${m.type}): ${m.dose || "dose not specified"}. Benefit/tolerance: ${m.benefit || "not stated"} / ${m.tolerability || "not stated"}. Overuse risk: ${overuseRisk}.`);
    }
  }

  // Acute medication days
  const acuteEntries: string[] = [];
  if (num(meds.triptan_days_per_month) !== null)
    acuteEntries.push(`Triptans ${meds.triptan_days_per_month} days/month${(meds.triptan_days_per_month as number) >= 10 ? " [overuse risk]" : ""}`);
  if (num(meds.nsaid_days_per_month) !== null)
    acuteEntries.push(`NSAIDs ${meds.nsaid_days_per_month} days/month${(meds.nsaid_days_per_month as number) >= 15 ? " [overuse risk]" : ""}`);
  if (num(meds.paracetamol_days_per_month) !== null)
    acuteEntries.push(`Paracetamol ${meds.paracetamol_days_per_month} days/month${(meds.paracetamol_days_per_month as number) >= 15 ? " [overuse risk]" : ""}`);
  if (num(meds.opioid_days_per_month) !== null)
    acuteEntries.push(`Opioids ${meds.opioid_days_per_month} days/month${(meds.opioid_days_per_month as number) >= 10 ? " [overuse risk]" : ""}`);
  if (num(meds.simple_analgesic_days_per_month) !== null)
    acuteEntries.push(`Simple analgesics ${meds.simple_analgesic_days_per_month} days/month${(meds.simple_analgesic_days_per_month as number) >= 15 ? " [overuse risk]" : ""}`);
  if (num(meds.combination_analgesic_days_per_month) !== null)
    acuteEntries.push(`Combination analgesics ${meds.combination_analgesic_days_per_month} days/month${(meds.combination_analgesic_days_per_month as number) >= 10 ? " [overuse risk]" : ""}`);
  if (acuteEntries.length > 0) {
    if (parts.length > 0) parts.push("");
    parts.push("Acute medication use:");
    acuteEntries.forEach((e) => parts.push(`- ${e}`));
  }

  // Current preventive
  const preventive = str(meds.current_preventive);
  if (preventive) parts.push(`Current preventive: ${preventive}.`);
  const prevResponse = str(meds.preventive_response);
  if (prevResponse) parts.push(`Preventive response: ${prevResponse}.`);

  // Treatment response
  const responseParts: string[] = [];
  if (meds.response_to_triptan === true) responseParts.push("responds to triptans");
  if (meds.response_to_oxygen === true) responseParts.push("responds to high-flow oxygen");
  if (meds.response_to_indomethacin === true) responseParts.push("responds to indomethacin");
  if (responseParts.length > 0) parts.push(`Treatment response: ${responseParts.join(", ")}.`);

  // Current medications text
  const currentMeds = str(meds.current_medications_text);
  if (currentMeds) {
    if (parts.length > 0) parts.push("");
    parts.push(`Other current medications:\n${currentMeds}`);
  }

  return parts.join("\n");
}

// ── Section 5: Presenting Symptoms and Clinical Analysis ──

function generatePresentingSymptoms(ctx: NoteContext): string {
  const { assessment } = ctx;
  const pattern = (assessment.pattern || {}) as Record<string, unknown>;
  const pain = (assessment.pain || {}) as Record<string, unknown>;
  const symptoms = (assessment.symptoms || {}) as Record<string, unknown>;
  const aura = (assessment.aura || {}) as Record<string, unknown>;
  const autonomic = (assessment.autonomic || {}) as Record<string, unknown>;
  const triggers = (assessment.triggers || {}) as Record<string, unknown>;

  const lines: string[] = [];

  // Opening narrative
  const demoParts: string[] = [ctx.patientName];
  if (ctx.age) demoParts.push(`${ctx.age}-year-old`);
  if (ctx.sex) demoParts.push(ctx.sex);
  lines.push(`${demoParts.join(", ")} presenting with headaches.`);

  // Onset and temporal profile
  const onsetParts: string[] = [];
  const firstOnsetAge = num(pattern.first_headache_age);
  if (firstOnsetAge !== null) {
    if (ctx.age !== undefined && firstOnsetAge > ctx.age) {
      onsetParts.push(`first onset at age ${firstOnsetAge} [query: exceeds current age ${ctx.age}]`);
    } else {
      onsetParts.push(`first onset at age ${firstOnsetAge}`);
    }
  }
  if (str(pattern.current_pattern_start))
    onsetParts.push(`current pattern since ${pattern.current_pattern_start}`);
  if (num(pattern.pattern_duration_months) !== null)
    onsetParts.push(`over ${pattern.pattern_duration_months} months`);
  if (pattern.gradual_onset === true) onsetParts.push("gradual onset");
  if (pattern.sudden_onset === true) onsetParts.push("sudden onset");
  if (onsetParts.length > 0) lines.push(`Onset: ${onsetParts.join(", ")}.`);

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
  if (freqParts.length > 0) lines.push(`Frequency: ${freqParts.join(", ")}.`);

  // Duration
  const durParts: string[] = [];
  if (num(pattern.duration_hours) !== null) durParts.push(pluralUnit(pattern.duration_hours as number, "hour"));
  if (num(pattern.duration_minutes) !== null) durParts.push(pluralUnit(pattern.duration_minutes as number, "minute"));
  if (durParts.length > 0) lines.push(`Typical duration: ${durParts.join(", ")}.`);

  // Location, severity, quality
  lines.push(`Location: ${describeLocation(pain)}.`);
  lines.push(`Quality: ${describeQuality(pain)}.`);
  const intParts: string[] = [];
  if (num(pain.avg_intensity) !== null) intParts.push(`average ${pain.avg_intensity}/10`);
  if (num(pain.peak_intensity) !== null) intParts.push(`peak ${pain.peak_intensity}/10`);
  if (intParts.length > 0) lines.push(`Severity: ${intParts.join(", ")}.`);

  // Associated symptoms
  lines.push(`Associated symptoms: ${describeSymptoms(symptoms)}.`);
  const symptomsNotes = str(symptoms.associated_symptoms_notes);
  if (symptomsNotes) lines.push(symptomsNotes);

  // Aura
  const auraParts: string[] = [];
  if (aura.visual_positive === true) auraParts.push("visual positive (flashing lights, zigzag)");
  if (aura.visual_negative === true) auraParts.push("visual negative (blind spots)");
  if (aura.sensory_positive === true) auraParts.push("sensory positive (tingling)");
  if (aura.sensory_negative === true) auraParts.push("sensory negative (numbness)");
  if (aura.speech_disturbance === true) auraParts.push("speech disturbance");
  if (aura.motor_weakness === true) auraParts.push("motor weakness");
  if (aura.diplopia === true) auraParts.push("diplopia");
  if (aura.vertigo === true) auraParts.push("vertigo");
  if (auraParts.length > 0) {
    let auraLine = `Aura: ${auraParts.join(", ")}`;
    if (num(aura.aura_duration_minutes) !== null) auraLine += `. Duration approximately ${aura.aura_duration_minutes} minutes`;
    if (aura.aura_reversible === true) auraLine += ", reversible";
    if (aura.gradual_spread === true) auraLine += ", gradual spread (>=5 min)";
    if (aura.headache_follows_aura === true) auraLine += ", headache follows aura";
    lines.push(`${auraLine}.`);
  }
  const auraNotes = str(aura.notes);
  if (auraNotes) lines.push(`Aura notes: ${auraNotes}`);

  // Cranial autonomic symptoms
  if (autonomic.autonomic_features_na === true) {
    lines.push("Cranial autonomic symptoms: N/A.");
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
    if (autoParts.length > 0) lines.push(`Cranial autonomic symptoms: ${autoParts.join(", ")}.`);
  }
  const autoNotes = str(autonomic.notes);
  if (autoNotes) lines.push(`Autonomic notes: ${autoNotes}`);

  // Pain behaviour
  const behaviourParts: string[] = [];
  if (pain.worse_with_activity === true) behaviourParts.push("aggravated by routine physical activity");
  if (pain.prefers_to_lie_still === true) behaviourParts.push("prefers to lie still");
  if (pain.restless_or_pacing === true) behaviourParts.push("restless/pacing during attacks");
  if (pain.continuous_background === true) behaviourParts.push("continuous background pain");
  if (behaviourParts.length > 0) lines.push(`Behaviour: ${behaviourParts.join(", ")}.`);
  const painNotes = str(pain.notes);
  if (painNotes) lines.push(`Pain notes: ${painNotes}`);

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
  if (triggerParts.length > 0) lines.push(`Triggers: ${triggerParts.join(", ")}.`);
  const triggersNotes = str(triggers.triggers_notes);
  if (triggersNotes) lines.push(`Trigger notes: ${triggersNotes}`);

  // Temporal patterns
  const temporalParts: string[] = [];
  if (pattern.pain_free_intervals === true) temporalParts.push("pain-free intervals");
  if (pattern.daily_or_near_daily === true) temporalParts.push("daily or near-daily");
  if (pattern.wakes_from_sleep === true) temporalParts.push("wakes from sleep");
  if (pattern.change_from_baseline === true) temporalParts.push("change from baseline");
  if (pattern.worsening_with_increased_meds === true) temporalParts.push("worsening with increased medication");
  if (pattern.pre_existing_primary_headache === true) temporalParts.push("pre-existing primary headache");
  if (pattern.past_episodic_migraine === true) temporalParts.push("past episodic migraine");
  if (temporalParts.length > 0) lines.push(`Additional temporal features: ${temporalParts.join(", ")}.`);

  // Functional impact
  const functionalNotes = str(pattern.functional_impact_notes);
  if (functionalNotes) lines.push(`Disability and functional impact: ${functionalNotes}`);

  // Pattern notes
  const patternNotes = str(pattern.notes);
  if (patternNotes) lines.push(`Pattern notes: ${patternNotes}`);

  return lines.join("\n");
}

// ── Section 6: Clinical Examination Findings ──

function generateClinicalExam(ctx: NoteContext): string {
  const exam = (ctx.assessment.clinical_examination || {}) as Record<string, unknown>;
  const lines: string[] = [];

  // General / observations
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

  const obsParts: string[] = [];
  if (num(exam.heart_rate_bpm) !== null) obsParts.push(`HR ${exam.heart_rate_bpm} bpm`);
  if (num(exam.bp_systolic) !== null && num(exam.bp_diastolic) !== null)
    obsParts.push(`BP ${exam.bp_systolic}/${exam.bp_diastolic} mmHg`);
  if (num(exam.oxygen_saturation) !== null) obsParts.push(`SpO2 ${exam.oxygen_saturation}%`);
  if (num(exam.temperature) !== null) obsParts.push(`Temp ${exam.temperature}\u00B0C`);
  if (num(exam.weight_kg) !== null) obsParts.push(`Weight ${exam.weight_kg} kg`);
  if (num(exam.height_cm) !== null) obsParts.push(`Height ${exam.height_cm} cm`);
  if (num(exam.bmi) !== null) obsParts.push(`BMI ${exam.bmi}`);

  const generalLine: string[] = [];
  if (obsParts.length > 0) generalLine.push(obsParts.join(", "));
  if (absentItems.length > 0) generalLine.push(`no ${absentItems.join(", ")}`);
  if (presentItems.length > 0) generalLine.push(presentItems.join(", ") + " present");
  if (generalLine.length > 0) lines.push(`General / observations: ${generalLine.join("; ")}.`);

  // Neurological / cranial
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
  if (neuroParts.length > 0) lines.push(`Neurological / cranial: ${neuroParts.join("; ")}.`);

  // Exam notes
  const notes = str(exam.notes);
  if (notes) lines.push(`Additional findings: ${notes}`);

  return lines.join("\n");
}

// ── Section 7: Investigations Ordered / Pending ──

function generateInvestigationsOrdered(ctx: NoteContext): string {
  const { diagnosticOutput, assessment } = ctx;
  const workupData = (assessment.workup_data || {}) as Record<string, unknown>;
  const includeSuggestions = workupData.include_workup_suggestions !== false;
  const acceptedWorkupItems =
    typeof workupData.accepted_workup_items === "object" && workupData.accepted_workup_items
      ? (workupData.accepted_workup_items as Record<string, unknown>)
      : {};

  const lines: string[] = [];

  if (includeSuggestions && diagnosticOutput.suggestedWorkup.length > 0) {
    const selectedWorkup = diagnosticOutput.suggestedWorkup.filter(
      (item) => acceptedWorkupItems[item] === true
    );
    if (selectedWorkup.length > 0) {
      selectedWorkup.forEach((item) => lines.push(`- ${item}`));
    }
  }

  const workupNotes = str(workupData.workup_notes);
  if (workupNotes) {
    if (lines.length > 0) lines.push("");
    lines.push(workupNotes);
  }

  const pending = str(workupData.pending_investigations);
  if (pending) {
    if (lines.length > 0) lines.push("");
    lines.push(`Pending: ${pending}`);
  }

  return lines.join("\n");
}

// ── Section 8: Results Review ──

function generateResultsReview(ctx: NoteContext): string {
  const workupData = (ctx.assessment.workup_data || {}) as Record<string, unknown>;

  interface InvResult {
    name: string;
    result: string;
    interpretation: string;
  }
  const results = Array.isArray(workupData.investigation_results)
    ? (workupData.investigation_results as InvResult[]).filter((r) => r.name)
    : [];

  if (results.length === 0) return "No results available for review at this stage.";

  const lines: string[] = [];
  for (const r of results) {
    lines.push(`- ${r.name}: ${r.result || "pending"}. Interpretation: ${r.interpretation || "not yet stated"}.`);
  }
  return lines.join("\n");
}

// ── Section 9: Red Flag Symptoms and Signs ──

function generateRedFlags(ctx: NoteContext): string {
  const redFlags = (ctx.assessment.red_flags || {}) as Record<string, unknown>;
  const lines: string[] = [];

  const presentFlags: string[] = [];

  for (const field of RED_FLAG_FIELDS) {
    if (redFlags[field.name] === true) {
      presentFlags.push(field.label);
    }
  }

  // Exam-derived red flags
  const exam = (ctx.assessment.clinical_examination || {}) as Record<string, unknown>;
  const gcs = num(exam.gcs_total);
  if (gcs !== null && gcs < 15) presentFlags.push(`GCS < 15 (${gcs}/15)`);
  if (exam.fundoscopy_status === "abnormal") {
    const detail = str(exam.fundoscopy_details);
    presentFlags.push(`Abnormal fundoscopy${detail ? ` (${detail})` : ""}`);
  }

  if (presentFlags.length > 0) {
    presentFlags.forEach((f) => lines.push(`- ${f}`));
  } else {
    lines.push("No current red flags identified on today's review.");
  }

  const notes = str(redFlags.notes);
  if (notes) {
    lines.push("");
    lines.push(`Red flag notes: ${notes}`);
  }

  return lines.join("\n");
}

// ── Section 10: Management Plan and Treatment ──

function generateManagementPlan(ctx: NoteContext): string {
  const workupData = (ctx.assessment.workup_data || {}) as Record<string, unknown>;
  const followUp = (ctx.assessment.follow_up || {}) as Record<string, unknown>;
  const lines: string[] = [];

  // Assessment summary — fall back to working diagnosis to prevent disconnected output
  const summary = str(workupData.assessment_summary);
  if (summary) {
    lines.push(summary);
  } else {
    const phenotypes = ctx.diagnosticOutput.phenotypes;
    if (phenotypes.length > 0) {
      const top = phenotypes[0];
      lines.push(`Working impression: ${top.label} (${top.confidence} confidence). Management plan based on this diagnosis.`);
    }
  }

  // Key diagnostic question
  const keyQ = str(workupData.key_diagnostic_question);
  if (keyQ) lines.push(`Key question addressed: ${keyQ}`);

  // Treatment changes
  const changes = str(workupData.treatment_changes);
  if (changes) {
    lines.push("");
    lines.push("Treatment plan:");
    lines.push(changes);
  }

  // Safety counselling
  const safety = str(followUp.safety_counselling);
  if (safety) {
    lines.push("");
    lines.push("Safety-netting advice:");
    lines.push(safety);
  }

  return lines.join("\n");
}

// ── Section 11: Follow-Up Plan ──

function generateFollowUpPlan(ctx: NoteContext): string {
  const followUp = (ctx.assessment.follow_up || {}) as Record<string, unknown>;
  const lines: string[] = [];

  const typeLabels: Record<string, string> = {
    clinic: "Clinic (face-to-face)",
    virtual: "Virtual",
    gp_review: "GP review",
    telephone: "Telephone",
  };

  const fuType = str(followUp.follow_up_type);
  const fuDate = str(followUp.follow_up_date);
  const fuTime = str(followUp.follow_up_time);
  const fuPurpose = str(followUp.follow_up_purpose);
  const fuClinician = str(followUp.follow_up_clinician);

  if (fuType) lines.push(`Follow-up type: ${typeLabels[fuType] || fuType}`);
  if (fuDate) lines.push(`Date: ${fuDate}`);
  if (fuTime) lines.push(`Time: ${fuTime}`);
  if (fuPurpose) lines.push(`Purpose: ${fuPurpose}`);
  if (fuClinician) lines.push(`Responsible clinician / service: ${fuClinician}`);

  if (lines.length === 0) lines.push("Follow-up not yet scheduled.");

  return lines.join("\n");
}

// ── Section 12: Clinician Sign-off ──

function generateClinicianSignOff(ctx: NoteContext): string {
  const name = ctx.clinicianName?.trim() || "";
  const credentials = ctx.clinicianCredentials?.trim() || "";
  const designation = ctx.clinicianDesignation?.trim() || "";

  if (!name && !credentials && !designation) return "";

  const lines: string[] = [];
  lines.push("Kind regards,");
  const identity = [name, credentials].filter(Boolean).join(", ");
  lines.push(identity || "Clinician");
  if (designation) lines.push(designation);
  return lines.join("\n");
}

// ── Main Generator ──

export function generateInitialClinicLetter(ctx: NoteContext): string {
  const sections: { heading: string; body: string; hideWhenEmpty?: boolean }[] = [
    { heading: "PATIENT DETAILS", body: generatePatientDetails(ctx), hideWhenEmpty: false },
    { heading: "WORKING DIAGNOSIS", body: generateWorkingDiagnosis(ctx), hideWhenEmpty: false },
    { heading: "PAST MEDICAL HISTORY AND RELEVANT BACKGROUND", body: generatePMHAndBackground(ctx), hideWhenEmpty: false },
    { heading: "CURRENT MEDICATION AND ALLERGY STATUS", body: generateMedicationAndAllergy(ctx), hideWhenEmpty: false },
    { heading: "PRESENTING SYMPTOMS AND CLINICAL ANALYSIS", body: generatePresentingSymptoms(ctx), hideWhenEmpty: false },
    { heading: "RED FLAG SYMPTOMS AND SIGNS", body: generateRedFlags(ctx), hideWhenEmpty: false },
    { heading: "CLINICAL EXAMINATION FINDINGS", body: generateClinicalExam(ctx), hideWhenEmpty: true },
    { heading: "INVESTIGATIONS ORDERED", body: generateInvestigationsOrdered(ctx), hideWhenEmpty: true },
    { heading: "RESULTS REVIEW", body: generateResultsReview(ctx), hideWhenEmpty: false },
    { heading: "MANAGEMENT PLAN AND TREATMENT", body: generateManagementPlan(ctx), hideWhenEmpty: true },
    { heading: "FOLLOW UP PLAN", body: generateFollowUpPlan(ctx), hideWhenEmpty: false },
    { heading: "CLINICIAN SIGN OFF", body: generateClinicianSignOff(ctx), hideWhenEmpty: true },
  ];

  const header = "SPECIALIST HEADACHE CLINIC LETTER";

  return `${header}\n${"=".repeat(header.length)}\n\n` + sections
    .filter((s) => !s.hideWhenEmpty || s.body.trim().length > 0)
    .map((s) => `${s.heading}\n${"-".repeat(s.heading.length)}\n${s.body}`)
    .join("\n\n");
}
