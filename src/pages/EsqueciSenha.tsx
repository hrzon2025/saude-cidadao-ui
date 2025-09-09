import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const EsqueciSenha = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Erro",
        description: "Por favor, informe seu email.",
        variant: "destructive",
      });
      return;
    }

    if (!email.includes("@")) {
      toast({
        title: "Erro", 
        description: "Por favor, informe um email válido.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Simular envio de email
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Email enviado",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12">
        <div className="mx-auto w-full max-w-sm">
          <div className="space-y-6">
            {/* Ícone e título */}
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Esqueci minha senha
              </h1>
              <p className="text-muted-foreground text-sm">
                Digite seu email para receber as instruções de redefinição de senha
              </p>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Digite seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-primary hover:bg-primary-hover text-primary-foreground font-medium rounded-xl" 
                disabled={loading}
              >
                {loading ? "Enviando..." : "Enviar instruções"}
              </Button>
              
              <div className="text-center">
                <Link 
                  to="/login" 
                  className="text-primary hover:text-primary-hover transition-colors text-sm"
                >
                  Voltar para o login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EsqueciSenha;