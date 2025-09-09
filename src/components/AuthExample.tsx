import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useAuthLogin } from '@/hooks/useAuthLogin';

export const AuthExample = () => {
  const { toast } = useToast();
  const { cadastrar, loading: cadastroLoading, error: cadastroError } = useAuth();
  const { login, logout, getStoredUser, isAuthenticated, loading: loginLoading, error: loginError } = useAuthLogin();

  // Estados para o formulário de cadastro
  const [cadastroData, setCadastroData] = useState({
    cpf: '',
    dataNascimento: '',
    cns: '',
    nome: '',
    sobrenome: '',
    email: '',
    senha: '',
    genero: '',
    celular: '',
    foto: null as File | null,
    endereco: {
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      uf: '',
    },
  });

  // Estados para o formulário de login
  const [loginData, setLoginData] = useState({
    email: '',
    senha: '',
  });

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await cadastrar(cadastroData);
    
    if (result) {
      toast({
        title: "Cadastro realizado com sucesso!",
        description: `Usuário ${result.nome} ${result.sobrenome} cadastrado.`,
      });
      
      // Limpar formulário
      setCadastroData({
        cpf: '',
        dataNascimento: '',
        cns: '',
        nome: '',
        sobrenome: '',
        email: '',
        senha: '',
        genero: '',
        celular: '',
        foto: null,
        endereco: {
          cep: '',
          logradouro: '',
          numero: '',
          complemento: '',
          bairro: '',
          cidade: '',
          uf: '',
        },
      });
    } else {
      toast({
        title: "Erro no cadastro",
        description: cadastroError || "Ocorreu um erro durante o cadastro",
        variant: "destructive",
      });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await login(loginData);
    
    if (result) {
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo, ${result.user.nome}!`,
      });
      
      console.log('Dados do usuário:', result.user);
      console.log('Token JWT:', result.token);
      
      // Limpar formulário
      setLoginData({ email: '', senha: '' });
    } else {
      toast({
        title: "Erro no login",
        description: loginError || "Credenciais inválidas",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Teste da API de Autenticação</h1>
      
      {isAuthenticated() && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          <p>Usuário logado: <strong>{getStoredUser()?.nome} {getStoredUser()?.sobrenome}</strong></p>
          <Button onClick={handleLogout} variant="outline" size="sm" className="mt-2">
            Fazer Logout
          </Button>
        </div>
      )}
      
      <Tabs defaultValue="cadastro" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="cadastro">Cadastro</TabsTrigger>
          <TabsTrigger value="login">Login</TabsTrigger>
        </TabsList>
        
        <TabsContent value="cadastro">
          <Card>
            <CardHeader>
              <CardTitle>Cadastro de Usuário</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCadastro} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome">Nome</Label>
                    <Input
                      id="nome"
                      value={cadastroData.nome}
                      onChange={(e) => setCadastroData({...cadastroData, nome: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="sobrenome">Sobrenome</Label>
                    <Input
                      id="sobrenome"
                      value={cadastroData.sobrenome}
                      onChange={(e) => setCadastroData({...cadastroData, sobrenome: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={cadastroData.email}
                      onChange={(e) => setCadastroData({...cadastroData, email: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="senha">Senha</Label>
                    <Input
                      id="senha"
                      type="password"
                      value={cadastroData.senha}
                      onChange={(e) => setCadastroData({...cadastroData, senha: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="cpf">CPF</Label>
                    <Input
                      id="cpf"
                      value={cadastroData.cpf}
                      onChange={(e) => setCadastroData({...cadastroData, cpf: e.target.value})}
                      placeholder="00000000000"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="dataNascimento">Data Nascimento</Label>
                    <Input
                      id="dataNascimento"
                      value={cadastroData.dataNascimento}
                      onChange={(e) => setCadastroData({...cadastroData, dataNascimento: e.target.value})}
                      placeholder="DD/MM/YYYY"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cns">CNS</Label>
                    <Input
                      id="cns"
                      value={cadastroData.cns}
                      onChange={(e) => setCadastroData({...cadastroData, cns: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="genero">Gênero</Label>
                    <Input
                      id="genero"
                      value={cadastroData.genero}
                      onChange={(e) => setCadastroData({...cadastroData, genero: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="celular">Celular</Label>
                    <Input
                      id="celular"
                      value={cadastroData.celular}
                      onChange={(e) => setCadastroData({...cadastroData, celular: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="foto">Foto</Label>
                  <Input
                    id="foto"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCadastroData({...cadastroData, foto: e.target.files?.[0] || null})}
                  />
                </div>

                <div className="border p-4 rounded space-y-4">
                  <h3 className="font-semibold">Endereço</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cep">CEP</Label>
                      <Input
                        id="cep"
                        value={cadastroData.endereco.cep}
                        onChange={(e) => setCadastroData({
                          ...cadastroData, 
                          endereco: {...cadastroData.endereco, cep: e.target.value}
                        })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="uf">UF</Label>
                      <Input
                        id="uf"
                        value={cadastroData.endereco.uf}
                        onChange={(e) => setCadastroData({
                          ...cadastroData, 
                          endereco: {...cadastroData.endereco, uf: e.target.value}
                        })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="logradouro">Logradouro</Label>
                    <Input
                      id="logradouro"
                      value={cadastroData.endereco.logradouro}
                      onChange={(e) => setCadastroData({
                        ...cadastroData, 
                        endereco: {...cadastroData.endereco, logradouro: e.target.value}
                      })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="numero">Número</Label>
                      <Input
                        id="numero"
                        value={cadastroData.endereco.numero}
                        onChange={(e) => setCadastroData({
                          ...cadastroData, 
                          endereco: {...cadastroData.endereco, numero: e.target.value}
                        })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="complemento">Complemento</Label>
                      <Input
                        id="complemento"
                        value={cadastroData.endereco.complemento}
                        onChange={(e) => setCadastroData({
                          ...cadastroData, 
                          endereco: {...cadastroData.endereco, complemento: e.target.value}
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="bairro">Bairro</Label>
                      <Input
                        id="bairro"
                        value={cadastroData.endereco.bairro}
                        onChange={(e) => setCadastroData({
                          ...cadastroData, 
                          endereco: {...cadastroData.endereco, bairro: e.target.value}
                        })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input
                      id="cidade"
                      value={cadastroData.endereco.cidade}
                      onChange={(e) => setCadastroData({
                        ...cadastroData, 
                        endereco: {...cadastroData.endereco, cidade: e.target.value}
                      })}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={cadastroLoading}>
                  {cadastroLoading ? 'Cadastrando...' : 'Cadastrar'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="login-senha">Senha</Label>
                  <Input
                    id="login-senha"
                    type="password"
                    value={loginData.senha}
                    onChange={(e) => setLoginData({...loginData, senha: e.target.value})}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loginLoading}>
                  {loginLoading ? 'Fazendo login...' : 'Entrar'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {(cadastroError || loginError) && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          Erro: {cadastroError || loginError}
        </div>
      )}
    </div>
  );
};