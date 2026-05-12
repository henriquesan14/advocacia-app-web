import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Tarefa } from '../../core/models/tarefa.interface';
import { UpdateStatusTarefa } from '../../core/models/update-status-tarefa.interface';

@Injectable({
  providedIn: 'root'
})
export class TarefaService {

  private API: string = environment.apiUrlBase;
  constructor(private http: HttpClient) { }

  getTarefas(parametros: any): Observable<Tarefa[]>{
    let params = new HttpParams();
    for (const key in parametros) {
      if (parametros.hasOwnProperty(key) && parametros[key] !== null && parametros[key] !== undefined) {
        params = params.append(key, parametros[key]);
      }
    }
    return this.http.get<Tarefa[]>(`${this.API}/tarefa`, {params});
  }

  updateStatusTarefa(updateStatusTarefa: UpdateStatusTarefa){
    return this.http.patch(`${this.API}/tarefa`, updateStatusTarefa);
  }
}
