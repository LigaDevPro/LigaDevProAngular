import { Jugador } from './jugador';

export interface Equipo {
  id?: number;
  nombre: string;
  entrenador: string;
  jugadores: Jugador[];
}

export interface CreateEquipo {
  nombre: string;
  entrenador: string;
  jugadores: Jugador[];
}
