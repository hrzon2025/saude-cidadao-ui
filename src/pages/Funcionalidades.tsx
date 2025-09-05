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
            {Object.entries(groupedServicos).map(([categoria, servicosCategoria]) => (
              <section key={categoria}>
                <h2 className="text-lg font-semibold mb-3 text-foreground">
                  {categoria}
                </h2>
                
                <div className="space-y-3">
                  {servicosCategoria.map((servico) => {
                    const IconComponent = iconMap[servico.icone] || Icons.Circle;
                    
                    return (
                      <Card
                        key={servico.id}
                        className="p-4 transition-smooth hover:shadow-medium active:scale-[0.98] cursor-pointer"
                        onClick={() => handleServicoClick(servico)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="p-2 rounded-full bg-primary/10 shrink-0">
                            <IconComponent className="h-5 w-5 text-primary" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-card-foreground">
                              {servico.nome}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {servico.descricao}
                            </p>
                          </div>
                          
                          <Icons.ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}