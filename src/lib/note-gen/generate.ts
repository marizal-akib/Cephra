import type { ClinicianAssessment } from "@/types";
import type { DiagnosticOutput } from "@/lib/engine/types";

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
  if (pain.frontal === true) parts.push("frontal");
  if (pain.temporal === true) parts.push("temporal");
  if (pain.orbital === true) parts.push("orbital");
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
  if (symptoms.dizziness === true) parts.push("dizziness");
  if (symptoms.neck_pain === true) parts.push("neck pain");
  return parts.length > 0 ? parts.join(", ") : "none reported";
}

function generateHeader(ctx: NoteContext): string {
  const lines: string[] = [];
  lines.push("Cephra");
  lines.push("Clinical Note / Consultation Summary");
  if (ctx.consultationDate) {
    lines.push(`Consultation date: ${formatConsultationDate(ctx.consultationDate)}`);
  }
  if (ctx.assessmentReference) {
    lines.push(`Assessment reference: ${ctx.assessmentReference}`);
  }
  return lines.join("\n");
}

function generatePatientDetails(ctx: NoteContext): string {
  const lines: string[] = [];
  lines.push(`Patient name: ${ctx.patientName}`);
  if (ctx.patientId) lines.push(`Patient ID: ${ctx.patientId}`);
  if (ctx.dateOfBirth) lines.push(`Date of birth: ${formatDateOnly(ctx.dateOfBirth)}`);
  if (ctx.age !== undefined) lines.push(`Age: ${ctx.age} years`);
  if (ctx.sex) lines.push(`Sex: ${ctx.sex}`);
  return lines.join("\n");
}

function generateConsultationOverview(ctx: NoteContext): string {
  const lines: string[] = [];
  if (ctx.clinicianName) lines.push(`Clinician: ${ctx.clinicianName}`);
  if (ctx.consultationDate) {
    lines.push(`Encounter date and time: ${formatConsultationDate(ctx.consultationDate)}`);
  }
  if (ctx.assessmentReference) {
    lines.push(`Assessment reference: ${ctx.assessmentReference}`);
  }
  return lines.join("\n");
}

function generatePresentingHeadacheSummary(ctx: NoteContext): string {
  const { assessment } = ctx;
  const pattern = (assessment.pattern || {}) as Record<string, unknown>;
  const pain = (assessment.pain || {}) as Record<string, unknown>;
  const symptoms = (assessment.symptoms || {}) as Record<string, unknown>;
  const aura = (assessment.aura || {}) as Record<string, unknown>;

  const lines: string[] = [];
  const demoParts: string[] = [ctx.patientName];
  if (ctx.age) demoParts.push(`${ctx.age}-year-old`);
  if (ctx.sex) demoParts.push(ctx.sex);
  lines.push(`${demoParts.join(", ")} presenting with headaches.`);

  const patternParts: string[] = [];
  if (pattern.headache_days_per_month)
    patternParts.push(`approximately ${pattern.headache_days_per_month} days per month`);
  if (pattern.duration_hours)
    patternParts.push(`typical duration ${pattern.duration_hours} hours`);
  if (pattern.duration_minutes)
    patternParts.push(`attack duration ${pattern.duration_minutes} minutes`);
  if (pattern.pattern_duration_months)
    patternParts.push(`over the past ${pattern.pattern_duration_months} months`);
  if (patternParts.length > 0)
    lines.push(`Headaches ${patternParts.join(", ")}.`);

  lines.push(
    `Pain is described as ${describeQuality(pain)}, ${describeLocation(pain)}.`
  );
  if (pain.peak_intensity)
    lines.push(`Peak intensity rated ${pain.peak_intensity}/10.`);
  if (pain.worse_with_activity) lines.push("Aggravated by routine physical activity.");
  if (pain.restless_or_pacing) lines.push("Patient is restless/pacing during attacks.");

  lines.push(`Associated symptoms include ${describeSymptoms(symptoms)}.`);

  const auraParts: string[] = [];
  if (aura.visual_positive === true) auraParts.push("positive visual symptoms");
  if (aura.sensory_positive === true) auraParts.push("positive sensory symptoms");
  if (aura.speech_disturbance === true) auraParts.push("speech disturbance");
  if (auraParts.length > 0) {
    lines.push(`Aura features: ${auraParts.join(", ")}.`);
    if (aura.aura_duration_minutes)
      lines.push(`Aura duration approximately ${aura.aura_duration_minutes} minutes.`);
  }

  return lines.join(" ");
}

