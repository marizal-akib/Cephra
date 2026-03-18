/**
 * DEVELOPMENT DEMO SEED SCRIPT
 *
 * This script creates demo clinician accounts, patients, encounters, and notes.
 * It should only be used for local/dev testing, never for production data.
 */
import { existsSync, readFileSync } from "node:fs";
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

import { runDiagnosticEngine } from "../src/lib/engine";

type SeedClinician = {
  email: string;
  password: string;
  fullName: string;
};

type EncounterStatus = "intake" | "in_progress" | "red_flagged" | "completed";

type SectionPayload = Record<string, unknown>;

type AssessmentPayload = {
  red_flags: SectionPayload;
  pattern: SectionPayload;
  pain: SectionPayload;
  symptoms: SectionPayload;
  aura: SectionPayload;
  autonomic: SectionPayload;
  triggers: SectionPayload;
  medications: SectionPayload;
  clinician_notes: string | null;
};

type DemoPatient = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  sex: "male" | "female" | "other";
  mrn: string;
};

type DemoQuestionnaire = {
  token: string;
  expiresAt: string;
  usedAt: string | null;
  response?: Record<string, unknown>;
};

type DemoScenario = {
  key: string;
  patient: DemoPatient;
  status: EncounterStatus;
  currentStep: string;
  assessment: AssessmentPayload;
  questionnaire: DemoQuestionnaire;
  seedDiagnosticRun: boolean;
  seedGeneratedNote: boolean;
};

const seedClinicians: SeedClinician[] = [
  {
    email: "doctor@clinic.com",
    password: "DevPass123!",
    fullName: "Dr. Test Clinician",
  },
  {
    email: "neurology.dev@clinic.com",
    password: "DevPass123!",
    fullName: "Dr. Neurology Demo",
  },
  {
    email: "headache.dev@clinic.com",
    password: "DevPass123!",
    fullName: "Dr. Headache Demo",
  },
];

const RED_FLAGS_NONE = {
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
} satisfies Record<string, boolean>;

const ASSESSMENT_WAITING: AssessmentPayload = {
  red_flags: RED_FLAGS_NONE,
  pattern: {},
  pain: {},
  symptoms: {},
  aura: {},
  autonomic: {},
  triggers: {},
  medications: {},
  clinician_notes: "Questionnaire sent. Awaiting patient response.",
};

const ASSESSMENT_RESPONSE_RECEIVED: AssessmentPayload = {
  red_flags: RED_FLAGS_NONE,
  pattern: {},
  pain: {},
  symptoms: {},
  aura: {},
  autonomic: {},
  triggers: {},
  medications: {},
  clinician_notes: "Patient questionnaire received. Intake review pending.",
};

const ASSESSMENT_INTAKE_STARTED: AssessmentPayload = {
  red_flags: RED_FLAGS_NONE,
  pattern: {
    headache_days_per_month: 8,
    severe_days_per_month: 4,
    duration_hours: 6,
  },
  pain: {},
  symptoms: {},
  aura: {},
  autonomic: {},
  triggers: {},
  medications: {},
  clinician_notes: "Intake started. Core burden fields captured.",
};

const ASSESSMENT_TENSION_TYPE: AssessmentPayload = {
  red_flags: RED_FLAGS_NONE,
  pattern: {
    headache_days_per_month: 9,
    severe_days_per_month: 2,
    duration_hours: 3,
  },
  pain: {
    bilateral: true,
    pressing: true,
    tightening: true,
    peak_intensity: 5,
    worse_with_activity: false,
    restless_or_pacing: false,
  },
  symptoms: {
    nausea: false,
    vomiting: false,
    photophobia: false,
    phonophobia: false,
  },
  aura: {
    visual_positive: false,
    sensory_positive: false,
  },
  autonomic: {
    lacrimation: false,
    conjunctival_injection: false,
  },
  triggers: {
    stress: true,
    sleep_deprivation: true,
  },
  medications: {
    simple_analgesic_days_per_month: 4,
  },
  clinician_notes: "Typical bilateral pressing pain pattern without migrainous features.",
};

