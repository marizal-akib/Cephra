import { createClient } from "@supabase/supabase-js";

export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey || serviceRoleKey === "REPLACE_WITH_REAL_SERVICE_ROLE_SECRET") {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not configured. Add the real service role key to .env.local."
    );
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
