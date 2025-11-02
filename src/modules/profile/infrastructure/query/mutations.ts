'use client'

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { logout, requestAiPlan } from "../profile-api"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { useActions } from "@/libs/hooks/useActions"
import { useReduxSocket } from "@/libs/hooks/useReduxSocket"
import { AiPlanData, AiPlanDTO } from "../../domain/profile.types"

export const useLogout = () => {
    const queryClient = useQueryClient()

    const {push} = useRouter()

    const {setSocket} = useActions()
    const {socket} = useReduxSocket()

    return useMutation({
        mutationKey: ["logout"],
        mutationFn: () => logout(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile'] })
            socket?.disconnect()
            setSocket({socket: null})
            toast.success('Вы вышли из аккаунта!')
            push('/auth')
        },
        onError: (e: any) => {
            debugger
            toast.error('Возникла ошибка!')
        }
    })
}

export const useRequestAiPlan = ({saveToState}: {saveToState: (data: AiPlanData) => void}) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ["ai-plan-req"],
        mutationFn: (data: AiPlanDTO) => requestAiPlan(data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [] })
            toast.success('Ваш план готов!')
            saveToState(data)
        },
        onError: (e: any) => {
            toast.error('Возникла ошибка!')
        }
    })
}