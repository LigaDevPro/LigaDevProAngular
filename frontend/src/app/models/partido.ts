export interface Partido {
  idPartido: number;
  fecha: string;
  equipoA: string;
  equipoB: string;
  resultado: string;
  estado: 'Preparación' | 'En curso' | 'Finalizado' | 'Cancelado';
  idTorneo: number;
  idEquipoLocal: number;
  idEquipoVisitante: number;
  equipo_local?: string;
  equipo_visitante?: string;
  torneo?: string;
}

export interface CreatePartido {
  fecha: string;
  equipoA: string;
  equipoB: string;
  resultado?: string;
  estado: 'Preparación' | 'En curso' | 'Finalizado' | 'Cancelado';
  idTorneo: number;
  idEquipoLocal: number;
  idEquipoVisitante: number;
}
