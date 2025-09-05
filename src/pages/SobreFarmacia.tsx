import { AppHeader } from "@/components/ui/app-header";
import { useNavigate } from "react-router-dom";

export default function SobreFarmacia() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20">
      <AppHeader 
        title="Sobre" 
        showBack 
        onBack={() => navigate(-1)} 
      />
      
      <div className="h-[calc(100vh-8rem)]">
        <iframe
          src="https://suzano.sp.gov.br/saude/rede-de-assistencia-farmaceutica/sobre/"
          className="w-full h-full border-0"
          title="Sobre Assistência Farmacêutica"
        />
      </div>
    </div>
  );
}