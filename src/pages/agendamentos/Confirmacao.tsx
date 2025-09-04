import { useState, useEffect } from "react";
import { ChevronLeft, Check, Calendar, MapPin, User, Stethoscope, Clock } from "lucide-react";
import { AppHeader } from "@/components/ui/app-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAppStore } from "@/store/useAppStore";
import { criarAgendamento, obterUnidades, obterProfissionaisPorUnidade, obterTiposConsulta } from "@/lib/stubs/agendamentos";
import { Unidade, Profissional, TipoConsulta } from "@/lib/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function ConfirmacaoAgendamento() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showNotification } = useAppStore();
  
  const unidadeId = searchParams.get('unidade') || '';
  const profissionalId = searchParams.get('profissional') || '';
  const tipoId = searchParams.get('tipo') || '';
  const data = searchParams.get('data') || '';
  const hora = searchParams.get('hora') || '';
  
  const [observacoes, setObservacoes] = useState('');
  const [confirmando, setConfirmando] = useState(false);
  const [dadosCarregados, setDadosCarregados] = useState(false);
  
  // Dados para exibir
  const [unidade, setUnidade] = useState<Unidade | null>(null);
  const [profissional, setProfissional] = useState<Profissional | null>(null);
  const [tipoConsulta, setTipoConsulta] = useState<TipoConsulta | null>(null);

  useEffect(() => {
    // Validar parâmetros obrigatórios
    if (!unidadeId || !profissionalId || !tipoId || !data || !hora) {
      showNotification('Dados incompletos. Redirecionando...', 'error');
      navigate('/agendamentos/novo');
      return;
    }
    
    loadDadosConfirmacao();
  }, []);

  const loadDadosConfirmacao = async () => {
    try {
      const [unidades, profissionais, tipos] = await Promise.all([
        obterUnidades(),
        obterProfissionaisPorUnidade(unidadeId),
        obterTiposConsulta()
      ]);
      
      setUnidade(unidades.find(u => u.id === unidadeId) || null);
      setProfissional(profissionais.find(p => p.id === profissionalId) || null);
      setTipoConsulta(tipos.find(t => t.id === tipoId) || null);
      setDadosCarregados(true);
    } catch (err) {
      showNotification('Erro ao carregar dados', 'error');
      console.error('Erro ao carregar dados:', err);
    }
  };

  const handleConfirmar = async () => {
    try {
      setConfirmando(true);
      
      const novoAgendamento = {
        unidadeId,
        profissionalId,
        tipoId,
        data,
        hora,
        observacoes: observacoes.trim() || undefined
      };
      
      const resultado = await criarAgendamento(novoAgendamento);
      
      if (resultado.success) {
        showNotification(
          `Agendamento confirmado! Sua consulta de ${tipoConsulta?.nome} está marcada para ${formatted.data} às ${formatted.hora} na ${unidade?.nome}.`, 
          'success'
        );
        navigate('/agendamentos');
      } else {
        showNotification(resultado.error || 'Erro ao realizar agendamento', 'error');
      }
    } catch (err) {
      showNotification('Erro ao realizar agendamento', 'error');
      console.error('Erro ao confirmar:', err);
    } finally {
      setConfirmando(false);
    }
  };

  const handleVoltar = () => {
    const params = new URLSearchParams({
      unidade: unidadeId,
      profissional: profissionalId,
      tipo: tipoId
    });
    
    navigate(`/agendamentos/horarios?${params.toString()}`);
  };

  const formatarData = () => {
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

  const formatted = formatarData();

  if (!dadosCarregados) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <AppHeader title="Carregando..." />
        <div className="max-w-md mx-auto p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-20 bg-muted rounded"></div>
            <div className="h-20 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader 
        title="Confirmar Agendamento" 
        subtitle="Passo 3 de 3: Revisar e confirmar"
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
            ✓
          </div>
          <div className="w-12 h-0.5 bg-primary"></div>
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
            3
          </div>
        </div>

        {/* Resumo do Agendamento */}
        <Card className="p-4 bg-primary/5 border-primary/20">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Check className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">Resumo do Agendamento</h3>
            </div>

            <div className="space-y-3">
              {/* Data e Hora */}
              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Data e Horário</p>
                  <p className="text-sm text-muted-foreground">
                    {formatted.diaSemana}, {formatted.data} às {formatted.hora}
                  </p>
                </div>
              </div>

              {/* Unidade */}
              {unidade && (
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Unidade de Saúde</p>
                    <p className="text-sm text-muted-foreground">{unidade.nome}</p>
                    <p className="text-xs text-muted-foreground">{unidade.endereco}</p>
                  </div>
                </div>
              )}

              {/* Profissional */}
              {profissional && (
                <div className="flex items-start space-x-3">
                  <User className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Profissional</p>
                    <p className="text-sm text-muted-foreground">{profissional.nome}</p>
                    <p className="text-xs text-muted-foreground">
                      {profissional.especialidade} • {profissional.crm}
                    </p>
                  </div>
                </div>
              )}

              {/* Tipo */}
              {tipoConsulta && (
                <div className="flex items-start space-x-3">
                  <Stethoscope className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Tipo de Consulta</p>
                    <p className="text-sm text-muted-foreground">{tipoConsulta.nome}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      Duração: {tipoConsulta.duracao} minutos
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Observações */}
        <Card className="p-4">
          <div className="space-y-3">
            <Label htmlFor="observacoes">Observações (opcional)</Label>
            <Textarea
              id="observacoes"
              placeholder="Adicione informações relevantes para a consulta..."
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              rows={3}
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground">
              {observacoes.length}/200 caracteres
            </p>
          </div>
        </Card>

        {/* Informações Importantes */}
        <Card className="p-4 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
          <div className="space-y-2">
            <h4 className="font-medium text-amber-800 dark:text-amber-200">
              Informações Importantes
            </h4>
            <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
              <li>• Chegue com 15 minutos de antecedência</li>
              <li>• Traga seus documentos e cartão SUS</li>
              <li>• Cancelamentos devem ser feitos com 24h de antecedência</li>
            </ul>
          </div>
        </Card>

        {/* CTAs */}
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={handleVoltar}
            disabled={confirmando}
            className="flex-1"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <Button 
            onClick={handleConfirmar}
            disabled={confirmando}
            className="flex-1"
          >
            {confirmando ? (
              'Confirmando...'
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Confirmar
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}