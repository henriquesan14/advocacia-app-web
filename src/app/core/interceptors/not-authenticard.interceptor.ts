import { HttpErrorResponse, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { LocalstorageService } from "../../shared/services/localstorage.service";
import { catchError, throwError } from "rxjs";
import { Router } from "@angular/router";
import { NotificationService } from "../../shared/services/notification.service";

export const NotAuthenticatedInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const localStorageService = inject(LocalstorageService);
    const notificationService= inject(NotificationService);
    const localUser = localStorageService.getAuthStorage();
    const router = inject(Router);
    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401 && localUser) {
            localStorageService.removeAuthStorage();
            notificationService.stopConnection();
            router.navigateByUrl('/');
          }
          return throwError(() => error);
        })
      );
    
}