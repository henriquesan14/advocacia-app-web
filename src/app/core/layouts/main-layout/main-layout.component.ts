import { Component, inject } from '@angular/core';
import { LocalstorageService } from '../../../shared/services/localstorage.service';
import { AuthService } from '../../../shared/services/auth.service';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { HasRoleDirective } from '../../../shared/directives/has-role.directive';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzDropdownMenuComponent, NzDropDownModule } from 'ng-zorro-antd/dropdown';


@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, NzIconModule, NzLayoutModule, NzMenuModule, RouterModule, NzDropdownMenuComponent, NzDropDownModule, HasRoleDirective,
    NzSpinModule
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {
  isCollapsed = false;
  private router = inject(Router);
  private localStorageService = inject(LocalstorageService);
  private authService = inject(AuthService);

  isLoggingOut = false;

  menuItems = [
    {
      title: 'Sorteio',
      icon: 'setting',
      permission: 'VIEW_MATCHMAKING',
      children: [
        { label: 'Novo', link: 'matchmaking/generate', permission: 'GENERATE_MATCHMAKING' },
        { label: 'Histórico', link: 'matchmaking/list', permission: 'VIEW_MATCHMAKING' },
        { label: 'Ranking', link: 'player/ranking', permission: 'VIEW_PLAYER' },
      ]
    },
    {
      title: 'Controle de acesso',
      icon: 'lock',
      permission: 'VIEW_USER',
      children: [
        { label: 'Usuários', link: 'users/list', permission: 'VIEW_USER', },
        { label: 'Grupos', link: 'groups/list', permission: 'VIEW_USER', },
      ]
    },
  ]

  goToProfile() {
    this.router.navigateByUrl('/account/update-password');
  }
  
  logout() {
    this.isLoggingOut = true;
    // this.authService.logout().subscribe({
    //   next: () => {
    //     this.localStorageService.removeUsertorage();
    //     this.router.navigateByUrl('/login');
    //     this.isLoggingOut = false;
    //   }
    // })
  }

  get nomeUsuario(){
    const response = this.localStorageService.getAuthStorage();
    return response.user.nome;
  }

  get avatar(){
    const response = this.localStorageService.getAuthStorage();
    if(response && response.user && response.user.avatar){
      return response.user.urlFoto;
    }
    return '/images/avatar.webp';
  }
}
