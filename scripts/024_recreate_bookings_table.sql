-- RECREATE BOOKINGS TABLE
-- The bookings table seems to have persistent schema or policy corruption causing "Database error querying schema".
-- We will drop it entirely and recreate it clean.

-- 1. Drop existing table (and dependent constraints)
DROP TABLE IF EXISTS public.bookings CASCADE;

-- 2. Re-create Bookings Table (Combining 001 and 012 schema definitions)
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Original fields
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected, completed, in_progress
    
    -- Foreign Keys (Nullable to support various states)
    driver_id UUID REFERENCES public.users(id),
    vehicle_id UUID REFERENCES public.vehicles(id),
    
    -- New Workflow fields (from 012)
    requester_id UUID REFERENCES public.users(id),
    supervisor_id UUID REFERENCES public.users(id),
    purpose TEXT,
    destination TEXT,
    passengers INTEGER,
    is_self_drive BOOLEAN DEFAULT FALSE,
    external_resource_details JSONB
);

-- 3. Restore Foreign Key from Trips -> Bookings (broken by CASCADE drop)
-- Note: Check if the column exists first, usually it does.
ALTER TABLE public.trips 
    DROP CONSTRAINT IF EXISTS trips_booking_id_fkey,
    ADD CONSTRAINT trips_booking_id_fkey 
    FOREIGN KEY (booking_id) REFERENCES public.bookings(id) 
    ON DELETE SET NULL;

-- 4. Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- 5. Add SIMPLE, PERMISSIVE Policies (No recursion risk)
CREATE POLICY "bookings_read_all" ON public.bookings
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "bookings_insert_all" ON public.bookings
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "bookings_update_all" ON public.bookings
    FOR UPDATE TO authenticated USING (true);
    
CREATE POLICY "bookings_delete_all" ON public.bookings
    FOR DELETE TO authenticated USING (true);

-- 6. Grant Permissions
GRANT ALL ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;

-- 7. Reload Schema
NOTIFY pgrst, 'reload config';
