export interface Jugador {
  id: number;
  nombreCompleto: string;
  numeroPosicion: number;
  posicion?: string;
}

export interface CreateJugador {
  nombreCompleto: string;
  numeroPosicion: number;
}
