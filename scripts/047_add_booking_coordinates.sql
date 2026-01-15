-- Add coordinate columns to bookings table
-- These are used to store the map positions for route visualization

ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS start_lat FLOAT,
ADD COLUMN IF NOT EXISTS start_lng FLOAT,
ADD COLUMN IF NOT EXISTS dest_lat FLOAT,
ADD COLUMN IF NOT EXISTS dest_lng FLOAT;

-- Reload schema cache
NOTIFY pgrst, 'reload config';
