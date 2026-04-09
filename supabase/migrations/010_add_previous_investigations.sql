-- Add previous investigations review section to initial clinician assessments
ALTER TABLE clinician_assessments
  ADD COLUMN IF NOT EXISTS previous_investigations jsonb NOT NULL DEFAULT '{}'::jsonb;
