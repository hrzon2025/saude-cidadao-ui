import { useState, useEffect } from "react";
import { AppHeader } from "@/components/ui/app-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Save, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function EditarPerfil() {
  const navigate = useNavigate();
  const { usuario, setUsuario } = useAppStore();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [foto, setFoto] = useState<File | null>(null);
  const [fotoUrl, setFotoUrl] = useState<string>(usuario?.avatarUrl || "");
  
  // Dados do usuário
  const [formData, setFormData] = useState({
    nome: "",
    sobrenome: "",
    email: "",
    telefone: "",
    cns: "",
    // Endereço
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    uf: ""
  });

  useEffect(() => {
    if (usuario) {
      // Separar nome completo em nome e sobrenome
      const nomeCompleto = usuario.nome.split(' ');
      const nome = nomeCompleto[0] || '';
      const sobrenome = nomeCompleto.slice(1).join(' ') || '';
      
      setFormData({
        nome,
        sobrenome,
        email: usuario.email,
        telefone: usuario.telefone || "",
        cns: usuario.cns || "",
        cep: "",
        logradouro: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        uf: ""
      });

      // Buscar endereço do usuário
      fetchEndereco();
    }
  }, [usuario]);

  const fetchEndereco = async () => {
    if (!usuario?.id) return;

    try {
      const { data, error } = await supabase
        .from('enderecos')
        .select('*')
        .eq('usuario_id', usuario.id)
        .single();

      if (data && !error) {
        setFormData(prev => ({
          ...prev,
          cep: data.cep || "",
          logradouro: data.logradouro || "",
          numero: data.numero || "",
          complemento: data.complemento || "",
          bairro: data.bairro || "",
          cidade: data.cidade || "",
          uf: data.uf || ""
        }));
      }
    } catch (error) {
      console.error('Erro ao buscar endereço:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFoto(file);
      const url = URL.createObjectURL(file);
      setFotoUrl(url);
    }
  };

  const formatarCEP = (value: string) => {
    const cepLimpo = value.replace(/\D/g, "");
    return cepLimpo.replace(/^(\d{5})(\d{3})$/, "$1-$2");
  };

  const formatarTelefone = (value: string) => {
    const telLimpo = value.replace(/\D/g, "");
    return telLimpo.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
  };

  const buscarCep = async (cepValue: string) => {
    const cepLimpo = cepValue.replace(/\D/g, "");
    if (cepLimpo.length !== 8) return;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();
      
      if (data.logradouro) {
        setFormData(prev => ({
          ...prev,
          logradouro: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
          uf: data.uf
        }));
        
        toast({
          title: "Endereço encontrado!",
          description: "Os campos foram preenchidos automaticamente."
        });
      } else {
        toast({
          title: "CEP não encontrado",
          description: "Verifique se o CEP está correto.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao buscar CEP",
        description: "Tente novamente mais tarde.",
        variant: "destructive"
      });
    }
  };

  const handleCepChange = (value: string) => {
    const cepFormatado = formatarCEP(value);
    handleInputChange('cep', cepFormatado);
    
    if (cepFormatado.length === 9) {
      buscarCep(cepFormatado);
    }
  };

  const handleSave = async () => {
    if (!usuario?.id) return;

    if (!formData.nome.trim() || !formData.email.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e email são obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);

      // Atualizar dados do usuário
      const { error: usuarioError } = await supabase
        .from('usuarios')
        .update({
          nome: formData.nome.trim(),
          sobrenome: formData.sobrenome.trim(),
          email: formData.email.trim(),
          celular: formData.telefone.replace(/\D/g, ""),
          cns: formData.cns.trim() || null
        })
        .eq('id', usuario.id);

      if (usuarioError) {
        throw usuarioError;
      }

      // Atualizar endereço (se preenchido)
      if (formData.cep && formData.logradouro && formData.numero) {
        const { error: enderecoError } = await supabase
          .from('enderecos')
          .upsert({
            usuario_id: usuario.id,
            cep: formData.cep.replace(/\D/g, ""),
            logradouro: formData.logradouro.trim(),
            numero: formData.numero.trim(),
            complemento: formData.complemento.trim() || null,
            bairro: formData.bairro.trim(),
            cidade: formData.cidade.trim(),
            uf: formData.uf.trim()
          });

        if (enderecoError) {
          console.error('Erro ao salvar endereço:', enderecoError);
        }
      }

      // Atualizar store local
      const novoUsuario = {
        ...usuario,
        nome: `${formData.nome} ${formData.sobrenome}`.trim(),
        email: formData.email,
        telefone: formData.telefone,
        cns: formData.cns,
        endereco: formData.logradouro && formData.numero 
          ? `${formData.logradouro}, ${formData.numero} - ${formData.bairro}, ${formData.cidade}/${formData.uf}`
          : usuario.endereco,
        avatarUrl: fotoUrl
      };

      setUsuario(novoUsuario);

      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso."
      });

      navigate('/perfil');

    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível atualizar seu perfil. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!usuario) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <AppHeader title="Editar Perfil" showBack onBack={() => navigate('/perfil')} />
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20">
      <AppHeader 
        title="Editar Perfil" 
        showBack 
        onBack={() => navigate('/perfil')}
        actions={
          <Button
            size="sm"
            onClick={handleSave}
            disabled={loading}
            className="bg-primary hover:bg-primary/90"
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        }
      />

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Foto de Perfil */}
        <Card className="p-6">
          <div className="flex flex-col items-center space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Foto de Perfil</h3>
            
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={fotoUrl} alt="Foto de perfil" />
                <AvatarFallback className="text-lg">
                  {formData.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="h-6 w-6 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFotoChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  aria-label="Alterar foto de perfil"
                />
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground text-center">
              Toque na foto para alterar
            </p>
          </div>
        </Card>

        {/* Dados Pessoais */}
        <Card className="p-6 space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Dados Pessoais</h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="nome">Nome *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                className="mt-1"
                placeholder="Seu nome"
              />
            </div>

            <div>
              <Label htmlFor="sobrenome">Sobrenome *</Label>
              <Input
                id="sobrenome"
                value={formData.sobrenome}
                onChange={(e) => handleInputChange('sobrenome', e.target.value)}
                className="mt-1"
                placeholder="Seu sobrenome"
              />
            </div>

            <div>
              <Label htmlFor="email">E-mail *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="mt-1"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => handleInputChange('telefone', formatarTelefone(e.target.value))}
                className="mt-1"
                placeholder="(11) 99999-9999"
                maxLength={15}
              />
            </div>

            <div>
              <Label htmlFor="cns">CNS (Cartão Nacional do SUS)</Label>
              <Input
                id="cns"
                value={formData.cns}
                onChange={(e) => handleInputChange('cns', e.target.value)}
                className="mt-1"
                placeholder="000 0000 0000 0000"
                maxLength={15}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Número do seu Cartão Nacional do SUS
              </p>
            </div>
          </div>
        </Card>

        {/* Endereço */}
        <Card className="p-6 space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Endereço</h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="cep">CEP</Label>
              <Input
                id="cep"
                value={formData.cep}
                onChange={(e) => handleCepChange(e.target.value)}
                className="mt-1"
                placeholder="00000-000"
                maxLength={9}
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <Label htmlFor="logradouro">Logradouro</Label>
                <Input
                  id="logradouro"
                  value={formData.logradouro}
                  onChange={(e) => handleInputChange('logradouro', e.target.value)}
                  className="mt-1"
                  placeholder="Rua, Avenida..."
                />
              </div>
              
              <div>
                <Label htmlFor="numero">Número</Label>
                <Input
                  id="numero"
                  value={formData.numero}
                  onChange={(e) => handleInputChange('numero', e.target.value)}
                  className="mt-1"
                  placeholder="123"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="complemento">Complemento</Label>
              <Input
                id="complemento"
                value={formData.complemento}
                onChange={(e) => handleInputChange('complemento', e.target.value)}
                className="mt-1"
                placeholder="Apto, Bloco..."
              />
            </div>

            <div>
              <Label htmlFor="bairro">Bairro</Label>
              <Input
                id="bairro"
                value={formData.bairro}
                onChange={(e) => handleInputChange('bairro', e.target.value)}
                className="mt-1"
                placeholder="Nome do bairro"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  value={formData.cidade}
                  onChange={(e) => handleInputChange('cidade', e.target.value)}
                  className="mt-1"
                  placeholder="Nome da cidade"
                />
              </div>
              
              <div>
                <Label htmlFor="uf">UF</Label>
                <Input
                  id="uf"
                  value={formData.uf}
                  onChange={(e) => handleInputChange('uf', e.target.value.toUpperCase())}
                  className="mt-1"
                  placeholder="SP"
                  maxLength={2}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Botões de Ação */}
        <div className="space-y-3">
          <Button
            onClick={handleSave}
            disabled={loading}
            className="w-full h-12 bg-primary hover:bg-primary/90"
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Salvando..." : "Salvar Alterações"}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => navigate('/perfil')}
            className="w-full h-12"
          >
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}