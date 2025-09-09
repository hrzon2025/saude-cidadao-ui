import { useState } from "react";
import { ChevronLeft, Eye, EyeOff, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAppStore } from "@/store/useAppStore";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
interface EnderecoData {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
}
export default function Cadastro() {
  const navigate = useNavigate();
  const {
    showNotification
  } = useAppStore();

  // Dados da conta
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fotoPerfil, setFotoPerfil] = useState<File | null>(null);
  const [fotoPerfilUrl, setFotoPerfilUrl] = useState<string>("");

  // Dados pessoais
  const [cpf, setCpf] = useState("");
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
  const [showUnidadeSaudeDialog, setShowUnidadeSaudeDialog] = useState(false);
  const handleFotoPerfilChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFotoPerfil(file);
      const url = URL.createObjectURL(file);
      setFotoPerfilUrl(url);
    }
  };
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

  const formatarDataParaAPI = (dateString: string) => {
    // Converte de YYYY-MM-DD para YYYYMMDD
    return dateString.replace(/-/g, '');
  };

  const consultarAPIValidacao = async (cpfLimpo: string, dataFormatada: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('validar-usuario', {
        body: {
          cpf: cpfLimpo,
          dataNascimento: dataFormatada,
          cns: ""
        }
      });

      if (error) {
        console.error('Erro na API de validação:', error);
        return { success: false, error };
      }

      return data;
    } catch (error) {
      console.error('Erro na API de validação:', error);
      return { success: false, error };
    }
  };
  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !sobrenome || !email || !senha || !confirmarSenha || !cpf || !dataNascimento || !cep || !logradouro || !numero || !bairro || !cidade || !uf || !aceitouTermos) {
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

    // Validar CPF
    const cpfLimpo = cpf.replace(/\D/g, "");
    if (cpfLimpo.length !== 11) {
      showNotification("CPF deve ter 11 dígitos", "error");
      return;
    }

    try {
      setLoading(true);
      
      // 1. Consultar API externa para validação
      const dataFormatada = formatarDataParaAPI(dataNascimento);
      const validacaoResult = await consultarAPIValidacao(cpfLimpo, dataFormatada);
      
      if (!validacaoResult.success) {
        // Verificar se é a mensagem específica para procurar unidade de saúde
        if (validacaoResult.data && validacaoResult.data.mensagem === "Procurar a unidade de saúde de referência") {
          setShowUnidadeSaudeDialog(true);
          return;
        }
        
        showNotification("Usuário não autorizado. Verifique os dados (CPF e Data de Nascimento) e tente novamente.", "error");
        return;
      }

      // 2. Se validação passou - criar usuário na tabela usuarios
      const { data: novoUsuario, error: erroUsuario } = await supabase
        .from('usuarios')
        .insert({
          nome,
          sobrenome,
          email,
          cpf,
          data_nascimento: dataNascimento,
          genero,
          celular,
          foto_perfil_url: fotoPerfilUrl || null,
          senha // Em produção, use hash da senha
        })
        .select()
        .single();

      if (erroUsuario) {
        console.error('Erro ao criar usuário:', erroUsuario);
        showNotification("Erro ao criar usuário. Verifique se email ou CPF já não estão cadastrados.", "error");
        return;
      }

      // 3. Criar endereço associado ao usuário
      const { error: erroEndereco } = await supabase
        .from('enderecos')
        .insert({
          usuario_id: novoUsuario.id,
          cep: cep.replace(/\D/g, ''),
          logradouro,
          numero,
          complemento: complemento || null,
          bairro,
          cidade,
          uf
        });

      if (erroEndereco) {
        console.error('Erro ao criar endereço:', erroEndereco);
        showNotification("Usuário criado, mas erro ao salvar endereço.", "error");
        return;
      }

      // 4. Sucesso - mostrar mensagem e redirecionar
      showNotification("Cadastro realizado com sucesso!", "success");
      navigate("/login");
      
    } catch (error) {
      console.error('Erro durante cadastro:', error);
      showNotification("Erro ao realizar cadastro", "error");
    } finally {
      setLoading(false);
    }
  };
  return <div className="min-h-screen bg-background flex flex-col">
      {/* Conteúdo principal */}
      <div className="flex-1 px-6 py-6 my-[50px]">
        <div className="mx-auto w-full max-w-sm">
          <form onSubmit={handleCadastro} className="space-y-6">
            {/* Foto de perfil */}
            <div className="flex justify-center mb-6 py-0">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-2 border-dashed border-muted-foreground flex items-center justify-center bg-muted/50 overflow-hidden">
                  {fotoPerfilUrl ? <img src={fotoPerfilUrl} alt="Foto de perfil" className="w-full h-full object-cover" /> : <Camera className="h-8 w-8 text-muted-foreground" />}
                </div>
                <input type="file" accept="image/*" capture="environment" onChange={handleFotoPerfilChange} className="absolute inset-0 opacity-0 cursor-pointer" aria-label="Adicionar foto de perfil" />
                <button type="button" className="text-purple-600 text-sm mt-2 block text-center w-full pointer-events-none">
                  {fotoPerfilUrl ? "Alterar" : "Adicionar"}
                </button>
              </div>
            </div>

            {/* Seção Conta */}
            <div className="space-y-4">
              <h2 className="text-sm font-medium text-muted-foreground text-center uppercase tracking-wider">
                Conta
              </h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="nome">
                    Nome <span className="text-red-500">*</span>
                  </Label>
                  <Input id="nome" value={nome} onChange={e => setNome(e.target.value)} className="h-12 bg-white" required />
                </div>

                <div>
                  <Label htmlFor="sobrenome">
                    Sobrenome <span className="text-red-500">*</span>
                  </Label>
                  <Input id="sobrenome" value={sobrenome} onChange={e => setSobrenome(e.target.value)} className="h-12 bg-white" required />
                </div>

                <div>
                  <Label htmlFor="email-cadastro">
                    E-mail <span className="text-red-500">*</span>
                  </Label>
                  <Input id="email-cadastro" type="email" value={email} onChange={e => setEmail(e.target.value)} className="h-12 bg-white" required />
                </div>

                <div>
                  <Label htmlFor="senha-cadastro">
                    Senha <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input id="senha-cadastro" type={showPassword ? "text" : "password"} placeholder="Senha (mínimo de 6 caracteres)" value={senha} onChange={e => setSenha(e.target.value)} className="h-12 pr-10 bg-white" required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      {showPassword ? <EyeOff className="h-5 w-5 text-muted-foreground" /> : <Eye className="h-5 w-5 text-muted-foreground" />}
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirmar-senha">
                    Repetir senha <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input id="confirmar-senha" type={showConfirmPassword ? "text" : "password"} value={confirmarSenha} onChange={e => setConfirmarSenha(e.target.value)} className="h-12 pr-10 bg-white" required />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      {showConfirmPassword ? <EyeOff className="h-5 w-5 text-muted-foreground" /> : <Eye className="h-5 w-5 text-muted-foreground" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Seção Dados Pessoais */}
            <div className="space-y-4">
              <h2 className="text-sm font-medium text-muted-foreground text-center uppercase tracking-wider">
                Dados Pessoais
              </h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cpf">
                    CPF <span className="text-red-500">*</span>
                  </Label>
                  <Input id="cpf" value={cpf} onChange={e => setCpf(formatarCPF(e.target.value))} placeholder="000.000.000-00" className="h-12 bg-white" maxLength={14} required />
                </div>

                <div>
                  <Label htmlFor="nascimento">
                    Data de nascimento <span className="text-red-500">*</span>
                  </Label>
                  <Input id="nascimento" type="date" value={dataNascimento} onChange={e => setDataNascimento(e.target.value)} className="h-12 bg-white" required />
                </div>

                <div>
                  <Label>Gênero</Label>
                  <Select value={genero} onValueChange={setGenero}>
                    <SelectTrigger className="h-12 bg-white">
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
                  <Input id="celular" value={celular} onChange={e => setCelular(formatarTelefone(e.target.value))} placeholder="(11) 99999-9999" className="h-12 bg-white" />
                </div>
              </div>
            </div>

            {/* Seção Endereço */}
            <div className="space-y-4">
              <h2 className="text-sm font-medium text-muted-foreground text-center uppercase tracking-wider">
                Endereço
              </h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cep">
                    CEP <span className="text-red-500">*</span>
                  </Label>
                  <Input id="cep" value={cep} onChange={handleCepChange} placeholder="00000-000" className="h-12 bg-white" maxLength={9} required />
                  {loadingCep && <div className="text-xs text-muted-foreground mt-1">Buscando CEP...</div>}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="logradouro">
                      Logradouro <span className="text-red-500">*</span>
                    </Label>
                    <Input id="logradouro" value={logradouro} onChange={e => setLogradouro(e.target.value)} className="h-12 bg-white" required />
                  </div>

                  <div>
                    <Label htmlFor="numero">
                      Número <span className="text-red-500">*</span>
                    </Label>
                    <Input id="numero" value={numero} onChange={e => setNumero(e.target.value)} className="h-12 bg-white" required />
                  </div>
                </div>

                <div>
                  <Label htmlFor="complemento">Complemento</Label>
                  <Input id="complemento" value={complemento} onChange={e => setComplemento(e.target.value)} className="h-12 bg-white" />
                </div>

                <div>
                  <Label htmlFor="bairro">
                    Bairro <span className="text-red-500">*</span>
                  </Label>
                  <Input id="bairro" value={bairro} onChange={e => setBairro(e.target.value)} className="h-12 bg-white" required />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="cidade">
                      Cidade <span className="text-red-500">*</span>
                    </Label>
                    <Input id="cidade" value={cidade} onChange={e => setCidade(e.target.value)} className="h-12 bg-white" required />
                  </div>

                  <div>
                    <Label>
                      UF <span className="text-red-500">*</span>
                    </Label>
                    <Select value={uf} onValueChange={setUf} required>
                      <SelectTrigger className="h-12 bg-white">
                        <SelectValue placeholder="UF" />
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
              </div>
            </div>

            {/* Termos de uso */}
            <div className="flex items-start space-x-2 px-1">
              <Checkbox id="termos" checked={aceitouTermos} onCheckedChange={checked => setAceitouTermos(checked === true)} className="mt-1" />
              <label htmlFor="termos" className="text-sm leading-relaxed">
                Ao cadastrar-se, você concorda com nosso{" "}
                <span className="text-purple-600 underline">Termo de uso.</span>
              </label>
            </div>

            {/* Botão de cadastro */}
            <Button type="submit" className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl" disabled={loading || !aceitouTermos}>
              {loading ? "Cadastrando..." : "Cadastrar"}
            </Button>

            {/* Botão voltar ao login */}
            <div className="text-center mt-4">
              <button type="button" onClick={() => navigate("/login")} className="text-purple-600 hover:text-purple-700 text-sm font-medium transition-colors">
                Voltar ao login
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Espaçamento para evitar sobreposição com a barra de navegação */}

      {/* Dialog para CPF não encontrado */}
      <Dialog open={showUnidadeSaudeDialog} onOpenChange={setShowUnidadeSaudeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>CPF não encontrado</DialogTitle>
            <DialogDescription>
              CPF não encontrado, por favor, procure a unidade de saúde de referência.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowUnidadeSaudeDialog(false)}>
              Entendi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
    </div>;
}