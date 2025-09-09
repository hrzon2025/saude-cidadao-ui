import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CadastroData {
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
    complemento?: string;
    bairro: string;
    cidade: string;
    uf: string;
  };
}

export interface LoginData {
  email: string;
  senha: string;
}

export interface UserProfile {
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
    complemento?: string;
    bairro: string;
    cidade: string;
    uf: string;
  };
}

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cadastrar = async (data: CadastroData) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      
      // Adicionar dados básicos
      formData.append('cpf', data.cpf);
      formData.append('dataNascimento', data.dataNascimento);
      formData.append('cns', data.cns);
      formData.append('nome', data.nome);
      formData.append('sobrenome', data.sobrenome);
      formData.append('email', data.email);
      formData.append('senha', data.senha);
      formData.append('genero', data.genero);
      formData.append('celular', data.celular);
      
      // Adicionar foto se fornecida
      if (data.foto) {
        formData.append('foto', data.foto);
      }
      
      // Adicionar dados do endereço
      formData.append('cep', data.endereco.cep);
      formData.append('logradouro', data.endereco.logradouro);
      formData.append('numero', data.endereco.numero);
      formData.append('complemento', data.endereco.complemento || '');
      formData.append('bairro', data.endereco.bairro);
      formData.append('cidade', data.endereco.cidade);
      formData.append('uf', data.endereco.uf);

      const { data: result, error } = await supabase.functions.invoke('cadastro', {
        body: formData,
      });

      if (error) {
        throw error;
      }

      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro no cadastro';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: LoginData) => {
    setLoading(true);
    setError(null);

    try {
      const { data: result, error } = await supabase.functions.invoke('login', {
        body: { email: data.email, senha: data.senha },
      });

      if (error) {
        throw error;
      }

      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro no login';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    cadastrar,
    login,
    logout,
    loading,
    error,
  };
};