import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notificacion {
  id: number;
  mensaje: string;
  tipo: 'success' | 'error' | 'warning' | 'info';
  duracion?: number;
}

@Injectable({
  providedIn: 'root',
})
export class NotificacionService {
  private notificacionesSubject = new BehaviorSubject<Notificacion[]>([]);
  public notificaciones$: Observable<Notificacion[]> = this.notificacionesSubject.asObservable();
  private idCounter = 0;

  constructor() {}

  success(mensaje: string, duracion: number = 3000): void {
    this.mostrar(mensaje, 'success', duracion);
  }

  error(mensaje: string, duracion: number = 4000): void {
    this.mostrar(mensaje, 'error', duracion);
  }

  warning(mensaje: string, duracion: number = 3500): void {
    this.mostrar(mensaje, 'warning', duracion);
  }

  info(mensaje: string, duracion: number = 3000): void {
    this.mostrar(mensaje, 'info', duracion);
  }

  private mostrar(mensaje: string, tipo: Notificacion['tipo'], duracion: number): void {
    const notificacion: Notificacion = {
      id: ++this.idCounter,
      mensaje,
      tipo,
      duracion,
    };

    const notificacionesActuales = this.notificacionesSubject.value;
    this.notificacionesSubject.next([...notificacionesActuales, notificacion]);

    if (duracion > 0) {
      setTimeout(() => {
        this.eliminar(notificacion.id);
      }, duracion);
    }
  }

  eliminar(id: number): void {
    const notificacionesActuales = this.notificacionesSubject.value;
    const notificacionesFiltradas = notificacionesActuales.filter((n) => n.id !== id);
    this.notificacionesSubject.next(notificacionesFiltradas);
  }

  limpiarTodas(): void {
    this.notificacionesSubject.next([]);
  }
}
