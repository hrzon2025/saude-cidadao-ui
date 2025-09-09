import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CadastroData {
  cpf: string;
  dataNascimento: string;
  cns: string;
  nome: string;
  sobrenome: string;
  email: string;
  senha: string;
  genero: string;
  celular: string;
  foto?: File;
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    uf: string;
  };
}

interface LoginData {
  email: string;
  senha: string;
}

interface Usuario {
  id: string;
  nome: string;
  sobrenome: string;
  email: string;
  cpf: string;
  data_nascimento: string;
  genero: string;
  celular: string;
  foto?: string;
  endereco?: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    uf: string;
  };
}

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cadastrar = async (data: CadastroData): Promise<Usuario | null> => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      
      // Adicionar todos os campos obrigatórios
      formData.append('cpf', data.cpf);
      formData.append('dataNascimento', data.dataNascimento);
      formData.append('cns', data.cns);
      formData.append('nome', data.nome);
      formData.append('sobrenome', data.sobrenome);
      formData.append('email', data.email);
      formData.append('senha', data.senha);
      formData.append('genero', data.genero);
      formData.append('celular', data.celular);
      
      // Adicionar campos do endereço
      formData.append('cep', data.endereco.cep);
      formData.append('logradouro', data.endereco.logradouro);
      formData.append('numero', data.endereco.numero);
      formData.append('complemento', data.endereco.complemento);
      formData.append('bairro', data.endereco.bairro);
      formData.append('cidade', data.endereco.cidade);
      formData.append('uf', data.endereco.uf);
      
      // Adicionar foto se fornecida
      if (data.foto) {
        formData.append('foto', data.foto);
      }

      const response = await supabase.functions.invoke('cadastro', {
        body: formData,
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      if (!response.data) {
        throw new Error('Erro no cadastro');
      }

      return response.data as Usuario;

    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: LoginData): Promise<{ user: Usuario; access_token: string; refresh_token: string } | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await supabase.functions.invoke('login', {
        body: {
          email: data.email,
          senha: data.senha,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      if (!response.data) {
        throw new Error('Erro no login');
      }

      return response.data;

    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    cadastrar,
    login,
    loading,
    error,
  };
};