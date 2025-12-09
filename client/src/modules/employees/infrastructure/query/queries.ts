import { useQuery } from '@tanstack/react-query'
import { getCompanyEmployee, getCompanyEmployees } from '../employees-api'

export const useGetCompanyEmployees = (
    surname: string = '',
    name: string = ''
) => {
    return useQuery({
        queryKey: ['company-employees', surname, name],
        queryFn: () => getCompanyEmployees(surname, name),
    })
}

export const useGetEmployee = (id: number) => {
    return useQuery({
        queryKey: ['company-employee'],
        queryFn: () => getCompanyEmployee(id),
        // retry: 3,
        // enabled: Boolean(id)
    })
}
