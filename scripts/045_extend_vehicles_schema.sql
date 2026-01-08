-- scripts/045_extend_vehicles_schema.sql
-- Add missing columns to vehicles table to support advanced fleet management
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS vin TEXT;
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS color TEXT;
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS fuel_type TEXT;
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS license_required TEXT;
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS maintenance_interval_km INTEGER DEFAULT 5000;
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS current_mileage INTEGER DEFAULT 0;
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS next_service_date TIMESTAMP WITH TIME ZONE;

-- Add INSERT policy for authenticated users (Fleet Managers)
-- In a real app, you'd check for role = 'manager'
DROP POLICY IF EXISTS "permit_all_vehicles" ON public.vehicles;
CREATE POLICY "permit_all_vehicles" ON public.vehicles 
FOR ALL TO authenticated 
USING (true) 
WITH CHECK (true);

-- Also ensure public.users has license_class if we want to store it
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS license_class TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS phone TEXT; -- Ensure phone exists

-- Reload config
NOTIFY pgrst, 'reload config';
