import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AuthLoginDTO, AuthSignupDTO } from "../../domain/auth.type"
import { login, register } from "../auth-api"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

export const useLogin = () => {
    const queryClient = useQueryClient()

    const {push} = useRouter()

    return useMutation({
        mutationKey: ["auth"],
        mutationFn: (data: AuthLoginDTO) => login(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["auth"] })
            toast.success('Вы вошли!')
            push('/company')
        },
        onError: (e: any) => {
            console.log(e.message)
            debugger
            toast.error('Возникла ошибка!')
        }
    })
}

export const useSignup = () => {
    const queryClient = useQueryClient()

    const {push} = useRouter()

    return useMutation({
        mutationKey: ["auth"],
        mutationFn: (data: AuthSignupDTO) => register(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["auth"] })
            toast.success('Вы зарегистрировались!')
            push('/company')
        },
        onError: () => {
            toast.error('Возникла ошибка!')
        }
    })
}