import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotificacionService } from '../../services/notificacion';

@Component({
  selector: 'app-cambiar-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './cambiar-password.html',
  styleUrls: ['./cambiar-password.css'],
})
export class CambiarPassword implements OnInit {
  cambiarPasswordForm: FormGroup;
  idUsuario: number = 0;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private notificacion: NotificacionService
  ) {
    this.cambiarPasswordForm = this.fb.group(
      {
        passwordActual: ['', [Validators.required, Validators.minLength(8)]],
        passwordNueva: ['', [Validators.required, Validators.minLength(8)]],
        confirmarPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    const usuarioLogueado = localStorage.getItem('usuario');
    if (usuarioLogueado) {
      try {
        const usuario = JSON.parse(usuarioLogueado);
        this.idUsuario = usuario.idUsuario;

        this.notificacion.info('Bienvenido al cambio de contraseña');
      } catch (error) {
        console.error('Error al parsear usuario:', error);
        this.notificacion.error('Sesión inválida. Por favor inicia sesión nuevamente.');
        this.router.navigate(['/login']);
      }
    } else {
      this.notificacion.warning('Debes iniciar sesión primero.');
      this.router.navigate(['/login']);
    }
  }

  passwordMatchValidator(control: AbstractControl) {
    const passwordNueva = control.get('passwordNueva')?.value;
    const confirmar = control.get('confirmarPassword')?.value;
    return passwordNueva === confirmar ? null : { mismatch: true };
  }

  cambiarPassword(
    idUsuario: number,
    passwordActual: string,
    passwordNueva: string
  ): Observable<any> {
    const url = `http://localhost:8000/api/usuarios/${idUsuario}/cambiar-password/`;
    return this.http.post(url, {
      password_actual: passwordActual,
      password_nueva: passwordNueva,
    });
  }

  onSubmit(): void {
    if (this.cambiarPasswordForm.valid) {
      const { passwordActual, passwordNueva } = this.cambiarPasswordForm.value;

      if (!this.idUsuario) {
        this.notificacion.error(
          'No se pudo identificar el usuario. Por favor inicia sesión nuevamente.'
        );
        this.router.navigate(['/login']);
        return;
      }

      this.cambiarPassword(this.idUsuario, passwordActual, passwordNueva).subscribe({
        next: (response) => {
          this.notificacion.success('¡Contraseña cambiada exitosamente!');
          this.cambiarPasswordForm.reset();
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1500);
        },
        error: (err) => {
          console.error('❌ Error al cambiar contraseña:', err);
          const mensaje = err.error?.error || 'Error al cambiar la contraseña';
          this.notificacion.error(mensaje);
        },
      });
    } else {
      this.cambiarPasswordForm.markAllAsTouched();
      this.notificacion.warning('Por favor completa todos los campos correctamente.');
    }
  }

  get passwordActual() {
    return this.cambiarPasswordForm.get('passwordActual');
  }

  get passwordNueva() {
    return this.cambiarPasswordForm.get('passwordNueva');
  }

  get confirmarPassword() {
    return this.cambiarPasswordForm.get('confirmarPassword');
  }
}
