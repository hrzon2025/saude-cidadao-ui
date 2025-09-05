import { useState, useEffect } from "react";
import { Plus, Calendar, Heart, MapPin, MessageSquare, Pill, CreditCard, Building, FileText, ShoppingBag, Syringe } from "lucide-react";
import { AppHeader } from "@/components/ui/app-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { SkeletonCard } from "@/components/skeletons/skeleton-card";
import { ErrorBanner } from "@/components/ui/error-banner";
import { useAppStore } from "@/store/useAppStore";
import { consultarAtendimentos } from "@/lib/stubs/services";
import { Atendimento } from "@/lib/types";
import { format, isAfter } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

const shortcuts = [
  { id: 'agendamentos-novo', label: 'Novo Agendamento', icon: Plus, path: '/agendamentos/novo', color: 'text-primary' },
  { id: 'agendamentos-lista', label: 'Meus Agendamentos', icon: Calendar, path: '/agendamentos', color: 'text-teal-500' },
  { id: 'atendimentos', label: 'Consultas realizadas', icon: FileText, path: '/atendimentos', color: 'text-purple-500' },
  { id: 'minha-saude', label: 'Minha Saúde', icon: Heart, path: '/minha-saude', color: 'text-red-500' },
  { id: 'vacinas', label: 'Vacinas', icon: Syringe, path: '/vacinacao', color: 'text-blue-500' },
  { id: 'cartao-sus', label: 'Cartão SUS', icon: CreditCard, path: '/cartao-sus', color: 'text-indigo-500' },
  { id: 'unidades', label: 'Unidades', icon: Building, path: '/unidades', color: 'text-green-500' },
  { id: 'farmacia', label: 'Farmácia', icon: ShoppingBag, path: '/farmacia', color: 'text-pink-500' },
  { id: 'medicamentos', label: 'Medicamentos', icon: Pill, path: '/medicamentos', color: 'text-cyan-500' },
  { id: 'faq', label: 'FAQ', icon: FileText, path: '/faq', color: 'text-yellow-600' },
  { id: 'ouvidoria', label: 'Ouvidoria', icon: MessageSquare, path: '/ouvidoria', color: 'text-orange-500' }
];

export default function Inicio() {
  const navigate = useNavigate();
  const { usuario, showNotification } = useAppStore();
  const [proximaConsulta, setProximaConsulta] = useState<Atendimento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProximaConsulta();
  }, []);

  const loadProximaConsulta = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const atendimentos = await consultarAtendimentos('agendado');
      
      // Encontrar a próxima consulta (mais próxima no futuro)
      const agendados = atendimentos
        .filter(a => a.status === 'Agendado')
        .filter(a => {
          const dataConsulta = new Date(`${a.data}T${a.hora}`);
          return isAfter(dataConsulta, new Date());
        })
        .sort((a, b) => {
          const dataA = new Date(`${a.data}T${a.hora}`);
          const dataB = new Date(`${b.data}T${b.hora}`);
          return dataA.getTime() - dataB.getTime();
        });
      
      setProximaConsulta(agendados[0] || null);
    } catch (err) {
      setError('Erro ao carregar próxima consulta');
      console.error('Erro ao carregar próxima consulta:', err);
    } finally {
      setLoading(false);
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
      <AppHeader 
        title={usuario ? `Olá, ${usuario.nome.split(' ')[0]}!` : "Saúde Cidadão"}
        showNotifications 
        onNotifications={() => showNotification('Sem notificações no momento', 'info')}
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
            <Card className="p-4 bg-primary/5 border-primary/20 shadow-sm">
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
              <h3 className="font-medium mb-2">Nenhuma consulta agendada</h3>
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
                    <div className="p-2 rounded-full bg-accent/10">
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