const ASSESSMENT_CLUSTER: AssessmentPayload = {
  red_flags: RED_FLAGS_NONE,
  pattern: {
    duration_minutes: 90,
    attacks_per_day: 2,
    wakes_from_sleep: true,
  },
  pain: {
    unilateral: true,
    orbital: true,
    temporal: true,
    side_locked: true,
    peak_intensity: 9,
    restless_or_pacing: true,
    bilateral: false,
    prefers_to_lie_still: false,
  },
  symptoms: {
    nausea: false,
    photophobia: false,
    phonophobia: false,
  },
  aura: {
    visual_positive: false,
    sensory_positive: false,
  },
  autonomic: {
    lacrimation: true,
    conjunctival_injection: true,
    nasal_congestion: true,
  },
  triggers: {
    alcohol: true,
  },
  medications: {
    response_to_oxygen: true,
  },
  clinician_notes: "Strictly unilateral severe attacks with ipsilateral autonomic signs.",
};

const ASSESSMENT_MIGRAINE_WITH_AURA: AssessmentPayload = {
  red_flags: RED_FLAGS_NONE,
  pattern: {
    duration_hours: 12,
    headache_days_per_month: 6,
    severe_days_per_month: 3,
  },
  pain: {
    unilateral: true,
    pulsating: true,
    peak_intensity: 8,
    worse_with_activity: true,
    prefers_to_lie_still: true,
  },
  symptoms: {
    nausea: true,
    photophobia: true,
    phonophobia: true,
  },
  aura: {
    visual_positive: true,
    sensory_positive: true,
    aura_reversible: true,
    aura_duration_minutes: 20,
    gradual_spread: true,
    headache_follows_aura: true,
    motor_weakness: false,
    diplopia: false,
  },
  autonomic: {
    lacrimation: false,
    conjunctival_injection: false,
  },
  triggers: {
    stress: true,
    menstruation: false,
  },
  medications: {
    triptan_days_per_month: 3,
    response_to_triptan: true,
  },
  clinician_notes: "Recurrent visual/sensory aura followed by migrainous headache.",
};

const ASSESSMENT_MIGRAINE_CHRONIC: AssessmentPayload = {
  red_flags: RED_FLAGS_NONE,
  pattern: {
    duration_hours: 24,
    headache_days_per_month: 20,
    migraine_like_days_per_month: 12,
    severe_days_per_month: 9,
    pattern_duration_months: 8,
    past_episodic_migraine: true,
  },
  pain: {
    unilateral: true,
    pulsating: true,
    peak_intensity: 8,
    worse_with_activity: true,
    prefers_to_lie_still: true,
    continuous_background: false,
  },
  symptoms: {
    nausea: true,
    photophobia: true,
    phonophobia: true,
  },
  aura: {
    visual_positive: false,
    sensory_positive: false,
  },
  autonomic: {
    lacrimation: false,
    conjunctival_injection: false,
  },
  triggers: {
    stress: true,
    sleep_deprivation: true,
  },
  medications: {
    triptan_days_per_month: 7,
    simple_analgesic_days_per_month: 8,
    response_to_triptan: true,
    current_preventive: "Topiramate 50 mg nocte",
    preventive_response: "Partial benefit",
  },
  clinician_notes: "High-frequency migraine pattern consistent with chronic migraine.",
};

const ASSESSMENT_MEDICATION_OVERUSE_RED_FLAG: AssessmentPayload = {
  red_flags: {
    ...RED_FLAGS_NONE,
    age_over_50_new_onset: true,
    scalp_tenderness: true,
  },
  pattern: {
    headache_days_per_month: 25,
    severe_days_per_month: 12,
    migraine_like_days_per_month: 4,
    pattern_duration_months: 2,
    pre_existing_primary_headache: true,
    daily_or_near_daily: true,
    worsening_with_increased_meds: true,
    duration_hours: 10,
  },
  pain: {
    bilateral: true,
    pressing: true,
    peak_intensity: 7,
    worse_with_activity: false,
  },
  symptoms: {
    nausea: false,
    photophobia: false,
    phonophobia: false,
  },
  aura: {
    visual_positive: false,
    sensory_positive: false,
  },
  autonomic: {},
  triggers: {
    cough: false,
    valsalva: false,
    positional_worse_upright: false,
    positional_worse_supine: false,
  },
  medications: {
    triptan_days_per_month: 12,
    opioid_days_per_month: 10,
    combination_analgesic_days_per_month: 14,
    simple_analgesic_days_per_month: 20,
    nsaid_days_per_month: 20,
  },
  clinician_notes:
    "Frequent acute medication use with progressive headache burden; red flags triggered.",
};

