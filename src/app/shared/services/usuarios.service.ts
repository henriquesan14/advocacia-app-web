import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Usuario } from '../../core/models/usuario.interface';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private API: string = environment.apiUrlBase;
  constructor(private http: HttpClient) { }

  getUsuarios(parametros: any): Observable<Usuario[]>{
    let params = new HttpParams();
    for (const key in parametros) {
      if (parametros.hasOwnProperty(key) && parametros[key] !== null && parametros[key] !== undefined) {
        params = params.append(key, parametros[key]);
      }
    }
    return this.http.get<Usuario[]>(`${this.API}/usuario`, {params});
  }

  getResponsaveis(parametros: any): Observable<Usuario[]>{
    let params = new HttpParams();
    for (const key in parametros) {
      if (parametros.hasOwnProperty(key) && parametros[key] !== null && parametros[key] !== undefined) {
        params = params.append(key, parametros[key]);
      }
    }
    return this.http.get<Usuario[]>(`${this.API}/usuario/responsaveis`, {params});
  }

  addUsuario(usuario: Usuario){
    return this.http.post(`${this.API}/usuario`, usuario);
  }

  getUsuarioById(idUsuario: string): Observable<Usuario>{
    return this.http.get<Usuario>(`${this.API}/usuario/${idUsuario}`);
  }

  updateUsuario(usuario: Usuario){
    return this.http.put(`${this.API}/usuario`, usuario);
  }
  
  deleteUsuario(usuarioId: string){
    return this.http.delete(`${this.API}/usuario/${usuarioId}`);
  }
}
