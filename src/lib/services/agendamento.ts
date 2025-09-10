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
      equipeId: parseInt(equipeId) // Converter para number
    }
  });

  console.log('Resposta da edge function consultar-tipo:', { data, error });

  if (error) {
    console.error('Erro na edge function consultar-tipo:', error);
    throw new Error(error.message || 'Erro ao consultar tipos de consulta');
  }

  // A API retorna { "tiposConsulta": [...] }
  const tipos = data?.tiposConsulta || [];
  console.log('Tipos processados:', tipos);
  return Array.isArray(tipos) ? tipos : [];
};

export const consultarProfissionais = async (tipoConsultaId: string, equipeId: string): Promise<Profissional[]> => {
  console.log('Chamando edge function consultar-profissional:', { tipoConsultaId, equipeId });
  
  const { data, error } = await supabase.functions.invoke('consultar-profissional', {
    body: {
      tipoConsultaId: parseInt(tipoConsultaId),
      equipeId: parseInt(equipeId),
      especialidade: 1
    }
  });

  console.log('Resposta da edge function consultar-profissional:', { data, error });

  if (error) {
    console.error('Erro na edge function consultar-profissional:', error);
    throw new Error(error.message || 'Erro ao consultar profissionais');
  }

  // A API retorna { "profissionais": [...] }
  const profissionais = data?.profissionais || [];
  console.log('Profissionais processados:', profissionais);
  return Array.isArray(profissionais) ? profissionais : [];
};