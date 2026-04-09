import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

// Parse a DOB from any common format (YYYY-MM-DD, DD/MM/YYYY, MM/DD/YYYY,
// YYYY/MM/DD, YYYY.MM.DD, etc.) and return a canonical YYYY-MM-DD string,
// or null if it can't be interpreted as a valid date. This makes verification
// tolerant to whatever separator or ordering the patient or clinician typed.
function canonicalDob(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  // Split on common separators and keep the numeric parts.
  const parts = trimmed.split(/[-/.\s]+/).filter(Boolean);
  if (parts.length !== 3 || parts.some((p) => !/^\d+$/.test(p))) return null;

  const [a, b, c] = parts.map((p) => parseInt(p, 10));

  // Figure out which part is the year (4-digit).
  let year: number, month: number, day: number;
  if (parts[0].length === 4) {
    // YYYY-?-?
    year = a;
    // Ambiguous YYYY-MM-DD vs YYYY-DD-MM — assume MM-DD (ISO-ish).
    month = b;
    day = c;
  } else if (parts[2].length === 4) {
    // ?-?-YYYY — ambiguous DD/MM vs MM/DD. Disambiguate when one field > 12.
    year = c;
    if (a > 12) {
      day = a;
      month = b;
    } else if (b > 12) {
      month = a;
      day = b;
    } else {
      // Both <= 12. Default to DD/MM (international), which matches the
      // UK/EU clinic context.
      day = a;
      month = b;
    }
  } else {
    return null;
  }

  if (
    !Number.isFinite(year) ||
    !Number.isFinite(month) ||
    !Number.isFinite(day) ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31 ||
    year < 1900 ||
    year > 2200
  ) {
    return null;
  }

  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const supabase = createAdminClient();

  const { data: tokenData, error: tokenErr } = await supabase
    .from("questionnaire_tokens")
    .select(`
      id, expires_at, used_at,
      encounter:encounters(
        patient:patients(first_name, last_name, date_of_birth)
      )
    `)
    .eq("token", token)
    .single();

  if (tokenErr || !tokenData) {
    return NextResponse.json({ error: "Invalid link." }, { status: 404 });
  }

  if (tokenData.used_at) {
    return NextResponse.json({ error: "Already submitted." }, { status: 410 });
  }

  if (new Date(tokenData.expires_at) < new Date()) {
    return NextResponse.json({ error: "Link expired." }, { status: 410 });
  }

  // Supabase PostgREST joins return arrays — unwrap with [0]
  const encounterRaw = tokenData.encounter;
  const encounterObj = Array.isArray(encounterRaw) ? encounterRaw[0] : encounterRaw;
  const patientRaw = encounterObj?.patient;
  const patient = Array.isArray(patientRaw) ? patientRaw[0] : patientRaw as {
    first_name: string;
    last_name: string;
    date_of_birth: string | null;
  } | null;

  if (!patient) {
    return NextResponse.json({ error: "Patient record not found." }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));
  const { firstName, lastName, dateOfBirth } = body as {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
  };

  if (!firstName || !lastName) {
    return NextResponse.json(
      { error: "Please enter your first and last name." },
      { status: 400 }
    );
  }

  const nameMatch =
    normalize(firstName) === normalize(patient.first_name) &&
    normalize(lastName) === normalize(patient.last_name);

  if (!nameMatch) {
    return NextResponse.json(
      { error: "The details you entered do not match our records. Please check and try again." },
      { status: 422 }
    );
  }

  if (patient.date_of_birth) {
    if (!dateOfBirth) {
      return NextResponse.json(
        { error: "Please enter your date of birth." },
        { status: 400 }
      );
    }
    const entered = canonicalDob(dateOfBirth);
    const stored = canonicalDob(patient.date_of_birth);
    if (!entered || !stored || entered !== stored) {
      return NextResponse.json(
        { error: "The details you entered do not match our records. Please check and try again." },
        { status: 422 }
      );
    }
  }

  return NextResponse.json({ verified: true });
}
