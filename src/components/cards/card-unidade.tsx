import { MapPin, Phone, Clock, Navigation } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Unidade } from "@/lib/types";

interface CardUnidadeProps {
  unidade: Unidade;
  onCall?: (telefone: string) => void;
  onNavigate?: (geo: { lat: number; lng: number }) => void;
  className?: string;
}

export function CardUnidade({ unidade, onCall, onNavigate, className }: CardUnidadeProps) {
  const handleCall = () => {
    if (onCall) {
      onCall(unidade.telefone);
    } else {
      window.open(`tel:${unidade.telefone.replace(/\D/g, '')}`);
    }
  };

  const handleNavigate = () => {
    if (unidade.geo) {
      if (onNavigate) {
        onNavigate(unidade.geo);
      } else {
        window.open(`https://maps.google.com/?q=${unidade.geo.lat},${unidade.geo.lng}`);
      }
    }
  };

  return (
    <Card className={`p-4 transition-smooth hover:shadow-medium ${className}`}>
      <div className="space-y-3">
        {/* Header */}
        <div>
          <h3 className="font-semibold text-card-foreground line-clamp-2">
            {unidade.nome}
          </h3>
          {unidade.tipo && (
            <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
              {unidade.tipo}
            </span>
          )}
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-start">
            <MapPin className="h-4 w-4 mr-2 mt-0.5 shrink-0" />
            <span className="line-clamp-2">{unidade.endereco}</span>
          </div>
          
          <div className="flex items-center">
            <Phone className="h-4 w-4 mr-2 shrink-0" />
            <span>{unidade.telefone}</span>
          </div>
          
          {unidade.horario && (
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 shrink-0" />
              <span className="line-clamp-1">{unidade.horario}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleCall}
            className="flex-1"
          >
            <Phone className="h-4 w-4 mr-1" />
            Ligar
          </Button>
          
          {unidade.geo && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleNavigate}
              className="flex-1"
            >
              <Navigation className="h-4 w-4 mr-1" />
              Rota
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}