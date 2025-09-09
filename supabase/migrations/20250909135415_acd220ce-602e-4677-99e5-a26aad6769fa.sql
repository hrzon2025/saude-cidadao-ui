-- Update usuarios table to use auth user ID as primary key
-- First, drop the existing primary key constraint
ALTER TABLE public.usuarios DROP CONSTRAINT usuarios_pkey;

-- Drop the existing id column since we'll use auth user id
ALTER TABLE public.usuarios DROP COLUMN id;

-- Add the id column that references auth.users
ALTER TABLE public.usuarios ADD COLUMN id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update RLS policies to use the new structure
DROP POLICY IF EXISTS "Allow public insert for registration" ON public.usuarios;
DROP POLICY IF EXISTS "Users can view their own data" ON public.usuarios;
DROP POLICY IF EXISTS "Users can update their own data" ON public.usuarios;

-- Create new policies that work with auth system
CREATE POLICY "Allow authenticated users to insert their own data" 
ON public.usuarios 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view their own data" 
ON public.usuarios 
FOR SELECT 
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" 
ON public.usuarios 
FOR UPDATE 
TO authenticated
USING (auth.uid() = id);

-- Also update enderecos policies to work with the new structure
DROP POLICY IF EXISTS "Allow public insert for addresses" ON public.enderecos;
DROP POLICY IF EXISTS "Users can view addresses" ON public.enderecos;
DROP POLICY IF EXISTS "Users can update addresses" ON public.enderecos;

CREATE POLICY "Users can insert their own addresses" 
ON public.enderecos 
FOR INSERT 
TO authenticated
WITH CHECK (EXISTS (
  SELECT 1 FROM public.usuarios 
  WHERE usuarios.id = enderecos.usuario_id 
  AND usuarios.id = auth.uid()
));

CREATE POLICY "Users can view their own addresses" 
ON public.enderecos 
FOR SELECT 
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.usuarios 
  WHERE usuarios.id = enderecos.usuario_id 
  AND usuarios.id = auth.uid()
));

CREATE POLICY "Users can update their own addresses" 
ON public.enderecos 
FOR UPDATE 
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.usuarios 
  WHERE usuarios.id = enderecos.usuario_id 
  AND usuarios.id = auth.uid()
));