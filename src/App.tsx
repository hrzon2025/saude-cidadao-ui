import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BottomTabs } from "@/components/ui/bottom-tabs";
import { useAppStore } from "@/store/useAppStore";
import { useEffect } from "react";

// Pages
import Inicio from "./pages/Inicio";
import Funcionalidades from "./pages/Funcionalidades";
import Perfil from "./pages/Perfil";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const { isDarkMode } = useAppStore();

  // Apply theme on app start
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Routes>
              {/* Main Tabs */}
              <Route path="/" element={<Inicio />} />
              <Route path="/funcionalidades" element={<Funcionalidades />} />
              <Route path="/perfil" element={<Perfil />} />
              
              {/* Agendamentos */}
              <Route path="/agendamentos/novo" element={<div className="p-8 text-center">Agendamento - Em desenvolvimento</div>} />
              <Route path="/agendamentos/confirmacao" element={<div className="p-8 text-center">Confirmação - Em desenvolvimento</div>} />
              
              {/* Atendimentos */}
              <Route path="/atendimentos" element={<div className="p-8 text-center">Atendimentos - Em desenvolvimento</div>} />
              <Route path="/avaliacao/:id" element={<div className="p-8 text-center">Avaliação - Em desenvolvimento</div>} />
              
              {/* Funcionalidades */}
              <Route path="/cartao-sus" element={<div className="p-8 text-center">Cartão SUS - Em desenvolvimento</div>} />
              <Route path="/unidades" element={<div className="p-8 text-center">Unidades - Em desenvolvimento</div>} />
              <Route path="/servicos" element={<div className="p-8 text-center">Serviços - Em desenvolvimento</div>} />
              <Route path="/ouvidoria" element={<div className="p-8 text-center">Ouvidoria - Em desenvolvimento</div>} />
              <Route path="/faq" element={<div className="p-8 text-center">FAQ - Em desenvolvimento</div>} />
              <Route path="/minha-saude" element={<div className="p-8 text-center">Minha Saúde - Em desenvolvimento</div>} />
              <Route path="/medicamentos" element={<div className="p-8 text-center">Medicamentos - Em desenvolvimento</div>} />
              <Route path="/vacinacao" element={<div className="p-8 text-center">Vacinação - Em desenvolvimento</div>} />
              <Route path="/farmacia" element={<div className="p-8 text-center">Farmácia - Em desenvolvimento</div>} />
              <Route path="/fila-regulacao" element={<div className="p-8 text-center">Fila Regulação - Em desenvolvimento</div>} />
              
              {/* Perfil */}
              <Route path="/perfil/editar" element={<div className="p-8 text-center">Editar Perfil - Em desenvolvimento</div>} />
              <Route path="/perfil/configuracoes" element={<div className="p-8 text-center">Configurações - Em desenvolvimento</div>} />
              
              {/* Auth */}
              <Route path="/login" element={<div className="p-8 text-center">Login - Em desenvolvimento</div>} />
              <Route path="/cadastro" element={<div className="p-8 text-center">Cadastro - Em desenvolvimento</div>} />
              
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            
            <BottomTabs />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
