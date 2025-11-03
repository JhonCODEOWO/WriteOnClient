import { AfterViewInit, ChangeDetectionStrategy, Component, effect, ElementRef, EventEmitter, input, output, signal, viewChild, ViewChild } from '@angular/core';
import { HSOverlay } from 'preline/dist';

@Component({
  selector: 'app-modal',
  imports: [],
  template: `
    <div [id]="'modal-'+id()" class="hs-overlay  hidden size-full fixed top-0 start-0 z-80 overflow-x-hidden overflow-y-auto pointer-events-none " role="dialog" tabindex="-1" aria-labelledby="hs-custom-backdrop-label" #modalParent>
  <div class="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto">
    <div class="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl pointer-events-auto dark:bg-neutral-800 dark:border-neutral-700 dark:shadow-neutral-700/70">
      <div class="flex justify-between items-center py-3 px-4 border-b border-gray-200 dark:border-neutral-700">
        <h3 id="hs-custom-backdrop-label" class="font-bold text-gray-800 dark:text-white">
          {{title()}}
        </h3>
        <button type="button" class="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-400 dark:focus:bg-neutral-600" aria-label="Close" [attr.data-hs-overlay]="'#modal-' + id()">
          <span class="sr-only">Close</span>
          <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </button>
      </div>
      <div class="p-4 overflow-y-auto">
        <p class="mt-1 text-gray-800 dark:text-neutral-400">
          <ng-content/>
        </p>
      </div>
      <!-- <div class="flex justify-end items-center gap-x-2 py-3 px-4 border-t border-gray-200 dark:border-neutral-700">
        <button (click)="onCancel()" type="button" class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" [attr.data-hs-overlay]="'#modal-' + id()">
          Close
        </button>
        <button type="button" class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none" (click)="onSaveChanges()">
          Save changes
        </button>
      </div> -->
    </div>
  </div>
</div>
  `,
  styleUrl: './Modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent implements AfterViewInit{
  modalParent = viewChild<ElementRef>('modalParent');

  id = input.required<string>();
  title = input.required<string>();
  saveChanges = output();
  cancel = output();

  ngAfterViewInit(): void {
      setTimeout(() => {
        window.HSStaticMethods.autoInit();
      }, 100);
  }

  onSaveChanges(){
    this.saveChanges.emit();
  }

  onCancel(){
    this.cancel.emit();
  }

  closeModal(){
    if(!this.modalParent()) return;
    HSOverlay.close(this.modalParent()?.nativeElement);
  }
}
