import { Skill } from 'src/SkillModule/skill.entity'
import { Role } from './role.entity'
import { Company } from 'src/CompanyModule/company.entity'
import { Team } from 'src/TeamModule/team.entity'
import { Employee } from './employee.entity'

export interface registerEmployeeBodyDto {
  employee_name: string
  employee_surname: string
  employee_email: string
  employee_password: string
}

export interface employeePayloadDto {
  employee_id: number
  employee_name: string
  employee_surname: string
  employee_email: string
  employee_status: string
  employee_photo: string
  employeeSkills?: Skill[]
  employeeRole?: Role
  company?: Company
  team?: Team
  workedWith?: Employee[]
}

export interface authEmployeeBodyDto {
  employee_email: string
  employee_password: string
}

export interface authEmployeeTgBodyDto {
  employee_email: string
  employee_password: string
  tg_id: number
}

export interface registerEmployeeReturnDto {
  accessToken: string
  refreshToken: string
  payload: employeePayloadDto
}
