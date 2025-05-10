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
  isCollapsed = true;
  faFile = faFile;
  private router = inject(Router);
  private localStorageService = inject(LocalstorageService);
  private authService = inject(AuthService);

  isLoggingOut = false;

  menuItems = [
    {
      title: 'Dashboard',
      icon: 'bar-chart',
      permission: 'VISUALIZAR_DASHBOARD',
      children: [
        { label: 'Visualizar', link: 'dashboard', permission: 'VISUALIZAR_DASHBOARD' },
      ]
    },
    {
      title: 'Processos',
      icon: 'file-add',
      permission: 'VISUALIZAR_PROCESSO',
      children: [
        { label: 'Visualizar', link: 'processos/list', permission: 'CADASTRAR_PROCESSO' },
        { label: 'Novo', link: 'processos/cadastro', permission: 'VISUALIZAR_PROCESSO' },
      ]
    },
    {
      title: 'Agenda',
      icon: 'calendar',
      permission: 'VISUALIZAR_EVENTO',
      children: [
        { label: 'Visualizar', link: 'eventos/list', permission: 'CADASTRAR_EVENTO' },
      ]
    },
    {
      title: 'Partes',
      icon: 'user',
      permission: 'VISUALIZAR_PARTE',
      children: [
        { label: 'Visualizar', link: 'partes/list', permission: 'VISUALIZAR_PARTE', },
      ]
    },
    {
      title: 'Usuários',
      icon: 'user-add',
      permission: 'VISUALIZAR_USUARIO',
      children: [
        { label: 'Visualizar', link: 'usuarios/list', permission: 'VISUALIZAR_USUARIO', },
      ]
    },
    {
      title: 'Grupos',
      icon: 'usergroup-add',
      permission: 'VISUALIZAR_GRUPO',
      children: [
        { label: 'Visualizar', link: 'grupos/list', permission: 'VISUALIZAR_GRUPO', },
      ]
    },
    {
      title: 'Comarcas',
      icon: 'bank',
      permission: 'VISUALIZAR_COMARCA',
      children: [
        { label: 'Visualizar', link: 'comarcas/list', permission: 'VISUALIZAR_COMARCA', },
      ]
    },
    {
      title: 'Competências',
      icon: 'tag',
      permission: 'VISUALIZAR_COMPETENCIA',
      children: [
        { label: 'Visualizar', link: 'competencias/list', permission: 'VISUALIZAR_COMPETENCIA', },
      ]
    },
    {
      title: 'Situações',
      icon: 'flag',
      permission: 'VISUALIZAR_SITUACAO',
      children: [
        { label: 'Visualizar', link: 'competencias/list', permission: 'VISUALIZAR_SITUACAO', },
      ]
    },
    {
      title: 'Donos',
      icon: 'trophy',
      permission: 'VISUALIZAR_DONO',
      children: [
        { label: 'Visualizar', link: 'donos/list', permission: 'VISUALIZAR_DONO', },
      ]
    },
    {
      title: 'Sistemas',
      icon: 'desktop',
      permission: 'VISUALIZAR_SISTEMA',
      children: [
        { label: 'Visualizar', link: 'sistemas/list', permission: 'VISUALIZAR_SISTEMA', },
      ]
    },
    {
      title: 'Despesas',
      icon: 'barcode',
      permission: 'VISUALIZAR_DESPESA',
      children: [
        { label: 'Visualizar', link: 'despesas/list', permission: 'VISUALIZAR_DESPESA', },
      ]
    },
    {
      title: 'Ganhos',
      icon: 'dollar',
      permission: 'VISUALIZAR_GANHO',
      children: [
        { label: 'Visualizar', link: 'ganhos/list', permission: 'VISUALIZAR_GANHO', },
      ]
    },
  ]

  goToProfile() {
    this.router.navigateByUrl('/account/update-password');
  }
  
  logout() {
    this.isLoggingOut = true;
    this.authService.logout().subscribe({
      next: () => {
        this.localStorageService.removeUsertorage();
        this.router.navigateByUrl('/login');
        this.isLoggingOut = false;
      }
    })
  }

  get nomeUsuario(){
    const response = this.localStorageService.getUserStorage();
    return response.nome;
  }

  get avatar(){
    const response = this.localStorageService.getUserStorage();
    if(response && response && response.avatar){
      return response.urlFoto;
    }
    return '/images/avatar.webp';
  }
}
