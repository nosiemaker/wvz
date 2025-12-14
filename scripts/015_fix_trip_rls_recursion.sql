-- Fix RLS recursion in trip workflow tables by using get_my_role() helper
-- Previously, we were querying public.users in the RLS policies, which causes infinite recursion.
-- We will replace those checks with get_my_role() which reads from JWT metadata.

-- 1. Fix bookings policies
DROP POLICY IF EXISTS "bookings_select_involved" ON public.bookings;
CREATE POLICY "bookings_select_involved" ON public.bookings FOR SELECT USING (
    driver_id = auth.uid() OR 
    requester_id = auth.uid() OR
    supervisor_id = auth.uid() OR
    get_my_role() IN ('manager', 'admin', 'finance')
);

DROP POLICY IF EXISTS "bookings_update_involved" ON public.bookings;
CREATE POLICY "bookings_update_involved" ON public.bookings FOR UPDATE USING (
    requester_id = auth.uid() OR
    supervisor_id = auth.uid() OR
    get_my_role() IN ('manager', 'admin')
);

-- 2. Fix trip_logs policies
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

-- 3. Reload schema
NOTIFY pgrst, 'reload config';
