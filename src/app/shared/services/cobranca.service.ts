import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Cobranca } from '../../core/models/cobranca.interface';
import { CobrancaResponse } from '../../core/models/cobranca-response.interface';
import { Observable } from 'rxjs';
import { AsaasResponse } from '../../core/models/asaas-response.interface';
import { DeleteCobrancaResponse } from '../../core/models/delete-cobranca-response.interface';

@Injectable({
  providedIn: 'root'
})
export class CobrancaService {

  private API: string = environment.apiUrlBase;
  constructor(private http: HttpClient) { }

  getCobrancas(parametros: any): Observable<AsaasResponse<CobrancaResponse>>{
    let params = new HttpParams();
    for (const key in parametros) {
      if (parametros.hasOwnProperty(key) && parametros[key] !== null && parametros[key] !== undefined) {
        params = params.append(key, parametros[key]);
      }
    }
    return this.http.get<AsaasResponse<CobrancaResponse>>(`${this.API}/cobranca`, {params});
  }

  gerarCobranca(cobranca: Cobranca): Observable<CobrancaResponse>{
    return this.http.post<CobrancaResponse>(`${this.API}/cobranca`, cobranca);
  }

  deleteCobrancaCobranca(id: string): Observable<DeleteCobrancaResponse>{
    return this.http.delete<DeleteCobrancaResponse>(`${this.API}/cobranca/${id}`);
  }
}
