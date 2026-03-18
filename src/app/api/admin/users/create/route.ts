import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type CreateDoctorPayload = {
  email?: string;
  full_name?: string;
  password?: string;
  credentials?: string;
  specialty?: string;
};

function isServiceRoleConfigured() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return Boolean(key && key !== "REPLACE_WITH_REAL_SERVICE_ROLE_SECRET");
}

export async function POST(request: Request) {
  if (!isServiceRoleConfigured()) {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY is not configured." },
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

  const adminClient = createAdminClient();
  const { data: callerProfile } = await adminClient
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (callerProfile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let payload: CreateDoctorPayload;
  try {
    payload = (await request.json()) as CreateDoctorPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = payload.email?.trim().toLowerCase();
  const fullName = payload.full_name?.trim();
  const password = payload.password?.trim();
  const credentials = payload.credentials?.trim() || null;
  const specialty = payload.specialty?.trim() || null;

  if (!email || !fullName || !password) {
    return NextResponse.json(
      { error: "Email, full name, and password are required." },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 }
    );
  }

  const { data, error } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });

  if (error || !data.user) {
    return NextResponse.json(
      { error: error?.message || "Failed to create doctor account." },
      { status: 400 }
    );
  }

  const { error: profileError } = await adminClient
    .from("profiles")
    .upsert(
      {
        id: data.user.id,
        full_name: fullName,
        role: "doctor",
        credentials,
        specialty,
      },
      { onConflict: "id" }
    );

  if (profileError) {
    return NextResponse.json(
      { error: profileError.message },
      { status: 400 }
    );
  }

  return NextResponse.json({
    message: "Doctor account created successfully.",
    doctor: {
      id: data.user.id,
      email,
      full_name: fullName,
    },
  });
}

