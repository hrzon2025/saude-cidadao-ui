import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const { usuario, isLoggedIn } = useAppStore();
  const { loading } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Aguardar um pouco para permitir que a autenticação seja verificada
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Só redirecionar se não estiver carregando e não estiver logado
    if (!loading && !isChecking && (!usuario || !isLoggedIn)) {
      navigate("/login", { replace: true });
    }
  }, [usuario, isLoggedIn, navigate, loading, isChecking]);

  // Mostrar loading enquanto verifica autenticação
  if (loading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não estiver logado, não renderiza nada (vai redirecionar)
  if (!usuario || !isLoggedIn) {
    return null;
  }

  // Se estiver logado, renderiza o conteúdo da página
  return <>{children}</>;
}