import { useState, useEffect } from "react";
import { ChevronRight, MapPin, User, Stethoscope } from "lucide-react";
import { AppHeader } from "@/components/ui/app-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SkeletonCard } from "@/components/skeletons/skeleton-card";
import { ErrorBanner } from "@/components/ui/error-banner";
import { useAppStore } from "@/store/useAppStore";
import { obterUnidades, obterProfissionaisPorUnidade, obterTiposConsulta } from "@/lib/stubs/agendamentos";
import { Unidade, Profissional, TipoConsulta } from "@/lib/types";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function NovoAgendamento() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showNotification } = useAppStore();
  
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [tiposConsulta, setTiposConsulta] = useState<TipoConsulta[]>([]);
  
  const [unidadeSelecionada, setUnidadeSelecionada] = useState(searchParams.get('unidade') || '');
  const [profissionalSelecionado, setProfissionalSelecionado] = useState(searchParams.get('profissional') || '');
  const [tipoSelecionado, setTipoSelecionado] = useState(searchParams.get('tipo') || '');
  
  const [loadingUnidades, setLoadingUnidades] = useState(true);
  const [loadingProfissionais, setLoadingProfissionais] = useState(false);
  const [loadingTipos, setLoadingTipos] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (unidadeSelecionada) {
      loadProfissionais();
      // Reset profissional when unidade changes
      if (searchParams.get('unidade') !== unidadeSelecionada) {
        setProfissionalSelecionado('');
      }
    } else {
      setProfissionais([]);
      setProfissionalSelecionado('');
    }
  }, [unidadeSelecionada]);

  const loadInitialData = async () => {
    try {
      setError(null);
      
      const [unidadesData, tiposData] = await Promise.all([
        obterUnidades(),
        obterTiposConsulta()
      ]);
      
      setUnidades(unidadesData);
      setTiposConsulta(tiposData);
      
      // Se tem unidade na URL, carrega profissionais
      if (searchParams.get('unidade')) {
        await loadProfissionais();
      }
    } catch (err) {
      setError('Erro ao carregar dados iniciais');
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoadingUnidades(false);
      setLoadingTipos(false);
    }
  };

  const loadProfissionais = async () => {
    if (!unidadeSelecionada) return;
    
    try {
      setLoadingProfissionais(true);
      const profissionaisData = await obterProfissionaisPorUnidade(unidadeSelecionada);
      setProfissionais(profissionaisData);
    } catch (err) {
      showNotification('Erro ao carregar profissionais', 'error');
      console.error('Erro ao carregar profissionais:', err);
    } finally {
      setLoadingProfissionais(false);
    }
  };

  const handleContinuar = () => {
    if (!unidadeSelecionada || !profissionalSelecionado || !tipoSelecionado) {
      showNotification('Por favor, selecione todos os campos', 'error');
      return;
    }

    const params = new URLSearchParams({
      unidade: unidadeSelecionada,
      profissional: profissionalSelecionado,
      tipo: tipoSelecionado
    });

    navigate(`/agendamentos/horarios?${params.toString()}`);
  };

  const podeAtualizar = unidadeSelecionada && profissionalSelecionado && tipoSelecionado;

  const unidadeInfo = unidades.find(u => u.id === unidadeSelecionada);
  const profissionalInfo = profissionais.find(p => p.id === profissionalSelecionado);
  const tipoInfo = tiposConsulta.find(t => t.id === tipoSelecionado);

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader 
        title="Novo Agendamento" 
        subtitle="Passo 1 de 3: Selecione os detalhes"
        showBack 
        onBack={() => navigate('/')} 
      />

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

        {error && (
          <ErrorBanner 
            message={error}
            onRetry={loadInitialData}
          />
        )}

        {/* Formulário */}
        <div className="space-y-4">
          {/* Unidade */}
          <Card className="p-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Unidade de Saúde</h3>
              </div>
              
              {loadingUnidades ? (
                <SkeletonCard />
              ) : (
                <Select value={unidadeSelecionada} onValueChange={setUnidadeSelecionada}>
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha uma unidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {unidades.map((unidade) => (
                      <SelectItem key={unidade.id} value={unidade.id}>
                        <div>
                          <div className="font-medium">{unidade.nome}</div>
                          <div className="text-xs text-muted-foreground">{unidade.endereco}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {unidadeInfo && (
                <div className="bg-muted/50 rounded p-3 text-sm">
                  <p><strong>Endereço:</strong> {unidadeInfo.endereco}</p>
                  <p><strong>Telefone:</strong> {unidadeInfo.telefone}</p>
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
              
              {!unidadeSelecionada ? (
                <p className="text-sm text-muted-foreground">
                  Primeiro selecione uma unidade de saúde
                </p>
              ) : loadingProfissionais ? (
                <SkeletonCard />
              ) : (
                <Select 
                  value={profissionalSelecionado} 
                  onValueChange={setProfissionalSelecionado}
                  disabled={!unidadeSelecionada}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha um profissional" />
                  </SelectTrigger>
                  <SelectContent>
                    {profissionais.map((profissional) => (
                      <SelectItem key={profissional.id} value={profissional.id}>
                        <div>
                          <div className="font-medium">{profissional.nome}</div>
                          <div className="text-xs text-muted-foreground">
                            {profissional.especialidade} • {profissional.crm}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {profissionalInfo && (
                <div className="bg-muted/50 rounded p-3 text-sm">
                  <p><strong>Especialidade:</strong> {profissionalInfo.especialidade}</p>
                  <p><strong>CRM:</strong> {profissionalInfo.crm}</p>
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
              
              {loadingTipos ? (
                <SkeletonCard />
              ) : (
                <Select value={tipoSelecionado} onValueChange={setTipoSelecionado}>
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha o tipo de consulta" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposConsulta.map((tipo) => (
                      <SelectItem key={tipo.id} value={tipo.id}>
                        <div>
                          <div className="font-medium">{tipo.nome}</div>
                          <div className="text-xs text-muted-foreground">
                            Duração: {tipo.duracao} minutos
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {tipoInfo && (
                <div className="bg-muted/50 rounded p-3 text-sm">
                  <p><strong>Duração:</strong> {tipoInfo.duracao} minutos</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* CTAs */}
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => navigate('/agendamentos')}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleContinuar}
            disabled={!podeAtualizar}
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