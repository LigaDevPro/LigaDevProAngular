import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-torneo-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-tournament.html',
  styleUrls: ['./form-tournament.css']
})
export class FormTournament {
  formTournament: FormGroup;
  constructor(private fb: FormBuilder) {  this.formTournament = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    fecha: ['', Validators.required],
    ubicacion: ['', [Validators.required, Validators.minLength(5)]],
    descripcion: ['']
  });}

  onSubmit() {
    if (this.formTournament.valid) {
      console.log('✅ Torneo creado:', this.formTournament.value);
      alert('Torneo creado con éxito 🎉');
      this.formTournament.reset();
    } else {
      this.formTournament.markAllAsTouched();
    }
  }
}
