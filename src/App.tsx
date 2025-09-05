import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { BottomTabs } from "@/components/ui/bottom-tabs";
import { useAppStore } from "@/store/useAppStore";
import { useEffect } from "react";

// Pages
import Inicio from "./pages/Inicio";
import Funcionalidades from "./pages/Funcionalidades";
import Perfil from "./pages/Perfil";
import NotFound from "./pages/NotFound";
import ListaAgendamentos from "./pages/agendamentos/Lista";
import NovoAgendamento from "./pages/agendamentos/Novo";
import HorariosAgendamento from "./pages/agendamentos/Horarios";
import ConfirmacaoAgendamento from "./pages/agendamentos/Confirmacao";
import Vacinacao from "./pages/Vacinacao";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import EsqueciSenha from "./pages/EsqueciSenha";
import CartaoSus from "./pages/CartaoSus";
import ConsultasRealizadas from "./pages/ConsultasRealizadas";
import MinhaSaude from "./pages/MinhaSaude";
import Unidades from "./pages/Unidades";
import Ouvidoria from "./pages/Ouvidoria";
import Avaliacao1 from "./pages/avaliacao/Avaliacao1";
import Avaliacao2 from "./pages/avaliacao/Avaliacao2";
import Medicamentos from "./pages/Medicamentos";
import Farmacia from "./pages/Farmacia";
import SobreFarmacia from "./pages/SobreFarmacia";

const queryClient = new QueryClient();

// Layout component to conditionally show BottomTabs
const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  // Routes that should have BottomTabs
  const routesWithTabs = ['/inicio', '/funcionalidades', '/perfil'];
  const shouldShowTabs = routesWithTabs.includes(location.pathname);

  return (
    <div className="min-h-screen bg-background">
      {children}
      {shouldShowTabs && <BottomTabs />}
    </div>
  );
};

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
          <Layout>
            <Routes>
              {/* Redirect root to login */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              
              {/* Main Tabs */}
              <Route path="/inicio" element={<Inicio />} />
              <Route path="/funcionalidades" element={<Funcionalidades />} />
              <Route path="/perfil" element={<Perfil />} />
              
              <Route path="/agendamentos" element={<ListaAgendamentos />} />
              <Route path="/agendamentos/novo" element={<NovoAgendamento />} />
              <Route path="/agendamentos/horarios" element={<HorariosAgendamento />} />
              <Route path="/agendamentos/confirmacao" element={<ConfirmacaoAgendamento />} />
              
              {/* Atendimentos */}
              <Route path="/atendimentos" element={<ConsultasRealizadas />} />
              <Route path="/avaliacao/1/:id" element={<Avaliacao1 />} />
              <Route path="/avaliacao/2/:id" element={<Avaliacao2 />} />
              
              {/* Funcionalidades */}
              <Route path="/cartao-sus" element={<CartaoSus />} />
              <Route path="/unidades" element={<Unidades />} />
              <Route path="/servicos" element={<div className="p-8 text-center">Serviços - Em desenvolvimento</div>} />
              <Route path="/ouvidoria" element={<Ouvidoria />} />
              <Route path="/faq" element={<div className="p-8 text-center">FAQ - Em desenvolvimento</div>} />
              <Route path="/minha-saude" element={<MinhaSaude />} />
              <Route path="/medicamentos" element={<Medicamentos />} />
              <Route path="/vacinacao" element={<Vacinacao />} />
              <Route path="/farmacia" element={<Farmacia />} />
              <Route path="/sobre-farmacia" element={<SobreFarmacia />} />
              <Route path="/fila-regulacao" element={<div className="p-8 text-center">Fila Regulação - Em desenvolvimento</div>} />
              
              {/* Perfil */}
              <Route path="/perfil/editar" element={<div className="p-8 text-center">Editar Perfil - Em desenvolvimento</div>} />
              <Route path="/perfil/configuracoes" element={<div className="p-8 text-center">Configurações - Em desenvolvimento</div>} />
              
              {/* Auth */}
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<Cadastro />} />
              <Route path="/esqueci-senha" element={<EsqueciSenha />} />
              
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;