import { createClient } from "@/lib/supabase/server";
import { PatientRecords } from "@/components/records/patient-records";
import { type EncounterStatus } from "@/lib/assessment";

export type RecordPatient = {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string | null;
  sex: "male" | "female" | "other" | null;
  mrn: string | null;
  created_at: string;
  encounters: {
    id: string;
    status: EncounterStatus;
    current_step: string | null;
    created_at: string;
    updated_at: string;
    questionnaire_tokens: {
      used_at: string | null;
    }[];
    generated_notes: {
      id: string;
      content: string;
      version: number;
      created_at: string;
    }[];
    clinician_assessments: {
      id: string;
      pattern: Record<string, unknown> | null;
      pain: Record<string, unknown> | null;
      symptoms: Record<string, unknown> | null;
      medications: Record<string, unknown> | null;
      red_flags: Record<string, unknown> | null;
      clinical_examination: Record<string, unknown> | null;
    }[];
    diagnostic_runs: {
      id: string;
      phenotype_ranking: unknown[] | null;
      red_flag_result: { flagged?: boolean; flags?: { description: string }[] } | null;
      created_at: string;
    }[];
  }[];
};

export default async function PatientRecordsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: patientsData, error: patientsError } = await supabase
    .from("patients")
    .select(
      `
        id,
        first_name,
        last_name,
        date_of_birth,
        sex,
        mrn,
        created_at,
        encounters(
          id,
          status,
          current_step,
          created_at,
          updated_at,
          questionnaire_tokens(used_at),
          generated_notes(id, content, version, created_at),
          clinician_assessments(id, pattern, pain, symptoms, medications, red_flags, clinical_examination),
          diagnostic_runs(id, phenotype_ranking, red_flag_result, created_at)
        )
      `
    )
    .order("created_at", { ascending: false })
    .limit(200);

  if (patientsError) {
    console.error("Patient records query failed:", patientsError.message);
  }

  const patients = (patientsData ?? []) as RecordPatient[];

  let clinicianName = "Current Clinician";

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle();

    clinicianName = profile?.full_name || user.email || clinicianName;
  }

  return (
    <div className="h-full">
      <PatientRecords patients={patients} clinicianName={clinicianName} />
    </div>
  );
}
