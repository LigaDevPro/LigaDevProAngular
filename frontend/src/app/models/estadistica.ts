export interface EstadisticaEquipo {
  idEstadisticaEquipo: number;
  idEquipo: number;
  puntos: number;
  partidosJugados: number;
  victorias: number;
  empates: number;
  derrotas: number;
  equipo_nombre?: string;
}

export interface CreateEstadisticaEquipo {
  idEquipo: number;
  puntos?: number;
  partidosJugados?: number;
  victorias?: number;
  empates?: number;
  derrotas?: number;
}

export interface EstadisticaJugador {
  idEstadisticaJugador: number;
  idJugador: number;
  goles: number;
  partidosJugados: number;
  jugador_nombre?: string;
}

export interface CreateEstadisticaJugador {
  idJugador: number;
  goles?: number;
  partidosJugados?: number;
}
