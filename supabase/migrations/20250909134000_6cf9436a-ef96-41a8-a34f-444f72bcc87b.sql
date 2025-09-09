-- Criar tabela usuarios
CREATE TABLE public.usuarios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  sobrenome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  cpf TEXT NOT NULL UNIQUE,
  data_nascimento DATE NOT NULL,
  genero TEXT,
  celular TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela enderecos
CREATE TABLE public.enderecos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
  cep TEXT NOT NULL,
  logradouro TEXT NOT NULL,
  numero TEXT NOT NULL,
  complemento TEXT,
  bairro TEXT NOT NULL,
  cidade TEXT NOT NULL,
  uf TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS nas tabelas
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enderecos ENABLE ROW LEVEL SECURITY;

-- Políticas para cadastro público na tabela usuarios
CREATE POLICY "Permitir inserção pública de usuarios" 
ON public.usuarios 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Usuarios podem ver seus próprios dados" 
ON public.usuarios 
FOR SELECT 
USING (auth.uid()::text = id::text);

CREATE POLICY "Usuarios podem atualizar seus próprios dados" 
ON public.usuarios 
FOR UPDATE 
USING (auth.uid()::text = id::text);

-- Políticas para cadastro público na tabela enderecos
CREATE POLICY "Permitir inserção pública de enderecos" 
ON public.enderecos 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Usuarios podem ver seus próprios enderecos" 
ON public.enderecos 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.usuarios 
  WHERE usuarios.id = enderecos.usuario_id 
  AND auth.uid()::text = usuarios.id::text
));

CREATE POLICY "Usuarios podem atualizar seus próprios enderecos" 
ON public.enderecos 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.usuarios 
  WHERE usuarios.id = enderecos.usuario_id 
  AND auth.uid()::text = usuarios.id::text
));

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_usuarios_updated_at
  BEFORE UPDATE ON public.usuarios
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_enderecos_updated_at
  BEFORE UPDATE ON public.enderecos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();