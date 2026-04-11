/**
 * DEMO INITIAL ASSESSMENT SEED
 *
 * Creates (or updates) a single encounter whose clinician_assessments row has
 * every section populated — red flags, PMH, pattern, pain, symptoms, aura,
 * autonomic, triggers, meds, previous investigations, clinical examination,
 * workup plan (with prescription), and follow-up.
 *
 * Purpose: open the encounter in the UI and eyeball all sections without
 * manually walking through the 14-step intake flow.
 *
 * Idempotent — rerunning upserts the same patient/encounter/assessment by
 * fixed MRN and `onConflict: "encounter_id"`.
 *
 * Usage:
 *   npx tsx scripts/seed-demo-assessment.ts
 */
import { existsSync, readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { resolve } from "node:path";

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

import { createClient } from "@supabase/supabase-js";

const DEMO_CLINICIAN = {
  email: "doctor@clinic.com",
  password: "DevPass123!",
  fullName: "Dr. Test Clinician",
};

const DEMO_PATIENT = {
  firstName: "Eleanor",
  lastName: "Ross",
  dateOfBirth: "1985-07-22",
  sex: "female" as const,
  mrn: "DEMO-COMPLETE-0001",
};

// A second patient with status=completed so the Assessment Report view at
// /encounters/:id/report has something to display out of the box.
const DEMO_PATIENT_COMPLETED = {
  firstName: "Marcus",
  lastName: "Fielding",
  dateOfBirth: "1979-11-04",
  sex: "male" as const,
  mrn: "DEMO-REPORT-0001",
};

const DEMO_NOTE_CONTENT = `CEPHRA HEADACHE CLINIC — INITIAL ASSESSMENT LETTER
===================================================

PATIENT DETAILS
===============
Name: Marcus Fielding
DOB: 4 Nov 1979 (46 years)
Sex: Male
MRN: DEMO-REPORT-0001

WORKING DIAGNOSIS
=================
Episodic migraine with aura (ICHD-3 1.2.1), moderate-high frequency with
significant functional impact. Features supporting diagnosis:
- Unilateral pulsating pain (peak 9/10), alternating sides
- Photophobia, phonophobia, nausea
- Reversible visual aura (fortification spectra) preceding headache
- Worsening with activity, prefers to lie still

Current frequency: 10 headache days/month, 4 severe, 8 migraine-like.

RED FLAG SYMPTOMS AND SIGNS
===========================
All 16 red flag items screened negative. Normal neurological examination.
Previous MRI brain (2025-09-10) unremarkable.

HISTORY OF PRESENTING COMPLAINT
===============================
Longstanding episodic migraine since adolescence. Attack frequency has
escalated over 6 months. Perimenstrual clustering noted. Triggers include
stress, sleep deprivation, missed meals. Current acute treatment: sumatriptan
50mg PRN with good response; ibuprofen 400mg PRN as adjunct.

CLINICAL EXAMINATION
====================
Vitals: HR 72, BP 118/76, SpO₂ 99%, T 36.7°C, BMI 25.0
GCS 15 (E4 V5 M6)
Neurology: gait, cranial nerves, fundoscopy, motor, sensory, cerebellar,
reflexes — all normal.

ASSESSMENT MANAGEMENT AND FOLLOW UP PLAN
========================================
Meets criteria for preventive therapy given ≥4 migraine days/month with
functional impact.

Plan:
1. Initiate propranolol 40mg BD preventive (180 tablets, 3 months)
2. Continue sumatriptan 50mg PRN for acute attacks
3. Lifestyle measures: consistent sleep, regular meals, hydration,
   stress management
4. Headache diary for next visit

Safety netting: Return immediately / attend A&E if sudden severe 'worst ever'
headache, new weakness or numbness, visual loss, confusion, fever with neck
stiffness, seizure, or any symptoms that feel different from usual migraine.

Follow-up: Clinic review in 12 weeks to assess response to propranolol.

Dr. Test Clinician
Cephra Headache Clinic
`;


// ─────────────────────────────────────────────────────────────────────────────
// Assessment payload — every JSONB section filled.
// Field names verified against src/lib/schemas/*.ts.
// ─────────────────────────────────────────────────────────────────────────────

const RED_FLAGS = {
  thunderclap_onset: false,
  focal_deficit: false,
  seizure: false,
  confusion: false,
  fever: false,
  weight_loss: false,
  cancer_history: false,
  immunosuppression: false,
  pregnancy_new_headache: false,
  postpartum_new_headache: false,
  age_over_50_new_onset: false,
  papilloedema_symptoms: false,
  trauma: false,
  anticoagulation: false,
  jaw_claudication: false,
  scalp_tenderness: false,
  notes: "No red flags identified on screening. Screened all 16 items.",
};

const PAST_MEDICAL_HISTORY = {
  common_conditions: ["anxiety_depression"],
  notes: "Generalised anxiety, managed with CBT. No other significant PMH.",
};

const PATTERN = {
  first_headache_age: 18,
  current_pattern_start: "Approximately 6 months ago",
  gradual_onset: true,
  sudden_onset: false,
  time_to_peak_minutes: 60,
  duration_hours: 12,
  duration_minutes: 0,
  duration_minutes_na: false,
  headache_days_per_month: 10,
  severe_days_per_month: 4,
  migraine_like_days_per_month: 8,
  attacks_per_day: 1,
  attacks_per_day_na: false,
  attacks_per_month: 10,
  pain_free_intervals: true,
  continuous_background_pain: false,
  change_from_baseline: true,
  pattern_duration_months: 6,
  pre_existing_primary_headache: true,
  past_episodic_migraine: true,
  daily_or_near_daily: false,
  worsening_with_increased_meds: false,
  wakes_from_sleep: false,
  notes:
    "Longstanding episodic migraine since adolescence. Attack frequency has increased over the past 6 months from ~4 to ~10 days/month.",
  functional_impact_notes:
    "Missed 3 workdays last month. Unable to care for children during severe attacks.",
};

const PAIN = {
  unilateral: true,
  bilateral: false,
  side_locked: false,
  alternating_sides: true,
  frontal: false,
  temporal: true,
  orbital: false,
  supraorbital: false,
  occipital: false,
  neck_predominant: false,
  generalized: false,
  unable_to_characterize: false,
  pulsating: true,
  pressing: false,
  tightening: false,
  stabbing: false,
  burning: false,
  boring: false,
  avg_intensity: 7,
  peak_intensity: 9,
  worse_with_activity: true,
  prefers_to_lie_still: true,
  restless_or_pacing: false,
  continuous_background: false,
  notes: "Throbbing temporal pain, alternates sides between attacks.",
};

const SYMPTOMS = {
  nausea: true,
  vomiting: false,
  photophobia: true,
  phonophobia: true,
  osmophobia: true,
  motion_sensitivity: true,
  dizziness: false,
  fatigue: true,
  neck_pain: true,
  associated_symptoms_notes:
    "Strong sensitivity to perfume and cooking smells. Fatigue persists 1 day postdrome.",
};

const AURA = {
  visual_positive: true,
  visual_negative: false,
  sensory_positive: false,
  sensory_negative: false,
  speech_disturbance: false,
  motor_weakness: false,
  diplopia: false,
  vertigo: false,
  aura_duration_minutes: 25,
  aura_reversible: true,
  gradual_spread: true,
  headache_follows_aura: true,
  notes:
    "Zigzag fortification spectra spreading across the left visual field over ~10 minutes, fully reversible.",
};

const AUTONOMIC = {
  autonomic_features_na: true,
  lacrimation: false,
  conjunctival_injection: false,
  rhinorrhoea: false,
  nasal_congestion: false,
  ptosis: false,
  miosis: false,
  eyelid_oedema: false,
  facial_sweating: false,
  ear_fullness: false,
  notes: "No cranial autonomic features reported.",
};

const TRIGGERS = {
  alcohol: false,
  menstruation: true,
  sleep_deprivation: true,
  stress: true,
  missed_meals: true,
  exertion: false,
  cough: false,
  valsalva: false,
  positional_worse_upright: false,
  positional_worse_supine: false,
  triggers_notes:
    "Perimenstrual clustering (3 of 5 attacks in the 2 days before menses). Poor sleep and work stress are consistent triggers.",
};

const MEDICATIONS = {
  triptan_days_per_month: 8,
  nsaid_days_per_month: 6,
  paracetamol_days_per_month: 2,
  opioid_days_per_month: 0,
  simple_analgesic_days_per_month: 2,
  combination_analgesic_days_per_month: 0,
  response_to_triptan: true,
  response_to_oxygen: false,
  response_to_indomethacin: false,
  current_preventive: "",
  preventive_response: "",
  current_medications_text:
    "Sumatriptan 50mg PRN (up to 2 tabs/attack), ibuprofen 400mg PRN.",
  medication_actions: [
    {
      drug: "Sumatriptan 50mg",
      type: "acute" as const,
      dose: "50mg PO at attack onset, may repeat after 2h (max 200mg/day)",
      benefit: "good",
      tolerability: "well_tolerated",
      action: "continue" as const,
    },
    {
      drug: "Ibuprofen 400mg",
      type: "acute" as const,
      dose: "400mg PO with food",
      benefit: "moderate",
      tolerability: "acceptable",
      action: "continue" as const,
    },
  ],
};

const PREVIOUS_INVESTIGATIONS = {
  results: [
    {
      name: "MRI Brain",
      result: "Normal",
      interpretation:
        "No intracranial pathology, no white matter lesions. Performed 2025-09-10 at outside clinic.",
    },
    {
      name: "FBC",
      result: "Normal",
      interpretation: "Haemoglobin, WCC, platelets all within normal limits.",
    },
  ],
  notes: "Imaging and bloods unremarkable.",
};

const CLINICAL_EXAMINATION = {
  anaemia: "absent" as const,
  cyanosis: "absent" as const,
  lymphadenopathy: "absent" as const,
  peripheral_oedema: "absent" as const,

  heart_rate_bpm: 72,
  bp_systolic: 118,
  bp_diastolic: 76,
  oxygen_saturation: 99,
  temperature: 36.7,
  weight_kg: 68,
  height_cm: 165,
  bmi: 25.0,

  gcs_eye: 4,
  gcs_verbal: 5,
  gcs_motor: 6,
  gcs_total: 15,

  gait_status: "normal" as const,
  gait_details: "Normal base and stride, no ataxia.",
  cranial_nerves_status: "normal" as const,
  cranial_nerves_details: "CN II-XII grossly intact, pupils equal and reactive.",
  fundoscopy_status: "normal" as const,
  fundoscopy_details: "Discs sharp, no papilloedema, spontaneous venous pulsations present.",
  motor_status: "normal" as const,
  motor_details: "Power 5/5 throughout all four limbs, tone normal.",
  sensory_status: "normal" as const,
  sensory_details: "Light touch, pinprick and proprioception intact.",
  cerebellar_status: "normal" as const,
  cerebellar_details: "Finger-nose, heel-shin, rapid alternating movements all normal.",
  reflexes_status: "normal" as const,
  reflexes_details: "Symmetric 2+ throughout, plantars downgoing.",

  notes: "Well, comfortable at rest. General and neurological examination unremarkable.",
};

const WORKUP_DATA = {
  workup_notes:
    "Episodic migraine with aura, features consistent with ICHD-3 1.2.1. " +
    "Attack frequency has escalated over 6 months, now 10 headache days/month with perimenstrual clustering. " +
    "No red flags. Previous MRI brain normal. Appropriate for preventive therapy given functional impact.",
  accepted_workup_items: {} as Record<string, boolean>,
  include_workup_suggestions: true,
  key_diagnostic_question:
    "Is preventive therapy indicated given ≥4 migraine days/month with functional impact?",
  investigation_results: [
    {
      name: "MRI Brain",
      result: "Normal",
      interpretation:
        "No intracranial pathology, no white matter lesions. Performed 2025-09-10 at outside clinic.",
    },
  ],
  pending_investigations: "",
  assessment_summary:
    "40-year-old woman with longstanding episodic migraine with visual aura, now with increasing frequency " +
    "(10 days/month, 4 severe) and significant functional impact. No red flags. Imaging normal. " +
    "Meets criteria for preventive therapy.",
  treatment_changes:
    "Initiate propranolol 40mg BD as first-line preventive. Continue sumatriptan 50mg PRN for acute attacks. " +
    "Advised lifestyle measures: consistent sleep, regular meals, hydration, stress management. " +
    "Headache diary requested for next visit.",
  prescriptions: [
    {
      id: randomUUID(),
      medication_name: "Propranolol",
      dosage: "40mg",
      frequency: "twice daily",
      route: "oral",
      duration_value: 3,
      duration_unit: "months",
      quantity: "180 tablets",
      category: "preventive",
      indication: "Migraine prevention",
      special_instructions:
        "Take with food. Warn patient re: fatigue, cold extremities, avoid if asthmatic.",
      prescriber_name: DEMO_CLINICIAN.fullName,
      prescribed_date: new Date().toISOString().slice(0, 10),
      status: "active" as const,
    },
  ],
};

const FOLLOW_UP = {
  follow_up_date: "2026-07-15",
  follow_up_time: "10:00",
  follow_up_type: "clinic" as const,
  follow_up_purpose:
    "Review response to propranolol preventive therapy, reassess headache diary and attack frequency.",
  follow_up_clinician: DEMO_CLINICIAN.fullName,
  safety_counselling:
    "Return immediately or attend A&E if: sudden severe 'worst ever' headache, new weakness/numbness, " +
    "visual loss, confusion, fever with neck stiffness, seizure, or any symptoms that feel different " +
    "from usual migraine.",
};

const CLINICIAN_NOTES =
  "Complete initial assessment demo — episodic migraine with aura, moderate-high frequency, starting propranolol preventive.";

// ─────────────────────────────────────────────────────────────────────────────
// Seeding helpers
// ─────────────────────────────────────────────────────────────────────────────

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

async function findUserByEmail(
  admin: ReturnType<typeof createClient>,
  email: string
) {
  const { data, error } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });
  if (error) throw error;
  return data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
}

