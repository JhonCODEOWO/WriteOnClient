import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-modal-trigger',
  imports: [NgClass],
  template: `
    <button
      (click)="onClick()"
      type="button"
      [ngClass]="class()"
      aria-haspopup="dialog"
      aria-expanded="false"
      [attr.aria-controls]="'modal'+modalId()"
      [attr.data-hs-overlay]="'#modal-' + modalId()"
    >
      <ng-content/>
    </button>
  `,
  styleUrl: './modal-trigger.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalTriggerComponent{
  clicked = output();
  modalId = input.required<string>();
  class = input<string>();

  onClick(){
    this.clicked.emit();
  }
}
