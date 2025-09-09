import { AppHeader } from "@/components/ui/app-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  AlertTriangle,
  Plus,
  Check,
  X,
  Trash2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAppStore } from "@/store/useAppStore";
import { useToast } from "@/hooks/use-toast";

export default function Alergias() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { usuario } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [alergias, setAlergias] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [novaAlergia, setNovaAlergia] = useState("");
  const [editingAlergias, setEditingAlergias] = useState<string[]>([]);

  useEffect(() => {
    if (usuario?.id) {
      fetchAlergias();
    }
  }, [usuario]);

  const fetchAlergias = async () => {
    try {
      const { data, error } = await supabase
        .from('medicoes')
        .select('alergias')
        .eq('usuario_id', usuario?.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching alergias:', error);
        return;
      }

      if (data?.alergias) {
        // Split alergias by comma and filter empty strings
        const alergiasArray = data.alergias.split(',').map(a => a.trim()).filter(a => a);
        setAlergias(alergiasArray);
        setEditingAlergias(alergiasArray);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const alergiasString = editingAlergias.filter(a => a.trim()).join(', ');
      
      const dataToSave = {
        usuario_id: usuario?.id,
        alergias: alergiasString || null
      };

      // Check if medicoes record exists
      const { data: existingMedicoes } = await supabase
        .from('medicoes')
        .select('id')
        .eq('usuario_id', usuario?.id)
        .maybeSingle();

      if (existingMedicoes) {
        // Update existing record
        const { error } = await supabase
          .from('medicoes')
          .update(dataToSave)
          .eq('usuario_id', usuario?.id);

        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('medicoes')
          .insert([dataToSave]);

        if (error) throw error;
      }

      setAlergias(editingAlergias);
      toast({
        title: "Alergias salvas com sucesso!",
        description: "Suas informações foram atualizadas.",
      });

      setIsEditing(false);
      setNovaAlergia("");
    } catch (error) {
      console.error('Error saving alergias:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as alergias. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingAlergias([...alergias]);
    setNovaAlergia("");
  };

  const handleAddAlergia = () => {
    if (novaAlergia.trim()) {
      setEditingAlergias([...editingAlergias, novaAlergia.trim()]);
      setNovaAlergia("");
    }
  };

  const handleRemoveAlergia = (index: number) => {
    const newAlergias = editingAlergias.filter((_, i) => i !== index);
    setEditingAlergias(newAlergias);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader
          title="Alergias"
          showBack
          onBack={() => navigate("/minha-saude")}
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
        title="Alergias"
        showBack
        onBack={() => navigate("/minha-saude")}
        className="bg-primary"
      />

      <div className="max-w-md mx-auto p-4">
        <Card className="bg-card p-6 space-y-6">
          {/* Header Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Suas Alergias</h1>
                <p className="text-sm text-muted-foreground">Gerenciar alergias</p>
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
              Mantenha sua lista de alergias atualizada para um atendimento mais seguro e personalizado.
            </p>
          </div>

          {/* Add New Allergy Section - Only in editing mode */}
          {isEditing && (
            <div className="space-y-3">
              <h3 className="font-medium text-foreground">Adicionar Nova Alergia</h3>
              <div className="flex space-x-2">
                <Input
                  value={novaAlergia}
                  onChange={(e) => setNovaAlergia(e.target.value)}
                  placeholder="Ex: Penicilina, Amendoim, Pólen..."
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddAlergia()}
                />
                <Button 
                  size="sm" 
                  onClick={handleAddAlergia}
                  disabled={!novaAlergia.trim()}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Alergias List Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Lista de Alergias</h2>
              <span className="text-sm text-muted-foreground">
                {editingAlergias.length} {editingAlergias.length === 1 ? 'registro' : 'registros'}
              </span>
            </div>

            {/* Alergias List */}
            <div className="space-y-3">
              {editingAlergias.length === 0 ? (
                <div className="text-center py-8 space-y-3">
                  <div className="p-3 rounded-full bg-muted w-fit mx-auto">
                    <AlertTriangle className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Nenhuma alergia registrada</p>
                    <p className="text-xs text-muted-foreground">
                      {isEditing ? "Use o campo acima para adicionar uma alergia" : "Toque em Editar para adicionar alergias"}
                    </p>
                  </div>
                </div>
              ) : (
                editingAlergias.map((alergia, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-900/30">
                        <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      </div>
                      <span className="text-sm text-foreground font-medium">{alergia}</span>
                    </div>
                    {isEditing && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveAlergia(index)}
                        className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}