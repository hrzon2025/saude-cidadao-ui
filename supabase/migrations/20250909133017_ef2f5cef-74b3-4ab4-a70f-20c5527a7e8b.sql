-- Drop existing restrictive policies and create public registration policies

DROP POLICY IF EXISTS "Users can insert their own addresses" ON public.enderecos;
DROP POLICY IF EXISTS "Users can view their own addresses" ON public.enderecos;
DROP POLICY IF EXISTS "Users can update their own addresses" ON public.enderecos;

-- Create new policies that allow public registration
CREATE POLICY "Allow public address registration" 
ON public.enderecos 
FOR INSERT 
TO public 
WITH CHECK (true);

-- Allow users to view their own addresses (after they're logged in)
CREATE POLICY "Users can view their own addresses" 
ON public.enderecos 
FOR SELECT 
USING (auth.uid()::text = usuario_id::text);

-- Allow users to update their own addresses (after they're logged in)
CREATE POLICY "Users can update their own addresses" 
ON public.enderecos 
FOR UPDATE 
USING (auth.uid()::text = usuario_id::text);