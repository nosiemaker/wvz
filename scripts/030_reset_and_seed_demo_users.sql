-- scripts/030_reset_and_seed_demo_users.sql
-- COMPLETE RESET AND SEED FOR DEMO USERS (3-TIER HIERARCHY)
-- Fixed UUIDs to be valid hex

-- 1. CLEANUP
DELETE FROM public.bookings;
DELETE FROM public.trip_logs;
DELETE FROM public.users 
WHERE email IN (
    'admin@fleet.com', 
    'supervisor2@fleet.com', 
    'supervisor1@fleet.com', 
    'junior1@fleet.com', 
    'junior2@fleet.com', 
    'driver@fleet.com', 
    'finance@fleet.com',
    'manager@fleet.com', 'director@fleet.com', 'junior@fleet.com', 'selfdrive@fleet.com', 'supervisor@fleet.com'
);
DELETE FROM auth.users 
WHERE email IN (
    'admin@fleet.com', 
    'supervisor2@fleet.com', 
    'supervisor1@fleet.com', 
    'junior1@fleet.com', 
    'junior2@fleet.com', 
    'driver@fleet.com', 
    'finance@fleet.com',
    'manager@fleet.com', 'director@fleet.com', 'junior@fleet.com', 'selfdrive@fleet.com', 'supervisor@fleet.com'
);

-- Ensure pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. CREATE USERS

-- A. Fleet Manager (The Allocator)
-- Valid UUID: a0...
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES (
  'a0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin@fleet.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{"full_name": "Fleet Manager", "role": "admin"}', now(), now()
);
INSERT INTO public.users (id, email, full_name, role, job_title, can_drive)
VALUES (
  'a0000000-0000-0000-0000-000000000001', 'admin@fleet.com', 'Fleet Manager', 'admin', 'Fleet Administrator', TRUE
);


-- B. Supervisor 2 (Top Supervisor)
-- Valid UUID: b2...
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES (
  'b2000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'supervisor2@fleet.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{"full_name": "Supervisor Two", "role": "manager"}', now(), now()
);
INSERT INTO public.users (id, email, full_name, role, job_title, can_drive)
VALUES (
  'b2000000-0000-0000-0000-000000000002', 'supervisor2@fleet.com', 'Supervisor Two', 'manager', 'Senior Director', TRUE
);


-- C. Supervisor 1 (First Supervisor)
-- Valid UUID: b1...
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES (
  'b1000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'supervisor1@fleet.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{"full_name": "Supervisor One", "role": "manager"}', now(), now()
);
INSERT INTO public.users (id, email, full_name, role, job_title, can_drive, supervisor_id)
VALUES (
  'b1000000-0000-0000-0000-000000000001', 'supervisor1@fleet.com', 'Supervisor One', 'manager', 'Operations Manager', TRUE, 'b2000000-0000-0000-0000-000000000002'
);


-- D. Junior Staff 1 (Cannot Drive)
-- Valid UUID: c1...
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES (
  'c1000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'junior1@fleet.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{"full_name": "Junior One (NoDrive)", "role": "employee"}', now(), now()
);
INSERT INTO public.users (id, email, full_name, role, job_title, can_drive, supervisor_id)
VALUES (
  'c1000000-0000-0000-0000-000000000001', 'junior1@fleet.com', 'Junior One (NoDrive)', 'employee', 'Assistant', FALSE, 'b1000000-0000-0000-0000-000000000001'
);


-- E. Junior Staff 2 (Can Self Drive)
-- Valid UUID: c2...
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES (
  'c2000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'junior2@fleet.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{"full_name": "Junior Two (SelfDrive)", "role": "employee"}', now(), now()
);
INSERT INTO public.users (id, email, full_name, role, job_title, can_drive, supervisor_id)
VALUES (
  'c2000000-0000-0000-0000-000000000002', 'junior2@fleet.com', 'Junior Two (SelfDrive)', 'employee', 'Project Officer', TRUE, 'b1000000-0000-0000-0000-000000000001'
);


-- F. Driver
-- Valid UUID: d1...
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES (
  'd1000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'driver@fleet.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{"full_name": "David Driver", "role": "driver"}', now(), now()
);
INSERT INTO public.users (id, email, full_name, role, job_title, can_drive, supervisor_id)
VALUES (
  'd1000000-0000-0000-0000-000000000001', 'driver@fleet.com', 'David Driver', 'driver', 'Senior Driver', TRUE, 'b1000000-0000-0000-0000-000000000001'
);


-- G. Finance
-- Valid UUID: f1...
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES (
  'f1000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'finance@fleet.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{"full_name": "Fiona Finance", "role": "admin"}', now(), now()
);
INSERT INTO public.users (id, email, full_name, role, job_title)
VALUES (
  'f1000000-0000-0000-0000-000000000001', 'finance@fleet.com', 'Fiona Finance', 'admin', 'Finance Officer'
);


-- 3. RELOAD SCHEMA CACHE
NOTIFY pgrst, 'reload config';
