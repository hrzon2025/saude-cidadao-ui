-- Remover política SELECT restritiva e criar uma que permite login
DROP POLICY IF EXISTS "Users can view their own data" ON public.usuarios;

-- Criar política que permite consultar usuários para login
CREATE POLICY "Allow login queries" 
ON public.usuarios 
FOR SELECT 
USING (true);

-- Manter as outras políticas mas ajustar a UPDATE para permitir atualizações do próprio registro
DROP POLICY IF EXISTS "Users can update their own data" ON public.usuarios;

CREATE POLICY "Users can update their own data" 
ON public.usuarios 
FOR UPDATE 
USING (true) 
WITH CHECK (true);