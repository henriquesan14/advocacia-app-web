import { HttpErrorResponse, HttpHandlerFn, HttpRequest, HttpEvent } from "@angular/common/http";
import { inject } from "@angular/core";
import { LocalstorageService } from "../../shared/services/localstorage.service";
import { environment } from "../../../environments/environment";
import { AuthService } from "../../shared/services/auth.service";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable, catchError, filter, finalize, switchMap, take, throwError } from "rxjs";
import { Usuario } from "../models/usuario.interface";

let isRefreshing = false;
let refreshTokenSubject: BehaviorSubject<Usuario | null> = new BehaviorSubject<Usuario | null>(null);

export const AccessTokenInterceptor = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const localStorageService = inject(LocalstorageService);
  const authService = inject(AuthService);
  const router = inject(Router);
  const localUser = localStorageService.getUserStorage();

  const requestToAPI = req.url.startsWith(environment.apiUrlBase);

  const authReq = requestToAPI
    ? req.clone({ withCredentials: true })
    : req;

  const handle401 = (error: HttpErrorResponse): Observable<HttpEvent<any>> => {
    if (error.status === 401 && localUser) {
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
            localStorageService.removeUsertorage();
            router.navigateByUrl('/');
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