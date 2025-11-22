-- Create a demo driver user for testing
-- Note: Password is 'demo123'
-- Clean up existing user to ensure fresh create
DELETE FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000001';

INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  is_super_admin
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'driver@fleet.com',
  crypt('demo123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"full_name": "Demo Driver", "role": "driver"}',
  false
);

-- Create corresponding user profile
INSERT INTO public.users (
  id,
  email,
  full_name,
  role,
  license_number,
  license_expiry
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'driver@fleet.com',
  'Demo Driver',
  'driver',
  'DL-0123456789',
  '2026-12-31'
) ON CONFLICT (id) DO NOTHING;
