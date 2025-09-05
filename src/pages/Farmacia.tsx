import { AppHeader } from "@/components/ui/app-header";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Info, Pill, Users, DollarSign, Building } from "lucide-react";

const menuItems = [
  { title: "Sobre", route: "/sobre-farmacia", icon: Info },
  { title: "Relação Municipal de Medicamentos", route: "/relacao-medicamentos", icon: Pill },
  { title: "Programa Farmácia Popular", route: "/farmacia-popular", icon: Users },
  { title: "Componentes Especializados 'Alto Custo'", route: "/componentes-especializados", icon: DollarSign },
  { title: "Comissão de Farmacologia de São Paulo", route: "/comissao-farmacologia", icon: Building }
];

export default function Farmacia() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20">
      <AppHeader 
        title="Assistência Farmacêutica" 
        showBack 
        onBack={() => navigate(-1)} 
      />
      
      <div className="max-w-md mx-auto p-4 space-y-3">
        {menuItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <button
              key={index}
              onClick={() => navigate(item.route)}
              className="w-full bg-card rounded-lg p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow border border-border"
            >
              <div className="flex items-center flex-1">
                <IconComponent className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                <span className="text-foreground font-medium text-left">
                  {item.title}
                </span>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground ml-2 flex-shrink-0" />
            </button>
          );
        })}
      </div>
    </div>
  );
}