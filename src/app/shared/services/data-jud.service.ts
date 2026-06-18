import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Movimento } from '../../core/models/movimento.interface';

@Injectable({
  providedIn: 'root'
})
export class DataJudService {

  private API: string = environment.apiUrlBase;

  constructor(private http: HttpClient) {}

  consultarProcesso(nroProcesso: string) {
    return this.http.post<Movimento[]>(`${this.API}/datajud`, {nroProcesso});
  }

}