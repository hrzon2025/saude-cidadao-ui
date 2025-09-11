-- Fix RLS policies for avatars bucket (PostgreSQL compatible syntax)
-- Drop previous restrictive policies if they exist
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;

-- Allow inserts to avatars bucket (no auth required)
CREATE POLICY "Anyone can upload avatars" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'avatars');

-- Allow updates within avatars bucket
CREATE POLICY "Anyone can update avatars" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'avatars')
WITH CHECK (bucket_id = 'avatars');

-- Allow deletes within avatars bucket
CREATE POLICY "Anyone can delete avatars" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'avatars');