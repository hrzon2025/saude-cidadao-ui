// Serviços "stub" para desenvolvimento (sem API real)
// TODO: Integrar com backend real substituindo essas funções

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
  Servico,
  Avaliacao,
  OuvidoriaTicket
} from '../types';

import {
  mockUsuario,
  mockUnidades,
  mockProfissionais,
  mockTiposConsulta,
  mockAtendimentos,
  mockVacinas,
  mockMedicamentos,
  mockFarmacias,
  mockSolicitacoesRegulacao,
  mockFAQs,
  mockServicos,
  simulateLatency,
  simulateError
} from './data';

// Auth Services
export async function loginUsuario(cpf: string, senha: string): Promise<Usuario> {
  // TODO: POST /api/auth/login
  await simulateLatency();
  
  if (simulateError(0.05)) {
    throw new Error('Credenciais inválidas');
  }
  
  return mockUsuario;
}

export async function cadastrarUsuario(dados: Partial<Usuario>): Promise<Usuario> {
  // TODO: POST /api/users
  await simulateLatency();
  
  if (simulateError(0.02)) {
    throw new Error('Erro ao cadastrar usuário');
  }
  
  return { ...mockUsuario, ...dados, id: Date.now().toString() };
}

export async function consultarUsuario(id: string): Promise<Usuario> {
  // TODO: GET /api/users/{id}
  await simulateLatency();
  
  if (simulateError()) {
    throw new Error('Usuário não encontrado');
  }
  
  return mockUsuario;
}

// Agendamento Services
export async function consultarUnidades(filtros?: { bairro?: string; tipo?: string }): Promise<Unidade[]> {
  // TODO: GET /api/unidades?bairro={bairro}&tipo={tipo}
  await simulateLatency();
  
  if (simulateError()) {
    throw new Error('Erro ao carregar unidades');
  }
  
  let unidades = mockUnidades;
  
  if (filtros?.bairro) {
    unidades = unidades.filter(u => u.bairro?.toLowerCase().includes(filtros.bairro!.toLowerCase()));
  }
  
  if (filtros?.tipo) {
    unidades = unidades.filter(u => u.tipo === filtros.tipo);
  }
  
  return unidades;
}

export async function consultarProfissionais(unidadeId: string): Promise<Profissional[]> {
  // TODO: GET /api/unidades/{unidadeId}/profissionais
  await simulateLatency();
  
  if (simulateError()) {
    throw new Error('Erro ao carregar profissionais');
  }
  
  return mockProfissionais;
}

export async function consultarTiposConsulta(): Promise<TipoConsulta[]> {
  // TODO: GET /api/tipos-consulta
  await simulateLatency();
  
  if (simulateError()) {
    throw new Error('Erro ao carregar tipos de consulta');
  }
  
  return mockTiposConsulta;
}

export async function consultarHorariosDisponiveis(
  unidadeId: string,
  profissionalId: string,
  data: string
): Promise<string[]> {
  // TODO: GET /api/agendamentos/horarios?unidade={unidadeId}&profissional={profissionalId}&data={data}
  await simulateLatency();
  
  if (simulateError()) {
    throw new Error('Erro ao carregar horários');
  }
  
  // Simula horários disponíveis
  const horarios = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];
  
  // Remove alguns horários aleatoriamente para simular ocupação
  return horarios.filter(() => Math.random() > 0.3);
}

export async function agendarConsulta(dados: {
  unidadeId: string;
  profissionalId: string;
  tipoConsultaId: string;
  data: string;
  hora: string;
}): Promise<Agendamento> {
  // TODO: POST /api/agendamentos
  await simulateLatency(800, 1500);
  
  if (simulateError(0.03)) {
    throw new Error('Erro ao agendar consulta. Tente novamente.');
  }
  
  const unidade = mockUnidades.find(u => u.id === dados.unidadeId)!;
  const profissional = mockProfissionais.find(p => p.id === dados.profissionalId)!;
  const tipo = mockTiposConsulta.find(t => t.id === dados.tipoConsultaId)!;
  
  return {
    id: Date.now().toString(),
    unidade: unidade.nome,
    profissional: profissional.nome,
    tipo: tipo.nome,
    data: dados.data,
    hora: dados.hora,
    status: 'Agendado'
  };
}

