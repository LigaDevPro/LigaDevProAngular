import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Equipos } from '../../services/equipos';
import { NotificacionService } from '../../services/notificacion';
import { Equipo } from '../../models/equipo';
import { Jugador } from '../../models/jugador';

@Component({
  selector: 'app-edit-team',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-team.html',
  styleUrls: ['./edit-team.css'],
})
export class EditTeam implements OnInit {
  teamForm: FormGroup;
  idEquipo!: number;
  cargando = false;
  jugadores: Jugador[] = [];
  mostrarModalEliminarJugador = false;
  jugadorAEliminar: Jugador | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private equiposService: Equipos,
    private notificacion: NotificacionService,
    private http: HttpClient
  ) {
    this.teamForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      entrenador: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit(): void {
    // Obtener el ID del equipo de la URL
    this.route.params.subscribe((params) => {
      this.idEquipo = +params['id'];
      this.cargarDatos();
    });
  }

  cargarDatos(): void {
    this.cargando = true;

    this.equiposService.getEquipo(this.idEquipo).subscribe({
      next: (equipo) => {
        this.teamForm.patchValue({
          nombre: equipo.nombre,
          entrenador: equipo.entrenador,
        });
        this.jugadores = equipo.jugadores || [];
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar equipo:', err);
        this.notificacion.error('Error al cargar el equipo');
        this.cargando = false;
        this.router.navigate(['/dashboard']);
      },
    });
  }

  confirmarQuitarJugador(jugador: Jugador): void {
    this.jugadorAEliminar = jugador;
    this.mostrarModalEliminarJugador = true;
  }

  quitarJugador(): void {
    if (!this.jugadorAEliminar) return;

    this.cargando = true;

    // Actualizar el jugador para quitarle el equipo (set idEquipo a null)
    this.http
      .patch(`http://localhost:8000/api/jugadores/${this.jugadorAEliminar.idJugador}/`, {
        idEquipo: null,
      })
      .subscribe({
        next: () => {
          this.notificacion.success(
            `${this.jugadorAEliminar!.nombre} ${
              this.jugadorAEliminar!.apellido
            } ha sido quitado del equipo`
          );
          // Remover jugador de la lista local
          this.jugadores = this.jugadores.filter(
            (j) => j.idJugador !== this.jugadorAEliminar!.idJugador
          );
          this.cerrarModalEliminarJugador();
          this.cargando = false;
        },
        error: (err) => {
          console.error('Error al quitar jugador:', err);
          this.notificacion.error('Error al quitar el jugador del equipo');
          this.cargando = false;
        },
      });
  }

  cerrarModalEliminarJugador(): void {
    this.mostrarModalEliminarJugador = false;
    this.jugadorAEliminar = null;
  }

  onSubmit(): void {
    if (this.teamForm.valid) {
      this.cargando = true;
      const equipoData = this.teamForm.value;

      this.equiposService.updateEquipo(this.idEquipo, equipoData).subscribe({
        next: () => {
          this.notificacion.success('¡Equipo actualizado exitosamente!');
          this.cargando = false;
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Error al actualizar equipo:', err);
          this.notificacion.error('Error al actualizar el equipo');
          this.cargando = false;
        },
      });
    } else {
      this.notificacion.warning('Por favor, completa todos los campos correctamente');
    }
  }

  cancelar(): void {
    this.router.navigate(['/dashboard']);
  }
}
