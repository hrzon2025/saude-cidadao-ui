import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/ui/app-header";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useUsuario } from "@/store/useAppStore";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MessageSquare, History } from "lucide-react";
export default function Ouvidoria() {
  const navigate = useNavigate();
  const usuario = useUsuario();
  const [assunto, setAssunto] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [isLoadingTickets, setIsLoadingTickets] = useState(false);
  
  const handleEnviar = async () => {
    if (!assunto.trim() || !mensagem.trim()) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    if (!usuario) {
      toast.error("Você precisa estar logado para enviar uma mensagem");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('ouvidoria')
        .insert({
          usuario_id: usuario.id,
          assunto: assunto.trim(),
          mensagem: mensagem.trim()
        });

      if (error) {
        console.error('Erro ao salvar mensagem:', error);
        toast.error("Erro ao enviar mensagem. Tente novamente.");
        return;
      }

      toast.success("Mensagem enviada com sucesso!");
      setAssunto("");
      setMensagem("");
      // Recarregar tickets se estiverem carregados
      if (tickets.length > 0) {
        loadTickets();
      }
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error("Erro inesperado. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadTickets = async () => {
    if (!usuario) return;
    
    setIsLoadingTickets(true);
    try {
      const { data, error } = await supabase
        .from('ouvidoria')
        .select('*')
        .eq('usuario_id', usuario.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar tickets:', error);
        toast.error("Erro ao carregar histórico de tickets");
        return;
      }

      setTickets(data || []);
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error("Erro inesperado ao carregar tickets");
    } finally {
      setIsLoadingTickets(false);
    }
  };
  return (
    <div className="min-h-screen bg-background">
      <AppHeader 
        title="Ouvidoria" 
        showBack={true} 
        onBack={() => navigate(-1)} 
        className="bg-primary text-primary-foreground" 
      />
      
      <div className="px-[12px] pt-[4px] pb-[16px] my-[10px]">
        <Tabs defaultValue="abrir" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="abrir" className="flex items-center gap-2">
              <MessageSquare size={16} />
              Abrir Ticket
            </TabsTrigger>
            <TabsTrigger value="historico" className="flex items-center gap-2" onClick={loadTickets}>
              <History size={16} />
              Ver Tickets
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="abrir" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Entre em Contato</CardTitle>
                <p className="text-muted-foreground">
                  Preencha o formulário abaixo para entrar em contato com nossa equipe de suporte.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-card-foreground">Assunto</label>
                  <Input 
                    placeholder="Digite o assunto do seu contato" 
                    value={assunto} 
                    onChange={e => setAssunto(e.target.value)} 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-card-foreground">Mensagem</label>
                  <Textarea 
                    placeholder="Digite sua mensagem" 
                    value={mensagem} 
                    onChange={e => setMensagem(e.target.value)} 
                    className="min-h-[120px] resize-none" 
                  />
                </div>

                <Button 
                  onClick={handleEnviar} 
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" 
                  size="lg"
                >
                  {isLoading ? "Enviando..." : "Enviar mensagem"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="historico" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Tickets</CardTitle>
                <p className="text-muted-foreground">
                  Visualize todas as suas mensagens enviadas para a ouvidoria.
                </p>
              </CardHeader>
              <CardContent>
                {isLoadingTickets ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Carregando tickets...</p>
                  </div>
                ) : tickets.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Você ainda não enviou nenhuma mensagem.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tickets.map((ticket) => (
                      <Card key={ticket.id} className="border-l-4 border-l-primary">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{ticket.assunto}</CardTitle>
                            <span className="text-sm text-muted-foreground">
                              {format(new Date(ticket.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-card-foreground whitespace-pre-wrap">{ticket.mensagem}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}