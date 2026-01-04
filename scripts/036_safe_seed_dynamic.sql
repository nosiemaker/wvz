-- scripts/036_safe_seed_dynamic.sql
-- DYNAMIC SAFE SEED (3-TIER HIERARCHY)
-- Uses gen_random_uuid() to ensure valid V4 UUIDs and avoid conflicts.

-- 1. CLEANUP
DELETE FROM public.bookings;
DELETE FROM public.trip_logs;
DELETE FROM public.users 
WHERE email IN (
    'admin@fleet.com', 
    'director@fleet.com', 
    'supervisor@fleet.com', 
    'junior1@fleet.com', 
    'junior2@fleet.com', 
    'driver@fleet.com', 
    'finance@fleet.com',
    'supervisor1@fleet.com', 'supervisor2@fleet.com'
);
DELETE FROM auth.users 
WHERE email IN (
    'admin@fleet.com', 
    'director@fleet.com', 
    'supervisor@fleet.com', 
    'junior1@fleet.com', 
    'junior2@fleet.com', 
    'driver@fleet.com', 
    'finance@fleet.com',
    'supervisor1@fleet.com', 'supervisor2@fleet.com'
);

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. INSERT USERS DYNAMICALLY

-- A. ADMIN (Fleet Manager)
WITH new_admin_auth AS (
  INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data)
  VALUES (gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin@fleet.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{"full_name": "Fleet Manager", "role": "admin"}')
  RETURNING id
)
INSERT INTO public.users (id, email, full_name, role, job_title, can_drive)
SELECT id, 'admin@fleet.com', 'Fleet Manager', 'admin', 'Fleet Administrator', TRUE FROM new_admin_auth;


-- B. DIRECTOR (Supervisor 2)
WITH new_director_auth AS (
  INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data)
  VALUES (gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'supervisor2@fleet.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{"full_name": "Supervisor Two (Director)", "role": "manager"}')
  RETURNING id
)
INSERT INTO public.users (id, email, full_name, role, job_title, can_drive)
SELECT id, 'supervisor2@fleet.com', 'Supervisor Two (Director)', 'manager', 'Operations Director', TRUE FROM new_director_auth;


-- C. SUPERVISOR (Supervisor 1) - Reports to Director
WITH new_sup1_auth AS (
  INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data)
  VALUES (gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'supervisor1@fleet.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{"full_name": "Supervisor One", "role": "manager"}')
  RETURNING id
),
director_ref AS (
  SELECT id FROM public.users WHERE email = 'supervisor2@fleet.com' LIMIT 1
)
INSERT INTO public.users (id, email, full_name, role, job_title, can_drive, supervisor_id)
SELECT new_sup1_auth.id, 'supervisor1@fleet.com', 'Supervisor One', 'manager', 'Area Manager', TRUE, director_ref.id 
FROM new_sup1_auth, director_ref;


-- D. JUNIOR 1 (No Drive) - Reports to Supervisor 1
WITH new_junior1_auth AS (
  INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data)
  VALUES (gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'junior1@fleet.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{"full_name": "Junior One (NoDrive)", "role": "employee"}')
  RETURNING id
),
sup1_ref AS (
  SELECT id FROM public.users WHERE email = 'supervisor1@fleet.com' LIMIT 1
)
INSERT INTO public.users (id, email, full_name, role, job_title, can_drive, supervisor_id)
SELECT new_junior1_auth.id, 'junior1@fleet.com', 'Junior One (NoDrive)', 'employee', 'Assistant', FALSE, sup1_ref.id
FROM new_junior1_auth, sup1_ref;


-- E. JUNIOR 2 (Self Drive) - Reports to Supervisor 1
WITH new_junior2_auth AS (
  INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data)
  VALUES (gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'junior2@fleet.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{"full_name": "Junior Two (SelfDrive)", "role": "employee"}')
  RETURNING id
),
sup1_ref AS (
  SELECT id FROM public.users WHERE email = 'supervisor1@fleet.com' LIMIT 1
)
INSERT INTO public.users (id, email, full_name, role, job_title, can_drive, supervisor_id)
SELECT new_junior2_auth.id, 'junior2@fleet.com', 'Junior Two (SelfDrive)', 'employee', 'Project Officer', TRUE, sup1_ref.id
FROM new_junior2_auth, sup1_ref;


-- F. DRIVER - Reports to Supervisor 1
WITH new_driver_auth AS (
  INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data)
  VALUES (gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'driver@fleet.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{"full_name": "David Driver", "role": "driver"}')
  RETURNING id
),
sup1_ref AS (
  SELECT id FROM public.users WHERE email = 'supervisor1@fleet.com' LIMIT 1
)
INSERT INTO public.users (id, email, full_name, role, job_title, can_drive, supervisor_id)
SELECT new_driver_auth.id, 'driver@fleet.com', 'David Driver', 'driver', 'Senior Driver', TRUE, sup1_ref.id
FROM new_driver_auth, sup1_ref;


-- G. FINANCE
WITH new_finance_auth AS (
  INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data)
  VALUES (gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'finance@fleet.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{"full_name": "Fiona Finance", "role": "admin"}')
  RETURNING id
)
INSERT INTO public.users (id, email, full_name, role, job_title)
SELECT id, 'finance@fleet.com', 'Fiona Finance', 'admin', 'Finance Officer' FROM new_finance_auth;

NOTIFY pgrst, 'reload config';
