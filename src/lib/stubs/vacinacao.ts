// Mock data for vaccination module

export interface Vacina {
  id: string;
  nome: string;
  descricao: string;
  faixaEtaria: FaixaEtaria;
  doses: number;
  status: 'aplicada' | 'recomendada' | 'atrasada';
  dataAplicacao?: string;
  proximaDose?: string;
  observacoes?: string;
}

export type FaixaEtaria = 
  | 'ao_nascimento'
  | '2_meses' 
  | '4_meses'
  | '6_meses'
  | '12_meses'
  | 'adulto'
  | 'idoso';

export const FAIXAS_ETARIAS: Record<FaixaEtaria, string> = {
  ao_nascimento: 'Ao Nascimento',
  '2_meses': '2 Meses',
  '4_meses': '4 Meses', 
  '6_meses': '6 Meses',
  '12_meses': '12 Meses',
  adulto: 'Adulto',
  idoso: 'Idoso (60+)'
};

// Mock vaccination calendar
export const CALENDARIO_VACINACAO: Vacina[] = [
  // Ao nascimento
  {
    id: '1',
    nome: 'BCG',
    descricao: 'Tuberculose',
    faixaEtaria: 'ao_nascimento',
    doses: 1,
    status: 'aplicada',
    dataAplicacao: '2024-01-15'
  },
  {
    id: '2', 
    nome: 'Hepatite B',
    descricao: 'Hepatite B',
    faixaEtaria: 'ao_nascimento',
    doses: 1,
    status: 'aplicada',
    dataAplicacao: '2024-01-15'
  },

  // 2 meses
  {
    id: '3',
    nome: 'Pentavalente (DTP+HiB+HepB)',
    descricao: 'Difteria, Tétano, Coqueluche, Haemophilus influenzae b, Hepatite B',
    faixaEtaria: '2_meses',
    doses: 3,
    status: 'aplicada',
    dataAplicacao: '2024-03-15'
  },
  {
    id: '4',
    nome: 'VIP (Poliomielite inativada)',
    descricao: 'Poliomielite',
    faixaEtaria: '2_meses',
    doses: 3,
    status: 'aplicada',
    dataAplicacao: '2024-03-15'
  },
  {
    id: '5',
    nome: 'Rotavírus',
    descricao: 'Rotavírus',
    faixaEtaria: '2_meses',
    doses: 2,
    status: 'aplicada',
    dataAplicacao: '2024-03-15'
  },

  // 4 meses
  {
    id: '6',
    nome: 'Pentavalente (DTP+HiB+HepB)',
    descricao: 'Difteria, Tétano, Coqueluche, Haemophilus influenzae b, Hepatite B - 2ª dose',
    faixaEtaria: '4_meses',
    doses: 3,
    status: 'aplicada',
    dataAplicacao: '2024-05-15'
  },
  {
    id: '7',
    nome: 'VIP (Poliomielite inativada)',
    descricao: 'Poliomielite - 2ª dose',
    faixaEtaria: '4_meses',
    doses: 3,
    status: 'aplicada',
    dataAplicacao: '2024-05-15'
  },
  {
    id: '8',
    nome: 'Rotavírus',
    descricao: 'Rotavírus - 2ª dose',
    faixaEtaria: '4_meses',
    doses: 2,
    status: 'recomendada',
    proximaDose: '2024-12-15'
  },

  // 6 meses
  {
    id: '9',
    nome: 'Pentavalente (DTP+HiB+HepB)',
    descricao: 'Difteria, Tétano, Coqueluche, Haemophilus influenzae b, Hepatite B - 3ª dose',
    faixaEtaria: '6_meses',
    doses: 3,
    status: 'recomendada',
    proximaDose: '2024-12-20'
  },
  {
    id: '10',
    nome: 'VIP (Poliomielite inativada)',
    descricao: 'Poliomielite - 3ª dose',
    faixaEtaria: '6_meses',
    doses: 3,
    status: 'recomendada',
    proximaDose: '2024-12-20'
  },

  // 12 meses
  {
    id: '11',
    nome: 'Tríplice Viral (SCR)',
    descricao: 'Sarampo, Caxumba, Rubéola',
    faixaEtaria: '12_meses',
    doses: 2,
    status: 'recomendada',
    proximaDose: '2024-12-25'
  },
  {
    id: '12',
    nome: 'Pneumocócica 10',
    descricao: 'Pneumonia, Otite, Meningite por Pneumococo',
    faixaEtaria: '12_meses',
    doses: 1,
    status: 'recomendada',
    proximaDose: '2024-12-25'
  },

  // Adulto
  {
    id: '13',
    nome: 'Dupla Adulto (dT)',
    descricao: 'Difteria e Tétano',
    faixaEtaria: 'adulto',
    doses: 1,
    status: 'aplicada',
    dataAplicacao: '2023-08-10',
    observacoes: 'Reforço a cada 10 anos'
  },
  {
    id: '14',
    nome: 'Hepatite B',
    descricao: 'Hepatite B - Adulto',
    faixaEtaria: 'adulto',
    doses: 3,
    status: 'aplicada',
    dataAplicacao: '2023-02-15'
  },
  {
    id: '15',
    nome: 'Febre Amarela',
    descricao: 'Febre Amarela',
    faixaEtaria: 'adulto',
    doses: 1,
    status: 'recomendada',
    proximaDose: '2024-12-01'
  },

  // Idoso
  {
    id: '16',
    nome: 'Influenza (Gripe)',
    descricao: 'Gripe sazonal',
    faixaEtaria: 'idoso',
    doses: 1,
    status: 'aplicada',
    dataAplicacao: '2024-04-20',
    observacoes: 'Anual'
  },
  {
    id: '17',
    nome: 'Pneumocócica 23',
    descricao: 'Pneumonia por Pneumococo',
    faixaEtaria: 'idoso',
    doses: 1,
    status: 'recomendada',
    proximaDose: '2024-12-30'
  }
];

// Get vaccines by age group
export const obterVacinasPorFaixaEtaria = async (faixaEtaria?: FaixaEtaria): Promise<Vacina[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (faixaEtaria) {
    return CALENDARIO_VACINACAO.filter(vacina => vacina.faixaEtaria === faixaEtaria);
  }
  
  return CALENDARIO_VACINACAO;
};

// Get all vaccines grouped by age
export const obterCalendarioVacinacao = async (): Promise<Record<FaixaEtaria, Vacina[]>> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const grouped: Record<FaixaEtaria, Vacina[]> = {
    ao_nascimento: [],
    '2_meses': [],
    '4_meses': [],
    '6_meses': [],
    '12_meses': [],
    adulto: [],
    idoso: []
  };
  
  CALENDARIO_VACINACAO.forEach(vacina => {
    grouped[vacina.faixaEtaria].push(vacina);
  });
  
  return grouped;
};

// Get vaccination history
export const obterHistoricoVacinacao = async (): Promise<Vacina[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return CALENDARIO_VACINACAO.filter(vacina => vacina.status === 'aplicada');
};

// Get units with vaccination room
export const obterUnidadesComVacinacao = async () => {
  // Import here to avoid circular dependency
  const { mockUnidades } = await import('./data');
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Filter units that have vaccination room (simulating this filter)
  return mockUnidades.filter((_, index) => index % 2 === 0); // Every other unit has vaccination
};