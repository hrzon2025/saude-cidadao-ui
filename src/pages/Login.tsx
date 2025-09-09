import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useAppStore } from "@/store/useAppStore";

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !senha) {
      setErrorMessage("Preencha todos os campos para continuar.");
      setShowErrorDialog(true);
      return;
    }

    try {
      setLoading(true);
      
      // Verificar se o usuário existe na nossa tabela usuarios e validar senha
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

      // Buscar endereço do usuário
      const { data: enderecoData } = await supabase
        .from('enderecos')
        .select('*')
        .eq('usuario_id', usuarioData.id)
        .single();

      // Login bem-sucedido - salvar dados do usuário logado
      console.log('Login bem-sucedido:', { usuario: usuarioData });
      
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
        avatarUrl: "",
        cns: usuarioData.cns || "",
        preferencias: {
          notificacoes: true,
          biometria: false
        }
      });
      
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
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Entre na sua conta
              </h1>
              <Link 
                to="/cadastro" 
                className="text-purple-600 hover:text-purple-700 transition-colors"
              >
                Ou crie uma nova conta
              </Link>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="senha">
                  Senha <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="senha"
                    type={showPassword ? "text" : "password"}
                    placeholder="Senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="h-12 pr-10 bg-white"
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
                  className="text-purple-600 hover:text-purple-700 transition-colors text-sm"
                >
                  Esqueceu sua senha?
                </Link>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl"
                disabled={loading}
              >
                {loading ? "Entrando..." : "Entrar"}
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