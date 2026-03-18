alter table encounters
  add column referred_by_clinician_id uuid references profiles(id);

create index idx_encounters_referred_by
  on encounters(referred_by_clinician_id);

create policy "patients_assigned_encounter_read" on patients
  for select using (
    id in (
      select patient_id
      from encounters
      where clinician_id = auth.uid()
    )
  );

create policy "profiles_authenticated_read" on profiles
  for select using (auth.role() = 'authenticated');

create policy "encounters_refer_update" on encounters
  for update using (clinician_id = auth.uid())
  with check (referred_by_clinician_id = auth.uid());
