-- Fix RLS policies by using generic auth function (avoiding table queries)
-- This is a more robust fix than the previous one, as it reads from JWT metadata directly.
-- This works because in both signup and our demo scripts, we are setting metadata. "role" is in user_metadata.

-- 1. Create a helper function to get the current user's role from JWT
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text
LANGUAGE sql
STABLE
AS zmwzmw
  -- Reads the 'role' field from the user_metadata in the JWT
  -- This avoids querying public.users table completely, preventing recursion
  SELECT COALESCE(
    (auth.jwt() -> 'user_metadata' ->> 'role'),
    'driver' -- Default fallback
  );
zmwzmw;

-- 2. Update RLS policies for 'users' table 
-- We replace the recursive subquery with the robust helper function

-- Users: Managers can see all users
DROP POLICY IF EXISTS "managers_select_all" ON public.users;
CREATE POLICY "managers_select_all" ON public.users FOR SELECT USING (
  get_my_role() IN ('manager', 'finance', 'compliance')
);

-- Users: Users can see themselves
DROP POLICY IF EXISTS "users_select_own" ON public.users;
CREATE POLICY "users_select_own" ON public.users FOR SELECT USING (
  auth.uid() = id
);

-- Users: Users can update themselves
DROP POLICY IF EXISTS "users_update_own" ON public.users;
CREATE POLICY "users_update_own" ON public.users FOR UPDATE USING (
  auth.uid() = id
);

-- 3. Update other tables (Bookings, Trips, etc) using the new helper
-- This ensures they also don't trigger unnecessary queries on public.users

-- Bookings
DROP POLICY IF EXISTS "bookings_select_own_or_manager" ON public.bookings;
CREATE POLICY "bookings_select_own_or_manager" ON public.bookings FOR SELECT USING (
  driver_id = auth.uid() OR 
  get_my_role() = 'manager'
);

-- Trips
DROP POLICY IF EXISTS "trips_select_own_or_manager" ON public.trips;
CREATE POLICY "trips_select_own_or_manager" ON public.trips FOR SELECT USING (
  driver_id = auth.uid() OR 
  get_my_role() = 'manager'
);

-- Inspections
DROP POLICY IF EXISTS "inspections_select_own_or_manager" ON public.inspections;
CREATE POLICY "inspections_select_own_or_manager" ON public.inspections FOR SELECT USING (
  driver_id = auth.uid() OR 
  get_my_role() = 'manager'
);

-- Incidents
DROP POLICY IF EXISTS "incidents_select_own_or_manager" ON public.incidents;
CREATE POLICY "incidents_select_own_or_manager" ON public.incidents FOR SELECT USING (
  driver_id = auth.uid() OR 
  get_my_role() = 'manager'
);

-- 4. Reload schema cache to apply changes immediately
NOTIFY pgrst, 'reload config';
