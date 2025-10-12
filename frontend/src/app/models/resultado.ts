export interface Resultado {
  idResultado: number;
  idPartido: number;
  golesLocal: number;
  golesVisitante: number;
  ganador?: number;
  partido_info?: string;
  ganador_nombre?: string;
}

export interface CreateResultado {
  idPartido: number;
  golesLocal: number;
  golesVisitante: number;
  ganador?: number;
}
