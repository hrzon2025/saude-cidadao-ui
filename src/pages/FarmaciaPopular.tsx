import { AppHeader } from "@/components/ui/app-header";
import { useNavigate } from "react-router-dom";
import { ExternalLink, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FarmaciaPopular() {
  const navigate = useNavigate();

  const handleOpenLink = () => {
    window.open("https://suzano.sp.gov.br/saude/rede-de-assistencia-farmaceutica/programa-farmacia-popular/", "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20">
      <AppHeader 
        title="Programa Farmácia Popular" 
        showBack 
        onBack={() => navigate(-1)} 
      />
      
      <div className="max-w-md mx-auto p-6">
        <div className="bg-card rounded-lg p-6 shadow-sm border border-border text-center">
          <Users className="h-12 w-12 text-primary mx-auto mb-4" />
          
          <h2 className="text-xl font-semibold text-foreground mb-3">
            Programa Farmácia Popular
          </h2>
          
          <p className="text-muted-foreground mb-6">
            Acesse informações completas sobre o Programa Farmácia Popular de Suzano no site oficial da prefeitura.
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