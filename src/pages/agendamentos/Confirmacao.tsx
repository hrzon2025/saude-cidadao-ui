import { useState, useEffect } from "react";
import { ChevronLeft, Check, Calendar, MapPin, User, Stethoscope, Clock, X } from "lucide-react";
import { AppHeader } from "@/components/ui/app-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useAppStore } from "@/store/useAppStore";
import { agendarConsulta, TipoConsulta as TipoConsultaAPI, Profissional as ProfissionalAPI } from "@/lib/services/agendamento";
import { criarAgendamento, obterUnidades, obterProfissionaisPorUnidade, obterTiposConsulta } from "@/lib/stubs/agendamentos";
import { Unidade, Profissional, TipoConsulta } from "@/lib/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

export default function ConfirmacaoAgendamento() {
  const navigate = useNavigate();
  const { showNotification, agendamento } = useAppStore();
  
  // Pegar dados do estado global
  const { 
    unidadeId, 
    equipeId, 
    tipoConsultaId, 
    profissionalId, 
    dataSelecionada, 
    horaSelecionada,
    individuoID,
    cns,
    cpf
  } = agendamento;
  
  const [confirmando, setConfirmando] = useState(false);
  const [dadosCarregados, setDadosCarregados] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Dados para exibir
  const [unidade, setUnidade] = useState<Unidade | null>(null);
  const [profissional, setProfissional] = useState<Profissional | null>(null);
  const [tipoConsulta, setTipoConsulta] = useState<TipoConsulta | null>(null);

  useEffect(() => {
    // Validar parâmetros obrigatórios do estado global
    if (!unidadeId || !profissionalId || !tipoConsultaId || !dataSelecionada || !horaSelecionada || !individuoID || !cns || !cpf) {
      showNotification('Dados incompletos. Redirecionando...', 'error');
      navigate('/agendamentos/novo');
      return;
    }
    
    loadDadosConfirmacao();
  }, [unidadeId, profissionalId, tipoConsultaId, dataSelecionada, horaSelecionada, individuoID, cns, cpf]);

  const loadDadosConfirmacao = async () => {
    try {
      const [unidades, profissionais, tipos] = await Promise.all([
        obterUnidades(),
        obterProfissionaisPorUnidade(unidadeId!),
        obterTiposConsulta()
      ]);
      
      setUnidade(unidades.find(u => u.id === unidadeId) || null);
      setProfissional(profissionais.find(p => p.id === profissionalId) || null);
      setTipoConsulta(tipos.find(t => t.id === tipoConsultaId) || null);
      setDadosCarregados(true);
    } catch (err) {
      showNotification('Erro ao carregar dados', 'error');
      console.error('Erro ao carregar dados:', err);
    }
  };

  const handleConfirmar = async () => {
    console.log('=== INICIANDO CONFIRMAÇÃO ===');
    console.log('Estado do agendamento:', agendamento);
    
    try {
      setConfirmando(true);
      
      // Verificar todos os dados necessários
      if (!unidadeId || !profissionalId || !tipoConsultaId || !equipeId || !dataSelecionada || !horaSelecionada || !individuoID || !cns || !cpf) {
        console.error('Dados incompletos:', {
          unidadeId, profissionalId, tipoConsultaId, equipeId, 
          dataSelecionada, horaSelecionada, individuoID, cns, cpf
        });
        showNotification('Dados incompletos para o agendamento', 'error');
        return;
      }
      
      // Formatar data para YYYYMMDD
      const dataFormatada = dataSelecionada.replace(/-/g, '');
      console.log('Data formatada:', dataFormatada);
      
      const dadosAgendamento = {
        unidadeId: unidadeId,
        profissionalId: profissionalId,
        tipoConsultaId: tipoConsultaId,
        equipeId: equipeId,
        data: dataFormatada,
        hora: horaSelecionada,
        individuoID: individuoID,
        cns: cns,
        cpf: cpf
      };
      
      console.log('Dados enviados para API:', dadosAgendamento);
      
      const resultado = await agendarConsulta(dadosAgendamento);
      console.log('Resultado da API:', resultado);
      
      if (resultado.atendimentoId) {
        console.log('Agendamento criado com sucesso:', resultado.atendimentoId);
        setShowSuccessDialog(true);
      } else if (resultado.mensagem) {
        console.log('API retornou mensagem:', resultado.mensagem);
        if (resultado.mensagem.includes('Já existe um atendimento')) {
          setErrorMessage('Já existe um atendimento em aberto para este paciente.');
          setShowErrorDialog(true);
        } else {
          setErrorMessage(resultado.mensagem);
          setShowErrorDialog(true);
        }
      } else {
        console.log('Resposta inesperada da API:', resultado);
        setErrorMessage('Ocorreu um erro ao tentar agendar. Tente novamente.');
        setShowErrorDialog(true);
      }
    } catch (err) {
      console.error('Erro ao confirmar agendamento:', err);
      setErrorMessage('Ocorreu um erro ao tentar agendar. Tente novamente.');
      setShowErrorDialog(true);
    } finally {
      console.log('=== FINALIZANDO CONFIRMAÇÃO ===');
      setConfirmando(false);
    }
  };

  const handleVoltar = () => {
    navigate('/agendamentos/horarios');
  };

  const formatarData = () => {
    try {
      const dataConsulta = new Date(`${dataSelecionada}T${horaSelecionada}`);
      return {
        data: format(dataConsulta, "dd/MM/yyyy", { locale: ptBR }),
        hora: format(dataConsulta, "HH:mm", { locale: ptBR }),
        diaSemana: format(dataConsulta, "EEEE", { locale: ptBR })
      };
    } catch {
      return { data: dataSelecionada, hora: horaSelecionada, diaSemana: '' };
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
            ✓
          </div>
          <div className="w-12 h-0.5 bg-primary"></div>
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
            3
          </div>
        </div>

        {/* Resumo do Agendamento */}
        <Card className="p-4 bg-muted/50 border-muted">
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

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={(open) => {
        if (!open) {
          navigate('/inicio');
        }
      }}>
        <DialogContent className="max-w-sm mx-auto p-0 bg-card rounded-3xl border-0 shadow-xl">
          <DialogTitle className="sr-only">Agendamento Confirmado</DialogTitle>
          <div className="p-8 text-center space-y-6">
            {/* Success Icon */}
            <div className="mx-auto w-20 h-20 bg-success/20 rounded-full flex items-center justify-center">
              <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-success-foreground" strokeWidth={3} />
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-success">
                Agendamento
                <br />
                Confirmado!
              </h2>
              <p className="text-muted-foreground">
                Seu agendamento foi realizado
                <br />
                com sucesso.
              </p>
            </div>

            {/* Details */}
            <div className="space-y-3 text-left bg-muted rounded-2xl p-4">
              <div className="flex justify-between">
                <span className="font-semibold text-foreground">Paciente:</span>
                <span className="text-muted-foreground text-right">Usuário do Sistema</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-foreground">Consulta:</span>
                <span className="text-muted-foreground text-right">{tipoConsulta?.nome}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-foreground">Unidade:</span>
                <span className="text-muted-foreground text-right">{unidade?.nome}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-foreground">Endereço:</span>
                <span className="text-muted-foreground text-right text-sm">{unidade?.endereco}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-foreground">Data:</span>
                <span className="text-muted-foreground text-right">{formatted.data}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-foreground">Hora:</span>
                <span className="text-muted-foreground text-right">{formatted.hora}</span>
              </div>
            </div>

            {/* Bottom Text */}
            <p className="text-sm text-muted-foreground italic">
              Você pode visualizar todos os seus
              <br />
              agendamentos na aba 'Meus
              <br />
              Agendamentos'.
            </p>

            {/* Action Button */}
            <Button 
              onClick={() => navigate('/agendamentos/lista')}
              className="w-full bg-primary hover:bg-primary-hover text-primary-foreground py-3 rounded-2xl text-lg font-semibold"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Meus Agendamentos
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Error Dialog */}
      <Dialog open={showErrorDialog} onOpenChange={(open) => {
        if (!open) {
          setShowErrorDialog(false);
          setErrorMessage('');
        }
      }}>
        <DialogContent className="max-w-sm mx-auto p-0 bg-card rounded-3xl border-0 shadow-xl">
          <DialogTitle className="sr-only">Erro no Agendamento</DialogTitle>
          <div className="p-8 text-center space-y-6">
            {/* Error Icon */}
            <div className="mx-auto w-20 h-20 bg-destructive/20 rounded-full flex items-center justify-center">
              <div className="w-16 h-16 bg-destructive rounded-full flex items-center justify-center">
                <X className="w-8 h-8 text-destructive-foreground" strokeWidth={3} />
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-destructive">
                Agendamento
                <br />
                Não Realizado
              </h2>
              <p className="text-muted-foreground">
                {errorMessage}
              </p>
            </div>

            {/* Action Button */}
            <Button 
              onClick={() => {
                setShowErrorDialog(false);
                setErrorMessage('');
              }}
              className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground py-3 rounded-2xl text-lg font-semibold"
            >
              Entendi
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}