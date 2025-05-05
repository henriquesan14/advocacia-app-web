import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Processo } from '../../core/models/processo.interface';
import { ResponsePage } from '../../core/models/response-page.interface';
import { environment } from '../../../environments/environment';
import { AutorProcesso } from '../../core/models/autor-processo.interface';
import { ReuProcesso } from '../../core/models/reu-processo.interface';
import { Diligencia } from '../../core/models/diligencia.interface';
import { Historico } from '../../core/models/historico.interface';
import { Audiencia } from '../../core/models/audiencia.interface';
import { Parte } from '../../core/models/parte.interface';
import { Documento } from '../../core/models/documento.interface';

@Injectable({
  providedIn: 'root'
})
export class ProcessosService {

  private API: string = environment.apiUrlBase;
  constructor(private http: HttpClient) { }

  getProcessos(parametros: any): Observable<ResponsePage<Processo>>{
    let params = new HttpParams();
    for (const key in parametros) {
      if (parametros.hasOwnProperty(key) && parametros[key] !== null && parametros[key] !== undefined) {
        params = params.append(key, parametros[key]);
      }
    }
    return this.http.get<ResponsePage<Processo>>(`${this.API}/processo`, {params});
  }

  getMeusProcessos(parametros: any): Observable<ResponsePage<Processo>>{
    let params = new HttpParams();
    for (const key in parametros) {
      if (parametros.hasOwnProperty(key) && parametros[key] !== null && parametros[key] !== undefined) {
        params = params.append(key, parametros[key]);
      }
    }
    return this.http.get<ResponsePage<Processo>>(`${this.API}/processo/meusProcessos`, {params});
  }

  getProcessoById(idProcesso: string): Observable<Processo>{
    return this.http.get<Processo>(`${this.API}/processo/${idProcesso}`);
  }

  cadastrarProcesso(processo: Processo): Observable<Processo>{
    return this.http.post<Processo>(`${this.API}/processo`, processo);
  }

  updateProcesso(processo: Processo): Observable<Processo>{
    return this.http.put<Processo>(`${this.API}/processo`, processo);
  }
  
  addReuProcesso(reuProcesso: ReuProcesso): Observable<void>{
    return this.http.put<void>(`${this.API}/processo/reus`, reuProcesso);
  }

  addAutorProcesso(autorProcesso: AutorProcesso): Observable<void>{
    return this.http.put<void>(`${this.API}/processo/autores`, autorProcesso);
  }

  deleteAutorProcesso(autorProcesso: AutorProcesso): Observable<void>{
    return this.http.delete<void>(`${this.API}/processo/${autorProcesso.processoId}/autores/${autorProcesso.autorId}`);
  }

  deleteReuProcesso(reuProcesso: ReuProcesso): Observable<void>{
    return this.http.delete<void>(`${this.API}/processo/${reuProcesso.processoId}/reus/${reuProcesso.reuId}`);
  }

  getDiligencias(id: number): Observable<Diligencia[]>{
    return this.http.get<Diligencia[]>(`${this.API}/processo/${id}/diligencias`);
  }

  getHistoricos(id: number,parametros: any): Observable<ResponsePage<Historico>>{
    let params = new HttpParams();
    for (const key in parametros) {
      if (parametros.hasOwnProperty(key) && parametros[key] !== null && parametros[key] !== undefined) {
        params = params.append(key, parametros[key]);
      }
    }
    return this.http.get<ResponsePage<Historico>>(`${this.API}/processo/${id}/historicos`, {params});
  }

  getAudiencias(id: number): Observable<Audiencia[]>{
    return this.http.get<Audiencia[]>(`${this.API}/processo/${id}/audiencias`);
  }

  getReus(id: number): Observable<Parte[]>{
    return this.http.get<Parte[]>(`${this.API}/processo/${id}/reus`);
  }

  getAutores(id: number): Observable<Parte[]>{
    return this.http.get<Parte[]>(`${this.API}/processo/${id}/autores`);
  }

  getDocumentos(id: number): Observable<Documento[]>{
    return this.http.get<Documento[]>(`${this.API}/processo/${id}/documentos`);
  }

  aprovarProcesso(id: number){
    return this.http.patch(`${this.API}/processo`, {id});
  }

  resetarDataHistoricoProcesso(id: number){
    return this.http.patch(`${this.API}/processo/resetDataHistoricoProcesso`, {id});
  }
}