const QUESTIONNAIRE_RESPONSE_BASE = {
  age: 38,
  sex: "female",
  pregnancy_status: "no",
  headache_days_per_month: 10,
  severe_days_per_month: 4,
  headache_duration: "4-72hours",
  pain_severity: 7,
  nausea: true,
  vomiting: false,
  light_sensitivity: true,
  sound_sensitivity: true,
  visual_disturbances: false,
  numbness_tingling: false,
  worse_with_activity: true,
  eye_tearing: false,
  nasal_congestion: false,
  sudden_worst_headache: false,
  new_weakness: false,
  fever_with_headache: false,
  recent_head_injury: false,
  headache_pattern_change: true,
  pain_relief_frequency: "1-2_per_week",
  current_medications: "Ibuprofen as needed",
} satisfies Record<string, unknown>;

const DEMO_SCENARIOS: DemoScenario[] = [
  {
    key: "waiting_for_response",
    patient: {
      firstName: "Emily",
      lastName: "Chen",
      dateOfBirth: "1998-06-12",
      sex: "female",
      mrn: "DEMO-0001",
    },
    status: "intake",
    currentStep: "intake",
    assessment: ASSESSMENT_WAITING,
    questionnaire: {
      token: "demo-assessment-1-waiting",
      expiresAt: "2031-01-01T00:00:00.000Z",
      usedAt: null,
    },
    seedDiagnosticRun: false,
    seedGeneratedNote: false,
  },
  {
    key: "response_received_intake",
    patient: {
      firstName: "James",
      lastName: "Wilson",
      dateOfBirth: "1981-04-03",
      sex: "male",
      mrn: "DEMO-0002",
    },
    status: "intake",
    currentStep: "intake",
    assessment: ASSESSMENT_RESPONSE_RECEIVED,
    questionnaire: {
      token: "demo-assessment-2-response",
      expiresAt: "2031-01-01T00:00:00.000Z",
      usedAt: "2030-12-15T09:30:00.000Z",
      response: QUESTIONNAIRE_RESPONSE_BASE,
    },
    seedDiagnosticRun: false,
    seedGeneratedNote: false,
  },
  {
    key: "response_received_in_progress",
    patient: {
      firstName: "Maria",
      lastName: "Garcia",
      dateOfBirth: "1992-09-15",
      sex: "female",
      mrn: "DEMO-0003",
    },
    status: "in_progress",
    currentStep: "intake",
    assessment: ASSESSMENT_INTAKE_STARTED,
    questionnaire: {
      token: "demo-assessment-3-inprogress",
      expiresAt: "2031-01-01T00:00:00.000Z",
      usedAt: "2030-12-16T10:15:00.000Z",
      response: {
        ...QUESTIONNAIRE_RESPONSE_BASE,
        age: 34,
        sex: "female",
        headache_days_per_month: 8,
      },
    },
    seedDiagnosticRun: false,
    seedGeneratedNote: false,
  },
  {
    key: "in_assessment_tension",
    patient: {
      firstName: "Robert",
      lastName: "Kim",
      dateOfBirth: "1984-02-18",
      sex: "male",
      mrn: "DEMO-0004",
    },
    status: "in_progress",
    currentStep: "pain",
    assessment: ASSESSMENT_TENSION_TYPE,
    questionnaire: {
      token: "demo-assessment-4-tension",
      expiresAt: "2031-01-01T00:00:00.000Z",
      usedAt: "2030-12-16T11:20:00.000Z",
      response: {
        ...QUESTIONNAIRE_RESPONSE_BASE,
        age: 42,
        sex: "male",
        pain_severity: 5,
      },
    },
    seedDiagnosticRun: false,
    seedGeneratedNote: false,
  },
  {
    key: "in_assessment_cluster",
    patient: {
      firstName: "Sarah",
      lastName: "Patel",
      dateOfBirth: "1995-11-27",
      sex: "female",
      mrn: "DEMO-0005",
    },
    status: "in_progress",
    currentStep: "autonomic",
    assessment: ASSESSMENT_CLUSTER,
    questionnaire: {
      token: "demo-assessment-5-cluster",
      expiresAt: "2031-01-01T00:00:00.000Z",
      usedAt: "2030-12-16T12:25:00.000Z",
      response: {
        ...QUESTIONNAIRE_RESPONSE_BASE,
        age: 31,
        eye_tearing: true,
        nasal_congestion: true,
      },
    },
    seedDiagnosticRun: false,
    seedGeneratedNote: false,
  },
  {
    key: "note_drafted_migraine_with_aura",
    patient: {
      firstName: "Michael",
      lastName: "Brown",
      dateOfBirth: "1988-08-09",
      sex: "male",
      mrn: "DEMO-0006",
    },
    status: "in_progress",
    currentStep: "note",
    assessment: ASSESSMENT_MIGRAINE_WITH_AURA,
    questionnaire: {
      token: "demo-assessment-6-mwa",
      expiresAt: "2031-01-01T00:00:00.000Z",
      usedAt: "2030-12-16T13:10:00.000Z",
      response: {
        ...QUESTIONNAIRE_RESPONSE_BASE,
        age: 38,
        sex: "male",
        visual_disturbances: true,
        numbness_tingling: true,
      },
    },
    seedDiagnosticRun: true,
    seedGeneratedNote: false,
  },
  {
    key: "completed_migraine_chronic",
    patient: {
      firstName: "Lisa",
      lastName: "Thompson",
      dateOfBirth: "1974-03-24",
      sex: "female",
      mrn: "DEMO-0007",
    },
    status: "completed",
    currentStep: "note",
    assessment: ASSESSMENT_MIGRAINE_CHRONIC,
    questionnaire: {
      token: "demo-assessment-7-completed",
      expiresAt: "2031-01-01T00:00:00.000Z",
      usedAt: "2030-12-16T14:00:00.000Z",
      response: {
        ...QUESTIONNAIRE_RESPONSE_BASE,
        age: 52,
        headache_days_per_month: 20,
        severe_days_per_month: 9,
      },
    },
    seedDiagnosticRun: true,
    seedGeneratedNote: true,
  },
  {
    key: "expired_red_flagged_moh",
    patient: {
      firstName: "David",
      lastName: "Nguyen",
      dateOfBirth: "1966-01-08",
      sex: "male",
      mrn: "DEMO-0008",
    },
    status: "red_flagged",
    currentStep: "red-flags",
    assessment: ASSESSMENT_MEDICATION_OVERUSE_RED_FLAG,
    questionnaire: {
      token: "demo-assessment-8-expired",
      expiresAt: "2020-01-01T00:00:00.000Z",
      usedAt: null,
    },
    seedDiagnosticRun: false,
    seedGeneratedNote: false,
  },
];

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

  if (error) {
    throw error;
  }

  return data.users.find((user) => user.email?.toLowerCase() === email.toLowerCase());
}

