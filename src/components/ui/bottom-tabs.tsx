import { Home, Grid3X3, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";

interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  path: string;
}

const tabs: Tab[] = [
  {
    id: 'inicio',
    label: 'Início',
    icon: Home,
    path: '/'
  },
  {
    id: 'funcionalidades',
    label: 'Serviços',
    icon: Grid3X3,
    path: '/funcionalidades'
  },
  {
    id: 'perfil',
    label: 'Perfil',
    icon: User,
    path: '/perfil'
  }
];

export function BottomTabs() {
  const setActiveTab = useAppStore((state) => state.setActiveTab);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 gradient-primary border-t border-primary/20 safe-bottom">
      <div className="max-w-md mx-auto">
        <div className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            
            return (
              <NavLink
                key={tab.id}
                to={tab.path}
                onClick={() => setActiveTab(tab.id as any)}
                className={({ isActive }) =>
                  cn(
                    "flex-1 flex flex-col items-center justify-center py-2 px-1 min-h-touch transition-smooth",
                    "hover:bg-primary-foreground/10 active:scale-95",
                    isActive
                      ? "text-primary-foreground"
                      : "text-primary-foreground/70 hover:text-primary-foreground"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon 
                      className={cn(
                        "h-6 w-6 mb-1 transition-smooth",
                        isActive && "scale-110"
                      )} 
                    />
                    <span className={cn(
                      "text-xs font-medium transition-smooth",
                      isActive && "text-primary-foreground"
                    )}>
                      {tab.label}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
}