-- scripts/031_fix_relationships.sql
-- Fix Foreign Key Naming and Reload Schema to resolve "Database error querying schema"

-- 1. Ensure the Foreign Key is named EXACTLY 'users_supervisor_id_fkey'
-- First, drop any existing constraint on supervisor_id to avoid key collision or wrong naming
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_supervisor_id_fkey;

-- Re-add the constraint with the specific name required by the frontend code
ALTER TABLE public.users
ADD CONSTRAINT users_supervisor_id_fkey
FOREIGN KEY (supervisor_id)
REFERENCES public.users (id);

-- 2. Ensure RLS allows reading users (Basic Profile Access)
-- Drop existing potential policy to avoid conflict
DROP POLICY IF EXISTS "Enable read access for all users" ON public.users;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.users;

-- Create a broad select policy for the MVP to ensure joins work
CREATE POLICY "Public profiles are viewable by everyone"
ON public.users FOR SELECT
USING (true); -- Ideally limit to authenticated, but for MVP/Demo 'true' prevents "missing row" issues on joins

-- Enable RLS just in case it wasn't
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 3. Reload Schema Cache (CRITICAL)
NOTIFY pgrst, 'reload config';
