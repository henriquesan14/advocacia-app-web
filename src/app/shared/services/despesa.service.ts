import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Despesa } from '../../core/models/despesa.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DespesaService {
  private API: string = environment.apiUrlBase;
  constructor(private http: HttpClient) { }

  getDespesas(parametros: any): Observable<Despesa[]>{
    let params = new HttpParams();
    for (const key in parametros) {
      if (parametros.hasOwnProperty(key) && parametros[key] !== null && parametros[key] !== undefined) {
        params = params.append(key, parametros[key]);
      }
    }
    return this.http.get<Despesa[]>(`${this.API}/despesa`, {params});
  }

  getById(id: number): Observable<Despesa>{
    return this.http.get<Despesa>(`${this.API}/despesa/${id}`);
  }

  addDespesa(despesa: Despesa): Observable<Despesa>{
    return this.http.post<Despesa>(`${this.API}/despesa`, despesa);
  }

  deleteDespesa(id: number){
    return this.http.delete(`${this.API}/despesa/${id}`);
  }

  updateDespesa(despesa: Despesa){
    return this.http.put(`${this.API}/despesa`, despesa);
  }

  pagarDespesa(id: number){
    return this.http.patch(`${this.API}/despesa`, {id});
  }
  
}
