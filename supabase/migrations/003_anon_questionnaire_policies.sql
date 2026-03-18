-- Add contact column to patients
ALTER TABLE patients ADD COLUMN IF NOT EXISTS contact text;

-- Anon RLS policies for questionnaire_tokens
CREATE POLICY "tokens_anon_select" ON questionnaire_tokens
  FOR SELECT TO anon USING (true);

CREATE POLICY "tokens_anon_update_used" ON questionnaire_tokens
  FOR UPDATE TO anon
  USING (used_at IS NULL AND expires_at > now())
  WITH CHECK (used_at IS NOT NULL);

-- Anon RLS policies for questionnaire_responses
CREATE POLICY "responses_anon_insert" ON questionnaire_responses
  FOR INSERT TO anon
  WITH CHECK (
    EXISTS (SELECT 1 FROM questionnaire_tokens
      WHERE questionnaire_tokens.id = token_id
        AND used_at IS NULL AND expires_at > now())
  );

CREATE POLICY "responses_anon_update" ON questionnaire_responses
  FOR UPDATE TO anon
  USING (
    EXISTS (SELECT 1 FROM questionnaire_tokens
      WHERE questionnaire_tokens.id = token_id
        AND used_at IS NULL AND expires_at > now())
  );

CREATE POLICY "responses_anon_select" ON questionnaire_responses
  FOR SELECT TO anon
  USING (
    EXISTS (SELECT 1 FROM questionnaire_tokens
      WHERE questionnaire_tokens.id = token_id
        AND used_at IS NULL AND expires_at > now())
  );
