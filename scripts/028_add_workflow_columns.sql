-- scripts/028_add_workflow_columns.sql

-- 1. Users Table Updates
-- Support for:
-- - Separating drivers vs non-drivers (can_drive)
-- - Hierarchy (supervisor_id) for proper approval routing
-- - Compliance tracking (violation_points)
-- - Job Title for display
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS can_drive BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS supervisor_id UUID REFERENCES public.users(id),
ADD COLUMN IF NOT EXISTS violation_points INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS job_title TEXT;

-- 2. Bookings Table Updates
-- Support for:
-- - Mileage logging (start/end) for trip execution
-- - Approval audit trail (approved_by, rejection_reason)
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS start_mileage INTEGER,
ADD COLUMN IF NOT EXISTS end_mileage INTEGER,
ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES public.users(id),
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- 3. Notify PostgREST to reload schema
NOTIFY pgrst, 'reload config';
