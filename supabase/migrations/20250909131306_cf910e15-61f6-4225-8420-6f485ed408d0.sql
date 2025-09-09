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
  foto_perfil_url TEXT,
  senha TEXT NOT NULL,
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

-- Enable Row Level Security
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enderecos ENABLE ROW LEVEL SECURITY;

-- Create policies for usuarios table
CREATE POLICY "Users can view their own data" 
ON public.usuarios 
FOR SELECT 
USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own data" 
ON public.usuarios 
FOR UPDATE 
USING (auth.uid()::text = id::text);

CREATE POLICY "Allow public registration" 
ON public.usuarios 
FOR INSERT 
WITH CHECK (true);

-- Create policies for enderecos table
CREATE POLICY "Users can view their own addresses" 
ON public.enderecos 
FOR SELECT 
USING (auth.uid()::text = usuario_id::text);

CREATE POLICY "Users can insert their own addresses" 
ON public.enderecos 
FOR INSERT 
WITH CHECK (auth.uid()::text = usuario_id::text);

CREATE POLICY "Users can update their own addresses" 
ON public.enderecos 
FOR UPDATE 
USING (auth.uid()::text = usuario_id::text);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_usuarios_updated_at
BEFORE UPDATE ON public.usuarios
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_enderecos_updated_at
BEFORE UPDATE ON public.enderecos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_usuarios_email ON public.usuarios(email);
CREATE INDEX idx_usuarios_cpf ON public.usuarios(cpf);
CREATE INDEX idx_enderecos_usuario_id ON public.enderecos(usuario_id);