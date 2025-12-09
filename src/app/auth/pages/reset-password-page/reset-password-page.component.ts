import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InputComponentComponent } from "../../../global/components/input-component/input-component.component";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormHelper } from '../../../global/helpers/form-helpers';
import { uniqueCheck } from '../../../global/validators/unique-check.directive';
import { mustExistValidator } from '../../../global/validators/mustExists.directive';
import { passwordValidation } from '../../../global/validators/password.validator';

@Component({
  selector: 'auth-reset-password',
  imports: [InputComponentComponent, ReactiveFormsModule],
  templateUrl: './reset-password-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordPageComponent {
  activatedRoute = inject(ActivatedRoute);
  emailSent = signal<boolean>(false);

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
    const {email} = this.sendEmailForm.value;
    if(this.sendEmailForm.invalid) return;
    //SEND THE REQUEST TO THE BACKEND
    this.emailSent.update(done => !done);
  }

  onChangePasswordForm(){
    const {newPassword = null} = this.changePasswordForm.value;
    if(this.changePasswordForm.invalid) return;
    //SEND THE UPDATE OF THE USER TO BACKEND
  }
}
