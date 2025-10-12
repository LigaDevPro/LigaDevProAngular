import { Jugador } from './jugador';

export interface Equipo {
  idEquipo: number;
  nombre: string;
  entrenador: string;
  idUsuario?: number[];
  jugadores?: Jugador[];
  usuarios?: {
    idUsuario: number;
    username: string;
    email: string;
  }[];
}

export interface CreateEquipo {
  nombre: string;
  entrenador: string;
  idUsuario?: number[];
}
