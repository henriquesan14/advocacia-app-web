import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LocalstorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(private toastr: ToastrService, private localStorageService: LocalstorageService) { }

  handleErrors(res: HttpErrorResponse): void {
    const auth = this.localStorageService.getAuthStorage();
    if(res.status == 403){
      this.toastr.error('Você não tem permissão para isso.');
      return;
    }
    if(res.status == 401 && auth){
      this.toastr.error('Sua sessão expirou');
      this.localStorageService.removeAuthStorage();
      return;
    }
    if(res.status == 401 && auth == null){
      this.toastr.error('Email/Senha incorreto(s)');
      return;
    }
    if (res.error.errors) {
      for (const [key, value] of Object.entries(res.error.errors)) {
        this.toastr.error(`${key}: ${value}`, 'Erro!');
      }
    } else if (res.error.message) {
      this.toastr.error(`${res.error.message}`, 'Erro!');
    }
    else {
      this.toastr.error('Ocorreu um erro.', 'Erro!');
    }
  }
}
