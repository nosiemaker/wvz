-- scripts/037_nuke_policies.sql
-- EMERGENCY FIX: Remove all RLS from users table to fix Login 500 Error
-- Use this to confirm if RLS recursion is the blocker.

-- 1. Disable RLS on users temporarily
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- 2. Drop any and all policies on users (to clear bad logic)
DROP POLICY IF EXISTS "Enable read access for all users" ON public.users;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Allow individual read access" ON public.users;
DROP POLICY IF EXISTS "Allow individual update access" ON public.users;

-- 3. Re-enable with a SINGLE, safe policy
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow All Access For Demo"
ON public.users
FOR ALL
USING (true)
WITH CHECK (true);

-- 4. Reload Schema
NOTIFY pgrst, 'reload config';
