import { useState, useEffect } from "react";
import { ArrowLeft, Download, Share, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { getUsuario } from "@/lib/stubs/usuario";
import QRCode from "qrcode";

const CartaoSus = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const usuario = getUsuario();

  useEffect(() => {
    // Gerar QR Code com os dados do cartão SUS
    const dadosCartao = {
      nome: `${usuario.nome} ${usuario.sobrenome}`,
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

  const handleBaixarPdf = () => {
    toast({
      title: "PDF baixado",
      description: "O cartão SUS foi salvo como PDF com sucesso.",
    });
  };

  const handleCompartilhar = () => {
    toast({
      title: "Compartilhamento",
      description: "Opções de compartilhamento abertas.",
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center p-4 border-b">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold ml-2">Cartão SUS Virtual</h1>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-auto">
                <Info className="h-5 w-5 text-muted-foreground" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Os dados exibidos são ilustrativos</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 p-6">
        <div className="max-w-sm mx-auto">
          {/* Card do Cartão SUS */}
          <Card className="bg-gradient-to-r from-green-600 to-green-700 text-white mb-6">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-bold">CARTÃO SUS</h2>
                  <p className="text-sm opacity-90">Sistema Único de Saúde</p>
                </div>
                <div className="text-right">
                  <div className="w-12 h-8 bg-white rounded flex items-center justify-center">
                    <span className="text-green-600 font-bold text-xs">SUS</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs opacity-75">NOME DO USUÁRIO</p>
                  <p className="font-semibold text-sm">{usuario.nome} {usuario.sobrenome}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs opacity-75">CPF</p>
                    <p className="font-semibold text-sm">{usuario.cpf}</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-75">DATA NASC.</p>
                    <p className="font-semibold text-sm">{usuario.dataNascimento}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs opacity-75">NÚMERO DO CARTÃO SUS</p>
                  <p className="font-bold text-lg tracking-wider">{usuario.numeroCartaoSus}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* QR Code */}
          {qrCodeUrl && (
            <Card className="mb-6">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold mb-4">QR Code do Cartão</h3>
                <div className="flex justify-center mb-4">
                  <img 
                    src={qrCodeUrl} 
                    alt="QR Code do Cartão SUS" 
                    className="w-32 h-32 border rounded-lg"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Apresente este QR Code nos estabelecimentos de saúde
                </p>
              </CardContent>
            </Card>
          )}

          {/* Ações */}
          <div className="space-y-3">
            <Button 
              onClick={handleBaixarPdf}
              className="w-full h-12 bg-green-600 hover:bg-green-700 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Baixar PDF
            </Button>

            <Button 
              onClick={handleCompartilhar}
              variant="outline" 
              className="w-full h-12"
            >
              <Share className="w-4 h-4 mr-2" />
              Compartilhar
            </Button>
          </div>

          {/* Informações adicionais */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
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
    </div>
  );
};

export default CartaoSus;