import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { Equipos } from '../../services/equipos';
import { CreateJugador } from '../../models/jugador';

@Component({
  selector: 'app-form-team',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-team.html',
  styleUrls: ['./form-team.css'],
})
export class FormTeam implements OnInit {
  formTeam: FormGroup;

  constructor(
    private fb: FormBuilder,
    private titleService: Title,
    private metaService: Meta,
    private equiposService: Equipos
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
      nombreCompleto: ['', [Validators.required, Validators.minLength(5)]],
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

  onSubmit(): void {
    if (this.formTeam.valid && this.jugadoresArray.length > 0) {
      const formData = this.formTeam.value;

      const equipoData = {
        nombre: formData.nombre,
        entrenador: formData.entrenador,
        jugadores: formData.jugadores.map((jugador: CreateJugador) => ({
          ...jugador,
          posicion: this.getPosicionJugador(jugador.numeroPosicion),
        })),
      };

      this.equiposService.createEquipo(equipoData).subscribe({
        next: () => {
          this.resetForm();
        },
        error: (error) => {
          console.error('Error al crear el equipo:', error);
        },
      });
    }
  }

  resetForm(): void {
    this.formTeam.reset();
    while (this.jugadoresArray.length !== 0) {
      this.jugadoresArray.removeAt(0);
    }
    this.addJugador();
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
