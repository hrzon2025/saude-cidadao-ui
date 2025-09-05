import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { AppHeader } from "@/components/ui/app-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { SkeletonCard } from "@/components/skeletons/skeleton-card";
import { ErrorBanner } from "@/components/ui/error-banner";
import { useAppStore } from "@/store/useAppStore";
import { obterHorariosDisponiveis } from "@/lib/stubs/agendamentos";
import { HorarioDisponivel } from "@/lib/types";
import { format, addDays, isAfter, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate, useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function HorariosAgendamento() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showNotification } = useAppStore();
  
  const unidadeId = searchParams.get('unidade') || '';
  const profissionalId = searchParams.get('profissional') || '';
  const tipoId = searchParams.get('tipo') || '';
  
  const [dataSelecionada, setDataSelecionada] = useState<Date>(new Date());
  const [horarioSelecionado, setHorarioSelecionado] = useState('');
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<HorarioDisponivel[]>([]);
  const [loadingHorarios, setLoadingHorarios] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Validar parâmetros obrigatórios
    if (!unidadeId || !profissionalId || !tipoId) {
      showNotification('Parâmetros inválidos. Redirecionando...', 'error');
      navigate('/agendamentos/novo');
      return;
    }
    
    loadHorarios();
  }, [dataSelecionada, unidadeId, profissionalId]);

  const loadHorarios = async () => {
    try {
      setLoadingHorarios(true);
      setError(null);
      setHorarioSelecionado(''); // Reset seleção quando muda data
      
      const dataFormatada = format(dataSelecionada, 'yyyy-MM-dd');
      const horarios = await obterHorariosDisponiveis(unidadeId, profissionalId, dataFormatada);
      setHorariosDisponiveis(horarios);
    } catch (err) {
      setError('Erro ao carregar horários disponíveis');
      console.error('Erro ao carregar horários:', err);
    } finally {
      setLoadingHorarios(false);
    }
  };

  const handleContinuar = () => {
    if (!horarioSelecionado) {
      showNotification('Por favor, selecione um horário', 'error');
      return;
    }

    const params = new URLSearchParams({
      unidade: unidadeId,
      profissional: profissionalId,
      tipo: tipoId,
      data: format(dataSelecionada, 'yyyy-MM-dd'),
      hora: horarioSelecionado
    });

    navigate(`/agendamentos/confirmacao?${params.toString()}`);
  };

  const handleVoltar = () => {
    const params = new URLSearchParams({
      unidade: unidadeId,
      profissional: profissionalId,
      tipo: tipoId
    });
    
    navigate(`/agendamentos/novo?${params.toString()}`);
  };

  // Filtrar dias disponíveis (não pode ser no passado e máximo 60 dias)
  const isDateDisabled = (date: Date) => {
    const hoje = new Date();
    const maxDate = addDays(hoje, 60);
    
    return !isAfter(date, hoje) && !isSameDay(date, hoje) || isAfter(date, maxDate);
  };

  const horariosDisponiveis_ = horariosDisponiveis.filter(h => h.disponivel);
  const totalHorarios = horariosDisponiveis.length;
  const horariosIndisponiveis = totalHorarios - horariosDisponiveis_.length;

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader 
        title="Novo Agendamento" 
        showBack 
        onBack={handleVoltar} 
      />

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

        {error && (
          <ErrorBanner 
            message={error}
            onRetry={loadHorarios}
          />
        )}

        {/* Seleção de Data */}
        <Card className="p-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Escolha a Data</h3>
            </div>
            
            <div className="flex justify-center">
              <CalendarComponent
                mode="single"
                selected={dataSelecionada}
                onSelect={(date) => date && setDataSelecionada(date)}
                disabled={isDateDisabled}
                locale={ptBR}
                className="rounded-md border"
              />
            </div>
            
            <div className="text-center bg-muted/50 rounded p-2">
              <p className="text-sm font-medium">
                Data selecionada: {format(dataSelecionada, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
            </div>
          </div>
        </Card>

        {/* Seleção de Horário */}
        <Card className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Horários Disponíveis</h3>
              {totalHorarios > 0 && (
                <div className="text-xs text-muted-foreground">
                  {horariosDisponiveis_.length} de {totalHorarios} horários
                </div>
              )}
            </div>

            {loadingHorarios ? (
              <div className="space-y-2">
                <SkeletonCard />
                <SkeletonCard />
              </div>
            ) : horariosDisponiveis_.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                <h4 className="font-medium mb-2">Nenhum horário disponível</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Não há horários livres nesta data. Tente escolher outro dia.
                </p>
                {horariosIndisponiveis > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {horariosIndisponiveis} horário{horariosIndisponiveis > 1 ? 's já ocupados' : ' já ocupado'}
                  </p>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-2">
                  {horariosDisponiveis.map((horario) => (
                    <Button
                      key={horario.hora}
                      variant={horarioSelecionado === horario.hora ? "default" : "outline"}
                      size="sm"
                      disabled={!horario.disponivel}
                      onClick={() => setHorarioSelecionado(horario.hora)}
                      className={cn(
                        "h-10 text-xs",
                        !horario.disponivel && "opacity-40 cursor-not-allowed",
                        horarioSelecionado === horario.hora && "bg-primary text-primary-foreground"
                      )}
                    >
                      {horario.hora}
                    </Button>
                  ))}
                </div>
                
                {horariosIndisponiveis > 0 && (
                  <p className="text-xs text-muted-foreground text-center">
                    Horários em cinza já estão ocupados
                  </p>
                )}
              </>
            )}
          </div>
        </Card>

        {/* CTAs */}
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={handleVoltar}
            className="flex-1"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <Button 
            onClick={handleContinuar}
            disabled={!horarioSelecionado}
            className="flex-1"
          >
            Continuar
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}