function generatePastMedicalHistorySection(ctx: NoteContext): string {
  const pastMedicalHistory = (ctx.assessment.past_medical_history ||
    {}) as Record<string, unknown>;
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
  const commonConditions = Array.isArray(pastMedicalHistory.common_conditions)
    ? (pastMedicalHistory.common_conditions as string[])
        .filter((item) => typeof item === "string" && item.length > 0)
        .map((item) => conditionLabels[item] || item)
    : [];
  const notes =
    typeof pastMedicalHistory.notes === "string"
      ? pastMedicalHistory.notes.trim()
      : "";

  const lines: string[] = [];
  if (commonConditions.length > 0) {
    lines.push(commonConditions.join(", "));
  }
  if (notes) {
    lines.push(notes);
  }
  return lines.join("\n");
}

function generateRedFlagSummary(ctx: NoteContext): string {
  const { diagnosticOutput } = ctx;
  if (diagnosticOutput.redFlagResult.flagged) {
    return diagnosticOutput.redFlagResult.flags
      .map((f) => f.description)
      .join("; ");
  }
  return "No red flags identified.";
}

function generateHeadacheAssessmentFindings(ctx: NoteContext): string {
  const { assessment } = ctx;
  const pattern = (assessment.pattern || {}) as Record<string, unknown>;
  const pain = (assessment.pain || {}) as Record<string, unknown>;
  const symptoms = (assessment.symptoms || {}) as Record<string, unknown>;
  const aura = (assessment.aura || {}) as Record<string, unknown>;
  const autonomic = (assessment.autonomic || {}) as Record<string, unknown>;
  const triggers = (assessment.triggers || {}) as Record<string, unknown>;

  const sections: string[] = [];

  const patternParts: string[] = [];
  if (pattern.headache_days_per_month)
    patternParts.push(`${pattern.headache_days_per_month} days/month`);
  if (pattern.duration_hours) patternParts.push(`duration ${pattern.duration_hours}h`);
  if (pattern.duration_minutes) patternParts.push(`${pattern.duration_minutes} min attacks`);
  if (pattern.pattern_duration_months)
    patternParts.push(`over ${pattern.pattern_duration_months} months`);
  if (patternParts.length > 0) {
    sections.push(`Pattern: ${patternParts.join(", ")}.`);
  }

  const painDesc = `${describeQuality(pain)}, ${describeLocation(pain)}`;
  if (painDesc !== "quality not specified, location not specified") {
    sections.push(`Pain: ${painDesc}.`);
    if (pain.peak_intensity)
      sections.push(`Peak intensity: ${pain.peak_intensity}/10.`);
  }

  const symptomDesc = describeSymptoms(symptoms);
  if (symptomDesc !== "none reported") {
    sections.push(`Associated symptoms: ${symptomDesc}.`);
  }
  const symptomsNotes =
    typeof symptoms.associated_symptoms_notes === "string"
      ? symptoms.associated_symptoms_notes.trim()
      : "";
  if (symptomsNotes) {
    sections.push(`Associated symptoms notes: ${symptomsNotes}`);
  }

  const auraParts: string[] = [];
  if (aura.visual_positive === true) auraParts.push("visual");
  if (aura.sensory_positive === true) auraParts.push("sensory");
  if (aura.speech_disturbance === true) auraParts.push("speech");
  if (auraParts.length > 0) {
    sections.push(`Aura: ${auraParts.join(", ")}.`);
    if (aura.aura_duration_minutes)
      sections.push(`Aura duration: ${aura.aura_duration_minutes} minutes.`);
  }

  const autoParts: string[] = [];
  if (autonomic.lacrimation === true) autoParts.push("lacrimation");
  if (autonomic.conjunctival_injection === true) autoParts.push("conjunctival injection");
  if (autonomic.ptosis === true) autoParts.push("ptosis");
  if (autonomic.miosis === true) autoParts.push("miosis");
  if (autonomic.autonomic_features_na === true) autoParts.push("N/A");
  if (autoParts.length > 0) {
    sections.push(`Autonomic features: ${autoParts.join(", ")}.`);
  }

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
  if (triggerParts.length > 0) {
    sections.push(`Triggers: ${triggerParts.join(", ")}.`);
  }
  const triggersNotes =
    typeof triggers.triggers_notes === "string" ? triggers.triggers_notes.trim() : "";
  if (triggersNotes) {
    sections.push(`Triggers / positional notes: ${triggersNotes}`);
  }

  return sections.join("\n");
}

