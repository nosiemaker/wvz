-- Rename Demo Users for Presentation Clarity
-- Flow: Employee -> Supervisor -> Fleet Manager -> Driver

-- 1. Enable pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Delete old/confusing users
DELETE FROM public.users WHERE email IN ('manager@fleet.com', 'compliance@fleet.com', 'supervisor@fleet.com', 'fleetmanager@fleet.com');
DELETE FROM auth.users WHERE email IN ('manager@fleet.com', 'compliance@fleet.com', 'supervisor@fleet.com', 'fleetmanager@fleet.com');

-- 3. Insert NEW clearer users
-- Note: 'supervisor' user gets 'compliance' role to access the Approval Portal
-- Note: 'fleetmanager' user gets 'manager' role to access the Allocation Portal

INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at) VALUES 
-- Supervisor (uses Compliance role for now)
('40000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'supervisor@fleet.com', crypt('demo123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"full_name": "Supervisor", "role": "compliance"}', now(), now()),
-- Fleet Manager (uses Manager role)
('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'fleetmanager@fleet.com', crypt('demo123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"full_name": "Fleet Manager", "role": "manager"}', now(), now());

-- 4. Re-insert into public.users
INSERT INTO public.users (id, email, full_name, role) VALUES 
('40000000-0000-0000-0000-000000000001', 'supervisor@fleet.com', 'Supervisor', 'compliance'),
('20000000-0000-0000-0000-000000000001', 'fleetmanager@fleet.com', 'Fleet Manager', 'manager');

-- 5. Reload
NOTIFY pgrst, 'reload config';
