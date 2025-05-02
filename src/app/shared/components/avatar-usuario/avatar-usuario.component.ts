import { Component } from '@angular/core';
import { LocalstorageService } from '../../services/localstorage.service';

@Component({
  selector: 'app-avatar-usuario',
  standalone: true,
  imports: [],
  templateUrl: './avatar-usuario.component.html',
  styleUrl: './avatar-usuario.component.css'
})
export class AvatarUsuarioComponent {

  constructor(private localStorageService: LocalstorageService){}

  get avatar(){
    const response = this.localStorageService.getAuthStorage();
    if(response.user.avatar){
      return response.user.avatar.url;
    }
    return '/images/avatar.webp';
  }

}
