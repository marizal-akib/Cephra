"use client";

import { useMemo } from "react";
import { runDiagnosticEngine } from "@/lib/engine";
import type {
  DiagnosticInput,
  DiagnosticOutput,
  InvestigationResult,
} from "@/lib/engine/types";
import type {
  ClinicianAssessment,
  FollowUpAssessment,
  Patient,
  QuestionnaireResponse,
} from "@/types";
import { followUpToDiagnosticInput } from "@/lib/follow-up/diagnostic-input-mapper";

interface DiagnosisContext {
  patient?: Patient | null;
  questionnaire?: QuestionnaireResponse | null;
}

function ageFromDob(dob: string | null | undefined): number | undefined {
  if (!dob) return undefined;
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return undefined;
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

function deriveDemographics(
  context: DiagnosisContext | undefined
): DiagnosticInput["demographics"] {
  if (!context) return undefined;
  const patient = context.patient ?? undefined;
  const responses =
    (context.questionnaire?.responses as Record<string, unknown> | undefined) ??
    undefined;

  const ageFromPatient = ageFromDob(patient?.date_of_birth);
  const ageFromQuestionnaire =
    typeof responses?.age === "number" ? (responses.age as number) : undefined;

  const sexFromPatient = patient?.sex ?? undefined;
  const rawSexFromQuestionnaire =
    typeof responses?.sex === "string" ? responses.sex : undefined;
  const sexFromQuestionnaire =
    rawSexFromQuestionnaire === "male" ||
    rawSexFromQuestionnaire === "female" ||
    rawSexFromQuestionnaire === "other"
      ? rawSexFromQuestionnaire
      : undefined;

  const age = ageFromPatient ?? ageFromQuestionnaire;
  const sex = sexFromPatient ?? sexFromQuestionnaire ?? undefined;

  if (age == null && sex == null) return undefined;
  return { age, sex: sex || undefined };
}

function buildPreviousInvestigations(
  raw: Record<string, unknown> | null | undefined
): DiagnosticInput["previousInvestigations"] {
  if (!raw) return undefined;
  const results = (raw as { results?: unknown }).results;
  if (!Array.isArray(results)) return undefined;
  return { results: results as InvestigationResult[] };
}

export function useDiagnosis(
  assessment: ClinicianAssessment | null,
  context?: DiagnosisContext,
  followUpAssessment?: FollowUpAssessment | null
): DiagnosticOutput | null {
  const patient = context?.patient ?? null;
  const questionnaire = context?.questionnaire ?? null;

  return useMemo(() => {
    const demographics = deriveDemographics({
      patient: patient ?? undefined,
      questionnaire: questionnaire ?? undefined,
    });

    // Follow-up path
    if (followUpAssessment) {
      const input = followUpToDiagnosticInput(followUpAssessment);
      if (demographics) input.demographics = demographics;
      const hasData = Object.values(input).some((section) =>
        section && typeof section === "object"
          ? Object.values(section).some((v) => v != null)
          : false
      );
      if (!hasData) return null;
      return runDiagnosticEngine(input);
    }

    // Initial assessment path
    if (!assessment) return null;

    const input: DiagnosticInput = {
      redFlags: (assessment.red_flags || {}) as Record<string, boolean>,
      pattern: (assessment.pattern || {}) as Record<string, unknown>,
      pain: (assessment.pain || {}) as Record<string, unknown>,
      symptoms: (assessment.symptoms || {}) as Record<string, unknown>,
      aura: (assessment.aura || {}) as Record<string, unknown>,
      autonomic: (assessment.autonomic || {}) as Record<string, unknown>,
      triggers: (assessment.triggers || {}) as Record<string, unknown>,
      medications: (assessment.medications || {}) as Record<string, unknown>,
      clinicalExamination: (assessment.clinical_examination || {}) as Record<
        string,
        unknown
      >,
      previousInvestigations: buildPreviousInvestigations(
        assessment.previous_investigations
      ),
      demographics,
    };

    // Only run if at least some data exists in the question/symptom sections
    const coreSections: (keyof DiagnosticInput)[] = [
      "redFlags",
      "pattern",
      "pain",
      "symptoms",
      "aura",
      "autonomic",
      "triggers",
      "medications",
      "clinicalExamination",
    ];
    const hasData = coreSections.some((key) => {
      const section = input[key];
      return (
        section &&
        typeof section === "object" &&
        Object.values(section as Record<string, unknown>).some(
          (v) => v != null
        )
      );
    });
    if (!hasData) return null;

    return runDiagnosticEngine(input);
  }, [assessment, followUpAssessment, patient, questionnaire]);
}
