import { CompanyData } from '@/modules/company/domain/company.type'
import { Employee } from '@/modules/profile/domain/profile.types'

export type InterviewStatusType = 'planned' | 'completed' | 'canceled'

export type InterviewType = 'tech' | 'soft' | 'hr' | 'case'

export interface InterviewData {
    interview_id: number
    interview_duration: number
    interview_date: Date
    interview_desc: string
    interview_status: InterviewStatusType
    interview_subject: Employee
    interview_owner: Employee
    company: CompanyData
    interview_comment: string
    interview_type: InterviewType
}

export interface InterviewDTO {
    interview_subject: string
    interview_date: Date
    interview_type: InterviewType | string
    interview_desc: string
}
