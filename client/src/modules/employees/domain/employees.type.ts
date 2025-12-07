import { ROLE } from '@/libs/constants'
import { Team } from '@/modules/teams/domain/teams.type'

export interface AddEmployeeDTO {
    company_id: number
    employee_to_add_email: string
    employee_role: ROLE
}

export interface EmployeeTable {
    employee_id: number
    employee_name: string
    employee_surname: string
    role: ROLE
    team: Team
}

export interface AddEmployeeToTeam {
    team_id: string
    employee_to_add_id: number
}
