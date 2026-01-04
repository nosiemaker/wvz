-- Create Demo Users for Fleet Management Workflow (Corrected Constraints)

-- Ensure pgcrypto is available
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Mid-Level Supervisor (Manager)
-- User who approves requests
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'manager@fleet.com',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Sarah Manager", "role": "manager"}',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.users (id, email, full_name, role, job_title, can_drive)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
  'manager@fleet.com',
  'Sarah Manager',
  'manager',
  'Regional Operations Manager',
  TRUE
) ON CONFLICT (id) DO UPDATE SET 
  role = 'manager',
  job_title = 'Regional Operations Manager';


-- 3. Junior Staff (Non-Driver)
-- Reports to Sarah Manager. Requestor.
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES (
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'junior@fleet.com',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "James Junior", "role": "employee"}',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.users (id, email, full_name, role, job_title, can_drive, supervisor_id)
VALUES (
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
  'junior@fleet.com',
  'James Junior',
  'employee',
  'Field Officer',
  FALSE,
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12' -- Reports to Sarah
) ON CONFLICT (id) DO UPDATE SET 
  supervisor_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
  can_drive = FALSE;


-- 4. Junior Staff (Self-Drive Capable)
-- Reports to Sarah Manager.
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES (
  'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'selfdrive@fleet.com',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Sam SelfDrive", "role": "employee"}',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.users (id, email, full_name, role, job_title, can_drive, supervisor_id)
VALUES (
  'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
  'selfdrive@fleet.com',
  'Sam SelfDrive',
  'employee',
  'Senior Project Officer',
  TRUE,
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12' -- Reports to Sarah
) ON CONFLICT (id) DO UPDATE SET 
  supervisor_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
  can_drive = TRUE;


-- 5. Dedicated Driver
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES (
  'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a15',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'driver@fleet.com',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "David Driver", "role": "driver"}',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.users (id, email, full_name, role, job_title, can_drive)
VALUES (
  'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a15',
  'driver@fleet.com',
  'David Driver',
  'driver',
  'Senior Driver',
  TRUE
) ON CONFLICT (id) DO UPDATE SET 
  role = 'driver';


-- 6. Finance User
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES (
  'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a16',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'finance@fleet.com',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Fiona Finance", "role": "admin"}',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.users (id, email, full_name, role, job_title)
VALUES (
  'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a16',
  'finance@fleet.com',
  'Fiona Finance',
  'admin', -- Giving admin role to access specific dashboard parts if needed
  'Finance Officer'
) ON CONFLICT (id) DO UPDATE SET 
  role = 'admin';
