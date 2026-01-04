-- scripts/034_check_users_exist.sql
SELECT 'AUTH' as source, id, email, role FROM auth.users WHERE email LIKE '%@fleet.com';
SELECT 'PUBLIC' as source, id, email, role, supervisor_id FROM public.users WHERE email LIKE '%@fleet.com';
