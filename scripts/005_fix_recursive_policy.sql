-- Fix infinite recursion in RLS policies by using a security definer function
-- to fetch user role without triggering RLS loops.

-- 1. Create a helper function to get the current user's role
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS zmwzmw
DECLARE
  v_role text;
BEGIN
  -- This query runs with the privileges of the function creator, 
  -- bypassing RLS on the users table.
  SELECT role INTO v_role 
  FROM public.users 
  WHERE id = auth.uid();
  
  RETURN v_role;
END;
zmwzmw;

-- 2. Update RLS policies for 'users' table 
-- We replace the recursive subquery with the security definer function

DROP POLICY IF EXISTS "managers_select_all" ON public.users;
CREATE POLICY "managers_select_all" ON public.users FOR SELECT USING (
  get_my_role() IN ('manager', 'finance', 'compliance')
);

-- 3. Update other tables to also use the helper function for better performance
-- (Optional but recommended to avoid unnecessary RLS checks on the users table)

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
