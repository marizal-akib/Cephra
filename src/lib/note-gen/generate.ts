import type { ClinicianAssessment } from "@/types";
import type { DiagnosticOutput } from "@/lib/engine/types";

interface NoteContext {
  patientName: string;
  age?: number;
  sex?: string;
  assessment: ClinicianAssessment;
  diagnosticOutput: DiagnosticOutput;
}

function describeLocation(pain: Record<string, unknown>): string {
  const parts: string[] = [];
  if (pain.unilateral) parts.push("unilateral");
  if (pain.bilateral) parts.push("bilateral");
  if (pain.frontal) parts.push("frontal");
  if (pain.temporal) parts.push("temporal");
  if (pain.orbital) parts.push("orbital");
  if (pain.occipital) parts.push("occipital");
  if (pain.neck_predominant) parts.push("neck-predominant");
  return parts.length > 0 ? parts.join(", ") : "location not specified";
}

function describeQuality(pain: Record<string, unknown>): string {
  const parts: string[] = [];
  if (pain.pulsating) parts.push("pulsating");
  if (pain.pressing) parts.push("pressing");
  if (pain.tightening) parts.push("tightening");
  if (pain.stabbing) parts.push("stabbing");
  if (pain.burning) parts.push("burning");
  if (pain.boring) parts.push("boring");
  return parts.length > 0 ? parts.join(", ") : "quality not specified";
}

function describeSymptoms(symptoms: Record<string, unknown>): string {
  const parts: string[] = [];
  if (symptoms.nausea) parts.push("nausea");
  if (symptoms.vomiting) parts.push("vomiting");
  if (symptoms.photophobia) parts.push("photophobia");
  if (symptoms.phonophobia) parts.push("phonophobia");
  if (symptoms.osmophobia) parts.push("osmophobia");
  if (symptoms.dizziness) parts.push("dizziness");
  if (symptoms.neck_pain) parts.push("neck pain");
  return parts.length > 0 ? parts.join(", ") : "none reported";
}

function generateHPI(ctx: NoteContext): string {
  const { assessment } = ctx;
  const pattern = (assessment.pattern || {}) as Record<string, unknown>;
  const pain = (assessment.pain || {}) as Record<string, unknown>;
  const symptoms = (assessment.symptoms || {}) as Record<string, unknown>;

  const lines: string[] = [];

  // Opening line
  const demoLine = [ctx.patientName];
  if (ctx.age) demoLine.push(`${ctx.age}-year-old`);
  if (ctx.sex) demoLine.push(ctx.sex);
  lines.push(
    `${demoLine.join(", ")} presenting with headaches.`
  );

  // Pattern
  const patternParts: string[] = [];
  if (pattern.headache_days_per_month)
    patternParts.push(
      `occurring approximately ${pattern.headache_days_per_month} days per month`
    );
  if (pattern.duration_hours)
    patternParts.push(`typical duration ${pattern.duration_hours} hours`);
  if (pattern.duration_minutes)
    patternParts.push(`attack duration ${pattern.duration_minutes} minutes`);
  if (pattern.pattern_duration_months)
    patternParts.push(`over the past ${pattern.pattern_duration_months} months`);
  if (patternParts.length > 0)
    lines.push(`Headaches ${patternParts.join(", ")}.`);

  // Pain
  lines.push(
    `Pain is described as ${describeQuality(pain)}, ${describeLocation(pain)}.`
  );
  if (pain.peak_intensity)
    lines.push(`Peak intensity rated ${pain.peak_intensity}/10.`);
  if (pain.worse_with_activity) lines.push("Aggravated by routine physical activity.");
  if (pain.restless_or_pacing) lines.push("Patient is restless/pacing during attacks.");

  // Symptoms
  lines.push(`Associated symptoms include ${describeSymptoms(symptoms)}.`);

  // Aura
  const aura = (assessment.aura || {}) as Record<string, unknown>;
  const auraParts: string[] = [];
  if (aura.visual_positive) auraParts.push("positive visual symptoms");
  if (aura.sensory_positive) auraParts.push("positive sensory symptoms");
  if (aura.speech_disturbance) auraParts.push("speech disturbance");
  if (auraParts.length > 0) {
    lines.push(`Aura features: ${auraParts.join(", ")}.`);
    if (aura.aura_duration_minutes)
      lines.push(`Aura duration approximately ${aura.aura_duration_minutes} minutes.`);
  }

  // Medications
  const meds = (assessment.medications || {}) as Record<string, unknown>;
  const medParts: string[] = [];
  if (meds.triptan_days_per_month)
    medParts.push(`triptans ${meds.triptan_days_per_month} days/month`);
  if (meds.nsaid_days_per_month)
    medParts.push(`NSAIDs ${meds.nsaid_days_per_month} days/month`);
  if (meds.opioid_days_per_month)
    medParts.push(`opioids ${meds.opioid_days_per_month} days/month`);
  if (medParts.length > 0)
    lines.push(`Current acute medication use: ${medParts.join(", ")}.`);
  if (meds.current_preventive)
    lines.push(`Current preventive: ${meds.current_preventive}.`);

  return lines.join(" ");
}

function generateAssessmentSection(ctx: NoteContext): string {
  const { diagnosticOutput } = ctx;
  const lines: string[] = [];

  // Red flags
  if (diagnosticOutput.redFlagResult.flagged) {
    lines.push(
      `RED FLAGS: ${diagnosticOutput.redFlagResult.flags
        .map((f) => f.description)
        .join("; ")}.`
    );
  } else {
    lines.push("No red flags identified on structured screening.");
  }

  // Diagnoses
  lines.push("");
  lines.push("Diagnostic assessment:");
  diagnosticOutput.phenotypes.forEach((p, i) => {
    lines.push(
      `${i + 1}. ${p.label} (${p.confidence} confidence) - ${p.rationale.join("; ")}`
    );
    if (p.contradictions.length > 0)
      lines.push(`   Against: ${p.contradictions.join("; ")}`);
  });

  return lines.join("\n");
}

function generatePlanSection(ctx: NoteContext): string {
  const { diagnosticOutput, assessment } = ctx;
  const lines: string[] = [];

  if (diagnosticOutput.suggestedWorkup.length > 0) {
    lines.push("Suggested work-up:");
    diagnosticOutput.suggestedWorkup.forEach((item) => {
      lines.push(`- ${item}`);
    });
  }

  if (assessment.clinician_notes) {
    lines.push("");
    lines.push(`Additional notes: ${assessment.clinician_notes}`);
  }

  return lines.join("\n");
}

export function generateNote(ctx: NoteContext): string {
  const sections = [
    { heading: "HISTORY OF PRESENT ILLNESS", body: generateHPI(ctx) },
    { heading: "ASSESSMENT", body: generateAssessmentSection(ctx) },
    { heading: "PLAN", body: generatePlanSection(ctx) },
  ];

  return sections
    .filter((s) => s.body.trim().length > 0)
    .map((s) => `${s.heading}\n${"=".repeat(s.heading.length)}\n${s.body}`)
    .join("\n\n");
}
