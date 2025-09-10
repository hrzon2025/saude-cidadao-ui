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

// Interfaces específicas para a tela de confirmação (usando dados do stub/lib)
export interface ProfissionalConfirmacao {
  id: string;
  nome: string;
  especialidade: string;
  crm: string;
  unidadeId: string;
}

export interface TipoConsultaConfirmacao {
  id: string;
  nome: string;
  duracao: number;
  descricao?: string;
  icone?: string;
  especialidadeId?: string;
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

export interface DataHorariosResponse {
  mensagem?: string;
  equipeId?: number;
  profissionais?: Array<{
    profissionalId: number;
    data: string;
    hora: string[];
  }>;
}

export const consultarDataHorarios = async (equipeId: string, profissionalId: string, data: string): Promise<DataHorariosResponse> => {
  console.log('Chamando edge function consultar-data-horarios:', { equipeId, profissionalId, data });
  
  const { data: responseData, error } = await supabase.functions.invoke('consultar-data-horarios', {
    body: {
      equipeId: parseInt(equipeId),
      profissionalId: parseInt(profissionalId),
      data: data
    }
  });

  console.log('Resposta da edge function consultar-data-horarios:', { data: responseData, error });

  if (error) {
    console.error('Erro na edge function consultar-data-horarios:', error);
    throw new Error(error.message || 'Erro ao consultar data e horários');
  }

  return responseData || {};
};

export interface AgendarConsultaResponse {
  atendimentoId?: string;
  mensagem?: string;
}

export interface AgendamentoStatusResponse {
  id?: string;
  unidade?: string;
  equipe?: string;
  tipoConsulta?: string;
  profissional?: string;
  data?: string;
  status?: string;
  observacoes?: string;
  motivo?: string;
}

export const consultarAgendamentosStatus = async (
  situacaoId: number[],
  dataInicio: string,
  dataFinal: string,
  individuoID: string,
  pagina: number = 1
): Promise<AgendamentoStatusResponse[]> => {
  console.log('Chamando edge function consultar-agendamentos-status:', { 
    situacaoId, dataInicio, dataFinal, individuoID, pagina 
  });
  
  const { data, error } = await supabase.functions.invoke('consultar-agendamentos-status', {
    body: {
      situacaoId,
      dataInicio,
      dataFinal,
      individuoID,
      pagina
    }
  });

  console.log('Resposta da edge function consultar-agendamentos-status:', { data, error });

  if (error) {
    console.error('Erro na edge function consultar-agendamentos-status:', error);
    throw new Error(error.message || 'Erro ao consultar agendamentos');
  }

  return Array.isArray(data) ? data : [];
};

export const agendarConsulta = async (dados: {
  unidadeId: string;
  profissionalId: string;
  tipoConsultaId: string;
  equipeId: string;
  data: string;
  hora: string;
  individuoID: string;
  cns: string;
  cpf: string;
}): Promise<AgendarConsultaResponse> => {
  console.log('Chamando edge function agendar-consulta:', dados);
  
  const { data: result, error } = await supabase.functions.invoke('agendar-consulta', {
    body: dados
  });

  console.log('Resposta da edge function agendar-consulta:', { data: result, error });

  if (error) {
    console.error('Erro na edge function agendar-consulta:', error);
    throw new Error(error.message || 'Erro ao agendar consulta');
  }

  return result || {};
};