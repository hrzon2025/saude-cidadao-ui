-- Create ouvidoria table
CREATE TABLE public.ouvidoria (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID NOT NULL,
  assunto TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.ouvidoria ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own ouvidoria messages" 
ON public.ouvidoria 
FOR SELECT 
USING (usuario_id IN (SELECT usuarios.id FROM usuarios));

CREATE POLICY "Users can create their own ouvidoria messages" 
ON public.ouvidoria 
FOR INSERT 
WITH CHECK (usuario_id IN (SELECT usuarios.id FROM usuarios));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_ouvidoria_updated_at
BEFORE UPDATE ON public.ouvidoria
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();