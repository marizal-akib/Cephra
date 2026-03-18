-- Cephra Headache Evaluation Tool - Initial Schema

-- Clinician profiles (extends Supabase auth.users)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  credentials text,
  specialty text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Patient demographics
create table patients (
  id uuid primary key default gen_random_uuid(),
  clinician_id uuid not null references profiles(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  date_of_birth date,
  sex text check (sex in ('male', 'female', 'other')),
  mrn text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Core encounter record
create table encounters (
  id uuid primary key default gen_random_uuid(),
  clinician_id uuid not null references profiles(id) on delete cascade,
  patient_id uuid not null references patients(id) on delete cascade,
  status text not null default 'intake'
    check (status in ('intake', 'in_progress', 'red_flagged', 'completed')),
  current_step text default 'intake',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Tokens for patient questionnaire links
create table questionnaire_tokens (
  id uuid primary key default gen_random_uuid(),
  encounter_id uuid not null references encounters(id) on delete cascade,
  token text not null unique default encode(gen_random_bytes(24), 'hex'),
  expires_at timestamptz not null default (now() + interval '72 hours'),
  used_at timestamptz,
  created_at timestamptz default now()
);

-- Raw patient questionnaire responses
create table questionnaire_responses (
  id uuid primary key default gen_random_uuid(),
  encounter_id uuid not null references encounters(id) on delete cascade,
  token_id uuid not null references questionnaire_tokens(id),
  responses jsonb not null default '{}',
  partial boolean default true,
  submitted_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Clinician-entered assessment data (one row per encounter)
create table clinician_assessments (
  id uuid primary key default gen_random_uuid(),
  encounter_id uuid not null unique references encounters(id) on delete cascade,
  red_flags jsonb default '{}',
  pattern jsonb default '{}',
  pain jsonb default '{}',
  symptoms jsonb default '{}',
  aura jsonb default '{}',
  autonomic jsonb default '{}',
  triggers jsonb default '{}',
  medications jsonb default '{}',
  clinician_notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Versioned diagnostic engine outputs
create table diagnostic_runs (
  id uuid primary key default gen_random_uuid(),
  encounter_id uuid not null references encounters(id) on delete cascade,
  version integer not null default 1,
  input_snapshot jsonb not null,
  red_flag_result jsonb not null,
  phenotype_ranking jsonb not null,
  missing_data jsonb,
  suggested_workup jsonb,
  engine_version text not null default '1.0.0',
  created_at timestamptz default now()
);

-- Generated clinical notes
create table generated_notes (
  id uuid primary key default gen_random_uuid(),
  encounter_id uuid not null references encounters(id) on delete cascade,
  diagnostic_run_id uuid references diagnostic_runs(id),
  content text not null,
  version integer not null default 1,
  created_at timestamptz default now()
);

-- Indexes
create index idx_encounters_clinician on encounters(clinician_id);
create index idx_encounters_patient on encounters(patient_id);
create index idx_questionnaire_tokens_token on questionnaire_tokens(token);
create index idx_diagnostic_runs_encounter on diagnostic_runs(encounter_id);

-- Row-Level Security
alter table profiles enable row level security;
alter table patients enable row level security;
alter table encounters enable row level security;
alter table questionnaire_tokens enable row level security;
alter table questionnaire_responses enable row level security;
alter table clinician_assessments enable row level security;
alter table diagnostic_runs enable row level security;
alter table generated_notes enable row level security;

create policy "profiles_own" on profiles
  for all using (id = auth.uid());

create policy "patients_own" on patients
  for all using (clinician_id = auth.uid());

create policy "encounters_own" on encounters
  for all using (clinician_id = auth.uid());

create policy "tokens_clinician" on questionnaire_tokens
  for all using (
    encounter_id in (select id from encounters where clinician_id = auth.uid())
  );

create policy "responses_clinician_read" on questionnaire_responses
  for select using (
    encounter_id in (select id from encounters where clinician_id = auth.uid())
  );

create policy "assessments_own" on clinician_assessments
  for all using (
    encounter_id in (select id from encounters where clinician_id = auth.uid())
  );

create policy "diagnostic_runs_own" on diagnostic_runs
  for all using (
    encounter_id in (select id from encounters where clinician_id = auth.uid())
  );

create policy "notes_own" on generated_notes
  for all using (
    encounter_id in (select id from encounters where clinician_id = auth.uid())
  );

-- Auto-create profile on user sign-up
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Auto-update updated_at timestamps
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at before update on profiles
  for each row execute function update_updated_at();
create trigger update_patients_updated_at before update on patients
  for each row execute function update_updated_at();
create trigger update_encounters_updated_at before update on encounters
  for each row execute function update_updated_at();
create trigger update_responses_updated_at before update on questionnaire_responses
  for each row execute function update_updated_at();
create trigger update_assessments_updated_at before update on clinician_assessments
  for each row execute function update_updated_at();
