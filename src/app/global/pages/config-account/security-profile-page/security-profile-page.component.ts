import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordValidation } from '../../../validators/password.validator';
import { labelsMatch } from '../../../validators/labels-match.directive';
import { InputComponentComponent } from "../../../components/input-component/input-component.component";
import { FormHelper } from '../../../helpers/form-helpers';
import { AuthService } from '../../../../auth/services/AuthService.service';
import { UpdateUserRequest } from '../../../../auth/interfaces/update-user-request';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { NotificationService } from '../../../../utils/notifications/services/notifications.service';

const errors: Record<string, string> = {
  'PASSWORD_INCORRECT': 'La contraseña ingresada es incorrecta.'
}

@Component({
  selector: 'app-security-profile-page',
  imports: [ReactiveFormsModule, InputComponentComponent],
  templateUrl: './security-profile-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SecurityProfilePageComponent {
  fb = inject(FormBuilder);
  formHelper = FormHelper;
  authService = inject(AuthService);
  router = inject(Router);
  notificationService = inject(NotificationService);
  
  error = signal<string | null>(null);

  changePasswordForm = this.fb.nonNullable.group({
      password: ['', [Validators.required, Validators.minLength(8), passwordValidation]],
      password_confirmation: ['', [Validators.required, Validators.minLength(8), passwordValidation]],
      actual_password: ['', [Validators.required, Validators.minLength(8)]]
    },
    {
      validators: [labelsMatch({fieldName: 'password', label: 'de la contraseña'})]
    }
  );

  onChangePasswordSubmit(){
    const value = this.changePasswordForm.value;
    if(this.changePasswordForm.invalid) return;
    
    const body: UpdateUserRequest = {
      actual_password: value.actual_password,
      password: value.password,
      password_confirmation: value.password_confirmation
    }

    this.authService.update(body).subscribe({
      next: (res) => {
        this.notificationService.success('Contraseña actualizada correctamente, es necesario iniciar sesión nuevamente');
        this.router.navigateByUrl('/auth');
      },
      error: (res: HttpErrorResponse) => {
        this.error.set(errors[res.error.message]);
      }
    });
  }
}
