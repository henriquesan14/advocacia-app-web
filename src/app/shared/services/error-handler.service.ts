import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LocalstorageService } from './localstorage.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  toastr = inject(ToastrService);
  localStorageService = inject(LocalstorageService);

  handleErrors(res: HttpErrorResponse): void {
    const auth = this.localStorageService.getUserStorage();
    if (res.status == 403) {
      this.toastr.error('Você não tem permissão para isso.');
      return;
    }
    if (res.status == 401 && auth) {
      this.localStorageService.removeUsertorage();
      return;
    }
    if (res?.error && res.error?.errors) {
      for (const [key, value] of Object.entries(res.error.errors)) {
        this.toastr.error(`${key}: ${value}`, 'Erro!');
      }
    }
    else if (res?.error && res.error?.detail) {
      if(environment.production){
        this.toastr.error(`Houve um erro, tente novamente mais tarde`, 'Erro!');
        return;
      }
      this.toastr.error(`${res.error.detail}`, 'Erro!');
    }
    else if (res?.error?.message) {
      if(environment.production){
        this.toastr.error(`Houve um erro, tente novamente mais tarde`, 'Erro!');
        return;
      }
      this.toastr.error(`${res.error.message}`, 'Erro!');
    }
    
  }
}
