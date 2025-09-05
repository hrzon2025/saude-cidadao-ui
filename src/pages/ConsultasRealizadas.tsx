import { useState, useEffect } from "react";
import { Star, Calendar, MapPin, User, Clock, Filter } from "lucide-react";
import { AppHeader } from "@/components/ui/app-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SkeletonCard } from "@/components/skeletons/skeleton-card";
import { ErrorBanner } from "@/components/ui/error-banner";
import { EmptyState } from "@/components/ui/empty-state";
import { useAppStore } from "@/store/useAppStore";
import { obterAgendamentos } from "@/lib/stubs/agendamentos";
import { Atendimento } from "@/lib/types";
import { format, isAfter } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

export default function ConsultasRealizadas() {
  const navigate = useNavigate();
  const { showNotification } = useAppStore();
  const [consultas, setConsultas] = useState<Atendimento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroData, setFiltroData] = useState('');
  const [avaliando, setAvaliando] = useState<string | null>(null);

  useEffect(() => {
    loadConsultas();
  }, [filtroData]);

  const loadConsultas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await obterAgendamentos();
      
      // Filtrar apenas consultas realizadas (passadas) e converter para atendimentos
      const hoje = new Date();
      const consultasRealizadas = data
        .filter(agendamento => {
          const dataConsulta = new Date(`${agendamento.data}T${agendamento.hora}`);
          return !isAfter(dataConsulta, hoje) && agendamento.status === 'Agendado';
        })
        .map(agendamento => ({
          id: agendamento.id,
          data: agendamento.data,
          hora: agendamento.hora,
          tipo: agendamento.tipo,
          profissional: agendamento.profissional,
          unidade: agendamento.unidade,
          status: 'Concluído' as const,
          podeAvaliar: true,
          observacoes: agendamento.observacoes
        }));

      // Aplicar filtro de data se fornecido
      let consultasFiltradas = consultasRealizadas;
      if (filtroData) {
        consultasFiltradas = consultasRealizadas.filter(consulta => 
          consulta.data === filtroData
        );
      }

      setConsultas(consultasFiltradas.sort((a, b) => 
        new Date(`${b.data}T${b.hora}`).getTime() - new Date(`${a.data}T${a.hora}`).getTime()
      ));
    } catch (err) {
      setError('Erro ao carregar consultas realizadas');
      console.error('Erro ao carregar consultas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAvaliar = async (consultaId: string) => {
    try {
      setAvaliando(consultaId);
      // Simular avaliação
      await new Promise(resolve => setTimeout(resolve, 1000));
      showNotification('Avaliação enviada com sucesso!', 'success');
    } catch (err) {
      showNotification('Erro ao enviar avaliação', 'error');
    } finally {
      setAvaliando(null);
    }
  };

  const formatarData = (data: string, hora: string) => {
    try {
      const dataConsulta = new Date(`${data}T${hora}`);
      return {
        data: format(dataConsulta, "dd/MM/yyyy", { locale: ptBR }),
        hora: format(dataConsulta, "HH:mm", { locale: ptBR }),
        diaSemana: format(dataConsulta, "EEEE", { locale: ptBR })
      };
    } catch {
      return { data, hora, diaSemana: '' };
    }
  };

  const limparFiltro = () => {
    setFiltroData('');
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader 
        title="Histórico" 
        showBack 
        onBack={() => navigate('/')} 
        className="bg-purple-600 text-white shadow-purple-600/20"
      />

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Header com resumo */}
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-purple-900">Consultas Realizadas</h2>
              <p className="text-sm text-purple-600">
                {consultas.length} consulta{consultas.length !== 1 ? 's' : ''} realizada{consultas.length !== 1 ? 's' : ''}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        {/* Filtro por Data */}
        <Card className="p-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-purple-600" />
              <h3 className="font-semibold">Filtrar por Data</h3>
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
                  onClick={limparFiltro}
                  className="px-3"
                >
                  Limpar
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Lista de Consultas */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <ErrorBanner 
            message={error}
            onRetry={loadConsultas}
          />
        ) : consultas.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="Nenhuma consulta encontrada"
            description={
              filtroData 
                ? "Não há consultas realizadas na data selecionada"
                : "Você ainda não possui consultas realizadas no histórico"
            }
          />
        ) : (
          <div className="space-y-3">
            {consultas.map((consulta) => {
              const formatted = formatarData(consulta.data, consulta.hora);
              
              return (
                <Card key={consulta.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-foreground">
                          {consulta.tipo}
                        </h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <User className="h-4 w-4 mr-1" />
                          {consulta.profissional}
                        </div>
                      </div>
                      <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        Concluída
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>
                          {formatted.diaSemana}, {formatted.data} às {formatted.hora}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{consulta.unidade}</span>
                      </div>
                    </div>

                    {(consulta as any).observacoes && (
                      <div className="bg-muted/50 rounded p-2">
                        <p className="text-xs text-muted-foreground">
                          <strong>Observações:</strong> {(consulta as any).observacoes}
                        </p>
                      </div>
                    )}

                    {/* Botão de Avaliação */}
                    <div className="pt-2 border-t">
                      <Button
                        onClick={() => handleAvaliar(consulta.id)}
                        disabled={avaliando === consulta.id}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        {avaliando === consulta.id ? (
                          'Enviando...'
                        ) : (
                          <>
                            <Star className="h-4 w-4 mr-2" />
                            Avaliar Atendimento
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}