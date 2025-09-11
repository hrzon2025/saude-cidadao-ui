import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/ui/app-header";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useUsuario } from "@/store/useAppStore";
export default function Ouvidoria() {
  const navigate = useNavigate();
  const usuario = useUsuario();
  const [assunto, setAssunto] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const handleEnviar = async () => {
    if (!assunto.trim() || !mensagem.trim()) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    if (!usuario) {
      toast.error("Você precisa estar logado para enviar uma mensagem");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('ouvidoria')
        .insert({
          usuario_id: usuario.id,
          assunto: assunto.trim(),
          mensagem: mensagem.trim()
        });

      if (error) {
        console.error('Erro ao salvar mensagem:', error);
        toast.error("Erro ao enviar mensagem. Tente novamente.");
        return;
      }

      toast.success("Mensagem enviada com sucesso!");
      setAssunto("");
      setMensagem("");
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error("Erro inesperado. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="min-h-screen bg-background">
      <AppHeader title="Ouvidoria" showBack={true} onBack={() => navigate(-1)} className="bg-primary text-primary-foreground" />
      
      <div className="px-[12px] pt-[4px] pb-[16px] my-[10px]">
        <div className="bg-card rounded-lg shadow-sm p-6 space-y-6 px-[24px] py-[24px]">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-card-foreground">Entre em Contato</h1>
            <p className="text-muted-foreground">
              Preencha o formulário abaixo para entrar em contato com nossa equipe de suporte.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-card-foreground">Assunto</label>
              <Input placeholder="Digite o assunto do seu contato" value={assunto} onChange={e => setAssunto(e.target.value)} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-card-foreground">Mensagem</label>
              <Textarea placeholder="Digite sua mensagem" value={mensagem} onChange={e => setMensagem(e.target.value)} className="min-h-[120px] resize-none" />
            </div>

            <Button 
              onClick={handleEnviar} 
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" 
              size="lg"
            >
              {isLoading ? "Enviando..." : "Enviar mensagem"}
            </Button>
          </div>
        </div>
      </div>
    </div>;
}