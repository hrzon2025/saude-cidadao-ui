import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { BottomTabs } from "@/components/ui/bottom-tabs";
import { useAppStore } from "@/store/useAppStore";
import { useEffect } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AuthProvider } from "@/components/AuthProvider";

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
import Alergias from "./pages/Alergias";
import Unidades from "./pages/Unidades";
import Ouvidoria from "./pages/Ouvidoria";
import Avaliacao1 from "./pages/avaliacao/Avaliacao1";
import Avaliacao2 from "./pages/avaliacao/Avaliacao2";
import Medicamentos from "./pages/Medicamentos";
import Farmacia from "./pages/Farmacia";
import SobreFarmacia from "./pages/SobreFarmacia";
import RelacaoMedicamentos from "./pages/RelacaoMedicamentos";
import FarmaciaPopular from "./pages/FarmaciaPopular";
import ComponentesEspecializados from "./pages/ComponentesEspecializados";
import ComissaoFarmacologia from "./pages/ComissaoFarmacologia";
import FAQ from "./pages/FAQ";
import EditarPerfil from "./pages/EditarPerfil";
import Notificacoes from "./pages/Notificacoes";
import { ScrollToTop } from "./components/ScrollToTop";

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
        <AuthProvider>
          <BrowserRouter>
          <ScrollToTop />
          <Layout>
            <Routes>
              {/* Redirect root to login */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              
               {/* Main Tabs - Protected Routes */}
               <Route path="/inicio" element={<ProtectedRoute><Inicio /></ProtectedRoute>} />
               <Route path="/funcionalidades" element={<ProtectedRoute><Funcionalidades /></ProtectedRoute>} />
               <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
               
               <Route path="/agendamentos" element={<ProtectedRoute><ListaAgendamentos /></ProtectedRoute>} />
               <Route path="/agendamentos/novo" element={<ProtectedRoute><NovoAgendamento /></ProtectedRoute>} />
               <Route path="/agendamentos/horarios" element={<ProtectedRoute><HorariosAgendamento /></ProtectedRoute>} />
               <Route path="/agendamentos/confirmacao" element={<ProtectedRoute><ConfirmacaoAgendamento /></ProtectedRoute>} />
               
               {/* Atendimentos - Protected Routes */}
               <Route path="/atendimentos" element={<ProtectedRoute><ConsultasRealizadas /></ProtectedRoute>} />
               <Route path="/avaliacao/1/:id" element={<ProtectedRoute><Avaliacao1 /></ProtectedRoute>} />
               <Route path="/avaliacao/2/:id" element={<ProtectedRoute><Avaliacao2 /></ProtectedRoute>} />
               
               {/* Funcionalidades - Protected Routes */}
               <Route path="/cartao-sus" element={<ProtectedRoute><CartaoSus /></ProtectedRoute>} />
               <Route path="/unidades" element={<ProtectedRoute><Unidades /></ProtectedRoute>} />
               <Route path="/servicos" element={<ProtectedRoute><div className="p-8 text-center">Serviços - Em desenvolvimento</div></ProtectedRoute>} />
               <Route path="/ouvidoria" element={<ProtectedRoute><Ouvidoria /></ProtectedRoute>} />
               <Route path="/faq" element={<ProtectedRoute><FAQ /></ProtectedRoute>} />
                <Route path="/minha-saude" element={<ProtectedRoute><MinhaSaude /></ProtectedRoute>} />
                <Route path="/alergias" element={<ProtectedRoute><Alergias /></ProtectedRoute>} />
                <Route path="/medicamentos" element={<ProtectedRoute><Medicamentos /></ProtectedRoute>} />
               <Route path="/vacinacao" element={<ProtectedRoute><Vacinacao /></ProtectedRoute>} />
                <Route path="/farmacia" element={<ProtectedRoute><Farmacia /></ProtectedRoute>} />
                <Route path="/sobre-farmacia" element={<ProtectedRoute><SobreFarmacia /></ProtectedRoute>} />
                <Route path="/relacao-medicamentos" element={<ProtectedRoute><RelacaoMedicamentos /></ProtectedRoute>} />
                <Route path="/farmacia-popular" element={<ProtectedRoute><FarmaciaPopular /></ProtectedRoute>} />
                <Route path="/componentes-especializados" element={<ProtectedRoute><ComponentesEspecializados /></ProtectedRoute>} />
                <Route path="/comissao-farmacologia" element={<ProtectedRoute><ComissaoFarmacologia /></ProtectedRoute>} />
               <Route path="/fila-regulacao" element={<ProtectedRoute><div className="p-8 text-center">Fila Regulação - Em desenvolvimento</div></ProtectedRoute>} />
               
               {/* Perfil - Protected Routes */}
               <Route path="/perfil/editar" element={<ProtectedRoute><EditarPerfil /></ProtectedRoute>} />
               <Route path="/perfil/configuracoes" element={<ProtectedRoute><div className="p-8 text-center">Configurações - Em desenvolvimento</div></ProtectedRoute>} />
               
               {/* Notificações - Protected Route */}
               <Route path="/notificacoes" element={<ProtectedRoute><Notificacoes /></ProtectedRoute>} />
              
              {/* Auth */}
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<Cadastro />} />
              <Route path="/esqueci-senha" element={<EsqueciSenha />} />
              
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;