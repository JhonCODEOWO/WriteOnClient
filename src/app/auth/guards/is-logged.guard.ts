import { inject } from '@angular/core';
import { Router, type CanMatchFn } from '@angular/router';

export const isLoggedGuard: CanMatchFn = (route, segments) => {
  const router = inject(Router);
  let isLogged = false;
  if(!isLogged){
    router.navigateByUrl('auth')
    return false;
  }
  
  return true;
};
