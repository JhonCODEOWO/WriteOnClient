import { AbstractType, ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormHelper } from '../../helpers/form-helpers';

@Component({
  selector: 'app-input-component',
  imports: [ReactiveFormsModule],
  templateUrl: './input-component.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponentComponent {
  /**
   * Form group to bind the input
   */
  formGroup = input.required<FormGroup>();

  /**
   * Name of the input from a FormControl to use in the component
   */
  name = input.required<string>();

  /**
   * Label to show in the input
   */
  label = input.required<string>();

  /**
   * Utility of form helpers static instance.
   */
  formHelpers = FormHelper;

  /**
   * Type of style for the input
   * @default 'floating-label'
   */
  styleType = input<'floating-label' | 'underline'>('floating-label');
  
  optionalClasses = input<string>('');
  
  /**
   * Array of typed errors to show in a input from form group
   * @default null
   */
  formErrorsToShow = input<string[] | null>(null);

  
  /**
   * A computed reference to the AbstractControl within the form group.
   */
  abstractControl = computed(() => {
    return this.formGroup().controls[this.name()]
  });

  /**
   * The HTML input type for the component.
   */
  inputType = input.required<"email" | "text" | "password">();
}
