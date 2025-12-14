-- scripts/011_create_all_users_final.sql
-- 1. Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Cleanup existing specific users
DELETE FROM public.users WHERE email IN ('driver@fleet.com', 'driver1@fleet.com', 'driver2@fleet.com', 'manager@fleet.com', 'finance@fleet.com', 'compliance@fleet.com', 'employee@fleet.com');
DELETE FROM auth.users WHERE email IN ('driver@fleet.com', 'driver1@fleet.com', 'driver2@fleet.com', 'manager@fleet.com', 'finance@fleet.com', 'compliance@fleet.com', 'employee@fleet.com');

-- 3. Insert users into auth.users with correct metadata (APP METADATA IS CRITICAL)
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token) VALUES 
('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'driver@fleet.com', crypt('demo123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"full_name": "Demo Driver", "role": "driver"}', now(), now(), '', '', '', ''),
('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'driver1@fleet.com', crypt('demo123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"full_name": "John Doe", "role": "driver"}', now(), now(), '', '', '', ''),
('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'driver2@fleet.com', crypt('demo123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"full_name": "Jane Smith", "role": "driver"}', now(), now(), '', '', '', ''),
('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'manager@fleet.com', crypt('demo123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"full_name": "Fleet Manager", "role": "manager"}', now(), now(), '', '', '', ''),
('30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'finance@fleet.com', crypt('demo123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"full_name": "Finance Officer", "role": "finance"}', now(), now(), '', '', '', ''),
('40000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'compliance@fleet.com', crypt('demo123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"full_name": "Compliance Officer", "role": "compliance"}', now(), now(), '', '', '', ''),
('50000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'employee@fleet.com', crypt('demo123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"full_name": "Generic Employee", "role": "employee"}', now(), now(), '', '', '', '');

-- 4. Create public profiles
INSERT INTO public.users (id, email, full_name, role, license_number, license_expiry) VALUES 
('10000000-0000-0000-0000-000000000001', 'driver@fleet.com', 'Demo Driver', 'driver', 'DL-0000000001', '2026-12-31'),
('10000000-0000-0000-0000-000000000002', 'driver1@fleet.com', 'John Doe', 'driver', 'DL-0000000002', '2026-11-30'),
('10000000-0000-0000-0000-000000000003', 'driver2@fleet.com', 'Jane Smith', 'driver', 'DL-0000000003', '2026-10-31'),
('20000000-0000-0000-0000-000000000001', 'manager@fleet.com', 'Fleet Manager', 'manager', NULL, NULL),
('30000000-0000-0000-0000-000000000001', 'finance@fleet.com', 'Finance Officer', 'finance', NULL, NULL),
('40000000-0000-0000-0000-000000000001', 'compliance@fleet.com', 'Compliance Officer', 'compliance', NULL, NULL),
('50000000-0000-0000-0000-000000000001', 'employee@fleet.com', 'Generic Employee', 'employee', NULL, NULL);

-- 5. Reload Schema
NOTIFY pgrst, 'reload config';
