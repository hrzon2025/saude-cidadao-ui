// Mock data para desenvolvimento
import { 
  Usuario, 
  Unidade, 
  Profissional, 
  TipoConsulta, 
  Agendamento, 
  Atendimento,
  Vacina,
  Medicamento,
  Farmacia,
  SolicitacaoRegulacao,
  FAQ,
  Servico
} from '../types';

export const mockUsuario: Usuario = {
  id: '1',
  nome: 'Maria Silva Santos',
  cpf: '123.456.789-00',
  cns: '123456789012345',
  dataNascimento: '1985-03-15',
  email: 'maria.silva@email.com',
  telefone: '(11) 98765-4321',
  endereco: 'Rua das Flores, 123 - Jardim Primavera - São Paulo/SP',
  preferencias: {
    notificacoes: true,
    biometria: false
  }
};

export const mockUnidades: Unidade[] = [
  {
    id: '1',
    nome: 'UBS Jardim Primavera',
    endereco: 'Av. Principal, 500 - Jardim Primavera',
    telefone: '(11) 3333-1111',
    horario: 'Segunda a Sexta: 7h às 17h',
    bairro: 'Jardim Primavera',
    tipo: 'UBS',
    geo: { lat: -23.5505, lng: -46.6333 }
  },
  {
    id: '2', 
    nome: 'UPA 24h Centro',
    endereco: 'Rua Central, 100 - Centro',
    telefone: '(11) 3333-2222',
    horario: '24 horas',
    bairro: 'Centro',
    tipo: 'UPA',
    geo: { lat: -23.5489, lng: -46.6388 }
  },
  {
    id: '3',
    nome: 'Hospital Municipal',
    endereco: 'Av. da Saúde, 1000 - Vila Nova',
    telefone: '(11) 3333-3333',
    horario: '24 horas',
    bairro: 'Vila Nova',
    tipo: 'Hospital',
    geo: { lat: -23.5520, lng: -46.6300 }
  },
  {
    id: '4',
    nome: 'UBS Vila Esperança',
    endereco: 'Rua da Esperança, 250 - Vila Esperança',
    telefone: '(11) 3333-4444',
    horario: 'Segunda a Sexta: 8h às 18h',
    bairro: 'Vila Esperança',
    tipo: 'UBS',
    geo: { lat: -23.5470, lng: -46.6280 }
  },
  {
    id: '5',
    nome: 'Centro de Especialidades',
    endereco: 'Av. Especializada, 800 - Distrito Médico',
    telefone: '(11) 3333-5555',
    horario: 'Segunda a Sexta: 7h às 19h',
    bairro: 'Distrito Médico',
    tipo: 'Centro de Especialidades',
    geo: { lat: -23.5500, lng: -46.6200 }
  }
];

export const mockProfissionais: Profissional[] = [
  {
    id: '1',
    nome: 'Dr. João Santos',
    especialidade: 'Clínico Geral',
    crm: 'CRM/SP 123456'
  },
  {
    id: '2',
    nome: 'Dra. Ana Oliveira',
    especialidade: 'Pediatra',
    crm: 'CRM/SP 234567'
  },
  {
    id: '3',
    nome: 'Dr. Carlos Lima',
    especialidade: 'Cardiologista',
    crm: 'CRM/SP 345678'
  },
  {
    id: '4',
    nome: 'Dra. Patricia Costa',
    especialidade: 'Ginecologista',
    crm: 'CRM/SP 456789'
  }
];

export const mockTiposConsulta: TipoConsulta[] = [
  {
    id: '1',
    nome: 'Consulta Clínica Geral',
    descricao: 'Consulta com médico clínico geral',
    icone: 'stethoscope'
  },
  {
    id: '2',
    nome: 'Consulta Pediátrica',  
    descricao: 'Consulta com pediatra',
    icone: 'baby'
  },
  {
    id: '3',
    nome: 'Consulta Cardiológica',
    descricao: 'Consulta com cardiologista',
    icone: 'heart'
  },
  {
    id: '4',
    nome: 'Consulta Ginecológica',
    descricao: 'Consulta com ginecologista',
    icone: 'user-check'
  }
];

export const mockAtendimentos: Atendimento[] = [
  {
    id: '1',
    data: '2024-01-25',
    hora: '10:30',
    tipo: 'Consulta Clínica Geral',
    profissional: 'Dr. João Santos',
    unidade: 'UBS Jardim Primavera',
    status: 'Agendado'
  },
  {
    id: '2',
    data: '2024-01-30',
    hora: '14:00',
    tipo: 'Consulta Pediátrica',
    profissional: 'Dra. Ana Oliveira',
    unidade: 'UPA 24h Centro',
    status: 'Agendado'
  },
  {
    id: '3',
    data: '2024-01-10',
    hora: '09:15',
    tipo: 'Consulta Cardiológica',
    profissional: 'Dr. Carlos Lima',
    unidade: 'Centro de Especialidades',
    status: 'Realizado',
    podeAvaliar: true
  },
  {
    id: '4',
    data: '2024-01-08',
    hora: '16:30',
    tipo: 'Consulta Clínica Geral',
    profissional: 'Dr. João Santos',
    unidade: 'UBS Vila Esperança',
    status: 'Cancelado'
  },
  {
    id: '5',
    data: '2024-02-15',
    hora: '11:00',
    tipo: 'Consulta Ginecológica',
    profissional: 'Dra. Patricia Costa',
    unidade: 'Centro de Especialidades',
    status: 'Agendado'
  },
  {
    id: '6',
    data: '2024-01-18',
    hora: '08:30',
    tipo: 'Consulta Clínica Geral',
    profissional: 'Dr. João Santos',
    unidade: 'UBS Jardim Primavera',
    status: 'Realizado',
    podeAvaliar: false
  }
];

