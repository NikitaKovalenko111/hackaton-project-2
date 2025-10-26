import { CompanyData } from "@/modules/company/domain/company.type"
import { Employee } from "@/modules/profile/domain/profile.types"

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