import { ROLE } from "@/libs/constants"

export type GreetMode = 'create' | 'info'

export interface CreateCompanyDTO { 
    company_name: string
}

export interface CompanyData {
    company_id: number,
    company_name: string
    company_logo: string
    roles: ROLE[]
}