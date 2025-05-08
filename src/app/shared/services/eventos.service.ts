import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evento } from '../../core/models/evento.interface';
import { UpdateStatusEvento } from '../../core/models/update-status.evento.interface';
import { ResponsePage } from '../../core/models/response-page.interface';

@Injectable({
  providedIn: 'root'
})
export class EventosService {
  private API = environment.apiUrlBase;
  constructor(private http: HttpClient) { }

  getEventos(parametros: any): Observable<ResponsePage<Evento>>{
    let params = new HttpParams();
    for (const key in parametros) {
      if (parametros.hasOwnProperty(key) && parametros[key] !== null && parametros[key] !== undefined) {
        params = params.append(key, parametros[key]);
      }
    }
    return this.http.get<ResponsePage<Evento>>(`${this.API}/evento`, {params});
  }

  getById(id: string): Observable<Evento>{
    return this.http.get<Evento>(`${this.API}/evento/${id}`);
  }

  addEvento(evento: any): Observable<Evento>{
    return this.http.post<Evento>(`${this.API}/evento`, evento);
  }

  updateEvento(evento: any){
    return this.http.put<Evento>(`${this.API}/evento`, evento);
  }

  updateStatus(updateStatus: UpdateStatusEvento){
    return this.http.patch(`${this.API}/evento/status`, updateStatus);
  }

  deleteEvento(eventoId: number){
    return this.http.delete(`${this.API}/evento/${eventoId}`);
  }
}
