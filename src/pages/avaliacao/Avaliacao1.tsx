import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/ui/app-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";

interface AvaliacaoForm {
  recepcao: string;
  organizacaoLimpeza: string;
  tempoEspera: string;
  estruturaFisica: string;
  equipeMedica: string;
  equipeEnfermagem: string;
  equipeMultidisciplinar: string;
  equipeLaboratorial: string;
}

const opcoes = [
  { value: "ruim", label: "Ruim" },
  { value: "bom", label: "Bom" },
  { value: "excelente", label: "Excelente" },
  { value: "nao_utilizei", label: "Não utilizei o serviço" }
];

const campos = [
  { name: "recepcao", label: "Recepção" },
  { name: "organizacaoLimpeza", label: "Organização e Limpeza" },
  { name: "tempoEspera", label: "Tempo de espera para atendimento" },
  { name: "estruturaFisica", label: "Estrutura física (Acomodação, iluminação, climatização)" },
  { name: "equipeMedica", label: "Equipe Médica" },
  { name: "equipeEnfermagem", label: "Equipe Enfermagem" },
  { name: "equipeMultidisciplinar", label: "Equipe Multidisciplinar (Assistente Social, Fisioterapeuta, Psicólogo, Nutricionista, Fonoaudiólogo, Dentista, Farmacêutico)" },
  { name: "equipeLaboratorial", label: "Equipe Laboratorial" }
];

export default function Avaliacao1() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const form = useForm<AvaliacaoForm>();

  const onSubmit = (data: AvaliacaoForm) => {
    console.log("Avaliação enviada:", data);
    toast({
      title: "Avaliação enviada com sucesso!",
      description: "Obrigado pelo seu feedback.",
    });
    navigate("/atendimentos");
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        title="Avaliação"
        showBack
        onBack={() => navigate("/atendimentos")}
        className="bg-primary text-primary-foreground"
      />
      
      <div className="p-4">
        <Card className="p-6 bg-card">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Qual sua opinião sobre o nosso atendimento
            </h2>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {campos.map((campo) => (
                <FormField
                  key={campo.name}
                  control={form.control}
                  name={campo.name as keyof AvaliacaoForm}
                  rules={{ required: "Este campo é obrigatório" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-foreground">
                        {campo.label} *
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="flex flex-col gap-3"
                        >
                          {opcoes.map((opcao) => (
                            <div key={opcao.value} className="flex items-center space-x-2">
                              <RadioGroupItem value={opcao.value} id={`${campo.name}-${opcao.value}`} />
                              <Label 
                                htmlFor={`${campo.name}-${opcao.value}`}
                                className="text-sm text-muted-foreground cursor-pointer"
                              >
                                {opcao.label}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              <div className="pt-4">
                <Button type="submit" className="w-full">
                  Enviar Avaliação
                </Button>
              </div>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}