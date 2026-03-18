-- Add clinician feedback fields for expanded workflow and sign-off

alter table clinician_assessments
  add column if not exists past_medical_history jsonb not null default '{}'::jsonb,
  add column if not exists clinical_examination jsonb not null default '{}'::jsonb,
  add column if not exists workup_data jsonb not null default '{}'::jsonb,
  add column if not exists follow_up jsonb not null default '{}'::jsonb;

alter table profiles
  add column if not exists designation text;
