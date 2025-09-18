import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-input-component',
  imports: [],
  templateUrl: './input-component.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponentComponent {
  label = input.required<string>();
  inputType = input.required<"email" | "text" | "password">();
}
