import { AppHeader } from "@/components/ui/app-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { 
  Heart, 
  Droplet, 
  Activity, 
  Scale, 
  Ruler, 
  Info,
  Plus,
  Check,
  X 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function MinhaSaude() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({
    "Pressão Arterial": "120/80 mmHg",
    "Glicemia": "95 mg/dL", 
    "Oxigenação do Sangue": "98%",
    "Peso": "72 kg",
    "Altura": "1,75 m",
    "Alergias": "Nenhuma registrada"
  });

  const medicoes = [
    {
      icon: Heart,
      title: "Pressão Arterial",
      value: editValues["Pressão Arterial"],
      status: "(normal)",
      color: "text-red-500",
      placeholder: "120/80 mmHg"
    },
    {
      icon: Droplet,
      title: "Glicemia",
      value: editValues["Glicemia"],
      status: "(em jejum)",
      color: "text-blue-500",
      placeholder: "95 mg/dL"
    },
    {
      icon: Activity,
      title: "Oxigenação do Sangue",
      value: editValues["Oxigenação do Sangue"],
      status: "(normal)",
      color: "text-green-500",
      placeholder: "98%"
    },
    {
      icon: Scale,
      title: "Peso",
      value: editValues["Peso"],
      status: "",
      color: "text-orange-500",
      placeholder: "72 kg"
    },
    {
      icon: Ruler,
      title: "Altura",
      value: editValues["Altura"],
      status: "",
      color: "text-purple-500",
      placeholder: "1,75 m"
    },
    {
      icon: Info,
      title: "Alergias",
      value: editValues["Alergias"],
      status: "",
      color: "text-blue-600",
      placeholder: "Nenhuma registrada"
    }
  ];

  const handleInputChange = (title: string, value: string) => {
    setEditValues(prev => ({
      ...prev,
      [title]: value
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset values if needed
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        title="Minha Saúde"
        showBack
        onBack={() => navigate("/")}
        className="bg-primary"
      />

      <div className="max-w-md mx-auto p-4">
        <Card className="bg-card p-6 space-y-6">
          {/* Header Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Medições</h1>
                <p className="text-sm text-muted-foreground">Seu perfil</p>
              </div>
              {isEditing ? (
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={handleCancel}>
                    <X className="w-4 h-4" />
                  </Button>
                  <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={handleSave}>
                    <Check className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={() => setIsEditing(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              )}
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

            {/* Medições List */}
            <div className="space-y-0">
              {medicoes.map((medicao, index) => {
                const IconComponent = medicao.icon;
                
                return (
                  <div key={index}>
                    <div className="flex items-center justify-between py-4">
                      <div className="flex items-center space-x-3 flex-1">
                        <div className={`p-2 rounded-full bg-muted ${medicao.color}`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground mb-2">
                            {medicao.title}
                          </h3>
                          {isEditing ? (
                            <Input
                              value={medicao.value}
                              onChange={(e) => handleInputChange(medicao.title, e.target.value)}
                              placeholder={medicao.placeholder}
                              className="text-sm"
                            />
                          ) : (
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
                          )}
                        </div>
                      </div>
                    </div>
                    {index < medicoes.length - 1 && (
                      <Separator className="bg-border/50" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}