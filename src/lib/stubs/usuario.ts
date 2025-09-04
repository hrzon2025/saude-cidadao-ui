export interface Usuario {
  id: string;
  nome: string;
  sobrenome: string;
  cpf: string;
  dataNascimento: string;
  numeroCartaoSus: string;
  cns: string; // Cartão Nacional de Saúde
  sexo: string;
  nomeMae: string;
  municipioNascimento: string;
  ufNascimento: string;
}

export const usuarioMock: Usuario = {
  id: "1",
  nome: "Maria",
  sobrenome: "Silva Santos",
  cpf: "123.456.789-00",
  dataNascimento: "15/03/1990",
  numeroCartaoSus: "898 0011 0000 0001 23",
  cns: "898001100000000123",
  sexo: "Feminino",
  nomeMae: "Ana Silva Santos",
  municipioNascimento: "São Paulo",
  ufNascimento: "SP"
};

export const getUsuario = (): Usuario => {
  return usuarioMock;
};