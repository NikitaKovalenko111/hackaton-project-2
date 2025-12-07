import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { Interview } from './interview.entity'
import { interviewStatusType, interviewType, RoleType } from 'src/types'
import { EmployeeService } from 'src/EmployeeModule/employee.service'
import { Employee } from 'src/EmployeeModule/employee.entity'
import ApiError from 'src/apiError'
import { Role } from 'src/EmployeeModule/role.entity'

@Injectable()
export class InterviewService {
  constructor(
    @InjectRepository(Interview)
    private interviewRepository: Repository<Interview>,

    @InjectRepository(Role)
    private roleRepository: Repository<Role>,

    private employeeService: EmployeeService,
  ) {}

  async getFinishedInterviews(employeeId: number): Promise<Interview[]> {
    try {
      const interviews = await this.interviewRepository.find({
        where: {
          interview_subject: {
            employee_id: employeeId,
          },
          interview_status: interviewStatusType.COMPLETED,
        },
        relations: {
          interview_subject: true,
        },
      })

      return interviews
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }

  async getInterviewById(id: number): Promise<Interview> {
    try {
      const interview = await this.interviewRepository.findOne({
        where: {
          interview_id: id,
        },
        relations: {
          interview_owner: true,
        },
      })

      if (!interview) {
        throw new ApiError(HttpStatus.NOT_FOUND, 'Собеседование не найдено!')
      }

      return interview
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }

  async addInterview(
    interviewSubject: Employee,
    interviewDate: Date,
    interviewType: interviewType,
    interviewDesc: string,
    employeeId: number,
  ): Promise<Interview> {
    try {
      const employee = await this.employeeService.getEmployee(employeeId)

      if (employee.company == null) {
        throw new HttpException(
          'Сотрудник не в компании!',
          HttpStatus.NOT_ACCEPTABLE,
        )
      }

      const interview = new Interview({
        interview_date: interviewDate,
        interview_type: interviewType,
        interview_subject: interviewSubject,
        interview_owner: employee,
        company: employee.company,
        interview_desc: interviewDesc,
      })

      const interviewData = await this.interviewRepository.save(interview)

      return interviewData
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }

  async finishInterview(
    interviewId: number,
    interviewDuration: number,
    interviewComment: string,
  ): Promise<Interview> {
    try {
      const interview = await this.interviewRepository.findOne({
        where: {
          interview_id: interviewId,
        },
      })

      if (!interview) {
        throw new ApiError(HttpStatus.NOT_FOUND, 'Интервью не найдено!')
      }

      interview.interview_status = interviewStatusType.COMPLETED
      interview.interview_duration = interviewDuration
      interview.interview_comment = interviewComment

      const interviewData = await this.interviewRepository.save(interview)

      return interviewData
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }

  async getPlannedInterviews(employeeId: number): Promise<Interview[]> {
    const role = await this.roleRepository.find({
      where: {
        employee: {
          employee_id: employeeId,
        },
        role_name: In([RoleType.HR, RoleType.TEAMLEAD, RoleType.ADMIN]),
      },
    })

    if (role.length != 0) {
      const interviews = await this.interviewRepository.find({
        where: {
          interview_owner: {
            employee_id: employeeId,
          },
        },
        relations: {
          interview_subject: true,
          interview_owner: true,
        },
      })

      return interviews
    } else {
      const interviews = await this.interviewRepository.find({
        where: {
          interview_subject: {
            employee_id: employeeId,
          },
        },
        relations: {
          interview_owner: true,
          interview_subject: true,
        },
      })

      return interviews
    }
  }

  async cancelInterview(interviewId: number): Promise<Interview> {
    try {
      const interview = await this.interviewRepository.findOne({
        where: {
          interview_id: interviewId,
        },
      })

      if (!interview) {
        throw new ApiError(HttpStatus.NOT_FOUND, 'Интервью не найдено!')
      }

      interview.interview_status = interviewStatusType.CANCELED

      const interviewData = await this.interviewRepository.save(interview)

      return interviewData
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }

  async getInterviews(companyId: number): Promise<Interview[]> {
    try {
      const interviews = await this.interviewRepository.find({
        where: {
          company: {
            company_id: companyId,
          },
        },
      })

      if (!interviews) {
        throw new ApiError(HttpStatus.NOT_FOUND, 'Интервью не найдено!')
      }

      return interviews
    } catch (error) {
      throw new ApiError(
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
        error.message ? error.message : error,
      )
    }
  }
}
