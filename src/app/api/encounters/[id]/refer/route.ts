import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type ReferPayload = {
  targetDoctorId?: string;
};

export async function POST(
  request: Request,
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

  const payload = (await request.json().catch(() => ({}))) as ReferPayload;
  const targetDoctorId = payload.targetDoctorId?.trim();

  if (!targetDoctorId) {
    return NextResponse.json({ error: "Target doctor is required." }, { status: 400 });
  }

  if (targetDoctorId === user.id) {
    return NextResponse.json({ error: "Cannot refer assessment to yourself." }, { status: 400 });
  }

  const { data: ownedEncounter, error: encounterError } = await supabase
    .from("encounters")
    .select("id")
    .eq("id", encounterId)
    .eq("clinician_id", user.id)
    .maybeSingle();

  if (encounterError) {
    return NextResponse.json({ error: "Unable to validate encounter." }, { status: 500 });
  }

  if (!ownedEncounter) {
    return NextResponse.json({ error: "Encounter not found." }, { status: 404 });
  }

  const { data: targetDoctor, error: doctorError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", targetDoctorId)
    .maybeSingle();

  if (doctorError) {
    return NextResponse.json({ error: "Unable to validate doctor." }, { status: 500 });
  }

  if (!targetDoctor) {
    return NextResponse.json({ error: "Selected doctor does not exist." }, { status: 400 });
  }

  const { error: referError } = await supabase
    .from("encounters")
    .update({
      clinician_id: targetDoctorId,
      referred_by_clinician_id: user.id,
    })
    .eq("id", encounterId)
    .eq("clinician_id", user.id);

  if (referError) {
    return NextResponse.json({ error: "Unable to refer assessment." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
