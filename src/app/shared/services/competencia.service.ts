import { Injectable } from '@angular/core';
import { Competencia } from '../../core/models/competencia.interface';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CompetenciaService {

  private API: string = environment.apiUrlBase;
  constructor(private http: HttpClient) { }

  getCompetencias(parametros: any): Observable<Competencia[]>{
    let params = new HttpParams();
    for (const key in parametros) {
      if (parametros.hasOwnProperty(key) && parametros[key] !== null && parametros[key] !== undefined) {
        params = params.append(key, parametros[key]);
      }
    }
    return this.http.get<Competencia[]>(`${this.API}/competencia`, {params});
  }

  addCompetencia(competencia: Competencia): Observable<Competencia>{
    return this.http.post<Competencia>(`${this.API}/competencia`, competencia);
  }

  updateCompetencia(competencia: Competencia){
    return this.http.put(`${this.API}/competencia`, competencia);
  }

  deleteCompetencia(id: number){
    return this.http.delete(`${this.API}/competencia/${id}`);
  }
}
