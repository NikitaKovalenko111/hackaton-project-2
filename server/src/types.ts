import { Employee } from "./EmployeeModule/employee.entity"

export type RoleType = 'hr' | 'developer' | 'teamlead' | 'techlead' | 'admin' | 'moderator'
export type requestType = 'upgrade'
export type requestStatus = 'pending' | 'completed' | 'canceled'
export type interviewType = 'tech' | 'soft' | 'hr' | 'case'
export type interviewStatusType = 'planned' | 'completed' | 'canceled'
export type skillLevel = 'junior' | 'junior+' | 'middle' | 'middle+' | 'senior'
export type reviewStatus = 'active' | 'pending'

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
        this.employee_id = entity.employee_id,
        this.employee_name = entity.employee_name,
        this.employee_email = entity.employee_email,
        this.employee_surname = entity.employee_surname,
        this.employee_status = entity.employee_status,
        this.employee_photo = entity.employee_photo,
        this.company = entity.company,
        this.team = entity.team,
        this.role = entity.role,
        this.skills = entity.skills,
        this.plannedInterviews = entity.plannedInterviews,
        this.createdInterviews = entity.createdInterviews,
        this.receivedRequests = entity.receivedRequests,
        this.telegram_id = entity.telegram_id,
        this.sendedRequests = entity.sendedRequests
    }
}