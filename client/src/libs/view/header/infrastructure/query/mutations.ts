import { useMutation } from "@tanstack/react-query"
import { applyNotification } from "../notifications-api"

export const useApplyNotification = (refetchNotifications: () => void) => {

    return useMutation({
        mutationKey: ['apply-notification'],
        mutationFn: (id: number) => applyNotification(id),
        onSuccess: () => {
            refetchNotifications()
        }
    })
}