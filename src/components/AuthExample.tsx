import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth, type CadastroData, type LoginData } from '@/hooks/useAuth';

export function AuthExample() {
  const { cadastrar, login, loading, error } = useAuth();
  const [result, setResult] = useState<any>(null);

  // Estados para cadastro
  const [cadastroForm, setCadastroForm] = useState<CadastroData>({
    cpf: '12345678900',
    dataNascimento: '1990-01-01',
    cns: '123456789012345',
    nome: 'João',
    sobrenome: 'Silva',
    email: 'joao@teste.com',
    senha: '123456',
    genero: 'Masculino',
    celular: '11999999999',
    endereco: {
      cep: '01234567',
      logradouro: 'Rua Teste',
      numero: '123',
      complemento: 'Apt 45',
      bairro: 'Centro',
      cidade: 'São Paulo',
      uf: 'SP'
    }
  });

  // Estados para login
  const [loginForm, setLoginForm] = useState<LoginData>({
    email: 'joao@teste.com',
    senha: '123456'
  });

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await cadastrar(cadastroForm);
      setResult(result);
      console.log('Cadastro realizado:', result);
    } catch (err) {
      console.error('Erro no cadastro:', err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login(loginForm);
      setResult(result);
      console.log('Login realizado:', result);
    } catch (err) {
      console.error('Erro no login:', err);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Teste da API de Autenticação</h1>
      
      {error && (
        <Alert className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Resultado da API</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </CardContent>
        </Card>
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
              <CardDescription>
                Teste do endpoint POST /cadastro
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCadastro} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome">Nome</Label>
                    <Input
                      id="nome"
                      value={cadastroForm.nome}
                      onChange={(e) => setCadastroForm({...cadastroForm, nome: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sobrenome">Sobrenome</Label>
                    <Input
                      id="sobrenome"
                      value={cadastroForm.sobrenome}
                      onChange={(e) => setCadastroForm({...cadastroForm, sobrenome: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={cadastroForm.email}
                    onChange={(e) => setCadastroForm({...cadastroForm, email: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="cpf">CPF</Label>
                    <Input
                      id="cpf"
                      value={cadastroForm.cpf}
                      onChange={(e) => setCadastroForm({...cadastroForm, cpf: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dataNascimento">Data Nascimento</Label>
                    <Input
                      id="dataNascimento"
                      type="date"
                      value={cadastroForm.dataNascimento}
                      onChange={(e) => setCadastroForm({...cadastroForm, dataNascimento: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cns">CNS</Label>
                    <Input
                      id="cns"
                      value={cadastroForm.cns}
                      onChange={(e) => setCadastroForm({...cadastroForm, cns: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="senha">Senha</Label>
                  <Input
                    id="senha"
                    type="password"
                    value={cadastroForm.senha}
                    onChange={(e) => setCadastroForm({...cadastroForm, senha: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Endereço</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <Input
                      placeholder="CEP"
                      value={cadastroForm.endereco.cep}
                      onChange={(e) => setCadastroForm({...cadastroForm, endereco: {...cadastroForm.endereco, cep: e.target.value}})}
                    />
                    <Input
                      placeholder="Cidade"
                      value={cadastroForm.endereco.cidade}
                      onChange={(e) => setCadastroForm({...cadastroForm, endereco: {...cadastroForm.endereco, cidade: e.target.value}})}
                    />
                    <Input
                      placeholder="UF"
                      value={cadastroForm.endereco.uf}
                      onChange={(e) => setCadastroForm({...cadastroForm, endereco: {...cadastroForm.endereco, uf: e.target.value}})}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Cadastrando...' : 'Cadastrar'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login de Usuário</CardTitle>
              <CardDescription>
                Teste do endpoint POST /login
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="login-senha">Senha</Label>
                  <Input
                    id="login-senha"
                    type="password"
                    value={loginForm.senha}
                    onChange={(e) => setLoginForm({...loginForm, senha: e.target.value})}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Fazendo login...' : 'Login'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}