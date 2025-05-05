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
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFile } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, NzIconModule, NzLayoutModule, NzMenuModule, RouterModule, NzDropdownMenuComponent, NzDropDownModule, HasRoleDirective,
    NzSpinModule, FontAwesomeModule, NzIconModule
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {
  isCollapsed = false;
  faFile = faFile;
  private router = inject(Router);
  private localStorageService = inject(LocalstorageService);
  private authService = inject(AuthService);

  isLoggingOut = false;

  menuItems = [
    {
      title: 'Processos',
      icon: 'file-add',
      permission: 'VISUALIZAR_PROCESSO',
      children: [
        { label: 'Listar', link: 'processos/list', permission: 'CADASTRAR_PROCESSO' },
        { label: 'Novo', link: 'processos/cadastro', permission: 'VISUALIZAR_PROCESSO' },
      ]
    },
    {
      title: 'Eventos',
      icon: 'calendar',
      permission: 'VISUALIZAR_EVENTO',
      children: [
        { label: 'Listar', link: 'eventos/list', permission: 'CADASTRAR_EVENTO' },
        { label: 'Novo', link: 'eventos/cadastro', permission: 'VISUALIZAR_EVENTO' },
      ]
    },
    {
      title: 'Partes',
      icon: 'user',
      permission: 'VISUALIZAR_PARTE',
      children: [
        { label: 'Listar', link: 'partes/list', permission: 'VISUALIZAR_PARTE', },
        { label: 'Novo', link: 'partes/cadastro', permission: 'CADASTRAR_PARTE', },
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
