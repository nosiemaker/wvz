-- scripts/040_surgical_seed.sql
-- SURGICAL FIX for Junior User
-- Uses the EXACT syntax from Script 011 (which is known to work)
-- Filling all columns including tokens to prevent NULL crashes.

-- 1. Cleanup Junior 1
DELETE FROM public.bookings WHERE requester_id IN (SELECT id FROM public.users WHERE email = 'junior1@fleet.com');
DELETE FROM public.users WHERE email = 'junior1@fleet.com';
DELETE FROM auth.users WHERE email = 'junior1@fleet.com';

-- 2. Insert Junior 1 (The "Old Fashioned" Way)
-- Password: password123
INSERT INTO auth.users (
    id, 
    instance_id, 
    aud, 
    role, 
    email, 
    encrypted_password, 
    email_confirmed_at, 
    recovery_sent_at, 
    last_sign_in_at, 
    raw_app_meta_data, 
    raw_user_meta_data, 
    created_at, 
    updated_at, 
    confirmation_token, 
    email_change, 
    email_change_token_new, 
    recovery_token
) 
VALUES (
    'c1000000-0000-0000-0000-000000000001', -- Hardcoded Valid UUID
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'junior1@fleet.com', 
    crypt('password123', gen_salt('bf')), 
    now(), 
    now(), 
    now(), 
    '{"provider": "email", "providers": ["email"]}', 
    '{"full_name": "Junior One (NoDrive)", "role": "employee"}', 
    now(), 
    now(), 
    '', -- Empty string instead of NULL
    '', 
    '', 
    ''
);

-- 3. Insert Public Profile
-- Linking to Supervisor 1 (Assuming Supervisor 1 exists from previous run, ID: b100...0001)
-- If Supervisor 1 doesn't exist, this will fail. 
-- We'll assume the user ran 030 so Supervisor 1 has ID 'b100...0001' or we use the dynamic lookup.

WITH sup1_lookup AS (
    SELECT id FROM public.users WHERE email = 'supervisor1@fleet.com' LIMIT 1
)
INSERT INTO public.users (id, email, full_name, role, job_title, can_drive, supervisor_id)
SELECT 
    'c1000000-0000-0000-0000-000000000001', 
    'junior1@fleet.com', 
    'Junior One (NoDrive)', 
    'employee', 
    'Assistant', 
    FALSE, 
    sup1_lookup.id
FROM sup1_lookup;

-- Fallback: If Supervisor 1 missing, insert without supervisor (to verify login first)
INSERT INTO public.users (id, email, full_name, role, job_title, can_drive)
SELECT 
    'c1000000-0000-0000-0000-000000000001', 
    'junior1@fleet.com', 
    'Junior One (NoDrive)', 
    'employee', 
    'Assistant', 
    FALSE
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE id = 'c1000000-0000-0000-0000-000000000001');

NOTIFY pgrst, 'reload config';
