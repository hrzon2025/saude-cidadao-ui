// Redirecionamento para a nova estrutura - esta página não é mais usada diretamente
// O conteúdo principal está agora em /pages/Inicio.tsx

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redireciona para a página inicial do app
    navigate('/', { replace: true });
  }, [navigate]);

  return null;
};

export default Index;
