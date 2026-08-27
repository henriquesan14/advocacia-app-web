import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocalstorageService } from '../../shared/services/localstorage.service';

export const PlatformAdminGuard: CanActivateFn = () => {
  const localStorageService = inject(LocalstorageService);
  const router = inject(Router);
  const permissions = localStorageService.getUserStorage()?.grupo?.permissoes ?? [];

  return permissions.some(permission => permission.nome === 'VER_AUDITORIA')
    ? true
    : router.createUrlTree(['/processos/list']);
};
