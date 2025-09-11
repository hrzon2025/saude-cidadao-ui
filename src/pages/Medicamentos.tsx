import { AppHeader } from "@/components/ui/app-header";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Medicamentos() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [iframeUrl, setIframeUrl] = useState("https://sus-suzano.web.app/#/");

  const handleSearch = () => {
    if (searchTerm.trim()) {
      // Update iframe URL with search parameter
      const baseUrl = "https://sus-suzano.web.app/#/";
      const searchUrl = `${baseUrl}?search=${encodeURIComponent(searchTerm.trim())}`;
      setIframeUrl(searchUrl);
      setIsSearchOpen(false);
      setSearchTerm("");
    }
  };

  const searchButton = (
    <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 p-0 text-primary-foreground hover:bg-primary-foreground/10"
        >
          <Search className="h-5 w-5" />
          <span className="sr-only">Buscar medicamento</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Buscar Medicamento</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Digite o nome do medicamento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full"
            autoFocus
          />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsSearchOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSearch} disabled={!searchTerm.trim()}>
              Buscar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20">
      <AppHeader 
        title="Medicamentos" 
        showBack 
        onBack={() => navigate(-1)}
        actions={searchButton}
      />
      
      <div className="h-[calc(100vh-8rem)]">
        <iframe
          src={iframeUrl}
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