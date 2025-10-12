export interface TablaPosiciones {
  idTabla: number;
  idTorneo: number;
  torneo_nombre?: string;
}

export interface CreateTablaPosiciones {
  idTorneo: number;
}

export interface Posicion {
  idPosicion: number;
  idTabla: number;
  idEquipo: number;
  pj: number;
  pg: number;
  pe: number;
  pp: number;
  pts: number;
  equipo_nombre?: string;
  torneo_nombre?: string;
}

export interface CreatePosicion {
  idTabla: number;
  idEquipo: number;
  pj?: number;
  pg?: number;
  pe?: number;
  pp?: number;
  pts?: number;
}
