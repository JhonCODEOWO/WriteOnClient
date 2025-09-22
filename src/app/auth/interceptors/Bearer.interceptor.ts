import type { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/AuthService.service';

export const bearerInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const cloned = req.clone({
    headers: req.headers.append('Authorization', `Bearer ${authService._token() ?? ''}`)
  });
  return next(cloned);
};
