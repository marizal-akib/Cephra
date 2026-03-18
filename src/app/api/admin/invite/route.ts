import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getAppUrl } from "@/lib/utils";

type InvitePayload = {
  email?: string;
  full_name?: string;
};

function isServiceRoleConfigured() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return Boolean(key && key !== "REPLACE_WITH_REAL_SERVICE_ROLE_SECRET");
}

export async function POST(request: Request) {
  if (!isServiceRoleConfigured()) {
    return NextResponse.json(
      {
        error:
          "SUPABASE_SERVICE_ROLE_KEY is not configured. Add the real service role key in .env.local.",
      },
      { status: 500 }
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Only admins can invite new users
  const adminClient = createAdminClient();
  const { data: callerProfile } = await adminClient
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (callerProfile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let payload: InvitePayload;
  try {
    payload = (await request.json()) as InvitePayload;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  const email = payload.email?.trim().toLowerCase();
  const fullName = payload.full_name?.trim() || null;

  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const { data, error } = await adminClient.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${getAppUrl()}/callback`,
    data: {
      full_name: fullName,
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({
    message: "Invite sent successfully.",
    user: data.user,
  });
}