async function ensureClinician(admin: ReturnType<typeof createClient>): Promise<string> {
  const existing = await findUserByEmail(admin, DEMO_CLINICIAN.email);
  if (existing) return existing.id;

  const { data, error } = await admin.auth.admin.createUser({
    email: DEMO_CLINICIAN.email,
    password: DEMO_CLINICIAN.password,
    email_confirm: true,
    user_metadata: { full_name: DEMO_CLINICIAN.fullName },
  });
  if (error || !data.user) {
    throw error || new Error(`Could not create clinician ${DEMO_CLINICIAN.email}`);
  }
  return data.user.id;
}

async function ensureProfile(
  admin: ReturnType<typeof createClient>,
  clinicianId: string
) {
  const { error } = await admin
    .from("profiles")
    .upsert(
      { id: clinicianId, full_name: DEMO_CLINICIAN.fullName },
      { onConflict: "id" }
    );
  if (error) throw error;
}

type DemoPatient = typeof DEMO_PATIENT;

async function ensurePatient(
  admin: ReturnType<typeof createClient>,
  clinicianId: string,
  patient: DemoPatient
): Promise<string> {
  const { data: existing, error: lookupError } = await admin
    .from("patients")
    .select("id")
    .eq("clinician_id", clinicianId)
    .eq("mrn", patient.mrn)
    .limit(1);
  if (lookupError) throw lookupError;

  const existingId = existing?.[0]?.id as string | undefined;
  if (existingId) {
    const { error: updateError } = await admin
      .from("patients")
      .update({
        first_name: patient.firstName,
        last_name: patient.lastName,
        date_of_birth: patient.dateOfBirth,
        sex: patient.sex,
      })
      .eq("id", existingId);
    if (updateError) throw updateError;
    return existingId;
  }

  const { data: inserted, error: insertError } = await admin
    .from("patients")
    .insert({
      clinician_id: clinicianId,
      first_name: patient.firstName,
      last_name: patient.lastName,
      date_of_birth: patient.dateOfBirth,
      sex: patient.sex,
      mrn: patient.mrn,
    })
    .select("id")
    .single();
  if (insertError || !inserted) {
    throw insertError || new Error(`Could not insert patient ${patient.mrn}`);
  }
  return inserted.id as string;
}

