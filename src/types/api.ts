export type Papel = "CLIENTE" | "OPERADOR";

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  papel: Papel;
  criadoEm?: string;
}

export interface Evento {
  id: number;
  titulo: string;
  descricao?: string | null;
  duracaoMinutos: number;
}

export interface Assento {
  id: number;
  fila: string;
  numero: number;
}

export interface Sala {
  id: number;
  nome: string;
  assentos: Assento[];
}

export interface Sessao {
  id: number;
  eventoId: number;
  salaId: number;
  dataHora: string;
  preco: string;
  evento: Evento;
  sala: Sala;
}

export type StatusAssentoMapa = "livre" | "reservado" | "vendido";

export interface AssentoMapa {
  id: number;
  fila: string;
  numero: number;
  status: StatusAssentoMapa;
}

export interface Reserva {
  id: number;
  sessaoId: number;
  assentoId: number;
  expiraEm: string;
}

export interface Ingresso {
  id: number;
  codigoUnico: string;
  status: "VALIDO" | "UTILIZADO";
  emitidoEm: string;
  utilizadoEm?: string | null;
  reserva: {
    assento: Assento;
    sessao: Sessao;
  };
}

export interface RelatorioVendas {
  totalVendas: number;
  totalIngressos: number;
  valorTotalArrecadado: number;
  porSessao: Array<{
    sessaoId: number;
    evento: string;
    dataHora: string;
    ingressosVendidos: number;
    valorArrecadado: number;
  }>;
}

/** Uma linha por ingresso vendido — relatório em SQL puro (JOIN de 8 tabelas). */
export interface RelatorioVendaDetalhada {
  vendaId: number;
  dataVenda: string;
  comprador: string;
  filme: string;
  sala: string;
  dataHoraSessao: string;
  assento: string;
  preco: number;
  codigoIngresso: string;
  statusIngresso: "VALIDO" | "UTILIZADO";
}

export interface RelatorioOcupacao {
  sessaoId: number;
  evento: string;
  sala: string;
  dataHora: string;
  totalAssentos: number;
  vendidos: number;
  reservados: number;
  livres: number;
  taxaOcupacao: number;
}
