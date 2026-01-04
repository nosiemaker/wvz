-- scripts/035_check_triggers_and_policies.sql

-- 1. List Triggers on public.users
SELECT event_object_table, trigger_name, action_statement 
FROM information_schema.triggers 
WHERE event_object_table = 'users' AND event_object_schema = 'public';

-- 2. List Policies on public.users
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'users' AND schemaname = 'public';

-- 3. Check for any triggers on auth.users (requires permission, but worth trying)
-- Often `on_auth_user_created` resides here.
SELECT tgname, proname 
FROM pg_trigger 
JOIN pg_proc ON pg_trigger.tgfoid = pg_proc.oid
WHERE tgrelid = 'auth.users'::regclass;
