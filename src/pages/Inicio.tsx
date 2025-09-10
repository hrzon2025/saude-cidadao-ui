import { useState, useEffect } from "react";
import { Plus, Calendar, Heart, MapPin, MessageSquare, Pill, CreditCard, Building, FileText, ShoppingBag, Syringe, HelpCircle, User, Clock } from "lucide-react";
import { WelcomeHeader } from "@/components/ui/welcome-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { SkeletonCard } from "@/components/skeletons/skeleton-card";
import { ErrorBanner } from "@/components/ui/error-banner";
import { useAppStore } from "@/store/useAppStore";
import { consultarUsuario, consultarAgendamentosStatus, AgendamentoStatusResponse } from "@/lib/services/agendamento";
import { Atendimento } from "@/lib/types";
import { format, parse, isAfter } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

const shortcuts = [
  { id: 'agendamentos-novo', label: 'Novo Agendamento', icon: Plus, path: '/agendamentos/novo', color: 'text-primary' },
  { id: 'agendamentos-lista', label: 'Meus Agendamentos', icon: Calendar, path: '/agendamentos', color: 'text-primary' },
  { id: 'atendimentos', label: 'Consultas realizadas', icon: FileText, path: '/atendimentos', color: 'text-primary' },
  { id: 'minha-saude', label: 'Minha Saúde', icon: Heart, path: '/minha-saude', color: 'text-primary' },
  { id: 'vacinas', label: 'Vacinas', icon: Syringe, path: '/vacinacao', color: 'text-primary' },
  { id: 'cartao-sus', label: 'Cartão SUS', icon: CreditCard, path: '/cartao-sus', color: 'text-primary' },
  { id: 'unidades', label: 'Unidades', icon: Building, path: '/unidades', color: 'text-primary' },
  { id: 'farmacia', label: 'Farmácia', icon: ShoppingBag, path: '/farmacia', color: 'text-primary' },
  { id: 'medicamentos', label: 'Medicamentos', icon: Pill, path: '/medicamentos', color: 'text-primary' },
  { id: 'faq', label: 'FAQ', icon: HelpCircle, path: '/faq', color: 'text-primary' },
  { id: 'ouvidoria', label: 'Ouvidoria', icon: MessageSquare, path: '/ouvidoria', color: 'text-primary' }
];

