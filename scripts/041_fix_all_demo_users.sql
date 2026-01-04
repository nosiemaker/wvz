-- scripts/041_fix_all_demo_users.sql
-- COMPLETE FIX for All Demo Users
-- Applies the "Surgical Fix" (Script 040) logic to the entire hierarchy.
-- Ensures all users have full column definitions to prevent Login 500 Errors.

-- 1. CLEANUP (Delete everyone to start fresh)
DELETE FROM public.bookings;
DELETE FROM public.trip_logs;
DELETE FROM public.users 
WHERE email IN (
    'admin@fleet.com', 'supervisor2@fleet.com', 'supervisor1@fleet.com', 
    'junior1@fleet.com', 'junior2@fleet.com', 'driver@fleet.com', 'finance@fleet.com'
);
DELETE FROM auth.users 
WHERE email IN (
    'admin@fleet.com', 'supervisor2@fleet.com', 'supervisor1@fleet.com', 
    'junior1@fleet.com', 'junior2@fleet.com', 'driver@fleet.com', 'finance@fleet.com'
);

-- 2. CREATE USERS (Using Verbose Syntax)

-- A. ADMIN (Fleet Manager) - a0...01
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
VALUES ('a0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin@fleet.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"full_name": "Fleet Manager", "role": "admin"}', now(), now(), '', '', '', '');

INSERT INTO public.users (id, email, full_name, role, job_title, can_drive)
VALUES ('a0000000-0000-0000-0000-000000000001', 'admin@fleet.com', 'Fleet Manager', 'admin', 'Fleet Administrator', TRUE);


-- B. SUPERVISOR 2 (Director) - b2...02
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
VALUES ('b2000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'supervisor2@fleet.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"full_name": "Supervisor Two", "role": "manager"}', now(), now(), '', '', '', '');

INSERT INTO public.users (id, email, full_name, role, job_title, can_drive)
VALUES ('b2000000-0000-0000-0000-000000000002', 'supervisor2@fleet.com', 'Supervisor Two', 'manager', 'Director', TRUE);


-- C. SUPERVISOR 1 (Manager) - b1...01 [Reports to Sup 2]
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
VALUES ('b1000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'supervisor1@fleet.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"full_name": "Supervisor One", "role": "manager"}', now(), now(), '', '', '', '');

INSERT INTO public.users (id, email, full_name, role, job_title, can_drive, supervisor_id)
VALUES ('b1000000-0000-0000-0000-000000000001', 'supervisor1@fleet.com', 'Supervisor One', 'manager', 'Ops Manager', TRUE, 'b2000000-0000-0000-0000-000000000002');


-- D. JUNIOR 1 (No Drive) - c1...01 [Reports to Sup 1]
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
VALUES ('c1000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'junior1@fleet.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"full_name": "Junior One (NoDrive)", "role": "employee"}', now(), now(), '', '', '', '');

INSERT INTO public.users (id, email, full_name, role, job_title, can_drive, supervisor_id)
VALUES ('c1000000-0000-0000-0000-000000000001', 'junior1@fleet.com', 'Junior One (NoDrive)', 'employee', 'Assistant', FALSE, 'b1000000-0000-0000-0000-000000000001');


-- E. JUNIOR 2 (Self Drive) - c2...02 [Reports to Sup 1]
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
VALUES ('c2000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'junior2@fleet.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"full_name": "Junior Two (SelfDrive)", "role": "employee"}', now(), now(), '', '', '', '');

INSERT INTO public.users (id, email, full_name, role, job_title, can_drive, supervisor_id)
VALUES ('c2000000-0000-0000-0000-000000000002', 'junior2@fleet.com', 'Junior Two (SelfDrive)', 'employee', 'Project Officer', TRUE, 'b1000000-0000-0000-0000-000000000001');


-- F. DRIVER - d1...01 [Reports to Sup 1]
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
VALUES ('d1000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'driver@fleet.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"full_name": "David Driver", "role": "driver"}', now(), now(), '', '', '', '');

INSERT INTO public.users (id, email, full_name, role, job_title, can_drive, supervisor_id)
VALUES ('d1000000-0000-0000-0000-000000000001', 'driver@fleet.com', 'David Driver', 'driver', 'Senior Driver', TRUE, 'b1000000-0000-0000-0000-000000000001');


-- G. FINANCE - f1...01
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
VALUES ('f1000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'finance@fleet.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"full_name": "Fiona Finance", "role": "admin"}', now(), now(), '', '', '', '');

INSERT INTO public.users (id, email, full_name, role, job_title)
VALUES ('f1000000-0000-0000-0000-000000000001', 'finance@fleet.com', 'Fiona Finance', 'admin', 'Finance Officer');


-- 3. RELOAD
NOTIFY pgrst, 'reload config';
