import http from '@/libs/http/http'
import { Notification, NotificationDTO } from '../domain/notifications.type'

export const getNotifications = async (): Promise<NotificationDTO[]> => {
    const res = await http.get('notification/get/notApplied', {})
    return res.data
}

export const applyNotification = async (id: number): Promise<Notification> => {
    const res = await http.post('notification/apply/one', {
        notification_id: id,
    })
    return res.data
}
