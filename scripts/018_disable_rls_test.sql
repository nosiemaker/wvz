-- NUCLEAR OPTION: DISABLE RLS on all workflow tables
-- If this fixes the "Database error querying schema", then we confirm RLS is the culprit.
-- DO NOT LEAVE THIS DISABLED IN PRODUCTION.

ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

NOTIFY pgrst, 'reload config';
