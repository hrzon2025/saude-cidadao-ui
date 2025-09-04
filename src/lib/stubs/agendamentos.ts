import { Agendamento, Unidade, Profissional, TipoConsulta, HorarioDisponivel } from '@/lib/types';

// Mock data - Agendamentos
export const mockAgendamentos: Agendamento[] = [
  {
    id: '1',
    data: '2024-01-15',
    hora: '08:30',
    tipo: 'Consulta Clínica Geral',
    profissional: 'Dr. João Silva',
    unidade: 'UBS Centro',
    status: 'Agendado',
    observacoes: 'Primeira consulta'
  },
  {
    id: '2',
    data: '2024-01-20',
    hora: '14:00',
    tipo: 'Consulta Cardiológica',
    profissional: 'Dra. Maria Santos',
    unidade: 'Hospital Municipal',
    status: 'Agendado'
  },
  {
    id: '3',
    data: '2024-01-10',
    hora: '09:15',
    tipo: 'Consulta Pediátrica',
    profissional: 'Dr. Carlos Lima',
    unidade: 'UBS Vila Nova',
    status: 'Cancelado',
    observacoes: 'Cancelado pelo paciente'
  },
  {
    id: '4',
    data: '2024-01-25',
    hora: '10:30',
    tipo: 'Consulta Ginecológica',
    profissional: 'Dra. Ana Costa',
    unidade: 'UBS Centro',
    status: 'Agendado'
  },
  {
    id: '5',
    data: '2024-02-01',
    hora: '16:45',
    tipo: 'Consulta Dermatológica',
    profissional: 'Dr. Pedro Oliveira',
    unidade: 'Hospital Municipal',
    status: 'Agendado'
  },
  {
    id: '6',
    data: '2024-01-12',
    hora: '11:00',
    tipo: 'Consulta Clínica Geral',
    profissional: 'Dra. Lucia Ferreira',
    unidade: 'UBS Vila Nova',
    status: 'Cancelado'
  }
];

// Mock data - Unidades
export const mockUnidades: Unidade[] = [
  {
    id: '1',
    nome: 'UBS Centro',
    endereco: 'Rua Central, 123 - Centro',
    telefone: '(11) 3333-1111'
  },
  {
    id: '2',
    nome: 'UBS Vila Nova',
    endereco: 'Av. Vila Nova, 456 - Vila Nova',
    telefone: '(11) 3333-2222'
  },
  {
    id: '3',
    nome: 'Hospital Municipal',
    endereco: 'Rua da Saúde, 789 - Jardim América',
    telefone: '(11) 3333-3333'
  }
];

// Mock data - Profissionais
export const mockProfissionais: Profissional[] = [
  {
    id: '1',
    nome: 'Dr. João Silva',
    especialidade: 'Clínica Geral',
    crm: 'CRM/SP 12345',
    unidadeId: '1'
  },
  {
    id: '2',
    nome: 'Dra. Maria Santos',
    especialidade: 'Cardiologia',
    crm: 'CRM/SP 23456',
    unidadeId: '3'
  },
  {
    id: '3',
    nome: 'Dr. Carlos Lima',
    especialidade: 'Pediatria',
    crm: 'CRM/SP 34567',
    unidadeId: '2'
  },
  {
    id: '4',
    nome: 'Dra. Ana Costa',
    especialidade: 'Ginecologia',
    crm: 'CRM/SP 45678',
    unidadeId: '1'
  },
  {
    id: '5',
    nome: 'Dr. Pedro Oliveira',
    especialidade: 'Dermatologia',
    crm: 'CRM/SP 56789',
    unidadeId: '3'
  },
  {
    id: '6',
    nome: 'Dra. Lucia Ferreira',
    especialidade: 'Clínica Geral',
    crm: 'CRM/SP 67890',
    unidadeId: '2'
  }
];

