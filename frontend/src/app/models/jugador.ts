export interface Jugador {
  idJugador: number;
  idUsuario: number;
  nombre: string;
  apellido: string;
  numeroPosicion: number;
  posicion: 'arquero' | 'defensor' | 'mediocampo' | 'delantero';
  idEquipo: number;
  usuario?: {
    idUsuario: number;
    username: string;
    email: string;
  };
}

export interface CreateJugador {
  idUsuario: number;
  nombre: string;
  apellido: string;
  numeroPosicion: number;
  posicion: 'arquero' | 'defensor' | 'mediocampo' | 'delantero';
  idEquipo: number;
}