async function ensureClinicianUser(
  admin: ReturnType<typeof createClient>,
  clinician: SeedClinician
) {
  const existing = await findUserByEmail(admin, clinician.email);
  if (existing) {
    return existing.id;
  }

  const { data, error } = await admin.auth.admin.createUser({
    email: clinician.email,
    password: clinician.password,
    email_confirm: true,
    user_metadata: {
      full_name: clinician.fullName,
    },
  });

  if (error || !data.user) {
    throw error || new Error(`Could not create user for ${clinician.email}`);
  }

  return data.user.id;
}

async function ensureSimpleEncounter(
  admin: ReturnType<typeof createClient>,
  clinicianId: string,
  firstName: string,
  lastName: string
) {
  const { data: existingPatient, error: patientLookupError } = await admin
    .from("patients")
    .select("id")
    .eq("clinician_id", clinicianId)
    .eq("first_name", firstName)
    .eq("last_name", lastName)
    .limit(1);

  if (patientLookupError) {
    throw patientLookupError;
  }

  let patientId = (existingPatient as { id: string }[] | null)?.[0]?.id as string | undefined;

  if (!patientId) {
    const { data: insertedPatient, error: patientInsertError } = await admin
      .from("patients")
      .insert({
        clinician_id: clinicianId,
        first_name: firstName,
        last_name: lastName,
        sex: "female",
      })
      .select("id")
      .single();

    if (patientInsertError || !insertedPatient) {
      throw patientInsertError || new Error("Could not create patient");
    }
    patientId = insertedPatient.id as string;
  }

  const { data: existingEncounter, error: encounterLookupError } = await admin
    .from("encounters")
    .select("id")
    .eq("clinician_id", clinicianId)
    .eq("patient_id", patientId)
    .limit(1);

  if (encounterLookupError) {
    throw encounterLookupError;
  }

  if (!existingEncounter?.length) {
    const { error: encounterInsertError } = await admin.from("encounters").insert({
      clinician_id: clinicianId,
      patient_id: patientId,
      status: "in_progress",
      current_step: "red-flags",
    });

    if (encounterInsertError) {
      throw encounterInsertError;
    }
  }
}

