import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Grupo } from '../../core/models/grupo.interface';

@Injectable({
  providedIn: 'root'
})
export class GrupoService {
  private API = environment.apiUrlBase;
  constructor(private http: HttpClient) { }

  getGrupos(parametros: any): Observable<Grupo[]>{
    let params = new HttpParams();
    for (const key in parametros) {
      if (parametros.hasOwnProperty(key) && parametros[key] !== null && parametros[key] !== undefined) {
        params = params.append(key, parametros[key]);
      }
    }
    return this.http.get<Grupo[]>(`${this.API}/grupo`, {params});
  }

  addGrupo(grupo: any): Observable<Grupo>{
    return this.http.post<Grupo>(`${this.API}/grupo`, grupo);
  }

  getGrupoById(id: number){
    return this.http.get<Grupo>(`${this.API}/grupo/${id}`);
  }

  updateGrupo(grupo: any){
    return this.http.put(`${this.API}/grupo`, grupo);
  }

  deleteGrupo(id: number){
    return this.http.delete(`${this.API}/grupo/${id}`);
  }
}
