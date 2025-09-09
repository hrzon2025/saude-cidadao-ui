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
  X,
  ChevronRight 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAppStore } from "@/store/useAppStore";
import { useToast } from "@/hooks/use-toast";

export default function MinhaSaude() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { usuario } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [medicoes, setMedicoes] = useState<any>(null);
  const [alergias, setAlergias] = useState<any[]>([]);
  const [editValues, setEditValues] = useState({
    pressao_arterial: "N/A",
    glicemia: "N/A", 
    oxigenacao_sangue: "N/A",
    peso: "N/A",
    altura: "N/A",
    alergias: "N/A"
  });

  useEffect(() => {
    if (usuario?.id) {
      Promise.all([fetchMedicoes(), fetchAlergias()]);
    }
  }, [usuario]);

  const fetchAlergias = async () => {
    try {
      const { data, error } = await supabase
        .from('alergias')
        .select('*')
        .eq('usuario_id', usuario?.id);

      if (error) {
        console.error('Error fetching alergias:', error);
        return;
      }

      setAlergias(data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchMedicoes = async () => {
    try {
      const { data, error } = await supabase
        .from('medicoes')
        .select('*')
        .eq('usuario_id', usuario?.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching medicoes:', error);
        return;
      }

      if (data) {
        setMedicoes(data);
        setEditValues({
          pressao_arterial: data.pressao_arterial || "N/A",
          glicemia: data.glicemia || "N/A",
          oxigenacao_sangue: data.oxigenacao_sangue || "N/A",
          peso: data.peso || "N/A",
          altura: data.altura || "N/A",
          alergias: data.alergias || "N/A"
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const medicoesConfig = [
    {
      icon: Heart,
      title: "Pressão Arterial",
      key: "pressao_arterial",
      value: editValues.pressao_arterial,
      status: editValues.pressao_arterial !== "N/A" ? "(normal)" : "",
      color: "text-destructive",
      placeholder: "120/80"
    },
    {
      icon: Droplet,
      title: "Glicemia",
      key: "glicemia",
      value: editValues.glicemia,
      status: editValues.glicemia !== "N/A" ? "(em jejum)" : "",
      color: "text-blue-500",
      placeholder: "95 mg/dL"
    },
    {
      icon: Activity,
      title: "Oxigenação do Sangue",
      key: "oxigenacao_sangue",
      value: editValues.oxigenacao_sangue,
      status: editValues.oxigenacao_sangue !== "N/A" ? "(normal)" : "",
      color: "text-green-500",
      placeholder: "98%"
    },
    {
      icon: Scale,
      title: "Peso",
      key: "peso",
      value: editValues.peso,
      status: "",
      color: "text-warning",
      placeholder: "72 kg"
    },
    {
      icon: Ruler,
      title: "Altura",
      key: "altura",
      value: editValues.altura,
      status: "",
      color: "text-accent",
      placeholder: "175 cm"
    },
    {
      icon: Info,
      title: "Alergias",
      key: "alergias",
      value: alergias.length > 0 ? `${alergias.length} ${alergias.length === 1 ? 'alergia' : 'alergias'}` : "N/A",
      status: "",
      color: "text-primary",
      placeholder: "Nenhuma registrada"
    }
  ];

  const handleInputChange = (key: string, value: string) => {
    setEditValues(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    try {
      const dataToSave = {
        usuario_id: usuario?.id,
        pressao_arterial: editValues.pressao_arterial === "N/A" ? null : editValues.pressao_arterial,
        glicemia: editValues.glicemia === "N/A" ? null : editValues.glicemia,
        oxigenacao_sangue: editValues.oxigenacao_sangue === "N/A" ? null : editValues.oxigenacao_sangue,
        peso: editValues.peso === "N/A" ? null : editValues.peso,
        altura: editValues.altura === "N/A" ? null : editValues.altura,
        alergias: editValues.alergias === "N/A" ? null : editValues.alergias
      };

      if (medicoes) {
        // Update existing record
        const { error } = await supabase
          .from('medicoes')
          .update(dataToSave)
          .eq('id', medicoes.id);

        if (error) throw error;
      } else {
        // Insert new record
        const { data, error } = await supabase
          .from('medicoes')
          .insert([dataToSave])
          .select()
          .single();

        if (error) throw error;
        setMedicoes(data);
      }

      toast({
        title: "Medições salvas com sucesso!",
        description: "Suas informações foram atualizadas.",
      });

      setIsEditing(false);
    } catch (error) {
      console.error('Error saving medicoes:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as medições. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset values to original data
    if (medicoes) {
      setEditValues({
        pressao_arterial: medicoes.pressao_arterial || "N/A",
        glicemia: medicoes.glicemia || "N/A",
        oxigenacao_sangue: medicoes.oxigenacao_sangue || "N/A",
        peso: medicoes.peso || "N/A",
        altura: medicoes.altura || "N/A",
        alergias: medicoes.alergias || "N/A"
      });
    } else {
      setEditValues({
        pressao_arterial: "N/A",
        glicemia: "N/A",
        oxigenacao_sangue: "N/A",
        peso: "N/A",
        altura: "N/A",
        alergias: "N/A"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader
          title="Minha Saúde"
          showBack
          onBack={() => navigate("/inicio")}
          className="bg-primary"
        />
        <div className="max-w-md mx-auto p-4">
          <Card className="bg-card p-6">
            <div className="text-center">Carregando...</div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        title="Minha Saúde"
        showBack
        onBack={() => navigate("/inicio")}
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
              {medicoesConfig.map((medicao, index) => {
                const IconComponent = medicao.icon;
                
                return (
                  <div 
                    key={medicao.key}
                    className={medicao.key === "alergias" && !isEditing ? "cursor-pointer hover:bg-muted/30 rounded-lg transition-colors" : ""}
                    onClick={medicao.key === "alergias" && !isEditing ? () => navigate("/alergias") : undefined}
                  >
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
                              onChange={(e) => handleInputChange(medicao.key, e.target.value)}
                              placeholder={medicao.placeholder}
                              className="text-sm"
                            />
                          ) : (
                            <div className="flex items-center space-x-1">
                              <span className={`text-sm ${medicao.value === "N/A" ? "text-muted-foreground" : "text-foreground"}`}>
                                {medicao.value === "N/A" ? medicao.value : 
                                  medicao.key === "peso" ? `${medicao.value} kg` :
                                  medicao.key === "altura" ? `${medicao.value} cm` :
                                  medicao.key === "pressao_arterial" && medicao.value !== "N/A" ? 
                                    medicao.value.includes('/') ? medicao.value : `${medicao.value}/80` :
                                  medicao.key === "alergias" ? medicao.value :
                                  medicao.value
                                }
                              </span>
                              {medicao.status && medicao.value !== "N/A" && (
                                <span className="text-sm text-muted-foreground">
                                  {medicao.status}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        {medicao.key === "alergias" && !isEditing && (
                          <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                    {index < medicoesConfig.length - 1 && (
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