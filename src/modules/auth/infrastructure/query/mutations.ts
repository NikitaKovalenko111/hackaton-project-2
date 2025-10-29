import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AuthLoginDTO, AuthSignupDTO } from "../../domain/auth.type"
import { login, register } from "../auth-api"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { useAuth } from "@/libs/providers/ability-provider"
import { saveCompanyStorage } from "@/modules/company/infrastructure/company-storage"

export const useLogin = () => {
    const queryClient = useQueryClient()

    const {push} = useRouter()

    const {companyId} = useAuth()

    return useMutation({
        mutationKey: ["auth"],
        mutationFn: (data: AuthLoginDTO) => login(data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["auth"] })
            toast.success('Вы вошли!')
            if (data.payload.company.company_id) {
                saveCompanyStorage(data.payload.company.company_id)
                push('/profile')
            }
            else push('/company')
        },
        onError: (e: any) => {
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