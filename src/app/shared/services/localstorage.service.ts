import { Injectable } from '@angular/core';
import { Usuario } from '../../core/models/usuario.interface';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor() { }

  setUserStorage(data: Usuario){
    const dataString = JSON.stringify(data);
    localStorage.setItem('user', dataString);
  }

  getUserStorage(): Usuario{
    const dataString = localStorage.getItem('user');
    return JSON.parse(dataString!);
  }

  removeUsertorage(){
    localStorage.removeItem('user');
  }
}
