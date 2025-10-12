import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Usuario, CreateUsuario } from '../models/usuarios';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private apiUrl = 'http://localhost:8000/api/usuarios/';

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<Usuario[]> {
    return this.http
      .get<Usuario[]>(this.apiUrl)
      .pipe(catchError(this.handleError<Usuario[]>('getUsuarios', [])));
  }

  getUsuario(id: number): Observable<Usuario> {
    const url = `${this.apiUrl}/${id}/`;
    return this.http
      .get<Usuario>(url)
      .pipe(catchError(this.handleError<Usuario>(`getUsuario id=${id}`)));
  }

  createUsuario(usuario: CreateUsuario): Observable<Usuario> {
    return this.http
      .post<Usuario>(this.apiUrl, usuario, this.httpOptions)
      .pipe(catchError(this.handleError<Usuario>('createUsuario')));
  }

  updateUsuario(id: number, usuario: Partial<CreateUsuario>): Observable<Usuario> {
    const url = `${this.apiUrl}/${id}/`;
    return this.http
      .put<Usuario>(url, usuario, this.httpOptions)
      .pipe(catchError(this.handleError<Usuario>('updateUsuario')));
  }

  patchUsuario(id: number, campos: Partial<Usuario>): Observable<Usuario> {
    const url = `${this.apiUrl}/${id}/`;
    return this.http
      .patch<Usuario>(url, campos, this.httpOptions)
      .pipe(catchError(this.handleError<Usuario>('patchUsuario')));
  }

  deleteUsuario(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}/`;
    return this.http
      .delete(url, this.httpOptions)
      .pipe(catchError(this.handleError<any>('deleteUsuario')));
  }

  getUsuariosPorRol(rolNombre: string): Observable<Usuario[]> {
    const url = `${this.apiUrl}?rol_nombre=${rolNombre}`;
    return this.http
      .get<Usuario[]>(url)
      .pipe(catchError(this.handleError<Usuario[]>('getUsuariosPorRol', [])));
  }

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      console.error('Error completo:', error);
      return of(result as T);
    };
  }
}
