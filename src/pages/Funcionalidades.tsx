import { useState, useEffect } from "react";
import { AppHeader } from "@/components/ui/app-header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, ChevronRight } from "lucide-react";
import { consultarServicos } from "@/lib/stubs/services";
import { Servico } from "@/lib/types";
import { SkeletonCardList } from "@/components/skeletons/skeleton-card";
import { ErrorBanner } from "@/components/ui/error-banner";
import { EmptyState } from "@/components/ui/empty-state";
import { useNavigate } from "react-router-dom";
import * as Icons from "lucide-react";

const iconMap: Record<string, React.ComponentType<any>> = {
  stethoscope: Icons.Stethoscope,
  bandage: Icons.Bandage,
  'heart-pulse': Icons.HeartPulse,
  syringe: Icons.Syringe,
  pill: Icons.Pill,
  calendar: Icons.Calendar,
  user: Icons.User,
  building: Icons.Building,
  phone: Icons.Phone,
  'file-text': Icons.FileText
};

export default function Funcionalidades() {
  const navigate = useNavigate();
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [filteredServicos, setFilteredServicos] = useState<Servico[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadServicos();
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = servicos.filter(servico =>
        servico.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        servico.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        servico.categoria.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredServicos(filtered);
    } else {
      setFilteredServicos(servicos);
    }
  }, [searchTerm, servicos]);

  const loadServicos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await consultarServicos();
      setServicos(data);
      setFilteredServicos(data);
    } catch (err) {
      setError('Erro ao carregar serviços');
      console.error('Erro ao carregar serviços:', err);
    } finally {
      setLoading(false);
    }
  };

  const groupedServicos = filteredServicos.reduce((acc, servico) => {
    if (!acc[servico.categoria]) {
      acc[servico.categoria] = [];
    }
    acc[servico.categoria].push(servico);
    return acc;
  }, {} as Record<string, Servico[]>);

  const handleServicoClick = (servico: Servico) => {
    // Navegar para página específica baseada no serviço
    switch (servico.id) {
      case '1': // Consultas Médicas
        navigate('/agendamentos/novo');
        break;
      case '4': // Imunização
        navigate('/vacinacao');
        break;
      default:
        navigate('/servicos');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20">
      <AppHeader title="Funcionalidades" />

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar serviços..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Conteúdo */}
        {loading ? (
          <SkeletonCardList count={6} />
        ) : error ? (
          <ErrorBanner 
            message={error}
            onRetry={loadServicos}
          />
        ) : filteredServicos.length === 0 ? (
          <EmptyState
            icon={Search}
            title={searchTerm ? "Nenhum serviço encontrado" : "Nenhum serviço disponível"}
            description={searchTerm ? "Tente buscar por outros termos" : "Não há serviços cadastrados no momento"}
            action={searchTerm ? {
              label: "Limpar busca",
              onClick: () => setSearchTerm("")
            } : undefined}
          />
        ) : (
          <div className="space-y-6">
            {/* Saúde Pessoal */}
            <section>
              <Card className="p-6">
                <h2 className="text-xl font-bold text-primary mb-6">Saúde Pessoal</h2>
                <div className="space-y-4">
                  <div 
                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => navigate('/minha-saude')}
                  >
                    <div className="p-2 rounded-full bg-primary/10">
                      <Icons.Heart className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">Minha Saúde</h3>
                      <p className="text-sm text-muted-foreground">Acompanhe seus dados de saúde e histórico médico</p>
                    </div>
                  </div>
                  
                  <div 
                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => navigate('/consultas-realizadas')}
                  >
                    <div className="p-2 rounded-full bg-primary/10">
                      <Icons.Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">Atendimentos</h3>
                      <p className="text-sm text-muted-foreground">Consulte e agende consultas médicas</p>
                    </div>
                  </div>
                  
                  <div 
                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => navigate('/agendamentos/novo')}
                  >
                    <div className="p-2 rounded-full bg-primary/10">
                      <Icons.Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">Pré Agendamento</h3>
                      <p className="text-sm text-muted-foreground">Solicite agendamento de consulta na UBS</p>
                    </div>
                  </div>
                  
                  <div 
                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => navigate('/medicamentos')}
                  >
                    <div className="p-2 rounded-full bg-primary/10">
                      <Icons.Pill className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">Medicamentos</h3>
                      <p className="text-sm text-muted-foreground">Acesse informações sobre seus medicamentos</p>
                    </div>
                  </div>
                  
                  <div 
                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => navigate('/farmacia')}
                  >
                    <div className="p-2 rounded-full bg-primary/10">
                      <Icons.Cross className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">Farmácia</h3>
                      <p className="text-sm text-muted-foreground">Consulte disponibilidade de medicamentos na rede pública</p>
                    </div>
                  </div>
                  
                  <div 
                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => navigate('/fila-regulacao')}
                  >
                    <div className="p-2 rounded-full bg-primary/10">
                      <Icons.List className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">Fila de Regulação</h3>
                      <p className="text-sm text-muted-foreground">Acompanhe seus encaminhamentos para especialistas e exames</p>
                    </div>
                  </div>
                </div>
              </Card>
            </section>

            {/* Serviços de Saúde */}
            <section>
              <Card className="p-6">
                <h2 className="text-xl font-bold text-primary mb-6">Serviços de Saúde</h2>
                <div className="space-y-4">
                  <div 
                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => navigate('/unidades')}
                  >
                    <div className="p-2 rounded-full bg-primary/10">
                      <Icons.MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">Unidades de Saúde</h3>
                      <p className="text-sm text-muted-foreground">Localize e obtenha informações sobre unidades de saúde</p>
                    </div>
                  </div>
                  
                  <div 
                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => navigate('/vacinacao')}
                  >
                    <div className="p-2 rounded-full bg-primary/10">
                      <Icons.Syringe className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">Vacinas</h3>
                      <p className="text-sm text-muted-foreground">Acompanhe seu cartão de vacinação digital</p>
                    </div>
                  </div>
                  
                  <div 
                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => navigate('/servicos')}
                  >
                    <div className="p-2 rounded-full bg-primary/10">
                      <Icons.Users className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">Serviços</h3>
                      <p className="text-sm text-muted-foreground">Conheça os serviços prestados nas UBS e USF</p>
                    </div>
                  </div>
                </div>
              </Card>
            </section>

            {/* Informações */}
            <section>
              <Card className="p-6">
                <h2 className="text-xl font-bold text-primary mb-6">Informações</h2>
                <div className="space-y-4">
                  <div 
                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => navigate('/noticias')}
                  >
                    <div className="p-2 rounded-full bg-primary/10">
                      <Icons.Newspaper className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">Notícias</h3>
                      <p className="text-sm text-muted-foreground">Fique por dentro das últimas notícias de saúde</p>
                    </div>
                  </div>
                  
                  <div 
                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => navigate('/avisos')}
                  >
                    <div className="p-2 rounded-full bg-primary/10">
                      <Icons.AlertCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">Avisos</h3>
                      <p className="text-sm text-muted-foreground">Comunicados importantes sobre saúde pública</p>
                    </div>
                  </div>
                  
                  <div 
                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => navigate('/perguntas-frequentes')}
                  >
                    <div className="p-2 rounded-full bg-primary/10">
                      <Icons.HelpCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">Perguntas Frequentes</h3>
                      <p className="text-sm text-muted-foreground">Respostas para as dúvidas mais comuns</p>
                    </div>
                  </div>
                  
                  <div 
                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => navigate('/ouvidoria')}
                  >
                    <div className="p-2 rounded-full bg-primary/10">
                      <Icons.MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">Ouvidoria</h3>
                      <p className="text-sm text-muted-foreground">Canal para sugestões, reclamações e elogios</p>
                    </div>
                  </div>
                </div>
              </Card>
            </section>

            {/* Documentos */}
            <section>
              <Card className="p-6">
                <h2 className="text-xl font-bold text-primary mb-6">Documentos</h2>
                <div className="space-y-4">
                  <div 
                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => navigate('/cartao-sus')}
                  >
                    <div className="p-2 rounded-full bg-primary/10">
                      <Icons.CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">CNS</h3>
                      <p className="text-sm text-muted-foreground">Cartão Nacional de Saúde digital</p>
                    </div>
                  </div>
                </div>
              </Card>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}