import { createClient } from "@/lib/supabase/server";
import { type EncounterStatus } from "@/lib/assessment";
import { DoctorDashboard } from "@/components/dashboard/doctor-dashboard";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";

type DashboardEncounter = {
  id: string;
  status: EncounterStatus;
  encounter_type: "initial" | "follow_up";
  current_step: string | null;
  updated_at: string;
  created_at: string;
  patient: {
    id: string;
    first_name: string;
    last_name: string;
    mrn: string | null;
  } | null;
  questionnaire_tokens: {
    used_at: string | null;
  }[] | null;
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const admin = createAdminClient();
    const { data: profile } = await admin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role === "admin") {
      redirect("/admin");
    }
  }

  const { data } = await supabase
    .from("encounters")
    .select(
      `
        id,
        status,
        encounter_type,
        current_step,
        updated_at,
        created_at,
        questionnaire_tokens(used_at),
        patient:patients(
          id,
          first_name,
          last_name,
          mrn
        )
      `
    )
    .order("updated_at", { ascending: false })
    .limit(100);

  // Unwrap patient arrays from PostgREST joins
  const encounters = ((data ?? []) as unknown as DashboardEncounter[]).map((e) => ({
    ...e,
    patient: Array.isArray(e.patient) ? e.patient[0] ?? null : e.patient,
  }));

  return <DoctorDashboard encounters={encounters} />;
}
