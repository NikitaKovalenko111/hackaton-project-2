import { Employee } from './EmployeeModule/employee.entity'

export enum RoleType {
  HR = 'hr',
  DEVELOPER = 'developer',
  TEAMLEAD = 'teamlead',
  TECHLEAD = 'techlead',
  ADMIN = 'admin',
  MODERATOR = 'moderator'
}
export enum requestType {
  UPGRADE = 'upgrade'
}
export enum requestStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELED = 'canceled'
}
export enum interviewType {
  TECH = 'tech',
  SOFT = 'soft',
  HR = 'hr',
  CASE = 'case'
}
export enum interviewStatusType {
  PLANNED = 'planned',
  COMPLETED = 'completed',
  CANCELED = 'canceled'
}
export enum skillLevel {
  JUNIOR = 'junior',
  JUNIOR_UP = 'junior+',
  MIDDLE = 'middle',
  MIDDLE_UP = 'middle+',
  SENIOR = 'senior'
}
export enum reviewStatus {
  ACTIVE = 'active',
  PENDING = 'pending'
}
export enum clientType {
  WEB = 'web',
  TELEGRAM = 'telegram'
}

export class employeeDto {
  employee_id
  employee_name
  employee_surname
  employee_photo
  employee_status
  employee_email
  company
  team
  role
  skills
  telegram_id
  sendedRequests
  receivedRequests
  createdInterviews
  plannedInterviews

  constructor(entity: Employee) {
    ;((this.employee_id = entity.employee_id),
      (this.employee_name = entity.employee_name),
      (this.employee_email = entity.employee_email),
      (this.employee_surname = entity.employee_surname),
      (this.employee_status = entity.employee_status),
      (this.employee_photo = entity.employee_photo),
      (this.company = entity.company),
      (this.team = entity.team),
      (this.role = entity.role),
      (this.skills = entity.skills),
      (this.plannedInterviews = entity.plannedInterviews),
      (this.createdInterviews = entity.createdInterviews),
      (this.receivedRequests = entity.receivedRequests),
      (this.telegram_id = entity.telegram_id),
      (this.sendedRequests = entity.sendedRequests))
  }
}
