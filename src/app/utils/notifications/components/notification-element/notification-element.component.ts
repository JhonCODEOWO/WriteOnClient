import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Notification } from '../../interfaces/notification.interface';
import { TypeNotification } from '../../enums/type-notification.enum';

@Component({
  selector: 'notification-element',
  imports: [],
  template: `
    <div [classList]="classMap[notification().type]" role="alert" tabindex="-1" aria-labelledby="hs-bordered-success-style-label">
          <div class="flex">
            <div class="shrink-0">
              @switch (notification().type) {
                @case (types.SUCCESS) {
                  <span class="inline-flex justify-center items-center size-8 rounded-full border-4 border-teal-100 bg-teal-200 text-teal-800 dark:border-teal-900 dark:bg-teal-800 dark:text-teal-400">
                  <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                    <path d="m9 12 2 2 4-4"></path>
                  </svg>
                </span>
                }
                @case (types.ERROR) {
                          <span class="inline-flex justify-center items-center size-8 rounded-full border-4 border-red-100 bg-red-200 text-red-800 dark:border-red-500 dark:bg-red-800 dark:text-red-400">
          <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </span>
                }
              }
            </div>
            <div class="ms-3 flex items-center gap-x-4">
              <div>
                <h3 id="hs-bordered-success-style-label" class="text-gray-800 font-semibold dark:text-white">
                {{this.notification().title ?? 'Sin titulo' }}
              </h3>
                <p class="text-sm text-gray-700 dark:text-neutral-400">
                {{this.notification().message}}
              </p>
              </div>
              
              <button (click)="drop(notification())">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#fff" d="m12 13.4l-2.917 2.925q-.277.275-.704.275t-.704-.275q-.275-.275-.275-.7t.275-.7L10.6 12L7.675 9.108Q7.4 8.831 7.4 8.404t.275-.704q.275-.275.7-.275t.7.275L12 10.625L14.892 7.7q.277-.275.704-.275t.704.275q.3.3.3.713t-.3.687L13.375 12l2.925 2.917q.275.277.275.704t-.275.704q-.3.3-.712.3t-.688-.3z"/></svg>
              </button>
            </div>
          </div>
        </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationElement {
  types = TypeNotification;
  dropIdClicked = output<Notification>();
  notification = input.required<Notification>();
  classMap = {
    [TypeNotification.SUCCESS]: 'bg-teal-50 border-t-2 border-teal-500 rounded-lg p-4 dark:bg-teal-800/80',
    [TypeNotification.ERROR]: 'bg-red-50 border-s-4 border-red-500 p-4 dark:bg-red-800/80'
  }

  drop(notification: Notification){
    this.dropIdClicked.emit(notification);
  }
}