export const mockVacinas: Vacina[] = [
  {
    id: '1',
    nome: 'COVID-19 (Pfizer)',
    dataAplicacao: '2023-12-15',
    status: 'Aplicada',
    lote: 'ABC123'
  },
  {
    id: '2',
    nome: 'Influenza 2024',
    dataAplicacao: '2024-01-10',
    status: 'Aplicada',
    lote: 'FLU456'
  },
  {
    id: '3',
    nome: 'Hepatite B',
    proximaDose: '2024-06-15',
    status: 'Recomendada'
  }
];

export const mockMedicamentos: Medicamento[] = [
  {
    id: '1',
    nome: 'Losartan 50mg',
    posologia: '1 comprimido pela manhã',
    prescritoEm: '2024-01-10',
    ativo: true,
    medico: 'Dr. Carlos Lima',
    observacoes: 'Para controle da pressão arterial'
  },
  {
    id: '2',
    nome: 'Metformina 850mg',
    posologia: '1 comprimido 2x ao dia',
    prescritoEm: '2024-01-10',
    ativo: true,
    medico: 'Dr. João Santos',
    observacoes: 'Tomar com as refeições'
  },
  {
    id: '3',
    nome: 'Amoxicilina 500mg',
    posologia: '1 comprimido 3x ao dia',
    prescritoEm: '2023-12-20',
    ativo: false,
    medico: 'Dr. João Santos',
    observacoes: 'Tratamento concluído'
  }
];

export const mockFarmacias: Farmacia[] = [
  {
    id: '1',
    nome: 'Farmácia Popular Centro',
    endereco: 'Rua Central, 50 - Centro',
    telefone: '(11) 4444-1111',
    horario: 'Segunda a Sábado: 8h às 22h',
    geo: { lat: -23.5489, lng: -46.6388 },
    temEstoque: true
  },
  {
    id: '2',
    nome: 'Drogaria Vila Nova',
    endereco: 'Av. Principal, 300 - Vila Nova',
    telefone: '(11) 4444-2222',
    horario: 'Segunda a Domingo: 7h às 23h',
    geo: { lat: -23.5520, lng: -46.6300 },
    temEstoque: true
  }
];

export const mockSolicitacoesRegulacao: SolicitacaoRegulacao[] = [
  {
    id: '1',
    tipo: 'Consulta Neurológica',
    medico: 'Dr. João Santos',
    dataSolicitacao: '2024-01-10',
    status: 'Em análise',
    observacoes: 'Urgente - dores de cabeça frequentes'
  },
  {
    id: '2',
    tipo: 'Ressonância Magnética',
    medico: 'Dr. Carlos Lima',
    dataSolicitacao: '2024-01-05',
    status: 'Aguardando vaga',
    observacoes: 'Exame de rotina'
  }
];

export const mockFAQs: FAQ[] = [
  {
    id: '1',
    categoria: 'Agendamentos',
    pergunta: 'Como agendar uma consulta?',
    resposta: 'Você pode agendar através do app, selecionando a unidade, profissional e horário disponível.'
  },
  {
    id: '2',
    categoria: 'Agendamentos',
    pergunta: 'Posso cancelar uma consulta?',
    resposta: 'Sim, você pode cancelar até 24 horas antes do horário marcado.'
  },
  {
    id: '3',
    categoria: 'Cartão SUS',
    pergunta: 'Como obter meu Cartão SUS?',
    resposta: 'Procure qualquer UBS com RG, CPF e comprovante de residência.'
  },
  {
    id: '4',
    categoria: 'Medicamentos',
    pergunta: 'Como retirar medicamentos na farmácia popular?',
    resposta: 'Apresente o Cartão SUS e a receita médica válida.'
  }
];

export const mockServicos: Servico[] = [
  {
    id: '1',
    nome: 'Consultas Médicas',
    descricao: 'Atendimento com diversos especialistas',
    icone: 'stethoscope',
    categoria: 'Consultas'
  },
  {
    id: '2',
    nome: 'Curativos e Procedimentos',
    descricao: 'Procedimentos de enfermagem',
    icone: 'bandage',
    categoria: 'Enfermagem'
  },
  {
    id: '3',
    nome: 'Acompanhamento de Hipertensão',
    descricao: 'Controle de pressão arterial',
    icone: 'heart-pulse',
    categoria: 'Doenças crônicas'
  },
  {
    id: '4',
    nome: 'Imunização',
    descricao: 'Vacinas do calendário nacional',
    icone: 'syringe',
    categoria: 'Vacinação'
  }
];

// Helpers para simulação
export const simulateLatency = (min = 500, max = 1200) => 
  new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min));

export const simulateError = (errorRate = 0.1) => Math.random() < errorRate;