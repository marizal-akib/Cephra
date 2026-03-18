export type EncounterStatus = "intake" | "in_progress" | "red_flagged" | "completed";

export type EncounterPatientInfo = {
  id: string;
  first_name: string;
  last_name: string;
  mrn: string | null;
};

export type EncounterQuestionnaireTokenInfo = {
  used_at: string | null;
  expires_at?: string;
};

export type EncounterStatusInput = {
  id: string;
  status: EncounterStatus;
  current_step: string | null;
  patient?: EncounterPatientInfo | null;
  questionnaire_tokens?: EncounterQuestionnaireTokenInfo[] | null;
};

export type DerivedAssessmentStatus =
  | "waiting_for_response"
  | "response_received"
  | "in_assessment"
  | "note_drafted"
  | "completed"
  | "expired"
  | "red_flagged";

export const ASSESSMENT_FILTERS: { key: DerivedAssessmentStatus; label: string }[] = [
  { key: "red_flagged", label: "Red Flagged" },
  { key: "in_assessment", label: "In Assessment" },
  { key: "waiting_for_response", label: "Waiting for Response" },
  { key: "response_received", label: "Response Received" },
  { key: "note_drafted", label: "Note Drafted" },
  { key: "completed", label: "Completed" },
  { key: "expired", label: "Expired / No Response" },
];

export const ASSESSMENT_STATUS_SORT_ORDER: Record<DerivedAssessmentStatus, number> = {
  red_flagged: 0,
  in_assessment: 1,
  response_received: 2,
  waiting_for_response: 3,
  note_drafted: 4,
  completed: 5,
  expired: 6,
};

export const ASSESSMENT_STATUS_BADGE_STYLES: Record<DerivedAssessmentStatus, string> = {
  waiting_for_response: "border border-blue-200 bg-blue-50 text-blue-800",
  response_received: "border border-indigo-200 bg-indigo-50 text-indigo-800",
  in_assessment: "border border-amber-200 bg-amber-50 text-amber-800",
  note_drafted: "border border-violet-200 bg-violet-50 text-violet-800",
  completed: "border border-emerald-200 bg-emerald-50 text-emerald-800",
  expired: "border border-slate-300 bg-slate-100 text-slate-700",
  red_flagged: "border border-rose-200 bg-rose-50 text-rose-800",
};

export function isIntakeStep(step: string | null) {
  return !step || step === "intake";
}

export function hasSubmittedQuestionnaire(encounter: EncounterStatusInput) {
  return encounter.questionnaire_tokens?.some((token) => token.used_at !== null) ?? false;
}

export function hasExpiredQuestionnaire(encounter: EncounterStatusInput) {
  const tokens = encounter.questionnaire_tokens ?? [];
  if (tokens.length === 0 || hasSubmittedQuestionnaire(encounter)) {
    return false;
  }

  const now = Date.now();
  return tokens.every((token) => {
    if (!token.expires_at) {
      return false;
    }
    return new Date(token.expires_at).getTime() < now;
  });
}

export function deriveAssessmentStatus(encounter: EncounterStatusInput): DerivedAssessmentStatus {
  if (encounter.status === "red_flagged") {
    return "red_flagged";
  }

  if (encounter.status === "completed") {
    return "completed";
  }

  if (encounter.current_step === "note") {
    return "note_drafted";
  }

  if (encounter.status === "intake") {
    if (hasSubmittedQuestionnaire(encounter)) {
      return "response_received";
    }

    if (hasExpiredQuestionnaire(encounter)) {
      return "expired";
    }

    return "waiting_for_response";
  }

  if (encounter.status === "in_progress" && isIntakeStep(encounter.current_step)) {
    if (hasSubmittedQuestionnaire(encounter)) {
      return "response_received";
    }

    if (hasExpiredQuestionnaire(encounter)) {
      return "expired";
    }

    return "waiting_for_response";
  }

  return "in_assessment";
}

export function assessmentStatusLabel(status: DerivedAssessmentStatus) {
  return ASSESSMENT_FILTERS.find((item) => item.key === status)?.label ?? status;
}

export function patientDisplayName(encounter: { patient?: EncounterPatientInfo | null }) {
  if (!encounter.patient) {
    return "Unknown patient";
  }

  return `${encounter.patient.first_name} ${encounter.patient.last_name}`;
}

export function patientDisplayId(encounter: { patient?: EncounterPatientInfo | null }) {
  if (!encounter.patient) {
    return "N/A";
  }

  return encounter.patient.mrn || encounter.patient.id.slice(0, 8).toUpperCase();
}

export function assessmentReference(encounterId: string) {
  return encounterId.slice(0, 8).toUpperCase();
}
