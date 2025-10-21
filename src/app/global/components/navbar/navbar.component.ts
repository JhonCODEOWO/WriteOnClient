import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { AuthService } from '../../../auth/services/AuthService.service';
import { Router } from '@angular/router';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
@Component({
  selector: 'app-navbar',
  imports: [ThemeToggleComponent],
  templateUrl: './navbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  authService = inject(AuthService);
  router = inject(Router);
  initials = computed(() => {
    const splitted = this.authService._userAuthenticated()?.name.split(' ');
    if(!splitted) return '';
    return `${splitted[0].charAt(0)}${splitted[1].charAt(0)}`;
  })

  onLogoutClick(){
    this.authService.logout().subscribe({
      next: (success) => {
        this.router.navigateByUrl('auth');
      }
    });
  }
}
