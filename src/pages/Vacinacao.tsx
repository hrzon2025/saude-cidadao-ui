import { useState, useEffect } from "react";
import { Syringe } from "lucide-react";
import { AppHeader } from "@/components/ui/app-header";
import { Card } from "@/components/ui/card";
import { SkeletonCardList } from "@/components/skeletons/skeleton-card";
import { ErrorBanner } from "@/components/ui/error-banner";
import { 
  obterCalendarioVacinacao, 
  Vacina, 
  FaixaEtaria, 
  FAIXAS_ETARIAS 
} from "@/lib/stubs/vacinacao";
import { useNavigate } from "react-router-dom";

export default function Vacinacao() {
  const navigate = useNavigate();
  
  console.log('Vacinacao component loaded - no tabs version');
  
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

  useEffect(() => {
    loadCalendario();
  }, []);

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

  const renderVacinaCard = (vacina: Vacina) => (
    <Card key={vacina.id} className="p-4 transition-smooth hover:shadow-medium">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-semibold text-foreground">{vacina.nome}</h4>
            <p className="text-sm text-muted-foreground mt-1">{vacina.descricao}</p>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          {vacina.descricaoDetalhada && (
            <p className="text-muted-foreground leading-relaxed">
              {vacina.descricaoDetalhada}
            </p>
          )}

          {vacina.doses > 1 && (
            <div className="flex items-center text-muted-foreground">
              <Syringe className="h-4 w-4 mr-2" />
              <span>{vacina.doses} doses</span>
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

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20">
      <AppHeader 
        title="Vacinação" 
        showBack 
        onBack={() => navigate('/')} 
      />

      <div className="max-w-md mx-auto p-4">
        {renderCalendario()}
      </div>
    </div>
  );
}