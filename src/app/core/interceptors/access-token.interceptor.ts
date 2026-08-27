import { HttpErrorResponse, HttpHandlerFn, HttpRequest, HttpEvent } from "@angular/common/http";
import { inject } from "@angular/core";
import { LocalstorageService } from "../../shared/services/localstorage.service";
import { environment } from "../../../environments/environment";
import { AuthService } from "../../shared/services/auth.service";
import { BehaviorSubject, Observable, catchError, filter, finalize, switchMap, take, throwError } from "rxjs";
import { Usuario } from "../models/usuario.interface";
import { NotificationService } from "../../shared/services/notification.service";

let isRefreshing = false;
let refreshTokenSubject: BehaviorSubject<Usuario | null> = new BehaviorSubject<Usuario | null>(null);

export const AccessTokenInterceptor = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const localStorageService = inject(LocalstorageService);
  const authService = inject(AuthService);
  const notificationService = inject(NotificationService);
  const localUser = localStorageService.getUserStorage();

  const requestToAPI = req.url.startsWith(environment.apiUrlBase);
  const refreshTokenRequest = req.url === `${environment.apiUrlBase}/auth/refresh-token`;

  const authReq = requestToAPI
    ? req.clone({ withCredentials: true })
    : req;

  const handle401 = (error: HttpErrorResponse): Observable<HttpEvent<any>> => {
    if (error.status === 401 && localUser && !refreshTokenRequest) {
      if (!isRefreshing) {
        isRefreshing = true;
        refreshTokenSubject.next(null);

        return authService.refreshToken().pipe(
          switchMap((auth) => {
            localStorageService.setUserStorage(auth);
            refreshTokenSubject.next(auth); // Notifica os outros que o token foi atualizado
            return next(authReq);
          }),
          catchError((refreshErr) => {
            notificationService.stopConnection();
            localStorageService.removeUsertorage();
            window.location.replace('/');
            return throwError(() => refreshErr);
          }),
          finalize(() => {
            isRefreshing = false;
          })
        );
      } else {
        // Aguarda o refresh terminar
        return refreshTokenSubject.pipe(
          filter(token => token !== null),
          take(1),
          switchMap(() => next(authReq))
        );
      }
    }

    return throwError(() => error);
  };

  return next(authReq).pipe(catchError(handle401));
};
