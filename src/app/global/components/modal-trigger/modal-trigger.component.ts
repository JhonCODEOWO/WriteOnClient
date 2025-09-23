import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-modal-trigger',
  imports: [],
  template: `
    <button
      (click)="onClick()"
      type="button"
      class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
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

  onClick(){
    this.clicked.emit();
  }
}
