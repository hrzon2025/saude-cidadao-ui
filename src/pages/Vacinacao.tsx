import { useState, useEffect } from "react";
import { Syringe, MapPin, Calendar as CalendarIcon, Clock, CheckCircle } from "lucide-react";
import { AppHeader } from "@/components/ui/app-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SkeletonCard, SkeletonCardList } from "@/components/skeletons/skeleton-card";
import { ErrorBanner } from "@/components/ui/error-banner";
import { CardUnidade } from "@/components/cards/card-unidade";
import { useAppStore } from "@/store/useAppStore";
import { 
  obterCalendarioVacinacao, 
  obterUnidadesComVacinacao,
  Vacina, 
  FaixaEtaria, 
  FAIXAS_ETARIAS 
} from "@/lib/stubs/vacinacao";
import { Unidade } from "@/lib/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Vacinacao() {
  const { showNotification } = useAppStore();
  
  // Calendar tab state
  const [calendario, setCalendario] = useState<Record<FaixaEtaria, Vacina[]>>({
    ao_nascimento: [],
    '2_meses': [],
    '4_meses': [],
    '6_meses': [],
    '12_meses': [],
    adulto: [],
    idoso: []
  });
  const [loadingCalendario, setLoadingCalendario] = useState(true);
  const [errorCalendario, setErrorCalendario] = useState<string | null>(null);
  
  // Units tab state
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [loadingUnidades, setLoadingUnidades] = useState(false);
  const [errorUnidades, setErrorUnidades] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState("calendario");

  useEffect(() => {
    loadCalendario();
  }, []);

  useEffect(() => {
    if (activeTab === "unidades" && unidades.length === 0) {
      loadUnidades();
    }
  }, [activeTab]);

  const loadCalendario = async () => {
    try {
      setLoadingCalendario(true);
      setErrorCalendario(null);
      const data = await obterCalendarioVacinacao();
      setCalendario(data);
    } catch (err) {
      setErrorCalendario('Erro ao carregar calendário de vacinação');
      console.error('Erro ao carregar calendário:', err);
    } finally {
      setLoadingCalendario(false);
    }
  };

  const loadUnidades = async () => {
    try {
      setLoadingUnidades(true);
      setErrorUnidades(null);
      const data = await obterUnidadesComVacinacao();
      setUnidades(data);
    } catch (err) {
      setErrorUnidades('Erro ao carregar unidades com vacinação');
      console.error('Erro ao carregar unidades:', err);
    } finally {
      setLoadingUnidades(false);
    }
  };

  const handleCall = (telefone: string) => {
    showNotification(`Ligando para ${telefone}`, 'info');
  };

  const handleNavigate = (geo: { lat: number; lng: number }) => {
    showNotification(`Abrindo navegação para localização`, 'info');
  };

  const formatarData = (data: string) => {
    try {
      return format(new Date(data), "dd/MM/yyyy", { locale: ptBR });
    } catch {
      return data;
    }
  };

  const renderVacinaBadge = (vacina: Vacina) => {
    switch (vacina.status) {
      case 'aplicada':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Aplicada
          </Badge>
        );
      case 'atrasada':
        return (
          <Badge variant="destructive">
            <Clock className="h-3 w-3 mr-1" />
            Atrasada
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            <CalendarIcon className="h-3 w-3 mr-1" />
            Recomendada
          </Badge>
        );
    }
  };

  const renderVacinaCard = (vacina: Vacina) => (
    <Card key={vacina.id} className="p-4 transition-smooth hover:shadow-medium">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-semibold text-foreground">{vacina.nome}</h4>
            <p className="text-sm text-muted-foreground mt-1">{vacina.descricao}</p>
          </div>
          {renderVacinaBadge(vacina)}
        </div>

        <div className="space-y-2 text-sm">
          {vacina.doses > 1 && (
            <div className="flex items-center text-muted-foreground">
              <Syringe className="h-4 w-4 mr-2" />
              <span>{vacina.doses} doses</span>
            </div>
          )}

          {vacina.dataAplicacao && (
            <div className="flex items-center text-muted-foreground">
              <CheckCircle className="h-4 w-4 mr-2" />
              <span>Aplicada em {formatarData(vacina.dataAplicacao)}</span>
            </div>
          )}

          {vacina.proximaDose && (
            <div className="flex items-center text-muted-foreground">
              <CalendarIcon className="h-4 w-4 mr-2" />
              <span>Próxima dose: {formatarData(vacina.proximaDose)}</span>
            </div>
          )}

          {vacina.observacoes && (
            <div className="bg-muted/50 rounded p-2 text-xs">
              <strong>Observação:</strong> {vacina.observacoes}
            </div>
          )}
        </div>
      </div>
    </Card>
  );

  const renderCalendario = () => {
    if (loadingCalendario) {
      return <SkeletonCardList count={6} />;
    }

    if (errorCalendario) {
      return (
        <ErrorBanner 
          message={errorCalendario}
          onRetry={loadCalendario}
        />
      );
    }

    return (
      <div className="space-y-6">
        {(Object.keys(FAIXAS_ETARIAS) as FaixaEtaria[]).map((faixaId) => {
          const vacinas = calendario[faixaId];
          
          if (vacinas.length === 0) return null;

          const faixaLabel = FAIXAS_ETARIAS[faixaId];
          const groupId = `faixa-${faixaId}`;

          return (
            <section key={faixaId} aria-labelledby={groupId}>
              <h3 
                id={groupId}
                className="text-lg font-semibold mb-3 text-foreground flex items-center"
              >
                <div className="w-2 h-6 bg-primary rounded mr-3" />
                {faixaLabel}
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({vacinas.length} {vacinas.length === 1 ? 'vacina' : 'vacinas'})
                </span>
              </h3>
              
              <div className="space-y-3">
                {vacinas.map(renderVacinaCard)}
              </div>
            </section>
          );
        })}
      </div>
    );
  };

  const renderUnidades = () => {
    if (loadingUnidades) {
      return <SkeletonCardList count={4} />;
    }

    if (errorUnidades) {
      return (
        <ErrorBanner 
          message={errorUnidades}
          onRetry={loadUnidades}
        />
      );
    }

    if (unidades.length === 0) {
      return (
        <Card className="p-6 text-center">
          <MapPin className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
          <h3 className="font-medium mb-2">Nenhuma unidade encontrada</h3>
          <p className="text-sm text-muted-foreground">
            Não há unidades com sala de vacinação disponíveis no momento
          </p>
        </Card>
      );
    }

    return (
      <div>
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Filtro aplicado:</strong> Exibindo apenas unidades com sala de vacinação
          </p>
        </div>
        
        <div className="space-y-4">
          {unidades.map((unidade) => (
            <CardUnidade
              key={unidade.id}
              unidade={unidade}
              onCall={handleCall}
              onNavigate={handleNavigate}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20">
      <AppHeader 
        title="Vacinação" 
        subtitle="Calendário vacinal e locais para vacinação"
        showBack 
        onBack={() => window.history.back()} 
      />

      <div className="max-w-md mx-auto p-4">
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger 
              value="calendario"
              className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              Calendário
            </TabsTrigger>
            <TabsTrigger 
              value="unidades"
              className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Unidades
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendario" className="mt-0">
            {renderCalendario()}
          </TabsContent>

          <TabsContent value="unidades" className="mt-0">
            {renderUnidades()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}