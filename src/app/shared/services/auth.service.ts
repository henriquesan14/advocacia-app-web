import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login } from '../../core/models/login.interface';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Usuario } from '../../core/models/usuario.interface';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API: string = environment.apiUrlBase;
  constructor(private http: HttpClient) { }

  login(credenciais: Login): Observable<Usuario>{
    return this.http.post<Usuario>(`${this.API}/auth`, credenciais);
  }

   refreshToken(): Observable<Usuario>{
      return this.http.post<Usuario>(`${this.API}/auth/refresh-token`, {});
  }

  logout(){
    return this.http.post(`${this.API}/auth/logout`, {},);
  }

}
