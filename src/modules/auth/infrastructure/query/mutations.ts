import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AuthLoginDTO, AuthSignupDTO } from "../../domain/auth.type"
import { login, register } from "../auth-api"
import { useRouter } from "next/navigation"

export const useLogin = () => {
    const queryClient = useQueryClient()

    const {push} = useRouter()

    return useMutation({
        mutationKey: ["auth"],
        mutationFn: (data: AuthLoginDTO) => login(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["auth"] })
            push('/company')
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
            push('/company')
        }
    })
}