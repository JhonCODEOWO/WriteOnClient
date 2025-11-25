import { TypeNotification } from "../enums/type-notification.enum";

export interface Notification {
    id: string,
    type: TypeNotification,
    title?: string,
    message: string,
    date?: string,
}