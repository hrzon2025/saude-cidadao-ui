-- Relax avatars bucket RLS to allow uploads without Supabase Auth session
-- Drop previous restrictive policies if they exist
DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
  DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
  DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
END $$;

-- Keep public read
DO $$ BEGIN
  -- Ensure select policy exists (idempotent)
  CREATE POLICY "Avatar images are publicly accessible" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'avatars');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Allow inserts to avatars bucket (no auth required)
CREATE POLICY IF NOT EXISTS "Anyone can upload avatars" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'avatars');

-- Allow updates within avatars bucket
CREATE POLICY IF NOT EXISTS "Anyone can update avatars" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'avatars')
WITH CHECK (bucket_id = 'avatars');

-- Allow deletes within avatars bucket
CREATE POLICY IF NOT EXISTS "Anyone can delete avatars" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'avatars');