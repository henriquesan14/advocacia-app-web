import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Comarca } from '../../core/models/comarca.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComarcaService {

  private API: string = environment.apiUrlBase;
  constructor(private http: HttpClient) { }

  getComarcas(parametros: any): Observable<Comarca[]>{
    let params = new HttpParams();
    for (const key in parametros) {
      if (parametros.hasOwnProperty(key) && parametros[key] !== null && parametros[key] !== undefined) {
        params = params.append(key, parametros[key]);
      }
    }
    return this.http.get<Comarca[]>(`${this.API}/comarca`, {params});
  }

  addComarca(comarca: Comarca): Observable<Comarca>{
    return this.http.post<Comarca>(`${this.API}/comarca`, comarca);
  }

  updateComarca(comarca: Comarca){
    return this.http.put(`${this.API}/comarca`, comarca);
  }

  deleteComarca(id: number){
    return this.http.delete(`${this.API}/comarca/${id}`);
  }
}
