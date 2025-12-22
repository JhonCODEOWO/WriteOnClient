import { Component, computed, input, OnInit, output } from '@angular/core';
import { TypeButton } from './enums/type-button.enum';
import { StateButton } from './enums/state-button.enum';
import { NgClass } from '../../../../../node_modules/@angular/common/common_module.d-NEF7UaHr';
import { buttonThemes } from './themes/themes';

@Component({
  selector: 'app-button-state',
  template: `
    <button
      [type]="type()"
      (click)="clickedButton()"
      class="relative rounded gap-x-2 p-2 cursor-pointer disabled:cursor-not-allowed"
      [class]="currentTheme().buttonClasses"
      [disabled]="this.state() === states.LOADING"
    >
      <!-- Text always in the element -->
      <span [class.opacity-0]="state() === states.LOADING" class="flex gap-x-3">
        <ng-content />
        {{ text() }}
      </span>

      <!-- Loader takes all the space if is loading -->
      @if (state() === states.LOADING) {
        <div class="absolute inset-0 flex justify-center items-center">
          <span
        class="absolute animate-spin size-4 border-3 border-current border-t-transparent rounded-full"
        [class]="currentTheme().loaderClasses"
        role="status"
        aria-label="loading"
      ></span>
        </div>
      }
    </button>
  `,
  imports: [],
})
export class ButtonStateComponent {
  states = StateButton;
  /**
   * The type of button to render
   */
  type = input.required<TypeButton>();

  /**
   * The text to show inside the button
   */
  text = input<string>('');

  /**
   * The state of the button
   */
  state = input.required<StateButton>();

  theme = input<'success' | 'error' | 'warning'>('success');

  currentTheme = computed(() => {
    return this.themes[this.theme()];
  });

  themes = buttonThemes;

  clicked = output();

  clickedButton() {
    if (this.state() === this.states.LOADING) return;
    this.clicked.emit();
  }
}
