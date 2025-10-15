import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificacionService, Notificacion } from '../../services/notificacion';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notificaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notificaciones.html',
  styleUrls: ['./notificaciones.css'],
})
export class NotificacionesComponent implements OnInit, OnDestroy {
  notificaciones: Notificacion[] = [];
  private subscription?: Subscription;

  constructor(private notificacionService: NotificacionService) {}

  ngOnInit(): void {
    this.subscription = this.notificacionService.notificaciones$.subscribe((notificaciones) => {
      this.notificaciones = notificaciones;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  cerrar(id: number): void {
    this.notificacionService.eliminar(id);
  }

  getIcono(tipo: string): string {
    switch (tipo) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '•';
    }
  }
}
