-- Create demo users for different roles
-- Demo Drivers
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  is_super_admin
) VALUES 
(
  '10000000-0000-0000-0000-000000000001',
  'driver1@fleet.com',
  crypt('demo123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"full_name": "John Doe", "role": "driver"}',
  false
),
(
  '10000000-0000-0000-0000-000000000002',
  'driver2@fleet.com',
  crypt('demo123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"full_name": "Jane Smith", "role": "driver"}',
  false
)
ON CONFLICT (id) DO NOTHING;

-- Demo Manager
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  is_super_admin
) VALUES 
(
  '20000000-0000-0000-0000-000000000001',
  'manager@fleet.com',
  crypt('demo123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"full_name": "Fleet Manager", "role": "manager"}',
  false
)
ON CONFLICT (id) DO NOTHING;

-- Demo Finance User
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  is_super_admin
) VALUES 
(
  '30000000-0000-0000-0000-000000000001',
  'finance@fleet.com',
  crypt('demo123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"full_name": "Finance Officer", "role": "finance"}',
  false
)
ON CONFLICT (id) DO NOTHING;

-- Demo Compliance User
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  is_super_admin
) VALUES 
(
  '40000000-0000-0000-0000-000000000001',
  'compliance@fleet.com',
  crypt('demo123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"full_name": "Compliance Officer", "role": "compliance"}',
  false
)
ON CONFLICT (id) DO NOTHING;

-- Create user profiles for all demo users
-- changed conflict clause to use email instead of id since id has PRIMARY KEY constraint already
INSERT INTO public.users (id, email, full_name, role, license_number, license_expiry) 
VALUES 
('10000000-0000-0000-0000-000000000001', 'driver1@fleet.com', 'John Doe', 'driver', 'DL-0123456789', '2026-12-31'),
('10000000-0000-0000-0000-000000000002', 'driver2@fleet.com', 'Jane Smith', 'driver', 'DL-0123456790', '2026-06-30'),
('20000000-0000-0000-0000-000000000001', 'manager@fleet.com', 'Fleet Manager', 'manager', NULL, NULL),
('30000000-0000-0000-0000-000000000001', 'finance@fleet.com', 'Finance Officer', 'finance', NULL, NULL),
('40000000-0000-0000-0000-000000000001', 'compliance@fleet.com', 'Compliance Officer', 'compliance', NULL, NULL)
ON CONFLICT (id) DO NOTHING;
