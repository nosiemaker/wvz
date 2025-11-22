-- Users/Drivers table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'driver', -- driver, manager, finance, compliance
  license_number TEXT,
  license_expiry DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vehicles table
CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration TEXT UNIQUE NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  status TEXT DEFAULT 'active', -- active, maintenance, retired
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  cost_center TEXT,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected, completed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trips table
CREATE TABLE IF NOT EXISTS public.trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  start_mileage INTEGER,
  end_mileage INTEGER,
  status TEXT DEFAULT 'active', -- active, completed, paused
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inspections table
CREATE TABLE IF NOT EXISTS public.inspections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  trip_id UUID REFERENCES public.trips(id) ON DELETE SET NULL,
  type TEXT NOT NULL, -- pre_trip, post_trip
  status TEXT DEFAULT 'pending', -- pending, completed
  checklist JSONB,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Incidents table
CREATE TABLE IF NOT EXISTS public.incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id),
  trip_id UUID REFERENCES public.trips(id) ON DELETE SET NULL,
  type TEXT NOT NULL, -- accident, violation, mechanical
  severity TEXT DEFAULT 'low', -- low, medium, high, critical
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
DROP POLICY IF EXISTS "users_select_own" ON public.users;
CREATE POLICY "users_select_own" ON public.users FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "users_update_own" ON public.users;
CREATE POLICY "users_update_own" ON public.users FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "managers_select_all" ON public.users;
CREATE POLICY "managers_select_all" ON public.users FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('manager', 'finance', 'compliance'))
);

-- RLS Policies for vehicles
DROP POLICY IF EXISTS "vehicles_select_all" ON public.vehicles;
CREATE POLICY "vehicles_select_all" ON public.vehicles FOR SELECT USING (true);

-- RLS Policies for bookings
DROP POLICY IF EXISTS "bookings_select_own_or_manager" ON public.bookings;
CREATE POLICY "bookings_select_own_or_manager" ON public.bookings FOR SELECT USING (
  driver_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'manager')
);

DROP POLICY IF EXISTS "bookings_insert_own" ON public.bookings;
CREATE POLICY "bookings_insert_own" ON public.bookings FOR INSERT WITH CHECK (driver_id = auth.uid());

-- RLS Policies for trips
DROP POLICY IF EXISTS "trips_select_own_or_manager" ON public.trips;
CREATE POLICY "trips_select_own_or_manager" ON public.trips FOR SELECT USING (
  driver_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'manager')
);

DROP POLICY IF EXISTS "trips_insert_own" ON public.trips;
CREATE POLICY "trips_insert_own" ON public.trips FOR INSERT WITH CHECK (driver_id = auth.uid());

DROP POLICY IF EXISTS "trips_update_own" ON public.trips;
CREATE POLICY "trips_update_own" ON public.trips FOR UPDATE USING (driver_id = auth.uid());

-- RLS Policies for inspections
DROP POLICY IF EXISTS "inspections_select_own_or_manager" ON public.inspections;
CREATE POLICY "inspections_select_own_or_manager" ON public.inspections FOR SELECT USING (
  driver_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'manager')
);

DROP POLICY IF EXISTS "inspections_insert_own" ON public.inspections;
CREATE POLICY "inspections_insert_own" ON public.inspections FOR INSERT WITH CHECK (driver_id = auth.uid());

DROP POLICY IF EXISTS "inspections_update_own" ON public.inspections;
CREATE POLICY "inspections_update_own" ON public.inspections FOR UPDATE USING (driver_id = auth.uid());

-- RLS Policies for incidents
DROP POLICY IF EXISTS "incidents_select_own_or_manager" ON public.incidents;
CREATE POLICY "incidents_select_own_or_manager" ON public.incidents FOR SELECT USING (
  driver_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'manager')
);
