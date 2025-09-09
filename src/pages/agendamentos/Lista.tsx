import { useState, useEffect } from "react";
import { Plus, Search, Calendar, MapPin, User, Clock } from "lucide-react";
import { AppHeader } from "@/components/ui/app-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { SkeletonCard } from "@/components/skeletons/skeleton-card";
import { ErrorBanner } from "@/components/ui/error-banner";
import { EmptyState } from "@/components/ui/empty-state";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useAppStore } from "@/store/useAppStore";
import { obterAgendamentos, cancelarAgendamento } from "@/lib/stubs/agendamentos";
import { Agendamento } from "@/lib/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

export default function ListaAgendamentos() {
  const navigate = useNavigate();
  const { showNotification } = useAppStore();
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busca, setBusca] = useState('');
  const [cancelando, setCancelando] = useState<string | null>(null);

  useEffect(() => {
    loadAgendamentos();
  }, [busca]);

  const loadAgendamentos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const buscaFilter = busca.trim() || undefined;
      
      const data = await obterAgendamentos('Agendado', buscaFilter);
      
      // Filtrar apenas agendamentos futuros
      const hoje = new Date();
      const agendamentosFuturos = data.filter(agendamento => {
        const dataAgendamento = new Date(`${agendamento.data}T${agendamento.hora}`);
        return dataAgendamento >= hoje && agendamento.status === 'Agendado';
      });
      
      setAgendamentos(agendamentosFuturos);
    } catch (err) {
      setError('Erro ao carregar agendamentos');
      console.error('Erro ao carregar agendamentos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = async (agendamentoId: string) => {
    try {
      setCancelando(agendamentoId);
      
      const resultado = await cancelarAgendamento(agendamentoId);
      
      if (resultado.success) {
        showNotification('Agendamento cancelado com sucesso', 'success');
        await loadAgendamentos();
      } else {
        showNotification(resultado.error || 'Erro ao cancelar agendamento', 'error');
      }
    } catch (err) {
      showNotification('Erro ao cancelar agendamento', 'error');
      console.error('Erro ao cancelar:', err);
    } finally {
      setCancelando(null);
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

  const agendamentosPendentes = agendamentos.filter(a => a.status === 'Agendado').length;

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader 
        title="Meus Agendamentos" 
        showBack 
        onBack={() => navigate('/inicio')} 
      />

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Header com resumo */}
        <div className="bg-primary/5 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Agendamentos</h2>
              <p className="text-sm text-muted-foreground">
                {agendamentosPendentes} consulta{agendamentosPendentes !== 1 ? 's' : ''} agendada{agendamentosPendentes !== 1 ? 's' : ''}
              </p>
            </div>
            <Button onClick={() => navigate('/agendamentos/novo')}>
              <Plus className="h-4 w-4 mr-2" />
              Novo
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <div className="space-y-3">
          <div className="relative">
            <Input
              placeholder="Buscar por tipo, profissional ou unidade..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pr-10"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* Lista */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <ErrorBanner 
            message={error}
            onRetry={loadAgendamentos}
          />
        ) : agendamentos.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="Nenhum agendamento encontrado"
              description={
                busca 
                  ? "Tente ajustar a busca para encontrar seus agendamentos"
                  : "Você ainda não possui agendamentos futuros. Que tal agendar sua primeira consulta?"
              }
            action={{
              label: 'Agendar consulta',
              onClick: () => navigate('/agendamentos/novo')
            }}
            />
        ) : (
          <div className="space-y-3">
            {agendamentos.map((agendamento) => {
              const formatted = formatarData(agendamento.data, agendamento.hora);
              const podeCantelar = agendamento.status === 'Agendado';
              
              return (
                <Card key={agendamento.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-foreground">
                          {agendamento.tipo}
                        </h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <User className="h-4 w-4 mr-1" />
                          {agendamento.profissional}
                        </div>
                      </div>
              <StatusBadge 
                variant={agendamento.status === 'Agendado' ? 'success' : 'neutral'}
              >
                {agendamento.status}
              </StatusBadge>
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
                        <span>{agendamento.unidade}</span>
                      </div>
                    </div>

                    {agendamento.observacoes && (
                      <div className="bg-muted/50 rounded p-2">
                        <p className="text-xs text-muted-foreground">
                          <strong>Observações:</strong> {agendamento.observacoes}
                        </p>
                      </div>
                    )}

                    {podeCantelar && (
                      <div className="pt-2 border-t">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={cancelando === agendamento.id}
                              className="w-full"
                            >
                              {cancelando === agendamento.id ? 'Cancelando...' : 'Cancelar'}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Cancelar Agendamento</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja cancelar este agendamento? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Não, manter</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleCancelar(agendamento.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Sim, cancelar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
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