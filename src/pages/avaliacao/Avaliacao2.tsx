import { useParams, useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/ui/app-header";

export default function Avaliacao2() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        title="Avaliação"
        showBack
        onBack={() => navigate("/atendimentos")}
        className="bg-primary text-primary-foreground"
      />
      
      <div className="p-4">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Avaliação 2</h2>
          <p className="text-muted-foreground">Em desenvolvimento</p>
        </div>
      </div>
    </div>
  );
}