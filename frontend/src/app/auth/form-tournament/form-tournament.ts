import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-torneo-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-tournament.html',
  styleUrls: ['./form-tournament.css'],
})
export class FormTournament implements OnInit {
  formTournament: FormGroup;

  constructor(private fb: FormBuilder, private titleService: Title, private metaService: Meta) {
    this.formTournament = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      fecha: ['', Validators.required],
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
      console.log('✅ Torneo creado:', this.formTournament.value);
      alert('Torneo creado con éxito 🎉');
      this.formTournament.reset();
    } else {
      this.formTournament.markAllAsTouched();
    }
  }

  get nombre() {
    return this.formTournament.get('nombre');
  }
  get fecha() {
    return this.formTournament.get('fecha');
  }
  get ubicacion() {
    return this.formTournament.get('ubicacion');
  }
}
