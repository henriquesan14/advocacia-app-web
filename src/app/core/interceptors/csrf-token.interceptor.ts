import { HttpErrorResponse, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CsrfTokenService } from '../../shared/services/csrf-token.service';

const unsafeMethods = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

export const CsrfTokenInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const isApiRequest = req.url.startsWith(environment.apiUrlBase);
  const isUnsafeRequest = unsafeMethods.has(req.method.toUpperCase());
  const isTokenRequest = req.url === `${environment.apiUrlBase}/auth/csrf-token`;

  if (!isApiRequest || !isUnsafeRequest || isTokenRequest) {
    return next(req);
  }

  const csrfTokenService = inject(CsrfTokenService);
  const sendWithToken = (token: string) => next(req.clone({
      withCredentials: true,
      setHeaders: { 'X-CSRF-TOKEN': token }
    }));

  return csrfTokenService.getToken().pipe(
    switchMap(token => sendWithToken(token)),
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 403 || error.error?.message !== 'Token CSRF inválido.') {
        return throwError(() => error);
      }

      csrfTokenService.clear();
      return csrfTokenService.getToken().pipe(
        switchMap(token => sendWithToken(token))
      );
    })
  );
};
