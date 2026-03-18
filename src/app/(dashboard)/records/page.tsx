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
  }[];
};

export default async function PatientRecordsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: patientsData } = await supabase
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
          generated_notes(id, content, version, created_at)
        )
      `
    )
    .order("created_at", { ascending: false })
    .limit(200);

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
