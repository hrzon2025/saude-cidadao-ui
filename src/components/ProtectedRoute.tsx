import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const { usuario, isLoggedIn } = useAppStore();

  useEffect(() => {
    console.log('ProtectedRoute - Estado atual:', { usuario: !!usuario, isLoggedIn });
    
    if (!usuario || !isLoggedIn) {
      // Redireciona para login se não estiver logado
      navigate("/login", { replace: true });
    }
  }, [usuario, isLoggedIn, navigate]);

  // Se não estiver logado, não renderiza nada (vai redirecionar)
  if (!usuario || !isLoggedIn) {
    return null;
  }

  // Se estiver logado, renderiza o conteúdo da página
  return <>{children}</>;
}