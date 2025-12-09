import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InputComponentComponent } from "../../../global/components/input-component/input-component.component";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormHelper } from '../../../global/helpers/form-helpers';
import { uniqueCheck } from '../../../global/validators/unique-check.directive';
import { mustExistValidator } from '../../../global/validators/mustExists.directive';
import { passwordValidation } from '../../../global/validators/password.validator';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, tap } from 'rxjs';
import { AuthService } from '../../services/AuthService.service';
import { NotificationService } from '../../../utils/notifications/services/notifications.service';
import { TypeNotification } from '../../../utils/notifications/enums/type-notification.enum';

@Component({
  selector: 'auth-reset-password',
  imports: [InputComponentComponent, ReactiveFormsModule],
  templateUrl: './reset-password-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordPageComponent {
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  authService = inject(AuthService);
  notificationService = inject(NotificationService);

  emailSent = signal<boolean>(false);
  queryParams = toSignal<{email: string | null, token: string | null}>(this.activatedRoute.queryParamMap.pipe(
    map(queries => ({email: queries.get('email'), token: queries.get('token')}))
  ));

  hasQueries = effect(() => {
    if(this.queryParams()?.email && this.queryParams()?.token) {
      this.emailSent.update(active => true);
      return;
    }

    this.emailSent.set(false);
  })

  fb = inject(FormBuilder);

  sendEmailForm = this.fb.group({
    email: ['', [Validators.required, Validators.email], [mustExistValidator({table: 'users', column: 'email'})]]
  },
  {
    updateOn: 'blur'
  }
  )

  changePasswordForm = this.fb.group({
    token: ['', [Validators.required]],
    newPassword: ['', [Validators.required, passwordValidation]]
  })

  onSendEmailFormSubmit(){
    const {email = ''} = this.sendEmailForm.value;
    if(this.sendEmailForm.invalid) return;
    this.authService.sendRecoverEmail(email ?? '').subscribe({
      next: response => {
        this.sendEmailForm.get('email')?.reset();
        this.notificationService.add({
          message: 'Se ha enviado un correo de restablecimiento.',
          type: TypeNotification.SUCCESS,
          title: 'Correo enviado correctamente'
        });
      },
      error: response => {

      }
    });
  }

  onChangePasswordForm(){
    const {newPassword = null} = this.changePasswordForm.value;
    if(this.changePasswordForm.invalid) return;
    //SEND THE UPDATE OF THE USER TO BACKEND
  }

  returnPreviousStep(){
    this.router.navigate([]);
  }
}
