import { ArrowLeft, Menu, Bell } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

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
  return (
    <header className={cn(
      "sticky top-0 z-40 w-full bg-primary text-primary-foreground shadow-primary",
      "border-b border-primary/20",
      className
    )}>
      <div className="max-w-md mx-auto">
        <div className="flex h-14 items-center px-4">
          {/* Left side */}
          <div className="flex items-center">
            {showBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="mr-2 h-9 w-9 p-0 text-primary-foreground hover:bg-primary-foreground/10"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Voltar</span>
              </Button>
            )}
            
            {showMenu && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMenu}
                className="mr-2 h-9 w-9 p-0 text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            )}
          </div>

          {/* Center - Title */}
          <div className="flex-1 min-w-0">
            <div>
              <h1 className="text-lg font-semibold truncate text-primary-foreground">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-primary-foreground/80 truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-2">
            {showNotifications && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onNotifications}
                className="h-9 w-9 p-0 text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notificações</span>
              </Button>
            )}
            
            {actions}
          </div>
        </div>
      </div>
    </header>
  );
}