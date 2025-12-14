-- Reload the PostgREST schema cache to resolve "Database error querying schema"
-- This is necessary after making changes to RLS policies or functions.

NOTIFY pgrst, 'reload config';
