import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const supabase = createAdminClient();

  const { data: tokenData, error: tokenErr } = await supabase
    .from("questionnaire_tokens")
    .select(`
      id, expires_at, used_at,
      encounter:encounters(
        patient:patients(first_name, last_name, date_of_birth)
      )
    `)
    .eq("token", token)
    .single();

  if (tokenErr || !tokenData) {
    return NextResponse.json({ error: "Invalid link." }, { status: 404 });
  }

  if (tokenData.used_at) {
    return NextResponse.json({ error: "Already submitted." }, { status: 410 });
  }

  if (new Date(tokenData.expires_at) < new Date()) {
    return NextResponse.json({ error: "Link expired." }, { status: 410 });
  }

  // Supabase PostgREST joins return arrays — unwrap with [0]
  const encounterRaw = tokenData.encounter;
  const encounterObj = Array.isArray(encounterRaw) ? encounterRaw[0] : encounterRaw;
  const patientRaw = encounterObj?.patient;
  const patient = Array.isArray(patientRaw) ? patientRaw[0] : patientRaw as {
    first_name: string;
    last_name: string;
    date_of_birth: string | null;
  } | null;

  if (!patient) {
    return NextResponse.json({ error: "Patient record not found." }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));
  const { firstName, lastName, dateOfBirth } = body as {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
  };

  if (!firstName || !lastName) {
    return NextResponse.json(
      { error: "Please enter your first and last name." },
      { status: 400 }
    );
  }

  const nameMatch =
    normalize(firstName) === normalize(patient.first_name) &&
    normalize(lastName) === normalize(patient.last_name);

  if (!nameMatch) {
    return NextResponse.json(
      { error: "The details you entered do not match our records. Please check and try again." },
      { status: 422 }
    );
  }

  if (patient.date_of_birth) {
    if (!dateOfBirth) {
      return NextResponse.json(
        { error: "Please enter your date of birth." },
        { status: 400 }
      );
    }
    if (dateOfBirth.trim() !== patient.date_of_birth) {
      return NextResponse.json(
        { error: "The details you entered do not match our records. Please check and try again." },
        { status: 422 }
      );
    }
  }

  return NextResponse.json({ verified: true });
}
