-- Add update_reason column to generated_notes for tracking why a completed note was revised
alter table generated_notes add column update_reason text;