async function ensureDemoPatient(
  admin: ReturnType<typeof createClient>,
  clinicianId: string,
  patient: DemoPatient
): Promise<string> {
  const { data: existingPatients, error: lookupError } = await admin
    .from("patients")
    .select("id")
    .eq("clinician_id", clinicianId)
    .eq("mrn", patient.mrn)
    .limit(1);

  if (lookupError) {
    throw lookupError;
  }

  const existingPatientId = existingPatients?.[0]?.id as string | undefined;
  if (existingPatientId) {
    const { error: updateError } = await admin
      .from("patients")
      .update({
        first_name: patient.firstName,
        last_name: patient.lastName,
        date_of_birth: patient.dateOfBirth,
        sex: patient.sex,
      })
      .eq("id", existingPatientId);

    if (updateError) {
      throw updateError;
    }

    return existingPatientId;
  }

  const { data: insertedPatient, error: insertError } = await admin
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

  if (insertError || !insertedPatient) {
    throw insertError || new Error(`Could not insert patient ${patient.mrn}`);
  }

  return insertedPatient.id as string;
}

async function ensureDemoEncounter(
  admin: ReturnType<typeof createClient>,
  clinicianId: string,
  patientId: string,
  scenario: DemoScenario
): Promise<string> {
  const { data: existingEncounters, error: lookupError } = await admin
    .from("encounters")
    .select("id")
    .eq("clinician_id", clinicianId)
    .eq("patient_id", patientId)
    .limit(1);

  if (lookupError) {
    throw lookupError;
  }

  const existingEncounterId = existingEncounters?.[0]?.id as string | undefined;
  if (existingEncounterId) {
    const { error: updateError } = await admin
      .from("encounters")
      .update({
        status: scenario.status,
        current_step: scenario.currentStep,
      })
      .eq("id", existingEncounterId);

    if (updateError) {
      throw updateError;
    }

    return existingEncounterId;
  }

  const { data: insertedEncounter, error: insertError } = await admin
    .from("encounters")
    .insert({
      clinician_id: clinicianId,
      patient_id: patientId,
      status: scenario.status,
      current_step: scenario.currentStep,
    })
    .select("id")
    .single();

  if (insertError || !insertedEncounter) {
    throw insertError || new Error(`Could not insert encounter for ${scenario.key}`);
  }

  return insertedEncounter.id as string;
}

