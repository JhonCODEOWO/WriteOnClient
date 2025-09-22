import { AbstractType, ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormHelper } from '../../helpers/form-helpers';

@Component({
  selector: 'app-input-component',
  imports: [ReactiveFormsModule],
  templateUrl: './input-component.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponentComponent {
  formGroup = input.required<FormGroup>();
  name = input.required<string>();
  label = input.required<string>();
  formHelpers = FormHelper;

  abstractControl = computed(() => {
    return this.formGroup().controls[this.name()]
  });
  inputType = input.required<"email" | "text" | "password">();
}
