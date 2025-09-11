import { AppHeader } from "@/components/ui/app-header";
import { useNavigate } from "react-router-dom";

export default function Medicamentos() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20">
      <AppHeader 
        title="Medicamentos" 
        showBack 
        onBack={() => navigate(-1)}
      />
      
      <div className="h-[calc(100vh-8rem)]">
        <iframe
          src="https://sus-suzano.web.app/#/"
          className="w-full h-full border-none"
          title="Sistema de Medicamentos"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            marginTop: '-60px',
            height: 'calc(100% + 60px)'
          }}
        />
      </div>
    </div>
  );
}