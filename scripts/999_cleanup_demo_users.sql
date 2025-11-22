-- Cleanup demo users to fix sync issues between auth.users and public.users

-- 1. Delete from public.users (profiles)
DELETE FROM public.users 
WHERE email IN (
  'driver@fleet.com',
  'driver1@fleet.com',
  'driver2@fleet.com',
  'manager@fleet.com',
  'finance@fleet.com',
  'compliance@fleet.com'
);

-- 2. Delete from auth.users (identities)
-- Note: You usually can't delete from auth.users directly in some Supabase UI contexts due to permissions,
-- but if you are the admin running this in the SQL editor, it should work.
-- If this fails, you might need to delete them from the Authentication > Users dashboard manually.
DELETE FROM auth.users 
WHERE email IN (
  'driver@fleet.com',
  'driver1@fleet.com',
  'driver2@fleet.com',
  'manager@fleet.com',
  'finance@fleet.com',
  'compliance@fleet.com'
);
