import { useState } from "react";
import { ArrowLeft, Search, MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AppHeader } from "@/components/ui/app-header";
import { useNavigate } from "react-router-dom";
import unidadesSuzano from "@/data/unidades-suzano.json";
const Unidades = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const filteredUnidades = unidadesSuzano.filter(unidade => unidade.nome.toLowerCase().includes(searchQuery.toLowerCase()) || unidade.endereco.toLowerCase().includes(searchQuery.toLowerCase()));
  const handleVerNoMaps = (unidade: any) => {
    // Abrir Google Maps com endereço completo
    const endereco = `${unidade.endereco}, ${unidade.bairro}, ${unidade.cidade}, ${unidade.estado}, ${unidade.cep}`;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(endereco)}`;
    window.open(url, '_blank');
  };
  return <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <AppHeader 
        title="Unidades" 
        showBack 
        onBack={() => navigate(-1)} 
      />

      {/* Conteúdo */}
      <div className="flex-1 p-4 space-y-4">
        {/* Campo de busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input type="text" placeholder="Busque por uma unidade ou endereço..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 h-12 rounded-full" />
        </div>


        {/* Título da lista */}
        <h2 className="text-xl font-bold text-foreground mt-6">
          Lista de Unidades de Saúde
        </h2>

        {/* Lista de unidades */}
        <div className="space-y-4">
          {filteredUnidades.map((unidade, index) => <Card key={index} className="overflow-hidden">
              <CardContent className="p-0">
                {/* Mapa placeholder */}
                <div className="h-32 bg-muted flex items-center justify-center">
                  <MapPin className="h-12 w-12 text-muted-foreground" />
                </div>
                
                {/* Conteúdo do card */}
                <div className="p-4 space-y-3">
                  {/* Nome e status */}
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">{unidade.nome}</h3>
                    <span className="text-sm font-medium text-green-600">
                      Disponível
                    </span>
                  </div>
                  
                  {/* Endereço completo */}
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      {unidade.endereco}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {unidade.bairro}, {unidade.cidade}/{unidade.estado}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      CEP: {unidade.cep}
                    </p>
                  </div>
                  
                  {/* Distância (simulada) */}
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>Distância não disponível</span>
                  </div>
                  
                  {/* Botão Ver no Maps */}
                  <Button onClick={() => handleVerNoMaps(unidade)} variant="outline" className="w-full h-10">
                    <Navigation className="h-4 w-4 mr-2" />
                    Ver no Maps
                  </Button>
                </div>
              </CardContent>
            </Card>)}
        </div>

        {/* Mensagem se não encontrar resultados */}
        {filteredUnidades.length === 0 && <div className="text-center py-8">
            <p className="text-muted-foreground">
              Nenhuma unidade encontrada para "{searchQuery}"
            </p>
          </div>}
      </div>
      
      {/* Espaçamento para barra de navegação */}
      <div className="h-20"></div>
    </div>;
};
export default Unidades;