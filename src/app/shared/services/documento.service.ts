import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Documento } from '../../core/models/documento.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentoService {

  private API: string = environment.apiUrlBase;
  constructor(private http: HttpClient) { }

  cadastrarDocumento(documento: Documento): Observable<Documento>{
    return this.http.post<Documento>(`${this.API}/documento`, documento);
  }

  removeDocumento(id: string){
    return this.http.delete(`${this.API}/documento/${id}`);
  }
}
