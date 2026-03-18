import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name")
    .neq("id", user.id)
    .order("full_name", { ascending: true });

  if (error) {
    return NextResponse.json({ error: "Unable to load doctors." }, { status: 500 });
  }

  return NextResponse.json({
    doctors: (data ?? []).map((doctor) => ({
      id: doctor.id,
      full_name: doctor.full_name,
    })),
  });
}
