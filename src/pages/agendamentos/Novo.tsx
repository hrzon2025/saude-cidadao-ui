import { useState, useEffect } from "react";
import { ChevronRight, MapPin, User, Stethoscope } from "lucide-react";
import { AppHeader } from "@/components/ui/app-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SkeletonCard } from "@/components/skeletons/skeleton-card";
import { ErrorBanner } from "@/components/ui/error-banner";
import { useAppStore } from "@/store/useAppStore";
import { consultarUsuario, consultarTipos, consultarProfissionais, type ConsultarUsuarioResponse, type TipoConsulta as TipoConsultaAPI, type Profissional as ProfissionalAPI } from "@/lib/services/agendamento";
import { useNavigate } from "react-router-dom";
export default function NovoAgendamento() {
  const navigate = useNavigate();
  const { showNotification, setAgendamentoData } = useAppStore();
  
  // Estados dos dados da API
  const [unidadeInfo, setUnidadeInfo] = useState<ConsultarUsuarioResponse['unidade'] | null>(null);
  const [equipeId, setEquipeId] = useState<string>('');
  const [tiposConsulta, setTiposConsulta] = useState<TipoConsultaAPI[]>([]);
  const [profissionais, setProfissionais] = useState<ProfissionalAPI[]>([]);
  
  // Estados de seleção
  const [unidadeSelecionada, setUnidadeSelecionada] = useState<string>('');
  const [tipoSelecionado, setTipoSelecionado] = useState<string>('');
  const [profissionalSelecionado, setProfissionalSelecionado] = useState<string>('');
  
  // Estados de loading
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingTipos, setLoadingTipos] = useState(false);
  const [loadingProfissionais, setLoadingProfissionais] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    loadInitialData();
  }, []);

  // Quando a unidade é selecionada, carrega os tipos de consulta
  useEffect(() => {
    if (unidadeSelecionada && equipeId) {
      loadTiposConsulta();
      // Reset dos selects dependentes
      setTipoSelecionado('');
      setProfissionalSelecionado('');
      setProfissionais([]);
    }
  }, [unidadeSelecionada]);

  // Quando o tipo é selecionado, carrega os profissionais
  useEffect(() => {
    if (tipoSelecionado && equipeId) {
      loadProfissionais();
      // Reset do profissional
      setProfissionalSelecionado('');
    }
  }, [tipoSelecionado]);
  const loadInitialData = async () => {
    try {
      setError(null);
      setLoadingInitial(true);
      
      console.log('Carregando dados iniciais do usuário...');
      
      // Chama a API para consultar usuário
      const userData = await consultarUsuario("15384113855", "19710812", "");
      
      console.log('Dados recebidos da API:', userData);
      
      // Salvar dados no store global, incluindo individuoID
      setAgendamentoData({
        individuoID: userData.individuoID,
        cns: userData.cns,
        cpf: userData.cpf,
        unidadeId: userData.unidade.id,
        equipeId: userData.equipe.id
      });
      
      if (!userData.unidade || !userData.unidade.id) {
        throw new Error('Dados da unidade não encontrados');
      }
      
      if (!userData.equipe || !userData.equipe.id) {
        throw new Error('Dados da equipe não encontrados');
      }
      
      // Salva os dados básicos
      setUnidadeInfo(userData.unidade);
      setEquipeId(userData.equipe.id.toString());
      
      // Salvar dados do usuário no estado global para a tela de confirmação
      setAgendamentoData({
        individuoID: userData.individuoID,
        cns: userData.cns,
        cpf: userData.cpf
      });
      
      console.log('Unidade carregada:', userData.unidade);
      console.log('Equipe ID salvo:', userData.equipe.id);
      
    } catch (err) {
      console.error('Erro detalhado ao carregar dados:', err);
      setError('Erro ao carregar dados iniciais: ' + (err as Error).message);
    } finally {
      setLoadingInitial(false);
    }
  };

  const loadTiposConsulta = async () => {
    try {
      console.log('Carregando tipos de consulta para equipeId:', equipeId);
      setLoadingTipos(true);
      const tiposData = await consultarTipos(equipeId);
      console.log('Tipos de consulta recebidos:', tiposData);
      setTiposConsulta(tiposData);
    } catch (err) {
      console.error('Erro ao carregar tipos:', err);
      showNotification('Erro ao carregar tipos de consulta', 'error');
    } finally {
      setLoadingTipos(false);
    }
  };

  const loadProfissionais = async () => {
    if (!tipoSelecionado || !equipeId) return;
    try {
      console.log('Carregando profissionais para:', { tipoSelecionado, equipeId });
      setLoadingProfissionais(true);
      const profissionaisData = await consultarProfissionais(tipoSelecionado, equipeId);
      console.log('Profissionais recebidos:', profissionaisData);
      setProfissionais(profissionaisData);
    } catch (err) {
      console.error('Erro ao carregar profissionais:', err);
      showNotification('Erro ao carregar profissionais', 'error');
    } finally {
      setLoadingProfissionais(false);
    }
  };
  const handleUnidadeChange = (valor: string) => {
    console.log('Unidade selecionada:', valor);
    setUnidadeSelecionada(valor);
    setAgendamentoData({ 
      unidadeId: valor,
      equipeId: equipeId 
    });
  };

  const handleTipoChange = (valor: string) => {
    console.log('Tipo selecionado:', valor);
    setTipoSelecionado(valor);
    setAgendamentoData({ tipoConsultaId: valor });
  };

  const handleProfissionalChange = (valor: string) => {
    console.log('Profissional selecionado:', valor);
    setProfissionalSelecionado(valor);
    setAgendamentoData({ profissionalId: valor });
  };

  const handleContinuar = () => {
    if (!unidadeSelecionada || !profissionalSelecionado || !tipoSelecionado) {
      showNotification('Por favor, complete todos os campos', 'error');
      return;
    }
    
    // Salvar todos os dados necessários no estado global
    setAgendamentoData({
      unidadeId: unidadeSelecionada,
      equipeId: equipeId,
      tipoConsultaId: tipoSelecionado,
      profissionalId: profissionalSelecionado
    });
    
    navigate('/agendamentos/horarios');
  };

  const podeAtualizar = unidadeSelecionada && profissionalSelecionado && tipoSelecionado;
  const profissionalInfo = profissionais.find(p => p.id === profissionalSelecionado);
  const tipoInfo = tiposConsulta.find(t => t.id === tipoSelecionado);
  return <div className="min-h-screen bg-background pb-20">
      <AppHeader title="Novo Agendamento" showBack onBack={() => navigate('/inicio')} />

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Stepper */}
        <div className="flex items-center justify-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
            1
          </div>
          <div className="w-12 h-0.5 bg-muted"></div>
          <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-medium">
            2
          </div>
          <div className="w-12 h-0.5 bg-muted"></div>
          <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-medium">
            3
          </div>
        </div>

        {error && <ErrorBanner message={error} onRetry={loadInitialData} />}

        {/* Formulário */}
        <div className="space-y-4">
          {/* Unidade */}
          <Card className="p-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Unidade de Saúde</h3>
              </div>
              
              {loadingInitial ? (
                <SkeletonCard />
              ) : unidadeInfo ? (
                <Select value={unidadeSelecionada} onValueChange={handleUnidadeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha uma unidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={unidadeInfo.id.toString()}>
                      <div className="font-medium">{unidadeInfo.razaoSocial}</div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="text-sm text-destructive">
                  Erro ao carregar unidade de saúde
                </div>
              )}

              {unidadeSelecionada && unidadeInfo && (
                <div className="bg-muted/50 rounded p-3 text-sm">
                  <p><strong>Unidade:</strong> {unidadeInfo.razaoSocial}</p>
                  <p><strong>ID:</strong> {unidadeInfo.id}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Tipo de Consulta */}
          <Card className="p-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Stethoscope className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Tipo de Consulta</h3>
              </div>
              
              {!unidadeSelecionada ? (
                <p className="text-sm text-muted-foreground">
                  Primeiro selecione uma unidade de saúde
                </p>
              ) : loadingTipos ? (
                <SkeletonCard />
              ) : (
                <Select value={tipoSelecionado} onValueChange={handleTipoChange} disabled={!unidadeSelecionada}>
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha o tipo de consulta" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposConsulta.length === 0 ? (
                      <SelectItem value="no-data" disabled>
                        <div className="text-sm text-muted-foreground">Nenhum tipo disponível</div>
                      </SelectItem>
                    ) : (
                      tiposConsulta.map(tipo => (
                        <SelectItem key={tipo.id} value={tipo.id.toString()}>
                          <div className="font-medium">{tipo.descricao}</div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}

              {tipoInfo && (
                <div className="bg-muted/50 rounded p-3 text-sm">
                  <p><strong>Tipo:</strong> {tipoInfo.descricao}</p>
                  <p><strong>ID:</strong> {tipoInfo.id}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Profissional */}
          <Card className="p-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Profissional</h3>
              </div>
              
              {!tipoSelecionado ? (
                <p className="text-sm text-muted-foreground">
                  Primeiro selecione um tipo de consulta
                </p>
              ) : loadingProfissionais ? (
                <SkeletonCard />
              ) : (
                <Select value={profissionalSelecionado} onValueChange={handleProfissionalChange} disabled={!tipoSelecionado}>
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha um profissional" />
                  </SelectTrigger>
                  <SelectContent>
                    {profissionais.length === 0 ? (
                      <SelectItem value="no-data" disabled>
                        <div className="text-sm text-muted-foreground">Nenhum profissional disponível</div>
                      </SelectItem>
                    ) : (
                      profissionais.map(profissional => (
                        <SelectItem key={profissional.id} value={profissional.id.toString()}>
                          <div className="font-medium">{profissional.descricao}</div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}

              {profissionalInfo && (
                <div className="bg-muted/50 rounded p-3 text-sm">
                  <p><strong>Profissional:</strong> {profissionalInfo.descricao}</p>
                  <p><strong>ID:</strong> {profissionalInfo.id}</p>
                </div>
              )}
            </div>
          </Card>

        </div>

        {/* CTAs */}
        <div className="flex gap-3">
          
          <Button onClick={handleContinuar} disabled={!podeAtualizar} className="flex-1">
            Continuar
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>;
}