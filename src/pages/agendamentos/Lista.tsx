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
import { consultarAgendamentosStatus, AgendamentoStatusResponse } from "@/lib/services/agendamento";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

export default function ListaAgendamentos() {
  const navigate = useNavigate();
  const { showNotification, agendamento } = useAppStore();
  const [agendamentos, setAgendamentos] = useState<AgendamentoStatusResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busca, setBusca] = useState('');

  useEffect(() => {
    loadAgendamentos();
  }, []);

  const loadAgendamentos = async () => {
    try {
      setLoading(true);
      setError(null);

      // Verificar se temos o individuoID no estado global
      const individuoID = agendamento?.individuoID || "250573"; // Fallback para o ID de teste
      
      if (!individuoID) {
        setError('ID do usuário não encontrado. Faça login novamente.');
        return;
      }

      // Buscar agendamentos de um período amplo (últimos 2 anos até próximo ano)
      const anoAtual = new Date().getFullYear();
      const dataInicio = `${anoAtual - 2}0101`; // 2 anos atrás
      const dataFinal = `${anoAtual + 1}1231`; // Próximo ano
      
      const data = await consultarAgendamentosStatus(
        [1, 9, 99, 98], // situacaoId conforme especificado
        dataInicio,
        dataFinal,
        individuoID,
        1 // página
      );
      
      // Filtrar apenas agendamentos com status "Agendado"
      const agendamentosAgendados = data.filter(agendamento => 
        agendamento.status === 'Agendado'
      );

      // Aplicar filtro de busca se existir
      let agendamentosFiltrados = agendamentosAgendados;
      if (busca.trim()) {
        const termoBusca = busca.toLowerCase().trim();
        agendamentosFiltrados = agendamentosAgendados.filter(agendamento =>
          agendamento.unidade?.toLowerCase().includes(termoBusca) ||
          agendamento.profissional?.toLowerCase().includes(termoBusca) ||
          agendamento.tipoConsulta?.toLowerCase().includes(termoBusca) ||
          agendamento.equipe?.toLowerCase().includes(termoBusca)
        );
      }
      
      setAgendamentos(agendamentosFiltrados);
    } catch (err) {
      console.error('Erro ao carregar agendamentos:', err);
      setError('Não foi possível carregar seus agendamentos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Atualizar a busca automaticamente quando o usuário digitar
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (busca !== undefined) {
        loadAgendamentos();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [busca]);

  const handleCancelar = async (agendamentoId: string) => {
    // Implementação de cancelamento será adicionada em versão futura
    showNotification('Funcionalidade de cancelamento será implementada em breve', 'info');
  };

  const formatarData = (data?: string) => {
    if (!data) return { data: 'N/A', hora: 'N/A', diaSemana: '' };
    
    try {
      // A API retorna data no formato YYYYMMDD ou similar
      let dataFormatada = data;
      
      // Se a data vier no formato YYYYMMDD, converter para YYYY-MM-DD
      if (data.length === 8 && !data.includes('-')) {
        dataFormatada = `${data.substring(0,4)}-${data.substring(4,6)}-${data.substring(6,8)}`;
      }
      
      const dataConsulta = new Date(dataFormatada);
      
      if (isNaN(dataConsulta.getTime())) {
        return { data, hora: '', diaSemana: '' };
      }
      
      return {
        data: format(dataConsulta, "dd/MM/yyyy", { locale: ptBR }),
        hora: format(dataConsulta, "HH:mm", { locale: ptBR }),
        diaSemana: format(dataConsulta, "EEEE", { locale: ptBR })
      };
    } catch {
      return { data, hora: '', diaSemana: '' };
    }
  };

  const agendamentosPendentes = agendamentos.length;

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
          {/* Busca */}
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
                  : "Você não possui agendamentos agendados."
              }
            action={{
              label: 'Agendar consulta',
              onClick: () => navigate('/agendamentos/novo')
            }}
            />
        ) : (
          <div className="space-y-3">
            {agendamentos.map((agendamento, index) => {
              const formatted = formatarData(agendamento.data);
              const podeCantelar = agendamento.status === 'Agendado';
              
              return (
                <Card key={agendamento.atendimentoId || index} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-foreground">
                          {agendamento.tipoConsulta || 'Consulta'}
                        </h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <User className="h-4 w-4 mr-1" />
                          {agendamento.profissional || 'Profissional não informado'}
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
                          {formatted.diaSemana ? `${formatted.diaSemana}, ` : ''}{formatted.data}
                          {formatted.hora ? ` às ${formatted.hora}` : ''}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{agendamento.unidade || 'Unidade não informada'}</span>
                      </div>
                      {agendamento.equipe && (
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          <span>Equipe: {agendamento.equipe}</span>
                        </div>
                      )}
                    </div>

                    {agendamento.motivo && (
                      <div className="bg-muted/50 rounded p-2">
                        <p className="text-xs text-muted-foreground">
                          <strong>Motivo:</strong> {agendamento.motivo}
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
                              className="w-full"
                            >
                              Visualizar Detalhes
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Detalhes do Agendamento</AlertDialogTitle>
                              <AlertDialogDescription>
                                <div className="space-y-2 text-sm">
                                  <div><strong>Tipo:</strong> {agendamento.tipoConsulta}</div>
                                  <div><strong>Profissional:</strong> {agendamento.profissional}</div>
                                  <div><strong>Unidade:</strong> {agendamento.unidade}</div>
                                  <div><strong>Equipe:</strong> {agendamento.equipe}</div>
                                  <div><strong>Data:</strong> {formatted.data}</div>
                                  <div><strong>Status:</strong> {agendamento.status}</div>
                                </div>
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Fechar</AlertDialogCancel>
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