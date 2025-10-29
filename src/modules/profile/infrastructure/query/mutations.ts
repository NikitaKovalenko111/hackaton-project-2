'use client'

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { logout } from "../profile-api"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { useActions } from "@/libs/hooks/useActions"
import { useReduxSocket } from "@/libs/hooks/useReduxSocket"

export const useLogout = () => {
    const queryClient = useQueryClient()

    const {push} = useRouter()

    const {setSocket} = useActions()
    const {socket} = useReduxSocket()

    return useMutation({
        mutationKey: ["logout"],
        mutationFn: () => logout(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["auth"] })
            socket?.disconnect()
            setSocket({socket: null})
            toast.success('Вы вышли из аккаунта!')
            push('/auth')
        },
        onError: (e: any) => {
            toast.error('Возникла ошибка!')
        }
    })
}