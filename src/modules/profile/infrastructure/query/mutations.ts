'use client'

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { logout } from "../profile-api"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

export const useLogout = () => {
    const queryClient = useQueryClient()

    const {push} = useRouter()

    return useMutation({
        mutationKey: ["logout"],
        mutationFn: () => logout(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["auth"] })
            toast.success('Вы вышли из аккаунта!')
            push('/auth')
        },
        onError: (e: any) => {
            toast.error('Возникла ошибка!')
        }
    })
}