import { AppHeader } from "@/components/ui/app-header";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const menuItems = [
  { title: "Sobre", route: "/sobre-farmacia" },
  { title: "Relação Municipal de Medicamentos", route: "/relacao-medicamentos" },
  { title: "Programa Farmácia Popular", route: "/farmacia-popular" },
  { title: "Componentes Especializados 'Alto Custo'", route: "/componentes-especializados" },
  { title: "Comissão de Farmacologia de São Paulo", route: "/comissao-farmacologia" }
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
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => navigate(item.route)}
            className="w-full bg-card rounded-lg p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow border border-border"
          >
            <span className="text-foreground font-medium text-left flex-1">
              {item.title}
            </span>
            <ChevronRight className="h-5 w-5 text-muted-foreground ml-2 flex-shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}