import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Historical } from '../../core/models/historical.interface';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private API: string = environment.apiUrlBase;
  constructor(private http: HttpClient) { }

  summary(parametros: any): Observable<any>{
    let params = new HttpParams();
    for (const key in parametros) {
      if (parametros.hasOwnProperty(key) && parametros[key] !== null && parametros[key] !== undefined) {
        params = params.append(key, parametros[key]);
      }
    }
    return this.http.get<any>(`${this.API}/dashboard/summary`, {params});
  }

  historical(parametros: any): Observable<Historical>{
    let params = new HttpParams();
    for (const key in parametros) {
      if (parametros.hasOwnProperty(key) && parametros[key] !== null && parametros[key] !== undefined) {
        params = params.append(key, parametros[key]);
      }
    }
    return this.http.get<Historical>(`${this.API}/dashboard/historical`, {params});
  }

  recentTransactions(): Observable<any>{
    return this.http.get<any>(`${this.API}/dashboard/recent-transactions`);
  }

  statisticsByType(parametros: any): Observable<any>{
    let params = new HttpParams();
    for (const key in parametros) {
      if (parametros.hasOwnProperty(key) && parametros[key] !== null && parametros[key] !== undefined) {
        params = params.append(key, parametros[key]);
      }
    }
    return this.http.get<any>(`${this.API}/dashboard/statistics-by-type`, {params});
  }

  
}
