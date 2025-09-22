import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { InputComponentComponent } from "../../../global/components/input-component/input-component.component";
import { AuthService } from '../../services/AuthService.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  imports: [InputComponentComponent, ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  error = signal<string | null>(null);
  loading = signal<boolean>(false);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  })

  onSubmit(){
    this.loginForm.markAllAsTouched();
    if(this.loginForm.invalid) return;
    this.loading.set(true);
    this.authService.login(this.loginForm.value.email ?? '', this.loginForm.value.password ?? '').subscribe({
      next: (token) => {
        this.loading.set(false);
        this.router.navigateByUrl('/');
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Error al iniciar sesión, contraseña y/o correo electrónico incorrecto(s)');
      }
    });
  }
}
