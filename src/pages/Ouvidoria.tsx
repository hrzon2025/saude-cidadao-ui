import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/ui/app-header";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Ouvidoria() {
  const navigate = useNavigate();
  const [assunto, setAssunto] = useState("");
  const [mensagem, setMensagem] = useState("");

  const handleEnviar = () => {
    if (!assunto.trim() || !mensagem.trim()) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    // Simular envio
    toast.success("Mensagem enviada com sucesso!");
    setAssunto("");
    setMensagem("");
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        title="Ouvidoria"
        showBack={true}
        onBack={() => navigate(-1)}
        className="bg-primary text-primary-foreground"
      />
      
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Entre em Contato</h1>
          <p className="text-muted-foreground">
            Preencha o formulário abaixo para entrar em contato com nossa equipe de suporte.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Assunto</label>
            <Input
              placeholder="Digite o assunto do seu contato"
              value={assunto}
              onChange={(e) => setAssunto(e.target.value)}
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Mensagem</label>
            <Textarea
              placeholder="Digite sua mensagem"
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              className="min-h-[120px] bg-background resize-none"
            />
          </div>

          <Button 
            onClick={handleEnviar}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            size="lg"
          >
            Enviar mensagem
          </Button>
        </div>
      </div>
    </div>
  );
}