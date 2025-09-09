import { useState, useEffect } from "react";
import { Bell, X } from "lucide-react";
import { Button } from "./button";
import { Card } from "./card";
import { Badge } from "./badge";
import { cn } from "@/lib/utils";

interface NotificationItem {
  id: string;
  titulo: string;
  descricao: string;
  tipo: 'success' | 'error' | 'warning' | 'info';
  duracao?: number; // em ms, padrão 5000
}

interface NotificationContainerProps {
  notifications: NotificationItem[];
  onRemove: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center';
}

const getVariantByType = (tipo: string) => {
  switch (tipo) {
    case 'success':
      return 'default';
    case 'error':
      return 'destructive';
    case 'warning':
      return 'secondary';
    case 'info':
      return 'outline';
    default:
      return 'default';
  }
};

const getBgColorByType = (tipo: string) => {
  switch (tipo) {
    case 'success':
      return 'bg-success/10 border-success/20';
    case 'error':
      return 'bg-destructive/10 border-destructive/20';
    case 'warning':
      return 'bg-warning/10 border-warning/20';
    case 'info':
      return 'bg-primary/10 border-primary/20';
    default:
      return 'bg-muted/10 border-muted/20';
  }
};

export function NotificationContainer({ 
  notifications, 
  onRemove, 
  position = 'top-right' 
}: NotificationContainerProps) {
  const [visibleNotifications, setVisibleNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    setVisibleNotifications(notifications);

    // Auto-remove notifications after their duration
    notifications.forEach((notification) => {
      const duration = notification.duracao || 5000;
      const timer = setTimeout(() => {
        handleRemove(notification.id);
      }, duration);

      return () => clearTimeout(timer);
    });
  }, [notifications]);

  const handleRemove = (id: string) => {
    setVisibleNotifications(prev => prev.filter(n => n.id !== id));
    setTimeout(() => onRemove(id), 300); // Allow animation to complete
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      default:
        return 'top-4 right-4';
    }
  };

  if (visibleNotifications.length === 0) {
    return null;
  }

  return (
    <div className={cn(
      "fixed z-50 space-y-2 max-w-sm w-full",
      getPositionClasses()
    )}>
      {visibleNotifications.map((notification, index) => (
        <Card 
          key={notification.id}
          className={cn(
            "p-4 shadow-lg animate-in slide-in-from-right-full duration-300",
            getBgColorByType(notification.tipo)
          )}
          style={{
            animationDelay: `${index * 100}ms`
          }}
        >
          <div className="flex items-start space-x-3">
            <Bell className={cn(
              "h-5 w-5 shrink-0 mt-0.5",
              notification.tipo === 'success' && "text-success",
              notification.tipo === 'error' && "text-destructive", 
              notification.tipo === 'warning' && "text-warning",
              notification.tipo === 'info' && "text-primary"
            )} />
            
            <div className="flex-1 min-w-0 space-y-1">
              <h4 className="text-sm font-semibold text-card-foreground">
                {notification.titulo}
              </h4>
              <p className="text-sm text-muted-foreground">
                {notification.descricao}
              </p>
              <div className="flex items-center justify-between mt-2">
                <Badge variant={getVariantByType(notification.tipo)} className="text-xs">
                  {notification.tipo === 'success' ? 'Sucesso' :
                   notification.tipo === 'error' ? 'Erro' :
                   notification.tipo === 'warning' ? 'Aviso' : 'Info'}
                </Badge>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemove(notification.id)}
              className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}