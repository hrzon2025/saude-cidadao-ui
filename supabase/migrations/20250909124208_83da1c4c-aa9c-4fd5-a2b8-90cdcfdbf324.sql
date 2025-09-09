-- Criar tabela users
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  sobrenome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  cpf TEXT NOT NULL UNIQUE,
  data_nascimento DATE NOT NULL,
  cns TEXT,
  genero TEXT,
  celular TEXT,
  foto TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela addresses
CREATE TABLE public.addresses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
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

-- Criar bucket para fotos de usuários
INSERT INTO storage.buckets (id, name, public) VALUES ('user-photos', 'user-photos', true);

-- Habilitar RLS nas tabelas
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para users
CREATE POLICY "Users can view their own data" 
ON public.users 
FOR SELECT 
USING (auth.uid()::text = id::text OR auth.role() = 'service_role');

CREATE POLICY "Users can update their own data" 
ON public.users 
FOR UPDATE 
USING (auth.uid()::text = id::text);

-- Políticas RLS para addresses
CREATE POLICY "Users can view their own addresses" 
ON public.addresses 
FOR SELECT 
USING (auth.uid()::text = user_id::text OR auth.role() = 'service_role');

CREATE POLICY "Users can update their own addresses" 
ON public.addresses 
FOR UPDATE 
USING (auth.uid()::text = user_id::text);

-- Políticas para Storage
CREATE POLICY "Users can view user photos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'user-photos');

CREATE POLICY "Users can upload their own photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'user-photos');

CREATE POLICY "Users can update their own photos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'user-photos');

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers para updated_at
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_addresses_updated_at
BEFORE UPDATE ON public.addresses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();