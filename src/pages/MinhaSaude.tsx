import { AppHeader } from "@/components/ui/app-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Droplet, 
  Activity, 
  Scale, 
  Ruler, 
  Info,
  Plus 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MinhaSaude() {
  const navigate = useNavigate();

  const medicoes = [
    {
      icon: Heart,
      title: "Pressão Arterial",
      value: "120/80 mmHg",
      status: "(normal)",
      color: "text-red-500"
    },
    {
      icon: Droplet,
      title: "Glicemia",
      value: "95 mg/dL",
      status: "(em jejum)",
      color: "text-blue-500"
    },
    {
      icon: Activity,
      title: "Oxigenação do Sangue",
      value: "98%",
      status: "(normal)",
      color: "text-green-500"
    },
    {
      icon: Scale,
      title: "Peso",
      value: "72 kg",
      status: "",
      color: "text-orange-500"
    },
    {
      icon: Ruler,
      title: "Altura",
      value: "1,75 m",
      status: "",
      color: "text-purple-500"
    },
    {
      icon: Info,
      title: "Alergias",
      value: "Nenhuma registrada",
      status: "",
      color: "text-blue-600"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        title="Minha Saúde"
        showBack
        onBack={() => navigate("/")}
        className="bg-primary"
      />

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Header Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Medições</h1>
              <p className="text-sm text-muted-foreground">Seu perfil</p>
            </div>
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            Ao fazer o registro das medições você nos ajuda a personalizar dicas e informações 
            específicas de Saúde especiais para você.
          </p>
        </div>

        {/* Medições Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Medições de Você</h2>
            <span className="text-sm text-muted-foreground">6 registros</span>
          </div>

          {/* Medições Cards */}
          <div className="space-y-3">
            {medicoes.map((medicao, index) => {
              const IconComponent = medicao.icon;
              
              return (
                <Card 
                  key={index}
                  className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full bg-muted ${medicao.color}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">
                          {medicao.title}
                        </h3>
                        <div className="flex items-center space-x-1">
                          <span className="text-sm text-foreground">
                            {medicao.value}
                          </span>
                          {medicao.status && (
                            <span className="text-sm text-muted-foreground">
                              {medicao.status}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-muted-foreground">
                      <svg 
                        className="w-5 h-5" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M9 5l7 7-7 7" 
                        />
                      </svg>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}