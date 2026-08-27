import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { RequestLoadingService } from '../../shared/services/request-loading.service';

export const RequestLoadingInterceptor: HttpInterceptorFn = (req, next) => {
  if (!['POST', 'PUT', 'PATCH'].includes(req.method)) {
    return next(req);
  }

  const loadingService = inject(RequestLoadingService);
  loadingService.startMutation();

  return next(req).pipe(finalize(() => loadingService.finishMutation()));
};
