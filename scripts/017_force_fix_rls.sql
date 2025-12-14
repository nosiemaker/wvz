-- Forcefully reset RLS policies to fix recursion once and for all.
-- We will drop ALL existing policies on the workflow tables and recreate them using the safe get_my_role() function.

-- 1. Ensure helper function exists and uses JWT metadata (safe, non-recursive)
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text
LANGUAGE sql
STABLE
AS $$
  -- We use user_metadata because that is where we store the role in our signup/seed scripts
  SELECT COALESCE(
    (auth.jwt() -> 'user_metadata' ->> 'role'),
    'driver'
  );
$$;

-- 2. Reset USERS policies (The root cause of most recursion)
DROP POLICY IF EXISTS "managers_select_all" ON public.users;
DROP POLICY IF EXISTS "users_select_own" ON public.users;
DROP POLICY IF EXISTS "users_update_own" ON public.users;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.users;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.users;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.users;

CREATE POLICY "managers_select_all" ON public.users FOR SELECT USING (
  get_my_role() IN ('manager', 'finance', 'compliance', 'admin')
);

CREATE POLICY "users_select_own" ON public.users FOR SELECT USING (
  auth.uid() = id
);

CREATE POLICY "users_update_own" ON public.users FOR UPDATE USING (
  auth.uid() = id
);

-- 3. Reset BOOKINGS policies
DROP POLICY IF EXISTS "bookings_select_own_or_manager" ON public.bookings;
DROP POLICY IF EXISTS "bookings_select_involved" ON public.bookings;
DROP POLICY IF EXISTS "bookings_insert_own" ON public.bookings;
DROP POLICY IF EXISTS "bookings_insert_requester" ON public.bookings;
DROP POLICY IF EXISTS "bookings_update_involved" ON public.bookings;

CREATE POLICY "bookings_select_involved" ON public.bookings FOR SELECT USING (
    driver_id = auth.uid() OR 
    requester_id = auth.uid() OR
    supervisor_id = auth.uid() OR
    get_my_role() IN ('manager', 'admin', 'finance', 'compliance')
);

CREATE POLICY "bookings_insert_new" ON public.bookings FOR INSERT WITH CHECK (
    -- Allow any authenticated user to create a booking (request)
    auth.role() = 'authenticated'
);

CREATE POLICY "bookings_update_involved" ON public.bookings FOR UPDATE USING (
    requester_id = auth.uid() OR
    supervisor_id = auth.uid() OR
    get_my_role() IN ('manager', 'admin')
);

-- 4. Reset TRIPS policies
DROP POLICY IF EXISTS "trips_select_own_or_manager" ON public.trips;

CREATE POLICY "trips_select_own_or_manager" ON public.trips FOR SELECT USING (
  driver_id = auth.uid() OR 
  get_my_role() IN ('manager', 'admin', 'compliance')
);

-- 5. Reset TRIP_LOGS policies
DROP POLICY IF EXISTS "trip_logs_select_own_or_manager" ON public.trip_logs;
DROP POLICY IF EXISTS "trip_logs_insert_own" ON public.trip_logs;

CREATE POLICY "trip_logs_select_own_or_manager" ON public.trip_logs FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.trips
        WHERE trips.id = trip_logs.trip_id AND (
            trips.driver_id = auth.uid() OR
            get_my_role() IN ('manager', 'admin', 'compliance')
        )
    )
);

CREATE POLICY "trip_logs_insert_own" ON public.trip_logs FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.trips
        WHERE trips.id = trip_logs.trip_id AND trips.driver_id = auth.uid()
    )
);

-- 6. Reload config
NOTIFY pgrst, 'reload config';
