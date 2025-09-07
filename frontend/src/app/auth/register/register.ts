import { Component, OnInit, Renderer2, Inject, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class Register implements OnInit, OnDestroy {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private titleService: Title,
    private metaService: Meta,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.registerForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [Validators.required, Validators.minLength(6), Validators.pattern(/^[a-zA-Z0-9@#_]+$/)],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    this.titleService.setTitle('Registro - LigaPro');
    this.metaService.addTags([
      {
        name: 'description',
        content: 'Regístrate en la plataforma de gestión de torneos LigaDevPro',
      },
      { property: 'og:title', content: 'Registro - LigaDevPro' },
      { property: 'og:description', content: 'Crea una cuenta para gestionar tus torneos' },
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

  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirm = control.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      console.log('✅ Usuario registrado:', this.registerForm.value);
      alert('Registro exitoso 🎉');
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  get username() {
    return this.registerForm.get('username');
  }
  get email() {
    return this.registerForm.get('email');
  }
  get password() {
    return this.registerForm.get('password');
  }
  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }
}
