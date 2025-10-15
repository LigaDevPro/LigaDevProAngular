import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../services/auth';
import { NotificacionService } from '../../services/notificacion';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit, OnDestroy {
  isLoggedIn = false;
  nombreUsuario = '';
  isAdmin = false;
  private checkSessionSubscription?: Subscription;

  constructor(
    private router: Router,
    private authService: Auth,
    private notificacion: NotificacionService
  ) {}

  ngOnInit(): void {
    this.verificarSesion();

    // Verificar sesión cada 5 segundos
    this.checkSessionSubscription = interval(5000).subscribe(() => {
      this.verificarSesion();
    });
  }

  ngOnDestroy(): void {
    if (this.checkSessionSubscription) {
      this.checkSessionSubscription.unsubscribe();
    }
  }

  verificarSesion(): void {
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
      try {
        const usuarioData = JSON.parse(usuario);
        this.isLoggedIn = true;
        this.nombreUsuario = usuarioData.username || usuarioData.email;
        this.isAdmin = this.authService.isAdmin();
      } catch (error) {
        this.isLoggedIn = false;
        this.nombreUsuario = '';
        this.isAdmin = false;
      }
    } else {
      this.isLoggedIn = false;
      this.nombreUsuario = '';
      this.isAdmin = false;
    }
  }

  getDashboardLink(): string {
    return this.isAdmin ? '/dashboard' : '/dashboard-usuario';
  }

  logout(): void {

    // Llamar al endpoint de logout del backend
    this.authService.logout().subscribe({
      next: () => {
      },
      error: (err) => {
        console.error('❌ Error en logout backend:', err);
      },
      complete: () => {
        // Limpiar localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');

        this.isLoggedIn = false;
        this.nombreUsuario = '';

        this.notificacion.info('Has cerrado sesión exitosamente');

        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1000);
      },
    });
  }
}
