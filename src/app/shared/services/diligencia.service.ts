import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Diligencia } from '../../core/models/diligencia.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiligenciaService {

  private API: string = environment.apiUrlBase;
  constructor(private http: HttpClient) { }

  getById(id: number): Observable<Diligencia>{
    return this.http.get<Diligencia>(`${this.API}/diligencia/${id}`);
  }

  addDiligencia(diligencia: Diligencia): Observable<Diligencia>{
    return this.http.post<Diligencia>(`${this.API}/diligencia`, diligencia);
  }

  deleteDiligencia(id: number){
    return this.http.delete(`${this.API}/diligencia/${id}`);
  }

  updateDiligencia(diligencia: Diligencia){
    return this.http.put(`${this.API}/diligencia`, diligencia);
  }
}
