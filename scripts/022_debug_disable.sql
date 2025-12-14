-- DEBUG: DISABLE RLS AND GRANT ALL
-- This script turns off all security policies and grants full access to everyone.
-- If this fixes the "Database error querying schema", we confirm RLS logic is the problem.

-- 1. Disable RLS on ALL tables
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspections DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents DISABLE ROW LEVEL SECURITY;

-- 2. Grant explicit permissions (fix potential 401/403 issues masking as schema errors)
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- 3. Reload
NOTIFY pgrst, 'reload config';
