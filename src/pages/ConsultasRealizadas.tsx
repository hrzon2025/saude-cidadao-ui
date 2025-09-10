import { useState, useEffect } from "react";
import { Calendar, Filter, Clock, MapPin, User, AlertCircle } from "lucide-react";
import { AppHeader } from "@/components/ui/app-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { SkeletonCard } from "@/components/skeletons/skeleton-card";
import { ErrorBanner } from "@/components/ui/error-banner";
import { EmptyState } from "@/components/ui/empty-state";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { consultarAgendamentosStatus, AgendamentoStatusResponse } from "@/lib/services/agendamento";
import { useAppStore } from "@/store/useAppStore";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

export default function ConsultasRealizadas() {
  const navigate = useNavigate();
  const { showNotification, agendamento } = useAppStore();
  const [atendimentos, setAtendimentos] = useState<AgendamentoStatusResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear().toString());

  useEffect(() => {
    loadAtendimentos();
  }, [anoSelecionado]);

  const loadAtendimentos = async () => {
    try {
      setLoading(true);
      setError(null);

      // Verificar se temos o individuoID no estado global
      const individuoID = agendamento?.individuoID || "250573"; // Fallback para o ID de teste
      
      if (!individuoID) {
        setError('ID do usuário não encontrado. Faça login novamente.');
        return;
      }

      // Gerar datas de início e fim do ano selecionado
      const dataInicio = `${anoSelecionado}0101`; // 01/01/ANO
      const dataFinal = `${anoSelecionado}1231`; // 31/12/ANO
      
      const data = await consultarAgendamentosStatus(
        [1, 9, 99, 98], // situacaoId conforme especificado
        dataInicio,
        dataFinal,
        individuoID,
        1 // página
      );
      
      // Filtrar apenas agendamentos com status diferente de "Agendado"
      const atendimentosPassados = data.filter(atendimento => 
        atendimento.status !== 'Agendado'
      );
      
      setAtendimentos(atendimentosPassados);
    } catch (err) {
      console.error('Erro ao carregar atendimentos:', err);
      setError('Não foi possível carregar seus atendimentos. Tente novamente.');
    } finally {
      setLoading(false);
    }
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

  const getStatusVariant = (status?: string) => {
    switch (status) {
      case 'Concluído':
        return 'success';
      case 'Cancelado':
        return 'error';
      default:
        return 'neutral';
    }
  };

  // Gerar lista de anos (ano atual + 4 anos anteriores)
  const anosDisponiveis = Array.from({ length: 5 }, (_, i) => {
    const ano = new Date().getFullYear() - i; // Ano atual e anos anteriores
    return ano.toString();
  });

  const totalAtendimentos = atendimentos.length;

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader 
        title="Histórico de Atendimentos" 
        showBack 
        onBack={() => navigate('/inicio')}
        className="bg-primary text-primary-foreground"
      />

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Header com resumo */}
        <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-primary">Atendimentos Realizados</h2>
              <p className="text-sm text-muted-foreground">
                {totalAtendimentos} atendimento{totalAtendimentos !== 1 ? 's' : ''} encontrado{totalAtendimentos !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="p-2 bg-primary/10 rounded-full">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filtro por ano:</span>
          </div>
          
          {/* Filtro por ano */}
          <Select value={anoSelecionado} onValueChange={setAnoSelecionado}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o ano" />
            </SelectTrigger>
            <SelectContent>
              {anosDisponiveis.map((ano) => (
                <SelectItem key={ano} value={ano}>
                  {ano}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Lista de atendimentos */}
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
        ) : atendimentos.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="Nenhum atendimento encontrado"
            description={`Você não possui atendimentos para o ano de ${anoSelecionado}.`}
          />
        ) : (
          <div className="space-y-3">
            {atendimentos.map((atendimento, index) => {
              const formatted = formatarData(atendimento.data);
              
              return (
                <Card key={atendimento.id || index} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-foreground">
                          {atendimento.tipoConsulta || 'Atendimento'}
                        </h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <User className="h-4 w-4 mr-1" />
                          {atendimento.profissional || 'Profissional não informado'}
                        </div>
                      </div>
                      <StatusBadge variant={getStatusVariant(atendimento.status)}>
                        {atendimento.status}
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
                        <span>{atendimento.unidade || 'Unidade não informada'}</span>
                      </div>
                      {atendimento.equipe && (
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          <span>Equipe: {atendimento.equipe}</span>
                        </div>
                      )}
                      {atendimento.motivo && (
                        <div className="flex items-center">
                          <AlertCircle className="h-4 w-4 mr-2" />
                          <span>Motivo: {atendimento.motivo}</span>
                        </div>
                      )}
                    </div>

                    {(atendimento.observacoes || atendimento.motivo) && (
                      <div className="bg-muted/50 rounded p-2">
                        <div className="text-xs text-muted-foreground space-y-1">
                          {atendimento.observacoes && (
                            <p><strong>Observações:</strong> {atendimento.observacoes}</p>
                          )}
                          {atendimento.motivo && (
                            <p><strong>Motivo:</strong> {atendimento.motivo}</p>
                          )}
                        </div>
                      </div>
                    )}

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
                            <AlertDialogTitle>Detalhes do Atendimento</AlertDialogTitle>
                            <AlertDialogDescription>
                              <div className="space-y-2 text-sm">
                                <div><strong>Tipo:</strong> {atendimento.tipoConsulta}</div>
                                <div><strong>Profissional:</strong> {atendimento.profissional}</div>
                                <div><strong>Unidade:</strong> {atendimento.unidade}</div>
                                <div><strong>Equipe:</strong> {atendimento.equipe}</div>
                                <div><strong>Data:</strong> {formatted.data}</div>
                                <div><strong>Status:</strong> {atendimento.status}</div>
                                {atendimento.motivo && (
                                  <div><strong>Motivo:</strong> {atendimento.motivo}</div>
                                )}
                                {atendimento.observacoes && (
                                  <div><strong>Observações:</strong> {atendimento.observacoes}</div>
                                )}
                              </div>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Fechar</AlertDialogCancel>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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