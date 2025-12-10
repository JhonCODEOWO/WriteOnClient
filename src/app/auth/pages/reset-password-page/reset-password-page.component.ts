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
import { ResetPasswordBody } from '../../interfaces/reset-password-body.interface';
import { labelsMatch } from '../../../global/validators/labels-match.directive';

interface QueryParams {
  token: string | null,
  email: string | null,
}

const errorsDictionary: Record<number, string> = {
  0: 'Ha ocurrido un error de red, verifica tu conexión o intenta de nuevo más tarde.',
}

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
  queryParams = toSignal<QueryParams>(
    this.activatedRoute.queryParamMap.pipe(
      map(queries => ({email: queries.get('email') ?? null, token: queries.get('token') ?? null}))
    ),
  );

  hasQueries = effect(() => {
    if(this.queryParams()?.email && this.queryParams()?.token) {
      this.emailSent.update(active => true);
      this.changePasswordForm.patchValue({token: this.queryParams()?.token});
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

  changePasswordForm = this.fb.group(
    {
      token: ['', [Validators.required]],
      newPassword: ['', [Validators.required, passwordValidation]],
      newPassword_confirmation: ['', [Validators.required, passwordValidation]],
    },
    {
      validators: [labelsMatch({fieldName: 'newPassword'})]
    }
  );

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
      error: error => {
        this.notificationService.error(errorsDictionary[error.status]);
      }
    });
  }

  /**
   * Handle the submit action in the form change password
   * @returns 
   */
  onChangePasswordForm(){
    const {newPassword = null, token = null, newPassword_confirmation = null} = this.changePasswordForm.value;
    if(this.changePasswordForm.invalid || !this.queryParams()) return;

    const body: ResetPasswordBody = {
      password: newPassword ?? '',
      token: token ?? '',
      password_confirmation: newPassword_confirmation ?? ''
    };

    this.authService.resetPassword(this.queryParams()?.email ?? '', body).subscribe({
      next: response => {
        this.router.navigateByUrl('/auth');
        this.notificationService.success(`Hemos restablecido correctamente tu contraseña correctamente.`);
      },
      error: error => {
        this.notificationService.error(errorsDictionary[error.status]);
      }
    });
  }

  returnPreviousStep(){
    this.router.navigate([]);
  }
}
