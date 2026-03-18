import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateReferenceNumber } from "@/lib/utils";

// GET: Validate token
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  let supabase;
  try {
    supabase = createAdminClient();
  } catch {
    return NextResponse.json(
      { error: "Server configuration error." },
      { status: 500 }
    );
  }

  const { data, error } = await supabase
    .from("questionnaire_tokens")
    .select(`
      id, encounter_id, expires_at, used_at,
      encounter:encounters(
        patient:patients(date_of_birth)
      )
    `)
    .eq("token", token)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Invalid questionnaire link." },
      { status: 404 }
    );
  }

  if (data.used_at) {
    return NextResponse.json(
      { error: "This questionnaire has already been submitted." },
      { status: 410 }
    );
  }

  if (new Date(data.expires_at) < new Date()) {
    return NextResponse.json(
      { error: "This questionnaire link has expired." },
      { status: 410 }
    );
  }

  // Supabase PostgREST joins return arrays — unwrap with [0]
  const encounterRaw = data.encounter;
  const encounterObj = Array.isArray(encounterRaw) ? encounterRaw[0] : encounterRaw;
  const patientRaw = encounterObj?.patient;
  const patient = (Array.isArray(patientRaw) ? patientRaw[0] : patientRaw) as { date_of_birth?: string | null } | null;

  return NextResponse.json({
    valid: true,
    verification: {
      hasDob: !!patient?.date_of_birth,
    },
  });
}

// POST: Submit responses
export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  let supabase;
  try {
    supabase = createAdminClient();
  } catch {
    return NextResponse.json(
      { error: "Server configuration error." },
      { status: 500 }
    );
  }

  // Validate token
  const { data: tokenData, error: tokenErr } = await supabase
    .from("questionnaire_tokens")
    .select("id, encounter_id, expires_at, used_at")
    .eq("token", token)
    .single();

  if (tokenErr || !tokenData) {
    return NextResponse.json({ error: "Invalid link." }, { status: 404 });
  }

  if (tokenData.used_at) {
    return NextResponse.json(
      { error: "Already submitted." },
      { status: 410 }
    );
  }

  if (new Date(tokenData.expires_at) < new Date()) {
    return NextResponse.json({ error: "Link expired." }, { status: 410 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const responses = (body.responses as Record<string, unknown>) || {};
  const referenceNumber = generateReferenceNumber();

  // Insert response first — only mark token used after successful insert
  const { error: respErr } = await supabase.from("questionnaire_responses").insert({
    encounter_id: tokenData.encounter_id,
    token_id: tokenData.id,
    responses,
    partial: false,
    submitted_at: new Date().toISOString(),
    reference_number: referenceNumber,
  });

  if (respErr) {
    return NextResponse.json(
      { error: "Failed to save responses. Please try again." },
      { status: 500 }
    );
  }

  // Only mark token as used after responses are saved successfully
  await supabase
    .from("questionnaire_tokens")
    .update({ used_at: new Date().toISOString() })
    .eq("id", tokenData.id);

  return NextResponse.json({ success: true, referenceNumber });
}
