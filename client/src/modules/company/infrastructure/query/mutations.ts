import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { CreateCompanyDTO } from '../../domain/company.type'
import { createCompany } from '../company-api'
import toast from 'react-hot-toast'

export const useCreate = () => {
    const queryClient = useQueryClient()

    const { replace } = useRouter()

    return useMutation({
        mutationKey: ['company-list'],
        mutationFn: (data: CreateCompanyDTO) => createCompany(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['company-list'] })
            toast.success('Компания создана!')
            replace('/profile')
        },
        onError: () => {
            toast.error('Возникла ошибка!')
        },
    })
}
