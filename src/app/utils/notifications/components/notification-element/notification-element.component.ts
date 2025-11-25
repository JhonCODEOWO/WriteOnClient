import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { Notification } from '../../interfaces/notification.interface';
import { TypeNotification } from '../../enums/type-notification.enum';
import { NgClass } from '@angular/common';

interface NotificationElementClasses {
  mainContent: string,
  textContent: string,
}

@Component({
  selector: 'notification-element',
  imports: [NgClass],
  template: `
    <div [ngClass]="classMap.get(notification().type)?.mainContent" [class.notification-enter]="notification().state === 'enter'" [class.notification-leave]="notification().state === 'leave'" role="alert" tabindex="-1" aria-labelledby="hs-bordered-success-style-label">
          <div class="flex items-center">
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
            <!-- General content container -->
            <div class="ms-3 flex items-center gap-x-4 flex-1 justify-between">
              <!-- TextContent -->
              <div>
                <h3 id="hs-bordered-success-style-label" class="text-gray-800 font-semibold dark:text-white">
                {{this.notification().title ?? 'Sin titulo' }}
                </h3>
                <!-- Text and date content -->
                <div class="flex flex-col gap-y-2" [ngClass]="classMap.get(notification().type)?.textContent">
                  <p class="text-sm break-words">
                    {{this.notification().message}}
                  </p>
                  <p class="text-xs">
                    {{this.notification().date}}
                  </p>
                </div>
              </div>
              
              <button class="cursor-pointer" (click)="drop(notification())">
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

  /** Use it to indicate a click in delete button */
  dropIdClicked = output<Notification>();

  /** Notification input */
  notification = input.required<Notification>();

  /** Map of tailwind classes to use in the template based on the Notification type */
  classMap: Map<TypeNotification, NotificationElementClasses> = new Map<TypeNotification, NotificationElementClasses>([
    [TypeNotification.SUCCESS, {mainContent: 'bg-teal-50 border-t-2 border-teal-500 rounded-lg p-4 dark:bg-teal-800/80', textContent: 'text-teal-300'}],
    [TypeNotification.ERROR, {mainContent: 'bg-red-50 border-s-4 border-red-500 p-4 dark:bg-red-800/80', textContent: 'text-red-300'}]
  ])

  /**
   * Emits the notification to be deleted (Review pending it should use the service delete it and emit the notification deleted)
   * @param notification Notification to emit that should be deleted
   */
  drop(notification: Notification){
    this.dropIdClicked.emit(notification);
  }
}
