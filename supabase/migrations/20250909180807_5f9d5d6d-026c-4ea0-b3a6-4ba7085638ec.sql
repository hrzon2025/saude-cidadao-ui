-- Create medicoes table
CREATE TABLE public.medicoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID NOT NULL,
  pressao_arterial TEXT,
  glicemia TEXT,
  oxigenacao_sangue TEXT,
  peso TEXT,
  altura TEXT,
  alergias TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT medicoes_usuario_id_unique UNIQUE (usuario_id)
);

-- Enable Row Level Security
ALTER TABLE public.medicoes ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own medicoes" 
ON public.medicoes 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM usuarios 
  WHERE usuarios.id = medicoes.usuario_id 
  AND usuarios.id = auth.uid()
));

CREATE POLICY "Users can insert their own medicoes" 
ON public.medicoes 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM usuarios 
  WHERE usuarios.id = medicoes.usuario_id 
  AND usuarios.id = auth.uid()
));

CREATE POLICY "Users can update their own medicoes" 
ON public.medicoes 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM usuarios 
  WHERE usuarios.id = medicoes.usuario_id 
  AND usuarios.id = auth.uid()
));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_medicoes_updated_at
BEFORE UPDATE ON public.medicoes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();