import { useState, useEffect } from "react";
import { AppHeader } from "@/components/ui/app-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Bell, Calendar, Heart, AlertCircle, CheckCircle, Clock, Trash2 } from "lucide-react";

interface Notificacao {
  id: string;
  titulo: string;
  descricao: string;
  tipo: 'agendamento' | 'saude' | 'sistema' | 'lembrete';
  lida: boolean;
  data: string;
  hora: string;
}

// Mock data - apenas lembretes de consultas agendadas
const notificacoesMock: Notificacao[] = [
  {
    id: '1',
    titulo: 'Consulta agendada para amanhã',
    descricao: 'Lembrete: você tem uma consulta médica agendada para amanhã às 14:00 na UBS Centro.',
    tipo: 'agendamento',
    lida: false,
    data: '2025-09-10',
    hora: '09:00'
  },
  {
    id: '2',
    titulo: 'Resultado de exame disponível',
    descricao: 'O resultado do seu exame de sangue já está disponível. Acesse em "Minha Saúde" para visualizar.',
    tipo: 'saude',
    lida: false,
    data: '2025-09-09',
    hora: '15:30'
  },
  {
    id: '3',
    titulo: 'Lembrete: consulta hoje às 15:00',
    descricao: 'Não se esqueça da sua consulta com Dr. João Silva hoje às 15:00 na UBS Sul.',
    tipo: 'agendamento',
    lida: true,
    data: '2025-09-09',
    hora: '13:45'
  },
  {
    id: '4',
    titulo: 'Sistema atualizado',
    descricao: 'O aplicativo foi atualizado com novas funcionalidades. Confira as novidades!',
    tipo: 'sistema',
    lida: true,
    data: '2025-09-08',
    hora: '10:00'
  },
  {
    id: '5',
    titulo: 'Consulta reagendada',
    descricao: 'Sua consulta foi reagendada para sexta-feira às 10:00. Verifique os detalhes em "Meus Agendamentos".',
    tipo: 'agendamento',
    lida: false,
    data: '2025-09-07',
    hora: '16:30'
  }
];

const getIconByType = (tipo: string) => {
  switch (tipo) {
    case 'agendamento':
      return Calendar;
    case 'saude':
      return Heart;
    case 'lembrete':
      return Clock;
    case 'sistema':
      return Bell;
    default:
      return Bell;
  }
};

const getVariantByType = (tipo: string) => {
  switch (tipo) {
    case 'agendamento':
      return 'default';
    case 'saude':
      return 'destructive';
    case 'lembrete':
      return 'secondary';
    case 'sistema':
      return 'outline';
    default:
      return 'default';
  }
};

const formatarTempo = (data: string, hora: string) => {
  try {
    const dataNotificacao = new Date(`${data}T${hora}`);
    const agora = new Date();
    const diffMs = agora.getTime() - dataNotificacao.getTime();
    const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDias = Math.floor(diffHoras / 24);

    if (diffHoras < 1) {
      const diffMinutos = Math.floor(diffMs / (1000 * 60));
      return diffMinutos < 1 ? 'Agora mesmo' : `${diffMinutos}m atrás`;
    } else if (diffHoras < 24) {
      return `${diffHoras}h atrás`;
    } else if (diffDias < 7) {
      return `${diffDias}d atrás`;
    } else {
      return dataNotificacao.toLocaleDateString('pt-BR');
    }
  } catch {
    return data;
  }
};

export default function Notificacoes() {
  const navigate = useNavigate();
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>(notificacoesMock);
  const [filtroLidas, setFiltroLidas] = useState<'todas' | 'nao-lidas'>('todas');

  const notificacoesFiltradas = notificacoes.filter(notif => 
    filtroLidas === 'todas' || !notif.lida
  );

  const naoLidas = notificacoes.filter(n => !n.lida).length;

  const marcarComoLida = (id: string) => {
    setNotificacoes(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, lida: true } : notif
      )
    );
  };

  const marcarTodasComoLidas = () => {
    setNotificacoes(prev => 
      prev.map(notif => ({ ...notif, lida: true }))
    );
  };

  const removerNotificacao = (id: string) => {
    setNotificacoes(prev => prev.filter(notif => notif.id !== id));
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader 
        title="Notificações" 
        showBack 
        onBack={() => navigate('/inicio')}
      />

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Header com resumo */}
        <div className="bg-primary/5 rounded-lg p-4">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Notificações</h2>
                <p className="text-sm text-muted-foreground">
                  {naoLidas} não lida{naoLidas !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            {naoLidas > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={marcarTodasComoLidas}
                className="self-start"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Marcar todas como lidas
              </Button>
            )}
          </div>
        </div>

        {/* Filtros */}
        <div className="flex gap-2">
          <Button
            variant={filtroLidas === 'todas' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFiltroLidas('todas')}
          >
            Todas ({notificacoes.length})
          </Button>
          <Button
            variant={filtroLidas === 'nao-lidas' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFiltroLidas('nao-lidas')}
          >
            Não lidas ({naoLidas})
          </Button>
        </div>

        {/* Lista de notificações */}
        <div className="space-y-3">
          {notificacoesFiltradas.length === 0 ? (
            <Card className="p-6 text-center">
              <Bell className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
              <h3 className="font-medium mb-2">
                {filtroLidas === 'nao-lidas' ? 'Nenhuma notificação não lida' : 'Nenhuma notificação'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {filtroLidas === 'nao-lidas' 
                  ? 'Você está em dia com suas notificações!'
                  : 'Você ainda não possui notificações.'
                }
              </p>
            </Card>
          ) : (
            notificacoesFiltradas.map((notificacao) => {
              const IconComponent = getIconByType(notificacao.tipo);
              
              return (
                <Card 
                  key={notificacao.id} 
                  className={`p-4 cursor-pointer transition-smooth hover:shadow-medium ${
                    !notificacao.lida ? 'border-primary/50 bg-primary/5' : ''
                  }`}
                  onClick={() => marcarComoLida(notificacao.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${
                      notificacao.tipo === 'agendamento' ? 'bg-primary/10 text-primary' :
                      notificacao.tipo === 'saude' ? 'bg-destructive/10 text-destructive' :
                      'bg-muted text-muted-foreground'
                    } shrink-0`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className={`font-semibold text-sm ${
                          !notificacao.lida ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {notificacao.titulo}
                        </h3>
                        {!notificacao.lida && (
                          <div className="w-2 h-2 bg-primary rounded-full shrink-0 mt-1"></div>
                        )}
                      </div>
                      
                      <p className={`text-sm ${
                        !notificacao.lida ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {notificacao.descricao}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge variant={getVariantByType(notificacao.tipo)} className="text-xs">
                            {notificacao.tipo === 'agendamento' ? 'Consulta' :
                             notificacao.tipo === 'saude' ? 'Saúde' : 'Sistema'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatarTempo(notificacao.data, notificacao.hora)}
                          </span>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            removerNotificacao(notificacao.id);
                          }}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}