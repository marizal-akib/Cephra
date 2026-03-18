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

// GET: List all clinician accounts
export async function GET() {
  const adminUser = await getAdminUser();
  if (!adminUser) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin = createAdminClient();

  const { data: profiles, error } = await admin
    .from("profiles")
    .select("id, full_name, credentials, specialty, role, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Failed to load users." }, { status: 500 });
  }

  // Fetch auth user metadata for email and confirmed status
  const { data: authUsers } = await admin.auth.admin.listUsers();
  const authMap = new Map(
    (authUsers?.users ?? []).map((u) => [u.id, u])
  );

  const users = (profiles ?? []).map((p) => {
    const authUser = authMap.get(p.id);
    const bannedUntil = authUser?.banned_until;
    const isBanned = !!bannedUntil && new Date(bannedUntil) > new Date();
    return {
      ...p,
      email: authUser?.email ?? null,
      last_sign_in_at: authUser?.last_sign_in_at ?? null,
      banned: isBanned,
    };
  });

  return NextResponse.json({ users });
}
