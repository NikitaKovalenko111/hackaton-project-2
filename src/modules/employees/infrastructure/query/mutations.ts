import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AddEmployeeDTO, AddEmployeeToTeam } from "../../domain/employees.type";
import { addEmployeeToCompany, addEmployeeToTeam } from "../employees-api";
import toast from "react-hot-toast";

export const useAddEmployeeToCompany = () => {

    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ["add-employee"],
        mutationFn: (data: AddEmployeeDTO) => addEmployeeToCompany(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["company-employees"] })
            toast.success('Сотрудник добавлен!')
        },
        onError: (e: any) => {
            toast.error('Возникла ошибка!')
        }
    })

}

export const useAddEmployeeToTeam = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ["add-employee-to-team"],
        mutationFn: (data: AddEmployeeToTeam) => addEmployeeToTeam(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["teams", "company-employee", "company-employees"] })
            toast.success('Сотрудник добавлен в команду!')
        },
        onError: (e: any) => {
            toast.error('Возникла ошибка!')
        }
    })
}