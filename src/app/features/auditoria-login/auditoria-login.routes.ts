import { Route } from '@angular/router';
import { ListagemAuditoriaLoginComponent } from './listagem-auditoria-login/listagem-auditoria-login.component';
import { PlatformAdminGuard } from '../../core/guards/platform-admin.guard';

export const AUDITORIA_LOGIN_ROUTES: Route[] = [
  { path: '', component: ListagemAuditoriaLoginComponent, canActivate: [PlatformAdminGuard] }
];
