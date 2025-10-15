import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Usuario, CreateUsuario, LoginResponse } from '../models/usuarios';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getCurrentUser(): Usuario | null {
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
      try {
        return JSON.parse(usuario);
      } catch {
        return null;
      }
    }
    return null;
  }

  isAdmin(): boolean {
    const usuario = this.getCurrentUser();
    return usuario?.rol_nombre === 'Administrador' || usuario?.rol_id === 1;
  }

  hasRole(rolNombre: string): boolean {
    const usuario = this.getCurrentUser();
    return usuario?.rol_nombre === rolNombre;
  }

  login(email: string, password: string): Observable<LoginResponse> {
    const url = `${this.apiUrl}/auth/login/`;
    return this.http
      .post<LoginResponse>(url, { email, password })
      .pipe(catchError(this.handleError<LoginResponse>('login')));
  }

  logout(): Observable<any> {
    const url = `${this.apiUrl}/auth/logout/`;
    return this.http.post(url, {}).pipe(catchError(this.handleError<any>('logout')));
  }

  crearUsuario(usuario: CreateUsuario): Observable<Usuario> {
    const url = `${this.apiUrl}/usuarios/`;
    return this.http
      .post<Usuario>(url, usuario)
      .pipe(catchError(this.handleError<Usuario>('crearUsuario')));
  }

  getUsuarios(): Observable<Usuario[]> {
    const url = `${this.apiUrl}/usuarios/`;
    return this.http
      .get<Usuario[]>(url)
      .pipe(catchError(this.handleError<Usuario[]>('getUsuarios', [])));
  }

  getUserProfile(): Observable<Usuario> {
    const url = `${this.apiUrl}/auth/profile/`;
    return this.http
      .get<Usuario>(url)
      .pipe(catchError(this.handleError<Usuario>('getUserProfile')));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      return of(result as T);
    };
  }
}
