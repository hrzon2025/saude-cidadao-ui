import { AppHeader } from "@/components/ui/app-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  AlertTriangle,
  Plus,
  Trash2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAppStore } from "@/store/useAppStore";
import { useToast } from "@/hooks/use-toast";

interface Alergia {
  id: string;
  nome: string;
  descricao?: string;
  gravidade?: 'leve' | 'moderada' | 'grave';
  created_at: string;
}

export default function Alergias() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { usuario } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [alergias, setAlergias] = useState<Alergia[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [novaAlergia, setNovaAlergia] = useState<{ nome: string; descricao: string; gravidade: 'leve' | 'moderada' | 'grave' }>({ 
    nome: "", 
    descricao: "", 
    gravidade: "leve" 
  });

  useEffect(() => {
    if (usuario?.id) {
      fetchAlergias();
    }
  }, [usuario]);

  const fetchAlergias = async () => {
    try {
      const { data, error } = await supabase
        .from('alergias')
        .select('*')
        .eq('usuario_id', usuario?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching alergias:', error);
        return;
      }

      setAlergias(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!novaAlergia.nome.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, informe o nome da alergia.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('alergias')
        .insert([{
          usuario_id: usuario?.id,
          nome: novaAlergia.nome.trim(),
          descricao: novaAlergia.descricao.trim() || null,
          gravidade: novaAlergia.gravidade
        }]);

      if (error) throw error;

      toast({
        title: "Alergia adicionada!",
        description: "A alergia foi registrada com sucesso.",
      });

      setNovaAlergia({ nome: "", descricao: "", gravidade: "leve" });
      fetchAlergias();
    } catch (error) {
      console.error('Error saving alergia:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar a alergia. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleRemoveAlergia = async (id: string) => {
    try {
      const { error } = await supabase
        .from('alergias')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Alergia removida",
        description: "A alergia foi removida com sucesso.",
      });

      fetchAlergias();
    } catch (error) {
      console.error('Error deleting alergia:', error);
      toast({
        title: "Erro ao remover",
        description: "Não foi possível remover a alergia. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const getGravidadeColor = (gravidade?: string) => {
    switch (gravidade) {
      case 'grave':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      case 'moderada':
        return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30';
      default:
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
    }
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
              <Button 
                size="sm" 
                className="bg-primary hover:bg-primary/90" 
                onClick={() => setIsEditing(!isEditing)}
              >
                <Plus className="w-4 h-4 mr-2" />
                {isEditing ? "Cancelar" : "Adicionar"}
              </Button>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Mantenha sua lista de alergias atualizada para um atendimento mais seguro e personalizado.
            </p>
          </div>

          {/* Add New Allergy Section - Only in editing mode */}
          {isEditing && (
            <div className="space-y-3">
              <h3 className="font-medium text-foreground">Adicionar Nova Alergia</h3>
              <div className="space-y-3">
                <Input
                  value={novaAlergia.nome}
                  onChange={(e) => setNovaAlergia(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Nome da alergia (ex: Penicilina, Amendoim...)"
                  className="w-full"
                />
                <Input
                  value={novaAlergia.descricao}
                  onChange={(e) => setNovaAlergia(prev => ({ ...prev, descricao: e.target.value }))}
                  placeholder="Descrição (opcional)"
                  className="w-full"
                />
                <select
                  value={novaAlergia.gravidade}
                  onChange={(e) => setNovaAlergia(prev => ({ ...prev, gravidade: e.target.value as 'leve' | 'moderada' | 'grave' }))}
                  className="w-full p-2 border rounded-md bg-background text-foreground"
                >
                  <option value="leve">Leve</option>
                  <option value="moderada">Moderada</option>
                  <option value="grave">Grave</option>
                </select>
                <Button 
                  onClick={handleSave}
                  disabled={!novaAlergia.nome.trim()}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  Salvar Alergia
                </Button>
              </div>
            </div>
          )}

          {/* Alergias List Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Lista de Alergias</h2>
              <span className="text-sm text-muted-foreground">
                {alergias.length} {alergias.length === 1 ? 'registro' : 'registros'}
              </span>
            </div>

            {/* Alergias List */}
            <div className="space-y-3">
              {alergias.length === 0 ? (
                <div className="text-center py-8 space-y-3">
                  <div className="p-3 rounded-full bg-muted w-fit mx-auto">
                    <AlertTriangle className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Nenhuma alergia registrada</p>
                    <p className="text-xs text-muted-foreground">
                      Toque em Adicionar para registrar uma alergia
                    </p>
                  </div>
                </div>
              ) : (
                alergias.map((alergia) => (
                  <div key={alergia.id} className="flex items-start justify-between p-4 rounded-lg bg-muted/50">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className={`p-2 rounded-full ${getGravidadeColor(alergia.gravidade)}`}>
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium text-foreground">{alergia.nome}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGravidadeColor(alergia.gravidade)}`}>
                            {alergia.gravidade || 'leve'}
                          </span>
                        </div>
                        {alergia.descricao && (
                          <p className="text-xs text-muted-foreground">{alergia.descricao}</p>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveAlergia(alergia.id)}
                      className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
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