import { NotificationType } from "@/libs/constants";
import { Employee } from "@/modules/profile/domain/profile.types";

export interface Notification {
    notification_id: number;
    notification_type: NotificationType
    receiver: Employee
    object_id: number
    created_at: Date
    notification_status: "applied" | "not_applied"
}

export interface NotificationDTO {
    notification: Notification
    object: any
}