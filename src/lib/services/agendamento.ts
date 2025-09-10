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
  console.log('Chamando edge function consultar-usuario com:', { cpf, dataNascimento, cns });
  
  const { data, error } = await supabase.functions.invoke('consultar-usuario', {
    body: {
      cpf,
      dataNascimento,
      cns: cns || ""
    }
  });

  console.log('Resposta da edge function:', { data, error });

  if (error) {
    console.error('Erro na edge function:', error);
    throw new Error(error.message || 'Erro ao consultar usuário');
  }

  // A API retorna um array, pegamos o primeiro item
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.error('Dados inválidos recebidos:', data);
    throw new Error('Nenhum dados de usuário encontrado');
  }

  const userData = data[0];
  console.log('Primeiro item dos dados:', userData);
  
  if (!userData.unidade) {
    console.error('userData.unidade não existe:', userData);
    throw new Error('Dados da unidade não encontrados na resposta da API');
  }
  
  if (!userData.equipe) {
    console.error('userData.equipe não existe:', userData);
    throw new Error('Dados da equipe não encontrados na resposta da API');
  }

  return userData;
};

export const consultarTipos = async (equipeId: string): Promise<TipoConsulta[]> => {
  console.log('Chamando edge function consultar-tipo com equipeId:', equipeId);
  
  const { data, error } = await supabase.functions.invoke('consultar-tipo', {
    body: {
      equipeId
    }
  });

  console.log('Resposta da edge function consultar-tipo:', { data, error });

  if (error) {
    console.error('Erro na edge function consultar-tipo:', error);
    throw new Error(error.message || 'Erro ao consultar tipos de consulta');
  }

  const tipos = Array.isArray(data) ? data : [];
  console.log('Tipos processados:', tipos);
  return tipos;
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