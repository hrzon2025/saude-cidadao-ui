// Mock data for vaccination module

export interface Vacina {
  id: string;
  nome: string;
  descricao: string;
  descricaoDetalhada?: string;
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
    dataAplicacao: '2024-01-15',
    descricaoDetalhada: 'Protege contra as formas graves de tuberculose, principalmente meningite tuberculosa e tuberculose disseminada.'
  },
  {
    id: '2', 
    nome: 'Hepatite B',
    descricao: 'Hepatite B',
    faixaEtaria: 'ao_nascimento',
    doses: 1,
    status: 'aplicada',
    dataAplicacao: '2024-01-15',
    descricaoDetalhada: 'Previne a hepatite B, infecção viral que afeta o fígado e pode causar cirrose e câncer hepático.'
  },

  // 2 meses
  {
    id: '3',
    nome: 'Pentavalente (DTP+HiB+HepB)',
    descricao: 'Difteria, Tétano, Coqueluche, Haemophilus influenzae b, Hepatite B',
    faixaEtaria: '2_meses',
    doses: 3,
    status: 'aplicada',
    dataAplicacao: '2024-03-15',
    descricaoDetalhada: 'Protege contra cinco doenças importantes: difteria, tétano, coqueluche, meningite por Haemophilus e hepatite B.'
  },
  {
    id: '4',
    nome: 'VIP (Poliomielite inativada)',
    descricao: 'Poliomielite',
    faixaEtaria: '2_meses',
    doses: 3,
    status: 'aplicada',
    dataAplicacao: '2024-03-15',
    descricaoDetalhada: 'Previne a poliomielite (paralisia infantil), doença viral que pode causar paralisia permanente dos membros.'
  },
  {
    id: '5',
    nome: 'Rotavírus',
    descricao: 'Rotavírus',
    faixaEtaria: '2_meses',
    doses: 2,
    status: 'aplicada',
    dataAplicacao: '2024-03-15',
    descricaoDetalhada: 'Protege contra gastroenterite por rotavírus, principal causa de diarreia grave em crianças menores de 5 anos.'
  },

  // 4 meses
  {
    id: '6',
    nome: 'Pentavalente (DTP+HiB+HepB)',
    descricao: 'Difteria, Tétano, Coqueluche, Haemophilus influenzae b, Hepatite B - 2ª dose',
    faixaEtaria: '4_meses',
    doses: 3,
    status: 'aplicada',
    dataAplicacao: '2024-05-15',
    descricaoDetalhada: 'Segunda dose da vacina que protege contra difteria, tétano, coqueluche, meningite por Haemophilus e hepatite B.'
  },
  {
    id: '7',
    nome: 'VIP (Poliomielite inativada)',
    descricao: 'Poliomielite - 2ª dose',
    faixaEtaria: '4_meses',
    doses: 3,
    status: 'aplicada',
    dataAplicacao: '2024-05-15',
    descricaoDetalhada: 'Segunda dose da vacina contra poliomielite, reforçando a proteção contra a paralisia infantil.'
  },
  {
    id: '8',
    nome: 'Rotavírus',
    descricao: 'Rotavírus - 2ª dose',
    faixaEtaria: '4_meses',
    doses: 2,
    status: 'recomendada',
    proximaDose: '2024-12-15',
    descricaoDetalhada: 'Segunda dose da vacina contra rotavírus, completando a proteção contra diarreia grave causada por este vírus.'
  },

  // 6 meses
  {
    id: '9',
    nome: 'Pentavalente (DTP+HiB+HepB)',
    descricao: 'Difteria, Tétano, Coqueluche, Haemophilus influenzae b, Hepatite B - 3ª dose',
    faixaEtaria: '6_meses',
    doses: 3,
    status: 'recomendada',
    proximaDose: '2024-12-20',
    descricaoDetalhada: 'Terceira dose que completa o esquema básico de proteção contra as cinco doenças contempladas.'
  },
  {
    id: '10',
    nome: 'VIP (Poliomielite inativada)',
    descricao: 'Poliomielite - 3ª dose',
    faixaEtaria: '6_meses',
    doses: 3,
    status: 'recomendada',
    proximaDose: '2024-12-20',
    descricaoDetalhada: 'Terceira dose que completa o esquema básico de proteção contra a poliomielite.'
  },

  // 12 meses
  {
    id: '11',
    nome: 'Tríplice Viral (SCR)',
    descricao: 'Sarampo, Caxumba, Rubéola',
    faixaEtaria: '12_meses',
    doses: 2,
    status: 'recomendada',
    proximaDose: '2024-12-25',
    descricaoDetalhada: 'Protege contra sarampo, caxumba e rubéola, doenças virais com potencial de complicações graves.'
  },
  {
    id: '12',
    nome: 'Pneumocócica 10',
    descricao: 'Pneumonia, Otite, Meningite por Pneumococo',
    faixaEtaria: '12_meses',
    doses: 1,
    status: 'recomendada',
    proximaDose: '2024-12-25',
    descricaoDetalhada: 'Reforço que protege contra infecções pneumocócicas, incluindo pneumonia, otite e meningite bacteriana.'
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
    observacoes: 'Reforço a cada 10 anos',
    descricaoDetalhada: 'Mantém a proteção contra difteria e tétano em adultos. Recomendada a cada 10 anos.'
  },
  {
    id: '14',
    nome: 'Hepatite B',
    descricao: 'Hepatite B - Adulto',
    faixaEtaria: 'adulto',
    doses: 3,
    status: 'aplicada',
    dataAplicacao: '2023-02-15',
    descricaoDetalhada: 'Esquema completo de proteção contra hepatite B para adultos não vacinados na infância.'
  },
  {
    id: '15',
    nome: 'Febre Amarela',
    descricao: 'Febre Amarela',
    faixaEtaria: 'adulto',
    doses: 1,
    status: 'recomendada',
    proximaDose: '2024-12-01',
    descricaoDetalhada: 'Protege contra febre amarela, doença viral transmitida por mosquitos em áreas de risco.'
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
    observacoes: 'Anual',
    descricaoDetalhada: 'Vacina anual contra os vírus da gripe mais circulantes, prevenindo complicações respiratórias graves.'
  },
  {
    id: '17',
    nome: 'Pneumocócica 23',
    descricao: 'Pneumonia por Pneumococo',
    faixaEtaria: 'idoso',
    doses: 1,
    status: 'recomendada',
    proximaDose: '2024-12-30',
    descricaoDetalhada: 'Protege idosos contra 23 tipos de pneumococo, reduzindo risco de pneumonia e outras infecções graves.'
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