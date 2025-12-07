import { ROLE } from '@/libs/constants'
import { CompanyData } from '@/modules/company/domain/company.type'
import { Role } from '@/modules/profile/domain/profile.types'

export interface AuthSignupDTO {
    employee_name: string
    employee_surname: string
    employee_email: string
    employee_password: string
}

export interface AuthLoginDTO {
    employee_email: string
    employee_password: string
}

export interface Payload {
    employee_id: number
    employee_name: string
    employee_surname: string
    employee_email: string
    employee_status: string
    employee_photo: string
    company: CompanyData
    role: Role
}

export interface AuthData {
    accessToken: string
    refreshToken: string
    payload: Payload
}

export type AuthMode = 'login' | 'signup'

export interface LoginFormProps {
    handleChangeMode: (value: AuthMode) => void
}
