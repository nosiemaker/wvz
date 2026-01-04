-- scripts/038_check_auth_triggers.sql
-- Check for any custom triggers on auth.users that might be failing on login (UPDATE)
SELECT 
    tgname, 
    proname, 
    COALESCE(tgqual::text, '') as condition
FROM pg_trigger 
JOIN pg_proc ON pg_trigger.tgfoid = pg_proc.oid
WHERE tgrelid = 'auth.users'::regclass
AND tgname NOT LIKE 'RI_ConstraintTrigger%';
