-- Track edit reasons for completed assessments.
-- When a clinician edits a completed assessment, they must provide a reason.
-- Entries are appended to this array; they are never deleted.
--
-- Entry shape:
--   { reason: text, clinician_id: uuid, clinician_name: text, created_at: timestamptz }
ALTER TABLE clinician_assessments
  ADD COLUMN IF NOT EXISTS amendments jsonb NOT NULL DEFAULT '[]'::jsonb;
