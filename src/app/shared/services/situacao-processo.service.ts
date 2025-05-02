import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SituacaoProcesso } from '../../core/models/situacao-processo.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SituacaoProcessoService {

  private API: string = environment.apiUrlBase;
  constructor(private http: HttpClient) { }

  getSituacoes(parametros: any): Observable<SituacaoProcesso[]>{
    let params = new HttpParams();
    for (const key in parametros) {
      if (parametros.hasOwnProperty(key) && parametros[key] !== null && parametros[key] !== undefined) {
        params = params.append(key, parametros[key]);
      }
    }
    return this.http.get<SituacaoProcesso[]>(`${this.API}/situacaoprocesso`, {params});
  }

  addSituacao(situacao: SituacaoProcesso): Observable<SituacaoProcesso>{
    return this.http.post<SituacaoProcesso>(`${this.API}/situacaoprocesso`, situacao);
  }

  updateSituacao(situacao: SituacaoProcesso){
    return this.http.put(`${this.API}/situacaoprocesso`, situacao);
  }

  deleteSituacao(id: number){
    return this.http.delete(`${this.API}/situacaoprocesso/${id}`);
  }
}
