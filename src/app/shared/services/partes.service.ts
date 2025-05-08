import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Parte } from '../../core/models/parte.interface';
import { environment } from '../../../environments/environment';
import { ResponsePage } from '../../core/models/response-page.interface';

@Injectable({
  providedIn: 'root'
})
export class PartesService {

  private API: string = environment.apiUrlBase;
  constructor(private http: HttpClient) { }

  getPartes(parametros: any): Observable<ResponsePage<Parte>>{
    let params = new HttpParams();
    for (const key in parametros) {
      if (parametros.hasOwnProperty(key) && parametros[key] !== null && parametros[key] !== undefined) {
        params = params.append(key, parametros[key]);
      }
    }
    return this.http.get<ResponsePage<Parte>>(`${this.API}/parte`, {params});
  }

  addParte(parte: Parte): Observable<Parte>{
    return this.http.post<Parte>(`${this.API}/parte`, parte);
  }

  getParteById(id: string): Observable<Parte>{
    return this.http.get<Parte>(`${this.API}/parte/${id}`);
  }

  updateParte(parte: Parte){
    return this.http.put(`${this.API}/parte`, parte);
  }

  delete(id: string){
    return this.http.delete(`${this.API}/parte/${id}`);
  }

  generateUser(parteId: string){
    return this.http.post(`${this.API}/parte/generateUser`, {parteId});
  }
}
