import { interviewType } from 'src/types'

export interface addInterviewBodyDto {
  interview_subject: number
  interview_date: Date
  interview_type: interviewType
  interview_desc: string
}

export interface finishInterviewBodyDto {
  interview_id: number
  interview_comment: string
  interview_duration: number
}

export interface cancelInterviewBodyDto {
  interview_id: number
}
