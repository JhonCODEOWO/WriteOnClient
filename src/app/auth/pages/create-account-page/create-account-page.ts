import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { InputComponentComponent } from "../../../global/components/input-component/input-component.component";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/AuthService.service';
import { FormHelper } from '../../../global/helpers/form-helpers';
import { fullNameValidator } from '../../../global/validators/fullNamePattern.validator';
import { passwordValidation } from '../../../global/validators/password.validator';
import { CreateUserInterface } from '../../interfaces/create-account-request';
import { switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { uniqueCheck } from '../../../global/validators/unique-check.directive';
import { labelsMatch } from '../../../global/validators/labels-match.directive';

@Component({
  selector: 'app-create-account-page',
  imports: [InputComponentComponent, ReactiveFormsModule],
  templateUrl: './create-account-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateAccountPage {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  formUtils = FormHelper;

  createAccountForm = this.fb.group({
    "name": ['', [Validators.required, fullNameValidator]],
    "email": ['', {updateOn: 'blur', validators: [Validators.required, Validators.email], asyncValidators: [uniqueCheck({table: 'users', column: 'email'})]}],
    "password": ['', [Validators.required, Validators.minLength(8), passwordValidation]],
    "password_confirmation": ['', [Validators.required, Validators.minLength(8), passwordValidation]]
  },
  {
    validators: [labelsMatch({fieldName: 'password'})]
  }
  )

  onSubmitCreateAccount(){
    this.createAccountForm.markAllAsTouched();
    if(this.createAccountForm.invalid) return;
    let data: CreateUserInterface = {...this.createAccountForm.value as any};
    this.authService.create(data).subscribe({
      next: (authenticated) => {
        this.router.navigateByUrl('');
      }
    })
  }
}
