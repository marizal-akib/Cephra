// Application-level shared types

export interface Profile {
  id: string;
  full_name: string;
  credentials: string | null;
  specialty: string | null;
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

export interface Encounter {
  id: string;
  clinician_id: string;
  referred_by_clinician_id: string | null;
  patient_id: string;
  status: "intake" | "in_progress" | "red_flagged" | "completed";
  current_step: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  patient?: Patient;
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
  red_flags: Record<string, unknown>;
  pattern: Record<string, unknown>;
  pain: Record<string, unknown>;
  symptoms: Record<string, unknown>;
  aura: Record<string, unknown>;
  autonomic: Record<string, unknown>;
  triggers: Record<string, unknown>;
  medications: Record<string, unknown>;
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
  { key: "red-flags", label: "Red Flags", path: "red-flags" },
  { key: "pattern", label: "Pattern", path: "pattern" },
  { key: "pain", label: "Pain", path: "pain" },
  { key: "symptoms", label: "Symptoms", path: "symptoms" },
  { key: "aura", label: "Aura", path: "aura" },
  { key: "autonomic", label: "Autonomic", path: "autonomic" },
  { key: "triggers", label: "Triggers", path: "triggers" },
  { key: "meds", label: "Medications", path: "meds" },
  { key: "output", label: "Phenotype Output", path: "output" },
  { key: "workup", label: "Work-up", path: "workup" },
  { key: "note", label: "Clinic Note", path: "note" },
] as const;

export type EncounterStepKey = (typeof ENCOUNTER_STEPS)[number]["key"];

// Assessment section keys (the form sections in clinician_assessments)
export type AssessmentSection =
  | "red_flags"
  | "pattern"
  | "pain"
  | "symptoms"
  | "aura"
  | "autonomic"
  | "triggers"
  | "medications";

// Maps assessment section keys to encounter step path keys
export const SECTION_TO_STEP: Record<AssessmentSection, string> = {
  red_flags: "red-flags",
  pattern: "pattern",
  pain: "pain",
  symptoms: "symptoms",
  aura: "aura",
  autonomic: "autonomic",
  triggers: "triggers",
  medications: "meds",
};
