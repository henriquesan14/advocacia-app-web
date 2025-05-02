import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login } from '../../core/models/login.interface';
import { ResponseLogin } from '../../core/models/response-login.interface';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API: string = environment.apiUrlBase;
  constructor(private http: HttpClient) { }

  login(credenciais: Login): Observable<ResponseLogin>{
    return this.http.post<ResponseLogin>(`${this.API}/auth`, credenciais);
  }

}