async function ensureAssessment(
  admin: ReturnType<typeof createClient>,
  encounterId: string,
  assessment: AssessmentPayload
) {
  const { error } = await admin.from("clinician_assessments").upsert(
    {
      encounter_id: encounterId,
      red_flags: assessment.red_flags,
      pattern: assessment.pattern,
      pain: assessment.pain,
      symptoms: assessment.symptoms,
      aura: assessment.aura,
      autonomic: assessment.autonomic,
      triggers: assessment.triggers,
      medications: assessment.medications,
      clinician_notes: assessment.clinician_notes,
    },
    {
      onConflict: "encounter_id",
    }
  );

  if (error) {
    throw error;
  }
}

async function ensureQuestionnaireData(
  admin: ReturnType<typeof createClient>,
  encounterId: string,
  questionnaire: DemoQuestionnaire
) {
  const { data: existingToken, error: tokenLookupError } = await admin
    .from("questionnaire_tokens")
    .select("id")
    .eq("token", questionnaire.token)
    .maybeSingle();

  if (tokenLookupError) {
    throw tokenLookupError;
  }

  let tokenId = existingToken?.id as string | undefined;
  if (!tokenId) {
    const { data: insertedToken, error: tokenInsertError } = await admin
      .from("questionnaire_tokens")
      .insert({
        encounter_id: encounterId,
        token: questionnaire.token,
        expires_at: questionnaire.expiresAt,
        used_at: questionnaire.usedAt,
      })
      .select("id")
      .single();

    if (tokenInsertError || !insertedToken) {
      throw tokenInsertError || new Error(`Could not insert token ${questionnaire.token}`);
    }
    tokenId = insertedToken.id as string;
  } else {
    const { error: tokenUpdateError } = await admin
      .from("questionnaire_tokens")
      .update({
        encounter_id: encounterId,
        expires_at: questionnaire.expiresAt,
        used_at: questionnaire.usedAt,
      })
      .eq("id", tokenId);

    if (tokenUpdateError) {
      throw tokenUpdateError;
    }
  }

  if (!questionnaire.usedAt || !questionnaire.response) {
    return;
  }

  const { data: existingResponses, error: responseLookupError } = await admin
    .from("questionnaire_responses")
    .select("id")
    .eq("token_id", tokenId)
    .limit(1);

  if (responseLookupError) {
    throw responseLookupError;
  }

  const existingResponseId = existingResponses?.[0]?.id as string | undefined;
  if (existingResponseId) {
    const { error: responseUpdateError } = await admin
      .from("questionnaire_responses")
      .update({
        encounter_id: encounterId,
        responses: questionnaire.response,
        partial: false,
        submitted_at: questionnaire.usedAt,
      })
      .eq("id", existingResponseId);

    if (responseUpdateError) {
      throw responseUpdateError;
    }
    return;
  }

  const { error: responseInsertError } = await admin
    .from("questionnaire_responses")
    .insert({
      encounter_id: encounterId,
      token_id: tokenId,
      responses: questionnaire.response,
      partial: false,
      submitted_at: questionnaire.usedAt,
    });

  if (responseInsertError) {
    throw responseInsertError;
  }
}

async function ensureDiagnosticRun(
  admin: ReturnType<typeof createClient>,
  encounterId: string,
  assessment: AssessmentPayload
): Promise<string> {
  const engineInput = {
    redFlags: assessment.red_flags as Record<string, boolean>,
    pattern: assessment.pattern,
    pain: assessment.pain,
    symptoms: assessment.symptoms,
    aura: assessment.aura,
    autonomic: assessment.autonomic,
    triggers: assessment.triggers,
    medications: assessment.medications,
  };
  const output = runDiagnosticEngine(engineInput);

  const row = {
    encounter_id: encounterId,
    version: 1,
    input_snapshot: engineInput,
    red_flag_result: output.redFlagResult,
    phenotype_ranking: output.phenotypes,
    missing_data: null,
    suggested_workup: output.suggestedWorkup,
    engine_version: output.engineVersion,
  };

  const { data: existingRuns, error: runLookupError } = await admin
    .from("diagnostic_runs")
    .select("id")
    .eq("encounter_id", encounterId)
    .eq("version", 1)
    .limit(1);

  if (runLookupError) {
    throw runLookupError;
  }

  const existingRunId = existingRuns?.[0]?.id as string | undefined;
  if (existingRunId) {
    const { error: runUpdateError } = await admin
      .from("diagnostic_runs")
      .update(row)
      .eq("id", existingRunId);

    if (runUpdateError) {
      throw runUpdateError;
    }
    return existingRunId;
  }

  const { data: insertedRun, error: runInsertError } = await admin
    .from("diagnostic_runs")
    .insert(row)
    .select("id")
    .single();

  if (runInsertError || !insertedRun) {
    throw runInsertError || new Error(`Could not insert diagnostic run for ${encounterId}`);
  }

  return insertedRun.id as string;
}

