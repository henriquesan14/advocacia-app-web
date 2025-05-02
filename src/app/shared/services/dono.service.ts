import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Dono } from '../../core/models/dono.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DonoService {

  private API: string = environment.apiUrlBase;
  constructor(private http: HttpClient) { }

  getDonos(parametros: any): Observable<Dono[]>{
    let params = new HttpParams();
    for (const key in parametros) {
      if (parametros.hasOwnProperty(key) && parametros[key] !== null && parametros[key] !== undefined) {
        params = params.append(key, parametros[key]);
      }
    }
    return this.http.get<Dono[]>(`${this.API}/dono`, {params});
  }

  cadastrarDono(dono: Dono){
    return this.http.post(`${this.API}/dono`, dono);
  }

  atualizarDono(dono: Dono){
    return this.http.put(`${this.API}/dono`, dono);
  }

  deleteDono(id: number){
    return this.http.delete(`${this.API}/dono/${id}`);
  }
}
