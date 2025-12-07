import { CompanyData } from '@/modules/company/domain/company.type'
import { Employee, Role } from '@/modules/profile/domain/profile.types'

export type SkillLevel = 'junior' | 'junior+' | 'middle' | 'middle+' | 'senior'

export interface Skill {
    skill_connection_id: number
    skill_shape: SkillShape
    skill_level: SkillLevel
    employee: Employee
}

export interface SkillShape {
    skill_shape_id: number
    company: CompanyData
    skills: Skill[]
    skill_name: string
    skill_desc: string
}

export interface CreateSkillDTO {
    skill_name: string
    skill_desc: string
    company_id: number
}

export interface SkillTable {
    skill_shape_id: number
    skill_name: string
    skill_count: number
    skill_desc: string
}

export interface EmployeeTable {
    employee_name: string
    employee_surname: string
    employee_id: number
    skills: Skill[]
    role: Role
}

export interface GiveSkillDTO {
    skill_shape_id: number
    company_id: number
    employee_to_give_id: number
    skill_level: SkillLevel
}

export interface Orders {
    order_text: string
}

export interface SkillOrderDTO {
    skill_shape_id: number
    skill_level: SkillLevel
    orders: Orders[]
}

export interface SkillOrderGet {
    skill_order_id: number
    skill_shape: SkillShape
    skill_level: SkillLevel
    order_text: string
}
