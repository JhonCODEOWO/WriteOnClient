import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-check',
  imports: [ReactiveFormsModule],
  template: `
    <div class="flex mt-4" [formGroup]="formGroup()">
        <input type="checkbox"
            class="shrink-0 mt-0.5 border-gray-200 rounded-sm text-blue-600 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
            [id]="name()" [formControlName]="name()">
        <label for="hs-checked-checkbox" class="text-sm text-gray-500 ms-3 dark:text-neutral-400">{{label()}}</label>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckComponent {
  formGroup = input.required<FormGroup>();
  name = input.required<string>();
  label = input.required<string>();
}
