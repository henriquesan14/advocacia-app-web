import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './core/layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './core/layouts/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: '', loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES) },
    ],
    canActivate: [],
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'processos', pathMatch: 'full' },
      { path: 'processos', loadChildren: () => import('./features/processo/processos.routes').then(m => m.PROCESSOS_ROUTES) },
      { path: 'eventos', loadChildren: () => import('./features/evento/evento.routes').then(m => m.EVENTO_ROUTES) },
      { path: 'partes', loadChildren: () => import('./features/parte/parte.routes').then(m => m.PARTE_ROUTES) },
      { path: 'usuarios', loadChildren: () => import('./features/usuarios/usuarios.routes').then(m => m.USUARIOS_ROUTES) },
      { path: 'grupos', loadChildren: () => import('./features/grupo/grupos.routes').then(m => m.GRUPOS_ROUTES) },
    ],
    canActivate: [],
  },
  {
    path: '**',
    redirectTo: '/login'
  },
];
