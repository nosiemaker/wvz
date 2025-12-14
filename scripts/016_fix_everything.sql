-- Comprehensive RLS Fix Script
-- This script re-defines the helper function and fixes all policies to ensure no recursion exists.

-- 1. Re-create the helper function (Safe to run even if it exists)
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

-- 2. Fix 'bookings' policies (The main culprit of recursion)
DROP POLICY IF EXISTS "bookings_select_own_or_manager" ON public.bookings;
DROP POLICY IF EXISTS "bookings_select_involved" ON public.bookings;

CREATE POLICY "bookings_select_involved" ON public.bookings FOR SELECT USING (
    driver_id = auth.uid() OR 
    requester_id = auth.uid() OR
    supervisor_id = auth.uid() OR
    get_my_role() IN ('manager', 'admin', 'finance', 'compliance')
);

DROP POLICY IF EXISTS "bookings_update_involved" ON public.bookings;
CREATE POLICY "bookings_update_involved" ON public.bookings FOR UPDATE USING (
    requester_id = auth.uid() OR
    supervisor_id = auth.uid() OR
    get_my_role() IN ('manager', 'admin')
);

DROP POLICY IF EXISTS "bookings_insert_own" ON public.bookings;
DROP POLICY IF EXISTS "bookings_insert_requester" ON public.bookings;
CREATE POLICY "bookings_insert_requester" ON public.bookings FOR INSERT WITH CHECK (
    requester_id = auth.uid()
);

-- 3. Fix 'trip_logs' policies
DROP POLICY IF EXISTS "trip_logs_select_own_or_manager" ON public.trip_logs;
CREATE POLICY "trip_logs_select_own_or_manager" ON public.trip_logs FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.trips
        WHERE trips.id = trip_logs.trip_id AND (
            trips.driver_id = auth.uid() OR
            get_my_role() IN ('manager', 'admin')
        )
    )
);

-- 4. Reload Schema Cache
NOTIFY pgrst, 'reload config';
