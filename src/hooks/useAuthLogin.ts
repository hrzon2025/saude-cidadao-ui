import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
}

interface LoginResponse {
  token: string;
  user: Usuario;
}

export const useAuthLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (data: LoginData): Promise<LoginResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await supabase.functions.invoke('auth-login', {
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

      // Salvar token no localStorage para uso futuro
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user_data', JSON.stringify(response.data.user));
      }

      return response.data as LoginResponse;

    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  };

  const getStoredUser = (): Usuario | null => {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  };

  const getStoredToken = (): string | null => {
    return localStorage.getItem('auth_token');
  };

  const isAuthenticated = (): boolean => {
    const token = getStoredToken();
    return !!token;
  };

  return {
    login,
    logout,
    getStoredUser,
    getStoredToken,
    isAuthenticated,
    loading,
    error,
  };
};