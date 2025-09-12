import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { AppHeader } from "@/components/ui/app-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { SkeletonCard } from "@/components/skeletons/skeleton-card";
import { ErrorBanner } from "@/components/ui/error-banner";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAppStore } from "@/store/useAppStore";
import { consultarDataHorarios, DataHorariosResponse } from "@/lib/services/agendamento";
import { format, addDays, isAfter, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function HorariosAgendamento() {
  const navigate = useNavigate();
  const {
    showNotification,
    agendamento,
    setAgendamentoData
  } = useAppStore();

  // Pegar dados do estado global ao invés dos searchParams
  const { unidadeId, equipeId, tipoConsultaId, profissionalId } = agendamento;

  const [dataSelecionada, setDataSelecionada] = useState<Date>(new Date());
  const [horaSelecionada, setHoraSelecionada] = useState('');
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<string[]>([]);
  const [loadingHorarios, setLoadingHorarios] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mensagemIndisponivel, setMensagemIndisponivel] = useState<string | null>(null);

  useEffect(() => {
    // Validar parâmetros obrigatórios do estado global
    if (!unidadeId || !profissionalId || !tipoConsultaId || !equipeId) {
      showNotification('Parâmetros inválidos. Redirecionando...', 'error');
      navigate('/agendamentos/novo');
      return;
    }
  }, [unidadeId, equipeId, tipoConsultaId, profissionalId]);

  useEffect(() => {
    if (dataSelecionada && equipeId && profissionalId) {
      loadHorarios();
    }
  }, [dataSelecionada, equipeId, profissionalId]);

  const loadHorarios = async () => {
    try {
      setLoadingHorarios(true);
      setError(null);
      setMensagemIndisponivel(null);
      setHoraSelecionada(''); // Reset seleção quando muda data
      setHorariosDisponiveis([]);

      const dataFormatada = format(dataSelecionada, 'yyyyMMdd');
      const response = await consultarDataHorarios(equipeId.toString(), profissionalId.toString(), dataFormatada);
      
      if (response.mensagem) {
        // Caso não haja horários disponíveis
        setMensagemIndisponivel('Não há horários disponíveis para esta data. Escolha outra data.');
      } else if (response.profissionais && response.profissionais.length > 0) {
        // Pegar os horários do primeiro profissional (assumindo que é o selecionado)
        const profissional = response.profissionais.find(p => p.profissionalId === parseInt(profissionalId.toString()));
        if (profissional && profissional.hora) {
          setHorariosDisponiveis(profissional.hora);
        } else {
          setMensagemIndisponivel('Não há horários disponíveis para esta data. Escolha outra data.');
        }
      } else {
        setMensagemIndisponivel('Não há horários disponíveis para esta data. Escolha outra data.');
      }
    } catch (err) {
      setError('Erro ao carregar horários disponíveis');
      console.error('Erro ao carregar horários:', err);
    } finally {
      setLoadingHorarios(false);
    }
  };

  const handleContinuar = () => {
    if (!horaSelecionada) {
      showNotification('Por favor, selecione um horário', 'error');
      return;
    }

    // Salvar no estado global
    setAgendamentoData({
      dataSelecionada: format(dataSelecionada, 'yyyy-MM-dd'),
      horaSelecionada: horaSelecionada
    });

    navigate('/agendamentos/confirmacao');
  };

  const handleVoltar = () => {
    navigate('/agendamentos/novo');
  };

  // Filtrar dias disponíveis (não pode ser no passado e máximo 60 dias)
  const isDateDisabled = (date: Date) => {
    const hoje = new Date();
    const maxDate = addDays(hoje, 60);
    return !isAfter(date, hoje) && !isSameDay(date, hoje) || isAfter(date, maxDate);
  };

  const totalHorarios = horariosDisponiveis.length;

  return <div className="min-h-screen bg-background pb-20">
      <AppHeader title="Novo Agendamento" showBack onBack={handleVoltar} />

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Stepper */}
        <div className="flex items-center justify-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
            ✓
          </div>
          <div className="w-12 h-0.5 bg-primary"></div>
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
            2
          </div>
          <div className="w-12 h-0.5 bg-muted"></div>
          <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-medium">
            3
          </div>
        </div>

        {error && <ErrorBanner message={error} onRetry={loadHorarios} />}

        {/* Seleção de Data */}
        <Card className="p-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Escolha a Data</h3>
            </div>
            
            <div className="flex justify-center">
              <CalendarComponent mode="single" selected={dataSelecionada} onSelect={date => date && setDataSelecionada(date)} disabled={isDateDisabled} locale={ptBR} className="rounded-md border" />
            </div>
            
            <div className="text-center bg-muted/50 rounded p-2">
              <p className="text-sm font-medium">
                Data selecionada: {format(dataSelecionada, "EEEE, dd 'de' MMMM 'de' yyyy", {
                locale: ptBR
              })}
              </p>
            </div>
          </div>
        </Card>

        {/* Seleção de Horário */}
        <Card className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Horários Disponíveis</h3>
              {totalHorarios > 0 && <div className="text-xs text-muted-foreground">
                  {totalHorarios} horário{totalHorarios > 1 ? 's disponíveis' : ' disponível'}
                </div>}
            </div>

            {loadingHorarios ? <div className="flex items-center justify-center p-8">
                <LoadingSpinner size="lg" text="Buscando horários disponíveis..." />
              </div> : mensagemIndisponivel ? <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                <h4 className="font-medium mb-2">Nenhum horário disponível</h4>
                <p className="text-sm text-muted-foreground">
                  {mensagemIndisponivel}
                </p>
              </div> : horariosDisponiveis.length === 0 ? <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                <h4 className="font-medium mb-2">Selecione uma data</h4>
                <p className="text-sm text-muted-foreground">
                  Escolha uma data para ver os horários disponíveis.
                </p>
              </div> : <div className="grid grid-cols-3 gap-2">
                  {horariosDisponiveis.map(hora => <Button key={hora} variant={horaSelecionada === hora ? "default" : "outline"} size="sm" onClick={() => setHoraSelecionada(hora)} className={cn("h-10 text-xs", horaSelecionada === hora && "bg-primary text-primary-foreground")}>
                      {hora}
                    </Button>)}
                </div>}
          </div>
        </Card>

        {/* CTAs */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleVoltar} className="flex-1">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <Button onClick={handleContinuar} disabled={!horaSelecionada || mensagemIndisponivel !== null} className="flex-1">
            Continuar
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>;
}