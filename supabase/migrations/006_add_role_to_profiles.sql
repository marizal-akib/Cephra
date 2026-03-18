-- Add role column to profiles table
-- Supported roles: 'admin' | 'doctor'
-- Default is 'doctor' for all existing and new accounts

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'doctor'
    CHECK (role IN ('admin', 'doctor'));

-- RLS: clinicians can only read their own profile
-- Admin role check is done in API routes using the service role client
