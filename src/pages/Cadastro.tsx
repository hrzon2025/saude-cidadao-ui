import { useState } from "react";
import { ChevronLeft, Eye, EyeOff, Camera, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/store/useAppStore";
import { useNavigate } from "react-router-dom";

interface EnderecoData {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
}

export default function Cadastro() {
  const navigate = useNavigate();
  const { showNotification } = useAppStore();
  
  // Dados da conta
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [usuario, setUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Dados pessoais
  const [tipoDocumento, setTipoDocumento] = useState("CPF");
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [genero, setGenero] = useState("");
  const [celular, setCelular] = useState("");

  // Endereço
  const [cep, setCep] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");
  const [loadingCep, setLoadingCep] = useState(false);

  // Estado do formulário
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [loading, setLoading] = useState(false);

  const buscarCep = async (cepValue: string) => {
    const cepLimpo = cepValue.replace(/\D/g, "");
    
    if (cepLimpo.length !== 8) return;

    try {
      setLoadingCep(true);
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data: EnderecoData = await response.json();
      
      if (data.logradouro) {
        setLogradouro(data.logradouro);
        setBairro(data.bairro);
        setCidade(data.localidade);
        setUf(data.uf);
        showNotification("Endereço encontrado!", "success");
      } else {
        showNotification("CEP não encontrado", "error");
      }
    } catch (error) {
      showNotification("Erro ao buscar CEP", "error");
    } finally {
      setLoadingCep(false);
    }
  };

  const formatarCep = (value: string) => {
    const cepLimpo = value.replace(/\D/g, "");
    return cepLimpo.replace(/^(\d{5})(\d{3})$/, "$1-$2");
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cepFormatado = formatarCep(e.target.value);
    setCep(cepFormatado);
    
    if (cepFormatado.length === 9) {
      buscarCep(cepFormatado);
    }
  };

  const formatarCPF = (value: string) => {
    const cpfLimpo = value.replace(/\D/g, "");
    return cpfLimpo.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
  };

  const formatarTelefone = (value: string) => {
    const telLimpo = value.replace(/\D/g, "");
    return telLimpo.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
  };

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome || !sobrenome || !email || !senha || !confirmarSenha || !numeroDocumento || !dataNascimento || !aceitouTermos) {
      showNotification("Preencha todos os campos obrigatórios", "error");
      return;
    }

    if (senha !== confirmarSenha) {
      showNotification("As senhas não coincidem", "error");
      return;
    }

    if (senha.length < 6) {
      showNotification("A senha deve ter pelo menos 6 caracteres", "error");
      return;
    }

    try {
      setLoading(true);
      // Simular cadastro
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      showNotification("Cadastro realizado com sucesso!", "success");
      navigate("/login");
    } catch (error) {
      showNotification("Erro ao realizar cadastro", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex flex-col">
      {/* Header */}
      <div className="bg-purple-600 text-white px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/login")}
            className="text-white hover:bg-purple-700 mr-4"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold">Cadastro</h1>
        </div>
      </div>

      <div className="flex-1 px-6 py-6">
        <div className="mx-auto w-full max-w-md space-y-6">
          <form onSubmit={handleCadastro} className="space-y-6">
            {/* Seção Conta */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground text-center">
                  CONTA
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Foto de perfil */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full border-2 border-dashed border-muted-foreground flex items-center justify-center bg-muted/50">
                      <Camera className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <button
                      type="button"
                      className="text-purple-600 text-sm mt-2 block text-center w-full"
                    >
                      Adicionar
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="nome">
                      Nome <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="nome"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      className="h-12"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="sobrenome">
                      Sobrenome <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="sobrenome"
                      value={sobrenome}
                      onChange={(e) => setSobrenome(e.target.value)}
                      className="h-12"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="usuario">Usuário</Label>
                    <Input
                      id="usuario"
                      value={usuario}
                      onChange={(e) => setUsuario(e.target.value)}
                      className="h-12"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email-cadastro">
                      E-mail <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email-cadastro"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="senha-cadastro">
                      Senha <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="senha-cadastro"
                        type={showPassword ? "text" : "password"}
                        placeholder="Senha (mínimo de 6 caracteres)"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        className="h-12 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <Eye className="h-5 w-5 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="confirmar-senha">
                      Repetir senha <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmar-senha"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmarSenha}
                        onChange={(e) => setConfirmarSenha(e.target.value)}
                        className="h-12 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <Eye className="h-5 w-5 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Seção Dados Pessoais */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground text-center">
                  DADOS PESSOAIS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Tipo de documento</Label>
                    <Select value={tipoDocumento} onValueChange={setTipoDocumento}>
                      <SelectTrigger className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CPF">CPF</SelectItem>
                        <SelectItem value="RG">RG</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="documento">
                      Número do documento <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="documento"
                      value={numeroDocumento}
                      onChange={(e) => {
                        const formatted = tipoDocumento === "CPF" 
                          ? formatarCPF(e.target.value)
                          : e.target.value;
                        setNumeroDocumento(formatted);
                      }}
                      className="h-12"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-sm text-purple-600">
                  <Info className="h-4 w-4" />
                  <span>Por que preciso informar um documento?</span>
                </div>

                <div>
                  <Label htmlFor="nascimento">
                    Data de nascimento <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="nascimento"
                    type="date"
                    value={dataNascimento}
                    onChange={(e) => setDataNascimento(e.target.value)}
                    className="h-12"
                    required
                  />
                </div>

                <div>
                  <Label>Gênero</Label>
                  <Select value={genero} onValueChange={setGenero}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="masculino">Masculino</SelectItem>
                      <SelectItem value="feminino">Feminino</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                      <SelectItem value="nao-informar">Prefiro não informar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="celular">Celular</Label>
                  <Input
                    id="celular"
                    value={celular}
                    onChange={(e) => setCelular(formatarTelefone(e.target.value))}
                    placeholder="(11) 99999-9999"
                    className="h-12"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Seção Endereço */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground text-center">
                  ENDEREÇO
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="cep">CEP</Label>
                  <Input
                    id="cep"
                    value={cep}
                    onChange={handleCepChange}
                    placeholder="00000-000"
                    className="h-12"
                    maxLength={9}
                  />
                  {loadingCep && <div className="text-xs text-muted-foreground mt-1">Buscando CEP...</div>}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="logradouro">Logradouro</Label>
                    <Input
                      id="logradouro"
                      value={logradouro}
                      onChange={(e) => setLogradouro(e.target.value)}
                      className="h-12"
                    />
                  </div>

                  <div>
                    <Label htmlFor="numero">Número</Label>
                    <Input
                      id="numero"
                      value={numero}
                      onChange={(e) => setNumero(e.target.value)}
                      className="h-12"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="complemento">Complemento</Label>
                  <Input
                    id="complemento"
                    value={complemento}
                    onChange={(e) => setComplemento(e.target.value)}
                    className="h-12"
                  />
                </div>

                <div>
                  <Label htmlFor="bairro">Bairro</Label>
                  <Input
                    id="bairro"
                    value={bairro}
                    onChange={(e) => setBairro(e.target.value)}
                    className="h-12"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input
                      id="cidade"
                      value={cidade}
                      onChange={(e) => setCidade(e.target.value)}
                      className="h-12"
                    />
                  </div>

                  <div>
                    <Label>UF</Label>
                    <Select value={uf} onValueChange={setUf}>
                      <SelectTrigger className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SP">SP</SelectItem>
                        <SelectItem value="RJ">RJ</SelectItem>
                        <SelectItem value="MG">MG</SelectItem>
                        <SelectItem value="RS">RS</SelectItem>
                        <SelectItem value="PR">PR</SelectItem>
                        <SelectItem value="SC">SC</SelectItem>
                        <SelectItem value="BA">BA</SelectItem>
                        <SelectItem value="GO">GO</SelectItem>
                        <SelectItem value="PE">PE</SelectItem>
                        <SelectItem value="CE">CE</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Termos de uso */}
            <div className="flex items-start space-x-2 px-1">
              <Checkbox
                id="termos"
                checked={aceitouTermos}
                onCheckedChange={(checked) => setAceitouTermos(checked === true)}
                className="mt-1"
              />
              <label htmlFor="termos" className="text-sm leading-relaxed">
                Ao cadastrar-se, você concorda com nosso{" "}
                <span className="text-purple-600 underline">Termo de uso.</span>
              </label>
            </div>

            {/* Botão de cadastro */}
            <Button 
              type="submit" 
              className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl"
              disabled={loading || !aceitouTermos}
            >
              {loading ? "Cadastrando..." : "Cadastrar"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}