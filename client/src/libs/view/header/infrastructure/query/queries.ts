import { useQuery } from '@tanstack/react-query'
import { applyNotification, getNotifications } from '../notifications-api'

export const useGetNotifications = () => {
    return useQuery({
        queryKey: ['notifications'],
        queryFn: () => getNotifications(),
        enabled: false,
    })
}
