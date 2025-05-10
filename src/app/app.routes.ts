import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './core/layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './core/layouts/main-layout/main-layout.component';
import { UnauthenticadedGuard } from './core/guards/unauthenticated.guard';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: '', loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES) },
    ],
    canActivate: [UnauthenticadedGuard],
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'processos', pathMatch: 'full' },
      { path: 'dashboard', loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES) },
      { path: 'processos', loadChildren: () => import('./features/processo/processos.routes').then(m => m.PROCESSOS_ROUTES) },
      { path: 'eventos', loadChildren: () => import('./features/evento/evento.routes').then(m => m.EVENTO_ROUTES) },
      { path: 'partes', loadChildren: () => import('./features/parte/parte.routes').then(m => m.PARTE_ROUTES) },
      { path: 'usuarios', loadChildren: () => import('./features/usuarios/usuarios.routes').then(m => m.USUARIOS_ROUTES) },
      { path: 'grupos', loadChildren: () => import('./features/grupo/grupos.routes').then(m => m.GRUPOS_ROUTES) },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: '/login'
  },
];
