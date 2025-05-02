import { Injectable } from '@angular/core';
import { ResponseLogin } from '../../core/models/response-login.interface';
import { Usuario } from '../../core/models/usuario.interface';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor() { }

  setAuthStorage(data: any){
    const dataString = JSON.stringify(data);
    localStorage.setItem('auth', dataString);
  }

  setUserStorage(newUser: Usuario){
    let auth = this.getAuthStorage();
    auth.user = newUser;
    localStorage.setItem('auth', JSON.stringify(auth));
  }

  getAuthStorage(): ResponseLogin{
    const dataString = localStorage.getItem('auth');
    return JSON.parse(dataString!);
  }

  removeAuthStorage(){
    localStorage.removeItem('auth');
  }
}
