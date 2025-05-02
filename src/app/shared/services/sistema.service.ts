import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Sistema } from '../../core/models/sistema.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SistemaService {

  private API: string = environment.apiUrlBase;
  constructor(private http: HttpClient) { }

  getSistemas(parametros: any): Observable<Sistema[]>{
    let params = new HttpParams();
    for (const key in parametros) {
      if (parametros.hasOwnProperty(key) && parametros[key] !== null && parametros[key] !== undefined) {
        params = params.append(key, parametros[key]);
      }
    }
    return this.http.get<Sistema[]>(`${this.API}/sistema`, {params});
  }

  addSistema(sistema: Sistema): Observable<Sistema>{
    return this.http.post<Sistema>(`${this.API}/sistema`, sistema);
  }

  updateSistema(sistema: Sistema): Observable<Sistema>{
    return this.http.put<Sistema>(`${this.API}/sistema`, sistema);
  }

  deleteSistema(id: number){
    return this.http.delete(`${this.API}/sistema/${id}`);
  }
}
