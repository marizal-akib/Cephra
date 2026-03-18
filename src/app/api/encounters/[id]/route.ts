import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_STATUSES = ["intake", "in_progress", "red_flagged", "completed"] as const;
type AllowedStatus = (typeof ALLOWED_STATUSES)[number];

export async function PATCH(
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

  const body = (await request.json().catch(() => ({}))) as {
    status?: string;
    current_step?: string | null;
  };

  const updates: { status?: AllowedStatus; current_step?: string | null } = {};

  if (body.status !== undefined) {
    if (!ALLOWED_STATUSES.includes(body.status as AllowedStatus)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }
    updates.status = body.status as AllowedStatus;
  }

  if (body.current_step !== undefined) {
    updates.current_step = body.current_step;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "No valid fields to update." },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("encounters")
    .update(updates)
    .eq("id", encounterId)
    .eq("clinician_id", user.id);

  if (error) {
    return NextResponse.json(
      { error: "Unable to update encounter." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(
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

  const { error } = await supabase
    .from("encounters")
    .delete()
    .eq("id", encounterId)
    .eq("clinician_id", user.id);

  if (error) {
    return NextResponse.json(
      { error: "Unable to delete assessment." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
