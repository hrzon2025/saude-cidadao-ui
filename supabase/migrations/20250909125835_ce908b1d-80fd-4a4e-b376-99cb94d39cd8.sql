-- Add password hash field to users table
ALTER TABLE public.users ADD COLUMN senha_hash TEXT;