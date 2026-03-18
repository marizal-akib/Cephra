import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { createClient } from "@supabase/supabase-js";

const envPath = resolve(process.cwd(), ".env.local");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf-8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx < 0) continue;
    const key = trimmed.slice(0, eqIdx);
    const val = trimmed.slice(eqIdx + 1);
    if (!process.env[key]) process.env[key] = val;
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment."
  );
}

if (serviceRoleKey === "REPLACE_WITH_REAL_SERVICE_ROLE_SECRET") {
  throw new Error(
    "SUPABASE_SERVICE_ROLE_KEY is still a placeholder. Update .env.local first."
  );
}

const admin = createClient(supabaseUrl, serviceRoleKey);

const TABLES_IN_DELETE_ORDER = [
  "generated_notes",
  "diagnostic_runs",
  "questionnaire_responses",
  "questionnaire_tokens",
  "clinician_assessments",
  "encounters",
  "patients",
  "profiles",
] as const;

async function promptValue(
  rl: ReturnType<typeof createInterface>,
  question: string,
  fallback: string
) {
  if (!process.stdin.isTTY) return fallback;
  const answer = (await rl.question(`${question} [${fallback}]: `)).trim();
  return answer || fallback;
}

async function deleteApplicationData() {
  for (const table of TABLES_IN_DELETE_ORDER) {
    const { error } = await admin.from(table).delete().not("id", "is", null);
    if (error) {
      throw new Error(`Failed to clear ${table}: ${error.message}`);
    }
    console.log(`Cleared table: ${table}`);
  }
}

async function deleteAllAuthUsers() {
  const { data, error } = await admin.auth.admin.listUsers();
  if (error) {
    throw new Error(`Failed to list auth users: ${error.message}`);
  }

  const users = data?.users ?? [];
  for (const user of users) {
    const { error: deleteError } = await admin.auth.admin.deleteUser(user.id);
    if (deleteError) {
      throw new Error(
        `Failed to delete auth user ${user.email ?? user.id}: ${deleteError.message}`
      );
    }
    console.log(`Deleted auth user: ${user.email ?? user.id}`);
  }
}

async function createSingleAdmin(adminEmail: string, adminPassword: string) {
  const { data, error } = await admin.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    email_confirm: true,
    user_metadata: {
      full_name: "Admin",
    },
  });

  if (error || !data.user) {
    throw new Error(`Failed to create admin auth user: ${error?.message}`);
  }

  const adminUserId = data.user.id;

  const profileWithRole = await admin.from("profiles").upsert(
    {
      id: adminUserId,
      full_name: "Admin",
      role: "admin",
    },
    { onConflict: "id" }
  );

  if (profileWithRole.error) {
    // Some environments may not have run migration 006 yet.
    // Fall back to profile creation without role so login still works.
    if (
      profileWithRole.error.message.includes("role") &&
      profileWithRole.error.message.includes("profiles")
    ) {
      const { error: fallbackError } = await admin.from("profiles").upsert(
        {
          id: adminUserId,
          full_name: "Admin",
        },
        { onConflict: "id" }
      );
      if (fallbackError) {
        throw new Error(
          `Failed to create admin profile (fallback): ${fallbackError.message}`
        );
      }
      console.warn(
        "Warning: profiles.role column not found. Admin role flag was not set. Run migration 006_add_role_to_profiles.sql."
      );
    } else {
      throw new Error(
        `Failed to create admin profile: ${profileWithRole.error.message}`
      );
    }
  }

  return adminUserId;
}

async function main() {
  console.log("This will permanently delete development/test data and accounts.");
  console.log("Starting fresh-start reset...");

  const rl = createInterface({ input, output });
  try {
    const adminEmail = await promptValue(rl, "Admin email", "admin@clinic.com");
    const adminPassword = await promptValue(rl, "Admin password", "ChangeMe123!");

    await deleteApplicationData();
    await deleteAllAuthUsers();
    const adminUserId = await createSingleAdmin(adminEmail, adminPassword);

    console.log("");
    console.log("Reset complete.");
    console.log(`Admin user id: ${adminUserId}`);
    console.log(`Admin email: ${adminEmail}`);
    console.log(`Admin password: ${adminPassword}`);
    console.log("Log in with this admin account and create doctor accounts from /admin.");
  } finally {
    rl.close();
  }
}

main().catch((error) => {
  console.error("Reset failed:", error);
  process.exit(1);
});

