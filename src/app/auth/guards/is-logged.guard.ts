import { inject } from '@angular/core';
import { Router, type CanMatchFn } from '@angular/router';
import { AuthService } from '../services/AuthService.service';
import { lastValueFrom } from 'rxjs';

export const isLoggedGuard: CanMatchFn = async (route, segments) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const user = await lastValueFrom(authService.getUser());
  if(!user){
    router.navigateByUrl('auth')
    return false;
  }
  
  return true;
};
