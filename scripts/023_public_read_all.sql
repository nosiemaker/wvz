-- PUBLIC READ MODE
-- This script enables RLS but adds a simple "TRUE" policy for SELECT on all tables.
-- This effectively makes the database readable by any logged-in user (and even anon if we allowed it, but strict to authenticated).

-- 1. Ensure RLS is enabled (so policies apply)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspections DISABLE ROW LEVEL SECURITY; -- Just disable these non-critical ones for now to reduce noise
ALTER TABLE public.incidents DISABLE ROW LEVEL SECURITY;

-- 2. Drop all restrictive policies
DROP POLICY IF EXISTS "bookings_read_all" ON public.bookings;
DROP POLICY IF EXISTS "trips_read_all" ON public.trips;
DROP POLICY IF EXISTS "logs_read_all" ON public.trip_logs;
DROP POLICY IF EXISTS "users_read_all" ON public.users;
DROP POLICY IF EXISTS "vehicles_read_all" ON public.vehicles;

-- 3. Create permissive policies for SELECT
CREATE POLICY "permit_select_bookings" ON public.bookings FOR SELECT TO authenticated USING (true);
CREATE POLICY "permit_select_trips" ON public.trips FOR SELECT TO authenticated USING (true);
CREATE POLICY "permit_select_logs" ON public.trip_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "permit_select_users" ON public.users FOR SELECT TO authenticated USING (true);
CREATE POLICY "permit_select_vehicles" ON public.vehicles FOR SELECT TO authenticated USING (true);

-- 4. Create permissive policies for INSERT/UPDATE (for testing functionality)
CREATE POLICY "permit_all_bookings" ON public.bookings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "permit_all_trips" ON public.trips FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "permit_all_logs" ON public.trip_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);
-- Users table usually restricted, but for test:
CREATE POLICY "permit_update_users" ON public.users FOR UPDATE TO authenticated USING (auth.uid() = id);

-- 5. Reload
NOTIFY pgrst, 'reload config';
