import { AppHeader } from "@/components/ui/app-header";
import { useNavigate } from "react-router-dom";
import { ExternalLink, Building } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ComissaoFarmacologia() {
  const navigate = useNavigate();

  const handleOpenLink = () => {
    window.open("https://suzano.sp.gov.br/saude/rede-de-assistencia-farmaceutica/comissao-de-farmacologia-do-estado-de-sao-paulo/", "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20">
      <AppHeader 
        title="Comissão de Farmacologia de São Paulo" 
        showBack 
        onBack={() => navigate(-1)} 
      />
      
      <div className="max-w-md mx-auto p-6">
        <div className="bg-card rounded-lg p-6 shadow-sm border border-border text-center">
          <Building className="h-12 w-12 text-primary mx-auto mb-4" />
          
          <h2 className="text-xl font-semibold text-foreground mb-3">
            Comissão de Farmacologia de São Paulo
          </h2>
          
          <p className="text-muted-foreground mb-6">
            Acesse informações completas sobre a Comissão de Farmacologia do Estado de São Paulo no site oficial da prefeitura.
          </p>
          
          <Button 
            onClick={handleOpenLink}
            className="w-full"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Acessar Site Oficial
          </Button>
        </div>
      </div>
    </div>
  );
}