async function ensureGeneratedNote(
  admin: ReturnType<typeof createClient>,
  encounterId: string,
  diagnosticRunId: string
) {
  const content =
    "Headache follow-up: clinical phenotype most consistent with migraine spectrum disorder with chronic pattern. Continue preventive strategy, optimize acute medication limits, and review red-flag evolution.";

  const { data: existingNotes, error: noteLookupError } = await admin
    .from("generated_notes")
    .select("id")
    .eq("encounter_id", encounterId)
    .eq("version", 1)
    .limit(1);

  if (noteLookupError) {
    throw noteLookupError;
  }

  const existingNoteId = existingNotes?.[0]?.id as string | undefined;
  if (existingNoteId) {
    const { error: noteUpdateError } = await admin
      .from("generated_notes")
      .update({
        diagnostic_run_id: diagnosticRunId,
        content,
      })
      .eq("id", existingNoteId);

    if (noteUpdateError) {
      throw noteUpdateError;
    }
    return;
  }

  const { error: noteInsertError } = await admin.from("generated_notes").insert({
    encounter_id: encounterId,
    diagnostic_run_id: diagnosticRunId,
    content,
    version: 1,
  });

  if (noteInsertError) {
    throw noteInsertError;
  }
}

async function seedDemoEncounters(
  admin: ReturnType<typeof createClient>,
  clinicianId: string,
  clinicianEmail: string
) {
  const clinicianPrefix = clinicianEmail
    .split("@")[0]
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .toLowerCase();

  for (const scenario of DEMO_SCENARIOS) {
    const patientId = await ensureDemoPatient(admin, clinicianId, scenario.patient);
    const encounterId = await ensureDemoEncounter(
      admin,
      clinicianId,
      patientId,
      scenario
    );

    await ensureAssessment(admin, encounterId, scenario.assessment);
    await ensureQuestionnaireData(admin, encounterId, {
      ...scenario.questionnaire,
      token: `${clinicianPrefix}-${scenario.questionnaire.token}`,
    });

    let diagnosticRunId: string | null = null;
    if (scenario.seedDiagnosticRun || scenario.seedGeneratedNote) {
      diagnosticRunId = await ensureDiagnosticRun(admin, encounterId, scenario.assessment);
    }

    if (scenario.seedGeneratedNote && diagnosticRunId) {
      await ensureGeneratedNote(admin, encounterId, diagnosticRunId);
    }
  }
}

async function main() {
  const supabaseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

  if (serviceRoleKey === "REPLACE_WITH_REAL_SERVICE_ROLE_SECRET") {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is still a placeholder. Replace it before running seed."
    );
  }

  const admin = createClient(supabaseUrl, serviceRoleKey);

  for (const clinician of seedClinicians) {
    const clinicianId = await ensureClinicianUser(admin, clinician);

    const { error: profileUpsertError } = await admin.from("profiles").upsert(
      {
        id: clinicianId,
        full_name: clinician.fullName,
      },
      {
        onConflict: "id",
      }
    );

    if (profileUpsertError) {
      throw profileUpsertError;
    }

    await seedDemoEncounters(admin, clinicianId, clinician.email);
  }

  console.log("Seed complete.");
  console.log("Primary dev login: doctor@clinic.com / DevPass123!");
}

main().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
