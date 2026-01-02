-- Add missing columns to trips table for trip management
-- These columns are needed for the mobile driver app to log trip details

ALTER TABLE public.trips ADD COLUMN IF NOT EXISTS destination TEXT;
ALTER TABLE public.trips ADD COLUMN IF NOT EXISTS start_location TEXT;
ALTER TABLE public.trips ADD COLUMN IF NOT EXISTS purpose TEXT;

-- Verify the columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'trips' 
ORDER BY ordinal_position;
