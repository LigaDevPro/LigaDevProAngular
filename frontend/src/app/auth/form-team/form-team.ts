import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Equipos } from '../../services/equipos';
import { UsuariosService } from '../../services/usuarios';
import { Usuario } from '../../models/usuarios';
import { CreateJugador, Jugador } from '../../models/jugador';
import { CreateEquipo, Equipo } from '../../models/equipo';
import { forkJoin, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { NotificacionService } from '../../services/notificacion';

@Component({
  selector: 'app-form-team',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-team.html',
  styleUrls: ['./form-team.css'],
})
export class FormTeam implements OnInit {
  formTeam: FormGroup;
  credencialesGeneradas: { nombre: string; email: string; password: string }[] = [];
  mostrarCredenciales = false;

  constructor(
    private fb: FormBuilder,
    private titleService: Title,
    private metaService: Meta,
    private equiposService: Equipos,
    private usuariosService: UsuariosService,
    private router: Router,
    private http: HttpClient,
    private notificacion: NotificacionService
  ) {
    this.formTeam = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      entrenador: ['', [Validators.required, Validators.minLength(2)]],
      jugadores: this.fb.array([]),
    });

    this.addJugador();
  }

  ngOnInit(): void {
    this.titleService.setTitle('Crear Equipo - LigaDevPro');
    this.metaService.addTags([
      {
        name: 'description',
        content: 'Crea un nuevo equipo en la plataforma de gestión de torneos LigaDevPro',
      },
      { property: 'og:title', content: 'Crear Equipo - LigaDevPro' },
      {
        property: 'og:description',
        content: 'Añade un nuevo equipo con jugadores y entrenador',
      },
    ]);
  }

  get jugadoresArray(): FormArray {
    return this.formTeam.get('jugadores') as FormArray;
  }

  createJugadorFormGroup(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      numeroPosicion: [null, [Validators.required, Validators.min(1), Validators.max(99)]],
    });
  }

  addJugador(): void {
    if (this.jugadoresArray.length < 16) {
      const jugadorForm = this.createJugadorFormGroup();
      this.jugadoresArray.push(jugadorForm);
    }
  }

  removeJugador(index: number): void {
    if (this.jugadoresArray.length > 1) {
      this.jugadoresArray.removeAt(index);
    }
  }

  getPosicionJugador(numero: number): string {
    const posiciones: { [key: number]: string } = {
      1: 'Arquero',
      2: 'Defensor',
      3: 'Defensor',
      4: 'Defensor',
      5: 'Defensor',
      6: 'Mediocampista',
      7: 'Mediocampista',
      8: 'Mediocampista',
      9: 'Mediocampista',
      10: 'Mediocampista',
      11: 'Delantero',
      12: 'Suplente',
      13: 'Suplente',
      14: 'Suplente',
      15: 'Suplente',
      16: 'Suplente',
      17: 'Suplente',
      18: 'Suplente',
      19: 'Suplente',
      20: 'Suplente',
      21: 'Suplente',
      22: 'Suplente',
    };
    return posiciones[numero] || 'Suplente';
  }

  getPosicionNumero(numero: number): 'arquero' | 'defensor' | 'mediocampo' | 'delantero' {
    // Convertir a formato del backend
    if (numero === 1) return 'arquero';
    if (numero >= 2 && numero <= 5) return 'defensor';
    if (numero >= 6 && numero <= 10) return 'mediocampo';
    return 'delantero';
  }

  generarPassword(): string {
    // Generar contraseña aleatoria de 8 caracteres
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  onSubmit(): void {
    if (this.formTeam.valid && this.jugadoresArray.length > 0) {
      const formData = this.formTeam.value;
      this.credencialesGeneradas = [];

      // Crear el equipo
      const equipoData: CreateEquipo = {
        nombre: formData.nombre,
        entrenador: formData.entrenador,
      };

      this.equiposService
        .createEquipo(equipoData)
        .pipe(
          switchMap((equipoCreado: Equipo) => {
            // Crear usuarios para los jugadores
            const usuariosObservables: Observable<Usuario>[] = formData.jugadores.map(
              (jugador: any) => {
                const password = this.generarPassword();

                this.credencialesGeneradas.push({
                  nombre: `${jugador.nombre} ${jugador.apellido}`,
                  email: jugador.email,
                  password: password,
                });

                const usuarioData = {
                  username: `${jugador.nombre.toLowerCase()}.${jugador.apellido.toLowerCase()}`,
                  email: jugador.email,
                  password: password,
                  rol_id: 2,
                };
                return this.usuariosService.createUsuario(usuarioData);
              }
            );

            if (usuariosObservables.length === 0) {
              return forkJoin([]) as Observable<any[]>;
            }

            return (forkJoin(usuariosObservables) as Observable<Usuario[]>).pipe(
              switchMap((usuariosCreados: Usuario[]) => {
                // Crear jugadores
                const jugadoresObservables: Observable<Jugador>[] = formData.jugadores.map(
                  (jugador: any, index: number) => {
                    const jugadorData: CreateJugador = {
                      idUsuario: usuariosCreados[index].idUsuario,
                      nombre: jugador.nombre,
                      apellido: jugador.apellido,
                      numeroPosicion: jugador.numeroPosicion,
                      posicion: this.getPosicionNumero(jugador.numeroPosicion),
                      idEquipo: equipoCreado.idEquipo,
                    };
                    return this.http.post<Jugador>(
                      'http://localhost:8000/api/jugadores/',
                      jugadorData
                    );
                  }
                );

                if (jugadoresObservables.length === 0) {
                  return forkJoin([]) as Observable<Jugador[]>;
                }

                return forkJoin(jugadoresObservables) as Observable<Jugador[]>;
              })
            );
          })
        )
        .subscribe({
          next: (jugadoresCreados: Jugador[]) => {
            const count = Array.isArray(jugadoresCreados) ? jugadoresCreados.length : 0;

            this.notificacion.success('¡Equipo creado exitosamente!');
            // Mostrar credenciales generadas
            this.mostrarCredenciales = true;
          },
          error: (error: any) => {
            console.error('❌ Error al crear el equipo:', error);
            this.notificacion.error(
              'Error al crear el equipo. Verifica los datos e intenta nuevamente.'
            );
          },
        });
    } else {
      this.formTeam.markAllAsTouched();
      this.notificacion.warning('Por favor completa todos los campos correctamente.');
    }
  }

  resetForm(): void {
    this.formTeam.reset();
    while (this.jugadoresArray.length !== 0) {
      this.jugadoresArray.removeAt(0);
    }
    this.addJugador();
    this.mostrarCredenciales = false;
    this.credencialesGeneradas = [];
  }

  copiarCredenciales(): void {
    const texto = this.credencialesGeneradas
      .map((c) => `${c.nombre}\nEmail: ${c.email}\nContraseña: ${c.password}\n`)
      .join('\n');

    navigator.clipboard.writeText(texto).then(
      () => this.notificacion.success('Credenciales copiadas al portapapeles'),
      () => this.notificacion.error('Error al copiar credenciales')
    );
  }

  irAlDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  get nombre() {
    return this.formTeam.get('nombre');
  }

  get entrenador() {
    return this.formTeam.get('entrenador');
  }

  get isFormValid(): boolean {
    return this.formTeam.valid && this.jugadoresArray.length > 0;
  }

  get canAddMoreJugadores(): boolean {
    return this.jugadoresArray.length < 16;
  }

  get jugadoresCount(): number {
    return this.jugadoresArray.length;
  }
}
