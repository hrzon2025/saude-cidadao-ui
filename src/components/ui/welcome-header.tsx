import { User, Bell } from "lucide-react";
import { Button } from "./button";
import { useAppStore } from "@/store/useAppStore";

interface WelcomeHeaderProps {
  onNotifications?: () => void;
}

export function WelcomeHeader({ onNotifications }: WelcomeHeaderProps) {
  const { usuario } = useAppStore();
  
  return (
    <header className="sticky top-0 z-40 w-full bg-primary text-primary-foreground">
      <div className="max-w-md mx-auto">
        <div className="flex h-24 items-center justify-between px-6 rounded-b-3xl bg-primary">
          {/* Left side - User info */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary-foreground/20 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm text-primary-foreground/80">
                Seja Bem Vindo(a)
              </p>
              <h1 className="text-lg font-semibold text-primary-foreground">
                {usuario?.nome || 'Usuário'}
              </h1>
            </div>
          </div>

          {/* Right side - Notifications */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onNotifications} 
            className="h-12 w-12 p-0 text-primary-foreground hover:bg-primary-foreground/10 rounded-full"
          >
            <Bell className="h-6 w-6" />
            <span className="sr-only">Notificações</span>
          </Button>
        </div>
      </div>
    </header>
  );
}