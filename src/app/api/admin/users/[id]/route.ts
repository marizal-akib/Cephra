import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

async function getAdminUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") return null;
  return user;
}

type UpdatePayload = {
  action?: "ban" | "unban";
  full_name?: string;
  credentials?: string;
  specialty?: string;
  role?: "admin" | "doctor";
};

// PATCH: Update a user (ban/unban, update profile, change role)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminUser = await getAdminUser();
  if (!adminUser) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  // Prevent admin from modifying their own account via this endpoint
  if (id === adminUser.id) {
    return NextResponse.json(
      { error: "Cannot modify your own account via admin panel." },
      { status: 400 }
    );
  }

  let payload: UpdatePayload;
  try {
    payload = (await request.json()) as UpdatePayload;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const admin = createAdminClient();

  if (payload.action === "ban") {
    const { error } = await admin.auth.admin.updateUserById(id, { ban_duration: "876600h" });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  } else if (payload.action === "unban") {
    const { error } = await admin.auth.admin.updateUserById(id, { ban_duration: "none" });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }

  // Update profile fields if provided
  const profileUpdate: Record<string, unknown> = {};
  if (payload.full_name !== undefined) profileUpdate.full_name = payload.full_name;
  if (payload.credentials !== undefined) profileUpdate.credentials = payload.credentials;
  if (payload.specialty !== undefined) profileUpdate.specialty = payload.specialty;
  if (payload.role !== undefined) profileUpdate.role = payload.role;

  if (Object.keys(profileUpdate).length > 0) {
    const { error } = await admin
      .from("profiles")
      .update(profileUpdate)
      .eq("id", id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }

  return NextResponse.json({ success: true });
}

// DELETE: Remove a user account entirely
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminUser = await getAdminUser();
  if (!adminUser) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  if (id === adminUser.id) {
    return NextResponse.json(
      { error: "Cannot delete your own account." },
      { status: 400 }
    );
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
