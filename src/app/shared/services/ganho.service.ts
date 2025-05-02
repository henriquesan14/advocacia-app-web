import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ganho } from '../../core/models/ganho.interface';

@Injectable({
  providedIn: 'root'
})
export class GanhoService {
  private API: string = environment.apiUrlBase;
  constructor(private http: HttpClient) { }

  getGanhos(parametros: any): Observable<Ganho[]>{
    let params = new HttpParams();
    for (const key in parametros) {
      if (parametros.hasOwnProperty(key) && parametros[key] !== null && parametros[key] !== undefined) {
        params = params.append(key, parametros[key]);
      }
    }
    return this.http.get<Ganho[]>(`${this.API}/ganho`, {params});
  }

  getById(id: number): Observable<Ganho>{
    return this.http.get<Ganho>(`${this.API}/ganho/${id}`);
  }

  addGanho(despesa: Ganho): Observable<Ganho>{
    return this.http.post<Ganho>(`${this.API}/ganho`, despesa);
  }

  deleteGanho(id: number){
    return this.http.delete(`${this.API}/ganho/${id}`);
  }

  updateGanho(despesa: Ganho){
    return this.http.put(`${this.API}/ganho`, despesa);
  }
  
}
