import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { InputComponentComponent } from "../../../global/components/input-component/input-component.component";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/AuthService.service';
import { FormHelper } from '../../../global/helpers/form-helpers';
import { fullNameValidator } from '../../../global/validators/fullNamePattern.validator';
import { passwordValidation } from '../../../global/validators/password.validator';

@Component({
  selector: 'app-create-account-page',
  imports: [InputComponentComponent, ReactiveFormsModule],
  templateUrl: './create-account-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateAccountPage {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  formUtils = FormHelper;

  createAccountForm = this.fb.group({
    "name": ['', [Validators.required, fullNameValidator]],
    "email": ['', [Validators.required, Validators.email]],
    "password": ['', [Validators.required, Validators.minLength(8), passwordValidation]],
    "password_confirmation": ['', [Validators.required, Validators.minLength(8), passwordValidation]]
  })

  onSubmitCreateAccount(){
    console.log(this.createAccountForm.controls.name.errors);
    console.log(this.createAccountForm.value);
    this.createAccountForm.markAllAsTouched();
    if(this.createAccountForm.invalid) return;
    
  }
}
