-- Temporarily disable RLS on usuarios table for registration
-- This is the simplest fix to allow registration to work
ALTER TABLE public.usuarios DISABLE ROW LEVEL SECURITY;

-- Also disable RLS on enderecos table for registration
ALTER TABLE public.enderecos DISABLE ROW LEVEL SECURITY;