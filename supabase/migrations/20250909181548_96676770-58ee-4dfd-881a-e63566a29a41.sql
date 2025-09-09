-- Fix RLS policies for medicoes table to work with custom auth system
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own medicoes" ON public.medicoes;
DROP POLICY IF EXISTS "Users can insert their own medicoes" ON public.medicoes;
DROP POLICY IF EXISTS "Users can update their own medicoes" ON public.medicoes;

-- Create new policies that work with custom authentication
CREATE POLICY "Users can view their own medicoes" 
ON public.medicoes 
FOR SELECT 
USING (usuario_id IN (SELECT id FROM usuarios));

CREATE POLICY "Users can insert their own medicoes" 
ON public.medicoes 
FOR INSERT 
WITH CHECK (usuario_id IN (SELECT id FROM usuarios));

CREATE POLICY "Users can update their own medicoes" 
ON public.medicoes 
FOR UPDATE 
USING (usuario_id IN (SELECT id FROM usuarios));