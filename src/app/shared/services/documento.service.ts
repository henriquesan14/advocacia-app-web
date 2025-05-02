import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Documento } from '../../core/models/documento.interface';

@Injectable({
  providedIn: 'root'
})
export class DocumentoService {

  private API: string = environment.apiUrlBase;
  constructor(private http: HttpClient) { }

  cadastrarDocumento(documento: Documento){
    return this.http.post(`${this.API}/documento`, documento);
  }

  removeDocumento(id: number){
    return this.http.delete(`${this.API}/documento/${id}`);
  }
}
