import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Partidos } from '../../services/partidos';
import { Torneos } from '../../services/torneos';
import { Equipos } from '../../services/equipos';
import { NotificacionService } from '../../services/notificacion';
import { Partido } from '../../models/partido';
import { Torneo } from '../../models/torneo';
import { Equipo } from '../../models/equipo';

@Component({
  selector: 'app-edit-match',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-match.html',
  styleUrls: ['./edit-match.css'],
})
export class EditMatch implements OnInit {
  matchForm: FormGroup;
  idPartido!: number;
  torneos: Torneo[] = [];
  equipos: Equipo[] = [];
  cargando = false;

  estados = [
    { value: 'Preparación', label: 'Preparación' },
    { value: 'En curso', label: 'En curso' },
    { value: 'Finalizado', label: 'Finalizado' },
    { value: 'Cancelado', label: 'Cancelado' },
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private partidosService: Partidos,
    private torneosService: Torneos,
    private equiposService: Equipos,
    private notificacion: NotificacionService
  ) {
    this.matchForm = this.fb.group({
      fecha: ['', [Validators.required]],
      idEquipoLocal: ['', [Validators.required]],
      idEquipoVisitante: ['', [Validators.required]],
      resultado: ['Pendiente', [Validators.required]],
      estado: ['Preparación', [Validators.required]],
      idTorneo: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    // Obtener el ID del partido de la URL
    this.route.params.subscribe((params) => {
      this.idPartido = +params['id'];
      this.cargarDatos();
    });
  }

  cargarDatos(): void {
    this.cargando = true;

    // Cargar torneos
    this.torneosService.getTorneosActivos().subscribe({
      next: (torneos) => {
        this.torneos = torneos;
      },
      error: (err) => {
        console.error('Error al cargar torneos:', err);
        this.notificacion.error('Error al cargar los torneos');
      },
    });

    // Cargar equipos
    this.equiposService.getEquipos().subscribe({
      next: (equipos) => {
        this.equipos = equipos;
      },
      error: (err) => {
        console.error('Error al cargar equipos:', err);
        this.notificacion.error('Error al cargar los equipos');
      },
    });

    // Cargar datos del partido
    this.partidosService.getMatch(this.idPartido).subscribe({
      next: (partido) => {
        this.matchForm.patchValue({
          fecha: partido.fecha,
          idEquipoLocal: partido.idEquipoLocal,
          idEquipoVisitante: partido.idEquipoVisitante,
          resultado: partido.resultado,
          estado: partido.estado,
          idTorneo: partido.idTorneo,
        });
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar partido:', err);
        this.notificacion.error('Error al cargar el partido');
        this.cargando = false;
        this.router.navigate(['/dashboard']);
      },
    });
  }

  onSubmit(): void {
    if (this.matchForm.valid) {
      this.cargando = true;
      const partidoData = this.matchForm.value;

      // Obtener los nombres de los equipos
      const equipoLocal = this.equipos.find((e) => e.idEquipo === +partidoData.idEquipoLocal);
      const equipoVisitante = this.equipos.find(
        (e) => e.idEquipo === +partidoData.idEquipoVisitante
      );

      const partidoActualizado = {
        ...partidoData,
        equipoA: equipoLocal?.nombre || 'Equipo A',
        equipoB: equipoVisitante?.nombre || 'Equipo B',
      };

      this.partidosService.updateMatch(this.idPartido, partidoActualizado).subscribe({
        next: () => {
          this.notificacion.success('¡Partido actualizado exitosamente!');
          this.cargando = false;
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Error al actualizar partido:', err);
          this.notificacion.error('Error al actualizar el partido');
          this.cargando = false;
        },
      });
    } else {
      this.notificacion.warning('Por favor, completa todos los campos requeridos');
    }
  }

  cancelar(): void {
    this.router.navigate(['/dashboard']);
  }
}
