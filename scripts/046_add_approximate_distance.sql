-- Add Approximate Distance column to bookings table
-- This supports the requirement to capture estimated trip distance during request.

ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS approximate_distance FLOAT;

-- Reload schema cache
NOTIFY pgrst, 'reload config';
