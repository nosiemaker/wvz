-- scripts/039_cleanup_triggers.sql
-- AGGRESSIVE TRIGGER CLEANUP
-- Drops triggers that typically cause Login 500 errors

-- 1. Drop common Auth Triggers (if they exist)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
DROP TRIGGER IF EXISTS on_user_created ON auth.users;

-- 2. Drop Function commonly used by these triggers
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_user_update();

-- 3. Drop Triggers on Public Users that might fail on update
DROP TRIGGER IF EXISTS on_profile_updated ON public.users;
DROP TRIGGER IF EXISTS handle_updated_at ON public.users;

-- 4. Verify no other triggers exist on auth.users (Output list for debugging)
SELECT tgname FROM pg_trigger WHERE tgrelid = 'auth.users'::regclass AND tgname NOT LIKE 'RI_ConstraintTrigger%';

NOTIFY pgrst, 'reload config';
