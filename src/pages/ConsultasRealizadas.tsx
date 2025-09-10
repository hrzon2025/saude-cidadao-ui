import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { AppHeader } from "@/components/ui/app-header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CardAtendimento } from "@/components/cards/card-atendimento";
import { SkeletonCard } from "@/components/skeletons/skeleton-card";
import { ErrorBanner } from "@/components/ui/error-banner";
import { EmptyState } from "@/components/ui/empty-state";
import { consultarAgendamentosStatus } from "@/lib/services/agendamento";
import { useAppStore } from "@/store/useAppStore";
import { Atendimento } from "@/lib/types";
import { useNavigate } from "react-router-dom";

export default function ConsultasRealizadas() {
  const navigate = useNavigate();
  const { showNotification, agendamento } = useAppStore();
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear().toString());

  // Função para transformar data da API (YYYYMMDD HH:MM) para formato de exibição
  const formatAPIDateToDisplay = (apiDate: string): string => {
    if (!apiDate || apiDate.length < 8) return apiDate;
    
    const year = apiDate.substring(0, 4);
    const month = apiDate.substring(4, 6);
    const day = apiDate.substring(6, 8);
    
    return `${year}-${month}-${day}`;
  };

  // Função para extrair hora da data da API
  const extractTimeFromAPIDate = (apiDate: string): string => {
    if (!apiDate || apiDate.length < 13) return '';
    
    const time = apiDate.substring(9, 14); // " HH:MM"
    return time.trim();
  };

  // Função para mapear status da API para status do Atendimento
  const mapAPIStatusToAtendimentoStatus = (apiStatus: string): 'Agendado' | 'Concluído' | 'Cancelado' => {
    if (apiStatus === 'Desmarcado') return 'Cancelado';
    if (apiStatus === 'Realizado') return 'Concluído';
    return 'Cancelado'; // fallback
  };

  // Gerar anos disponíveis (atual e anteriores)
  const gerarAnosDisponiveis = () => {
    const anoAtual = new Date().getFullYear();
    const anos = [];
    for (let i = 0; i < 5; i++) {
      anos.push((anoAtual - i).toString());
    }
    return anos;
  };

  const processarDados = (data: any[]) => {
    // Filtrar apenas agendamentos que não são "Agendado" e transformar para o formato esperado
    const atendimentosTransformados = data
      .filter(item => item.status !== 'Agendado')
      .map(item => ({
        id: item.atendimentoId?.toString() || '',
        data: formatAPIDateToDisplay(item.data || ''),
        hora: extractTimeFromAPIDate(item.data || ''),
        tipo: item.tipoConsulta || '',
        profissional: item.profissional || '',
        unidade: item.unidade || '',
        status: mapAPIStatusToAtendimentoStatus(item.status || ''),
        podeAvaliar: mapAPIStatusToAtendimentoStatus(item.status || '') === 'Concluído'
      }));
    
    setAtendimentos(atendimentosTransformados);
  };

  const loadAtendimentos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Gerar datas do ano selecionado
      const dataInicio = `${anoSelecionado}0101`;
      const dataFinal = `${anoSelecionado}1231`;
      
      // Usar individuoID do store ou ID de teste
      const individuoID = agendamento.individuoID || "250573";
      if (!agendamento.individuoID) {
        console.warn('IndividuoID não encontrado no store, usando ID de teste:', individuoID);
      }
      
      const data = await consultarAgendamentosStatus(
        [1, 9, 99, 98],
        dataInicio,
        dataFinal,
        individuoID
      );
      
      processarDados(data);
    } catch (err) {
      setError('Não foi possível carregar seus atendimentos. Tente novamente.');
      console.error('Erro ao carregar atendimentos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAtendimentos();
  }, [anoSelecionado]);

  const handleAvaliar = async (atendimentoId: string) => {
    // Navegar para tela de avaliação
    navigate(`/avaliacao/1/${atendimentoId}`);
  };

  const totalConsultas = atendimentos.length;

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader 
        title="Histórico" 
        showBack 
        onBack={() => navigate('/inicio')}
        className="bg-primary text-primary-foreground"
      />

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Header com resumo */}
        <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-primary">Atendimentos Passados</h2>
              <p className="text-sm text-muted-foreground">
                {totalConsultas} atendimento{totalConsultas !== 1 ? 's' : ''} encontrado{totalConsultas !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="p-2 bg-primary/10 rounded-full">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>

        {/* Filtro por ano */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Filtrar por ano:</label>
          <Select value={anoSelecionado} onValueChange={setAnoSelecionado}>
            <SelectTrigger>
              <SelectValue placeholder="Selecionar ano" />
            </SelectTrigger>
            <SelectContent className="bg-background border shadow-md z-50">
              {gerarAnosDisponiveis().map(ano => (
                <SelectItem key={ano} value={ano}>{ano}</SelectItem>
              ))}
            </SelectContent>
          </Select>
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
        ) : atendimentos.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="Nenhum atendimento encontrado para o ano selecionado"
            description="Você não possui atendimentos neste período."
          />
        ) : (
          <div className="space-y-3">
            {atendimentos.map((atendimento) => (
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