function generateMedicationSection(ctx: NoteContext): string {
  const meds = (ctx.assessment.medications || {}) as Record<string, unknown>;
  const parts: string[] = [];

  const acuteParts: string[] = [];
  if (meds.triptan_days_per_month)
    acuteParts.push(`triptans ${meds.triptan_days_per_month} days/month`);
  if (meds.nsaid_days_per_month)
    acuteParts.push(`NSAIDs ${meds.nsaid_days_per_month} days/month`);
  if (meds.paracetamol_days_per_month)
    acuteParts.push(`paracetamol ${meds.paracetamol_days_per_month} days/month`);
  if (meds.opioid_days_per_month)
    acuteParts.push(`opioids ${meds.opioid_days_per_month} days/month`);
  if (acuteParts.length > 0) {
    parts.push(`Acute medication use: ${acuteParts.join(", ")}.`);
  }
  if (meds.current_preventive) {
    parts.push(`Current preventive: ${meds.current_preventive}.`);
  }
  const currentMeds =
    typeof meds.current_medications_text === "string"
      ? meds.current_medications_text.trim()
      : "";
  if (currentMeds) {
    parts.push(`Current medications: ${currentMeds}`);
  }
  return parts.join("\n");
}

function generateClinicalExaminationSection(ctx: NoteContext): string {
  const examination = (ctx.assessment.clinical_examination ||
    {}) as Record<string, unknown>;
  const examItems = [
    { key: "general_status", noteKey: "general_status_note", label: "General status", normalValues: ["well"], display: { well: "well", unwell: "unwell" } as Record<string, string> },
    { key: "orientation", noteKey: "orientation_note", label: "Orientation", normalValues: ["normal"], display: { normal: "normal", abnormal: "abnormal" } as Record<string, string> },
    { key: "cranial_nerves", noteKey: "cranial_nerves_note", label: "Cranial nerves", normalValues: ["normal"], display: { normal: "normal", abnormal: "abnormal" } as Record<string, string> },
    { key: "focal_neurology", noteKey: "focal_neurology_note", label: "Focal neurology", normalValues: ["absent"], display: { absent: "absent", present: "present" } as Record<string, string> },
    { key: "motor_sensory", noteKey: "motor_sensory_note", label: "Motor and sensory", normalValues: ["normal"], display: { normal: "normal", abnormal: "abnormal" } as Record<string, string> },
    { key: "gait_cerebellar", noteKey: "gait_cerebellar_note", label: "Gait/cerebellar", normalValues: ["normal"], display: { normal: "normal", abnormal: "abnormal" } as Record<string, string> },
    { key: "meningeal_signs", noteKey: "meningeal_signs_note", label: "Meningeal signs", normalValues: ["absent"], display: { absent: "absent", present: "present" } as Record<string, string> },
    { key: "fundoscopy", noteKey: "fundoscopy_note", label: "Fundoscopy", normalValues: ["normal"], display: { normal: "normal", papilledema: "papilledema present", abnormal_other: "abnormal" } as Record<string, string> },
  ];

  const normalStatements: string[] = [];
  const abnormalStatements: string[] = [];
  const notAssessed: string[] = [];

  for (const item of examItems) {
    const value = typeof examination[item.key] === "string" ? (examination[item.key] as string) : "";
    if (!value) continue;
    if (value === "not_done") {
      notAssessed.push(item.label.toLowerCase());
      continue;
    }
    const quickNote = typeof examination[item.noteKey] === "string" ? (examination[item.noteKey] as string).trim() : "";
    const valueLabel = item.display[value] || value.replaceAll("_", " ");
    if (item.normalValues.includes(value)) {
      normalStatements.push(`${item.label} ${valueLabel}.`);
    } else {
      abnormalStatements.push(`${item.label}: ${valueLabel}${quickNote ? ` — ${quickNote}` : ""}.`);
    }
  }

  const notes = typeof examination.notes === "string" ? examination.notes.trim() : "";
  const lines: string[] = [];
  if (normalStatements.length > 0) lines.push(...normalStatements);
  if (abnormalStatements.length > 0) lines.push(...abnormalStatements);
  if (notAssessed.length > 0) lines.push(`Not assessed: ${notAssessed.join(", ")}.`);
  if (notes) lines.push(notes);
  return lines.join("\n");
}

