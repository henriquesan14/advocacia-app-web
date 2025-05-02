import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { LocalstorageService } from '../../shared/services/localstorage.service';

export const UnauthenticadedGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
    const storageService = inject(LocalstorageService);
    const router = inject(Router);
    if (storageService.getAuthStorage()) {
        router.navigateByUrl('/matchmaking/generate');
        return false;
    }
    return true;
}