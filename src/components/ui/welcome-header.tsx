import { User, Bell } from "lucide-react";
import { Button } from "./button";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { useAppStore } from "@/store/useAppStore";

interface WelcomeHeaderProps {
  onNotifications?: () => void;
}

export function WelcomeHeader({ onNotifications }: WelcomeHeaderProps) {
  const { usuario } = useAppStore();
  
  return (
    <header className="sticky top-0 z-40 w-full bg-primary text-primary-foreground">
      <div className="max-w-md mx-auto">
        <div className="flex h-24 items-center justify-between px-6 rounded-b-[2.5rem] bg-primary">
          {/* Left side - User info */}
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12 border-2 border-primary-foreground/20">
              <AvatarImage src={usuario?.avatarUrl} alt={usuario?.nome || 'Usuário'} />
              <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground text-sm">
                {usuario?.nome ? usuario.nome.split(' ').map(n => n[0]).join('').slice(0, 2) : <User className="h-6 w-6" />}
              </AvatarFallback>
            </Avatar>
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