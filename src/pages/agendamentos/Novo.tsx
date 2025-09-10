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
  const { showNotification, setAgendamentoData, usuario } = useAppStore();
  
  // Estados dos dados da API
  const [unidadeInfo, setUnidadeInfo] = useState<ConsultarUsuarioResponse['unidade'] | null>(null);
  const [equipeId, setEquipeId] = useState<string>('');
  const [tiposConsulta, setTiposConsulta] = useState<TipoConsultaAPI[]>([]);
  const [profissionais, setProfissionais] = useState<ProfissionalAPI[]>([]);
  
  // Estados de seleção
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

  useEffect(() => {
    if (equipeId && tipoSelecionado) {
      loadProfissionais();
    } else {
      setProfissionais([]);
      setProfissionalSelecionado('');
    }
  }, [tipoSelecionado, equipeId]);

  // Log para debug do estado dos tipos de consulta
  useEffect(() => {
    console.log('Estado tiposConsulta atualizado:', tiposConsulta, 'length:', tiposConsulta.length);
  }, [tiposConsulta]);
  const loadInitialData = async () => {
    try {
      setError(null);
      setLoadingInitial(true);
      
      console.log('Iniciando carregamento dos dados...');
      
      // Chama a API para consultar usuário (usando dados fixos por enquanto)
      const userData = await consultarUsuario("15384113855", "19710812", "");
      
      console.log('Dados recebidos da API:', userData);
      console.log('userData.unidade:', userData.unidade);
      console.log('userData.equipe:', userData.equipe);
      
      if (!userData.unidade || !userData.unidade.id) {
        throw new Error('Dados da unidade não encontrados');
      }
      
      if (!userData.equipe || !userData.equipe.id) {
        throw new Error('Dados da equipe não encontrados');
      }
      
      // Salva a unidade automaticamente
      setUnidadeInfo(userData.unidade);
      setEquipeId(userData.equipe.id);
      
      console.log('Salvando no store:', {
        unidadeId: userData.unidade.id,
        equipeId: userData.equipe.id
      });
      
      // Salva no store global
      setAgendamentoData({
        unidadeId: userData.unidade.id,
        equipeId: userData.equipe.id
      });
      
      // Carrega tipos de consulta automaticamente
      await loadTiposConsulta(userData.equipe.id);
      
    } catch (err) {
      console.error('Erro detalhado ao carregar dados:', err);
      setError('Erro ao carregar dados iniciais: ' + (err as Error).message);
    } finally {
      setLoadingInitial(false);
    }
  };

  const loadTiposConsulta = async (equipeId: string) => {
    try {
      console.log('Carregando tipos de consulta para equipeId:', equipeId);
      setLoadingTipos(true);
      const tiposData = await consultarTipos(equipeId);
      console.log('Tipos de consulta recebidos:', tiposData);
      setTiposConsulta(tiposData);
      console.log('Estado tiposConsulta atualizado, length:', tiposData?.length || 0);
    } catch (err) {
      console.error('Erro detalhado ao carregar tipos:', err);
      showNotification('Erro ao carregar tipos de consulta', 'error');
    } finally {
      setLoadingTipos(false);
    }
  };

  const loadProfissionais = async () => {
    if (!tipoSelecionado || !equipeId) return;
    try {
      setLoadingProfissionais(true);
      const profissionaisData = await consultarProfissionais(tipoSelecionado, equipeId);
      setProfissionais(profissionaisData);
    } catch (err) {
      showNotification('Erro ao carregar profissionais', 'error');
      console.error('Erro ao carregar profissionais:', err);
    } finally {
      setLoadingProfissionais(false);
    }
  };
  const handleTipoChange = (valor: string) => {
    setTipoSelecionado(valor);
    setProfissionalSelecionado(''); // Reset profissional
    setAgendamentoData({ tipoConsultaId: valor });
  };

  const handleProfissionalChange = (valor: string) => {
    setProfissionalSelecionado(valor);
    setAgendamentoData({ profissionalId: valor });
  };

  const handleContinuar = () => {
    if (!unidadeInfo || !profissionalSelecionado || !tipoSelecionado) {
      showNotification('Por favor, complete todos os campos', 'error');
      return;
    }
    
    const params = new URLSearchParams({
      unidade: unidadeInfo.id,
      profissional: profissionalSelecionado,
      tipo: tipoSelecionado
    });
    navigate(`/agendamentos/horarios?${params.toString()}`);
  };

  const podeAtualizar = unidadeInfo && profissionalSelecionado && tipoSelecionado;
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
                <div className="bg-muted/50 rounded p-3">
                  <div className="font-medium">{unidadeInfo.razaoSocial}</div>
                  <div className="text-sm text-muted-foreground">Unidade vinculada automaticamente</div>
                </div>
              ) : (
                <div className="text-sm text-destructive">
                  Erro ao carregar unidade de saúde
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
              
              {!unidadeInfo ? (
                <p className="text-sm text-muted-foreground">
                  Aguardando carregamento da unidade
                </p>
              ) : loadingTipos ? (
                <SkeletonCard />
              ) : (
                <Select value={tipoSelecionado} onValueChange={handleTipoChange} disabled={!equipeId}>
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
                        <SelectItem key={tipo.id} value={tipo.id}>
                          <div className="font-medium">{tipo.descricao}</div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}

              {tipoInfo && (
                <div className="bg-muted/50 rounded p-3 text-sm">
                  <p><strong>Tipo selecionado:</strong> {tipoInfo.descricao}</p>
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
                    {profissionais.map(profissional => (
                      <SelectItem key={profissional.id} value={profissional.id}>
                        <div className="font-medium">{profissional.descricao}</div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {profissionalInfo && (
                <div className="bg-muted/50 rounded p-3 text-sm">
                  <p><strong>Profissional:</strong> {profissionalInfo.descricao}</p>
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