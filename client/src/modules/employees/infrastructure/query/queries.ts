import { useQuery } from "@tanstack/react-query"
import { getCompanyEmployee, getCompanyEmployees } from "../employees-api"

export const useGetCompanyEmployees = () => {

    return useQuery({
        queryKey: ['company-employees'],
        queryFn: () => getCompanyEmployees()
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