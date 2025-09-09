-- Create RLS policies for public registration

-- Allow anyone to insert new users (for registration)
CREATE POLICY "Allow public user registration" 
ON public.usuarios 
FOR INSERT 
TO public 
WITH CHECK (true);

-- Allow users to view their own data
CREATE POLICY "Users can view their own data" 
ON public.usuarios 
FOR SELECT 
USING (auth.uid()::text = id::text);

-- Allow users to update their own data
CREATE POLICY "Users can update their own data" 
ON public.usuarios 
FOR UPDATE 
USING (auth.uid()::text = id::text);

-- Allow anyone to insert addresses (for registration)
CREATE POLICY "Allow public address registration" 
ON public.enderecos 
FOR INSERT 
TO public 
WITH CHECK (true);

-- Allow users to view their own addresses
CREATE POLICY "Users can view their own addresses" 
ON public.enderecos 
FOR SELECT 
USING (auth.uid()::text = usuario_id::text);

-- Allow users to update their own addresses
CREATE POLICY "Users can update their own addresses" 
ON public.enderecos 
FOR UPDATE 
USING (auth.uid()::text = usuario_id::text);