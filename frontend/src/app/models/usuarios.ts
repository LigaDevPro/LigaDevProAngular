export interface Usuario {
  idUsuario: number;
  username: string;
  email: string;
  rol_id?: number;
  rol_nombre?: string;
  is_active: boolean;
  date_joined: string;
}

export interface CreateUsuario {
  username: string;
  email: string;
  password: string;
  rol_id?: number;
}

export interface Rol {
  idRol: number;
  nombre: string;
  descripcion: string;
}

export interface CreateRol {
  nombre: string;
  descripcion: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: Usuario;
}
