import { useState, useEffect, useRef } from "react";
import { ArrowLeft, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AppHeader } from "@/components/ui/app-header";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";
import QRCode from "qrcode";
const CartaoSus = () => {
  const navigate = useNavigate();
  const { usuario } = useAppStore();
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const cartaoRef = useRef<HTMLDivElement>(null);
  
  // Se não houver usuário ou CNS, mostrar mensagem
  if (!usuario || !usuario.cns) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-subtle">
        {/* Header */}
        <div className="flex items-center p-4 bg-primary text-primary-foreground">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-primary-foreground hover:bg-primary-hover">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold ml-2">Cartão SUS Virtual</h1>
        </div>

        {/* Conteúdo de CNS não registrado */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-sm mx-auto text-center">
            <Card className="p-8">
              <div className="space-y-6">
                <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                  <CreditCard className="w-8 h-8 text-muted-foreground" />
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-foreground">
                    Cartão Nacional do SUS não registrado
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Para visualizar seu cartão virtual, é necessário cadastrar o número do seu CNS (Cartão Nacional do SUS) no seu perfil.
                  </p>
                </div>

                <div className="space-y-3">
                  <Button 
                    onClick={() => navigate('/perfil')} 
                    className="w-full"
                  >
                    Ir para o Perfil
                  </Button>
                  
                  <Button 
                    onClick={() => navigate('/inicio')} 
                    variant="outline"
                    className="w-full"
                  >
                    Voltar ao Início
                  </Button>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  <p className="font-medium mb-1">Como obter o CNS:</p>
                  <p>Procure uma unidade básica de saúde próxima com um documento oficial com foto.</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }
  useEffect(() => {
    if (!usuario?.cns) return;
    
    // Gerar QR Code com os dados do cartão SUS
    const dadosCartao = {
      nome: usuario.nome,
      cpf: usuario.cpf,
      cns: usuario.cns,
      dataNascimento: usuario.dataNascimento
    };
    QRCode.toDataURL(JSON.stringify(dadosCartao), {
      width: 200,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF"
      }
    }).then(url => {
      setQrCodeUrl(url);
    }).catch(err => {
      console.error("Erro ao gerar QR Code:", err);
    });
  }, [usuario]);
  return <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <AppHeader 
        title="Cartão SUS Virtual" 
        showBack 
        onBack={() => navigate(-1)} 
      />

      {/* Conteúdo */}
      <div className="flex-1 p-6 px-[2px]">
        <div className="max-w-sm mx-auto px-[12px] py-px">
          {/* Card do Cartão SUS */}
          <Card ref={cartaoRef} className="bg-gradient-sus text-white mb-6">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-bold">CARTÃO SUS</h2>
                  <p className="text-sm opacity-90">Sistema Único de Saúde</p>
                </div>
                <div className="text-right">
                  <div className="w-12 h-8 bg-primary-foreground rounded flex items-center justify-center">
                    <span className="text-green-600 font-bold text-xs">SUS</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs opacity-75">NOME DO USUÁRIO</p>
                  <p className="font-semibold text-sm">{usuario.nome}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs opacity-75">CPF</p>
                    <p className="font-semibold text-sm">{usuario.cpf}</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-75">DATA NASC.</p>
                    <p className="font-semibold text-sm">{new Date(usuario.dataNascimento).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs opacity-75">NÚMERO DO CARTÃO SUS</p>
                  <p className="font-bold text-lg tracking-wider">{usuario.cns}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* QR Code */}
          {qrCodeUrl && <Card className="mb-6">
              
            </Card>}


          {/* Informações adicionais */}
          <div className="mt-6 p-4 bg-card rounded-lg border">
            <h4 className="font-semibold mb-2 text-sm">Informações importantes:</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Este cartão tem validade em todo território nacional</li>
              <li>• Mantenha seus dados sempre atualizados</li>
              <li>• Em caso de perda, procure uma unidade de saúde</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Espaçamento para barra de navegação */}
      <div className="h-20"></div>
    </div>;
};
export default CartaoSus;