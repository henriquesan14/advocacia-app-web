import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnderecoViaCep } from '../../core/models/endereco-viacep.interface';

@Injectable({
  providedIn: 'root'
})
export class ViaCepService {

  private API_VIA_CEP: string = 'https://viacep.com.br/ws';
  constructor(private http: HttpClient) { }

  getCep(cep: string): Observable<EnderecoViaCep>{
    return this.http.get<EnderecoViaCep>(`${this.API_VIA_CEP}/${cep}/json`);
  } 
}
