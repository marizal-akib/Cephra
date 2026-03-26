import type { FollowUpAssessment } from "@/types";
import type { DiagnosticOutput } from "@/lib/engine/types";
import type { BaselineValues } from "@/lib/follow-up/baseline-adapter";
import type { MedicationEntry } from "@/lib/schemas/followup/medication-review";
import type { InvestigationResult } from "@/lib/schemas/followup/investigations";
import type { RedFlagItem } from "@/lib/schemas/followup/red-flag-review";

export interface FollowUpNoteContext {
  patientName: string;
  patientId?: string;
  age?: number;
  sex?: string;
  dateOfBirth?: string;
  followUpAssessment: FollowUpAssessment;
  diagnosticOutput: DiagnosticOutput;
  baseline: BaselineValues | null;
  clinicianName?: string;
  clinicianCredentials?: string;
  clinicianDesignation?: string;
  consultationDate?: string;
  diagnosisTemplate?: string;
  clinicType?: string;
  keyQuestion?: string;
  diagnosisNotes?: string;
}

function str(val: unknown): string {
  return typeof val === "string" ? val.trim() : "";
}

function num(val: unknown): number | null {
  return typeof val === "number" ? val : null;
}

function formatDateOnly(isoDate: string | undefined): string {
  if (!isoDate) return "";
  return new Date(isoDate).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
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

function trendWord(current: number | undefined, baseline: number | null): string {
  if (current === undefined || baseline === null) return "";
  if (current < baseline) return `down from ${baseline}`;
  if (current > baseline) return `up from ${baseline}`;
  return `unchanged from ${baseline}`;
}

// ── Section 1: Review Details and Diagnosis ──

function generateReviewDetails(ctx: FollowUpNoteContext): string {
  const lines: string[] = [];

  lines.push(`Patient name: ${ctx.patientName}`);
  if (ctx.patientId) lines.push(`Patient ID: ${ctx.patientId}`);
  if (ctx.dateOfBirth) lines.push(`Date of birth: ${formatDateOnly(ctx.dateOfBirth)}`);
  if (ctx.age !== undefined) lines.push(`Age: ${ctx.age} years`);
  if (ctx.sex) lines.push(`Sex: ${ctx.sex}`);
  if (ctx.consultationDate) lines.push(`Date of review: ${formatConsultationDate(ctx.consultationDate)}`);
  if (ctx.clinicianName) lines.push(`Clinician: ${ctx.clinicianName}`);
  if (ctx.clinicType) {
    const typeLabels: Record<string, string> = { face_to_face: "Face-to-face", virtual: "Virtual", telephone: "Telephone" };
    lines.push(`Clinic type: ${typeLabels[ctx.clinicType] || ctx.clinicType}`);
  }

  if (ctx.baseline?.encounter_date) {
    lines.push(`Interval since last review: last seen ${formatDateOnly(ctx.baseline.encounter_date)}`);
  }

  // Current working diagnosis
  const top = ctx.diagnosticOutput.phenotypes[0];
  if (top) {
    lines.push("");
    lines.push(`Current working diagnosis: ${top.label} (${top.confidence} confidence)`);
  }

  const diagNotes = str(ctx.diagnosisNotes);
  if (diagNotes) lines.push(`Diagnosis notes: ${diagNotes}`);

  // Key diagnostic question
  const keyQ = str(ctx.keyQuestion);
  if (keyQ) {
    lines.push("");
    lines.push(`Key diagnostic question today: ${keyQ}`);
  }

  return lines.join("\n");
}

// ── Section 2: Current Headache Burden ──

function generateBurden(ctx: FollowUpNoteContext): string {
  const burden = ctx.followUpAssessment.burden || {};
  const b = ctx.baseline;
  const lines: string[] = [];

  // Frequency with trend comparison
  const hdpm = num(burden.headache_days_per_month);
  if (hdpm !== null) {
    const trend = trendWord(hdpm, b?.headache_days_per_month ?? null);
    lines.push(`Headache days/month: ${hdpm}${trend ? ` (${trend} at last review)` : ""}.`);
  }

  const mdpm = num(burden.migraine_days_per_month);
  if (mdpm !== null) {
    const trend = trendWord(mdpm, b?.migraine_days_per_month ?? null);
    lines.push(`Migraine days/month: ${mdpm}${trend ? ` (${trend})` : ""}.`);
  }

  const sdpm = num(burden.severe_days_per_month);
  if (sdpm !== null) lines.push(`Severe days/month: ${sdpm}.`);

  const apm = num(burden.attacks_per_month);
  if (apm !== null) lines.push(`Attacks/month: ${apm}.`);

  // Severity with comparison
  const avg = num(burden.avg_severity);
  const worst = num(burden.worst_severity);
  const sevParts: string[] = [];
  if (avg !== null) {
    const trend = trendWord(avg, b?.avg_severity ?? null);
    sevParts.push(`average ${avg}/10${trend ? ` (${trend})` : ""}`);
  }
  if (worst !== null) {
    const trend = trendWord(worst, b?.worst_severity ?? null);
    sevParts.push(`worst ${worst}/10${trend ? ` (${trend})` : ""}`);
  }
  if (sevParts.length > 0) lines.push(`Severity: ${sevParts.join(", ")}.`);

  // Duration
  const durH = num(burden.typical_duration_hours);
  const durM = num(burden.typical_duration_minutes);
  const durParts: string[] = [];
  if (durH !== null) durParts.push(`${durH} hours`);
  if (durM !== null) durParts.push(`${durM} minutes`);
  if (durParts.length > 0) lines.push(`Typical attack duration: ${durParts.join(", ")}.`);

  // Trend
  const trend = str(burden.trend_direction);
  if (trend) lines.push(`Overall trend: ${trend}.`);
  const trendNotes = str(burden.trend_notes);
  if (trendNotes) lines.push(`Trend notes: ${trendNotes}`);

  // Functional impact
  const workDays = num(burden.work_days_lost);
  const disDays = num(burden.disability_days);
  const funcParts: string[] = [];
  if (workDays !== null) funcParts.push(`${workDays} work days lost`);
  if (disDays !== null) funcParts.push(`${disDays} disability days`);
  if (funcParts.length > 0) lines.push(`Functional impact: ${funcParts.join(", ")}.`);

  const funcNotes = str(burden.functional_impact_notes);
  if (funcNotes) lines.push(funcNotes);

  const notes = str(burden.notes);
  if (notes) lines.push(notes);

  return lines.join("\n");
}

// ── Section 3: Medication Review ──

function generateMedReview(ctx: FollowUpNoteContext): string {
  const medReview = ctx.followUpAssessment.medication_review || {};
  const parts: string[] = [];

  // Acute medication days
  const acuteEntries: string[] = [];
  const mohThresholds: Record<string, number> = {
    triptan_days_per_month: 10,
    opioid_days_per_month: 10,
    combination_analgesic_days_per_month: 10,
    simple_analgesic_days_per_month: 15,
    paracetamol_days_per_month: 15,
    nsaid_days_per_month: 15,
  };
  const acuteLabels: Record<string, string> = {
    triptan_days_per_month: "Triptans",
    nsaid_days_per_month: "NSAIDs",
    paracetamol_days_per_month: "Paracetamol",
    opioid_days_per_month: "Opioids",
    simple_analgesic_days_per_month: "Simple analgesics",
    combination_analgesic_days_per_month: "Combination analgesics",
  };

  for (const [key, label] of Object.entries(acuteLabels)) {
    const val = num(medReview[key]);
    if (val !== null) {
      const threshold = mohThresholds[key];
      const flag = val >= threshold ? " [ABOVE MOH THRESHOLD]" : "";
      acuteEntries.push(`${label}: ${val} days/month${flag}`);
    }
  }
  if (acuteEntries.length > 0) {
    parts.push("Acute medication use:");
    acuteEntries.forEach((e) => parts.push(`- ${e}`));
  }

  // Treatment response
  const responseParts: string[] = [];
  if (medReview.response_to_triptan === true) responseParts.push("responds to triptans");
  if (medReview.response_to_oxygen === true) responseParts.push("responds to high-flow oxygen");
  if (medReview.response_to_indomethacin === true) responseParts.push("responds to indomethacin");
  if (responseParts.length > 0) parts.push(`Treatment response: ${responseParts.join(", ")}.`);

  // Per-drug review table
  const medications = Array.isArray(medReview.medications)
    ? (medReview.medications as MedicationEntry[]).filter((m) => m.drug)
    : [];
  if (medications.length > 0) {
    parts.push("");
    parts.push("Medication review:");
    for (const m of medications) {
      const actionLabel = m.action.charAt(0).toUpperCase() + m.action.slice(1);
      const benefitText = (m.benefit || "not stated") + (m.benefit_detail ? ` (${m.benefit_detail})` : "");
      const tolerabilityText = (m.tolerability || "not stated") + (m.tolerability_detail ? ` (${m.tolerability_detail})` : "");
      parts.push(`- ${m.drug} (${m.type}): ${m.dose}. Benefit: ${benefitText}. Tolerability: ${tolerabilityText}. Action: ${actionLabel}.`);
    }
  }

  const notes = str(medReview.medication_notes);
  if (notes) {
    parts.push("");
    parts.push(notes);
  }

  return parts.join("\n");
}

// ── Section 4: Investigation and Results Review ──

function generateInvestigations(ctx: FollowUpNoteContext): string {
  const inv = ctx.followUpAssessment.investigations || {};
  const lines: string[] = [];

  const results = Array.isArray(inv.results)
    ? (inv.results as InvestigationResult[]).filter((r) => r.name)
    : [];

  if (results.length > 0) {
    lines.push("Results reviewed:");
    for (const r of results) {
      const displayName = r.name === "Others" && r.nameSpecify ? `Others (${r.nameSpecify})` : r.name;
      let resultText = r.result || "result pending";
      if (r.result === "Abnormal" && r.abnormalDetails) {
        resultText = `Abnormal — ${r.abnormalDetails}`;
      }
      lines.push(`- ${displayName}: ${resultText}. Interpretation: ${r.interpretation || "not stated"}.`);
    }
  }

  const pending = str(inv.pending);
  if (pending) {
    if (lines.length > 0) lines.push("");
    lines.push(`Pending investigations: ${pending}`);
  }

  const notes = str(inv.notes);
  if (notes) {
    if (lines.length > 0) lines.push("");
    lines.push(notes);
  }

  if (lines.length === 0) {
    lines.push("No new investigations reviewed at this visit.");
  }

  return lines.join("\n");
}

// ── Section 5: Clinical Examination ──

function generateExamination(ctx: FollowUpNoteContext): string {
  const exam = ctx.followUpAssessment.examination || {};
  const lines: string[] = [];

  if (exam.exam_unchanged === true) {
    const date = str(exam.exam_unchanged_date);
    lines.push(`Neurological examination unchanged from ${date ? formatDateOnly(date) : "previous assessment"}.`);
  }

  // Observations
  const obsParts: string[] = [];
  if (num(exam.bp_systolic) !== null && num(exam.bp_diastolic) !== null)
    obsParts.push(`BP ${exam.bp_systolic}/${exam.bp_diastolic} mmHg`);
  if (num(exam.heart_rate_bpm) !== null) obsParts.push(`HR ${exam.heart_rate_bpm} bpm`);
  if (num(exam.weight_kg) !== null) obsParts.push(`Weight ${exam.weight_kg} kg`);
  if (obsParts.length > 0) lines.push(`Observations: ${obsParts.join(", ")}.`);

  // Focused neuro
  if (exam.exam_unchanged !== true) {
    if (exam.neuro_status === "normal") lines.push("Focused neurological examination: normal.");
    else if (exam.neuro_status === "abnormal") {
      const detail = str(exam.neuro_details);
      lines.push(`Focused neurological examination: abnormal${detail ? ` — ${detail}` : ""}.`);
    }

    if (exam.fundoscopy_status === "normal") lines.push("Fundoscopy: normal.");
    else if (exam.fundoscopy_status === "abnormal") {
      const detail = str(exam.fundoscopy_details);
      lines.push(`Fundoscopy: abnormal${detail ? ` — ${detail}` : ""}.`);
    }
  }

  // Diagnosis-specific
  const pericranial = str(exam.pericranial_tenderness);
  if (pericranial) lines.push(`Pericranial tenderness: ${pericranial}.`);

  if (exam.autonomic_signs_present === true) {
    const detail = str(exam.autonomic_signs_details);
    lines.push(`Autonomic signs present${detail ? `: ${detail}` : ""}.`);
  }

  if (exam.headache_reproduced_by_neck === true) lines.push("Headache reproduced by neck movement.");
  const cervical = str(exam.cervical_rom);
  if (cervical) lines.push(`Cervical findings: ${cervical}.`);

  const notes = str(exam.notes);
  if (notes) lines.push(notes);

  return lines.join("\n");
}

// ── Section 6: Red Flag Review ──

function generateRedFlagReview(ctx: FollowUpNoteContext): string {
  const rf = ctx.followUpAssessment.red_flags || {};
  const lines: string[] = [];

  const flags = Array.isArray(rf.flags) ? (rf.flags as RedFlagItem[]) : [];

  if (flags.length > 0) {
    for (const item of flags) {
      const status = item.present ? "PRESENT" : "Absent";
      let line = `- ${item.flag}: ${status}`;
      if (item.present && item.details) line += ` — ${item.details}`;
      lines.push(line);
    }
  } else {
    lines.push("Red flag review not yet completed.");
  }

  const notes = str(rf.notes);
  if (notes) {
    lines.push("");
    lines.push(`Red flag notes: ${notes}`);
  }

  return lines.join("\n");
}

// ── Section 7: Assessment, Management and Follow-up Plan ──

function generateAssessmentPlan(ctx: FollowUpNoteContext): string {
  const plan = ctx.followUpAssessment.assessment_plan || {};
  const lines: string[] = [];

  // Assessment
  lines.push("Assessment:");
  const summary = str(plan.assessment_summary);
  if (summary) {
    lines.push(summary);
  } else {
    const top = ctx.diagnosticOutput.phenotypes[0];
    if (top) {
      lines.push(`Clinical impression: ${top.label} (${top.confidence} confidence).`);
    }
  }

  const diagStatus = str(plan.diagnosis_status);
  if (diagStatus) lines.push(`Diagnosis status: ${diagStatus}.`);
  const trendOverall = str(plan.trend_overall);
  if (trendOverall) lines.push(`Overall trend: ${trendOverall}.`);

  // Treatment changes
  lines.push("");
  lines.push("Treatment changes:");
  const changes = str(plan.treatment_changes);
  lines.push(changes || "No changes documented.");

  // Safety counselling
  lines.push("");
  lines.push("Safety counselling:");
  const safety = str(plan.safety_counselling);
  lines.push(safety || "Not documented.");

  // Follow-up plan
  lines.push("");
  if (plan.discharge === true) {
    lines.push("Discharge from clinic.");
    const criteria = str(plan.discharge_criteria);
    if (criteria) lines.push(`Re-referral criteria: ${criteria}`);
  } else {
    lines.push("Follow-up plan:");
    const typeLabels: Record<string, string> = {
      clinic: "Clinic (face-to-face)",
      virtual: "Virtual",
      gp_review: "GP review",
      telephone: "Telephone",
    };
    const fuType = str(plan.follow_up_type);
    if (fuType) lines.push(`Type: ${typeLabels[fuType] || fuType}`);
    const fuDate = str(plan.follow_up_date);
    if (fuDate) lines.push(`Date: ${fuDate}`);
    const fuTime = str(plan.follow_up_time);
    if (fuTime) lines.push(`Time: ${fuTime}`);
    const fuPurpose = str(plan.follow_up_purpose);
    if (fuPurpose) lines.push(`Purpose: ${fuPurpose}`);
    const fuClinician = str(plan.follow_up_clinician);
    if (fuClinician) lines.push(`Responsible clinician: ${fuClinician}`);

    if (!fuType && !fuDate && !fuPurpose) lines.push("Not yet scheduled.");
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

export function generateFollowUpLetter(ctx: FollowUpNoteContext): string {
  const sections: { heading: string; body: string; hideWhenEmpty?: boolean }[] = [
    { heading: "REVIEW DETAILS AND DIAGNOSIS", body: generateReviewDetails(ctx), hideWhenEmpty: false },
    { heading: "CURRENT HEADACHE BURDEN SEVERITY AND PATTERN", body: generateBurden(ctx), hideWhenEmpty: true },
    { heading: "MEDICATION REVIEW", body: generateMedReview(ctx), hideWhenEmpty: true },
    { heading: "INVESTIGATION AND RESULTS REVIEW", body: generateInvestigations(ctx), hideWhenEmpty: false },
    { heading: "CLINICAL EXAMINATION", body: generateExamination(ctx), hideWhenEmpty: true },
    { heading: "RED FLAG SYMPTOMS AND SIGNS", body: generateRedFlagReview(ctx), hideWhenEmpty: false },
    { heading: "ASSESSMENT MANAGEMENT AND FOLLOW UP PLAN", body: generateAssessmentPlan(ctx), hideWhenEmpty: false },
  ];

  return sections
    .filter((s) => !s.hideWhenEmpty || s.body.trim().length > 0)
    .map((s) => `${s.heading}\n${"=".repeat(s.heading.length)}\n${s.body}`)
    .join("\n\n");
}
