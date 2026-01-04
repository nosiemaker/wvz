-- scripts/044_force_schema_alignment.sql
-- FORCE SCHEMA ALIGNMENT
-- Ensure Bookings table has ALL columns the app tries to Insert.
-- Fixes "Column does not exist" errors that cause 500s.

-- 1. Date/Time Columns (App uses start_date, end_date)
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS start_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS end_date TIMESTAMP WITH TIME ZONE;

-- 2. Trip Details
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS purpose TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS destination TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS passengers INTEGER;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS is_self_drive BOOLEAN DEFAULT FALSE;

-- 3. Workflow & Finance
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS cost_center TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS project_code TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending'; -- Ensure it's TEXT, not a strict ENUM if possible

-- 4. Audit & Execution
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS start_mileage INTEGER;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS end_mileage INTEGER;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES public.users(id);
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- 5. Foreign Keys (Ensure Nullable if needed)
ALTER TABLE public.bookings ALTER COLUMN vehicle_id DROP NOT NULL;
ALTER TABLE public.bookings ALTER COLUMN driver_id DROP NOT NULL;

-- 6. Reload
NOTIFY pgrst, 'reload config';
