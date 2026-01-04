-- scripts/043_check_bookings_schema.sql
-- Check Bookings Table Definition

-- 1. Columns
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'bookings';

-- 2. Constraints (FKs, Checks)
SELECT conname, contype, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'public.bookings'::regclass;

-- 3. Triggers
SELECT trigger_name, action_statement 
FROM information_schema.triggers 
WHERE event_object_table = 'bookings';
