import { ArrowLeft, Menu, Bell, User } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
interface AppHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  showMenu?: boolean;
  onMenu?: () => void;
  showNotifications?: boolean;
  onNotifications?: () => void;
  actions?: React.ReactNode;
  className?: string;
}
export function AppHeader({
  title,
  subtitle,
  showBack = false,
  onBack,
  showMenu = false,
  onMenu,
  showNotifications = false,
  onNotifications,
  actions,
  className
}: AppHeaderProps) {
  const {
    usuario
  } = useAppStore();
  return <header className={cn("sticky top-0 z-40 w-full bg-background", className)}>
      <div className="max-w-md mx-auto p-4 px-0 py-0">
        <div className="flex h-24 items-center px-6 bg-primary rounded-b-2xl shadow-lg">
          {/* Avatar */}
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
              <User className="h-6 w-6 text-white" />
            </div>
          </div>

          {/* Welcome Message */}
          <div className="flex-1 min-w-0">
            <div className="text-white">
              <p className="text-sm font-medium opacity-90">Seja Bem Vindo(a)</p>
              <h1 className="text-lg font-semibold truncate">
                {usuario?.nome || 'Usuário'}
              </h1>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-2">
            {showBack && <Button variant="ghost" size="sm" onClick={onBack} className="h-9 w-9 p-0 text-white hover:bg-white/10">
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Voltar</span>
              </Button>}
            
            {showMenu && <Button variant="ghost" size="sm" onClick={onMenu} className="h-9 w-9 p-0 text-white hover:bg-white/10">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>}
              
            {showNotifications && <Button variant="ghost" size="sm" onClick={onNotifications} className="h-9 w-9 p-0 text-white hover:bg-white/10">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notificações</span>
              </Button>}
              
            
            
            {actions}
          </div>
        </div>
      </div>
    </header>;
}