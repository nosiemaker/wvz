-- Fix missing auth users script - UPDATED with raw_app_meta_data
-- This script completely recreates the demo users in both auth.users and public.users
-- ensuring they are linked correctly and have the correct fields (including app metadata) for login to work.

-- 1. Enable required extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Clean up existing data for these specific users to start fresh
DELETE FROM public.users WHERE email IN (
    'driver@fleet.com', 
    'driver1@fleet.com', 
    'driver2@fleet.com', 
    'manager@fleet.com', 
    'finance@fleet.com', 
    'compliance@fleet.com'
);

DELETE FROM auth.users WHERE email IN (
    'driver@fleet.com', 
    'driver1@fleet.com', 
    'driver2@fleet.com', 
    'manager@fleet.com', 
    'finance@fleet.com', 
    'compliance@fleet.com'
);

-- 3. Insert users into auth.users with ALL necessary fields
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  raw_app_meta_data, -- Critical for valid login session
  created_at,
  updated_at
) VALUES 
-- Driver 1
(
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'driver1@fleet.com',
  crypt('demo123', gen_salt('bf')),
  now(),
  '{"full_name": "John Doe", "role": "driver"}',
  '{"provider": "email", "providers": ["email"]}',
  now(),
  now()
),
-- Driver 2
(
  '10000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'driver2@fleet.com',
  crypt('demo123', gen_salt('bf')),
  now(),
  '{"full_name": "Jane Smith", "role": "driver"}',
  '{"provider": "email", "providers": ["email"]}',
  now(),
  now()
),
-- Manager
(
  '20000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'manager@fleet.com',
  crypt('demo123', gen_salt('bf')),
  now(),
  '{"full_name": "Fleet Manager", "role": "manager"}',
  '{"provider": "email", "providers": ["email"]}',
  now(),
  now()
),
-- Finance
(
  '30000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'finance@fleet.com',
  crypt('demo123', gen_salt('bf')),
  now(),
  '{"full_name": "Finance Officer", "role": "finance"}',
  '{"provider": "email", "providers": ["email"]}',
  now(),
  now()
),
-- Compliance
(
  '40000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'compliance@fleet.com',
  crypt('demo123', gen_salt('bf')),
  now(),
  '{"full_name": "Compliance Officer", "role": "compliance"}',
  '{"provider": "email", "providers": ["email"]}',
  now(),
  now()
);

-- 4. Re-insert into public.users
INSERT INTO public.users (id, email, full_name, role, license_number, license_expiry) 
VALUES 
('10000000-0000-0000-0000-000000000001', 'driver1@fleet.com', 'John Doe', 'driver', 'DL-0123456789', '2026-12-31'),
('10000000-0000-0000-0000-000000000002', 'driver2@fleet.com', 'Jane Smith', 'driver', 'DL-0123456790', '2026-06-30'),
('20000000-0000-0000-0000-000000000001', 'manager@fleet.com', 'Fleet Manager', 'manager', NULL, NULL),
('30000000-0000-0000-0000-000000000001', 'finance@fleet.com', 'Finance Officer', 'finance', NULL, NULL),
('40000000-0000-0000-0000-000000000001', 'compliance@fleet.com', 'Compliance Officer', 'compliance', NULL, NULL);

-- 5. Verification output
SELECT id, email, role, raw_app_meta_data FROM auth.users WHERE email LIKE '%@fleet.com';