export default function Inicio() {
  const navigate = useNavigate();
  const { usuario, showNotification, agendamento, setAgendamentoData } = useAppStore();
  const [proximaConsulta, setProximaConsulta] = useState<Atendimento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProximaConsulta();
  }, []);

  const obterIndividuoID = async () => {
    try {
      // Usar dados do usuário logado ou dados mock para teste
      let cpf = usuario?.cpf || agendamento?.cpf || "15384113855";
      let dataNascimento = usuario?.dataNascimento || "19710812";
      const cns = usuario?.cns || agendamento?.cns || "";

      // Remover formatação do CPF (pontos e traços)
      cpf = cpf.replace(/[.\-]/g, '');
      
      // Converter data para formato YYYYMMDD se estiver em outro formato
      if (dataNascimento.includes('-')) {
        dataNascimento = dataNascimento.replace(/-/g, '');
      }

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

  const loadProximaConsulta = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Obter individuoID se não existir
      let individuoID = agendamento?.individuoID;
      if (!individuoID) {
        individuoID = await obterIndividuoID();
      }

      console.log('Usando individuoID:', individuoID);

      // Gerar dataInicio e dataFinal para o ano atual
      const anoAtual = new Date().getFullYear();
      const dataInicio = `${anoAtual}0101`;
      const dataFinal = `${anoAtual}1231`;

      console.log('Buscando agendamentos para:', { anoAtual, dataInicio, dataFinal });

      // Chamar API para buscar agendamentos
      const agendamentos = await consultarAgendamentosStatus(
        [1, 9, 99, 98], // situacaoId
        dataInicio,
        dataFinal,
        individuoID,
        1 // pagina
      );

      console.log('Agendamentos retornados:', agendamentos);

      // Filtrar apenas agendamentos com status "Agendado"
      const agendamentosAgendados = agendamentos.filter(
        (agendamento) => agendamento.status === "Agendado"
      );

      console.log('Agendamentos com status Agendado:', agendamentosAgendados);

      if (agendamentosAgendados.length === 0) {
        setProximaConsulta(null);
        return;
      }

      // Transformar dados e encontrar o próximo agendamento
      const atendimentosTransformados: (Atendimento & { dataOriginal: Date })[] = agendamentosAgendados
        .map((item) => {
          const dataTransformada = transformarDataHora(item.data);
          
          return {
            id: item.atendimentoId.toString(),
            tipo: item.tipoConsulta,
            status: "Agendado" as const,
            data: dataTransformada.data,
            hora: dataTransformada.hora,
            profissional: item.profissional,
            unidade: item.unidade,
            podeAvaliar: false,
            dataOriginal: dataTransformada.dataCompleta
          };
        })
        .filter(item => {
          // Filtrar apenas consultas futuras
          return isAfter(item.dataOriginal, new Date());
        })
        .sort((a, b) => {
          // Ordenar por data/hora (mais próximo primeiro)
          return a.dataOriginal.getTime() - b.dataOriginal.getTime();
        });

      console.log('Atendimentos transformados e filtrados:', atendimentosTransformados);

      // Selecionar o primeiro (mais próximo)
      setProximaConsulta(atendimentosTransformados[0] || null);
      
    } catch (err) {
      console.error('Erro ao carregar próxima consulta:', err);
      setError('Não foi possível carregar seu próximo agendamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Transformar data do formato "YYYYMMDD HH:mm" para formato legível
  const transformarDataHora = (dataStr: string) => {
    try {
      // Extrair data e hora
      const partesData = dataStr.split(' ');
      const dataOnly = partesData[0]; // YYYYMMDD
      const horaOnly = partesData.length > 1 ? partesData[1] : ''; // HH:mm
      
      // Converter YYYYMMDD para YYYY-MM-DD
      const ano = dataOnly.substring(0, 4);
      const mes = dataOnly.substring(4, 6);
      const dia = dataOnly.substring(6, 8);
      const dataFormatada = `${ano}-${mes}-${dia}`;
      
      // Criar objeto Date completo para comparações
      const dataCompleta = new Date(`${dataFormatada}T${horaOnly || '00:00'}`);
      
      // Formatar para exibição
      const dataExibicao = format(parse(dataFormatada, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy');
      
      return {
        data: dataExibicao,
        hora: horaOnly,
        dataCompleta: dataCompleta
      };
    } catch (error) {
      console.error('Erro ao transformar data/hora:', dataStr, error);
      return {
        data: dataStr,
        hora: '',
        dataCompleta: new Date()
      };
    }
  };

  const handleShortcutClick = (path: string) => {
    navigate(path);
  };

  const formatConsultaDate = (data: string, hora: string) => {
    try {
      const dataConsulta = new Date(`${data}T${hora}`);
      return {
        date: format(dataConsulta, "dd/MM/yyyy", { locale: ptBR }),
        time: format(dataConsulta, "HH:mm", { locale: ptBR }),
        weekday: format(dataConsulta, "EEEE", { locale: ptBR })
      };
    } catch {
      return { date: data, time: hora, weekday: '' };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20">
      <WelcomeHeader 
        onNotifications={() => navigate('/notificacoes')}
      />

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Próxima Consulta */}
        <section>
          <h2 className="text-lg font-semibold mb-3 text-foreground">
            Minha próxima consulta
          </h2>
          
          {loading ? (
            <SkeletonCard />
          ) : error ? (
            <ErrorBanner 
              message={error}
              onRetry={loadProximaConsulta}
            />
          ) : proximaConsulta ? (
            <Card className="p-4 bg-card border-primary/20 shadow-sm">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">
                      {proximaConsulta.tipo}
                    </h3>
                    <p className="text-muted-foreground">
                      {proximaConsulta.profissional}
                    </p>
                  </div>
                  <StatusBadge variant="success">
                    Agendado
                  </StatusBadge>
                </div>
                
                <div className="space-y-1 text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>
                      {(() => {
                        const formatted = formatConsultaDate(proximaConsulta.data, proximaConsulta.hora);
                        return `${formatted.weekday}, ${formatted.date} às ${formatted.time}`;
                      })()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{proximaConsulta.unidade}</span>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-6 text-center">
              <Calendar className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
              <h3 className="font-medium mb-2">Você não possui agendamentos agendados</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Agende uma consulta para acompanhar sua saúde
              </p>
              <Button onClick={() => navigate('/agendamentos/novo')}>
                <Plus className="h-4 w-4 mr-2" />
                Agendar consulta
              </Button>
            </Card>
          )}
        </section>

        {/* Atalhos */}
        <section>
          <h2 className="text-lg font-semibold mb-3 text-foreground">
            Serviços rápidos
          </h2>
          
          <div className="grid grid-cols-3 gap-3">
            {shortcuts.map((shortcut) => {
              const Icon = shortcut.icon;
              
              return (
                <Card
                  key={shortcut.id}
                  className="p-4 text-center transition-smooth hover:shadow-medium active:scale-95 cursor-pointer"
                  onClick={() => handleShortcutClick(shortcut.path)}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className="p-2 rounded-full bg-muted">
                      <Icon className={`h-6 w-6 ${shortcut.color}`} />
                    </div>
                    <span className="text-xs font-medium text-center leading-tight">
                      {shortcut.label}
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}