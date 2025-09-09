-- Create alergias table
CREATE TABLE public.alergias (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID NOT NULL,
  nome TEXT NOT NULL,
  descricao TEXT,
  gravidade TEXT CHECK (gravidade IN ('leve', 'moderada', 'grave')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.alergias ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own alergias" 
ON public.alergias 
FOR SELECT 
USING (usuario_id IN (SELECT id FROM usuarios));

CREATE POLICY "Users can insert their own alergias" 
ON public.alergias 
FOR INSERT 
WITH CHECK (usuario_id IN (SELECT id FROM usuarios));

CREATE POLICY "Users can update their own alergias" 
ON public.alergias 
FOR UPDATE 
USING (usuario_id IN (SELECT id FROM usuarios));

CREATE POLICY "Users can delete their own alergias" 
ON public.alergias 
FOR DELETE 
USING (usuario_id IN (SELECT id FROM usuarios));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_alergias_updated_at
BEFORE UPDATE ON public.alergias
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();