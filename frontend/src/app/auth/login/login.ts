import { Component, OnInit, Renderer2, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login implements OnInit, OnDestroy {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private titleService: Title,
    private metaService: Meta,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [Validators.required, Validators.minLength(6), Validators.pattern('^[a-zA-Z0-9@#]+$')],
      ],
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle('Inicio de Sesión - LigaPro');
    this.metaService.addTags([
      {
        name: 'description',
        content: 'Inicia sesión en la plataforma de gestión de torneos LigaPro',
      },
      { name: 'keywords', content: 'angular 20, ligapro, login, inicio de sesión' },
      { property: 'og:title', content: 'Inicio de Sesión - LigaPro' },
      { property: 'og:description', content: 'Accede a tu cuenta para gestionar torneos' },
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
    if (this.loginForm.valid) {
      console.log('Login válido', this.loginForm.value);
    } else {
      console.log('Login inválido');
      this.loginForm.markAllAsTouched();
    }
  }

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }
}
