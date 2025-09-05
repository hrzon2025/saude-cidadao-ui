import { useParams, useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/ui/app-header";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

interface Avaliacao2Form {
  remedios: string;
  nps: number;
}

export default function Avaliacao2() {
  const { id } = useParams();
  const navigate = useNavigate();
  const form = useForm<Avaliacao2Form>();
  const [npsValue, setNpsValue] = useState([9]);

  const onSubmit = (data: Avaliacao2Form) => {
    const avaliacaoData = {
      ...data,
      nps: npsValue[0]
    };
    console.log("Avaliação completa enviada:", avaliacaoData);
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
        onBack={() => navigate(`/avaliacao/1/${id}`)}
        className="bg-primary text-primary-foreground"
      />
      
      <div className="p-4">
        <Card className="bg-white">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-6 text-center">
              Qual sua opinião sobre o nosso atendimento
            </h2>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Campo de Remédios */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  Conseguiu retirar o(s) remédio(s) da receita médica? *
                </Label>
                <RadioGroup
                  {...form.register("remedios", { required: true })}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sim-todos" id="sim-todos" />
                    <Label htmlFor="sim-todos" className="text-sm">
                      Sim, retirei todos os remédios
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sim-faltam" id="sim-faltam" />
                    <Label htmlFor="sim-faltam" className="text-sm">
                      Sim, mas ainda faltam remédios
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="nao-consegui" id="nao-consegui" />
                    <Label htmlFor="nao-consegui" className="text-sm">
                      Não consegui retirar nenhum remédio
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="nao-solicitei" id="nao-solicitei" />
                    <Label htmlFor="nao-solicitei" className="text-sm">
                      Ainda não solicitei os remédios
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="nao-utilizei" id="nao-utilizei" />
                    <Label htmlFor="nao-utilizei" className="text-sm">
                      Não utilizei esse serviço
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Campo NPS */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">
                  Com base em sua experiência com nosso serviço de saúde, você nos recomendaria a um amigo ou familiar? *
                </Label>
                <div className="space-y-4">
                  <Slider
                    value={npsValue}
                    onValueChange={setNpsValue}
                    max={10}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between items-center text-xs text-muted-foreground mt-2">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <span 
                        key={num} 
                        className={`${num === npsValue[0] ? 'bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium' : ''}`}
                      >
                        {num}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Não recomendaria</span>
                    <span>Recomendaria totalmente</span>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full">
                  Enviar Avaliação
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}