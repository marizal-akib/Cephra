import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: patientId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { error } = await supabase
    .from("patients")
    .delete()
    .eq("id", patientId)
    .eq("clinician_id", user.id);

  if (error) {
    return NextResponse.json(
      { error: "Unable to delete patient record." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
