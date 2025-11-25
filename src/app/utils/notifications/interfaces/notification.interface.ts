import { TypeNotification } from "../enums/type-notification.enum";

/**
 * Structure of a literal object for notifications
 */
export interface Notification {
    /** The identifier for the notification */
    id: string,
    /** Type of notification, use it to apply or realize operations based on it */
    type: TypeNotification,
    /** Title of the notification */
    title?: string,
    /** Message for the notification */
    message: string,
    /** Date of creation for this notification */
    date?: string,
    /** State of the notification use it to apply css classes to animate it if is necessary */
    state: 'enter' | 'leave',
}