import { Injectable } from '@angular/core';
import { PermissaoCategoria } from '../../core/models/permissao-categoria';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PermissaoService {

  private API: string = environment.apiUrlBase;
  constructor(private http: HttpClient) { }

  getPermissoes(): Observable<PermissaoCategoria[]>{
    return this.http.get<PermissaoCategoria[]>(`${this.API}/permissao`);
  }

}
