import { type EncounterStatus } from "@/lib/assessment";

export type WorkflowEncounter = {
  id: string;
  status: EncounterStatus;
  encounter_type: "initial" | "follow_up";
  current_step: string | null;
  created_at: string;
  updated_at: string;
  referred_by_clinician_id: string | null;
  patient: {
    id: string;
    first_name: string;
    last_name: string;
    mrn: string | null;
  } | null;
  questionnaire_tokens: {
    token: string;
    created_at: string;
    used_at: string | null;
    expires_at: string;
  }[] | null;
};
