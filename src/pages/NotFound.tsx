import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/ui/app-header";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20">
      <AppHeader title="Página não encontrada" />
      
      <div className="max-w-md mx-auto p-4">
        <Card className="p-6 text-center">
          <div className="mb-4 p-3 rounded-full bg-destructive/10 w-fit mx-auto">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          
          <h1 className="text-2xl font-bold mb-2 text-foreground">404</h1>
          <p className="text-muted-foreground mb-6">
            Oops! A página que você está procurando não foi encontrada.
          </p>
          
          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/inicio')}
              className="w-full"
            >
              Voltar ao Início
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => navigate(-1)}
              className="w-full"
            >
              Página Anterior
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;
