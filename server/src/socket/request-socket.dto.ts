import { requestType } from 'src/types'

export interface requestDto {
  requestType: requestType
  skill_id: number
  employeeId: number
}

export interface cancelRequestDto {
  request_id: number
  employee_id: number
}

export interface completeRequestDto {
  request_id: number
}
