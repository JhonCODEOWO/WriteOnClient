import { Injectable, signal } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { TypeNotification } from '../enums/type-notification.enum';
import { Notification } from '../interfaces/notification.interface';

/**
 *  Args options of add function
 */
interface addOpts {
    title?: string;
    type: TypeNotification,
    message: string;
    timeout?: number;
}

/**
 *  Map to store all title defaults of states
 */
const titleDefaults: Map<TypeNotification, string> = new Map<TypeNotification, string>([
    [TypeNotification.SUCCESS, 'Operación exitosa'],
    [TypeNotification.ERROR, 'Ops! Tenemos un problema'],
]);

@Injectable({providedIn: 'root'})
export class NotificationService {
    notifications = signal<Notification[]>([]);

    /**
     * Stores all timeouts ids to manage it if is necessary
     */
    private timeouts = new Map<string, ReturnType<typeof setTimeout>>();

    /**
     *  Create and add a new notification
     * @param opts Options to apply in the notification
     */
    add(opts: addOpts){
        //Destructure
        let {title, type, message, timeout = 5000} = opts;

        //Initialize title
        title = title ?? this.defineTitle(type);

        const notificationToAdd: Notification = this.generateNotification(title, message, type);
        
        this.notifications.update((actualData) => {
            return [notificationToAdd, ...actualData]
        });

        //Create timeout
        const clearTimeOut = setTimeout(() => {
            console.log('SE EJECUTA EL TIMEOUT');
            this.deleteNotification(notificationToAdd.id);
        }, timeout)

        //Store the timeout to clean it if is necessary
        this.timeouts.set(notificationToAdd.id, clearTimeOut);
    }

    /**
     *  Drop a notification by UUID
     * @param id The uuid of the notification to delete
     */
    deleteNotification(id: string){
        //Update state to specified id
        this.notifications.update(notifications => {
            return notifications.map((notification): Notification => {
                if(notification.id === id){
                    return {...notification, state: 'leave'}
                }
                return notification;
            })
        })
        
        setTimeout(()=> {
            //Get timer
            const timer = this.timeouts.get(id);

            //If timer exists then clear it and delete it from the map
            if(timer) {
                clearTimeout(timer);
                this.timeouts.delete(id);
            }

            this.notifications.update((actualNotifications) => {
                return actualNotifications.filter(notification => notification.id != id);
            })
        }, 250)
    }

    /**
     *  Create and add a generic success notification.
     * @param message The content of notification
     */
    success(message: string){
        this.add({message, type: TypeNotification.SUCCESS});
    }

    /**
     *  Create and add a generic error notification.
     * @param message The content describing the error
     */
    error(message: string){
        this.add({message, type: TypeNotification.ERROR});
    }

    /**
     * Return a Notification literal object
     * @param title The title to apply
     * @param message The message of the notification
     * @param type Type of notification
     * @returns Literal object of Notification interface
     */
    private generateNotification(title: string, message: string, type: TypeNotification = TypeNotification.SUCCESS): Notification{
        //Generate  metadata of the notification
        const uuidToAssign = uuid();
        const dateInstance = new Date();

        const date = dateInstance.toLocaleDateString('es-MX', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        return {id: uuidToAssign, date, title, message, type, state: 'enter'}
    }

    /**
     * Search for a default title by type
     * @param type The type of notification to search for it own default title
     * @returns Default title if exists otherwise a placeholder text
     */
    private defineTitle(type: TypeNotification): string{
        return titleDefaults.get(type) ?? 'No hay un título definido';
    }
}