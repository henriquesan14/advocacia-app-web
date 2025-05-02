import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Estado } from '../../core/models/estado.interface';
import { Cidade } from '../../core/models/cidade.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstadoService {

  private API: string = environment.apiUrlBase;
  constructor(private http: HttpClient) { }


  getEstados(): Observable<Estado[]>{
    return this.http.get<Estado[]>(`${this.API}/estado`);
  }

  getCidades(estadoId: number): Observable<Cidade[]>{
    return this.http.get<Cidade[]>(`${this.API}/estado/${estadoId}/cidades`);
  }
}
