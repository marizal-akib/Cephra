-- Add a human-readable reference number to questionnaire responses
alter table questionnaire_responses
  add column reference_number text unique;

create index idx_questionnaire_responses_ref on questionnaire_responses(reference_number);
