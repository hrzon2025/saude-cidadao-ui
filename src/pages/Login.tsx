import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useAppStore } from "@/store/useAppStore";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, user, loading: authLoading } = useAuth();
  const { isLoggedIn } = useAppStore();
  
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Redirect if user is already logged in
  useEffect(() => {
    if (user && isLoggedIn && !authLoading) {
      navigate("/inicio", { replace: true });
    }
  }, [user, isLoggedIn, authLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !senha) {
      setErrorMessage("Preencha todos os campos para continuar.");
      setShowErrorDialog(true);
      return;
    }

    try {
      setLoading(true);
      
      // Primeiro, tentar fazer login com Supabase Auth
      const { error: authError } = await signIn(email, senha);
      
      if (authError) {
        console.error('Erro no login Supabase Auth:', authError);
        
        // Se falhou no Auth, tentar login customizado (fallback)
        const { data: usuarioData, error: usuarioError } = await supabase
          .from('usuarios')
          .select('*')
          .eq('email', email)
          .eq('senha', senha)
          .single();

        if (usuarioError || !usuarioData) {
          console.error('Usuário não encontrado ou senha incorreta:', usuarioError);
          
          // Verificar se o usuário existe (para dar mensagem específica)
          const { data: usuarioExiste } = await supabase
            .from('usuarios')
            .select('email')
            .eq('email', email)
            .single();
          
          if (!usuarioExiste) {
            setErrorMessage("Usuário não encontrado. Por favor, crie uma conta para continuar.");
          } else {
            setErrorMessage("Credenciais inválidas. Verifique os dados e tente novamente.");
          }
          setShowErrorDialog(true);
          return;
        }

        // Login customizado bem-sucedido - salvar dados do usuário logado
        console.log('Login customizado bem-sucedido:', { usuario: usuarioData });
        
        // Buscar endereço do usuário
        const { data: enderecoData } = await supabase
          .from('enderecos')
          .select('*')
          .eq('usuario_id', usuarioData.id)
          .maybeSingle();
        
        // Salvar dados do usuário no store
        const { setUsuario } = useAppStore.getState();
        setUsuario({
          id: usuarioData.id,
          nome: `${usuarioData.nome} ${usuarioData.sobrenome}`,
          cpf: usuarioData.cpf,
          dataNascimento: usuarioData.data_nascimento,
          email: usuarioData.email,
          telefone: usuarioData.celular,
          endereco: enderecoData ? `${enderecoData.logradouro}, ${enderecoData.numero} - ${enderecoData.bairro}, ${enderecoData.cidade}/${enderecoData.uf}` : "",
          avatarUrl: usuarioData.avatar_url || "",
          cns: usuarioData.cns || "",
          preferencias: {
            notificacoes: true,
            biometria: false
          }
        });
      }
      
      // Login bem-sucedido - redirecionar
      navigate("/inicio");
      
    } catch (error) {
      console.error('Erro no login:', error);
      setErrorMessage("Ocorreu um erro inesperado. Tente novamente.");
      setShowErrorDialog(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseErrorDialog = () => {
    setShowErrorDialog(false);
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex flex-col">
      {/* Formulário de Login */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12">
        <div className="mx-auto w-full max-w-sm">
          <div className="space-y-6">
            <div className="text-center">
              <img 
                src="/lovable-uploads/c3ff4b81-712a-4d93-a4b4-e7d92962d5fa.png" 
                alt="Saúde Suzano" 
                className="mx-auto mb-6 h-32 w-auto"
              />
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Entre na sua conta
              </h1>
              <Link 
                to="/cadastro" 
                className="text-primary hover:text-primary-hover transition-colors"
              >
                Ou crie uma nova conta
              </Link>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="senha">
                  Senha <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="senha"
                    type={showPassword ? "text" : "password"}
                    placeholder="Senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="h-12 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Eye className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>

              <div className="text-right">
                <Link 
                  to="/esqueci-senha" 
                  className="text-primary hover:text-primary-hover transition-colors text-sm"
                >
                  Esqueceu sua senha?
                </Link>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-primary hover:bg-primary-hover text-primary-foreground font-medium rounded-xl"
                disabled={loading || authLoading}
              >
                {loading || authLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Diálogo de Erro */}
      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Atenção</AlertDialogTitle>
            <AlertDialogDescription>
              {errorMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleCloseErrorDialog}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}