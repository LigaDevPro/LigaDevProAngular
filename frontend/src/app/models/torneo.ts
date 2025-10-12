export interface Torneo {
  idTorneo: number;
  nombre: string;
  descripcion?: string;
  formato: string;
  fechaInicio: string;
  fechaFinal: string;
  estado: 'Preparación' | 'En curso' | 'Finalizado' | 'Cancelado';
}

export interface CreateTorneo {
  nombre: string;
  descripcion?: string;
  formato: string;
  fechaInicio: string;
  fechaFinal: string;
  estado?: 'Preparación' | 'En curso' | 'Finalizado' | 'Cancelado';
}
