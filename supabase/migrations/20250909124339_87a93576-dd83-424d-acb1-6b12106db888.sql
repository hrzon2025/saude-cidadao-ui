-- Adicionar políticas INSERT faltantes

-- Política INSERT para users (permitir para service_role apenas)
CREATE POLICY "Service role can insert users" 
ON public.users 
FOR INSERT 
WITH CHECK (auth.role() = 'service_role');

-- Política INSERT para addresses (permitir para service_role apenas)
CREATE POLICY "Service role can insert addresses" 
ON public.addresses 
FOR INSERT 
WITH CHECK (auth.role() = 'service_role');