function generateWorkupSection(ctx: NoteContext): string {
  const { diagnosticOutput, assessment } = ctx;
  const workupData = (assessment.workup_data || {}) as Record<string, unknown>;
  const includeSuggestions = workupData.include_workup_suggestions !== false;
  const acceptedWorkupItems =
    typeof workupData.accepted_workup_items === "object" && workupData.accepted_workup_items
      ? (workupData.accepted_workup_items as Record<string, unknown>)
      : {};
  const workupNotes = typeof workupData.workup_notes === "string" ? workupData.workup_notes.trim() : "";

  const lines: string[] = [];
  if (includeSuggestions && diagnosticOutput.suggestedWorkup.length > 0) {
    const selectedWorkup = diagnosticOutput.suggestedWorkup.filter(
      (item) => acceptedWorkupItems[item] === true
    );
    if (selectedWorkup.length > 0) {
      selectedWorkup.forEach((item) => lines.push(`- ${item}`));
    }
  }
  if (workupNotes) {
    if (lines.length > 0) lines.push("");
    lines.push(workupNotes);
  }
  return lines.join("\n");
}

function generateFollowUpSection(ctx: NoteContext): string {
  const followUp = (ctx.assessment.follow_up || {}) as Record<string, unknown>;
  const date = typeof followUp.follow_up_date === "string" ? followUp.follow_up_date : "";
  const time = typeof followUp.follow_up_time === "string" ? followUp.follow_up_time : "";
  if (!date && !time) return "";
  const parts: string[] = [];
  if (date) parts.push(`Date: ${date}`);
  if (time) parts.push(`Time: ${time}`);
  return parts.join("\n");
}

function generateFinalClinicalImpression(ctx: NoteContext): string {
  const top = ctx.diagnosticOutput.phenotypes[0];
  if (!top) return "";
  return `Clinical impression: ${top.label} (${top.confidence} confidence).`;
}

function generateClinicianSignOff(ctx: NoteContext): string {
  const name = ctx.clinicianName?.trim() || "";
  const credentials = ctx.clinicianCredentials?.trim() || "";
  const designation = ctx.clinicianDesignation?.trim() || "";
  if (!name && !credentials && !designation) return "";
  const identity = [name, credentials].filter(Boolean).join(", ");
  const lines: string[] = [identity || "Clinician"];
  if (designation) lines.push(designation);
  return lines.join("\n");
}

export function generateNote(ctx: NoteContext): string {
  const sections: { heading: string; body: string; hideWhenEmpty?: boolean }[] = [
    { heading: "HEADER", body: generateHeader(ctx), hideWhenEmpty: false },
    { heading: "PATIENT DETAILS", body: generatePatientDetails(ctx), hideWhenEmpty: false },
    { heading: "CONSULTATION OVERVIEW", body: generateConsultationOverview(ctx), hideWhenEmpty: false },
    { heading: "PRESENTING HEADACHE SUMMARY", body: generatePresentingHeadacheSummary(ctx), hideWhenEmpty: false },
    { heading: "PAST MEDICAL HISTORY", body: generatePastMedicalHistorySection(ctx), hideWhenEmpty: true },
    { heading: "RED FLAG SUMMARY", body: generateRedFlagSummary(ctx), hideWhenEmpty: false },
    { heading: "HEADACHE ASSESSMENT FINDINGS", body: generateHeadacheAssessmentFindings(ctx), hideWhenEmpty: true },
    { heading: "MEDICATION HISTORY / CURRENT MEDICATIONS", body: generateMedicationSection(ctx), hideWhenEmpty: true },
    { heading: "CLINICAL EXAMINATION", body: generateClinicalExaminationSection(ctx), hideWhenEmpty: true },
    { heading: "SUGGESTED WORK-UP / PLAN", body: generateWorkupSection(ctx), hideWhenEmpty: true },
    { heading: "FOLLOW-UP", body: generateFollowUpSection(ctx), hideWhenEmpty: true },
    { heading: "FINAL CLINICAL IMPRESSION", body: generateFinalClinicalImpression(ctx), hideWhenEmpty: true },
    { heading: "CLINICIAN SIGN-OFF", body: generateClinicianSignOff(ctx), hideWhenEmpty: true },
  ];

  return sections
    .filter((s) => !s.hideWhenEmpty || s.body.trim().length > 0)
    .map((s) => `${s.heading}\n${"=".repeat(s.heading.length)}\n${s.body}`)
    .join("\n\n");
}
