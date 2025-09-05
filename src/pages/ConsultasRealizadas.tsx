import { useState, useEffect } from "react";
import { Calendar, Filter } from "lucide-react";
import { AppHeader } from "@/components/ui/app-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardAtendimento } from "@/components/cards/card-atendimento";
import { SkeletonCard } from "@/components/skeletons/skeleton-card";
import { ErrorBanner } from "@/components/ui/error-banner";
import { EmptyState } from "@/components/ui/empty-state";
import { consultarAtendimentos, avaliarAtendimento } from "@/lib/stubs/services";
import { useAppStore } from "@/store/useAppStore";
import { Atendimento } from "@/lib/types";
import { useNavigate } from "react-router-dom";

export default function ConsultasRealizadas() {
  const navigate = useNavigate();
  const { showNotification } = useAppStore();
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroData, setFiltroData] = useState('');

  useEffect(() => {
    loadAtendimentos();
  }, []);

  const loadAtendimentos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Buscar apenas atendimentos concluídos
      const data = await consultarAtendimentos('Concluído');
      setAtendimentos(data);
    } catch (err) {
      setError('Erro ao carregar consultas realizadas');
      console.error('Erro ao carregar atendimentos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAvaliar = async (atendimentoId: string) => {
    // Navegar para tela de avaliação (ainda não implementada)
    navigate(`/avaliacao/${atendimentoId}`);
  };

  // Filtrar atendimentos por data se houver filtro
  const atendimentosFiltrados = filtroData 
    ? atendimentos.filter(atendimento => {
        const dataAtendimento = new Date(atendimento.data);
        const dataFiltro = new Date(filtroData);
        return dataAtendimento.toDateString() === dataFiltro.toDateString();
      })
    : atendimentos;

  const totalConsultas = atendimentosFiltrados.length;

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader 
        title="Histórico" 
        showBack 
        onBack={() => navigate('/')}
        className="bg-primary text-primary-foreground"
      />

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Header com resumo */}
        <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-primary">Consultas Realizadas</h2>
              <p className="text-sm text-muted-foreground">
                {totalConsultas} consulta{totalConsultas !== 1 ? 's' : ''} realizada{totalConsultas !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="p-2 bg-primary/10 rounded-full">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>

        {/* Filtro por data */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filtrar por data:</span>
          </div>
          <div className="flex gap-2">
            <Input
              type="date"
              value={filtroData}
              onChange={(e) => setFiltroData(e.target.value)}
              className="flex-1"
            />
            {filtroData && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setFiltroData('')}
              >
                Limpar
              </Button>
            )}
          </div>
        </div>

        {/* Lista de consultas */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <ErrorBanner 
            message={error}
            onRetry={loadAtendimentos}
          />
        ) : atendimentosFiltrados.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title={filtroData ? "Nenhuma consulta na data selecionada" : "Nenhuma consulta realizada"}
            description={
              filtroData 
                ? "Não encontramos consultas realizadas na data selecionada. Tente outra data."
                : "Você ainda não possui consultas realizadas no sistema."
            }
            action={filtroData ? {
              label: 'Limpar filtro',
              onClick: () => setFiltroData('')
            } : undefined}
          />
        ) : (
          <div className="space-y-3">
            {atendimentosFiltrados.map((atendimento) => (
              <CardAtendimento
                key={atendimento.id}
                atendimento={atendimento}
                onAvaliar={handleAvaliar}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}