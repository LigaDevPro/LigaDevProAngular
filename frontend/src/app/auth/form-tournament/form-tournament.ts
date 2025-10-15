import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Torneos } from '../../services/torneos';
import { CreateTorneo } from '../../models/torneo';
import { NotificacionService } from '../../services/notificacion';

@Component({
  selector: 'app-torneo-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-tournament.html',
  styleUrls: ['./form-tournament.css'],
})
export class FormTournament implements OnInit {
  formTournament: FormGroup;

  constructor(
    private fb: FormBuilder,
    private titleService: Title,
    private metaService: Meta,
    private torneosService: Torneos,
    private router: Router,
    private notificacion: NotificacionService
  ) {
    this.formTournament = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      formato: ['Liga', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFinal: ['', Validators.required],
      descripcion: [''],
      estado: ['Preparación'],
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle('Crear Torneo - LigaDevPro');
    this.metaService.addTags([
      {
        name: 'description',
        content: 'Crea un nuevo torneo en la plataforma de gestión de torneos LigaDevPro',
      },
      { property: 'og:title', content: 'Crear Torneo - LigaDevPro' },
      {
        property: 'og:description',
        content: 'Añade un nuevo torneo con nuestro formulario sencillo',
      },
    ]);
  }

  onSubmit() {
    if (this.formTournament.valid) {
      const torneoData: CreateTorneo = {
        nombre: this.formTournament.value.nombre,
        formato: this.formTournament.value.formato,
        fechaInicio: this.formTournament.value.fechaInicio,
        fechaFinal: this.formTournament.value.fechaFinal,
        descripcion: this.formTournament.value.descripcion || '',
        estado: this.formTournament.value.estado || 'Preparación',
      };

      this.torneosService.createTorneo(torneoData).subscribe({
        next: (response) => {
          this.notificacion.success('¡Torneo creado exitosamente!');
          this.formTournament.reset();
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1000);
        },
        error: (err) => {
          console.error('❌ Error al crear torneo:', err);
          this.notificacion.error(
            'Error al crear el torneo. Verifica los datos e intenta nuevamente.'
          );
        },
      });
    } else {
      this.formTournament.markAllAsTouched();
      this.notificacion.warning('Por favor completa todos los campos requeridos.');
    }
  }

  get nombre() {
    return this.formTournament.get('nombre');
  }
  get formato() {
    return this.formTournament.get('formato');
  }
  get fechaInicio() {
    return this.formTournament.get('fechaInicio');
  }
  get fechaFinal() {
    return this.formTournament.get('fechaFinal');
  }
  get descripcion() {
    return this.formTournament.get('descripcion');
  }
  get estado() {
    return this.formTournament.get('estado');
  }
}
