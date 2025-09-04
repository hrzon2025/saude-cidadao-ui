// Tipos essenciais para o app Saúde Cidadão

export interface Unidade {
  id: string;
  nome: string;
  endereco: string;
  telefone: string;
  horario?: string;
  bairro?: string;
  tipo?: string;
  geo?: {
    lat: number;
    lng: number;
  };
}

export interface Profissional {
  id: string;
  nome: string;
  especialidade: string;
  crm: string;
  unidadeId: string;
}

export interface TipoConsulta {
  id: string;
  nome: string;
  duracao: number; // em minutos
  descricao?: string;
  icone?: string;
  especialidadeId?: string;
}

export interface Agendamento {
  id: string;
  data: string;
  hora: string;
  tipo: string;
  profissional: string;
  unidade: string;
  status: 'Agendado' | 'Cancelado';
  observacoes?: string;
}

export interface Atendimento {
  id: string;
  data: string;
  hora: string;
  tipo: string;
  profissional: string;
  unidade: string;
  status: 'Agendado' | 'Concluído' | 'Cancelado';
  podeAvaliar?: boolean;
  avaliacao?: Avaliacao;
}

export interface HorarioDisponivel {
  hora: string;
  disponivel: boolean;
}

export interface NovoAgendamento {
  unidadeId: string;
  profissionalId: string;
  tipoId: string;
  data: string;
  hora: string;
  observacoes?: string;
}

export type Avaliacao = {
  id: string;
  atendimentoId: string;
  nota: number;
  comentario?: string;
  createdAt: string;
  editableUntil?: string;
};

export type Vacina = {
  id: string;
  nome: string;
  dataAplicacao?: string;
  proximaDose?: string;
  status: 'Aplicada' | 'Recomendada' | 'Atrasada';
  lote?: string;
};

export type Medicamento = {
  id: string;
  nome: string;
  posologia: string;
  prescritoEm: string;
  ativo: boolean;
  medico?: string;
  observacoes?: string;
};

export type Usuario = {
  id: string;
  nome: string;
  cpf: string;
  cns?: string;
  dataNascimento: string;
  email: string;
  telefone?: string;
  endereco?: string;
  avatarUrl?: string;
  preferencias?: {
    notificacoes: boolean;
    biometria: boolean;
  };
};

export type Farmacia = {
  id: string;
  nome: string;
  endereco: string;
  telefone: string;
  horario: string;
  geo?: {
    lat: number;
    lng: number;
  };
  temEstoque?: boolean;
};

export type SolicitacaoRegulacao = {
  id: string;
  tipo: string;
  medico: string;
  dataSolicitacao: string;
  status: 'Em análise' | 'Aguardando vaga' | 'Autorizado' | 'Concluído';
  observacoes?: string;
};

export type FAQ = {
  id: string;
  categoria: string;
  pergunta: string;
  resposta: string;
};

export type Servico = {
  id: string;
  nome: string;
  descricao: string;
  icone: string;
  categoria: 'Consultas' | 'Enfermagem' | 'Doenças crônicas' | 'Vacinação';
};

export type OuvidoriaTicket = {
  id: string;
  protocolo: string;
  assunto: string;
  mensagem: string;
  email: string;
  status: 'Aberto' | 'Em andamento' | 'Resolvido';
  dataAbertura: string;
};

// Estados de UI
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export type FormErrors = Record<string, string>;

export type AppTab = 'inicio' | 'funcionalidades' | 'perfil';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';