// Mock data - Tipos de Consulta
export const mockTiposConsulta: TipoConsulta[] = [
  {
    id: '1',
    nome: 'Consulta Clínica Geral',
    duracao: 30
  },
  {
    id: '2',
    nome: 'Consulta Cardiológica',
    duracao: 45
  },
  {
    id: '3',
    nome: 'Consulta Pediátrica',
    duracao: 30
  },
  {
    id: '4',
    nome: 'Consulta Ginecológica',
    duracao: 45
  },
  {
    id: '5',
    nome: 'Consulta Dermatológica',
    duracao: 30
  },
  {
    id: '6',
    nome: 'Consulta Psicológica',
    duracao: 60
  }
];

// Mock data - Horários (exemplo para um dia)
export const mockHorariosDisponiveis: HorarioDisponivel[] = [
  { hora: '08:00', disponivel: true },
  { hora: '08:30', disponivel: false },
  { hora: '09:00', disponivel: true },
  { hora: '09:30', disponivel: true },
  { hora: '10:00', disponivel: false },
  { hora: '10:30', disponivel: true },
  { hora: '11:00', disponivel: true },
  { hora: '11:30', disponivel: false },
  { hora: '14:00', disponivel: true },
  { hora: '14:30', disponivel: true },
  { hora: '15:00', disponivel: false },
  { hora: '15:30', disponivel: true },
  { hora: '16:00', disponivel: true },
  { hora: '16:30', disponivel: false },
  { hora: '17:00', disponivel: true },
  { hora: '17:30', disponivel: true }
];

// Helper functions
export const obterAgendamentos = async (status?: 'Agendado' | 'Cancelado', busca?: string): Promise<Agendamento[]> => {
  // TODO: Implementar chamada real para API /api/agendamentos
  await new Promise(resolve => setTimeout(resolve, 500)); // Simula delay
  
  let agendamentos = [...mockAgendamentos];
  
  if (status) {
    agendamentos = agendamentos.filter(a => a.status === status);
  }
  
  if (busca) {
    const buscarPor = busca.toLowerCase();
    agendamentos = agendamentos.filter(a => 
      a.tipo.toLowerCase().includes(buscarPor) ||
      a.profissional.toLowerCase().includes(buscarPor) ||
      a.unidade.toLowerCase().includes(buscarPor)
    );
  }
  
  return agendamentos.sort((a, b) => new Date(`${a.data}T${a.hora}`).getTime() - new Date(`${b.data}T${b.hora}`).getTime());
};

export const obterUnidades = async (): Promise<Unidade[]> => {
  // TODO: Implementar chamada real para API /api/unidades
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...mockUnidades];
};

export const obterProfissionaisPorUnidade = async (unidadeId: string): Promise<Profissional[]> => {
  // TODO: Implementar chamada real para API /api/profissionais?unidade=${unidadeId}
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockProfissionais.filter(p => p.unidadeId === unidadeId);
};

export const obterTiposConsulta = async (): Promise<TipoConsulta[]> => {
  // TODO: Implementar chamada real para API /api/tipos-consulta
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...mockTiposConsulta];
};

export const obterHorariosDisponiveis = async (
  unidadeId: string, 
  profissionalId: string, 
  data: string
): Promise<HorarioDisponivel[]> => {
  // TODO: Implementar chamada real para API /api/horarios-disponiveis
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Simula variação de horários baseado nos parâmetros
  const baseHorarios = [...mockHorariosDisponiveis];
  
  // Simula alguns horários indisponíveis baseado na data/profissional
  return baseHorarios.map(h => ({
    ...h,
    disponivel: h.disponivel && Math.random() > 0.3 // 30% chance de ficar indisponível
  }));
};

export const criarAgendamento = async (novoAgendamento: any): Promise<{ success: boolean; agendamentoId?: string; error?: string }> => {
  // TODO: Implementar chamada real para API POST /api/agendamentos
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simula sucesso na maioria dos casos
  if (Math.random() > 0.1) {
    return {
      success: true,
      agendamentoId: `ag_${Date.now()}`
    };
  } else {
    return {
      success: false,
      error: 'Horário não disponível. Tente outro horário.'
    };
  }
};

export const cancelarAgendamento = async (agendamentoId: string): Promise<{ success: boolean; error?: string }> => {
  // TODO: Implementar chamada real para API DELETE /api/agendamentos/${agendamentoId}
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    success: true
  };
};