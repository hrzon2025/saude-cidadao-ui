import { supabase } from "@/integrations/supabase/client";

export interface ConsultarUsuarioResponse {
  unidade: {
    id: string;
    razaoSocial: string;
  };
  equipe: {
    id: string;
  };
}

export interface TipoConsulta {
  id: string;
  descricao: string;
}

export interface Profissional {
  id: string;
  descricao: string;
}

export const consultarUsuario = async (cpf: string, dataNascimento: string, cns?: string): Promise<ConsultarUsuarioResponse> => {
  const { data, error } = await supabase.functions.invoke('consultar-usuario', {
    body: {
      cpf,
      dataNascimento,
      cns: cns || ""
    }
  });

  if (error) {
    throw new Error(error.message || 'Erro ao consultar usuário');
  }

  // A API retorna um array, pegamos o primeiro item
  if (!data || !Array.isArray(data) || data.length === 0) {
    throw new Error('Nenhum dados de usuário encontrado');
  }

  return data[0];
};

export const consultarTipos = async (equipeId: string): Promise<TipoConsulta[]> => {
  const { data, error } = await supabase.functions.invoke('consultar-tipo', {
    body: {
      equipeId
    }
  });

  if (error) {
    throw new Error(error.message || 'Erro ao consultar tipos de consulta');
  }

  return Array.isArray(data) ? data : [];
};

export const consultarProfissionais = async (tipoConsultaId: string, equipeId: string): Promise<Profissional[]> => {
  const { data, error } = await supabase.functions.invoke('consultar-profissional', {
    body: {
      tipoConsultaId,
      equipeId,
      especialidade: 1
    }
  });

  if (error) {
    throw new Error(error.message || 'Erro ao consultar profissionais');
  }

  return Array.isArray(data) ? data : [];
};