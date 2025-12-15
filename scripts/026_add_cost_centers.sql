-- Add Cost Center and Project Code columns to bookings table
-- This supports the requirement for "Mandatory selection of cost center/project code".

ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS cost_center TEXT,
ADD COLUMN IF NOT EXISTS project_code TEXT;

-- Reload schema cache
NOTIFY pgrst, 'reload config';
