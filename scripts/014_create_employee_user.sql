-- Create a generic "employee" user for testing requests
-- ID: 50000000-0000-0000-0000-000000000001
-- Email: employee@fleet.com
-- Password: demo123
-- Role: employee

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DELETE FROM public.users WHERE email = 'employee@fleet.com';
DELETE FROM auth.users WHERE email = 'employee@fleet.com';

INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  raw_app_meta_data, -- Added this column
  created_at,
  updated_at
) VALUES (
  '50000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'employee@fleet.com',
  crypt('demo123', gen_salt('bf')),
  now(),
  '{"full_name": "Generic Employee", "role": "employee"}',
  '{"provider": "email", "providers": ["email"]}', -- Added default app metadata
  now(),
  now()
);

INSERT INTO public.users (id, email, full_name, role) 
VALUES ('50000000-0000-0000-0000-000000000001', 'employee@fleet.com', 'Generic Employee', 'employee');

-- Verify
SELECT id, email, role, raw_app_meta_data FROM auth.users WHERE email = 'employee@fleet.com';
