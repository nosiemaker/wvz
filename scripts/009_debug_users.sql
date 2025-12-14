-- Debug script to compare working vs broken users
-- Run this in SQL Editor
SELECT 
  id, 
  email, 
  encrypted_password, 
  raw_user_meta_data,
  app_metadata, 
  aud, 
  role,
  created_at
FROM auth.users;