// Atendimentos Services
export async function consultarAtendimentos(status?: string): Promise<Atendimento[]> {
  // TODO: GET /api/atendimentos?status={status}
  await simulateLatency();
  
// Para estabilidade no Início, desabilite a falha simulada nesta chamada
if (simulateError(0)) {
  throw new Error('Erro ao carregar atendimentos');
}
  
  let atendimentos = mockAtendimentos;
  
  if (status && status !== 'todos') {
    atendimentos = atendimentos.filter(a => a.status.toLowerCase() === status.toLowerCase());
  }
  
  // Garantir que todos os atendimentos concluídos possam ser avaliados
  return atendimentos.map(atendimento => ({
    ...atendimento,
    podeAvaliar: atendimento.status === 'Concluído' ? true : atendimento.podeAvaliar
  }));
}

export async function avaliarAtendimento(
  atendimentoId: string, 
  avaliacao: { nota: number; comentario?: string }
): Promise<Avaliacao> {
  // TODO: POST /api/atendimentos/{atendimentoId}/avaliacao
  await simulateLatency();
  
  if (simulateError(0.02)) {
    throw new Error('Erro ao enviar avaliação');
  }
  
  return {
    id: Date.now().toString(),
    atendimentoId,
    nota: avaliacao.nota,
    comentario: avaliacao.comentario,
    createdAt: new Date().toISOString(),
    editableUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  };
}

// Saúde Services
export async function consultarVacinas(): Promise<Vacina[]> {
  // TODO: GET /api/users/{userId}/vacinas
  await simulateLatency();
  
  if (simulateError()) {
    throw new Error('Erro ao carregar vacinas');
  }
  
  return mockVacinas;
}

export async function consultarMedicamentos(): Promise<Medicamento[]> {
  // TODO: GET /api/users/{userId}/medicamentos
  await simulateLatency();
  
  if (simulateError()) {
    throw new Error('Erro ao carregar medicamentos');
  }
  
  return mockMedicamentos;
}

// Farmácia Services
export async function consultarFarmacias(): Promise<Farmacia[]> {
  // TODO: GET /api/farmacias
  await simulateLatency();
  
  if (simulateError()) {
    throw new Error('Erro ao carregar farmácias');
  }
  
  return mockFarmacias;
}

// Regulação Services
export async function consultarFilaRegulacao(): Promise<SolicitacaoRegulacao[]> {
  // TODO: GET /api/users/{userId}/regulacao
  await simulateLatency();
  
  if (simulateError()) {
    throw new Error('Erro ao carregar fila de regulação');
  }
  
  return mockSolicitacoesRegulacao;
}

// Informações Services
export async function consultarFAQ(categoria?: string): Promise<FAQ[]> {
  // TODO: GET /api/faq?categoria={categoria}
  await simulateLatency();
  
  if (simulateError()) {
    throw new Error('Erro ao carregar FAQ');
  }
  
  let faqs = mockFAQs;
  
  if (categoria) {
    faqs = faqs.filter(f => f.categoria.toLowerCase() === categoria.toLowerCase());
  }
  
  return faqs;
}

export async function consultarServicos(): Promise<Servico[]> {
  // TODO: GET /api/servicos
  await simulateLatency();
  
  if (simulateError()) {
    throw new Error('Erro ao carregar serviços');
  }
  
  return mockServicos;
}

// Ouvidoria Services
export async function enviarOuvidoria(dados: {
  email: string;
  assunto: string;
  mensagem: string;
  anexo?: File;
}): Promise<OuvidoriaTicket> {
  // TODO: POST /api/ouvidoria
  await simulateLatency(1000, 2000);
  
  if (simulateError(0.02)) {
    throw new Error('Erro ao enviar mensagem para ouvidoria');
  }
  
  return {
    id: Date.now().toString(),
    protocolo: `PRO${Date.now().toString().slice(-6)}`,
    assunto: dados.assunto,
    mensagem: dados.mensagem,
    email: dados.email,
    status: 'Aberto',
    dataAbertura: new Date().toISOString()
  };
}

// Utilidades
export async function buscarEndereco(cep: string): Promise<{
  logradouro: string;
  bairro: string;
  cidade: string;
  uf: string;
}> {
  // TODO: Integrar com API de CEP (ViaCEP, etc)
  await simulateLatency(300, 600);
  
  if (simulateError(0.05)) {
    throw new Error('CEP não encontrado');
  }
  
  return {
    logradouro: 'Rua das Flores',
    bairro: 'Jardim Primavera',
    cidade: 'São Paulo',
    uf: 'SP'
  };
}

export async function gerarCartaoSUS(): Promise<{
  qrCode: string;
  pdfUrl: string;
}> {
  // TODO: GET /api/users/{userId}/cartao-sus
  await simulateLatency();
  
  if (simulateError(0.01)) {
    throw new Error('Erro ao gerar cartão SUS');
  }
  
  return {
    qrCode: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zNWVtIj5RUiBDb2RlPC90ZXh0Pjwvc3ZnPg==',
    pdfUrl: '#'
  };
}