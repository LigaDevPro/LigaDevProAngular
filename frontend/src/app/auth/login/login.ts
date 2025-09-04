import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern('^[a-zA-Z0-9@#]+$') // solo letras, números y @#
      ]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Login válido', this.loginForm.value);
    } else {
      console.log('Login inválido');
      this.loginForm.markAllAsTouched();
    }
  }

  // Getters para el HTML
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}