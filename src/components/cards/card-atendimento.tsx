import { Calendar, Clock, MapPin, User, Star } from "lucide-react";
import { Card } from "../ui/card";
import { StatusBadge } from "../ui/status-badge";
import { Button } from "../ui/button";
import { Atendimento } from "@/lib/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CardAtendimentoProps {
  atendimento: Atendimento;
  onAvaliar?: (id: string) => void;
  className?: string;
}

export function CardAtendimento({ atendimento, onAvaliar, className }: CardAtendimentoProps) {
  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'agendado': return 'agendado';
      case 'realizado': return 'realizado';
      case 'cancelado': return 'cancelado';
      default: return 'neutral';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  return (
    <Card className={`p-4 transition-smooth hover:shadow-medium ${className}`}>
      <div className="space-y-3">
        {/* Header with status */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-card-foreground line-clamp-1">
              {atendimento.tipo}
            </h3>
            <StatusBadge variant={getStatusVariant(atendimento.status)}>
              {atendimento.status}
            </StatusBadge>
          </div>
          
          {atendimento.status === 'Concluído' && (
            <Button
              size="sm"
              variant={atendimento.avaliacao ? "secondary" : "outline"}
              onClick={() => onAvaliar?.(atendimento.id)}
              className={`ml-2 shrink-0 ${atendimento.avaliacao ? 'text-muted-foreground' : ''}`}
              disabled={!!atendimento.avaliacao}
            >
              <Star className="h-4 w-4 mr-1" />
              {atendimento.avaliacao ? 'Avaliado' : 'Avaliar'}
            </Button>
          )}
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 shrink-0" />
            <span>{formatDate(atendimento.data)}</span>
            <Clock className="h-4 w-4 mx-2 shrink-0" />
            <span>{atendimento.hora}</span>
          </div>
          
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2 shrink-0" />
            <span className="truncate">{atendimento.profissional}</span>
          </div>
          
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 shrink-0" />
            <span className="truncate">{atendimento.unidade}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}