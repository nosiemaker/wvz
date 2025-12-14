-- Modify bookings table to support request workflow
ALTER TABLE public.bookings ALTER COLUMN driver_id DROP NOT NULL;
ALTER TABLE public.bookings ALTER COLUMN vehicle_id DROP NOT NULL;

-- Add new columns to bookings
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS requester_id UUID REFERENCES public.users(id);
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS supervisor_id UUID REFERENCES public.users(id);
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS purpose TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS destination TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS passengers INTEGER;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS is_self_drive BOOLEAN DEFAULT FALSE;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS external_resource_details JSONB;

-- Create trip_logs table
CREATE TABLE IF NOT EXISTS public.trip_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL, -- 'start', 'stop', 'resume', 'complete'
    reason TEXT, -- e.g. 'Food', 'Fuel'
    notes TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on trip_logs
ALTER TABLE public.trip_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for trip_logs
DROP POLICY IF EXISTS "trip_logs_select_own_or_manager" ON public.trip_logs;
CREATE POLICY "trip_logs_select_own_or_manager" ON public.trip_logs FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.trips
        WHERE trips.id = trip_logs.trip_id AND (
            trips.driver_id = auth.uid() OR
            EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('manager', 'admin'))
        )
    )
);

DROP POLICY IF EXISTS "trip_logs_insert_own" ON public.trip_logs;
CREATE POLICY "trip_logs_insert_own" ON public.trip_logs FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.trips
        WHERE trips.id = trip_logs.trip_id AND trips.driver_id = auth.uid()
    )
);

-- Update RLS for bookings to allow requester to see their own requests
DROP POLICY IF EXISTS "bookings_select_own_or_manager" ON public.bookings;
CREATE POLICY "bookings_select_involved" ON public.bookings FOR SELECT USING (
    driver_id = auth.uid() OR 
    requester_id = auth.uid() OR
    supervisor_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('manager', 'admin', 'finance'))
);

DROP POLICY IF EXISTS "bookings_insert_own" ON public.bookings;
CREATE POLICY "bookings_insert_requester" ON public.bookings FOR INSERT WITH CHECK (
    requester_id = auth.uid()
);

DROP POLICY IF EXISTS "bookings_update_involved" ON public.bookings;
CREATE POLICY "bookings_update_involved" ON public.bookings FOR UPDATE USING (
    requester_id = auth.uid() OR
    supervisor_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('manager', 'admin'))
);
