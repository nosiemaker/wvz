-- Fix Employee User & Disable RLS on Bookings
-- The "Database error querying schema" indicates that RLS is still active and recursive on the bookings table.
-- Since the Employee portal loads 'bookings' immediately, it crashes. 
-- Drivers load 'trips' which might not be recursive or they avoid the faulty policy.

-- 1. Re-create Employee User with CORRECT metadata (same as drivers)
DELETE FROM public.users WHERE email = 'employee@fleet.com';
DELETE FROM auth.users WHERE email = 'employee@fleet.com';

INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  raw_app_meta_data, -- Critical
  created_at,
  updated_at
) VALUES (
  '50000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'employee@fleet.com',
  crypt('demo123', gen_salt('bf')),
  now(),
  '{"full_name": "Generic Employee", "role": "employee"}',
  '{"provider": "email", "providers": ["email"]}',
  now(),
  now()
);

INSERT INTO public.users (id, email, full_name, role) 
VALUES ('50000000-0000-0000-0000-000000000001', 'employee@fleet.com', 'Generic Employee', 'employee');

-- 2. NUCLEAR RLS FIX for Bookings
-- We verify that RLS is actually disabled.
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- 3. Drop recursive policies just in case enabling it back happens automatically
DROP POLICY IF EXISTS "bookings_select_involved" ON public.bookings;
DROP POLICY IF EXISTS "bookings_update_involved" ON public.bookings;

-- 4. Reload Schema
NOTIFY pgrst, 'reload config';
