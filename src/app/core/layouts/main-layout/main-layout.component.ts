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
import { NotificationsComponent } from '../../../shared/components/notifications/notifications.component';
import { NotificationService } from '../../../shared/services/notification.service';


@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, NzIconModule, NzLayoutModule, NzMenuModule, RouterModule, NzDropdownMenuComponent, NzDropDownModule, HasRoleDirective,
    NzSpinModule, FontAwesomeModule, NzIconModule, NotificationsComponent
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {
  isCollapsed = true;
  faFile = faFile;
  private router = inject(Router);
  private localStorageService = inject(LocalstorageService);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  isLoggingOut = false;

  menuItems = [
    {
      title: 'Dashboard',
      icon: 'bar-chart',
      permission: 'LISTAR_DASHBOARD',
      children: [
        { label: 'Visualizar', link: 'dashboard', permission: 'LISTAR_DASHBOARD' },
      ]
    },
    {
      title: 'Processos',
      icon: 'file-add',
      permission: 'LISTAR_PROCESSO',
      children: [
        { label: 'Visualizar', link: 'processos/list', permission: 'LISTAR_PROCESSO' },
        { label: 'Novo', link: 'processos/cadastro', permission: 'CADASTRAR_PROCESSO' },
      ]
    },
    {
      title: 'Agenda',
      icon: 'calendar',
      permission: 'LISTAR_EVENTO',
      children: [
        { label: 'Visualizar', link: 'eventos/list', permission: 'LISTAR_EVENTO' },
      ]
    },
    {
      title: 'Partes',
      icon: 'user',
      permission: 'LISTAR_PARTE',
      children: [
        { label: 'Visualizar', link: 'partes/list', permission: 'LISTAR_PARTE', },
      ]
    },
    {
      title: 'Usuários',
      icon: 'user-add',
      permission: 'LISTAR_USUARIO',
      children: [
        { label: 'Visualizar', link: 'usuarios/list', permission: 'LISTAR_USUARIO', },
      ]
    },
    {
      title: 'Grupos',
      icon: 'usergroup-add',
      permission: 'LISTAR_GRUPO',
      children: [
        { label: 'Visualizar', link: 'grupos/list', permission: 'LISTAR_GRUPO', },
      ]
    },
    {
      title: 'Comarcas',
      icon: 'bank',
      permission: 'LISTAR_COMARCA',
      children: [
        { label: 'Visualizar', link: 'comarcas/list', permission: 'LISTAR_COMARCA', },
      ]
    },
    {
      title: 'Competências',
      icon: 'tag',
      permission: 'LISTAR_COMPETENCIA',
      children: [
        { label: 'Visualizar', link: 'competencias/list', permission: 'LISTAR_COMPETENCIA', },
      ]
    },
    {
      title: 'Situações',
      icon: 'flag',
      permission: 'LISTAR_SITUACAO',
      children: [
        { label: 'Visualizar', link: 'situacoes/list', permission: 'LISTAR_SITUACAO', },
      ]
    },
    {
      title: 'Donos',
      icon: 'trophy',
      permission: 'LISTAR_DONO',
      children: [
        { label: 'Visualizar', link: 'donos/list', permission: 'LISTAR_DONO', },
      ]
    },
    {
      title: 'Sistemas',
      icon: 'desktop',
      permission: 'LISTAR_SISTEMA',
      children: [
        { label: 'Visualizar', link: 'sistemas/list', permission: 'LISTAR_SISTEMA', },
      ]
    },
    {
      title: 'Despesas',
      icon: 'barcode',
      permission: 'LISTAR_DESPESA',
      children: [
        { label: 'Visualizar', link: 'despesas/list', permission: 'LISTAR_DESPESA', },
      ]
    },
    {
      title: 'Ganhos',
      icon: 'dollar',
      permission: 'LISTAR_GANHO',
      children: [
        { label: 'Visualizar', link: 'ganhos/list', permission: 'LISTAR_GANHO', },
      ]
    },
  ]

  goToUpdatePassword() {
    this.router.navigateByUrl('/account/update-password');
  }

  goToUpdateProfile(){
    this.router.navigateByUrl('/account/update-profile');
  }
  
  logout() {
    this.isLoggingOut = true;
    this.authService.logout().subscribe({
      next: () => {
        this.notificationService.stopConnection();
        this.localStorageService.removeUsertorage();
        this.router.navigateByUrl('/login');
        this.isLoggingOut = false;
      }
    })
  }

  get nomeUsuario(){
    const response = this.localStorageService.getUserStorage();
    return response?.nome;
  }

  get avatar(){
    const user = this.localStorageService.getUserStorage();
    if(user && user.avatar){
      return user.avatar.url;
    }
    return '/images/avatar.webp';
  }
}
