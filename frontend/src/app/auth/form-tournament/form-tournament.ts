import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { Torneos } from '../../services/torneos';
import { Torneo } from '../../models/torneo';

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
    private torneosService: Torneos
  ) {
    this.formTournament = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      fechaInicio: ['', Validators.required],
      fechaFinal: ['', Validators.required],
      ubicacion: ['', [Validators.required, Validators.minLength(5)]],
      descripcion: [''],
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
      const torneo: Torneo = {
        nombre: this.formTournament.value.nombre,
        fechaInicio: this.formTournament.value.fechaInicio,
        fechaFinal: this.formTournament.value.fechaFinal,
        ubicacion: this.formTournament.value.ubicacion,
        descripcion: this.formTournament.value.descripcion,
        estado: 'activo',
      };
      this.torneosService.createTorneo(torneo).subscribe({
        next: () => {
          this.formTournament.reset();
        },
        error: () => {
          alert('Error al crear el torneo. Verifica los datos e intenta nuevamente.');
        },
      });
    } else {
      this.formTournament.markAllAsTouched();
    }
  }

  get nombre() {
    return this.formTournament.get('nombre');
  }
  get fechaInicio() {
    return this.formTournament.get('fechaInicio');
  }
  get fechaFinal() {
    return this.formTournament.get('fechaFinal');
  }
  get ubicacion() {
    return this.formTournament.get('ubicacion');
  }
}
