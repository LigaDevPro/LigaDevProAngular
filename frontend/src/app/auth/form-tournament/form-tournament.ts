import { Component, OnInit, Renderer2, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-torneo-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-tournament.html',
  styleUrls: ['./form-tournament.css'],
})
export class FormTournament implements OnInit, OnDestroy {
  formTournament: FormGroup;

  constructor(
    private fb: FormBuilder,
    private titleService: Title,
    private metaService: Meta,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {
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

    const favicon = this.renderer.createElement('link');
    this.renderer.setAttribute(favicon, 'rel', 'icon');
    this.renderer.setAttribute(favicon, 'href', '/assets/icon/icon.png');
    this.renderer.appendChild(this.document.head, favicon);

    const bootstrapLink = this.renderer.createElement('link');
    this.renderer.setAttribute(bootstrapLink, 'rel', 'stylesheet');
    this.renderer.setAttribute(
      bootstrapLink,
      'href',
      'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css'
    );
    this.renderer.appendChild(this.document.head, bootstrapLink);

    const fontAwesomeLink = this.renderer.createElement('link');
    this.renderer.setAttribute(fontAwesomeLink, 'rel', 'stylesheet');
    this.renderer.setAttribute(
      fontAwesomeLink,
      'href',
      'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css'
    );
    this.renderer.appendChild(this.document.head, fontAwesomeLink);

    const bootstrapScript = this.renderer.createElement('script');
    this.renderer.setAttribute(
      bootstrapScript,
      'src',
      'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js'
    );
    this.renderer.appendChild(this.document.body, bootstrapScript);
  }

  ngOnDestroy(): void {
    const favicon = this.document.querySelector('link[href="/assets/icon/icon.png"]');
    if (favicon) {
      this.renderer.removeChild(this.document.head, favicon);
    }
    const bootstrapLink = this.document.querySelector(
      'link[href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"]'
    );
    if (bootstrapLink) {
      this.renderer.removeChild(this.document.head, bootstrapLink);
    }
    const fontAwesomeLink = this.document.querySelector(
      'link[href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"]'
    );
    if (fontAwesomeLink) {
      this.renderer.removeChild(this.document.head, fontAwesomeLink);
    }
    const bootstrapScript = this.document.querySelector(
      'script[src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"]'
    );
    if (bootstrapScript) {
      this.renderer.removeChild(this.document.body, bootstrapScript);
    }
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
