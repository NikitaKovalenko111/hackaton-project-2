import http from '@/libs/http/http'
import { AddEmployeeDTO, AddEmployeeToTeam } from '../domain/employees.type'
import { Employee } from '@/modules/profile/domain/profile.types'

export const addEmployeeToCompany = async (data: AddEmployeeDTO) => {
    const res = await http.post('company/employee/addByEmail', data)

    return res.data
}

export const getCompanyEmployees = async (
    surname: string,
    name: string
): Promise<Employee[]> => {
    const res = await http.get(
        `company/employees?surname=${surname}&name=${name}`,
        {}
    )

    return res.data
}

export const getCompanyEmployee = async (id: number): Promise<Employee> => {
    const res = await http.get(`employee/profile/${id}`, {})

    return res.data
}

export const addEmployeeToTeam = async (
    data: AddEmployeeToTeam
): Promise<Employee> => {
    const new_data = {
        team_id: Number(data.team_id),
        employee_to_add_id: data.employee_to_add_id,
    }

    const res = await http.post('team/add/employee', new_data)

    return res.data
}

export const deleteEmployee = async (employeeId: number) => {
    const res = await http.remove(`company/employee/remove/${employeeId}`, {})

    return res.data
}
