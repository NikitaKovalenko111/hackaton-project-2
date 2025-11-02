import { CompanyData } from "@/modules/company/domain/company.type"
import { Employee } from "@/modules/profile/domain/profile.types"

export interface Team {
    team_name: string
    team_id: number
    team_desc: string
    teamlead: Employee
    employees: Employee[]
    company: CompanyData
}

export interface AddTeamDTO {
    company_id: number
    team_desc: string
    team_name: string
    teamlead_id: string
}