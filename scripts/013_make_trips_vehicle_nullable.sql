-- Make vehicle_id nullable in trips table to support external vehicles
ALTER TABLE public.trips ALTER COLUMN vehicle_id DROP NOT NULL;
