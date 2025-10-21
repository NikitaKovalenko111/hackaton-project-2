import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { CreateCompanyDTO } from "../../domain/company.type"
import { createCompany } from "../company-api"

export const useCreate = () => {
    const queryClient = useQueryClient()

    const {replace} = useRouter()

    return useMutation({
        mutationKey: ["company-list"],
        mutationFn: (data: CreateCompanyDTO) => createCompany(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["company-list"] })
            replace('/main')
        }
    })
}