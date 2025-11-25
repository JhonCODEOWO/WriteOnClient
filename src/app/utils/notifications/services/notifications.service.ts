import { Injectable, signal } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { TypeNotification } from '../enums/type-notification.enum';
import { Notification } from '../interfaces/notification.interface';

@Injectable({providedIn: 'root'})
export class NotificationService {
    notifications = signal<Notification[]>([]);

    add(type: TypeNotification, message: string){
        const uuidToAssign = uuid();
        const notificationToAdd: Notification = {id: uuidToAssign, message, type}
        
        this.notifications.update((actualData) => {
            return [notificationToAdd, ...actualData]
        });

        setTimeout(() => {
            this.deleteNotification(uuidToAssign);
        }, 2000)
    }

    deleteNotification(id: string){
        this.notifications.update((actualNotifications) => {
            return actualNotifications.filter(notification => notification.id != id);
        })
    }
}