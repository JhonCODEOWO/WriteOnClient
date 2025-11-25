import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NotificationElement } from "../notification-element/notification-element.component";
import { NotificationService } from '../../services/notifications.service';
import { Notification } from '../../interfaces/notification.interface';

@Component({
  selector: 'notification-container',
  imports: [NotificationElement],
  template: `
  <div class="fixed right-0 top-0 gap-y-3 mt-2 mr-3 flex flex-col max-h-[100dvh] z-[99]">
@for (notification of notificationService.notifications(); track notification.id) {
        <notification-element [notification]="notification" (dropIdClicked)="handleDroppedIdClicked($event)"/>
}
</div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContainerComponent {
  notificationService = inject(NotificationService);

  handleDroppedIdClicked(notification: Notification){
    this.notificationService.deleteNotification(notification.id);
  }
}
