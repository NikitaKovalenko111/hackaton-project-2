import { RoleType, skillLevel } from 'src/types'

export interface createCompanyBodyDto {
  company_name: string
}

export interface createSkillBodyDto {
  skill_name: string
  skill_desc: string
  company_id: number
}

export interface addEmployeeBodyDto {
  company_id: number
  employee_to_add_id: number
  employee_role: RoleType
}

export interface giveSkillBodyDto {
  skill_shape_id: number
  company_id: number
  employee_to_give_id: number
  skill_level: skillLevel
}

export interface giveSkillToManyBodyDto {
  skill_shape_id: number
  company_id: number
  employees_to_give_id: number[]
  skill_level: skillLevel
}

export interface giveRoleBodyDto {
  company_id: number
  employee_to_give_id: number
  role_name: RoleType
}

export interface addEmployeeByEmailBodyDto {
  company_id: number
  employee_to_add_email: string
  employee_role: RoleType
}
