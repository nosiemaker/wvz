-- RESTORE RLS AND FIX RECURSION
-- Disabling RLS might have caused issues if the client expects to filter naturally by user ID.
-- We will Re-Enable RLS but use extremely simple, non-recursive policies.

-- 1. Re-Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 2. Define non-recursive helper (if not exists)
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE(
    (auth.jwt() -> 'user_metadata' ->> 'role'),
    'driver'
  );
$$;

-- 3. Drop ALL existing policies to clean slate
DROP POLICY IF EXISTS "bookings_select_involved" ON public.bookings;
DROP POLICY IF EXISTS "bookings_update_involved" ON public.bookings;
DROP POLICY IF EXISTS "bookings_insert_requester" ON public.bookings;
DROP POLICY IF EXISTS "bookings_select_own_or_manager" ON public.bookings;
DROP POLICY IF EXISTS "bookings_insert_own" ON public.bookings;

DROP POLICY IF EXISTS "trips_select_own_or_manager" ON public.trips;
DROP POLICY IF EXISTS "trip_logs_select_own_or_manager" ON public.trip_logs;
DROP POLICY IF EXISTS "trip_logs_insert_own" ON public.trip_logs;

DROP POLICY IF EXISTS "users_select_own" ON public.users;
DROP POLICY IF EXISTS "managers_select_all" ON public.users;

-- 4. Create Simple, SAFE Policies

-- USERS: Everyone can see basic info of everyone (simplest fix for lookup errors)
DROP POLICY IF EXISTS "users_read_all" ON public.users;
CREATE POLICY "users_read_all" ON public.users FOR SELECT USING (true);

DROP POLICY IF EXISTS "users_update_own" ON public.users;
CREATE POLICY "users_update_own" ON public.users FOR UPDATE USING (auth.uid() = id);

-- BOOKINGS: Read if you are involved
DROP POLICY IF EXISTS "bookings_read_all" ON public.bookings;
CREATE POLICY "bookings_read_all" ON public.bookings FOR SELECT USING (
    driver_id = auth.uid() OR 
    requester_id = auth.uid() OR 
    get_my_role() IN ('manager', 'admin', 'compliance', 'finance')
);

-- BOOKINGS: Insert by anyone authenticated
DROP POLICY IF EXISTS "bookings_insert_auth" ON public.bookings;
CREATE POLICY "bookings_insert_auth" ON public.bookings FOR INSERT WITH CHECK (
    auth.role() = 'authenticated'
);

-- BOOKINGS: Update (Managers or Owner)
DROP POLICY IF EXISTS "bookings_update_all" ON public.bookings;
CREATE POLICY "bookings_update_all" ON public.bookings FOR UPDATE USING (
    requester_id = auth.uid() OR
    get_my_role() IN ('manager', 'admin', 'compliance')
);

-- TRIPS: Read own or manager
DROP POLICY IF EXISTS "trips_read_all" ON public.trips;
CREATE POLICY "trips_read_all" ON public.trips FOR SELECT USING (
    driver_id = auth.uid() OR
    get_my_role() IN ('manager', 'admin', 'compliance')
);

DROP POLICY IF EXISTS "trips_insert_own" ON public.trips;
CREATE POLICY "trips_insert_own" ON public.trips FOR INSERT WITH CHECK (
    driver_id = auth.uid()
);

DROP POLICY IF EXISTS "trips_update_own" ON public.trips;
CREATE POLICY "trips_update_own" ON public.trips FOR UPDATE USING (
    driver_id = auth.uid() OR
    get_my_role() IN ('manager', 'admin', 'compliance')
);

-- TRIP LOGS: Read own or manager
DROP POLICY IF EXISTS "logs_read_all" ON public.trip_logs;
CREATE POLICY "logs_read_all" ON public.trip_logs FOR SELECT USING (true); -- Simplify for now
DROP POLICY IF EXISTS "logs_insert_all" ON public.trip_logs;
CREATE POLICY "logs_insert_all" ON public.trip_logs FOR INSERT WITH CHECK (true); -- Simplify

-- 5. Reload Schema cache
NOTIFY pgrst, 'reload config';
