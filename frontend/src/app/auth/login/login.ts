import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login implements OnInit {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private titleService: Title, private metaService: Meta) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [Validators.required, Validators.minLength(6), Validators.pattern('^[a-zA-Z0-9@#]+$')],
      ],
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle('Inicio de Sesión - LigaDevPro');
    this.metaService.addTags([
      {
        name: 'description',
        content: 'Inicia sesión en la plataforma de gestión de torneos LigaDevPro',
      },
      { property: 'og:title', content: 'Inicio de Sesión - LigaDevPro' },
      { property: 'og:description', content: 'Accede a tu cuenta para gestionar torneos' },
    ]);
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
