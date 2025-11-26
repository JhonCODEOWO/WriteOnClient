import { inject } from '@angular/core';
import { Router, type CanMatchFn } from '@angular/router';
import { AuthService } from '../services/AuthService.service';
import { lastValueFrom } from 'rxjs';
import { NotificationService } from '../../utils/notifications/services/notifications.service';
import { TypeNotification } from '../../utils/notifications/enums/type-notification.enum';

export const isLoggedGuard: CanMatchFn = async (route, segments) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const notificationService = inject(NotificationService);
  const user = await lastValueFrom(authService.getUser());
  if(!user){
    notificationService.add({
      title: 'Error de sesión',
      message: `La sesión ha caducado o tu perfil no está activado, intenta iniciar sesión nuevamente`,
      type: TypeNotification.ERROR,
      timeout: 5000,
    });
    router.navigateByUrl('auth')
    return false;
  }
  
  return true;
};
