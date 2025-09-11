import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Download, Share, Info, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AppHeader } from "@/components/ui/app-header";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAppStore } from "@/store/useAppStore";
import QRCode from "qrcode";
import html2canvas from "html2canvas";
import { Share as CapacitorShare } from "@capacitor/share";
import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import jsPDF from "jspdf";
const CartaoSus = () => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
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
  const handleBaixarPdf = async () => {
    if (!cartaoRef.current) return;
    
    try {
      const canvas = await html2canvas(cartaoRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
      });
      
      // Verificar se está rodando em dispositivo móvel
      if (Capacitor.isNativePlatform()) {
        // Criar PDF usando jsPDF
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });
        
        // Adicionar a imagem do cartão ao PDF
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 180; // Largura em mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width; // Manter proporção
        
        pdf.addImage(imgData, 'PNG', 15, 20, imgWidth, imgHeight);
        
        // Converter PDF para base64
        const pdfBase64 = pdf.output('datauristring');
        
        // Salvar arquivo usando Capacitor Filesystem
        const fileName = `cartao-sus-${usuario.nome.replace(/\s+/g, '-')}.pdf`;
        
        await Filesystem.writeFile({
          path: fileName,
          data: pdfBase64.split(',')[1], // Remove o prefixo data:application/pdf;base64,
          directory: Directory.Documents,
          recursive: true,
        });
        
        // Compartilhar para acionar "Abrir com..."
        const { uri } = await Filesystem.getUri({
          directory: Directory.Documents,
          path: fileName
        });
        await CapacitorShare.share({
          title: 'Cartão SUS - PDF',
          text: `PDF do Cartão SUS de ${usuario.nome}`,
          files: [uri],
          dialogTitle: 'Abrir PDF com...'
        });
        
        toast({
          title: "PDF gerado",
          description: "PDF do cartão SUS criado e pronto para ser aberto."
        });
      } else {
        // Fallback para web - baixar como imagem
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `cartao-sus-${usuario.nome.replace(/\s+/g, '-')}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            toast({
              title: "Cartão baixado",
              description: "O cartão SUS foi salvo como imagem com sucesso."
            });
          }
        }, 'image/png');
      }
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o PDF do cartão.",
        variant: "destructive"
      });
    }
  };
  const handleCompartilhar = async () => {
    if (!cartaoRef.current) return;
    
    try {
      const canvas = await html2canvas(cartaoRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
      });
      
      // Verificar se está rodando em dispositivo móvel
      if (Capacitor.isNativePlatform()) {
        // Salvar imagem temporariamente usando Filesystem
        const imageData = canvas.toDataURL('image/png');
        const fileName = `cartao-sus-${Date.now()}.png`;
        
        await Filesystem.writeFile({
          path: fileName,
          data: imageData.split(',')[1], // Remove o prefixo data:image/png;base64,
          directory: Directory.Cache,
          recursive: true,
        });
        
        // Compartilhar usando Capacitor Share
        const { uri } = await Filesystem.getUri({
          directory: Directory.Cache,
          path: fileName
        });
        await CapacitorShare.share({
          title: 'Meu Cartão SUS',
          text: `Cartão SUS de ${usuario.nome}`,
          files: [uri],
          dialogTitle: 'Compartilhar Cartão SUS'
        });
        
        toast({
          title: "Compartilhado",
          description: "Cartão SUS compartilhado com sucesso."
        });
      } else {
        // Fallback para web - usar Web Share API se disponível
        if (navigator.share && navigator.canShare) {
          canvas.toBlob(async (blob) => {
            if (blob) {
              const file = new File([blob], `cartao-sus-${usuario.nome.replace(/\s+/g, '-')}.png`, {
                type: 'image/png'
              });
              
              if (navigator.canShare({ files: [file] })) {
                await navigator.share({
                  title: 'Meu Cartão SUS',
                  text: `Cartão SUS de ${usuario.nome}`,
                  files: [file]
                });
                
                toast({
                  title: "Compartilhado",
                  description: "Cartão SUS compartilhado com sucesso."
                });
              }
            }
          }, 'image/png');
        } else {
          // Fallback - baixar a imagem
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `cartao-sus-${usuario.nome.replace(/\s+/g, '-')}.png`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
              
              toast({
                title: "Download iniciado",
                description: "Como o compartilhamento não está disponível, a imagem foi baixada."
              });
            }
          }, 'image/png');
        }
      }
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
      toast({
        title: "Erro",
        description: "Não foi possível compartilhar o cartão.",
        variant: "destructive"
      });
    }
  };
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
          <Card id="container-cartao-sus" ref={cartaoRef} className="bg-gradient-sus text-white mb-6">
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

          {/* Ações */}
          <div className="space-y-3">
            <Button id="botao-baixar-pdf" onClick={handleBaixarPdf} className="w-full h-12">
              <Download className="w-4 h-4 mr-2" />
              Baixar PDF
            </Button>

            <Button id="botao-compartilhar-imagem" onClick={handleCompartilhar} variant="secondary" className="w-full h-12">
              <Share className="w-4 h-4 mr-2" />
              Compartilhar
            </Button>
          </div>

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