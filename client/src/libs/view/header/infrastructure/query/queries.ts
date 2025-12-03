import { useQuery } from "@tanstack/react-query"
import { getNotifications } from "../notifications-api"

export const useGetNotifications = () => {

    return useQuery({
        queryKey: ['notifications'],
        queryFn: () => getNotifications(),
        // retry: 3,
        // enabled: Boolean(id)
    })
}