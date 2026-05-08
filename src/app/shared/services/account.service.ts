import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UpdateProfile } from '../../core/models/update-profile.interface';
import { Observable } from 'rxjs';
import { Usuario } from '../../core/models/usuario.interface';
import { UpdatePassword } from '../../core/models/update-password.interface';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private API: string = environment.apiUrlBase;
  constructor(private http: HttpClient) { }

  atualizarPerfil(updateProfile: UpdateProfile): Observable<Usuario>{
    return this.http.put<Usuario>(`${this.API}/account`, updateProfile);
  }

  atualizarSenha(updatePassword: UpdatePassword){
    return this.http.put<Usuario>(`${this.API}/account/password`, updatePassword);
  }

  atualizarAvatar(fileUpload: File): Observable<Usuario> {
    const formData: FormData = new FormData();
    formData.append('FormFile', fileUpload, fileUpload.name);
    return this.http.put<Usuario>(`${this.API}/account/avatar`, formData);
  }

  removerAvatar(): Observable<void> {
    return this.http.delete<void>(`${this.API}/account/avatar`);
  }
}
