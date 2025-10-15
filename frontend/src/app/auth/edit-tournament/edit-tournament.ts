import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Torneos } from '../../services/torneos';
import { NotificacionService } from '../../services/notificacion';
import { Torneo } from '../../models/torneo';

@Component({
  selector: 'app-edit-tournament',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-tournament.html',
  styleUrls: ['./edit-tournament.css'],
})
export class EditTournament implements OnInit {
  tournamentForm: FormGroup;
  idTorneo!: number;
  cargando = false;

  formatos = ['Liga (Todos contra todos)', 'Eliminación Directa', 'Grupos + Eliminación', 'Copa'];

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
    private torneosService: Torneos,
    private notificacion: NotificacionService
  ) {
    this.tournamentForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: [''],
      formato: ['', [Validators.required]],
      fechaInicio: ['', [Validators.required]],
      fechaFinal: ['', [Validators.required]],
      estado: ['Preparación', [Validators.required]],
    });
  }

  ngOnInit(): void {
    // Obtener el ID del torneo de la URL
    this.route.params.subscribe((params) => {
      this.idTorneo = +params['id'];
      this.cargarDatos();
    });
  }

  cargarDatos(): void {
    this.cargando = true;

    this.torneosService.getTorneo(this.idTorneo).subscribe({
      next: (torneo) => {
        this.tournamentForm.patchValue({
          nombre: torneo.nombre,
          descripcion: torneo.descripcion,
          formato: torneo.formato,
          fechaInicio: torneo.fechaInicio,
          fechaFinal: torneo.fechaFinal,
          estado: torneo.estado,
        });
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar torneo:', err);
        this.notificacion.error('Error al cargar el torneo');
        this.cargando = false;
        this.router.navigate(['/dashboard']);
      },
    });
  }

  onSubmit(): void {
    if (this.tournamentForm.valid) {
      // Validar fechas
      const fechaInicio = new Date(this.tournamentForm.value.fechaInicio);
      const fechaFinal = new Date(this.tournamentForm.value.fechaFinal);

      if (fechaFinal < fechaInicio) {
        this.notificacion.warning('La fecha final no puede ser anterior a la fecha de inicio');
        return;
      }

      this.cargando = true;
      const torneoData = this.tournamentForm.value;

      this.torneosService.updateTorneo(this.idTorneo, torneoData).subscribe({
        next: () => {
          this.notificacion.success('¡Torneo actualizado exitosamente!');
          this.cargando = false;
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Error al actualizar torneo:', err);
          this.notificacion.error('Error al actualizar el torneo');
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
