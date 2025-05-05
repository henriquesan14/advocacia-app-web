import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Audiencia } from '../../core/models/audiencia.interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AudienciaService {

  private API: string = environment.apiUrlBase;
  constructor(private http: HttpClient) { }

  getById(id: number): Observable<Audiencia>{
    return this.http.get<Audiencia>(`${this.API}/audiencia/${id}`);
  }

  addAudiencia(audiencia: Audiencia): Observable<Audiencia>{
    return this.http.post<Audiencia>(`${this.API}/audiencia`, audiencia);
  }

  deleteAudiencia(id: string){
    return this.http.delete(`${this.API}/audiencia/${id}`);
  }

  updateAudiencia(audiencia: Audiencia){
    return this.http.put(`${this.API}/audiencia`, audiencia);
  }
}
