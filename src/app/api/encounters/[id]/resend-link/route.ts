import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateQuestionnaireUrl } from "@/lib/utils";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: encounterId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { data: encounter, error: encounterError } = await supabase
    .from("encounters")
    .select("id")
    .eq("id", encounterId)
    .eq("clinician_id", user.id)
    .maybeSingle();

  if (encounterError || !encounter) {
    return NextResponse.json({ error: "Encounter not found." }, { status: 404 });
  }

  const { data: tokenRow, error: tokenError } = await supabase
    .from("questionnaire_tokens")
    .insert({ encounter_id: encounterId })
    .select("token, created_at")
    .single();

  if (tokenError || !tokenRow) {
    return NextResponse.json(
      { error: "Unable to refresh questionnaire link." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    token: tokenRow.token,
    createdAt: tokenRow.created_at,
    url: generateQuestionnaireUrl(tokenRow.token),
  });
}
