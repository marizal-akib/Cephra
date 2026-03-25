-- Add review section to follow-up assessments (clinic type, key question, diagnosis notes)
ALTER TABLE follow_up_assessments
  ADD COLUMN IF NOT EXISTS review jsonb NOT NULL DEFAULT '{}'::jsonb;
