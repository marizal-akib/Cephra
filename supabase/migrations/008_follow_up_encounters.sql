-- Follow-up encounter support

-- Add encounter type and parent link to encounters
alter table encounters
  add column if not exists encounter_type text not null default 'initial'
    check (encounter_type in ('initial', 'follow_up')),
  add column if not exists parent_encounter_id uuid references encounters(id) on delete set null,
  add column if not exists diagnosis_template text;

create index idx_encounters_parent on encounters(parent_encounter_id)
  where parent_encounter_id is not null;

-- Follow-up assessment data (one row per follow-up encounter)
create table follow_up_assessments (
  id uuid primary key default gen_random_uuid(),
  encounter_id uuid not null unique references encounters(id) on delete cascade,
  burden jsonb not null default '{}'::jsonb,
  medication_review jsonb not null default '{}'::jsonb,
  investigations jsonb not null default '{}'::jsonb,
  examination jsonb not null default '{}'::jsonb,
  red_flags jsonb not null default '{}'::jsonb,
  assessment_plan jsonb not null default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS
alter table follow_up_assessments enable row level security;

create policy "follow_up_assessments_own" on follow_up_assessments
  for all using (
    encounter_id in (select id from encounters where clinician_id = auth.uid())
  );

-- Auto-update updated_at
create trigger update_follow_up_assessments_updated_at
  before update on follow_up_assessments
  for each row execute function update_updated_at();
