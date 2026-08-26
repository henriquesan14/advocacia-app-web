import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login } from '../../core/models/login.interface';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Usuario } from '../../core/models/usuario.interface';
import { ImpersonationResponse } from '../../core/models/impersonation.interface';


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

  startImpersonation(targetUserId: string): Observable<ImpersonationResponse> {
    return this.http.post<ImpersonationResponse>(`${this.API}/platform/impersonations`, { targetUserId });
  }

  stopImpersonation(): Observable<ImpersonationResponse> {
    return this.http.delete<ImpersonationResponse>(`${this.API}/platform/impersonations/current`);
  }

}
