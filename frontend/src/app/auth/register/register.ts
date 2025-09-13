import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class Register implements OnInit {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private titleService: Title, private metaService: Meta) {
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
