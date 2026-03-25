// Application-level shared types

export interface Profile {
  id: string;
  full_name: string;
  credentials: string | null;
  specialty: string | null;
  designation: string | null;
  role: "admin" | "doctor";
  created_at: string;
  updated_at: string;
}

export interface Patient {
  id: string;
  clinician_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string | null;
  sex: "male" | "female" | "other" | null;
  mrn: string | null;
  created_at: string;
  updated_at: string;
}

export type EncounterType = "initial" | "follow_up";

export type DiagnosisTemplate =
  | "migraine"
  | "tension_type"
  | "cluster"
  | "tac"
  | "medication_overuse"
  | "cervicogenic"
  | "occipital_neuralgia";

export interface Encounter {
  id: string;
  clinician_id: string;
  referred_by_clinician_id: string | null;
  patient_id: string;
  encounter_type: EncounterType;
  parent_encounter_id: string | null;
  diagnosis_template: DiagnosisTemplate | null;
  status: "intake" | "in_progress" | "red_flagged" | "completed";
  current_step: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  patient?: Patient;
}

export interface FollowUpAssessment {
  id: string;
  encounter_id: string;
  review: Record<string, unknown>;
  burden: Record<string, unknown>;
  medication_review: Record<string, unknown>;
  investigations: Record<string, unknown>;
  examination: Record<string, unknown>;
  red_flags: Record<string, unknown>;
  assessment_plan: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface QuestionnaireToken {
  id: string;
  encounter_id: string;
  token: string;
  expires_at: string;
  used_at: string | null;
  created_at: string;
}

export interface QuestionnaireResponse {
  id: string;
  encounter_id: string;
  token_id: string;
  responses: Record<string, unknown>;
  partial: boolean;
  submitted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClinicianAssessment {
  id: string;
  encounter_id: string;
  past_medical_history: Record<string, unknown>;
  red_flags: Record<string, unknown>;
  pattern: Record<string, unknown>;
  pain: Record<string, unknown>;
  symptoms: Record<string, unknown>;
  aura: Record<string, unknown>;
  autonomic: Record<string, unknown>;
  triggers: Record<string, unknown>;
  medications: Record<string, unknown>;
  clinical_examination: Record<string, unknown>;
  workup_data: Record<string, unknown>;
  follow_up: Record<string, unknown>;
  clinician_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface DiagnosticRun {
  id: string;
  encounter_id: string;
  version: number;
  input_snapshot: Record<string, unknown>;
  red_flag_result: Record<string, unknown>;
  phenotype_ranking: Record<string, unknown>[];
  missing_data: Record<string, unknown> | null;
  suggested_workup: Record<string, unknown> | null;
  engine_version: string;
  created_at: string;
}

export interface GeneratedNote {
  id: string;
  encounter_id: string;
  diagnostic_run_id: string | null;
  content: string;
  version: number;
  update_reason: string | null;
  created_at: string;
}

// Encounter steps for navigation
export const ENCOUNTER_STEPS = [
  { key: "intake", label: "Intake Summary", path: "intake" },
  {
    key: "past-medical-history",
    label: "Past Medical History",
    path: "past-medical-history",
  },
  { key: "red-flags", label: "Red Flags", path: "red-flags" },
  { key: "pattern", label: "Pattern", path: "pattern" },
  { key: "pain", label: "Pain", path: "pain" },
  { key: "symptoms", label: "Symptoms", path: "symptoms" },
  { key: "aura", label: "Aura", path: "aura" },
  { key: "autonomic", label: "Autonomic", path: "autonomic" },
  { key: "triggers", label: "Triggers", path: "triggers" },
  { key: "meds", label: "Medications", path: "meds" },
  {
    key: "clinical-examination",
    label: "Clinical Examination",
    path: "clinical-examination",
  },
  { key: "workup", label: "Plan & Follow-up", path: "workup" },
  { key: "note", label: "Clinic Note", path: "note" },
] as const;

export type EncounterStepKey = (typeof ENCOUNTER_STEPS)[number]["key"];

// Follow-up encounter steps (7 clinical sections + letter)
export const FOLLOWUP_STEPS = [
  { key: "review", label: "Review Details", path: "review" },
  { key: "burden", label: "Headache Burden", path: "burden" },
  { key: "fu-medications", label: "Medication Review", path: "fu-medications" },
  { key: "fu-investigations", label: "Investigations", path: "fu-investigations" },
  { key: "fu-examination", label: "Examination", path: "fu-examination" },
  { key: "red-flag-review", label: "Red Flag Review", path: "red-flag-review" },
  { key: "fu-plan", label: "Assessment & Plan", path: "fu-plan" },
  { key: "fu-letter", label: "Follow-up Letter", path: "fu-letter" },
] as const;

export type FollowUpStepKey = (typeof FOLLOWUP_STEPS)[number]["key"];

// Assessment section keys (the form sections in clinician_assessments)
export type AssessmentSection =
  | "past_medical_history"
  | "red_flags"
  | "pattern"
  | "pain"
  | "symptoms"
  | "aura"
  | "autonomic"
  | "triggers"
  | "medications"
  | "clinical_examination"
  | "follow_up";

// Maps assessment section keys to encounter step path keys
export const SECTION_TO_STEP: Record<AssessmentSection, string> = {
  past_medical_history: "past-medical-history",
  red_flags: "red-flags",
  pattern: "pattern",
  pain: "pain",
  symptoms: "symptoms",
  aura: "aura",
  autonomic: "autonomic",
  triggers: "triggers",
  medications: "meds",
  clinical_examination: "clinical-examination",
  follow_up: "workup",
};

// Follow-up assessment section keys
export type FollowUpSection =
  | "review"
  | "burden"
  | "medication_review"
  | "investigations"
  | "examination"
  | "red_flags"
  | "assessment_plan";

export const FOLLOWUP_SECTION_TO_STEP: Record<FollowUpSection, string> = {
  review: "review",
  burden: "burden",
  medication_review: "fu-medications",
  investigations: "fu-investigations",
  examination: "fu-examination",
  red_flags: "red-flag-review",
  assessment_plan: "fu-plan",
};
