import { useState, useEffect } from "react";
import { Calendar, Filter } from "lucide-react";
import { AppHeader } from "@/components/ui/app-header";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CardAtendimento } from "@/components/cards/card-atendimento";
import { SkeletonCard } from "@/components/skeletons/skeleton-card";
import { ErrorBanner } from "@/components/ui/error-banner";
import { EmptyState } from "@/components/ui/empty-state";
import { consultarUsuario, consultarAgendamentosStatus } from "@/lib/services/agendamento";
import { useAppStore } from "@/store/useAppStore";
import { Atendimento } from "@/lib/types";
import { useNavigate } from "react-router-dom";
import { format, parse } from "date-fns";

export default function ConsultasRealizadas() {
  const navigate = useNavigate();
  const { showNotification, usuario, setAgendamentoData, agendamento } = useAppStore();
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [anoSelecionado, setAnoSelecionado] = useState<string>(new Date().getFullYear().toString());

  // Gerar lista de anos (ano atual e 4 anos anteriores)
  const anosDisponiveis = Array.from({ length: 5 }, (_, i) => {
    const ano = new Date().getFullYear() - i;
    return ano.toString();
  });

  useEffect(() => {
    loadAtendimentos();
  }, [anoSelecionado]);

  const obterIndividuoID = async () => {
    try {
      // Usar dados do usuário logado ou dados mock para teste
      const cpf = usuario?.cpf || agendamento?.cpf || "15384113855";
      const dataNascimento = usuario?.dataNascimento || "19710812";
      const cns = usuario?.cns || agendamento?.cns || "";

      console.log('Consultando usuário com:', { cpf, dataNascimento, cns });

      const userData = await consultarUsuario(cpf, dataNascimento, cns);
      
      // Salvar dados no estado global
      setAgendamentoData({
        individuoID: userData.individuoID,
        cns: userData.cns,
        cpf: userData.cpf,
        unidadeId: userData.unidade.id.toString(),
        equipeId: userData.equipe.id.toString()
      });

      return userData.individuoID;
    } catch (err) {
      console.error('Erro ao obter individuoID:', err);
      throw new Error('Não foi possível obter dados do usuário');
    }
  };

  const loadAtendimentos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Obter individuoID se não existir
      let individuoID = agendamento?.individuoID;
      if (!individuoID) {
        individuoID = await obterIndividuoID();
      }

      console.log('Usando individuoID:', individuoID);

      // Gerar dataInicio e dataFinal baseado no ano selecionado
      const dataInicio = `${anoSelecionado}0101`;
      const dataFinal = `${anoSelecionado}1231`;

      console.log('Buscando agendamentos para:', { anoSelecionado, dataInicio, dataFinal });

      // Chamar API para buscar agendamentos
      const agendamentos = await consultarAgendamentosStatus(
        [1, 9, 99, 98], // situacaoId
        dataInicio,
        dataFinal,
        individuoID,
        1 // pagina
      );

      console.log('Agendamentos retornados:', agendamentos);

      // Filtrar apenas agendamentos que não são "Agendado"
      const agendamentosFiltrados = agendamentos.filter(
        (agendamento) => agendamento.status !== "Agendado"
      );

      console.log('Agendamentos filtrados (não-agendados):', agendamentosFiltrados);

      // Transformar dados da API para o formato esperado
      const atendimentosTransformados: Atendimento[] = agendamentosFiltrados.map((item) => {
        // Mapear status da API para o tipo esperado
        let status: 'Agendado' | 'Concluído' | 'Cancelado';
        if (item.status === "Desmarcado" || item.status === "Cancelado") {
          status = "Cancelado";
        } else if (item.status === "Concluído") {
          status = "Concluído";
        } else {
          status = "Agendado";
        }

        return {
          id: item.atendimentoId.toString(),
          tipo: item.tipoConsulta,
          status: status,
          data: transformarData(item.data),
          hora: extrairHora(item.data),
          profissional: item.profissional,
          unidade: item.unidade,
          podeAvaliar: status === "Concluído" || status === "Cancelado",
        };
      });

      console.log('Atendimentos transformados:', atendimentosTransformados);
      setAtendimentos(atendimentosTransformados);
      
    } catch (err) {
      console.error('Erro ao carregar atendimentos:', err);
      setError('Não foi possível carregar seus atendimentos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Transformar data do formato "YYYYMMDD HH:mm" para "DD/MM/YYYY"
  const transformarData = (dataStr: string): string => {
    try {
      // Extrair apenas a parte da data (antes do espaço)
      const dataOnly = dataStr.split(' ')[0];
      // Formato: YYYYMMDD -> YYYY-MM-DD para parsing
      const ano = dataOnly.substring(0, 4);
      const mes = dataOnly.substring(4, 6);
      const dia = dataOnly.substring(6, 8);
      const dataFormatada = `${ano}-${mes}-${dia}`;
      const date = parse(dataFormatada, 'yyyy-MM-dd', new Date());
      return format(date, 'dd/MM/yyyy');
    } catch (error) {
      console.error('Erro ao transformar data:', dataStr, error);
      return dataStr;
    }
  };

  // Extrair hora do formato "YYYYMMDD HH:mm"
  const extrairHora = (dataStr: string): string => {
    try {
      const partesData = dataStr.split(' ');
      return partesData.length > 1 ? partesData[1] : '';
    } catch (error) {
      console.error('Erro ao extrair hora:', dataStr, error);
      return '';
    }
  };

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

        {/* Filtro por ano */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filtro por ano:</span>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Ano:</label>
            <Select value={anoSelecionado} onValueChange={setAnoSelecionado}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar ano" />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-md z-50">
                {anosDisponiveis.map((ano) => (
                  <SelectItem key={ano} value={ano}>
                    {ano}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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