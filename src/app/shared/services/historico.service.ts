import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Historico } from '../../core/models/historico.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistoricoService {

  private API: string = environment.apiUrlBase;
  constructor(private http: HttpClient) { }

  getById(id: number): Observable<Historico>{
    return this.http.get<Historico>(`${this.API}/historico/${id}`);
  }

  addHistorico(historico: Historico): Observable<Historico>{
    return this.http.post<Historico>(`${this.API}/historico`, historico);
  }

  deleteHistorico(id: number){
    return this.http.delete(`${this.API}/historico/${id}`);
  }

  updateHistorico(historico: Historico){
    return this.http.put(`${this.API}/historico`, historico);
  }
}
