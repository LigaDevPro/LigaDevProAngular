export interface Torneo {
  id?: number;
  nombre: string;
  fechaInicio: string;
  fechaFinal: string;
  ubicacion: string;
  descripcion?: string;
  estado: 'activo' | 'inactivo';
}