async function ensureEncounter(
  admin: ReturnType<typeof createClient>,
  clinicianId: string,
  patientId: string,
  status: "in_progress" | "completed",
  currentStep: string
): Promise<string> {
  const { data: existing, error: lookupError } = await admin
    .from("encounters")
    .select("id")
    .eq("clinician_id", clinicianId)
    .eq("patient_id", patientId)
    .limit(1);
  if (lookupError) throw lookupError;

  const existingId = existing?.[0]?.id as string | undefined;
  if (existingId) {
    const { error: updateError } = await admin
      .from("encounters")
      .update({ status, current_step: currentStep })
      .eq("id", existingId);
    if (updateError) throw updateError;
    return existingId;
  }

  const { data: inserted, error: insertError } = await admin
    .from("encounters")
    .insert({
      clinician_id: clinicianId,
      patient_id: patientId,
      status,
      current_step: currentStep,
    })
    .select("id")
    .single();
  if (insertError || !inserted) {
    throw insertError || new Error("Could not insert encounter");
  }
  return inserted.id as string;
}

async function upsertGeneratedNote(
  admin: ReturnType<typeof createClient>,
  encounterId: string,
  content: string
) {
  // Look up any existing note for this encounter and either update it or
  // insert a v1. Idempotent across reruns.
  const { data: existing } = await admin
    .from("generated_notes")
    .select("id")
    .eq("encounter_id", encounterId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const existingId = existing?.id as string | undefined;
  if (existingId) {
    const { error: updateError } = await admin
      .from("generated_notes")
      .update({ content })
      .eq("id", existingId);
    if (updateError) throw updateError;
    return;
  }

  const { error: insertError } = await admin
    .from("generated_notes")
    .insert({ encounter_id: encounterId, content, version: 1 });
  if (insertError) throw insertError;
}

async function upsertAssessment(
  admin: ReturnType<typeof createClient>,
  encounterId: string
) {
  const { error } = await admin.from("clinician_assessments").upsert(
    {
      encounter_id: encounterId,
      red_flags: RED_FLAGS,
      past_medical_history: PAST_MEDICAL_HISTORY,
      pattern: PATTERN,
      pain: PAIN,
      symptoms: SYMPTOMS,
      aura: AURA,
      autonomic: AUTONOMIC,
      triggers: TRIGGERS,
      medications: MEDICATIONS,
      previous_investigations: PREVIOUS_INVESTIGATIONS,
      clinical_examination: CLINICAL_EXAMINATION,
      workup_data: WORKUP_DATA,
      follow_up: FOLLOW_UP,
      clinician_notes: CLINICIAN_NOTES,
    },
    { onConflict: "encounter_id" }
  );
  if (error) throw error;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const supabaseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log("→ Ensuring demo clinician...");
  const clinicianId = await ensureClinician(admin);
  await ensureProfile(admin, clinicianId);

  // ── Scenario 1: in_progress assessment (Eleanor Ross) ──
  console.log("→ [1/2] Ensuring in-progress demo patient...");
  const patientId = await ensurePatient(admin, clinicianId, DEMO_PATIENT);

  console.log("→ [1/2] Ensuring in-progress encounter...");
  const encounterId = await ensureEncounter(
    admin,
    clinicianId,
    patientId,
    "in_progress",
    "workup"
  );

  console.log("→ [1/2] Upserting complete assessment...");
  await upsertAssessment(admin, encounterId);

  // ── Scenario 2: completed assessment with note (Marcus Fielding) ──
  console.log("→ [2/2] Ensuring completed demo patient...");
  const patientIdCompleted = await ensurePatient(
    admin,
    clinicianId,
    DEMO_PATIENT_COMPLETED
  );

  console.log("→ [2/2] Ensuring completed encounter...");
  const encounterIdCompleted = await ensureEncounter(
    admin,
    clinicianId,
    patientIdCompleted,
    "completed",
    "note"
  );

  console.log("→ [2/2] Upserting complete assessment...");
  await upsertAssessment(admin, encounterIdCompleted);

  console.log("→ [2/2] Upserting generated clinic note...");
  await upsertGeneratedNote(admin, encounterIdCompleted, DEMO_NOTE_CONTENT);

  console.log("");
  console.log("✓ Demo assessments seeded.");
  console.log("");
  console.log(`  Clinician: ${DEMO_CLINICIAN.email} / ${DEMO_CLINICIAN.password}`);
  console.log("");
  console.log(
    `  [In progress]  ${DEMO_PATIENT.firstName} ${DEMO_PATIENT.lastName} (${DEMO_PATIENT.mrn})`
  );
  console.log(`    → http://localhost:3000/encounters/${encounterId}/workup`);
  console.log("");
  console.log(
    `  [Completed]    ${DEMO_PATIENT_COMPLETED.firstName} ${DEMO_PATIENT_COMPLETED.lastName} (${DEMO_PATIENT_COMPLETED.mrn})`
  );
  console.log(
    `    → http://localhost:3000/encounters/${encounterIdCompleted}/report`
  );
  console.log("");
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
